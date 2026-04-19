import { SCENE_TYPE_LABELS, VISUAL_STYLE_HINTS, VISUAL_STYLE_LABELS } from "./constants";
import type { ClipModeKey, SceneConfig, SceneTypeKey, TrailerCharacter, VisualStyleKey } from "./types";
import { mmss } from "./utils";

export function buildPrompt(args: {
	clipMode: ClipModeKey;
	filmRef: string;
	trailerCharacters: TrailerCharacter[];
	sceneNum: number;
	totalScenes: number;
	secPerScene: number;
	sceneType: SceneTypeKey;
	visualStyle: VisualStyleKey;
	config: SceneConfig;
}) {
	const { clipMode, filmRef, trailerCharacters, sceneNum, totalScenes, secPerScene, sceneType, visualStyle, config } = args;
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

	if (clipMode === "trailer") {
		const introChar = trailerCharacters.find((c) => c.introSceneNumber === sceneNum);
		const beat = introChar ? "character-intro" : config.trailerBeat ?? "setpiece";
		const emotion = config.trailerEmotion ?? "determination";
		const setpiece = introChar
			? "cinematic character close-up, opening credits reveal"
			: config.trailerSetpiece ?? "high-speed chase montage";
		const focusKey = config.trailerFocusCharacter ?? "";
		const focusByName =
			focusKey && focusKey !== "__role__"
				? trailerCharacters.find((c) => c.name === focusKey)
				: undefined;
		const fallback = trailerCharacters[0];
		const focusCharacter = focusByName ?? fallback;
		const focusRole =
			introChar?.role || focusCharacter?.role || focusKey || "the driver";
		const focusName =
			introChar?.name || focusCharacter?.name || focusKey || "The Driver";
		const focusFace = introChar?.faceDescription || focusCharacter?.faceDescription || "";
		const credit = config.trailerCreditText?.trim();

		const creditLine = introChar
			? `Opening credit style: ${focusName} — ${focusRole}.`
			: credit
				? `Opening credit style: ${credit}.`
				: "";

		return {
			schema: "aiVideoPrompt.v1",
			tool: "car-music-video-clip",
			schemaVersion: 1,
			generatedAt: new Date().toISOString(),
			language: { primary: "id" },
			video: {
				title: `Trailer / Opening — ${filmRef}`,
				durationSec: totalScenes * secPerScene,
				aspectRatio: "16:9",
				fps: 24,
				resolution: "1920x1080",
				platformTargets: ["youtube", "tiktok", "instagram_reels"],
			},
			style: {
				visualStyle,
				visualStyleHint: styleHint,
				genre: "Car Film Trailer / Opening",
				rendering: { look: "photorealistic", cgiLevel: "none" },
				colorGrade: config.camGrade,
				quality: config.camQuality,
				references: { filmRefs: [filmRef], shotRefs: [] },
			},
			continuity: {
				anchor:
					`Trailer vibe inspired by ${filmRef}. Original characters only — do not recreate actor likeness. ` +
					"Show key moments montage: race, chase, heist, emotional beats, climax.",
				mustKeepConsistent: ["location_identity", "character_identity"],
			},
			characters: trailerCharacters.map((c) => ({
				name: c.name,
				role: c.role,
				faceDescription: c.faceDescription,
				introSceneNumber: c.introSceneNumber,
			})),
			models: { text: null, vision: null, video: null },
			constraints: {
				noTextOverlay: false,
				noLogo: true,
				noWatermark: true,
				avoid: ["cgi artifacts", "face distortion", "extra limbs", "celebrity likeness"],
				safety: { noWeapons: false, noGore: true },
			},
			audio: {
				music: {
					enabled: true,
					genre: "cinematic trailer score / driving bass",
					bpm: 128,
					mood: emotion,
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
					sceneType: beat,
					beat: { purpose: "trailer", emotion },
					environment: {
						location: config.locMain,
						timeOfDay: config.locTime,
						weather: "",
						atmosphere: config.locAtmo,
					},
					subject: {
						characters: [{ name: focusName, role: focusRole, appearanceLock: false }],
						product: null,
					},
					camera: {
						shot: config.camAngle,
						lens: config.camLens,
						movement: config.camMove,
						stabilization: "cinematic_gimbal",
						focus: "shallow_dof",
					},
					lighting: {
						setup: config.lightMain,
						fx: [config.lightFx].filter(Boolean),
						color: config.lightColor,
						shadow: config.lightShadow,
					},
					action: {
						summary: { id: `${beat} — ${setpiece}`, en: "" },
						details: [
							`Film vibe: ${filmRef}`,
							`Focus: ${focusName} (${focusRole})`,
							`Setpiece: ${setpiece}`,
							creditLine,
						].filter(Boolean),
						blocking: "",
					},
					composition: {
						mustShow: ["cinematic_montage", "character_closeups", "high_speed_momentum"],
						avoidShowing: ["watermark", "logos"],
					},
					audioCues: { sfx: [], musicNote: "trailer riser + drop", voIds: [], subtitleIds: [] },
					deliverable: {
						prompt:
							`Film trailer/opening montage inspired by ${filmRef}, but ORIGINAL characters (no actor likeness). ` +
							`Beat: ${beat}. Emotion: ${emotion}. Setpiece: ${setpiece}. Focus: ${focusName} (${focusRole}). ` +
							(focusFace ? `Face: ${focusFace}. ` : "") +
							`${creditLine} ` +
							`Camera: ${config.camAngle}, ${config.camMove}, lens ${config.camLens}. ` +
							`Lighting: ${config.lightMain}. Location: ${config.locMain} (${config.locTime}). ` +
							`Visual style: ${styleLabel}. No watermark, no logos.`,
						negativePrompt:
							"watermark, logo, lowres, cgi artifacts, celebrity likeness, face distortion, extra limbs",
					},
					toolConfig: config,
				},
			],
		};
	}

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
