import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Sun, 
  Droplet, 
  Calendar, 
  BookmarkPlus, 
  RefreshCw, 
  ShieldCheck, 
  Info,
  Clock,
  Check,
  Zap,
  Leaf,
  Eye,
  Cpu,
  Compass,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PlantAnalysisResult, OllamaConfig, ObservationLog } from '../types';
import { analyzePlantSpecimen } from '../services/aiService';

interface PlantScannerProps {
  ollamaConfig: OllamaConfig;
  ollamaOnline: boolean;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
  initialSpecimenId?: string;
}

interface SampleSpecimen {
  id: string;
  name: string;
  scientific: string;
  category: string;
  image: string;
}

const THINKING_STAGES = [
  {
    icon: Eye,
    title: 'Visual Feature Extraction',
    detail: 'Scanning leaf morphology, petal geometry, and venation patterns...',
  },
  {
    icon: Cpu,
    title: 'Neural Botanical Reasoning',
    detail: 'Consulting local open-weight model for taxonomic hierarchy and binomial nomenclature...',
  },
  {
    icon: Compass,
    title: 'Ecosystem & Habitat Mapping',
    detail: 'Cross-referencing native regional biomes, moisture profiles, and soil needs...',
  },
  {
    icon: Sparkles,
    title: 'Synthesizing "Touch Grass" Prompt',
    detail: 'Formulating sensory field observation challenge and foraging safety advisory...',
  },
];

const SAMPLE_SPECIMENS: SampleSpecimen[] = [
  {
    id: 'dandelion',
    name: 'Common Dandelion',
    scientific: 'Taraxacum officinale',
    category: 'Medicinal / Pollinator',
    image: '/specimens/dandelion.webp'
  },
  {
    id: 'poppy',
    name: 'California Poppy',
    scientific: 'Eschscholzia californica',
    category: 'Native Wildflower',
    image: '/specimens/poppy.webp'
  },
  {
    id: 'fern',
    name: 'Maidenhair Fern',
    scientific: 'Adiantum aleuticum',
    category: 'Moist Riparian',
    image: '/specimens/fern.webp'
  },
  {
    id: 'plantain',
    name: 'Broadleaf Plantain',
    scientific: 'Plantago major',
    category: 'Trail First-Aid',
    image: '/specimens/plantain.webp'
  },
  {
    id: 'nettle',
    name: 'Stinging Nettle',
    scientific: 'Urtica dioica',
    category: 'Butterfly Host',
    image: '/specimens/nettle.webp'
  },
  {
    id: 'bee',
    name: 'Western Honeybee',
    scientific: 'Apis mellifera',
    category: 'Keystone Pollinator',
    image: '/specimens/bee.webp'
  },
  {
    id: 'reishi',
    name: 'Lingzhi / Hemlock Reishi',
    scientific: 'Ganoderma tsugae',
    category: 'Fungi',
    image: '/specimens/reishi.webp'
  },
  {
    id: 'oak',
    name: 'Eastern White Oak',
    scientific: 'Quercus alba',
    category: 'Tree & Shrub',
    image: '/specimens/oak.webp'
  }
];

// Helper to normalize species ID between FieldGuide and Scanner
function resolveSampleId(id?: string): string {
  if (!id) return 'dandelion';
  const map: Record<string, string> = {
    'california-poppy': 'poppy',
    'maidenhair-fern': 'fern',
    'broadleaf-plantain': 'plantain',
    'stinging-nettle': 'nettle',
    'honeybee': 'bee',
    'reishi-mushroom': 'reishi',
    'white-oak': 'oak'
  };
  return map[id] || id;
}

export const PlantScanner: React.FC<PlantScannerProps> = ({
  ollamaConfig,
  ollamaOnline,
  onLogObservation,
  initialSpecimenId,
}) => {
  const targetId = resolveSampleId(initialSpecimenId);
  const initialSpecimen = SAMPLE_SPECIMENS.find(s => s.id === targetId) || SAMPLE_SPECIMENS[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialSpecimen.image);
  const [activeSampleId, setActiveSampleId] = useState<string>(initialSpecimen.id);
  const [speciesHintInput, setSpeciesHintInput] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PlantAnalysisResult | null>(null);
  const [loggedSuccess, setLoggedSuccess] = useState<boolean>(false);
  const [thinkingStep, setThinkingStep] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAnalyzingRef = useRef<boolean>(false);

  // Synchronize thinking timer and steps while analyzing
  React.useEffect(() => {
    if (!analyzing) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    const stepTimer = setInterval(() => {
      setThinkingStep(prev => (prev + 1) % 4);
    }, 1500);
    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [analyzing]);

  // Trigger analysis
  const runAnalysis = async (sampleKey?: string, file?: File | null) => {
    if (isAnalyzingRef.current) return;
    isAnalyzingRef.current = true;
    setThinkingStep(0);
    setElapsedSeconds(0);
    setAnalyzing(true);
    setLoggedSuccess(false);

    try {
      const targetFile = file !== undefined ? file : selectedFile;
      const activeKey = targetFile ? undefined : (sampleKey !== undefined ? (sampleKey || undefined) : (activeSampleId || undefined));
      const res = await analyzePlantSpecimen({
        imageFile: targetFile,
        sampleKey: activeKey,
        speciesHint: speciesHintInput.trim() || undefined,
        config: ollamaConfig,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      isAnalyzingRef.current = false;
      setAnalyzing(false);
    }
  };

  // Run analysis when specimen changes or on initial mount
  React.useEffect(() => {
    const key = resolveSampleId(initialSpecimenId);
    const specimen = SAMPLE_SPECIMENS.find(s => s.id === key) || SAMPLE_SPECIMENS[0];
    setActiveSampleId(specimen.id);
    setImagePreview(specimen.image);
    setSelectedFile(null);
    runAnalysis(specimen.id, null);
  }, [initialSpecimenId]);

  const handleSelectSample = (sample: SampleSpecimen) => {
    setActiveSampleId(sample.id);
    setSelectedFile(null);
    setImagePreview(sample.image);
    runAnalysis(sample.id, null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setActiveSampleId('');
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      runAnalysis('', file);
    }
  };

  const handleSaveToJournal = () => {
    if (!result) return;
    onLogObservation({
      speciesName: result.commonName,
      scientificName: result.scientificName,
      category: 'Flora',
      location: 'Local Nature Excursion',
      notes: `${result.ecologicalRole} Found during Touch Grass outdoor scan.`,
      verifiedWithAi: true,
      model: result.modelUsed,
      imageUrl: imagePreview || undefined,
      tags: [result.nativeStatus, result.family.split(' ')[0], 'TouchGrass2026']
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b']
    });

    setLoggedSuccess(true);
    setTimeout(() => setLoggedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Open-Weight Model Vision & Ecological Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Identify Native Flora & Wildlife
        </h1>
        <p className="text-emerald-300/80 text-sm sm:text-base leading-relaxed">
          Step outside, observe plants, mosses, and pollinators in your neighborhood, and let local Gemma 2 or Llama 3 analyze their ecological role without cloud dependency.
        </p>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Dropzone & Sample Selector */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Visual Box */}
          <div className="relative rounded-3xl overflow-hidden glass-card border-2 border-emerald-500/25 p-3 group">
            
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Specimen preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 text-emerald-400/60 space-y-2">
                  <Camera className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs">No specimen image chosen</p>
                </div>
              )}

              {/* Scanning Laser Beam overlay when analyzing */}
              {analyzing && (
                <div className="absolute inset-0 bg-emerald-950/50 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none">
                  {/* Moving laser bar */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-pulse"></div>
                  <div className="p-4 rounded-2xl bg-[#0c1611]/95 border border-emerald-400/50 shadow-2xl flex items-center gap-3 max-w-[85%]">
                    <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-bold text-white">Open-Weight Inference</p>
                      <p className="text-[10px] text-emerald-300 font-mono flex items-center gap-1.5 truncate">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                        <span className="truncate">{THINKING_STAGES[thinkingStep].title}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top overlay pill with status */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/70 backdrop-blur-md border border-emerald-400/30 text-emerald-200">
                  {ollamaOnline ? (
                    <>
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Live Ollama</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Fallback Heuristics</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Dropzone / Upload Action Buttons */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload Field Photo</span>
              </button>
              <button
                onClick={() => runAnalysis(selectedFile ? '' : activeSampleId, selectedFile)}
                disabled={analyzing}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 border border-emerald-400/40 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>Re-Analyze</span>
              </button>
            </div>
          </div>

          {/* Quick-Test Specimens Carousel / Grid */}
          <div className="p-4 rounded-3xl glass-card border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                1-Click Botanical Test Drive
              </span>
              <span className="text-[11px] text-emerald-400/70 font-mono">
                Sample Field Specimens
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-2">
              {SAMPLE_SPECIMENS.map((specimen) => (
                <button
                  key={specimen.id}
                  onClick={() => handleSelectSample(specimen)}
                  className={`group relative rounded-xl overflow-hidden border p-1.5 text-left transition-all ${
                    activeSampleId === specimen.id
                      ? 'bg-emerald-900/50 border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                      : 'bg-black/30 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-950/40'
                  }`}
                >
                  <img
                    src={specimen.image}
                    alt={specimen.name}
                    className="w-full h-14 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="mt-1.5">
                    <p className="text-[11px] font-bold text-white truncate">{specimen.name}</p>
                    <p className="text-[9px] text-emerald-400/70 font-mono truncate">{specimen.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional context text / species hint input */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 flex items-center gap-2">
            <input
              type="text"
              value={speciesHintInput}
              onChange={(e) => setSpeciesHintInput(e.target.value)}
              placeholder="Optional: specify habitat or species hint (e.g. stream bank)..."
              className="flex-1 bg-transparent text-xs text-emerald-100 placeholder-emerald-500/50 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
            />
            <button
              onClick={() => runAnalysis()}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30"
            >
              Apply
            </button>
          </div>

        </div>

        {/* Right Column: Identification & Botanical Intelligence Report */}
        <div className="lg:col-span-7 space-y-5">
          {analyzing ? (
            /* Active Neural Thinking State synchronized with the left scanner */
            <div className="rounded-3xl glass-card border-2 border-emerald-500/40 p-4 sm:p-6 md:p-8 space-y-6 shadow-2xl shadow-emerald-950/70 relative overflow-hidden bg-[#0c1611]/90 backdrop-blur-xl animate-fade-in">
              {/* Shimmer / ambient background glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Header: Synchronized thinking indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0c1611]"></span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-white font-display tracking-tight">
                        Analyzing Specimen...
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {ollamaConfig.customModelName || ollamaConfig.model}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400/80">
                      Syncing visual input with local open-weight ecological reasoning
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-500/30 text-xs font-mono text-emerald-300 self-start sm:self-auto shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>{elapsedSeconds}s elapsed</span>
                </div>
              </div>

              {/* Central Synchronized Thinking Pipeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Neural Pipeline Execution</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400/70 lowercase">
                    stage {thinkingStep + 1} of 4
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {THINKING_STAGES.map((stage, idx) => {
                    const StageIcon = stage.icon;
                    const isActive = thinkingStep === idx;
                    const isPassed = thinkingStep > idx;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                          isActive
                            ? 'bg-emerald-950/80 border-emerald-400/60 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/30 scale-[1.01]'
                            : isPassed
                            ? 'bg-black/40 border-emerald-500/30 text-emerald-300/80'
                            : 'bg-black/20 border-emerald-500/10 opacity-60 text-emerald-400/50'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse'
                            : isPassed
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-black/40 text-emerald-500/40 border border-emerald-500/10'
                        }`}>
                          <StageIcon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-xs font-bold ${isActive ? 'text-white' : isPassed ? 'text-emerald-200' : 'text-emerald-400/70'}`}>
                              {stage.title}
                            </h4>
                            {isActive && (
                              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 animate-pulse font-semibold">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                Active Step
                              </span>
                            )}
                            {isPassed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-emerald-300/70 mt-0.5 leading-relaxed">
                            {stage.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shimmering Skeleton Preview of upcoming Botanical Intelligence */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-emerald-400/70 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Synthesizing Botanical Report
                  </span>
                  <span className="animate-pulse">Loading taxonomy tokens...</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="h-16 rounded-2xl bg-emerald-950/30 border border-emerald-500/15 animate-pulse relative overflow-hidden p-3 space-y-2">
                    <div className="h-3 w-16 bg-emerald-500/20 rounded"></div>
                    <div className="h-4 w-24 bg-emerald-500/10 rounded"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                  <div className="h-16 rounded-2xl bg-emerald-950/30 border border-emerald-500/15 animate-pulse relative overflow-hidden p-3 space-y-2">
                    <div className="h-3 w-16 bg-emerald-500/20 rounded"></div>
                    <div className="h-4 w-24 bg-emerald-500/10 rounded"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                  <div className="h-16 rounded-2xl bg-emerald-950/30 border border-emerald-500/15 animate-pulse relative overflow-hidden p-3 space-y-2">
                    <div className="h-3 w-16 bg-emerald-500/20 rounded"></div>
                    <div className="h-4 w-24 bg-emerald-500/10 rounded"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                </div>
              </div>

            </div>
          ) : result ? (
            <div className="rounded-3xl glass-card border border-emerald-500/30 p-4 sm:p-6 md:p-8 space-y-6 shadow-2xl shadow-emerald-950/50 relative overflow-hidden">
              
              {/* Top ambient banner */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Header Title with Scientific Name & Confidence */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-emerald-500/20">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      result.confidence < 50
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    }`}>
                      {result.confidence}% Match Confidence
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      result.nativeStatus === 'Native'
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                        : result.nativeStatus === 'Invasive'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        : result.nativeStatus === 'Non-Living / Synthetic'
                        ? 'bg-purple-950/70 text-purple-300 border-purple-500/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    }`}>
                      {result.nativeStatus}
                    </span>
                    {selectedFile && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-300 border border-blue-500/30">
                        Uploaded Field Photo
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {result.commonName}
                  </h2>
                  <p className="text-emerald-300/80 font-mono text-sm italic">
                    {result.scientificName} • {result.family}
                  </p>

                  {/* Context Banner if Non-Botanical or Low Confidence */}
                  {result.nativeStatus === 'Non-Living / Synthetic' && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-2 text-xs text-purple-200">
                      <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <p>
                        <strong>Non-Botanical Subject:</strong> The analyzer detected an artificial graphic or non-living object rather than wild vegetation. Step outdoors to explore living plants!
                      </p>
                    </div>
                  )}
                  {result.confidence < 50 && result.nativeStatus !== 'Non-Living / Synthetic' && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p>
                        <strong>Low Botanical Confidence:</strong> Could not confirm distinct leaves or petals. Enter a clue in the Species Hint field below to assist Gemma 2.
                      </p>
                    </div>
                  )}
                </div>

                {/* Log to Journal Action */}
                <button
                  onClick={handleSaveToJournal}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    loggedSuccess
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-400/30'
                  }`}
                >
                  {loggedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Logged to Journal!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4 text-emerald-300" />
                      <span>Log Observation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Ecological Role & Functional Importance */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Ecological Role & Habitat Function
                </h3>
                <p className="text-sm text-emerald-100/90 leading-relaxed bg-black/30 p-4 rounded-2xl border border-emerald-500/15">
                  {result.ecologicalRole}
                </p>
              </div>

              {/* Growth Environment & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/15 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400/80 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Sunlight Needs
                  </span>
                  <p className="text-xs font-medium text-emerald-100">{result.sunlightNeeds}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/15 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400/80 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                    Soil & Moisture
                  </span>
                  <p className="text-xs font-medium text-emerald-100">{result.soilMoisture}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/15 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400/80 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Bloom Season
                  </span>
                  <p className="text-xs font-medium text-emerald-100">{result.bloomSeason}</p>
                </div>
              </div>

              {/* Foraging & Safety Advisory */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Info className="w-4 h-4 text-emerald-400" />
                    Foraging & Contact Safety
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.foragingSafety.isEdible
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {result.foragingSafety.isEdible ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Edible Properties</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>Non-Edible / Caution</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {result.foragingSafety.cautionNote}
                </p>
                {result.foragingSafety.lookalikesWarning && (
                  <p className="text-[11px] text-amber-300/90 flex items-center gap-1.5 pt-1 border-t border-emerald-500/10">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Lookalikes Note:</strong> {result.foragingSafety.lookalikesWarning}</span>
                  </p>
                )}
              </div>

              {/* Key Diagnostic Features */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Key Botanical Identification Markers
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {result.keyIdentificationFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-emerald-100 bg-black/20 p-2.5 rounded-xl border border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* "Touch Grass" Outdoor Challenge Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-green-950/80 border border-emerald-400/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-emerald-900/60 border border-emerald-500/30">
                    <Leaf className="w-4 h-4 text-emerald-300" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    "Touch Grass" Observation Challenge
                  </h4>
                </div>
                <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                  {result.touchGrassChallenge}
                </p>
              </div>

              {/* Model Provenance Footer */}
              <div className="pt-3 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-emerald-400/70">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Inference: {result.inferenceTimeMs}ms • Model: {result.modelUsed}
                </span>
                <span className="text-emerald-300/80">
                  {result.isMockFallback ? 'Local Fallback Heuristics' : 'Direct Ollama Endpoint'}
                </span>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl glass-card border border-emerald-500/20 p-12 text-center text-emerald-400/70 space-y-4">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-400" />
              <p className="text-sm font-medium">Scanning specimen with local open-weight model...</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
