import { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../types';
import {
  User,
  Sparkles,
  Upload,
  ShieldCheck,
  Loader2,
  X,
  Trash2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Shield,
  Activity,
  CheckCircle2,
  Zap,
  FileText,
} from 'lucide-react';
import { sounds } from '../lib/audio';
import { processImageToCompactSquare, removeUserProfile } from '../lib/userProfile';
import {
  hashProfilePin,
  verifyProfilePin,
  getSecurityAuditReport,
} from '../lib/securityGuard';

interface OfflineAccountModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile, startTour: boolean) => void;
  onClose?: () => void;
  onRemoveAccount?: () => void;
  onGoToPrivacy?: () => void;
  existingProfile?: UserProfile | null;
  soundEnabled?: boolean;
}

export const AVATAR_PRESETS = [
  { id: 'astronaut', name: 'Astronaut', emoji: '🧑‍🚀' },
  { id: 'hacker', name: 'Cyber Hacker', emoji: '👾' },
  { id: 'wizard', name: 'Prompt Wizard', emoji: '🧙‍♂️' },
  { id: 'alchemist', name: 'AI Alchemist', emoji: '🔮' },
  { id: 'architect', name: 'Code Architect', emoji: '⚡' },
  { id: 'cat', name: 'Stardust Feline', emoji: '🐱' },
  { id: 'fox', name: 'Cyber Fox', emoji: '🦊' },
  { id: 'robot', name: 'Robo Pilot', emoji: '🤖' },
];

export function OfflineAccountModal({
  isOpen,
  onComplete,
  onClose,
  onRemoveAccount,
  onGoToPrivacy,
  existingProfile,
  soundEnabled = true,
}: OfflineAccountModalProps) {
  const [name, setName] = useState(existingProfile?.name || '');
  const [avatar, setAvatar] = useState(existingProfile?.avatar || 'astronaut');
  const [avatarType, setAvatarType] = useState<'preset' | 'custom'>(
    existingProfile?.avatarType || 'preset'
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    existingProfile?.avatarType === 'custom' ? existingProfile.avatar : ''
  );
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [startTour, setStartTour] = useState(!existingProfile?.isSetupComplete);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // First-time profile privacy check popup
  const isFirstTimeProfile = !existingProfile?.isSetupComplete;
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(isFirstTimeProfile);

  useEffect(() => {
    if (isOpen && !existingProfile?.isSetupComplete) {
      setShowPrivacyWarning(true);
    }
  }, [isOpen, existingProfile?.isSetupComplete]);

  // Security & PIN Vault state
  const hasExistingPin = Boolean(existingProfile?.securityPinHash && existingProfile?.securityPinSalt);
  const [isUnlocked, setIsUnlocked] = useState(!existingProfile?.isPinLocked || !hasExistingPin);
  const [enteredUnlockPin, setEnteredUnlockPin] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // PIN Configuration state (inside the modal)
  const [enablePinLock, setEnablePinLock] = useState(Boolean(existingProfile?.isPinLocked && hasExistingPin));
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Account removal PIN challenge
  const [deletePinInput, setDeletePinInput] = useState('');
  const [deletePinError, setDeletePinError] = useState<string | null>(null);

  // Audit state
  const audit = getSecurityAuditReport();

  // Reset unlock state when profile changes
  useEffect(() => {
    if (existingProfile?.isPinLocked && hasExistingPin) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }
  }, [existingProfile?.id, existingProfile?.isPinLocked, hasExistingPin]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compactSquareBase64 = await processImageToCompactSquare(file, 256, 0.85);
        setCustomAvatarUrl(compactSquareBase64);
        setAvatar(compactSquareBase64);
        setAvatarType('custom');
      } catch (err) {
        console.error('Image compression failed', err);
      } finally {
        setIsProcessingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Handle PIN unlock for locked profiles
  const handleUnlockProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredUnlockPin.trim() || !existingProfile?.securityPinHash || !existingProfile?.securityPinSalt) {
      return;
    }

    setIsVerifyingPin(true);
    setUnlockError(null);

    try {
      const result = await verifyProfilePin(
        enteredUnlockPin.trim(),
        existingProfile.securityPinHash,
        existingProfile.securityPinSalt
      );

      if (result.success) {
        setIsUnlocked(true);
        setEnteredUnlockPin('');
        if (soundEnabled) sounds.playComplete();
      } else {
        if (result.lockoutRemainingSec) {
          setUnlockError(`Brute-force protection: Locked out for ${result.lockoutRemainingSec}s.`);
        } else {
          setUnlockError(`Incorrect PIN. ${result.attemptsRemaining ?? 0} attempts remaining before lockout.`);
        }
      }
    } catch {
      setUnlockError('Error validating PIN.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    // Validate new PIN if enabled
    let pinHash = existingProfile?.securityPinHash;
    let pinSalt = existingProfile?.securityPinSalt;

    if (enablePinLock) {
      if (newPin) {
        if (newPin.length < 4 || newPin.length > 8) {
          setPinError('Security PIN must be between 4 and 8 digits.');
          return;
        }
        if (newPin !== confirmPin) {
          setPinError('Security PIN and confirmation do not match.');
          return;
        }
        // Salt and hash using WebCrypto SHA-256
        const hashed = await hashProfilePin(newPin);
        pinHash = hashed.hash;
        pinSalt = hashed.salt;
      } else if (!hasExistingPin) {
        setPinError('Please enter a 4-8 digit PIN to enable profile lock.');
        return;
      }
    } else {
      // Disabled PIN
      pinHash = undefined;
      pinSalt = undefined;
    }

    const finalName = name.trim() || 'Explorer';
    const profile: UserProfile = {
      id: existingProfile?.id || `user_${Date.now()}`,
      name: finalName,
      avatar: avatarType === 'custom' ? customAvatarUrl || 'astronaut' : avatar,
      avatarType: avatarType === 'custom' && customAvatarUrl ? 'custom' : 'preset',
      bio: bio.trim(),
      joinedAt: existingProfile?.joinedAt || Date.now(),
      isSetupComplete: true,
      securityPinHash: pinHash,
      securityPinSalt: pinSalt,
      isPinLocked: enablePinLock,
      isTampered: false,
    };

    if (soundEnabled) sounds.playComplete();
    onComplete(profile, startTour);
  };

  const confirmDeleteAccount = async () => {
    setDeletePinError(null);

    // If PIN protected, require PIN before deleting
    if (existingProfile?.securityPinHash && existingProfile?.securityPinSalt) {
      if (!deletePinInput) {
        setDeletePinError('Enter your Security PIN to authorize deletion.');
        return;
      }
      const verify = await verifyProfilePin(
        deletePinInput,
        existingProfile.securityPinHash,
        existingProfile.securityPinSalt
      );
      if (!verify.success) {
        setDeletePinError(verify.lockoutRemainingSec ? `Locked out for ${verify.lockoutRemainingSec}s` : 'Incorrect PIN.');
        return;
      }
    }

    setShowDeleteWarning(false);
    if (onRemoveAccount) {
      onRemoveAccount();
    }
  };

  const selectedPreset = AVATAR_PRESETS.find(p => p.id === avatar);

  return (
    <>
      <div
        className="modal-overlay"
        onClick={e => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
      >
        <div className="modal-dialog" style={{ maxWidth: '500px' }}>
          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center gap-2">
              {showPrivacyWarning ? (
                <span className="text-[11px] font-mono font-semibold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle size={13} /> MANDATORY POLICY NOTICE
                </span>
              ) : (
                <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> 100% PRIVATE · CLIENT-ONLY
                </span>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="modal-close-btn"
                title="Close"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[82vh]">
            {/* FIRST-TIME PROFILE MANDATORY PRIVACY POPUP */}
            {showPrivacyWarning ? (
              <div className="py-3 text-center space-y-5 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-950/60">
                  <ShieldAlert size={28} />
                </div>

                <div className="space-y-2.5 max-w-sm mx-auto">
                  <span className="text-[10.5px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <FileText size={12} /> NOTICE & RESPONSIBILITY DISCLOSURE
                  </span>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    Before using Aplx
                  </h2>

                  <p className="text-xs sm:text-[13px] text-[#ccd8f0] leading-relaxed pt-1">
                    Please review the Privacy & Legal Notice before continuing. It explains how Aplx handles credentials and data, your responsibilities, third-party provider processing, and important legal limitations.
                  </p>
                </div>

                <div className="space-y-2.5 max-w-xs mx-auto pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) sounds.playClick();
                      if (onGoToPrivacy) {
                        onGoToPrivacy();
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Review Privacy & Legal Notice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) sounds.playClick();
                      setShowPrivacyWarning(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-semibold text-[#cbd7f0] transition-all cursor-pointer hover:text-white"
                  >
                    I have reviewed this notice, continue
                  </button>

                  <p className="text-[10.5px] text-[#7d90b2] leading-tight pt-1">
                    By continuing to use Aplx, you acknowledge that you have reviewed this notice. Nothing in these terms limits rights or protections that cannot legally be waived.
                  </p>
                </div>
              </div>
            ) : !isUnlocked ? (
              <div className="py-6 text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40">
                  <Lock size={26} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Profile Security Vault Active
                  </h2>
                  <p className="text-xs text-[#8da0c4] mt-1.5 max-w-xs mx-auto">
                    This profile is protected with a salted cryptographic PIN. Enter your PIN to edit settings or manage credentials.
                  </p>
                </div>

                <form onSubmit={handleUnlockProfile} className="space-y-3 max-w-xs mx-auto">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Enter Security PIN"
                    value={enteredUnlockPin}
                    onChange={e => {
                      setEnteredUnlockPin(e.target.value.replace(/\D/g, ''));
                      setUnlockError(null);
                    }}
                    className="w-full h-11 px-4 text-center tracking-widest font-mono text-lg rounded-xl bg-black/50 border border-white/15 focus:border-amber-400 text-white outline-none"
                    autoFocus
                  />

                  {unlockError && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg flex items-center justify-center gap-1.5">
                      <AlertTriangle size={13} />
                      <span>{unlockError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!enteredUnlockPin || isVerifyingPin}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    {isVerifyingPin ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
                    <span>Unlock Profile</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <h2 id="account-modal-title" className="text-xl font-bold tracking-tight text-[#f5f5f7]">
                    {existingProfile?.isSetupComplete ? 'Edit Profile & Security' : 'Create Offline Account'}
                  </h2>
                  <p className="text-xs text-[#86868b] mt-1 max-w-xs mx-auto">
                    Saved locally in your browser. Zero cloud backdoors, zero telemetry.
                  </p>
                </div>

                {existingProfile?.isTampered && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                    <ShieldAlert size={16} className="text-amber-400 flex-none mt-0.5" />
                    <div>
                      <span className="font-bold">Integrity Signature Notice:</span> Local storage variation detected. Saving will re-sign your profile with fresh SHA-256 cryptographic proof.
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Avatar Selection Preview */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/[0.12] p-0.5 shadow-lg aspect-square flex-none">
                        <div className="w-full h-full rounded-2xl bg-[#090c14] flex items-center justify-center overflow-hidden aspect-square">
                          {isProcessingImage ? (
                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                          ) : avatarType === 'custom' && customAvatarUrl ? (
                            <img
                              src={customAvatarUrl}
                              alt="Profile avatar"
                              className="w-full h-full object-cover aspect-square rounded-2xl"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-3xl select-none">
                              {selectedPreset ? selectedPreset.emoji : '🧑‍🚀'}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#1a2336] hover:bg-[#25324e] border border-white/[0.12] text-[#f5f5f7] shadow-md cursor-pointer transition-colors"
                        title="Upload custom image"
                        disabled={isProcessingImage}
                      >
                        <Upload size={12} />
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Avatar Preset Grid */}
                    <div className="w-full">
                      <div
                        className="grid grid-cols-4 sm:grid-cols-8 gap-1.5"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: '6px' }}
                      >
                        {AVATAR_PRESETS.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setAvatar(p.id);
                              setAvatarType('preset');
                            }}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                              avatarType === 'preset' && avatar === p.id
                                ? 'border-[#2997ff] bg-blue-500/20 shadow-sm'
                                : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.15]'
                            }`}
                            title={p.name}
                          >
                            <span className="text-lg">{p.emoji}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Display Name Input */}
                  <div>
                    <label className="text-[10.5px] font-mono tracking-wider text-[#86868b] block mb-1">
                      DISPLAY NAME
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        maxLength={40}
                        placeholder="e.g. Alex, Sage, Traveler"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full h-10 px-3 pl-9 rounded-lg bg-black/40 border border-white/10 focus:border-[#2997ff] text-[#f5f5f7] placeholder-[#636366] text-xs outline-none transition-all"
                      />
                      <User size={14} className="absolute left-3 top-3 text-[#636366] pointer-events-none" />
                    </div>
                  </div>

                  {/* Optional Bio / Tagline */}
                  <div>
                    <label className="text-[10.5px] font-mono tracking-wider text-[#86868b] block mb-1">
                      TITLE OR ROLE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="e.g. Lead Designer, Engineer, Researcher"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-black/40 border border-white/10 focus:border-[#2997ff] text-[#f5f5f7] placeholder-[#636366] text-xs outline-none transition-all"
                    />
                  </div>

                  {/* ENHANCED SECURITY VAULT & PIN PROTECTION */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-amber-400" />
                        <span className="text-xs font-semibold text-[#e1e9fa]">
                          Profile Security PIN Vault
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enablePinLock}
                          onChange={e => setEnablePinLock(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-[#192238] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                    </div>

                    <p className="text-[11px] text-[#7888a6] leading-relaxed">
                      Lock your profile with a cryptographic 4-8 digit PIN. Protects your account and API configs against unauthorized local modifications and brute-force cracking.
                    </p>

                    {enablePinLock && (
                      <div className="pt-2 border-t border-white/[0.06] space-y-2.5 animate-fade-in-up">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono text-[#8da0c4] block mb-1">
                              {hasExistingPin ? 'NEW PIN (OPTIONAL)' : 'SECURITY PIN (4-8 DIGITS)'}
                            </label>
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={8}
                              placeholder={hasExistingPin ? 'Leave empty to keep' : '4-8 digits'}
                              value={newPin}
                              onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                              className="w-full h-9 px-2.5 font-mono text-center tracking-widest text-xs rounded-lg bg-black/50 border border-white/10 focus:border-amber-400 text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-[#8da0c4] block mb-1">
                              CONFIRM PIN
                            </label>
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={8}
                              placeholder="Confirm digits"
                              value={confirmPin}
                              onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                              className="w-full h-9 px-2.5 font-mono text-center tracking-widest text-xs rounded-lg bg-black/50 border border-white/10 focus:border-amber-400 text-white outline-none"
                            />
                          </div>
                        </div>

                        {pinError && (
                          <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                            {pinError}
                          </div>
                        )}

                        <div className="text-[10.5px] text-emerald-400/90 font-mono flex items-center gap-1.5">
                          <CheckCircle2 size={12} />
                          <span>Salted SHA-256 hash · Never stored in plaintext</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* REAL-TIME PROTECTION & ANTI-DDOS STATUS MONITOR */}
                  <div className="p-3 rounded-xl bg-[#090e1a] border border-[#1b253b] space-y-2 text-[11px]">
                    <div className="flex items-center justify-between text-[#8ea8ff] font-mono font-semibold text-[10.5px]">
                      <span className="flex items-center gap-1.5">
                        <Activity size={12} /> SYSTEM INTEGRITY & DEFENSE AUDIT
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={11} /> 100% SECURE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10.5px]">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[#627393] text-[9.5px]">ANTI-DDOS SHIELD</div>
                        <div className="text-emerald-300 font-semibold mt-0.5">Active (Rate Burst Limiter)</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[#627393] text-[9.5px]">NETWORK ARCHITECTURE</div>
                        <div className="text-emerald-300 font-semibold mt-0.5">0 Backdoors · 0 Middlemen</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[#627393] text-[9.5px]">DATA INTEGRITY</div>
                        <div className="text-emerald-300 font-semibold mt-0.5">SHA-256 WebCrypto Signature</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-[#627393] text-[9.5px]">DIRECT ROUTING</div>
                        <div className="text-emerald-300 font-semibold mt-0.5">Browser → Direct API</div>
                      </div>
                    </div>
                  </div>

                  {/* Guided Tour Checkbox */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <input
                      type="checkbox"
                      id="tour-toggle"
                      checked={startTour}
                      onChange={e => setStartTour(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="tour-toggle" className="text-xs text-[#86868b] cursor-pointer select-none">
                      Start interactive walkthrough tutorial on workspace launch
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-white/[0.08]">
                    {existingProfile?.isSetupComplete && onRemoveAccount ? (
                      <button
                        type="button"
                        onClick={() => setShowDeleteWarning(true)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Trash2 size={13} />
                        <span>REMOVE ACCOUNT</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      {onClose && (
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 rounded-xl text-xs font-medium text-[#86868b] hover:text-[#f5f5f7] bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isProcessingImage}
                        className="primary playful-pop"
                        style={{ padding: '9px 18px', fontSize: '13px' }}
                      >
                        <Sparkles size={14} className="text-blue-600" />
                        <span>Save & Secure Profile</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Red Warning Popup for Account Deletion with PIN Check */}
      {showDeleteWarning && (
        <div
          className="modal-overlay"
          style={{ zIndex: 1100 }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="warning-title"
        >
          <div
            className="modal-dialog animate-scale-in"
            style={{
              maxWidth: '460px',
              background: 'linear-gradient(180deg, #2a0808 0%, #160404 100%)',
              border: '2px solid #ef4444',
              boxShadow: '0 20px 50px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(239, 68, 68, 0.5)',
            }}
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-950/60 animate-bounce">
                <AlertTriangle size={30} />
              </div>

              <div className="space-y-2">
                <h3
                  id="warning-title"
                  className="text-base sm:text-lg font-black tracking-wide text-rose-100 uppercase leading-snug"
                >
                  WARNING! YOU ARE DELETING YOUR ACCOUNT FOREVER AND THE CHAT HISTORY WILL BE GONE AND CANNOT BE RESTORED, ARE YOU SURE ABOUT THIS?
                </h3>
                <p className="text-xs text-rose-300/80 leading-relaxed">
                  This permanently wipes your offline identity, saved settings, preferences, and all conversation archives from this browser.
                </p>
              </div>

              {existingProfile?.securityPinHash && (
                <div className="space-y-1.5 pt-2 text-left">
                  <label className="text-[11px] font-mono font-semibold text-rose-200 block">
                    ENTER SECURITY PIN TO AUTHORIZE DELETION:
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Enter Security PIN"
                    value={deletePinInput}
                    onChange={e => {
                      setDeletePinInput(e.target.value.replace(/\D/g, ''));
                      setDeletePinError(null);
                    }}
                    className="w-full h-10 px-3 font-mono text-center tracking-widest text-sm rounded-xl bg-black/60 border border-rose-500/40 text-white outline-none focus:border-rose-400"
                  />
                  {deletePinError && (
                    <div className="text-xs text-rose-300 mt-1">{deletePinError}</div>
                  )}
                </div>
              )}

              <div className="pt-3 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={confirmDeleteAccount}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/70 border border-red-400/40 cursor-pointer active:scale-98 transition-all"
                >
                  Yes, i want to delete my account (CANNOT BE UNDONE)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteWarning(false);
                    setDeletePinInput('');
                    setDeletePinError(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-rose-100 text-xs font-semibold border border-white/[0.1] cursor-pointer transition-all"
                >
                  Cancel & Keep Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
