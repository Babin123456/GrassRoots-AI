import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlantScanner } from './components/PlantScanner';
import { TrailAdvisor } from './components/TrailAdvisor';
import { FieldJournal } from './components/FieldJournal';
import { FieldGuide } from './components/FieldGuide';
import { OllamaSettingsModal } from './components/OllamaSettingsModal';
import { Footer } from './components/Footer';
import type { TabType, OllamaConfig, ObservationLog } from './types';
import { DEFAULT_OLLAMA_CONFIG, checkOllamaStatus } from './services/aiService';
import { INITIAL_OBSERVATIONS } from './data/sampleObservations';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(false);

  // Load config from localStorage
  const [ollamaConfig, setOllamaConfig] = useState<OllamaConfig>(() => {
    const saved = localStorage.getItem('grassroots_ollama_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_OLLAMA_CONFIG;
      }
    }
    return DEFAULT_OLLAMA_CONFIG;
  });

  // Observations in localStorage
  const [observations, setObservations] = useState<ObservationLog[]>(() => {
    const saved = localStorage.getItem('grassroots_observations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_OBSERVATIONS;
      }
    }
    return INITIAL_OBSERVATIONS;
  });

  // Streak counter in localStorage
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('grassroots_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Check Ollama connectivity on mount
  const refreshOllama = async () => {
    try {
      const status = await checkOllamaStatus(ollamaConfig.endpoint);
      setOllamaOnline(status.isOnline);
    } catch {
      setOllamaOnline(false);
    }
  };

  useEffect(() => {
    refreshOllama();
  }, [ollamaConfig.endpoint]);

  // Persist config
  const handleSaveConfig = (newConfig: OllamaConfig) => {
    setOllamaConfig(newConfig);
    localStorage.setItem('grassroots_ollama_config', JSON.stringify(newConfig));
  };

  // Add observation
  const handleAddObservation = (log: Omit<ObservationLog, 'id' | 'timestamp'>) => {
    const newLog: ObservationLog = {
      ...log,
      id: `obs-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...observations];
    setObservations(updated);
    localStorage.setItem('grassroots_observations', JSON.stringify(updated));
  };

  // Delete observation
  const handleDeleteObservation = (id: string) => {
    const updated = observations.filter((o) => o.id !== id);
    setObservations(updated);
    localStorage.setItem('grassroots_observations', JSON.stringify(updated));
  };

  // Clear observations
  const handleClearObservations = () => {
    setObservations([]);
    localStorage.removeItem('grassroots_observations');
  };

  // Increment streak
  const handleIncrementStreak = () => {
    const updated = streakCount + 1;
    setStreakCount(updated);
    localStorage.setItem('grassroots_streak', updated.toString());
  };

  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b09] text-emerald-50 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ollamaOnline={ollamaOnline}
        ollamaConfig={ollamaConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        streakCount={streakCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {activeTab === 'scanner' && (
          <PlantScanner
            ollamaConfig={ollamaConfig}
            ollamaOnline={ollamaOnline}
            onLogObservation={handleAddObservation}
            initialSpecimenId={selectedSpecimenId}
          />
        )}

        {activeTab === 'trails' && (
          <TrailAdvisor
            ollamaConfig={ollamaConfig}
            onIncrementStreak={handleIncrementStreak}
          />
        )}

        {activeTab === 'journal' && (
          <FieldJournal
            observations={observations}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
            onClearAll={handleClearObservations}
            streakCount={streakCount}
          />
        )}

        {activeTab === 'fieldguide' && (
          <FieldGuide
            onInspectInScanner={(specimenId) => {
              setSelectedSpecimenId(specimenId);
              setActiveTab('scanner');
            }}
          />
        )}
      </main>

      {/* Ollama Settings Modal */}
      <OllamaSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={ollamaConfig}
        onSaveConfig={handleSaveConfig}
        ollamaOnline={ollamaOnline}
        onRefreshStatus={refreshOllama}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
