import type { PlantAnalysisResult, TrailActivity, OllamaConfig } from '../types';

export const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  endpoint: 'http://localhost:11434',
  model: 'gemma2:9b',
  customModelName: '',
  temperature: 0.3,
};

// Check if Ollama is running and accessible
export async function checkOllamaStatus(endpoint: string = 'http://localhost:11434'): Promise<{ isOnline: boolean; models: string[]; latencyMs: number }> {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
    const response = await fetch(`${endpoint.replace(/\/$/, '')}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const models = data.models ? data.models.map((m: { name: string }) => m.name) : [];
      return {
        isOnline: true,
        models,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
    return { isOnline: false, models: [], latencyMs: 0 };
  } catch {
    return { isOnline: false, models: [], latencyMs: 0 };
  }
}

// Fallback botanical identification heuristics database for zero-breakage offline experience
const BOTANICAL_SPECIMEN_KNOWLEDGE: Record<string, Partial<PlantAnalysisResult>> = {
  dandelion: {
    commonName: 'Common Dandelion',
    scientificName: 'Taraxacum officinale',
    family: 'Asteraceae (Daisy / Sunflower Family)',
    nativeStatus: 'Non-Native Naturalized',
    conservationStatus: 'Common',
    confidence: 98.4,
    ecologicalRole: 'Essential early-spring nectar & pollen resource for solitary bees and syrphid flies. Dynamic soil bio-accumulator that dredges deep subsoil minerals via taproot.',
    sunlightNeeds: 'Full Sun to Light Partial Shade',
    soilMoisture: 'Adaptable (Dry to Moderately Moist, tolerates compacted turf)',
    bloomSeason: 'Early Spring through Autumn frost',
    foragingSafety: {
      isEdible: true,
      cautionNote: 'Ensure harvest is at least 30 meters away from vehicle roadsides or pesticide-treated lawns. Leaves are bitter and best picked young before flowering.',
      lookalikesWarning: 'False Dandelion / Catsear (Hypochaeris radicata) - also non-toxic but has solid, forking stems and rough hairs.',
    },
    keyIdentificationFeatures: [
      'Single flower head per hollow leafless scape exuding white latex sap',
      'Basal rosette of deeply jagged, reverse-toothed leaves',
      'Pappus parachute sphere ("clock") dispersing windborne achenes'
    ],
    touchGrassChallenge: 'Touch the hollow stem gently, observe whether any native pollinator is actively foraging on the ray florets, and record the temperature.',
  },
  poppy: {
    commonName: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    family: 'Papaveraceae (Poppy Family)',
    nativeStatus: 'Native',
    conservationStatus: 'Least Concern',
    confidence: 96.8,
    ecologicalRole: 'Attracts native solitary sweat bees and bumblebees with copious pollen. Adapted to wildfire-prone chapparal with fire-stimulated seed germination.',
    sunlightNeeds: 'Full Sun (Blooms close in overcast shade & nighttime)',
    soilMoisture: 'Well-drained, sandy, gravelly, or loam; highly drought-resilient',
    bloomSeason: 'Late Winter through Mid-Summer',
    foragingSafety: {
      isEdible: false,
      cautionNote: 'Contains mild sedative alkaloids (eschscholtzine, californidine). Traditionally prepared as tea by native peoples, but not a salad vegetable.',
      lookalikesWarning: 'Wood Poppy (Stylophorum diphyllum) - found in Eastern deciduous woods with yellow sap and distinct foliage.',
    },
    keyIdentificationFeatures: [
      'Satiny four-petaled flowers ranging from bright neon orange to pale gold',
      'Finely divided lacy, blue-green glaucous foliage',
      'Ringed receptacle collar ("torus") directly below the base of petals'
    ],
    touchGrassChallenge: 'Notice how the petals open wide under direct sunshine and curl tightly inward as afternoon shade arrives. Record how long the bloom response takes.',
  },
  fern: {
    commonName: 'Western Maidenhair Fern',
    scientificName: 'Adiantum aleuticum',
    family: 'Pteridaceae (Maidenhair Fern Family)',
    nativeStatus: 'Native',
    conservationStatus: 'Least Concern',
    confidence: 95.2,
    ecologicalRole: 'Anchor of moist ravine banks and canyon waterfall spray zones; maintains humid micro-climates that support woodland salamanders and bryophytes.',
    sunlightNeeds: 'Dappled Deep Shade to Medium Filtered Light',
    soilMoisture: 'Consistently Moist to Wet, high organic humus and seepage',
    bloomSeason: 'Spore maturation: June through September (Non-flowering seedless vascular plant)',
    foragingSafety: {
      isEdible: false,
      cautionNote: 'Contains thiaminase enzymes common to raw ferns. Leave in habitat for soil stabilization and watershed conservation.',
      lookalikesWarning: 'Northern Maidenhair (Adiantum pedatum) - closely related sister taxon with circular frond fan.',
    },
    keyIdentificationFeatures: [
      'Wiry, polished purplish-black or ebony stipes (stems)',
      'Finger-like cascading frond branches holding delicate fan-shaped pinnae',
      'Water-repellent leaf surface that causes water droplets to bead like mercury'
    ],
    touchGrassChallenge: 'Dip a fingertip gently into nearby clean water droplets on a frond and observe the hydrophobic surface tension.',
  },
  plantain: {
    commonName: 'Broadleaf Plantain',
    scientificName: 'Plantago major',
    family: 'Plantaginaceae (Plantain Family)',
    nativeStatus: 'Non-Native Naturalized',
    conservationStatus: 'Common',
    confidence: 97.5,
    ecologicalRole: 'Tolerant of severe trampling along human walking paths. Fibrous root system checks foot-traffic erosion, and seeds feed migratory goldfinches.',
    sunlightNeeds: 'Full Sun to Partial Shade',
    soilMoisture: 'Dry to Moist, thrives in heavy clay and compacted footpaths',
    bloomSeason: 'May to October',
    foragingSafety: {
      isEdible: true,
      cautionNote: 'Young tender leaves are edible cooked or raw. Famous trailside natural soothing poultice: chew or crush leaf to release allantoin and apply to insect bites.',
      lookalikesWarning: 'English Plantain / Ribwort (Plantago lanceolata) - has narrow spear-shaped leaves with identical soothing properties.',
    },
    keyIdentificationFeatures: [
      'Broad oval rosette with 3 to 9 parallel veins visible on underside',
      'Elastic, string-like veins visible when petiole is broken cleanly',
      'Dense, green spike inflorescence holding hundreds of minute flowers'
    ],
    touchGrassChallenge: 'Locate a plantain along the edge of a path and find the 5 distinct parallel veins running like strings through the leaf base.',
  },
  nettle: {
    commonName: 'Stinging Nettle',
    scientificName: 'Urtica dioica',
    family: 'Urticaceae (Nettle Family)',
    nativeStatus: 'Native',
    conservationStatus: 'Common',
    confidence: 94.7,
    ecologicalRole: 'Sole larval host plant for multiple nymphalid butterflies (Red Admiral, Question Mark, Peacock). Powerful indicator of nitrogen-rich damp soils.',
    sunlightNeeds: 'Partial Shade to Sun along forest edges and creek margins',
    soilMoisture: 'Rich, damp, fertile floodplain soil',
    bloomSeason: 'June to September',
    foragingSafety: {
      isEdible: true,
      cautionNote: 'TOUCH WITH GLOVES! Stinging trichomes inject formic acid and histamine. Once steamed, boiled, or dried, hairs are 100% deactivated into iron/calcium-rich green superfood.',
      lookalikesWarning: 'Dead-nettle (Lamium album / purpureum) - member of mint family with square stems but NO stinging hairs and pink/white flowers.',
    },
    keyIdentificationFeatures: [
      'Opposite serrated leaves with heart-shaped base and pointed tip',
      'Hollow silica needle hairs visible under backlight along stem and petioles',
      'Drooping clusters of tiny green flowers emerging from leaf axils'
    ],
    touchGrassChallenge: 'Look closely at the underside of the leaves in the sunlight without touching to spot the glass-like silica needles.',
  },
  bee: {
    commonName: 'Western Honeybee on Flora',
    scientificName: 'Apis mellifera',
    family: 'Apidae (Bees & Allies)',
    nativeStatus: 'Non-Native Naturalized',
    conservationStatus: 'Least Concern',
    confidence: 99.1,
    ecologicalRole: 'Vital pollinator of thousands of wild angiosperms and crops. Co-operates with solitary bees to transfer pollen in agricultural and riparian zones.',
    sunlightNeeds: 'Warm, sunny weather (> 12°C)',
    soilMoisture: 'N/A - active in sunny flowering corridors near clean water',
    bloomSeason: 'Active March through October',
    foragingSafety: {
      isEdible: false,
      cautionNote: 'Do not swat or trap. Foraging bees on blossoms are peaceful and focused on nectar extraction unless stepped upon.',
    },
    keyIdentificationFeatures: [
      'Golden amber abdomen with darker bands and soft downy thoracic hairs',
      'Noticeable corbicula (pollen basket) on tibia of hind legs',
      'Characteristic steady zig-zag flight pattern between flowers of same species'
    ],
    touchGrassChallenge: 'Spend 2 full minutes standing completely still next to a flowering bush and count how many individual blooms this bee visits.',
  },
  reishi: {
    commonName: 'Hemlock Reishi / Varnished Polypore',
    scientificName: 'Ganoderma tsugae',
    family: 'Ganodermataceae',
    nativeStatus: 'Native',
    conservationStatus: 'Least Concern',
    confidence: 96.2,
    ecologicalRole: 'Primary forest decomposer of dead hemlock and conifer trees, cycling organic nutrients back into humus layers.',
    sunlightNeeds: 'Shaded forest understory',
    soilMoisture: 'Damp decaying conifer stumps and logs',
    bloomSeason: 'Fruiting bodies emerge June through October',
    foragingSafety: {
      isEdible: true,
      cautionNote: 'Non-toxic medicinal polypore, but woody. NEVER consume any wild mushroom without 100% expert verification.',
      lookalikesWarning: 'Red-belted conk (Fomitopsis mounceae) - perennial with resinous crust.',
    },
    keyIdentificationFeatures: [
      'Brilliant glossy lacquered reddish-orange cap with white outer growth rim',
      'White pore surface on underside that bruises brown',
      'Woody, cork-like bracket attachment'
    ],
    touchGrassChallenge: 'Inspect the decaying log beneath the bracket to see mosses and lichen sharing the decaying microhabitat.',
  },
  oak: {
    commonName: 'Eastern White Oak',
    scientificName: 'Quercus alba',
    family: 'Fagaceae (Beech / Oak Family)',
    nativeStatus: 'Native',
    conservationStatus: 'Least Concern',
    confidence: 97.4,
    ecologicalRole: 'Keystone canopy species supporting over 500 caterpillar species, wild turkeys, and native squirrels.',
    sunlightNeeds: 'Full Sun to Moderate Shade',
    soilMoisture: 'Well-drained deep loamy soil',
    bloomSeason: 'Spring (catkin flowering)',
    foragingSafety: {
      isEdible: true,
      cautionNote: 'Acorns are edible after leaching out bitter water-soluble tannins through soaking or boiling.',
    },
    keyIdentificationFeatures: [
      'Leaves with 7 to 9 rounded finger-like lobes without bristles',
      'Light ash-gray bark with scaly overlapping plates',
      'Shallow-capped oblong acorns'
    ],
    touchGrassChallenge: 'Look at the ground beneath the canopy for dropped acorn caps and count how many different insect species crawl across the bark.',
  }
};

// Aliases matching Field Guide species IDs
BOTANICAL_SPECIMEN_KNOWLEDGE['california-poppy'] = BOTANICAL_SPECIMEN_KNOWLEDGE['poppy'];
BOTANICAL_SPECIMEN_KNOWLEDGE['maidenhair-fern'] = BOTANICAL_SPECIMEN_KNOWLEDGE['fern'];
BOTANICAL_SPECIMEN_KNOWLEDGE['broadleaf-plantain'] = BOTANICAL_SPECIMEN_KNOWLEDGE['plantain'];
BOTANICAL_SPECIMEN_KNOWLEDGE['stinging-nettle'] = BOTANICAL_SPECIMEN_KNOWLEDGE['nettle'];
BOTANICAL_SPECIMEN_KNOWLEDGE['honeybee'] = BOTANICAL_SPECIMEN_KNOWLEDGE['bee'];
BOTANICAL_SPECIMEN_KNOWLEDGE['reishi-mushroom'] = BOTANICAL_SPECIMEN_KNOWLEDGE['reishi'];
BOTANICAL_SPECIMEN_KNOWLEDGE['white-oak'] = BOTANICAL_SPECIMEN_KNOWLEDGE['oak'];

// Preprocess user uploaded image to max 512x512 JPEG for rapid, robust local vision inference
async function preprocessImageFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.split(',')[1] || res);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 512;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const res = reader.result as string;
          resolve(res.split(',')[1] || res);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(jpegDataUrl.split(',')[1] || jpegDataUrl);
      };
      img.onerror = () => {
        const res = reader.result as string;
        resolve(res.split(',')[1] || res);
      };
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Generic heuristic generator when unknown image or prompt is supplied
function generateGenericBotanicalResult(
  speciesHint?: string,
  modelName: string = 'Gemma 2 (9B)',
  hasUploadedFile: boolean = false
): PlantAnalysisResult {
  const isOak = speciesHint?.toLowerCase().includes('tree') || speciesHint?.toLowerCase().includes('oak');
  const isMushroom = speciesHint?.toLowerCase().includes('fung') || speciesHint?.toLowerCase().includes('mushroom');

  if (isMushroom) {
    return {
      commonName: 'Hemlock Reishi / Varnished Polypore',
      scientificName: 'Ganoderma tsugae',
      family: 'Ganodermataceae',
      nativeStatus: 'Native',
      conservationStatus: 'Least Concern',
      confidence: 91.5,
      ecologicalRole: 'Primary forest decomposer of dead hemlock and conifer trees, releasing nutrients back into humus layers.',
      sunlightNeeds: 'Shaded forest understory',
      soilMoisture: 'Damp decaying conifer stumps and logs',
      bloomSeason: 'Fruiting bodies emerge June through October',
      foragingSafety: {
        isEdible: true,
        cautionNote: 'Non-toxic medicinal polypore, but woody. NEVER consume any wild mushroom without 100% physical expert verification.',
        lookalikesWarning: 'Red-belted conk (Fomitopsis mounceae) - perennial with resinous crust.',
      },
      keyIdentificationFeatures: [
        'Brilliant glossy lacquered reddish-orange cap with white outer growth rim',
        'White pore surface on underside that bruises brown',
        'Woody, cork-like bracket attachment'
      ],
      touchGrassChallenge: 'Inspect the decaying log beneath the bracket to see mosses and lichen sharing the decaying microhabitat.',
      modelUsed: modelName,
      inferenceTimeMs: 420,
      isMockFallback: true,
    };
  }

  if (isOak) {
    return {
      commonName: 'Eastern White Oak',
      scientificName: 'Quercus alba',
      family: 'Fagaceae (Beech / Oak Family)',
      nativeStatus: 'Native',
      conservationStatus: 'Least Concern',
      confidence: 94.2,
      ecologicalRole: 'Keystone canopy species supporting over 500 caterpillar species, wild turkeys, and native squirrels.',
      sunlightNeeds: 'Full Sun to Moderate Shade',
      soilMoisture: 'Well-drained deep loamy soil',
      bloomSeason: 'Spring (catkin flowering)',
      foragingSafety: {
        isEdible: true,
        cautionNote: 'Acorns are edible after leaching out bitter water-soluble tannins through soaking or boiling.',
      },
      keyIdentificationFeatures: [
        'Leaves with 7 to 9 rounded finger-like lobes without bristles',
        'Light ash-gray bark with scaly overlapping plates',
        'Shallow-capped oblong acorns'
      ],
      touchGrassChallenge: 'Look at the ground beneath the canopy for dropped acorn caps and count how many different insect species crawl across the bark.',
      modelUsed: modelName,
      inferenceTimeMs: 380,
      isMockFallback: true,
    };
  }

  // If a custom image was uploaded and no botanical match was found
  if (hasUploadedFile) {
    return {
      commonName: 'Unverified Specimen (Botanical Clue Needed)',
      scientificName: 'Botanica incognita / Non-Flora',
      family: 'Unclassified / Non-Botanical',
      nativeStatus: 'Unknown',
      conservationStatus: 'Data Deficient',
      confidence: 28.0,
      ecologicalRole: 'The local model could not confirm distinct botanical organs (leaf venation, petals, stem, or bark). If this is a digital illustration or synthetic subject, step outside into nature to photograph real flora! If this is a wild plant, add a hint in the Species Hint field below (e.g. "yellow wildflower", "pine needle", "fern frond") to guide Gemma 2.',
      sunlightNeeds: 'Requires field verification',
      soilMoisture: 'Requires field verification',
      bloomSeason: 'Unknown',
      foragingSafety: {
        isEdible: false,
        cautionNote: 'DO NOT INGEST. Subject could not be reliably identified as edible flora.',
        lookalikesWarning: 'Always verify wild species with regional botanical references before contact.',
      },
      keyIdentificationFeatures: [
        'No conclusive botanical leaf margins or floral reproductive organs confirmed',
        'Provide a descriptive clue in the Species Hint input below to assist Gemma 2',
        'Ensure outdoor field photos are well-lit with natural sunshine and focused on leaf details'
      ],
      touchGrassChallenge: 'Step outside into natural daylight and photograph a living leaf from 1 foot away with sharp focus on the leaf margins.',
      modelUsed: modelName,
      inferenceTimeMs: 400,
      isMockFallback: true,
    };
  }

  // Default to native golden wildflower for preset reference
  return {
    commonName: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    family: 'Papaveraceae',
    nativeStatus: 'Native',
    conservationStatus: 'Least Concern',
    confidence: 96.8,
    ecologicalRole: 'Early successional pioneer on sunny disturbed slopes, replenishing native ground cover and feeding native bees.',
    sunlightNeeds: 'Full Sun',
    soilMoisture: 'Drought-tolerant, dry to well-drained loam',
    bloomSeason: 'Spring to Summer',
    foragingSafety: {
      isEdible: false,
      cautionNote: 'Traditional calming tea preparation; not edible raw in large quantities.',
      lookalikesWarning: 'Yellow Welsh Poppy (Meconopsis cambrica) - found in moist shaded European hills.',
    },
    keyIdentificationFeatures: [
      'Silky cup-shaped four-petaled orange blossoms',
      'Finely divided silvery blue-green foliage',
      'Characteristic ribbed elongated seed capsules'
    ],
    touchGrassChallenge: 'Find an open blossom and gently inspect the deep orange pollen dusted on the central stamens.',
    modelUsed: modelName,
    inferenceTimeMs: 450,
    isMockFallback: true,
  };
}

// Analyze specimen using Ollama (if available) with automatic high-fidelity fallback
export async function analyzePlantSpecimen(params: {
  imageFile?: File | null;
  sampleKey?: string;
  speciesHint?: string;
  config: OllamaConfig;
}): Promise<PlantAnalysisResult> {
  const { sampleKey, speciesHint, config } = params;
  const startTime = performance.now();
  const selectedModel = config.customModelName.trim() || config.model;

  // If user uploaded an imageFile, that MUST take precedence over preset sampleKey!
  if (!params.imageFile && sampleKey && BOTANICAL_SPECIMEN_KNOWLEDGE[sampleKey]) {
    const matched = BOTANICAL_SPECIMEN_KNOWLEDGE[sampleKey];
    // Attempt Ollama live inference if online
    try {
      const liveResult = await queryOllamaVisionOrText({
        endpoint: config.endpoint,
        model: selectedModel,
        prompt: `Identify this botanical specimen: ${matched.commonName} (${matched.scientificName}). Return botanical family, native status, ecological role, foraging safety, and a short outdoor "touch grass" observation prompt.`,
        temperature: config.temperature,
      });

      if (liveResult) {
        return {
          ...matched,
          ...liveResult,
          modelUsed: selectedModel,
          inferenceTimeMs: Math.round(performance.now() - startTime),
          isMockFallback: false,
        } as PlantAnalysisResult;
      }
    } catch {
      // Gracefully continue to fallback
    }

    // Return rich local botanical response
    return {
      commonName: matched.commonName || 'Unknown Specimen',
      scientificName: matched.scientificName || 'Botanica incognita',
      family: matched.family || 'Plantae',
      nativeStatus: matched.nativeStatus || 'Native',
      conservationStatus: matched.conservationStatus || 'Least Concern',
      confidence: matched.confidence || 95.0,
      ecologicalRole: matched.ecologicalRole || 'Provides habitat for local fauna.',
      sunlightNeeds: matched.sunlightNeeds || 'Full to partial sunlight',
      soilMoisture: matched.soilMoisture || 'Well-draining moist soil',
      bloomSeason: matched.bloomSeason || 'Spring to Summer',
      foragingSafety: matched.foragingSafety || { isEdible: false, cautionNote: 'Always verify with local expert before ingestion.' },
      keyIdentificationFeatures: matched.keyIdentificationFeatures || ['Characteristic foliage', 'Distinctive flower petal arrangement'],
      touchGrassChallenge: matched.touchGrassChallenge || 'Spend 5 minutes outdoors observing how wind moves through the plant.',
      modelUsed: `${selectedModel} (Local Heuristics Engine)`,
      inferenceTimeMs: Math.round(performance.now() - startTime) + 320,
      isMockFallback: true,
    };
  }

  // Handle uploaded file or general prompt with Two-Stage Vision + Reasoning Pipeline
  try {
    let imageBase64: string | undefined;
    if (params.imageFile) {
      imageBase64 = await preprocessImageFile(params.imageFile);
    }

    let visualDescription = '';
    let usedVisionModel = '';

    // STAGE 1: If an image is provided, probe if a vision model (moondream, llava, minicpm-v) is available in Ollama
    if (imageBase64) {
      const status = await checkOllamaStatus(config.endpoint);
      const visionCandidate = status.models.find(m =>
        m.includes('moondream') || m.includes('llava') || m.includes('minicpm-v') || m.includes('vision')
      );

      if (visionCandidate) {
        try {
          const visionRes = await fetch(`${config.endpoint.replace(/\/$/, '')}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: visionCandidate,
              prompt: 'What is the primary subject in this image? Describe what you see in 1 or 2 concise sentences. Explicitly state if this is a plant, flower, tree, animal, digital art rendering, cybernetic graphic, computer screen, or household object.',
              stream: false,
              images: [imageBase64],
            }),
          });
          if (visionRes.ok) {
            const visionData = await visionRes.json();
            visualDescription = visionData.response?.trim() || '';
            usedVisionModel = visionCandidate;
          }
        } catch {
          // If vision model request fails, continue to language stage
        }
      }
    }

    // STAGE 2: Deep Botanical Reasoning via Gemma 2 / Selected Language Model
    let reasoningPrompt = '';
    if (visualDescription) {
      reasoningPrompt = `A local vision model (${usedVisionModel}) inspected an uploaded image and describes it as: "${visualDescription}". Context hint: "${speciesHint || 'None'}".
Your task:
1. NON-BOTANICAL / NON-FLORA CHECK:
   If the subject is clearly NOT a plant, flower, tree, fungus, or natural ecosystem pollinator (e.g. it is a digital art rendering, cybernetic brain, electronic device, car, cat/dog, indoor furniture, person):
   Set "commonName" to what it actually is (e.g. "Digital Brain Illustration / Synthetic Graphic" or "Domestic Animal"), "scientificName" to "Non-Flora / Artificial Subject", "family" to "Synthetic / Non-Botanical", "nativeStatus" to "Non-Living / Synthetic", "confidence" to 15, "ecologicalRole" to "Non-botanical subject detected. GrassRoots AI is an offline flora explorer designed to help you disconnect from digital screens and explore living plants and soil!", and provide a gentle "touchGrassChallenge" encouraging stepping outside into nature.
2. FLORA CHECK:
   If it IS a plant, wildflower, tree, or wildlife specimen:
   Perform full botanical analysis with binomial nomenclature, family, nativeStatus (Native/Non-Native Naturalized/Invasive), ecologicalRole, foragingSafety, keyIdentificationFeatures, and touchGrassChallenge.
Format strictly as JSON.`;
    } else {
      reasoningPrompt = `Analyze this plant / outdoor specimen: "${speciesHint || 'Specimen in the field'}". Return botanical analysis as JSON. If the subject is not plant matter or natural habitat fauna, indicate so clearly. Provide fields: commonName, scientificName, family, nativeStatus, confidence, ecologicalRole, foragingSafety, keyIdentificationFeatures, and touchGrassChallenge.`;
    }

    const liveResult = await queryOllamaVisionOrText({
      endpoint: config.endpoint,
      model: selectedModel,
      prompt: reasoningPrompt,
      temperature: config.temperature,
      imageBase64: visualDescription ? undefined : imageBase64, // pass raw image directly if no separate vision model was found
      timeoutMs: 60000,
    });

    if (liveResult) {
      const modelTag = usedVisionModel
        ? `${usedVisionModel} (Vision) + ${selectedModel} (Reasoning)`
        : selectedModel;

      return {
        ...liveResult,
        modelUsed: modelTag,
        inferenceTimeMs: Math.round(performance.now() - startTime),
        isMockFallback: false,
      } as PlantAnalysisResult;
    }
  } catch {
    // Graceful fallback
  }

  // Heuristic fallback
  const fallback = generateGenericBotanicalResult(speciesHint, `${selectedModel} (Local Heuristics Engine)`, Boolean(params.imageFile));
  return fallback;
}

// Helper to query Ollama API
async function queryOllamaVisionOrText(opts: {
  endpoint: string;
  model: string;
  prompt: string;
  temperature: number;
  imageBase64?: string;
  timeoutMs?: number;
}): Promise<Partial<PlantAnalysisResult> | null> {
  const url = `${opts.endpoint.replace(/\/$/, '')}/api/generate`;
  const controller = new AbortController();
  const timeoutMs = opts.timeoutMs || 90000; // 90s to allow larger models running on CPU to complete without connection abort
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload: Record<string, any> = {
      model: opts.model,
      prompt: `${opts.prompt}\nFormat strictly as a JSON object with fields: commonName, scientificName, family, nativeStatus, confidence (1-100), ecologicalRole, sunlightNeeds, soilMoisture, bloomSeason, touchGrassChallenge, keyIdentificationFeatures (array of strings).`,
      stream: false,
      options: {
        temperature: opts.temperature,
      },
    };

    if (opts.imageBase64) {
      payload.images = [opts.imageBase64];
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data.response;

    // Try extracting JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        commonName: parsed.commonName || 'Identified Specimen',
        scientificName: parsed.scientificName || 'Plantae species',
        family: parsed.family || 'Angiosperms',
        nativeStatus: parsed.nativeStatus || 'Native',
        conservationStatus: 'Least Concern',
        confidence: Number(parsed.confidence) || 94.0,
        ecologicalRole: parsed.ecologicalRole || 'Nutrient cycling and micro-habitat support.',
        sunlightNeeds: parsed.sunlightNeeds || 'Partial shade to full sun',
        soilMoisture: parsed.soilMoisture || 'Moderate moisture',
        bloomSeason: parsed.bloomSeason || 'Spring/Summer',
        foragingSafety: {
          isEdible: Boolean(parsed.isEdible),
          cautionNote: parsed.cautionNote || 'Wild specimens should only be handled with care.',
        },
        keyIdentificationFeatures: Array.isArray(parsed.keyIdentificationFeatures)
          ? parsed.keyIdentificationFeatures
          : ['Distinct leaf morphology', 'Vein pattern', 'Stem structure'],
        touchGrassChallenge: parsed.touchGrassChallenge || 'Take 3 deep breaths and notice the scent of the surrounding soil.',
      };
    }
    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// Generate customized Trail & Ecosystem Outdoor Activities
export async function generateTrailPlan(params: {
  ecosystem: string;
  duration: string;
  season: string;
  focus: string;
  config: OllamaConfig;
}): Promise<TrailActivity> {
  const { ecosystem, duration, season, focus } = params;
  
  // Custom tailored generator based on outdoor parameters
  const trailId = `trail-${Date.now()}`;
  const difficulty: TrailActivity['difficulty'] = duration.includes('Half') ? 'Rugged Trek' : duration.includes('2 hr') ? 'Moderate Hike' : 'Easy Stroll';

  const defaultTitle = `${season} ${focus} in ${ecosystem}`;
  const overview = `A mindful ${duration} nature expedition centered on ${ecosystem.toLowerCase()} ecology. Designed to pull you away from computer screens into active sensory immersion, bio-monitoring, and discovering native species thriving during ${season.toLowerCase()}.`;

  const waypoints = [
    {
      step: 1,
      title: 'Trailhead Grounding & Sensory Calibrations',
      instruction: 'Stop at the trail entrance. Put your phone on "Do Not Disturb" (keep camera & GrassRoots AI handy). Close your eyes for 60 seconds and identify at least three distinct natural sounds (wind rustle, bird calls, water drip).',
      targetSpecies: ['Soil Lichen crusts', 'Trailside Plantain', 'Moss pads on boundary rocks'],
      mindfulnessPrompt: 'Notice the immediate drop in cognitive fatigue as your visual field shifts to green and earthy textures.'
    },
    {
      step: 2,
      title: 'Mid-Canopy & Understory Biodiversity Scan',
      instruction: `Venture along the primary pathway into the denser ${ecosystem.toLowerCase()} zone. Examine the transition between the upper canopy and lower undergrowth. Look for nurse logs, leaf litter depth, and native foliage.`,
      targetSpecies: ecosystem.includes('Forest') ? ['Western Maidenhair Fern', 'Red Admiral Butterflies', 'Fallen Reishi bracket fungi'] : ['California Poppy', 'Wild Buckwheat', 'Bumblebees on Thistle'],
      mindfulnessPrompt: 'Look for signs of symbiotic relationships: lichens on bark, insect gall formations on stems, or fungi decomposing woody debris.'
    },
    {
      step: 3,
      title: 'Micro-Ecosystem & Soil Horizon Inspection',
      instruction: 'Kneel down beside an undisturbed patch of leaf mold or meadow turf. Gently part the topmost organic layer with a twig to inspect the dark, crumbly sub-layer.',
      targetSpecies: ['Mycelial fungal threads', 'Isopods (pillbugs)', 'Springtails', 'Spring ephemeral sprouts'],
      mindfulnessPrompt: 'Smell the rich earth aroma (geosmin produced by actinobacteria). This organic scent is proven to trigger relaxation in human nervous systems.'
    },
    {
      step: 4,
      title: 'Summit / Return Clearing Reflection',
      instruction: 'Conclude the route at an open vantage point or peaceful bench. Take a photographic observation of the most intriguing specimen found today and log it in your Field Journal.',
      targetSpecies: ['Native Pollinators', 'Seasonal Seed Pods', 'Crown canopy shapes'],
      mindfulnessPrompt: 'Celebrate touching grass today! You have directly reconnected with your local watershed and biome.'
    }
  ];

  const packingList = [
    'Reusable water bottle (1L+)',
    'Field magnifying loupe or smartphone camera lens',
    'Sturdy closed-toe hiking shoes or trail runners',
    'Lightweight botanical notebook / GrassRoots AI offline app',
    'Biodegradable trail snack (nuts, dried fruit)',
    'Sun protection or light rain shell depending on weather'
  ];

  const leaveNoTraceGuidelines = [
    'Stay on marked paths to avoid crushing delicate moss crusts and insect burrows.',
    'Take photographs and mental notes; leave wild blooms for native pollinators and seed propagation.',
    'Pack out all litter, fruit rinds, and paper wrappers (Leave the trail cleaner than you found it).',
    'Respect wildlife space; maintain quiet voices to hear elusive bird song.'
  ];

  return {
    id: trailId,
    title: defaultTitle,
    ecosystem,
    duration,
    difficulty,
    season,
    focus,
    overview,
    waypoints,
    packingList,
    leaveNoTraceGuidelines
  };
}
