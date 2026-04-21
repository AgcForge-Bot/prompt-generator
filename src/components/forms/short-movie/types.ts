import type { GenreCategoryKey } from './constants'

export type VisualStyleKey =
	| 'cinematic'
	| 'semi-cinematic'
	| 'cinematic-realistic'
	| 'realistic'
	| 'hyper-realistic'

export type AIProviderKey = 'CLAUDE' | 'OPENAI' | 'GEMINI' | 'OPENROUTER'

export type StoryIntensityKey = 'light' | 'balanced' | 'intense'

export type GenderKey = 'auto' | 'male' | 'female'

export type CastCountMode = 'auto' | '1' | '2' | '3' | '4' | '5'

export type SeoPack = {
	title: string
	description: string
	tags: string[]
	thumbnailPrompt: string
}

// ─── MAIN CONFIG ─────────────────────────────────────────────────────────────

export interface ShortMovieConfig {
	// Genre & film selection
	genre: GenreCategoryKey
	movieRefTitle: string
	movieRefStory: string

	// Cast
	castCountMode: CastCountMode
	mainGender: GenderKey

	// Story
	storyIntensity: StoryIntensityKey

	// Duration
	totalMinutes: number
	secPerScene: number

	// Visual
	visualStyle: VisualStyleKey

	// AI Provider
	aiProvider: AIProviderKey
	aiModelId: string
}

// ─── GENERATOR STATE ─────────────────────────────────────────────────────────

export interface ShortMovieGeneratorState {
	config: ShortMovieConfig
	isGenerating: boolean
	allPrompts: string[]
	seoPack: SeoPack | null
	showAllPrompts: boolean
	currentScene: number
	error: string
}
