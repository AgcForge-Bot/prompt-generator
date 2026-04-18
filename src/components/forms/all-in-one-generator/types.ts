// ─── TEMA VIDEO ───────────────────────────────────────────────────────────────

export type VideoThemeKey =
	| "forest-build-primitive-craft"
	| "asmr-timelapse-constructor"
	| "car-music-video-clip"
	| "war-music-video-clip"
	| "relaxing-music-video-clip";

// ─── VISUAL STYLE ────────────────────────────────────────────────────────────

export type VisualStyleKey =
	| "cinematic"
	| "semi-cinematic"
	| "cinematic-realistic"
	| "realistic"
	| "hyper-realistic";

// ─── MODEL CHARACTER (hanya forest-build) ────────────────────────────────────

export type ModelGenderAge =
	| "male-young"      // Laki-laki muda 19-27 tahun
	| "male-old"        // Laki-laki tua 30-45 tahun
	| "female-young"    // Wanita muda 19-27 tahun
	| "female-old";     // Wanita tua 30-45 tahun

export type OutfitKey = string; // dynamic dari constants

// ─── IMAGE REF PER SCENE ─────────────────────────────────────────────────────

export type SceneImageRef = {
	id: string;
	name: string;
	base64: string;
	mediaType: string;
	previewUrl: string;
	aiDescription?: string;
};

// ─── SCENE CONFIG (per scene, diisi manual) ──────────────────────────────────

export type SceneConfig = {
	id: number;                    // 1-based
	storyboard: string;            // deskripsi cerita/aksi scene ini
	imageRefs: SceneImageRef[];    // 0-3 gambar referensi
	generatedPrompt?: string;      // hasil generate AI
	isGenerating?: boolean;        // loading state per scene
};

// ─── DNA — konfigurasi utama yang dikunci sebelum generate ───────────────────

export type AllInOneDNA = {
	// Durasi
	totalDurationSec: number;      // 30–300 detik
	secPerScene: number;           // 8, 10, 12, 15, 20
	totalScenes: number;           // auto kalkulasi

	// Identitas
	theme: VideoThemeKey;
	visualStyle: VisualStyleKey;
	videoTitle: string;            // judul video
	coreStoryboard: string;        // inti storyboard keseluruhan

	// Model (hanya aktif jika theme === "forest-build-primitive-craft")
	modelGenderAge: ModelGenderAge;
	outfitKey: string;

	// AI
	aiProvider: string;            // "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER"
	aiModelId: string;

	// Status
	dnaLocked: boolean;
};

// ─── FORM STATE ───────────────────────────────────────────────────────────────

export type AllInOneState = {
	dna: AllInOneDNA;
	scenes: SceneConfig[];
	currentScene: number;

	// Generate state
	isGeneratingAll: boolean;
	isGeneratingSingle: boolean;
	isGeneratingImages: boolean;    // sedang analisa image upload
	generatedCount: number;

	// Output
	allPrompts: string[];
	showAllPrompts: boolean;
	promptOutput: string;           // prompt scene yang sedang aktif

	// UI
	activeTab: "dna" | "scenes" | "output";
	error: string;
};

// ─── REMOTION EXPORT STATE (fitur video generate) ────────────────────────────

export type RemotionExportState = {
	showExportModal: boolean;
	claudeCodeScript: string;      // script yang bisa di-copy ke terminal Claude Code
};
