// ─── DRAMA AD TYPES ──────────────────────────────────────────────────────────
// Thailand-style "Slice of Life + Gimmick" product ad video

// ─── STORYBOARD INSTRUCTION MODE ─────────────────────────────────────────────

export type StoryboardMode = "auto" | "manual";

// ─── ACT STRUCTURE ────────────────────────────────────────────────────────────

export type DramaAct = {
	actNumber: number;          // 1, 2, 3
	actLabel: string;           // "Setup Klise", "Eskalasi Absurd", "Twist Produk"
	startSec: number;           // waktu mulai
	endSec: number;             // waktu akhir
	durationSec: number;        // durasi babak
	sceneCount: number;         // jumlah scene dalam babak
	instruction: string;        // instruksi manual (jika mode manual)
	autoHint: string;           // hint dari template otomatis (jika mode auto)
};

// ─── MANUAL SCENE INSTRUCTION ─────────────────────────────────────────────────

export type ManualSceneInstruction = {
	sceneId: number;
	actNumber: 1 | 2 | 3 | 4;  // 4 = CTA
	description: string;        // deskripsi adegan
	gimmick: string;            // elemen gimmick/humor/drama
	productMention: boolean;    // apakah produk muncul di scene ini
};

// ─── CTA CONFIG ───────────────────────────────────────────────────────────────

export type CTAConfig = {
	ctaSceneCount: 2 | 3;       // jumlah scene CTA
	ctaGimmick: string;         // gimmick lucu/emosional di CTA
	ctaText: string;            // teks tagline
	ctaCustom: boolean;
};

// ─── DRAMA DNA ────────────────────────────────────────────────────────────────

export type DramaDNA = {
	// Produk
	productName: string;
	productUrl: string;          // URL marketplace (opsional)
	productCategory: string;     // dari PRODUCT_CATEGORIES yang sudah ada
	productSubcategory: string;
	productImages: DramaImageRef[];  // maks 5 gambar

	// Durasi — film pendek min 2 menit
	totalDurationSec: number;    // 120–300 detik
	secPerScene: number;         // 8, 10, 12, 15, 20
	totalScenes: number;         // auto kalkulasi

	// Model / Pemeran
	modelGenderAge: string;      // sama dengan mode 1

	// Storyboard mode
	storyboardMode: StoryboardMode;

	// AUTO mode — instruksi per babak (auto-generated dari template)
	autoActs: DramaAct[];

	// MANUAL mode — instruksi scene per scene
	manualInstructions: ManualSceneInstruction[];

	// CTA
	cta: CTAConfig;

	// AI
	aiProvider: string;
	aiModelId: string;

	// Visual
	aspectRatio: "9:16" | "16:9";
	cinematicStyle: string;

	// Status
	isGenerated: boolean;
};

// ─── IMAGE REF ────────────────────────────────────────────────────────────────

export type DramaImageRef = {
	id: string;
	name: string;
	base64: string;
	mediaType: string;
	previewUrl: string;
	aiDescription?: string;
};

// ─── GENERATED DRAMA SCRIPT ───────────────────────────────────────────────────

export type DramaScene = {
	sceneNumber: number;
	totalScenes: number;
	actNumber: number;
	actLabel: string;
	timeLabel: string;           // "0:00–0:10"
	durationSec: number;
	// JSON prompt fields
	setting: {
		location: string;
		timeOfDay: string;
		colorGrade: string;
		atmosphere: string;
	};
	characters: {
		role: string;
		appearance: string;
		action: string;
		expression: string;
	}[];
	camera: {
		shot: string;
		movement: string;
		lens: string;
		angle: string;
	};
	lighting: {
		setup: string;
		mood: string;
		colorTemperature: string;
	};
	action: {
		summary: string;
		details: string[];
		gimmick: string;
		productVisible: boolean;
		productAction: string;
	};
	dialogue: {
		speaker: string;
		line: string;
		tone: string;
	}[];
	audio: {
		music: string;
		sfx: string[];
		voiceover: string;
	};
	transition: string;
	negativePrompt: string;
	continuityNote: string;
};

export type DramaOutput = {
	schema: string;
	schemaVersion: number;
	generatedAt: string;
	tool: string;
	mode: "thailand-drama-ad";
	language: { primary: "en"; ui: "id" };
	productInfo: {
		name: string;
		category: string;
		subcategory: string;
	};
	video: {
		title: string;
		concept: string;
		totalDurationSec: number;
		aspectRatio: string;
		fps: number;
		resolution: string;
	};
	continuityAnchor: {
		modelDescription: string;
		productDescription: string;
		colorPalette: string;
		mustKeepConsistent: string[];
	};
	acts: {
		actNumber: number;
		actLabel: string;
		purpose: string;
		timeRange: string;
	}[];
	scenes: DramaScene[];
	ctaScenes: DramaScene[];
};
