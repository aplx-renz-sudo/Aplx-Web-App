import { useState, useMemo } from 'react';
import {
  Scale,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  ServerOff,
  Cpu,
  Orbit,
  Terminal,
  Download,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  Globe,
  Users,
  RefreshCw,
  Search,
  ArrowUp,
  Zap,
  Sparkles,
} from 'lucide-react';

interface PrivacyNoticeViewProps {
  back: () => void;
  settings: () => void;
  about: () => void;
}

interface SectionItem {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  badge: string;
  badgeColor: string;
  icon: any;
  summary: string;
  keywords: string[];
}

export function PrivacyNoticeView({ back, settings, about }: PrivacyNoticeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'section-glance': true,
    'legal-notice': true,
    'section-international': true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    SECTIONS_META.forEach(s => {
      allExpanded[s.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const SECTIONS_META: SectionItem[] = [
    {
      id: 'section-glance',
      number: 1,
      title: '1. Privacy at a Glance',
      shortTitle: 'Privacy at a Glance',
      badge: 'Architecture Summary',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      icon: ShieldCheck,
      summary: 'Client-side architecture, zero intermediary servers, direct provider routing, and local credential storage.',
      keywords: ['glance', 'summary', 'client-side', 'zero servers', 'localStorage', 'direct routing'],
    },
    {
      id: 'section-how-it-works',
      number: 2,
      title: '2. How Aplx Works',
      shortTitle: 'How Aplx Works',
      badge: 'Technical Flow',
      badgeColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
      icon: Cpu,
      summary: 'Aplx executes 100% in your browser JavaScript sandbox. Requests stream directly between your device and AI providers.',
      keywords: ['works', 'architecture', 'react', 'vite', 'browser', 'fetch', 'runtime'],
    },
    {
      id: 'section-credentials',
      number: 3,
      title: '3. API Keys & Credentials',
      shortTitle: 'API Keys & Credentials',
      badge: 'Local Web Storage',
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
      icon: KeyRound,
      summary: 'API keys remain in your browser storage partition, never pass through Aplx servers, and transmit strictly to configured providers.',
      keywords: ['keys', 'credentials', 'storage', 'sessionStorage', 'localStorage', 'pin', 'vault'],
    },
    {
      id: 'section-data-sent',
      number: 4,
      title: '4. Data Sent to AI Providers',
      shortTitle: 'Data Sent to AI Providers',
      badge: 'Direct Transmission',
      badgeColor: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
      icon: Orbit,
      summary: 'Your browser sends prompts, keys, and technical headers directly to model providers who process them under their own terms.',
      keywords: ['providers', 'prompts', 'openai', 'anthropic', 'gemini', 'headers', 'ip address'],
    },
    {
      id: 'section-data-collected',
      number: 5,
      title: '5. Data Aplx Does / Does Not Collect',
      shortTitle: 'Collected vs Not Collected',
      badge: 'Zero Telemetry',
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
      icon: Terminal,
      summary: 'Zero remote chat collection, zero analytics beacons, zero user tracking. All chats and profiles reside locally on your device.',
      keywords: ['collect', 'telemetry', 'analytics', 'tracking', 'cookies', 'sovereignty'],
    },
    {
      id: 'section-third-party',
      number: 6,
      title: '6. Third-Party Services & Infrastructure',
      shortTitle: 'Third-Party Services',
      badge: 'Infrastructure Logs',
      badgeColor: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
      icon: Globe,
      summary: 'Static hosting CDNs and Google Fonts process routine network headers (IP, User-Agent) solely for file delivery and DDoS defense.',
      keywords: ['cdn', 'hosting', 'fonts', 'google fonts', 'ollama', 'infrastructure'],
    },
    {
      id: 'section-user-responsibilities',
      number: 7,
      title: '7. User Responsibilities',
      shortTitle: 'User Responsibilities',
      badge: 'Operational Care',
      badgeColor: 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30',
      icon: Users,
      summary: 'Users must safeguard credentials, supervise provider billing quotas, obey IP laws, and verify all AI output before reliance.',
      keywords: ['responsibility', 'safeguard', 'quotas', 'billing', 'compliance', 'supervision'],
    },
    {
      id: 'section-ai-output',
      number: 8,
      title: '8. AI Output Disclaimer',
      shortTitle: 'AI Output Disclaimer',
      badge: 'Probabilistic Output',
      badgeColor: 'text-pink-400 bg-pink-950/40 border-pink-500/30',
      icon: Sparkles,
      summary: 'AI responses can be incomplete, inaccurate, or hallucinated. Generative AI output does not constitute professional advice.',
      keywords: ['output', 'hallucination', 'disclaimer', 'advice', 'accuracy', 'probabilistic'],
    },
    {
      id: 'section-security-disclaimer',
      number: 9,
      title: '9. Security Disclaimer & Threat Model',
      shortTitle: 'Security Disclaimer',
      badge: 'Browser Realities',
      badgeColor: 'text-red-400 bg-red-950/40 border-red-500/30',
      icon: Lock,
      summary: 'Aplx applies native browser defenses and burst limiting, but client storage cannot defend against device malware or malicious extensions.',
      keywords: ['security', 'malware', 'extensions', 'anti-ddos', 'subtle crypto', 'sha-256'],
    },
    {
      id: 'legal-notice',
      number: 10,
      title: '10. Limitation of Liability',
      shortTitle: 'Limitation of Liability',
      badge: 'Legal Disclaimer',
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
      icon: Scale,
      summary: 'Aplx is provided "AS IS" without warranties. Developer liability is excluded to the maximum extent permitted by applicable law.',
      keywords: ['liability', 'as-is', 'damages', 'limitation', 'disclaimer', 'consumer rights', 'statutory'],
    },
    {
      id: 'section-provider-disclaimer',
      number: 11,
      title: '11. Third-Party Provider Disclaimer',
      shortTitle: 'Provider Disclaimer',
      badge: 'Independent Entities',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      icon: ServerOff,
      summary: 'Model providers are independent third parties. Aplx has no agency relationship, revenue share, or control over provider services.',
      keywords: ['independent', 'agent', 'broker', 'openai', 'anthropic', 'google', 'contracts'],
    },
    {
      id: 'section-children',
      number: 12,
      title: '12. Children & Minors',
      shortTitle: 'Children & Minors',
      badge: 'Age Requirements',
      badgeColor: 'text-orange-400 bg-orange-950/40 border-orange-500/30',
      icon: AlertTriangle,
      summary: 'Aplx is a developer utility, not directed to children. Minors must have verifiable parental or guardian authorization under local law.',
      keywords: ['children', 'minors', 'coppa', 'dpdpa', 'gdpr art 8', 'parental consent'],
    },
    {
      id: 'section-international',
      number: 13,
      title: '13. International Users & Applicable Law',
      shortTitle: 'International & India Law',
      badge: 'Jurisdiction Analysis',
      badgeColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
      icon: Globe,
      summary: 'Comprehensive analysis of India (IT Act, DPDPA 2023, CPA 2019, Contract Act 1872) and Global frameworks (GDPR, CCPA/CPRA, UNCITRAL).',
      keywords: ['india', 'dpdpa', 'it act', 'consumer protection', 'contract act', 'gdpr', 'ccpa', 'international'],
    },
    {
      id: 'section-changes',
      number: 14,
      title: '14. Changes to This Notice',
      shortTitle: 'Notice Revisions',
      badge: 'Version Control',
      badgeColor: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
      icon: RefreshCw,
      summary: 'Notice terms may be updated as software or legal standards evolve. Periodic changes are indicated by the Last Updated timestamp.',
      keywords: ['changes', 'revisions', 'amendments', 'updates', 'timestamp'],
    },
    {
      id: 'section-contact',
      number: 15,
      title: '15. Contact & Privacy Requests',
      shortTitle: 'Contact & Data Rights',
      badge: 'Self-Service Erasure',
      badgeColor: 'text-teal-400 bg-teal-950/40 border-teal-500/30',
      icon: ExternalLink,
      summary: 'GitHub issues for technical inquiries. Data deletion is performed client-side by wiping local browser site storage.',
      keywords: ['contact', 'github', 'requests', 'erasure', 'clear data', 'inquiries'],
    },
    {
      id: 'section-legal-statement',
      number: 16,
      title: '16. Important Legal Statement',
      shortTitle: 'Important Legal Statement',
      badge: 'Binding Notice',
      badgeColor: 'text-amber-300 bg-amber-950/40 border-amber-500/30',
      icon: ShieldAlert,
      summary: 'This notice is not legal advice. Mandatory statutory protections prevail. Unenforceable provisions are strictly severable.',
      keywords: ['legal statement', 'not legal advice', 'severability', 'mandatory law', 'enforceability'],
    },
    {
      id: 'section-host-locally',
      number: 17,
      title: '17. Host Aplx Locally (Maximum Privacy)',
      shortTitle: 'Host Locally (Red Box)',
      badge: 'Maximum Privacy',
      badgeColor: 'text-red-400 bg-red-950/40 border-red-500/30',
      icon: ShieldAlert,
      summary: 'Host Aplx locally on your own device to avoid third-party hosting infrastructure like Vercel and obtain maximum privacy.',
      keywords: ['host locally', 'maximum privacy', 'vercel', 'github', 'install', 'self-host', 'red box'],
    },
  ];

  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SECTIONS_META;
    return SECTIONS_META.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.keywords.some(k => k.includes(q))
    );
  }, [searchQuery]);

  const scrollToSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <main className="privacy-page min-h-screen bg-[#060913] text-[#f5f5f7] pb-24 animate-fade-in-up">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between p-3.5 sm:px-6 rounded-2xl bg-[#090e1b]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="wordmark flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2997ff]/20 border border-[#2997ff]/40 text-[#8ea8ff] font-bold flex items-center justify-center text-sm">
                A
              </span>
              <span className="font-bold tracking-wider text-sm">APLX</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] font-mono font-semibold text-[#8ea8ff] bg-[#121d38] border border-[#233560] px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={12} className="text-[#8ea8ff]" /> PRIVACY & LEGAL NOTICE SYSTEM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={about}
              className="playful-pop px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-[#cbd7f0] transition-all cursor-pointer"
            >
              About Aplx
            </button>
            <button
              type="button"
              onClick={settings}
              className="playful-pop px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-[#cbd7f0] transition-all cursor-pointer"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={back}
              className="playful-pop inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#2997ff] hover:bg-[#47a6ff] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95"
            >
              <span>Workspace</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </nav>

        {/* HERO CARD: UNIFIED PRIVACY & LEGAL SPECIFICATION */}
        <div className="p-7 sm:p-9 rounded-3xl bg-[#090e1b]/95 border border-white/[0.08] shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8ea8ff] uppercase bg-[#131d36] border border-[#233664] px-3 py-1 rounded-full">
                <FileText size={13} /> OFFICIAL PRIVACY & LEGAL NOTICE
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Client-Side Architecture</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#7e92b8] bg-white/[0.03] border border-white/[0.07] px-3 py-1 rounded-full">
              Last Updated: September 2026 • V2
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Aplx Privacy, Credential Architecture & Legal Terms
          </h1>

          <p className="text-sm text-[#9ab0d6] leading-relaxed max-w-3xl font-normal">
            This unified legal notice articulates Aplx's client-side privacy model, credential handling, third-party provider data transmission, user responsibilities, and limitation of liability under both Indian law and international regulatory frameworks.
          </p>

          {/* Core Architecture Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-[#ccd8f0]">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Zero Intermediary Proxy Servers</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-[#ccd8f0]">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Zero Analytics or Telemetry Beacons</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-[#ccd8f0]">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Direct Browser-to-Provider Routing</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-[#ccd8f0]">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Local Origin Web Storage Only</span>
            </span>
          </div>
        </div>

        {/* INTERACTIVE TABLE OF CONTENTS & QUICK SEARCH */}
        <div className="p-6 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Table of Contents & Quick Navigation</h2>
                <p className="text-[11px] text-[#8699b8]">Click any section to jump directly or expand its detailed terms.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-medium text-[#b0c2e0] transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-medium text-[#b0c2e0] transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#687c9f]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search legal topics (e.g., India, DPDPA, API keys, liability, children, GDPR, storage)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder-[#5a6d90] focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7e92b8] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Table of contents pills / grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
            {filteredSections.map(sec => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.12] transition-all flex items-start gap-2 group cursor-pointer"
              >
                <sec.icon size={14} className="text-[#8ea8ff] mt-0.5 flex-none group-hover:text-blue-400 transition-colors" />
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold text-[#d0def5] truncate group-hover:text-white">
                    {sec.shortTitle}
                  </div>
                  <div className="text-[10px] text-[#6d82a6] truncate font-mono">
                    §{sec.number}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SECTION 1: PRIVACY AT A GLANCE */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-glance"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  SECTION 1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Privacy at a Glance
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Overview
            </span>
          </div>

          <div className="space-y-4 text-xs text-[#9ab0d6] leading-relaxed">
            {/* Plain English summary */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[#d8e4fa] space-y-1.5">
              <b className="text-white text-xs block font-semibold">Plain English Summary:</b>
              <p className="text-[12px] leading-relaxed">
                Aplx is an open-source AI client running directly in your web browser. When you use Aplx, prompts and API keys are sent directly from your device to the AI provider you configure (such as Google, OpenAI, Anthropic, or a local server like Ollama). Aplx operates zero intermediary proxy servers, does not maintain a central database of your conversations, and does not sell or track your personal information.
              </p>
            </div>

            {/* Structured Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11.5px] border border-white/[0.08] rounded-xl overflow-hidden">
                <thead className="bg-white/[0.04] text-white font-semibold">
                  <tr>
                    <th className="p-3 border-b border-white/[0.08]">Data Category</th>
                    <th className="p-3 border-b border-white/[0.08]">Where It Resides</th>
                    <th className="p-3 border-b border-white/[0.08]">Does Aplx Server See It?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-[#a1b4d8]">
                  <tr>
                    <td className="p-3 font-semibold text-white">Provider API Keys</td>
                    <td className="p-3">Local browser storage (<code className="text-[#ccd8f0]">localStorage</code> or <code className="text-[#ccd8f0]">sessionStorage</code>)</td>
                    <td className="p-3 text-emerald-300 font-semibold">No. No Aplx server exists.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Prompts & Conversations</td>
                    <td className="p-3">Your browser storage and your chosen AI provider</td>
                    <td className="p-3 text-emerald-300 font-semibold">No. Sent directly to provider.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Telemetry & Analytics</td>
                    <td className="p-3">None collected by Aplx application code</td>
                    <td className="p-3 text-emerald-300 font-semibold">No. Zero tracking beacons.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Static Web Hosting Logs</td>
                    <td className="p-3">Standard HTTP access logs at CDN/host level</td>
                    <td className="p-3 text-[#cbd7f0]">Routine network delivery headers (IP, User-Agent)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11.5px] text-[#8699b8] leading-relaxed">
              <strong className="text-[#b5c7e8]">Legal Precision:</strong> Aplx operates as an electronic client interface under user direction. Data transmissions initiated through Aplx are point-to-point requests governed by user-selected credentials. The developer maintains no centralized data repository or continuous telemetry pipeline.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 2: HOW APLX WORKS */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-how-it-works"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                  SECTION 2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  How Aplx Works (Architecture & Data Flow)
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              Technical Topology
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Aplx is a static single-page application (SPA) built using React 18, TypeScript, and Vite. The user interface executes entirely inside your client browser’s sandboxed JavaScript engine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <span className="text-[10.5px] font-mono font-bold text-indigo-300 flex items-center gap-1">
                  1. CLIENT EXECUTION
                </span>
                <p className="text-[11px] text-[#8699b8] leading-normal">
                  UI rendering, token savings calculations, conversation formatting, and local profile management execute exclusively in client device memory.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <span className="text-[10.5px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                  2. DIRECT DISPATCH
                </span>
                <p className="text-[11px] text-[#8699b8] leading-normal">
                  When you submit a message, your browser directly initiates an encrypted HTTPS <code className="text-white font-mono text-[10.5px]">fetch()</code> call to the official API endpoint of your selected provider (or HTTP to localhost for Ollama).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <span className="text-[10.5px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                  3. DIRECT STREAMING
                </span>
                <p className="text-[11px] text-[#8699b8] leading-normal">
                  Response tokens stream directly from the model provider into your browser view. No intermediate Aplx relay, proxy, or server intercepts the transmission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 3: API KEYS & CREDENTIALS */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-credentials"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase">
                  SECTION 3
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  API Keys & Credentials Handling
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
              Credentials
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Aplx requires third-party API keys to connect to commercial model providers. How credentials are treated in Aplx:
            </p>

            <ul className="space-y-2 list-disc list-inside text-[#9eb0d2]">
              <li>
                <strong className="text-white">Local Storage:</strong> If you select "Remember Key", your API key is stored in your browser's <code className="text-[#cbd7f0] font-mono">localStorage</code> under the key <code className="text-[#cbd7f0] font-mono">aplx:provider-config</code>. If unchecked, it resides in <code className="text-[#cbd7f0] font-mono">sessionStorage</code> for the duration of the active browser tab only.
              </li>
              <li>
                <strong className="text-white">Storage Security Profile:</strong> Web storage is partitioned per origin by your browser's Same-Origin Policy (SOP). However, values in <code className="text-[#cbd7f0] font-mono">localStorage</code> are stored unencrypted at the browser application layer. They can be read by any script running in that origin, malicious browser extensions with broad permissions, or anyone with direct administrative or physical access to the device.
              </li>
              <li>
                <strong className="text-white">Profile PIN Vault:</strong> The optional profile PIN utilizes a PBKDF2/SHA-256 salted hash with cryptographic WebCrypto primitives to protect UI display access, but this does not constitute full operating system volume encryption.
              </li>
              <li>
                <strong className="text-white">Zero Developer Exfiltration:</strong> Credentials never transmit to Aplx creators, maintainers, or servers. They leave your device strictly in authenticated HTTP Authorization or provider-specific headers directly to the AI provider you specified.
              </li>
              <li>
                <strong className="text-white">Revocation & Deletion:</strong> You may delete stored keys at any moment via Settings &rarr; Providers &rarr; Remove Key, or by using "Clear All Data" in Settings.
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 4: DATA SENT TO AI PROVIDERS */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-data-sent"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Orbit size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-purple-400 uppercase">
                  SECTION 4
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Data Sent to AI Providers
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
              Third-Party Data Flow
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              When you submit a query or test an API connection, your browser transmits the following data directly to the chosen AI provider:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">1. Authentication Credentials</b>
                <p className="text-[11px] text-[#8699b8]">
                  Your provider API key via standard authorization headers (e.g., <code className="text-[#cbd7f0] font-mono">Bearer</code> or <code className="text-[#cbd7f0] font-mono">x-api-key</code>).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">2. Conversational Payloads</b>
                <p className="text-[11px] text-[#8699b8]">
                  Your current prompt, system instructions, attached text documents, and active conversation context turns.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">3. Network Telemetry Headers</b>
                <p className="text-[11px] text-[#8699b8]">
                  Your public IP address, browser User-Agent, origin, and TLS connection parameters automatically established by your browser.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">4. Independent Provider Governance</b>
                <p className="text-[11px] text-[#8699b8]">
                  Model providers act as independent Data Controllers/Fiduciaries. Their data retention, model training, and moderation policies apply independently.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/25 text-[11.5px] text-purple-200/90 leading-relaxed mt-2">
              <span className="font-semibold text-white">Notice of Provider Policies:</span> Users are advised to review the specific privacy terms of each provider: Google (Gemini API Terms), Anthropic (Commercial Terms of Service & Privacy Policy), OpenAI (Business Terms & Usage Policies), Groq, Mistral, and OpenRouter. You are responsible for configuring provider data sharing or training opt-outs within your provider account dashboards.
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 5: DATA APLX DOES / DOES NOT COLLECT */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-data-collected"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  SECTION 5
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Data Aplx Does and Does Not Collect
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              Data Audit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#9ab0d6] leading-relaxed">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono uppercase">
                <CheckCircle2 size={14} /> Stored Locally on Your Device
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-[#8da2c8] text-[11.5px]">
                <li>Active and historic chat conversations and custom titles</li>
                <li>Saved API keys and endpoint configurations</li>
                <li>Local profile attributes (nickname, bio, avatar string, salted PIN hash)</li>
                <li>Application preferences (selected theme, audio sound effect states)</li>
                <li>Token Saver metric counters (processed and saved character estimations)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono uppercase">
                <ServerOff size={14} /> NOT Collected by Aplx
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-[#8da2c8] text-[11.5px]">
                <li>No server-side copies of your prompts or generated AI answers</li>
                <li>No server-side copies of your API keys or credentials</li>
                <li>No Google Analytics, tracking pixels, or telemetry beacons</li>
                <li>No remote user accounts, passwords, or cloud database storage</li>
                <li>No sale, rental, or commercial licensing of personal data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 6: THIRD-PARTY SERVICES */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-third-party"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Globe size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                  SECTION 6
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Third-Party Services & Technical Processing
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300">
              Infrastructure
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              To deliver static web code and typography, Aplx interfaces with standard third-party web infrastructure:
            </p>

            <div className="space-y-2 text-[11.5px] text-[#8fa3c8]">
              <p>
                <strong className="text-white">Web Hosting & CDN Networks:</strong> When your browser loads Aplx, static HTML, JavaScript, and CSS assets are downloaded from hosting network edge servers (such as Vercel, Cloudflare Pages, or Google Cloud Run). In accordance with standard internet protocol operation, hosting servers process incoming HTTP connection metadata—including IP address, requested URL, browser User-Agent, and timestamps—in standard access and security logs for network routing, cache invalidation, and DDoS mitigation.
              </p>
              <p>
                <strong className="text-white">Google Fonts Delivery:</strong> Aplx loads display typography from Google Fonts (<code className="text-[#cbd7f0] font-mono">fonts.googleapis.com</code> and <code className="text-[#cbd7f0] font-mono">fonts.gstatic.com</code>). When your browser requests these font files, Google receives your IP address and User-Agent header, governed by Google’s general privacy policy.
              </p>
              <p>
                <strong className="text-white">Local Inference Engines (Ollama / LM Studio):</strong> When configured for local execution, network requests are dispatched to <code className="text-[#cbd7f0] font-mono">localhost:11434</code> or your designated local network address. No external internet data transmission occurs for local inference.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 7: USER RESPONSIBILITIES */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-user-responsibilities"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <Users size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-yellow-400 uppercase">
                  SECTION 7
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  User Responsibilities & Operational Care
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              User Obligations
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              As an open-source client utility, Aplx places operational sovereignty in the hands of the end user. By using Aplx, you acknowledge and accept sole responsibility for:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">Credential Confidentiality</b>
                <p className="text-[11px] text-[#8699b8]">
                  Guarding your API keys against exposure, shoulder-surfing, unauthorized shared-device use, or theft by third-party browser extensions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">Billing & Consumption Oversight</b>
                <p className="text-[11px] text-[#8699b8]">
                  Monitoring your third-party provider accounts, tier quotas, and token spending. Aplx is not responsible for provider invoices or financial charges incurred.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">Legal & Contractual Compliance</b>
                <p className="text-[11px] text-[#8699b8]">
                  Ensuring all submitted prompts and files comply with copyright laws, trade secret protections, privacy obligations, and third-party terms of service.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <b className="text-white text-xs block">Device & Environment Security</b>
                <p className="text-[11px] text-[#8699b8]">
                  Maintaining updated anti-malware protections, operating system patches, and secure browser software on the physical machine running Aplx.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 8: AI OUTPUT DISCLAIMER */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-ai-output"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Sparkles size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-pink-400 uppercase">
                  SECTION 8
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Output Disclaimer (Probabilistic Nature of LLMs)
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300">
              Model Disclaimers
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Generative artificial intelligence models are non-deterministic, probabilistic prediction systems. Outputs returned by connected models:
            </p>

            <ul className="space-y-2 list-disc list-inside text-[#9eb0d2] text-[11.5px]">
              <li>
                <strong className="text-white">May Contain Errors & Hallucinations:</strong> Generated content may be factually inaccurate, incomplete, misleading, biased, offensive, or obsolete.
              </li>
              <li>
                <strong className="text-white">Not Professional Advice:</strong> Model outputs do NOT constitute legal, financial, medical, accounting, engineering, or cybersecurity counsel. Never make high-consequence decisions based solely on automated LLM text.
              </li>
              <li>
                <strong className="text-white">No Verification by Aplx:</strong> Aplx acts purely as a client-side conduit. The developer does not author, screen, review, endorse, or verify the correctness or safety of any AI-generated response.
              </li>
              <li>
                <strong className="text-white">Mandatory Human Review:</strong> Users must independently test, review, and validate all generated text, code snippets, or configurations before deploying them in production or acting in reliance upon them.
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 9: SECURITY DISCLAIMER */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-security-disclaimer"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Lock size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase">
                  SECTION 9
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Security Disclaimer & Browser Threat Model
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300">
              Threat Model
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Aplx incorporates disciplined client-side hygiene: sliding-window in-memory burst limiting (anti-DDoS / loop prevention), WebCrypto SHA-256 integrity verification, and zero remote telemetry.
            </p>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-2 text-[11.5px] text-[#9eb0d2]">
              <b className="text-white block text-xs">Realistic Browser Realities:</b>
              <p>
                No client-side software running inside a web browser can guarantee 100% impenetrability. Local web storage (<code className="text-[#cbd7f0] font-mono">localStorage</code>) cannot withstand rogue or compromised browser extensions that possess broad host permissions, local operating system malware, physical credential dumping, or insecure multi-user shared browser profiles.
              </p>
              <p>
                The developer disclaims any warranty that Aplx is completely invulnerable to all potential cyber threats. Users handling sensitive commercial data should evaluate their threat model, utilize private browsing sessions, and consider dedicated local inference environments.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 10: LIMITATION OF LIABILITY (PRIMARY LEGAL NOTICE) */}
        {/* ---------------------------------------------------- */}
        <section
          id="legal-notice"
          className="p-6 sm:p-8 rounded-2xl bg-[#090d19] border border-amber-500/40 shadow-2xl space-y-5 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-amber-500/25">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-none shadow-md shadow-amber-950/40">
                <Scale size={19} />
              </div>
              <div>
                <span className="text-[10.5px] font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                  <FileText size={12} /> SECTION 10 • FORMAL LEGAL NOTICE
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
                  Limitation of Liability & Warranty Disclaimers
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
              GOVERNING TERMS
            </span>
          </div>

          <div className="space-y-4 text-xs text-[#9eb0d2] leading-relaxed">
            {/* Clause 1: As-Is Provision */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
              <div className="font-semibold text-white flex items-center gap-2 text-xs">
                <AlertTriangle size={15} className="text-amber-400 flex-none" />
                <span>1. "AS-IS" AND "AS-AVAILABLE" PROVISION</span>
              </div>
              <p className="text-[11.5px] text-[#a4b6d8] leading-relaxed">
                To the maximum extent permitted by applicable law, <strong>Aplx</strong> is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis, without warranties of any kind, whether express, implied, statutory, or otherwise. The developer(s), authors, creators, and contributors (<span className="text-[#c0d2f6]">"the Developer"</span>) expressly disclaim all warranties, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, quiet enjoyment, and accuracy of informational content. The Developer does not warrant that the application will operate error-free, uninterrupted, or compatible with any specific hardware, browser, or third-party service.
              </p>
            </div>

            {/* Clause 2: Limitation of Liability */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
              <div className="font-semibold text-white flex items-center gap-2 text-xs">
                <Scale size={15} className="text-amber-400 flex-none" />
                <span>2. EXCLUSION OF CONSEQUENTIAL & INDIRECT DAMAGES</span>
              </div>
              <p className="text-[11.5px] text-[#a4b6d8] leading-relaxed">
                To the maximum extent permitted by applicable law, in no event shall the Developer be liable to you or any third party for any direct, indirect, incidental, consequential, special, punitive, or exemplary damages, or for any loss of profits, revenue, data, goodwill, business interruption, equipment failure, API billing charges, quota exhaustion, or intangible losses arising out of or relating to:
              </p>
              <ul className="space-y-1 list-disc list-inside text-[11px] text-[#8fa1c4] pl-2">
                <li>Your access to, use of, or inability to access or use Aplx;</li>
                <li>Your independent selection, configuration, or use of third-party AI providers, models, or API keys;</li>
                <li>Prompts, text, code, or materials submitted by you, or outputs generated by connected AI models;</li>
                <li>Actions taken, decisions made, or code executed in reliance upon AI-generated outputs;</li>
                <li>Unauthorized access to, alteration of, or theft from your browser storage caused by malware or extensions;</li>
                <li>Service disruptions, rate limiting, price alterations, or outages caused by third-party model providers or web hosts.</li>
              </ul>
            </div>

            {/* Clause 3: Preservation of Mandatory Statutory Rights */}
            <div className="p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/25 space-y-1.5 text-amber-200/90">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                <ShieldAlert size={14} /> 3. Preservation of Mandatory Statutory Rights
              </span>
              <p className="text-[11.5px] leading-relaxed">
                Nothing in this notice purports to exclude, restrict, or modify any statutory consumer guarantees, non-excludable legal protections, or liabilities that cannot be lawfully excluded under applicable mandatory law (including statutory liabilities for gross negligence, willful misconduct, fraud, or violations of consumer protection legislation in applicable jurisdictions).
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 11: THIRD-PARTY PROVIDER DISCLAIMER */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-provider-disclaimer"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ServerOff size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  SECTION 11
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Third-Party Provider Disclaimer & Independent Relationship
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              No Agency
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Third-party AI providers (e.g., Google, OpenAI, Anthropic, Groq, Mistral, OpenRouter) are distinct, independent entities unaffiliated with Aplx unless explicitly indicated.
            </p>

            <ul className="space-y-2 list-disc list-inside text-[#9eb0d2] text-[11.5px]">
              <li>
                <strong className="text-white">No Agency or Partnership:</strong> Aplx does not act as an agent, reseller, distributor, partner, or joint venturer of any AI provider.
              </li>
              <li>
                <strong className="text-white">Direct Contractual Relationship:</strong> When you generate or input an API key from an AI provider, the legal and commercial contract for service delivery, billing, and data usage exists exclusively between you and that provider.
              </li>
              <li>
                <strong className="text-white">No Control Over Provider Changes:</strong> The Developer has no control over provider availability, model deprecation, price increases, rate limits, latency, or content filtering actions.
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 12: CHILDREN & MINORS */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-children"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <AlertTriangle size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-orange-400 uppercase">
                  SECTION 12
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Children & Minors Protection
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300">
              Minors Policy
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Aplx is a general-purpose developer and productivity utility. It is not directed to children, does not market to minors, and does not knowingly collect or solicit personal data from children.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10.5px] font-mono font-bold text-orange-300 block">
                  INDIA (DPDPA & CONTRACT ACT)
                </span>
                <p className="text-[11px] text-[#8699b8] leading-normal">
                  Under the Digital Personal Data Protection Act, 2023 (DPDPA), an individual who has not completed 18 years is a child. Under the Indian Contract Act, 1872, agreements with minors are void <em>ab initio</em>. Minors must not enter API contracts without guardian consent.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10.5px] font-mono font-bold text-sky-300 block">
                  UNITED STATES (COPPA)
                </span>
                <p className="text-[11px] text-[#8699b8] leading-normal">
                  In compliance with the Children’s Online Privacy Protection Act (COPPA), Aplx does not collect personal information from children under 13 years of age. Aplx operates no remote database of personal identifiers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10.5px] font-mono font-bold text-purple-300 block">
                  EU & UK (GDPR ART. 8)
                </span>
                <p className="text-[11px] text-[#8699b8] leading-normal">
                  Digital consent age thresholds range from 13 to 16 years across European Member States and the UK. Where parental authorization is mandated by local law, minors must obtain such consent prior to use.
                </p>
              </div>
            </div>

            <p className="text-[11.5px] text-[#8699b8]">
              <strong>Parental Responsibility:</strong> Parents or legal guardians supervising minors must ensure appropriate provider selection and supervise model interactions to prevent exposure to age-inappropriate generative content.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 13: INTERNATIONAL USERS & APPLICABLE LAW */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-international"
          className="p-6 sm:p-8 rounded-2xl bg-[#090e1b]/95 border border-indigo-500/30 shadow-2xl space-y-5 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Globe size={18} />
              </div>
              <div>
                <span className="text-[10.5px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                  SECTION 13 • JURISDICTION & MANDATORY LAW
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
                  International Users & Applicable Law (India & Global)
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              CROSS-BORDER LEGAL SYSTEM
            </span>
          </div>

          <div className="space-y-4 text-xs text-[#9eb0d2] leading-relaxed">
            <p className="text-[12px] text-[#cbd7f0]">
              Aplx is globally accessible via the open internet. Because consumer, privacy, and contract laws vary across nations, this notice explicitly aligns with both Indian statutory frameworks and major international privacy architectures:
            </p>

            {/* INDIA SPECIFIC DISCLOSURE */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs font-mono uppercase tracking-wider">
                <Scale size={15} /> A. India-Specific Legal Framework
              </div>

              <div className="space-y-2 text-[11.5px] text-[#a6b9df]">
                <p>
                  <strong>1. Information Technology Act, 2000 & SPDI Rules, 2011:</strong> Sections 43A and 72A of the IT Act penalize unauthorized access and breach of confidentiality. In compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, this document serves as Aplx’s published privacy policy. Aplx does not retain, disclose, or collect sensitive personal data on central servers.
                </p>
                <p>
                  <strong>2. Digital Personal Data Protection Act, 2023 (DPDPA):</strong> Acknowledging the phased implementation of DPDP rules, Aplx does not function as a remote Data Fiduciary processing personal data on centralized cloud infrastructure. Processing executed on the user’s local terminal remains under the direct sovereignty of the user ("Data Principal"). Transmissions to AI providers are governed by the independent status of those providers under the Act.
                </p>
                <p>
                  <strong>3. Consumer Protection Act, 2019 & E-Commerce Rules, 2020:</strong> Section 2(46) of the Consumer Protection Act, 2019 addresses unfair contract terms. This notice is formulated to provide transparent disclosures and does not attempt to unilaterally exclude mandatory liabilities that cannot be lawfully waived under Indian consumer law.
                </p>
                <p>
                  <strong>4. Indian Contract Act, 1872:</strong> In accordance with Sections 10, 11, and 23 of the Indian Contract Act, users must possess legal capacity to contract. Agreements with minors under 18 years of age are void <em>ab initio</em> under Indian jurisprudence (<em>Mohori Bibee v. Dharmodas Ghose</em>).
                </p>
              </div>
            </div>

            {/* INTERNATIONAL FRAMEWORKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-xs font-bold text-sky-400 font-mono uppercase block">
                  B. European Union & UK (GDPR / ePrivacy)
                </span>
                <p className="text-[11px] text-[#8699b8] leading-relaxed">
                  Terminal storage (<code className="text-[#cbd7f0] font-mono">localStorage</code>) is utilized solely for technical configurations strictly necessary to deliver the features explicitly requested by the user, in accordance with ePrivacy Directive Art. 5(3). Users may exercise GDPR rights of access, portability, and complete erasure directly through the in-app client data tools at any time.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase block">
                  C. United States & California (CCPA / CPRA)
                </span>
                <p className="text-[11px] text-[#8699b8] leading-relaxed">
                  Aplx does NOT "sell" or "share" personal information or sensitive personal information to third parties for monetary or valuable consideration, or for cross-context behavioral advertising.
                </p>
              </div>
            </div>

            {/* Electronic Contracting */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-[11px] text-[#8ea3c8]">
              <strong>Electronic Records & Contracting:</strong> In harmony with the UNCITRAL Model Law on Electronic Commerce and domestic electronic transaction enactments, user interactions (such as saving configurations, launching models, and acknowledging terms) constitute valid electronic records.
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 14: CHANGES TO THIS NOTICE */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-changes"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <RefreshCw size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase">
                  SECTION 14
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Changes to This Notice
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300">
              Updates
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <p className="text-[11.5px] text-[#8fa3c8]">
              As open-source software, supported provider endpoints, and applicable statutory standards evolve, this Privacy & Legal Notice may be revised. Any update will be evidenced by the "Last Updated" date displayed at the top of this document. Continued use of Aplx following revisions indicates your review of the updated terms, subject always to non-waivable statutory protections.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 15: CONTACT & PRIVACY REQUESTS */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-contact"
          className="p-6 sm:p-7 rounded-2xl bg-[#090e1b]/90 border border-white/[0.08] shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <ExternalLink size={17} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400 uppercase">
                  SECTION 15
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Contact & Privacy Inquiries
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300">
              Communication
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#9ab0d6] leading-relaxed">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-[11.5px] text-[#8fa3c8]">
              <p>
                For technical bug reports, security disclosures, or questions regarding this Privacy & Legal Notice, inquiries can be submitted via the official open-source repository:
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://github.com/ayushk190524/Aplx"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>GitHub Repository (Aplx)</span>
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/25 text-[11px] text-teal-200/90 leading-relaxed">
              <strong>Notice on Data Erasure Requests:</strong> Because Aplx operates zero central user accounts and retains no remote database of your chats or credentials, data erasure cannot be executed on a remote server by the developer. To completely erase your data, click "Clear All Data" in Settings or wipe site data in your browser's privacy settings.
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 16: IMPORTANT LEGAL STATEMENT */}
        {/* ---------------------------------------------------- */}
        <section
          id="section-legal-statement"
          className="p-6 sm:p-8 rounded-2xl bg-[#090d19] border border-amber-500/40 shadow-2xl space-y-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-amber-500/25">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-none shadow-md shadow-amber-950/40">
                <ShieldAlert size={19} />
              </div>
              <div>
                <span className="text-[10.5px] font-mono font-bold tracking-wider text-amber-400 uppercase">
                  SECTION 16 • BINDING LEGAL STATEMENT
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
                  Important Legal Statement & Severability
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
              DISCLAIMER
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] text-xs leading-relaxed space-y-3">
            <p className="text-[12px] text-amber-200 font-semibold leading-relaxed">
              "This notice is intended to describe Aplx's practices and allocate responsibilities to the maximum extent permitted by applicable law. Laws differ by jurisdiction, and mandatory legal rights and obligations prevail over conflicting provisions. This notice is not a substitute for jurisdiction-specific legal advice."
            </p>

            <p className="text-[11.5px] text-[#8fa3c8] leading-relaxed">
              <strong>Severability Clause:</strong> If any provision of this notice or legal statement is deemed invalid, unlawful, void, or unenforceable by an authoritative court or arbitral tribunal of competent jurisdiction, that specific provision shall be deemed severable and shall not impair or invalidate the enforceability and validity of any remaining provisions.
            </p>
          </div>
        </section>

        {/* MAXIMUM PRIVACY - LOCAL HOSTING RED BOX */}
        <section
          id="section-host-locally"
          className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#22090d] to-[#160507] border-2 border-red-500/80 shadow-2xl shadow-red-950/50 space-y-4 relative overflow-hidden scroll-mt-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-red-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-none shadow-md shadow-red-950/40">
                <ShieldAlert size={19} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase">
                  RECOMMENDED ARCHITECTURE
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase mt-0.5">
                  WANT MAXIMUM PRIVACY? HOST APLX LOCALLY.
                </h2>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 uppercase tracking-wider">
              Self-Host
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-[13px] text-[#ffccd3] leading-relaxed font-normal">
            <p>
              This version of Aplx is hosted using a third-party hosting provider (Vercel). While Aplx does not use a server-side proxy for your AI provider requests, the hosted website itself is delivered through third-party infrastructure.
            </p>
            <p className="text-[#fca5a5]">
              To be clear: this does not mean Vercel is inherently untrustworthy—Vercel is an established, industry-standard hosting provider. Rather, whenever any application is hosted online, users naturally and understandably have heightened privacy concerns regarding third-party cloud infrastructure, edge networks, and online data handling.
            </p>
            <p className="text-white font-medium">
              If you are still concerned about online hosting, want zero reliance on external web infrastructure, or require absolute sovereignty over your environment, we highly recommend installing and hosting Aplx locally on your own device.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://github.com/aplx-renz-sudo/Aplx-Website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
            >
              <span>INSTALL APLX WEBSITE →</span>
            </a>
          </div>
        </section>

        {/* BOTTOM ACTION DECK */}
        <div className="p-6 rounded-2xl bg-[#090e1b]/80 border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div>
            <b className="text-sm font-semibold text-white block">Ready to start private AI workflows?</b>
            <p className="text-xs text-[#8397bc] mt-0.5">Connect your provider keys to begin interacting with zero intermediary servers.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={settings}
              className="primary playful-pop inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2997ff] hover:bg-[#47a6ff] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95"
            >
              <span>Connect a Provider</span>
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              onClick={back}
              className="playful-pop inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-[#cbd7f0] transition-all cursor-pointer"
            >
              <span>Return to Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
