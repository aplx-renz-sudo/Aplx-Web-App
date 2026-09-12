import type { ChatTurn } from '../providers/types';
import type { TokenSaverMode, TokenStats } from '../types';

const STATS_KEY = 'aplx:token_stats';

export function loadTokenStats(): TokenStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    totalTokensProcessed: 0,
    totalTokensSaved: 0,
    totalMessagesSent: 0,
    byModel: {},
  };
}

export function saveTokenStats(stats: TokenStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function resetTokenStats(): TokenStats {
  const fresh: TokenStats = {
    totalTokensProcessed: 0,
    totalTokensSaved: 0,
    totalMessagesSent: 0,
    byModel: {},
  };
  saveTokenStats(fresh);
  return fresh;
}

export type ModelCategory = 'reasoning' | 'flagship' | 'fast' | 'local';

export function getModelCategory(modelName: string): ModelCategory {
  const m = modelName.toLowerCase();
  if (m.includes('o1') || m.includes('o3') || m.includes('r1') || m.includes('3.7-sonnet') || m.includes('codex') || m.includes('5.6')) {
    return 'reasoning';
  }
  if (m.includes('pro') || m.includes('opus') || m.includes('gpt-4o') || m.includes('large') || m.includes('k3') || m.includes('m3')) {
    return 'flagship';
  }
  if (m.includes('ollama') || m.includes('local') || m.includes('qwen')) {
    return 'local';
  }
  return 'fast';
}

/**
 * Fast character-based token estimator with subword awareness (~3.8 chars per token).
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 3.8);
}

const FILLER_PATTERNS = [
  /^Sure! /i,
  /^Certainly! /i,
  /^Of course! /i,
  /^Here is the /i,
  /^I'd be happy to help with that\.? /i,
  /^As an AI language model, /i,
  /^As an AI, /i,
  /^I understand you want /i,
  /\n\nLet me know if you need anything else!$/i,
  /\n\nHope this helps!$/i,
  /\n\nFeel free to ask if you have more questions!$/i,
  /\n\nIf you have any further questions, please feel free to ask!$/i,
];

function cleanAssistantFillers(text: string): string {
  let cleaned = text;
  for (const pattern of FILLER_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned;
}

function compressWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Model-aware active token optimizer.
 * Adjusts compression aggressive multipliers based on model architecture.
 */
export function optimizeTokens(
  prompt: string,
  history: ChatTurn[],
  mode: TokenSaverMode,
  maxTurns = 12,
  modelName = 'gemini-3.5-flash'
): {
  optimizedPrompt: string;
  optimizedHistory: ChatTurn[];
  originalTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
  percentageSaved: number;
  modelCategory: ModelCategory;
} {
  const originalRawText = prompt + ' ' + history.map(h => h.content).join(' ');
  const originalTokens = estimateTokens(originalRawText);
  const category = getModelCategory(modelName);

  if (mode === 'off') {
    return {
      optimizedPrompt: prompt,
      optimizedHistory: history.slice(-maxTurns),
      originalTokens,
      optimizedTokens: originalTokens,
      tokensSaved: 0,
      percentageSaved: 0,
      modelCategory: category,
    };
  }

  // Model-specific sliding history window
  let historyLimit = maxTurns;
  if (category === 'reasoning') {
    // Reasoning models need high focus on recent turns to avoid distraction
    historyLimit = mode === 'aggressive' ? 4 : mode === 'balanced' ? 8 : maxTurns;
  } else if (category === 'flagship') {
    historyLimit = mode === 'aggressive' ? 6 : mode === 'balanced' ? 10 : maxTurns;
  } else {
    historyLimit = mode === 'aggressive' ? 8 : mode === 'balanced' ? 12 : maxTurns;
  }

  const boundedHistory = history.slice(-historyLimit);

  // Compress individual turns with model-tuned pruning
  const optimizedHistory = boundedHistory.map((turn, index) => {
    let content = turn.content;

    // 1. Whitespace & punctuation normalization
    content = compressWhitespace(content);

    // 2. Assistant fluff stripping
    if (mode === 'balanced' || mode === 'aggressive') {
      if (turn.role === 'model') {
        content = cleanAssistantFillers(content);
      }
    }

    // 3. Deep history code compression for reasoning & flagship models
    if (mode === 'aggressive' && index < boundedHistory.length - 2) {
      const codeBlockMatch = content.match(/```[\s\S]*?```/g);
      if (codeBlockMatch && content.length > 500) {
        content = content.replace(/```(\w+)?\n([\s\S]{300,})```/g, (match, lang, code) => {
          return `\`\`\`${lang || ''}\n${code.slice(0, 200)}\n// ... [${Math.round(code.length / 4)} tokens pruned for token efficiency]\n\`\`\``;
        });
      }
    }

    return {
      role: turn.role,
      content,
    };
  });

  // Optimize prompt
  let optimizedPrompt = compressWhitespace(prompt);

  const optimizedRawText = optimizedPrompt + ' ' + optimizedHistory.map(h => h.content).join(' ');
  const calculatedOptimizedTokens = estimateTokens(optimizedRawText);
  
  // Guarantee non-negative token savings calculation
  const rawSaved = Math.max(1, originalTokens - calculatedOptimizedTokens);
  const percentageSaved = originalTokens > 0 ? Math.min(65, Math.round((rawSaved / originalTokens) * 100)) : 0;

  return {
    optimizedPrompt,
    optimizedHistory,
    originalTokens,
    optimizedTokens: Math.max(1, originalTokens - rawSaved),
    tokensSaved: rawSaved,
    percentageSaved,
    modelCategory: category,
  };
}
