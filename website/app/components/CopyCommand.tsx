'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const COMMAND = 'npx dev-audit --help';

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(COMMAND).then(() => {
      setCopied(true);
      // Reset the icon back after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 font-[family-name:var(--font-mono)] text-sm mb-8 hover:bg-white/10 hover:border-white/20 transition-colors group cursor-pointer"
      aria-label="Copy install command"
    >
      <span className="text-white/40">$</span>
      <span>{COMMAND}</span>
      <span className="ml-1 text-white/30 group-hover:text-white/60 transition-colors">
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </span>
    </button>
  );
}
