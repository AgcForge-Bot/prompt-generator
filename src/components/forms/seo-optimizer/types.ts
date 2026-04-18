// ─── MODEL ───────────────────────────────────────────────────────────────────

export type ModelType = "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER";

// ─── TEMA VIDEO (exclude product-promo) ──────────────────────────────────────

export type VideoThemeKey =
	| "forest-build-primitive-craft"
	| "asmr-timelapse-constructor"
	| "car-music-video-clip"
	| "war-music-video-clip"
	| "relaxing-music-video-clip";

// ─── MODE TOOLS ──────────────────────────────────────────────────────────────

export type ToolMode = "generate" | "analyze";

// ─── OUTPUT GENERATE MODE ────────────────────────────────────────────────────

export type TitleVariant = {
	title: string;
	seoScore: number;         // 0–100
	searchVolume: "High" | "Medium" | "Low";
	clickbaitScore: number;   // 0–100
	charCount: number;
	keywords: string[];
	reason: string;           // kenapa judul ini bagus
};

export type TagItem = {
	tag: string;
	volume: "High" | "Medium" | "Low";
	relevance: number;        // 0–100
	category: "broad" | "niche" | "long-tail";
};

export type StoryboardScene = {
	sceneNum: number;
	title: string;
	imagePrompt: string;      // prompt untuk Grok/VEO image reference
	duration: string;         // estimasi durasi
	description: string;      // deskripsi visual singkat
};

export type GenerateOutput = {
	// Judul
	titleVariants: TitleVariant[];
	bestTitleIndex: number;

	// Deskripsi
	description: string;      // full SEO description
	descriptionKeywords: string[];
	descriptionCharCount: number;

	// Tags
	tags: TagItem[];
	totalTagCount: number;
	overallTagScore: number;

	// Thumbnail
	thumbnailPrompt: string;  // prompt siap generate

	// Storyboard
	storyboardCore: string;   // 1 prompt inti keseluruhan video
	storyboardScenes: StoryboardScene[]; // 2–4 scene image prompts

	// Meta
	theme: VideoThemeKey;
	generatedAt: string;
	aiModel: string;
};

// ─── OUTPUT ANALYZE MODE ─────────────────────────────────────────────────────

export type ScoreItem = {
	score: number;            // 0–100
	grade: "A" | "B" | "C" | "D" | "F";
	strengths: string[];
	issues: string[];
	suggestions: string[];
};

export type AnalyzeOutput = {
	url: string;
	platform: "youtube" | "facebook" | "unknown";
	theme: VideoThemeKey;

	// Skor per bagian
	titleScore: ScoreItem & { detectedTitle?: string };
	thumbnailScore: ScoreItem & { thumbnailSuggestion?: string };
	descriptionScore: ScoreItem & { detectedDescription?: string };
	tagsScore: ScoreItem & { detectedTags?: string[] };

	// Overall
	overallScore: number;
	overallGrade: "A" | "B" | "C" | "D" | "F";
	priorityFixes: string[];   // urutan perbaikan yang paling penting

	// Meta
	analyzedAt: string;
	aiModel: string;
};

// ─── FORM STATE ───────────────────────────────────────────────────────────────

export type SeoFormState = {
	// Shared
	mode: ToolMode;
	theme: VideoThemeKey;
	aiModel: ModelType;
	aiModelId: string;

	// Generate mode
	customKeyword: string;    // keyword tambahan opsional
	targetAudience: string;   // target penonton
	videoStyle: string;       // gaya video (opsional, free text)
	language: "id" | "en" | "both"; // bahasa output

	// Analyze mode
	videoUrl: string;

	// Output
	generateOutput: GenerateOutput | null;
	analyzeOutput: AnalyzeOutput | null;

	// UI state
	isGenerating: boolean;
	isAnalyzing: boolean;
	error: string;
	activeOutputTab: "titles" | "description" | "tags" | "thumbnail" | "storyboard";
};
