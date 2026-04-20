"use client";

import { useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import type { DnaState, ProjectTypeKey, VisualStyleKey } from "./types";
import { DNA_OPTIONS, SCENE_TYPES } from "./constants";
import {
	downloadJsonFile,
	downloadTextFile,
	jsonBundleFromSceneJsonStrings,
	jsonStringify,
} from "@/lib/promptJson";
import { parseJsonFromModelOutput } from "@/lib/aiJson";
import { getDefaultModelId, getModelOptions } from "@/lib/modelProviders";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type TimelapseSpeedKey =
	| "ultra-slow"
	| "slow"
	| "standard"
	| "fast"
	| "faster"
	| "fastest";

export type AiSceneConfig = {
	id: number;
	generatedPrompt?: string;
};

export type SeoPack = {
	title: string;
	description: string;
	tags: string[];
	thumbnailPrompt: string;
};

export type AsmrAiDNA = {
	// Identitas proyek — sama persis dgn Mode 1
	building: string;
	location: string;
	climate: string;
	material: string;
	palette: string;
	team: string;

	// Tambahan Mode 2 advanced
	projectName: string;           // nama proyek / judul bebas
	projectType: ProjectTypeKey;   // restoration | construction
	visualStyle: VisualStyleKey;

	// Timelapse speed
	timelapseSpeed: TimelapseSpeedKey;

	// Durasi
	totalMinutes: number;
	secPerScene: number;
	totalScenes: number;           // auto kalkulasi

	// Narasi
	narratorGender: "male" | "female" | "none";
	narratorStyle: string;         // calm / enthusiastic / documentary

	// Advanced detail
	timeOfDayProgression: string;  // "dawn to dusk", "morning to noon", dll
	weatherProgression: string;    // "clear → cloudy → sunny again"
	workerCount: string;           // "2-3 workers", "full crew 8+"
	mainEquipment: string;         // alat berat utama
	asmrFocus: string;             // suara utama yang ditonjolkan

	// AI
	aiProvider: string;
	aiModelId: string;

	// Status
	dnaLocked: boolean;
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

export const TIMELAPSE_SPEED_OPTIONS: Record<TimelapseSpeedKey, {
	label: string;
	desc: string;
	multiplier: string;
	motionNote: string;
}> = {
	"ultra-slow": {
		label: "Ultra Slow",
		desc: "Sangat lambat, hampir real-time",
		multiplier: "4× speed",
		motionNote: "near real-time, every detail visible, hyper-satisfying micro-movements",
	},
	"slow": {
		label: "Slow",
		desc: "Lambat, detail proses terlihat jelas",
		multiplier: "8× speed",
		motionNote: "slow contemplative timelapse, individual worker actions visible",
	},
	"standard": {
		label: "Standard",
		desc: "Standar timelapse konstruksi",
		multiplier: "30× speed",
		motionNote: "classic construction timelapse, smooth progress visible",
	},
	"fast": {
		label: "Fast",
		desc: "Cepat, progress dramatis",
		multiplier: "120× speed",
		motionNote: "fast dramatic timelapse, structure visibly rising, satisfying speed",
	},
	"faster": {
		label: "Faster",
		desc: "Sangat cepat, transisi dramatis",
		multiplier: "300× speed",
		motionNote: "very fast timelapse, dramatic day-night cycles, clouds racing",
	},
	"fastest": {
		label: "Fastest ⚡",
		desc: "Ekstrem, seperti video transformasi total",
		multiplier: "600× speed",
		motionNote: "extreme hyperlapse speed, sun streaks across sky, transformation feels magical",
	},
};

export const NARRATOR_STYLE_OPTIONS = [
	"calm and meditative — ASMR whisper style, close mic",
	"warm documentary — authoritative but friendly, BBC style",
	"enthusiastic builder — passionate about craft, energetic",
	"silent — no narration, pure ambient ASMR sound only",
];

export const TIME_OF_DAY_PROGRESSIONS = [
	"dawn (5am) → morning → midday → afternoon → golden hour",
	"morning → noon → afternoon → dusk",
	"morning → midday → evening → night (floodlights)",
	"overcast day throughout — flat consistent light",
	"mixed — sunny, cloudy, sunny, brief rain, sunny again",
	"single golden hour — short session in best light",
];

export const WEATHER_PROGRESSIONS = [
	"consistently clear blue sky throughout",
	"starts clear, brief clouds, returns to clear",
	"starts overcast, breaks to sun midday",
	"light intermittent rain, continues working",
	"heavy rain pause, workers shelter, resumes after",
	"morning mist burns off to brilliant clarity",
];

export const WORKER_COUNT_OPTIONS = [
	"solo worker — one skilled craftsperson, all tasks",
	"small team 2-3 — close-knit specialist crew",
	"medium crew 4-6 — efficient coordinated team",
	"large crew 8+ — full professional construction team",
	"massive workforce 20+ — large scale project",
];

export const MAIN_EQUIPMENT_OPTIONS = [
	"hand tools only — purely manual craft construction",
	"scaffolding + hand tools — traditional approach",
	"mini excavator + hand tools — small groundwork",
	"full excavator + concrete mixer — medium project",
	"tower crane + heavy machinery — large construction",
	"restoration tools — specialized heritage craft tools",
	"mixed — heavy initial, hand tools for finishing",
];

export const ASMR_FOCUS_OPTIONS = [
	"concrete mixing and pouring — wet slap and scrape",
	"stone or brick laying — rhythmic placement and mortar",
	"timber cutting and hammering — crisp natural wood sounds",
	"metal work — resonant clang and weld crackle",
	"earth moving — deep rumble and gravel rush",
	"tiling and grouting — satisfying level and set",
	"painting and plastering — smooth brushstroke rhythm",
	"ambient only — birds, wind, distant machinery, nature",
];

export const DEFAULT_AI_DNA: AsmrAiDNA = {
	building: DNA_OPTIONS.building[0].value,
	location: DNA_OPTIONS.location[0].value,
	climate: DNA_OPTIONS.climate[0].value,
	material: DNA_OPTIONS.material[0].value,
	palette: DNA_OPTIONS.palette[0].value,
	team: DNA_OPTIONS.team[0].value,
	projectName: "",
	projectType: "construction",
	visualStyle: "cinematic-realistic",
	timelapseSpeed: "standard",
	totalMinutes: 3,
	secPerScene: 15,
	totalScenes: 12,
	narratorGender: "male",
	narratorStyle: NARRATOR_STYLE_OPTIONS[1],
	timeOfDayProgression: TIME_OF_DAY_PROGRESSIONS[0],
	weatherProgression: WEATHER_PROGRESSIONS[0],
	workerCount: WORKER_COUNT_OPTIONS[1],
	mainEquipment: MAIN_EQUIPMENT_OPTIONS[3],
	asmrFocus: ASMR_FOCUS_OPTIONS[1],
	aiProvider: "CLAUDE",
	aiModelId: "claude-sonnet-4-20250514",
	dnaLocked: false,
};

// ─── CONTINUITY ANCHOR ───────────────────────────────────────────────────────

function buildContinuityAnchor(dna: AsmrAiDNA): string {
	return [
		`BUILDING: ${dna.building}`,
		`LOCATION: ${dna.location}`,
		`CLIMATE: ${dna.climate}`,
		`MATERIAL: ${dna.material}`,
		`PALETTE: ${dna.palette}`,
		`TEAM: ${dna.team}`,
		`WORKER_COUNT: ${dna.workerCount}`,
		`EQUIPMENT: ${dna.mainEquipment}`,
		`TIMELAPSE_SPEED: ${TIMELAPSE_SPEED_OPTIONS[dna.timelapseSpeed].multiplier}`,
	].join(" | ");
}

// ─── MMSS ─────────────────────────────────────────────────────────────────────

function mmss(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── SCENE PHASE DISTRIBUTION ────────────────────────────────────────────────

function buildScenePhases(dna: AsmrAiDNA): string {
	const scenes = dna.totalScenes;
	const ptScenes =
		dna.projectType === "restoration"
			? Object.keys(SCENE_TYPES.restoration)
			: Object.keys(SCENE_TYPES.construction);

	// Distribute phases proportionally across scenes
	const phases: string[] = [];
	for (let i = 0; i < scenes; i++) {
		const phaseIndex = Math.floor((i / scenes) * ptScenes.length);
		phases.push(ptScenes[Math.min(phaseIndex, ptScenes.length - 1)]);
	}
	return phases.map((p, i) => `  Scene ${i + 1}: ${p}`).join("\n");
}

// ─── AI PROMPT BUILDER ────────────────────────────────────────────────────────

function buildAIUserPrompt(dna: AsmrAiDNA): string {
	const speedInfo = TIMELAPSE_SPEED_OPTIONS[dna.timelapseSpeed];
	const anchor = buildContinuityAnchor(dna);
	const ptLabel = dna.projectType === "restoration" ? "Restoration" : "Construction";
	const totalSec = dna.totalMinutes * 60;

	return `Generate a ${dna.totalScenes}-scene ASMR timelapse ${ptLabel} video AI prompt bundle as JSON.

PROJECT DNA (LOCKED — every scene MUST reference these, never deviate):
${anchor}
PROJECT TYPE: ${ptLabel}
PROJECT NAME: ${dna.projectName || `${ptLabel} Timelapse`}
VISUAL STYLE: ${dna.visualStyle}

VIDEO SPECS:
- Total scenes: ${dna.totalScenes} (EXACTLY — no more, no less)
- Duration per scene: ${dna.secPerScene}s
- Total video: ${mmss(totalSec)}
- Timelapse speed: ${speedInfo.label} (${speedInfo.multiplier})
- Motion character: ${speedInfo.motionNote}

ADVANCED CONFIGURATION:
- Time of day progression: ${dna.timeOfDayProgression}
- Weather progression: ${dna.weatherProgression}
- Worker count: ${dna.workerCount}
- Main equipment: ${dna.mainEquipment}
- ASMR audio focus: ${dna.asmrFocus}
- Narrator: ${dna.narratorGender === "none" ? "No narration — pure ASMR" : `${dna.narratorGender} voice, style: ${dna.narratorStyle}`}
- Palette: ${dna.palette}
- Climate: ${dna.climate}

SUGGESTED SCENE PHASE DISTRIBUTION (${ptLabel}):
${buildScenePhases(dna)}

CRITICAL CONTINUITY RULES — EVERY SCENE MUST FOLLOW THESE:
1. Every scene (except scene 1) MUST start its deliverable.prompt with:
   "Continuing from scene [N-1] — [one sentence describing what was just shown in the previous scene, referencing the building's current state]..."
2. Building shape: the SAME building at different stages of completion — never change its architectural style or footprint
3. Location: IDENTICAL surroundings every scene — same trees, same horizon, same landscape features
4. Workers: same visible worker count, same general team appearance — never introduce new workers mid-video
5. Equipment: same equipment as specified in DNA — machines don't teleport or change type
6. Time of day: follow the progression specified — transitions must be gradual, not sudden
7. Camera: each scene should feel like a natural cut or dissolve from the previous — never jarring jumps
8. NO abrupt location changes — if camera angle changes, it's still the same site
9. ASMR continuity: same primary ambient sound established in scene 1 carries through

OUTPUT JSON STRUCTURE (STRICT):
{
  "schema": "aiVideoPrompt.v1",
  "tool": "asmr-timelapse-constructor",
  "projectType": "${dna.projectType}",
  "continuityAnchor": "${anchor}",
  "seo": {
    "title": "...",
    "description": "...",
    "tags": ["..."],
    "thumbnailPrompt": "..."
  },
  "scenes": [
    {
      "id": 1,
      "sceneNumber": "Scene 1",
      "phase": "...",
      "timeLabel": "0:00–${mmss(dna.secPerScene)}",
      "buildingState": "...",
      "deliverable": {
        "prompt": "...",
        "negativePrompt": "text overlay, watermark, logo, sudden location change, inconsistent building, different workers appearing, CGI artifacts, face distortion"
      }
    }
  ]
}

IMPORTANT LEAN JSON RULES:
- "seo" object exists ONLY ONCE at root level — NOT inside any scene
- scenes[] items contain ONLY: id, sceneNumber, phase, timeLabel, buildingState, deliverable
- "buildingState" = one sentence describing how complete the building looks at this scene
- deliverable.prompt MUST start with "Continuing from scene [N-1]..." for scenes 2 onward

SEO RULES (root level only):
- seo.title: YouTube-optimized title in Indonesian, 50–65 chars, strong hook, include key terms like "ASMR", "timelapse", "${ptLabel.toLowerCase()}", "${dna.building}"
- seo.description: Indonesian, minimum 900 chars, strong hook first 2 lines, project progress narrative, ASMR trigger description, 8-10 relevant hashtags at end
- seo.tags: EXACTLY 30 tags — mix of broad (asmr, timelapse, construction) + niche (${dna.building}, ${dna.material}) + long-tail Indonesian & English terms
- seo.thumbnailPrompt: detailed AI image generation prompt — specify: dramatic before/after composition OR peak construction moment, ${dna.palette} color palette, ${dna.visualStyle} style, dramatic lighting matching ${dna.timeOfDayProgression.split("→").pop()?.trim()}, 3-4 word text overlay suggestion like "TIMELAPSE [Year]" or "AMAZING BUILD"

Output ONLY valid JSON. No markdown fences, no explanation, no trailing commas.`;
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────

export default function useAsmrAiGenerator() {
	const { toast, show: showToast } = useToast();

	const [dna, setDnaState] = useState<AsmrAiDNA>(DEFAULT_AI_DNA);
	const [dnaLocked, setDnaLocked] = useState(false);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, AiSceneConfig>>({});
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [promptOutput, setPromptOutput] = useState(
		"🔒 Kunci DNA terlebih dahulu, lalu klik Generate All With AI."
	);
	const [isGeneratingAI, setIsGeneratingAI] = useState(false);
	const [seoPack, setSeoPack] = useState<SeoPack | null>(null);

	// ─── DNA SETTER ──────────────────────────────────────────────────────────────

	function setDna(updates: Partial<AsmrAiDNA>) {
		setDnaState((prev) => {
			const next = { ...prev, ...updates };
			if (
				updates.totalMinutes !== undefined ||
				updates.secPerScene !== undefined
			) {
				next.totalScenes = Math.max(
					2,
					Math.floor((next.totalMinutes * 60) / Math.max(1, next.secPerScene))
				);
			}
			return next;
		});
	}

	function lockDNA() {
		setDnaLocked(true);
		setDnaState((p) => ({ ...p, dnaLocked: true }));
		showToast(`🔒 DNA terkunci! ${dna.totalScenes} scene siap di-generate AI.`);
	}

	function unlockDNA() {
		setDnaLocked(false);
		setDnaState((p) => ({ ...p, dnaLocked: false }));
		setAllPrompts([]);
		setShowAllPrompts(false);
		setSeoPack(null);
		setPromptOutput("🔒 Kunci DNA terlebih dahulu, lalu klik Generate All With AI.");
		showToast("🔓 DNA dibuka untuk diedit.");
	}

	// ─── GENERATE ALL WITH AI ─────────────────────────────────────────────────────

	async function generateAllWithAI() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		setIsGeneratingAI(true);
		setSeoPack(null);
		setAllPrompts([]);

		try {
			const systemPrompt =
				"You are an expert ASMR construction timelapse director and AI video prompt engineer. " +
				"Your specialty is creating hyper-consistent timelapse sequences where continuity between scenes is perfect. " +
				"Output MUST be valid JSON only — no markdown fences, no trailing commas, no comments.";

			const userPrompt = buildAIUserPrompt(dna);

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: dna.aiProvider,
					modelId: dna.aiModelId,
					maxTokens: 14000,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "AI request failed");

			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as {
				scenes?: unknown[];
				seo?: SeoPack;
				continuityAnchor?: string;
			};

			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== dna.totalScenes) {
				throw new Error(
					`AI scenes tidak sesuai. Dapat ${bundle.scenes.length}, harus ${dna.totalScenes}`
				);
			}

			// Extract SEO pack
			if (bundle.seo) {
				setSeoPack(bundle.seo);
			}

			// Strip seo dari per-scene (cukup di level root)
			const { seo: _seo, ...bundleWithoutSeo } = bundle as Record<string, unknown>;

			const prompts = (bundle.scenes as unknown[]).map((scene) =>
				jsonStringify({ ...bundleWithoutSeo, scenes: [scene] })
			);

			const updated: Record<number, AiSceneConfig> = {};
			for (let s = 1; s <= dna.totalScenes; s++) {
				updated[s] = { id: s, generatedPrompt: prompts[s - 1] };
			}

			setSceneConfigs(updated);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setPromptOutput(prompts[0] ?? "");
			showToast(`🤖 AI: ${dna.totalScenes} prompt berhasil dibuat + SEO pack!`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unknown error";
			showToast(`⚠ ${msg}`);
		} finally {
			setIsGeneratingAI(false);
		}
	}

	// ─── COPY / DOWNLOAD ─────────────────────────────────────────────────────────

	function copyAll() {
		if (!allPrompts.length) return;
		navigator.clipboard.writeText(jsonBundleFromSceneJsonStrings(allPrompts));
		showToast(`📋 Semua ${dna.totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		if (!allPrompts.length) return;
		downloadJsonFile(
			`asmr-ai-timelapse-${Date.now()}.json`,
			jsonBundleFromSceneJsonStrings(allPrompts)
		);
		showToast("💾 JSON bundle didownload!");
	}

	function copySeoTitle() {
		if (!seoPack?.title) return;
		navigator.clipboard.writeText(seoPack.title);
		showToast("📋 Judul SEO tersalin!");
	}

	function copySeoDescription() {
		if (!seoPack?.description) return;
		navigator.clipboard.writeText(seoPack.description);
		showToast("📋 Deskripsi SEO tersalin!");
	}

	function copySeoTags() {
		if (!seoPack?.tags?.length) return;
		navigator.clipboard.writeText(seoPack.tags.join(", "));
		showToast("📋 Tags SEO tersalin!");
	}

	function copySeoThumbnailPrompt() {
		if (!seoPack?.thumbnailPrompt) return;
		navigator.clipboard.writeText(seoPack.thumbnailPrompt);
		showToast("📋 Prompt thumbnail tersalin!");
	}

	function downloadSeoPackJson() {
		if (!seoPack) return;
		downloadJsonFile(
			`seo-pack-asmr-ai-${Date.now()}.json`,
			JSON.stringify(
				{
					schema: "aiSeoPack.v1",
					tool: "asmr-timelapse-constructor",
					mode: "ai-generate",
					projectType: dna.projectType,
					building: dna.building,
					createdAt: new Date().toISOString(),
					seo: seoPack,
				},
				null,
				2
			)
		);
		showToast("💾 SEO pack .json didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		const text = [
			"SEO PACK (AI — ASMR Timelapse Constructor Mode 2)",
			`Building: ${dna.building} | Type: ${dna.projectType}`,
			"",
			"TITLE:",
			seoPack.title,
			"",
			"DESCRIPTION:",
			seoPack.description,
			"",
			"TAGS (30):",
			seoPack.tags.join(", "),
			"",
			"THUMBNAIL PROMPT:",
			seoPack.thumbnailPrompt,
		].join("\n");
		downloadTextFile(`seo-pack-asmr-ai-${Date.now()}.txt`, text);
		showToast("💾 SEO pack .txt didownload!");
	}

	// ─── COMPUTED ─────────────────────────────────────────────────────────────────

	const totalScenes = Math.max(
		2,
		Math.floor((dna.totalMinutes * 60) / Math.max(1, dna.secPerScene))
	);

	const progressPct =
		allPrompts.length > 0 ? Math.round((allPrompts.length / totalScenes) * 100) : 0;

	return {
		// DNA
		dna,
		setDna,
		dnaLocked,
		lockDNA,
		unlockDNA,

		// Generate
		isGeneratingAI,
		generateAllWithAI,

		// Output
		allPrompts,
		showAllPrompts,
		setShowAllPrompts,
		promptOutput,
		setPromptOutput,
		sceneConfigs,
		totalScenes,
		progressPct,
		copyAll,
		downloadAllJson,

		// SEO Pack
		seoPack,
		copySeoTitle,
		copySeoDescription,
		copySeoTags,
		copySeoThumbnailPrompt,
		downloadSeoPackJson,
		downloadSeoPackTxt,

		// Toast
		toast,
		showToast,
	};
}
