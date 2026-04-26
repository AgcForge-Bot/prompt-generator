import type { HistoricalCategoryKey, HistoricalReconConfig } from "./types";
import {
	HISTORICAL_ERAS,
	HISTORICAL_CATEGORIES,
	NARRATION_TONES,
	VISUAL_APPROACHES,
	COLOR_GRADE_OPTIONS,
	VISUAL_STYLE_LABELS,
	CONTENT_DEPTH_OPTIONS
} from "./constants";

export function mmss(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

export function buildSceneArc(
	totalScenes: number,
	secPerScene: number,
	category: HistoricalCategoryKey,
	contentDepth: string,
): { sceneId: number; startSec: number; endSec: number; beat: string; purpose: string }[] {
	// Beat templates per kategori
	const beatsByCategory: Record<string, { beat: string; purpose: string; ratio: number }[]> = {
		"battle-tactics": [
			{ beat: "hook", purpose: "Gripping opening battle moment — blood and chaos, in medias res", ratio: 0.05 },
			{ beat: "context_setting", purpose: "Strategic context — who are these forces, what are the stakes", ratio: 0.10 },
			{ beat: "pre_battle_preparations", purpose: "Both sides preparing — troop formations, leader speeches, tension building", ratio: 0.12 },
			{ beat: "opening_clash", purpose: "First contact — the battle begins, initial tactical moves", ratio: 0.15 },
			{ beat: "turning_point", purpose: "Key tactical decision or surprise maneuver that changes the battle", ratio: 0.18 },
			{ beat: "climax_confrontation", purpose: "Decisive engagement — the battle's defining moment", ratio: 0.18 },
			{ beat: "aftermath", purpose: "Victory or defeat — immediate aftermath, casualties, commanders' reactions", ratio: 0.12 },
			{ beat: "historical_impact", purpose: "Long-term consequences of this battle on history", ratio: 0.10 },
		],
		"hero-biography": [
			{ beat: "legend_hook", purpose: "Open with the hero's most famous or defining moment — backwards chronology hook", ratio: 0.06 },
			{ beat: "origins", purpose: "Early life and origins — where did this legendary figure come from", ratio: 0.10 },
			{ beat: "rise_to_power", purpose: "First major achievements and rise to prominence", ratio: 0.15 },
			{ beat: "defining_challenge", purpose: "The greatest challenge or enemy they faced", ratio: 0.15 },
			{ beat: "peak_achievement", purpose: "Their greatest triumph or moment of maximum power", ratio: 0.15 },
			{ beat: "inner_conflict", purpose: "Personal costs, flaws, moral dilemmas — humanizing dimension", ratio: 0.12 },
			{ beat: "decline_or_end", purpose: "The circumstances of their fall, death, or retirement", ratio: 0.15 },
			{ beat: "legacy", purpose: "Historical legacy — how this person changed the world", ratio: 0.12 },
		],
		"mystery-legend": [
			{ beat: "mystery_hook", purpose: "Open with the most compelling unsolved aspect — what is the mystery", ratio: 0.08 },
			{ beat: "discovery_moment", purpose: "When and how this mystery was first discovered or noticed", ratio: 0.10 },
			{ beat: "historical_origin", purpose: "Reconstruction of the ancient reality — what was this BEFORE it became a mystery", ratio: 0.15 },
			{ beat: "evidence_analysis", purpose: "Key evidence and clues — what we know and what we don't", ratio: 0.18 },
			{ beat: "competing_theories", purpose: "Main theories examined — from mainstream to controversial", ratio: 0.18 },
			{ beat: "latest_discovery", purpose: "Most recent research and what it reveals or overturns", ratio: 0.15 },
			{ beat: "verdict_impact", purpose: "Current best understanding and why it still matters today", ratio: 0.16 },
		],
		"ancient-engineering": [
			{ beat: "wonder_reveal", purpose: "Establish the magnificence of the engineering wonder — full reveal shot", ratio: 0.06 },
			{ beat: "historical_context", purpose: "Who built it, when, and why — political and social context", ratio: 0.10 },
			{ beat: "raw_challenge", purpose: "The engineering challenges — scale, materials, logistics", ratio: 0.14 },
			{ beat: "workforce_life", purpose: "Who were the builders — workers, slaves, craftsmen — their daily reality", ratio: 0.12 },
			{ beat: "construction_process", purpose: "Step-by-step reconstruction of the building process", ratio: 0.20 },
			{ beat: "innovation_highlight", purpose: "The specific innovations or techniques that made it possible", ratio: 0.15 },
			{ beat: "completion_impact", purpose: "When finished — what did it mean to the civilization", ratio: 0.12 },
			{ beat: "modern_mystery", purpose: "What still mystifies modern engineers about it", ratio: 0.11 },
		],
		"mythology-ancient": [
			{ beat: "mythological_hook", purpose: "Begin with the most dramatic or recognizable moment from the myth", ratio: 0.07 },
			{ beat: "divine_world_setting", purpose: "Establish the realm — Olympus, Asgard, Underworld — where this story unfolds", ratio: 0.12 },
			{ beat: "origin_or_conflict", purpose: "The core conflict or origin story that drives the myth", ratio: 0.15 },
			{ beat: "divine_journey", purpose: "The hero or deity's journey — trials and divine encounters", ratio: 0.18 },
			{ beat: "climactic_confrontation", purpose: "The mythological climax — battle, transformation, or revelation", ratio: 0.18 },
			{ beat: "resolution_meaning", purpose: "Resolution and its deeper meaning — what this myth teaches", ratio: 0.15 },
			{ beat: "cultural_legacy", purpose: "How this myth influenced culture, art, and thought throughout history", ratio: 0.15 },
		],
	};

	// Generic beats untuk kategori tanpa template spesifik
	const genericBeats = [
		{ beat: "hook", purpose: "Powerful opening — most compelling or visually striking moment", ratio: 0.06 },
		{ beat: "context_world", purpose: "Establish the world and time period — environmental and cultural context", ratio: 0.10 },
		{ beat: "core_subject_intro", purpose: "Introduce the main subject — who, what, where, when", ratio: 0.12 },
		{ beat: "development_1", purpose: "First major development — early events or discovery", ratio: 0.14 },
		{ beat: "development_2", purpose: "Complication or deepening — conflicts, discoveries, turning points", ratio: 0.14 },
		{ beat: "peak_moment", purpose: "The climax or most significant event", ratio: 0.16 },
		{ beat: "consequence", purpose: "Immediate consequences and ripple effects", ratio: 0.14 },
		{ beat: "modern_relevance", purpose: "Why this still matters today — connection to present", ratio: 0.14 },
	];

	const template = beatsByCategory[category] ?? genericBeats;

	const scenes: { sceneId: number; startSec: number; endSec: number; beat: string; purpose: string }[] = [];
	let sceneIndex = 0;
	let cursor = 0;

	for (const beat of template) {
		const beatSceneCount = Math.max(1, Math.round(totalScenes * beat.ratio));
		for (let j = 0; j < beatSceneCount && sceneIndex < totalScenes; j++) {
			scenes.push({
				sceneId: sceneIndex + 1,
				startSec: cursor,
				endSec: cursor + secPerScene,
				beat: beat.beat,
				purpose: beat.purpose,
			});
			cursor += secPerScene;
			sceneIndex++;
		}
	}

	// Fill remaining scenes
	while (sceneIndex < totalScenes) {
		scenes.push({
			sceneId: sceneIndex + 1,
			startSec: cursor,
			endSec: cursor + secPerScene,
			beat: "conclusion",
			purpose: "Closing narration and final visual — lasting impression",
		});
		cursor += secPerScene;
		sceneIndex++;
	}

	return scenes;
}

export function buildSystemPrompt(): string {
	return `You are an award-winning historical documentary director, screenwriter, and AI video prompt engineer.
Your specialty: creating hyper-vivid, historically accurate video reconstruction prompts that educate AND entertain.
Your references: BBC's "Planet Earth", "Civilization" series, National Geographic documentaries,
"The Last Kingdom", "Vikings" TV series production quality, and Ken Burns documentary technique.

Your prompts achieve the "educated-and-entertained" effect by:
- Making ancient worlds feel ALIVE and immediate — not dusty museum pieces
- Every scene balances historical accuracy with cinematic drama
- Characters feel human even when recreating distant historical figures
- The camera work and atmosphere serve the story's educational purpose
- Every scene tells the viewer something specific and memorable

Output MUST be valid JSON only — no markdown fences, no trailing commas, no comments.`;
}

export function buildUserPrompt(config: HistoricalReconConfig, totalScenes: number): string {
	const cat = HISTORICAL_CATEGORIES[config.category];
	const era = HISTORICAL_ERAS[config.historicalEra];
	const narTone = NARRATION_TONES[config.narrationTone];
	const approach = VISUAL_APPROACHES[config.visualApproach];
	const styleLabel = VISUAL_STYLE_LABELS[config.visualStyle];
	const depthInfo = CONTENT_DEPTH_OPTIONS.find((d) => d.key === config.contentDepth);
	const colorGradeLabel = COLOR_GRADE_OPTIONS.find((c) => c.value === config.colorGrade)?.label ?? config.colorGrade;
	const totalSec = config.totalMinutes * 60;
	const arc = buildSceneArc(totalScenes, config.secPerScene, config.category, config.contentDepth);

	const narrationSpec = config.includeNarration
		? `NARRATION: Include narration voiceover
Tone: ${narTone.label} — ${narTone.desc}
Voice direction: ${narTone.voiceNote}
Language: ${config.narrationLanguage}
Instructions: Add narration when it enhances the scene. Format as "narration": { "lines": ["..."], "tone": "..." } or "narration": null if silence is more powerful.`
		: `NARRATION: No narration — pure visual documentary. Let images tell the story. "narration": null for all scenes.`;

	return `Generate a ${totalScenes}-scene HISTORICAL DOCUMENTARY RECONSTRUCTION AI video prompt bundle as JSON.

══════════════════════════════════════════════
DOCUMENTARY BRIEF:
Category: ${cat.label} (${cat.icon})
Civilization/Subject: ${config.civilization}
Topic/Title: "${config.topicTitle || `${config.civilization} — ${cat.label}`}"
Historical Era: ${era.label} (${era.range})
Visual period notes: ${era.visualNote}

TOPIC DETAILS:
${config.topicDescription || `Create an authoritative documentary reconstruction of ${config.civilization} focusing on ${cat.label.toLowerCase()}. Explore the most significant and visually compelling aspects.`}

KEY HISTORICAL FACTS TO INCLUDE:
${config.keyFacts || "AI should include the most historically significant and verified facts about this topic."}

${config.controversialAngle ? `CONTROVERSIAL/MYSTERY ANGLE:\n${config.controversialAngle}` : ""}

══════════════════════════════════════════════
PRODUCTION SPECS:
- Total scenes: ${totalScenes} (EXACTLY ${totalScenes} — no more, no less)
- Duration per scene: ${config.secPerScene}s each
- Total video length: ${mmss(totalSec)}
- Platform: ${config.targetPlatform}
- Content depth: ${depthInfo?.label} — ${depthInfo?.desc}
- Scene note: ${depthInfo?.sceneNote}

VISUAL LANGUAGE:
- Visual style: ${styleLabel}
- Visual approach: ${approach.label} — ${approach.desc}
- Approach notes: ${approach.promptNote}
- Color grade: ${colorGradeLabel}
- Director note: ${cat.aiDirectorNote}

${narrationSpec}

══════════════════════════════════════════════
SCENE ARC (follow this dramatic structure — adapt and expand within each beat):
${arc.map((s) => `Scene ${s.sceneId} [${mmss(s.startSec)}–${mmss(s.endSec)}] BEAT: "${s.beat}" — ${s.purpose}`).join("\n")}

══════════════════════════════════════════════
HISTORICAL ACCURACY RULES:
1. Every visual element must be historically plausible for ${era.label} (${era.range})
2. Costumes, architecture, weapons, tools — all period-accurate for ${config.civilization}
3. Avoid obvious anachronisms — no modern elements unless intentional documentary bridge
4. Historical figures: describe their characteristics from historical records, not popular culture depictions
5. If speculative/reconstructed: write with "documentary reconstruction" confidence, not uncertainty

CINEMATIC CONTINUITY RULES (CRITICAL):
1. Every scene (except scene 1) MUST start its deliverable.prompt with: "Continuing from scene [N-1] — [one sentence describing what was just established]..."
2. Character consistency: if a specific figure is introduced, their description is LOCKED throughout all subsequent scenes
3. Location consistency: environments established in early scenes persist unless a new location is explicitly introduced
4. Time of day: progresses logically unless a clear cut to new day/time is signaled
5. Atmospheric continuity: color grade and visual mood transitions must be gradual and motivated
6. No jarring cuts: the end composition of scene N should cut naturally to opening of scene N+1

══════════════════════════════════════════════
OUTPUT JSON STRUCTURE (strict):
{
	"schema": "aiVideoPrompt.v1",
	"tool": "historical-reconstruction",
	"category": "${config.category}",
	"civilization": "${config.civilization}",
	"visualStyle": "${config.visualStyle}",
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
			"beat": "${arc[0]?.beat ?? "hook"}",
			"timeLabel": "0:00–${mmss(config.secPerScene)}",
			"historicalContext": "one sentence of historical context for this scene",
			"deliverable": {
				"prompt": "...",
				"narration": null,
				"negativePrompt": "modern elements, anachronisms, CGI artifacts, inconsistent period detail, wrong costumes, contemporary clothing"
			}
		}
	]
}

RULES:
- "seo" object ONLY at root level — NEVER inside any scene
- scenes[] items ONLY: id, sceneNumber, beat, timeLabel, historicalContext, deliverable
- "historicalContext" = one sentence of factual historical background for this specific scene
- deliverable.prompt: rich, specific, cinematic — minimum 120 words per scene
- deliverable.prompt for scenes 2+ MUST start with "Continuing from scene [N-1] — ..."
- Generate EXACTLY ${totalScenes} scenes

SEO RULES (root level, generated ONCE):
- seo.title: YouTube-SEO optimized title (50–65 chars), English preferred for international reach, include civilization name + compelling hook. Reference the style: "The Complete History of [subject]", "How [subject] Really Worked", "[Subject]: The Truth Behind...", "Inside [subject]: [compelling angle]"
- seo.description: ${config.narrationLanguage === "Indonesian" ? "Bahasa Indonesia" : "English"}, minimum 900 chars, documentary hook in first 2 lines, scene-by-scene journey summary, educational value proposition, 8–10 relevant hashtags including #history #documentary #[civilization] #ancienthistory etc
- seo.tags: EXACTLY 30 tags — broad (history, documentary, ancient history) + niche (${config.civilization.toLowerCase()}, ${config.category}) + long-tail (historical documentary youtube, ${config.civilization.toLowerCase()} history explained, ancient world reconstruction etc)
- seo.thumbnailPrompt: dramatic AI image generation prompt — most visually iconic moment from "${config.civilization}" topic, ${styleLabel} quality, ${colorGradeLabel} color palette, dramatic hero composition, bold 3-4 word text overlay suggestion (like "UNTOLD HISTORY", "RISE OF ROME", "SECRETS REVEALED"), NO real historical faces unless described generically

Output ONLY valid JSON. No markdown fences, no explanation, no trailing commas.`;
}
