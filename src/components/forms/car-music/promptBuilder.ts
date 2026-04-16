import { SCENE_TYPE_LABELS, SEC_PER_SCENE, TOTAL_SCENES } from "./constants";
import type { SceneConfig, SceneTypeKey } from "./types";
import { mmss } from "./utils";

export function buildPrompt(args: {
	sceneNum: number;
	sceneType: SceneTypeKey;
	config: SceneConfig;
}) {
	const { sceneNum, sceneType, config } = args;
	const start = (sceneNum - 1) * SEC_PER_SCENE;
	const end = start + SEC_PER_SCENE;
	const typeLabel = SCENE_TYPE_LABELS[sceneType] ?? sceneType;

	const actionLines: Record<SceneTypeKey, string> = {
		"dj-party": `MAIN ACTION: DJ FREESTYLE — ${config.djAction}. Setup: ${config.djSetup}. Effect: ${config.djFx}. ${config.djSound}.`,
		"street-race": `MAIN ACTION: STREET RACE — Hero car ${config.carAction}. ${config.carCount} in frame. ${config.carDetail}.`,
		crowd: `MAIN ACTION: CROWD ENERGY — ${config.crowdEnergy}. ${config.crowdAction}. ${config.crowdMoment}.`,
		"car-show": `MAIN ACTION: CAR SHOW DISPLAY — ${config.carCount}, ${config.carColor}. ${config.carDetail}. Crowd: ${config.crowdMix}.`,
		engine: `MAIN ACTION: ENGINE ROAR — ${config.carHero} ${config.carAction}. Close-up engine bay/exhaust. ${config.carDetail}.`,
		"street-drift": `MAIN ACTION: DRIFT SEQUENCE — ${config.carHero} drifting sideways. ${config.carAction}. Smoke: ${config.propSmoke}.`,
		"hero-shot": `MAIN ACTION: CINEMATIC HERO SHOT — ${config.djType} and hero car together. ${config.djAction}. Dramatic pose, epic scale.`,
		"night-vibe": `MAIN ACTION: NIGHT ATMOSPHERE — ${config.crowdMoment}. ${config.crowdAction}. Fire: ${config.propFire}.`,
	};

	return `[SCENE ${sceneNum}/${TOTAL_SCENES} | ${mmss(start)} – ${mmss(end)} | ★ ${typeLabel.toUpperCase()} ★]
THEME: Fast & Furious Car Party × DJ Music Video | Semi-Cinematic Realistic

${actionLines[sceneType] ?? actionLines["dj-party"]}

CARS: ${config.carHero}. Background: ${config.carSecondary}. Color scheme: ${config.carColor}.

DJ SETUP: ${config.djType} wearing ${config.djOutfit}. Platform: ${config.djSetup}.

CROWD: ${config.crowdMix}, ${config.crowdDensity}. Fashion: ${config.crowdFashion}.

LOCATION: ${config.locMain} | Time: ${config.locTime} | Palette: ${config.locPalette} | Atmo: ${config.locAtmo}.

LIGHTING: ${config.lightMain}. Effects: ${config.lightFx}. Colors: ${config.lightColor}. ${config.lightShadow}.

PROPS: Fire — ${config.propFire}. Smoke — ${config.propSmoke}. Animal — ${config.propAnimal}. Deco — ${config.propDeco}. SFX — ${config.propSfx}.

CAMERA: ${config.camAngle}, ${config.camMove}. Lens: ${config.camLens}. Mood: ${config.camMood}.

STYLE: ${config.camQuality}, ${config.camGrade}. No watermarks. No text overlays. Photorealistic humans and animals. Semi-cinematic music video production quality.`;
}

