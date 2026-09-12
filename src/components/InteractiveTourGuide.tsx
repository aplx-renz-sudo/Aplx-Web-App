import { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Cpu,
  Zap,
  Smile,
  Palette,
  Shield,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../lib/audio';
import { PetArtwork } from './PetArtwork';
import type { PetId } from '../types';

interface InteractiveTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  petId?: PetId;
  soundEnabled?: boolean;
}

export const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Aplx',
    badge: 'STAGE 01 · ARCHITECTURE',
    icon: Gamepad2,
    desc: 'Aplx is a private, client-first AI workspace. All conversations, credentials, and settings remain strictly stored in your browser.',
    tips: [
      'Direct browser-to-provider routing with zero proxy intermediary.',
      'Instant local persistence across browser reloads.',
      'Companion pets, token savings, custom themes, and reasoning indicators.',
    ],
  },
  {
    id: 'models',
    title: 'Universal AI Engine Support',
    badge: 'STAGE 02 · PROVIDERS',
    icon: Cpu,
    desc: 'Switch between leading AI engines using the model selector in the header or in Settings:',
    tips: [
      'Gemini 3.6, Gemini 3.5 & 2.5 Flash / Pro',
      'OpenAI GPT-4o, o1, o3-mini & CodeX',
      'Claude 3.7 Sonnet, Haiku & Opus',
      'xAI Grok, Mistral Le Chat, Kimi K3, MiniMax, Groq LPUs, and local Ollama',
    ],
  },
  {
    id: 'tokensaver',
    title: 'Context & Token Optimizer',
    badge: 'STAGE 03 · EFFICIENCY',
    icon: Zap,
    desc: 'Intelligently formats and optimizes conversation context before sending to LLMs, reducing token costs and accelerating inference speed.',
    tips: [
      'Cleans redundant whitespace, boilerplate formatting, and repetitive prompts.',
      'Smart sliding context pruning tailored to model limits.',
      'Real-time badge in the top bar tracking total tokens saved.',
    ],
  },
  {
    id: 'pets',
    title: 'Interactive Companion Pets',
    badge: 'STAGE 04 · COMPANIONS',
    icon: Smile,
    desc: 'Interactive virtual pets that react to your prompt workflow and thinking state.',
    tips: [
      'Fox, Cat, Bunny, Dragon, Slime, Robo Orb, and Shiba Sparky.',
      'Interact with your pet for gentle reactions and audio chirps.',
      'Pets observe generation states and celebrate completed tasks.',
    ],
  },
  {
    id: 'customizer',
    title: 'Themes & Personalization',
    badge: 'STAGE 05 · AESTHETICS',
    icon: Palette,
    desc: 'Customize typography, color accents, message styles, and thinking deliberation indicators.',
    tips: [
      'Subtle cosmic space depth with smooth pointer parallax.',
      'Tailored dark themes, clean font pairing, and sleek code blocks.',
      'Distinct thinking animation styles for complex AI deliberations.',
    ],
  },
  {
    id: 'security',
    title: 'Client-Side Security',
    badge: 'STAGE 06 · SECURITY',
    icon: Shield,
    desc: 'Configure your API keys in Settings. Keys are never transmitted to any central Aplx server.',
    tips: [
      'Independent per-provider key vault in your browser.',
      'Press ⌘K or Ctrl+K for Prompt Library and ⌘/ for Shortcuts.',
      'Use the Guide button in the toolbar anytime to reopen this walkthrough.',
    ],
  },
];

export function InteractiveTourGuide({
  isOpen,
  onClose,
  petId = 'fox',
  soundEnabled = true,
}: InteractiveTourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (soundEnabled) sounds.playClick();
    if (isLast) {
      if (soundEnabled) sounds.playComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (soundEnabled) sounds.playClick();
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const Icon = step.icon;

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: '520px' }}
      >
        {/* Top Bar */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.06em', color: '#86868b' }}>
              APLX INTERACTIVE GUIDE
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#708090' }}>
              {currentStep + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={onClose}
              className="modal-close-btn"
              title="Close Guide"
              aria-label="Close Guide"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Progress line */}
        <div style={{ width: '100%', height: '2px', background: 'rgba(255, 255, 255, 0.08)' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2997ff, #0071e3)',
              width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ flexShrink: 0, width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(41, 151, 255, 0.15)', border: '1px solid rgba(41, 151, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2997ff' }}>
              <Icon size={20} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#86868b', background: 'rgba(255, 255, 255, 0.06)', marginBottom: '4px' }}>
                {step.badge}
              </span>
              <h3 id="tour-title" style={{ fontSize: '17px', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.02em', margin: 0 }}>
                {step.title}
              </h3>
            </div>

            {/* Pet reaction */}
            {petId !== 'none' && (
              <div style={{ flexShrink: 0 }}>
                <PetArtwork petId={petId} mood="happy" size={42} />
              </div>
            )}
          </div>

          <p style={{ fontSize: '12.5px', color: '#9db2dc', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>

          {/* Key Tips List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {step.tips.map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#e5e5ea', lineHeight: '1.4' }}>
                <CheckCircle2 size={13} style={{ color: '#2997ff', flexShrink: 0, marginTop: '2px' }} />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* Steps Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingTop: '4px' }}>
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (soundEnabled) sounds.playClick();
                  setCurrentStep(idx);
                }}
                style={{
                  height: '6px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease',
                  width: currentStep === idx ? '22px' : '6px',
                  background: currentStep === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.18)',
                }}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              background: isFirst ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
              color: isFirst ? '#48484a' : '#86868b',
              cursor: isFirst ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={13} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontSize: '12px',
                color: '#86868b',
                background: 'transparent',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="primary playful-pop"
              style={{
                padding: '7px 16px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isLast ? (
                <>
                  <Sparkles size={13} className="text-blue-600" /> Start Workspace
                </>
              ) : (
                <>
                  Continue <ChevronRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
