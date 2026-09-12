import { useState } from 'react';
import { Sparkles, X, Search, BookmarkPlus } from 'lucide-react';

export type PromptTemplate = {
  id: string;
  title: string;
  category: 'code' | 'creative' | 'analysis' | 'productivity';
  prompt: string;
  icon: string;
};

const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    id: 'code-refactor',
    title: 'Code Architecture Refactoring',
    category: 'code',
    icon: '⚡',
    prompt: 'Please review and refactor the following code for maximum performance, idiomatic cleanliness, and edge-case resilience:\n\n```\n// Paste code here\n```',
  },
  {
    id: 'bug-hunter',
    title: 'Root-Cause Bug Diagnosis',
    category: 'code',
    icon: '🐛',
    prompt: 'I am encountering a defect in my program. Analyze this code and error log to identify the exact root cause and provide a drop-in fix:\n\n**Error:**\n\n**Code:**\n```\n\n```',
  },
  {
    id: 'prompt-optimizer',
    title: 'Prompt Enhancer & Token Saver',
    category: 'productivity',
    icon: '✨',
    prompt: 'Rewrite and optimize the following user prompt to be crystal-clear, dense in instructions, and highly structured for LLM execution with minimal token waste:\n\n"[Your draft idea here]"',
  },
  {
    id: 'system-design',
    title: 'Scalable System Design Blueprint',
    category: 'analysis',
    icon: '🏗️',
    prompt: 'Design an end-to-end cloud architecture for [Application Name]. Detail the database schema, cache layers, API endpoints, error fallbacks, and scalability bottlenecks.',
  },
  {
    id: 'executive-summary',
    title: 'Executive Meeting Summary',
    category: 'productivity',
    icon: '📋',
    prompt: 'Condense the following raw notes into a high-impact executive summary with: 1) Core Decisions, 2) Key Metrics, and 3) Action Items with Owners:\n\n[Paste Notes]',
  },
  {
    id: 'security-audit',
    title: 'Security Vulnerability Audit',
    category: 'code',
    icon: '🛡️',
    prompt: 'Perform a comprehensive security audit on this implementation. Check for XSS, SQL/command injections, auth bypassing, race conditions, and insecure defaults:\n\n```\n\n```',
  },
  {
    id: 'creative-concept',
    title: 'Worldbuilding & Narrative Arc',
    category: 'creative',
    icon: '🌌',
    prompt: 'Develop an intriguing sci-fi concept with unique physics laws, factions, conflict hooks, and philosophical themes about artificial intelligence.',
  },
];

const SAVED_PROMPTS_KEY = 'aplx:custom_prompts';

export function PromptLibraryModal({
  isOpen,
  onClose,
  onSelectPrompt,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_PROMPTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const allPrompts = [...customPrompts, ...DEFAULT_PROMPTS];

  const filtered = allPrompts.filter(p => {
    const matchesCat = category === 'all' || p.category === category;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;
    const created: PromptTemplate = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: 'productivity',
      icon: '💡',
      prompt: newPrompt.trim(),
    };
    const updated = [created, ...customPrompts];
    setCustomPrompts(updated);
    try {
      localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updated));
    } catch {}
    setNewTitle('');
    setNewPrompt('');
    setShowAddForm(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-library-title"
    >
      <div className="modal-dialog" style={{ maxWidth: '560px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="text-blue-400" size={17} style={{ color: '#2997ff' }} />
            <h3 id="prompt-library-title" className="text-sm font-semibold text-[#f5f5f7]">Prompt Library</h3>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search & Categories */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search size={14} className="text-[#636366]" style={{ color: '#636366', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prompt templates…"
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#f5f5f7', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', fontSize: '12px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'code', label: 'Coding' },
                { id: 'productivity', label: 'Productivity' },
                { id: 'analysis', label: 'Analysis' },
                { id: 'creative', label: 'Creative' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid transparent',
                    background: category === c.id ? '#ffffff' : 'rgba(255,255,255,0.05)',
                    color: category === c.id ? '#000000' : '#86868b',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                fontSize: '11.5px',
                color: '#2997ff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: 'auto',
              }}
            >
              <BookmarkPlus size={13} /> {showAddForm ? 'Cancel' : 'New Template'}
            </button>
          </div>
        </div>

        {/* Custom Template Add Form */}
        {showAddForm && (
          <form onSubmit={handleSaveCustom} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Template title (e.g. SQL Query Generator)"
              style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#f5f5f7', outline: 'none' }}
            />
            <textarea
              rows={3}
              value={newPrompt}
              onChange={e => setNewPrompt(e.target.value)}
              placeholder="Prompt template instructions…"
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#f5f5f7', outline: 'none', fontFamily: 'var(--font-mono)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="primary" style={{ padding: '4px 12px', fontSize: '11.5px' }}>
                Save Template
              </button>
            </div>
          </form>
        )}

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', fontSize: '12px', color: '#636366' }}>No templates match your query.</div>
          ) : (
            filtered.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPrompt(p.prompt);
                  onClose();
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{p.icon}</span>
                    <strong style={{ fontSize: '12px', color: '#f5f5f7', fontWeight: 500 }}>{p.title}</strong>
                  </div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#86868b' }}>
                    {p.category}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#86868b', fontFamily: 'var(--font-mono)', lineHeight: '1.4', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {p.prompt}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
