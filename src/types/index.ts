export type TabType = 'scanner' | 'trails' | 'journal' | 'fieldguide';

export interface PlantAnalysisResult {
  commonName: string;
  scientificName: string;
  confidence: number;
  family: string;
  nativeStatus: 'Native' | 'Non-Native Naturalized' | 'Invasive' | 'Unknown';
  conservationStatus: 'Least Concern' | 'Vulnerable' | 'Threatened' | 'Protected' | 'Common';
  ecologicalRole: string;
  sunlightNeeds: string;
  soilMoisture: string;
  bloomSeason: string;
  foragingSafety: {
    isEdible: boolean;
    cautionNote: string;
    lookalikesWarning?: string;
  };
  keyIdentificationFeatures: string[];
  touchGrassChallenge: string;
  modelUsed: string;
  inferenceTimeMs: number;
  isMockFallback: boolean;
}

export interface TrailActivity {
  id: string;
  title: string;
  ecosystem: string;
  duration: string;
  difficulty: 'Easy Stroll' | 'Moderate Hike' | 'Rugged Trek';
  season: string;
  focus: string;
  overview: string;
  waypoints: {
    step: number;
    title: string;
    instruction: string;
    targetSpecies: string[];
    mindfulnessPrompt: string;
  }[];
  packingList: string[];
  leaveNoTraceGuidelines: string[];
}

export interface ObservationLog {
  id: string;
  timestamp: string;
  speciesName: string;
  scientificName?: string;
  category: 'Flora' | 'Fauna' | 'Fungi' | 'Ecosystem Habitats';
  location: string;
  notes: string;
  verifiedWithAi: boolean;
  model: string;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
}

export interface FieldGuideSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Wildflower' | 'Fern & Moss' | 'Tree & Shrub' | 'Medicinal / Herb' | 'Native Pollinator' | 'Fungi';
  nativeRegion: string;
  bloomTime: string;
  ecologicalFunction: string;
  identificationTips: string[];
  edibilityNotice: string;
  isEdible: boolean;
  isInvasive: boolean;
  badge: string;
  imageUrl: string;
}

export interface OllamaConfig {
  endpoint: string;
  model: string;
  customModelName: string;
  temperature: number;
}
