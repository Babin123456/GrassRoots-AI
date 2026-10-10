import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Info, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';
import type { OllamaConfig } from '../types';
import { checkOllamaStatus } from '../services/aiService';

interface OllamaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OllamaConfig;
  onSaveConfig: (newConfig: OllamaConfig) => void;
  ollamaOnline: boolean;
  onRefreshStatus: () => void;
}

export const OllamaSettingsModal: React.FC<OllamaSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  ollamaOnline,
  onRefreshStatus,
}) => {
  const [formData, setFormData] = useState<OllamaConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ isOnline: boolean; latencyMs: number; models: string[] } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await checkOllamaStatus(formData.endpoint);
      setTestResult(res);
      onRefreshStatus();
    } catch {
      setTestResult({ isOnline: false, latencyMs: 0, models: [] });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0c1611] border border-emerald-500/30 shadow-2xl shadow-emerald-950/80 p-6 sm:p-8 overflow-hidden text-emerald-100">
        
        {/* Top subtle glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-900/50 border border-emerald-500/30 text-emerald-300">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">Local AI Model Configuration</h3>
              <p className="text-xs text-emerald-400/80 font-mono">Open-Weight Inference via Ollama / Gemma 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-400/70 hover:text-white hover:bg-emerald-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Status banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            ollamaOnline
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
          }`}>
            <div className="mt-0.5">
              {ollamaOnline ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Info className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-white">
                {ollamaOnline ? 'Ollama Server Connected' : 'Running in Offline Local Heuristics Fallback Mode'}
              </p>
              <p className="text-emerald-300/80 leading-relaxed">
                {ollamaOnline 
                  ? 'Your local open-weight models are actively serving inferences. Zero cloud telemetry.' 
                  : 'No active Ollama daemon was detected at endpoint. GrassRoots AI is running with built-in instant botanical heuristics with zero UI breakage!'}
              </p>
            </div>
          </div>

          {/* Endpoint URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Ollama API Endpoint
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                placeholder="http://localhost:11434"
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-100 font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Test Ping</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 text-xs">
                {testResult.isOnline ? (
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Connected ({testResult.latencyMs}ms)
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400/80">
                      Found {testResult.models.length} installed models
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <XCircle className="w-4 h-4 text-amber-400" />
                    <span>Connection failed or blocked by browser CORS. Fallback mode is active.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preset Model Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Target Open-Weight Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { tag: 'gemma2:9b', label: 'Gemma 2 (9B)', badge: 'Recommended' },
                { tag: 'gemma2:2b', label: 'Gemma 2 (2B)', badge: 'Ultra-Fast' },
                { tag: 'llama3:8b', label: 'Llama 3 (8B)', badge: 'Alternative' },
              ].map((m) => (
                <button
                  key={m.tag}
                  type="button"
                  onClick={() => setFormData({ ...formData, model: m.tag, customModelName: '' })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    formData.model === m.tag && !formData.customModelName
                      ? 'bg-emerald-900/60 border-emerald-400 shadow-md text-white'
                      : 'bg-black/30 border-emerald-500/20 text-emerald-300/80 hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{m.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20">
                      {m.badge}
                    </span>
                  </div>
                  <span className="block mt-1 font-mono text-[11px] text-emerald-400/70">
                    {m.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Model Tag */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Or Custom Model Name / Tag
            </label>
            <input
              type="text"
              value={formData.customModelName}
              onChange={(e) => setFormData({ ...formData, customModelName: e.target.value })}
              placeholder="e.g. gemma2:27b, mistral:7b, llava:latest"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-100 font-mono text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-black/30 border border-emerald-500/15">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Inference Temperature
              </span>
              <span className="font-mono text-emerald-200">{formData.temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[11px] text-emerald-400/60">
              Lower values (0.1 - 0.3) provide strict, deterministic botanical classifications.
            </p>
          </div>

          {/* CLI instructions */}
          <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Run Locally in Terminal
              </span>
              <a 
                href="https://ollama.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline"
              >
                Install Ollama <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="p-2.5 rounded-lg bg-black/90 font-mono text-xs text-emerald-300/90 select-all border border-emerald-950">
              $ ollama run gemma2:9b
            </div>
            <p className="text-[11px] text-emerald-400/70 leading-relaxed">
              If running in browser, ensure Ollama has CORS allowed: <br />
              <code className="text-emerald-200 bg-emerald-950/60 px-1 py-0.5 rounded">OLLAMA_ORIGINS="*" ollama serve</code>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-900/30 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all"
          >
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
};
