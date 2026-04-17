// import { PHASE_META, TOD_DATA, ANTI_CGI_RULES, SCENE_TYPES_NORMAL, SCENE_TYPES_EMOTION } from './data'

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// function fmtTime(totalSec: number): string {
// 	const m = Math.floor(totalSec / 60)
// 	const s = totalSec % 60
// 	return `${m}:${s < 10 ? '0' : ''}${s}`
// }

// function allSceneTypes() {
// 	return [...SCENE_TYPES_NORMAL, ...SCENE_TYPES_EMOTION]
// }

// function getTypeLabel(key: SceneTypeKey): string {
// 	return allSceneTypes().find(t => t.key === key)?.name ?? key
// }

// // ─── IMAGE REF BLOCK ─────────────────────────────────────────────────────────

// function buildImageBlock(
// 	globalImages: ImageRef[],
// 	sceneImages: ImageRef[],
// 	sceneNum: number
// ): string | null {
// 	const lines: string[] = []

// 	if (globalImages.length > 0) {
// 		lines.push('IMAGE REFERENCES — GLOBAL (apply visual style, color, atmosphere across ALL scenes):')
// 		globalImages.forEach((img, i) => {
// 			const tag = `[REF-GLOBAL-${i + 1}]`
// 			const src = img.type === 'url' ? `URL: ${img.url}` : `Uploaded: "${img.name}"`
// 			if (img.aiDescription) {
// 				lines.push(`  ${tag} SOURCE: ${src}`)
// 				lines.push(`  ${tag} CLAUDE VISION ANALYSIS: ${img.aiDescription}`)
// 				lines.push(`  ${tag} APPLY: Replicate exact color palette, lighting quality, material textures, environmental atmosphere, and compositional style throughout this entire video series.`)
// 			} else {
// 				lines.push(`  ${tag} ${src} — match visual style, color palette, materials, and lighting across all scenes.`)
// 			}
// 			lines.push('')
// 		})
// 	}

// 	if (sceneImages.length > 0) {
// 		lines.push(`IMAGE REFERENCES — SCENE ${sceneNum} SPECIFIC (apply ONLY to this scene):`)
// 		sceneImages.forEach((img, i) => {
// 			const tag = `[REF-SCENE-${i + 1}]`
// 			const src = img.type === 'url' ? `URL: ${img.url}` : `Uploaded: "${img.name}"`
// 			if (img.aiDescription) {
// 				lines.push(`  ${tag} SOURCE: ${src}`)
// 				lines.push(`  ${tag} CLAUDE VISION ANALYSIS: ${img.aiDescription}`)
// 				lines.push(`  ${tag} APPLY: Directly reference this composition, framing, and visual elements for this specific scene.`)
// 			} else {
// 				lines.push(`  ${tag} ${src} — reference this image for composition, subject, and lighting for this scene.`)
// 			}
// 			lines.push('')
// 		})
// 	}

// 	return lines.length > 0 ? lines.join('\n') : null
// }

// // ─── STORY ARC CONTEXT ────────────────────────────────────────────────────────

// function getStoryContext(
// 	scene: SceneConfig,
// 	dna: ProjectDNA,
// 	totalScenes: number
// ): string {
// 	const pct = Math.round((scene.id / totalScenes) * 100)
// 	const phase = PHASE_META[scene.phase]

// 	const phaseContexts: Partial<Record<ScenePhaseKey, string>> = {
// 		hook: `OPENING HOOK: This is the teaser — show the most dramatic and emotional moments from later in the video. Fast cuts, compelling visuals, no explanation. Make the viewer desperate to watch the full video. Show: the completed shelter, a dramatic weather moment, the most emotional animal/human encounter.`,

// 		preparation: `PREPARATION PHASE: ${dna.modelGender === 'male' ? 'He' : 'She'} is getting ready to leave — carefully packing ${dna.travelMode === 'foot' ? 'a heavy backpack' : `the ${dna.travelMode}`}. Show every item going in: food supplies, tools, cooking gear, first aid. The deliberate methodical preparation shows competence and experience. Viewer should feel the weight of what lies ahead.`,

// 		journey: `JOURNEY PHASE (${pct}% complete): ${dna.modelGender === 'male' ? 'He' : 'She'} is traveling via ${dna.travelMode}${dna.hasPet ? `, with ${dna.petType} alongside` : ''}. MIX camera angles every scene — front/side/behind/drone aerial. Alternate between: model moving, surrounding landscape and environment. Pure documentary style, never staged. The journey IS the content — show the scale of the landscape.`,

// 		arrival: `ARRIVAL & SCOUT: After the journey, ${dna.modelGender === 'male' ? 'he' : 'she'} arrives and explores the area. Light is turning golden — afternoon heading toward dusk. Finding the perfect spot feels like discovering treasure. Show: walking the area, testing ground, looking up at trees, touching earth, planning with eyes before hands.`,

// 		build: `BUILD PHASE (${pct}% progress): The main event — constructing ${dna.shelterType}. Using ${dna.buildMaterial}. This is the most watched phase — make every action satisfying and purposeful. Show tools, materials, hands working. Every completed section is a milestone. ${dna.hasCargoDrop ? 'A cargo vehicle arrives with additional materials — coordinate delivery with the build sequence.' : ''}`,

// 		challenge: `CHALLENGE MOMENT: An obstacle interrupts the build — nature is not cooperative. This scene adds drama and tension. The challenge must be overcome through skill and patience. After the challenge passes, work resumes stronger and more determined.`,

// 		living: `LIVING PHASE — RELAXING (${pct}% through video): The shelter is complete. Now it's time to live in it. This is the most ASMR and satisfying phase — hunting, fishing, cooking, eating, resting. Every activity shown in beautiful detail with ambient sound.`,

// 		closing: `CLOSING CREDITS: The final scene — wide shot of the completed shelter in its natural environment. The ${dna.modelGender === 'male' ? 'man' : 'woman'} sits quietly watching nature. Credit title sequence like a real film. Fade to natural sounds. Peaceful, complete, earned.`,
// 	}

// 	return phaseContexts[scene.phase] ?? `Scene ${scene.id}: ${phase.note}`
// }

// // ─── EMOTIONAL INJECTION BUILDER ─────────────────────────────────────────────

// function buildEmotionalBlock(scene: SceneConfig, dna: ProjectDNA): string {
// 	const emoContexts: Partial<Record<SceneTypeKey, string>> = {
// 		'emo-animal': `EMOTIONAL INJECTION — ANIMAL ENCOUNTER:
// A wild animal appropriate to ${dna.location} appears naturally — not staged, discovered. It could be: walking a forest path, drinking at a stream, resting on a rock, watching from a safe distance. Camera slowly zooms in — do not startle. ${dna.modelGender === 'male' ? 'His' : 'Her'} reaction is one of quiet wonder and respect. If safe, ${dna.modelGender === 'male' ? 'he' : 'she'} may offer a small amount of food slowly. The animal must be 100% ecologically accurate to the location — no exotic mismatched species.`,

// 		'emo-civilian': `EMOTIONAL INJECTION — CIVILIAN ENCOUNTER:
// A local person appears passing through naturally — a fisherman, woodcutter, berry picker, shepherd. Their presence is authentic and grounded. Camera catches them candidly first, then ${dna.modelGender === 'male' ? 'he' : 'she'} approaches. A brief wordless or minimal-word exchange — a nod, a gesture, sharing directions. The encounter is warm but brief. Return to the main story after.`,

// 		'emo-wonder': `EMOTIONAL INJECTION — WONDER DISCOVERY:
// Something extraordinary is discovered — an ancient massive tree unlike anything seen before, a strangely shaped boulder, an unexplained rock formation, an abandoned old structure deep in the wilderness. Camera slowly approaches, circles it. ${dna.modelGender === 'male' ? 'He' : 'She'} touches it, examines it with genuine curiosity and reverence. Pure wonder, no words needed.`,

// 		'emo-rescue': `EMOTIONAL INJECTION — RESCUE / HELPING MOMENT:
// An animal or person needs help — an injured bird, a small animal trapped, a local person with a stuck vehicle. The response is immediate, calm, and skilled. Gentle hands. Patient action. The moment of successful rescue — relief visible on ${dna.modelGender === 'male' ? 'his' : 'her'} face. Then watching them recover or leave safely.`,

// 		'emo-cook': `EMOTIONAL INJECTION — HUNT, GATHER & COOK:
// ${dna.modelGender === 'male' ? 'He' : 'She'} hunts or fishes or gathers food from the immediate environment — appropriate to ${dna.location} and ${dna.climate}. Then prepares and cooks a simple meal over fire inside the shelter. The food sounds, the fire crackling, the smell almost visible on screen. Eating alone in the wilderness — one of the most deeply satisfying human experiences. Close-up on food, hands, expression of satisfaction.`,

// 		'emo-fire': `EMOTIONAL INJECTION — FIRE MAKING:
// The primal act of making fire from natural materials found on site. Every attempt shown in real time — no shortcuts. The first tiny spark catching, carefully fed, growing to a proper fire. The moment it takes — pure joy and relief visible. Fire represents warmth, safety, home. The shelter comes alive when the first fire burns inside.`,

// 		'emo-reflect': `EMOTIONAL INJECTION — QUIET REFLECTION:
// ${dna.modelGender === 'male' ? 'He' : 'She'} pauses all work and simply sits. Watching the forest, the water, the sky. Maybe eating a small snack or drinking tea. No action, no construction — just being present in this extraordinary place. Camera holds still. Nature sounds fill everything. The viewer breathes with the moment.`,
// 	}

// 	const emoKey = scene.sceneType as SceneTypeKey
// 	const emoText = emoContexts[emoKey] ?? `EMOTIONAL INJECTION — ${getTypeLabel(emoKey).toUpperCase()}: A genuine unscripted-feeling moment of human connection with the environment.`

// 	return `
// ${'◆'.repeat(4)} EMOTIONAL INJECTION SCENE ${'◆'.repeat(4)}
// ${emoText}
// TONE: ${scene.emoTone ?? 'quiet joy — subtle, genuine, never over-performed'}
// SOUND: ${scene.emoSound ?? 'natural ambient heightened — environment feels more alive in this moment'}
// CRITICAL: This moment must feel DISCOVERED not staged. Raw, real, unposed.
// ${'◆'.repeat(32)}`.trim()
// }

// // ─── MAIN PROMPT BUILDER ─────────────────────────────────────────────────────

// export function buildScenePrompt(
// 	scene: SceneConfig,
// 	dna: ProjectDNA,
// 	globalImages: ImageRef[],
// 	totalScenes: number,
// 	secPerScene: number
// ): string {
// 	const startSec = (scene.id - 1) * secPerScene
// 	const endSec = startSec + secPerScene
// 	const pct = Math.round((scene.id / totalScenes) * 100)
// 	const tod = TOD_DATA[scene.timeOfDay]
// 	const phase = PHASE_META[scene.phase]
// 	const typeLabel = getTypeLabel(scene.sceneType)
// 	const sceneImages = scene.imageRefs.filter(r => r.scope === 'scene')
// 	const imgBlock = buildImageBlock(globalImages, sceneImages, scene.id)
// 	const storyCtx = getStoryContext(scene, dna, totalScenes)

// 	const travelNote = (() => {
// 		const modes: Record<string, string> = {
// 			'foot': 'traveling on foot with full backpack',
// 			'camper-van': 'traveling by camper van — vehicle visible at campsite',
// 			'snowfox': 'traveling by snowmobile through snow',
// 			'bicycle': 'traveling by loaded touring bicycle',
// 			'motorbike': 'traveling by adventure motorcycle off-road',
// 		}
// 		return modes[dna.travelMode] ?? dna.travelMode
// 	})()

// 	return `${'═'.repeat(64)}
// [SCENE ${scene.id}/${totalScenes}  |  ${fmtTime(startSec)} – ${fmtTime(endSec)}  |  ${secPerScene}sec]
// PHASE: ${phase.emoji} ${phase.label.toUpperCase()}  |  TYPE: ${typeLabel}  |  PROGRESS: ${pct}%
// ${scene.isEmotional ? '⭐ EMOTIONAL INJECTION SCENE' : ''}
// ${'═'.repeat(64)}

// ━━━ STORY CONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ${storyCtx}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━ PROJECT DNA — CONSISTENT ACROSS ALL ${totalScenes} SCENES ━━━━━━━━━━━
// VIDEO: "${dna.videoTitle}"
// MODEL: ${dna.modelGender === 'male' ? 'Male' : 'Female'} — ${travelNote}${dna.hasPet ? ` — with ${dna.petType}` : ' — no animal companion'}
// LOCATION: ${dna.location}
// CLIMATE: ${dna.climate}
// SHELTER TARGET: ${dna.shelterType}
// MATERIALS: ${dna.buildMaterial}
// FURNISHINGS (when reached): ${dna.furnishings.join(', ')}
// COLOR PALETTE: ${dna.colorPalette}
// SOUNDSCAPE: ${dna.soundscape}
// FILM STYLE: ${dna.filmStyle}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ${scene.isEmotional ? buildEmotionalBlock(scene, dna) + '\n\n' : ''}TIME OF DAY: ${tod.emoji} ${tod.label} (${tod.range})
// Lighting: ${tod.light}
// Mood: ${tod.mood}
// Sound environment: ${tod.sound}
// Sky: ${tod.sky}

// CAMERA & COMPOSITION:
// Angle: ${scene.camAngle}
// Movement: ${scene.camMove}
// Lens: ${scene.camLens}
// Depth of field: ${scene.camDOF}
// Cinematic mood: ${scene.camMood}
// Film quality: ${scene.filmQuality}
// Color grade: ${scene.colorGrade}

// SCENE ACTIVITY:
// Primary action: ${scene.activity}
// Detail focus: ${scene.detailFocus}
// Progress shown: ${scene.progressNote}
// Satisfying moment: ${scene.satisfyMoment}

// SOUND DESIGN:
// Primary ASMR: ${scene.soundPrimary}
// Ambient: ${scene.soundAmbient}
// Background music: ${scene.soundBG}
// NOTE: No voice narration, no dialogue — pure visual storytelling and natural sound.

// VISUAL ATMOSPHERE:
// Light source: ${scene.lightSource}
// Light FX: ${scene.lightFX}
// Atmosphere: ${scene.atmosphere}
// Foreground: ${scene.foreground}

// NATURAL WORLD:
// Wildlife: ${scene.wildlife}
// Weather: ${scene.weather}
// Vegetation: ${scene.vegetation}
// ${imgBlock ? `\n${imgBlock}` : ''}
// ${'─'.repeat(64)}
// ${ANTI_CGI_RULES}
// ${'─'.repeat(64)}
// CONTINUITY RULE: This is scene ${scene.id} of ${totalScenes}. The build is ${pct}% complete.
// Same model, same clothes, same location, same shelter at current construction stage.
// Seamless visual continuity with adjacent scenes is mandatory.
// TARGET PLATFORMS: Grok, VEO, Kling AI, Runway Gen-3`
// }
