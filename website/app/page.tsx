import { Terminal, GitBranch, Zap, Github, Coffee, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import CopyCommand from './components/CopyCommand';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)]">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="dev-audit logo" width={28} height={28} />
            <span className="font-semibold text-lg tracking-tight font-[family-name:var(--font-mono)]">
              dev-audit
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#install" className="text-sm text-white/60 hover:text-white transition-colors">
              Install
            </a>
            <a
              href="https://github.com/sidhanshumonga/dev-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://buymeacoffee.com/sidhanshu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm bg-yellow-400 text-black font-medium px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-colors"
            >
              <Coffee size={14} />
              Buy me a coffee
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open source · Runs 100% locally
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5 leading-tight">
            A CLI for keeping your
            <br />
            <span className="text-emerald-400">codebase clean.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">
            Detect dead API endpoints, generate smart{' '}
            <code className="text-white/80 font-[family-name:var(--font-mono)] text-sm">
              .gitignore
            </code>{' '}
            files, and spin up mock APIs from TypeScript types — in seconds.
          </p>

          {/* Install command — click to copy */}
          <CopyCommand />

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/sidhanshumonga/dev-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black font-medium px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors text-sm"
            >
              <Github size={15} />
              View on GitHub
              <ArrowRight size={14} />
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-5 py-2.5"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-white/30 font-[family-name:var(--font-mono)]">
              terminal
            </span>
          </div>
          <div className="p-5 font-[family-name:var(--font-mono)] text-sm space-y-1.5">
            <p>
              <span className="text-white/40">$</span>{' '}
              <span className="text-white">npx dev-audit dead scan</span>
            </p>
            <p className="text-white/40">Scanning repository...</p>
            <p className="text-emerald-400">✓ Framework detected: Next.js</p>
            <p className="text-white/40">&nbsp;</p>
            <p className="text-white">Routes found: 12</p>
            <p className="text-white">Frontend calls: 9</p>
            <p className="text-white/40">&nbsp;</p>
            <p className="text-yellow-400">Dead endpoints detected: 3</p>
            <p className="text-white/60">
              &nbsp; → GET&nbsp;&nbsp;&nbsp;&nbsp; /api/legacy-users&nbsp;&nbsp; (src/routes.ts:14)
            </p>
            <p className="text-white/60">
              &nbsp; → POST&nbsp;&nbsp;&nbsp; /api/test-payment&nbsp;&nbsp; (src/routes.ts:28)
            </p>
            <p className="text-white/60">
              &nbsp; → DELETE&nbsp; /api/old-session&nbsp;&nbsp;&nbsp; (src/routes.ts:41)
            </p>
            <p className="text-white/40">&nbsp;</p>
            <p className="text-white/50">
              Review these endpoints — they may be legacy code that can be removed.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section id="install" className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Installation</h2>
          <p className="text-center text-white/50 mb-10 text-sm">
            Use all tools together or install only what you need.
          </p>

          {/* Option A — full suite */}
          <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Option A
              </span>
              <span className="text-xs text-white/30">recommended</span>
            </div>
            <h3 className="font-semibold mb-1">Full suite — all three tools</h3>
            <p className="text-sm text-white/50 mb-4">
              Run any tool instantly with a single install. No global setup required.
            </p>
            <div className="bg-[#0a0a0a] rounded-xl p-4 font-[family-name:var(--font-mono)] text-sm space-y-2">
              <p>
                <span className="text-white/40">$</span>{' '}
                <span className="text-white">npx dev-audit dead scan</span>
              </p>
              <p>
                <span className="text-white/40">$</span>{' '}
                <span className="text-white">npx dev-audit gitignore generate --write</span>
              </p>
              <p>
                <span className="text-white/40">$</span>{' '}
                <span className="text-white">npx dev-audit mock serve --types ./src/types.ts</span>
              </p>
            </div>
          </div>

          {/* Option B — individual tools */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Option B
              </span>
            </div>
            <h3 className="font-semibold mb-1">Individual tools</h3>
            <p className="text-sm text-white/50 mb-4">Install only the tools you actually use.</p>
            <div className="bg-[#0a0a0a] rounded-xl p-4 font-[family-name:var(--font-mono)] text-sm space-y-3">
              <div>
                <p className="text-white/30 text-xs mb-1"># Dead API Detector</p>
                <p>
                  <span className="text-white/40">$</span>{' '}
                  <span className="text-white">npm install -g @dev-audit/dead-api-detector</span>
                </p>
                <p>
                  <span className="text-white/40">$</span>{' '}
                  <span className="text-emerald-400">dev-audit-dead scan</span>
                </p>
              </div>
              <div>
                <p className="text-white/30 text-xs mb-1"># Gitignore Generator</p>
                <p>
                  <span className="text-white/40">$</span>{' '}
                  <span className="text-white">npm install -g @dev-audit/gitignore-generator</span>
                </p>
                <p>
                  <span className="text-white/40">$</span>{' '}
                  <span className="text-emerald-400">dev-audit-gitignore generate --write</span>
                </p>
              </div>
              <div>
                <p className="text-white/30 text-xs mb-1"># Mock API Generator</p>
                <p>
                  <span className="text-white/40">$</span>{' '}
                  <span className="text-white">npm install -g @dev-audit/mock-api-generator</span>
                </p>
                <p>
                  <span className="text-white/40">$</span>{' '}
                  <span className="text-emerald-400">
                    dev-audit-mock serve --types ./src/types.ts
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Everything you need to stay clean</h2>
          <p className="text-center text-white/50 mb-12 text-sm">
            Three tools. One CLI. Zero data sent anywhere.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 transition-colors">
              <div className="w-10 h-10 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-4">
                <Zap size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2">Dead API Detector</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Scans your backend routes and cross-references them against frontend calls. Flags
                anything that&apos;s never used.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Express', 'Next.js', 'NestJS'].map((f) => (
                  <span
                    key={f}
                    className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/50"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 transition-colors">
              <div className="w-10 h-10 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-4">
                <GitBranch size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2">Smart Gitignore</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Detects your project stack automatically and generates a tailored{' '}
                <code className="text-white/70 text-xs">.gitignore</code> — no more copy-pasting
                from the internet.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Node', 'Python', 'Docker', 'Terraform'].map((f) => (
                  <span
                    key={f}
                    className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/50"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 transition-colors">
              <div className="w-10 h-10 bg-emerald-400/10 rounded-xl flex items-center justify-center mb-4">
                <Terminal size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2">Mock API Generator</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Point it at your TypeScript types and get a running mock server with realistic fake
                data. Frontend-first development, unblocked.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['TypeScript', 'REST', 'Faker'].map((f) => (
                  <span
                    key={f}
                    className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/50"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy callout */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Privacy first, always.</h2>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            dev-audit runs entirely on your machine. Your code never leaves your terminal.
          </p>
          <ul className="space-y-2">
            {[
              'No source code uploaded anywhere',
              'No telemetry or analytics',
              'No network requests by default',
              'Read-only — never modifies your files unless you ask it to',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Open source CTA */}
      <section className="px-6 pb-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Open source & community driven</h2>
          <p className="text-white/50 text-sm mb-8">
            dev-audit is MIT licensed. Contributions, bug reports, and feature requests are welcome.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/sidhanshumonga/dev-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black font-medium px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors text-sm"
            >
              <Github size={15} />
              Star on GitHub
            </a>
            <a
              href="https://buymeacoffee.com/sidhanshu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-medium px-5 py-2.5 rounded-full transition-colors text-sm"
            >
              <Coffee size={15} />
              Buy me a coffee
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Terminal size={14} className="text-emerald-400" />
            <span>dev-audit</span>
            <span>·</span>
            <span>MIT License</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a
              href="https://github.com/sidhanshumonga/dev-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/sidhanshumonga/dev-audit/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Contributing
            </a>
            <a
              href="https://github.com/sidhanshumonga/dev-audit/blob/main/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
