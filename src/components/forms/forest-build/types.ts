export type ProjectType = 'survival-build' | 'restoration'
export type ModelGender = 'male' | 'female'
export type TravelMode = 'foot' | 'camper-van' | 'snowfox' | 'bicycle' | 'motorbike'
export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'night'
export type ScenePhaseKey =
	| 'hook' | 'preparation' | 'journey' | 'arrival'
	| 'build' | 'challenge' | 'living' | 'closing'

export type SceneTypeKey =
	| 'establishing' | 'action' | 'detail' | 'progress'
	| 'nature' | 'timelapse' | 'documentary'
	| 'emo-animal' | 'emo-civilian' | 'emo-wonder'
	| 'emo-rescue' | 'emo-cook' | 'emo-fire' | 'emo-reflect'
export type ModelType = "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER"
// ─── PROJECT DNA ─────────────────────────────────────────────────────────────

export interface ProjectDNA {
	// Identity
	videoTitle: string
	modelGender: ModelGender
	hasPet: boolean
	petType: string

	// CHARACTER ANCHOR — wajah & fisik dikunci ketat
	characterAge: string
	characterFace: string
	characterHair: string
	characterBuild: string
	characterOutfit: string
	characterGear: string

	// VEHICLE ANCHOR — dikunci ketat jika bukan foot
	vehicleDesc: string

	// SHELTER ANCHOR — dimensi & detail spesifik
	shelterDimension: string
	shelterExterior: string
	shelterInterior: string

	// Journey
	travelMode: TravelMode
	location: string
	climate: string

	// Build
	shelterType: string
	buildMaterial: string
	hasCargoDrop: boolean
	furnishings: string[]

	// Visual DNA
	colorPalette: string
	soundscape: string
	filmStyle: string

	// Locked status
	locked: boolean
}

export type ProjectDNATab = 'identity' | 'character' | 'vehicle' | 'shelter'

// ─── SCENE ────────────────────────────────────────────────────────────────────

export interface SceneConfig {
	id: number
	phase: ScenePhaseKey
	sceneType: SceneTypeKey
	timeOfDay: TimeOfDay
	isEmotional: boolean

	// Camera
	camAngle: string
	camMove: string
	camMood: string
	camLens: string
	camDOF: string
	filmQuality: string
	colorGrade: string

	// Craft / Action
	activity: string
	detailFocus: string
	progressNote: string
	satisfyMoment: string

	// Sound
	soundPrimary: string
	soundAmbient: string
	soundBG: string

	// Visual
	lightSource: string
	lightFX: string
	atmosphere: string
	foreground: string

	// Nature
	wildlife: string
	weather: string
	vegetation: string

	// Emotional (optional)
	emoType?: string
	emoTone?: string
	emoSound?: string

	// Image refs
	imageRefs: ImageRef[]

	// Generated
	generatedPrompt?: string
	snapshot?: Record<string, number>
}

// ─── IMAGE REFERENCE ─────────────────────────────────────────────────────────

export interface ImageRef {
	id: string
	type: 'upload' | 'url'
	url: string
	name: string
	scope: 'global' | 'scene'
	sceneNum?: number
	base64?: string
	mediaType?: string
	aiDescription?: string
	status: 'pending' | 'analyzing' | 'done' | 'failed'
}

// ─── STORE STATE ─────────────────────────────────────────────────────────────

export interface GeneratorState {
	totalMinutes: number
	secPerScene: number
	totalScenes: number
	dna: ProjectDNA
	scenes: SceneConfig[]
	currentScene: number
	globalImages: ImageRef[]
	allPrompts: string[]
}

// ─── PHASE META ───────────────────────────────────────────────────────────────

export interface PhaseMeta {
	key: ScenePhaseKey
	label: string
	emoji: string
	ratio: number
	count: number
	note: string
}

// ─── API TYPES ────────────────────────────────────────────────────────────────

export interface AnalyzeImageRequest {
	base64?: string
	mediaType?: string
	url?: string
	scope: 'global' | 'scene'
	sceneNum?: number
}

export interface AnalyzeImageResponse {
	description?: string
	error?: string
}
