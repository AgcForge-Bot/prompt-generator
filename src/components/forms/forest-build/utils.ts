import type { PhaseMeta, ScenePhaseKey, SceneTypeKey, ProjectDNA, TravelMode, ModelGender } from './types'

// ─── PHASES ─────────────────────────────────────────────────────────────────

export const PHASE_RATIOS: Record<ScenePhaseKey, number> = {
	hook: 0.04,
	preparation: 0.07,
	journey: 0.16,
	arrival: 0.06,
	build: 0.33,
	challenge: 0.08,
	living: 0.18,
	closing: 0.08,
}

export const PHASE_META: Record<ScenePhaseKey, { label: string; emoji: string; note: string }> = {
	hook: {
		label: 'Opening Hook',
		emoji: '🎣',
		note: 'Cuplikan highlight momen-momen paling dramatis dari video — bikin penonton langsung penasaran dan tidak bisa berhenti menonton. Show the best moments first.',
	},
	preparation: {
		label: 'Preparation',
		emoji: '🎒',
		note: 'Model mempersiapkan perlengkapan, perkakas, dan bekal sebelum berangkat. Tampilkan gear secara detail — makanan, alat, pakaian, peta.',
	},
	journey: {
		label: 'Journey',
		emoji: '🚗',
		note: 'Perjalanan menuju lokasi. Camera mix dari semua sudut: depan, sisi, belakang, drone udara. Silih bergantian antara model dan pemandangan sekitar seperti film dokumenter.',
	},
	arrival: {
		label: 'Arrival & Scout',
		emoji: '🔍',
		note: 'Model tiba di lokasi, menjelajahi area, memilih titik lokasi yang sempurna untuk membangun. Menjelang sore, cahaya mulai keemasan.',
	},
	build: {
		label: 'Build Phase',
		emoji: '🏗️',
		note: 'Fase terpanjang dan terpenting — membangun hunian dari awal hingga selesai. Tampilkan setiap tahap konstruksi secara detail dan satisfying.',
	},
	challenge: {
		label: 'Challenges',
		emoji: '⚡',
		note: 'Tantangan alam yang menginterupsi pembangunan: hujan lebat, badai salju, tanah longsor, area licin. Menambah drama dan ketegangan.',
	},
	living: {
		label: 'Living & Relaxing',
		emoji: '🔥',
		note: 'Hunian selesai. Berburu, memancing, memasak, menyantap makanan dengan ambient visual dan suara alam. Momen relaxing dan satisfying.',
	},
	closing: {
		label: 'Closing Credits',
		emoji: '🌅',
		note: 'Penutup seperti film — wide shot hunian di alam liar, credit title, momen refleksi, fade to nature.',
	},
}

// ─── SCENE TYPES ─────────────────────────────────────────────────────────────

export const SCENE_TYPES_NORMAL: { key: SceneTypeKey; icon: string; name: string }[] = [
	{ key: 'establishing', icon: '🌲', name: 'Establishing' },
	{ key: 'action', icon: '⚒️', name: 'Action / Craft' },
	{ key: 'detail', icon: '🔍', name: 'Detail Close-up' },
	{ key: 'progress', icon: '📈', name: 'Progress Reveal' },
	{ key: 'nature', icon: '🌿', name: 'Nature Shot' },
	{ key: 'timelapse', icon: '⏱️', name: 'Timelapse Jump' },
	{ key: 'documentary', icon: '🎥', name: 'Documentary POV' },
]

export const SCENE_TYPES_EMOTION: { key: SceneTypeKey; icon: string; name: string }[] = [
	{ key: 'emo-animal', icon: '🐾', name: 'Animal Encounter' },
	{ key: 'emo-civilian', icon: '👥', name: 'Civilian Encounter' },
	{ key: 'emo-wonder', icon: '🪨', name: 'Wonder Discovery' },
	{ key: 'emo-rescue', icon: '❤️', name: 'Rescue Moment' },
	{ key: 'emo-cook', icon: '🍳', name: 'Cook & Eat' },
	{ key: 'emo-fire', icon: '🔥', name: 'Fire Making' },
	{ key: 'emo-reflect', icon: '🌅', name: 'Quiet Reflection' },
]

// ─── TIME OF DAY ─────────────────────────────────────────────────────────────

export const TOD_DATA = {
	morning: {
		label: 'Pagi',
		range: '04:30–09:00',
		emoji: '🌅',
		light: 'warm golden sunrise — low raking angle, long soft shadows, dew on all surfaces, mist lifting from ground',
		mood: 'meditative awakening — quiet, fresh air, first light revealing the world slowly',
		sound: 'dawn chorus birds at peak richness, distant water, dew dripping from leaves',
		sky: 'sky shifting from deep amber-rose to pale gold-blue, occasional wisp of pink cloud',
		hint: 'Dew, mist, golden light, birdsong — paling cinematic untuk establishing shot',
	},
	noon: {
		label: 'Siang',
		range: '09:00–15:00',
		emoji: '☀️',
		light: 'harsh overhead sun — shafts cutting through canopy, deep shadow pools, bright lit surfaces',
		mood: 'peak activity — maximum energy, full visibility, work at fastest pace',
		sound: 'insects at peak — cicadas, buzzing life, fullest midday density',
		sky: 'blue sky fragments through canopy, white cumulus clouds drifting',
		hint: 'Harsh contrast, maximum activity — cocok untuk build phase sibuk',
	},
	afternoon: {
		label: 'Sore',
		range: '15:00–19:00',
		emoji: '🌇',
		light: 'amber golden hour — low warm directional light, long dramatic shadows, materials glowing warm',
		mood: 'winding down — slower deliberate pace, richer beautiful light, nearing day end',
		sound: 'afternoon wind through trees, birds returning, insects quieting, cooling air',
		sky: 'golden amber and coral sky in clearings, clouds catching warm sunset color',
		hint: 'Magic hour — paling indah untuk living scenes dan emotional moments',
	},
	night: {
		label: 'Malam',
		range: '19:00–04:30',
		emoji: '🌙',
		light: 'fire glow and starlight — warm orange firelight on structures, cool deep blue-black sky above',
		mood: 'primal intimacy — darkness beyond the fire circle, work slows to essential tasks only',
		sound: 'night forest fully alive — frogs, owls, crickets, deep forest sounds echoing',
		sky: 'stars visible through canopy gaps, moonlight silver-filtering through leaves',
		hint: 'Api, bintang, suara malam — paling atmospheric untuk relaxing living scenes',
	},
}

// ─── DNA DEFAULT ─────────────────────────────────────────────────────────────

export const DNA_DEFAULTS: ProjectDNA = {
	videoTitle: 'Surviving 10 Days in the Forest — Extreme Temperature — Emotional Survival Story',
	modelGender: 'male',
	hasPet: false,
	petType: 'loyal dog — medium breed, follows closely, rests by fire at night',
	travelMode: 'foot',
	location: 'dense ancient temperate rainforest — towering moss-covered trees, fern-carpeted floor, streams nearby',
	climate: 'temperate autumn — golden foliage, occasional rain, crisp cool air, misty mornings',
	shelterType: 'modern mini house built underground — excavated earth shelter with timber frame, glass window, wood stove inside',
	buildMaterial: 'hand-split local timber, excavated earth, clay, river stone — traditional meets functional modern',
	hasCargoDrop: false,
	furnishings: ['wood burning stove', 'small wooden bed with moss mattress', 'hand-carved shelf', 'oil lantern', 'cast iron cookware'],
	colorPalette: 'deep forest green, rich earth brown, moss grey, warm amber firelight',
	soundscape: 'zero music — pure ambient forest sound, ASMR craft sounds, natural environment only',
	filmStyle: 'shot on Sony FX3 or RED Komodo — handheld documentary, organic natural motion, 24fps cinematic',
	locked: false,
	characterAge: 'appears early 30s — mature but young, slight weathering on skin',
	characterFace: 'strong square jaw, high cheekbones, slightly weathered tan skin, calm deep-set brown eyes, short neat beard — 3 to 5 day stubble',
	characterHair: 'dark brown short hair — slightly overgrown, natural texture, tucked under a worn olive-green beanie hat',
	characterBuild: 'lean and wiry — low body fat, visible muscle definition from real outdoor work, not gym-built',
	characterOutfit: 'faded olive-green canvas field jacket over dark grey thermal henley — worn brown leather work gloves, dark cargo pants with dirt and sawdust, lace-up brown leather boots caked with dried mud',
	characterGear: 'N/A — traveling entirely on foot',
	vehicleDesc: 'N/A — traveling entirely on foot',
	shelterDimension: 'approximately 3m wide × 4m long × 2.2m interior height — compact but fully functional single-room space',
	shelterExterior: 'entrance is a low doorway with hand-crafted timber door on leather hinges — earth mound visible above, small glass window on south face, ventilation pipe protruding from roof',
	shelterInterior: 'wood-burning cast iron stove on left wall — black pipe going up through roof, small wooden platform bed on right with wool blanket, single timber shelf above bed, oil lantern hanging from ceiling',
}

// ─── OPTION LISTS ─────────────────────────────────────────────────────────────

export const LOCATION_OPTIONS = [
	{ value: 'dense ancient temperate rainforest — towering moss-covered trees, fern-carpeted floor, clear streams', label: '🌲 Hutan Hujan Kuno — Pohon raksasa berlumut' },
	{ value: 'remote tropical jungle — thick green canopy, red clay soil, humid haze, river sound constant', label: '🌴 Hutan Tropis Terpencil — Tanah merah, lembab' },
	{ value: 'cold northern boreal forest — spruce and pine, moss ground cover, grey winter light', label: '❄️ Hutan Boreal Utara — Pinus, salju tipis' },
	{ value: 'dramatic mountain forest clearing at altitude — panoramic valley views, rocky outcrops, cold streams', label: '⛰️ Hutan Pegunungan — Panorama lembah, bebatuan' },
	{ value: 'serene forest lake shore — wide calm lake reflecting forest, sandy banks, willow trees, morning mist', label: '🏞️ Tepi Danau Hutan — Danau tenang, pohon willow' },
	{ value: 'vast snowy arctic tundra — endless white, sparse tree line, dramatic northern sky', label: '🏔️ Tundra Arktik Bersalju — Salju luas, langit dramatis' },
	{ value: 'deep snow Norwegian forest — tall dark pines heavily snow-laden, complete silence except wind', label: '🇳🇴 Hutan Salju Norwegia — Pinus bersalju, sunyi' },
	{ value: 'bamboo forest clearing — dense golden-green bamboo columns, rustling sound, filtered light', label: '🎋 Hutan Bambu — Kolom bambu, cahaya tersaring' },
	{ value: 'coastal pine forest — ocean visible through trees, rocky shore, salt air, driftwood', label: '🌊 Hutan Pinus Pantai — Laut, karang, kayu apung' },
	{ value: 'high altitude alpine meadow — wildflowers, granite outcrops, snow-capped peaks visible', label: '🏕️ Padang Alpin — Bunga liar, puncak bersalju' },
]

export const CLIMATE_OPTIONS = [
	{ value: 'temperate autumn — golden amber foliage, cool crisp air, morning mist, occasional light rain', label: '🍂 Gugur — Daun emas, udara sejuk, kabut pagi' },
	{ value: 'temperate spring — fresh new growth, wildflowers, cool mornings, longer days', label: '🌸 Semi — Vegetasi baru, bunga liar, pagi sejuk' },
	{ value: 'full summer — lush rich vegetation, long daylight hours, warm humid conditions', label: '☀️ Panas — Vegetasi lebat, hari panjang, lembab' },
	{ value: 'deep winter — heavy snow on ground, below-zero temperatures, breath visible, frozen streams', label: '❄️ Musim Dingin — Salju tebal, suhu minus, napas mengepul' },
	{ value: 'tropical wet season — intense brief rain bursts, steam rising from hot earth, dripping canopy', label: '🌧️ Musim Hujan Tropis — Hujan lebat singkat, uap tanah' },
	{ value: 'Nordic late autumn — long twilight, dramatic moody sky, first snowfall possible', label: '🌑 Akhir Gugur Nordic — Senja panjang, langit dramatis' },
	{ value: 'Mediterranean dry summer — warm dry air, cicadas, golden dry grass, clear blue sky', label: '🫒 Mediterania Kering — Udara hangat, belalang, rumput emas' },
	{ value: 'sub-zero arctic — extreme cold below -30°C, whiteout conditions possible, survival critical', label: '🥶 Arktik Ekstrem — Dibawah -30°C, kondisi survival kritis' },
]

export const SHELTER_OPTIONS = [
	{ value: 'modern mini underground house — deeply excavated earth bunker with timber frame, large glass window, wood burning stove, cozy interior lighting', label: '🏚️ Underground House Modern — Bunker bumi, kaca besar' },
	{ value: 'luxury underground shelter in heavy rain — waterproofed earth shelter, full interior amenities, watching rain from inside', label: '🌧️ Underground Shelter Mewah — Tahan hujan, nyaman' },
	{ value: 'mini house inside a massive ancient tree trunk — hollowed living tree, carved interior, natural wood walls everywhere', label: '🌳 Mini House Dalam Pohon — Di dalam batang pohon raksasa' },
	{ value: 'elevated mini tree house — built on large branches, rope access, forest canopy view, wooden platform and walls', label: '🌲 Treehouse Elevated — Di atas pohon, pemandangan kanopi' },
	{ value: 'luxury underground snow bunker — dug beneath snow surface, insulated walls, fire inside, warm against extreme cold', label: '❄️ Snow Bunker Mewah — Di bawah salju, hangat di dalam' },
	{ value: 'modern basement mini house — stone foundation below ground, modern interior contrasting wild exterior', label: '🏠 Basement Mini House — Fondasi batu, interior modern' },
	{ value: 'primitive stone and timber shelter — dry-stone walls, heavy timber roof, earth floor, fire pit center', label: '🪨 Shelter Batu & Kayu — Dinding batu kering, atap kayu' },
	{ value: 'lakeside cabin on stilts — built over shallow lake edge, reflection in water, fishing from doorstep', label: '🛶 Kabin Danau di Atas Air — Di tepi danau, panggung' },
]

export const TRAVEL_MODE_OPTIONS: { value: TravelMode; label: string; vehicleNote: string }[] = [
	{ value: 'foot', label: '🥾 Jalan Kaki', vehicleNote: 'heavy backpack with all gear strapped, trekking poles, boots on varied terrain' },
	{ value: 'camper-van', label: '🚐 Camper Van', vehicleNote: 'vintage or modern 4WD camper van — interior shots of living space, driving through scenic roads' },
	{ value: 'snowfox', label: '🛷 Snowfox / Snowmobile', vehicleNote: 'snowmobile or dog sled through white landscape — speed, snow spray, dramatic movement' },
	{ value: 'bicycle', label: '🚲 Sepeda Gunung', vehicleNote: 'loaded touring mountain bicycle — panniers full, riding forest trails and dirt roads' },
	{ value: 'motorbike', label: '🏍️ Motor Off-road', vehicleNote: 'adventure motorcycle or dirt bike — muddy trails, river crossings, dramatic off-road riding' },
]

export const GENDER_OPTIONS: { value: ModelGender; label: string; desc: string }[] = [
	{ value: 'male', label: '👨 Laki-laki', desc: 'weathered outdoorsman — capable, calm, experienced in wilderness craft' },
	{ value: 'female', label: '👩 Perempuan', desc: 'skilled outdoor woman — strong, knowledgeable, self-sufficient wilderness expert' },
]

export const FILM_STYLE_OPTIONS = [
	{ value: 'shot on Sony FX3 — 24mm handheld documentary, organic natural motion blur, 24fps cinematic, subtle film grain, no CGI', label: '📷 Sony FX3 Documentary — 24fps, handheld, organic' },
	{ value: 'shot on RED Komodo 6K — 28mm slightly wide, stabilized but breathing, raw cinematic look, Kodak emulation grade', label: '🎬 RED Komodo 6K — Raw cinematic, Kodak grade' },
	{ value: 'shot on GoPro Hero12 + drone DJI Air 3 — mixed POV and aerial, action documentary style, real-world motion', label: '🎥 GoPro + DJI Drone — POV + aerial, action doc' },
	{ value: 'shot on ARRI Alexa Mini — 35mm cinema lens, natural skin tones, organic highlight roll-off, film-like depth', label: '🎞️ ARRI Alexa Mini — Cinema lens, film depth' },
	{ value: 'shot on iPhone 15 Pro cinematic mode — intimate vérité style, close and personal, ultra-real documentary', label: '📱 iPhone Cinematic — Vérité, ultra personal realism' },
]

export const ANTI_CGI_RULES = `
CRITICAL REALISM RULES — STRICTLY ENFORCE:
• NO CGI, NO 3D rendering, NO digital animation — photographic realism ONLY
• NO unrealistic slow motion unless dramatically specified
• NO superhuman movements — all motion is natural human pace
• NO objects with wrong scale — everything correct real-world size
• NO floating, no teleportation between scenes — continuous spatial logic
• NO perfect lighting — use naturalistic imperfect real-world light
• Motion: natural camera breathing, organic handheld micro-movement
• Film grain visible — analogue texture, not digital clean
• Depth of field: real lens physics — shallow in close-up, deep in wide
• Color: no over-saturation — real-world honest color response
• Continuity: same person, same clothes, same location, same structure stage
`.trim()

// ─── CHARACTER ANCHOR OPTIONS ────────────────────────────────────────────────

export const CHARACTER_AGE_OPTIONS = [
	{ value: 'appears mid-20s — young adult, lean face, energetic posture', label: '🧑 Mid 20-an — Muda, lean, energik' },
	{ value: 'appears early 30s — mature but young, slight weathering on skin', label: '👤 Awal 30-an — Dewasa muda, sedikit weathered' },
	{ value: 'appears mid-30s — experienced look, strong jaw, calm eyes', label: '🧔 Mid 30-an — Berpengalaman, rahang kuat' },
	{ value: 'appears early 40s — rugged weathered face, deep-set calm eyes, grey at temples', label: '🧓 Awal 40-an — Wajah weathered, abu di pelipis' },
]

export const CHARACTER_FACE_MALE_OPTIONS = [
	{ value: 'strong square jaw, high cheekbones, slightly weathered tan skin, calm deep-set brown eyes, short neat beard — 3 to 5 day stubble', label: '🧔 Rahang persegi, pipi tinggi, janggut pendek' },
	{ value: 'oval face, clean-shaven, sharp dark eyes, tanned complexion, thin lips, prominent nose — classic rugged outdoorsman', label: '👤 Wajah oval, bersih, mata tajam, kulit coklat' },
	{ value: 'broad forehead, bushy dark eyebrows, full short beard trimmed neat, olive skin, dark brown eyes — Mediterranean rugged look', label: '🧔 Dahi lebar, alis tebal, janggut penuh rapi' },
	{ value: 'narrow angular face, high cheekbones, light stubble, pale Nordic skin, ice-blue or grey eyes, strong brow ridge', label: '🧖 Wajah angular, kulit Nordic pucat, mata biru-abu' },
]

export const CHARACTER_FACE_FEMALE_OPTIONS = [
	{ value: 'strong defined cheekbones, clear confident hazel eyes, light freckles across nose, natural tanned skin, no heavy makeup', label: '👩 Tulang pipi kuat, mata hazel, freckles alami' },
	{ value: 'round soft face, dark almond-shaped eyes, olive warm skin tone, natural full brows, calm determined expression', label: '👩 Wajah bulat lembut, mata almond gelap, kulit olive' },
	{ value: 'angular jaw, sharp green eyes, pale skin with rosy cheeks from cold air, strong Nordic bone structure', label: '👩 Rahang angular, mata hijau, kulit pucat Nordic' },
	{ value: 'wide warm brown eyes, gentle smile lines, sun-kissed golden-brown skin, high forehead, serene capable expression', label: '👩 Mata coklat lebar, kulit golden-brown, ekspresi tenang' },
]

export const CHARACTER_HAIR_MALE_OPTIONS = [
	{ value: 'dark brown short hair — slightly overgrown, natural texture, tucked under a worn olive-green beanie hat', label: '🧢 Rambut coklat pendek + beanie olive' },
	{ value: 'black medium-length hair tied back in a short ponytail or bun — keeps it practical and out of the way', label: '🎋 Rambut hitam sedang, diikat ponytail pendek' },
	{ value: 'sandy blond hair, slightly wavy, pushed back or under a dark wool cap — sun-lightened tips', label: '👱 Rambut pirang pasir, agak bergelombang' },
	{ value: 'dark grey and black mixed hair — salt and pepper, cut short, natural at sides', label: '🌫️ Rambut abu-hitam campuran, potong pendek alami' },
]

export const CHARACTER_HAIR_FEMALE_OPTIONS = [
	{ value: 'dark brown hair in a practical high braid or ponytail — stays tidy during physical work', label: '💆 Rambut coklat gelap, kepang tinggi praktis' },
	{ value: 'auburn-red hair tucked completely under a weathered brown wool beanie, loose strands at neck', label: '🧣 Rambut auburn tersembunyi di beanie coklat' },
	{ value: 'black straight hair in two braids — traditional style, practical for outdoor work', label: '🎋 Rambut hitam lurus, dua kepang tradisional' },
	{ value: 'dirty blonde wavy hair in loose bun secured with a stick or elastic — messy but intentional', label: '🌾 Rambut pirang kotor, sanggul lepas diikat ranting' },
]

export const CHARACTER_BUILD_OPTIONS = [
	{ value: 'lean and wiry — low body fat, visible muscle definition from real outdoor work, not gym-built', label: '💪 Kurus berurat — otot nyata dari kerja luar' },
	{ value: 'medium athletic build — broad shoulders, strong arms, natural outdoor physique, moves efficiently', label: '🏋️ Atletis sedang — bahu lebar, gerak efisien' },
	{ value: 'stocky and powerful — compact strong build, wide shoulders, thick forearms, stable center of gravity', label: '🪨 Kekar kompak — bahu lebar, lengan besar, stabil' },
	{ value: 'tall and rangy — long limbs, economical movement, natural grace in rough terrain', label: '📏 Tinggi panjang — anggota tubuh panjang, gerak alami' },
]

export const CHARACTER_OUTFIT_MALE_OPTIONS = [
	{ value: 'faded olive-green canvas field jacket over dark grey thermal henley — worn brown leather work gloves, dark cargo pants with dirt and sawdust, lace-up brown leather boots caked with dried mud', label: '🟢 Jaket canvas olive, celana cargo, boots coklat berlumpur' },
	{ value: 'dark navy wool flannel shirt with sleeves rolled to elbows, dark brown canvas work trousers with reinforced knees, black rubber-soled leather boots, worn leather belt', label: '🔵 Flannel navy, celana canvas coklat, boots hitam' },
	{ value: 'heather grey base layer, dark olive puffer vest, dark green waterproof shell jacket tied at waist, charcoal work trousers, green rubber boots', label: '⛰️ Layer abu + vest olive + jaket waterproof hijau' },
	{ value: 'cream linen long-sleeve rolled up, dark brown leather suspenders, sand-colored thick cotton trousers, weathered tan leather boots — rustic artisan look', label: '🌾 Linen krem, suspender kulit, sepatu tan vintage' },
]

export const CHARACTER_OUTFIT_FEMALE_OPTIONS = [
	{ value: 'moss-green canvas jacket over cream thermal shirt, dark rust-brown work pants with cargo pockets, worn ankle-height leather boots, dark green wool scarf around neck', label: '🟢 Jaket canvas hijau, celana rust-brown, boots kulit' },
	{ value: 'navy blue thick wool sweater, dark forest green waterproof shell trousers, black rubber boots, plum-colored wool beanie, fingerless knit gloves', label: '🔵 Sweater wool navy, celana waterproof, boots hitam' },
	{ value: 'dark burgundy quilted vest over pale grey thermal, slate blue work trousers, brown leather lace-up boots, cognac leather belt, small hatchet on hip', label: '🍷 Vest burgundi, celana biru slate, boots kulit coklat' },
	{ value: 'cream chunky knit sweater, olive green wide-leg work trousers, dark brown tall lace-up boots, tan canvas utility vest over sweater', label: '🌾 Sweater rajutan krem, celana olive, boots coklat tinggi' },
]

export const VEHICLE_OPTIONS: Record<TravelMode, { value: string; label: string }[]> = {
	'foot': [
		{ value: 'N/A — traveling entirely on foot', label: 'N/A (Jalan Kaki)' },
	],
	'camper-van': [
		{ value: 'a 1980s-era Toyota Land Cruiser FJ45 camper — faded olive-green paint, white roof rack loaded with gear, orange spare tire cover on rear, slight rust at wheel arches, diesel engine sound', label: '🚐 Toyota FJ45 Camper — Olive green, vintage, roof rack' },
		{ value: 'a modern Mercedes Sprinter 4x4 camper conversion — matte grey body, black roof rack with solar panels, oversized all-terrain tires, lift kit, side awning', label: '🚐 Mercedes Sprinter 4x4 — Matte grey, solar panel' },
		{ value: 'a vintage VW Transporter T3 syncro — faded white with green trim, high roof, roof rack, pop-top canvas, worn stickers on rear window', label: '🚐 VW T3 Syncro — Putih vintage, high roof, stiker' },
		{ value: 'a rugged Defender 110 camper — dark green body, safari snorkel, roof tent, side rack with jerry cans and spare wheel', label: '🚐 Land Rover Defender 110 — Hijau gelap, roof tent' },
	],
	'snowfox': [
		{ value: 'a black Arctic Cat snowmobile — bright yellow accents, windscreen scratched from use, cargo sled towed behind loaded with gear wrapped in orange tarpaulin', label: '🛷 Arctic Cat hitam + aksen kuning + sled cargo oranye' },
		{ value: 'a red Ski-Doo Expedition snowmobile — wide tracks, touring windshield, black cargo bag strapped to back seat', label: '🛷 Ski-Doo Expedition merah — wide tracks, windshield tur' },
		{ value: 'a traditional wooden dogsled pulled by 4 to 6 Alaskan Huskies — natural pine wood runners, leather harnesses, gear lashed down with rope', label: '🐕 Dog sled kayu — 4-6 Husky, harness kulit, tali' },
	],
	'bicycle': [
		{ value: 'a dark green steel-frame touring bicycle — Ortlieb panniers on both sides, front rack with dry bag, Brooks leather saddle, dynamo lights, mud guards', label: '🚲 Sepeda touring baja hijau — Ortlieb panniers, sadel Brooks' },
		{ value: 'a matte black fat bike — 4-inch wide tires, front fork suspension, frame bag and seatpost bag loaded, flat handlebars', label: '🚲 Fat bike matte hitam — ban 4 inci, frame bag loaded' },
	],
	'motorbike': [
		{ value: 'a dark olive-green BMW R1250GS Adventure — tall windscreen, aluminum panniers both sides, top case, hand guards, knobby tires, crash bars', label: '🏍️ BMW R1250GS — Olive hijau, aluminium pannier, crash bar' },
		{ value: 'a red Honda Africa Twin CRF1100L — white side panels, large windscreen, rear luggage rack with soft bags, skid plate', label: '🏍️ Honda Africa Twin — Merah-putih, soft bag, skid plate' },
		{ value: 'a yellow KTM 890 Adventure — black frame, orange accents, minimal luggage (tail pack only), knobby enduro tires, no windscreen', label: '🏍️ KTM 890 Adventure — Kuning-hitam, minimal luggage' },
	],
}

export const SHELTER_DIMENSION_OPTIONS = [
	{ value: 'approximately 3m wide × 4m long × 2.2m interior height — compact but fully functional single-room space', label: '📐 3×4m — Kompak, satu ruangan fungsional' },
	{ value: 'approximately 2.5m wide × 3.5m long × 1.8m height — tight efficient micro-shelter, everything within arm reach', label: '📐 2.5×3.5m — Micro-shelter, super efisien' },
	{ value: 'approximately 4m wide × 5m long × 2.5m peak height — generous space, separate sleeping and living zones', label: '📐 4×5m — Luas, zona tidur dan living terpisah' },
	{ value: 'approximately 2m diameter circular — round form carved from tree trunk or built circular, central fire pit', label: '📐 2m diameter bulat — Dari pohon atau bangun melingkar' },
]

export const SHELTER_EXTERIOR_OPTIONS = [
	{ value: 'entrance is a low doorway with hand-crafted timber door on leather hinges — earth mound visible above, small glass window on south face, ventilation pipe protruding from roof', label: '🚪 Pintu kayu rendah, jendela kaca kecil, pipa ventilasi' },
	{ value: 'visible from outside as a large earth mound with curved timber entrance frame — moss already growing on roof, completely blends with landscape', label: '🌿 Gundukan bumi + rangka kayu — menyatu dengan alam' },
	{ value: 'platform visible between large tree branches at height of 3 to 4 meters — timber walls, corrugated metal roof, rope ladder access', label: '🌲 Platform 3-4m di pohon, dinding kayu, tangga tali' },
	{ value: 'stone foundation walls visible at surface level — wooden upper structure with shake shingle roof, single chimney with smoke', label: '🪨 Fondasi batu terlihat + struktur kayu + cerobong asap' },
]

export const SHELTER_INTERIOR_OPTIONS = [
	{ value: 'wood-burning cast iron stove on left wall — black pipe going up through roof, small wooden platform bed on right with wool blanket, single timber shelf above bed, oil lantern hanging from ceiling', label: '🔥 Tungku besi kiri, tempat tidur kayu kanan, lentera gantung' },
	{ value: 'central fire pit with stone surround — smoke hole in roof above, sleeping area raised on timber platform one step up, tools hung on wall pegs, earth floor packed hard', label: '🔥 Api tengah + lubang asap, tidur di platform kayu' },
	{ value: 'small cast iron wood stove in corner, fold-down wooden table from wall, two wooden stumps as stools, sleeping loft above accessed by notched log ladder', label: '🔥 Tungku pojok, meja lipat kayu, loft tidur dengan tangga' },
]

// ─── UPDATED DNA DEFAULTS with full anchors ───────────────────────────────────

export const DNA_DEFAULTS_ANCHOR = {
	characterAge: 'appears early 30s — mature but young, slight weathering on skin',
	characterFace: 'strong square jaw, high cheekbones, slightly weathered tan skin, calm deep-set brown eyes, short neat beard — 3 to 5 day stubble',
	characterHair: 'dark brown short hair — slightly overgrown, natural texture, tucked under a worn olive-green beanie hat',
	characterBuild: 'lean and wiry — low body fat, visible muscle definition from real outdoor work, not gym-built',
	characterOutfit: 'faded olive-green canvas field jacket over dark grey thermal henley — worn brown leather work gloves, dark cargo pants with dirt and sawdust, lace-up brown leather boots caked with dried mud',
	characterGear: '65L olive green backpack with external frame — axe strapped to side, rope coiled on top, canvas roll with tools visible',
	vehicleDesc: 'N/A — traveling entirely on foot',
	shelterDimension: 'approximately 3m wide × 4m long × 2.2m interior height — compact but fully functional single-room space',
	shelterExterior: 'entrance is a low doorway with hand-crafted timber door on leather hinges — earth mound visible above, small glass window on south face, ventilation pipe protruding from roof',
	shelterInterior: 'wood-burning cast iron stove on left wall — black pipe going up through roof, small wooden platform bed on right with wool blanket, single timber shelf above bed, oil lantern hanging from ceiling',
}
