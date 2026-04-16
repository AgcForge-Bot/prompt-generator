// ─── MODEL TYPES ─────────────────────────────────────────────────────────────

export type ModelType = "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER";

// ─── PRODUCT CATEGORY ────────────────────────────────────────────────────────

export type ProductCategoryKey =
	| "fashion-wanita"
	| "fashion-pria"
	| "fashion-anak"
	| "aksesoris"
	| "elektronik"
	| "sepatu"
	| "kosmetik"
	| "handphone"
	| "komputer"
	| "lainnya";

export type ProductSubcategory = {
	value: string;
	label: string;
};

// ─── VIDEO STYLE ─────────────────────────────────────────────────────────────

export type VideoStyleKey =
	| "review-only"       // hanya review produk tanpa model
	| "single-model"      // 1 model sebagai reviewer
	| "multi-model";      // 2+ model (pembicara + pemakai)

// ─── MODEL GENDER & AGE ──────────────────────────────────────────────────────

export type ModelGenderAge =
	| "pria-muda"
	| "pria-tua"
	| "wanita-muda"
	| "wanita-tua";

// ─── LOCATION ────────────────────────────────────────────────────────────────

export type LocationKey =
	| "studio"
	| "ruangan-khusus"
	| "ruangan-rumah"
	| "outdoor";

// ─── NARRATION TONE ──────────────────────────────────────────────────────────

export type NarrationToneKey =
	| "lembut"
	| "tegas"
	| "ramah"
	| "santai"
	| "cepat"
	| "antusias"
	| "profesional"
	| "kasual";

// ─── VOICE STYLE ─────────────────────────────────────────────────────────────

export type VoiceStyleKey =
	| "narasi-langsung"
	| "dialog-interaktif"
	| "monolog-testimonial"
	| "voice-over";

// ─── ASPECT RATIO ────────────────────────────────────────────────────────────

export type AspectRatioKey = "16:9" | "9:16";

// ─── SCENE TYPE ──────────────────────────────────────────────────────────────

export type SceneTypeKey =
	| "problem"           // Before / masalah (opsional)
	| "intro"             // Perkenalan produk
	| "feature-1"         // Fitur & keunggulan 1
	| "feature-2"         // Fitur & keunggulan 2
	| "feature-3"         // Fitur & keunggulan 3
	| "detail-closeup"    // Close-up detail produk
	| "testimonial"       // Testimoni / reaksi pengguna
	| "comparison"        // Perbandingan sebelum/sesudah
	| "cta";              // Call to action penutup

// ─── IMAGE REF ───────────────────────────────────────────────────────────────

export type ImageRef = {
	id: string;
	type: "upload" | "url";
	url: string;
	name: string;
	base64?: string;
	mediaType?: string;
	aiDescription?: string;
	status: "done" | "failed" | "pending";
};

// ─── SCENE CONFIG ────────────────────────────────────────────────────────────

export type SceneConfig = {
	id: number;
	sceneType: SceneTypeKey;
	duration: number;          // detik (8, 10, atau 12)
	generatedPrompt?: string;
};

// ─── PROMO DNA (konfigurasi utama) ───────────────────────────────────────────

export type PromoDNA = {
	// Info produk
	productName: string;
	productDescription: string;          // dari analisa AI
	productCategory: ProductCategoryKey;
	productSubcategory: string;
	isFashionProduct: boolean;           // auto-set berdasar kategori

	// Gaya video
	videoStyle: VideoStyleKey;
	enableProblemSolution: boolean;      // toggle drama before/after
	problemDescription: string;         // deskripsi masalah (jika diaktifkan)
	solutionDescription: string;        // solusi / intro produk

	// Model
	modelGenderAge: ModelGenderAge;
	modelCount: number;                  // 1 atau 2 (untuk multi-model)

	// Narasi
	narrationTone: NarrationToneKey;
	voiceStyle: VoiceStyleKey;
	customNarrationNote: string;        // catatan tambahan narasi

	// Lokasi
	location: LocationKey;
	locationDetail: string;             // detail spesifik lokasi

	// Durasi & scene
	totalDurationSec: number;           // 30–120 detik
	secPerScene: number;                // 8, 10, atau 12 detik
	totalScenes: number;                // auto kalkulasi

	// Visual
	aspectRatio: AspectRatioKey;
	cinematicStyle: string;             // gaya sinematik (natural, cinematic, dll)
	lightingStyle: string;              // pencahayaan

	// CTA
	ctaText: string;
	ctaCustom: boolean;

	// Mode
	mode: "auto" | "manual";
};

// ─── GENERATE MODE ───────────────────────────────────────────────────────────

export type GenerateMode = "auto" | "manual";

// ─── ANALYZE IMAGE REQUEST ───────────────────────────────────────────────────

export type AnalyzeProductRequest = {
	base64?: string;
	mediaType?: string;
	url?: string;
	model: ModelType;
	modelId?: string;
	productName?: string;
	productCategory?: string;
};

export type AnalyzeProductResponse = {
	description?: string;
	error?: string;
};
