import type { ProviderId } from '../providers/registry';
import { getProvider } from '../providers/registry';

const LEGACY_KEY = 'aplx:gemini-key';
const REMEMBER_KEY = 'aplx:remember-key';
const CONFIG_KEY = 'aplx:provider-config';

export type ProviderConfig = {
  provider: ProviderId;
  apiKey: string;
  model: string;
  baseUrl: string;
  remember: boolean;
  apiKeys?: Partial<Record<ProviderId, string>>;
  baseUrls?: Partial<Record<ProviderId, string>>;
};

const defaultConfig = (): ProviderConfig => ({
  provider: 'offline',
  apiKey: '',
  model: getProvider('offline').defaultModel,
  baseUrl: getProvider('ollama').baseUrl || 'http://localhost:11434',
  remember: true,
  apiKeys: {},
  baseUrls: {
    ollama: 'http://localhost:11434',
  },
});

function readStorage(): ProviderConfig | null {
  const raw = sessionStorage.getItem(CONFIG_KEY) || localStorage.getItem(CONFIG_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ProviderConfig>;
    const provider = (parsed.provider as ProviderId) || 'gemini';
    const def = getProvider(provider);
    const apiKeys = parsed.apiKeys || {};
    if (parsed.apiKey && !apiKeys[provider]) {
      apiKeys[provider] = parsed.apiKey;
    }
    const baseUrls = parsed.baseUrls || { ollama: 'http://localhost:11434' };

    return {
      provider,
      apiKey: apiKeys[provider] || parsed.apiKey || '',
      model: parsed.model || def.defaultModel,
      baseUrl: baseUrls[provider] || parsed.baseUrl || def.baseUrl || 'http://localhost:11434',
      remember: parsed.remember ?? true,
      apiKeys,
      baseUrls,
    };
  } catch {
    return null;
  }
}

function migrateLegacy(): ProviderConfig | null {
  const key = sessionStorage.getItem(LEGACY_KEY) || localStorage.getItem(LEGACY_KEY);
  if (!key) return null;
  return {
    provider: 'gemini',
    apiKey: key,
    model: getProvider('gemini').defaultModel,
    baseUrl: getProvider('ollama').baseUrl || 'http://localhost:11434',
    remember: true,
    apiKeys: { gemini: key },
    baseUrls: { ollama: 'http://localhost:11434' },
  };
}

export function loadProviderConfig(): ProviderConfig {
  return readStorage() || migrateLegacy() || defaultConfig();
}

export function saveProviderConfig(config: ProviderConfig) {
  const apiKeys = { ...(config.apiKeys || {}) };
  if (config.apiKey) {
    apiKeys[config.provider] = config.apiKey;
  }
  const baseUrls = { ...(config.baseUrls || {}) };
  if (config.baseUrl) {
    baseUrls[config.provider] = config.baseUrl;
  }

  const payload: ProviderConfig = {
    ...config,
    apiKeys,
    baseUrls,
  };

  sessionStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(CONFIG_KEY);
  const store = config.remember ? localStorage : sessionStorage;
  store.setItem(CONFIG_KEY, JSON.stringify(payload));
  localStorage.setItem(REMEMBER_KEY, String(config.remember));
  sessionStorage.removeItem(LEGACY_KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function removeProviderCredentials(config: ProviderConfig) {
  const apiKeys = { ...(config.apiKeys || {}) };
  delete apiKeys[config.provider];
  const next: ProviderConfig = {
    ...config,
    apiKey: '',
    apiKeys,
  };
  saveProviderConfig(next);
  return next;
}

export function getRemember() {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
}

export function clearLocalData() {
  sessionStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(CONFIG_KEY);
  sessionStorage.removeItem(LEGACY_KEY);
  localStorage.removeItem(LEGACY_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

/** @deprecated use loadProviderConfig */
export function loadKey() {
  return loadProviderConfig().apiKey;
}

/** @deprecated use saveProviderConfig */
export function saveKey(key: string, remember: boolean) {
  const config = loadProviderConfig();
  saveProviderConfig({ ...config, apiKey: key, remember });
}

/** @deprecated use removeProviderCredentials */
export function removeKey() {
  const config = loadProviderConfig();
  saveProviderConfig({ ...config, apiKey: '' });
}
