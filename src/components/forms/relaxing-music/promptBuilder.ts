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

	return {
		schema: "aiVideoPrompt.v1",
		tool: "relaxing-music-video-clip",
		schemaVersion: 1,
		generatedAt: new Date().toISOString(),
		language: { primary: "id" },
		video: {
			title: "Relaxing Music Video Clip",
			durationSec: totalScenes * secPerScene,
			aspectRatio: "16:9",
			fps: 24,
			resolution: "1920x1080",
			platformTargets: ["youtube", "tiktok", "instagram_reels"],
		},
		style: {
			visualStyle,
			visualStyleHint: styleHint,
			genre: "European Nature Drone",
			rendering: { look: "photorealistic", cgiLevel: "none" },
			colorGrade: config.styGrade,
			quality: config.styQuality,
			references: { filmRefs: [], shotRefs: [] },
		},
		continuity: {
			anchor: "Relaxing Music Video Clip — European Nature Drone",
			mustKeepConsistent: ["location_identity"],
		},
		models: { text: null, vision: null, video: null },
		constraints: {
			noTextOverlay: true,
			noLogo: true,
			noWatermark: true,
			avoid: ["cgi artifacts", "face distortion", "extra limbs"],
			safety: { noWeapons: true, noGore: true },
		},
		audio: {
			music: {
				enabled: true,
				genre: "relaxing ambient / nature",
				bpm: 90,
				mood: config.styMood,
				instruments: [],
			},
			voiceover: { enabled: false, language: "id", voice: null, lines: [] },
			subtitles: { enabled: false, style: "minimal", lines: [] },
			sfx: [],
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
				beat: { purpose: "calm", emotion: config.styMood },
				environment: {
					location: `${config.locCountry} — ${config.locSetting}`,
					timeOfDay,
					weather: config.locWeather,
					atmosphere: config.elemAtmo,
				},
				subject: { characters: [], product: null },
				camera: {
					shot: config.camAngle,
					lens: config.camLens,
					movement: config.camMove,
					stabilization: "drone_gimbal",
					focus: "deep_focus",
				},
				lighting: {
					setup: `${tod.lighting} — ${config.lightMain}`,
					fx: [config.lightFx].filter(Boolean),
					color: config.lightColor,
					shadow: config.lightShadow,
				},
				action: {
					summary: { id: `${typeLabel} — ${config.visComposition}`, en: "" },
					details: [
						`Nature: ${config.natSpot}, water=${config.natWater}, terrain=${config.natTerrain}`,
						`Vegetation: ${config.natVegetation} + flowers=${config.visFlowers}`,
						`Animals: birds=${config.aniBirds}, land=${config.aniLand}`,
						`Wind: ${config.elemWind}, season=${config.elemSeason}`,
					],
					blocking: "",
				},
				composition: {
					mustShow: ["serene_landscape", "natural_textures"],
					avoidShowing: ["text_overlay", "watermark", "logos"],
				},
				audioCues: { sfx: [], musicNote: config.styMusic, voIds: [], subtitleIds: [] },
				deliverable: {
					prompt: `Theme: European Nature Drone. Visual: ${styleLabel}. Time: ${tod.label}. Scene: ${typeLabel}. Location: ${config.locCountry}, ${config.locSetting}. Camera: ${config.camMove}, ${config.camAngle}, ${config.camLens}, ${config.camSpeed}. Mood: ${config.styMood}. No text, no watermark, no logos.`,
					negativePrompt: "text overlay, watermark, logo, lowres, cgi artifacts, people close-up, shaky cam",
				},
				toolConfig: { ...config, timeOfDay: tod.label },
			},
		],
	};
}
