// ─── MODEL ───────────────────────────────────────────────────────────────────

export type ModelType = "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER";

// ─── TEMA VIDEO ───────────────────────────────────────────────────────────────

export type VideoThemeKey =
	| "forest-build-primitive-craft"
	| "asmr-timelapse-constructor"
	| "car-music-video-clip"
	| "war-music-video-clip"
	| "relaxing-music-video-clip"
	| "other-video-theme";

// ─── CUSTOM THEME (untuk "other-video-theme") ────────────────────────────────

export type CustomThemeImageRef = {
	id: string;
	name: string;
	base64: string;
	mediaType: string;
	previewUrl: string;
	aiDescription?: string;   // hasil analisa AI opsional
};

export type CustomThemeData = {
	// Wajib diisi user jika pilih "other-video-theme"
	themeName: string;          // nama tema bebas
	themeNiche: string;         // niche/genre konten
	targetPlatform: string;     // YouTube / Facebook / TikTok / dll
	videoDescription: string;   // deskripsi tema & alur cerita manual
	targetAudienceCustom: string; // target penonton spesifik
	contentStyle: string;       // gaya konten (cinematik, vlog, tutorial, dll)
	keywordHints: string;       // keyword hint dari user (opsional)
	// Image references (1–3 gambar)
	imageRefs: CustomThemeImageRef[];
};

// ─── MODE TOOLS ──────────────────────────────────────────────────────────────

export type ToolMode = "generate" | "analyze";

// ─── OUTPUT GENERATE MODE ────────────────────────────────────────────────────

export type TitleVariant = {
	title: string;
	seoScore: number;
	searchVolume: "High" | "Medium" | "Low";
	clickbaitScore: number;
	charCount: number;
	keywords: string[];
	reason: string;
};

export type TagItem = {
	tag: string;
	volume: "High" | "Medium" | "Low";
	relevance: number;
	category: "broad" | "niche" | "long-tail";
};

export type StoryboardScene = {
	sceneNum: number;
	title: string;
	imagePrompt: string;
	duration: string;
	description: string;
};

export type GenerateOutput = {
	titleVariants: TitleVariant[];
	bestTitleIndex: number;
	description: string;
	descriptionKeywords: string[];
	descriptionCharCount: number;
	tags: TagItem[];
	totalTagCount: number;
	overallTagScore: number;
	thumbnailPrompt: string;
	storyboardCore: string;
	storyboardScenes: StoryboardScene[];
	theme: VideoThemeKey;
	generatedAt: string;
	aiModel: string;
};

// ─── OUTPUT ANALYZE MODE ─────────────────────────────────────────────────────

export type ScoreItem = {
	score: number;
	grade: "A" | "B" | "C" | "D" | "F";
	strengths: string[];
	issues: string[];
	suggestions: string[];
};

export type AnalyzeOutput = {
	url: string;
	platform: "youtube" | "facebook" | "unknown";
	theme: VideoThemeKey;
	titleScore: ScoreItem & { detectedTitle?: string };
	thumbnailScore: ScoreItem & { thumbnailSuggestion?: string };
	descriptionScore: ScoreItem & { detectedDescription?: string };
	tagsScore: ScoreItem & { detectedTags?: string[] };
	overallScore: number;
	overallGrade: "A" | "B" | "C" | "D" | "F";
	priorityFixes: string[];
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
	customKeyword: string;
	targetAudience: string;
	videoStyle: string;
	language: "id" | "en" | "both";
	// Durasi video — untuk kalkulasi jumlah storyboard scene
	totalDurationSec: number;    // 30–600 detik
	secPerScene: number;         // 8, 10, 12, 15, 20
	totalStoryboardScenes: number; // auto: Math.floor(totalDurationSec / secPerScene)

	// Custom theme data (aktif jika theme === "other-video-theme")
	customTheme: CustomThemeData;

	// Analyze mode
	videoUrl: string;

	// Output
	generateOutput: GenerateOutput | null;
	analyzeOutput: AnalyzeOutput | null;

	// UI state
	isGenerating: boolean;
	isAnalyzing: boolean;
	isAnalyzingImage: boolean;    // loading saat AI analisa gambar custom theme
	error: string;
	activeOutputTab: "titles" | "description" | "tags" | "thumbnail" | "storyboard";
};
