"use client";

import { useState } from "react";
import type { ProjectDNA, SceneConfig, ImageRef, ScenePhaseKey, SceneTypeKey, ProjectDNATab, SeoPack } from './types'
import {
	CAM_ANGLES,
	CAM_MOODS,
	CAM_MOVES,
	CRAFT_ACTIVITIES,
	SOUND_AMBIENTS,
	SOUND_PRIMARIES,
} from "@/components/forms/forest-build/constants";
import { buildScenePrompt } from "./promptBuilder";
import { computePhases } from "./sceneGenerator";
import { downloadJsonFile, downloadTextFile, jsonBundleFromSceneJsonStrings, jsonStringify } from "@/lib/promptJson";
import { parseJsonFromModelOutput } from "@/lib/aiJson";

// ─── STORY ARC BEAT BUILDER ──────────────────────────────────────────────────
// Generates per-scene beat descriptions with shelter progress and TOD
// so AI gets concrete instructions for every single scene

type StoryBeat = {
	startSec: number
	endSec: number
	beat: string
	shelterStatus: string
	timeOfDay: string
}

function buildStoryArcBeats(
	totalScenes: number,
	secPerScene: number,
	intensity: string,
): StoryBeat[] {
	const beats: StoryBeat[] = []

	// Story arc proportions (scene counts per phase)
	const phaseRatios = {
		teaser: 0.04,
		establish: 0.07,
		journey: 0.14,
		arrive: 0.05,
		plan: 0.06,
		gather: 0.09,
		build_early: 0.14,
		build_mid: 0.12,
		build_late: 0.09,
		challenge: intensity === "intense" ? 0.08 : intensity === "balanced" ? 0.05 : 0.03,
		recovery: intensity === "intense" ? 0.05 : 0.03,
		complete: 0.05,
		living: 0.10,
		reflection: 0.04,
		closing: 0.03,
	}

	// Normalize ratios to sum to 1
	const total = Object.values(phaseRatios).reduce((a, b) => a + b, 0)
	const normalized: Record<string, number> = {}
	for (const [k, v] of Object.entries(phaseRatios)) normalized[k] = v / total

	// Calculate scene counts per phase
	const phaseCounts: Record<string, number> = {}
	let allocated = 0
	const phaseKeys = Object.keys(normalized)
	phaseKeys.forEach((key, i) => {
		if (i < phaseKeys.length - 1) {
			phaseCounts[key] = Math.max(1, Math.round(normalized[key] * totalScenes))
			allocated += phaseCounts[key]
		} else {
			phaseCounts[key] = Math.max(1, totalScenes - allocated)
		}
	})

	// Shelter progress: only grows during build phases
	const buildPhases = ["build_early", "build_mid", "build_late", "complete"]
	let buildScenesSoFar = 0
	const totalBuildScenes = buildPhases.reduce((a, k) => a + (phaseCounts[k] ?? 0), 0)

	// Phase beat templates
	const beatTemplates: Record<string, (idx: number, total: number) => { beat: string; tod: string }> = {
		teaser: (i, t) => ({ beat: `SCENE 1 — TEASER MONTAGE: Rapid emotional flash-cuts from the most gripping moments later in this film. Show: a glimpse of the completed shelter with warm light inside, a moment of extreme weather threatening the structure, the protagonist's face in a moment of raw exhaustion then quiet triumph. No context — pure visual tension to hook the viewer.`, tod: "afternoon" }),
		establish: (i, t) => ({ beat: `ESTABLISH WORLD: Wide drone shot reveals the vast ${i === 0 ? "wilderness" : "remote terrain"}. Protagonist enters frame — small against immense landscape. Camera slowly pushes in to reveal face: determined, focused. This is where survival begins.`, tod: "morning" }),
		journey: (i, t) => ({ beat: `JOURNEY (${i + 1}/${t}): Protagonist moving through terrain${i % 3 === 0 ? " — drone aerial follows from above, showing scale of journey" : i % 3 === 1 ? " — side tracking shot, landscape scrolling past" : " — close on feet and hands, effort visible"}. Environment becoming more isolated with each step.`, tod: i < t / 2 ? "morning" : "noon" }),
		arrive: (i, t) => ({ beat: `ARRIVAL: Protagonist stops, surveys an area carefully. Crouches to test soil, looks up at trees, assesses terrain. Eyes making the decision before hands move. The build site has been chosen.`, tod: "afternoon" }),
		plan: (i, t) => ({ beat: `PLANNING: Protagonist studies the environment, mentally mapping the shelter layout. ${i === 0 ? "Hands sketch rough plan in dirt or on paper" : "Materials nearby examined and sorted by type"}. Deliberate, experienced, no wasted movements.`, tod: "afternoon" }),
		gather: (i, t) => ({ beat: `GATHERING (${i + 1}/${t}): ${i % 2 === 0 ? "Protagonist selects and cuts materials from immediate environment — axe work, precise and rhythmic" : "Carrying gathered materials to build site — arms loaded, making multiple trips"}. Material pile at site grows visibly.`, tod: "noon" }),
		build_early: (i, t) => ({ beat: `CONSTRUCTION EARLY (${i + 1}/${t}): Foundation and base work. Ground being prepared or first structural elements placed. Shelter is 10-${Math.round(30 * ((i + 1) / t))}% complete — only base/outline visible. Hands working material precisely.`, tod: "noon" }),
		build_mid: (i, t) => ({ beat: `CONSTRUCTION MID (${i + 1}/${t}): Walls rising. Structure becoming recognizable. ${Math.round(30 + 35 * ((i + 1) / t))}% complete — walls at ${i < t / 2 ? "waist" : "chest"} height, no roof yet. Physical effort visible — sweat, focused expression.`, tod: i < t / 2 ? "noon" : "afternoon" }),
		build_late: (i, t) => ({ beat: `CONSTRUCTION LATE (${i + 1}/${t}): Roof being installed. Structure ${Math.round(65 + 25 * ((i + 1) / t))}% complete — walls done, roof framing or covering underway. Shelter taking final shape. End of this phase it will be structurally complete.`, tod: "afternoon" }),
		challenge: (i, t) => ({ beat: `CHALLENGE${i === 0 ? " BEGINS" : " CONTINUES"}: Nature pushes back — ${intensity === "intense" ? "severe weather or structural failure threatens everything built so far" : "a setback forces a pause and adaptation"}. Protagonist does not give up. Determination in every movement. Challenge must be overcome before building can resume.`, tod: "afternoon" }),
		recovery: (i, t) => ({ beat: `RECOVERY: The challenge is overcome. Protagonist assesses damage, adapts, and resumes work. Stronger for the setback. Camera lingers on the moment of decision to continue — quiet determination more powerful than any speech.`, tod: "afternoon" }),
		complete: (i, t) => ({ beat: `COMPLETION MOMENT: Final element placed — door hung, last piece secured. Protagonist steps back. Shelter is 100% structurally complete. A long beat of silence. The look on their face says everything that voice cannot.`, tod: "afternoon" }),
		living: (i, t) => ({ beat: `LIVING (${i + 1}/${t}): ${i === 0 ? "First fire lit inside the completed shelter — warmth spreading through the space, protagonist's face in firelight" : i < t / 2 ? "Hunting, fishing, or foraging in surrounding environment — skill and patience on display" : "Cooking and eating — food prepared over fire, every sensory detail rich and satisfying"}. Shelter complete in background.`, tod: i < t / 2 ? "afternoon" : "night" }),
		reflection: (i, t) => ({ beat: `REFLECTION: Protagonist sits at shelter entrance, watching the natural world at golden hour. Not thinking, just being. The journey from nothing to this moment visible in the weathered face, the worn hands resting in lap.`, tod: "afternoon" }),
		closing: (i, t) => ({ beat: `CLOSING: Wide shot — shelter small but perfect in vast wilderness. Slow pullback. Film-style credits rolling. Ambient sound only. Fade to black. The shelter will stand after the person is gone — something made, something real.`, tod: "morning" }),
	}

	let sceneId = 1
	for (const phase of phaseKeys) {
		const count = phaseCounts[phase] ?? 1
		for (let i = 0; i < count; i++) {
			const startSec = (sceneId - 1) * secPerScene
			const endSec = startSec + secPerScene
			const template = beatTemplates[phase]
			const { beat, tod } = template(i, count)

			// Calculate shelter progress for this scene
			let shelterPct = 0
			if (phase === "teaser" || phase === "establish" || phase === "journey" || phase === "arrive" || phase === "plan" || phase === "gather") {
				shelterPct = 0
			} else if (buildPhases.includes(phase)) {
				buildScenesSoFar++
				shelterPct = Math.min(99, Math.round((buildScenesSoFar / totalBuildScenes) * 100))
			} else if (phase === "complete") {
				shelterPct = 100
			} else {
				shelterPct = 100
			}

			const shelterStatus = shelterPct === 0
				? "Not started — bare ground, materials gathered nearby"
				: shelterPct < 15
					? `${shelterPct}% — excavation/preparation only, no walls yet`
					: shelterPct < 35
						? `${shelterPct}% — foundation and base, first elements in place`
						: shelterPct < 60
							? `${shelterPct}% — walls rising, open to sky, no roof yet`
							: shelterPct < 80
								? `${shelterPct}% — walls complete, roof being installed`
								: shelterPct < 100
									? `${shelterPct}% — structurally complete, interior being finished`
									: "100% COMPLETE — fully built and inhabited"

			beats.push({
				startSec,
				endSec,
				beat: `[Scene ${sceneId}] ${beat}`,
				shelterStatus,
				timeOfDay: tod,
			})
			sceneId++
		}
	}

	return beats
}

export default function useForestBuildPromptState({
	currentPhase,
	currentScene,
	dna,
	dnaLocked,
	dnaTab,
	globalImages,
	scenes,
	secPerScene,
	setCurrentPhase,
	setCurrentScene,
	setScenes,
	showToast,
	totalScenes,
	updateScene,
}: {
	currentPhase: ScenePhaseKey;
	currentScene: number;
	dna: ProjectDNA;
	dnaLocked: boolean;
	dnaTab: ProjectDNATab;
	globalImages: ImageRef[];
	scenes: SceneConfig[];
	secPerScene: number;
	setCurrentPhase: (k: ScenePhaseKey) => void;
	setCurrentScene: (id: number) => void;
	setScenes: React.Dispatch<React.SetStateAction<SceneConfig[]>>;
	showToast: (msg: string) => void;
	totalScenes: number;
	updateScene: (id: number, updates: Partial<SceneConfig>) => void;
}) {
	const [promptOutput, setPromptOutput] = useState(
		"🔒 Kunci Project DNA terlebih dahulu, lalu klik ⚡ Generate.",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [isGeneratingAI, setIsGeneratingAI] = useState(false);
	const [seoPack, setSeoPack] = useState<SeoPack | null>(null);

	function generatePromptFor(sceneId: number) {
		if (!dnaLocked) {
			setPromptOutput("🔒 Kunci Project DNA terlebih dahulu!");
			return;
		}
		if (dna.storyMode === "ai-film") {
			showToast("🤖 Mode 2 adalah AI-only. Gunakan Generate All With AI.");
			return;
		}
		setSeoPack(null);
		const sc = scenes.find((s) => s.id === sceneId);
		if (!sc) return;
		const promptObj = buildScenePrompt(
			sc,
			dna,
			globalImages,
			totalScenes,
			secPerScene,
		);
		const prompt = jsonStringify(promptObj);
		setPromptOutput(prompt);
		updateScene(sceneId, { generatedPrompt: prompt });
		showToast(`✓ Prompt Scene ${sceneId} berhasil!`);
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
	}

	function generateAll() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		if (dna.storyMode === "ai-film") {
			showToast("🤖 Mode 2 adalah AI-only. Gunakan Generate All With AI.");
			return;
		}
		setSeoPack(null);
		const prompts = scenes.map((sc) =>
			jsonStringify(buildScenePrompt(sc, dna, globalImages, totalScenes, secPerScene)),
		);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		const updated = scenes.map((sc, i) => ({
			...sc,
			generatedPrompt: prompts[i],
		}));
		setScenes(updated);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${totalScenes} prompt berhasil di-generate!`);
	}

	async function generateAllWithAI() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		if (dna.storyMode !== "ai-film") {
			showToast("⚠ Mode 2 (AI) belum dipilih.");
			return;
		}
		setIsGeneratingAI(true);
		setSeoPack(null);
		try {
			const movieTitle = dna.storyMovieRefTitle || "Survival Movie";
			const movieStory = dna.storyMovieRefStory || "";
			const castCount =
				dna.storyCastCountMode === "manual"
					? Math.max(1, Math.min(6, dna.storyCastCount))
					: 0;
			const mainGender = dna.storyGenderMode === "manual" ? dna.modelGender : "auto";

			// ── Build story arc beats proportional to totalScenes ──
			const totalDurSec = totalScenes * secPerScene;
			const arcBeats = buildStoryArcBeats(totalScenes, secPerScene, dna.storyIntensity);

			// ── Visual world lock — injected verbatim into every scene prompt ──
			const WORLD_LOCK = [
				`LOCATION (IMMUTABLE): ${dna.location}`,
				`CLIMATE (IMMUTABLE): ${dna.climate}`,
				`COLOR PALETTE (IMMUTABLE): ${dna.colorPalette}`,
				`BACKGROUND (IMMUTABLE): The same trees, rocks, terrain features, and light conditions remain consistent. Do NOT introduce new locations or teleport the scene.`,
				`SHELTER STATE: Shown ONLY at the construction progress level specified for this scene. Never more complete, never less complete.`,
			].join("\n");

			// ── Character lock ──
			const characterAnchor = dna.storyGenderMode === "manual"
				? `Main character: ${dna.modelGender} — ${dna.characterAge}, ${dna.characterFace}, ${dna.characterHair}, ${dna.characterBuild}. Outfit (UNCHANGING): ${dna.characterOutfit}. Gear: ${dna.characterGear}.`
				: `Main character: gender chosen by AI. Must be consistent across ALL scenes — same face, same build, same outfit throughout.`;

			const systemPrompt = `You are an expert short film director and AI video prompt engineer specializing in survival craft documentaries.
You write scene-by-scene prompts where each scene is a direct VISUAL continuation of the previous one.
Output MUST be valid JSON with no markdown fences, no trailing commas, no comments.
Every scene prompt you write must make a single 10-second AI video clip that flows seamlessly from the previous clip.`;

			const userPrompt = `Generate a ${totalScenes}-scene AI video prompt bundle as JSON (schema: aiVideoPrompt.v1) for a survival short film.

══════════════════════════════════════════════
FILM REFERENCE (inspire the story arc only):
Title: "${movieTitle}"
Storyline: ${movieStory || "(use your best survival story arc)"}
IMPORTANT: Do NOT copy film title, character names, or actor likenesses. Create original characters and a remixed survival story inspired by the above.
══════════════════════════════════════════════

WORLD LOCK — Every scene.deliverable.prompt MUST include these verbatim anchors:
${WORLD_LOCK}

CHARACTER ANCHOR — Lock across all scenes:
${characterAnchor}
${dna.hasPet ? `Pet companion: ${dna.petType} — appears consistently near main character.` : "No pet."}

SHELTER BUILD PROGRESSION:
- Shelter type: ${dna.shelterType}
- Build material: ${dna.buildMaterial}
- The shelter must appear at EXACTLY the construction stage specified per scene beat below.
- Dimensions when complete: ${dna.shelterDimension}
- Exterior when complete: ${dna.shelterExterior}
- Interior when complete: ${dna.shelterInterior}

FILM STYLE (apply to every scene):
- Visual style: ${dna.visualStyle} — ${dna.filmStyle}
- Color grade: ${dna.colorPalette}
- Soundscape: ${dna.soundscape}
- NO text overlays, NO watermarks, NO CGI artifacts
- Photorealistic, handheld documentary aesthetic
- Natural motion — no slow motion unless dramatically called for

CAST RULES:
- Cast count: ${dna.storyCastCountMode === "manual" ? `exactly ${castCount} characters` : "1 to 4 characters, chosen by you"}
- Main character gender: ${mainGender === "auto" ? "your choice (must stay consistent)" : dna.modelGender}
- All characters must be ORIGINAL with detailed face descriptions (not based on any real actors)

STORY INTENSITY: ${dna.storyIntensity}
${dna.storyIntensity === "relaxing"
					? "- Focus on peaceful craft, minimal conflict, healing ASMR mood. Any setbacks are minor and quickly resolved."
					: dna.storyIntensity === "balanced"
						? "- Include 1-2 meaningful setbacks with clear recovery. Tension rises and falls naturally."
						: "- Include 3+ obstacles and setbacks. Survival feels genuinely at stake. But story stays coherent and resolves."
				}

══════════════════════════════════════════════
SCENE-BY-SCENE STORY ARC (${totalScenes} scenes, ${secPerScene}s each, ${totalDurSec}s total):
${arcBeats.map((b, i) =>
					`Scene ${i + 1} [${b.startSec}s-${b.endSec}s]: ${b.beat} | Shelter: ${b.shelterStatus} | TOD: ${b.timeOfDay}`
				).join("\n")}
══════════════════════════════════════════════

CRITICAL CONTINUITY RULES (apply to EVERY scene prompt):
1. VISUAL BRIDGE: Every scene (except scene 1) MUST start its prompt with: "Continuing directly from scene [N-1], [brief 1-sentence description of what was just shown]..."
2. LOCATION STABILITY: The background environment does NOT change between scenes unless a scene beat explicitly says "move to new location". Same trees, same rocks, same light quality (within time-of-day).
3. SHELTER CONTINUITY: The shelter shows ONLY the construction stage listed for that scene. Do not show it more or less complete.
4. CHARACTER CONTINUITY: Same person, same face, same clothes, same gear in every scene. Clothes may accumulate dirt/sweat but never change.
5. CAMERA CONTINUITY: Match cuts — end frame of each scene should feel like a natural continuation of the start of the next. No jarring teleportation.
6. NO JUMP CUTS IN LOCATION: If the character is at the build site, they stay there until a travel scene. No sudden new environments.

EACH SCENE'S deliverable.prompt MUST include:
- Visual Bridge sentence (except scene 1)
- Character physical description (brief, consistent)
- Exact shelter construction state
- Specific action happening (not vague — describe exactly what hands are doing, what is being built/done)
- Environmental anchor (location, weather, time of day — matching the beat)
- Camera description (angle, movement, lens feel)
- Sound description (ASMR-optimized, specific sounds)
- Negative prompt (avoid: CGI, teleportation, new locations, text overlay, different character appearance)

OUTPUT JSON STRUCTURE:
{
  "schema": "aiVideoPrompt.v1",
  "tool": "forest-build-primitive-craft",
  "storyMode": "ai-film",
  "movieRef": "${movieTitle}",
  "characters": [
    { "id": "char1", "name": "...", "role": "protagonist", "gender": "...", "age": "...", "faceDescription": "...", "outfit": "...", "gear": "..." }
  ],
  "worldLock": {
    "location": "${dna.location}",
    "climate": "${dna.climate}",
    "colorPalette": "${dna.colorPalette}",
    "shelterType": "${dna.shelterType}",
    "buildMaterial": "${dna.buildMaterial}"
  },
  "seo": {
    "title": "...",
    "description": "...",
    "tags": ["...", "..."],
    "thumbnailPrompt": "..."
  },
  "scenes": [
    {
      "id": 1,
      "sceneNumber": "Scene 1",
      "beat": "...",
      "time": { "startSec": 0, "endSec": ${secPerScene} },
      "timeOfDay": "...",
      "shelterProgressPct": 0,
      "deliverable": {
        "prompt": "...",
        "negativePrompt": "..."
      }
    }
  ]
}

IMPORTANT — LEAN JSON RULES:
- "seo" object hanya ada SEKALI di root level. JANGAN masukkan "seo" ke dalam setiap item scenes[].
- Setiap item scenes[] hanya boleh berisi: id, sceneNumber, beat, time, timeOfDay, shelterProgressPct, deliverable.
- Tidak ada field lain di dalam scenes[] selain yang disebutkan di atas.
- Ini penting untuk efisiensi token — seo sudah ditangani terpisah di UI.

SEO RULES:
- seo.title: Original title inspired by "${movieTitle}" but completely remixed. Must represent the full story. No film name copying.
- seo.description: Indonesian, min 900 chars, strong hook in first 2 lines, story summary, soft CTA, 5-10 hashtags.
- seo.tags: Exactly 30 tags. Mix of: broad survival terms, niche craft terms, location-specific, emotion-specific, long-tail search phrases.
- seo.thumbnailPrompt: Highly specific AI image prompt. Include: composition, subject pose, expression, lighting direction, color, background, style, 3-5 word overlay text suggestion. NO real actor names.

Output only the JSON object. No explanation. No markdown.`;

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: dna.storyAiProvider,
					modelId: dna.storyAiModelId,
					maxTokens: 12000,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "AI request failed");

			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as {
				scenes?: unknown[];
				seo?: SeoPack;
				characters?: unknown[];
				worldLock?: unknown;
			};
			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== totalScenes) {
				throw new Error(
					`AI scenes tidak sesuai. Dapat ${bundle.scenes.length}, harus ${totalScenes}`,
				);
			}

			if (bundle.seo) setSeoPack(bundle.seo);

			// ── Strip heavy fields from per-scene output ──
			// seo (title/desc/tags/thumbnail) cukup sekali di seoPack section,
			// tidak perlu diulang di setiap scene JSON → hemat token + lebih ringan
			const { seo: _seo, ...bundleWithoutSeo } = bundle as Record<string, unknown>

			const prompts = (bundle.scenes as unknown[]).map((scene) =>
				jsonStringify({ ...bundleWithoutSeo, scenes: [scene] }),
			);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setPromptOutput(prompts[currentScene - 1] ?? "");
			setScenes((prev) =>
				prev.map((s, i) => ({
					...s,
					generatedPrompt: prompts[i] ?? s.generatedPrompt,
				})),
			);
			showToast(`🤖 AI: ${totalScenes} prompt berhasil dibuat!`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unknown error";
			showToast(`⚠ ${msg}`);
		} finally {
			setIsGeneratingAI(false);
		}
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
		const payload = {
			schema: "aiSeoPack.v1",
			tool: "forest-build-primitive-craft",
			storyMode: dna.storyMode,
			movieRefTitle: dna.storyMovieRefTitle,
			createdAt: new Date().toISOString(),
			seo: seoPack,
		};
		downloadJsonFile(
			`seo-pack-forest-build-primitive-craft-${Date.now()}.json`,
			JSON.stringify(payload, null, 2),
		);
		showToast("💾 SEO pack .json berhasil didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		const text =
			`SEO PACK (AI)\n` +
			`Tool: forest-build-primitive-craft\n` +
			`Mode: ${dna.storyMode}\n` +
			`Movie Ref: ${dna.storyMovieRefTitle}\n` +
			`\n` +
			`TITLE:\n${seoPack.title}\n\n` +
			`DESCRIPTION:\n${seoPack.description}\n\n` +
			`TAGS (30):\n${seoPack.tags.join(", ")}\n\n` +
			`THUMBNAIL PROMPT:\n${seoPack.thumbnailPrompt}\n`;
		downloadTextFile(`seo-pack-forest-build-primitive-craft-${Date.now()}.txt`, text);
		showToast("💾 SEO pack .txt berhasil didownload!");
	}

	function copyPrompt() {
		if (!promptOutput.startsWith("🔒")) {
			navigator.clipboard.writeText(promptOutput);
			showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
		}
	}

	function copyAll() {
		if (!allPrompts.length) {
			generateAll();
			return;
		}
		navigator.clipboard.writeText(jsonBundleFromSceneJsonStrings(allPrompts));
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		let prompts = allPrompts;
		if (!prompts.length) {
			prompts = scenes.map((sc) =>
				jsonStringify(
					buildScenePrompt(sc, dna, globalImages, totalScenes, secPerScene),
				),
			);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			const updated = scenes.map((sc, i) => ({
				...sc,
				generatedPrompt: prompts[i],
			}));
			setScenes(updated);
			setPromptOutput(prompts[currentScene - 1] ?? "");
		}
		downloadJsonFile(
			`forest-build-primitive-craft-${Date.now()}.json`,
			jsonBundleFromSceneJsonStrings(prompts),
		);
		showToast("💾 JSON bundle berhasil didownload!");
	}

	function nextScene() {
		if (!dnaLocked) return;
		const next = currentScene < totalScenes ? currentScene + 1 : 1;
		setCurrentScene(next);
		const sc2 = scenes.find((s) => s.id === next);
		if (sc2) setCurrentPhase(sc2.phase);
		generatePromptFor(next);
	}

	function randomCurrentScene() {
		function rnd<T>(arr: T[]): T {
			return arr[Math.floor(Math.random() * arr.length)];
		}
		updateScene(currentScene, {
			camAngle: rnd(CAM_ANGLES),
			camMove: rnd(CAM_MOVES),
			camMood: rnd(CAM_MOODS),
			activity: rnd(CRAFT_ACTIVITIES),
			soundPrimary: rnd(SOUND_PRIMARIES),
			soundAmbient: rnd(SOUND_AMBIENTS),
		});
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function autoInjectEmotions() {
		const interval = Math.floor(totalScenes / 5);
		const emotionTypes: SceneTypeKey[] = [
			"emo-civilian",
			"emo-animal",
			"emo-wonder",
			"emo-rescue",
			"emo-cook",
		];
		setScenes((prev) =>
			prev.map((sc) => {
				if (sc.id % interval === 0 && sc.id < totalScenes) {
					const emoIdx = Math.floor(sc.id / interval) - 1;
					return {
						...sc,
						isEmotional: true,
						sceneType: emotionTypes[emoIdx % emotionTypes.length],
					};
				}
				return sc;
			}),
		);
		showToast(`⭐ Emotional moments di-inject otomatis!`);
	}

	const phases = dnaLocked ? computePhases(totalScenes) : [];
	const currentPhaseScenes = dnaLocked
		? scenes.filter((s) => s.phase === currentPhase)
		: [];
	const sc = dnaLocked
		? (scenes.find((s) => s.id === currentScene) ?? scenes[0])
		: null;
	const generatedCount = scenes.filter((s) => s.generatedPrompt).length;

	return {
		allPrompts,
		autoInjectEmotions,
		copyAll,
		copyPrompt,
		copySeoDescription,
		copySeoTags,
		copySeoThumbnailPrompt,
		copySeoTitle,
		downloadAllJson,
		downloadSeoPackJson,
		downloadSeoPackTxt,
		currentPhaseScenes,
		generateAll,
		generateAllWithAI,
		generatePrompt,
		generatePromptFor,
		generatedCount,
		isGeneratingAI,
		nextScene,
		phases,
		promptOutput,
		randomCurrentScene,
		sc,
		seoPack,
		setShowAllPrompts,
		showAllPrompts,
	};
}
