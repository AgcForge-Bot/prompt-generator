import type { SceneConfig, ProjectDNA, ImageRef, ScenePhaseKey, SceneTypeKey } from './types'
import { PHASE_META, TOD_DATA, ANTI_CGI_RULES, SCENE_TYPES_NORMAL, SCENE_TYPES_EMOTION } from './utils'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmtTime(totalSec: number): string {
	const m = Math.floor(totalSec / 60)
	const s = totalSec % 60
	return `${m}:${s < 10 ? '0' : ''}${s}`
}

function allSceneTypes() {
	return [...SCENE_TYPES_NORMAL, ...SCENE_TYPES_EMOTION]
}

function getTypeLabel(key: SceneTypeKey): string {
	return allSceneTypes().find(t => t.key === key)?.name ?? key
}

// ─── CONSISTENCY ANCHOR BLOCK ─────────────────────────────────────────────────
// Ini yang fix masalah wajah/kendaraan/shelter berubah di setiap scene

function buildConsistencyAnchor(dna: ProjectDNA, sceneId: number, totalScenes: number): string {
	const pct = Math.round((sceneId / totalScenes) * 100)
	const isVehicleScene = dna.travelMode !== 'foot'

	// Shelter progress description based on build percentage
	let shelterStage = ''
	if (pct <= 10) {
		shelterStage = 'SHELTER STATUS: Not yet started — location not yet reached. No structure visible.'
	} else if (pct <= 20) {
		shelterStage = 'SHELTER STATUS: Site selected and cleared — bare ground only, tools laid out, materials beginning to gather. Zero construction complete.'
	} else if (pct <= 40) {
		shelterStage = `SHELTER STATUS: Foundation and early frame — excavation begun or base layer laid. Structure is roughly ${Math.round((pct - 20) / 2)}% physically visible. No roof yet.`
	} else if (pct <= 60) {
		shelterStage = `SHELTER STATUS: Walls rising — ${dna.shelterType.split('—')[0].trim()} approximately 50% structurally complete. Roof framing not yet done.`
	} else if (pct <= 75) {
		shelterStage = `SHELTER STATUS: Nearly enclosed — walls complete, roof structure being installed. Exterior: ${dna.shelterExterior.split('—')[0].trim()}. Not yet interior-finished.`
	} else if (pct <= 88) {
		shelterStage = `SHELTER STATUS: Structurally complete, interior being finished. Exterior matches: ${dna.shelterExterior}. Interior items being installed.`
	} else {
		shelterStage = `SHELTER STATUS: FULLY COMPLETE. Exterior: ${dna.shelterExterior}. Interior: ${dna.shelterInterior}. Dimensions: ${dna.shelterDimension}.`
	}

	const vehicleBlock = isVehicleScene
		? `VEHICLE — MUST MATCH EXACTLY EVERY SCENE IT APPEARS:
  Make/Model/Color: ${dna.vehicleDesc}
  RULE: If the vehicle appears in this scene, it must be IDENTICAL to this description. Same color, same model, same accessories, same damage/wear marks. No variation allowed.`
		: `TRANSPORT: On foot — no vehicle. Heavy backpack as described.`

	return `
━━━ ⚠ CONSISTENCY ANCHOR — READ BEFORE GENERATING ━━━━━━━━━━
These exact physical descriptions MUST be maintained in every
single scene. Any deviation breaks the series continuity.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHARACTER — LOCK THESE FEATURES PERMANENTLY:
  Gender: ${dna.modelGender === 'male' ? 'MALE' : 'FEMALE'} — never changes
  Age appearance: ${dna.characterAge}
  Face structure: ${dna.characterFace}
  Hair: ${dna.characterHair}
  Body build: ${dna.characterBuild}
  OUTFIT (identical every scene):
    ${dna.characterOutfit}
  GEAR always visible:
    ${dna.characterGear}
${dna.hasPet ? `  PET companion: ${dna.petType} — appears consistently near character` : '  No animal companion.'}

CHARACTER CONTINUITY RULES:
  • Same face structure, same beard/hair length throughout entire video
  • Same outfit — may show dirt/sweat buildup as video progresses, but same clothes
  • Same physical build — no variation in muscle, weight, or height
  • Same skin tone and complexion — no color grading differences that alter skin
  • FACE must be recognizable as the exact same person in every scene

${vehicleBlock}

SHELTER — EXACT SPECIFICATION:
  Type: ${dna.shelterType}
  Dimensions: ${dna.shelterDimension}
  Build material: ${dna.buildMaterial}
  Exterior appearance (when complete): ${dna.shelterExterior}
  Interior layout (when complete): ${dna.shelterInterior}
  ${shelterStage}

SHELTER CONTINUITY RULES:
  • The shelter must show EXACTLY the same construction progress as previous scenes
  • Size and proportions must remain constant — do not make it larger or smaller
  • Location within the environment does not shift between scenes
  • Materials are consistent — same timber, same stone, same clay throughout

LOCATION ANCHOR:
  Setting: ${dna.location}
  Climate: ${dna.climate}
  Color palette: ${dna.colorPalette}
  The exact same trees, rocks, and landscape features visible in background

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`.trim()
}

// ─── IMAGE REF BLOCK ─────────────────────────────────────────────────────────

function buildImageBlock(
	globalImages: ImageRef[],
	sceneImages: ImageRef[],
	sceneNum: number
): string | null {
	const lines: string[] = []

	if (globalImages.length > 0) {
		lines.push('IMAGE REFERENCES — GLOBAL (apply visual style, color, atmosphere across ALL scenes):')
		globalImages.forEach((img, i) => {
			const tag = `[REF-GLOBAL-${i + 1}]`
			const src = img.type === 'url' ? `URL: ${img.url}` : `Uploaded: "${img.name}"`
			if (img.aiDescription) {
				lines.push(`  ${tag} SOURCE: ${src}`)
				lines.push(`  ${tag} CLAUDE VISION ANALYSIS: ${img.aiDescription}`)
				lines.push(`  ${tag} APPLY: Replicate exact color palette, lighting quality, material textures, environmental atmosphere, and compositional style throughout this entire video series.`)
			} else {
				lines.push(`  ${tag} ${src} — match visual style, color palette, materials, and lighting across all scenes.`)
			}
			lines.push('')
		})
	}

	if (sceneImages.length > 0) {
		lines.push(`IMAGE REFERENCES — SCENE ${sceneNum} SPECIFIC (apply ONLY to this scene):`)
		sceneImages.forEach((img, i) => {
			const tag = `[REF-SCENE-${i + 1}]`
			const src = img.type === 'url' ? `URL: ${img.url}` : `Uploaded: "${img.name}"`
			if (img.aiDescription) {
				lines.push(`  ${tag} SOURCE: ${src}`)
				lines.push(`  ${tag} CLAUDE VISION ANALYSIS: ${img.aiDescription}`)
				lines.push(`  ${tag} APPLY: Directly reference this composition, framing, and visual elements for this specific scene.`)
			} else {
				lines.push(`  ${tag} ${src} — reference this image for composition, subject, and lighting for this scene.`)
			}
			lines.push('')
		})
	}

	return lines.length > 0 ? lines.join('\n') : null
}

// ─── STORY ARC CONTEXT ────────────────────────────────────────────────────────

function getStoryContext(scene: SceneConfig, dna: ProjectDNA, totalScenes: number): string {
	const pct = Math.round((scene.id / totalScenes) * 100)

	const travelModeText: Record<string, string> = {
		'foot': 'on foot with full backpack',
		'camper-van': `by camper van (${dna.vehicleDesc.split('—')[0].trim()})`,
		'snowfox': `by snowmobile (${dna.vehicleDesc.split('—')[0].trim()})`,
		'bicycle': `by loaded touring bicycle (${dna.vehicleDesc.split('—')[0].trim()})`,
		'motorbike': `by adventure motorcycle (${dna.vehicleDesc.split('—')[0].trim()})`,
	}
	const travelText = travelModeText[dna.travelMode] ?? dna.travelMode

	const phaseContexts: Partial<Record<ScenePhaseKey, string>> = {
		hook: `OPENING HOOK (Scene ${scene.id}): This is the teaser — rapid cuts of the most dramatic and emotional moments from later in the video. High energy, compelling visuals, no explanation. Show: the completed shelter interior with fire, a dramatic weather moment, the most emotional animal encounter, the character's face in a moment of triumph. Make the viewer desperate to watch the full video.`,

		preparation: `PREPARATION PHASE (Scene ${scene.id}): The ${dna.modelGender === 'male' ? 'man' : 'woman'} is getting ready at base — carefully packing and checking all gear. Show every item going in: food supplies (specific cans, dried food, thermos), hand tools (axe, saw, trowel), rope, first aid kit, maps. The deliberate methodical preparation shows deep experience. Viewer feels the weight and reality of what lies ahead.`,

		journey: `JOURNEY PHASE (${pct}% into video): Traveling ${travelText}${dna.hasPet ? `, with ${dna.petType} alongside` : ''}. CAMERA MIX THIS SCENE: alternate between the character moving and the surrounding landscape. Use: front tracking, side profile, behind following, drone aerial pull-back. Pure documentary style — never staged-feeling. The journey is the content — show scale of landscape.`,

		arrival: `ARRIVAL & SCOUTING (${pct}%): After the journey, the ${dna.modelGender === 'male' ? 'man' : 'woman'} arrives and explores the build site area. Light is turning golden — late afternoon. Finding the right spot feels like discovering something precious. Show: walking the area, testing ground firmness, looking up at trees, touching earth with hands, making the decision with eyes before hands touch tools.`,

		build: `BUILD PHASE (${pct}% through video — this is the main event): Constructing ${dna.shelterType}. Using ${dna.buildMaterial}. At this point in the video, the shelter should be visually at approximately ${pct}% of its completed form. Every action should be satisfying and purposeful. Show tools being used correctly, materials being placed with care, progress clearly visible compared to previous scenes.${dna.hasCargoDrop && pct > 35 && pct < 65 ? ' A cargo delivery vehicle arrives with additional materials — coordinate timing.' : ''}`,

		challenge: `CHALLENGE SCENE (${pct}%): Something difficult interrupts the build — nature pushes back. This adds drama and tension to the story arc. The obstacle must feel real and threatening. The character overcomes it through skill, patience, and determination. After this scene, work resumes with renewed purpose. The challenge makes the eventual completion more emotionally earned.`,

		living: `LIVING PHASE — RELAXING (${pct}%): The shelter is complete. Now it is time to inhabit it. This is the most ASMR and satisfying phase — hunting, fishing, foraging, preparing food, cooking over fire, eating, resting. The character is at peace in the shelter they built. Every activity shown in beautiful sensory detail with ambient sound.`,

		closing: `CLOSING CREDITS (${pct}%): The final scene — wide establishing shot of the completed shelter in its natural environment as the day ends. The ${dna.modelGender === 'male' ? 'man' : 'woman'} sits quietly watching the forest, the water, or the fire. Credit title sequence styled like a real film rolls over the image. Fade slowly to pure natural ambient sound. Peaceful, complete, deeply earned.`,
	}

	return phaseContexts[scene.phase] ?? `Scene ${scene.id}: ${PHASE_META[scene.phase].note}`
}

// ─── EMOTIONAL INJECTION BUILDER ─────────────────────────────────────────────

function buildEmotionalBlock(scene: SceneConfig, dna: ProjectDNA): string {
	const gender = dna.modelGender === 'male' ? 'he' : 'she'
	const genderCap = dna.modelGender === 'male' ? 'He' : 'She'
	const genderPos = dna.modelGender === 'male' ? 'his' : 'her'

	const emoContexts: Partial<Record<SceneTypeKey, string>> = {
		'emo-animal': `EMOTIONAL INJECTION — ANIMAL ENCOUNTER:
A wild animal native to ${dna.location.split('—')[0].trim()} appears naturally — discovered, not staged. Could be drinking at a stream, resting on a rock, moving along a forest path. Camera slowly closes in — no sudden movement that might startle it. The character freezes, watches with pure quiet wonder and respect. ${genderCap} may slowly lower to a crouch. If safe and the animal stays, ${gender} may slowly offer something small. The animal must be 100% ecologically accurate to this specific location and climate.`,

		'emo-civilian': `EMOTIONAL INJECTION — CIVILIAN ENCOUNTER:
A local person appears passing through naturally — a fisherman, woodcutter, berry picker, shepherd with animals. Their presence is authentic and completely unposed. Camera catches them candidly before any interaction. ${genderCap} approaches slowly, non-threatening. A brief wordless or minimal exchange — a nod, a pointed gesture, sharing information about the area. The encounter is warm, brief, human. Both go their own ways after. It makes the wilderness feel inhabited and real.`,

		'emo-wonder': `EMOTIONAL INJECTION — WONDER DISCOVERY:
Something extraordinary appears — an ancient tree of impossible size, a strangely shaped boulder that looks almost carved, an unexplained old stone structure deep in the wilderness, a natural formation that takes the breath away. Camera slowly approaches and circles it. ${genderCap} reaches out and touches it with genuine reverence. Stands in silence for a long moment. Pure wonder, no commentary needed. The wilderness contains mysteries older than memory.`,

		'emo-rescue': `EMOTIONAL INJECTION — RESCUE / HELPING MOMENT:
An animal or person needs urgent help — an injured bird with a broken wing, a small animal with a leg caught, a local person with a stuck vehicle in mud or snow. The response is immediate, calm, and highly skilled. Gentle and deliberate hands. Patient methodical action. The moment of successful rescue — relief clearly visible on ${genderPos} face. Watching the animal recover or fly away, or the person drive off with a grateful wave.`,

		'emo-cook': `EMOTIONAL INJECTION — HUNT, GATHER & COOK:
${genderCap} hunts, fishes, or forages food from the immediate environment — species appropriate to ${dna.location.split('—')[0].trim()} and ${dna.climate.split('—')[0].trim()}. Then prepares and cooks a simple meal over fire inside or beside the shelter. Every sound is captured: sizzling, bubbling, the snap of fresh herbs, the scrape of a pan. Eating alone in the wilderness — one of the deepest human satisfactions. Close-up: food, hands, the expression of genuine satisfaction.`,

		'emo-fire': `EMOTIONAL INJECTION — PRIMITIVE FIRE MAKING:
The ancient act of making fire from materials found in the immediate environment. Every attempt shown in real time — no shortcuts or cuts. First spark, carefully nursed to ember, fed to flame. The character's full focus is on this one small task. The moment it catches — the subtle shift in expression from concentration to quiet triumph. Fire means warmth, light, cooking, safety. The shelter becomes home the moment the first fire burns inside it.`,

		'emo-reflect': `EMOTIONAL INJECTION — QUIET REFLECTION:
${genderCap} stops all activity and simply exists in this place. Sits on a rock, a log, or in the doorway of the shelter. Watching the forest move, the water flow, the sky change. Maybe with a warm drink or simple food. No building, no working — just being profoundly present in an extraordinary place. Camera holds absolutely still. Nature sounds fill everything. The viewer breathes and slows with the moment.`,
	}

	const emoKey = scene.sceneType as SceneTypeKey
	const emoText = emoContexts[emoKey] ?? `EMOTIONAL INJECTION — ${getTypeLabel(emoKey).toUpperCase()}: A genuine unscripted-feeling moment of human connection with the natural environment.`

	return `
${'◆'.repeat(4)} EMOTIONAL INJECTION SCENE ${'◆'.repeat(4)}
${emoText}
EMOTIONAL TONE: ${scene.emoTone ?? 'quiet joy — subtle, genuine, never over-performed or theatrical'}
SOUND APPROACH: ${scene.emoSound ?? 'natural ambient heightened — environment feels more present and alive in this moment'}
CRITICAL: This moment must feel DISCOVERED not staged. Raw, real, completely unposed.
${'◆'.repeat(32)}`.trim()
}

// ─── MAIN PROMPT BUILDER ─────────────────────────────────────────────────────

export function buildScenePrompt(
	scene: SceneConfig,
	dna: ProjectDNA,
	globalImages: ImageRef[],
	totalScenes: number,
	secPerScene: number
): string {
	const startSec = (scene.id - 1) * secPerScene
	const endSec = startSec + secPerScene
	const pct = Math.round((scene.id / totalScenes) * 100)
	const tod = TOD_DATA[scene.timeOfDay]
	const phase = PHASE_META[scene.phase]
	const typeLabel = getTypeLabel(scene.sceneType)
	const sceneImages = scene.imageRefs.filter(r => r.scope === 'scene')
	const imgBlock = buildImageBlock(globalImages, sceneImages, scene.id)
	const storyCtx = getStoryContext(scene, dna, totalScenes)
	const anchorBlock = buildConsistencyAnchor(dna, scene.id, totalScenes)

	return `${'═'.repeat(64)}
[SCENE ${scene.id}/${totalScenes}  |  ${fmtTime(startSec)} – ${fmtTime(endSec)}  |  ${secPerScene}sec]
PHASE: ${phase.emoji} ${phase.label.toUpperCase()}  |  TYPE: ${typeLabel}  |  PROGRESS: ${pct}%
${scene.isEmotional ? '⭐ EMOTIONAL INJECTION SCENE' : ''}
${'═'.repeat(64)}

${anchorBlock}

━━━ STORY CONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${storyCtx}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIDEO: "${dna.videoTitle}"
FILM STYLE: ${dna.filmStyle}
SOUNDSCAPE: ${dna.soundscape}

${scene.isEmotional ? buildEmotionalBlock(scene, dna) + '\n\n' : ''}TIME OF DAY: ${tod.emoji} ${tod.label} (${tod.range})
Lighting: ${tod.light}
Mood: ${tod.mood}
Sound environment: ${tod.sound}
Sky: ${tod.sky}

CAMERA & COMPOSITION:
Angle: ${scene.camAngle}
Movement: ${scene.camMove}
Lens: ${scene.camLens}
Depth of field: ${scene.camDOF}
Cinematic mood: ${scene.camMood}
Film quality: ${scene.filmQuality}
Color grade: ${scene.colorGrade}

SCENE ACTIVITY:
Primary action: ${scene.activity}
Detail focus: ${scene.detailFocus}
Progress shown: ${scene.progressNote}
Satisfying moment: ${scene.satisfyMoment}

SOUND DESIGN:
Primary ASMR: ${scene.soundPrimary}
Ambient: ${scene.soundAmbient}
Background: ${scene.soundBG}
NOTE: No voice narration, no dialogue — pure visual storytelling and natural sound.

VISUAL ATMOSPHERE:
Light source: ${scene.lightSource}
Light FX: ${scene.lightFX}
Atmosphere: ${scene.atmosphere}
Foreground: ${scene.foreground}

NATURAL WORLD:
Wildlife: ${scene.wildlife}
Weather: ${scene.weather}
Vegetation: ${scene.vegetation}
${imgBlock ? `\n${imgBlock}` : ''}
${'─'.repeat(64)}
${ANTI_CGI_RULES}
${'─'.repeat(64)}
TARGET PLATFORMS: Grok, VEO`
}
