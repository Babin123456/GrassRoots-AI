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
            <div className="flex items-center gap-3 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                MIT License
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                Gemma Track Entry
              </span>
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
