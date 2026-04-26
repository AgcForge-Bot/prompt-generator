import type { Dispatch, SetStateAction } from 'react'
// ─── KATEGORI TEMA ────────────────────────────────────────────────────────────

export type HistoricalCategoryKey =
	| "ancient-civilization"    // Sejarah peradaban kuno (Roma, Yunani, Mesir, dll)
	| "tribe-culture"           // Suku & kebudayaan (Vikings, Aztec, Maya, Inca, dll)
	| "mystery-legend"          // Misteri, legenda & mitologi kuno
	| "ancient-discovery"       // Penemuan arkeologi & dokumenter
	| "hero-biography"          // Kisah pahlawan / tokoh legendaris
	| "battle-tactics"          // Rekonstruksi taktik peperangan & pertempuran
	| "ancient-engineering"     // Keajaiban teknik & konstruksi kuno
	| "ww2-modern-war"          // WW2 & perang modern (abad 19–1945)
	| "mythology-ancient"       // Mitologi kuno (Greek, Norse, Egyptian, dll)
	| "daily-life-ancient";     // Kehidupan sehari-hari di era kuno

// ─── NARASI / TONE DOKUMENTER ─────────────────────────────────────────────────

export type NarrationToneKey =
	| "authoritative-bbc"       // BBC Documentary style — authoritative, calm
	| "cinematic-epic"          // Epic cinematic narration — emotional & grand
	| "educational-neutral"     // Academic/educational tone — factual & clear
	| "mystery-thriller"        // Mystery narration — suspenseful & intriguing
	| "first-person"            // First-person perspective — immersive
	| "newsreel-historical";    // Old newsreel style — period-accurate

// ─── ERA WAKTU ────────────────────────────────────────────────────────────────

export type HistoricalEraKey =
	| "prehistoric"             // Prasejarah (sebelum 3000 SM)
	| "ancient-world"           // Dunia kuno (3000 SM – 500 SM)
	| "classical-antiquity"     // Zaman klasik (500 SM – 500 M)
	| "medieval"                // Abad pertengahan (500 – 1500 M)
	| "early-modern"            // Modern awal (1500 – 1800 M)
	| "ww1-era"                 // Era WW1 (1800 – 1920)
	| "ww2-era"                 // Era WW2 (1920 – 1945)
	| "all-eras";               // AI pilih era sesuai topik

// ─── VISUAL STYLE ────────────────────────────────────────────────────────────

export type VisualStyleKey =
	| "cinematic"
	| "semi-cinematic"
	| "cinematic-realistic"
	| "realistic"
	| "hyper-realistic";

// ─── VISUAL APPROACH ─────────────────────────────────────────────────────────

export type VisualApproachKey =
	| "full-reconstruction"     // Rekonstruksi penuh — aktor & set nyata
	| "mixed-archival"          // Mix rekonstruksi + archival footage style
	| "cinematic-dramatic"      // Dramatis sinematik — seperti film epik
	| "documentary-grounded"    // Dokumenter grounded — realistis & factual
	| "artistic-stylized";      // Artistik bergaya — seperti ilustrasi bergerak

// ─── SEO PACK ────────────────────────────────────────────────────────────────

export type SeoPack = {
	title: string;
	description: string;
	tags: string[];
	thumbnailPrompt: string;
};

// ─── MAIN CONFIG ─────────────────────────────────────────────────────────────

export interface HistoricalReconConfig {
	// Kategori & sub-topik
	category: HistoricalCategoryKey;
	topicTitle: string;              // Judul/topik spesifik (bebas input)
	civilization: string;            // Peradaban/suku/tokoh utama
	historicalEra: HistoricalEraKey;

	// Topik custom detail
	topicDescription: string;        // Deskripsi detail tentang apa yang ingin direkonstruksi
	keyFacts: string;                // Fakta kunci yang harus dimasukkan AI
	controversialAngle: string;      // Angle kontroversial / misteri (opsional)

	// Narasi & dokumenter
	narrationTone: NarrationToneKey;
	narrationLanguage: "English" | "Indonesian" | "Bilingual";
	includeNarration: boolean;

	// Visual
	visualStyle: VisualStyleKey;
	visualApproach: VisualApproachKey;
	colorGrade: string;              // Mood color grade

	// Durasi
	totalMinutes: number;
	secPerScene: number;

	// Tipe konten output
	targetPlatform: "youtube-long" | "youtube-shorts" | "social-mix";
	contentDepth: "overview" | "deep-dive" | "mini-documentary";

	// AI
	aiProvider: string;
	aiModelId: string;
}

// ─── GENERATOR STATE ─────────────────────────────────────────────────────────

export interface HistoricalReconGeneratorState {
	config: HistoricalReconConfig;
	isGenerating: boolean;
	allPrompts: string[];
	seoPack: SeoPack | null;
	showAllPrompts: boolean;
	error: string;
	totalScenes: number;
}

export interface HistoricalReconGeneratorConfig {
	config: HistoricalReconConfig;
	isGenerating: boolean;
	allPrompts: string[]
	showAllPrompts: boolean
	seoPack: SeoPack | null
	totalScenes: number
	progressPct: number
	error: string
	toast: { msg: string; show: boolean; }
	setShowAllPrompts: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string>>
	updateConfig(updates: Partial<HistoricalReconConfig>): void
	setDuration(minutes: number, secPerScene: number): void
	setCategory(category: HistoricalCategoryKey): void
	setAiProvider(provider: string): void
	generateAllWithAI: () => Promise<void>
	copyAll: () => void
	downloadAllJson(): void
	copySeoTitle(): void
	copySeoDescription(): void
	copySeoTags(): void
	copySeoThumbnailPrompt(): void
	downloadSeoPackJson(): void
	downloadSeoPackTxt(): void
	showToast: (msg: string) => void
}
