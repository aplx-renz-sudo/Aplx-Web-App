import { useState } from 'react';
import {
  Palette,
  Sparkles,
  Zap,
  Cat,
  Cpu,
  UserCheck,
  ShieldCheck,
  Orbit,
  RotateCcw,
  Sliders,
  Volume2,
  VolumeX,
  Check,
  Download,
  Upload,
  Copy,
  Layers,
  Flame,
  Terminal,
  BrainCircuit,
  MessageSquare,
  Home,
  Layout,
  ArrowUp,
  CheckCircle2,
  X,
  Trash2,
  WandSparkles,
  Scale,
  FileText,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import type {
  Preferences,
  ThemePreset,
  FontPreset,
  BubbleStyle,
  PetId,
  PetPosition,
  ThinkingStyle,
  TokenSaverMode,
  PersonaId,
  TokenStats,
  GradientTarget,
} from '../types';
import { ThinkingIndicator } from './ThinkingIndicator';
import { PetCompanion } from './PetCompanion';
import { PetArtwork } from './PetArtwork';
import { sounds } from '../lib/audio';

export const THEME_PRESETS: { id: ThemePreset; name: string; desc: string; colors: string[] }[] = [
  { id: 'black', name: 'Pure Black (OLED)', desc: 'Ultra-deep pure darkness', colors: ['#030303', '#121212', '#9eb8ff'] },
  { id: 'midnight', name: 'Midnight Navy', desc: 'Cosmic deep oceanic blue', colors: ['#050915', '#0c162d', '#7ba4ff'] },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Futuristic neon magenta & cyan', colors: ['#08040d', '#200e31', '#ff007f'] },
  { id: 'emerald', name: 'Matrix Emerald', desc: 'Deep bioluminescent emerald', colors: ['#020b06', '#062013', '#00f59b'] },
  { id: 'nebula', name: 'Nebula Purple', desc: 'Amethyst cosmic stardust', colors: ['#0a0514', '#1f1035', '#b388ff'] },
  { id: 'solar', name: 'Solar Flare', desc: 'Warm celestial amber & gold', colors: ['#0d0803', '#261505', '#ff9f43'] },
  { id: 'crimson', name: 'Crimson Velvet', desc: 'Deep ruby and rose nebula', colors: ['#0d0406', '#260c13', '#ff4757'] },
  { id: 'polar', name: 'Polar Frost', desc: 'Clean high-contrast titanium dark', colors: ['#090b0e', '#131922', '#70a1ff'] },
];

export const QUICK_GRADIENT_PRESETS = [
  { name: 'Cosmic Nebula', start: '#0e0622', end: '#240b49', angle: 135, accent: '#b388ff' },
  { name: 'Cyber Sunset', start: '#1f0322', end: '#5a0038', angle: 120, accent: '#ff007f' },
  { name: 'Emerald Aurora', start: '#011208', end: '#04341e', angle: 140, accent: '#00f59b' },
  { name: 'Solar Amber', start: '#190a00', end: '#451f00', angle: 135, accent: '#ff9f43' },
  { name: 'Oceanic Abyss', start: '#020b1e', end: '#092548', angle: 150, accent: '#38bdf8' },
  { name: 'Crimson Night', start: '#1c0308', end: '#4a0815', angle: 130, accent: '#ff4757' },
];

export const PET_LIST: { id: PetId; name: string; desc: string; emoji: string }[] = [
  { id: 'fox', name: 'Cyber Fox', desc: 'Clever navigator of the neural web', emoji: '🦊' },
  { id: 'cat', name: 'Celestial Cat', desc: 'Cosmic feline purring in the void', emoji: '🐾' },
  { id: 'bunny', name: 'Pixel Bunny', desc: 'Bouncing token harvester with rockets', emoji: '🐰' },
  { id: 'dragon', name: 'Cosmic Dragon', desc: 'Guardian of private model credentials', emoji: '🐉' },
  { id: 'slime', name: 'Slime Bob', desc: 'Squishy, happy blob of compressed memory', emoji: '💧' },
  { id: 'robo', name: 'Robo Orb', desc: 'Autonomous drone with telemetry analytics', emoji: '🤖' },
  { id: 'shiba', name: 'Shiba Sparky', desc: 'Astronaut doge on a space mission', emoji: '🐕' },
  { id: 'none', name: 'No Companion', desc: 'Clean, minimalist workspace', emoji: '🚫' },
];

export const THINKING_STYLES: { id: ThinkingStyle; name: string; desc: string }[] = [
  { id: 'orbital', name: 'Orbital Rings', desc: 'Concentric spinning pulsar rings with orbital nodes' },
  { id: 'synaptic', name: 'Synaptic Waveform', desc: 'Rhythmic pulsing neural frequency bars' },
  { id: 'matrix', name: 'Matrix Terminal', desc: 'Cyber cascade terminal tokens' },
  { id: 'shimmer', name: 'Holo Shimmer', desc: 'Radiant continuous light shimmer gradient' },
  { id: 'minimal', name: 'Minimal Cadence', desc: 'Clean, unobtrusive three-dot pulse' },
];

export const PERSONAS: { id: PersonaId; name: string; desc: string; prompt: string }[] = [
  {
    id: 'helpful',
    name: 'Helpful Assistant (Default)',
    desc: 'Balanced, insightful, empathetic, and comprehensive',
    prompt: 'You are Aplx, a brilliant, private, and precise AI assistant.',
  },
  {
    id: 'architect',
    name: 'Senior Software Architect',
    desc: 'Laser-focused on high-performance code, clean abstractions, and patterns',
    prompt: 'You are an elite Staff Software Architect. Provide production-grade, bug-free, and idiomatic code with concise technical explanations.',
  },
  {
    id: 'concise',
    name: 'Concise & Direct',
    desc: 'Zero fluff, straight-to-the-point executive bullet summaries',
    prompt: 'Be concise, direct, and factual. Omit conversational filler. Prioritize bullet points and precise facts.',
  },
  {
    id: 'creative',
    name: 'Creative Storyteller',
    desc: 'Vivid imagery, rich narrative vocabulary, and inventive metaphors',
    prompt: 'You are a master creative writer and worldbuilder. Write with vivid, evocative language and compelling narrative arcs.',
  },
  {
    id: 'academic',
    name: 'Academic Researcher',
    desc: 'Rigorous explanations, step-by-step logic, and deep analytical depth',
    prompt: 'You are a rigorous research scholar. Provide deep mathematical or conceptual justifications with clear deductive reasoning.',
  },
  {
    id: 'hacker',
    name: 'Cyberpunk Hacker',
    desc: 'Terminal-flavored, low-level technical insight and systems mastery',
    prompt: 'You are a cyberpunk systems engineer. Speak with high technical depth, systems-level awareness, and crisp efficiency.',
  },
  {
    id: 'custom',
    name: 'Custom System Instructions',
    desc: 'Fully define your own system persona prompt below',
    prompt: '',
  },
];

export function AppearanceSettings({
  preferences,
  setPreferences,
}: {
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
}) {
  const custom = preferences.customTheme;
  const currentTarget: GradientTarget = custom.enabled
    ? (custom.gradientTarget || 'both')
    : (preferences.themeGradientTarget || 'both');

  // Gradient target choice modal state
  const [pendingSelection, setPendingSelection] = useState<{
    type: 'preset' | 'custom';
    themeId?: ThemePreset;
    customConfig?: typeof custom;
    previewColors: string[];
    title: string;
  } | null>(null);

  const updateCustom = (patch: Partial<typeof custom>) => {
    setPreferences({
      ...preferences,
      customTheme: { ...custom, ...patch, enabled: true },
    });
  };

  const handleSelectPreset = (t: typeof THEME_PRESETS[0]) => {
    setPendingSelection({
      type: 'preset',
      themeId: t.id,
      previewColors: t.colors,
      title: t.name,
    });
  };

  const handleSelectQuickGradient = (q: typeof QUICK_GRADIENT_PRESETS[0]) => {
    const nextCustom = {
      ...custom,
      enabled: true,
      gradientStart: q.start,
      gradientEnd: q.end,
      gradientAngle: q.angle,
      accentColor: q.accent,
      backgroundTint: '#040711',
    };
    setPendingSelection({
      type: 'custom',
      customConfig: nextCustom,
      previewColors: [q.start, q.end, q.accent],
      title: q.name,
    });
  };

  const handleApplyCustomStudioGradient = () => {
    setPendingSelection({
      type: 'custom',
      customConfig: { ...custom, enabled: true },
      previewColors: [custom.gradientStart, custom.gradientEnd, custom.accentColor],
      title: 'Custom Gradient Aura',
    });
  };

  const confirmGradientPlacement = (target: GradientTarget) => {
    if (!pendingSelection) return;

    if (preferences.soundEffects) sounds.playComplete();

    if (pendingSelection.type === 'preset' && pendingSelection.themeId) {
      setPreferences({
        ...preferences,
        theme: pendingSelection.themeId,
        themeGradientTarget: target,
        customTheme: { ...preferences.customTheme, enabled: false, gradientTarget: target },
      });
    } else if (pendingSelection.type === 'custom' && pendingSelection.customConfig) {
      setPreferences({
        ...preferences,
        themeGradientTarget: target,
        customTheme: {
          ...pendingSelection.customConfig,
          enabled: true,
          gradientTarget: target,
        },
      });
    }

    setPendingSelection(null);
  };

  const handleDirectTargetChange = (target: GradientTarget) => {
    if (preferences.soundEffects) sounds.playClick();
    setPreferences({
      ...preferences,
      themeGradientTarget: target,
      customTheme: {
        ...preferences.customTheme,
        gradientTarget: target,
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: HEADER & PLACEMENT TARGET */}
      <div className="space-y-6 pb-8 border-b border-[#1a2744]">
        <div>
          <div className="section-kicker">THEME & COLOR SCHEME</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Aesthetic Presets & Atmospheric Gradients</h2>
          <p className="lead text-xs text-[#8da0c4] mt-1">
            Choose a crafted color atmosphere, customize radiant glowing gradients, and choose whether they illuminate the front page or the full app background.
          </p>
        </div>

        {/* GRADIENT PLACEMENT TARGET SELECTOR (TACTILE BUTTONS) */}
        <div className="p-5 rounded-2xl bg-[#0b101e]/90 border border-[#1d2b48] shadow-lg space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <label className="field-label text-xs text-[#8ea8ff] font-bold tracking-wider">
                GRADIENT PLACEMENT TARGET
              </label>
              <p className="text-xs text-[#8094b8]">
                Control where your selected theme or custom gradient is displayed
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
              Active: {currentTarget === 'landing' ? 'Front Page' : currentTarget === 'background' ? 'App Background' : 'Both'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleDirectTargetChange('background')}
              className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all cursor-pointer shadow-sm active:scale-98 ${
                currentTarget === 'background'
                  ? 'border-[#2997ff] bg-blue-500/20 text-[#f5f5f7] shadow-lg shadow-blue-500/20 ring-1 ring-[#2997ff]'
                  : 'border-white/[0.08] bg-[#070b14] text-[#8e9ebc] hover:border-white/[0.18] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${
                currentTarget === 'background' ? 'bg-blue-500 text-white shadow-md' : 'bg-white/[0.06] text-[#8e9ebc]'
              }`}>
                <Orbit size={18} />
              </div>
              <div className="min-w-0">
                <b className="text-xs font-bold block truncate text-[#f5f5f7]">App Background</b>
                <span className="text-[10.5px] text-[#788bb0] block truncate">Behind chats & workspace</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDirectTargetChange('landing')}
              className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all cursor-pointer shadow-sm active:scale-98 ${
                currentTarget === 'landing'
                  ? 'border-purple-400 bg-purple-500/20 text-[#f5f5f7] shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                  : 'border-white/[0.08] bg-[#070b14] text-[#8e9ebc] hover:border-white/[0.18] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${
                currentTarget === 'landing' ? 'bg-purple-500 text-white shadow-md' : 'bg-white/[0.06] text-[#8e9ebc]'
              }`}>
                <Home size={18} />
              </div>
              <div className="min-w-0">
                <b className="text-xs font-bold block truncate text-[#f5f5f7]">Front Page (Landing)</b>
                <span className="text-[10.5px] text-[#788bb0] block truncate">Radiant welcome aura</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDirectTargetChange('both')}
              className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all cursor-pointer shadow-sm active:scale-98 ${
                currentTarget === 'both'
                  ? 'border-emerald-400 bg-emerald-500/20 text-[#f5f5f7] shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                  : 'border-white/[0.08] bg-[#070b14] text-[#8e9ebc] hover:border-white/[0.18] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${
                currentTarget === 'both' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/[0.06] text-[#8e9ebc]'
              }`}>
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <b className="text-xs font-bold block truncate text-[#f5f5f7]">Both (Full App)</b>
                <span className="text-[10.5px] text-[#788bb0] block truncate">Landing page + workspace</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: THEME PRESET SELECTION GRID (TACTILE BUTTONS) */}
      <div className="space-y-4 pb-8 border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <label className="field-label text-xs font-bold text-[#f5f5f7] tracking-tight">
            SELECT THEME PRESET ({THEME_PRESETS.length} ATMOSPHERES)
          </label>
          <span className="text-[11px] text-[#788bb0] font-mono">Click to choose placement</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {THEME_PRESETS.map(t => {
            const isSelected = preferences.theme === t.id && !preferences.customTheme.enabled;
            return (
              <button
                key={t.id}
                type="button"
                role="button"
                onClick={() => handleSelectPreset(t)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between shadow-md active:scale-98 ${
                  isSelected
                    ? 'border-[#2997ff] bg-[#121c32] ring-1 ring-[#2997ff] shadow-lg shadow-[#2997ff]/20'
                    : 'border-white/[0.08] bg-[#090d18] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div>
                  <div
                    className="h-10 w-full rounded-xl mb-2.5 flex items-center justify-between px-2.5 shadow-inner border border-white/10"
                    style={{ background: `linear-gradient(135deg, ${t.colors[0]} 0%, ${t.colors[1]} 50%, ${t.colors[2]} 100%)` }}
                  >
                    <span className="text-[10px] font-mono text-white/70 font-semibold uppercase">Preview</span>
                    <div className="w-3.5 h-3.5 rounded-full shadow-md border border-white/30" style={{ background: t.colors[2] }} />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <b className="text-xs font-bold text-[#eef3ff] block truncate">{t.name}</b>
                    {isSelected && <CheckCircle2 size={13} className="text-[#2997ff] flex-none" />}
                  </div>
                  <span className="text-[11px] text-[#788bb0] block line-clamp-1 mt-0.5">{t.desc}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10.5px] font-medium text-[#8ea8ff]">
                  <span>{isSelected ? '● Active Theme' : 'Apply Gradient'}</span>
                  <span>↗</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: CUSTOM GRADIENT & ACCENT STUDIO */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0b101e]/90 border border-[#1f2d4a] shadow-xl shadow-black/40 space-y-6 pb-8 border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#8ea8ff]/15 border border-[#8ea8ff]/30 flex items-center justify-center text-[#8ea8ff] shadow-sm">
              <Palette size={22} />
            </div>
            <div>
              <b className="text-sm font-bold text-[#eef3ff] block">Custom Gradient & Accent Studio</b>
              <p className="text-xs text-[#8092b6] mt-0.5">Design your personal gradient aura and custom accents</p>
            </div>
          </div>
          <button
            type="button"
            className={`toggle ${custom.enabled ? 'on' : ''}`}
            onClick={() => updateCustom({ enabled: !custom.enabled })}
            aria-pressed={custom.enabled}
          >
            <i />
          </button>
        </div>

        {/* 1-TAP QUICK GRADIENT PRESETS (TACTILE BUTTONS) */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8ea8ff] flex items-center gap-1.5">
              <WandSparkles size={14} /> 1-TAP QUICK GRADIENT PALETTES
            </span>
            <span className="text-[11px] text-[#788cae] font-mono">Click any button to preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {QUICK_GRADIENT_PRESETS.map(q => (
              <button
                key={q.name}
                type="button"
                onClick={() => handleSelectQuickGradient(q)}
                className="p-3 rounded-xl border border-white/[0.08] hover:border-white/[0.22] bg-[#070b14] hover:bg-white/[0.05] transition-all text-left flex items-center gap-2.5 cursor-pointer group shadow-sm active:scale-98"
              >
                <div
                  className="w-7 h-7 rounded-lg border border-white/20 flex-none shadow-sm"
                  style={{ background: `linear-gradient(${q.angle}deg, ${q.start} 0%, ${q.end} 100%)` }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-[#eef3ff] block truncate group-hover:text-white">
                    {q.name}
                  </span>
                  <span className="text-[10px] text-[#788cae] font-mono block truncate">
                    {q.accent}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {custom.enabled && (
          <div className="space-y-6 pt-3 border-t border-[#1d273e]">
            {/* Live Gradient Preview Box */}
            <div
              className="h-20 w-full rounded-2xl flex items-center justify-between px-5 border border-white/20 shadow-2xl transition-all relative overflow-hidden"
              style={{
                background: `linear-gradient(${custom.gradientAngle}deg, ${custom.gradientStart} 0%, ${custom.gradientEnd} 100%)`,
              }}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Sparkles size={15} className="text-white drop-shadow" />
                <span className="text-xs font-mono font-bold text-white drop-shadow-md tracking-wider">
                  LIVE PALETTE PREVIEW
                </span>
              </div>
              <span
                className="relative z-10 text-xs px-3.5 py-1.5 rounded-xl font-bold text-white shadow-lg backdrop-blur-md border border-white/20"
                style={{ background: custom.accentColor }}
              >
                {custom.accentColor}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Gradient Start Color Picker Button */}
              <div className="space-y-2">
                <label className="field-label text-xs font-semibold text-[#8ea8ff] block">GRADIENT START COLOR</label>
                <div className="relative">
                  <label className="w-full flex items-center justify-between gap-3 bg-[#070b14] hover:bg-[#0c1322] p-3 rounded-2xl border border-[#23314d] hover:border-[#8ea8ff]/50 transition-all cursor-pointer shadow-md group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-xl border border-white/20 shadow-inner flex-none relative overflow-hidden group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: custom.gradientStart }}
                      >
                        <input
                          type="color"
                          value={custom.gradientStart}
                          onChange={e => updateCustom({ gradientStart: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-mono font-bold text-white block uppercase tracking-wide">
                          {custom.gradientStart}
                        </span>
                        <span className="text-[10px] text-[#7185aa] block">Click to pick color</span>
                      </div>
                    </div>
                    <Palette size={14} className="text-[#7185aa] group-hover:text-[#8ea8ff] flex-none" />
                  </label>
                </div>
                {/* Quick Swatches Buttons */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {['#030714', '#1e053a', '#020c06', '#120700', '#120307'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateCustom({ gradientStart: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-lg border transition-all cursor-pointer hover:scale-110 shadow-sm ${
                        custom.gradientStart.toLowerCase() === color.toLowerCase()
                          ? 'border-[#8ea8ff] ring-2 ring-[#8ea8ff]/40 scale-105'
                          : 'border-white/20'
                      }`}
                      title={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Gradient End Color Picker Button */}
              <div className="space-y-2">
                <label className="field-label text-xs font-semibold text-[#8ea8ff] block">GRADIENT END COLOR</label>
                <div className="relative">
                  <label className="w-full flex items-center justify-between gap-3 bg-[#070b14] hover:bg-[#0c1322] p-3 rounded-2xl border border-[#23314d] hover:border-[#8ea8ff]/50 transition-all cursor-pointer shadow-md group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-xl border border-white/20 shadow-inner flex-none relative overflow-hidden group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: custom.gradientEnd }}
                      >
                        <input
                          type="color"
                          value={custom.gradientEnd}
                          onChange={e => updateCustom({ gradientEnd: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-mono font-bold text-white block uppercase tracking-wide">
                          {custom.gradientEnd}
                        </span>
                        <span className="text-[10px] text-[#7185aa] block">Click to pick color</span>
                      </div>
                    </div>
                    <Palette size={14} className="text-[#7185aa] group-hover:text-[#8ea8ff] flex-none" />
                  </label>
                </div>
                {/* Quick Swatches Buttons */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {['#0c1836', '#003b46', '#052a17', '#2f1503', '#251040'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateCustom({ gradientEnd: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-lg border transition-all cursor-pointer hover:scale-110 shadow-sm ${
                        custom.gradientEnd.toLowerCase() === color.toLowerCase()
                          ? 'border-[#8ea8ff] ring-2 ring-[#8ea8ff]/40 scale-105'
                          : 'border-white/20'
                      }`}
                      title={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Highlight Color Picker Button */}
              <div className="space-y-2">
                <label className="field-label text-xs font-semibold text-[#8ea8ff] block">ACCENT HIGHLIGHT COLOR</label>
                <div className="relative">
                  <label className="w-full flex items-center justify-between gap-3 bg-[#070b14] hover:bg-[#0c1322] p-3 rounded-2xl border border-[#23314d] hover:border-[#8ea8ff]/50 transition-all cursor-pointer shadow-md group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-xl border border-white/20 shadow-inner flex-none relative overflow-hidden group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: custom.accentColor }}
                      >
                        <input
                          type="color"
                          value={custom.accentColor}
                          onChange={e => updateCustom({ accentColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-mono font-bold text-white block uppercase tracking-wide">
                          {custom.accentColor}
                        </span>
                        <span className="text-[10px] text-[#7185aa] block">Click to pick color</span>
                      </div>
                    </div>
                    <Sparkles size={14} className="text-[#7185aa] group-hover:text-[#8ea8ff] flex-none" />
                  </label>
                </div>
                {/* Quick Swatches Buttons */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {['#8ea8ff', '#00f59b', '#ff9f43', '#ff007f', '#b388ff'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateCustom({ accentColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-lg border transition-all cursor-pointer hover:scale-110 shadow-sm ${
                        custom.accentColor.toLowerCase() === color.toLowerCase()
                          ? 'border-[#8ea8ff] ring-2 ring-[#8ea8ff]/40 scale-105'
                          : 'border-white/20'
                      }`}
                      title={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tactile Angle & Glow Slider Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="p-4 rounded-2xl bg-[#070b14] border border-[#202e4d] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8da0c4] font-medium">Gradient Direction Angle</span>
                  <span className="font-mono font-bold text-[#8ea8ff] bg-[#14203d] border border-[#24355e] px-2.5 py-0.5 rounded-lg text-xs">
                    {custom.gradientAngle}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={custom.gradientAngle}
                  onChange={e => updateCustom({ gradientAngle: Number(e.target.value) })}
                  className="w-full accent-[#8ea8ff] cursor-pointer"
                />
                <div className="flex items-center justify-between pt-1">
                  {[0, 45, 90, 135, 180, 270].map(angle => (
                    <button
                      key={angle}
                      type="button"
                      onClick={() => updateCustom({ gradientAngle: angle })}
                      className={`px-2 py-1 rounded-md text-[10.5px] font-mono transition-all cursor-pointer ${
                        custom.gradientAngle === angle
                          ? 'bg-[#8ea8ff] text-[#070b16] font-bold'
                          : 'bg-white/[0.04] text-[#7185aa] hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#070b14] border border-[#202e4d] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8da0c4] font-medium">Glow Aura Intensity</span>
                  <span className="font-mono font-bold text-[#8ea8ff] bg-[#14203d] border border-[#24355e] px-2.5 py-0.5 rounded-lg text-xs">
                    {custom.glowIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={custom.glowIntensity}
                  onChange={e => updateCustom({ glowIntensity: Number(e.target.value) })}
                  className="w-full accent-[#8ea8ff] cursor-pointer"
                />
                <div className="flex items-center justify-between pt-1">
                  {[25, 50, 75, 100].map(int => (
                    <button
                      key={int}
                      type="button"
                      onClick={() => updateCustom({ glowIntensity: int })}
                      className={`px-2 py-1 rounded-md text-[10.5px] font-mono transition-all cursor-pointer ${
                        custom.glowIntensity === int
                          ? 'bg-[#8ea8ff] text-[#070b16] font-bold'
                          : 'bg-white/[0.04] text-[#7185aa] hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {int}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tactile Button Actions for Custom Studio */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleApplyCustomStudioGradient}
                className="px-5 py-2.5 rounded-xl bg-[#8ea8ff] hover:bg-[#a6bdff] text-[#070b16] text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Sparkles size={14} />
                <span>Apply Gradient Atmosphere</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateCustom({
                    gradientStart: '#1e053a',
                    gradientEnd: '#003b46',
                    gradientAngle: 135,
                    accentColor: '#8ea8ff',
                    glowIntensity: 50,
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-[#f5f5f7] inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw size={13} />
                <span>Reset to Default Colors</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: TYPOGRAPHY & CHAT BUBBLE STYLE (TACTILE BUTTONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b border-[#1a2744]">
        <div className="p-5 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <label className="field-label text-xs font-bold text-[#8ea8ff]">TYPOGRAPHY PAIRING</label>
            <span className="text-[11px] font-mono text-[#788bb0]">4 Typefaces</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'dm-sans', name: 'DM Sans (Modern)', badge: 'Aa', fontClass: 'font-sans' },
              { id: 'mono', name: 'DM Mono (Code)', badge: '01', fontClass: 'font-mono' },
              { id: 'editorial', name: 'Editorial Serif', badge: '¶', fontClass: 'font-serif' },
              { id: 'system', name: 'System Native', badge: '', fontClass: 'font-system' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setPreferences({ ...preferences, font: f.id as FontPreset })}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer active:scale-98 shadow-sm ${
                  preferences.font === f.id
                    ? 'border-[#8ea8ff] bg-[#141f38] text-[#edf3ff] font-bold shadow-md ring-1 ring-[#8ea8ff]'
                    : 'border-[#1e2a44] bg-[#070b14] text-[#8e9ebc] hover:border-[#33466d] hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-md bg-white/[0.08] flex items-center justify-center text-[11px] font-mono font-bold text-[#8ea8ff]">
                    {f.badge}
                  </span>
                  {preferences.font === f.id && <Check size={13} className="text-[#8ea8ff]" />}
                </div>
                <div className="font-medium truncate text-white">{f.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <label className="field-label text-xs font-bold text-[#8ea8ff]">MESSAGE BUBBLE STYLE</label>
            <span className="text-[11px] font-mono text-[#788bb0]">4 Aesthetics</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'glass', name: 'Glassmorphic Aura', desc: 'Blur & gradient rim' },
              { id: 'minimal', name: 'Minimal Flush', desc: 'Clean borderless' },
              { id: 'cyber', name: 'Cyber Bordered', desc: 'High contrast borders' },
              { id: 'capsule', name: 'Capsule Soft', desc: 'Rounded pill curves' },
            ].map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => setPreferences({ ...preferences, bubbleStyle: b.id as BubbleStyle })}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer active:scale-98 shadow-sm ${
                  preferences.bubbleStyle === b.id
                    ? 'border-[#8ea8ff] bg-[#141f38] text-[#edf3ff] font-bold shadow-md ring-1 ring-[#8ea8ff]'
                    : 'border-[#1e2a44] bg-[#070b14] text-[#8e9ebc] hover:border-[#33466d] hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{b.name}</span>
                  {preferences.bubbleStyle === b.id && <Check size={13} className="text-[#8ea8ff] flex-none" />}
                </div>
                <div className="text-[10.5px] text-[#788bb0] truncate">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: GENERAL TOGGLE CARDS (TACTILE BUTTONS) */}
      <div className="space-y-4">
        <label className="field-label text-xs font-bold text-[#f5f5f7]">INTERACTION PREFERENCES</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] flex flex-col justify-between gap-3 shadow-md">
            <div>
              <b className="text-xs font-bold text-white block">Ambient Parallax</b>
              <p className="text-[11px] text-[#8094b8] mt-1 leading-relaxed">
                Subtle celestial background motion reacting to mouse cursor.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, motion: !preferences.motion })}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                preferences.motion
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.04] text-[#788cae] border border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${preferences.motion ? 'bg-emerald-400' : 'bg-[#63728f]'}`} />
              <span>{preferences.motion ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] flex flex-col justify-between gap-3 shadow-md">
            <div>
              <b className="text-xs font-bold text-white block">Compact Chat Density</b>
              <p className="text-[11px] text-[#8094b8] mt-1 leading-relaxed">
                Tighter message padding for higher information density.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, compact: !preferences.compact })}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                preferences.compact
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'bg-white/[0.04] text-[#788cae] border border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${preferences.compact ? 'bg-blue-400' : 'bg-[#63728f]'}`} />
              <span>{preferences.compact ? 'Compact' : 'Comfortable'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] flex flex-col justify-between gap-3 shadow-md">
            <div>
              <b className="text-xs font-bold text-white block">Interactive Audio Tones</b>
              <p className="text-[11px] text-[#8094b8] mt-1 leading-relaxed">
                Synthesized feedback on message send, streaming, and companion taps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!preferences.soundEffects) sounds.playClick();
                setPreferences({ ...preferences, soundEffects: !preferences.soundEffects });
              }}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                preferences.soundEffects
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-white/[0.04] text-[#788cae] border border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${preferences.soundEffects ? 'bg-purple-400' : 'bg-[#63728f]'}`} />
              <span>{preferences.soundEffects ? 'Sound On' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 6: GLOBAL APPEARANCE ACTION BUTTONS */}
      <div className="pt-6 border-t border-[#1a2744] flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#788cae]">
          Appearance changes are automatically saved to your browser local storage.
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (preferences.soundEffects) sounds.playComplete();
              alert('Appearance preferences saved successfully!');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#8ea8ff] hover:bg-[#a6bdff] text-[#070b16] text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <CheckCircle2 size={14} />
            <span>Save Appearance Config</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPreferences({
                ...preferences,
                theme: 'midnight',
                themeGradientTarget: 'both',
                font: 'dm-sans',
                bubbleStyle: 'glass',
                motion: true,
                compact: false,
                customTheme: {
                  enabled: false,
                  gradientStart: '#1e053a',
                  gradientEnd: '#003b46',
                  gradientAngle: 135,
                  accentColor: '#8ea8ff',
                  glowIntensity: 50,
                  backgroundTint: '#040711',
                  gradientTarget: 'both',
                },
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e9ebc] hover:text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw size={13} />
            <span>Reset to Factory Appearance</span>
          </button>
        </div>
      </div>

      {/* GRADIENT PLACEMENT PROMPT MODAL */}
      {pendingSelection && (
        <div
          className="modal-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) setPendingSelection(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#8ea8ff]" />
                <span className="text-xs font-bold tracking-tight text-[#f5f5f7]">
                  APPLY GRADIENT ATMOSPHERE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPendingSelection(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Choose Gradient Placement
                </h3>
                <p className="text-xs text-[#8da0c4] leading-relaxed">
                  Do you want to set this gradient for the <b>front page (landing page)</b> or do you want to set it as a <b>background</b>?
                </p>
              </div>

              {/* Preview banner */}
              <div
                className="h-14 w-full rounded-xl flex items-center justify-between px-4 border border-white/20 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${pendingSelection.previewColors[0]} 0%, ${pendingSelection.previewColors[1]} 50%, ${pendingSelection.previewColors[2] || pendingSelection.previewColors[1]} 100%)`,
                }}
              >
                <span className="text-xs font-bold text-white drop-shadow">
                  {pendingSelection.title}
                </span>
                <span className="text-[11px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded border border-white/20">
                  Ready
                </span>
              </div>

              {/* 3 Prominent Decision Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => confirmGradientPlacement('background')}
                  className="w-full p-3.5 rounded-xl border border-white/10 hover:border-[#2997ff] bg-white/[0.04] hover:bg-blue-500/15 flex items-center justify-between text-left transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#2997ff] flex items-center justify-center flex-none">
                      <Orbit size={16} />
                    </div>
                    <div>
                      <b className="text-xs font-bold text-white block group-hover:text-blue-300">
                        Set as App Background
                      </b>
                      <span className="text-[11px] text-[#788cae]">
                        Illuminates workspace and chat background
                      </span>
                    </div>
                  </div>
                  <ArrowUp size={14} className="text-[#788cae] group-hover:text-white -rotate-45" />
                </button>

                <button
                  type="button"
                  onClick={() => confirmGradientPlacement('landing')}
                  className="w-full p-3.5 rounded-xl border border-white/10 hover:border-purple-400 bg-white/[0.04] hover:bg-purple-500/15 flex items-center justify-between text-left transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-none">
                      <Home size={16} />
                    </div>
                    <div>
                      <b className="text-xs font-bold text-white block group-hover:text-purple-300">
                        Set for Front Page (Landing Page)
                      </b>
                      <span className="text-[11px] text-[#788cae]">
                        Glows on the front welcome hero page
                      </span>
                    </div>
                  </div>
                  <ArrowUp size={14} className="text-[#788cae] group-hover:text-white -rotate-45" />
                </button>

                <button
                  type="button"
                  onClick={() => confirmGradientPlacement('both')}
                  className="w-full p-3.5 rounded-xl border border-white/10 hover:border-emerald-400 bg-white/[0.04] hover:bg-emerald-500/15 flex items-center justify-between text-left transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-none">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <b className="text-xs font-bold text-white block group-hover:text-emerald-300">
                        Apply to Both (Front Page & Background)
                      </b>
                      <span className="text-[11px] text-[#788cae]">
                        Unified atmosphere across full application
                      </span>
                    </div>
                  </div>
                  <Check size={14} className="text-emerald-400" />
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPendingSelection(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs text-[#86868b] hover:text-white font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TokenSaverSettings({
  preferences,
  setPreferences,
  tokenStats,
  onResetTokenStats,
}: {
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
  tokenStats: TokenStats;
  onResetTokenStats: () => void;
}) {
  const mode = preferences.tokenSaverMode;

  const MODES: { id: TokenSaverMode; name: string; percent: string; desc: string }[] = [
    {
      id: 'balanced',
      name: 'Balanced Saver (Recommended)',
      percent: '~22% saved',
      desc: 'Normalizes whitespace, strips repetitive assistant fluff, optimizes deep turn history without semantic loss.',
    },
    {
      id: 'aggressive',
      name: 'Aggressive Saver',
      percent: '~32% saved',
      desc: 'Truncates older code blocks in history, enforces strict 6-turn context window, condenses prompts.',
    },
    {
      id: 'light',
      name: 'Light Optimization',
      percent: '~12% saved',
      desc: 'Gentle whitespace and duplicate punctuation compression. Preserves 100% of historical text verbatim.',
    },
    {
      id: 'off',
      name: 'Disabled',
      percent: '0% saved',
      desc: 'Raw message history sent directly with no modifications.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* SECTION 1: HEADER & STATS METRICS */}
      <div className="space-y-6 pb-8 border-b border-[#1a2744]">
        <div>
          <div className="section-kicker">AI EFFICIENCY & CONSERVATION</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Token Saver Optimization Hub</h2>
          <p className="lead text-xs text-[#8da0c4] mt-1">
            Significantly decrease quota exhaustion, reduce latency, and extend chat lifespan by pruning redundant context tokens before sending to LLM endpoints.
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0a121e]/90 border border-[#1b3050] shadow-xl shadow-black/30">
            <span className="text-xs font-semibold text-[#7d93be] uppercase tracking-wider block">Total Tokens Saved</span>
            <b className="text-3xl font-mono text-emerald-400 block my-2">
              {tokenStats.totalTokensSaved.toLocaleString()}
            </b>
            <span className="text-xs text-[#5e77a4]">
              ~{tokenStats.totalTokensProcessed > 0 ? Math.round((tokenStats.totalTokensSaved / tokenStats.totalTokensProcessed) * 100) : 22}% average reduction
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a121e]/90 border border-[#1b3050] shadow-xl shadow-black/30">
            <span className="text-xs font-semibold text-[#7d93be] uppercase tracking-wider block">Processed Requests</span>
            <b className="text-3xl font-mono text-[#dce6ff] block my-2">
              {tokenStats.totalMessagesSent.toLocaleString()}
            </b>
            <span className="text-xs text-[#5e77a4]">optimized message turns</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a121e]/90 border border-[#1b3050] shadow-xl shadow-black/30">
            <span className="text-xs font-semibold text-[#7d93be] uppercase tracking-wider block">Estimated Quota Saved</span>
            <b className="text-3xl font-mono text-indigo-300 block my-2">
              ~{((tokenStats.totalTokensSaved / 1000) * 0.0015).toFixed(4)} USD
            </b>
            <span className="text-xs text-[#5e77a4]">standard tier cost equivalent</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: OPTIMIZATION LEVEL SELECTOR (TACTILE BUTTONS) */}
      <div className="space-y-4 pb-8 border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <label className="field-label text-xs font-bold text-[#f5f5f7]">SELECT OPTIMIZATION LEVEL</label>
          <span className="text-[11px] text-[#788cae] font-mono">4 Conservation Profiles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {MODES.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPreferences({ ...preferences, tokenSaverMode: m.id })}
              className={`p-4 sm:p-5 rounded-2xl text-left border flex flex-col justify-between gap-3 transition-all cursor-pointer shadow-md active:scale-98 ${
                mode === m.id
                  ? 'border-emerald-400 bg-[#0c1e18] ring-1 ring-emerald-400 shadow-xl shadow-emerald-950/40'
                  : 'border-[#1a253c] bg-[#070b14] hover:border-[#2f426a] hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <b className="text-sm font-bold text-[#eef4ff]">{m.name}</b>
                  </div>
                  <p className="text-xs text-[#8397be] mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
                {mode === m.id && <Check size={18} className="text-emerald-400 flex-none" />}
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                  {m.percent}
                </span>
                <span className="text-[11px] font-medium text-emerald-400/80">
                  {mode === m.id ? '● Active Profile' : 'Select Profile'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: SLIDING WINDOW HISTORY LIMIT (SLIDER + TACTILE PRESET BUTTONS) */}
      <div className="p-6 rounded-2xl bg-[#080c16]/90 border border-[#1b263f] shadow-lg space-y-4 pb-8 border-b border-[#1a2744]">
        <div className="flex justify-between items-center text-xs text-[#8da0c4]">
          <div>
            <b className="text-sm text-[#dce6ff] block">Context Window Sliding History Limit</b>
            <p className="text-xs text-[#7185aa] mt-0.5">
              Higher values retain conversational depth; lower values maximize token savings.
            </p>
          </div>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-600/30 px-3 py-1 rounded-xl text-xs flex-none">
            {preferences.maxHistoryTurns} turns
          </span>
        </div>

        <input
          type="range"
          min="2"
          max="30"
          value={preferences.maxHistoryTurns}
          onChange={e => setPreferences({ ...preferences, maxHistoryTurns: Number(e.target.value) })}
          className="w-full accent-emerald-400 cursor-pointer"
        />

        {/* Quick History Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { turns: 4, label: '4 turns (Ultra Saver)' },
            { turns: 8, label: '8 turns (Compact)' },
            { turns: 12, label: '12 turns (Standard)' },
            { turns: 20, label: '20 turns (Deep Memory)' },
            { turns: 30, label: '30 turns (Maximum)' },
          ].map(p => (
            <button
              key={p.turns}
              type="button"
              onClick={() => setPreferences({ ...preferences, maxHistoryTurns: p.turns })}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                preferences.maxHistoryTurns === p.turns
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-sm'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#8e9ebc] hover:bg-white/[0.08]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 4: ACTIONS & SAVE BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1a2744]">
        <p className="text-xs text-[#7185aa]">
          Statistics are stored locally in your browser and increment on every prompt dispatch.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (preferences.soundEffects) sounds.playComplete();
              alert('Token Saver configuration saved successfully!');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <CheckCircle2 size={14} />
            <span>Save Saver Config</span>
          </button>
          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, tokenSaverMode: 'balanced', maxHistoryTurns: 12 })}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e9ebc] hover:text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Zap size={13} className="text-emerald-400" />
            <span>Apply Recommended Profile</span>
          </button>
          <button
            type="button"
            onClick={onResetTokenStats}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-300 hover:text-rose-100 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95 flex-none"
          >
            <RotateCcw size={14} />
            <span>Reset Counters</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function PetSettings({
  preferences,
  setPreferences,
}: {
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
}) {
  const [testMood, setTestMood] = useState<'idle' | 'typing' | 'thinking' | 'happy' | 'sleeping'>('happy');

  return (
    <div className="space-y-10">
      {/* SECTION 1: HEADER & PLAYGROUND */}
      <div className="space-y-6 pb-8 border-b border-[#1a2744]">
        <div>
          <div className="section-kicker">VIRTUAL COMPANIONS</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Interactive AI Companions</h2>
          <p className="lead text-xs text-[#8da0c4] mt-1">
            Choose an animated companion pet that reacts to your typing, cheers during thinking states, and provides interactive feedback.
          </p>
        </div>

        {/* Interactive Pet Playground Preview */}
        <div className="p-7 rounded-3xl bg-gradient-to-b from-[#0e162b] via-[#090e1c] to-[#060912] border border-[#23355b] text-center relative overflow-hidden shadow-2xl shadow-black/50 space-y-4">
          <div className="text-xs font-mono font-semibold tracking-wider text-[#8ea8ff]">
            INTERACTIVE PLAYGROUND — CLICK TO PET!
          </div>

          <div className="flex items-center justify-center my-4">
            <PetCompanion
              petId={preferences.petId}
              position="floating"
              size={preferences.petSize}
              mood={testMood}
              soundEnabled={preferences.soundEffects}
              interactive={true}
            />
          </div>

          {/* Tactile Mood Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {(['idle', 'typing', 'thinking', 'happy', 'sleeping'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setTestMood(m)}
                className={`px-4 py-2 rounded-xl text-xs capitalize transition-all cursor-pointer font-bold active:scale-95 shadow-sm ${
                  testMood === m
                    ? 'bg-[#8ea8ff] text-[#070b16] shadow-lg shadow-[#8ea8ff]/30 ring-1 ring-white'
                    : 'bg-[#131c33] text-[#8ea8ff] hover:bg-[#1a2747] border border-[#23345a]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: PET SELECTION GRID (TACTILE CARDS) */}
      <div className="space-y-4 pb-8 border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <label className="field-label text-xs font-bold text-[#f5f5f7]">CHOOSE COMPANION ({PET_LIST.length} SPECIES)</label>
          <span className="text-[11px] text-[#788cae] font-mono">Animated Avatars</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PET_LIST.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreferences({ ...preferences, petId: p.id })}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 text-left transition-all cursor-pointer shadow-md active:scale-98 ${
                preferences.petId === p.id
                  ? 'border-[#8ea8ff] bg-[#121c32] ring-1 ring-[#8ea8ff] shadow-lg shadow-[#8ea8ff]/10'
                  : 'border-[#1b253b] bg-[#070b14] hover:border-[#32456e] hover:bg-white/[0.02]'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center flex-none bg-white/[0.04] rounded-xl border border-white/10">
                {p.id === 'none' ? (
                  <span className="text-2xl">🚫</span>
                ) : (
                  <PetArtwork petId={p.id} size={36} mood="happy" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <b className="text-sm font-bold text-[#eef3ff] block truncate">{p.name}</b>
                  {preferences.petId === p.id && <Check size={14} className="text-[#8ea8ff]" />}
                </div>
                <span className="text-xs text-[#8094b8] block line-clamp-1 mt-0.5">{p.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: SIZE & PLACEMENT (TACTILE SEGMENTED BUTTONS) */}
      {preferences.petId !== 'none' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <label className="field-label text-xs font-bold text-[#8ea8ff]">COMPANION SCALE</label>
              <span className="text-[11px] font-mono text-[#788cae]">3 Sizes</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { id: 'small', name: 'Small', px: '24px' },
                { id: 'medium', name: 'Medium', px: '32px' },
                { id: 'large', name: 'Large', px: '44px' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, petSize: s.id as 'small' | 'medium' | 'large' })}
                  className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer active:scale-98 shadow-sm ${
                    preferences.petSize === s.id
                      ? 'border-[#8ea8ff] bg-[#141f38] text-[#edf3ff] font-bold shadow-md ring-1 ring-[#8ea8ff]'
                      : 'border-[#1e2a44] bg-[#070b14] text-[#8e9ebc] hover:border-[#33466d]'
                  }`}
                >
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-[10px] text-[#7185aa] font-mono mt-0.5">{s.px}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <label className="field-label text-xs font-bold text-[#8ea8ff]">DOCK POSITION</label>
              <span className="text-[11px] font-mono text-[#788cae]">3 Anchors</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { id: 'bottom-right', name: 'Corner', sub: 'Floating' },
                { id: 'composer', name: 'Composer', sub: 'Input Bar' },
                { id: 'header', name: 'Header', sub: 'Navbar' },
              ].map(pos => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, petPosition: pos.id as PetPosition })}
                  className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer active:scale-98 shadow-sm ${
                    preferences.petPosition === pos.id
                      ? 'border-[#8ea8ff] bg-[#141f38] text-[#edf3ff] font-bold shadow-md ring-1 ring-[#8ea8ff]'
                      : 'border-[#1e2a44] bg-[#070b14] text-[#8e9ebc] hover:border-[#33466d]'
                  }`}
                >
                  <div className="font-semibold">{pos.name}</div>
                  <div className="text-[10px] text-[#7185aa] mt-0.5">{pos.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SAVE & ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#1a2744]">
        <span className="text-xs text-[#788cae]">Interactive companions automatically persist across browser restarts.</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (preferences.soundEffects) sounds.playComplete();
              alert('Companion pet preferences saved successfully!');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#8ea8ff] hover:bg-[#a6bdff] text-[#070b16] text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <CheckCircle2 size={14} />
            <span>Save Pet Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, petId: 'none' })}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e9ebc] hover:text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Disable Companion</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ThinkingSettings({
  preferences,
  setPreferences,
}: {
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
}) {
  const [simulating, setSimulating] = useState(false);

  const triggerSimulation = () => {
    setSimulating(true);
    if (preferences.soundEffects) sounds.playThinking();
    setTimeout(() => {
      setSimulating(false);
      if (preferences.soundEffects) sounds.playComplete();
    }, 3000);
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: HEADER & LIVE PREVIEW */}
      <div className="space-y-6 pb-8 border-b border-[#1a2744]">
        <div>
          <div className="section-kicker">NEURAL DYNAMICS</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Thinking Animations & Latency</h2>
          <p className="lead text-xs text-[#8da0c4] mt-1">
            Customize how model deliberation and neural synthesis are rendered before and during streaming responses.
          </p>
        </div>

        {/* Live Thinking Preview Box */}
        <div className="p-6 rounded-2xl bg-[#070c17] border border-[#1d2a45] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-[#8ea8ff]">
              LIVE THINKING INDICATOR PREVIEW
            </span>
            <button
              type="button"
              onClick={triggerSimulation}
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/35 border border-blue-400/40 text-blue-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Sparkles size={13} />
              <span>{simulating ? 'Deliberating Burst...' : '⚡ Test Burst Animation'}</span>
            </button>
          </div>

          <ThinkingIndicator
            style={preferences.thinkingStyle}
            showTimer={preferences.showThinkingTimer}
            modelName="Aplx Neural Engine"
          />
        </div>
      </div>

      {/* SECTION 2: SELECT THINKING VISUALIZATION (TACTILE CARDS) */}
      <div className="space-y-4 pb-8 border-b border-[#1a2744]">
        <div className="flex items-center justify-between">
          <label className="field-label text-xs font-bold text-[#f5f5f7]">
            SELECT THINKING VISUALIZATION ({THINKING_STYLES.length} STYLES)
          </label>
          <span className="text-[11px] text-[#788cae] font-mono">Real-time Shaders</span>
        </div>

        <div className="space-y-3">
          {THINKING_STYLES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setPreferences({ ...preferences, thinkingStyle: s.id })}
              className={`w-full p-4 sm:p-5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer shadow-md active:scale-98 ${
                preferences.thinkingStyle === s.id
                  ? 'border-[#8ea8ff] bg-[#121c32] ring-1 ring-[#8ea8ff] shadow-lg shadow-[#8ea8ff]/10'
                  : 'border-[#1b253b] bg-[#070b14] hover:border-[#32456e] hover:bg-white/[0.02]'
              }`}
            >
              <div>
                <b className="text-sm font-semibold text-[#eef3ff] block">{s.name}</b>
                <span className="text-xs text-[#8094b8] block mt-1 leading-relaxed">{s.desc}</span>
              </div>
              {preferences.thinkingStyle === s.id && <Check size={20} className="text-[#8ea8ff] flex-none ml-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: TIMER DISPLAY (TACTILE BUTTON CARD) */}
      <div className="p-5 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <b className="text-sm font-bold text-white block">Display Deliberation Timer</b>
          <p className="text-xs text-[#8094b8] mt-0.5">
            Shows exact seconds elapsed while model generates initial token headers (e.g. 1.2s).
          </p>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, showThinkingTimer: true })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              preferences.showThinkingTimer
                ? 'bg-blue-500 text-white shadow-md ring-1 ring-blue-400'
                : 'bg-white/[0.04] text-[#8e9ebc] border border-white/[0.08] hover:bg-white/[0.08]'
            }`}
          >
            Show Timer
          </button>
          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, showThinkingTimer: false })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !preferences.showThinkingTimer
                ? 'bg-blue-500 text-white shadow-md ring-1 ring-blue-400'
                : 'bg-white/[0.04] text-[#8e9ebc] border border-white/[0.08] hover:bg-white/[0.08]'
            }`}
          >
            Hide Timer
          </button>
        </div>
      </div>

      {/* SECTION 4: SAVE & ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#1a2744]">
        <span className="text-xs text-[#788cae]">Thinking animation styles are synchronized across chat sessions.</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (preferences.soundEffects) sounds.playComplete();
              alert('Thinking deliberation settings saved successfully!');
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <CheckCircle2 size={14} />
            <span>Save Thinking Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, thinkingStyle: 'shimmer', showThinkingTimer: true })}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e9ebc] hover:text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw size={13} />
            <span>Reset Thinking Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function PersonaSettings({
  preferences,
  setPreferences,
}: {
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
}) {
  return (
    <div className="space-y-10">
      {/* SECTION 1: HEADER & PERSONA SELECTION */}
      <div className="space-y-6 pb-8 border-b border-[#1a2744]">
        <div>
          <div className="section-kicker">AI BEHAVIOR & PERSONA</div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Instructions & Creativity</h2>
          <p className="lead text-xs text-[#8da0c4] mt-1">
            Shape how the AI assistant reasons, responds, and calibrates its tone across all discussions.
          </p>
        </div>

        {/* Persona Selection (Tactile Cards) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="field-label text-xs font-bold text-[#f5f5f7]">CHOOSE AI PERSONA ({PERSONAS.length} PROFILES)</label>
            <span className="text-[11px] text-[#788cae] font-mono">System Calibration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPreferences({
                    ...preferences,
                    persona: p.id,
                    customSystemPrompt: p.id === 'custom' ? preferences.customSystemPrompt : p.prompt,
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-md active:scale-98 flex flex-col justify-between ${
                  preferences.persona === p.id
                    ? 'border-[#8ea8ff] bg-[#121c32] ring-1 ring-[#8ea8ff] shadow-lg shadow-[#8ea8ff]/10'
                    : 'border-[#1b253b] bg-[#070b14] hover:border-[#32456e] hover:bg-white/[0.02]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <b className="text-sm font-semibold text-[#eef3ff] block">{p.name}</b>
                    {preferences.persona === p.id && <Check size={14} className="text-[#8ea8ff]" />}
                  </div>
                  <span className="text-xs text-[#8094b8] block mt-1 leading-relaxed">{p.desc}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10.5px] font-medium text-[#8ea8ff]">
                  {preferences.persona === p.id ? '● Active Persona' : 'Select Persona'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: CUSTOM PROMPT BOX WITH TACTILE TEMPLATES */}
      <div className="p-5 rounded-2xl bg-[#0b101e]/80 border border-[#1d2b48] space-y-3 pb-8 border-b border-[#1a2744] shadow-md">
        <div className="flex items-center justify-between">
          <label className="field-label text-xs font-bold text-[#8ea8ff]">SYSTEM INSTRUCTION PROMPT</label>
          <span className="text-[11px] font-mono text-[#788cae]">Custom Directives</span>
        </div>

        <textarea
          rows={4}
          value={preferences.customSystemPrompt}
          onChange={e => setPreferences({ ...preferences, customSystemPrompt: e.target.value, persona: 'custom' })}
          placeholder="Enter custom instructions or personality directives..."
          className="w-full p-3.5 rounded-xl bg-[#060a12] border border-[#202e4d] text-sm text-[#dce6ff] focus:border-[#8ea8ff] outline-none font-mono resize-y shadow-inner"
        />

        {/* Quick Prompt Template Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-[#7185aa] font-semibold">Quick Directives:</span>
          {[
            { label: '+ Concise Answers', text: 'Answer in concise, high-density bullet points. Avoid filler introductions.' },
            { label: '+ Strict Code Only', text: 'Provide production-grade code snippets first, followed by a 2-sentence architecture explanation.' },
            { label: '+ Socratic Tutor', text: 'Guide the user with insightful questions and deep conceptual explanations.' },
            { label: 'Clear Prompt', text: '' },
          ].map(tpl => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => setPreferences({ ...preferences, customSystemPrompt: tpl.text, persona: 'custom' })}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-[11px] font-medium text-[#8e9ebc] hover:text-white transition-all cursor-pointer"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: TEMPERATURE CREATIVITY SLIDER & QUICK BUTTONS */}
      <div className="p-6 rounded-2xl bg-[#080c16]/90 border border-[#1b263f] shadow-lg space-y-3">
        <div className="flex justify-between text-xs text-[#8da0c4]">
          <b className="text-sm text-[#dce6ff]">Model Temperature (Creativity Index)</b>
          <span className="font-mono font-bold text-[#8ea8ff] bg-[#14203d] border border-[#24355e] px-2.5 py-0.5 rounded-lg">
            {preferences.temperature.toFixed(2)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1.5"
          step="0.05"
          value={preferences.temperature}
          onChange={e => setPreferences({ ...preferences, temperature: Number(e.target.value) })}
          className="w-full accent-[#8ea8ff] cursor-pointer"
        />

        {/* Quick Temperature Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { temp: 0.0, label: '0.0 Precise / Code' },
            { temp: 0.3, label: '0.3 Analytical' },
            { temp: 0.7, label: '0.7 Balanced' },
            { temp: 1.0, label: '1.0 Creative' },
            { temp: 1.3, label: '1.3 Inventive' },
          ].map(p => (
            <button
              key={p.temp}
              type="button"
              onClick={() => setPreferences({ ...preferences, temperature: p.temp })}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                Math.abs(preferences.temperature - p.temp) < 0.05
                  ? 'bg-[#8ea8ff]/25 border-[#8ea8ff] text-white font-bold shadow-sm'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#8e9ebc] hover:bg-white/[0.08]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 4: SAVE & ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#1a2744]">
        <span className="text-xs text-[#788cae]">System directives calibrate response tone and technical granularity.</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (preferences.soundEffects) sounds.playComplete();
              alert('Persona settings saved successfully!');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#8ea8ff] hover:bg-[#a6bdff] text-[#070b16] text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <CheckCircle2 size={14} />
            <span>Save Persona Settings</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const def = PERSONAS.find(p => p.id === 'helpful');
              setPreferences({
                ...preferences,
                persona: 'helpful',
                customSystemPrompt: def ? def.prompt : '',
                temperature: 0.7,
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e9ebc] hover:text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw size={13} />
            <span>Reset Persona Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DataManagementSettings({
  onExportChat,
  onImportChat,
  onClearAllData,
  onViewPrivacy,
}: {
  onExportChat: (format: 'json' | 'markdown' | 'text') => void;
  onImportChat: (jsonStr: string) => void;
  onClearAllData: () => void;
  onViewPrivacy?: () => void;
}) {
  const [importJson, setImportJson] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleImport = () => {
    if (!importJson.trim()) return;
    try {
      onImportChat(importJson.trim());
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
      setImportJson('');
    } catch {
      alert('Invalid JSON chat file');
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: HEADER & EXPORT */}
      <div className="space-y-6 pb-8 border-b border-[#1a2744]">
        <div>
          <div className="section-kicker">DATA & PRIVACY</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Data Portability & Storage</h2>
          <p className="lead text-xs text-[#8da0c4] mt-1">
            Your conversations and configuration never touch a remote Aplx database. Export, backup, or import anytime.
          </p>
        </div>

        {/* Export tools (Tactile Buttons) */}
        <div className="p-6 rounded-2xl bg-[#0b101e]/90 border border-[#1f2d4a] shadow-lg space-y-3.5">
          <b className="text-sm font-semibold text-[#eef3ff] block">Export Conversation History</b>
          <p className="text-xs text-[#8498be] leading-relaxed">
            Save your current discussion turns directly to your device in formatted structures.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onExportChat('markdown')}
              className="inline-flex items-center gap-2 text-xs py-3 px-4 rounded-xl border border-[#253556] bg-[#11192e] hover:bg-[#182442] hover:border-[#384f80] text-[#dce6ff] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Download size={14} className="text-[#8ea8ff]" />
              <span>Export as Markdown (.md)</span>
            </button>
            <button
              type="button"
              onClick={() => onExportChat('json')}
              className="inline-flex items-center gap-2 text-xs py-3 px-4 rounded-xl border border-[#253556] bg-[#11192e] hover:bg-[#182442] hover:border-[#384f80] text-[#dce6ff] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Download size={14} className="text-emerald-400" />
              <span>Export as JSON (.json)</span>
            </button>
            <button
              type="button"
              onClick={() => onExportChat('text')}
              className="inline-flex items-center gap-2 text-xs py-3 px-4 rounded-xl border border-[#253556] bg-[#11192e] hover:bg-[#182442] hover:border-[#384f80] text-[#dce6ff] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Download size={14} className="text-purple-400" />
              <span>Export as Plain Text (.txt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: IMPORT CHAT JSON */}
      <div className="p-6 rounded-2xl bg-[#0b101e]/90 border border-[#1f2d4a] shadow-lg space-y-3.5 pb-8 border-b border-[#1a2744]">
        <b className="text-sm font-semibold text-[#eef3ff] block">Import Conversation JSON</b>
        <p className="text-xs text-[#8498be] leading-relaxed">
          Paste previously exported JSON history to restore your chat session.
        </p>
        <textarea
          rows={3}
          value={importJson}
          onChange={e => setImportJson(e.target.value)}
          placeholder='[{"role":"user","content":"..."},{"role":"model","content":"..."}]'
          className="w-full p-3 rounded-xl bg-[#060a12] border border-[#202e4d] text-xs font-mono text-[#dce6ff] focus:border-[#8ea8ff] outline-none shadow-inner"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleImport}
            disabled={!importJson.trim()}
            className="primary inline-flex items-center gap-2 text-xs py-2.5 px-4 rounded-xl bg-[#8ea8ff] hover:bg-[#a6bdff] text-[#070b16] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-95"
          >
            <Upload size={14} />
            <span>Import into Current Session</span>
          </button>
          {importSuccess && <span className="text-xs text-emerald-400 font-medium">✓ Chat session restored successfully!</span>}
        </div>
      </div>

      {/* SECTION 3: FULL BACKUP & DIAGNOSTICS */}
      <div className="p-6 rounded-2xl bg-[#0b101e]/90 border border-[#1f2d4a] shadow-lg space-y-3.5 pb-8 border-b border-[#1a2744]">
        <b className="text-sm font-semibold text-[#eef3ff] block">Full Backup & Diagnostics</b>
        <p className="text-xs text-[#8498be] leading-relaxed">
          Download complete state backups or system diagnostics log for troubleshooting and auditing.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              let storedPref = null;
              try {
                const raw = localStorage.getItem('aplx_preferences_v1');
                if (raw) storedPref = JSON.parse(raw);
              } catch {}
              const backup = {
                timestamp: new Date().toISOString(),
                version: '1.7',
                preferences: storedPref || 'Default System Preferences',
              };
              const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `aplx-system-backup-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#11192e] hover:bg-[#182442] border border-[#253556] text-[#dce6ff] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <Download size={14} className="text-[#8ea8ff]" />
            <span>Download Backup Package (.json)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const diag = `APLX SYSTEM DIAGNOSTICS REPORT\nGenerated: ${new Date().toLocaleString()}\nUser Agent: ${navigator.userAgent}\nStorage Key Count: ${localStorage.length}\nScreen: ${window.innerWidth}x${window.innerHeight}\nStatus: OK`;
              const blob = new Blob([diag], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `aplx-diagnostics-${Date.now()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#11192e] hover:bg-[#182442] border border-[#253556] text-[#dce6ff] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <Download size={14} className="text-emerald-400" />
            <span>Download Diagnostics Log (.txt)</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: WIPE DATA (TACTILE RED DANGER BUTTON) */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-between gap-4 shadow-md">
        <div>
          <b className="text-sm text-rose-200 block">Erase Local Browser Data</b>
          <p className="text-xs text-rose-300/70 mt-0.5">Clears stored API keys, custom themes, and token counters from this browser.</p>
        </div>
        <button
          type="button"
          onClick={onClearAllData}
          className="px-4 py-2.5 rounded-xl bg-rose-900/50 hover:bg-rose-800/70 border border-rose-700/60 text-rose-100 text-xs font-bold transition-all cursor-pointer flex-none inline-flex items-center gap-2 shadow-md active:scale-95"
        >
          <Trash2 size={14} />
          <span>Clear All Data</span>
        </button>
      </div>

      {/* SECTION 5: LEGAL NOTICE & LIMITATION OF LIABILITY SUMMARY */}
      <div className="p-6 rounded-2xl bg-[#090d19] border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-none shadow-md shadow-amber-950/40">
              <Scale size={18} />
            </div>
            <div>
              <span className="text-[10.5px] font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                <FileText size={12} /> LEGAL NOTICE & LIMITATION OF LIABILITY
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Allocation of Responsibilities & Legal Terms Summary
              </h3>
            </div>
          </div>
          {onViewPrivacy && (
            <button
              type="button"
              onClick={onViewPrivacy}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Read Full Legal Notice</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>

        <div className="text-xs text-[#9eb0d2] leading-relaxed space-y-3 font-sans pt-1">
          <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-2">
            <div className="font-semibold text-[#f0f4ff] flex items-center gap-2 text-xs">
              <AlertTriangle size={14} className="text-amber-400 flex-none" />
              <span>1. Limitation of Liability & Scope of Responsibility</span>
            </div>
            <p className="text-[11.5px] text-[#8fa1c4] leading-relaxed">
              To the maximum extent permitted by applicable law, the developer(s), authors, and contributors of <strong>Aplx</strong> (<span className="text-[#c0d2f6]">"the Developer"</span>) are not liable for losses, damages, or claims arising from user configurations, choice of AI providers, submitted prompts, generated outputs, or actions taken in reliance on AI results. Aplx is an open-source client utility; users retain primary control and responsibility over their credentials, operational prompts, and downstream deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <span className="text-[10.5px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                2. USER DISCRETION & DIRECT ROUTING
              </span>
              <p className="text-[11px] text-[#8294b6] leading-normal">
                Prompts, configurations, API keys, and file attachments are initiated directly by the user from their browser to third-party AI provider endpoints. The Developer maintains no intermediary server or editorial oversight.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <span className="text-[10.5px] font-mono font-bold text-amber-300 flex items-center gap-1">
                3. "AS-IS" & "AS-AVAILABLE"
              </span>
              <p className="text-[11px] text-[#8294b6] leading-normal">
                Aplx is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Nothing in this notice excludes or limits statutory consumer rights that cannot be lawfully waived under applicable law.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <span className="text-[10.5px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                4. THIRD-PARTY PROVIDER TERMS
              </span>
              <p className="text-[11px] text-[#8294b6] leading-normal">
                Third-party AI providers (e.g., Google, Anthropic, OpenAI) process data under their own independent terms and privacy policies. The user is responsible for reviewing and complying with provider terms and billing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <span className="text-[10.5px] font-mono font-bold text-rose-300 flex items-center gap-1">
                5. JURISDICTION-AWARE COMPLIANCE
              </span>
              <p className="text-[11px] text-[#8294b6] leading-normal">
                Users agree to use Aplx in compliance with applicable local and international laws. Mandatory statutory rights under consumer protection and data protection frameworks prevail over conflicting disclaimer terms.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/[0.07] border border-amber-500/25 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-amber-400 flex-none mt-0.5" />
            <span>
              <strong>Notice:</strong> This summary describes Aplx's architecture and responsibilities to the maximum extent permitted by applicable law. For complete disclosures including India-specific and international frameworks, please consult the comprehensive Privacy & Legal Notice.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
