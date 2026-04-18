import type { SceneConfig, ScenePhaseKey, SceneTypeKey, ProjectDNA } from './types'
import { PHASE_RATIOS } from './utils'

const BASE_DEFAULT: Omit<SceneConfig, 'id' | 'phase' | 'sceneType' | 'timeOfDay' | 'isEmotional'> = {
	camAngle: 'wide establishing fixed — full environment and subject visible, nature dominant',
	camMove: 'completely static locked-off — pure stillness, nature and subject move inside frame',
	camMood: 'meditative & deeply satisfying — unhurried, every movement purposeful',
	camLens: 'wide 24mm — environment-inclusive, always aware of surroundings',
	camDOF: 'medium depth — subject sharp, background forest natural soft',
	filmQuality: 'shot on Sony FX3 — handheld documentary, organic natural motion, 24fps cinematic',
	colorGrade: 'warm natural earthy — Kodak Vision3 film emulation, honest color',
	// Activity defaults — will be overridden by promptBuilder for build/challenge phases
	activity: 'moving deliberately through environment — purposeful, experienced movement',
	detailFocus: 'hands and environment interaction — human scale against nature scale',
	progressNote: 'establishing spatial context — viewer understands location and scale',
	satisfyMoment: 'perfectly framed wide shot — nature and subject in harmony',
	soundPrimary: 'footsteps on natural terrain — leaves, twigs, earth — satisfying texture',
	soundAmbient: 'rich forest ambient — birds, wind, water — full living environment',
	soundBG: 'no music — pure natural sound only, maximally ASMR',
	lightSource: 'natural daylight through forest canopy — dappled, organic, moving',
	lightFX: 'dust motes in light shafts — particles visible in sunbeam',
	atmosphere: 'crystal clear fresh air — maximum visibility, crisp contrast',
	foreground: 'large fern fronds framing scene — natural organic frame element',
	wildlife: 'birds visible in background trees — life and activity in forest',
	weather: 'perfect calm — ideal conditions, light breeze only',
	vegetation: 'rich undergrowth — ferns, mosses, wildflowers all around',
	imageRefs: [],
}

const PHASE_ACTIVITY_DEFAULTS: Partial<Record<ScenePhaseKey, Partial<typeof BASE_DEFAULT>>> = {
	preparation: {
		activity: 'packing and checking all gear methodically — every item deliberate and purposeful',
		detailFocus: 'hands placing items into pack, tools being inspected, food being sorted',
		progressNote: 'pack growing fuller, all gear visible and accounted for',
		satisfyMoment: 'pack fully loaded, straps adjusted, ready to depart',
		soundPrimary: 'buckles clicking, pack zips, material sounds of preparation',
	},
	journey: {
		activity: 'traveling through varied terrain — steady purposeful pace, adapting to ground',
		detailFocus: 'feet on terrain, hands on trekking poles or vehicle controls, eyes scanning ahead',
		progressNote: 'landscape changing, becoming more remote, less human presence',
		satisfyMoment: 'reaching a high point or vista — pausing to take in the scale of the journey',
		soundPrimary: 'footsteps varying with terrain, or vehicle engine sound, or wheels on track',
	},
	arrival: {
		activity: 'exploring and scouting the build site — walking, crouching, testing ground',
		detailFocus: 'hands testing soil firmness, eyes scanning tree canopy, foot pressing earth',
		progressNote: 'site being assessed, ideal location being identified and chosen',
		satisfyMoment: 'the moment the perfect spot is found — hands pressed to ground, decision made',
		soundPrimary: 'footsteps through undergrowth, branch pushed aside, ground tested with tool',
	},
	build: {
		// These will be overridden by promptBuilder's getBuildSubStage()
		activity: 'active construction — physically building the shelter structure',
		detailFocus: 'hands working material, tool meeting surface, structure growing',
		progressNote: 'shelter visibly progressing from previous scene — new section added or height gained',
		satisfyMoment: 'a piece fitting perfectly, a section complete, structure proving its strength',
		soundPrimary: 'axe striking wood, stones placed and stacked, material being worked by hands',
	},
	challenge: {
		// These will be overridden by promptBuilder's challenge context
		activity: 'responding to natural challenge — protecting and continuing construction despite obstacle',
		detailFocus: 'hands working urgently, face showing determination, nature versus human will',
		progressNote: 'challenge faced and overcome — construction resumes after the obstacle',
		satisfyMoment: 'the obstacle passes or is overcome — work immediately resumes, determination clear',
		soundPrimary: 'rain on materials, wind through structure, urgent work sounds mixed with weather',
	},
	living: {
		activity: 'inhabiting the completed shelter — cooking, resting, connecting with the natural world',
		detailFocus: 'food being prepared, fire being tended, hands in satisfying natural tasks',
		progressNote: 'shelter is fully complete and functional — the reward phase is fully underway',
		satisfyMoment: 'eating a meal, sitting by fire, watching rain from inside — pure earned peace',
		soundPrimary: 'fire crackling, food cooking, rain on completed roof, wind through trees outside',
	},
	closing: {
		activity: 'sitting quietly at the completed shelter — watching the natural world',
		detailFocus: 'face in quiet satisfaction, shelter visible and complete, landscape extending behind',
		progressNote: 'the full arc is complete — shelter stands finished in its natural setting',
		satisfyMoment: 'wide shot revealing shelter within landscape — small but perfect, deeply earned',
		soundPrimary: 'pure ambient nature — birds, wind, water — no construction sounds remain',
	},
}

// ─── DEFAULT TIME OF DAY BY PHASE ────────────────────────────────────────────

function defaultTODForPhase(phase: ScenePhaseKey): SceneConfig['timeOfDay'] {
	const map: Record<ScenePhaseKey, SceneConfig['timeOfDay']> = {
		hook: 'afternoon',
		preparation: 'morning',
		journey: 'noon',
		arrival: 'afternoon',
		build: 'noon',
		challenge: 'afternoon',
		living: 'night',
		closing: 'morning',
	}
	return map[phase]
}


// ─── DEFAULT SCENE TYPE BY PHASE ─────────────────────────────────────────────

function defaultSceneType(phase: ScenePhaseKey, idx: number): SceneTypeKey {
	const sequencesMap: Record<ScenePhaseKey, SceneTypeKey[]> = {
		hook: ['establishing', 'action', 'detail', 'progress', 'establishing'],
		preparation: ['establishing', 'detail', 'action', 'progress', 'documentary'],
		journey: ['establishing', 'documentary', 'nature', 'establishing', 'detail', 'documentary', 'nature', 'establishing'],
		arrival: ['establishing', 'documentary', 'detail', 'nature', 'establishing'],
		build: ['action', 'detail', 'progress', 'action', 'detail', 'timelapse', 'progress', 'action', 'detail', 'progress', 'action', 'timelapse'],
		challenge: ['establishing', 'documentary', 'action', 'detail', 'progress'],
		living: ['action', 'detail', 'nature', 'establishing', 'documentary', 'detail', 'action', 'nature'],
		closing: ['establishing', 'nature', 'documentary', 'establishing'],
	}
	const seq = sequencesMap[phase] ?? ['action']
	return seq[idx % seq.length]
}

// ─── EMOTION PLACEMENT ────────────────────────────────────────────────────────

function computeEmotionScenes(totalScenes: number): Set<number> {
	const set = new Set<number>()
	const markers = [
		Math.round(totalScenes * 0.18),  // Early journey encounter
		Math.round(totalScenes * 0.32),  // Mid-journey wonder
		Math.round(totalScenes * 0.50),  // Mid-build interlude
		Math.round(totalScenes * 0.68),  // Challenge recovery
		Math.round(totalScenes * 0.82),  // Living / cooking scene
	]
	markers.forEach(m => { if (m >= 1 && m <= totalScenes) set.add(m) })
	return set
}

const EMOTION_SEQUENCE: SceneTypeKey[] = [
	'emo-civilian', 'emo-animal', 'emo-wonder', 'emo-rescue', 'emo-cook', 'emo-reflect', 'emo-fire',
]

// ─── PHASE BUILDER ────────────────────────────────────────────────────────────

export function computePhases(totalScenes: number): Array<{ key: ScenePhaseKey; count: number; start: number }> {
	const keys = Object.keys(PHASE_RATIOS) as ScenePhaseKey[]
	let allocated = 0
	const result = keys.map((key, i) => {
		const count = i < keys.length - 1
			? Math.max(1, Math.round(PHASE_RATIOS[key] * totalScenes))
			: totalScenes - allocated
		const start = allocated + 1
		allocated += count
		return { key, count, start }
	})
	return result
}

// ─── MAIN: GENERATE SCENES ────────────────────────────────────────────────────

export function generateScenes(
	totalScenes: number,
	_dna: ProjectDNA,
	existingScenes?: SceneConfig[]
): SceneConfig[] {
	const phases = computePhases(totalScenes)
	const emotionSet = computeEmotionScenes(totalScenes)
	let emotionIdx = 0
	const scenes: SceneConfig[] = []

	for (const phase of phases) {
		// Merge base default with phase-specific defaults
		const phaseDefaults = PHASE_ACTIVITY_DEFAULTS[phase.key] ?? {}
		const defaultForPhase = { ...BASE_DEFAULT, ...phaseDefaults }

		for (let i = 0; i < phase.count; i++) {
			const sceneId = phase.start + i
			const existing = existingScenes?.find(s => s.id === sceneId)
			const isEmo = emotionSet.has(sceneId)

			scenes.push({
				...defaultForPhase,
				...(existing ?? {}),
				id: sceneId,
				phase: phase.key,
				sceneType: existing?.sceneType ?? (isEmo ? EMOTION_SEQUENCE[emotionIdx++ % EMOTION_SEQUENCE.length] : defaultSceneType(phase.key, i)),
				timeOfDay: existing?.timeOfDay ?? defaultTODForPhase(phase.key),
				isEmotional: existing?.isEmotional ?? isEmo,
				imageRefs: existing?.imageRefs ?? [],
			})
		}
	}

	return scenes
}
