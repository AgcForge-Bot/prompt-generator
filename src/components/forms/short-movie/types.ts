import type { Dispatch, SetStateAction } from 'react'
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

// ─── NARRATION / DIALOG ──────────────────────────────────────────────────────

export type NarrationModeKey =
	| 'none'       // Pure visual — no dialog, no voiceover
	| 'subtitle'   // On-screen subtitle dialog
	| 'voiceover'  // Off-screen narrator voiceover

export type DialogLanguageKey =
	| 'English'
	| 'Spanish'
	| 'French'
	| 'Russian'
	| 'Chinese'
	| 'Indonesian'

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

	// Narration / Dialog
	narrationMode: NarrationModeKey
	dialogLanguage: DialogLanguageKey

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

export interface ShortMovieGeneratorConfig {
	config: ShortMovieConfig;
	updateConfig: (updates: Partial<ShortMovieConfig>) => void;
	setGenre: (genre: ShortMovieConfig["genre"]) => void;
	setMovieRef: (title: string) => void;
	setMovieRefManual: (title: string, story?: string) => void;
	setMovieStoryManual: (story: string) => void;
	setAiProvider: (provider: AIProviderKey) => void;
	setDuration: (minutes: number, secPerScene: number) => void;
	totalScenes: number;
	movieOptions: { title: string, story?: string }[];
	isGenerating: boolean
	generateAllWithAI: () => Promise<void>
	allPrompts: string[]
	seoPack: SeoPack | null
	showAllPrompts: boolean
	setShowAllPrompts: Dispatch<SetStateAction<boolean>>
	currentScene: number
	setCurrentScene: Dispatch<SetStateAction<number>>
	copyPrompt: () => void
	copyAll: () => void
	downloadAllJson: () => void
	downloadAllZip: () => void
	copySeoTitle: () => void
	copySeoDescription: () => void
	copySeoTags: () => void
	copySeoThumbnailPrompt: () => void
	downloadSeoPackJson: () => void
	downloadSeoPackTxt: () => void
	toast: { msg: string, show: boolean }
}
