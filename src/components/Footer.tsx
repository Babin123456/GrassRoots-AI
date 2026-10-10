import React from 'react';
import { Heart, Globe, Sparkles, Shield, Cpu, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-emerald-500/20 bg-[#050806]/90 backdrop-blur-md text-emerald-400/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                GrassRoots<span className="text-emerald-400 font-mono text-base">AI</span>
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed max-w-sm">
              An open-source offline bio-monitoring application built for the Hacktoberfest 2026 DEV Challenge ("Touch Grass" Theme). Empowering outdoor connection with zero cloud telemetry.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 border border-emerald-500/30 text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side & Local Open-Weight Inference</span>
            </div>
          </div>

          {/* Technology Highlights */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Open-Weight AI Pipeline
            </h4>
            <ul className="space-y-2 text-emerald-300/80">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemma 2 (2B / 9B) & Llama 3 via local Ollama</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic offline botanical heuristics fallback</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>React 19 + Vite + TypeScript + Tailwind CSS</span>
              </li>
            </ul>
          </div>

          {/* Hacktoberfest & Open Source */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Hacktoberfest 2026 Week 1
            </h4>
            <p className="text-emerald-300/80 leading-relaxed">
              Theme: <strong>"Touch Grass"</strong> — Disconnecting from screens and reconnecting with living soil, pollinators, and regional ecosystems.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                MIT License
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                Gemma Track Entry
              </span>
              <a
                href="https://github.com/Babin123456/GrassRoots-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 hover:text-white border border-emerald-500/30 font-mono text-[11px] inline-flex items-center gap-1.5 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/60">
          <p className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Crafted for the global open-source community. Go outside and explore nature!</span>
          </p>
          <div className="flex items-center gap-1 text-emerald-400/80">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>for DEV Community & Hacktoberfest 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
