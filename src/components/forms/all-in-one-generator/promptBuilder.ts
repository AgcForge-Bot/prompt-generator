import type { AllInOneDNA, SceneConfig, SceneImageRef } from "./types";
import {
	VISUAL_STYLES,
	MODEL_GENDER_AGES,
	OUTFIT_OPTIONS,
	THEME_PROMPT_CONTEXT,
} from "./constants";

// ─── MMSS ─────────────────────────────────────────────────────────────────────

function mmss(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── DNA CONTEXT BLOCK ────────────────────────────────────────────────────────

function buildDnaContext(dna: AllInOneDNA): string {
	const vStyle = VISUAL_STYLES[dna.visualStyle];
	const themeCtx = THEME_PROMPT_CONTEXT[dna.theme];

	const modelBlock =
		dna.theme === "forest-build-primitive-craft"
			? `\nMODEL CHARACTER: ${MODEL_GENDER_AGES[dna.modelGenderAge].promptDesc}
OUTFIT: ${OUTFIT_OPTIONS.find((o) => o.value === dna.outfitKey)?.desc ?? dna.outfitKey}
CONSISTENCY RULE: Model must appear IDENTICAL across all scenes — same face, same outfit, same build.`
			: "";

	return `VIDEO TITLE: "${dna.videoTitle}"
VISUAL STYLE: ${dna.visualStyle.toUpperCase()} — ${vStyle.promptTag}
CORE STORYBOARD: ${dna.coreStoryboard}
${themeCtx}${modelBlock}`;
}

// ─── IMAGE DESCRIPTIONS ───────────────────────────────────────────────────────

function buildImageContext(imageRefs: SceneImageRef[]): string {
	const analyzed = imageRefs.filter(
		(img) => img.aiDescription && img.aiDescription.trim()
	);
	if (analyzed.length === 0) return "";
	return `\nVISUAL REFERENCE (from uploaded images):\n${analyzed
		.map((img, i) => `  Ref ${i + 1}: ${img.aiDescription}`)
		.join("\n")}`;
}

// ─── CONSISTENCY NOTE ─────────────────────────────────────────────────────────

function buildConsistencyNote(dna: AllInOneDNA, sceneNum: number, totalScenes: number): string {
	return `
📌 TECHNICAL CONSISTENCY (CRITICAL):
• This is scene ${sceneNum} of ${totalScenes} — maintain PERFECT visual continuity
• Same visual style: ${dna.visualStyle}
• Same location/setting as established in scene 1 (unless storyboard specifies change)
• NO CGI artifacts, NO impossible physics, photorealistic ONLY
• If images uploaded: use them as the PRIMARY visual reference anchor
• Aspect ratio: 16:9 or 9:16 (choose based on platform — YouTube=16:9, TikTok/Reels=9:16)
• Duration: exactly ${dna.secPerScene} seconds of action — no padding`;
}

// ─── SYSTEM PROMPT UNTUK AI GENERATE ─────────────────────────────────────────

export function buildAIGenerateSystemPrompt(dna: AllInOneDNA): string {
	const vStyle = VISUAL_STYLES[dna.visualStyle];
	return `You are a professional AI video prompt engineer specializing in ${dna.theme.replace(/-/g, " ")} content.
Your job is to write a single, detailed, ready-to-use video generation prompt for ONE scene.

REQUIREMENTS:
- Write ONE complete, self-contained video generation prompt (not a list, not JSON)
- The prompt must be optimized for: Kling AI, Runway Gen-3, Pika 2.0, Sora, VEO, Grok
- Length: 150-250 words, packed with visual detail
- Include: camera angle, movement, lighting, colors, atmosphere, action, sound design hint
- Visual style anchor: ${vStyle.promptTag}
- Start the prompt with the primary action/subject, not with "A video of..."
- End with a technical camera spec line

CRITICAL: Output ONLY the prompt text. No preamble, no explanation, no markdown.`;
}

export function buildAIGenerateUserPrompt(
	dna: AllInOneDNA,
	scene: SceneConfig,
	totalScenes: number
): string {
	const startSec = (scene.id - 1) * dna.secPerScene;
	const endSec = startSec + dna.secPerScene;
	const imageCtx = buildImageContext(scene.imageRefs);

	return `${buildDnaContext(dna)}

SCENE ${scene.id}/${totalScenes} [${mmss(startSec)}–${mmss(endSec)}]
SCENE STORYBOARD: ${scene.storyboard || "(no specific storyboard — use core storyboard context and create appropriate visual for this position in the video)"}
${imageCtx}
${buildConsistencyNote(dna, scene.id, totalScenes)}

Write the video generation prompt for this scene now:`;
}

// ─── LOCAL PROMPT BUILDER (fallback/manual mode tanpa AI) ────────────────────

export function buildLocalPrompt(
	dna: AllInOneDNA,
	scene: SceneConfig,
	totalScenes: number
): string {
	const vStyle = VISUAL_STYLES[dna.visualStyle];
	const startSec = (scene.id - 1) * dna.secPerScene;
	const endSec = startSec + dna.secPerScene;
	const imageCtx = buildImageContext(scene.imageRefs);
	const modelBlock =
		dna.theme === "forest-build-primitive-craft"
			? `\nMODEL: ${MODEL_GENDER_AGES[dna.modelGenderAge].promptDesc} | OUTFIT: ${OUTFIT_OPTIONS.find((o) => o.value === dna.outfitKey)?.desc ?? dna.outfitKey}`
			: "";

	return `═══════════════════════════════════════════════════════
🎬 SCENE ${scene.id} / ${totalScenes} | ${mmss(startSec)}–${mmss(endSec)} | ${dna.secPerScene}s
═══════════════════════════════════════════════════════

VIDEO: "${dna.videoTitle}"
THEME: ${dna.theme.replace(/-/g, " ").toUpperCase()}
VISUAL STYLE: ${dna.visualStyle.toUpperCase()} — ${vStyle.promptTag}
${modelBlock}

CORE STORYBOARD: ${dna.coreStoryboard}

SCENE ACTION: ${scene.storyboard || "Continue the visual narrative from the core storyboard. Maintain visual consistency with previous scenes."}
${imageCtx}
${THEME_PROMPT_CONTEXT[dna.theme]}
${buildConsistencyNote(dna, scene.id, totalScenes)}

CAMERA: [Specify angle based on scene content]
LIGHTING: [Specify lighting based on time of day and mood]
COLOR GRADE: ${vStyle.promptTag}

═══════════════════════════════════════════════════════`;
}

// ─── REMOTION CLAUDE CODE SCRIPT GENERATOR ───────────────────────────────────

export function buildRemotionClaudeCodeScript(
	dna: AllInOneDNA,
	prompts: string[]
): string {
	const sceneList = prompts
		.map((p, i) => `  Scene ${i + 1} (${dna.secPerScene}s):\n  "${p.substring(0, 100).replace(/"/g, "'")}..."`)
		.join("\n\n");

	return `#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ALL-IN-ONE VIDEO GENERATOR — Remotion + Claude Code
# Video: "${dna.videoTitle}"
# Theme: ${dna.theme} | Style: ${dna.visualStyle}
# Duration: ${dna.totalDurationSec}s | Scenes: ${dna.totalScenes} x ${dna.secPerScene}s
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# STEP 1: Install Remotion skill di Claude Code
# Run this in your terminal with Claude Code:
# npx skills add remotion dev skill

# STEP 2: Copy-paste prompt berikut ke terminal Claude Code:

/video Create a ${dna.totalDurationSec}-second video titled "${dna.videoTitle}" with ${dna.totalScenes} scenes.

VIDEO SPECS:
- Total duration: ${dna.totalDurationSec} seconds
- Scenes: ${dna.totalScenes} scenes, each ${dna.secPerScene} seconds
- Visual style: ${dna.visualStyle}
- Theme: ${dna.theme.replace(/-/g, " ")}
- Core concept: ${dna.coreStoryboard}

SCENE PROMPTS:
${sceneList}

Create a Remotion composition with:
1. Each scene as a separate Sequence component
2. Smooth transitions between scenes (crossfade or cut)
3. Text overlay for scene titles (optional)
4. Export as MP4 at 1920x1080 (or 1080x1920 for vertical)

# STEP 3: Review in Remotion Studio browser, then export MP4
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}
