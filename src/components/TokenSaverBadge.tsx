import { useState } from 'react';
import { Zap, ShieldCheck, RefreshCw, X, ChevronRight } from 'lucide-react';
import type { TokenSaverMode, TokenStats } from '../types';
import { resetTokenStats } from '../lib/tokenSaver';

type TokenSaverBadgeProps = {
  mode: TokenSaverMode;
  stats: TokenStats;
  onOpenSettings: () => void;
  onResetStats: (fresh: TokenStats) => void;
};

export function TokenSaverBadge({ mode, stats, onOpenSettings, onResetStats }: TokenSaverBadgeProps) {
  const [open, setOpen] = useState(false);

  const percentage = mode === 'aggressive' ? 32 : mode === 'balanced' ? 22 : mode === 'light' ? 12 : 0;
  const overallSavedPercent = stats.totalTokensProcessed > 0
    ? Math.round((stats.totalTokensSaved / stats.totalTokensProcessed) * 100)
    : percentage;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all border ${
          mode !== 'off'
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:border-emerald-400'
            : 'bg-white/[0.04] border-white/[0.08] text-[#86868b] hover:border-white/[0.15]'
        }`}
        title="Token Saver Status & Metrics"
      >
        <Zap size={11} className={mode !== 'off' ? 'text-emerald-400 fill-emerald-400' : 'text-[#636366]'} />
        <span>{mode !== 'off' ? `Token Saver ~${percentage}%` : 'Token Saver: Off'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-2xl bg-[#0c101a]/95 border border-white/[0.1] shadow-2xl z-50 text-[#f5f5f7] backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <Zap size={14} className="text-emerald-400 fill-emerald-400" />
              <span>Token Efficiency Engine</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-[#86868b] hover:text-white rounded"
            >
              <X size={14} />
            </button>
          </div>

          <div className="py-2.5 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <div className="text-[11px] text-[#86868b]">Active Mode</div>
                <div className="font-semibold text-emerald-400 capitalize text-xs">{mode} (~{percentage}% target)</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[#86868b] block text-[10px]">Tokens Saved</span>
                <span className="text-sm font-mono font-semibold text-emerald-400">
                  {stats.totalTokensSaved.toLocaleString()}
                </span>
                <span className="text-[9.5px] text-[#636366] block">
                  ~{overallSavedPercent}% saved
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[#86868b] block text-[10px]">Messages</span>
                <span className="text-sm font-mono font-semibold text-[#f5f5f7]">
                  {stats.totalMessagesSent.toLocaleString()}
                </span>
                <span className="text-[9.5px] text-[#636366] block">turns optimized</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.03] text-[#86868b] text-[10.5px] leading-relaxed flex items-start gap-1.5">
              <ShieldCheck size={14} className="text-blue-400 flex-none mt-0.5" />
              <span>
                Smartly prunes sliding context, cleans whitespace, and optimizes prompts without losing nuance.
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                const fresh = resetTokenStats();
                onResetStats(fresh);
              }}
              className="inline-flex items-center gap-1 text-[10.5px] text-[#86868b] hover:text-[#f5f5f7]"
            >
              <RefreshCw size={11} /> Reset stats
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onOpenSettings();
              }}
              className="inline-flex items-center gap-1 text-xs text-[#2997ff] hover:underline font-medium"
            >
              Configure <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
