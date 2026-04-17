import type { RANDOM_IDS, SCENE_TYPES, TOD_DATA } from "./constants";

export type ProjectTypeKey = keyof typeof SCENE_TYPES;
export type TodKey = keyof typeof TOD_DATA;
export type SceneTypeKey =
	| keyof typeof SCENE_TYPES.restoration
	| keyof typeof SCENE_TYPES.construction;

export type TabKey =
	| "timelapse"
	| "equipment"
	| "narration"
	| "lighting"
	| "asmr"
	| "camera";

export type RandomGroupKey = keyof typeof RANDOM_IDS;

export type DnaState = {
	building: string;
	location: string;
	climate: string;
	material: string;
	palette: string;
	team: string;
};

export type SceneConfig = {
	tlMode: string;
	tlCompression: string;
	tlProgress: string;
	tlSky: string;

	eqMain: string;
	eqSupport: string;
	eqHand: string;
	eqMotion: string;

	narFreq: string;
	narStyle: string;
	narLine: string;
	narAudio: string;

	lightMain: string;
	lightFx: string;
	lightColor: string;
	lightShadow: string;

	asmrMusic: string;
	asmrLayer: string;
	asmrAmbient: string;
	asmrMoment: string;

	camAngle: string;
	camMove: string;
	camMood: string;
	camQuality: string;
	camGrade: string;
	camLens: string;

	generatedPrompt?: string;
};

export type AsmrTimelapseGenerator = {
	tabs: { key: TabKey; label: string }[];

	totalMinutes: number;
	secPerScene: number;
	totalScenes: number;
	onDurationChange: (min: number, sec: number) => void;

	projectType: ProjectTypeKey;
	setProjectTypeSafe: (next: ProjectTypeKey) => void;

	narratorGender: "male" | "female";
	setNarratorGenderSafe: (next: "male" | "female") => void;

	timeOfDay: TodKey;
	setTimeOfDaySafe: (next: TodKey) => void;

	dnaLocked: boolean;
	dnaPreviewOpen: boolean;
	setDnaPreviewOpen: (next: boolean | ((prev: boolean) => boolean)) => void;

	currentScene: number;
	setCurrentSceneSafe: (sceneNum: number) => void;

	activeTab: TabKey;
	setActiveTab: (tab: TabKey) => void;

	sceneTypes: Record<number, SceneTypeKey>;
	setSceneTypes: (next: (prev: Record<number, SceneTypeKey>) => Record<number, SceneTypeKey>) => void;
	setSceneTypeForScene: (sceneNum: number, next: SceneTypeKey) => void;

	dna: DnaState;
	setDna: (next: DnaState | ((prev: DnaState) => DnaState)) => void;

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
	generateAll: () => void;

	randomizeDNA: () => void;
	lockDNA: () => void;
	randomCurrentScene: () => void;
	randomAllScenes: () => void;
	randomSceneType: () => void;

	scType: SceneTypeKey;
	scTypeLabel: string;
	progressPct: number;

	toast: { msg: string; show: boolean };
};
