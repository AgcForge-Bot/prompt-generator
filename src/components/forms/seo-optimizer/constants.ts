import type { VideoThemeKey, ModelType, SeoFormState } from "./types";

// ─── TEMA VIDEO ───────────────────────────────────────────────────────────────

export const VIDEO_THEMES: Record<
	VideoThemeKey,
	{
		label: string;
		icon: string;
		niche: string;
		platform: string;
		keywordSeed: string[];
		audienceDesc: string;
		contentStyle: string;
	}
> = {
	"forest-build-primitive-craft": {
		label: "Forest Build Primitive Craft",
		icon: "🌿",
		niche: "ASMR Primitive Survival Build",
		platform: "YouTube",
		keywordSeed: [
			"primitive technology",
			"bushcraft",
			"forest shelter build",
			"asmr build",
			"survival skills",
			"primitive shelter",
			"off grid",
			"wilderness survival",
			"mud house",
			"primitive life",
		],
		audienceDesc: "Penonton yang suka konten ASMR, survival, primitive technology, bushcraft, dan nature content",
		contentStyle: "Cinematic documentary, ASMR, satisfying build, primitive technology, nature immersion",
	},
	"asmr-timelapse-constructor": {
		label: "ASMR Timelapse Constructor",
		icon: "🏗️",
		niche: "ASMR Construction Timelapse",
		platform: "YouTube & Facebook",
		keywordSeed: [
			"construction timelapse",
			"building timelapse",
			"asmr construction",
			"satisfying build",
			"house construction",
			"timelapse video",
			"building restoration",
			"satisfying construction",
			"restoration timelapse",
			"build process",
		],
		audienceDesc: "Penonton yang suka konten satisfying, construction timelapse, ASMR, dan restoration video",
		contentStyle: "ASMR timelapse, satisfying construction process, restoration, cinematic build documentation",
	},
	"car-music-video-clip": {
		label: "Car Music Video Clip",
		icon: "🚗",
		niche: "Car Music Video / Street Racing",
		platform: "YouTube & TikTok",
		keywordSeed: [
			"car music video",
			"street racing",
			"drift video",
			"car show",
			"fast and furious",
			"car club",
			"modified cars",
			"car dj party",
			"import scene",
			"car meet",
		],
		audienceDesc: "Penonton yang suka konten otomotif, street racing, car culture, DJ party, dan music video",
		contentStyle: "High energy car culture, DJ music video, street racing, cinematic car shots, night events",
	},
	"war-music-video-clip": {
		label: "War Music Video Clip",
		icon: "⚔️",
		niche: "War Cinematic Music Video",
		platform: "YouTube",
		keywordSeed: [
			"war cinematic",
			"military music video",
			"battle scene",
			"war epic",
			"cinematic war",
			"military tribute",
			"epic battle",
			"war documentary style",
			"soldier tribute",
			"cinematic military",
		],
		audienceDesc: "Penonton yang suka konten war cinematic, military, epic music video, historical battle recreation",
		contentStyle: "Epic cinematic war footage, dramatic battle scenes, military tribute, high production value",
	},
	"relaxing-music-video-clip": {
		label: "Relaxing Music Video Clip",
		icon: "🎵",
		niche: "Relaxing Nature Drone Music",
		platform: "YouTube",
		keywordSeed: [
			"relaxing music",
			"nature drone",
			"peaceful music",
			"stress relief music",
			"meditation music",
			"sleep music",
			"calming music",
			"nature sounds",
			"4k nature",
			"relaxing drone footage",
		],
		audienceDesc: "Penonton yang mencari konten relaksasi, meditasi, sleep music, nature footage untuk stress relief",
		contentStyle: "Ultra calming drone nature footage, peaceful music backdrop, 4K scenic landscapes",
	},
};

// ─── AI MODELS ────────────────────────────────────────────────────────────────

export const AI_PROVIDERS: { value: ModelType; label: string; defaultModel: string }[] = [
	{ value: "CLAUDE", label: "Claude (Anthropic)", defaultModel: "claude-sonnet-4-20250514" },
	{ value: "OPENAI", label: "OpenAI GPT-4o", defaultModel: "gpt-4o" },
	{ value: "GEMINI", label: "Gemini", defaultModel: "gemini-2.5-flash-lite" },
	{ value: "OPENROUTER", label: "OpenRouter", defaultModel: "google/gemini-2.5-flash-lite" },
];

export function getDefaultModelId(provider: ModelType): string {
	return AI_PROVIDERS.find((p) => p.value === provider)?.defaultModel ?? "claude-sonnet-4-20250514";
}

// ─── SEO SCORE GRADE ─────────────────────────────────────────────────────────

export function getGrade(score: number): "A" | "B" | "C" | "D" | "F" {
	if (score >= 85) return "A";
	if (score >= 70) return "B";
	if (score >= 55) return "C";
	if (score >= 40) return "D";
	return "F";
}

export function getGradeColor(grade: "A" | "B" | "C" | "D" | "F"): string {
	const map: Record<string, string> = {
		A: "text-leaf2 border-leaf/50 bg-leaf/10",
		B: "text-amber2 border-amber/40 bg-amber/8",
		C: "text-sand border-sand/40 bg-sand/8",
		D: "text-clay border-clay/40 bg-clay/8",
		F: "text-red-400 border-red-500/40 bg-red-950/20",
	};
	return map[grade] ?? map.F;
}

export function getScoreBarColor(score: number): string {
	if (score >= 85) return "from-leaf to-leaf2";
	if (score >= 70) return "from-amber to-amber2";
	if (score >= 55) return "from-sand to-clay";
	return "from-clay to-earth";
}

export function getVolumeColor(volume: "High" | "Medium" | "Low"): string {
	const map: Record<string, string> = {
		High: "text-leaf2 bg-leaf/10 border-leaf/30",
		Medium: "text-amber2 bg-amber/10 border-amber/30",
		Low: "text-stone2 bg-bark/30 border-stone/20",
	};
	return map[volume] ?? map.Low;
}

// ─── LANGUAGE OPTIONS ─────────────────────────────────────────────────────────

export const LANGUAGE_OPTIONS = [
	{ value: "id", label: "🇮🇩 Bahasa Indonesia" },
	{ value: "en", label: "🇺🇸 English" },
	{ value: "both", label: "🌐 Bilingual (ID + EN)" },
] as const;

// ─── DEFAULT STATE ────────────────────────────────────────────────────────────

export const DEFAULT_SEO_STATE: SeoFormState = {
	mode: "generate",
	theme: "forest-build-primitive-craft",
	aiModel: "CLAUDE",
	aiModelId: "claude-sonnet-4-20250514",
	customKeyword: "",
	targetAudience: "",
	videoStyle: "",
	language: "id",
	videoUrl: "",
	generateOutput: null,
	analyzeOutput: null,
	isGenerating: false,
	isAnalyzing: false,
	error: "",
	activeOutputTab: "titles",
};
