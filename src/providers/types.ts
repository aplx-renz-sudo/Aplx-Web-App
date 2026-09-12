export type ChatTurn = { role: 'user' | 'model'; content: string };
export interface AIProvider { stream(prompt: string, history: ChatTurn[], onChunk: (text: string) => void): Promise<void>; testConnection(): Promise<void>; }
