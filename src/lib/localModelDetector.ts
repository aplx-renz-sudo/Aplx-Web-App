export type DetectedLocalModel = {
  id: string;
  name: string;
  provider: 'ollama' | 'lmstudio';
  size?: string;
  family?: string;
  modifiedAt?: string;
};

export type LocalDetectionResult = {
  isAvailable: boolean;
  provider?: 'ollama' | 'lmstudio';
  baseUrl: string;
  models: DetectedLocalModel[];
  recommendedModel?: DetectedLocalModel;
  detectedAt?: number;
};

const CACHE_KEY = 'aplx:detected_local_models:v1';

export async function detectLocalOfflineModels(customOllamaUrl?: string): Promise<LocalDetectionResult> {
  const ollamaUrl = (customOllamaUrl || 'http://localhost:11434').replace(/\/$/, '');
  const lmStudioUrl = 'http://localhost:1234/v1';

  // 1. Probe Ollama
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1600);
    const res = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      mode: 'cors',
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models) && data.models.length > 0) {
        const models: DetectedLocalModel[] = data.models.map((m: any) => {
          const rawName = m.name || m.model || 'unknown';
          const sizeGB = m.size ? `${(m.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : undefined;
          const family = m.details?.family || '';
          return {
            id: rawName,
            name: formatModelName(rawName),
            provider: 'ollama',
            size: sizeGB,
            family,
            modifiedAt: m.modified_at,
          };
        });

        const bestModel = pickBestLocalModel(models);
        const result: LocalDetectionResult = {
          isAvailable: true,
          provider: 'ollama',
          baseUrl: ollamaUrl,
          models,
          recommendedModel: bestModel,
          detectedAt: Date.now(),
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        } catch {}

        return result;
      }
    }
  } catch {
    // Ollama not reachable or CORS restricted
  }

  // 2. Probe LM Studio
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${lmStudioUrl}/models`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      mode: 'cors',
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        const models: DetectedLocalModel[] = data.data.map((m: any) => ({
          id: m.id,
          name: m.id,
          provider: 'lmstudio',
        }));

        const result: LocalDetectionResult = {
          isAvailable: true,
          provider: 'lmstudio',
          baseUrl: 'http://localhost:1234',
          models,
          recommendedModel: models[0],
          detectedAt: Date.now(),
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        } catch {}

        return result;
      }
    }
  } catch {
    // LM studio not reachable
  }

  // Fallback to cache if available
  const cached = getCachedLocalModels();
  if (cached && cached.isAvailable) {
    return cached;
  }

  return {
    isAvailable: false,
    baseUrl: ollamaUrl,
    models: [],
  };
}

export function getCachedLocalModels(): LocalDetectionResult | null {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}

function formatModelName(tag: string): string {
  const clean = tag.replace(/:latest$/, '');
  const parts = clean.split(':');
  if (parts.length === 2) {
    return `${capitalize(parts[0])} (${parts[1]})`;
  }
  return capitalize(clean);
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickBestLocalModel(models: DetectedLocalModel[]): DetectedLocalModel {
  const priorities = [
    'deepseek-r1',
    'llama3.3',
    'llama3.2',
    'llama3.1',
    'qwen2.5-coder',
    'qwen2.5',
    'mistral',
    'phi4',
    'gemma2',
  ];

  for (const p of priorities) {
    const found = models.find(m => m.id.toLowerCase().includes(p));
    if (found) return found;
  }

  return models[0];
}
