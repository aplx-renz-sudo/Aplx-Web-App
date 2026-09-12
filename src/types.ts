import type { ProviderConfig } from './lib/credential';
import type { ChatTurn } from './providers/types';

export type View = 'landing' | 'chat' | 'settings' | 'privacy' | 'about' | 'build' | 'media';

export type Message = ChatTurn & {
  id: string;
  time: string;
  thoughtTime?: number;
  tokensSaved?: number;
  modelUsed?: string;
};

export type ThemePreset =
  | 'black'
  | 'midnight'
  | 'cyberpunk'
  | 'emerald'
  | 'nebula'
  | 'solar'
  | 'crimson'
  | 'polar';

export type FontPreset = 'dm-sans' | 'mono' | 'editorial' | 'system';
export type BubbleStyle = 'glass' | 'minimal' | 'cyber' | 'capsule';
export type ThinkingStyle = 'orbital' | 'synaptic' | 'matrix' | 'minimal' | 'shimmer';
export type PetId = 'fox' | 'cat' | 'bunny' | 'dragon' | 'slime' | 'robo' | 'shiba' | 'none';
export type PetPosition = 'bottom-right' | 'composer' | 'header' | 'floating';
export type TokenSaverMode = 'off' | 'light' | 'balanced' | 'aggressive';

export type GradientTarget = 'background' | 'landing' | 'both';

export type CustomThemeConfig = {
  enabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  accentColor: string;
  glowIntensity: number;
  backgroundTint: string;
  gradientTarget?: GradientTarget;
};

export type PersonaId =
  | 'helpful'
  | 'architect'
  | 'concise'
  | 'creative'
  | 'academic'
  | 'hacker'
  | 'custom';

export type UserProfile = {
  id: string;
  name: string;
  avatar: string; // Preset key or base64 / data URL
  avatarType: 'preset' | 'custom';
  bio?: string;
  joinedAt: number;
  isSetupComplete: boolean;
  // Security & Protection Fields
  securityPinHash?: string;
  securityPinSalt?: string;
  isPinLocked?: boolean;
  integrityHash?: string;
  isTampered?: boolean;
  lastSecurityCheck?: number;
};

export type Preferences = {
  theme: ThemePreset;
  themeGradientTarget?: GradientTarget;
  customTheme: CustomThemeConfig;
  font: FontPreset;
  bubbleStyle: BubbleStyle;
  compact: boolean;
  sendOnEnter: boolean;
  motion: boolean;
  soundEffects: boolean;
  
  // Pet settings
  petId: PetId;
  petSize: 'small' | 'medium' | 'large';
  petPosition: PetPosition;
  petInteractive: boolean;
  
  // Thinking settings
  thinkingStyle: ThinkingStyle;
  showThinkingTimer: boolean;
  thinkingDelayMs: number;
  
  // Token saver settings
  tokenSaverMode: TokenSaverMode;
  tokenSaverTargetPercent: number; // e.g. 22%
  
  // AI Persona & Behavior
  persona: PersonaId;
  customSystemPrompt: string;
  temperature: number;
  maxHistoryTurns: number;
  streamSpeed: 'fast' | 'normal' | 'smooth';
};

export type TokenStats = {
  totalTokensProcessed: number;
  totalTokensSaved: number;
  totalMessagesSent: number;
  byModel?: Record<string, { processed: number; saved: number }>;
};
