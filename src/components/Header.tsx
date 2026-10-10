import React from 'react';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Library, 
  Settings, 
  Flame, 
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
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  ollamaOnline,
  ollamaConfig,
  onOpenSettings,
  streakCount,
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
              className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30'
                  : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Plant Scanner</span>
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
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold shadow-sm" title="Consecutive days exploring outdoors!">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">{streakCount} Day Streak</span>
              <span className="sm:hidden">{streakCount}d</span>
            </div>

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
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-emerald-500/10 no-scrollbar">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'scanner' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-300/80 bg-emerald-950/50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('trails')}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'trails' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-300/80 bg-emerald-950/50'
            }`}
          >
            <Compass className="w-3 h-3 text-emerald-300" />
            <span>Trails</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'journal' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-300/80 bg-emerald-950/50'
            }`}
          >
            <BookOpen className="w-3 h-3 text-emerald-300" />
            <span>Journal</span>
          </button>
          <button
            onClick={() => setActiveTab('fieldguide')}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'fieldguide' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-300/80 bg-emerald-950/50'
            }`}
          >
            <Library className="w-3 h-3 text-emerald-300" />
            <span>Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
};
