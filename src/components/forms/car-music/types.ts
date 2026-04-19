import type { SCENE_TYPE_LABELS } from "./constants";

export type TabKey =
	| "cars"
	| "dj"
	| "crowd"
	| "trailer"
	| "location"
	| "lighting"
	| "props"
	| "camera";

export type SceneTypeKey = keyof typeof SCENE_TYPE_LABELS;
export type ClipModeKey = "classic" | "trailer";
export type AIProviderKey = "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER";
export type TrailerCharacter = {
	name: string;
	role: string;
	faceDescription: string;
	introSceneNumber?: number;
};
export type SeoPack = {
	title: string;
	description: string;
	tags: string[];
	thumbnailPrompt: string;
};
export type VisualStyleKey =
	| "cinematic"
	| "semi-cinematic"
	| "cinematic-realistic"
	| "realistic"
	| "hyper-realistic";

export type SceneConfig = {
	carHero: string;
	carSecondary: string;
	carAction: string;
	carDetail: string;
	carColor: string;
	carCount: string;

	djType: string;
	djSetup: string;
	djAction: string;
	djOutfit: string;
	djFx: string;
	djSound: string;

	crowdMix: string;
	crowdEnergy: string;
	crowdAction: string;
	crowdFashion: string;
	crowdDensity: string;
	crowdMoment: string;

	locMain: string;
	locTime: string;
	locPalette: string;
	locAtmo: string;

	lightMain: string;
	lightFx: string;
	lightColor: string;
	lightShadow: string;

	propFire: string;
	propSmoke: string;
	propAnimal: string;
	propDeco: string;
	propChar: string;
	propSfx: string;

	camAngle: string;
	camMove: string;
	camMood: string;
	camQuality: string;
	camGrade: string;
	camLens: string;

	trailerBeat?: string;
	trailerSetpiece?: string;
	trailerEmotion?: string;
	trailerFocusCharacter?: string;
	trailerCreditText?: string;

	generatedPrompt?: string;
};

export type CarMusicVideoGenerator = {
	tabs: { key: TabKey; label: string }[];
	activeTab: TabKey;
	setActiveTab: (tab: TabKey) => void;

	totalMinutes: number;
	secPerScene: number;
	totalScenes: number;
	onDurationChange: (min: number, sec: number) => void;

	visualStyle: VisualStyleKey;
	visualStyleLabel: string;
	setVisualStyleSafe: (next: VisualStyleKey) => void;

	clipMode: ClipModeKey;
	setClipMode: (next: ClipModeKey) => void;
	filmRef: string;
	setFilmRef: (next: string) => void;
	aiProvider: AIProviderKey;
	aiModelId: string;
	setAiProvider: (next: AIProviderKey) => void;
	setAiModelId: (next: string) => void;
	isGeneratingAI: boolean;

	trailerCharacters: TrailerCharacter[];
	updateTrailerCharacter: (index: number, next: Partial<TrailerCharacter>) => void;
	randomizeTrailerCharacters: () => void;
	normalizeTrailerIntroScenes: () => void;

	currentScene: number;
	setCurrentSceneSafe: (sceneNum: number) => void;

	sceneTypes: Record<number, SceneTypeKey>;
	setSceneTypeForScene: (sceneNum: number, next: SceneTypeKey) => void;
	scType: SceneTypeKey;
	scTypeLabel: string;

	randomGroups: Record<TabKey, boolean>;
	setRandomGroups: (next: (prev: Record<TabKey, boolean>) => Record<TabKey, boolean>) => void;

	sceneConfigs: Record<number, SceneConfig>;
	getSceneConfig: (sceneNum: number) => SceneConfig;
	updateSceneConfig: (sceneNum: number, updates: Partial<SceneConfig>) => void;

	promptOutput: string;
	allPrompts: string[];
	showAllPrompts: boolean;
	setShowAllPrompts: (next: boolean) => void;

	seoPack: SeoPack | null;
	copySeoTitle: () => void;
	copySeoDescription: () => void;
	copySeoTags: () => void;
	copySeoThumbnailPrompt: () => void;
	downloadSeoPackJson: () => void;
	downloadSeoPackTxt: () => void;

	generatePrompt: () => void;
	nextScene: () => void;
	copyPrompt: () => void;
	copyAll: () => void;
	downloadAllJson: () => void;
	generateAllWithAI: () => void;
	generateAll: () => void;

	randomizeCurrentScene: () => void;
	randomAllScenes: () => void;
	randomSceneType: () => void;

	toast: { msg: string; show: boolean };
};
