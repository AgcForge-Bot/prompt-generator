import { SCENE_TYPE_LABELS } from "./constants";
import type { SceneConfig, SceneTypeKey } from "./types";

export function buildPrompt(args: {
	sceneNum: number;
	totalScenes: number;
	secPerScene: number;
	sceneType: SceneTypeKey;
	config: SceneConfig;
}) {
	const { sceneNum, totalScenes, secPerScene, sceneType, config } = args;
	const start = (sceneNum - 1) * secPerScene;
	const end = start + secPerScene;
	const typeLabel = SCENE_TYPE_LABELS[sceneType] ?? sceneType;

	const actionLines: Record<SceneTypeKey, string> = {
		"ground-assault": `MAIN ACTION: GROUND ASSAULT — ${config.solAction}. Formation: ${config.solSquad}. Enemy: ${config.solEnemy}.`,
		"dj-warzone": `MAIN ACTION: DJ WAR DROP — ${config.djAction}. Setup: ${config.djSetup}. Effect: ${config.djFx}. ${config.djSound}.`,
		"aerial-combat": `MAIN ACTION: AERIAL COMBAT — ${config.vehAir}. Action: ${config.vehAction}. Visual: ${config.vfxSfx}.`,
		"naval-seal": `MAIN ACTION: NAVAL / SEAL OPERATION — ${config.vehNaval}. Soldiers: ${config.solAction}. Gear: ${config.solGear}.`,
		"civilian-chaos": `MAIN ACTION: CIVILIAN CHAOS — ${config.civType}. Emotion: ${config.civEmotion}. Interaction: ${config.civInteraction}.`,
		"hero-charge": `MAIN ACTION: HERO CHARGE — ${config.solHero} ${config.solAction}. Cinematic scale: ${config.solScale}. Mood: ${config.camMood}.`,
		siege: `MAIN ACTION: SIEGE & BOMBARDMENT — ${config.vfxFire}. Weapons: ${config.vfxWeapons}. Vehicle: ${config.vehGround}.`,
		aftermath: `MAIN ACTION: AFTERMATH — ${config.civEmotion}. ${config.vfxProps}. ${config.civInteraction}. Silence after battle.`,
	};

	return `[SCENE ${sceneNum}/${totalScenes} | ${start}s – ${end}s | ★ ${typeLabel.toUpperCase()} ★]
THEME: WAR CINEMATIC × DJ Battle Zone | Hyper-Cinematic Realistic
FILM REFS: Saving Private Ryan · 1917 · LOTR Return of the King · Braveheart · Gladiator · Dunkirk · Apocalypse Now · Hacksaw Ridge · Troy

${actionLines[sceneType] || actionLines["ground-assault"]}

HERO SOLDIER: ${config.solHero}. Gear: ${config.solGear}.
SQUAD / ARMY: ${config.solSquad}. Scale: ${config.solScale}.

DJ INTERCUT: ${config.djType} performing on ${config.djSetup} amid chaos. Action: ${config.djAction}. Outfit: ${config.djOutfit}.
DJ EFFECT: ${config.djFx}. ${config.djSound}.

CIVILIAN: ${config.civType} — ${config.civEmotion}. ${config.civInteraction}. Density: ${config.civDensity}.

VEHICLES: Ground: ${config.vehGround}. Air: ${config.vehAir}. Naval: ${config.vehNaval}. Action: ${config.vehAction}.

LOCATION: ${config.locMain} | Time: ${config.locTime} | Palette: ${config.locPalette} | Atmosphere: ${config.locAtmo}.

LIGHTING: ${config.lightMain}. FX: ${config.lightFx}. Colors: ${config.lightColor}. ${config.lightShadow}.

VFX: Fire/Explosion — ${config.vfxFire}. Smoke — ${config.vfxSmoke}. Weapons — ${config.vfxWeapons}. Duel — ${config.vfxDuel}. Props — ${config.vfxProps}. SFX — ${config.vfxSfx}.

CAMERA: ${config.camAngle}, ${config.camMove}. Lens: ${config.camLens}. Mood: ${config.camMood}.

STYLE: ${config.camQuality}, ${config.camGrade}. No watermarks. No text overlays. Photorealistic humans and environments. Hyper-cinematic war epic production quality. Sound: war music atmosphere — drums, brass, tension underscore.`;
}
