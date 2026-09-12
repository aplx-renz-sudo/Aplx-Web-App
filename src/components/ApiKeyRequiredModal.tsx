import { KeyRound, ShieldAlert, X, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { getProvider, PROVIDER_LIST, type ProviderId } from '../providers/registry';
import type { ProviderConfig } from '../lib/credential';
import type { LocalDetectionResult } from '../lib/localModelDetector';

type ApiKeyRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
  providerId: ProviderId;
  providerConfig: ProviderConfig;
  onGoToSettings: (providerId: ProviderId) => void;
  onSwitchToLocal: (modelId?: string) => void;
  localDetection?: LocalDetectionResult | null;
};

export function ApiKeyRequiredModal({
  isOpen,
  onClose,
  providerId,
  providerConfig,
  onGoToSettings,
  onSwitchToLocal,
  localDetection,
}: ApiKeyRequiredModalProps) {
  if (!isOpen) return null;

  const provider = getProvider(providerId);

  // Find any configured providers with keys
  const configuredProviders = PROVIDER_LIST.filter(
    p => p.requiresKey && (!!providerConfig.apiKeys?.[p.id] || (providerConfig.provider === p.id && !!providerConfig.apiKey))
  );

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="modal-dialog" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={13} /> AUTHENTICATION REQUIRED
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
              <KeyRound size={18} />
            </div>
            <div>
              <h3 id="api-key-modal-title" style={{ fontSize: '15px', fontWeight: 600, color: '#f5f5f7', margin: '0 0 4px 0' }}>
                {provider.name} Requires an API Key
              </h3>
              <p style={{ fontSize: '12px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
                You selected a model on <strong style={{ color: '#f5f5f7' }}>{provider.name}</strong>, but no credentials are saved locally in your browser.
              </p>
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '11.5px', color: '#636366', lineHeight: 1.5 }}>
            Aplx connects directly from your browser to the AI provider without intermediate proxy servers.
          </div>

          {/* Action Choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToSettings(providerId);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#f5f5f7',
                color: '#000000',
                fontWeight: 600,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={14} /> Add {provider.name} Key in Settings
              </span>
              <ArrowRight size={14} />
            </button>

            {/* Local offline alternative */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLocal(localDetection?.recommendedModel?.id || 'llama3.3');
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f5f5f7',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={14} style={{ color: '#2997ff' }} />
                <span>Use Offline Model (Ollama / LM Studio)</span>
              </span>
              <span style={{ fontSize: '10px', color: '#86868b', fontFamily: 'var(--font-mono)' }}>No Key</span>
            </button>

            {/* Other configured providers if available */}
            {configuredProviders.length > 0 && (
              <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Configured Providers with Saved Keys
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {configuredProviders.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onGoToSettings(p.id);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '11px',
                        color: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={11} style={{ color: '#2997ff' }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
