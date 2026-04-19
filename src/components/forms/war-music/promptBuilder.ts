import { SCENE_TYPE_LABELS, VISUAL_STYLE_HINTS, VISUAL_STYLE_LABELS } from "./constants";
import type { ClipModeKey, SceneConfig, SceneTypeKey, TrailerCharacter, VisualStyleKey } from "./types";

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
		"ground-assault": `MAIN ACTION: GROUND ASSAULT — ${config.solAction}. Formation: ${config.solSquad}. Enemy: ${config.solEnemy}.`,
		"dj-warzone": `MAIN ACTION: DJ WAR DROP — ${config.djAction}. Setup: ${config.djSetup}. Effect: ${config.djFx}. ${config.djSound}.`,
		"aerial-combat": `MAIN ACTION: AERIAL COMBAT — ${config.vehAir}. Action: ${config.vehAction}. Visual: ${config.vfxSfx}.`,
		"naval-seal": `MAIN ACTION: NAVAL / SEAL OPERATION — ${config.vehNaval}. Soldiers: ${config.solAction}. Gear: ${config.solGear}.`,
		"civilian-chaos": `MAIN ACTION: CIVILIAN CHAOS — ${config.civType}. Emotion: ${config.civEmotion}. Interaction: ${config.civInteraction}.`,
		"hero-charge": `MAIN ACTION: HERO CHARGE — ${config.solHero} ${config.solAction}. Cinematic scale: ${config.solScale}. Mood: ${config.camMood}.`,
		siege: `MAIN ACTION: SIEGE & BOMBARDMENT — ${config.vfxFire}. Weapons: ${config.vfxWeapons}. Vehicle: ${config.vehGround}.`,
		aftermath: `MAIN ACTION: AFTERMATH — ${config.civEmotion}. ${config.vfxProps}. ${config.civInteraction}. Silence after battle.`,
	};

	if (clipMode === "trailer") {
		const introChar = trailerCharacters.find((c) => c.introSceneNumber === sceneNum);
		const beat = introChar ? "character-intro" : config.trailerBeat ?? "setpiece";
		const emotion = config.trailerEmotion ?? "honor";
		const setpiece = introChar
			? "cinematic character close-up, opening credits reveal"
			: config.trailerSetpiece ?? "armies gathering, banners in storm wind";
		const focusKey = config.trailerFocusCharacter ?? "";
		const focusByName =
			focusKey && focusKey !== "__role__"
				? trailerCharacters.find((c) => c.name === focusKey)
				: undefined;
		const fallback = trailerCharacters[0];
		const focusCharacter = focusByName ?? fallback;
		const focusRole =
			introChar?.role || focusCharacter?.role || focusKey || "the commander";
		const focusName =
			introChar?.name || focusCharacter?.name || focusKey || "The Commander";
		const focusFace = introChar?.faceDescription || focusCharacter?.faceDescription || "";
		const credit = config.trailerCreditText?.trim();
		const creditLine = introChar
			? `Opening credit style: ${focusName} — ${focusRole}.`
			: credit
				? `Opening credit style: ${credit}.`
				: "";

		return {
			schema: "aiVideoPrompt.v1",
			tool: "war-music-video-clip",
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
				genre: "War Epic Film Trailer / Opening",
				rendering: { look: "photorealistic", cgiLevel: "none" },
				colorGrade: config.camGrade,
				quality: config.camQuality,
				references: { filmRefs: [filmRef], shotRefs: [] },
			},
			continuity: {
				anchor:
					`Trailer vibe inspired by ${filmRef}. Original characters only — do not recreate actor likeness. ` +
					"Show key moments montage: armies, duel, siege, cavalry, emotional vow, climax.",
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
				avoid: ["cgi artifacts", "face distortion", "extra limbs", "celebrity likeness", "gore"],
				safety: { noWeapons: false, noGore: true },
			},
			audio: {
				music: {
					enabled: true,
					genre: "epic trailer score — drums, brass, choir",
					bpm: 140,
					mood: emotion,
					instruments: ["drums", "brass", "strings"],
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
					time: { startSec: start, endSec: end, label: `${start}s-${end}s` },
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
						mustShow: ["cinematic_montage", "character_closeups", "battle_scale"],
						avoidShowing: ["watermark", "logos", "gore"],
					},
					audioCues: { sfx: [], musicNote: "trailer riser + impact hits", voIds: [], subtitleIds: [] },
					deliverable: {
						prompt:
							`War epic film trailer/opening montage inspired by ${filmRef}, but ORIGINAL characters (no actor likeness). ` +
							`Beat: ${beat}. Emotion: ${emotion}. Setpiece: ${setpiece}. Focus: ${focusName} (${focusRole}). ` +
							(focusFace ? `Face: ${focusFace}. ` : "") +
							`${creditLine} ` +
							`Camera: ${config.camAngle}, ${config.camMove}, lens ${config.camLens}. ` +
							`Lighting: ${config.lightMain}. Location: ${config.locMain} (${config.locTime}). ` +
							`Visual style: ${styleLabel}. No watermark, no logos. No gore.`,
						negativePrompt:
							"watermark, logo, lowres, cgi artifacts, celebrity likeness, gore, dismemberment, extra limbs, face distortion",
					},
					toolConfig: config,
				},
			],
		};
	}

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
