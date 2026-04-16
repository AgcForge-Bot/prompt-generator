export { };

declare global {
	type Nullable<T> = T | null;

	type ProjectType = 'survival-build' | 'restoration'
	type ModelGender = 'male' | 'female'
	type TravelMode = 'foot' | 'camper-van' | 'snowfox' | 'bicycle' | 'motorbike'
	type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'night'
	type ScenePhaseKey =
		| 'hook' | 'preparation' | 'journey' | 'arrival'
		| 'build' | 'challenge' | 'living' | 'closing'

	type SceneTypeKey =
		| 'establishing' | 'action' | 'detail' | 'progress'
		| 'nature' | 'timelapse' | 'documentary'
		| 'emo-animal' | 'emo-civilian' | 'emo-wonder'
		| 'emo-rescue' | 'emo-cook' | 'emo-fire' | 'emo-reflect'

	type ModelType = "CLAUDE" | "OPENAI" | "GEMINI" | "OPENROUTER"

	interface ProjectDNA {
		// Identity
		videoTitle: string
		modelGender: ModelGender
		hasPet: boolean
		petType: string
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
		filmStyle: string   // NEW: anti-CGI style anchor
		// Locked status
		locked: boolean
	}
	interface SceneConfig {
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
		filmQuality: string   // NEW: realism anchor per scene
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
	interface ImageRef {
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
	interface GeneratorState {
		// Duration
		totalMinutes: number
		secPerScene: number
		totalScenes: number

		// DNA
		dna: ProjectDNA

		// Scenes
		scenes: SceneConfig[]
		currentScene: number

		// Images
		globalImages: ImageRef[]

		// Generated
		allPrompts: string[]
	}
	interface PhaseMeta {
		key: ScenePhaseKey
		label: string
		emoji: string
		ratio: number
		count: number
		note: string
	}
	interface AnalyzeImageRequest {
		base64?: string
		mediaType?: string
		url?: string
		scope: 'global' | 'scene'
		sceneNum?: number
		model: ModelType
		modelId?: string
	}
	interface AnalyzeImageResponse {
		description?: string
		error?: string
	}
}
