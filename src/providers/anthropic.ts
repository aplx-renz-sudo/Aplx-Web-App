import type { AIProvider, ChatTurn } from './types';

type AnthropicOptions = {
  apiKey: string;
  model: string;
  baseUrl?: string;
};

export class AnthropicProvider implements AIProvider {
  private baseUrl: string;

  constructor(private opts: AnthropicOptions) {
    this.baseUrl = (opts.baseUrl || 'https://api.anthropic.com/v1').replace(/\/$/, '');
  }

  async testConnection() {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.opts.apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: this.opts.model,
        messages: [{ role: 'user', content: 'Reply with: connected' }],
        max_tokens: 16,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(err || `Anthropic request failed (${res.status})`);
    }
  }

  async stream(prompt: string, history: ChatTurn[], onChunk: (text: string) => void) {
    const messages = [
      ...history.map(t => ({
        role: t.role === 'model' ? ('assistant' as const) : ('user' as const),
        content: t.content,
      })),
      { role: 'user' as const, content: prompt },
    ];

    const res = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.opts.apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: this.opts.model,
        messages,
        max_tokens: 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(err || `Anthropic streaming failed (${res.status})`);
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
        if (!data || data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
            onChunk(json.delta.text);
          }
        } catch {
          // ignore malformed lines
        }
      }
    }
  }
}
