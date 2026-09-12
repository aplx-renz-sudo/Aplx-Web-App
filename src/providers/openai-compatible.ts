import type { AIProvider, ChatTurn } from './types';

type OpenAICompatOptions = {
  apiKey: string;
  model: string;
  baseUrl: string;
  extraHeaders?: Record<string, string>;
};

function toMessages(history: ChatTurn[], prompt: string) {
  return [
    ...history.map(t => ({ role: t.role === 'model' ? 'assistant' as const : 'user' as const, content: t.content })),
    { role: 'user' as const, content: prompt },
  ];
}

async function readSSE(res: Response, onChunk: (text: string) => void) {
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(err || `Request failed (${res.status})`);
  }
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const text = json.choices?.[0]?.delta?.content;
        if (text) onChunk(text);
      } catch { /* skip malformed chunks */ }
    }
  }
}

export class OpenAICompatibleProvider implements AIProvider {
  constructor(private opts: OpenAICompatOptions) {}

  private url(path: string) {
    return `${this.opts.baseUrl.replace(/\/$/, '')}${path}`;
  }

  async testConnection() {
    const res = await fetch(this.url('/chat/completions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.opts.apiKey ? { Authorization: `Bearer ${this.opts.apiKey}` } : {}),
        ...this.opts.extraHeaders,
      },
      body: JSON.stringify({
        model: this.opts.model,
        messages: [{ role: 'user', content: 'Reply with: connected' }],
        max_tokens: 16,
        stream: false,
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(err || `Request failed (${res.status})`);
    }
  }

  async stream(prompt: string, history: ChatTurn[], onChunk: (text: string) => void) {
    const res = await fetch(this.url('/chat/completions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.opts.apiKey ? { Authorization: `Bearer ${this.opts.apiKey}` } : {}),
        ...this.opts.extraHeaders,
      },
      body: JSON.stringify({
        model: this.opts.model,
        messages: toMessages(history, prompt),
        stream: true,
      }),
    });
    await readSSE(res, onChunk);
  }
}
