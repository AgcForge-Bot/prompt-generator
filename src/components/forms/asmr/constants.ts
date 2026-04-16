export const SCENE_TYPES = {
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
} as const;

export const SCENE_ORDER_REST = [
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
] as const;

export const SCENE_ORDER_CONS = [
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
] as const;

export const RANDOM_IDS = {
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
} as const;

export const TOD_DATA = {
	morning: {
		label: "MORNING (Pagi)",
		timeRange: "04:30–09:00",
		emoji: "🌅",
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
		emoji: "☀️",
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
		emoji: "🌇",
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
		emoji: "🌙",
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
} as const;

export const PHASE_DESC = {
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
} as const;

export const TOTAL_SCENES = 12;
export const SEC_PER_SCENE = 15;

export const DNA_OPTIONS = {
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

export const OPTIONS = {
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
		"\"Watch your clearance on the left side — keep it tight, good.\"",
		"\"Okay team, we're moving to phase three — mortar mix needs to be dryer.\"",
		"\"Don't rush the pour — let it settle naturally, trust the process.\"",
		"\"That joint needs more pressure — work it in with the trowel, yes, like that.\"",
		"\"Looking good from up here — keep that line straight, perfect.\"",
		"\"Safety check — everyone step back while we swing the beam over.\"",
		"\"The original stone goes back exactly where it came from — document everything.\"",
		"\"Beautiful work — this is the detail that makes the difference.\"",
		"\"Slow it down, this section is load-bearing — precision counts here.\"",
		"\"Mixing ratio three to one — not less, this is structural.\"",
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

