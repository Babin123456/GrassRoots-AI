import type { FieldGuideSpecies } from '../types';

export const FIELD_GUIDE_SPECIES: FieldGuideSpecies[] = [
  {
    id: 'dandelion',
    commonName: 'Common Dandelion',
    scientificName: 'Taraxacum officinale',
    category: 'Medicinal / Herb',
    nativeRegion: 'Eurasia (Naturalized Worldwide)',
    bloomTime: 'Early Spring to Late Autumn',
    ecologicalFunction: 'Crucial early nectar source for solitary bees, hoverflies, and honeybees coming out of hibernation. Deep taproot aerates compacted soil and brings up subsoil minerals.',
    identificationTips: [
      'Hollow, unbranched flower stem exuding milky latex when snapped',
      'Rosette of deeply toothed, lance-shaped leaves ("dent-de-lion" or lion tooth)',
      'Bright golden composite flower head closing at night and before rain'
    ],
    edibilityNotice: 'Edible: All parts are edible (leaves in salads, flowers for tea/fritters, roasted taproot as coffee alternative). Always avoid roadsides treated with chemicals.',
    isEdible: true,
    isInvasive: false,
    badge: 'Vital Early Pollinator',
    imageUrl: '/specimens/dandelion.webp'
  },
  {
    id: 'california-poppy',
    commonName: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    category: 'Wildflower',
    nativeRegion: 'Western North America (Chaparral & Meadows)',
    bloomTime: 'February to September',
    ecologicalFunction: 'Provides abundant pollen for bumblebees, sweat bees, and beetles. Thrives in drought-tolerant native pollinator corridors.',
    identificationTips: [
      'Silky, four-petaled cup-shaped flowers varying from deep orange to canary yellow',
      'Finely divided, blue-green, lacy foliage',
      'Elongated ribbed seed capsules that burst open to fling seeds'
    ],
    edibilityNotice: 'Mild Medicinal: Not commonly eaten as food; traditionally brewed by indigenous peoples for calming tea. Contains mild isoquinoline alkaloids.',
    isEdible: false,
    isInvasive: false,
    badge: 'Native Drought Champion',
    imageUrl: '/specimens/poppy.webp'
  },
  {
    id: 'maidenhair-fern',
    commonName: 'Western Maidenhair Fern',
    scientificName: 'Adiantum aleuticum',
    category: 'Fern & Moss',
    nativeRegion: 'Temperate North America (Moist Canyons & Stream Banks)',
    bloomTime: 'Non-flowering (Spores mature in Summer)',
    ecologicalFunction: 'Prevents riverbank erosion, retains damp microclimates for salamanders, tree frogs, and humidity-loving forest floor insects.',
    identificationTips: [
      'Distinctive shiny black or dark ebony wire-like leaf stalks (stipes)',
      'Delicate, fan-shaped leaflets that bead water ("adiantos" = unwetted)',
      'Fronds arranged in horizontal, graceful cascading arches'
    ],
    edibilityNotice: 'Non-Edible: Not consumed. Important indicator species for pristine freshwater seepages.',
    isEdible: false,
    isInvasive: false,
    badge: 'Riparian Bio-Indicator',
    imageUrl: '/specimens/fern.webp'
  },
  {
    id: 'broadleaf-plantain',
    commonName: 'Broadleaf Plantain',
    scientificName: 'Plantago major',
    category: 'Medicinal / Herb',
    nativeRegion: 'Eurasia (Cosmopolitan Naturalized)',
    bloomTime: 'May to October',
    ecologicalFunction: 'Soil stabilizer on disturbed trail margins; seeds eaten by goldfinches and native sparrows in autumn.',
    identificationTips: [
      'Wide, oval-shaped leaves with 5 to 7 prominent parallel fibrous veins',
      'Dense upright cylindrical spikes of tiny greenish flowers',
      'Tough stringy fibers when leaf petioles are snapped'
    ],
    edibilityNotice: 'Edible & Soothing: Fresh bruised leaf provides immediate cooling poultice for bee stings, mosquito bites, and nettle rash (nature\'s bandaid). Young leaves edible cooked.',
    isEdible: true,
    isInvasive: false,
    badge: 'Trailside First-Aid Herb',
    imageUrl: '/specimens/plantain.webp'
  },
  {
    id: 'stinging-nettle',
    commonName: 'Stinging Nettle',
    scientificName: 'Urtica dioica',
    category: 'Medicinal / Herb',
    nativeRegion: 'North America, Europe, Asia',
    bloomTime: 'June to September',
    ecologicalFunction: 'Primary caterpillar host plant for Red Admiral, Peacock, and Comma butterflies. Hyper-accumulator of rich iron and nitrogen in soil.',
    identificationTips: [
      'Opposite serrated heart-shaped leaves covered in hollow hypodermic silica stinging hairs (trichomes)',
      'Square stems with bristly hairs',
      'Greenish drooping flower clusters in leaf axils'
    ],
    edibilityNotice: 'Nutritional Powerhouse: CAUTION! Stings raw. Once blanched in boiling water for 90 seconds or dried, stinging trichomes neutralize completely; delicious high-protein, iron-rich soup/tea.',
    isEdible: true,
    isInvasive: false,
    badge: 'Butterfly Host Species',
    imageUrl: '/specimens/nettle.webp'
  },
  {
    id: 'honeybee',
    commonName: 'Western Honeybee',
    scientificName: 'Apis mellifera',
    category: 'Native Pollinator',
    nativeRegion: 'Europe, Western Asia, Africa (Managed Worldwide)',
    bloomTime: 'Active above 12°C (Spring through Autumn)',
    ecologicalFunction: 'Key agricultural and orchard pollinator with complex waggle-dance communication; works in tandem with wild solitary bees.',
    identificationTips: [
      'Golden-amber and black banded abdomen with fine downy hairs',
      'Pollen basket (corbicula) on hind legs frequently loaded with colored pollen pellets',
      'Two pairs of clear membranous wings'
    ],
    edibilityNotice: 'Fauna: Produces wildflower honey and propolis; protect pollinator corridors from neonicotinoid pesticides.',
    isEdible: false,
    isInvasive: false,
    badge: 'Keystone Pollinator',
    imageUrl: '/specimens/bee.webp'
  },
  {
    id: 'reishi-mushroom',
    commonName: 'Lingzhi / Hemlock Reishi',
    scientificName: 'Ganoderma tsugae / lucidum',
    category: 'Fungi',
    nativeRegion: 'Temperate Conifer & Hardwood Forests',
    bloomTime: 'Summer to Late Autumn',
    ecologicalFunction: 'Saprophytic white-rot decomposer breaking down dying hemlock and conifer trees, cycling carbon back into forest mycorrhizal networks.',
    identificationTips: [
      'Shiny lacquered, varnished kidney-shaped cap with white-to-yellow growing margin and mahogany center',
      'Pore surface beneath cap is white, turning brown when bruised (no gills)',
      'Cork-like woody texture, persists long after drying'
    ],
    edibilityNotice: 'Medicinal Fungus: Too woody to chew; traditionally sliced and double-extracted as an immune-modulating tea or tincture. Never consume wild mushrooms without expert verification.',
    isEdible: true,
    isInvasive: false,
    badge: 'Forest Floor Decomposer',
    imageUrl: '/specimens/reishi.webp'
  },
  {
    id: 'white-oak',
    commonName: 'Eastern White Oak',
    scientificName: 'Quercus alba',
    category: 'Tree & Shrub',
    nativeRegion: 'Eastern & Central North America',
    bloomTime: 'Spring (Wind-pollinated catkins)',
    ecologicalFunction: 'Supports over 534 species of native caterpillars, birds, wood-boring beetles, and mammals—the single highest biodiversity host tree in temperate biomes.',
    identificationTips: [
      'Leaves with 7 to 9 rounded finger-like lobes without bristle tips',
      'Ash-gray bark peeling in flaky vertical strips on upper trunk',
      'Sweet low-tannin acorns with shallow warty cups'
    ],
    edibilityNotice: 'Acorns are traditionally leached in water to remove tannins, then ground into nutrient-dense acorn flour for breads and porridge.',
    isEdible: true,
    isInvasive: false,
    badge: 'Biodiversity Cornerstone (500+ Species)',
    imageUrl: '/specimens/oak.webp'
  }
];
