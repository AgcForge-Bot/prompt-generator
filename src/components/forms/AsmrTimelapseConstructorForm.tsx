"use client";

import { useMemo, useState } from "react";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import useToast from "@/components/forms/forest-build/useToast";

const SCENE_TYPES = {
	restoration: {
		assess: "Initial Assessment",
		clear: "Clearing & Demo",
		foundation: "Foundation Repair",
		masonry: "Masonry Restoration",
		roofing: "Roof Restoration",
		services: "Services & MEP",
		interior: "Interior Rebuild",
		finishing: "Finishing Details",
		reveal: "Final Reveal",
	},
	construction: {
		groundwork: "Groundwork & Excavation",
		foundation: "Foundation Pour",
		framing: "Structural Framing",
		roofing: "Roofing & Weathertight",
		services: "Services & MEP",
		envelope: "Building Envelope",
		interior: "Interior Fit-Out",
		finishing: "Finishing & Detail",
		reveal: "Completion & Reveal",
	},
};

const SCENE_ORDER_REST = [
	"assess",
	"clear",
	"foundation",
	"masonry",
	"masonry",
	"roofing",
	"services",
	"interior",
	"interior",
	"finishing",
	"finishing",
	"reveal",
];
const SCENE_ORDER_CONS = [
	"groundwork",
	"groundwork",
	"foundation",
	"framing",
	"framing",
	"roofing",
	"services",
	"envelope",
	"interior",
	"interior",
	"finishing",
	"reveal",
];

const RANDOM_IDS = {
	timelapse: ["tl-mode", "tl-compression", "tl-progress", "tl-sky"],
	equipment: ["eq-main", "eq-support", "eq-hand", "eq-motion"],
	narration: ["nar-freq", "nar-style", "nar-line", "nar-audio"],
	lighting: ["light-main", "light-fx", "light-color", "light-shadow"],
	asmr: ["asmr-music", "asmr-layer", "asmr-ambient", "asmr-moment"],
	camera: [
		"cam-angle",
		"cam-move",
		"cam-mood",
		"cam-quality",
		"cam-grade",
		"cam-lens",
	],
};

// ── TOD DATA ─────────────────────────────────────────────────
const TOD_DATA = {
	morning: {
		label: "MORNING (Pagi)",
		timeRange: "04:30–09:00",
		hint: "🌅 Pagi — Warm golden sunrise light, long soft shadows, dew on materials, mist lifting, birds singing, workers arriving.",
		lighting:
			"warm golden sunrise — low-angle soft raking light, long shadow stretch, sky from deep orange to pale blue",
		lightFx:
			"mist and dew catching first light — materials glowing warm, condensation on metal surfaces",
		lightColor:
			"warm amber and rose gold — sunrise spectrum, cool blue shadows",
		lightShadow: "long soft morning shadows gradually shortening as sun rises",
		sky: "sunrise progression — sky shifting from deep amber through rose to pale morning blue",
		ambientSound:
			"dawn chorus birds — early morning natural awakening, cool breeze, distant rooster",
		equipMotion:
			"workers arriving, tools being prepared — machines starting up, first movements of the day",
		narHint:
			"Morning briefing tone — day plan, safety check, assigning zones to crew",
	},
	noon: {
		label: "NOON (Siang)",
		timeRange: "09:00–15:00",
		hint: "☀️ Siang — Harsh midday sun, strong contrast shadows, high visibility construction detail, workers at peak activity.",
		lighting:
			"harsh midday sun — overhead high-angle, strong direct illumination, deep under-structure shadows",
		lightFx:
			"heat shimmer on hot surfaces — dust particles in bright sunbeams, concrete radiating heat",
		lightColor:
			"neutral white-bright — accurate material colors, crisp contrast",
		lightShadow:
			"short harsh shadows directly beneath elements, deep contrast between lit and shadow",
		sky: "clear blue midday sky or white hazy overcast — maximum light output",
		ambientSound:
			"peak site activity — machinery at full operation, worker voices, busiest sounds",
		equipMotion:
			"maximum activity — all machines running simultaneously, peak crew output",
		narHint:
			"Directive midday commands — progress check, correcting pace, pushing output",
	},
	afternoon: {
		label: "AFTERNOON (Sore)",
		timeRange: "15:00–19:00",
		hint: "🌇 Sore — Warm golden magic hour, long dramatic shadows, amber-orange atmosphere, beautiful cinematic light on materials.",
		lighting:
			"warm afternoon golden hour — low-angle amber light, dramatic long shadows, materials glowing rich",
		lightFx:
			"dust particles glowing golden in low sunbeams — silhouette edges of workers backlit",
		lightColor:
			"deep amber and burnt orange — rich warm palette, glowing highlights, indigo-blue shadow pools",
		lightShadow:
			"long dramatic afternoon shadows stretching across site — cinematic shadow geometry",
		sky: "golden hour sunset sky — warm bands of orange, pink and amber, clouds catching color",
		ambientSound:
			"end-of-day wind picking up — birds returning, machinery slowing, evening insects",
		equipMotion:
			"day-end activity — completing final tasks, machines shutting down sequence",
		narHint:
			"End-of-day debrief tone — progress summary, tomorrow plan, wrapping up safely",
	},
	night: {
		label: "NIGHT (Malam)",
		timeRange: "19:00–04:30",
		hint: "🌙 Malam — Night construction site, powerful work floodlights, dramatic light pools against dark sky, stars visible.",
		lighting:
			"construction site night floodlights — powerful artificial work lamps, warm light pools against deep blue-black sky",
		lightFx:
			"welding arc flashes — brilliant white sparks against darkness, floodlight halo in dusty air",
		lightColor:
			"warm amber work-light pools against cool deep-blue night — high-contrast artificial illumination",
		lightShadow:
			"dramatic hard shadow edges from directional work floods — deep surrounding darkness, stars visible",
		sky: "deep blue-black night sky — stars visible, work area brightly lit island of activity in darkness",
		ambientSound:
			"night site sounds — crickets and frogs, mechanical work sounds echo differently in cool air",
		equipMotion:
			"night-shift precision — slower deliberate movements, equipment headlights sweeping",
		narHint:
			"Night-shift coordination — clear steady directions, safety emphasis in low visibility",
	},
};

// ── PHASE DESCRIPTIONS ───────────────────────────────────────
const PHASE_DESC = {
	assess:
		"Initial documentation — careful condition survey, measuring, photographing, planning restoration approach methodically.",
	clear:
		"Controlled selective demolition — removing damaged elements while preserving all salvageable original material.",
	foundation:
		"Foundation stabilization — underpinning, re-pointing base coursework, addressing any structural movement.",
	masonry:
		"Primary masonry restoration — stone or brick cleaning, re-pointing, replacing damaged units with matching material.",
	roofing:
		"Roof structure repair and re-covering — new or restored tile/slate/timber, achieving weathertight completion.",
	services:
		"Services integration — electrical, plumbing, and mechanical systems carefully threaded through existing or new fabric.",
	interior:
		"Interior reconstruction — walls, floors, ceilings rebuilt, services integrated with original character preserved.",
	finishing:
		"Final refinement — paint, glazing, joinery, fixtures, landscape — the details that complete the transformation.",
	reveal:
		"Completed transformation — beautiful restored or newly constructed structure revealed in its full finished glory.",
	groundwork:
		"Site preparation — land cleared, excavated to engineered levels, underground services and drainage laid.",
	framing:
		"Structural frame rising — primary load-bearing structure assembled, building form taking shape visibly.",
	envelope:
		"Building envelope — external cladding, windows, doors installed, structure becomes fully weathertight.",
};

type ProjectTypeKey = keyof typeof SCENE_TYPES;
type TodKey = keyof typeof TOD_DATA;
type SceneTypeKey =
	| keyof typeof SCENE_TYPES.restoration
	| keyof typeof SCENE_TYPES.construction;

type TabKey =
	| "timelapse"
	| "equipment"
	| "narration"
	| "lighting"
	| "asmr"
	| "camera";

type DnaState = {
	building: string;
	location: string;
	climate: string;
	material: string;
	palette: string;
	team: string;
};

type SceneConfig = {
	tlMode: string;
	tlCompression: string;
	tlProgress: string;
	tlSky: string;

	eqMain: string;
	eqSupport: string;
	eqHand: string;
	eqMotion: string;

	narFreq: string;
	narStyle: string;
	narLine: string;
	narAudio: string;

	lightMain: string;
	lightFx: string;
	lightColor: string;
	lightShadow: string;

	asmrMusic: string;
	asmrLayer: string;
	asmrAmbient: string;
	asmrMoment: string;

	camAngle: string;
	camMove: string;
	camMood: string;
	camQuality: string;
	camGrade: string;
	camLens: string;

	generatedPrompt?: string;
};

const TOTAL_SCENES = 12;
const SEC_PER_SCENE = 15;

function rnd<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function mmss(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function getDefaultSceneTypes(
	projectType: ProjectTypeKey,
): Record<number, SceneTypeKey> {
	const order =
		projectType === "restoration" ? SCENE_ORDER_REST : SCENE_ORDER_CONS;
	const map: Record<number, SceneTypeKey> = {};
	for (let i = 1; i <= TOTAL_SCENES; i++) {
		map[i] = order[i - 1] as SceneTypeKey;
	}
	return map;
}

const DNA_OPTIONS = {
	building: [
		{
			label: "🏚️ Rumah batu tua — dinding sandstone, atap runtuh",
			value:
				"an old stone farmhouse with weathered sandstone walls, collapsed north roof section, and overgrown courtyard",
		},
		{
			label: "🏯 Rumah kayu Jepang (Minka) — cedar tua, atap jerami",
			value:
				"a traditional wooden Japanese farmhouse (minka) with aged cedar beams, sliding shoji doors, and thatched roof",
		},
		{
			label: "🏛️ Rumah bata kolonial — fasad redup, Victorian era",
			value:
				"a colonial-era brick row house with faded facade, sagging timber porch, and original Victorian details",
		},
		{
			label: "🌉 Jembatan batu lengkung — mortar erosi, tertutup ivy",
			value:
				"a stone arch bridge spanning a shallow river, with eroded mortar joints and thick ivy coverage",
		},
		{
			label: "🛣️ Jalan batu cobblestone — retak, ditumbuhi lumut",
			value:
				"a cobblestone village road through a historic European village center, cracked and overgrown with moss",
		},
		{
			label: "⛪ Kapel batu pedesaan — menara lonceng, kaca patri rusak",
			value:
				"a rural stone chapel with a small bell tower, crumbling render, and broken stained glass windows",
		},
		{
			label: "🏰 Menara pertahanan abad pertengahan — batu berlumut",
			value:
				"a medieval defensive tower ruin on a hillside, moss-covered stones and partially collapsed walls",
		},
		{
			label: "🏮 Mercusuar pantai — batu rusak garam, besi berkarat",
			value:
				"a coastal lighthouse on rocky cliffs, salt-damaged stonework and rusted iron lantern room",
		},
		{
			label: "🏠 Rumah modern baru — dari tanah kosong ke 2 lantai",
			value:
				"a new modern residential house being built from bare excavated ground to finished two-storey structure",
		},
		{
			label: "🛣️ Jembatan overpass jalan tol — konstruksi baru",
			value:
				"a highway overpass flyover bridge being constructed above an active road, full structural build",
		},
		{
			label: "🏔️ Kabin chalet kayu — dari lahan gunung ke bangunan jadi",
			value:
				"a multi-storey timber frame cabin chalet rising from bare mountain land to completed structure",
		},
		{
			label: "🌊 Jembatan pejalan kaki — batu dan kayu lokal, sungai gunung",
			value:
				"a community footbridge being built over a fast mountain stream using local stone and timber",
		},
		{
			label: "🏭 Gudang industri → Apartemen loft modern",
			value:
				"an industrial warehouse being converted into modern loft apartments, full structural renovation",
		},
		{
			label: "🌿 Rooftop terrace — beton terbengkalai → taman hijau kota",
			value:
				"a rooftop terrace on a city building being transformed from abandoned concrete to lush garden space",
		},
	],
	location: [
		{
			label: "🌄 Pedesaan Eropa — bukit hijau, dinding batu, langit luas",
			value:
				"rural European countryside with rolling green hills, dry-stone boundary walls, and open sky panorama",
		},
		{
			label: "🌴 Hutan tropis — tanah merah, kanopi hijau, kabut lembab",
			value:
				"dense tropical forest clearing with lush green canopy, red clay soil, and humid misty atmosphere",
		},
		{
			label: "🏙️ Pusat kota bersejarah — jalan batu, bangunan tua sekitar",
			value:
				"historic urban city center with active cobblestone streets, neighboring period buildings, and limited access",
		},
		{
			label: "⛰️ Lereng pegunungan — panorama lembah, vegetasi alpin",
			value:
				"dramatic mountainside with steep valley panorama, alpine vegetation, and dramatic cloud formations",
		},
		{
			label: "🌊 Tebing pantai — menghadap laut, semprotan garam, karang",
			value:
				"coastal cliff edge overlooking ocean with salt spray atmosphere, rocky shoreline below, and sea horizon",
		},
		{
			label: "❄️ Desa alpin bersalju — musim dingin, pohon gundul, udara beku",
			value:
				"snowy alpine village in winter with snow-covered ground, bare deciduous trees, and cold crisp air",
		},
		{
			label: "🏜️ Dataran tinggi gurun — batu merah, vegetasi jarang, terik",
			value:
				"arid high-altitude desert plateau with red rock landscape, sparse scrub vegetation, and intense sun",
		},
		{
			label: "🌿 Delta sungai tropis — bangunan di atas air, mangrove",
			value:
				"tropical river delta with stilted structures, wide slow-moving water, and mangrove surroundings",
		},
		{
			label: "🌺 Di atas laut — laguna turquoise, terumbu karang, pulau tropis",
			value:
				"overwater ocean setting with turquoise shallow lagoon, coral visible below, and palm-fringed island context",
		},
		{
			label: "🌲 Hutan gugur — pinus tinggi mengapit site, cahaya tembus daun",
			value:
				"deep temperate forest clearing with tall conifers framing the site, dappled sunlight and leaf canopy",
		},
		{
			label: "🌾 Lahan pertanian — sawah/ladang gandum, cakrawala luas",
			value:
				"open agricultural farmland with wheat or rice fields surrounding the site, wide flat horizon",
		},
		{
			label: "🏘️ Kampung bersejarah — tetangga ikut memantau, suasana komunal",
			value:
				"ancient heritage village street with neighboring historic buildings, community watching progress",
		},
		{
			label: "⚓ Pelabuhan industri — crane aktif, kapal besar, pantulan air",
			value:
				"active industrial harbor with working cranes, large vessels, water reflection and metal structures",
		},
		{
			label: "🏡 Perumahan suburban — pohon rindang, pagar taman, tenang",
			value:
				"quiet suburban residential neighborhood with mature street trees, driveways, and garden fences nearby",
		},
	],
	climate: [
		{
			label: "🌸 Semi — vegetasi segar, awan putih, udara sejuk",
			value:
				"temperate spring with fresh emerging green vegetation, occasional white cloud, and cool crisp air",
		},
		{
			label: "☀️ Musim panas — vegetasi lebat, hari panjang, hangat",
			value:
				"full summer with lush mature vegetation, long daylight hours, and warm humid conditions",
		},
		{
			label: "🍂 Musim gugur — daun emas, cahaya keemasan, daun berguguran",
			value:
				"autumn harvest season with golden and amber foliage, raking warm light, and fallen leaves on site",
		},
		{
			label: "❄️ Musim dingin — salju di tanah, pekerja berjaket tebal",
			value:
				"winter construction with snow on ground, workers in heavy gear, breath visible in cold air",
		},
		{
			label: "🌧️ Musim hujan tropis — hujan singkat, uap dari tanah panas",
			value:
				"tropical wet season with brief intense rain bursts followed by steam rising from hot earth",
		},
		{
			label: "🌵 Musim kering gurun — kilap panas, angin debu, terik",
			value:
				"desert dry season with heat shimmer on distant horizon, dust devils, and intense direct sun",
		},
		{
			label: "🫒 Mediterania — bukit kering, zaitun, batu warna madu",
			value:
				"Mediterranean dry summer with brown dry hills, olive trees, and warm honey-colored stone",
		},
		{
			label:
				"🌅 Nordic — senja panjang, cahaya tengah malam, landscape terbuka",
			value:
				"Nordic summer with dramatic long twilight, midnight sun quality light, and spare open landscape",
		},
		{
			label: "🌴 Kemarau tropis — langit bersih, angin kencang, warna kontras",
			value:
				"tropical dry season with clear skies, constant trade winds, and vivid high-contrast colors",
		},
	],
	material: [
		{
			label: "🪨 Batu asli reclaimed — bersih tangan, diset ulang tepat",
			value:
				"reclaimed original stone — each piece hand-cleaned, numbered, and carefully reset in original position",
		},
		{
			label: "🧱 Bata bakar tangan — mortar kapur, pola Flemish bond",
			value:
				"traditional hand-fired clay brick with natural lime mortar, laid in Flemish bond pattern",
		},
		{
			label: "🪵 Balok oak/cedar tua — mortise-tenon, finishing minyak",
			value:
				"hand-cut old-growth oak and cedar timber beams — mortise and tenon joinery, natural oil finish",
		},
		{
			label: "🏗️ Beton bertulang — tekstur bekisting terlihat",
			value:
				"poured reinforced concrete with visible formwork texture — modern structural system throughout",
		},
		{
			label: "⚙️ Baja struktural — I-beam, las/baut, galvanis",
			value:
				"structural steel I-beams and hollow sections — welded and bolted connections, galvanized finish",
		},
		{
			label: "🌍 Tanah padas & adobe — lempung lokal, stabil",
			value:
				"rammed earth and adobe blocks — sustainable local clay with stabilized compressive strength",
		},
		{
			label: "🪟 Curtain wall kaca — rangka aluminium presisi",
			value:
				"glass curtain wall system with aluminum extrusion framing — precision factory-made components",
		},
		{
			label: "🏠 Slate & genteng tanah liat — teknik paku tradisional",
			value:
				"natural slate and handmade clay roof tiles — sourced locally, traditional nailing technique",
		},
		{
			label: "🛣️ Aspal hot-mix — lapis pondasi/pengikat/aus",
			value:
				"hot-mix asphalt layers — base course, binder, and wearing surface with rolled aggregate finish",
		},
		{
			label: "🌳 Kayu keras tropis — jati/merbau, permukaan ketam tangan",
			value:
				"local tropical hardwood — teak or merbau structure with hand-planed surfaces and natural weathering",
		},
	],
	palette: [
		{
			label: "🎨 Terracotta, hijau sage, limestone — Mediterania",
			value:
				"warm terracotta, sage green, and weathered limestone — Mediterranean earthy harmony",
		},
		{
			label: "🎨 Batu abu-biru, hijau lumut, tanah umber — Eropa Utara",
			value:
				"cool grey-blue stone, deep moss green, and umber earth — Northern European palette",
		},
		{
			label: "🎨 Okra, sienna bakar, dusty rose — gurun hangat",
			value: "ochre earth, burnt sienna, and dusty rose — desert warm spectrum",
		},
		{
			label: "🎨 Hijau hutan, coklat kayu, emas cahaya — woodland",
			value:
				"deep forest green, rich timber brown, and dappled sunlight gold — woodland palette",
		},
		{
			label: "🎨 Salju putih, bayangan biru, lampu kerja oranye — winter",
			value:
				"white snow, blue shadow, and the warm orange of work lights — alpine winter",
		},
		{
			label: "🎨 Abu pantai, biru laut, kayu pucat, karat oranye — coastal",
			value:
				"coastal grey, deep sea blue, bleached timber, and rust-orange metal — coastal industrial",
		},
		{
			label: "🎨 Beton abu kota + aksen bata/kayu/tembaga — urban warmth",
			value:
				"urban concrete grey with warm material accents of brick, timber, and copper — city warmth",
		},
		{
			label: "🎨 Hijau tropis vivid, lempung merah, kayu coklat — tropis",
			value:
				"tropical vivid green, rich red clay, deep brown timber — lush humid palette",
		},
		{
			label: "🎨 Monokrom abu batu — fokus tekstur material",
			value:
				"monochrome stone grey — all textures, no color dominance — material-pure palette",
		},
	],
	team: [
		{
			label: "👨‍🔧 3–5 pengrajin ahli — spesialis, metodis",
			value:
				"a small craft team of 3–5 highly skilled artisan restorers — each specialist in their trade, working methodically and with evident pride in their craft",
		},
		{
			label: "👷 8–12 pekerja — mandor berpengalaman, zona kerja teratur",
			value:
				"a mixed construction crew of 8–12 workers — experienced foreman directing organized teams across defined work zones",
		},
		{
			label: "🦺 20+ pekerja — multi-alur kerja simultan",
			value:
				"a large organized construction site with 20+ workers — safety vests, helmets, multiple simultaneous work streams",
		},
		{
			label: "🪚 Tim spesialis satu-trade — masonry/carpentry",
			value:
				"a specialist single-trade team — masonry or carpentry focus, deep expertise, working as a tight unit",
		},
		{
			label: "👨‍👩‍👦 Tim keluarga lintas generasi — knowledge transfer",
			value:
				"a family-run multi-generational restoration team — eldest teaching youngest, visible knowledge transfer",
		},
		{
			label: "🌍 Tim NGO — komunitas, latar beragam",
			value:
				"an international NGO volunteer restoration team — diverse backgrounds, enthusiastic community-led approach",
		},
		{
			label: "🚜 Operator alat berat saja — minimal kerja manual",
			value:
				"heavy machinery operators only — skilled plant operators at controls, minimal visible manual labor",
		},
	],
} as const;

const OPTIONS = {
	tlMode: [
		"Standard Timelapse — steady consistent speed, classic satisfying",
		"Hyperlapse — camera moves through space as time compresses",
		"Slow Lapse — barely perceptible movement, meditative ultra-slow",
		"Ramping Timelapse — starts slow, accelerates mid-scene, slows again",
		"Interval Lapse — discrete jump cuts, construction phase highlights",
		"Dolly Hyperlapse — smooth dolly move while time-lapsing",
		"Orbit Hyperlapse — camera circles structure as time passes",
		"Vertical Rise Timelapse — camera slowly elevates as build progresses",
	],
	tlCompression: [
		"1 hour → 10 seconds (360× speed) — full work session",
		"1 day → 15 seconds (5760× speed) — dawn to dusk complete",
		"1 week → 10 seconds — dramatic multi-day progress",
		"1 month → 15 seconds — season-spanning transformation",
		"sunrise to sunset single continuous pass",
		"night-to-day transition — dramatic light change",
		"weather-inclusive — clouds racing while work continues",
	],
	tlProgress: [
		"before/after wipe split revealing transformation",
		"ghost overlay — faint original structure visible through new",
		"layer-by-layer build — each material stratum appearing",
		"raw uninterrupted continuous flow — no graphics overlay",
		"side-by-side dual frame — original left, restoration right",
	],
	tlSky: [
		"dynamic cloud movement fast — dramatic moving sky backdrop",
		"golden hour transition — warm morning light to harsh noon",
		"overcast to clear — clouds breaking revealing blue sky",
		"multiple day/night cycles compressed — stars then sun",
		"rain shower pass — gray then clearing to sun",
		"fog lifting morning — mist dissolving slowly",
		"static clear blue sky — focus purely on build progress",
		"autumn light — warm amber raking sunlight, leaves falling",
	],
	eqMain: [
		"excavator — arm swinging, bucket digging rhythmically",
		"tower crane — slowly rotating, lifting loads overhead",
		"crawler crane — massive steel cable suspending beam",
		"concrete pump truck — boom extended, continuous pour",
		"asphalt paver machine — slow steady road surface laying",
		"bulldozer — blade grading earth, steady push",
		"telescopic handler — pallet loads to upper levels",
		"pile driver — hammering steel piles, rhythmic impact",
		"no heavy machinery — artisan hand tools only",
	],
	eqSupport: [
		"concrete mixer trucks cycling in and out continuously",
		"flatbed trucks delivering structural steel beams",
		"tipper trucks removing rubble and demolition waste",
		"delivery trucks — material pallets arriving regularly",
		"water tankers — dust suppression on site",
		"horse-drawn carts — period-appropriate restoration",
		"minimal — handcarts and wheelbarrows only",
	],
	eqHand: [
		"angle grinders sparking — metal cutting visible",
		"jackhammer demolition — controlled selective breaking",
		"trowels and floats — smooth plastering hand movements",
		"traditional hand chisels on stone — artisan precision",
		"circular saw through timber — sawdust particle cloud",
		"pressure washer — cleaning decades of grime away",
		"welding torch — arc flash, slow bead laying",
	],
	eqMotion: [
		"crane arm sweeping in arcs — load pendulum in time-lapse",
		"excavator bucket cycling — dig, swing, dump rhythm",
		"trucks entering and exiting site like ants — colony motion",
		"scaffolding growing taller — level by level assembly",
		"slow roller passes — road surface compacting in stripes",
		"building rising floor by floor — frame visible climbing",
		"workers swarming structure — busy ant-colony energy",
		"material pallets shrinking as consumed — satisfying depletion",
	],
	narFreq: [
		"occasional — appears 2–3 times per scene, brief commands",
		"moderate — regular instruction flow, feels like real site",
		"minimal — single short phrase once per scene",
		"none — pure ambient ASMR sound only this scene",
	],
	narStyle: [
		"calm professional directive — measured, expert authority",
		"encouraging & positive — team motivating energy",
		"precise technical — exact measurements and specs",
		"safety-focused — constant hazard awareness reminders",
		"teaching mode — explaining process to apprentices",
		"urgent corrective — fixing something not right",
	],
	narLine: [
		'"Watch your clearance on the left side — keep it tight, good."',
		'"Okay team, we\'re moving to phase three — mortar mix needs to be dryer."',
		'"Don\'t rush the pour — let it settle naturally, trust the process."',
		'"That joint needs more pressure — work it in with the trowel, yes, like that."',
		'"Looking good from up here — keep that line straight, perfect."',
		'"Safety check — everyone step back while we swing the beam over."',
		'"The original stone goes back exactly where it came from — document everything."',
		'"Beautiful work — this is the detail that makes the difference."',
		'"Slow it down, this section is load-bearing — precision counts here."',
		'"Mixing ratio three to one — not less, this is structural."',
	],
	narAudio: [
		"slightly distorted radio / walkie-talkie quality — authentic site feel",
		"clear and warm — close-mic foreman voice, intimate",
		"distant and ambient — voice floating in site soundscape",
		"bullhorn / megaphone quality — directing large crew",
	],
	lightMain: [
		"natural golden hour sunlight — low angle, warm raking",
		"overcast diffused daylight — soft even shadows, grey beauty",
		"harsh midday sun — strong contrast, deep shadows",
		"dramatic side-lighting — half structure lit, half shadow",
		"blue-hour post-sunset — construction lights kick in",
		"mixed — natural day with supplemental work site floods",
		"winter low-angle — long shadows across snow",
	],
	lightFx: [
		"sun moving across sky in timelapse — dramatic shadow sweep",
		"dust particles catching light — golden motes in sunbeam",
		"welding arc flash — brief intense white light burst",
		"work site floodlights — warm pools on twilight site",
		"window appearing as building progresses — light fills interior",
		"glass glinting as windows installed — brightness reveals itself",
		"wet concrete surface sheen — reflective freshly poured",
	],
	lightColor: [
		"warm amber-gold — morning or evening natural light",
		"cool silver-blue — overcast northern light",
		"neutral daylight white — pure accurate color rendering",
		"warm tungsten orange — work lights at dusk",
		"mixed warm/cool — shadows cool, highlights warm",
		"deep amber sunset — scene bathed in final light",
	],
	lightShadow: [
		"high contrast — crisp clean edges, strong shadows, satisfying",
		"soft graduated — cinematic fill, gentle transitions",
		"silhouette moments — workers backlit against bright sky",
		"deep shadow interior — single shaft of light, dramatic",
		"volumetric rays — dust and mist catching light beams",
		"flat even — documentary neutral, material focus",
	],
	asmrMusic: [
		"soft ambient instrumental — gentle piano, no percussion",
		"lo-fi beats — warm grain, light rhythm, nostalgic",
		"acoustic folk guitar — simple fingerpicking, organic",
		"orchestral swell — gradual build mirroring construction",
		"nature sounds only — birds, wind, water — no music",
		"ambient electronic — deep drone pads, peaceful",
		"traditional regional music — matching location culture",
	],
	asmrLayer: [
		"trowel scraping mortar on stone — intensely satisfying",
		"steady rhythmic hammer strikes — regular and calming",
		"water running through newly restored channel — flowing",
		"concrete mixer drum rotating — low rumble and slosh",
		"chisel on stone — crisp tap and chip sequence",
		"saw cutting timber — wood grain creak, sawdust falling",
		"gravel raked and spread — surface texture sound",
		"nails or bolts placed in sequence — metallic click series",
	],
	asmrAmbient: [
		"birds singing throughout — swallows, sparrows, robins",
		"wind rustling through nearby trees — gentle constant",
		"river or stream sound — water over stones nearby",
		"distant rooster and farm sounds — rural authenticity",
		"ocean waves in background — coastal site audio",
		"light rain on materials — meditative patter sound",
		"crickets and insects — warm evening site ambience",
	],
	asmrMoment: [
		"final stone placed — perfect fit click into position",
		"roof tile laid — satisfying slide and settle",
		"door hung and swings freely for first time",
		"first window glass installed — interior light suddenly changes",
		"freshly poured surface leveled — smooth perfect finish",
		"paint first stroke on restored surface — color transformation",
		"power restored — lights come on in restored building",
		"water flows through newly laid pipe — first flow moment",
	],
	camAngle: [
		"wide establishing fixed — full structure in frame always",
		"aerial drone — overhead looking down on progress",
		"medium tracking — following workers at human level",
		"extreme close-up on material detail — texture focused",
		"corner perspective — two facades visible simultaneously",
		"interior looking out — work seen through doorway",
		"low ground level — foundation and base detail",
		"elevated platform — slightly above site, overview",
	],
	camMove: [
		"completely static locked-off — pure timelapse stability",
		"slow smooth push in toward structure — gradual reveal",
		"gentle pullback reveal — starts close, widens",
		"slow upward tilt — follows rising construction height",
		"orbit — slowly circles building over long period",
		"side lateral track — reveals length of structure",
		"crane-style descent — top to base reveal",
		"shake-free hyperlapse walk — glide through site space",
	],
	camMood: [
		"contemplative & meditative — unhurried, deeply satisfying",
		"documentary realism — honest, straightforward, authentic",
		"nostalgic & warm — loving tribute to craft and heritage",
		"triumphant & hopeful — transformation as metaphor",
		"industrial poetry — beauty in functional work",
		"immersive ASMR focus — every detail richly textured",
	],
	camQuality: [
		"8K photorealistic — RAW file quality, maximum detail",
		"Unreal Engine 5 architectural visualization quality",
		"RED camera 8K cinema — documentary film look",
		"professional drone 6K — DJI flagship quality",
	],
	camGrade: [
		"warm natural earthy — Kodak Vision3 film emulation",
		"clean documentary neutral — accurate color, light grain",
		"rich warm contrast — deep shadows, golden highlights",
		"desaturated cool — architectural photography style",
		"bleach bypass warm — texture and grain forward",
		"deep amber vintage — warm nostalgic feel",
	],
	camLens: [
		"wide 24mm — spatial context, environment present",
		"standard 35mm — natural perspective, balanced",
		"tilt-shift — miniature world effect, selective focus",
		"telephoto 85mm — compressed depth, clean layers",
		"macro — extreme detail on material surface",
		"drone fisheye — distorted wide overhead view",
	],
} as const;

function getDefaultSceneConfig(): SceneConfig {
	return {
		tlMode: OPTIONS.tlMode[0],
		tlCompression: OPTIONS.tlCompression[0],
		tlProgress: OPTIONS.tlProgress[0],
		tlSky: OPTIONS.tlSky[0],

		eqMain: OPTIONS.eqMain[0],
		eqSupport: OPTIONS.eqSupport[0],
		eqHand: OPTIONS.eqHand[0],
		eqMotion: OPTIONS.eqMotion[0],

		narFreq: OPTIONS.narFreq[0],
		narStyle: OPTIONS.narStyle[0],
		narLine: OPTIONS.narLine[0],
		narAudio: OPTIONS.narAudio[0],

		lightMain: OPTIONS.lightMain[0],
		lightFx: OPTIONS.lightFx[0],
		lightColor: OPTIONS.lightColor[0],
		lightShadow: OPTIONS.lightShadow[0],

		asmrMusic: OPTIONS.asmrMusic[0],
		asmrLayer: OPTIONS.asmrLayer[0],
		asmrAmbient: OPTIONS.asmrAmbient[0],
		asmrMoment: OPTIONS.asmrMoment[0],

		camAngle: OPTIONS.camAngle[0],
		camMove: OPTIONS.camMove[0],
		camMood: OPTIONS.camMood[0],
		camQuality: OPTIONS.camQuality[0],
		camGrade: OPTIONS.camGrade[0],
		camLens: OPTIONS.camLens[0],
	};
}

function buildPrompt(args: {
	sceneNum: number;
	sceneType: SceneTypeKey;
	projectType: ProjectTypeKey;
	narratorGender: "male" | "female";
	timeOfDay: TodKey;
	dna: DnaState;
	config: SceneConfig;
}) {
	const {
		sceneNum,
		sceneType,
		projectType,
		narratorGender,
		timeOfDay,
		dna,
		config,
	} = args;
	const start = (sceneNum - 1) * SEC_PER_SCENE;
	const end = start + SEC_PER_SCENE;
	const typeLabel =
		(projectType === "restoration"
			? SCENE_TYPES.restoration[
					sceneType as keyof typeof SCENE_TYPES.restoration
				]
			: SCENE_TYPES.construction[
					sceneType as keyof typeof SCENE_TYPES.construction
				]) ?? String(sceneType);
	const progressPct = Math.round((sceneNum / TOTAL_SCENES) * 100);
	const tod = TOD_DATA[timeOfDay];
	const ptLabel =
		projectType === "restoration" ? "RESTORATION" : "NEW CONSTRUCTION";
	const narGender =
		narratorGender === "male"
			? "MALE — deep authoritative baritone"
			: "FEMALE — clear confident professional";

	const narSection = config.narFreq.includes("none")
		? "NARRATION: None this scene — pure ambient ASMR sound only."
		: `NARRATION: Off-screen ${narGender} foreman/site supervisor voice.\nStyle: ${config.narStyle}. Audio: ${config.narAudio}.\nExample line: ${config.narLine}\nFrequency: ${config.narFreq}. No character model shown — voice only.`;

	const phaseNote =
		(PHASE_DESC[sceneType as keyof typeof PHASE_DESC] as string | undefined) ??
		"Key construction phase progressing satisfyingly.";

	const prevScene =
		sceneNum > 1
			? `Scene ${sceneNum - 1} established the previous phase.`
			: "This is the opening scene — establishing the overall context.";
	const nextScene =
		sceneNum < TOTAL_SCENES
			? `Scene ${sceneNum + 1} will progress to the next phase.`
			: "This is the final scene — the complete transformation is shown.";

	return `═══════════════════════════════════════════════════════════════\n[SCENE ${sceneNum}/${TOTAL_SCENES} | ${mmss(start)} – ${mmss(end)} | ${ptLabel}: ${typeLabel.toUpperCase()}]\nSERIES PROGRESS: ${progressPct}% complete | ${prevScene}\nNEXT: ${nextScene}\n═══════════════════════════════════════════════════════════════\n\nTHEME: ASMR Timelapse ${ptLabel} | Cinematic Satisfying Process\nPHASE: ${phaseNote}\n\nTIME OF DAY: ${tod.label} | ${tod.timeRange}\nSky: ${tod.sky}\nNarrator context: ${tod.narHint}\n\n━━━ PROJECT DNA (CONSISTENT ACROSS ALL ${TOTAL_SCENES} SCENES) ━━━━━━━━━━━\nBUILDING / STRUCTURE: ${dna.building}\nLOCATION SETTING: ${dna.location}\nCLIMATE & SEASON: ${dna.climate}\nPRIMARY MATERIAL: ${dna.material}\nCOLOR PALETTE: ${dna.palette}\nCREW / TEAM: ${dna.team}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSCENE-SPECIFIC CONFIGURATION:\n\nTIMELAPSE: ${config.tlMode}\nTime compression: ${config.tlCompression}\nProgress visual: ${config.tlProgress}\nSky / weather: ${config.tlSky}\n\nEQUIPMENT: Primary: ${config.eqMain}\nSupport vehicles: ${config.eqSupport}\nHand tools: ${config.eqHand}\nEquipment motion in timelapse: ${tod.equipMotion} — ${config.eqMotion}\n\n${narSection}\n\nLIGHTING: ${tod.lighting}\nOverride/supplement: ${config.lightMain}\nFX: ${tod.lightFx} — ${config.lightFx}\nColors: ${tod.lightColor}. Additional: ${config.lightColor}\nShadow: ${tod.lightShadow}. ${config.lightShadow}\n\nASMR SOUND: Music — ${config.asmrMusic}\nLayer: ${config.asmrLayer} | Ambient: ${tod.ambientSound} — ${config.asmrAmbient}\nSpecial moment: ${config.asmrMoment}\n\nCAMERA: ${config.camAngle}, ${config.camMove}\nLens: ${config.camLens} | Mood: ${config.camMood}\nStyle: ${config.camQuality}, color grade: ${config.camGrade}\n\nCONTINUITY INSTRUCTIONS:\n- SAME building, location, and materials as all other scenes in this series\n- This scene represents ${progressPct}% completion of the overall project\n- Seamless visual continuity with adjacent scenes required\n- No watermarks. No text overlays. Photorealistic materials.\n- Deeply satisfying, meditative, ASMR-optimized cinematic build content.`.trim();
}

function getSceneTypeLabel(
	projectType: ProjectTypeKey,
	sceneType: SceneTypeKey,
) {
	if (projectType === "restoration") {
		return (
			SCENE_TYPES.restoration[
				sceneType as keyof typeof SCENE_TYPES.restoration
			] ?? String(sceneType)
		);
	}
	return (
		SCENE_TYPES.construction[
			sceneType as keyof typeof SCENE_TYPES.construction
		] ?? String(sceneType)
	);
}

export default function AsmrTimelapseConstructorForm() {
	const tabs = useMemo(
		() =>
			[
				{ key: "timelapse", label: "⏱️ Timelapse" },
				{ key: "equipment", label: "🚜 Alat Berat" },
				{ key: "narration", label: "🔊 Narasi" },
				{ key: "lighting", label: "☀️ Lighting" },
				{ key: "asmr", label: "🎵 ASMR" },
				{ key: "camera", label: "🎬 Kamera" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const [projectType, setProjectType] = useState<ProjectTypeKey>("restoration");
	const [narratorGender, setNarratorGender] = useState<"male" | "female">(
		"male",
	);
	const [timeOfDay, setTimeOfDay] = useState<TodKey>("noon");
	const [dnaLocked, setDnaLocked] = useState(false);
	const [dnaPreviewOpen, setDnaPreviewOpen] = useState(false);
	const [currentScene, setCurrentScene] = useState(1);
	const [activeTab, setActiveTab] = useState<TabKey>("timelapse");

	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultSceneTypes("restoration"),
	);

	const [dna, setDna] = useState<DnaState>(() => ({
		building: DNA_OPTIONS.building[0].value,
		location: DNA_OPTIONS.location[0].value,
		climate: DNA_OPTIONS.climate[0].value,
		material: DNA_OPTIONS.material[0].value,
		palette: DNA_OPTIONS.palette[0].value,
		team: DNA_OPTIONS.team[0].value,
	}));

	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);

	const [randomGroups, setRandomGroups] = useState<
		Record<keyof typeof RANDOM_IDS, boolean>
	>(() => ({
		timelapse: true,
		equipment: true,
		narration: true,
		lighting: true,
		asmr: true,
		camera: true,
	}));

	const [promptOutput, setPromptOutput] = useState(
		"🔒 Kunci Project DNA terlebih dahulu, lalu klik ⚡ Generate Prompt.",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);

	const { toast, show: showToast } = useToast();

	function getSceneConfig(sceneNum: number): SceneConfig {
		return sceneConfigs[sceneNum] ?? getDefaultSceneConfig();
	}

	function updateSceneConfig(sceneNum: number, updates: Partial<SceneConfig>) {
		setSceneConfigs((prev) => ({
			...prev,
			[sceneNum]: { ...getSceneConfig(sceneNum), ...updates },
		}));
	}

	function generatePromptFor(sceneNum: number, ptOverride?: ProjectTypeKey) {
		if (!dnaLocked) {
			setPromptOutput(
				'⚠️ Kunci Project DNA terlebih dahulu!\n\nKlik tombol "🔒 Kunci Project DNA" untuk memastikan semua 12 scene menggunakan proyek yang sama dan sinkron.',
			);
			return;
		}

		const projectType2 = ptOverride ?? projectType;
		const sceneType = (sceneTypes[sceneNum] ??
			(projectType2 === "restoration"
				? "assess"
				: "groundwork")) as SceneTypeKey;
		const config = getSceneConfig(sceneNum);
		const prompt = buildPrompt({
			sceneNum,
			sceneType,
			projectType: projectType2,
			narratorGender,
			timeOfDay,
			dna,
			config,
		});
		setPromptOutput(prompt);
		updateSceneConfig(sceneNum, { generatedPrompt: prompt });
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
		showToast(`✓ Prompt Scene ${currentScene} berhasil!`);
	}

	function nextScene() {
		if (!dnaLocked) return;
		const next = currentScene < TOTAL_SCENES ? currentScene + 1 : 1;
		setCurrentScene(next);
		setTimeout(() => generatePromptFor(next), 50);
	}

	function copyPrompt() {
		if (promptOutput.startsWith("⚠") || promptOutput.startsWith("🔒")) return;
		navigator.clipboard.writeText(promptOutput);
		showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
	}

	function copyAll() {
		if (!allPrompts.length) {
			generateAll();
			return;
		}
		navigator.clipboard.writeText(
			allPrompts.join("\n\n" + "─".repeat(64) + "\n\n"),
		);
		showToast(`📋 Semua ${TOTAL_SCENES} prompt tersalin!`);
	}

	function generateAll() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		const prompts: string[] = [];
		const updated: Record<number, SceneConfig> = { ...sceneConfigs };
		for (let s = 1; s <= TOTAL_SCENES; s++) {
			const sceneType = (sceneTypes[s] ??
				(projectType === "restoration"
					? "assess"
					: "groundwork")) as SceneTypeKey;
			const prompt = buildPrompt({
				sceneNum: s,
				sceneType,
				projectType,
				narratorGender,
				timeOfDay,
				dna,
				config: getSceneConfig(s),
			});
			prompts.push(prompt);
			updated[s] = { ...getSceneConfig(s), generatedPrompt: prompt };
		}
		setSceneConfigs(updated);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${TOTAL_SCENES} prompt berhasil di-generate!`);
	}

	function randomizeDNA() {
		setDna({
			building: rnd([...DNA_OPTIONS.building].map((o) => o.value)),
			location: rnd([...DNA_OPTIONS.location].map((o) => o.value)),
			climate: rnd([...DNA_OPTIONS.climate].map((o) => o.value)),
			material: rnd([...DNA_OPTIONS.material].map((o) => o.value)),
			palette: rnd([...DNA_OPTIONS.palette].map((o) => o.value)),
			team: rnd([...DNA_OPTIONS.team].map((o) => o.value)),
		});
		setDnaPreviewOpen(true);
		showToast("🎲 DNA di-randomize! Kunci setelah puas.");
	}

	function lockDNA() {
		setDnaLocked(true);
		setDnaPreviewOpen(true);
		showToast("🔒 Project DNA terkunci! Semua 12 scene akan sinkron.");
		setTimeout(() => generatePromptFor(currentScene), 50);
	}

	function randomCurrentScene() {
		const updates: Partial<SceneConfig> = {};

		if (randomGroups.timelapse) {
			updates.tlMode = rnd([...OPTIONS.tlMode]);
			updates.tlCompression = rnd([...OPTIONS.tlCompression]);
			updates.tlProgress = rnd([...OPTIONS.tlProgress]);
			updates.tlSky = rnd([...OPTIONS.tlSky]);
		}
		if (randomGroups.equipment) {
			updates.eqMain = rnd([...OPTIONS.eqMain]);
			updates.eqSupport = rnd([...OPTIONS.eqSupport]);
			updates.eqHand = rnd([...OPTIONS.eqHand]);
			updates.eqMotion = rnd([...OPTIONS.eqMotion]);
		}
		if (randomGroups.narration) {
			updates.narFreq = rnd([...OPTIONS.narFreq]);
			updates.narStyle = rnd([...OPTIONS.narStyle]);
			updates.narLine = rnd([...OPTIONS.narLine]);
			updates.narAudio = rnd([...OPTIONS.narAudio]);
		}
		if (randomGroups.lighting) {
			updates.lightMain = rnd([...OPTIONS.lightMain]);
			updates.lightFx = rnd([...OPTIONS.lightFx]);
			updates.lightColor = rnd([...OPTIONS.lightColor]);
			updates.lightShadow = rnd([...OPTIONS.lightShadow]);
		}
		if (randomGroups.asmr) {
			updates.asmrMusic = rnd([...OPTIONS.asmrMusic]);
			updates.asmrLayer = rnd([...OPTIONS.asmrLayer]);
			updates.asmrAmbient = rnd([...OPTIONS.asmrAmbient]);
			updates.asmrMoment = rnd([...OPTIONS.asmrMoment]);
		}
		if (randomGroups.camera) {
			updates.camAngle = rnd([...OPTIONS.camAngle]);
			updates.camMove = rnd([...OPTIONS.camMove]);
			updates.camMood = rnd([...OPTIONS.camMood]);
			updates.camQuality = rnd([...OPTIONS.camQuality]);
			updates.camGrade = rnd([...OPTIONS.camGrade]);
			updates.camLens = rnd([...OPTIONS.camLens]);
		}

		updateSceneConfig(currentScene, updates);
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function randomSceneType() {
		const types = Object.keys(SCENE_TYPES[projectType]) as SceneTypeKey[];
		const pick = rnd(types);
		setSceneTypes((prev) => ({ ...prev, [currentScene]: pick }));
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎴 Fase: ${getSceneTypeLabel(projectType, pick)}`);
	}

	function randomAllScenes() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		const nextConfigs: Record<number, SceneConfig> = {};
		for (let s = 1; s <= TOTAL_SCENES; s++) {
			const base = getDefaultSceneConfig();
			const updates: Partial<SceneConfig> = {};
			if (randomGroups.timelapse) {
				updates.tlMode = rnd([...OPTIONS.tlMode]);
				updates.tlCompression = rnd([...OPTIONS.tlCompression]);
				updates.tlProgress = rnd([...OPTIONS.tlProgress]);
				updates.tlSky = rnd([...OPTIONS.tlSky]);
			}
			if (randomGroups.equipment) {
				updates.eqMain = rnd([...OPTIONS.eqMain]);
				updates.eqSupport = rnd([...OPTIONS.eqSupport]);
				updates.eqHand = rnd([...OPTIONS.eqHand]);
				updates.eqMotion = rnd([...OPTIONS.eqMotion]);
			}
			if (randomGroups.narration) {
				updates.narFreq = rnd([...OPTIONS.narFreq]);
				updates.narStyle = rnd([...OPTIONS.narStyle]);
				updates.narLine = rnd([...OPTIONS.narLine]);
				updates.narAudio = rnd([...OPTIONS.narAudio]);
			}
			if (randomGroups.lighting) {
				updates.lightMain = rnd([...OPTIONS.lightMain]);
				updates.lightFx = rnd([...OPTIONS.lightFx]);
				updates.lightColor = rnd([...OPTIONS.lightColor]);
				updates.lightShadow = rnd([...OPTIONS.lightShadow]);
			}
			if (randomGroups.asmr) {
				updates.asmrMusic = rnd([...OPTIONS.asmrMusic]);
				updates.asmrLayer = rnd([...OPTIONS.asmrLayer]);
				updates.asmrAmbient = rnd([...OPTIONS.asmrAmbient]);
				updates.asmrMoment = rnd([...OPTIONS.asmrMoment]);
			}
			if (randomGroups.camera) {
				updates.camAngle = rnd([...OPTIONS.camAngle]);
				updates.camMove = rnd([...OPTIONS.camMove]);
				updates.camMood = rnd([...OPTIONS.camMood]);
				updates.camQuality = rnd([...OPTIONS.camQuality]);
				updates.camGrade = rnd([...OPTIONS.camGrade]);
				updates.camLens = rnd([...OPTIONS.camLens]);
			}
			nextConfigs[s] = { ...base, ...updates };
		}
		setSceneConfigs(nextConfigs);
		showToast("🎰 Semua 12 scene di-randomize dengan DNA yang sama!");
		setTimeout(() => generateAll(), 50);
	}

	function setProjectTypeSafe(next: ProjectTypeKey) {
		setProjectType(next);
		setSceneTypes(getDefaultSceneTypes(next));
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene, next), 50);
	}

	const scType = sceneTypes[currentScene] ?? ("assess" as SceneTypeKey);
	const scTypeLabel =
		(projectType === "restoration"
			? SCENE_TYPES.restoration[scType as keyof typeof SCENE_TYPES.restoration]
			: SCENE_TYPES.construction[
					scType as keyof typeof SCENE_TYPES.construction
				]) ?? String(scType);

	const progressPct = Math.round((currentScene / TOTAL_SCENES) * 100);

	return (
		<div>
			<section className="card mb-5">
				<div className="section-label">
					🏗️ ASMR Timelapse — Restoration & Construction
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
					<div className="font-mono text-[11px] text-stone2 leading-relaxed">
						Cinematic Build Process · Satisfying Progress · Ambient Soundscape
					</div>
					<div className="flex flex-wrap gap-2 sm:justify-end">
						<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
							Durasi: <span className="text-leaf2 font-bold">3 menit</span>
						</div>
						<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
							Scene:{" "}
							<span className="text-leaf2 font-bold">
								{TOTAL_SCENES} × {SEC_PER_SCENE} detik
							</span>
						</div>
						<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
							DNA:{" "}
							<span className="text-leaf2 font-bold">
								{dnaLocked ? "🔒 Terkunci" : "Belum"}
							</span>
						</div>
					</div>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">
					🧬 Project DNA — Master Configuration
				</div>
				<div className="font-mono text-[10px] text-stone2 leading-relaxed mb-3">
					DNA mengunci identitas proyek agar konsisten di semua scene.
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<Field label="🏠 Jenis Bangunan / Objek">
						<Sel
							id="dna-building"
							value={dna.building}
							onChange={(v) => setDna((p) => ({ ...p, building: v }))}
							options={DNA_OPTIONS.building.map((o) => ({
								value: o.value,
								label: o.label,
							}))}
						/>
					</Field>
					<Field label="📍 Setting Lokasi Utama">
						<Sel
							id="dna-location"
							value={dna.location}
							onChange={(v) => setDna((p) => ({ ...p, location: v }))}
							options={DNA_OPTIONS.location.map((o) => ({
								value: o.value,
								label: o.label,
							}))}
						/>
					</Field>
					<Field label="🌡️ Iklim & Musim Proyek">
						<Sel
							id="dna-climate"
							value={dna.climate}
							onChange={(v) => setDna((p) => ({ ...p, climate: v }))}
							options={DNA_OPTIONS.climate.map((o) => ({
								value: o.value,
								label: o.label,
							}))}
						/>
					</Field>
					<Field label="🧱 Material Utama (Konsisten)">
						<Sel
							id="dna-material"
							value={dna.material}
							onChange={(v) => setDna((p) => ({ ...p, material: v }))}
							options={DNA_OPTIONS.material.map((o) => ({
								value: o.value,
								label: o.label,
							}))}
						/>
					</Field>
					<Field label="🎨 Palet Warna Visual Proyek">
						<Sel
							id="dna-palette"
							value={dna.palette}
							onChange={(v) => setDna((p) => ({ ...p, palette: v }))}
							options={DNA_OPTIONS.palette.map((o) => ({
								value: o.value,
								label: o.label,
							}))}
						/>
					</Field>
					<Field label="👷 Tim Pekerja (Konsisten)">
						<Sel
							id="dna-team"
							value={dna.team}
							onChange={(v) => setDna((p) => ({ ...p, team: v }))}
							options={DNA_OPTIONS.team.map((o) => ({
								value: o.value,
								label: o.label,
							}))}
						/>
					</Field>
				</div>

				{dnaPreviewOpen && (
					<div className="mt-3 rounded-lg border border-leaf/15 bg-bark/30 p-3 font-mono text-[10px] text-stone2 leading-relaxed">
						<div>
							<span className="text-leaf2 font-bold">BANGUNAN:</span>{" "}
							{dna.building}
						</div>
						<div>
							<span className="text-leaf2 font-bold">LOKASI:</span>{" "}
							{dna.location}
						</div>
						<div>
							<span className="text-leaf2 font-bold">IKLIM:</span> {dna.climate}
						</div>
						<div>
							<span className="text-leaf2 font-bold">MATERIAL:</span>{" "}
							{dna.material}
						</div>
						<div>
							<span className="text-leaf2 font-bold">PALET:</span> {dna.palette}
						</div>
						<div>
							<span className="text-leaf2 font-bold">TIM:</span> {dna.team}
						</div>
					</div>
				)}

				<div className="flex flex-wrap gap-2 mt-4">
					<button type="button" className="btn-primary" onClick={lockDNA}>
						🔒 Kunci Project DNA
					</button>
					<button type="button" className="btn-outline" onClick={randomizeDNA}>
						🎲 Random DNA
					</button>
					<button
						type="button"
						className="btn-ghost"
						onClick={() => setDnaPreviewOpen((v) => !v)}
					>
						👁 Preview DNA
					</button>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">📊 Progress Scene</div>
				<div className="flex items-center gap-3">
					<div className="flex-1 h-2 rounded-full bg-bark/50 overflow-hidden border border-leaf/10">
						<div
							className="h-full bg-linear-to-r from-moss to-leaf2"
							style={{ width: `${progressPct}%` }}
						/>
					</div>
					<div className="font-mono text-[10px] text-leaf2 font-bold">
						{currentScene}/{TOTAL_SCENES}
					</div>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">🕒 Waktu Shooting</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
					{(Object.keys(TOD_DATA) as TodKey[]).map((k) => (
						<button
							key={k}
							type="button"
							onClick={() => {
								setTimeOfDay(k);
								if (dnaLocked)
									setTimeout(() => generatePromptFor(currentScene), 50);
							}}
							className={`rounded-lg border px-3 py-2 text-left transition-all ${
								timeOfDay === k
									? "border-leaf bg-moss/20"
									: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
							}`}
						>
							<div className="font-playfair text-sm font-bold text-cream">
								{TOD_DATA[k].label.split(" ")[0]}
							</div>
							<div className="font-mono text-[10px] text-stone2">
								{TOD_DATA[k].timeRange}
							</div>
						</button>
					))}
				</div>
				<div className="mt-3 rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-stone2 leading-relaxed">
					{TOD_DATA[timeOfDay].hint}
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">🧭 Project Type</div>
				<div className="grid grid-cols-2 gap-2">
					<button
						type="button"
						onClick={() => setProjectTypeSafe("restoration")}
						className={`rounded-lg border px-3 py-3 transition-all ${
							projectType === "restoration"
								? "border-leaf bg-moss/20"
								: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
						}`}
					>
						<div className="font-playfair font-bold text-cream">
							🏚️ Restoration
						</div>
						<div className="font-mono text-[10px] text-stone2">
							Perbaikan · Renovasi · Pemulihan
						</div>
					</button>
					<button
						type="button"
						onClick={() => setProjectTypeSafe("construction")}
						className={`rounded-lg border px-3 py-3 transition-all ${
							projectType === "construction"
								? "border-leaf bg-moss/20"
								: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
						}`}
					>
						<div className="font-playfair font-bold text-cream">
							🏗️ New Construction
						</div>
						<div className="font-mono text-[10px] text-stone2">
							Bangunan Baru · Infrastruktur
						</div>
					</button>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">🧩 Timeline Scene</div>
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: TOTAL_SCENES }).map((_, i) => {
						const n = i + 1;
						const has = Boolean(getSceneConfig(n).generatedPrompt);
						return (
							<button
								key={n}
								type="button"
								onClick={() => {
									setCurrentScene(n);
									if (dnaLocked) setTimeout(() => generatePromptFor(n), 50);
								}}
								className={`font-mono text-[10px] px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
									n === currentScene
										? "border-leaf bg-moss/20 text-leaf2"
										: has
											? "border-leaf/40 text-leaf2 bg-moss/10 hover:bg-moss/15"
											: "border-leaf/15 text-stone2 bg-bark/20 hover:border-leaf/35 hover:bg-moss/10"
								}`}
							>
								S{n} ({mmss(i * SEC_PER_SCENE)})
							</button>
						);
					})}
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">
					🏷️ Fase Pekerjaan Scene Ini
					<span className="ml-auto font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-leaf2">
						{scTypeLabel}
					</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{(
						Object.entries(SCENE_TYPES[projectType]) as [SceneTypeKey, string][]
					).map(([k, label]) => (
						<button
							key={k}
							type="button"
							onClick={() => {
								setSceneTypes((prev) => ({ ...prev, [currentScene]: k }));
								if (dnaLocked)
									setTimeout(() => generatePromptFor(currentScene), 50);
							}}
							className={`phase-chip ${scType === k ? "active" : ""}`}
						>
							{label}
						</button>
					))}
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">🧩 Konfigurasi Per-Scene</div>
				<div className="flex flex-wrap gap-2 mb-4">
					{tabs.map((t) => (
						<button
							key={t.key}
							type="button"
							className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
							onClick={() => setActiveTab(t.key)}
						>
							{t.label}
						</button>
					))}
				</div>

				{activeTab === "timelapse" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="⏱️ Mode Timelapse">
							<Sel
								id="tl-mode"
								value={getSceneConfig(currentScene).tlMode}
								onChange={(v) => updateSceneConfig(currentScene, { tlMode: v })}
								options={[...OPTIONS.tlMode]}
							/>
						</Field>
						<Field label="🕐 Kompresi Waktu">
							<Sel
								id="tl-compression"
								value={getSceneConfig(currentScene).tlCompression}
								onChange={(v) =>
									updateSceneConfig(currentScene, { tlCompression: v })
								}
								options={[...OPTIONS.tlCompression]}
							/>
						</Field>
						<Field label="📊 Progress Visual">
							<Sel
								id="tl-progress"
								value={getSceneConfig(currentScene).tlProgress}
								onChange={(v) =>
									updateSceneConfig(currentScene, { tlProgress: v })
								}
								options={[...OPTIONS.tlProgress]}
							/>
						</Field>
						<Field label="🌤️ Sky & Weather">
							<Sel
								id="tl-sky"
								value={getSceneConfig(currentScene).tlSky}
								onChange={(v) => updateSceneConfig(currentScene, { tlSky: v })}
								options={[...OPTIONS.tlSky]}
							/>
						</Field>
					</div>
				) : activeTab === "equipment" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="🚜 Alat Berat Utama">
							<Sel
								id="eq-main"
								value={getSceneConfig(currentScene).eqMain}
								onChange={(v) => updateSceneConfig(currentScene, { eqMain: v })}
								options={[...OPTIONS.eqMain]}
							/>
						</Field>
						<Field label="🚚 Kendaraan Pendukung">
							<Sel
								id="eq-support"
								value={getSceneConfig(currentScene).eqSupport}
								onChange={(v) =>
									updateSceneConfig(currentScene, { eqSupport: v })
								}
								options={[...OPTIONS.eqSupport]}
							/>
						</Field>
						<Field label="🔧 Alat Tangan">
							<Sel
								id="eq-hand"
								value={getSceneConfig(currentScene).eqHand}
								onChange={(v) => updateSceneConfig(currentScene, { eqHand: v })}
								options={[...OPTIONS.eqHand]}
							/>
						</Field>
						<Field label="⚙️ Gerakan Alat (Timelapse)">
							<Sel
								id="eq-motion"
								value={getSceneConfig(currentScene).eqMotion}
								onChange={(v) =>
									updateSceneConfig(currentScene, { eqMotion: v })
								}
								options={[...OPTIONS.eqMotion]}
							/>
						</Field>
					</div>
				) : activeTab === "narration" ? (
					<div className="flex flex-col gap-3">
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								className={`rounded-lg border px-3 py-2 transition-all ${
									narratorGender === "male"
										? "border-leaf bg-moss/20 text-leaf2"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/40 hover:bg-moss/10"
								}`}
								onClick={() => {
									setNarratorGender("male");
									if (dnaLocked)
										setTimeout(() => generatePromptFor(currentScene), 50);
								}}
							>
								<div className="font-bold text-sm">👨 Male Voice</div>
								<div className="font-mono text-[10px] opacity-75">
									Deep Authoritative
								</div>
							</button>
							<button
								type="button"
								className={`rounded-lg border px-3 py-2 transition-all ${
									narratorGender === "female"
										? "border-leaf bg-moss/20 text-leaf2"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/40 hover:bg-moss/10"
								}`}
								onClick={() => {
									setNarratorGender("female");
									if (dnaLocked)
										setTimeout(() => generatePromptFor(currentScene), 50);
								}}
							>
								<div className="font-bold text-sm">👩 Female Voice</div>
								<div className="font-mono text-[10px] opacity-75">
									Clear Confident
								</div>
							</button>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Field label="🔊 Frekuensi Narasi">
								<Sel
									id="nar-freq"
									value={getSceneConfig(currentScene).narFreq}
									onChange={(v) =>
										updateSceneConfig(currentScene, { narFreq: v })
									}
									options={[...OPTIONS.narFreq]}
								/>
							</Field>
							<Field label="📣 Gaya Instruksi">
								<Sel
									id="nar-style"
									value={getSceneConfig(currentScene).narStyle}
									onChange={(v) =>
										updateSceneConfig(currentScene, { narStyle: v })
									}
									options={[...OPTIONS.narStyle]}
								/>
							</Field>
							<Field label="💬 Contoh Instruksi">
								<Sel
									id="nar-line"
									value={getSceneConfig(currentScene).narLine}
									onChange={(v) =>
										updateSceneConfig(currentScene, { narLine: v })
									}
									options={[...OPTIONS.narLine]}
								/>
							</Field>
							<Field label="🎙️ Kualitas Audio">
								<Sel
									id="nar-audio"
									value={getSceneConfig(currentScene).narAudio}
									onChange={(v) =>
										updateSceneConfig(currentScene, { narAudio: v })
									}
									options={[...OPTIONS.narAudio]}
								/>
							</Field>
						</div>
					</div>
				) : activeTab === "lighting" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="☀️ Sumber Cahaya">
							<Sel
								id="light-main"
								value={getSceneConfig(currentScene).lightMain}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightMain: v })
								}
								options={[...OPTIONS.lightMain]}
							/>
						</Field>
						<Field label="💡 Lighting Effect ASMR">
							<Sel
								id="light-fx"
								value={getSceneConfig(currentScene).lightFx}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightFx: v })
								}
								options={[...OPTIONS.lightFx]}
							/>
						</Field>
						<Field label="🌈 Suhu Warna Cahaya">
							<Sel
								id="light-color"
								value={getSceneConfig(currentScene).lightColor}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightColor: v })
								}
								options={[...OPTIONS.lightColor]}
							/>
						</Field>
						<Field label="🖤 Shadow & Contrast">
							<Sel
								id="light-shadow"
								value={getSceneConfig(currentScene).lightShadow}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightShadow: v })
								}
								options={[...OPTIONS.lightShadow]}
							/>
						</Field>
					</div>
				) : activeTab === "asmr" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="🎵 Musik Background">
							<Sel
								id="asmr-music"
								value={getSceneConfig(currentScene).asmrMusic}
								onChange={(v) =>
									updateSceneConfig(currentScene, { asmrMusic: v })
								}
								options={[...OPTIONS.asmrMusic]}
							/>
						</Field>
						<Field label="🔩 ASMR Sound Layer">
							<Sel
								id="asmr-layer"
								value={getSceneConfig(currentScene).asmrLayer}
								onChange={(v) =>
									updateSceneConfig(currentScene, { asmrLayer: v })
								}
								options={[...OPTIONS.asmrLayer]}
							/>
						</Field>
						<Field label="🌬️ Ambient Sound">
							<Sel
								id="asmr-ambient"
								value={getSceneConfig(currentScene).asmrAmbient}
								onChange={(v) =>
									updateSceneConfig(currentScene, { asmrAmbient: v })
								}
								options={[...OPTIONS.asmrAmbient]}
							/>
						</Field>
						<Field label="✨ ASMR Momen Spesial">
							<Sel
								id="asmr-moment"
								value={getSceneConfig(currentScene).asmrMoment}
								onChange={(v) =>
									updateSceneConfig(currentScene, { asmrMoment: v })
								}
								options={[...OPTIONS.asmrMoment]}
							/>
						</Field>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<Field label="📷 Sudut Kamera">
							<Sel
								id="cam-angle"
								value={getSceneConfig(currentScene).camAngle}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camAngle: v })
								}
								options={[...OPTIONS.camAngle]}
							/>
						</Field>
						<Field label="🎥 Gerakan Kamera">
							<Sel
								id="cam-move"
								value={getSceneConfig(currentScene).camMove}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camMove: v })
								}
								options={[...OPTIONS.camMove]}
							/>
						</Field>
						<Field label="🎭 Mood Sinematik">
							<Sel
								id="cam-mood"
								value={getSceneConfig(currentScene).camMood}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camMood: v })
								}
								options={[...OPTIONS.camMood]}
							/>
						</Field>
						<Field label="🌟 Kualitas Render">
							<Sel
								id="cam-quality"
								value={getSceneConfig(currentScene).camQuality}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camQuality: v })
								}
								options={[...OPTIONS.camQuality]}
							/>
						</Field>
						<Field label="🎨 Color Grade">
							<Sel
								id="cam-grade"
								value={getSceneConfig(currentScene).camGrade}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camGrade: v })
								}
								options={[...OPTIONS.camGrade]}
							/>
						</Field>
						<Field label="🔭 Lens & Depth">
							<Sel
								id="cam-lens"
								value={getSceneConfig(currentScene).camLens}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camLens: v })
								}
								options={[...OPTIONS.camLens]}
							/>
						</Field>
					</div>
				)}
			</section>

			<section className="card mb-5">
				<div className="section-label">🎲 Random Generator</div>
				<div className="flex flex-wrap gap-2">
					{(Object.keys(RANDOM_IDS) as (keyof typeof RANDOM_IDS)[]).map((k) => (
						<label
							key={k}
							className={`rnd-toggle ${randomGroups[k] ? "checked" : ""}`}
						>
							<input
								type="checkbox"
								checked={randomGroups[k]}
								onChange={() => setRandomGroups((p) => ({ ...p, [k]: !p[k] }))}
							/>
							<span className="capitalize">{k}</span>
						</label>
					))}
					<label className="rnd-toggle checked opacity-60 pointer-events-none">
						<input type="checkbox" checked readOnly />
						<span>DNA (Terkunci)</span>
					</label>
				</div>
				<div className="flex flex-wrap gap-2 mt-3">
					<button
						type="button"
						className="btn-outline"
						onClick={randomCurrentScene}
					>
						🎲 Random Scene Ini
					</button>
					<button
						type="button"
						className="btn-outline"
						onClick={randomAllScenes}
					>
						🎰 Random Semua 12 Scene
					</button>
					<button type="button" className="btn-amber" onClick={randomSceneType}>
						🎴 Random Fase Pekerjaan
					</button>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">📝 Generated Prompt</div>
				<div className="flex items-center gap-2 mb-3">
					<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-stone2">
						Scene {currentScene} / {TOTAL_SCENES}
					</span>
					<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-moss/15 text-leaf2">
						{scTypeLabel}
					</span>
				</div>
				<div className="prompt-box">{promptOutput}</div>
				<div className="flex flex-wrap gap-2 mt-3">
					<button
						type="button"
						className="btn-primary"
						onClick={generatePrompt}
					>
						⚡ Generate Prompt Scene Ini
					</button>
					<button type="button" className="btn-outline" onClick={copyPrompt}>
						📋 Copy
					</button>
					<button type="button" className="btn-amber" onClick={nextScene}>
						Scene Berikutnya →
					</button>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">📦 Export Semua Prompt</div>
				<div className="flex flex-wrap gap-2">
					<button type="button" className="btn-primary" onClick={generateAll}>
						🎬 Generate Semua 12 Prompt
					</button>
					<button type="button" className="btn-outline" onClick={copyAll}>
						📋 Copy Semua
					</button>
					<button
						type="button"
						className="btn-ghost"
						onClick={() => setShowAllPrompts((v) => !v)}
					>
						👁 Lihat / Sembunyikan
					</button>
				</div>
				{showAllPrompts && allPrompts.length > 0 && (
					<div className="mt-4 flex flex-col gap-2">
						{allPrompts.map((p, i) => {
							const s = i + 1;
							const sceneType = sceneTypes[s] ?? scType;
							const label =
								(projectType === "restoration"
									? SCENE_TYPES.restoration[
											sceneType as keyof typeof SCENE_TYPES.restoration
										]
									: SCENE_TYPES.construction[
											sceneType as keyof typeof SCENE_TYPES.construction
										]) ?? String(sceneType);
							return (
								<div
									key={s}
									className="rounded-lg border border-leaf/15 bg-bark/20 p-3"
								>
									<div className="font-mono text-[10px] text-stone2 mb-2">
										◆ Scene {s}/{TOTAL_SCENES} · {mmss(i * SEC_PER_SCENE)}–
										{mmss((i + 1) * SEC_PER_SCENE)} ·{" "}
										<span className="text-leaf2">[{label}]</span>
									</div>
									<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
										{p}
									</pre>
								</div>
							);
						})}
					</div>
				)}
			</section>

			<div
				className={`toast-base bg-moss/95 text-white transition-all ${
					toast.show
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
				}`}
			>
				{toast.msg}
			</div>
		</div>
	);
}
