import {
	PHASE_DESC,
	SCENE_TYPES,
	TOD_DATA,
	VISUAL_STYLE_HINTS,
	VISUAL_STYLE_LABELS,
} from "./constants";
import type { DnaState, ProjectTypeKey, SceneConfig, SceneTypeKey, TodKey, VisualStyleKey } from "./types";
import { mmss } from "./utils";

export function buildPrompt(args: {
	sceneNum: number;
	totalScenes: number;
	secPerScene: number;
	sceneType: SceneTypeKey;
	visualStyle: VisualStyleKey;
	projectType: ProjectTypeKey;
	narratorGender: "male" | "female";
	timeOfDay: TodKey;
	dna: DnaState;
	config: SceneConfig;
}) {
	const {
		sceneNum,
		totalScenes,
		secPerScene,
		sceneType,
		visualStyle,
		projectType,
		narratorGender,
		timeOfDay,
		dna,
		config,
	} = args;
	const start = (sceneNum - 1) * secPerScene;
	const end = start + secPerScene;
	const styleLabel = VISUAL_STYLE_LABELS[visualStyle] ?? visualStyle;
	const styleHint = VISUAL_STYLE_HINTS[visualStyle] ?? "";
	const typeLabel =
		(projectType === "restoration"
			? SCENE_TYPES.restoration[
			sceneType as keyof typeof SCENE_TYPES.restoration
			]
			: SCENE_TYPES.construction[
			sceneType as keyof typeof SCENE_TYPES.construction
			]) ?? String(sceneType);
	const progressPct = Math.round((sceneNum / totalScenes) * 100);
	const tod = TOD_DATA[timeOfDay];
	const ptLabel =
		projectType === "restoration" ? "RESTORATION" : "NEW CONSTRUCTION";
	const narGender =
		narratorGender === "male"
			? "MALE — deep authoritative baritone"
			: "FEMALE — clear confident professional";

	const narSection = config.narFreq.includes("none")
		? "NARRATION: None this scene — pure ambient ASMR sound only."
		: `NARRATION: Off-screen ${narGender} foreman/site supervisor voice.\nStyle: ${config.narStyle}. Audio: ${config.narAudio}.\nExample line: ${config.narLine}\nFrequency: ${config.narFreq}. No character model shown — voice only.`;

	const phaseNote =
		(PHASE_DESC[sceneType as keyof typeof PHASE_DESC] as string | undefined) ??
		"Key construction phase progressing satisfyingly.";

	const prevScene =
		sceneNum > 1
			? `Scene ${sceneNum - 1} established the previous phase.`
			: "This is the opening scene — establishing the overall context.";
	const nextScene =
		sceneNum < totalScenes
			? `Scene ${sceneNum + 1} will progress to the next phase.`
			: "This is the final scene — the complete transformation is shown.";

	return {
		schema: "aiVideoPrompt.v1",
		tool: "asmr-timelapse-constructor",
		schemaVersion: 1,
		generatedAt: new Date().toISOString(),
		language: { primary: "id" },
		video: {
			title: `ASMR Timelapse — ${ptLabel}`,
			durationSec: totalScenes * secPerScene,
			aspectRatio: "16:9",
			fps: 24,
			resolution: "1920x1080",
			platformTargets: ["youtube", "tiktok", "instagram_reels"],
		},
		style: {
			visualStyle,
			visualStyleHint: styleHint,
			genre: `ASMR Timelapse ${ptLabel}`,
			rendering: { look: "photorealistic", cgiLevel: "none" },
			colorGrade: config.camGrade,
			quality: config.camQuality,
			references: { filmRefs: [], shotRefs: [] },
		},
		continuity: {
			anchor: `BUILDING: ${dna.building} | LOCATION: ${dna.location} | MATERIAL: ${dna.material} | PALETTE: ${dna.palette}`,
			mustKeepConsistent: ["location_identity", "character_identity"],
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
				enabled: !config.asmrMusic.toLowerCase().includes("none"),
				genre: config.asmrMusic,
				bpm: 90,
				mood: config.asmrLayer,
				instruments: [],
			},
			voiceover: {
				enabled: !config.narFreq.includes("none"),
				language: "id",
				voice: { gender: narratorGender, tone: config.narStyle },
				lines: config.narFreq.includes("none")
					? []
					: [
							{
								time: `${mmss(start)}-${mmss(end)}`,
								id: "VO1",
								text: { id: config.narLine, en: "" },
							},
						],
			},
			subtitles: { enabled: false, style: "minimal", lines: [] },
			sfx: [config.asmrAmbient, config.asmrMoment].filter(Boolean),
		},
		references: { images: [] },
		scenes: [
			{
				id: sceneNum,
				time: { startSec: start, endSec: end, label: `${mmss(start)}-${mmss(end)}` },
				sceneType,
				beat: { purpose: "progress", emotion: "satisfying" },
				environment: {
					location: dna.location,
					timeOfDay,
					weather: config.tlSky,
					atmosphere: tod.narHint,
				},
				subject: {
					characters: [{ name: dna.team, role: "crew", appearanceLock: false }],
					product: null,
				},
				camera: {
					shot: config.camAngle,
					lens: config.camLens,
					movement: config.camMove,
					stabilization: "tripod_or_gimbal",
					focus: "shallow_dof",
				},
				lighting: {
					setup: `${tod.lighting} — ${config.lightMain}`,
					fx: [tod.lightFx, config.lightFx].filter(Boolean),
					color: `${tod.lightColor} + ${config.lightColor}`,
					shadow: `${tod.lightShadow} + ${config.lightShadow}`,
				},
				action: {
					summary: { id: `${typeLabel} — ${phaseNote}`, en: "" },
					details: [
						`Project: ${dna.building} (${ptLabel})`,
						`Timelapse: ${config.tlMode}, compression=${config.tlCompression}, progress=${config.tlProgress}`,
						`Equipment: ${config.eqMain} + ${config.eqSupport} | tools=${config.eqHand}`,
						`ASMR: layer=${config.asmrLayer}, ambient=${tod.ambientSound} — ${config.asmrAmbient}`,
						`Progress: ${progressPct}% | Prev: ${prevScene} | Next: ${nextScene}`,
					],
					blocking: "",
				},
				composition: {
					mustShow: ["clear_progression", "material_transformation", "tactile_detail"],
					avoidShowing: ["text_overlay", "watermark", "logos"],
				},
				audioCues: {
					sfx: [],
					musicNote: config.asmrMusic,
					voIds: config.narFreq.includes("none") ? [] : ["VO1"],
					subtitleIds: [],
				},
				deliverable: {
					prompt: `Theme: ASMR Timelapse ${ptLabel}. Visual: ${styleLabel}. Scene: ${typeLabel}. DNA: ${dna.building}, ${dna.location}, material=${dna.material}. Time: ${tod.label}. Timelapse: ${config.tlMode}. Camera: ${config.camAngle}, ${config.camMove}, lens ${config.camLens}. Lighting: ${tod.lighting} + ${config.lightMain}. ASMR: ${config.asmrLayer}, ${config.asmrAmbient}. No text, no watermark, no logos.`,
					negativePrompt: "text overlay, watermark, logo, lowres, cgi artifacts, extra limbs, face distortion",
				},
				toolConfig: { dna, config, meta: { progressPct, prevScene, nextScene } },
			},
		],
	};
}
