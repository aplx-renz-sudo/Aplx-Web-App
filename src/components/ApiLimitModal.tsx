import React, { useState, useEffect } from 'react';
import { X, Droplets, Sprout, Sparkles, Settings, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { sounds } from '../lib/audio';

interface ApiLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  providerName?: string;
  details?: string;
}

export const ApiLimitModal: React.FC<ApiLimitModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  providerName,
  details,
}) => {
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aplx:hydration_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [grassTouched, setGrassTouched] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aplx:grass_touched_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        sounds.playPetChirp();
      } catch {
        // Fallback if audio context isn't ready
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrinkWater = () => {
    const next = waterGlasses + 1;
    setWaterGlasses(next);
    try {
      localStorage.setItem('aplx:hydration_count', String(next));
      sounds.playComplete();
    } catch {
      // ignore
    }
    setCelebrationToast('💧 Gulp gulp! +1 glass of water logged. Stay refreshed!');
    setTimeout(() => setCelebrationToast(null), 3000);
  };

  const handleTouchGrass = () => {
    const next = grassTouched + 1;
    setGrassTouched(next);
    try {
      localStorage.setItem('aplx:grass_touched_count', String(next));
      sounds.playComplete();
    } catch {
      // ignore
    }
    setCelebrationToast('🌱 Ahhh, nature! Grass touched successfully. Taking a mindful break!');
    setTimeout(() => {
      setCelebrationToast(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="api-limit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#0c1322] border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/60 overflow-hidden text-[#e2e8f0] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Playful Decorative Top Banner */}
        <div className="relative bg-gradient-to-r from-emerald-900/60 via-teal-900/50 to-cyan-900/60 p-6 pb-5 border-b border-emerald-500/20 text-center overflow-hidden">
          {/* Subtle nature elements in background */}
          <div className="absolute top-2 left-6 text-3xl opacity-25 select-none animate-bounce" style={{ animationDuration: '3s' }}>
            🌿
          </div>
          <div className="absolute top-4 right-8 text-2xl opacity-30 select-none animate-pulse">
            💧
          </div>
          <div className="absolute -bottom-2 right-20 text-3xl opacity-20 select-none">
            🌱
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Animated Mascot / Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 mb-3 animate-float">
            <div className="w-full h-full rounded-[14px] bg-[#070e1c] flex items-center justify-center text-3xl">
              🌱
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles size={12} className="text-emerald-400" />
            <span>Quota & Wellness Protocol Activated</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            API Limit Reached!
          </h3>
          {providerName && (
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Provider: <span className="font-semibold text-white">{providerName}</span>
            </p>
          )}
        </div>

        {/* Modal Body with the Funny Quote */}
        <div className="p-6 space-y-5">
          {/* The Exact User-Requested Fun Message */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0e192d] to-teal-950/30 border border-emerald-500/30 shadow-inner">
            <span className="absolute -top-3.5 left-6 px-2.5 py-0.5 rounded-md bg-emerald-500 text-[#071318] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Friendly Reminder
            </span>
            <p className="text-[15px] sm:text-[16px] leading-relaxed font-medium text-emerald-100 italic select-text text-center sm:text-left">
              &ldquo;Uh oh! Seems like your API has reached its limit! Seems like you were working hard, good job! But, go touch grass now and also don&apos;t forget to drink water!&rdquo;
            </p>
          </div>

          {/* Celebration Feedback Toast */}
          {celebrationToast && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium animate-fade-in">
              <CheckCircle2 size={15} className="text-emerald-400 flex-none" />
              <span>{celebrationToast}</span>
            </div>
          )}

          {/* Mini Interactive Wellness Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Drink Water Tracker */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 flex flex-col items-center justify-center gap-1 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold">
                <Droplets size={14} className="text-cyan-400" />
                <span>Hydration Log</span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">
                {waterGlasses} <span className="text-xs font-normal text-cyan-300/80">glasses</span>
              </div>
              <button
                type="button"
                onClick={handleDrinkWater}
                className="mt-1 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white text-xs font-medium border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Drink Water 💧</span>
              </button>
            </div>

            {/* Touch Grass Tracker */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 flex flex-col items-center justify-center gap-1 hover:border-emerald-400/50 transition-all">
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                <Sprout size={14} className="text-emerald-400" />
                <span>Nature Breaks</span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">
                {grassTouched} <span className="text-xs font-normal text-emerald-300/80">breaks</span>
              </div>
              <button
                type="button"
                onClick={handleTouchGrass}
                className="mt-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white text-xs font-medium border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Touch Grass 🌱</span>
              </button>
            </div>
          </div>

          {details && (
            <div className="text-[11px] text-gray-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06] font-mono break-words">
              <span className="text-gray-500">API Response:</span> {details}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleTouchGrass}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#071318] font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <Sprout size={16} />
              <span>I&apos;m Going to Touch Grass 🌱</span>
            </button>

            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-gray-200 hover:text-white font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2 flex-none"
                title="Switch to another provider key or local model"
              >
                <Settings size={15} />
                <span>Switch API Key</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
