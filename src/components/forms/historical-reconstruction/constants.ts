import type {
	HistoricalCategoryKey,
	NarrationToneKey,
	HistoricalEraKey,
	VisualStyleKey,
	VisualApproachKey,
	HistoricalReconConfig,
} from "./types";

// ─── KATEGORI TEMA ────────────────────────────────────────────────────────────

export const HISTORICAL_CATEGORIES: Record<HistoricalCategoryKey, {
	label: string;
	icon: string;
	description: string;
	exampleTopics: string[];
	aiDirectorNote: string;
}> = {
	"ancient-civilization": {
		label: "Peradaban Kuno",
		icon: "🏛️",
		description: "Rekonstruksi peradaban besar kuno — Roma, Yunani, Mesir, Mesopotamia, Persia, India kuno",
		exampleTopics: [
			"The Complete History of the Roman Empire",
			"Ancient Rome 101: Rise and Fall",
			"How the Roman Republic Turned into an Empire",
			"Ancient Egypt: The Pharaoh's World",
			"Mesopotamia: Cradle of Civilization",
		],
		aiDirectorNote: "Use sweeping wide shots of reconstructed ancient cities at their peak. Mix aerial drone views of temples and forums with ground-level crowd scenes. Show daily life, political drama, and military power simultaneously. Color grade: warm ochre and stone tones for Mediterranean civilizations, deep blue-blacks for Egyptian settings.",
	},
	"tribe-culture": {
		label: "Suku & Kebudayaan",
		icon: "⚔️",
		description: "Vikings, Aztec, Maya, Inca, Mongols, Celts, Samurai — kehidupan & kebudayaan mereka",
		exampleTopics: [
			"The Vikings: Explorers or Conquerors?",
			"The Entire History of the Vikings",
			"Rise and Fall of the Maya",
			"The Aztec Empire: Hyper-Advanced Civilization",
			"Scythians: Nomadic Warriors of the Steppe",
			"Genghis Khan and the Mongol Empire",
		],
		aiDirectorNote: "Immersive tribal environments — longhouses, temples, camps. Show unique cultural practices: rituals, crafts, feasts, conflicts. Authentic costumes and tools specific to the civilization. Dramatic weather and natural environments matching their homeland. Mix intimate character moments with epic wide cultural panoramas.",
	},
	"mystery-legend": {
		label: "Misteri & Legenda",
		icon: "🌀",
		description: "Atlantis, misteri besar sejarah, legenda yang masih diperdebatkan",
		exampleTopics: [
			"The Lost City of Atlantis: Myth or Reality?",
			"Mystery of Atlantis: The Truth You Were Never Told",
			"The Lost Library of Alexandria: What Knowledge Did We Lose?",
			"10,000-Year-Old Underwater Mystery Cities",
			"Is the Lost City of Atlantis Real? What Science Says",
		],
		aiDirectorNote: "Atmospheric mystery aesthetic — deep shadows, ethereal lighting, underwater environments for Atlantis, dust-filled archive rooms for historical mysteries. Use dramatic reveals and slow-build tension. Include hybrid scenes: modern researchers discovering clues + reconstructed ancient scenes. Color grade: teal-green for underwater, amber for desert mysteries.",
	},
	"ancient-discovery": {
		label: "Dokumenter Penemuan",
		icon: "🔍",
		description: "Penemuan arkeologi spektakuler — Terracotta Army, Dead Sea Scrolls, Antikythera, Pompeii",
		exampleTopics: [
			"The Antikythera Mechanism: World's First Computer",
			"The Terracotta Army: 8,000 Soldiers Guarding an Emperor",
			"Dead Sea Scrolls: Most Significant Discovery of the Century",
			"The Lost Library of Alexandria",
			"Pompeii: The Buried City (Day of Destruction)",
		],
		aiDirectorNote: "Start with modern archaeological discovery scene (researchers brushing dust off artifacts), then FLASH BACK to vivid full-color reconstruction of the ancient world when the artifact was new. Use strong contrast between dusty excavation brown-grey tones and vibrant ancient world color. Include close-up macro shots of artifact details.",
	},
	"hero-biography": {
		label: "Kisah Pahlawan Legendaris",
		icon: "👑",
		description: "Biografi tokoh-tokoh legendaris dari abad kuno hingga WW2",
		exampleTopics: [
			"The Genius of Alexander the Great: Every Battle Explained",
			"Genghis Khan: The Most Feared Man in History",
			"Leonidas and the 300 Spartans",
			"Hannibal Barca: The Man Who Almost Destroyed Rome",
			"The Undefeated: 10 Greatest Military Commanders",
			"Julius Caesar: Rise of a Dictator",
		],
		aiDirectorNote: "Focus on the protagonist's journey arc — from humble origins or early triumph to defining moments. Use close-up character shots to convey leadership, determination, and inner conflict. Alternate between intimate personal scenes and grand military/political panoramas. The protagonist should feel larger-than-life but also humanly vulnerable at key moments.",
	},
	"battle-tactics": {
		label: "Rekonstruksi Taktik Perang",
		icon: "⚔️",
		description: "Pertempuran legendaris rekonstruksi detail — dari BC hingga WW2",
		exampleTopics: [
			"The Battle of Gaugamela: How Alexander Won the East",
			"War Elephants: The Ancient World's Tanks",
			"The Battle of Thermopylae: 300 Spartans vs Persia",
			"Total War: The Siege of Constantinople 1453",
			"Samurai vs Mongols: The Invasion of Japan",
			"D-Day: The Largest Amphibious Invasion in History",
			"Stalingrad: The Bloodiest Battle Ever Fought",
			"The Blitzkrieg: How Germany Rewrote the Rules of War",
		],
		aiDirectorNote: "Tactical documentary style — combine bird's-eye map/diagram animated overlays with ground-level combat reconstruction. Show both sides of the conflict with equal weight. Capture the chaos and fog of war alongside moments of tactical brilliance. Use slow-motion for pivotal moments, wide shots for scale, tight shots for individual heroism. Color grade: desaturated grey-brown for ancient battles, high-contrast for WW2.",
	},
	"ancient-engineering": {
		label: "Keajaiban Teknik Kuno",
		icon: "🏗️",
		description: "Bagaimana bangunan-bangunan megah kuno dibangun — Piramida, Colosseum, Great Wall",
		exampleTopics: [
			"The Great Pyramid: How Did They REALLY Build It?",
			"How Romans Built the Colosseum",
			"Roman Aqueducts: Engineering Marvels of the Ancient World",
			"Stonehenge: The Ancient Astronomical Clock Mystery",
			"How the Great Wall of China Was Built",
			"Petra: The City Carved in Stone",
			"Machu Picchu: Secret Engineering of the Incas",
		],
		aiDirectorNote: "Engineering documentary aesthetic — show construction PROCESS in detail using timelapse-style reconstruction. Workers, tools, logistics, mathematical calculations implied through visual metaphors. Alternate between human scale (workers struggling with stone blocks) and architectural scale (the emerging structure against sky). Use dramatic reveal moments when the completed structure is shown for the first time.",
	},
	"ww2-modern-war": {
		label: "WW2 & Perang Modern",
		icon: "🪖",
		description: "Rekonstruksi pertempuran WW2 dan konflik abad 19–1945",
		exampleTopics: [
			"WW2: The Complete History (From Rise to Fall)",
			"D-Day: The Largest Amphibious Invasion",
			"Stalingrad: The Bloodiest Battle Ever Fought",
			"Secret Weapons of WW2 That Changed Everything",
			"The Blitzkrieg: How Germany Rewrote the Rules of War",
		],
		aiDirectorNote: "Authentic period detail — accurate uniforms, vehicles, weapons, landscapes. Mix documentary archival aesthetic (slightly desaturated, film grain, period-accurate) with dramatic combat reconstruction. Humanize all sides — show soldiers as people, not just combatants. Include strategic map overlays for tactical context. WW2 color palette: muted greens, greys, browns, cold steel blues.",
	},
	"mythology-ancient": {
		label: "Mitologi Kuno",
		icon: "⚡",
		description: "Greek mythology, Norse myths, Egyptian gods, Mesopotamian legends — cerita mitologi kuno",
		exampleTopics: [
			"The Complete Guide to Greek Mythology",
			"Norse Gods Explained: Odin, Thor, Loki",
			"Egyptian Gods: The Complete Pantheon",
			"The Trojan War: Myth or History?",
			"Hercules: The Real Myth Behind the Hero",
			"Ragnarok: The Norse End of the World",
		],
		aiDirectorNote: "Epic mythological aesthetic — gods should be represented with divine grandeur, superhuman scale, and otherworldly presence. Divine environments should feel magnificent and impossible. Mortal characters provide human emotional grounding. Use dramatic weather phenomena (lightning, storms, divine light) as storytelling tools. Color grades: golden divine light for Olympus, deep sea-green for Poseidon domains, dark crimson for underworld.",
	},
	"daily-life-ancient": {
		label: "Kehidupan Sehari-hari Kuno",
		icon: "🏠",
		description: "Seperti apa kehidupan sehari-hari di Roma, Viking, Mesir, atau samurai Jepang",
		exampleTopics: [
			"A Day in the Life of a Roman Citizen",
			"What Did Romans Actually Eat?",
			"Inside a Roman Domus: How the Rich Lived",
			"Viking Life: What Was It Really Like?",
			"How Vikings Built Houses Without Nails",
			"Ancient Korean Floor Heating: The Ondol System",
		],
		aiDirectorNote: "Intimate, observational documentary style. Follow ordinary people through their daily routines — morning rituals, markets, craft work, meals, social interactions. Use handheld-adjacent camera movement to feel immersive and present. Detail-focused macro shots: hands preparing food, tools being used, textures of clothing. Make the ancient world feel lived-in and authentic.",
	},
};

// ─── CIVILIZATIONS & PEOPLES ─────────────────────────────────────────────────

export const CIVILIZATIONS_BY_CATEGORY: Record<HistoricalCategoryKey, string[]> = {
	"ancient-civilization": [
		"Roman Empire", "Ancient Greece", "Ancient Egypt", "Persian Empire",
		"Mesopotamia / Babylon", "Indus Valley Civilization", "Han Dynasty China",
		"Byzantine Empire", "Carthage", "Minoan Civilization",
	],
	"tribe-culture": [
		"Vikings (Norse)", "Aztec Empire", "Maya Civilization", "Inca Empire",
		"Mongol Empire", "Celtic Tribes", "Samurai Japan", "Scythians",
		"Zulu Kingdom", "Apache Nation", "Ottoman Empire", "Khmer Empire",
	],
	"mystery-legend": [
		"Atlantis (Lost Continent)", "Ancient Egypt (Mysteries)", "Nazca Lines Peru",
		"Gobekli Tepe Turkey", "Rapa Nui / Easter Island", "Kingdom of Sheba",
		"Troy (Legendary City)", "El Dorado (Lost City of Gold)",
	],
	"ancient-discovery": [
		"Terracotta Army (China)", "Pompeii (Rome)", "Dead Sea Scrolls (Judea)",
		"Antikythera Mechanism (Greece)", "Rosetta Stone (Egypt)",
		"Library of Alexandria (Egypt)", "Machu Picchu (Inca)", "Sutton Hoo (Vikings)",
	],
	"hero-biography": [
		"Alexander the Great", "Julius Caesar", "Genghis Khan", "Hannibal Barca",
		"Leonidas of Sparta", "Cleopatra VII", "Attila the Hun", "Sun Tzu",
		"Napoleon Bonaparte", "Joan of Arc", "Saladin", "Sitting Bull",
	],
	"battle-tactics": [
		"Battle of Gaugamela (331 BC)", "Battle of Thermopylae (480 BC)",
		"Siege of Carthage (146 BC)", "Battle of Hastings (1066)",
		"Siege of Constantinople (1453)", "Mongol Invasions (1206–1294)",
		"D-Day Normandy (1944)", "Battle of Stalingrad (1942–43)",
		"Battle of Midway (1942)", "Battle of El Alamein (1942)",
	],
	"ancient-engineering": [
		"Great Pyramid of Giza", "Roman Colosseum", "Roman Aqueducts",
		"Great Wall of China", "Stonehenge", "Petra (Jordan)", "Machu Picchu",
		"Angkor Wat (Cambodia)", "Parthenon Athens", "Hagia Sophia Constantinople",
	],
	"ww2-modern-war": [
		"Western Front Europe (1939–1945)", "Pacific Theater (1941–1945)",
		"Eastern Front (1941–1945)", "North Africa Campaign",
		"Battle of Britain (1940)", "D-Day Normandy", "Stalingrad",
		"Island Hopping Pacific", "Italian Campaign", "Burma Campaign",
	],
	"mythology-ancient": [
		"Greek Mythology (Olympians)", "Norse Mythology (Asgard)", "Egyptian Mythology",
		"Mesopotamian Mythology (Sumerian)", "Hindu Mythology", "Celtic Mythology",
		"Roman Mythology", "Aztec Mythology", "Japanese Shintoism / Mythology",
	],
	"daily-life-ancient": [
		"Roman Citizens (Imperial Rome)", "Viking Everyday Life", "Egyptian Commoners",
		"Ancient Greek Polis Life", "Samurai Japan (Edo Period)", "Medieval European Peasants",
		"Aztec Market Life", "Ancient Chinese Court Life", "Spartan Daily Training",
	],
};

// ─── HISTORICAL ERAS ─────────────────────────────────────────────────────────

export const HISTORICAL_ERAS: Record<HistoricalEraKey, {
	label: string;
	range: string;
	visualNote: string;
}> = {
	"prehistoric": { label: "Prasejarah", range: "Sebelum 3000 SM", visualNote: "cave environments, primitive tools, animal skins, firelight" },
	"ancient-world": { label: "Dunia Kuno", range: "3000 SM – 500 SM", visualNote: "early cities, ziggurats, pyramids, early iron/bronze tools" },
	"classical-antiquity": { label: "Zaman Klasik", range: "500 SM – 500 M", visualNote: "marble temples, legions, togas, sandals, chariot roads" },
	"medieval": { label: "Abad Pertengahan", range: "500 M – 1500 M", visualNote: "stone castles, chainmail, longbows, churches, market towns" },
	"early-modern": { label: "Modern Awal", range: "1500 M – 1800 M", visualNote: "gunpowder weapons, sailing ships, colonial dress, early industrialization" },
	"ww1-era": { label: "Era WW1", range: "1800 M – 1920 M", visualNote: "trenches, early tanks, biplanes, period uniforms, sepia color palette" },
	"ww2-era": { label: "Era WW2", range: "1920 M – 1945 M", visualNote: "tanks, bombers, military uniforms, urban warfare, propaganda aesthetics" },
	"all-eras": { label: "AI Pilih Era", range: "Sesuai topik", visualNote: "AI will determine the most accurate era based on topic" },
};

// ─── NARRATION TONES ─────────────────────────────────────────────────────────

export const NARRATION_TONES: Record<NarrationToneKey, {
	label: string;
	icon: string;
	desc: string;
	voiceNote: string;
}> = {
	"authoritative-bbc": {
		label: "BBC Documentary",
		icon: "📺",
		desc: "Suara narasi otoritatif ala BBC / National Geographic — calm, percaya diri, faktual",
		voiceNote: "Deep, measured, authoritative male or female voice, BBC English accent, measured pace with dramatic pauses",
	},
	"cinematic-epic": {
		label: "Cinematic Epic",
		icon: "🎬",
		desc: "Narasi emosional & dramatis seperti film epik — membuat penonton terhanyut",
		voiceNote: "Gravelly or passionate narration, cinematic swell music, emotionally charged delivery, building to crescendo",
	},
	"educational-neutral": {
		label: "Educational Neutral",
		icon: "📚",
		desc: "Tone edukatif netral — seperti guru yang sangat menarik menjelaskan sejarah",
		voiceNote: "Clear articulation, conversational warmth, enthusiastic without being overwrought, accessible vocabulary",
	},
	"mystery-thriller": {
		label: "Mystery & Thriller",
		icon: "🌀",
		desc: "Narasi penuh tanda tanya & ketegangan — untuk topik misteri & konspirasi",
		voiceNote: "Hushed, conspiratorial tone, strategic whispers, building suspense, dramatic reveals, noir-influenced delivery",
	},
	"first-person": {
		label: "First-Person Immersive",
		icon: "👁️",
		desc: "Narasi orang pertama — seolah tokoh sejarah berbicara langsung ke penonton",
		voiceNote: "Personal, intimate, period-appropriate language, as if the historical figure is narrating their own story posthumously",
	},
	"newsreel-historical": {
		label: "Newsreel / Period Style",
		icon: "📰",
		desc: "Gaya newsreel era lama — cocok untuk WW2 dan sejarah abad 20",
		voiceNote: "1940s newsreel voice style, slightly formal, rapid delivery, period radio broadcast cadence",
	},
};

// ─── VISUAL APPROACHES ────────────────────────────────────────────────────────

export const VISUAL_APPROACHES: Record<VisualApproachKey, {
	label: string;
	desc: string;
	promptNote: string;
}> = {
	"full-reconstruction": {
		label: "Full Rekonstruksi",
		desc: "Rekonstruksi penuh dengan aktor, set, kostum — seperti film sejarah berkualitas tinggi",
		promptNote: "Full period-accurate costume and set reconstruction, real actors in authentic environments, cinematic production value",
	},
	"mixed-archival": {
		label: "Mix Rekonstruksi + Archival Style",
		desc: "Kombinasi rekonstruksi dramatis + arsip visual gaya dokumenter",
		promptNote: "Blend dramatic reconstruction sequences with archival-aesthetic grading, aged film look, vignette borders on some shots",
	},
	"cinematic-dramatic": {
		label: "Cinematic Dramatis",
		desc: "Seperti film epik Hollywood — visual spektakuler, dramatis, sinematografi premium",
		promptNote: "Hollywood epic film production quality, dramatic cinematography, sweeping scores implied, premium VFX environment extensions",
	},
	"documentary-grounded": {
		label: "Documentary Grounded",
		desc: "Realistis & grounded seperti dokumenter serius — credible & factual feel",
		promptNote: "Handheld-adjacent naturalistic camera, honest lighting, realistic period environments, no over-dramatization",
	},
	"artistic-stylized": {
		label: "Artistik Bergaya",
		desc: "Visual bergaya artistik — seperti ilustrasi bergerak atau lukisan hidup",
		promptNote: "Painterly or stylized aesthetic, rich texture, almost illustration-like quality while remaining photorealistic, artistic color grading",
	},
};

// ─── VISUAL STYLE LABELS ─────────────────────────────────────────────────────

export const VISUAL_STYLE_LABELS: Record<VisualStyleKey, string> = {
	"cinematic": "Cinematic",
	"semi-cinematic": "Semi-Cinematic",
	"cinematic-realistic": "Cinematic Realistic",
	"realistic": "Realistic",
	"hyper-realistic": "Hyper Realistic",
};

// ─── COLOR GRADES ─────────────────────────────────────────────────────────────

export const COLOR_GRADE_OPTIONS = [
	{ value: "warm-ochre-gold", label: "🟡 Warm Ochre & Gold — Mediterranean/Roman" },
	{ value: "cool-steel-grey", label: "⚫ Cool Steel Grey — WW2/Modern War" },
	{ value: "deep-teal-shadow", label: "🔵 Deep Teal Shadow — Mystery & Atlantis" },
	{ value: "crimson-fire-orange", label: "🔴 Crimson & Fire Orange — Epic Battle" },
	{ value: "emerald-green-forest", label: "🟢 Emerald Green — Viking/Celtic/Forest" },
	{ value: "golden-divine-light", label: "✨ Golden Divine Light — Mythology/Gods" },
	{ value: "sandy-desert-brown", label: "🏜️ Sandy Desert Brown — Egypt/Middle East" },
	{ value: "aged-sepia-newsreel", label: "📰 Aged Sepia — WW1/WW2 Newsreel" },
	{ value: "vivid-natural", label: "🌿 Vivid Natural — Modern Documentary" },
	{ value: "ai-optimized", label: "🤖 AI Optimized — AI pilih sesuai konteks" },
];

// ─── CONTENT DEPTH ───────────────────────────────────────────────────────────

export const CONTENT_DEPTH_OPTIONS = [
	{
		key: "overview" as const,
		label: "Overview (Highlight Reel)",
		desc: "Ringkasan menarik — cocok untuk video pendek 5-10 menit yang viral",
		sceneNote: "Fast-paced highlights, strongest visual moments, key facts delivered with impact",
	},
	{
		key: "deep-dive" as const,
		label: "Deep Dive (Full Analysis)",
		desc: "Analisa mendalam — cocok untuk video panjang 15-60 menit yang edukatif",
		sceneNote: "Detailed exploration, multiple angles, expert context, thorough coverage of all aspects",
	},
	{
		key: "mini-documentary" as const,
		label: "Mini Documentary",
		desc: "Format dokumenter mini — balance antara viral & informatif",
		sceneNote: "Documentary arc: introduction → exploration → revelation → conclusion. Educational yet entertaining",
	},
];

// ─── MINUTE OPTIONS ───────────────────────────────────────────────────────────

export const TOTAL_MINUTE_OPTIONS = [
	{ value: 5, label: "5 menit" },
	{ value: 8, label: "8 menit" },
	{ value: 10, label: "10 menit" },
	{ value: 15, label: "15 menit" },
	{ value: 20, label: "20 menit" },
	{ value: 30, label: "30 menit" },
	{ value: 45, label: "45 menit" },
	{ value: 60, label: "60 menit" },
];

export const SEC_PER_SCENE_OPTIONS = [8, 10, 12, 15, 20];

// ─── DEFAULT CONFIG ───────────────────────────────────────────────────────────

export const DEFAULT_HISTORICAL_CONFIG: HistoricalReconConfig = {
	category: "ancient-civilization",
	topicTitle: "",
	civilization: "Roman Empire",
	historicalEra: "all-eras",
	topicDescription: "",
	keyFacts: "",
	controversialAngle: "",
	narrationTone: "authoritative-bbc",
	narrationLanguage: "English",
	includeNarration: true,
	visualStyle: "cinematic-realistic",
	visualApproach: "full-reconstruction",
	colorGrade: "ai-optimized",
	totalMinutes: 10,
	secPerScene: 10,
	targetPlatform: "youtube-long",
	contentDepth: "mini-documentary",
	aiProvider: "CLAUDE",
	aiModelId: "claude-sonnet-4-20250514",
};

// ─── PLATFORM OPTIONS ─────────────────────────────────────────────────────────

export const PLATFORM_OPTIONS = [
	{ value: "youtube-long" as const, label: "▶️ YouTube Long-form", desc: "10–60 menit, format dokumenter panjang" },
	{ value: "youtube-shorts" as const, label: "📱 YouTube Shorts / TikTok", desc: "Under 5 menit, format cepat & viral" },
	{ value: "social-mix" as const, label: "🌐 Multi-Platform", desc: "Adaptable untuk YouTube, IG Reels, TikTok" },
];
