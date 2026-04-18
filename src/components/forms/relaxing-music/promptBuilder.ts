import { SCENE_TYPES, TOD_DATA, VISUAL_STYLE_HINTS, VISUAL_STYLE_LABELS } from "./constants";
import type { SceneConfig, SceneTypeKey, TodKey, VisualStyleKey } from "./types";
import { mmss } from "./utils";

export function buildPrompt(args: {
	sceneNum: number;
	totalScenes: number;
	secPerScene: number;
	sceneType: SceneTypeKey;
	visualStyle: VisualStyleKey;
	timeOfDay: TodKey;
	config: SceneConfig;
}) {
	const { sceneNum, totalScenes, secPerScene, sceneType, visualStyle, timeOfDay, config } = args;
	const start = (sceneNum - 1) * secPerScene;
	const end = start + secPerScene;
	const tod = TOD_DATA[timeOfDay];
	const typeLabel = SCENE_TYPES[sceneType] ?? sceneType;
	const styleLabel = VISUAL_STYLE_LABELS[visualStyle] ?? visualStyle;
	const styleHint = VISUAL_STYLE_HINTS[visualStyle] ?? "";

	return `═══════════════════════════════════════════════════════════════
[SCENE ${sceneNum}/${totalScenes} | ${mmss(start)} – ${mmss(end)} | ${typeLabel}]
═══════════════════════════════════════════════════════════════

THEME: Relaxing Music Video Clip — European Nature Drone | ${styleLabel}
VISUAL STYLE: ${styleLabel} — ${styleHint}

TIME OF DAY: ${tod.label}
LIGHTING: ${tod.lighting}
SKY: ${tod.sky}

NATURE VIEW:
- Spot: ${config.natSpot}
- Water: ${config.natWater}
- Vegetation: ${config.natVegetation}
- Terrain: ${config.natTerrain}

EUROPEAN LOCATION:
- Region: ${config.locCountry}
- Setting: ${config.locSetting}
- Weather: ${config.locWeather}
- Color palette: ${config.locPalette}

ANIMALS:
- Birds: ${config.aniBirds}
- Land animals: ${config.aniLand}
- Insects: ${config.aniInsects}
- Water animals: ${config.aniWater}

VISUAL ELEMENTS:
- Composition: ${config.visComposition}
- Flowers: ${config.visFlowers}
- Rocks: ${config.visRocks}
- Sky detail: ${config.visSky}

LIGHTING DETAILS:
- Main: ${config.lightMain}
- FX: ${config.lightFx}
- Color: ${config.lightColor}
- Shadow: ${config.lightShadow}

DRONE & CAMERA:
- Movement: ${config.camMove}
- Angle: ${config.camAngle}
- Lens: ${config.camLens}
- Speed: ${config.camSpeed}

SUPPORT ELEMENTS:
- Wind: ${config.elemWind}
- Human element: ${config.elemHuman}
- Atmosphere: ${config.elemAtmo}
- Season: ${config.elemSeason}

STYLE & MOOD:
- Mood: ${config.styMood}
- Color grade: ${config.styGrade}
- Quality: ${config.styQuality}
- Music match: ${config.styMusic}

INSTRUCTIONS:
- Ultra calming, relaxing, slow cinematic drone footage
- No text overlay, no watermark, no logos
- Photorealistic, natural, high detail, smooth motion
- Prioritize serenity: gentle movements, peaceful ambience, beautiful composition

DELIVERABLE:
Generate a single cohesive AI video prompt for this scene in vivid detail, cinematic language, and relaxing tone.
`;
}
