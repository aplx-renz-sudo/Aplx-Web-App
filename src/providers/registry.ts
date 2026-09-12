export type ProviderId =
  | 'offline'
  | 'gemini'
  | 'openai'
  | 'claude'
  | 'grok'
  | 'mistral'
  | 'kimi'
  | 'minimax'
  | 'groq'
  | 'openrouter'
  | 'ollama';

export type ProviderModel = { id: string; label: string; desc?: string };

export type ProviderDef = {
  id: ProviderId;
  name: string;
  logo: string;
  description: string;
  keyLabel: string;
  keyPlaceholder: string;
  requiresKey: boolean;
  route: string;
  models: ProviderModel[];
  defaultModel: string;
  baseUrl?: string;
  baseUrlLabel?: string;
  instructions: string;
};

export const PROVIDERS: Record<ProviderId, ProviderDef> = {
  offline: {
    id: 'offline',
    name: 'Aplx Offline Nano (1M Thinking)',
    logo: '⚡',
    description: '100% in-browser 1M offline model with reasoning deliberation',
    keyLabel: 'API key (None needed)',
    keyPlaceholder: 'No API key needed (Runs in browser)',
    requiresKey: false,
    route: 'In-Browser (100% Offline · Zero Latency)',
    models: [
      { id: 'aplx-nano-1m-thinking', label: 'Aplx Nano 1M (Thinking & Offline)' },
      { id: 'aplx-nano-1m-fast', label: 'Aplx Nano 1M Fast (Instant Response)' },
    ],
    defaultModel: 'aplx-nano-1m-thinking',
    instructions:
      'Runs locally inside your browser with 0 API keys and zero internet requirement. Simulates step-by-step reasoning deliberations.',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    logo: '✦',
    description: 'Direct browser connection to Google Gemini',
    keyLabel: 'Gemini API key',
    keyPlaceholder: 'AIzaSy…',
    requiresKey: true,
    route: 'Browser → Google Gemini',
    models: [
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Fast & Next-Gen)' },
      { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (Balanced)' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Deep Reasoning)' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
    defaultModel: 'gemini-3.5-flash',
    instructions:
      'Get a key from Google AI Studio. Aplx sends requests directly from your browser — your key never touches an Aplx server.',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI & CodeX',
    logo: '✳',
    description: 'GPT-4o, o1, o3-mini & CodeX via OpenAI',
    keyLabel: 'OpenAI API key',
    keyPlaceholder: 'sk-proj-…',
    requiresKey: true,
    route: 'Browser → OpenAI',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (Omni Flagship)' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (Fast)' },
      { id: 'gpt-4.5-preview', label: 'GPT-4.5 Preview' },
      { id: 'o1', label: 'OpenAI o1 (Deep Reasoning)' },
      { id: 'o3-mini', label: 'OpenAI o3-mini (High-Speed Reasoning)' },
      { id: 'codex-5.6', label: 'CodeX (GPT-5.6 Architecture)' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    ],
    defaultModel: 'gpt-4o-mini',
    instructions:
      'Use an API key from platform.openai.com. Direct client-side calls to OpenAI chat completions endpoint.',
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    logo: '◈',
    description: 'Claude 3.7 Sonnet, 3.5 Sonnet & Opus',
    keyLabel: 'Anthropic API key',
    keyPlaceholder: 'sk-ant-api…',
    requiresKey: true,
    route: 'Browser → Anthropic',
    models: [
      { id: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Hybrid Reasoning)' },
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Coding & Nuance)' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Ultra-Fast)' },
      { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus (High Intelligence)' },
    ],
    defaultModel: 'claude-3-7-sonnet-20250219',
    instructions:
      'Use an API key from console.anthropic.com. Aplx communicates directly with the Anthropic Messages API.',
  },
  grok: {
    id: 'grok',
    name: 'xAI Grok',
    logo: '✕',
    description: 'Grok 2 & Grok Beta inference via xAI',
    keyLabel: 'xAI Grok API key',
    keyPlaceholder: 'xai-…',
    requiresKey: true,
    route: 'Browser → xAI',
    models: [
      { id: 'grok-2-latest', label: 'Grok 2 (Latest)' },
      { id: 'grok-2-vision-1212', label: 'Grok 2 Vision' },
      { id: 'grok-beta', label: 'Grok Beta' },
    ],
    defaultModel: 'grok-2-latest',
    instructions:
      'Get a key from console.x.ai. Aplx sends requests straight to xAI with no intermediaries.',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI / Le Chat',
    logo: '▲',
    description: 'Mistral Large, Codestral & Pixtral',
    keyLabel: 'Mistral API key',
    keyPlaceholder: 'mistral_…',
    requiresKey: true,
    route: 'Browser → Mistral AI',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large 2 (Flagship)' },
      { id: 'mistral-small-latest', label: 'Mistral Small 3' },
      { id: 'codestral-latest', label: 'Codestral (Code Specialist)' },
      { id: 'pixtral-large-latest', label: 'Pixtral Large' },
    ],
    defaultModel: 'mistral-large-latest',
    instructions:
      'Use a key from console.mistral.ai. Aplx connects directly to the Mistral API.',
  },
  kimi: {
    id: 'kimi',
    name: 'Moonshot AI (Kimi)',
    logo: '🌙',
    description: 'Kimi K3 & long-context Moonshot models',
    keyLabel: 'Moonshot API key',
    keyPlaceholder: 'sk-…',
    requiresKey: true,
    route: 'Browser → Moonshot AI',
    models: [
      { id: 'kimi-k3-preview', label: 'Kimi K3 (Next-Gen Long Context)' },
      { id: 'moonshot-v1-128k', label: 'Moonshot v1 128k' },
      { id: 'moonshot-v1-32k', label: 'Moonshot v1 32k' },
    ],
    defaultModel: 'kimi-k3-preview',
    instructions:
      'Get an API key from platform.moonshot.cn. Direct browser connection to Moonshot AI.',
  },
  minimax: {
    id: 'minimax',
    name: 'MiniMax',
    logo: '⚑',
    description: 'MiniMax M3 & Abab conversational models',
    keyLabel: 'MiniMax API key',
    keyPlaceholder: 'ey…',
    requiresKey: true,
    route: 'Browser → MiniMax',
    models: [
      { id: 'minimax-m3', label: 'MiniMax M3 (Long-Context & Code)' },
      { id: 'abab6.5s-chat', label: 'MiniMax Abab 6.5s' },
    ],
    defaultModel: 'minimax-m3',
    instructions:
      'Use an API key from api.minimax.chat. Direct browser-to-provider streaming.',
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    logo: '⚡',
    description: 'Ultra-fast LPU inference (Llama, DeepSeek, Gemma)',
    keyLabel: 'Groq API key',
    keyPlaceholder: 'gsk_…',
    requiresKey: true,
    route: 'Browser → Groq Cloud',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
    ],
    defaultModel: 'llama-3.3-70b-versatile',
    instructions:
      'Get a key from console.groq.com. Instant sub-second token generation powered by Groq LPUs.',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Universal)',
    logo: '🌐',
    description: 'One key to access 100+ AI models',
    keyLabel: 'OpenRouter API key',
    keyPlaceholder: 'sk-or-v1-…',
    requiresKey: true,
    route: 'Browser → OpenRouter',
    models: [
      { id: 'openrouter/auto', label: 'OpenRouter Auto (Optimal Routing)' },
      { id: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet (via OpenRouter)' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (via OpenRouter)' },
      { id: 'anthropic/claude-3-opus', label: 'Claude 3 Opus (via OpenRouter)' },
      { id: 'openai/gpt-4o', label: 'GPT-4o (via OpenRouter)' },
      { id: 'openai/o1', label: 'OpenAI o1 (via OpenRouter)' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (via OpenRouter)' },
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek V3 (via OpenRouter)' },
      { id: 'moonshotai/kimi-k3', label: 'Kimi K3 (via OpenRouter)' },
      { id: 'minimax/minimax-m3', label: 'MiniMax M3 (via OpenRouter)' },
      { id: 'x-ai/grok-2', label: 'Grok 2 (via OpenRouter)' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct' },
    ],
    defaultModel: 'openrouter/auto',
    instructions:
      'Get a key from openrouter.ai. Switch across any model instantly with zero setup hassle.',
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local AI)',
    logo: '🦙',
    description: '100% private, local models on your machine',
    keyLabel: 'API key (optional)',
    keyPlaceholder: 'Not required for local Ollama',
    requiresKey: false,
    route: 'Browser → Ollama (localhost)',
    baseUrl: 'http://localhost:11434',
    baseUrlLabel: 'Ollama base URL',
    models: [
      { id: 'llama3.3', label: 'Llama 3.3' },
      { id: 'deepseek-r1', label: 'DeepSeek R1 (Local)' },
      { id: 'qwen2.5-coder', label: 'Qwen 2.5 Coder' },
      { id: 'mistral', label: 'Mistral 7B' },
      { id: 'phi4', label: 'Microsoft Phi-4' },
      { id: 'gemma2', label: 'Google Gemma 2' },
    ],
    defaultModel: 'llama3.3',
    instructions:
      'Run Ollama locally (`ollama serve`). Aplx connects to localhost:11434. Set `OLLAMA_ORIGINS=*` if CORS applies.',
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);

export function getProvider(id: ProviderId): ProviderDef {
  return PROVIDERS[id] || PROVIDERS.gemini;
}

/**
 * Finds which provider a given model ID belongs to
 */
export function findProviderByModel(modelId: string): ProviderDef | undefined {
  return PROVIDER_LIST.find(p => p.models.some(m => m.id === modelId));
}
