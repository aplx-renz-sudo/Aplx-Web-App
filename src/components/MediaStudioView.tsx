import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Settings,
  Download,
  Trash2,
  Play,
  Pause,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Layers,
  Sliders,
  Zap,
  Info,
  ExternalLink,
  ChevronRight,
  Eye,
  Camera,
  Video,
} from 'lucide-react';
import type { ProviderConfig } from '../lib/credential';
import {
  MediaItem,
  MediaRateLimit,
  MAX_IMAGES_BEFORE_COOLDOWN,
  MAX_VIDEOS_BEFORE_COOLDOWN,
  getMediaRateLimit,
  checkImageGenerationStatus,
  checkVideoGenerationStatus,
  getMediaGallery,
  deleteMediaItem,
  generateHighQualityImage,
  generateHighQualityVideo,
} from '../lib/mediaStudio';
import { isApiLimitError, triggerApiLimitModal } from '../lib/apiLimitHandler';

interface MediaStudioViewProps {
  providerConfig: ProviderConfig;
  onLeave: () => void;
  onOpenSettings: () => void;
}

const IMAGE_STYLES = [
  'Photorealistic 8K',
  'Cinematic Movie Still',
  'Digital Concept Art',
  'Anime Masterpiece',
  'Cyberpunk Neon',
  '3D Pixar Render',
  'Dark Fantasy Oil',
  'Minimalist Vector',
  'Vintage Polaroid',
];

const VIDEO_MOTIONS = [
  'Cinematic Drone Flyover',
  'Smooth Horizontal Pan',
  'Dynamic Action Tracking',
  'Orbiting 360 Degree View',
  'Slow Motion Dramatic',
  'Hyperlapse Time-Compression',
];

const PROMPT_SUGGESTIONS = [
  'Futuristic cybernetic city with neon rain and flying vehicles at dusk',
  'Majestic snow leopard atop an obsidian mountain bathed in aurora borealis',
  'Bioluminescent underwater coral reef with mythical translucent sea creatures',
  'Cozy retro-futuristic coffee shop in a greenhouse habitat on Mars',
  'Epic cinematic explosion of colorful stardust in deep celestial nebula',
];

export const MediaStudioView: React.FC<MediaStudioViewProps> = ({
  providerConfig,
  onLeave,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'gallery'>('image');

  // Image parameters
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageNegativePrompt, setImageNegativePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('Photorealistic 8K');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [imageResolution, setImageResolution] = useState<'1K' | '2K' | '4K'>('1K');

  // Video parameters
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoMotion, setVideoMotion] = useState('Cinematic Drone Flyover');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoResolution, setVideoResolution] = useState<'720p' | '1080p'>('1080p');
  const [videoDuration, setVideoDuration] = useState<number>(5);

  // Status & gallery
  const [rateLimitState, setRateLimitState] = useState<MediaRateLimit>(getMediaRateLimit());
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Live countdown timer state (recalculated every second)
  const [imageCooldownRemaining, setImageCooldownRemaining] = useState(0);
  const [videoCooldownRemaining, setVideoCooldownRemaining] = useState(0);

  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync gallery on mount & updates
  const refreshGallery = () => {
    setGallery(getMediaGallery());
  };

  useEffect(() => {
    refreshGallery();
  }, []);

  // Cooldown countdown timer interval
  useEffect(() => {
    const checkLimits = () => {
      const imgStatus = checkImageGenerationStatus();
      const vidStatus = checkVideoGenerationStatus();
      setImageCooldownRemaining(imgStatus.cooldownSeconds);
      setVideoCooldownRemaining(vidStatus.cooldownSeconds);
      setRateLimitState(getMediaRateLimit());
    };

    checkLimits();
    const interval = setInterval(checkLimits, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return '00:00';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgressPercent(20);
    setProgressStatus('Synthesizing high-quality image composition...');

    try {
      const item = await generateHighQualityImage(
        imagePrompt.trim(),
        {
          aspectRatio: imageAspectRatio,
          resolution: imageResolution,
          style: imageStyle,
          negativePrompt: imageNegativePrompt.trim() || undefined,
        },
        providerConfig
      );

      setProgressPercent(100);
      refreshGallery();
      setPreviewItem(item);
      setActiveTab('gallery');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image generation encountered an error.';
      setErrorMsg(msg);
      if (isApiLimitError(err) || isApiLimitError(msg)) {
        triggerApiLimitModal({
          providerName: 'Media Studio (Image Engine)',
          details: msg,
        });
      }
    } finally {
      setIsGenerating(false);
      setProgressPercent(0);
      setProgressStatus('');
      setRateLimitState(getMediaRateLimit());
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgressPercent(10);
    setProgressStatus('Initializing video neural synthesis engine...');

    try {
      const item = await generateHighQualityVideo(
        videoPrompt.trim(),
        {
          aspectRatio: videoAspectRatio,
          resolution: videoResolution,
          motionStyle: videoMotion,
          duration: videoDuration,
        },
        providerConfig,
        (pct, status) => {
          setProgressPercent(pct);
          setProgressStatus(status);
        }
      );

      refreshGallery();
      setPreviewItem(item);
      setActiveTab('gallery');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Video generation encountered an error.';
      setErrorMsg(msg);
      if (isApiLimitError(err) || isApiLimitError(msg)) {
        triggerApiLimitModal({
          providerName: 'Media Studio (Video Engine)',
          details: msg,
        });
      }
    } finally {
      setIsGenerating(false);
      setProgressPercent(0);
      setProgressStatus('');
      setRateLimitState(getMediaRateLimit());
    }
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteItem = (id: string) => {
    deleteMediaItem(id);
    refreshGallery();
    if (previewItem?.id === id) {
      setPreviewItem(null);
    }
  };

  const isImageCoolingDown = imageCooldownRemaining > 0;
  const isVideoCoolingDown = videoCooldownRemaining > 0;
  const imagesRemaining = Math.max(0, MAX_IMAGES_BEFORE_COOLDOWN - rateLimitState.imageCount);
  const videosRemaining = Math.max(0, MAX_VIDEOS_BEFORE_COOLDOWN - rateLimitState.videoCount);

  return (
    <div className="flex flex-col h-screen w-full bg-[#070b14] text-[#e1e7f5] overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0c1222]/90 border-b border-white/[0.08] backdrop-blur-md z-20 flex-none gap-4">
        <div className="flex items-center gap-3 flex-none">
          <button
            type="button"
            onClick={onLeave}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-[#a5b4fc] transition-colors cursor-pointer"
            title="Return to Chat"
          >
            <ArrowLeft size={14} />
            <span>Back to Chat</span>
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  AI Image & Video Studio
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  HD Media
                </span>
              </div>
              <p className="text-[11px] text-[#8397bc]">
                High-definition image and motion video creation engine with server protection
              </p>
            </div>
          </div>
        </div>

        {/* Right in the middle: Grok, OpenRouter API highly recommended */}
        <div
          onClick={onOpenSettings}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/25 hover:border-amber-400/50 hover:bg-white/[0.06] transition-all cursor-pointer select-none group shadow-sm flex-shrink-0"
          title="Grok, OpenRouter API highly recommended. Click to configure API keys."
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-xs font-medium tracking-wide text-[#d1d5db] group-hover:text-white transition-colors whitespace-nowrap">
            <strong className="text-amber-300 font-semibold">Grok</strong>, <strong className="text-cyan-300 font-semibold">OpenRouter</strong> API highly recommended
          </span>
          <Sparkles size={13} className="text-amber-400/80 group-hover:text-amber-300 transition-colors flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-none">
          {/* Server Protection Status Indicators */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                isImageCoolingDown
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#9db2d9]'
              }`}
              title="5 images per 10-minute window to avoid server overload"
            >
              <ImageIcon size={13} className={isImageCoolingDown ? 'text-amber-400 animate-pulse' : 'text-cyan-400'} />
              <span>Images:</span>
              <strong className={isImageCoolingDown ? 'text-amber-300' : 'text-white'}>
                {isImageCoolingDown ? `Cool-down: ${formatCountdown(imageCooldownRemaining)}` : `${imagesRemaining}/5`}
              </strong>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                isVideoCoolingDown
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#9db2d9]'
              }`}
              title="2 videos per 10-minute window to avoid server overload"
            >
              <Film size={13} className={isVideoCoolingDown ? 'text-rose-400 animate-pulse' : 'text-indigo-400'} />
              <span>Videos:</span>
              <strong className={isVideoCoolingDown ? 'text-rose-300' : 'text-white'}>
                {isVideoCoolingDown ? `Cool-down: ${formatCountdown(videoCooldownRemaining)}` : `${videosRemaining}/2`}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a5b4fc] transition-colors"
            title="Configure AI API Keys"
          >
            <Settings size={15} />
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left / Top Controls Sidebar */}
        <aside className="w-full md:w-[420px] lg:w-[480px] bg-[#090e1c] border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col overflow-y-auto flex-none">
          {/* Mobile Grok & OpenRouter Notice */}
          <div
            onClick={onOpenSettings}
            className="md:hidden mx-3 mt-3 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/25 flex items-center justify-between gap-2 cursor-pointer transition-all"
            title="Grok, OpenRouter API highly recommended. Click to configure API keys."
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-none" />
              <span className="text-xs text-[#d1d5db]">
                <strong className="text-amber-300 font-semibold">Grok</strong>, <strong className="text-cyan-300 font-semibold">OpenRouter</strong> API highly recommended
              </span>
            </div>
            <Sparkles size={13} className="text-amber-400 flex-none" />
          </div>

          {/* Studio Navigation Tabs */}
          <div className="flex items-center p-3 border-b border-white/[0.08] bg-[#080d19] gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60'
                  : 'bg-white/[0.03] text-[#8ea8d6] hover:bg-white/[0.06]'
              }`}
            >
              <ImageIcon size={14} />
              <span>Image Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                  : 'bg-white/[0.03] text-[#8ea8d6] hover:bg-white/[0.06]'
              }`}
            >
              <Film size={14} />
              <span>Video Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                  : 'bg-white/[0.03] text-[#8ea8d6] hover:bg-white/[0.06]'
              }`}
              title="View your saved images and videos"
            >
              <Layers size={14} />
              <span>Gallery ({gallery.length})</span>
            </button>
          </div>

          {/* ACTIVE COOLDOWN NOTICES */}
          {activeTab === 'image' && isImageCoolingDown && (
            <div className="m-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 animate-fade-in shadow-lg shadow-amber-950/40">
              <Clock size={18} className="text-amber-400 flex-none mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Server Protection Cool-Down Active
                  </h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                    {formatCountdown(imageCooldownRemaining)}
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  You have generated 5 high-quality images. To keep servers from getting overwhelmed, a 10-minute cooldown is currently active. Your quota will refresh automatically.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'video' && isVideoCoolingDown && (
            <div className="m-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 animate-fade-in shadow-lg shadow-rose-950/40">
              <ShieldAlert size={18} className="text-rose-400 flex-none mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    Video Server Cool-Down Active
                  </h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-200">
                    {formatCountdown(videoCooldownRemaining)}
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/90 leading-relaxed">
                  You have generated 2 videos. Neural video rendering requires intensive computing power; a 10-minute cooldown is active so servers are not overwhelmed.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: IMAGE STUDIO CONTROLS */}
          {activeTab === 'image' && (
            <div className="p-4 sm:p-5 space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-[#c7d5ef] uppercase tracking-wider flex items-center justify-between mb-1.5">
                  <span>Prompt</span>
                  <span className="text-[10px] font-mono text-[#788eaf]">Required</span>
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe your desired image in rich detail (e.g. glowing neon metropolis, cinematic lighting, ultra-sharp reflections)..."
                  className="w-full h-24 p-3 rounded-xl bg-[#0e1628] border border-white/[0.1] text-xs text-white placeholder-[#5d7195] focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
                  disabled={isGenerating}
                />
              </div>

              {/* Quick inspiration chips */}
              <div>
                <span className="text-[10px] font-bold text-[#6f82a6] uppercase tracking-wider block mb-1.5">
                  Inspire Me (1-Click Prompt)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.slice(0, 3).map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImagePrompt(s)}
                      className="text-[10px] text-left px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-[#9cb4dd] border border-white/[0.06] transition-colors truncate max-w-full"
                      title={s}
                    >
                      "{s.slice(0, 42)}..."
                    </button>
                  ))}
                </div>
              </div>

              {/* Negative Prompt */}
              <div>
                <label className="text-xs font-semibold text-[#9db2d9] flex items-center justify-between mb-1">
                  <span>Negative Prompt (Optional)</span>
                  <span className="text-[10px] text-[#5e7191]">Exclusions</span>
                </label>
                <input
                  type="text"
                  value={imageNegativePrompt}
                  onChange={(e) => setImageNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, low quality, watermarks, bad anatomy..."
                  className="w-full p-2.5 rounded-lg bg-[#0e1628] border border-white/[0.08] text-xs text-white placeholder-[#5d7195] focus:outline-none focus:border-cyan-500"
                  disabled={isGenerating}
                />
              </div>

              {/* Style Selector */}
              <div>
                <label className="text-xs font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1.5">
                  Artistic Style Preset
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {IMAGE_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setImageStyle(style)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                        imageStyle === style
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#869fc4] hover:bg-white/[0.05]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio & Resolution Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={imageAspectRatio}
                    onChange={(e) => setImageAspectRatio(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#0e1628] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1:1">1:1 Square (1024x1024)</option>
                    <option value="16:9">16:9 Cinema (1280x720)</option>
                    <option value="9:16">9:16 Reel/Story (720x1280)</option>
                    <option value="4:3">4:3 Classic (1024x768)</option>
                    <option value="3:4">3:4 Portrait (768x1024)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1.5">
                    Quality Level
                  </label>
                  <select
                    value={imageResolution}
                    onChange={(e) => setImageResolution(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#0e1628] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1K">1K Standard High-Def</option>
                    <option value="2K">2K Quad HD Enhanced</option>
                    <option value="4K">4K Masterwork Ultra-HD</option>
                  </select>
                </div>
              </div>

              {/* Quota & Server Protection Status Bar */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#96a9cc] flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-cyan-400" />
                    Image Generation Quota
                  </span>
                  <span className="font-mono font-bold text-white">
                    {imagesRemaining} of 5 available
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isImageCoolingDown ? 'bg-amber-400' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${((5 - imagesRemaining) / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#6e83a6] leading-tight">
                  Rule: 5 images trigger a 10-minute cooldown timer so AI generation servers are never overloaded.
                </p>
              </div>

              {/* Generate Image Button */}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={!imagePrompt.trim() || isGenerating || isImageCoolingDown}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isImageCoolingDown
                    ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300 cursor-not-allowed opacity-90'
                    : !imagePrompt.trim() || isGenerating
                    ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-cyan-200" />
                    <span>Rendering Image...</span>
                  </>
                ) : isImageCoolingDown ? (
                  <>
                    <Clock size={15} className="animate-pulse" />
                    <span>Cool-Down Active ({formatCountdown(imageCooldownRemaining)})</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Create High-Quality Image →</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: VIDEO STUDIO CONTROLS */}
          {activeTab === 'video' && (
            <div className="p-4 sm:p-5 space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-[#c7d5ef] uppercase tracking-wider flex items-center justify-between mb-1.5">
                  <span>Video Motion Prompt</span>
                  <span className="text-[10px] font-mono text-[#788eaf]">Required</span>
                </label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe the motion scene in dynamic detail (e.g. camera sweeps across glowing Cyberpunk highway with high-speed neon hypercars)..."
                  className="w-full h-24 p-3 rounded-xl bg-[#0e1628] border border-white/[0.1] text-xs text-white placeholder-[#5d7195] focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                  disabled={isGenerating}
                />
              </div>

              {/* Inspiration Chips */}
              <div>
                <span className="text-[10px] font-bold text-[#6f82a6] uppercase tracking-wider block mb-1.5">
                  Suggested Cinematic Scenes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.slice(2, 5).map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVideoPrompt(s)}
                      className="text-[10px] text-left px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-[#9cb4dd] border border-white/[0.06] transition-colors truncate max-w-full"
                    >
                      "{s.slice(0, 42)}..."
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Motion Selection */}
              <div>
                <label className="text-xs font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1.5">
                  Camera Motion Style
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {VIDEO_MOTIONS.map((motion) => (
                    <button
                      key={motion}
                      type="button"
                      onClick={() => setVideoMotion(motion)}
                      className={`px-2.5 py-2 rounded-lg text-[11px] font-medium border text-left transition-all cursor-pointer ${
                        videoMotion === motion
                          ? 'bg-indigo-950/60 border-indigo-400 text-indigo-200 font-semibold'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#869fc4] hover:bg-white/[0.05]'
                      }`}
                    >
                      {motion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Format Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1">
                    Format
                  </label>
                  <select
                    value={videoAspectRatio}
                    onChange={(e) => setVideoAspectRatio(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#0e1628] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="16:9">16:9 Wide (Landscape)</option>
                    <option value="9:16">9:16 Vertical (Reel)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1">
                    Resolution
                  </label>
                  <select
                    value={videoResolution}
                    onChange={(e) => setVideoResolution(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#0e1628] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p FHD</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#c7d5ef] uppercase tracking-wider block mb-1">
                    Duration
                  </label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-[#0e1628] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={4}>4 Seconds</option>
                    <option value={5}>5 Seconds</option>
                    <option value={7}>7 Seconds</option>
                  </select>
                </div>
              </div>

              {/* Quota & Server Protection Status Bar */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#96a9cc] flex items-center gap-1.5">
                    <Film size={13} className="text-indigo-400" />
                    Video Generation Quota
                  </span>
                  <span className="font-mono font-bold text-white">
                    {videosRemaining} of 2 available
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isVideoCoolingDown ? 'bg-rose-400' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${((2 - videosRemaining) / 2) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#6e83a6] leading-tight">
                  Rule: 2 videos trigger a 10-minute cooldown timer so GPU servers are never overwhelmed.
                </p>
              </div>

              {/* Generate Video Button */}
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={!videoPrompt.trim() || isGenerating || isVideoCoolingDown}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isVideoCoolingDown
                    ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300 cursor-not-allowed opacity-90'
                    : !videoPrompt.trim() || isGenerating
                    ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-indigo-200" />
                    <span>Rendering Video...</span>
                  </>
                ) : isVideoCoolingDown ? (
                  <>
                    <Clock size={15} className="animate-pulse" />
                    <span>Cool-Down Active ({formatCountdown(videoCooldownRemaining)})</span>
                  </>
                ) : (
                  <>
                    <Video size={15} />
                    <span>Create High-Quality Video →</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: GALLERY LIST (Sidebar quick list) */}
          {activeTab === 'gallery' && (
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c7d5ef]">
                  Creation History
                </span>
                <span className="text-[11px] text-[#869fc4]">
                  {gallery.length} total creations
                </span>
              </div>

              {gallery.length === 0 ? (
                <div className="py-12 text-center text-[#6e83a6] space-y-2">
                  <Layers size={28} className="mx-auto text-white/20" />
                  <p className="text-xs">No media created yet.</p>
                  <p className="text-[11px]">Generate your first image or video above!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setPreviewItem(item)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        previewItem?.id === item.id
                          ? 'bg-cyan-950/40 border-cyan-500/50'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-lg bg-black/40 overflow-hidden flex-none relative border border-white/10 flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950/40 text-indigo-300">
                            <Film size={18} />
                            <span className="text-[9px] font-mono mt-0.5">MP4</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[8px] font-mono bg-black/80 text-white">
                          {item.type === 'image' ? 'IMG' : 'VID'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium truncate">
                          {item.prompt}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-[#7990b7]">
                          <span>{item.aspectRatio}</span>
                          <span>•</span>
                          <span>{item.resolution}</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="p-1.5 text-[#5e7191] hover:text-rose-400 rounded transition-colors"
                        title="Delete from Gallery"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right / Main Preview Canvas */}
        <main className="flex-1 flex flex-col bg-[#050811] overflow-y-auto p-4 sm:p-6 items-center justify-center relative">
          {/* Progress Overlay when generating */}
          {isGenerating && (
            <div className="absolute inset-0 bg-[#070b14]/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-950/50 animate-pulse">
                {activeTab === 'image' ? <ImageIcon size={32} /> : <Film size={32} />}
              </div>
              <div className="text-center max-w-sm space-y-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {progressStatus || 'Generating Media...'}
                </h3>
                <p className="text-xs text-[#8397bc]">
                  Processing neural tensors and rendering high-resolution frames.
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message Toast */}
          {errorMsg && (
            <div className="w-full max-w-lg mb-4 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 flex items-start gap-3 text-xs shadow-xl animate-fade-in">
              <AlertCircle size={17} className="text-rose-400 flex-none mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-white">Generation Notice</p>
                <p className="leading-relaxed">{errorMsg}</p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Preview Display */}
          {previewItem ? (
            <div className="w-full max-w-2xl bg-[#090e1e] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-in">
              {/* Media viewer */}
              <div className="relative bg-black flex items-center justify-center min-h-[340px] max-h-[520px] overflow-hidden group">
                {previewItem.type === 'image' ? (
                  <img
                    src={previewItem.url}
                    alt={previewItem.prompt}
                    className="max-h-[500px] w-auto max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={previewItem.url}
                    controls
                    autoPlay
                    loop
                    className="max-h-[500px] w-auto max-w-full object-contain"
                  />
                )}
              </div>

              {/* Media Details and Action Bar */}
              <div className="p-4 sm:p-5 space-y-3 bg-[#0c1224] border-t border-white/[0.08]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      {previewItem.type === 'image' ? 'High-Resolution Image' : 'Cinematic Motion Video'}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white mt-0.5 leading-snug">
                      {previewItem.prompt}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-none">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(previewItem.prompt, previewItem.id)}
                      className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-[#a5b4fc] transition-colors"
                      title="Copy Prompt"
                    >
                      {copiedId === previewItem.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>

                    <a
                      href={previewItem.url}
                      download={`aplx_${previewItem.type}_${previewItem.id}.${previewItem.type === 'image' ? 'png' : 'webm'}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-600/30 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06] text-[11px] text-[#7990b7]">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                    Aspect: <strong>{previewItem.aspectRatio}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                    Res: <strong>{previewItem.resolution}</strong>
                  </span>
                  {previewItem.style && (
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                      Style: <strong>{previewItem.style}</strong>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-cyan-300">
                    Engine: <strong>{previewItem.providerUsed}</strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center max-w-md p-8 rounded-2xl bg-[#090e1d]/60 border border-white/[0.06] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-cyan-400 mx-auto shadow-xl">
                <Sparkles size={28} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Welcome to the Media Studio
                </h3>
                <p className="text-xs text-[#8397bc] leading-relaxed">
                  Generate high-definition images or cinematic motion videos on demand. Select your settings in the studio panel to get started.
                </p>
              </div>

              {/* Grok & OpenRouter API recommendation in the middle of canvas */}
              <div
                onClick={onOpenSettings}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/25 hover:border-amber-400/50 flex items-center justify-between gap-3 text-left cursor-pointer transition-all group"
                title="Grok & OpenRouter provide highest reliability and model access. Click to configure."
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-none" />
                  <span className="text-xs text-[#d1d5db] group-hover:text-white transition-colors">
                    <strong className="text-amber-300 font-semibold">Grok</strong>, <strong className="text-cyan-300 font-semibold">OpenRouter</strong> API highly recommended
                  </span>
                </div>
                <Sparkles size={14} className="text-amber-400/80 group-hover:text-amber-300 transition-colors flex-none" />
              </div>

              {/* Server overload protection banner */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-left space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-[11px]">
                  <ShieldAlert size={14} />
                  <span>Server Overload Safeguards Active</span>
                </div>
                <ul className="text-[11px] text-[#869fc4] space-y-1 list-disc list-inside">
                  <li><strong>Every 5 Images:</strong> 10-minute cool-down period.</li>
                  <li><strong>Every 2 Videos:</strong> 10-minute cool-down period.</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
