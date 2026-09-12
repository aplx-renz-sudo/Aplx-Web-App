import React, { useState, useEffect, useRef } from 'react';
import {
  Hammer,
  AlertTriangle,
  ArrowLeft,
  SlidersHorizontal,
  Code2,
  Copy,
  Download,
  Check,
  Zap,
  Play,
  Square,
  Trash2,
  Cpu,
  Layers,
  FileCode,
  ShieldCheck,
  History,
  Plus,
  MessageSquare,
  Search,
  Pencil,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { createProvider } from '../providers';
import type { ProviderConfig } from '../lib/credential';
import { CodeBlock } from './CodeBlock';
import { checkAntiDDoS, sanitizeInputPayload } from '../lib/securityGuard';
import { isApiLimitError, triggerApiLimitModal } from '../lib/apiLimitHandler';

interface BuildModeViewProps {
  providerConfig: ProviderConfig;
  onLeave: () => void;
  onOpenSettings: () => void;
}

export interface BuildMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  rawContent?: string;
  timestamp: number;
  bloatRemoved?: number;
  detectedLang?: string;
}

export interface BuildSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: string;
  messages: BuildMessage[];
}

interface BloatFilters {
  stripFluff: boolean;
  codeOnly: boolean;
  pruneBoilerplate: boolean;
  compactComments: boolean;
}

const STORAGE_WARNING_KEY = 'aplx:build_mode_accepted';
const STORAGE_BUILD_SESSIONS = 'aplx:build_mode_sessions';
const STORAGE_ACTIVE_SESSION_ID = 'aplx:build_active_session_id';

// Pre-packaged build task templates
const BUILD_TEMPLATES = [
  {
    title: 'React Component',
    desc: 'Interactive UI with Tailwind & state',
    prompt: 'Build a production-ready React component for a clean, filterable data table with sorting and search using Tailwind CSS.',
    lang: 'typescript',
  },
  {
    title: 'REST API Route',
    desc: 'Express/Node route with validation',
    prompt: 'Code a clean Express.js REST API router with TypeScript, Zod schema validation, and proper error handling for user profile updates.',
    lang: 'typescript',
  },
  {
    title: 'Algorithm & Tests',
    desc: 'Clean logic with unit test suite',
    prompt: 'Write an efficient token bucket rate limiter in TypeScript, along with a comprehensive Vitest/Jest unit test suite.',
    lang: 'typescript',
  },
  {
    title: 'Database Schema',
    desc: 'PostgreSQL schema with indexes',
    prompt: 'Design a clean relational PostgreSQL schema for a collaborative workspace with workspaces, members, roles, and audit logs.',
    lang: 'sql',
  },
];

function loadBuildSessions(): BuildSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_BUILD_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBuildSessions(sessions: BuildSession[]) {
  try {
    localStorage.setItem(STORAGE_BUILD_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save build sessions', e);
  }
}

function generateBuildTitle(prompt: string): string {
  const clean = prompt.replace(/[^\w\s-]/g, '').trim();
  const words = clean.split(/\s+/).slice(0, 5).join(' ');
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Build Session';
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function BuildModeView({ providerConfig, onLeave, onOpenSettings }: BuildModeViewProps) {
  // Check if warning has been accepted
  const [warningAccepted, setWarningAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_WARNING_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Dedicated Build Mode Chat History
  const [sessions, setSessions] = useState<BuildSession[]>(() => loadBuildSessions());
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_SESSION_ID) || '';
    } catch {
      return '';
    }
  });

  // UI Drawer / History state
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Prompt input and build states
  const [prompt, setPrompt] = useState('');
  const [building, setBuilding] = useState(false);
  const [streamingModelText, setStreamingModelText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'raw'>('code');

  // Anti-bloat filters
  const [antiBloatActive, setAntiBloatActive] = useState(true);
  const [filters, setFilters] = useState<BloatFilters>({
    stripFluff: true,
    codeOnly: true,
    pruneBoilerplate: true,
    compactComments: true,
  });

  // Total metrics
  const [bloatRemovedChars, setBloatRemovedChars] = useState(0);
  const [ddosNotice, setDdosNotice] = useState<string | null>(null);

  const stopRef = useRef(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or ensure active session
  useEffect(() => {
    if (sessions.length > 0) {
      const exists = sessions.find(s => s.id === activeSessionId);
      if (!exists) {
        setActiveSessionId(sessions[0].id);
      }
    }
  }, [sessions, activeSessionId]);

  // Persist active session ID
  useEffect(() => {
    if (activeSessionId) {
      try {
        localStorage.setItem(STORAGE_ACTIVE_SESSION_ID, activeSessionId);
      } catch {}
    }
  }, [activeSessionId]);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessions, streamingModelText, activeSessionId]);

  // Focus prompt on accepted warning
  useEffect(() => {
    if (warningAccepted && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [warningAccepted]);

  const handleAcceptWarning = () => {
    try {
      localStorage.setItem(STORAGE_WARNING_KEY, 'true');
    } catch {}
    setWarningAccepted(true);
  };

  // Get active session
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  // Anti-bloat filter logic: strips conversational filler, pleasantries, apologies, and unsolicited fluff
  const applyAntiBloat = (text: string): { clean: string; removedCount: number } => {
    if (!antiBloatActive) {
      return { clean: text, removedCount: 0 };
    }

    let result = text;
    const initialLen = result.length;

    if (filters.stripFluff) {
      // Remove opening pleasantries & conversational chatter
      result = result.replace(
        /^(?:(?:Here(?:'s| is) (?:the|your|a)? ?(?:code|solution|implementation|component|script|file|example)?|Sure(?: thing|!)?|Certainly!|Of course!|Below is (?:the|a)? ?(?:code|implementation)?|I'd be happy to help|Alright|Here you go)[^\n]*\n+)+/i,
        ''
      );

      // Remove closing sign-offs and pleasantries
      result = result.replace(
        /\n+(?:(?:Hope this (?:helps|works)|Let me know if you need (?:anything|any changes|more)|Feel free to (?:ask|modify)|Happy coding|I hope this (?:helps|meets your needs))[^\n]*)+$/i,
        ''
      );
    }

    if (filters.pruneBoilerplate) {
      // Remove duplicate empty lines (more than 2 consecutive newlines)
      result = result.replace(/\n{3,}/g, '\n\n');
    }

    const removedCount = Math.max(0, initialLen - result.length);
    return { clean: result.trim(), removedCount };
  };

  // Helper to extract code from markdown block or return plain text
  function extractCodeOrText(markdown: string): string {
    const codeMatch = markdown.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].trim();
    }
    return markdown.trim();
  }

  // Create a new empty build chat session
  const handleCreateNewSession = () => {
    const newSession: BuildSession = {
      id: crypto.randomUUID(),
      title: 'New Build',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: providerConfig.model,
      messages: [],
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveBuildSessions(updated);
    setActiveSessionId(newSession.id);
    setPrompt('');
    setStreamingModelText('');
    promptInputRef.current?.focus();
  };

  // Delete a build session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveBuildSessions(updated);
    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        setActiveSessionId('');
      }
    }
  };

  // Clear all build chat history
  const handleClearAllHistory = () => {
    if (window.confirm('Clear all Build Mode chat history? This cannot be undone.')) {
      setSessions([]);
      saveBuildSessions([]);
      setActiveSessionId('');
      setStreamingModelText('');
    }
  };

  // Save renamed session title
  const handleSaveRename = (id: string) => {
    const titleToSave = editingTitle.trim() || 'Build Session';
    const updated = sessions.map(s => (s.id === id ? { ...s, title: titleToSave } : s));
    setSessions(updated);
    saveBuildSessions(updated);
    setEditingSessionId(null);
  };

  // Execute build using active AI provider within the Build Session
  const handleStartBuild = async (overridePrompt?: string) => {
    const raw = (overridePrompt || prompt).trim();
    const { clean: textToBuild } = sanitizeInputPayload(raw);
    if (!textToBuild || building) return;

    // Anti-DDoS rate-limit check
    const ddosCheck = checkAntiDDoS('build_code');
    if (!ddosCheck.allowed) {
      setDdosNotice(ddosCheck.message || 'Anti-DDoS Shield: Rate limit exceeded. Please wait a moment.');
      setTimeout(() => setDdosNotice(null), 5000);
      return;
    }

    // Detect language from prompt
    const lowerPrompt = textToBuild.toLowerCase();
    let lang = 'typescript';
    if (lowerPrompt.includes('python') || lowerPrompt.includes('.py')) lang = 'python';
    else if (lowerPrompt.includes('sql') || lowerPrompt.includes('postgres') || lowerPrompt.includes('database')) lang = 'sql';
    else if (lowerPrompt.includes('html') || lowerPrompt.includes('css')) lang = 'html';
    else if (lowerPrompt.includes('rust')) lang = 'rust';
    else if (lowerPrompt.includes('go ') || lowerPrompt.includes('golang')) lang = 'go';
    else if (lowerPrompt.includes('json')) lang = 'json';
    else if (lowerPrompt.includes('bash') || lowerPrompt.includes('shell')) lang = 'bash';

    // Prepare or create active build session
    let targetSession = activeSession;
    let updatedSessions = [...sessions];

    if (!targetSession) {
      targetSession = {
        id: crypto.randomUUID(),
        title: generateBuildTitle(textToBuild),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model: providerConfig.model,
        messages: [],
      };
      updatedSessions = [targetSession, ...sessions];
    } else if (targetSession.messages.length === 0 && targetSession.title === 'New Build') {
      targetSession.title = generateBuildTitle(textToBuild);
    }

    const userMessage: BuildMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToBuild,
      timestamp: Date.now(),
      detectedLang: lang,
    };

    const assistantMessageId = crypto.randomUUID();

    // Append user message immediately
    targetSession.messages = [...targetSession.messages, userMessage];
    targetSession.updatedAt = Date.now();
    targetSession.model = providerConfig.model;

    // Persist immediately
    const updatedWithUser = updatedSessions.map(s => (s.id === targetSession!.id ? targetSession! : s));
    setSessions(updatedWithUser);
    saveBuildSessions(updatedWithUser);
    setActiveSessionId(targetSession.id);

    setPrompt('');
    setBuilding(true);
    setStreamingModelText('');
    stopRef.current = false;

    // Build system instructions with strict anti-bloat filters
    const systemPrompt = antiBloatActive
      ? `[SYSTEM DIRECTIVE: APLX BUILD MODE - STRICT ANTI-BLOAT FILTER ACTIVE]
You are Aplx Build Mode, a specialized engineering and software development engine.
YOUR PRIME OBJECTIVE IS TO DELIVER DIRECT, PRODUCTION-READY, FULLY FUNCTIONAL CODE.

STRICT BLOAT RESTRICTIONS:
1. ZERO CONVERSATIONAL FILLER: Never output greetings ("Sure", "Certainly", "Here is", "Below is").
2. ZERO CLOSING SIGN-OFFS: Never output ("Hope this helps", "Let me know if you have questions").
3. DIRECT CODE PRIORITY: Deliver complete, self-contained, typed code blocks with syntax language specifiers.
4. MINIMAL CONCISE COMMENTS: Keep commentary strictly focused on essential type signatures or architectural invariants.
5. NO REDUNDANT PROSE: Skip all marketing or descriptive fluff.`
      : `[SYSTEM DIRECTIVE: APLX BUILD MODE]
You are Aplx Build Mode. Output clean, functional code for the requested feature.`;

    // Gather history turns specifically for this build session
    const buildHistory = targetSession.messages
      .slice(0, -1) // exclude the just-added user message
      .map(m => ({ role: m.role, content: m.content }));

    let accumulatedRaw = '';

    try {
      const provider = createProvider({
        provider: providerConfig.provider,
        apiKey: providerConfig.apiKey,
        model: providerConfig.model,
        baseUrl: providerConfig.baseUrl,
      });

      await provider.stream(
        textToBuild,
        [
          { role: 'user', content: systemPrompt },
          { role: 'model', content: 'Understood. Build mode active. Returning pure code without conversational fluff.' },
          ...buildHistory,
        ],
        (chunk: string) => {
          if (!stopRef.current) {
            accumulatedRaw += chunk;
            const { clean, removedCount } = applyAntiBloat(accumulatedRaw);
            setStreamingModelText(clean);
            setBloatRemovedChars(prev => prev + removedCount);
          }
        }
      );

      // Finalize and save assistant message to Build Chat History
      const { clean, removedCount } = applyAntiBloat(accumulatedRaw);
      const assistantMessage: BuildMessage = {
        id: assistantMessageId,
        role: 'model',
        content: clean || accumulatedRaw,
        rawContent: accumulatedRaw,
        timestamp: Date.now(),
        bloatRemoved: removedCount,
        detectedLang: lang,
      };

      setSessions(prev => {
        const finished = prev.map(s => {
          if (s.id === targetSession!.id) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, assistantMessage],
            };
          }
          return s;
        });
        saveBuildSessions(finished);
        return finished;
      });
    } catch (err: unknown) {
      if (isApiLimitError(err)) {
        triggerApiLimitModal({
          providerName: 'Build Mode Engine',
          details: err instanceof Error ? err.message : 'API rate limit or quota exceeded during code generation.',
        });
      }
      const errorMessage: BuildMessage = {
        id: assistantMessageId,
        role: 'model',
        content: isApiLimitError(err)
          ? '// 🌱 Quota reached! "Uh oh! Seems like your API has reached its limit! Seems like you were working hard, good job! But, go touch grass now and also don\'t forget to drink water!"'
          : '// Error: Build stream interrupted. Please verify your API key and connection.',
        timestamp: Date.now(),
        detectedLang: 'typescript',
      };
      setSessions(prev => {
        const finished = prev.map(s => {
          if (s.id === targetSession!.id) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, errorMessage],
            };
          }
          return s;
        });
        saveBuildSessions(finished);
        return finished;
      });
    } finally {
      setBuilding(false);
      setStreamingModelText('');
    }
  };

  const handleCopyCode = async (code: string, id: string) => {
    const textToCopy = extractCodeOrText(code);
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownload = (code: string, lang = 'ts') => {
    const text = extractCodeOrText(code);
    const extMap: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      html: 'html',
      sql: 'sql',
      rust: 'rs',
      go: 'go',
      json: 'json',
      bash: 'sh',
    };
    const ext = extMap[lang.toLowerCase()] || 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `build-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered session list
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(historySearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#06090f] text-[#e2e8f0] flex flex-col font-sans">
      {/* Build Mode Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#090d16]/95 backdrop-blur-xl border-b border-[#1c273c] shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeave}
            className="playful-pop p-2 rounded-xl text-[#7f91b3] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Leave Build Mode and return to chat"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Chat</span>
          </button>

          <div className="h-5 w-px bg-white/[0.1] mx-1" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-950/40 flex-none">
              <Hammer size={17} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
                  Build Mode, Aplx
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-[#7182a3] hidden sm:block">
                Dedicated code generation with isolated build history
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chat History Toggle Button */}
          <button
            type="button"
            onClick={() => setShowHistorySidebar(prev => !prev)}
            className={`playful-pop px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              showHistorySidebar
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/[0.05] hover:bg-white/[0.08] border-white/[0.1] text-[#cad7f2]'
            }`}
            title="Toggle Build Mode Chat History"
          >
            <History size={14} className="text-amber-400" />
            <span>Chat History</span>
            {sessions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-200">
                {sessions.length}
              </span>
            )}
          </button>

          {/* New Build Chat Button */}
          <button
            type="button"
            onClick={handleCreateNewSession}
            className="playful-pop px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="Start a fresh build chat session"
          >
            <Plus size={14} />
            <span className="hidden md:inline">New Build</span>
          </button>

          {/* Active Model Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#9fb3d9]">
            <Cpu size={13} className="text-amber-400" />
            <span className="font-mono text-[11px]">{providerConfig.model}</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="playful-pop px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-[#cad7f2] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Configure API provider and keys"
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">API</span>
          </button>

          <button
            onClick={onLeave}
            className="playful-pop px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Main Workspace Layout with Dedicated Build Chat History */}
      <div className="flex-1 flex overflow-hidden">
        {/* BUILD MODE CHAT HISTORY SIDEBAR / DRAWER */}
        {showHistorySidebar && (
          <aside className="w-72 sm:w-80 flex-none bg-[#070b14] border-r border-[#1a2538] flex flex-col z-20 shadow-2xl transition-all">
            <div className="p-3.5 border-b border-[#162032] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={15} className="text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Build Chat History
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCreateNewSession}
                  className="playful-pop p-1.5 rounded-lg text-[#7b8da8] hover:text-white hover:bg-white/[0.06] transition-colors"
                  title="New Build Chat"
                >
                  <Plus size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistorySidebar(false)}
                  className="playful-pop p-1.5 rounded-lg text-[#7b8da8] hover:text-white hover:bg-white/[0.06] transition-colors"
                  title="Close History Sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>

            {/* Search within Build Chat History */}
            <div className="p-3 border-b border-[#162032]">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-[#5e718f]" />
                <input
                  type="text"
                  placeholder="Search build chats…"
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0c1220] border border-[#1d293d] text-xs text-[#e1eafc] placeholder-[#5e718f] outline-none focus:border-amber-500/60 transition-all font-sans"
                />
              </div>
            </div>

            {/* History Sessions List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSessions.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <Terminal size={24} className="mx-auto text-[#405270] mb-2" />
                  <p className="text-xs font-semibold text-[#7d91b3]">No build chats yet</p>
                  <p className="text-[11px] text-[#556682] mt-1">
                    Your code requests and build turns will be safely saved here.
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateNewSession}
                    className="playful-pop mt-3 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                  >
                    Start First Build
                  </button>
                </div>
              ) : (
                filteredSessions.map(session => {
                  const isActive = session.id === activeSessionId;
                  const isEditing = editingSessionId === session.id;
                  const messageCount = session.messages.length;

                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        setStreamingModelText('');
                      }}
                      className={`group relative p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-sm'
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent hover:border-white/[0.08] text-[#9bb0d4]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={e => setEditingTitle(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSaveRename(session.id);
                                  if (e.key === 'Escape') setEditingSessionId(null);
                                }}
                                autoFocus
                                className="w-full px-2 py-0.5 rounded bg-black/60 border border-amber-500/50 text-xs text-white outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRename(session.id)}
                                className="p-1 text-emerald-400 hover:text-emerald-300"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSessionId(null)}
                                className="p-1 text-rose-400 hover:text-rose-300"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <MessageSquare
                                size={13}
                                className={isActive ? 'text-amber-400 flex-none' : 'text-[#586b88] flex-none'}
                              />
                              <span className="text-xs font-semibold truncate block">
                                {session.title}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-[10px] text-[#697d9e] mt-1">
                            <span>{formatTimeAgo(session.updatedAt)}</span>
                            <span>•</span>
                            <span>{messageCount} {messageCount === 1 ? 'turn' : 'turns'}</span>
                          </div>
                        </div>

                        {/* Actions on hover */}
                        {!isEditing && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 flex-none">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setEditingSessionId(session.id);
                                setEditingTitle(session.title);
                              }}
                              className="p-1 text-[#6e82a3] hover:text-white rounded"
                              title="Rename"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={e => handleDeleteSession(session.id, e)}
                              className="p-1 text-[#6e82a3] hover:text-rose-400 rounded"
                              title="Delete"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear All Build History Button */}
            {sessions.length > 0 && (
              <div className="p-3 border-t border-[#162032] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="text-[11px] text-[#6e82a3] hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Clear Build History</span>
                </button>
                <span className="text-[10px] font-mono text-[#526482]">
                  {sessions.length} saved
                </span>
              </div>
            )}
          </aside>
        )}

        {/* WORKSPACE CENTER CONTENT */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* FIRST-TIME WARNING IN YELLOW BOX */}
          {!warningAccepted && (
            <div className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/80 p-5 sm:p-6 shadow-2xl shadow-amber-950/40 backdrop-blur-xl animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-none mt-0.5">
                  <AlertTriangle size={22} />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-amber-300 tracking-tight">
                      Build Mode Notice
                    </h3>
                    <p className="text-sm font-medium text-amber-200/90 mt-1 leading-relaxed">
                      API tokens consumption will increase since you are in build mode, would you like to continue?
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <button
                      onClick={handleAcceptWarning}
                      className="playful-pop px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wide shadow-md shadow-amber-950/40 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Check size={15} />
                      <span>Yes, i want to continue</span>
                    </button>
                    <button
                      onClick={onLeave}
                      className="playful-pop px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white/90 font-medium text-xs transition-colors cursor-pointer"
                    >
                      leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANTI-BLOAT FILTERS BAR */}
          <section className="rounded-2xl bg-[#0a0f1c] border border-[#1b263b] p-4 shadow-lg shadow-black/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#162135]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-none">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                      Anti-Bloat Engine
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        antiBloatActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/[0.06] text-[#7182a3]'
                      }`}
                    >
                      {antiBloatActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7c8ea8]">
                    Filters out conversational filler, pleasantries, and unnecessary token overhead
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {bloatRemovedChars > 0 && (
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                    <Zap size={11} className="text-emerald-400" />
                    <span>{bloatRemovedChars} bloat chars pruned</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setAntiBloatActive(prev => !prev)}
                  className={`playful-pop px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    antiBloatActive
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/[0.05] border border-white/[0.1] text-[#8ea0c2]'
                  }`}
                >
                  {antiBloatActive ? 'Filter Enabled' : 'Enable Anti-Bloat'}
                </button>
              </div>
            </div>

            {/* Sub-filter chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              <button
                type="button"
                onClick={() => setFilters(f => ({ ...f, stripFluff: !f.stripFluff }))}
                className={`playful-pop text-left p-2.5 rounded-xl border text-xs transition-all ${
                  filters.stripFluff && antiBloatActive
                    ? 'bg-[#101a2e] border-emerald-500/30 text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-[#6b7c99]'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center justify-between">
                  <span>🚫 Strip Fluff</span>
                  {filters.stripFluff && antiBloatActive && <Check size={12} className="text-emerald-400" />}
                </div>
                <span className="text-[10px] text-[#7687a4] block mt-0.5">
                  No greetings or sign-offs
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilters(f => ({ ...f, codeOnly: !f.codeOnly }))}
                className={`playful-pop text-left p-2.5 rounded-xl border text-xs transition-all ${
                  filters.codeOnly && antiBloatActive
                    ? 'bg-[#101a2e] border-emerald-500/30 text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-[#6b7c99]'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center justify-between">
                  <span>⚡ Pure Code</span>
                  {filters.codeOnly && antiBloatActive && <Check size={12} className="text-emerald-400" />}
                </div>
                <span className="text-[10px] text-[#7687a4] block mt-0.5">
                  Direct file-ready syntax
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilters(f => ({ ...f, pruneBoilerplate: !f.pruneBoilerplate }))}
                className={`playful-pop text-left p-2.5 rounded-xl border text-xs transition-all ${
                  filters.pruneBoilerplate && antiBloatActive
                    ? 'bg-[#101a2e] border-emerald-500/30 text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-[#6b7c99]'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center justify-between">
                  <span>✂️ Prune Redundancy</span>
                  {filters.pruneBoilerplate && antiBloatActive && <Check size={12} className="text-emerald-400" />}
                </div>
                <span className="text-[10px] text-[#7687a4] block mt-0.5">
                  Tight token whitespace
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilters(f => ({ ...f, compactComments: !f.compactComments }))}
                className={`playful-pop text-left p-2.5 rounded-xl border text-xs transition-all ${
                  filters.compactComments && antiBloatActive
                    ? 'bg-[#101a2e] border-emerald-500/30 text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-[#6b7c99]'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center justify-between">
                  <span>🎯 Compact Comments</span>
                  {filters.compactComments && antiBloatActive && <Check size={12} className="text-emerald-400" />}
                </div>
                <span className="text-[10px] text-[#7687a4] block mt-0.5">
                  Strict docstrings only
                </span>
              </button>
            </div>
          </section>

          {/* CHRONOLOGICAL BUILD CHAT MESSAGES IN THIS SESSION */}
          {activeSession && activeSession.messages.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              {activeSession.messages.map((msg, index) => (
                <div key={msg.id} className="space-y-2">
                  {msg.role === 'user' ? (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="max-w-2xl bg-[#11192b] border border-[#233554] p-3.5 rounded-2xl text-sm text-[#f1f5f9] shadow-md font-mono">
                        <div className="flex items-center gap-2 mb-1 text-[11px] text-[#7388aa]">
                          <Code2 size={12} className="text-amber-400" />
                          <span className="font-semibold text-white">Build Request</span>
                          <span className="text-[10px]">({formatTimeAgo(msg.timestamp)})</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-[#070b14] border border-[#1b263b] overflow-hidden shadow-2xl shadow-black/40 flex flex-col">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#090e1a] border-b border-[#172236] text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-semibold text-white text-xs">
                            Synthesized Output
                          </span>
                          {msg.bloatRemoved ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 font-mono">
                              -{msg.bloatRemoved} bloat chars
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(msg.content, msg.id)}
                            className="playful-pop px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[#cad7f2] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                            title="Copy code"
                          >
                            {copiedId === msg.id ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(msg.content, msg.detectedLang)}
                            className="playful-pop px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[#cad7f2] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                            title="Download file"
                          >
                            <Download size={12} />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-4 overflow-x-auto font-mono text-sm leading-relaxed">
                        <CodeBlock
                          language={msg.detectedLang || 'typescript'}
                          code={extractCodeOrText(msg.content)}
                          label="Generated code :-"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ACTIVE STREAMING GENERATION */}
          {building && (
            <div className="rounded-2xl bg-[#070b14] border border-[#1b263b] overflow-hidden shadow-2xl shadow-black/40 flex flex-col animate-fade-in">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#090e1a] border-b border-[#172236] text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Synthesizing code in Build Mode…</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopRef.current = true;
                    setBuilding(false);
                  }}
                  className="playful-pop px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs"
                >
                  Stop Stream
                </button>
              </div>
              <div className="p-4 font-mono text-sm leading-relaxed">
                <CodeBlock
                  language="typescript"
                  code={extractCodeOrText(streamingModelText || '// Generating bloat-free code...')}
                  label="Generated code :-"
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* BUILD PROMPT INPUT & PRESETS */}
          <section className="rounded-2xl bg-[#0a0f1c] border border-[#1b263b] p-4 sm:p-5 shadow-lg shadow-black/20 space-y-4 mt-auto">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-[#e1eafc] uppercase tracking-wider flex items-center gap-2">
                <Code2 size={14} className="text-amber-400" />
                <span>
                  {activeSession && activeSession.messages.length > 0
                    ? 'Continue Building in this Chat'
                    : 'What do you want to build?'}
                </span>
              </label>
              <span className="text-[11px] text-[#7182a3]">
                Enter to build • Shift+Enter for newline
              </span>
            </div>

            {ddosNotice && (
              <div className="p-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-md animate-bounce">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-amber-400 flex-none" />
                  <span>{ddosNotice}</span>
                </div>
                <button type="button" onClick={() => setDdosNotice(null)} className="text-amber-300 hover:text-white">
                  <X size={13} />
                </button>
              </div>
            )}

            <div className="relative">
              <textarea
                ref={promptInputRef}
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleStartBuild();
                  }
                }}
                className="w-full p-3.5 rounded-xl bg-[#050810] border border-[#202d44] focus:border-amber-500/70 text-sm text-[#f1f5f9] outline-none transition-all font-mono resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2.5">
                {/* Quick Template Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[70%]">
                  {BUILD_TEMPLATES.map(t => (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => {
                        setPrompt(t.prompt);
                        handleStartBuild(t.prompt);
                      }}
                      className="playful-pop px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-[#8ea0c2] hover:text-white whitespace-nowrap transition-colors cursor-pointer flex-none"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {building ? (
                    <button
                      type="button"
                      onClick={() => {
                        stopRef.current = true;
                        setBuilding(false);
                      }}
                      className="playful-pop px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Square size={13} />
                      <span>Stop Build</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!prompt.trim()}
                      onClick={() => handleStartBuild()}
                      className="playful-pop px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold text-xs tracking-wide shadow-md shadow-amber-950/40 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>Code & Build</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
