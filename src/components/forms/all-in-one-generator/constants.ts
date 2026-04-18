import type {
	VideoThemeKey,
	VisualStyleKey,
	ModelGenderAge,
	AllInOneDNA,
	SceneConfig,
} from "./types";

// ─── TEMA VIDEO ───────────────────────────────────────────────────────────────

export const VIDEO_THEMES: Record<
	VideoThemeKey,
	{ label: string; icon: string; description: string; hasModel: boolean }
> = {
	"forest-build-primitive-craft": {
		label: "Forest Build Primitive Craft",
		icon: "🌿",
		description: "ASMR Survival Build — cinematic documentary primitive technology",
		hasModel: true,
	},
	"asmr-timelapse-constructor": {
		label: "ASMR Timelapse Constructor",
		icon: "🏗️",
		description: "ASMR construction timelapse — satisfying build process",
		hasModel: false,
	},
	"car-music-video-clip": {
		label: "Car Music Video Clip",
		icon: "🚗",
		description: "Street racing & DJ car party — high energy cinematic",
		hasModel: false,
	},
	"war-music-video-clip": {
		label: "War Music Video Clip",
		icon: "⚔️",
		description: "Epic war cinematic music video — dramatic battle scenes",
		hasModel: false,
	},
	"relaxing-music-video-clip": {
		label: "Relaxing Music Video Clip",
		icon: "🎵",
		description: "Calming nature drone footage — peaceful music backdrop",
		hasModel: false,
	},
};

// ─── VISUAL STYLES ────────────────────────────────────────────────────────────

export const VISUAL_STYLES: Record<VisualStyleKey, { label: string; desc: string; promptTag: string }> = {
	"cinematic": {
		label: "Cinematic",
		desc: "Film-like quality, dramatic composition, shallow DOF",
		promptTag: "cinematic film quality, dramatic lighting, shallow depth of field, 24fps film look",
	},
	"semi-cinematic": {
		label: "Semi-Cinematic",
		desc: "Balanced between realistic and cinematic",
		promptTag: "semi-cinematic, natural yet polished, warm color grade, smooth motion",
	},
	"cinematic-realistic": {
		label: "Cinematic Realistic",
		desc: "Maximum realism with cinematic framing",
		promptTag: "cinematic realistic, photorealistic quality, natural lighting, film grain texture",
	},
	"realistic": {
		label: "Realistic",
		desc: "Natural, documentary-style footage",
		promptTag: "photorealistic, documentary style, natural handheld movement, organic grain",
	},
	"hyper-realistic": {
		label: "Hyper Realistic",
		desc: "Ultra-detailed, indistinguishable from real footage",
		promptTag: "hyper realistic, 8K ultra detail, physically accurate lighting, no CGI artifacts",
	},
};

// ─── MODEL GENDER & AGE ───────────────────────────────────────────────────────

export const MODEL_GENDER_AGES: Record<ModelGenderAge, { label: string; emoji: string; promptDesc: string }> = {
	"male-young": {
		label: "Laki-laki Muda (19–27 tahun)",
		emoji: "👦",
		promptDesc: "young Indonesian male, 19-27 years old, athletic build, tanned skin, strong hands",
	},
	"male-old": {
		label: "Laki-laki Dewasa (30–45 tahun)",
		emoji: "👨",
		promptDesc: "mature Indonesian male, 30-45 years old, weathered experienced look, sturdy build, calloused hands",
	},
	"female-young": {
		label: "Wanita Muda (19–27 tahun)",
		emoji: "👧",
		promptDesc: "young Indonesian female, 19-27 years old, graceful and capable, determined expression",
	},
	"female-old": {
		label: "Wanita Dewasa (30–45 tahun)",
		emoji: "👩",
		promptDesc: "mature Indonesian female, 30-45 years old, experienced and skilled, confident presence",
	},
};

// ─── OUTFIT OPTIONS (forest-build) ───────────────────────────────────────────

export const OUTFIT_OPTIONS = [
	{ value: "traditional-primitive", label: "Pakaian Primitif Tradisional", desc: "animal hide, woven bark cloth, minimal covering — primitive survival style" },
	{ value: "jungle-explorer", label: "Explorer Hutan", desc: "worn khaki shirt, cargo pants, bush hat, leather boots — rugged explorer style" },
	{ value: "casual-outdoor", label: "Kasual Outdoor", desc: "simple t-shirt, durable pants, sneakers — everyday outdoor casual" },
	{ value: "tribal-inspired", label: "Tribal Terinspirasi", desc: "tribal patterns clothing, earth tones, handmade accessories" },
	{ value: "bush-craft", label: "Bushcraft Survival", desc: "tactical vest, military-style pants, boots, bandana — bushcraft ready" },
	{ value: "minimal-primitive", label: "Minimal Primitif", desc: "minimal loincloth or simple cloth wrap — pure primitive living" },
	{ value: "forest-warrior", label: "Forest Warrior", desc: "dark green tunic, leather belt, primitive armor pieces, mud-stained" },
	{ value: "modern-primitive-mix", label: "Modern x Primitif Mix", desc: "torn modern clothes adapted for survival, makeshift modifications" },
];

// ─── DURATION OPTIONS ─────────────────────────────────────────────────────────

export const TOTAL_DURATION_OPTIONS = [
	{ value: 30, label: "30 detik" },
	{ value: 45, label: "45 detik" },
	{ value: 60, label: "1 menit" },
	{ value: 90, label: "1.5 menit" },
	{ value: 120, label: "2 menit" },
	{ value: 180, label: "3 menit" },
	{ value: 240, label: "4 menit" },
	{ value: 300, label: "5 menit" },
	{ value: 480, label: "8 menit" },
	{ value: 600, label: "10 menit" },
	{ value: 720, label: "12 menit" },
	{ value: 900, label: "15 menit" },
	{ value: 1200, label: "20 menit" },
];

export const SEC_PER_SCENE_OPTIONS = [8, 10, 12, 15, 20];

// ─── THEME-SPECIFIC PROMPT CONTEXT ────────────────────────────────────────────

export const THEME_PROMPT_CONTEXT: Record<VideoThemeKey, string> = {
	"forest-build-primitive-craft": `CONTENT TYPE: ASMR Primitive Survival Build
PLATFORM: YouTube
STYLE RULES:
- NO CGI, NO 3D rendering — photographic realism ONLY
- Natural camera breathing, organic handheld micro-movement
- Film grain visible — analogue texture
- ASMR priority: ambient natural sounds, satisfying craft sounds
- Continuity: SAME person, clothes, location, structure stage throughout all scenes`,

	"asmr-timelapse-constructor": `CONTENT TYPE: ASMR Construction Timelapse
PLATFORM: YouTube & Facebook
STYLE RULES:
- Timelapse progression — time-compressed construction footage
- ASMR sound design: construction sounds, material textures
- Satisfying visual progress — structure growing each scene
- Consistent location, lighting style, and project throughout`,

	"car-music-video-clip": `CONTENT TYPE: Car Music Video Clip — Street Racing & DJ Party
PLATFORM: YouTube & TikTok
STYLE RULES:
- High energy, dynamic camera movements
- Neon lights, night atmosphere preferred
- Cars: detailed, modified, pristine condition
- Music video aesthetic — sync with beat pacing
- Consistent hero car identity throughout all scenes`,

	"war-music-video-clip": `CONTENT TYPE: War Cinematic Music Video
PLATFORM: YouTube
STYLE RULES:
- Epic scale, dramatic composition
- Dust, smoke, fire VFX — photorealistic only
- Military accuracy in equipment and uniforms
- Emotional storytelling through visual narrative
- Consistent faction and location identity`,

	"relaxing-music-video-clip": `CONTENT TYPE: Relaxing Nature Drone Music Video
PLATFORM: YouTube
STYLE RULES:
- Ultra calming, slow movements only
- European nature landscapes — pristine and peaceful
- Drone cinematography — smooth aerial sweeps
- Natural light, golden hour preferred
- No humans unless distant — pure nature focus`,
};

// ─── DEFAULT DNA ──────────────────────────────────────────────────────────────

export const DEFAULT_DNA: AllInOneDNA = {
	totalDurationSec: 60,
	secPerScene: 10,
	totalScenes: 6,
	theme: "forest-build-primitive-craft",
	visualStyle: "cinematic-realistic",
	videoTitle: "",
	coreStoryboard: "",
	modelGenderAge: "male-young",
	outfitKey: "jungle-explorer",
	aiProvider: "CLAUDE",
	aiModelId: "claude-sonnet-4-20250514",
	dnaLocked: false,
};

// ─── DEFAULT SCENE ────────────────────────────────────────────────────────────

export function createDefaultScene(id: number): SceneConfig {
	return {
		id,
		storyboard: "",
		imageRefs: [],
		generatedPrompt: undefined,
		isGenerating: false,
	};
}

export function buildScenesFromDNA(dna: AllInOneDNA): SceneConfig[] {
	return Array.from({ length: dna.totalScenes }, (_, i) =>
		createDefaultScene(i + 1)
	);
}

// ─── CALC TOTAL SCENES ────────────────────────────────────────────────────────

export function calcTotalScenes(totalSec: number, secPerScene: number): number {
	return Math.max(2, Math.floor(totalSec / secPerScene));
}
