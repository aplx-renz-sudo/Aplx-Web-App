import type { AIProvider, ChatTurn } from './types';

export class OllamaProvider implements AIProvider {
  constructor(private baseUrl: string, private model: string) {}

  private url(path: string) {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }

  async testConnection() {
    const res = await fetch(this.url('/api/tags'));
    if (!res.ok) throw new Error(`Ollama unreachable (${res.status})`);
  }

  async stream(prompt: string, history: ChatTurn[], onChunk: (text: string) => void) {
    const messages = [
      ...history.map(t => ({ role: t.role === 'model' ? 'assistant' as const : 'user' as const, content: t.content })),
      { role: 'user' as const, content: prompt },
    ];
    const res = await fetch(this.url('/api/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.model, messages, stream: true }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(err || `Ollama request failed (${res.status})`);
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
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          const text = json.message?.content;
          if (text) onChunk(text);
        } catch { /* skip */ }
      }
    }
  }
}
