import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Trees, 
  Backpack, 
  ShieldAlert, 
  Printer, 
  Share2, 
  RefreshCw,
  Eye,
  Award,
  Lightbulb
} from 'lucide-react';
import type { TrailActivity, OllamaConfig } from '../types';
import { generateTrailPlan } from '../services/aiService';

interface TrailAdvisorProps {
  ollamaConfig: OllamaConfig;
}

const ECOSYSTEMS = [
  'Deciduous Forest & Woodland',
  'Urban Park & Native Greenbelt',
  'Riparian Riverbank & Wetland',
  'Coastal Meadow & Chaparral',
  'Backyard & Community Garden',
  'Rocky Ridge & Hillside'
];

const DURATIONS = [
  '30-Min Sensory Reset',
  '1-Hour Bio-Monitoring Walk',
  '2-Hour Botanical Deep-Dive',
  'Half-Day Wilderness Trek'
];

const SEASONS = ['Spring Blooms', 'Summer Pollinator Peak', 'Autumn Seeds & Fungi', 'Winter Bark & Mosses'];

const FOCUS_AREAS = [
  'Botanical Scavenger Hunt',
  'Native Pollinator Survey',
  'Moss, Lichen & Micro-Ecology',
  'Safe Foraging & Lookalikes',
  'Watershed & Soil Observation'
];

export const TrailAdvisor: React.FC<TrailAdvisorProps> = ({
  ollamaConfig,
}) => {
  const [selectedEcosystem, setSelectedEcosystem] = useState(ECOSYSTEMS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1]);
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[1]);
  const [selectedFocus, setSelectedFocus] = useState(FOCUS_AREAS[0]);
  const [generating, setGenerating] = useState(false);
  const [trail, setTrail] = useState<TrailActivity | null>(null);
  const [completedWaypoints, setCompletedWaypoints] = useState<number[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initial generation
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const plan = await generateTrailPlan({
        ecosystem: selectedEcosystem,
        duration: selectedDuration,
        season: selectedSeason,
        focus: selectedFocus,
        config: ollamaConfig,
      });
      setTrail(plan);
      setCompletedWaypoints([]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  React.useEffect(() => {
    handleGenerate();
  }, []);

  const toggleWaypoint = (step: number) => {
    if (completedWaypoints.includes(step)) {
      setCompletedWaypoints(completedWaypoints.filter((s) => s !== step));
    } else {
      const updated = [...completedWaypoints, step];
      setCompletedWaypoints(updated);
    }
  };

  const handleCopy = () => {
    if (!trail) return;
    const text = `# ${trail.title}\n\nEcosystem: ${trail.ecosystem}\nDuration: ${trail.duration}\n\n${trail.overview}\n\nWaypoints:\n` +
      trail.waypoints.map(w => `${w.step}. ${w.title}: ${w.instruction}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Ecosystem & Trail Advisor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Plan Your Outdoor Exploration
        </h1>
        <p className="text-emerald-300/80 text-sm sm:text-base leading-relaxed">
          Generate structured outdoor bio-monitoring expeditions, mindful botanical strolls, and native habitat surveys tailored to your schedule and local environment.
        </p>
      </div>

      {/* Control Configuration Panel */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/25 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Ecosystem Picker */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Trees className="w-4 h-4 text-emerald-400" />
              Ecosystem Type
            </label>
            <select
              value={selectedEcosystem}
              onChange={(e) => setSelectedEcosystem(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-500/25 text-xs text-emerald-100 font-medium focus:outline-none focus:border-emerald-400"
            >
              {ECOSYSTEMS.map((eco) => (
                <option key={eco} value={eco} className="bg-neutral-900 text-white">
                  {eco}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-400" />
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-500/25 text-xs text-emerald-100 font-medium focus:outline-none focus:border-emerald-400"
            >
              {DURATIONS.map((dur) => (
                <option key={dur} value={dur} className="bg-neutral-900 text-white">
                  {dur}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Season Timing
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-500/25 text-xs text-emerald-100 font-medium focus:outline-none focus:border-emerald-400"
            >
              {SEASONS.map((sea) => (
                <option key={sea} value={sea} className="bg-neutral-900 text-white">
                  {sea}
                </option>
              ))}
            </select>
          </div>

          {/* Focus Area */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Curated Focus
            </label>
            <select
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-500/25 text-xs text-emerald-100 font-medium focus:outline-none focus:border-emerald-400"
            >
              {FOCUS_AREAS.map((foc) => (
                <option key={foc} value={foc} className="bg-neutral-900 text-white">
                  {foc}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-500/15">
          <span className="text-xs text-emerald-400/80 font-mono">
            Optimized with local open-weight AI logic for offline field walking
          </span>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            <span>Generate Customized Trail Plan</span>
          </button>
        </div>

      </div>

      {/* Generated Trail Display */}
      {trail && (
        <div className="rounded-3xl glass-card border border-emerald-500/30 p-4 sm:p-6 md:p-8 space-y-8 relative overflow-hidden">
          
          {/* Top subtle badge & actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {trail.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 text-emerald-300 border border-emerald-500/20">
                  {trail.duration}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 text-emerald-300 border border-emerald-500/20">
                  {trail.season}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {trail.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copiedLink ? 'Copied Markdown!' : 'Copy Plan'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Overview text */}
          <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/15 text-sm text-emerald-100/90 leading-relaxed">
            {trail.overview}
          </div>

          {/* Interactive Step-by-Step Waypoints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                Guided Exploration Waypoints
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {completedWaypoints.length} of {trail.waypoints.length} checkpoints completed
              </span>
            </div>

            <div className="space-y-4">
              {trail.waypoints.map((wp) => {
                const isDone = completedWaypoints.includes(wp.step);
                return (
                  <div
                    key={wp.step}
                    onClick={() => toggleWaypoint(wp.step)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-950/40 border-emerald-500/40 opacity-90'
                        : 'bg-black/30 border-emerald-500/20 hover:border-emerald-400/40 hover:bg-black/40'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button className="mt-0.5 text-emerald-400">
                        {isDone ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-emerald-600 hover:text-emerald-400" />
                        )}
                      </button>

                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${isDone ? 'text-emerald-200 line-through' : 'text-white'}`}>
                            Checkpoint {wp.step}: {wp.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Step {wp.step}
                          </span>
                        </div>

                        <p className="text-xs text-emerald-200/90 leading-relaxed">
                          {wp.instruction}
                        </p>

                        {/* Target species pill */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Target Species:
                          </span>
                          {wp.targetSpecies.map((sp, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-900/40 text-[10px] text-emerald-200 font-medium border border-emerald-500/20">
                              {sp}
                            </span>
                          ))}
                        </div>

                        {/* Mindfulness quote prompt */}
                        <div className="text-[11px] text-emerald-300/80 italic bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/10 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>Mindful Observation:</strong> {wp.mindfulnessPrompt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Packing List & Leave No Trace side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            
            {/* Packing List */}
            <div className="p-5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <Backpack className="w-4 h-4 text-emerald-400" />
                Recommended Gear & Field Kit
              </h4>
              <ul className="space-y-2 text-xs text-emerald-200/90">
                {trail.packingList.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Leave No Trace */}
            <div className="p-5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                Leave No Trace Ethics
              </h4>
              <ul className="space-y-2 text-xs text-emerald-200/90">
                {trail.leaveNoTraceGuidelines.map((guideline, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></span>
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Completion banner */}
          {completedWaypoints.length === trail.waypoints.length && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-green-900 border border-emerald-400 text-center space-y-1 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
                <Award className="w-5 h-5 text-amber-300" />
                <span>All Waypoints Checked! Outdoor Touch-Grass Goal Met!</span>
              </div>
              <p className="text-xs text-emerald-200">
                You completed this ecological excursion. Take a moment to log any unique discoveries in your Field Journal!
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
