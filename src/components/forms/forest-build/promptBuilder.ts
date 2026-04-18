import type { SceneConfig, ProjectDNA, ImageRef, ScenePhaseKey, SceneTypeKey } from './types'
import { PHASE_META, PHASE_RATIOS, TOD_DATA, ANTI_CGI_RULES, SCENE_TYPES_NORMAL, SCENE_TYPES_EMOTION } from './utils'

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

// ─── PHASE RANGE CALCULATOR ───────────────────────────────────────────────────
// Hitung scene start/end per fase berdasarkan totalScenes
// Digunakan untuk menghitung shelter progress DALAM fase build saja

function getPhaseRanges(totalScenes: number): Record<ScenePhaseKey, { start: number; end: number }> {
	const keys = Object.keys(PHASE_RATIOS) as ScenePhaseKey[]
	let allocated = 0
	const result: Partial<Record<ScenePhaseKey, { start: number; end: number }>> = {}
	keys.forEach((key, i) => {
		const count = i < keys.length - 1
			? Math.max(1, Math.round(PHASE_RATIOS[key] * totalScenes))
			: totalScenes - allocated
		result[key] = { start: allocated + 1, end: allocated + count }
		allocated += count
	})
	return result as Record<ScenePhaseKey, { start: number; end: number }>
}

// ─── BUILD PROGRESS CALCULATOR ────────────────────────────────────────────────
// FIX ROOT CAUSE 1: Progress shelter dihitung DALAM fase build, bukan global
// Sehingga scene terakhir build = shelter hampir selesai, bukan 50%

function getBuildProgress(sceneId: number, totalScenes: number): number {
	const ranges = getPhaseRanges(totalScenes)
	const buildRange = ranges['build']
	const buildLen = buildRange.end - buildRange.start + 1

	// Sebelum build dimulai
	if (sceneId < buildRange.start) return 0

	// Setelah build selesai
	if (sceneId > buildRange.end) return 100

	// Dalam fase build: 0% di scene pertama build, 100% di scene terakhir build
	const posInBuild = sceneId - buildRange.start
	return Math.round((posInBuild / (buildLen - 1)) * 100)
}

// ─── BUILD SUB-STAGE DESCRIPTION ─────────────────────────────────────────────
// FIX ROOT CAUSE 2: Instruksi konstruksi spesifik per sub-tahap

function getBuildSubStage(buildPct: number, dna: ProjectDNA): {
	shelterStatus: string
	constructionAction: string
	constructionDetail: string
} {
	const shelterName = dna.shelterType.split('—')[0].trim()
	const mat = dna.buildMaterial

	if (buildPct === 0) {
		return {
			shelterStatus: 'SHELTER: Build site selected. No construction started. Bare ground, tools laid out, materials gathered in pile.',
			constructionAction: 'Site preparation — clearing vegetation, marking boundaries, laying out all tools and materials in organized fashion. Measuring and planning with hands and eyes.',
			constructionDetail: 'Close-up on hands pressing soil to test firmness, eyes scanning the site, tools arranged neatly on ground.',
		}
	} else if (buildPct <= 15) {
		return {
			shelterStatus: `SHELTER STATUS (${buildPct}% complete): Excavation just started. Only a shallow pit or cleared ground visible. No walls, no frame yet.`,
			constructionAction: `ACTIVE CONSTRUCTION: Digging and excavating — ${mat.split(',')[0].trim()} being removed or shaped. Hands and tools working the ground. First physical marks of ${shelterName} beginning to appear.`,
			constructionDetail: 'Shovel or axe striking earth rhythmically. Sweat on face. Dirt accumulating beside growing hole or cleared area. Arms working hard.',
		}
	} else if (buildPct <= 30) {
		return {
			shelterStatus: `SHELTER STATUS (${buildPct}% complete): Foundation laid. A visible base or frame outline exists. Structure is just beginning — 1 layer or first posts only.`,
			constructionAction: `ACTIVE CONSTRUCTION: Laying foundation — placing first ${mat.split(',')[0].trim()} pieces. Each element positioned carefully with precision. Leveling, fitting, securing. The footprint of ${shelterName} is now physically defined on the ground.`,
			constructionDetail: 'Hands pressing material firmly into place. Checking level with water or eye. First structural element standing — a single post, a first row of stones, the first timber.',
		}
	} else if (buildPct <= 50) {
		return {
			shelterStatus: `SHELTER STATUS (${buildPct}% complete): Walls rising to roughly half height. Structure visibly taking shape. No roof yet. Open to sky.`,
			constructionAction: `ACTIVE CONSTRUCTION: Walls rising — stacking, fitting, securing ${mat.split(',')[0].trim()} layer by layer. Each piece lifted, positioned, pressed into place. The walls of ${shelterName} are growing visibly taller with each scene.`,
			constructionDetail: 'Lifting material with effort. Fitting joint or seam carefully. Stepping back briefly to check alignment. Wall height now reaching waist or chest level.',
		}
	} else if (buildPct <= 68) {
		return {
			shelterStatus: `SHELTER STATUS (${buildPct}% complete): Walls nearly at full height. Roof framing just beginning. The shape of ${shelterName} is now clearly recognizable.`,
			constructionAction: `ACTIVE CONSTRUCTION: Completing walls and beginning roof structure — ${mat.split(',')[0].trim()} positioned at full wall height. Roof frame elements being lifted and placed. The structure is now tall enough to walk under.`,
			constructionDetail: 'Reaching up to place high elements. Roof beam being lifted with effort. Ridge pole or first roof element going into position. Structure now casts a recognizable shadow.',
		}
	} else if (buildPct <= 82) {
		return {
			shelterStatus: `SHELTER STATUS (${buildPct}% complete): Roof structure complete, being covered. Walls fully enclosed. Almost weathertight. Exterior nearly matches: ${dna.shelterExterior.split('—')[0].trim()}.`,
			constructionAction: `ACTIVE CONSTRUCTION: Roofing and weatherproofing — covering the roof structure with ${mat.split(',')[1]?.trim() ?? mat.split(',')[0].trim()}. Sealing gaps between walls. The shelter is becoming weathertight for the first time. Rain could fall and be shed.`,
			constructionDetail: 'Placing roof material in overlapping rows from bottom to top. Pressing into gaps to seal. First test — hand on roof surface checking for solidity.',
		}
	} else if (buildPct <= 93) {
		return {
			shelterStatus: `SHELTER STATUS (${buildPct}% complete): Structurally complete and weathertight. Interior fit-out underway. Exterior matches: ${dna.shelterExterior}. Interior items being installed.`,
			constructionAction: `ACTIVE CONSTRUCTION: Interior finishing — installing ${dna.furnishings.slice(0, 2).join(' and ')}. Door being hung, surfaces being smoothed, interior being made livable. The transformation from structure to shelter is happening in detail.`,
			constructionDetail: 'Hanging door on handmade hinges — testing swing. Placing stove or hearth stone. Arranging sleeping area. Small details that make a space feel like a home.',
		}
	} else {
		return {
			shelterStatus: `SHELTER STATUS: FULLY COMPLETE. Exterior: ${dna.shelterExterior}. Interior: ${dna.shelterInterior}. Dimensions: ${dna.shelterDimension}.`,
			constructionAction: `COMPLETION MOMENT: Final touches — ${dna.furnishings[dna.furnishings.length - 1] ?? 'last detail'} placed. The builder steps back and surveys the completed ${shelterName}. It is done. Every element visible and in its final position.`,
			constructionDetail: 'Last small action completed — a knot tied, a surface smoothed, a door opened for the first time. Builder stands back. Looks at what has been made. A moment of quiet profound satisfaction.',
		}
	}
}

// ─── SHELTER STAGE FOR ANCHOR BLOCK ──────────────────────────────────────────

function buildShelterStage(sceneId: number, totalScenes: number, dna: ProjectDNA): string {
	const buildPct = getBuildProgress(sceneId, totalScenes)
	const { shelterStatus } = getBuildSubStage(buildPct, dna)
	return shelterStatus
}

// ─── CONSISTENCY ANCHOR BLOCK ─────────────────────────────────────────────────
// Ini yang fix masalah wajah/kendaraan/shelter berubah di setiap scene

function buildConsistencyAnchor(dna: ProjectDNA, sceneId: number, totalScenes: number): string {
	const isVehicleScene = dna.travelMode !== 'foot'
	const shelterStage = buildShelterStage(sceneId, totalScenes, dna)

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
  Exterior (when complete): ${dna.shelterExterior}
  Interior (when complete): ${dna.shelterInterior}
  ${shelterStage}

SHELTER CONTINUITY RULES:
  • Show ONLY the construction progress level stated above — no more, no less
  • Do NOT show shelter more complete than stated — this ruins story continuity
  • Do NOT show shelter less complete than stated — this loses progress
  • Size and proportions remain constant scene to scene
  • Same location in landscape — same trees and rocks in background

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
	const buildPct = getBuildProgress(scene.id, totalScenes)
	const { constructionAction, constructionDetail } = getBuildSubStage(buildPct, dna)

	const travelModeText: Record<string, string> = {
		'foot': 'on foot with full backpack',
		'camper-van': `by camper van (${dna.vehicleDesc.split('—')[0].trim()})`,
		'snowfox': `by snowmobile (${dna.vehicleDesc.split('—')[0].trim()})`,
		'bicycle': `by loaded touring bicycle (${dna.vehicleDesc.split('—')[0].trim()})`,
		'motorbike': `by adventure motorcycle (${dna.vehicleDesc.split('—')[0].trim()})`,
	}
	const travelText = travelModeText[dna.travelMode] ?? dna.travelMode
	const pronoun = dna.modelGender === 'male' ? 'man' : 'woman'
	const he = dna.modelGender === 'male' ? 'he' : 'she'
	const his = dna.modelGender === 'male' ? 'his' : 'her'

	const phaseContexts: Partial<Record<ScenePhaseKey, string>> = {
		hook: `OPENING HOOK (Scene ${scene.id}): Rapid teaser cuts — show the most dramatic moments from later in the video. Include: a glimpse of the completed shelter interior with fire burning, a dramatic weather challenge moment, an emotional animal encounter, the character's face in a moment of quiet triumph. No explanation — pure visual tension. Make the viewer unable to stop watching.`,

		preparation: `PREPARATION PHASE (Scene ${scene.id}): The ${pronoun} is packing and checking all gear before departure. Show every item deliberately: food supplies, tools (axe, saw, rope), clothing layers, water. The ${travelText === 'on foot with full backpack' ? 'heavy backpack being loaded and adjusted on back' : `${dna.vehicleDesc.split('—')[0].trim()} being loaded with all gear`}. Methodical competence on display — this person has done this before.`,

		journey: `JOURNEY PHASE (${pct}% into video): Traveling ${travelText}${dna.hasPet ? `, with ${dna.petType} alongside` : ''}. MIX camera angles THIS SCENE: alternate between character moving and surrounding landscape. Choices: front tracking, side profile, behind following, or drone aerial pullback. Pure documentary feel — never staged. The landscape scale dwarfs the traveler. ${pct < 30 ? 'Early journey — energy is high, pace is strong.' : 'Later journey — terrain getting more remote, signs of civilization fading.'}`,

		arrival: `ARRIVAL & SCOUTING (Scene ${scene.id}): After the journey, the ${pronoun} arrives and explores the area on foot. Light is turning golden — late afternoon. ${he.charAt(0).toUpperCase() + he.slice(1)} walks the area slowly, testing soil with foot, looking at trees, assessing terrain. Finding the exact right spot feels like a discovery. Show: crouching to touch earth, looking up through canopy, pacing out distances. The decision is made with eyes and hands before any tool is raised.`,

		build: `BUILD PHASE — SCENE ${scene.id} (${buildPct}% of construction complete):
CRITICAL: This is an ACTIVE CONSTRUCTION SCENE. The character must be shown physically building.
DO NOT show character standing still or just looking at materials.
DO NOT show the shelter already complete — it is only ${buildPct}% done.

${constructionAction}

SCENE FOCUS: ${constructionDetail}

What the viewer should see: hands actively working on the structure, physical effort visible, construction material being shaped and placed, the shelter growing or changing state from the beginning to the end of this 10-second clip.${dna.hasCargoDrop && buildPct > 35 && buildPct < 65 ? '\nCARGO DELIVERY: A delivery vehicle arrives at or near the site with additional materials — show vehicle, materials being unloaded, handed to builder.' : ''}`,

		challenge: `CHALLENGE SCENE (Scene ${scene.id} — ${buildPct}% of construction complete):
The shelter is ${buildPct}% built when nature intervenes with a serious obstacle.
The construction is ${buildPct}% done — SHOW this incomplete structure being threatened or damaged.

CHALLENGE TYPE (choose the most dramatic appropriate to ${dna.climate}):
${dna.climate.includes('winter') || dna.climate.includes('snow') || dna.climate.includes('arctic')
				? '• Heavy snowfall burying the work site — drifts covering materials, structure threatened\n• Blizzard winds threatening the partially-built frame\n• Ice forming on surfaces, making work dangerous and slippery'
				: dna.climate.includes('tropical') || dna.climate.includes('rain')
					? '• Sudden torrential downpour flooding the excavation or washing away materials\n• Strong winds pulling at the partial roof structure\n• Mud slide threatening the foundation'
					: '• Sudden heavy rainstorm — materials soaking, site becoming mud\n• Strong gusting wind destabilizing the partial frame\n• A section of the structure fails and must be rebuilt'
			}

RESPONSE: The ${pronoun} does NOT give up. ${he.charAt(0).toUpperCase() + he.slice(1)} adapts, protects what can be protected, waits out what must be waited, and CONTINUES BUILDING as soon as possible. End this scene with work resuming — determination visible on face.

Construction status remains ${buildPct}% — the challenge interrupted but did not reverse the progress.`,

		living: `LIVING PHASE — SHELTER COMPLETE (Scene ${scene.id}):
The ${dna.shelterType.split('—')[0].trim()} is now FULLY BUILT and inhabited.
Interior: ${dna.shelterInterior}
Exterior: ${dna.shelterExterior}

The ${pronoun} is now living in the completed shelter. This is the reward phase.

ACTIVITY THIS SCENE (most ASMR and satisfying):
${scene.sceneType === 'emo-cook' || scene.sceneType === 'action'
				? `Preparing and cooking food — hunting/fishing/foraging from ${dna.location.split('—')[0].trim()}, then cooking inside or in front of shelter over fire. Every sound: sizzling, bubbling, fire crackling. Eating slowly with full satisfaction.`
				: scene.sceneType === 'nature' || scene.sceneType === 'establishing'
					? `Sitting at the entrance of the shelter watching the natural world — rain falling, wind moving trees, birds calling. The shelter is warm and dry. Pure peace and ASMR immersion.`
					: `Inside the completed shelter — tending fire, organizing tools, making it more comfortable. The contrast between wild exterior and warm interior is powerful.`
			}
Sound: ${dna.soundscape}`,

		closing: `CLOSING CREDITS (Scene ${scene.id} — Final Scene):
The complete ${dna.shelterType.split('—')[0].trim()} stands in ${dna.location.split('—')[0].trim()}.
Exterior fully visible: ${dna.shelterExterior}

The ${pronoun} sits quietly at the entrance or on a nearby rock, watching the natural world. ${his.charAt(0).toUpperCase() + his.slice(1)} face shows quiet earned satisfaction — not triumph, just peace.

Camera: wide shot, slowly pulling back to reveal shelter within landscape.
Film-style credit title sequence rolls over the image — like a real film.
Fade slowly to black with ambient natural sound continuing.
The final image: the shelter, small but perfect, held within the vast wilderness.`,
	}

	return phaseContexts[scene.phase] ?? `Scene ${scene.id} (${pct}%): ${PHASE_META[scene.phase].note}`
}

// ─── EMOTIONAL INJECTION BUILDER ─────────────────────────────────────────────

function buildEmotionalBlock(scene: SceneConfig, dna: ProjectDNA): string {
	const gender = dna.modelGender === 'male' ? 'he' : 'she'
	const genderCap = dna.modelGender === 'male' ? 'He' : 'She'
	const genderPos = dna.modelGender === 'male' ? 'his' : 'her'

	const emoContexts: Partial<Record<SceneTypeKey, string>> = {
		// 		'emo-animal': `EMOTIONAL INJECTION — ANIMAL ENCOUNTER:
		// A wild animal native to ${dna.location.split('—')[0].trim()} appears naturally — discovered, not staged. Could be drinking at a stream, resting on a rock, moving along a forest path. Camera slowly closes in — no sudden movement that might startle it. The character freezes, watches with pure quiet wonder and respect. ${genderCap} may slowly lower to a crouch. If safe and the animal stays, ${gender} may slowly offer something small. The animal must be 100% ecologically accurate to this specific location and climate.`,

		'emo-animal': `EMOTIONAL INJECTION — ANIMAL ENCOUNTER:
A wild animal native to ${dna.location.split('—')[0].trim()} appears naturally — discovered, not staged. Could be drinking at a stream, resting on a rock, moving along a forest path. Camera slowly closes in — no sudden movement. The character freezes, watches with quiet wonder and respect. ${genderCap} may slowly lower to a crouch. The animal must be 100% ecologically accurate to this specific location.`,

		'emo-civilian': `EMOTIONAL INJECTION — CIVILIAN ENCOUNTER:
A local person passes through naturally — a fisherman, woodcutter, berry picker, shepherd. Their presence is authentic and unposed. Camera catches them candidly first. ${genderCap} approaches slowly. A brief wordless exchange — a nod, a gesture, sharing information about the area. The encounter is warm and brief. Both continue on their way. The wilderness feels inhabited and alive.`,

		'emo-wonder': `EMOTIONAL INJECTION — WONDER DISCOVERY:
Something extraordinary appears — an ancient tree of impossible size, a strangely shaped rock formation, an unexplained old structure in the wilderness. Camera slowly approaches and circles. ${genderCap} reaches out and touches it with genuine reverence. Stands in silence. Pure wonder — no explanation needed.`,

		'emo-rescue': `EMOTIONAL INJECTION — RESCUE / HELPING MOMENT:
An animal or person needs help — an injured bird, a small animal trapped, a local person with a stuck vehicle. The response is immediate, calm, and skilled. Gentle deliberate hands. Patient methodical action. The moment of successful rescue — relief clearly on ${genderPos} face. Watching the animal fly away or person drive off safely.`,

		'emo-cook': `EMOTIONAL INJECTION — HUNT, GATHER & COOK:
${genderCap} hunts, fishes, or forages from ${dna.location.split('—')[0].trim()}. Then prepares and cooks over fire inside or beside the shelter. Every sound captured: sizzling, bubbling, fire crackling, the scrape of a pan. Eating alone in the wilderness — one of the deepest human satisfactions. Close-up: food, hands, quiet expression of genuine satisfaction.`,

		'emo-fire': `EMOTIONAL INJECTION — PRIMITIVE FIRE MAKING:
Making fire from materials found on site. Every attempt shown in real time — no shortcuts. First spark, nursed to ember, fed to flame. The moment it catches — subtle shift from concentration to quiet triumph. Fire means warmth, safety, home. The shelter becomes truly alive the moment first fire burns inside it.`,

		'emo-reflect': `EMOTIONAL INJECTION — QUIET REFLECTION:
${genderCap} stops all activity and simply exists in this place. Sits watching the forest, the water, the sky. Maybe a warm drink or small food. No building, no working — just being profoundly present. Camera holds still. Nature sounds fill everything. The viewer breathes and slows with the moment.`,
	}

	const emoKey = scene.sceneType as SceneTypeKey
	const emoText = emoContexts[emoKey] ?? `EMOTIONAL INJECTION — ${getTypeLabel(emoKey).toUpperCase()}: A genuine unscripted moment of human connection with the natural environment.`

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
	const buildPct = getBuildProgress(scene.id, totalScenes)
	const tod = TOD_DATA[scene.timeOfDay]
	const phase = PHASE_META[scene.phase]
	const typeLabel = getTypeLabel(scene.sceneType)
	const sceneImages = scene.imageRefs.filter(r => r.scope === 'scene')
	const imgBlock = buildImageBlock(globalImages, sceneImages, scene.id)
	const storyCtx = getStoryContext(scene, dna, totalScenes)
	const anchorBlock = buildConsistencyAnchor(dna, scene.id, totalScenes)

	// Inject construction action directly into SCENE ACTIVITY for build/challenge phases
	const isBuildPhase = scene.phase === 'build' || scene.phase === 'challenge'
	const { constructionAction, constructionDetail } = getBuildSubStage(buildPct, dna)

	const activityLine = isBuildPhase
		? `${constructionAction}`
		: scene.activity

	const detailLine = isBuildPhase
		? `${constructionDetail}`
		: scene.detailFocus

	const progressLine = isBuildPhase
		? `Shelter is ${buildPct}% complete in this scene — show this exact level of completion. No more, no less.`
		: scene.progressNote

	return `${'═'.repeat(64)}
[SCENE ${scene.id}/${totalScenes}  |  ${fmtTime(startSec)} – ${fmtTime(endSec)}  |  ${secPerScene}sec]
PHASE: ${phase.emoji} ${phase.label.toUpperCase()}  |  TYPE: ${typeLabel}  |  VIDEO PROGRESS: ${pct}%${isBuildPhase ? `  |  BUILD: ${buildPct}%` : ''}
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
Primary action: ${activityLine}
Detail focus: ${detailLine}
Progress shown: ${progressLine}
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
