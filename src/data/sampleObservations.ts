import type { ObservationLog } from '../types';

export const INITIAL_OBSERVATIONS: ObservationLog[] = [
  {
    id: 'obs-001',
    timestamp: '2026-10-09T14:22:00Z',
    speciesName: 'Western Maidenhair Fern',
    scientificName: 'Adiantum aleuticum',
    category: 'Flora',
    location: 'Emerald Creek Gully, Ridge Trail',
    notes: 'Discovered in a shaded sandstone alcove right beside the waterfall spray. Fronds beaded with morning mist.',
    verifiedWithAi: true,
    model: 'Gemma 2 (9B)',
    imageUrl: '/specimens/fern.webp',
    tags: ['Riparian', 'Native', 'Zero-Invasive', 'Moist Shade']
  },
  {
    id: 'obs-002',
    timestamp: '2026-10-08T11:45:00Z',
    speciesName: 'Western Honeybee & California Poppy',
    scientificName: 'Apis mellifera / Eschscholzia californica',
    category: 'Fauna',
    location: 'Southfacing Meadow Bioswale',
    notes: 'Observed 6 bees loading bright yellow-orange pollen pellets into their corbiculae. High pollination activity at midday sun.',
    verifiedWithAi: true,
    model: 'Llama 3 (8B)',
    imageUrl: '/specimens/bee.webp',
    tags: ['Pollinators', 'Meadow', 'TouchGrassChallenge']
  },
  {
    id: 'obs-003',
    timestamp: '2026-10-07T16:10:00Z',
    speciesName: 'Common Broadleaf Plantain',
    scientificName: 'Plantago major',
    category: 'Flora',
    location: 'Oak Woodland Trailhead Border',
    notes: 'Plentiful along compacted footpath. Used one crushed leaf to relieve a minor nettle brush; instant cooling effect.',
    verifiedWithAi: true,
    model: 'Gemma 2 (2B - Lightweight)',
    imageUrl: '/specimens/plantain.webp',
    tags: ['Trailside Herb', 'FirstAid', 'Edible']
  }
];
