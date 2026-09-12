import { AnthropicProvider } from './anthropic';
import { GeminiProvider } from './gemini';
import { OllamaProvider } from './ollama';
import { OpenAICompatibleProvider } from './openai-compatible';
import { OfflineNanoProvider } from './offline-nano';
import type { ProviderId } from './registry';
import type { AIProvider } from './types';

export type ProviderSetup = {
  provider: ProviderId;
  apiKey: string;
  model: string;
  baseUrl?: string;
};

export function createProvider(setup: ProviderSetup): AIProvider {
  const { provider, apiKey, model, baseUrl } = setup;
  switch (provider) {
    case 'offline':
      return new OfflineNanoProvider(model);
    case 'gemini':
      return new GeminiProvider(apiKey, model);
    case 'openai':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.openai.com/v1',
      });
    case 'claude':
      return new AnthropicProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.anthropic.com/v1',
      });
    case 'grok':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.x.ai/v1',
      });
    case 'mistral':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.mistral.ai/v1',
      });
    case 'kimi':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.moonshot.cn/v1',
      });
    case 'minimax':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.minimax.chat/v1',
      });
    case 'groq':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://api.groq.com/openai/v1',
      });
    case 'openrouter':
      return new OpenAICompatibleProvider({
        apiKey,
        model,
        baseUrl: baseUrl || 'https://openrouter.ai/api/v1',
        extraHeaders: {
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://aplx.web',
          'X-Title': 'Aplx Web',
        },
      });
    case 'ollama':
      return new OllamaProvider(baseUrl || 'http://localhost:11434', model);
    default:
      return new GeminiProvider(apiKey, model);
  }
}

export function isProviderReady(setup: ProviderSetup): boolean {
  if (setup.provider === 'offline') return true;
  if (setup.provider === 'ollama') return !!setup.baseUrl?.trim();
  return !!setup.apiKey.trim();
}
