import { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, Cpu, ShieldCheck, Layers, Settings2, ArrowRight, Zap, Check } from 'lucide-react';
import type { ProviderConfig } from '../lib/credential';
import { findProviderByModel, getProvider, PROVIDER_LIST, type ProviderId } from '../providers/registry';
import { createProvider, isProviderReady } from '../providers';
import { detectLocalOfflineModels, getCachedLocalModels, type LocalDetectionResult } from '../lib/localModelDetector';
import { isApiLimitError, triggerApiLimitModal } from '../lib/apiLimitHandler';

type ProviderSettingsProps = {
  config: ProviderConfig;
  onChange: (config: ProviderConfig) => void;
  onSave: () => void;
};

export function ProviderSettings({ config, onChange, onSave }: ProviderSettingsProps) {
  const [draft, setDraft] = useState(config);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(() =>
    isProviderReady(config) ? 'Saved locally in browser' : 'Not connected'
  );
  const [isScanningLocal, setIsScanningLocal] = useState(false);
  const [localDetection, setLocalDetection] = useState<LocalDetectionResult | null>(getCachedLocalModels);
  const [activeTab, setActiveTab] = useState<'both' | 'providers' | 'models'>('both');

  useEffect(() => {
    setDraft(config);
  }, [config]);

  // Initial silent probe for local models on mount
  useEffect(() => {
    let isMounted = true;
    detectLocalOfflineModels(config.baseUrls?.ollama || config.baseUrl).then(res => {
      if (isMounted) {
        setLocalDetection(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScanLocalModels = async () => {
    setIsScanningLocal(true);
    try {
      const res = await detectLocalOfflineModels(draft.baseUrls?.ollama || draft.baseUrl);
      setLocalDetection(res);
      if (res.isAvailable && res.models.length > 0) {
        setStatus(`Detected ${res.models.length} local models via ${res.provider === 'ollama' ? 'Ollama' : 'LM Studio'}`);
      } else {
        setStatus('No local server found on port 11434 or 1234');
      }
    } finally {
      setIsScanningLocal(false);
    }
  };

  const active = getProvider(draft.provider);

  const pickProvider = (id: ProviderId) => {
    const def = getProvider(id);
    const existingKey = draft.apiKeys?.[id] || (id === draft.provider ? draft.apiKey : '');
    const existingBaseUrl = draft.baseUrls?.[id] || def.baseUrl || 'http://localhost:11434';

    const updated = {
      ...draft,
      provider: id,
      apiKey: existingKey,
      baseUrl: existingBaseUrl,
      model: def.models.some(m => m.id === draft.model) ? draft.model : def.defaultModel,
    };
    setDraft(updated);
    onChange(updated);
  };

  const handleApplyDetectedLocalModel = (modelId: string) => {
    pickProvider('ollama');
    const updated = {
      ...draft,
      provider: 'ollama' as const,
      model: modelId,
      baseUrl: localDetection?.baseUrl || 'http://localhost:11434',
    };
    setDraft(updated);
    onChange(updated);
    setStatus(`Switched to ${modelId} (Offline · No Key)`);
  };

  const handleKeyChange = (newKey: string) => {
    setDraft(prev => ({
      ...prev,
      apiKey: newKey,
      apiKeys: {
        ...(prev.apiKeys || {}),
        [prev.provider]: newKey,
      },
    }));
  };

  const handleBaseUrlChange = (newUrl: string) => {
    setDraft(prev => ({
      ...prev,
      baseUrl: newUrl,
      baseUrls: {
        ...(prev.baseUrls || {}),
        [prev.provider]: newUrl,
      },
    }));
  };

  const save = () => {
    onChange(draft);
    onSave();
    setStatus('Saved in ' + (draft.remember ? 'local storage' : 'current session'));
  };

  const test = async () => {
    if (!isProviderReady(draft)) return;
    setStatus('Testing direct connection…');
    try {
      await createProvider({
        provider: draft.provider,
        apiKey: draft.apiKey,
        model: draft.model,
        baseUrl: draft.baseUrl,
      }).testConnection();
      setStatus('Connected successfully to ' + active.name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'check credentials';
      setStatus(`Connection failed: ${msg}`);
      if (isApiLimitError(err) || isApiLimitError(msg)) {
        triggerApiLimitModal({
          providerName: active.name,
          details: msg,
        });
      }
    }
  };

  const remove = () => {
    const clearedKeys = { ...(draft.apiKeys || {}) };
    delete clearedKeys[draft.provider];
    const cleared = { ...draft, apiKey: '', apiKeys: clearedKeys };
    setDraft(cleared);
    onChange(cleared);
    setStatus('Credentials removed for ' + active.name);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-navigation to separate AI Provider vs Models */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-semibold text-[#f5f5f7] tracking-tight">AI Providers & Models</h2>
          <p className="text-xs text-[#86868b] mt-0.5 leading-relaxed">
            Configure your AI engines and specific models. All credentials stay directly in your browser.
          </p>
        </div>

        {/* Segmented View Switcher to separate Provider and Models */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] flex-none">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'both'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
          >
            <Layers size={13} />
            <span>All Sections</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('providers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'providers'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
          >
            <Sparkles size={13} />
            <span>1. AI Providers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
          >
            <Settings2 size={13} />
            <span>2. Models & Key</span>
          </button>
        </div>
      </div>

      {/* Local Model Auto-Detection Banner */}
      <div className="p-4 rounded-2xl bg-[#0e1628]/70 border border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#2997ff] flex-none">
              <Cpu size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#f5f5f7] flex items-center gap-2">
                <span>Local Offline Model Detector</span>
                {localDetection?.isAvailable && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-mono">
                    Connected ({localDetection.provider})
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#86868b] mt-0.5">
                {localDetection?.isAvailable
                  ? `Found ${localDetection.models.length} model(s) installed on this machine`
                  : 'Scan localhost:11434 (Ollama) or localhost:1234 (LM Studio)'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleScanLocalModels}
            disabled={isScanningLocal}
            className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs text-[#f5f5f7] flex items-center justify-center gap-2 font-medium cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-4 h-4 rounded-full bg-white/[0.1] flex items-center justify-center">
              <RefreshCw size={10} className={isScanningLocal ? 'animate-spin' : ''} />
            </div>
            <span>{isScanningLocal ? 'Scanning…' : 'Scan Machine'}</span>
          </button>
        </div>

        {/* List of Detected Local Models */}
        {localDetection?.isAvailable && localDetection.models.length > 0 && (
          <div className="pt-2.5 border-t border-white/[0.06] space-y-2">
            <div className="text-xs text-[#2997ff] font-medium flex items-center gap-1">
              <Sparkles size={12} /> Detected Local Models on Your Computer:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {localDetection.models.map(m => {
                const isCurrent = draft.provider === 'ollama' && draft.model === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleApplyDetectedLocalModel(m.id)}
                    className={`model-card-btn ${isCurrent ? 'active-model' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="circle-model-tag">
                        <Cpu size={13} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5 text-[#f5f5f7]">
                          <span>{m.name}</span>
                          {isCurrent && <CheckCircle2 size={12} className="text-[#2997ff] flex-none" />}
                        </div>
                        <div className="text-[10.5px] text-[#86868b] font-mono truncate">
                          {m.id} {m.size ? `• ${m.size}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className={`circle-radio-badge ${isCurrent ? 'checked' : ''}`}>
                      {isCurrent && <div className="circle-radio-dot" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: AI PROVIDER SELECTION */}
      {(activeTab === 'both' || activeTab === 'providers') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-[#2997ff] text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <label className="text-xs font-semibold text-[#f5f5f7] tracking-tight">
                SELECT AI PROVIDER ({PROVIDER_LIST.length} AVAILABLE)
              </label>
            </div>
            <span className="text-[11px] text-[#86868b] font-mono">
              Click any provider button to configure
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="list">
            {PROVIDER_LIST.map(p => {
              const hasKey = !!draft.apiKeys?.[p.id] || (draft.provider === p.id && !!draft.apiKey);
              const isLocal = !p.requiresKey;
              const isSelected = draft.provider === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  role="button"
                  className={`provider-card-btn ${isSelected ? 'active-provider' : ''}`}
                  onClick={() => pickProvider(p.id)}
                  aria-pressed={isSelected}
                >
                  {/* Distinct Circular Logo Avatar */}
                  <div className="circle-avatar">
                    {p.logo}
                  </div>

                  {/* Provider Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-[#f5f5f7] truncate">{p.name}</span>
                      {isLocal ? (
                        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-400/10 px-1.5 py-0.5 rounded-full border border-cyan-400/20 flex-none">
                          Offline
                        </span>
                      ) : hasKey ? (
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-1.5 py-0.5 rounded-full border border-emerald-400/20 flex-none">
                          Configured
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#86868b] font-mono bg-white/[0.04] px-1.5 py-0.5 rounded-full flex-none">
                          Key Needed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#86868b] truncate leading-tight">{p.description}</p>
                  </div>

                  {/* Distinct Circular Radio Selection Indicator */}
                  <div className={`circle-radio-badge ${isSelected ? 'checked' : ''}`}>
                    {isSelected && <div className="circle-radio-dot" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons for Providers */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] text-[#86868b] font-medium">Quick Actions:</span>
            <button
              type="button"
              onClick={() => pickProvider('ollama')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Zap size={12} />
              <span>Use Offline Ollama</span>
            </button>
            <button
              type="button"
              onClick={() => pickProvider('gemini')}
              className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles size={12} />
              <span>Use Google Gemini</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const clearedConfig = { ...draft, apiKey: '', apiKeys: {} };
                setDraft(clearedConfig);
                onChange(clearedConfig);
                setStatus('All saved API keys cleared');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/30 text-[#86868b] hover:text-rose-300 text-xs font-medium cursor-pointer transition-all active:scale-95 ml-auto"
            >
              <span>Clear All Saved Keys</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: MODELS & CREDENTIAL CONFIGURATION (SEPARATE DEDICATED AREA) */}
      {(activeTab === 'both' || activeTab === 'models') && (
        <div className="p-6 rounded-3xl bg-[#0a0f1d]/90 border border-white/[0.1] shadow-2xl space-y-6">
          {/* Header of Active Provider */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="circle-avatar" style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', background: 'rgba(41, 151, 255, 0.2)', borderColor: '#2997ff' }}>
                <span className="text-xl">{active.logo}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-[#2997ff] text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm font-bold text-[#f5f5f7] block">{active.name} Configuration</span>
                </div>
                <p className="text-xs text-[#86868b] mt-0.5">{active.description}</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-[#2997ff] font-mono font-semibold">
              ACTIVE ENGINE
            </span>
          </div>

          <p className="text-xs text-[#86868b] leading-relaxed bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.06]">
            {active.instructions}
          </p>

          {/* Separate Model Selection Area with Tactile Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#f5f5f7] flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>SELECT MODEL FOR {active.name.toUpperCase()}</span>
              </label>
              <span className="text-[11px] font-mono text-[#86868b]">
                {active.models.length} Model{active.models.length > 1 ? 's' : ''} Available
              </span>
            </div>

            {/* Tactile Model Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {active.models.map((m, idx) => {
                const isSelected = draft.model === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="button"
                    onClick={() => {
                      const updated = { ...draft, model: m.id };
                      setDraft(updated);
                      onChange(updated);
                    }}
                    className={`model-card-btn ${isSelected ? 'active-model' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="circle-model-tag">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#f5f5f7] truncate">
                          {m.label}
                        </div>
                        <div className="text-[10.5px] text-[#86868b] font-mono truncate">
                          ID: {m.id}
                        </div>
                      </div>
                    </div>

                    <div className={`circle-radio-badge ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <div className="circle-radio-dot" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Base URL Endpoint if applicable */}
          {active.baseUrlLabel && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#f5f5f7] block">
                  {active.baseUrlLabel.toUpperCase()}
                </label>
                <button
                  type="button"
                  onClick={() => handleBaseUrlChange(active.baseUrl || 'http://localhost:11434')}
                  className="text-[10.5px] font-mono text-[#8ea8ff] hover:underline cursor-pointer"
                >
                  Reset Default
                </button>
              </div>
              <div className="flex items-center bg-black/40 border border-white/[0.1] rounded-2xl px-3.5 focus-within:border-[#2997ff] shadow-inner">
                <input
                  type="url"
                  value={draft.baseUrl}
                  onChange={e => handleBaseUrlChange(e.target.value)}
                  placeholder={active.baseUrl}
                  autoComplete="off"
                  className="w-full py-3 bg-transparent text-xs text-[#f5f5f7] outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* API Key Credentials Field */}
          {active.requiresKey ? (
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#f5f5f7] flex items-center gap-1.5">
                  <KeyRound size={13} className="text-amber-400" />
                  <span>{active.keyLabel.toUpperCase()}</span>
                </label>
                <span className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck size={12} /> Stored in Browser Only
                </span>
              </div>

              <div className="flex items-center bg-black/40 border border-white/[0.1] rounded-2xl px-3.5 focus-within:border-[#2997ff] shadow-inner gap-2">
                <KeyRound size={15} className="text-[#636366] flex-none" />
                <input
                  type={show ? 'text' : 'password'}
                  value={draft.apiKey}
                  onChange={e => handleKeyChange(e.target.value)}
                  placeholder={active.keyPlaceholder}
                  autoComplete="off"
                  className="w-full py-3 bg-transparent text-xs text-[#f5f5f7] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Hide key' : 'Show key'}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-[#86868b] hover:text-[#f5f5f7] bg-white/[0.04] hover:bg-white/[0.1] cursor-pointer transition-colors flex items-center gap-1.5 flex-none font-medium border border-white/[0.06]"
                >
                  {show ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{show ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#636366] leading-relaxed">
                Keys are never sent to intermediate proxy servers. Aplx communicates directly from your client.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-none">
                <Zap size={14} className="text-cyan-400" />
              </div>
              <div>
                <b className="font-semibold text-white">Zero API Keys Required:</b> This model executes completely offline in your local environment.
              </div>
            </div>
          )}

          {/* Persist Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={draft.remember}
              onChange={e => setDraft({ ...draft, remember: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-[#86868b]">
              <span className="text-[#f5f5f7] block font-medium">Persist credentials across browser sessions</span>
              <span className="text-[11px] text-[#636366]">Saved in localStorage on this device only.</span>
            </span>
          </label>

          {/* Connection Status Indicator */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${status.includes('Connected') || status.includes('Saved') || status.includes('Detected') ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400 shadow-sm shadow-amber-400'}`} />
              <span className="text-[#f5f5f7] font-medium">{status}</span>
            </div>
            <span className="text-[10.5px] text-[#86868b] font-mono">{active.route}</span>
          </div>

          {/* Action Buttons with Rounded Circles & Distinct Shapes */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-white text-black text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              onClick={save}
              disabled={!isProviderReady(draft)}
            >
              <div className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center">
                <Check size={11} className="text-black" />
              </div>
              <span>Save Settings</span>
            </button>

            <button
              type="button"
              className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-[#f5f5f7] flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
              onClick={test}
              disabled={!isProviderReady(draft)}
            >
              <div className="w-4 h-4 rounded-full bg-blue-500/20 text-[#2997ff] flex items-center justify-center">
                <RefreshCw size={10} />
              </div>
              <span>Test Direct Connection</span>
            </button>

            <button
              type="button"
              className="px-4 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
              onClick={() => {
                triggerApiLimitModal({
                  providerName: active.name,
                  details: 'Preview: Rate limit simulated (429 Too Many Requests)',
                });
              }}
              title="Preview the funny 'Touch Grass & Drink Water' API limit popup"
            >
              <span>🌱 Preview &quot;Touch Grass&quot; Popup</span>
            </button>

            {active.requiresKey && (
              <button
                type="button"
                className="px-4 py-2.5 rounded-full text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 ml-auto cursor-pointer transition-all"
                onClick={remove}
              >
                Remove Key
              </button>
            )}
          </div>
        </div>
      )}

      <ConnectionDetails provider={draft.provider} route={active.route} />
    </div>
  );
}

function ConnectionDetails({ provider, route }: { provider: ProviderId; route: string }) {
  const name = getProvider(provider).name;
  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
      <div className="text-[10.5px] font-mono text-[#86868b] uppercase tracking-wider flex items-center gap-1.5">
        <ShieldCheck size={13} className="text-emerald-400" />
        <span>Security & Direct Client Architecture</span>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] pt-1">
        <dt className="text-[#636366]">Client Interface</dt>
        <dd className="text-[#f5f5f7] font-mono">Aplx Web Workstation</dd>
        <dt className="text-[#636366]">Active Engine</dt>
        <dd className="text-[#f5f5f7] font-mono">{name}</dd>
        <dt className="text-[#636366]">Direct Endpoint</dt>
        <dd className="text-[#f5f5f7] font-mono">{route}</dd>
        <dt className="text-[#636366]">Server Ingestion</dt>
        <dd className="text-emerald-400 font-mono font-semibold">0% (Pure Browser-Side Routing)</dd>
      </dl>
    </div>
  );
}

export function ChatModelSelect({
  config,
  onModelChange,
  onRequireKeyPrompt,
  detectedLocalModels,
}: {
  config: ProviderConfig;
  onModelChange: (modelId: string, providerId: ProviderId) => void;
  onRequireKeyPrompt?: (providerName: string, providerId: ProviderId) => void;
  detectedLocalModels?: LocalDetectionResult | null;
}) {
  const handleChange = (selectedModelId: string) => {
    // Check if it's a detected local model
    if (detectedLocalModels?.isAvailable && detectedLocalModels.models.some(m => m.id === selectedModelId)) {
      onModelChange(selectedModelId, 'ollama');
      return;
    }

    const foundProvider = findProviderByModel(selectedModelId);
    const providerId = foundProvider ? foundProvider.id : config.provider;

    // Check if key is required and missing
    if (foundProvider && foundProvider.requiresKey) {
      const hasKey = !!config.apiKeys?.[providerId] || (providerId === config.provider && !!config.apiKey);
      if (!hasKey) {
        onRequireKeyPrompt?.(foundProvider.name, providerId);
      }
    }

    onModelChange(selectedModelId, providerId);
  };

  return (
    <select
      className="model-select-header cursor-pointer bg-transparent text-[#f5f5f7] outline-none text-xs font-medium pr-2 max-w-[200px] sm:max-w-[320px] truncate"
      value={config.model}
      onChange={e => handleChange(e.target.value)}
      aria-label="Model Selection"
    >
      {/* If local offline models are detected, display them at the very top */}
      {detectedLocalModels?.isAvailable && detectedLocalModels.models.length > 0 && (
        <optgroup
          label="⚡ LOCAL OFFLINE MODELS"
          className="bg-[#0c101a] text-cyan-400 font-bold"
        >
          {detectedLocalModels.models.map(m => (
            <option
              key={`local-${m.id}`}
              value={m.id}
              className="bg-[#0c101a] text-[#f5f5f7] font-medium"
            >
              ⚡ {m.name} {m.size ? `(${m.size})` : ''} — Offline
            </option>
          ))}
        </optgroup>
      )}

      {PROVIDER_LIST.map(provider => {
        const hasKey = !!config.apiKeys?.[provider.id] || (provider.id === config.provider && !!config.apiKey);
        const isOffline = !provider.requiresKey;
        const statusPrefix = isOffline ? '⚡' : hasKey ? '✓' : '🔒';
        const statusLabel = isOffline ? '[Offline]' : hasKey ? '[Ready]' : '[Key Needed]';

        return (
          <optgroup
            key={provider.id}
            label={`${statusPrefix} ${provider.name} ${statusLabel}`}
            className={`font-semibold ${hasKey || isOffline ? 'bg-[#0c101a] text-[#f5f5f7]' : 'bg-[#0c101a] text-[#636366]'}`}
          >
            {provider.models.map(m => (
              <option
                key={m.id}
                value={m.id}
                className="bg-[#0c101a] text-[#f5f5f7] font-normal"
              >
                {statusPrefix} {m.label} {!hasKey && !isOffline ? '(Key Req.)' : ''}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
