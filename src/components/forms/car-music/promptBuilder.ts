import { SCENE_TYPE_LABELS, VISUAL_STYLE_HINTS, VISUAL_STYLE_LABELS } from "./constants";
import type { SceneConfig, SceneTypeKey, VisualStyleKey } from "./types";
import { mmss } from "./utils";

export function buildPrompt(args: {
	sceneNum: number;
	totalScenes: number;
	secPerScene: number;
	sceneType: SceneTypeKey;
	visualStyle: VisualStyleKey;
	config: SceneConfig;
}) {
	const { sceneNum, totalScenes, secPerScene, sceneType, visualStyle, config } = args;
	const start = (sceneNum - 1) * secPerScene;
	const end = start + secPerScene;
	const typeLabel = SCENE_TYPE_LABELS[sceneType] ?? sceneType;
	const styleLabel = VISUAL_STYLE_LABELS[visualStyle] ?? visualStyle;
	const styleHint = VISUAL_STYLE_HINTS[visualStyle] ?? "";

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

	return {
		schema: "aiVideoPrompt.v1",
		tool: "car-music-video-clip",
		schemaVersion: 1,
		generatedAt: new Date().toISOString(),
		language: { primary: "id" },
		video: {
			title: "Car Music Video Clip",
			durationSec: totalScenes * secPerScene,
			aspectRatio: "16:9",
			fps: 24,
			resolution: "1920x1080",
			platformTargets: ["youtube", "tiktok", "instagram_reels"],
		},
		style: {
			visualStyle,
			visualStyleHint: styleHint,
			genre: "Fast & Furious Car Party × DJ Music Video",
			rendering: { look: "photorealistic", cgiLevel: "none" },
			colorGrade: config.camGrade,
			quality: config.camQuality,
			references: { filmRefs: [], shotRefs: [] },
		},
		continuity: {
			anchor: "Fast & Furious Car Party × DJ Music Video",
			mustKeepConsistent: ["location_identity"],
		},
		models: { text: null, vision: null, video: null },
		constraints: {
			noTextOverlay: true,
			noLogo: true,
			noWatermark: true,
			avoid: ["cgi artifacts", "face distortion", "extra limbs"],
			safety: { noWeapons: false, noGore: true },
		},
		audio: {
			music: {
				enabled: true,
				genre: "EDM / DJ",
				bpm: 128,
				mood: "energetic",
				instruments: [],
			},
			voiceover: { enabled: false, language: "id", voice: null, lines: [] },
			subtitles: { enabled: false, style: "minimal", lines: [] },
			sfx: [config.djSound, config.propSfx].filter(Boolean),
		},
		references: { images: [] },
		scenes: [
			{
				id: sceneNum,
				sceneNumber: `Scene ${sceneNum}`,
				time: {
					startSec: start,
					endSec: end,
					label: `${mmss(start)}-${mmss(end)}`,
				},
				sceneType,
				beat: { purpose: "energy", emotion: config.crowdEnergy },
				environment: {
					location: config.locMain,
					timeOfDay: config.locTime,
					weather: "",
					atmosphere: config.locAtmo,
				},
				subject: {
					characters: [
						{ name: config.djType, role: "dj", appearanceLock: false },
					],
					product: null,
				},
				camera: {
					shot: config.camAngle,
					lens: config.camLens,
					movement: config.camMove,
					stabilization: "handheld_smooth",
					focus: "shallow_dof",
				},
				lighting: {
					setup: config.lightMain,
					fx: [config.lightFx].filter(Boolean),
					color: config.lightColor,
					shadow: config.lightShadow,
				},
				action: {
					summary: { id: actionLines[sceneType] ?? actionLines["dj-party"], en: "" },
					details: [
						`Cars: ${config.carHero} + ${config.carSecondary} (${config.carCount})`,
						`DJ: ${config.djSetup} — ${config.djFx}`,
						`Crowd: ${config.crowdMix}, ${config.crowdDensity}, ${config.crowdFashion}`,
						`Props: fire=${config.propFire}, smoke=${config.propSmoke}`,
					],
					blocking: "",
				},
				composition: {
					mustShow: ["dj", "hero_car", "crowd_energy"],
					avoidShowing: ["text_overlay", "watermark", "logos"],
				},
				audioCues: { sfx: [], musicNote: "", voIds: [], subtitleIds: [] },
				deliverable: {
					prompt: `Theme: Fast & Furious Car Party × DJ Music Video. Visual: ${styleLabel}. Location: ${config.locMain} (${config.locTime}). Action: ${actionLines[sceneType] ?? actionLines["dj-party"]} Camera: ${config.camAngle}, ${config.camMove}, ${config.camLens}. Lighting: ${config.lightMain}. No text, no watermark, no logos.`,
					negativePrompt: "text overlay, watermark, logo, lowres, cgi artifacts, extra limbs, face distortion",
				},
				toolConfig: config,
			},
		],
	};
}
