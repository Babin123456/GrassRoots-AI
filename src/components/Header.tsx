import React from 'react';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Library, 
  Settings, 
  Radio, 
  CheckCircle2, 
  Leaf 
} from 'lucide-react';
import type { TabType, OllamaConfig } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  ollamaOnline: boolean;
  ollamaConfig: OllamaConfig;
  onOpenSettings: () => void;
  scannerAnalyzing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  ollamaOnline,
  ollamaConfig,
  onOpenSettings,
  scannerAnalyzing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-[#070b09]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo with pulsating botanical glow */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer" onClick={() => setActiveTab('scanner')}>
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-950/60 border border-emerald-400/40 group">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white transform transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500 border-2 border-[#070b09]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                  GrassRoots<span className="text-emerald-400 font-mono font-medium text-base sm:text-lg ml-0.5 sm:ml-1">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Touch Grass '26
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-400/70 font-medium tracking-wide">
                Offline Flora Explorer & Community Hub
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1.5 p-1.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30'
                  : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/30'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${scannerAnalyzing ? 'animate-spin text-amber-300' : 'text-emerald-300'}`} />
              <span>Plant Scanner</span>
              {scannerAnalyzing && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-400/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  Active
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('trails')}
              className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'trails'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30'
                  : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/30'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>Trail & Eco Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30'
                  : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/30'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>Field Journal</span>
            </button>

            <button
              onClick={() => setActiveTab('fieldguide')}
              className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'fieldguide'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30'
                  : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/30'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-emerald-300" />
              <span>Offline Field Guide</span>
            </button>
          </nav>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Ollama Connection Indicator */}
            <div 
              onClick={onOpenSettings}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                ollamaOnline
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-emerald-950/40 border-emerald-700/30 text-emerald-400/90 hover:bg-emerald-900/40'
              }`}
              title="Click to configure Ollama / Open-weight Model Settings"
            >
              <div className="relative flex items-center justify-center">
                {ollamaOnline ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-emerald-400/80">
                  {ollamaOnline ? 'Online' : 'Fallback'}
                </span>
                <span className="hidden sm:block text-[11px] font-mono text-emerald-200 truncate max-w-[90px] lg:max-w-[130px]">
                  {ollamaConfig.customModelName || ollamaConfig.model}
                </span>
              </div>
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 sm:p-2.5 rounded-xl text-emerald-400/80 hover:text-emerald-200 bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-emerald-900/30 transition-all"
              aria-label="Model Configuration"
              title="Open-Weight Model Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* GitHub Repository */}
            <a
              href="https://github.com/Babin123456/GrassRoots-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-xl text-emerald-400/80 hover:text-emerald-200 bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-emerald-900/30 transition-all flex items-center justify-center"
              aria-label="GitHub Repository"
              title="View GrassRoots AI on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="grid grid-cols-4 md:hidden py-2 gap-1 border-t border-emerald-500/10">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition-all relative ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm border border-emerald-400/30'
                : 'text-emerald-300/80 bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <div className="relative">
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${scannerAnalyzing ? 'animate-spin text-amber-300' : 'text-emerald-300'}`} />
              {scannerAnalyzing && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </div>
            <span className="truncate">Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('trails')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              activeTab === 'trails'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm border border-emerald-400/30'
                : 'text-emerald-300/80 bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="truncate">Trails</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              activeTab === 'journal'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm border border-emerald-400/30'
                : 'text-emerald-300/80 bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="truncate">Journal</span>
          </button>
          <button
            onClick={() => setActiveTab('fieldguide')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              activeTab === 'fieldguide'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm border border-emerald-400/30'
                : 'text-emerald-300/80 bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <Library className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="truncate">Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
};
