import { useEffect, useRef, type ReactNode } from 'react';
import {
  ArrowUp, ChevronRight, Cloud, Cpu, GitBranch, Globe, KeyRound, Monitor,
  Orbit, ShieldCheck, Sparkles, User,
} from 'lucide-react';

type AboutPageProps = {
  launch: () => void;
  home: () => void;
  settings: () => void;
  motion: boolean;
};

function OrbitMark() {
  return (
    <div className="about-orbit" aria-hidden="true">
      <div className="about-orbit-ring one" />
      <div className="about-orbit-ring two" />
      <div className="about-orbit-ring three" />
      <div className="about-orbit-core"><span>A</span></div>
      <div className="about-orbit-moon" />
      <div className="about-orbit-glow" />
    </div>
  );
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <section ref={ref} className={'about-reveal ' + className}>{children}</section>;
}

export function AboutPage({ launch, home, settings, motion }: AboutPageProps) {
  return (
    <main className="about-page" id="main-content">
      <nav className="about-nav" aria-label="About navigation">
        <button className="wordmark" onClick={home} aria-label="Back to home">
          <span>A</span> APLX
        </button>
        <div className="about-nav-actions">
          <button onClick={settings}>Settings</button>
          <button onClick={launch} className="nav-launch">Launch Aplx <ArrowUp size={14} /></button>
        </div>
      </nav>

      <header className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">Built to be yours.</p>
          <h1>AI should feel like <i className="lively-shimmer-text">yours.</i></h1>
          <p className="about-lead">
            Aplx is an independent AI project built around one simple idea: powerful AI shouldn't have to mean giving up control.
          </p>
          <p className="about-support">Online when you want it. Offline when you need it.</p>
        </div>
        <OrbitMark />
      </header>

      <Reveal className="about-section">
        <p className="section-kicker">WHAT IS APLX?</p>
        <h2>More than a chatbot.</h2>
        <p className="about-body">
          Aplx is a privacy-focused AI assistant designed to give users more control over how they interact with AI. It supports both online and offline workflows, allowing Aplx to adapt to the user's setup instead of forcing the user into one ecosystem.
        </p>
        <p className="about-body">
          Aplx is designed to work with different AI providers and models depending on the environment — from cloud APIs in the browser to local inference on your own machine.
        </p>
      </Reveal>

      <Reveal className="about-section">
        <p className="section-kicker">WHY APLX EXISTS</p>
        <h2>Because AI shouldn't have to be complicated.</h2>
        <p className="about-body">
          Aplx started as a personal experiment and grew into an evolving AI platform. The goal was never to build another interface around an existing model. The goal was to create an assistant that could be customized, extended, and run in different environments.
        </p>
        <div className="about-cards" role="list">
          <article className="about-card glass" role="listitem">
            <ShieldCheck size={20} aria-hidden="true" />
            <h3>Privacy</h3>
            <p>Your credentials belong to you. Aplx Web is designed so provider API requests can be made directly from the browser rather than routing your API key through an Aplx-owned backend.</p>
          </article>
          <article className="about-card glass" role="listitem">
            <Globe size={20} aria-hidden="true" />
            <h3>Flexibility</h3>
            <p>Use supported online providers when you have an internet connection, or use local models when you want an offline experience.</p>
          </article>
          <article className="about-card glass" role="listitem">
            <KeyRound size={20} aria-hidden="true" />
            <h3>Ownership</h3>
            <p>Aplx is built as an independent project, with its code and architecture designed to remain adaptable instead of being locked to a single platform.</p>
          </article>
        </div>
      </Reveal>

      <Reveal className="about-section about-split-section">
        <p className="section-kicker">ONLINE + OFFLINE</p>
        <h2>One assistant. Two worlds.</h2>
        <div className="about-split">
          <article className="about-split-panel glass">
            <div className="about-split-icon"><Cloud size={22} /></div>
            <h3>Online</h3>
            <p>Aplx Web connects directly to your selected AI provider using your own API credentials.</p>
          </article>
          <div className="about-split-bridge" aria-hidden="true">
            <span className="about-split-line" />
            <Orbit size={18} />
            <span className="about-split-line" />
          </div>
          <article className="about-split-panel glass">
            <div className="about-split-icon"><Monitor size={22} /></div>
            <h3>Offline</h3>
            <p>The desktop version of Aplx can work with local AI models, allowing inference to happen on your own machine.</p>
          </article>
        </div>
      </Reveal>

      <Reveal className="about-section about-dev-section">
        <p className="section-kicker">THE MAKER</p>
        <h2>Small team. Literally.</h2>
        <div className="about-dev glass">
          <div className="about-dev-icon" aria-hidden="true"><User size={22} /></div>
          <div>
            <p className="about-body">
              Aplx is an independent project built and maintained by a single developer. What started as an experiment in building a personal AI assistant has grown into a larger project spanning AI, software engineering, web development, local inference, UI design, and deployment.
            </p>
            <p className="about-tagline">Built independently. Improved constantly.</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="about-section">
        <p className="section-kicker">THE STACK</p>
        <h2>Built with curiosity.</h2>
        <div className="about-stack">
          {[
            { title: 'AI Providers', items: 'Gemini · OpenAI · Local Models · Other Supported Providers', icon: Sparkles },
            { title: 'Web', items: 'TypeScript · React · Browser APIs', icon: Globe },
            { title: 'Infrastructure', items: 'Git · GitHub · Vercel', icon: GitBranch },
            { title: 'Local AI', items: 'Ollama · Local inference', icon: Cpu },
          ].map(({ title, items, icon: Icon }) => (
            <article className="about-stack-card glass" key={title}>
              <Icon size={18} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{items}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="about-section about-philosophy">
        <p className="section-kicker">THE PHILOSOPHY</p>
        <h2>Go dark. Stay yours.</h2>
        <blockquote className="about-quote glass">
          <p>
            Aplx follows a simple philosophy: AI should be useful without demanding unnecessary control over the user. Whether you're connecting to an online provider or running a model locally, the user should understand where their data and requests are going.
          </p>
          <footer>Privacy isn't a feature. It's part of the architecture.</footer>
        </blockquote>
      </Reveal>

      <Reveal className="about-section">
        <p className="section-kicker">ROADMAP</p>
        <h2>Still exploring.</h2>
        <p className="about-body about-roadmap-note">Aplx is an evolving project — not a finished product. Here's where things stand.</p>
        <ol className="about-timeline">
          {[
            { label: 'Aplx AI', done: true },
            { label: 'Aplx Web', done: true },
            { label: 'Online provider support', done: true },
            { label: 'Offline / local AI', done: true },
            { label: 'Continued model support', done: false },
            { label: 'More customization', done: false },
            { label: 'More local-first capabilities', done: false },
          ].map(({ label, done }) => (
            <li key={label} className={done ? 'done' : 'next'}>
              <span className="about-timeline-marker" aria-hidden="true">{done ? '✓' : '→'}</span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="about-section">
        <p className="section-kicker">CREDITS & ACKNOWLEDGMENTS</p>
        <h2>Built with the help of</h2>
        <div className="about-card glass p-6 mt-4">
          <p className="about-body text-[#dce5fb] leading-relaxed">
            R3nz (developer) , Github copilot, Claude Sonnet and Haiku and Opus models, CodeX (GPT-5.6), Kimi K3, GPT-4, minimax-m3, Grok, Le chat Mistral, Gemini, and many more AIs!
          </p>
        </div>
      </Reveal>

      <section className={'about-cta' + (motion ? ' motion-on' : '')} aria-labelledby="about-cta-heading">
        <div className="about-cta-stars" aria-hidden="true" />
        <div className="about-cta-orbit" aria-hidden="true" />
        <div className="about-cta-inner glass">
          <h2 id="about-cta-heading">Ready to explore Aplx?</h2>
          <p>Try Aplx Web, explore the project, or build your own setup.</p>
          <div className="hero-actions">
            <button className="primary" onClick={launch}>Launch Aplx Web <ArrowUp size={16} /></button>
            <a className="secondary" href="https://github.com/Korentic/Aplx" target="_blank" rel="noreferrer">
              View on GitHub <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <footer className="about-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div>Aplx AI™ · Built independently with curiosity, code, and far too many AI assistants.</div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#fef08a',
            letterSpacing: '0.06em',
            background: 'rgba(245, 158, 11, 0.14)',
            border: '1.5px solid rgba(251, 191, 36, 0.85)',
            padding: '8px 18px',
            borderRadius: '9999px',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.35), inset 0 0 8px rgba(251, 191, 36, 0.15)',
            textShadow: '0 0 10px rgba(250, 204, 21, 0.6)',
            textTransform: 'uppercase',
          }}
        >
          WEBSITE FOR APLX :- CURRENT VERSION, V1.7.1
        </div>
      </footer>
    </main>
  );
}
