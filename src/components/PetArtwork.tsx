import React from 'react';
import type { PetId } from '../types';
import type { PetMood } from './PetCompanion';

interface PetArtworkProps {
  petId: PetId;
  mood?: PetMood;
  size?: number | string;
  className?: string;
  animate?: boolean;
}

export function PetArtwork({
  petId,
  mood = 'idle',
  size = 80,
  className = '',
  animate = true,
}: PetArtworkProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  switch (petId) {
    case 'fox':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-bounce' : ''}`}
        >
          <defs>
            <linearGradient id="fox-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff7a18" />
              <stop offset="100%" stopColor="#e52e71" />
            </linearGradient>
            <linearGradient id="fox-tail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8a00" />
              <stop offset="70%" stopColor="#e52e71" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Bushy Animated Tail */}
          <path
            d="M 68 62 C 85 55 98 65 92 82 C 85 94 70 88 64 76 Z"
            fill="url(#fox-tail)"
            className={animate ? 'animate-tail-wag' : ''}
            style={{ transformOrigin: '65px 75px' }}
          />

          {/* Body */}
          <ellipse cx="50" cy="68" rx="22" ry="20" fill="url(#fox-body)" />
          <ellipse cx="50" cy="72" rx="14" ry="13" fill="#fff5ea" />

          {/* Ears */}
          <polygon points="30,42 22,12 44,28" fill="#e52e71" />
          <polygon points="32,38 27,18 41,28" fill="#ffe0cc" />
          <polygon points="70,42 78,12 56,28" fill="#e52e71" />
          <polygon points="68,38 73,18 59,28" fill="#ffe0cc" />

          {/* Head */}
          <polygon points="26,42 74,42 50,70" fill="url(#fox-body)" />
          <polygon points="34,42 50,70 26,42" fill="#ffffff" opacity="0.9" />
          <polygon points="66,42 50,70 74,42" fill="#ffffff" opacity="0.9" />

          {/* Cyber Visor / Brow */}
          <path
            d="M 33 39 Q 50 34 67 39"
            stroke="#00f5ff"
            strokeWidth="3"
            fill="none"
            filter="url(#neon-glow)"
          />

          {/* Eyes according to mood */}
          {mood === 'sleeping' ? (
            <g stroke="#241442" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 36 48 Q 41 53 46 48" />
              <path d="M 54 48 Q 59 53 64 48" />
            </g>
          ) : mood === 'happy' ? (
            <g stroke="#241442" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 36 49 Q 41 43 46 49" />
              <path d="M 54 49 Q 59 43 64 49" />
              <circle cx="50" cy="30" r="3" fill="#ffd700" filter="url(#neon-glow)" />
            </g>
          ) : mood === 'thinking' ? (
            <g>
              <ellipse cx="41" cy="46" rx="4" ry="4" fill="#00f5ff" />
              <ellipse cx="59" cy="44" rx="4" ry="5" fill="#00f5ff" />
              <circle cx="42" cy="45" r="1.5" fill="#ffffff" />
              <circle cx="60" cy="43" r="1.5" fill="#ffffff" />
            </g>
          ) : (
            <g>
              <ellipse cx="41" cy="46" rx="3.5" ry="4.5" fill="#1b122c" />
              <ellipse cx="59" cy="46" rx="3.5" ry="4.5" fill="#1b122c" />
              <circle cx="42" cy="44" r="1.5" fill="#ffffff" />
              <circle cx="60" cy="44" r="1.5" fill="#ffffff" />
              <circle cx="39" cy="47" r="0.8" fill="#00f5ff" />
              <circle cx="57" cy="47" r="0.8" fill="#00f5ff" />
            </g>
          )}

          {/* Nose & Whiskers */}
          <circle cx="50" cy="66" r="3.5" fill="#1b122c" />
          <line x1="22" y1="52" x2="34" y2="54" stroke="#ffd1b3" strokeWidth="1.5" />
          <line x1="22" y1="58" x2="34" y2="57" stroke="#ffd1b3" strokeWidth="1.5" />
          <line x1="78" y1="52" x2="66" y2="54" stroke="#ffd1b3" strokeWidth="1.5" />
          <line x1="78" y1="58" x2="66" y2="57" stroke="#ffd1b3" strokeWidth="1.5" />

          {/* Front Paws */}
          <ellipse cx="42" cy="85" rx="5" ry="4" fill="#fff0e6" />
          <ellipse cx="58" cy="85" rx="5" ry="4" fill="#fff0e6" />
        </svg>
      );

    case 'cat':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-float' : ''}`}
        >
          <defs>
            <linearGradient id="cat-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="60%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <radialGradient id="celestial-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbiting Stardust */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e879f9" strokeWidth="1" strokeDasharray="3 6" opacity="0.6" className="animate-spin-slow" />
          <circle cx="82" cy="30" r="2.5" fill="#fbcfe8" />
          <circle cx="20" cy="70" r="2" fill="#a5f3fc" />

          {/* Tail */}
          <path
            d="M 68 70 C 88 72 92 50 84 42 C 78 36 74 44 76 50"
            fill="none"
            stroke="url(#cat-body)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Body */}
          <ellipse cx="50" cy="65" rx="23" ry="21" fill="url(#cat-body)" />
          <ellipse cx="50" cy="68" rx="14" ry="13" fill="#fdf4ff" opacity="0.9" />

          {/* Ears */}
          <polygon points="32,38 24,14 44,25" fill="#6366f1" />
          <polygon points="33,35 28,20 42,27" fill="#f472b6" />
          <polygon points="68,38 76,14 56,25" fill="#a855f7" />
          <polygon points="67,35 72,20 58,27" fill="#f472b6" />

          {/* Head */}
          <circle cx="50" cy="44" r="21" fill="url(#cat-body)" />

          {/* Forehead Crescent Moon */}
          <path d="M 48 30 A 4 4 0 0 0 52 38 A 3 3 0 0 1 48 30" fill="#fef08a" />

          {/* Eyes */}
          {mood === 'sleeping' ? (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 38 46 Q 43 51 48 46" />
              <path d="M 52 46 Q 57 51 62 46" />
            </g>
          ) : mood === 'happy' ? (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 37 47 Q 42 41 47 47" />
              <path d="M 53 47 Q 58 41 63 47" />
              <ellipse cx="33" cy="52" rx="3" ry="1.5" fill="#f472b6" opacity="0.8" />
              <ellipse cx="67" cy="52" rx="3" ry="1.5" fill="#f472b6" opacity="0.8" />
            </g>
          ) : (
            <g>
              <ellipse cx="41" cy="45" rx="5" ry="6" fill="#fef08a" />
              <ellipse cx="59" cy="45" rx="5" ry="6" fill="#fef08a" />
              <ellipse cx="41" cy="45" rx="2.2" ry="5" fill="#1e1b4b" />
              <ellipse cx="59" cy="45" rx="2.2" ry="5" fill="#1e1b4b" />
              <circle cx="43" cy="43" r="1.5" fill="#ffffff" />
              <circle cx="61" cy="43" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Nose & Mouth */}
          <polygon points="48,52 52,52 50,54" fill="#f472b6" />
          <path d="M 46 56 Q 50 59 54 56" stroke="#ffffff" strokeWidth="1.5" fill="none" />

          {/* Whiskers */}
          <line x1="22" y1="48" x2="34" y2="50" stroke="#c084fc" strokeWidth="1.5" />
          <line x1="23" y1="54" x2="34" y2="53" stroke="#c084fc" strokeWidth="1.5" />
          <line x1="78" y1="48" x2="66" y2="50" stroke="#c084fc" strokeWidth="1.5" />
          <line x1="77" y1="54" x2="66" y2="53" stroke="#c084fc" strokeWidth="1.5" />

          {/* Paws */}
          <ellipse cx="43" cy="82" rx="5" ry="4" fill="#fdf4ff" />
          <ellipse cx="57" cy="82" rx="5" ry="4" fill="#fdf4ff" />
        </svg>
      );

    case 'bunny':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-hop' : ''}`}
        >
          <defs>
            <linearGradient id="bunny-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="bunny-ear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          {/* Long Ears */}
          <ellipse cx="38" cy="22" rx="7" ry="20" fill="url(#bunny-body)" transform="rotate(-10 38 22)" />
          <ellipse cx="38" cy="22" rx="4" ry="15" fill="url(#bunny-ear)" transform="rotate(-10 38 22)" />
          <ellipse cx="62" cy="22" rx="7" ry="20" fill="url(#bunny-body)" transform="rotate(10 62 22)" />
          <ellipse cx="62" cy="22" rx="4" ry="15" fill="url(#bunny-ear)" transform="rotate(10 62 22)" />

          {/* Body */}
          <ellipse cx="50" cy="70" rx="24" ry="20" fill="url(#bunny-body)" />
          <ellipse cx="50" cy="73" rx="15" ry="12" fill="#ffe4e6" />

          {/* Head */}
          <circle cx="50" cy="46" r="20" fill="url(#bunny-body)" />

          {/* Cyber Pixel Goggles */}
          <rect x="30" y="38" width="40" height="14" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="34" y="41" width="13" height="8" rx="2" fill="#0284c7" />
          <rect x="53" y="41" width="13" height="8" rx="2" fill="#0284c7" />
          <line x1="47" y1="45" x2="53" y2="45" stroke="#38bdf8" strokeWidth="2" />

          {/* Goggle Eyes */}
          {mood === 'happy' ? (
            <g fill="#38bdf8">
              <polygon points="37,47 41,43 45,47" />
              <polygon points="56,47 60,43 64,47" />
            </g>
          ) : (
            <g fill="#38bdf8">
              <circle cx="40" cy="45" r="2.5" fill="#38bdf8" />
              <circle cx="59" cy="45" r="2.5" fill="#38bdf8" />
              <rect x="41" y="43" width="1" height="1" fill="#ffffff" />
              <rect x="60" y="43" width="1" height="1" fill="#ffffff" />
            </g>
          )}

          {/* Cute Nose & Mouth */}
          <polygon points="48,56 52,56 50,58" fill="#f43f5e" />
          <path d="M 46 60 Q 50 62 54 60" stroke="#475569" strokeWidth="1.5" fill="none" />
          <ellipse cx="32" cy="56" rx="4" ry="2" fill="#fda4af" opacity="0.8" />
          <ellipse cx="68" cy="56" rx="4" ry="2" fill="#fda4af" opacity="0.8" />

          {/* Fluffy Feet */}
          <ellipse cx="36" cy="86" rx="8" ry="5" fill="url(#bunny-body)" />
          <ellipse cx="64" cy="86" rx="8" ry="5" fill="url(#bunny-body)" />
        </svg>
      );

    case 'dragon':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-float' : ''}`}
        >
          <defs>
            <linearGradient id="dragon-skin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="dragon-wings" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Wings */}
          <path
            d="M 28 44 C 10 32 4 48 18 60 C 26 56 28 50 30 46 Z"
            fill="url(#dragon-wings)"
            opacity="0.9"
            className="animate-wing-left"
          />
          <path
            d="M 72 44 C 90 32 96 48 82 60 C 74 56 72 50 70 46 Z"
            fill="url(#dragon-wings)"
            opacity="0.9"
            className="animate-wing-right"
          />

          {/* Tail with flame */}
          <path d="M 66 74 C 84 82 86 94 76 96" fill="none" stroke="url(#dragon-skin)" strokeWidth="6" strokeLinecap="round" />
          <polygon points="76,96 82,90 85,98" fill="#f59e0b" />

          {/* Body */}
          <ellipse cx="50" cy="68" rx="22" ry="19" fill="url(#dragon-skin)" />
          <path d="M 44 60 Q 50 62 56 60 Q 58 78 50 82 Q 42 78 44 60 Z" fill="#fef08a" opacity="0.9" />

          {/* Little Horns */}
          <polygon points="34,28 30,12 40,24" fill="#fbbf24" />
          <polygon points="66,28 70,12 60,24" fill="#fbbf24" />

          {/* Head */}
          <circle cx="50" cy="42" r="20" fill="url(#dragon-skin)" />

          {/* Cute Nostril Flames / Spouts */}
          <circle cx="44" cy="50" r="1.5" fill="#065f46" />
          <circle cx="56" cy="50" r="1.5" fill="#065f46" />

          {/* Eyes */}
          {mood === 'happy' ? (
            <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 37 42 Q 42 36 47 42" />
              <path d="M 53 42 Q 58 36 63 42" />
              <circle cx="50" cy="24" r="3" fill="#f59e0b" />
            </g>
          ) : (
            <g>
              <ellipse cx="41" cy="41" rx="5" ry="5.5" fill="#fbbf24" />
              <ellipse cx="59" cy="41" rx="5" ry="5.5" fill="#fbbf24" />
              <ellipse cx="41" cy="41" rx="2.5" ry="5" fill="#042f2e" />
              <ellipse cx="59" cy="41" rx="2.5" ry="5" fill="#042f2e" />
              <circle cx="43" cy="39" r="1.5" fill="#ffffff" />
              <circle cx="61" cy="39" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Paws */}
          <ellipse cx="42" cy="84" rx="5" ry="4" fill="#059669" />
          <ellipse cx="58" cy="84" rx="5" ry="4" fill="#059669" />
        </svg>
      );

    case 'slime':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-jiggle' : ''}`}
        >
          <defs>
            <radialGradient id="slime-grad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>

          {/* Slime Blob Shape */}
          <path
            d="M 50 18 C 65 18 84 38 84 62 C 84 80 72 88 50 88 C 28 88 16 80 16 62 C 16 38 35 18 50 18 Z"
            fill="url(#slime-grad)"
            opacity="0.95"
          />

          {/* Glossy Top Highlight */}
          <ellipse cx="40" cy="32" rx="16" ry="8" fill="#ffffff" opacity="0.45" transform="rotate(-15 40 32)" />
          <ellipse cx="64" cy="36" rx="5" ry="3" fill="#ffffff" opacity="0.35" />

          {/* Eyes */}
          {mood === 'happy' ? (
            <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 34 56 Q 40 48 46 56" />
              <path d="M 54 56 Q 60 48 66 56" />
              <ellipse cx="28" cy="64" rx="4" ry="2" fill="#38bdf8" opacity="0.8" />
              <ellipse cx="72" cy="64" rx="4" ry="2" fill="#38bdf8" opacity="0.8" />
            </g>
          ) : mood === 'thinking' ? (
            <g fill="#ffffff">
              <circle cx="40" cy="54" r="5" fill="#ffffff" />
              <circle cx="60" cy="54" r="5" fill="#ffffff" />
              <circle cx="42" cy="52" r="2.5" fill="#082f49" />
              <circle cx="62" cy="52" r="2.5" fill="#082f49" />
            </g>
          ) : (
            <g fill="#ffffff">
              <ellipse cx="38" cy="55" rx="5" ry="6" fill="#0c4a6e" />
              <ellipse cx="62" cy="55" rx="5" ry="6" fill="#0c4a6e" />
              <circle cx="40" cy="53" r="2" fill="#ffffff" />
              <circle cx="64" cy="53" r="2" fill="#ffffff" />
              <circle cx="36" cy="57" r="1" fill="#38bdf8" />
              <circle cx="60" cy="57" r="1" fill="#38bdf8" />
            </g>
          )}

          {/* Smile */}
          <path d="M 46 66 Q 50 70 54 66" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'robo':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-float' : ''}`}
        >
          <defs>
            <linearGradient id="robo-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Antenna */}
          <line x1="50" y1="18" x2="50" y2="28" stroke="#64748b" strokeWidth="3" />
          <circle cx="50" cy="16" r="4" fill="#00f5ff" filter="url(#cyan-glow)" />

          {/* Thruster Ring Glow */}
          <ellipse cx="50" cy="85" rx="14" ry="4" fill="#00f5ff" opacity="0.7" filter="url(#cyan-glow)" />

          {/* Spherical Head / Chassis */}
          <circle cx="50" cy="52" r="30" fill="url(#robo-metal)" stroke="#475569" strokeWidth="2" />

          {/* Floating Sensor Ears */}
          <rect x="14" y="44" width="6" height="16" rx="3" fill="#00f5ff" opacity="0.8" />
          <rect x="80" y="44" width="6" height="16" rx="3" fill="#00f5ff" opacity="0.8" />

          {/* LED Visor Screen */}
          <rect x="26" y="40" width="48" height="24" rx="8" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />

          {/* LED Matrix Face */}
          {mood === 'happy' ? (
            <g stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#cyan-glow)">
              <path d="M 34 52 Q 40 46 46 52" />
              <path d="M 54 52 Q 60 46 66 52" />
            </g>
          ) : mood === 'thinking' ? (
            <g fill="#00f5ff" filter="url(#cyan-glow)">
              <circle cx="38" cy="52" r="3" />
              <circle cx="50" cy="52" r="3" />
              <circle cx="62" cy="52" r="3" />
            </g>
          ) : (
            <g fill="#00f5ff" filter="url(#cyan-glow)">
              <rect x="35" y="47" width="10" height="10" rx="2" />
              <rect x="55" y="47" width="10" height="10" rx="2" />
              <rect x="38" y="50" width="3" height="3" fill="#ffffff" />
              <rect x="58" y="50" width="3" height="3" fill="#ffffff" />
            </g>
          )}
        </svg>
      );

    case 'shiba':
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width: dimension, height: dimension }}
          className={`pet-svg-art select-none ${className} ${animate ? 'animate-pet-bounce' : ''}`}
        >
          <defs>
            <linearGradient id="shiba-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <radialGradient id="helmet-glass" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* Ears */}
          <polygon points="30,36 24,14 44,24" fill="#d97706" />
          <polygon points="32,32 28,20 40,26" fill="#fef3c7" />
          <polygon points="70,36 76,14 56,24" fill="#d97706" />
          <polygon points="68,32 72,20 60,26" fill="#fef3c7" />

          {/* Body */}
          <ellipse cx="50" cy="70" rx="22" ry="18" fill="url(#shiba-gold)" />
          <ellipse cx="50" cy="73" rx="14" ry="12" fill="#fffbeb" />

          {/* Space Collar */}
          <rect x="36" y="60" width="28" height="6" rx="3" fill="#ef4444" />
          <circle cx="50" cy="63" r="3" fill="#fbbf24" />

          {/* Head */}
          <circle cx="50" cy="44" r="21" fill="url(#shiba-gold)" />
          <ellipse cx="40" cy="46" rx="7" ry="9" fill="#fffbeb" />
          <ellipse cx="60" cy="46" rx="7" ry="9" fill="#fffbeb" />

          {/* Astronaut Bubble Helmet */}
          <circle cx="50" cy="44" r="28" fill="url(#helmet-glass)" stroke="#bae6fd" strokeWidth="1.5" />

          {/* Eyes */}
          {mood === 'happy' ? (
            <g stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 37 43 Q 42 38 47 43" />
              <path d="M 53 43 Q 58 38 63 43" />
              <ellipse cx="32" cy="48" rx="3" ry="1.5" fill="#f87171" opacity="0.8" />
              <ellipse cx="68" cy="48" rx="3" ry="1.5" fill="#f87171" opacity="0.8" />
            </g>
          ) : (
            <g>
              <ellipse cx="42" cy="42" rx="3.5" ry="4" fill="#1e293b" />
              <ellipse cx="58" cy="42" rx="3.5" ry="4" fill="#1e293b" />
              <circle cx="43" cy="41" r="1.2" fill="#ffffff" />
              <circle cx="59" cy="41" r="1.2" fill="#ffffff" />
              {/* Shiba Eyebrow Dots */}
              <circle cx="40" cy="35" r="2.5" fill="#fffbeb" />
              <circle cx="60" cy="35" r="2.5" fill="#fffbeb" />
            </g>
          )}

          {/* Muzzle & Nose */}
          <ellipse cx="50" cy="49" rx="7" ry="5" fill="#fffbeb" />
          <polygon points="47,47 53,47 50,50" fill="#1e293b" />
          <path d="M 47 51 Q 50 53 53 51" stroke="#1e293b" strokeWidth="1.2" fill="none" />

          {/* Paws */}
          <ellipse cx="42" cy="85" rx="5" ry="4" fill="#fffbeb" />
          <ellipse cx="58" cy="85" rx="5" ry="4" fill="#fffbeb" />
        </svg>
      );

    default:
      return null;
  }
}
