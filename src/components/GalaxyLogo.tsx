import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sounds } from '../lib/audio';

interface GalaxyLogoProps {
  /** Overall pixel size (width = height) of the galaxy. */
  size?: number;
  /** Enable dragging + click explosion. Default true. */
  interactive?: boolean;
  /** Play interaction sounds. Default true. */
  sound?: boolean;
  /** Accessible label. */
  label?: string;
}

interface Star {
  /** Normalized orbital radius 0..1 */
  r: number;
  /** Start angle in radians */
  a: number;
  /** deg/s orbital speed (inner stars orbit faster) */
  speed: number;
  /** 0..1 twinkle phase */
  tw: number;
  /** CSS px dot size (relative to a 300px galaxy) */
  s: number;
  /** palette index */
  c: number;
}

interface Body {
  /** current position offset from home, px */
  x: number;
  y: number;
  /** velocity px/s */
  vx: number;
  vy: number;
}

const PALETTE = ['#8fb8ff', '#b18cff', '#ffffff', '#63e2ff', '#ffd9a0'];

/** Reference size the internal math is tuned for. */
const BASE = 300;

/** Small helper: apply spring physics toward a target point + velocity integration. */
function springStep(b: Body, dt: number, stiffness: number, damping: number, tx = 0, ty = 0) {
  const ax = -stiffness * (b.x - tx) - damping * b.vx;
  const ay = -stiffness * (b.y - ty) - damping * b.vy;
  b.vx += ax * dt;
  b.vy += ay * dt;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
}

/**
 * Aplx Galaxy Logo
 * ----------------
 * A dot-matrix "A" suspended at the center of a living spiral galaxy.
 * Two glowing comets orbit it on tilted elliptical rings.
 *
 * Interactions:
 *  - Drag the galaxy anywhere; it follows your pointer with elastic lag,
 *    then springs back home when released (with a satisfying wobble).
 *  - Click it and it EXPLODES: stars blast outward, flash + shockwave,
 *    then gravity pulls everything back and the galaxy re-forms.
 */
export function GalaxyLogo({ size = BASE, interactive = true, sound = true, label = 'Aplx galaxy logo' }: GalaxyLogoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [exploding, setExploding] = useState(false);
  const [dragging, setDragging] = useState(false);
  const flashRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  const scale = size / BASE;

  // Physics bodies: stars, comets, and the core each get their own spring.
  const bodies = useRef<Body[]>([]);
  const coreBody = useRef<Body>({ x: 0, y: 0, vx: 0, vy: 0 });
  const cometBodies = useRef<Body[]>([
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
  ]);
  // Whole-galaxy drag state
  const galaxyOffset = useRef<Body>({ x: 0, y: 0, vx: 0, vy: 0 });
  const dragState = useRef<{ active: boolean; lastX: number; lastY: number; targetX: number; targetY: number; moved: number }>({
    active: false, lastX: 0, lastY: 0, targetX: 0, targetY: 0, moved: 0,
  });

  // Deterministic star field so layout is stable between renders.
  const stars = useMemo<Star[]>(() => {
    let seed = 1337;
    const rand = () => {
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };
    const out: Star[] = [];
    const ARMS = 3;
    for (let i = 0; i < 150; i++) {
      const arm = i % ARMS;
      const t = rand();
      const r = 0.24 + t * 0.76;
      const swirl = arm * ((Math.PI * 2) / ARMS) + t * 2.6 + (rand() - 0.5) * (0.25 + t * 0.55);
      out.push({
        r,
        a: swirl,
        speed: 9 + (1 - r) * 14 + rand() * 4,
        tw: rand(),
        s: 1 + rand() * 1.8,
        c: Math.floor(rand() * PALETTE.length),
      });
    }
    return out;
  }, []);

  // (Re)initialize star bodies whenever the starfield changes.
  useEffect(() => {
    bodies.current = stars.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
  }, [stars]);

  // Master physics + render loop.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const dots = Array.from(wrap.querySelectorAll<HTMLSpanElement>('.galaxy-star'));
    const comets = Array.from(wrap.querySelectorAll<HTMLElement>('.galaxy-comet'));
    const core = wrap.querySelector<HTMLElement>('.galaxy-core');
    const R = (BASE / 2) * scale;
    let raf = 0;
    let last = performance.now();
    const t0 = last;

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); // clamp for tab-switch safety
      last = now;
      const t = (now - t0) / 1000;
      const drag = dragState.current;
      const go = galaxyOffset.current;

      // --- galaxy-wide drag spring (follows pointer while held, springs home after) ---
      if (drag.active) {
        // Snappy chase toward the pointer target => elastic lag behind the cursor
        springStep(go, dt, 420, 27, drag.targetX, drag.targetY);
      } else {
        // Slow spring home with a satisfying wobble
        springStep(go, dt, 60, 9);
      }
      wrap.style.transform = `translate(${go.x}px, ${go.y}px)`;
      // stretch by speed for a motion-blur feel
      const spd = Math.hypot(go.vx, go.vy);
      const stretch = Math.min(0.25, spd / 4000);
      if (spd > 40) {
        const ang = (Math.atan2(go.vy, go.vx) * 180) / Math.PI;
        wrap.style.rotate = `${ang}deg`;
        wrap.style.scale = `${1 + stretch} ${1 - stretch * 0.6}`;
      } else {
        wrap.style.rotate = '0deg';
        wrap.style.scale = '1 1';
      }

      // --- stars: orbit + spring back + explosion kicks already in velocity ---
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const b = bodies.current[i];
        if (!b) continue;
        const ang = st.a + t * st.speed * (Math.PI / 180);
        const wob = Math.sin(t * 0.8 + st.tw * 6.28) * 0.015;
        const hx = Math.cos(ang + wob) * st.r * R; // home position this frame
        const hy = Math.sin(ang + wob) * st.r * R * 0.42;
        springStep(b, dt, 26, 5.5); // gentle gravity toward the moving home
        const el = dots[i];
        if (el) {
          el.style.transform = `translate(-50%, -50%) translate(${hx + b.x}px, ${hy + b.y}px) scale(${scale})`;
          el.style.opacity = String(0.45 + 0.55 * Math.abs(Math.sin(t * 1.4 + st.tw * 6.28)));
        }
      }

      // --- comets: ride their ellipse unless blown away ---
      comets.forEach((el, i) => {
        const cb = cometBodies.current[i];
        const dir = i === 0 ? 1 : -1;
        const speed = i === 0 ? 14 : 22;
        const ang = (t * speed * dir + i * Math.PI) * (Math.PI / 180);
        const rx = R * (0.95 - i * 0.18);
        const ry = rx * (i === 0 ? 0.36 : 0.5);
        const hx = Math.cos(ang) * rx;
        const hy = Math.sin(ang) * ry;
        springStep(cb, dt, 30, 6);
        const cometScale = scale * (i === 0 ? 1 : 0.8);
        el.style.transform = `translate(-50%, -50%) translate(${hx + cb.x}px, ${hy + cb.y}px) scale(${cometScale}) rotate(${(ang * 180) / Math.PI}deg)`;
        el.style.opacity = String(0.75 + 0.25 * Math.sin(t * 3 + i));
      });

      // --- core: gentle float + spring ---
      if (core) {
        const cb = coreBody.current;
        springStep(cb, dt, 30, 6);
        const bob = Math.sin(t * 1.1) * 3;
        core.style.transform = `translate(-50%, -50%) translate(${cb.x}px, ${cb.y + bob}px) scale(${scale})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stars, scale]);

  // Explosion: kick every body radially outward from center.
  const explode = () => {
    const R = (BASE / 2) * scale;
    const kick = () => 260 + Math.random() * 340; // px/s
    for (const b of bodies.current) {
      const a = Math.random() * Math.PI * 2;
      const power = kick() * (0.7 + Math.random() * 0.6);
      b.vx += Math.cos(a) * power;
      b.vy += Math.sin(a) * power * 0.72;
    }
    cometBodies.current.forEach((cb, i) => {
      const a = (i === 0 ? 0 : Math.PI) + (Math.random() - 0.5);
      cb.vx += Math.cos(a) * kick();
      cb.vy += Math.sin(a) * kick() * 0.72;
    });
    {
      const cb = coreBody.current;
      const a = Math.random() * Math.PI * 2;
      cb.vx += Math.cos(a) * 90;
      cb.vy += Math.sin(a) * 90;
    }
    // visuals
    setExploding(true);
    window.setTimeout(() => setExploding(false), 900);
    const flash = flashRef.current;
    if (flash) {
      flash.style.animation = 'none';
      // force reflow to restart the CSS animation
      void flash.offsetWidth;
      flash.style.animation = 'galaxy-flash 0.55s ease-out forwards';
    }
    const wave = waveRef.current;
    if (wave) {
      wave.style.animation = 'none';
      void wave.offsetWidth;
      wave.style.animation = `galaxy-shockwave ${Math.max(0.5, R / 300)}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
    }
  };

  // Drag handling (pointer events => mouse + touch unified)
  const pointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    try {
      wrapRef.current?.setPointerCapture?.(e.pointerId);
    } catch {
      // Pointer capture is best-effort (fails for synthetic pointers);
      // dragging still works while the cursor stays over the element.
    }
    const go = galaxyOffset.current;
    dragState.current = {
      active: true,
      lastX: e.clientX,
      lastY: e.clientY,
      targetX: go.x,
      targetY: go.y,
      moved: 0,
    };
    setDragging(true);
  };
  const pointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag.active) return;
    // Delta from last event position: works for mouse AND touch.
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    drag.targetX += dx;
    drag.targetY += dy;
  };
  const pointerUp = () => {
    const drag = dragState.current;
    if (!drag.active) return;
    drag.active = false;
    setDragging(false);
    // If it barely moved, treat it as a click => EXPLODE.
    if (drag.moved < 8) {
      if (sound) sounds.playPetChirp();
      explode();
    } else if (sound) {
      sounds.playClick();
    }
  };

  // Dot-matrix "A": each 1 is a glowing pixel of the letter.
  const A_MATRIX = [
    '0110',
    '1001',
    '1111',
    '1001',
    '1001',
  ];

  return (
    <div
      ref={wrapRef}
      className={`galaxy-logo${dragging ? ' dragging' : ''}${exploding ? ' exploding' : ''}`}
      style={{ width: size, height: size, touchAction: 'none' }}
      role="img"
      aria-label={label}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      title={interactive ? 'Drag me, or click to explode ✨' : undefined}
    >
      {/* 3D scene wrapper */}
      <div className="galaxy-scene">
        {/* Disc glow + spiral haze */}
        <div className="galaxy-halo" />
        <div className="galaxy-disc" />

        {/* Orbit rings the comets ride */}
        <div className="galaxy-ring galaxy-ring-one" />
        <div className="galaxy-ring galaxy-ring-two" />

        {/* Star field */}
        {stars.map((st, i) => (
          <span
            key={i}
            className="galaxy-star"
            style={{
              width: st.s,
              height: st.s,
              background: PALETTE[st.c],
              boxShadow: `0 0 ${2 + st.s}px ${PALETTE[st.c]}`,
            }}
          />
        ))}

        {/* The two signature orbiting dots */}
        <span className="galaxy-comet galaxy-comet-one" />
        <span className="galaxy-comet galaxy-comet-two" />

        {/* Explosion FX layers */}
        <div ref={flashRef} className="galaxy-flash" />
        <div ref={waveRef} className="galaxy-shockwave" />

        {/* Dotted "A" core */}
        <div className="galaxy-core" aria-hidden="true">
          {A_MATRIX.flatMap((row, r) =>
            row.split('').map((cell, c) => (
              <span
                key={`${r}-${c}`}
                className={`galaxy-core-dot${cell === '1' ? ' on' : ''}`}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact variant for the nav wordmark / footer.
 * Renders the full galaxy at a fixed internal size and scales it down
 * with a transform so every proportion survives at tiny sizes.
 */
export function GalaxyLogoMini({ size = 26 }: { size?: number }) {
  const INTERNAL = 140;
  return (
    <span className="galaxy-mini" style={{ width: size, height: size }} aria-hidden="true">
      <span
        style={{
          display: 'block',
          width: INTERNAL,
          height: INTERNAL,
          transform: `scale(${size / INTERNAL})`,
          transformOrigin: 'top left',
        }}
      >
        <GalaxyLogo size={INTERNAL} interactive={false} sound={false} label="" />
      </span>
    </span>
  );
}
