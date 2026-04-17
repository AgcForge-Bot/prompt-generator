// export const PHASE_RATIOS: Record<ScenePhaseKey, number> = {
// 	hook: 0.04,
// 	preparation: 0.07,
// 	journey: 0.16,
// 	arrival: 0.06,
// 	build: 0.33,
// 	challenge: 0.08,
// 	living: 0.18,
// 	closing: 0.08,
// };

// export const PHASE_META: Record<
// 	ScenePhaseKey,
// 	{ label: string; emoji: string; note: string }
// > = {
// 	hook: {
// 		label: "Opening Hook",
// 		emoji: "🎣",
// 		note: "Cuplikan highlight momen-momen paling dramatis dari video — bikin penonton langsung penasaran dan tidak bisa berhenti menonton. Show the best moments first.",
// 	},
// 	preparation: {
// 		label: "Preparation",
// 		emoji: "🎒",
// 		note: "Model mempersiapkan perlengkapan, perkakas, dan bekal sebelum berangkat. Tampilkan gear secara detail — makanan, alat, pakaian, peta.",
// 	},
// 	journey: {
// 		label: "Journey",
// 		emoji: "🚗",
// 		note: "Perjalanan menuju lokasi. Camera mix dari semua sudut: depan, sisi, belakang, drone udara. Silih bergantian antara model dan pemandangan sekitar seperti film dokumenter.",
// 	},
// 	arrival: {
// 		label: "Arrival & Scout",
// 		emoji: "🔍",
// 		note: "Model tiba di lokasi, menjelajahi area, memilih titik lokasi yang sempurna untuk membangun. Menjelang sore, cahaya mulai keemasan.",
// 	},
// 	build: {
// 		label: "Build Phase",
// 		emoji: "🏗️",
// 		note: "Fase terpanjang dan terpenting — membangun hunian dari awal hingga selesai. Tampilkan setiap tahap konstruksi secara detail dan satisfying.",
// 	},
// 	challenge: {
// 		label: "Challenges",
// 		emoji: "⚡",
// 		note: "Tantangan alam yang menginterupsi pembangunan: hujan lebat, badai salju, tanah longsor, area licin. Menambah drama dan ketegangan.",
// 	},
// 	living: {
// 		label: "Living & Relaxing",
// 		emoji: "🔥",
// 		note: "Hunian selesai. Berburu, memancing, memasak, menyantap makanan dengan ambient visual dan suara alam. Momen relaxing dan satisfying.",
// 	},
// 	closing: {
// 		label: "Closing Credits",
// 		emoji: "🌅",
// 		note: "Penutup seperti film — wide shot hunian di alam liar, credit title, momen refleksi, fade to nature.",
// 	},
// };

// // ─── SCENE TYPES ─────────────────────────────────────────────────────────────

// export const SCENE_TYPES_NORMAL: {
// 	key: SceneTypeKey;
// 	icon: string;
// 	name: string;
// }[] = [
// 		{ key: "establishing", icon: "🌲", name: "Establishing" },
// 		{ key: "action", icon: "⚒️", name: "Action / Craft" },
// 		{ key: "detail", icon: "🔍", name: "Detail Close-up" },
// 		{ key: "progress", icon: "📈", name: "Progress Reveal" },
// 		{ key: "nature", icon: "🌿", name: "Nature Shot" },
// 		{ key: "timelapse", icon: "⏱️", name: "Timelapse Jump" },
// 		{ key: "documentary", icon: "🎥", name: "Documentary POV" },
// 	];

// export const SCENE_TYPES_EMOTION: {
// 	key: SceneTypeKey;
// 	icon: string;
// 	name: string;
// }[] = [
// 		{ key: "emo-animal", icon: "🐾", name: "Animal Encounter" },
// 		{ key: "emo-civilian", icon: "👥", name: "Civilian Encounter" },
// 		{ key: "emo-wonder", icon: "🪨", name: "Wonder Discovery" },
// 		{ key: "emo-rescue", icon: "❤️", name: "Rescue Moment" },
// 		{ key: "emo-cook", icon: "🍳", name: "Cook & Eat" },
// 		{ key: "emo-fire", icon: "🔥", name: "Fire Making" },
// 		{ key: "emo-reflect", icon: "🌅", name: "Quiet Reflection" },
// 	];

// // ─── TIME OF DAY ─────────────────────────────────────────────────────────────

// export const TOD_DATA = {
// 	morning: {
// 		label: "Pagi",
// 		range: "04:30–09:00",
// 		emoji: "🌅",
// 		light:
// 			"warm golden sunrise — low raking angle, long soft shadows, dew on all surfaces, mist lifting from ground",
// 		mood: "meditative awakening — quiet, fresh air, first light revealing the world slowly",
// 		sound:
// 			"dawn chorus birds at peak richness, distant water, dew dripping from leaves",
// 		sky: "sky shifting from deep amber-rose to pale gold-blue, occasional wisp of pink cloud",
// 		hint: "Dew, mist, golden light, birdsong — paling cinematic untuk establishing shot",
// 	},
// 	noon: {
// 		label: "Siang",
// 		range: "09:00–15:00",
// 		emoji: "☀️",
// 		light:
// 			"harsh overhead sun — shafts cutting through canopy, deep shadow pools, bright lit surfaces",
// 		mood: "peak activity — maximum energy, full visibility, work at fastest pace",
// 		sound: "insects at peak — cicadas, buzzing life, fullest midday density",
// 		sky: "blue sky fragments through canopy, white cumulus clouds drifting",
// 		hint: "Harsh contrast, maximum activity — cocok untuk build phase sibuk",
// 	},
// 	afternoon: {
// 		label: "Sore",
// 		range: "15:00–19:00",
// 		emoji: "🌇",
// 		light:
// 			"amber golden hour — low warm directional light, long dramatic shadows, materials glowing warm",
// 		mood: "winding down — slower deliberate pace, richer beautiful light, nearing day end",
// 		sound:
// 			"afternoon wind through trees, birds returning, insects quieting, cooling air",
// 		sky: "golden amber and coral sky in clearings, clouds catching warm sunset color",
// 		hint: "Magic hour — paling indah untuk living scenes dan emotional moments",
// 	},
// 	night: {
// 		label: "Malam",
// 		range: "19:00–04:30",
// 		emoji: "🌙",
// 		light:
// 			"fire glow and starlight — warm orange firelight on structures, cool deep blue-black sky above",
// 		mood: "primal intimacy — darkness beyond the fire circle, work slows to essential tasks only",
// 		sound:
// 			"night forest fully alive — frogs, owls, crickets, deep forest sounds echoing",
// 		sky: "stars visible through canopy gaps, moonlight silver-filtering through leaves",
// 		hint: "Api, bintang, suara malam — paling atmospheric untuk relaxing living scenes",
// 	},
// };

// // ─── DNA DEFAULT ─────────────────────────────────────────────────────────────

// export const DNA_DEFAULTS: ProjectDNA = {
// 	videoTitle:
// 		"Surviving 10 Days in the Forest — Extreme Temperature — Emotional Survival Story",
// 	modelGender: "male",
// 	hasPet: false,
// 	petType: "loyal dog — medium breed, follows closely, rests by fire at night",
// 	travelMode: "foot",
// 	location:
// 		"dense ancient temperate rainforest — towering moss-covered trees, fern-carpeted floor, streams nearby",
// 	climate:
// 		"temperate autumn — golden foliage, occasional rain, crisp cool air, misty mornings",
// 	shelterType:
// 		"modern mini house built underground — excavated earth shelter with timber frame, glass window, wood stove inside",
// 	buildMaterial:
// 		"hand-split local timber, excavated earth, clay, river stone — traditional meets functional modern",
// 	hasCargoDrop: false,
// 	furnishings: [
// 		"wood burning stove",
// 		"small wooden bed with moss mattress",
// 		"hand-carved shelf",
// 		"oil lantern",
// 		"cast iron cookware",
// 	],
// 	colorPalette:
// 		"deep forest green, rich earth brown, moss grey, warm amber firelight",
// 	soundscape:
// 		"zero music — pure ambient forest sound, ASMR craft sounds, natural environment only",
// 	filmStyle:
// 		"shot on Sony FX3 or RED Komodo — handheld documentary, organic natural motion, 24fps cinematic",
// 	locked: false,
// };

// // ─── OPTION LISTS ─────────────────────────────────────────────────────────────

// export const LOCATION_OPTIONS = [
// 	{
// 		value:
// 			"dense ancient temperate rainforest — towering moss-covered trees, fern-carpeted floor, clear streams",
// 		label: "🌲 Hutan Hujan Kuno — Pohon raksasa berlumut",
// 	},
// 	{
// 		value:
// 			"remote tropical jungle — thick green canopy, red clay soil, humid haze, river sound constant",
// 		label: "🌴 Hutan Tropis Terpencil — Tanah merah, lembab",
// 	},
// 	{
// 		value:
// 			"cold northern boreal forest — spruce and pine, moss ground cover, grey winter light",
// 		label: "❄️ Hutan Boreal Utara — Pinus, salju tipis",
// 	},
// 	{
// 		value:
// 			"dramatic mountain forest clearing at altitude — panoramic valley views, rocky outcrops, cold streams",
// 		label: "⛰️ Hutan Pegunungan — Panorama lembah, bebatuan",
// 	},
// 	{
// 		value:
// 			"serene forest lake shore — wide calm lake reflecting forest, sandy banks, willow trees, morning mist",
// 		label: "🏞️ Tepi Danau Hutan — Danau tenang, pohon willow",
// 	},
// 	{
// 		value:
// 			"vast snowy arctic tundra — endless white, sparse tree line, dramatic northern sky",
// 		label: "🏔️ Tundra Arktik Bersalju — Salju luas, langit dramatis",
// 	},
// 	{
// 		value:
// 			"deep snow Norwegian forest — tall dark pines heavily snow-laden, complete silence except wind",
// 		label: "🇳🇴 Hutan Salju Norwegia — Pinus bersalju, sunyi",
// 	},
// 	{
// 		value:
// 			"bamboo forest clearing — dense golden-green bamboo columns, rustling sound, filtered light",
// 		label: "🎋 Hutan Bambu — Kolom bambu, cahaya tersaring",
// 	},
// 	{
// 		value:
// 			"coastal pine forest — ocean visible through trees, rocky shore, salt air, driftwood",
// 		label: "🌊 Hutan Pinus Pantai — Laut, karang, kayu apung",
// 	},
// 	{
// 		value:
// 			"high altitude alpine meadow — wildflowers, granite outcrops, snow-capped peaks visible",
// 		label: "🏕️ Padang Alpin — Bunga liar, puncak bersalju",
// 	},
// ];

// export const CLIMATE_OPTIONS = [
// 	{
// 		value:
// 			"temperate autumn — golden amber foliage, cool crisp air, morning mist, occasional light rain",
// 		label: "🍂 Gugur — Daun emas, udara sejuk, kabut pagi",
// 	},
// 	{
// 		value:
// 			"temperate spring — fresh new growth, wildflowers, cool mornings, longer days",
// 		label: "🌸 Semi — Vegetasi baru, bunga liar, pagi sejuk",
// 	},
// 	{
// 		value:
// 			"full summer — lush rich vegetation, long daylight hours, warm humid conditions",
// 		label: "☀️ Panas — Vegetasi lebat, hari panjang, lembab",
// 	},
// 	{
// 		value:
// 			"deep winter — heavy snow on ground, below-zero temperatures, breath visible, frozen streams",
// 		label: "❄️ Musim Dingin — Salju tebal, suhu minus, napas mengepul",
// 	},
// 	{
// 		value:
// 			"tropical wet season — intense brief rain bursts, steam rising from hot earth, dripping canopy",
// 		label: "🌧️ Musim Hujan Tropis — Hujan lebat singkat, uap tanah",
// 	},
// 	{
// 		value:
// 			"Nordic late autumn — long twilight, dramatic moody sky, first snowfall possible",
// 		label: "🌑 Akhir Gugur Nordic — Senja panjang, langit dramatis",
// 	},
// 	{
// 		value:
// 			"Mediterranean dry summer — warm dry air, cicadas, golden dry grass, clear blue sky",
// 		label: "🫒 Mediterania Kering — Udara hangat, belalang, rumput emas",
// 	},
// 	{
// 		value:
// 			"sub-zero arctic — extreme cold below -30°C, whiteout conditions possible, survival critical",
// 		label: "🥶 Arktik Ekstrem — Dibawah -30°C, kondisi survival kritis",
// 	},
// ];

// export const SHELTER_OPTIONS = [
// 	{
// 		value:
// 			"modern mini underground house — deeply excavated earth bunker with timber frame, large glass window, wood burning stove, cozy interior lighting",
// 		label: "🏚️ Underground House Modern — Bunker bumi, kaca besar",
// 	},
// 	{
// 		value:
// 			"luxury underground shelter in heavy rain — waterproofed earth shelter, full interior amenities, watching rain from inside",
// 		label: "🌧️ Underground Shelter Mewah — Tahan hujan, nyaman",
// 	},
// 	{
// 		value:
// 			"mini house inside a massive ancient tree trunk — hollowed living tree, carved interior, natural wood walls everywhere",
// 		label: "🌳 Mini House Dalam Pohon — Di dalam batang pohon raksasa",
// 	},
// 	{
// 		value:
// 			"elevated mini tree house — built on large branches, rope access, forest canopy view, wooden platform and walls",
// 		label: "🌲 Treehouse Elevated — Di atas pohon, pemandangan kanopi",
// 	},
// 	{
// 		value:
// 			"luxury underground snow bunker — dug beneath snow surface, insulated walls, fire inside, warm against extreme cold",
// 		label: "❄️ Snow Bunker Mewah — Di bawah salju, hangat di dalam",
// 	},
// 	{
// 		value:
// 			"modern basement mini house — stone foundation below ground, modern interior contrasting wild exterior",
// 		label: "🏠 Basement Mini House — Fondasi batu, interior modern",
// 	},
// 	{
// 		value:
// 			"primitive stone and timber shelter — dry-stone walls, heavy timber roof, earth floor, fire pit center",
// 		label: "🪨 Shelter Batu & Kayu — Dinding batu kering, atap kayu",
// 	},
// 	{
// 		value:
// 			"lakeside cabin on stilts — built over shallow lake edge, reflection in water, fishing from doorstep",
// 		label: "🛶 Kabin Danau di Atas Air — Di tepi danau, panggung",
// 	},
// ];

// export const TRAVEL_MODE_OPTIONS: {
// 	value: TravelMode;
// 	label: string;
// 	vehicleNote: string;
// }[] = [
// 		{
// 			value: "foot",
// 			label: "🥾 Jalan Kaki",
// 			vehicleNote:
// 				"heavy backpack with all gear strapped, trekking poles, boots on varied terrain",
// 		},
// 		{
// 			value: "camper-van",
// 			label: "🚐 Camper Van",
// 			vehicleNote:
// 				"vintage or modern 4WD camper van — interior shots of living space, driving through scenic roads",
// 		},
// 		{
// 			value: "snowfox",
// 			label: "🛷 Snowfox / Snowmobile",
// 			vehicleNote:
// 				"snowmobile or dog sled through white landscape — speed, snow spray, dramatic movement",
// 		},
// 		{
// 			value: "bicycle",
// 			label: "🚲 Sepeda Gunung",
// 			vehicleNote:
// 				"loaded touring mountain bicycle — panniers full, riding forest trails and dirt roads",
// 		},
// 		{
// 			value: "motorbike",
// 			label: "🏍️ Motor Off-road",
// 			vehicleNote:
// 				"adventure motorcycle or dirt bike — muddy trails, river crossings, dramatic off-road riding",
// 		},
// 	];

// export const GENDER_OPTIONS: {
// 	value: ModelGender;
// 	label: string;
// 	desc: string;
// }[] = [
// 		{
// 			value: "male",
// 			label: "👨 Laki-laki",
// 			desc: "weathered outdoorsman — capable, calm, experienced in wilderness craft",
// 		},
// 		{
// 			value: "female",
// 			label: "👩 Perempuan",
// 			desc: "skilled outdoor woman — strong, knowledgeable, self-sufficient wilderness expert",
// 		},
// 	];

// export const FILM_STYLE_OPTIONS = [
// 	{
// 		value:
// 			"shot on Sony FX3 — 24mm handheld documentary, organic natural motion blur, 24fps cinematic, subtle film grain, no CGI",
// 		label: "📷 Sony FX3 Documentary — 24fps, handheld, organic",
// 	},
// 	{
// 		value:
// 			"shot on RED Komodo 6K — 28mm slightly wide, stabilized but breathing, raw cinematic look, Kodak emulation grade",
// 		label: "🎬 RED Komodo 6K — Raw cinematic, Kodak grade",
// 	},
// 	{
// 		value:
// 			"shot on GoPro Hero12 + drone DJI Air 3 — mixed POV and aerial, action documentary style, real-world motion",
// 		label: "🎥 GoPro + DJI Drone — POV + aerial, action doc",
// 	},
// 	{
// 		value:
// 			"shot on ARRI Alexa Mini — 35mm cinema lens, natural skin tones, organic highlight roll-off, film-like depth",
// 		label: "🎞️ ARRI Alexa Mini — Cinema lens, film depth",
// 	},
// 	{
// 		value:
// 			"shot on iPhone 15 Pro cinematic mode — intimate vérité style, close and personal, ultra-real documentary",
// 		label: "📱 iPhone Cinematic — Vérité, ultra personal realism",
// 	},
// ];

// export const ANTI_CGI_RULES = `
// CRITICAL REALISM RULES — STRICTLY ENFORCE:
// • NO CGI, NO 3D rendering, NO digital animation — photographic realism ONLY
// • NO unrealistic slow motion unless dramatically specified
// • NO superhuman movements — all motion is natural human pace
// • NO objects with wrong scale — everything correct real-world size
// • NO floating, no teleportation between scenes — continuous spatial logic
// • NO perfect lighting — use naturalistic imperfect real-world light
// • Motion: natural camera breathing, organic handheld micro-movement
// • Film grain visible — analogue texture, not digital clean
// • Depth of field: real lens physics — shallow in close-up, deep in wide
// • Color: no over-saturation — real-world honest color response
// • Continuity: same person, same clothes, same location, same structure stage
// `.trim();
