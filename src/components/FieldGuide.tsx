import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  X,
  Info
} from 'lucide-react';
import { FIELD_GUIDE_SPECIES } from '../data/fieldGuideData';
import type { FieldGuideSpecies } from '../types';

interface FieldGuideProps {
  onInspectInScanner?: (specimenId: string) => void;
}

export const FieldGuide: React.FC<FieldGuideProps> = ({ onInspectInScanner }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecies, setSelectedSpecies] = useState<FieldGuideSpecies | null>(null);

  const categories = [
    'All',
    'Wildflower',
    'Fern & Moss',
    'Tree & Shrub',
    'Medicinal / Herb',
    'Native Pollinator',
    'Fungi'
  ];

  const filteredSpecies = FIELD_GUIDE_SPECIES.filter((sp) => {
    const matchesCat = selectedCategory === 'All' || sp.category === selectedCategory;
    const matchesSearch =
      sp.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.ecologicalFunction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
          <Library className="w-3.5 h-3.5 text-emerald-400" />
          <span>Offline Botanical Knowledge Base & Field Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          Native Flora & Wildlife Guide
        </h1>
        <p className="text-emerald-300/80 text-sm sm:text-base leading-relaxed">
          Zero internet required. Browse native species, learn distinguishing physical markers, and discover critical safety precautions before touching or foraging.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-emerald-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flora, fungi, pollinators..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-xs text-emerald-100 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-400/40'
                  : 'bg-black/30 text-emerald-300/80 hover:bg-emerald-950/50 border border-emerald-500/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Species Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredSpecies.map((sp) => (
          <div
            key={sp.id}
            onClick={() => setSelectedSpecies(sp)}
            className="group rounded-3xl glass-card border border-emerald-500/20 overflow-hidden flex flex-col justify-between hover:border-emerald-400/50 hover:bg-emerald-950/30 transition-all cursor-pointer transform hover:-translate-y-1 shadow-lg"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                <img
                  src={sp.imageUrl}
                  alt={sp.commonName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  {sp.category}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                  {sp.badge}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  {sp.commonName}
                </h3>
                <p className="text-xs font-mono text-emerald-400/80 italic">
                  {sp.scientificName}
                </p>
                <p className="text-xs text-emerald-200/80 line-clamp-2 leading-relaxed">
                  {sp.ecologicalFunction}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between text-xs text-emerald-400 font-semibold border-t border-emerald-500/10 mt-2">
              <span>View Guide</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Species Modal */}
      {selectedSpecies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c1611] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-emerald-100 max-h-[85vh] overflow-y-auto space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-emerald-500/20">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {selectedSpecies.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  {selectedSpecies.commonName}
                </h2>
                <p className="text-sm font-mono text-emerald-400/80 italic">
                  {selectedSpecies.scientificName} • {selectedSpecies.nativeRegion}
                </p>
              </div>
              <button
                onClick={() => setSelectedSpecies(null)}
                className="p-2 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-900/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/60">
              <img
                src={selectedSpecies.imageUrl}
                alt={selectedSpecies.commonName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Ecological Function
              </h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-emerald-500/15">
                {selectedSpecies.ecologicalFunction}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Key Identification Markers
              </h4>
              <ul className="space-y-2 text-xs">
                {selectedSpecies.identificationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Foraging & Safety Advisory</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {selectedSpecies.edibilityNotice}
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-500/20 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSpecies(null)}
                className="px-4 py-2 rounded-xl text-emerald-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
              {onInspectInScanner && (
                <button
                  onClick={() => {
                    onInspectInScanner(selectedSpecies.id);
                    setSelectedSpecies(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 border border-emerald-400/30 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze in Scanner</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
