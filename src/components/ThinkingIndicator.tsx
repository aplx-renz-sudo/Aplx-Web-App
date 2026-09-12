import type { ThinkingStyle } from '../types';
import { Sparkles } from 'lucide-react';

type ThinkingProps = {
  style?: ThinkingStyle;
  showTimer?: boolean;
  modelName?: string;
  tokensSaved?: number;
};

export function ThinkingIndicator(_props: ThinkingProps) {
  return (
    <div className="my-2.5 py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-lg inline-flex items-center gap-3 select-none">
      <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400 flex-none">
        <Sparkles size={12} className="animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:200ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}
