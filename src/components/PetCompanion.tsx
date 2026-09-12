import { useState, useEffect, useRef } from 'react';
import type { PetId, PetPosition } from '../types';
import { sounds } from '../lib/audio';
import { PetArtwork } from './PetArtwork';

export type PetMood = 'idle' | 'typing' | 'thinking' | 'happy' | 'sleeping';

type PetProps = {
  petId: PetId;
  position: PetPosition;
  size: 'small' | 'medium' | 'large';
  mood: PetMood;
  soundEnabled: boolean;
  interactive?: boolean;
};

export const PET_DATABASE: Record<
  PetId,
  {
    name: string;
    avatar: string;
    desc: string;
    dialogue: { idle: string; happy: string; typing: string; thinking: string };
  }
> = {
  fox: {
    name: 'Cyber Fox',
    avatar: '🦊',
    desc: 'Quick-witted, agile companion with glowing cybernetic visor and neon tail.',
    dialogue: {
      idle: 'Scanning starways... Ready for your next idea! 🦊',
      happy: 'Tail wagging at 100%! Yay! ✨',
      typing: 'Ooh, what are we creating next?',
      thinking: 'Synthesizing neural pathways...',
    },
  },
  cat: {
    name: 'Celestial Cat',
    avatar: '🐱',
    desc: 'Purring cosmic feline with floating stardust and starlight aura.',
    dialogue: {
      idle: 'Watching cosmic dust float by 🐾',
      happy: 'Purrrrrrr! Best prompt ever! 💖',
      typing: 'Watching your keystrokes intently...',
      thinking: 'Chasing thoughts in the void...',
    },
  },
  bunny: {
    name: 'Pixel Bunny',
    avatar: '🐰',
    desc: 'Bouncy hyper-speed rabbit that munches on compressed tokens.',
    dialogue: {
      idle: 'Hop into tomorrow! 🐰',
      happy: 'Wheeeeee! Rocket fueled! 🎉',
      typing: 'Fast fingers! What are we writing?',
      thinking: 'Calculating quantum hops...',
    },
  },
  dragon: {
    name: 'Cosmic Dragon',
    avatar: '🐉',
    desc: 'Ancient mystical dragon guardian protecting your private keys.',
    dialogue: {
      idle: 'Guarding your private keys 🐉',
      happy: 'Sparkling flame burst! 🔥✨',
      typing: 'Dragon eyes watching...',
      thinking: 'Breathing cosmic knowledge...',
    },
  },
  slime: {
    name: 'Slime Bob',
    avatar: '💧',
    desc: 'Playful gelatinous blob that jiggles happily with every prompt.',
    dialogue: {
      idle: '*Squish squish* Bouncing along 💧',
      happy: 'Jiggle jiggle! Splish splash! ✨',
      typing: 'Blob mode on!',
      thinking: '*Goo ripple effect*...',
    },
  },
  robo: {
    name: 'Robo Orb',
    avatar: '🤖',
    desc: 'Precision AI bot computing token conservation algorithms.',
    dialogue: {
      idle: 'Status: Optimal. Awaiting instructions. 🤖',
      happy: 'EFFICIENCY RATING: 100%! 🌟',
      typing: 'BUFFERING KEYSTROKES...',
      thinking: 'QUERYING NEURAL MESH...',
    },
  },
  shiba: {
    name: 'Shiba Sparky',
    avatar: '🐕',
    desc: 'Astronaut doge on an exploratory interstellar journey.',
    dialogue: {
      idle: 'Much space, very AI! 🐕',
      happy: 'SUCH WOW! MUCH LOVE! 💖',
      typing: 'Very excite! Ready to launch!',
      thinking: 'Much think, such concentration...',
    },
  },
  none: {
    name: 'No Companion',
    avatar: '🚫',
    desc: 'Minimalist mode without companion avatars.',
    dialogue: {
      idle: '',
      happy: '',
      typing: '',
      thinking: '',
    },
  },
};

export const PET_DIALOGUES: Record<
  PetId,
  { idle: string[]; happy: string[]; thinking: string[]; typing: string[] }
> = {
  fox: {
    idle: ['Scanning starways...', 'All systems ready!', 'Hunting for bugs 🦊', 'Foxy insights online!'],
    happy: ['Yay! Great conversation! 💖', 'High five, human!', 'Tail wagging at 100%! ✨'],
    thinking: ['Synthesizing neural paths...', 'Decrypting cosmic data...', 'Fox ears locked in!'],
    typing: ['Ooh, what are we asking?!', 'Listening closely...', 'Ready!'],
  },
  cat: {
    idle: ['Purrrrr...', 'Watching cosmic dust float by 🐾', 'Nap time soon?', 'Meow-gical computing!'],
    happy: ['Purrrrrrr! Best prompt ever! 💖', 'Paw-some answer!', 'You give good pets ✨'],
    thinking: ['Chasing thoughts in the void...', 'Contemplating the universe...', 'Paws on keyboard...'],
    typing: ['Type type type!', 'Ooh exciting input...', 'Watching your keys!'],
  },
  bunny: {
    idle: ['Boing! 🐰', 'Nibbling on compressed data', 'Hop into tomorrow!', 'Ears perked up!'],
    happy: ['Wheeeeee! 🎉', 'Super speedy response!', 'Carrot rocket fueled! 🚀'],
    thinking: ['Calculating quantum hops...', 'Processing at warp speed...', 'Brain spinning!'],
    typing: ['Fast fingers!', 'What are we writing?', 'Hop hop!'],
  },
  dragon: {
    idle: ['Guarding your private keys 🐉', 'Warm flame idling...', 'Cosmic embers glowing', 'Roar of intelligence!'],
    happy: ['Sparkling flame burst! 🔥✨', 'Wisdom ignited!', 'Proud dragon nod!'],
    thinking: ['Breathing cosmic knowledge...', 'Gathering ancient fire...', 'Forging response...'],
    typing: ['Incinerating typos...', 'Dragon eyes watching...', 'Speak, traveler!'],
  },
  slime: {
    idle: ['*Squish squish*', 'Bouncing along 💧', 'Gooey and happy!', 'Gelatinous joy!'],
    happy: ['*Bouncing happily!* 💖', 'Jiggle jiggle! ✨', 'Splish splash!'],
    thinking: ['Absorbing inputs...', '*Goo ripple effect*...', 'Expanding brain...'],
    typing: ['*Watching intently*', 'Wiggle wiggle!', 'Blob mode on!'],
  },
  robo: {
    idle: ['BEEP BOOP 🤖', 'Status: Optimal', 'Awaiting instruction', 'Telemetry clear.'],
    happy: ['EFFICIENCY RATING: 100%! 🌟', 'DOPAMINE PROTOCOL ACTIVATED', 'EXCELLENT INTERACTION'],
    thinking: ['QUERYING NEURAL MESH...', 'SYNTHESIS IN PROGRESS...', 'COMPUTING TOKENS...'],
    typing: ['BUFFERING KEYSTROKES...', 'INPUT DETECTED', 'PROCESSING...'],
  },
  shiba: {
    idle: ['Much space, very AI! 🐕', 'Astronaut doge on duty', 'Sniffing tokens...', 'Good vibes only!'],
    happy: ['SUCH WOW! 🌟', 'VERY SMART! MUCH LOVE! 💖', 'TAIL HELICOPTER GO BRRR!'],
    thinking: ['Much think...', 'Very ponder...', 'Such concentration!'],
    typing: ['Watching you type!', 'Very excite!', 'Ready to launch!'],
  },
  none: {
    idle: [],
    happy: [],
    thinking: [],
    typing: [],
  },
};

export function PetCompanion({
  petId,
  position,
  size,
  mood,
  soundEnabled,
  interactive = true,
}: PetProps) {
  const [speech, setSpeech] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [currentMood, setCurrentMood] = useState<PetMood>(mood);
  const speechTimer = useRef<number | null>(null);

  useEffect(() => {
    setCurrentMood(mood);
    if (petId === 'none') return;

    // Pick dialogue when mood changes
    const pool = PET_DIALOGUES[petId]?.[mood === 'sleeping' ? 'idle' : mood] || [];
    if (pool.length > 0 && Math.random() > 0.4) {
      setSpeech(pool[Math.floor(Math.random() * pool.length)]);
      if (speechTimer.current) clearTimeout(speechTimer.current);
      speechTimer.current = window.setTimeout(() => setSpeech(null), 3800);
    }
  }, [mood, petId]);

  if (petId === 'none') return null;

  const handlePetClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (soundEnabled) sounds.playPetChirp();
    setCurrentMood('happy');

    // Add heart particle
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left - 10,
      y: e.clientY - rect.top - 20,
    };
    setHearts(prev => [...prev.slice(-4), newHeart]);

    const happyQuotes = PET_DIALOGUES[petId]?.happy || ['*Happy noises* 💖'];
    setSpeech(happyQuotes[Math.floor(Math.random() * happyQuotes.length)]);

    if (speechTimer.current) clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => {
      setSpeech(null);
      setCurrentMood('idle');
    }, 3200);
  };

  const sizePixelMap = {
    small: 48,
    medium: 64,
    large: 84,
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-24 right-6 z-40',
    composer: 'absolute -top-16 right-4 z-30',
    header: 'inline-flex items-center ml-2 z-20',
    floating: 'fixed top-24 right-8 z-40',
  };

  return (
    <div className={`pet-container group select-none ${positionClasses[position]}`}>
      {/* Speech bubble */}
      {speech && (
        <div className="pet-bubble absolute bottom-full mb-2 right-0 max-w-[210px] px-3.5 py-2 rounded-xl bg-[#101422]/95 border border-[#8ea8ff55] text-[#dce6ff] text-xs shadow-2xl backdrop-blur-md animate-fade-in pointer-events-none z-50">
          <p className="leading-snug">{speech}</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#101422] border-r border-b border-[#8ea8ff55] rotate-45" />
        </div>
      )}

      {/* Floating Hearts */}
      {hearts.map(h => (
        <span
          key={h.id}
          className="absolute pointer-events-none text-rose-400 text-sm animate-float-heart"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          💖
        </span>
      ))}

      {/* Pet Avatar Graphic */}
      <button
        type="button"
        onClick={handlePetClick}
        title="Click to pet your companion!"
        className="pet-avatar-btn playful-pop relative flex items-center justify-center p-2 rounded-2xl bg-[#0b0f1a]/85 border border-[#2b354f] hover:border-[#8ea8ff] shadow-xl hover:shadow-[#6d8fff44] transition-all cursor-pointer"
      >
        <PetArtwork
          petId={petId}
          mood={currentMood}
          size={sizePixelMap[size]}
        />

        {/* Ambient status indicator */}
        {currentMood === 'thinking' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-85" />
        )}
        {currentMood === 'happy' && (
          <span className="absolute -top-1 -left-1 text-[11px] animate-bounce">✨</span>
        )}
        {currentMood === 'typing' && (
          <span className="absolute -bottom-1 -right-1 text-[10px] px-1 py-0.5 rounded-full bg-cyan-500 text-black font-bold">
            ...
          </span>
        )}
      </button>
    </div>
  );
}
