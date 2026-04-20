import type { RANDOM_GROUP_FIELDS, SCENE_TYPES, TOD_DATA } from "./constants";



export type TabKey =
	| "nature"
	| "location"
	| "animals"
	| "visuals"
	| "lighting"
	| "drone"
	| "elements"
	| "style";

export type SceneTypeKey = keyof typeof SCENE_TYPES;
export type TodKey = keyof typeof TOD_DATA;
export type RandomGroupKey = keyof typeof RANDOM_GROUP_FIELDS;
export type VisualStyleKey =
	| "cinematic"
	| "semi-cinematic"
	| "cinematic-realistic"
	| "realistic"
	| "hyper-realistic";

export type SceneConfig = {
	natSpot: string;
	natWater: string;
	natVegetation: string;
	natTerrain: string;

	locCountry: string;
	locSetting: string;
	locWeather: string;
	locPalette: string;

	aniBirds: string;
	aniLand: string;
	aniInsects: string;
	aniWater: string;

	visComposition: string;
	visFlowers: string;
	visRocks: string;
	visSky: string;

	lightMain: string;
	lightFx: string;
	lightColor: string;
	lightShadow: string;

	camMove: string;
	camAngle: string;
	camLens: string;
	camSpeed: string;

	elemWind: string;
	elemHuman: string;
	elemAtmo: string;
	elemSeason: string;

	styMood: string;
	styGrade: string;
	styQuality: string;
	styMusic: string;

	generatedPrompt?: string;
};

export type RelaxingMusicVideoGenerator = {
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

	timeOfDay: TodKey;
	setTimeOfDaySafe: (next: TodKey) => void;

	currentScene: number;
	setCurrentSceneSafe: (sceneNum: number) => void;

	sceneTypes: Record<number, SceneTypeKey>;
	setSceneTypeForScene: (sceneNum: number, next: SceneTypeKey) => void;
	scType: SceneTypeKey;
	scTypeLabel: string;
	progressPct: number;

	randomGroups: Record<RandomGroupKey, boolean>;
	setRandomGroups: (next: (prev: Record<RandomGroupKey, boolean>) => Record<RandomGroupKey, boolean>) => void;

	sceneConfigs: Record<number, SceneConfig>;
	getSceneConfig: (sceneNum: number) => SceneConfig;
	updateSceneConfig: (sceneNum: number, updates: Partial<SceneConfig>) => void;

	promptOutput: string;
	allPrompts: string[];
	showAllPrompts: boolean;
	setShowAllPrompts: (next: boolean) => void;

	generatePrompt: () => void;
	nextScene: () => void;
	copyPrompt: () => void;
	copyAll: () => void;
	downloadAllJson: () => void;
	generateAll: () => void;

	randomizeCurrentScene: () => void;
	randomAllScenes: () => void;
	randomSceneType: () => void;

	toast: { msg: string; show: boolean };
};
