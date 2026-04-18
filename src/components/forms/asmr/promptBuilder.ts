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

	return `═══════════════════════════════════════════════════════════════\n[SCENE ${sceneNum}/${totalScenes} | ${mmss(start)} – ${mmss(end)} | ${ptLabel}: ${typeLabel.toUpperCase()}]\nSERIES PROGRESS: ${progressPct}% complete | ${prevScene}\nNEXT: ${nextScene}\n═══════════════════════════════════════════════════════════════\n\nTHEME: ASMR Timelapse ${ptLabel} | Cinematic Satisfying Process\nVISUAL STYLE: ${styleLabel} — ${styleHint}\nPHASE: ${phaseNote}\n\nTIME OF DAY: ${tod.label} | ${tod.timeRange}\nSky: ${tod.sky}\nNarrator context: ${tod.narHint}\n\n━━━ PROJECT DNA (CONSISTENT ACROSS ALL ${totalScenes} SCENES) ━━━━━━━━━━━\nBUILDING / STRUCTURE: ${dna.building}\nLOCATION SETTING: ${dna.location}\nCLIMATE & SEASON: ${dna.climate}\nPRIMARY MATERIAL: ${dna.material}\nCOLOR PALETTE: ${dna.palette}\nCREW / TEAM: ${dna.team}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSCENE-SPECIFIC CONFIGURATION:\n\nTIMELAPSE: ${config.tlMode}\nTime compression: ${config.tlCompression}\nProgress visual: ${config.tlProgress}\nSky / weather: ${config.tlSky}\n\nEQUIPMENT: Primary: ${config.eqMain}\nSupport vehicles: ${config.eqSupport}\nHand tools: ${config.eqHand}\nEquipment motion in timelapse: ${tod.equipMotion} — ${config.eqMotion}\n\n${narSection}\n\nLIGHTING: ${tod.lighting}\nOverride/supplement: ${config.lightMain}\nFX: ${tod.lightFx} — ${config.lightFx}\nColors: ${tod.lightColor}. Additional: ${config.lightColor}\nShadow: ${tod.lightShadow}. ${config.lightShadow}\n\nASMR SOUND: Music — ${config.asmrMusic}\nLayer: ${config.asmrLayer} | Ambient: ${tod.ambientSound} — ${config.asmrAmbient}\nSpecial moment: ${config.asmrMoment}\n\nCAMERA: ${config.camAngle}, ${config.camMove}\nLens: ${config.camLens} | Mood: ${config.camMood}\nStyle: ${config.camQuality}, color grade: ${config.camGrade}\n\nCONTINUITY INSTRUCTIONS:\n- SAME building, location, and materials as all other scenes in this series\n- This scene represents ${progressPct}% completion of the overall project\n- Seamless visual continuity with adjacent scenes — no random location changes\n- Show satisfying progression of construction work and material transformation\n- Emphasize tactile construction ASMR sounds: scraping, sawing, hammering, drilling, pouring, brushing, welding\n- Camera should capture clear visible change over time, with timelapse speed feeling satisfying\n- End frame should clearly set up the next stage\n\nDELIVERABLE:\nGenerate a single cohesive AI video prompt for this scene with vivid visual detail, realistic construction process, cinematic camera language, and ASMR sound design.\n`;
}
