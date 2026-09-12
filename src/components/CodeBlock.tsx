import { useState } from 'react';
import { Check, Copy, Download, WrapText } from 'lucide-react';

type CodeBlockProps = {
  language: string;
  code: string;
  label?: string;
};

export function CodeBlock({ language, code, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(false);

  const cleanLang = (language || 'text').replace(/^language-/, '');
  const lineCount = code.trim().split('\n').length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
      rust: 'rs',
      go: 'go',
      cpp: 'cpp',
      c: 'c',
      bash: 'sh',
      shell: 'sh',
    };
    const ext = extMap[cleanLang.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aplx-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-block-container my-3.5 rounded-xl overflow-hidden border border-white/[0.08] bg-[#070a10] shadow-xl">
      <div className="code-block-header flex items-center justify-between px-3.5 py-2 bg-white/[0.03] border-b border-white/[0.06] text-xs font-mono text-[#86868b]">
        <div className="flex items-center gap-2">
          {/* macOS window indicator dots */}
          <div className="flex items-center gap-1.5 mr-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
          </div>
          <span className={`font-semibold tracking-wider text-[11px] text-[#f5f5f7] ${label ? '' : 'uppercase'}`}>
            {label || cleanLang}
          </span>
          <span className="text-[#636366] text-[10px]">({lineCount} {lineCount === 1 ? 'line' : 'lines'})</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWrap(!wrap)}
            title="Toggle word wrap"
            className={`p-1 rounded-md hover:bg-white/[0.08] transition-colors ${wrap ? 'text-[#2997ff]' : 'text-[#86868b]'}`}
          >
            <WrapText size={13} />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            title="Download snippet"
            className="p-1 rounded-md text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.08] transition-colors"
          >
            <Download size={13} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.06] hover:bg-white/[0.1] text-[#f5f5f7] border border-white/[0.08] transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <pre
        className={`p-4 m-0 font-mono text-xs leading-relaxed text-[#e5e5ea] overflow-x-auto selection:bg-[#2997ff33] ${
          wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
