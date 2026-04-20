"use client";

import { useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { OPTIONS, TOD_DATA, VISUAL_STYLE_LABELS } from "./constants";
import type { TodKey, VisualStyleKey } from "./types";
import {
	downloadJsonFile,
	downloadTextFile,
	jsonBundleFromSceneJsonStrings,
	jsonStringify,
} from "@/lib/promptJson";
import { parseJsonFromModelOutput } from "@/lib/aiJson";
import { getDefaultModelId, getModelOptions } from "@/lib/modelProviders";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type SeoPack = {
	title: string;
	description: string;
	tags: string[];
	thumbnailPrompt: string;
};

// Lokasi kategori — user pilih satu, AI explore konten di dalamnya
export type LocationCategoryKey =
	| "tropical-rainforest"
	| "temperate-forest"
	| "autumn-forest"
	| "winter-snow-forest"
	| "tropical-hills"
	| "rolling-hills-meadows"
	| "autumn-hills"
	| "snowy-hills"
	| "tropical-mountains"
	| "alpine-mountains"
	| "volcanic-mountains"
	| "arctic-tundra"
	| "siberian-taiga"
	| "famous-lakes"
	| "ocean-open-sea"
	| "tropical-beaches"
	| "dramatic-coastlines"
	| "underwater-tropical"
	| "underwater-deep-ocean"
	| "river-canyon"
	| "waterfall-paradise"
	| "desert-dunes"
	| "cherry-blossom-spring"
	| "lavender-fields"
	| "tulip-fields";

export type RelaxingAiDNA = {
	// Durasi
	totalMinutes: number;
	secPerScene: number;
	totalScenes: number;

	// Identitas video
	videoTheme: string;        // tema bebas / nama proyek

	// Lokasi kategori — utama yang AI explore
	locationCategory: LocationCategoryKey;
	locationSubFocus: string;  // fokus detail, e.g. "Amazon River area, Peru"

	// Style
	visualStyle: VisualStyleKey;
	timeOfDay: TodKey;

	// Drone & Camera — dari OPTIONS (sama dgn Mode 1)
	camMove: string;
	camAngle: string;
	camLens: string;
	camSpeed: string;

	// Preferensi mood & musik
	mood: string;
	musicStyle: string;

	// AI
	aiProvider: string;
	aiModelId: string;
};

// ─── LOCATION CATEGORIES ─────────────────────────────────────────────────────

export const LOCATION_CATEGORIES: Record<LocationCategoryKey, {
	label: string;
	icon: string;
	description: string;
	exampleCountries: string;
	aiInstruction: string;
}> = {
	"tropical-rainforest": {
		label: "Hutan Hujan Tropis",
		icon: "🌴",
		description: "Hutan lebat tropis dengan kanopi tebal, tanaman raksasa, kabut pagi",
		exampleCountries: "Amazon Brazil/Peru/Colombia, Borneo Malaysia/Indonesia, Congo Africa, Costa Rica, Papua New Guinea",
		aiInstruction: "Explore dense tropical rainforest canopy, towering emergent trees, morning mist layers, vibrant green spectrum, exotic birds (toucans, macaws, hornbills), cascading epiphytes, shafts of light through dense canopy, river bends through jungle",
	},
	"temperate-forest": {
		label: "Hutan Temperata (Semi)",
		icon: "🌲",
		description: "Hutan hijau subur di musim semi/panas, Eropa, Amerika Utara, Asia Timur",
		exampleCountries: "Black Forest Germany, Scottish Highlands UK, Białowieża Poland, Olympic Peninsula USA, Shirakawa Japan",
		aiInstruction: "Lush temperate forest in spring/summer, beech and oak canopies, sunlit forest floors with ferns, deer in clearings, crystal streams, dappled light patterns, old-growth moss-covered trunks, wild deer and foxes",
	},
	"autumn-forest": {
		label: "Hutan Gugur (Autumn)",
		icon: "🍂",
		description: "Hutan musim gugur dengan gradasi warna merah, emas, oranye yang spektakuler",
		exampleCountries: "New England USA, Changbai Mountains China/Korea, Nikko Japan, Bavaria Germany, Blue Ridge Mountains USA, Quebec Canada",
		aiInstruction: "Peak autumn foliage explosion, fire-red maples, golden birches, burnt orange oaks, leaves drifting in gentle wind, misty valleys, mirror-calm lakes reflecting foliage, deer in amber light, forest roads carpeted in fallen leaves",
	},
	"winter-snow-forest": {
		label: "Hutan Bersalju (Musim Dingin)",
		icon: "❄️",
		description: "Hutan tertutup salju putih sempurna, pohon pine membungkuk salju",
		exampleCountries: "Lapland Finland/Sweden/Norway, Hokkaido Japan, Rocky Mountains Canada/USA, Swiss Alps, Siberia Russia, Carpathians Romania",
		aiInstruction: "Snow-draped pine forest, perfectly white silent landscape, deer tracks in fresh snow, snow falling from heavy-laden branches, frozen streams, ice crystals on twigs, blue-tinted shadows on white snow, wolf tracks, possibly northern lights at dusk",
	},
	"tropical-hills": {
		label: "Perbukitan Tropis",
		icon: "🌿",
		description: "Bukit-bukit hijau subur tropis dengan kabut, sawah bertingkat, perkebunan teh",
		exampleCountries: "Ubud Bali Indonesia, Cameron Highlands Malaysia, Munnar India, Sapa Vietnam, Nuwara Eliya Sri Lanka, Oromia Ethiopia",
		aiInstruction: "Rolling tropical hills blanketed in vivid greens, rice terraces cascading down slopes, morning mist clinging to valleys, tea plantation geometry, dramatic cloud shadows racing across hillsides, colorful local architecture dotting ridgelines",
	},
	"rolling-hills-meadows": {
		label: "Perbukitan & Padang Rumput",
		icon: "🌾",
		description: "Padang rumput berbukit di musim semi/panas, bunga liar, domba, langit dramatik",
		exampleCountries: "Tuscany Italy, Cotswolds UK, Picos de Europa Spain, Canterbury New Zealand, Palouse USA, Champagne France",
		aiInstruction: "Gently rolling hills in vivid greens and golds, wildflower meadows, grazing sheep and cattle, ancient stone farmhouses, cypress-lined Tuscan roads, patchwork field patterns, dramatic cloud shadows, hay bales in golden fields",
	},
	"autumn-hills": {
		label: "Perbukitan Musim Gugur",
		icon: "🍁",
		description: "Perbukitan saat musim gugur dengan gradasi warna hangat luar biasa",
		exampleCountries: "Appalachian Mountains USA, Dolomites Italy, Alsace France, Transylvania Romania, Hakone Japan, Wye Valley UK",
		aiInstruction: "Hills ablaze with autumn color, warm amber and crimson layers receding to horizon, misty valleys between forested ridges, winding roads through foliage tunnels, golden light raking across hillsides, migrating birds against pale sky",
	},
	"snowy-hills": {
		label: "Perbukitan Bersalju",
		icon: "🏔️",
		description: "Bukit berselimut salju putih bersih dengan desa kecil yang menawan",
		exampleCountries: "Scottish Highlands UK, Auvergne France, Icelandic highlands, Patagonia Argentina/Chile, Norwegian fjord highlands, Vermont USA",
		aiInstruction: "Snow-covered rolling hills, pristine white landscape with dark tree silhouettes, frozen ponds, smoke rising from stone cottages, deer herds on white hillsides, long blue shadows at golden hour, complete silence implied through visual stillness",
	},
	"tropical-mountains": {
		label: "Pegunungan Tropis",
		icon: "⛰️",
		description: "Pegunungan tinggi di daerah tropis dengan vegetasi unik, kabut, air terjun",
		exampleCountries: "Mount Kinabalu Malaysia, Bromo-Tengger Indonesia, Rwenzori Uganda, Andes Colombia/Ecuador, Gunung Rinjani Indonesia, Blue Mountains Jamaica",
		aiInstruction: "Dramatic tropical peaks emerging from clouds, lush vertical vegetation zones, waterfalls cascading from cliffs, cloud forests with bizarre mossy trees, spectacular sunrises above cloud sea, exotic birds of paradise, vivid green valleys",
	},
	"alpine-mountains": {
		label: "Pegunungan Alpin",
		icon: "🏔️",
		description: "Pegunungan bersalju kelas dunia — Alpen, Himalaya, Rocky Mountains, Andes",
		exampleCountries: "Swiss Alps Switzerland, Dolomites Italy, Chamonix France, Banff Canada, Patagonia Chile/Argentina, Fagaras Romania, Norwegian fjords",
		aiInstruction: "Towering alpine peaks with permanent snow caps, mirror-perfect alpine lakes reflecting mountains, dramatic rocky spires, glacier movement, wildflower meadows at treeline, grazing ibex, dramatic weather playing around summits, sunrise alpenglow on rocky peaks",
	},
	"volcanic-mountains": {
		label: "Gunung Berapi & Lava",
		icon: "🌋",
		description: "Lansekap vulkanik dramatis — Hawaii, Islandia, Indonesia, Kili",
		exampleCountries: "Hawaii Big Island USA, Iceland highlands, Mount Etna Sicily, Bromo Indonesia, Kilimanjaro Tanzania, Tongariro New Zealand, Stromboli Italy",
		aiInstruction: "Dramatic volcanic landscapes, black lava fields with vivid green moss, steam vents, volcanic crater lakes, lava flows meeting ocean (Hawaii), lunar volcanic highlands, rainbow valleys in Iceland, surreal black-sand beaches, fire fountains at dusk",
	},
	"arctic-tundra": {
		label: "Arktik & Tundra",
		icon: "🧊",
		description: "Lanskap arktik murni — tundra, es mengambang, aurora borealis spektakuler",
		exampleCountries: "Svalbard Norway, Northern Alaska USA, Greenland, Nunavut Canada, Lapland Scandinavia, Franz Josef Land Russia",
		aiInstruction: "Vast arctic tundra under endless sky, floating sea ice with polar bears, midnight sun golden light in summer, aurora borealis curtains in winter, musk ox herds, arctic fox in white fur, permafrost polygons from above, dramatic icebergs from drone",
	},
	"siberian-taiga": {
		label: "Siberia & Taiga Rusia",
		icon: "🌙",
		description: "Taiga Siberia yang tak terbatas, Baikal beku, suasana mystical dan agung",
		exampleCountries: "Lake Baikal Siberia Russia, Yakutia Russia, Altai Mountains Russia, Karelia Finland/Russia, Kamchatka Russia, Putorana Plateau Russia",
		aiInstruction: "Endless taiga stretching to horizon, frozen Lake Baikal (clearest ice in world), wolf packs in snow, aurora over pine forest, Yakutsk permafrost landscapes, Amur leopard habitat, massive Yenisei river bends from above, wild salmon rivers",
	},
	"famous-lakes": {
		label: "Danau Spot Terbaik Dunia",
		icon: "🏞️",
		description: "Danau-danau paling fotogenik di dunia — Plitvice, Baikal, Atitlan, Milford",
		exampleCountries: "Plitvice Lakes Croatia, Lake Bled Slovenia, Milford Sound NZ, Lake Louise Canada, Atitlan Guatemala, Hallstatt Austria, Braies Italy, Tekapo NZ",
		aiInstruction: "World's most photogenic lakes, crystal-clear turquoise to deep emerald water, surrounding mountain reflections perfectly mirrored, waterfalls feeding the lake, swans and ducks, wooden boathouses, dramatic cliffs plunging to water, impossible clarity to the bottom",
	},
	"ocean-open-sea": {
		label: "Samudera & Laut Terbuka",
		icon: "🌊",
		description: "Lautan luas dari perspektif drone — wave patterns, warna laut, mega-waves",
		exampleCountries: "North Atlantic near Iceland/Faroe Islands, Southern Ocean, Pacific off Hawaii, Mediterranean Sea, Norwegian Sea, Bay of Biscay, Cape Horn Chile",
		aiInstruction: "Infinite ocean expanse from low drone altitude, deep navy blue swells with white foam crests, dramatic wave patterns from above, pods of whales breaching, seabird flocks riding thermals, distant storm systems, sun glinting on water surface, pure scale and power",
	},
	"tropical-beaches": {
		label: "Pantai Tropis Terbaik",
		icon: "🏖️",
		description: "Pantai surgawi tropis — Maladewa, Raja Ampat, Palawan, Seychelles",
		exampleCountries: "Maldives, Raja Ampat Indonesia, Palawan Philippines, Seychelles, Bora Bora French Polynesia, Zanzibar Tanzania, Turks & Caicos, Similan Islands Thailand",
		aiInstruction: "Paradise tropical beaches with surreal turquoise lagoons, pure white sand, overwater bungalows, coral visible through crystal-clear shallow water, gentle waves on pristine sand, sea turtles, tropical fish schools in shallows, perfect palm silhouettes at sunset, drone above reef patterns",
	},
	"dramatic-coastlines": {
		label: "Pantai Dramatis & Tebing",
		icon: "⛰️",
		description: "Coastline dramatis — tebing tinggi, batu karang, ombak besar, Eropa & dunia",
		exampleCountries: "Cliffs of Moher Ireland, Faroe Islands, Amalfi Coast Italy, Big Sur California USA, Ha Long Bay Vietnam, Jurassic Coast UK, Ponta da Piedade Portugal",
		aiInstruction: "Dramatic sea cliffs with crashing waves, spray shooting up cliff faces, sea caves and arches, nesting seabirds on ledges, turquoise water swirling in rock pools, lighthouse on rocky headland, drone perspective showing cliff height and scale, golden light on ochre rock",
	},
	"underwater-tropical": {
		label: "Bawah Laut Tropis",
		icon: "🐠",
		description: "Dunia bawah laut tropis — terumbu karang, ikan warna-warni, mantra ray",
		exampleCountries: "Great Barrier Reef Australia, Coral Triangle Indonesia/Malaysia/Philippines, Red Sea Egypt, Palau, Cocos Island Costa Rica, Tubbataha Philippines",
		aiInstruction: "Crystal-clear tropical underwater world, vibrant coral garden in rainbow colors, schools of thousands of fish, manta rays gliding in blue water, sea turtles, whale sharks, dramatic light rays penetrating from surface, nudibranch details, giant clam, pristine coral columns",
	},
	"underwater-deep-ocean": {
		label: "Bawah Laut Dalam & Mystical",
		icon: "🌀",
		description: "Kedalaman laut yang mystical — blue hole, wall dive, bioluminescence",
		exampleCountries: "Great Blue Hole Belize, Dean's Blue Hole Bahamas, Blue Hole Dahab Egypt, Jellyfish Lake Palau, Cenotes Mexico Yucatan, Cocos Island, Azores Portugal",
		aiInstruction: "Mysterious deep water environments, dramatic blue holes with shafts of light, cenote underwater caves with crystal water, bioluminescent plankton at night, hammerhead shark schools, deep wall dives with visibility to darkness below, ethereal jellyfish in blue water column",
	},
	"river-canyon": {
		label: "Sungai & Ngarai / Canyon",
		icon: "🏜️",
		description: "Canyon dramatis, sungai meander, gorges spektakuler dari atas",
		exampleCountries: "Grand Canyon USA, Antelope Canyon USA, Zhangjiajie China, Colca Canyon Peru, Gorges du Verdon France, Rhine Gorge Germany, Tiger Leaping Gorge China",
		aiInstruction: "Dramatic canyon landscapes from drone altitude, river snaking through sheer canyon walls thousands of feet below, layer-cake geology in warm reds and golds, narrow slot canyons with light beams, waterfall-fed side canyons, condors riding thermals, ancient pueblos on cliff ledges",
	},
	"waterfall-paradise": {
		label: "Air Terjun Spektakuler",
		icon: "💧",
		description: "Air terjun paling megah dan indah di dunia",
		exampleCountries: "Iguazu Falls Brazil/Argentina, Angel Falls Venezuela, Victoria Falls Zambia/Zimbabwe, Niagara Canada/USA, Plitvice Croatia, Skógafoss Iceland, Milford Sound NZ",
		aiInstruction: "Majestic waterfall systems, rainbow in mist, drone approach from above showing scale, multiple tiers of cascades, surrounding lush vegetation, boats dwarfed by water volume, sunrise light on white water, slow-motion effect of falling water visible, green pools at base",
	},
	"desert-dunes": {
		label: "Gurun & Bukit Pasir",
		icon: "🏜️",
		description: "Gurun pasir artistik — Sahara, Namib, Gobi, Atacama dari drone",
		exampleCountries: "Sahara Morocco/Algeria, Namib Desert Namibia, Rub' al Khali Arabia, Wadi Rum Jordan, Atacama Chile, Dasht-e Kavir Iran, White Desert Egypt, Gobi Mongolia/China",
		aiInstruction: "Endless sculptural sand dunes with perfect wind-carved ridgelines, drone shadow visible on sand, camels in procession, dramatic sunrise/sunset rendering dunes in deep oranges and crimsons, geometric dune shadow patterns from above, desert mirages in heat shimmer, Milky Way over silent dunes at night",
	},
	"cherry-blossom-spring": {
		label: "Musim Semi & Bunga Sakura",
		icon: "🌸",
		description: "Bunga sakura dan musim semi yang sangat indah — Jepang, Korea, Eropa",
		exampleCountries: "Yoshino Japan, Kyoto Philosopher's Path Japan, Jinhae South Korea, Washington DC USA, Bonn Germany, Dordrecht Netherlands, Swiss Alps spring",
		aiInstruction: "Ethereal cherry blossom trees in full pink bloom, petals drifting through air in slow motion, tree-lined rivers with pink reflection, drone above blossoming canopy like pink cloud, contrast with distant snow peaks, young couples under trees, shrine paths lined with sakura, petals on calm water",
	},
	"lavender-fields": {
		label: "Ladang Lavender & Bunga",
		icon: "💜",
		description: "Ladang bunga yang memukau — lavender Provence, tulip Belanda, poppy",
		exampleCountries: "Provence France, Valensole France, Keukenhof Netherlands (tulips), Sault France, Norfolk UK (lavender), Gers France, Murcia Spain (citrus blossom)",
		aiInstruction: "Purple lavender fields stretching to horizon in perfect geometric rows, golden light raking across rows casting long shadows, bees hovering over blooms, old stone farmhouse at field's edge, hot air balloons above fields, contrast with bright blue Provençal sky, drone above showing vast field patterns",
	},
	"tulip-fields": {
		label: "Ladang Tulip & Bunga Warna-warni",
		icon: "🌷",
		description: "Ladang bunga berwarna terang dari atas — tulip, bunga matahari, canola",
		exampleCountries: "Keukenhof Netherlands, Bollenstreek Netherlands, Skagit Valley USA, Lisse Netherlands, Tuscany poppy fields Italy, Oklahoma wildflowers USA, Canola fields China",
		aiInstruction: "Spectacular flower fields in vivid geometric color blocks, drone revealing vast patchwork of reds, yellows, pinks, purples, traditional Dutch windmills in flower landscapes, cyclists on narrow paths between color bands, canal reflections of flower fields, abstract patterns from directly above",
	},
};

// Grouped for UI display
export const LOCATION_CATEGORY_GROUPS: {
	label: string;
	icon: string;
	keys: LocationCategoryKey[];
}[] = [
		{
			label: "Hutan",
			icon: "🌲",
			keys: ["tropical-rainforest", "temperate-forest", "autumn-forest", "winter-snow-forest"],
		},
		{
			label: "Perbukitan",
			icon: "⛰️",
			keys: ["tropical-hills", "rolling-hills-meadows", "autumn-hills", "snowy-hills"],
		},
		{
			label: "Pegunungan",
			icon: "🏔️",
			keys: ["tropical-mountains", "alpine-mountains", "volcanic-mountains"],
		},
		{
			label: "Arktik & Ekstrem",
			icon: "🧊",
			keys: ["arctic-tundra", "siberian-taiga"],
		},
		{
			label: "Danau & Sungai",
			icon: "💧",
			keys: ["famous-lakes", "river-canyon", "waterfall-paradise"],
		},
		{
			label: "Laut & Pantai",
			icon: "🌊",
			keys: ["ocean-open-sea", "tropical-beaches", "dramatic-coastlines"],
		},
		{
			label: "Bawah Laut",
			icon: "🐠",
			keys: ["underwater-tropical", "underwater-deep-ocean"],
		},
		{
			label: "Padang & Gurun",
			icon: "🌾",
			keys: ["desert-dunes"],
		},
		{
			label: "Musim & Bunga",
			icon: "🌸",
			keys: ["cherry-blossom-spring", "lavender-fields", "tulip-fields"],
		},
	];

// ─── MOOD & MUSIC OPTIONS ─────────────────────────────────────────────────────

export const MOOD_OPTIONS = [
	"deeply peaceful — serene, meditative, stress-releasing",
	"uplifting and joyful — bright, positive, feel-good warmth",
	"nostalgic and reflective — bittersweet longing, memories",
	"awe-inspiring grandeur — scale and majesty, breathtaking",
	"mysterious and ethereal — dreamlike, otherworldly beauty",
	"romantic and soft — soft focus, gentle and tender",
	"energizing and fresh — crisp, alive, morning vitality",
];

export const MUSIC_STYLE_OPTIONS = [
	"slow atmospheric ambient — floating pads, minimal melody",
	"gentle acoustic — fingerpicking guitar or soft piano",
	"orchestral swell — builds toward emotional crescendo",
	"nature sound blend — music mixed with real ambient nature audio",
	"pure instrumental calm — no beat, floating melody only",
	"soft world music — ethnic instruments, global relaxing",
	"classical inspired — neoclassical meets modern ambient",
];

// ─── DEFAULT DNA ──────────────────────────────────────────────────────────────

export const DEFAULT_RELAXING_AI_DNA: RelaxingAiDNA = {
	totalMinutes: 2,
	secPerScene: 10,
	totalScenes: 12,
	videoTheme: "",
	locationCategory: "alpine-mountains",
	locationSubFocus: "",
	visualStyle: "cinematic-realistic",
	timeOfDay: "morning",
	camMove: OPTIONS.camMove[0],
	camAngle: OPTIONS.camAngle[0],
	camLens: OPTIONS.camLens[0],
	camSpeed: OPTIONS.camSpeed[0],
	mood: MOOD_OPTIONS[0],
	musicStyle: MUSIC_STYLE_OPTIONS[0],
	aiProvider: "CLAUDE",
	aiModelId: "claude-sonnet-4-20250514",
};

// ─── MMSS ─────────────────────────────────────────────────────────────────────

function mmss(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────

function buildAIUserPrompt(dna: RelaxingAiDNA): string {
	const cat = LOCATION_CATEGORIES[dna.locationCategory];
	const tod = TOD_DATA[dna.timeOfDay];
	const styleLabel = VISUAL_STYLE_LABELS[dna.visualStyle] ?? dna.visualStyle;
	const totalSec = dna.totalMinutes * 60;

	return `Generate a ${dna.totalScenes}-scene relaxing nature drone music video AI prompt bundle as JSON.

VIDEO CONCEPT:
- Title theme: "${dna.videoTheme || `${cat.label} — Relaxing Nature 4K`}"
- Location category: ${cat.label} (${cat.icon})
- Location examples: ${cat.exampleCountries}
- Sub-focus (if specified): ${dna.locationSubFocus || "AI choice — pick the most visually stunning specific spot"}
- Total duration: ${mmss(totalSec)} (${dna.totalScenes} scenes × ${dna.secPerScene}s each)

VISUAL SPECS:
- Visual style: ${styleLabel}
- Time of day: ${tod?.label ?? dna.timeOfDay} — ${tod?.lighting ?? ""}
- Primary mood: ${dna.mood}
- Music style: ${dna.musicStyle}
- Aspect ratio: 16:9 (YouTube landscape)
- Quality: 4K ultra-realistic photorealistic drone footage

DRONE & CAMERA (USER-SPECIFIED — use these consistently as the default, vary slightly scene to scene):
- Drone movement default: ${dna.camMove}
- Camera angle default: ${dna.camAngle}
- Lens default: ${dna.camLens}
- Speed default: ${dna.camSpeed}
Note: vary camera angle and movement naturally across scenes — don't use identical camera work every scene. Use user-specified as the "home base" style.

AI CREATIVE DIRECTION FOR EACH SCENE — explore these dimensions naturally:
- 🏔️ Nature View: Spot type, water features, vegetation, terrain specifics
- 🌍 Location: Specific country/region/landmark to explore within category "${cat.label}"
- 🦋 Animals: Birds, land animals, insects, aquatic life native to this location
- 🌱 Visuals: Composition, flowers/flora, rocks/geology, sky detail
- ☀️ Lighting: Natural light at ${tod?.label ?? dna.timeOfDay}, FX, color temperature, shadow play
- ✨ Elements: Wind/movement, human elements (if any — keep minimal), atmosphere, seasonal cues
- 🎨 Style & Mood: Color grade, quality, music sync description
- 🚁 Drone: Vary movement and angle naturally while keeping "${dna.camSpeed}" speed feel

LOCATION EXPLORATION INSTRUCTION:
${cat.aiInstruction}
${dna.locationSubFocus ? `SPECIFIC FOCUS: ${dna.locationSubFocus}` : ""}

CRITICAL CONTINUITY RULES:
1. Every scene (except scene 1) MUST start deliverable.prompt with: "Continuing from scene [N-1] — [one sentence describing what was just shown]..."
2. Stay within the same geographic region/landscape type throughout — no sudden country jumps
3. Natural progression: start wide establishing, move through different aspects of location, end with epic or intimate final shot
4. Time of day: follow a natural arc if multi-scene — slight progression is fine (morning → midday), but no abrupt day-night jumps
5. Consistent visual language: same color palette, same quality level throughout
6. No jarring cuts — end frame of each scene should dissolve naturally into the start of the next

OUTPUT JSON STRUCTURE (STRICT):
{
  "schema": "aiVideoPrompt.v1",
  "tool": "relaxing-music-video-clip",
  "locationCategory": "${dna.locationCategory}",
  "continuityAnchor": "Location: ${cat.label} | Style: ${styleLabel} | Mood: ${dna.mood} | TOD: ${tod?.label ?? dna.timeOfDay}",
  "seo": {
    "title": "...",
    "description": "...",
    "tags": ["..."],
    "thumbnailPrompt": "..."
  },
  "scenes": [
    {
      "id": 1,
      "sceneNumber": "Scene 1",
      "timeLabel": "0:00–${mmss(dna.secPerScene)}",
      "locationSpot": "...",
      "deliverable": {
        "prompt": "...",
        "negativePrompt": "text overlay, watermark, logo, people in foreground, CGI artifacts, sudden location change, inconsistent color grade"
      }
    }
  ]
}

RULES:
- "seo" exists ONLY ONCE at root — never inside scenes
- scenes[] items: ONLY id, sceneNumber, timeLabel, locationSpot, deliverable
- "locationSpot": one line describing the specific spot within ${cat.label} for this scene
- deliverable.prompt for scenes 2+ MUST start with "Continuing from scene [N-1] — ..."
- Generate EXACTLY ${dna.totalScenes} scenes, numbered 1 to ${dna.totalScenes}

SEO RULES:
- seo.title: YouTube-optimized in Indonesian OR English (whichever fits best for international audience), 50–65 chars, include "${cat.label}", nature/relaxing/4K keywords, strong hook
- seo.description: Indonesian, min 900 chars, hook in first 2 lines describing the visual journey, scene-by-scene narrative summary, relaxation benefits, 8–10 hashtags including #relaxing #4K #naturevideo #meditation relevant ones
- seo.tags: EXACTLY 30 tags — broad (relaxing, nature, 4k drone) + niche (${cat.label}, specific countries) + long-tail (sleep music nature, stress relief video, etc.)
- seo.thumbnailPrompt: specific AI image generation prompt — dramatic hero landscape from ${cat.label}, ${styleLabel} style, ${dna.mood} mood, ${tod?.label ?? dna.timeOfDay} lighting, 3-4 word text overlay like "4K RELAXING [Category]", composition details

Output ONLY valid JSON. No markdown fences, no explanation.`;
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────

export default function useRelaxingAiGenerator() {
	const { toast, show: showToast } = useToast();

	const [dna, setDnaState] = useState<RelaxingAiDNA>(DEFAULT_RELAXING_AI_DNA);
	const [dnaLocked, setDnaLocked] = useState(false);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [isGeneratingAI, setIsGeneratingAI] = useState(false);
	const [seoPack, setSeoPack] = useState<SeoPack | null>(null);

	function setDna(updates: Partial<RelaxingAiDNA>) {
		setDnaState((prev) => {
			const next = { ...prev, ...updates };
			if (updates.totalMinutes !== undefined || updates.secPerScene !== undefined) {
				next.totalScenes = Math.max(
					2,
					Math.floor((next.totalMinutes * 60) / Math.max(1, next.secPerScene))
				);
			}
			return next;
		});
	}

	function lockDNA() {
		setDnaLocked(true);
		showToast(`🔒 DNA terkunci! ${dna.totalScenes} scene siap di-generate.`);
	}

	function unlockDNA() {
		setDnaLocked(false);
		setAllPrompts([]);
		setShowAllPrompts(false);
		setSeoPack(null);
		showToast("🔓 DNA dibuka untuk diedit.");
	}

	async function generateAllWithAI() {
		if (!dnaLocked) { showToast("⚠ Kunci DNA dulu!"); return; }
		setIsGeneratingAI(true);
		setSeoPack(null);
		setAllPrompts([]);

		try {
			const systemPrompt =
				"You are a world-class nature drone cinematographer and AI video prompt engineer. " +
				"You create hyper-detailed, visually stunning relaxing nature prompts with perfect scene continuity. " +
				"Output MUST be valid JSON only — no markdown fences, no trailing commas, no comments.";

			const userPrompt = buildAIUserPrompt(dna);

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: dna.aiProvider,
					modelId: dna.aiModelId,
					maxTokens: 14000,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "AI request failed");

			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as {
				scenes?: unknown[];
				seo?: SeoPack;
			};

			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== dna.totalScenes) {
				throw new Error(
					`AI scenes tidak sesuai. Dapat ${bundle.scenes.length}, harus ${dna.totalScenes}`
				);
			}

			if (bundle.seo) setSeoPack(bundle.seo);

			const { seo: _seo, ...bundleWithoutSeo } = bundle as Record<string, unknown>;
			const prompts = (bundle.scenes as unknown[]).map((scene) =>
				jsonStringify({ ...bundleWithoutSeo, scenes: [scene] })
			);

			setAllPrompts(prompts);
			setShowAllPrompts(true);
			showToast(`🤖 AI: ${dna.totalScenes} prompt + SEO pack berhasil!`);
		} catch (e) {
			showToast(`⚠ ${e instanceof Error ? e.message : "Unknown error"}`);
		} finally {
			setIsGeneratingAI(false);
		}
	}

	// ─── COPY / DOWNLOAD ─────────────────────────────────────────────────────────

	function copyAll() {
		if (!allPrompts.length) return;
		navigator.clipboard.writeText(jsonBundleFromSceneJsonStrings(allPrompts));
		showToast(`📋 Semua ${dna.totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		if (!allPrompts.length) return;
		downloadJsonFile(`relaxing-ai-${Date.now()}.json`, jsonBundleFromSceneJsonStrings(allPrompts));
		showToast("💾 JSON bundle didownload!");
	}

	function copySeoTitle() {
		if (!seoPack?.title) return;
		navigator.clipboard.writeText(seoPack.title);
		showToast("📋 Judul SEO tersalin!");
	}

	function copySeoDescription() {
		if (!seoPack?.description) return;
		navigator.clipboard.writeText(seoPack.description);
		showToast("📋 Deskripsi SEO tersalin!");
	}

	function copySeoTags() {
		if (!seoPack?.tags?.length) return;
		navigator.clipboard.writeText(seoPack.tags.join(", "));
		showToast("📋 Tags SEO tersalin!");
	}

	function copySeoThumbnailPrompt() {
		if (!seoPack?.thumbnailPrompt) return;
		navigator.clipboard.writeText(seoPack.thumbnailPrompt);
		showToast("📋 Prompt thumbnail tersalin!");
	}

	function downloadSeoPackJson() {
		if (!seoPack) return;
		downloadJsonFile(
			`seo-pack-relaxing-ai-${Date.now()}.json`,
			JSON.stringify({ schema: "aiSeoPack.v1", tool: "relaxing-music-video-clip", mode: "ai", locationCategory: dna.locationCategory, seo: seoPack }, null, 2)
		);
		showToast("💾 SEO pack .json didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		const text = [
			"SEO PACK (AI — Relaxing Music Video Mode 2)",
			`Location: ${dna.locationCategory} | Style: ${dna.visualStyle}`,
			"",
			"TITLE:", seoPack.title,
			"",
			"DESCRIPTION:", seoPack.description,
			"",
			"TAGS (30):", seoPack.tags.join(", "),
			"",
			"THUMBNAIL PROMPT:", seoPack.thumbnailPrompt,
		].join("\n");
		downloadTextFile(`seo-pack-relaxing-ai-${Date.now()}.txt`, text);
		showToast("💾 SEO pack .txt didownload!");
	}

	const totalScenes = Math.max(2, Math.floor((dna.totalMinutes * 60) / Math.max(1, dna.secPerScene)));
	const progressPct = allPrompts.length > 0 ? Math.round((allPrompts.length / totalScenes) * 100) : 0;

	return {
		dna, setDna, dnaLocked, lockDNA, unlockDNA,
		isGeneratingAI, generateAllWithAI,
		allPrompts, showAllPrompts, setShowAllPrompts,
		totalScenes, progressPct,
		copyAll, downloadAllJson,
		seoPack,
		copySeoTitle, copySeoDescription, copySeoTags, copySeoThumbnailPrompt,
		downloadSeoPackJson, downloadSeoPackTxt,
		toast, showToast,
	};
}
