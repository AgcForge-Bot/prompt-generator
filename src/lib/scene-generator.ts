import { PHASE_RATIOS } from './data'

// ─── DEFAULT SCENE VALUES ────────────────────────────────────────────────────

const DEFAULT_SCENE: Omit<SceneConfig, 'id' | 'phase' | 'sceneType' | 'timeOfDay' | 'isEmotional'> = {
	camAngle: 'wide establishing fixed — full environment and subject visible, nature dominant',
	camMove: 'completely static locked-off — pure stillness, nature and subject move inside frame',
	camMood: 'meditative & deeply satisfying — unhurried, every movement purposeful',
	camLens: 'wide 24mm — environment-inclusive, always aware of surroundings',
	camDOF: 'medium depth — subject sharp, background forest natural soft',
	filmQuality: 'shot on Sony FX3 — handheld documentary, organic natural motion, 24fps cinematic',
	colorGrade: 'warm natural earthy — Kodak Vision3 film emulation, honest color',
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

// ─── DEFAULT TIME OF DAY BY PHASE ────────────────────────────────────────────

function defaultTODForPhase(phase: ScenePhaseKey) {
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
	// Auto-place emotional moments at logical story points
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
	let globalSceneIdx = 0

	for (const phase of phases) {
		for (let i = 0; i < phase.count; i++) {
			const sceneId = phase.start + i
			const existing = existingScenes?.find(s => s.id === sceneId)
			const isEmo = emotionSet.has(sceneId)

			scenes.push({
				...DEFAULT_SCENE,
				...(existing ?? {}),
				id: sceneId,
				phase: phase.key,
				sceneType: existing?.sceneType ?? (isEmo ? EMOTION_SEQUENCE[emotionIdx++ % EMOTION_SEQUENCE.length] : defaultSceneType(phase.key, i)),
				timeOfDay: existing?.timeOfDay ?? defaultTODForPhase(phase.key),
				isEmotional: existing?.isEmotional ?? isEmo,
				imageRefs: existing?.imageRefs ?? [],
			})
			globalSceneIdx++
		}
	}

	return scenes
}
