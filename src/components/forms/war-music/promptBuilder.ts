import { SCENE_TYPE_LABELS, VISUAL_STYLE_HINTS, VISUAL_STYLE_LABELS } from "./constants";
import type { SceneConfig, SceneTypeKey, VisualStyleKey } from "./types";

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
		"ground-assault": `MAIN ACTION: GROUND ASSAULT — ${config.solAction}. Formation: ${config.solSquad}. Enemy: ${config.solEnemy}.`,
		"dj-warzone": `MAIN ACTION: DJ WAR DROP — ${config.djAction}. Setup: ${config.djSetup}. Effect: ${config.djFx}. ${config.djSound}.`,
		"aerial-combat": `MAIN ACTION: AERIAL COMBAT — ${config.vehAir}. Action: ${config.vehAction}. Visual: ${config.vfxSfx}.`,
		"naval-seal": `MAIN ACTION: NAVAL / SEAL OPERATION — ${config.vehNaval}. Soldiers: ${config.solAction}. Gear: ${config.solGear}.`,
		"civilian-chaos": `MAIN ACTION: CIVILIAN CHAOS — ${config.civType}. Emotion: ${config.civEmotion}. Interaction: ${config.civInteraction}.`,
		"hero-charge": `MAIN ACTION: HERO CHARGE — ${config.solHero} ${config.solAction}. Cinematic scale: ${config.solScale}. Mood: ${config.camMood}.`,
		siege: `MAIN ACTION: SIEGE & BOMBARDMENT — ${config.vfxFire}. Weapons: ${config.vfxWeapons}. Vehicle: ${config.vehGround}.`,
		aftermath: `MAIN ACTION: AFTERMATH — ${config.civEmotion}. ${config.vfxProps}. ${config.civInteraction}. Silence after battle.`,
	};

	return {
		schema: "aiVideoPrompt.v1",
		tool: "war-music-video-clip",
		schemaVersion: 1,
		generatedAt: new Date().toISOString(),
		language: { primary: "id" },
		video: {
			title: "War Music Video Clip",
			durationSec: totalScenes * secPerScene,
			aspectRatio: "16:9",
			fps: 24,
			resolution: "1920x1080",
			platformTargets: ["youtube", "tiktok", "instagram_reels"],
		},
		style: {
			visualStyle,
			visualStyleHint: styleHint,
			genre: "WAR CINEMATIC × DJ Battle Zone",
			rendering: { look: "photorealistic", cgiLevel: "none" },
			colorGrade: config.camGrade,
			quality: config.camQuality,
			references: {
				filmRefs: [
					"Saving Private Ryan",
					"1917",
					"LOTR Return of the King",
					"Braveheart",
					"Gladiator",
					"Dunkirk",
					"Apocalypse Now",
					"Hacksaw Ridge",
					"Troy",
				],
				shotRefs: [],
			},
		},
		continuity: {
			anchor: "WAR CINEMATIC × DJ Battle Zone",
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
				genre: "war music atmosphere — drums, brass, tension underscore",
				bpm: 140,
				mood: "intense",
				instruments: ["drums", "brass", "strings"],
			},
			voiceover: { enabled: false, language: "id", voice: null, lines: [] },
			subtitles: { enabled: false, style: "minimal", lines: [] },
			sfx: [config.vfxSfx, config.vfxFire, config.vfxWeapons].filter(Boolean),
		},
		references: { images: [] },
		scenes: [
			{
				id: sceneNum,
				sceneNumber: `Scene ${sceneNum}`,
				time: { startSec: start, endSec: end, label: `${start}s-${end}s` },
				sceneType,
				beat: { purpose: "impact", emotion: config.camMood },
				environment: {
					location: config.locMain,
					timeOfDay: config.locTime,
					weather: "",
					atmosphere: config.locAtmo,
				},
				subject: {
					characters: [
						{ name: config.solHero, role: "hero", appearanceLock: false },
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
					summary: { id: actionLines[sceneType] || actionLines["ground-assault"], en: "" },
					details: [
						`Soldiers: ${config.solSquad}, scale=${config.solScale}, gear=${config.solGear}`,
						`Enemy: ${config.solEnemy}`,
						`Vehicles: ground=${config.vehGround}, air=${config.vehAir}, naval=${config.vehNaval}`,
						`VFX: fire=${config.vfxFire}, smoke=${config.vfxSmoke}, weapons=${config.vfxWeapons}`,
						`DJ intercut: ${config.djType} — ${config.djAction} (${config.djFx})`,
					],
					blocking: "",
				},
				composition: {
					mustShow: ["hero", "battle_scale", "warzone_detail"],
					avoidShowing: ["text_overlay", "watermark", "logos", "gore"],
				},
				audioCues: { sfx: [], musicNote: "", voIds: [], subtitleIds: [] },
				deliverable: {
					prompt: `Theme: WAR CINEMATIC × DJ Battle Zone. Visual: ${styleLabel}. Action: ${actionLines[sceneType] || actionLines["ground-assault"]} Location: ${config.locMain} (${config.locTime}). Camera: ${config.camAngle}, ${config.camMove}, ${config.camLens}. Lighting: ${config.lightMain}. No text, no watermark, no logos. No gore.`,
					negativePrompt: "text overlay, watermark, logo, lowres, cgi artifacts, gore, dismemberment, extra limbs, face distortion",
				},
				toolConfig: config,
			},
		],
	};
}
