import { GoogleGenAI } from '@google/genai';
import type { AIProvider, ChatTurn } from './types';

/** Browser-only provider. The user key is passed directly to Google; no Aplx server exists in this request path. */
export class GeminiProvider implements AIProvider {
  constructor(private key: string, private model = 'gemini-3.5-flash') {}
  async testConnection() {
    const ai = new GoogleGenAI({ apiKey: this.key });
    await ai.models.generateContent({ model: this.model, contents: 'Reply with: connected' });
  }
  async stream(prompt: string, history: ChatTurn[], onChunk: (text: string) => void) {
    const ai = new GoogleGenAI({ apiKey: this.key });
    const contents = [
      ...history.map(t => ({ role: t.role, parts: [{ text: t.content }] })),
      { role: 'user' as const, parts: [{ text: prompt }] },
    ];
    const stream = await ai.models.generateContentStream({ model: this.model, contents });
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) onChunk(text);
    }
  }
}
