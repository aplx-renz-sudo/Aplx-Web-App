import { useState, useMemo } from 'react';
import { X, Command, Search, Sparkles, MessageSquare, Compass } from 'lucide-react';

interface ShortcutItem {
  id: string;
  category: 'Chat & Composition' | 'Workspace Navigation' | 'Quick Actions';
  keys: { mac: string[]; win: string[] };
  description: string;
  badge?: string;
}

const SHORTCUT_CATALOG: ShortcutItem[] = [
  {
    id: 'send',
    category: 'Chat & Composition',
    keys: { mac: ['↵ Return'], win: ['Enter'] },
    description: 'Send prompt or execute action',
    badge: 'Primary',
  },
  {
    id: 'newline',
    category: 'Chat & Composition',
    keys: { mac: ['⇧ Shift', '↵ Return'], win: ['Shift', 'Enter'] },
    description: 'Add new line without submitting',
  },
  {
    id: 'prompts',
    category: 'Quick Actions',
    keys: { mac: ['⌘ Cmd', 'K'], win: ['Ctrl', 'K'] },
    description: 'Open Curated Prompt Template Library',
    badge: 'Popular',
  },
  {
    id: 'newchat',
    category: 'Workspace Navigation',
    keys: { mac: ['⌘ Cmd', '⇧ Shift', 'N'], win: ['Ctrl', 'Shift', 'N'] },
    description: 'Start fresh conversation thread',
  },
  {
    id: 'shortcuts',
    category: 'Workspace Navigation',
    keys: { mac: ['⌘ Cmd', '/'], win: ['Ctrl', '/'] },
    description: 'Toggle Keyboard Shortcuts Cheat Sheet',
  },
  {
    id: 'settings',
    category: 'Workspace Navigation',
    keys: { mac: ['⌘ Cmd', ','], win: ['Ctrl', ','] },
    description: 'Open AI Provider & Customizer Settings',
  },
  {
    id: 'escape',
    category: 'Chat & Composition',
    keys: { mac: ['Esc'], win: ['Esc'] },
    description: 'Close active modal or dialog',
  },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const isMac = useMemo(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent || '');
    }
    return false;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return SHORTCUT_CATALOG;
    return SHORTCUT_CATALOG.filter(
      s =>
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.keys.mac.some(k => k.toLowerCase().includes(q)) ||
        s.keys.win.some(k => k.toLowerCase().includes(q))
    );
  }, [search]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(filtered.map(s => s.category)));
    return list;
  }, [filtered]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: '540px' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[#f5f5f7]" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Command size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 id="shortcuts-title" className="text-sm font-semibold text-[#f5f5f7]">Keyboard Shortcuts</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#86868b]">
                  {isMac ? 'macOS' : 'Windows / Linux'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search size={14} className="text-[#636366]" style={{ color: '#636366', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search shortcuts…"
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#f5f5f7', fontSize: '12px', outline: 'none', padding: '0' }}
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ fontSize: '11px', color: '#86868b', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Shortcuts List Content */}
        <div style={{ padding: '8px 20px 16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#636366' }}>
              <Command size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: '12px' }}>No matching shortcuts found</p>
            </div>
          ) : (
            categories.map(category => {
              const items = filtered.filter(s => s.category === category);
              const CategoryIcon =
                category === 'Chat & Composition'
                  ? MessageSquare
                  : category === 'Workspace Navigation'
                  ? Compass
                  : Sparkles;

              return (
                <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px' }}>
                    <CategoryIcon size={13} style={{ color: '#2997ff' }} />
                    <span>{category}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {items.map(s => {
                      const keyList = isMac ? s.keys.mac : s.keys.win;
                      return (
                        <div
                          key={s.id}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '8px' }}>
                            <span style={{ fontSize: '12.5px', color: '#f5f5f7' }}>
                              {s.description}
                            </span>
                            {s.badge && (
                              <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: 'rgba(41, 151, 255, 0.15)', color: '#70b6ff' }}>
                                {s.badge}
                              </span>
                            )}
                          </div>

                          {/* Keycap Display */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            {keyList.map((k, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <kbd style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#f5f5f7', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px' }}>
                                  {k}
                                </kbd>
                                {idx < keyList.length - 1 && (
                                  <span style={{ color: '#636366', fontSize: '11px' }}>+</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#86868b' }}>
          <span>Ready for rapid input</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>Press <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: '#f5f5f7' }}>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
