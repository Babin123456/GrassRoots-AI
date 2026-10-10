import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Download, 
  Trash2, 
  Search, 
  MapPin, 
  Calendar, 
  Copy, 
  Check, 
  X,
  ShieldCheck,
  Sprout,
  Bug,
  Flame,
  Leaf
} from 'lucide-react';
import type { ObservationLog } from '../types';

interface FieldJournalProps {
  observations: ObservationLog[];
  onAddObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
  onDeleteObservation: (id: string) => void;
  onClearAll: () => void;
  streakCount: number;
}

export const FieldJournal: React.FC<FieldJournalProps> = ({
  observations,
  onAddObservation,
  onDeleteObservation,
  onClearAll: _onClearAll,
  streakCount,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Form state
  const [newSpecies, setNewSpecies] = useState('');
  const [newScientific, setNewScientific] = useState('');
  const [newCategory, setNewCategory] = useState<ObservationLog['category']>('Flora');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('TouchGrass, LocalPark');

  // Filtered observations
  const filtered = observations.filter((obs) => {
    const matchesCat = filterCategory === 'All' || obs.category === filterCategory;
    const matchesSearch =
      obs.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecies.trim()) return;

    onAddObservation({
      speciesName: newSpecies.trim(),
      scientificName: newScientific.trim() || undefined,
      category: newCategory,
      location: newLocation.trim() || 'Local Nature Area',
      notes: newNotes.trim() || 'Observed outdoors during walk.',
      verifiedWithAi: false,
      model: 'Field Observer Entry',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewSpecies('');
    setNewScientific('');
    setNewNotes('');
    setNewLocation('');
    setIsModalOpen(false);
  };

  // Generate markdown summary for sharing with local nature / DEV groups
  const handleExportMarkdownSummary = () => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let md = `# GrassRoots AI — Community Field Observation Summary\n`;
    md += `*Generated on ${dateStr} • Outdoor Exploration Streak: ${streakCount} Days*\n\n`;
    md += `### Summary Metrics\n`;
    md += `- Total Logged Discoveries: **${observations.length}**\n`;
    md += `- AI Verified Identifications: **${observations.filter((o) => o.verifiedWithAi).length}**\n`;
    md += `- Open-Weight Models Used: **Gemma 2 / Llama 3 via Ollama**\n\n`;
    md += `### Field Discoveries Log\n\n`;

    observations.forEach((obs, index) => {
      md += `#### ${index + 1}. ${obs.speciesName} ${obs.scientificName ? `(*${obs.scientificName}*)` : ''}\n`;
      md += `- **Category:** ${obs.category} | **Location:** ${obs.location}\n`;
      md += `- **Date:** ${new Date(obs.timestamp).toLocaleDateString()}\n`;
      md += `- **Notes:** ${obs.notes}\n`;
      md += `- **Verification:** ${obs.verifiedWithAi ? `Verified via ${obs.model}` : 'Visual Observation'}\n`;
      if (obs.tags.length > 0) {
        md += `- **Tags:** \`${obs.tags.join('`, `')}\`\n`;
      }
      md += `\n---\n\n`;
    });

    md += `*Contributed via GrassRoots AI — Open Source Bio-Monitoring for Hacktoberfest 2026*\n`;

    navigator.clipboard.writeText(md);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  // Download JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(observations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `grassroots_ai_observations_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Community Grassroots Hub & Field Journal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Outdoor Discoveries & Logs
        </h1>
        <p className="text-emerald-300/80 text-sm sm:text-base leading-relaxed">
          Record your local ecological encounters, compile field notes, track badges, and generate structured summaries to share with community conservation groups.
        </p>
      </div>

      {/* Badges / Gamification Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 text-center space-y-1">
          <div className="flex justify-center text-emerald-400">
            <Sprout className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-white">Flora Scout</p>
          <p className="text-[10px] text-emerald-400/80 font-mono">
            {observations.filter((o) => o.category === 'Flora').length} Plant Logs
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 text-center space-y-1">
          <div className="flex justify-center text-amber-400">
            <Bug className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-white">Pollinator Ally</p>
          <p className="text-[10px] text-emerald-400/80 font-mono">
            {observations.filter((o) => o.category === 'Fauna').length} Pollinator Logs
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 text-center space-y-1">
          <div className="flex justify-center text-purple-400">
            <Leaf className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-white">Fungi Whisperer</p>
          <p className="text-[10px] text-emerald-400/80 font-mono">
            {observations.filter((o) => o.category === 'Fungi').length} Fungi Logs
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 text-center space-y-1">
          <div className="flex justify-center text-amber-500">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-xs font-bold text-white">Outdoors Streak</p>
          <p className="text-[10px] text-emerald-400/80 font-mono">
            {streakCount} Active Days
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-emerald-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search observations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-emerald-500/25 text-xs text-emerald-100 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['All', 'Flora', 'Fauna', 'Fungi'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-black/30 text-emerald-300/80 hover:bg-emerald-950/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons: Add New & Export */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportMarkdownSummary}
            className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Copy formatted markdown report for DEV or community forums"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{copiedSummary ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-black/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Export raw JSON backup"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 border border-emerald-400/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Log</span>
          </button>
        </div>

      </div>

      {/* Observation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((obs) => (
          <div
            key={obs.id}
            className="rounded-3xl glass-card border border-emerald-500/20 overflow-hidden flex flex-col justify-between p-5 space-y-4 hover:border-emerald-400/40 transition-all"
          >
            <div className="space-y-3">
              {obs.imageUrl && (
                <div className="h-44 w-full rounded-2xl overflow-hidden bg-black/60 relative">
                  <img
                    src={obs.imageUrl}
                    alt={obs.speciesName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                    {obs.category}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-lg text-white">
                    {obs.speciesName}
                  </h3>
                  <button
                    onClick={() => onDeleteObservation(obs.id)}
                    className="text-emerald-500/40 hover:text-rose-400 p-1 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {obs.scientificName && (
                  <p className="text-xs font-mono text-emerald-400/70 italic">
                    {obs.scientificName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-300/80">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{obs.location}</span>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed bg-black/25 p-3 rounded-xl border border-emerald-500/10">
                {obs.notes}
              </p>

              {/* Tags */}
              {obs.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {obs.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-[10px] font-mono text-emerald-300 border border-emerald-500/20"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-[10px] font-mono text-emerald-400/70">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(obs.timestamp).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-emerald-300/90">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {obs.model}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-3xl glass-card border border-emerald-500/20 p-12 text-center text-emerald-400/70 space-y-3">
          <BookOpen className="w-8 h-8 mx-auto text-emerald-500" />
          <p className="text-sm font-semibold text-white">No field logs found</p>
          <p className="text-xs text-emerald-400/80">
            Head to the Plant Scanner to identify your first specimen, or click "New Log" above.
          </p>
        </div>
      )}

      {/* Manual Observation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c1611] border border-emerald-500/30 p-6 sm:p-7 shadow-2xl space-y-5 text-emerald-100">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <h3 className="font-display font-bold text-lg text-white">Add Outdoor Field Observation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Common Species Name *</label>
                <input
                  type="text"
                  required
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                  placeholder="e.g. Red Clover, Mourning Cloak Butterfly"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-emerald-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Scientific Binomial (Optional)</label>
                <input
                  type="text"
                  value={newScientific}
                  onChange={(e) => setNewScientific(e.target.value)}
                  placeholder="e.g. Trifolium pratense"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-emerald-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ObservationLog['category'])}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-emerald-100 focus:outline-none"
                  >
                    <option value="Flora">Flora</option>
                    <option value="Fauna">Fauna</option>
                    <option value="Fungi">Fungi</option>
                    <option value="Ecosystem Habitats">Ecosystem Habitats</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Location / Trail</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. East Brook Woods"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-emerald-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Field Notes & Habitat Description</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Describe surrounding foliage, sun conditions, insect visitors..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-emerald-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Native, Pollinator, TouchGrass"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-emerald-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-emerald-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
