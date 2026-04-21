"use client";

import { useState, useCallback } from "react";
import { parseJsonFromModelOutput } from "@/lib/aiJson";
import {
	downloadBlobFile,
	downloadJsonFile,
	downloadTextFile,
	jsonStringify,
} from "@/lib/promptJson";
import { buildZipBlob } from "@/lib/promptZip";
import useToast from "@/components/forms/forest-build/useToast";
import {
	DEFAULT_AI_MODEL_ID,
	GENRE_CATEGORIES,
	MOVIE_REFS,
} from "./constants";
import type {
	AIProviderKey,
	CastCountMode,
	DialogLanguageKey,
	GenderKey,
	NarrationModeKey,
	SeoPack,
	ShortMovieConfig,
	StoryIntensityKey,
	VisualStyleKey,
	ShortMovieGeneratorConfig
} from "./types";

/// ─── DEFAULT CONFIG ───────────────────────────────────────────────────────────

function getDefaultConfig(): ShortMovieConfig {
	const defaultGenre = "drama" as const;
	const firstMovie = MOVIE_REFS[defaultGenre][0];
	return {
		genre: defaultGenre,
		movieRefTitle: firstMovie.title,
		movieRefStory: firstMovie.story,
		castCountMode: "auto",
		mainGender: "auto",
		storyIntensity: "balanced",
		narrationMode: "none",
		dialogLanguage: "English",
		totalMinutes: 10,
		secPerScene: 10,
		visualStyle: "cinematic-realistic",
		aiProvider: "CLAUDE",
		aiModelId: DEFAULT_AI_MODEL_ID["CLAUDE"],
	};
}

// ─── STORY ARC BEATS ─────────────────────────────────────────────────────────
// Build concrete per-scene beats so AI gets a clear storyboard blueprint

function buildShortMovieArcBeats(
	totalScenes: number,
	secPerScene: number,
	intensity: StoryIntensityKey,
	genre: string,
): { sceneId: number; startSec: number; endSec: number; beat: string; purpose: string }[] {
	// Phase ratios for short film (not trailer)
	const phases = [
		{ name: "teaser_hook", ratio: 0.03, purpose: "Emotional flash-cuts teaser montage — most gripping moments from the film" },
		{ name: "establish", ratio: 0.07, purpose: "Establish world, characters, and stakes — wide establishing shots" },
		{ name: "inciting", ratio: 0.07, purpose: "Inciting incident — the event that disrupts the protagonist's world" },
		{ name: "rising_action", ratio: 0.18, purpose: "Rising tension and conflict — protagonist faces growing challenges" },
		{ name: "midpoint_shift", ratio: 0.08, purpose: "Major shift or revelation — changes the direction of the story" },
		{ name: "complications", ratio: intensity === "intense" ? 0.18 : 0.13, purpose: "Complications and setbacks — the worst moments for protagonist" },
		{ name: "dark_moment", ratio: intensity === "light" ? 0.05 : 0.08, purpose: "Darkest moment — protagonist at lowest point before turning" },
		{ name: "climax", ratio: 0.12, purpose: "Climax — the decisive confrontation or turning point" },
		{ name: "resolution", ratio: 0.10, purpose: "Resolution — aftermath and emotional resolution of the conflict" },
		{ name: "closing", ratio: 0.04, purpose: "Closing credits scene — wide reflective shot, character at peace, credit style" },
	];

	// Genre-specific beat flavor
	const genreFlavor: Record<string, string> = {
		drama: "emotionally grounded, character-driven, naturalistic performance",
		romance: "warm color palette, intimate close-ups, soft lighting, emotional chemistry",
		thriller: "suspenseful pacing, tight close-ups, paranoia-inducing environment, high stakes",
		horror: "oppressive atmosphere, slow dread build-up, darkness and shadows, sudden reveals",
		action: "kinetic energy, wide dynamic shots, physical intensity, visceral movement",
		"sci-fi": "futuristic visual language, practical and digital elements, existential weight",
		comedy: "bright lighting, expressive reactions, comedic timing, warm ensemble energy",
		fantasy: "rich visual world-building, magical practical effects, wonder and discovery",
		mystery: "dim lighting, fragmented reveals, character obsession, puzzle-like structure",
		anime: "stylized motion, expressive character animation, emotional exaggeration, iconic visual moments",
	};

	// Normalize ratios
	const totalRatio = phases.reduce((a, p) => a + p.ratio, 0);
	let allocated = 0;
	const phaseCounts: { name: string; count: number; purpose: string }[] = [];
	phases.forEach((p, i) => {
		const count = i < phases.length - 1
			? Math.max(1, Math.round((p.ratio / totalRatio) * totalScenes))
			: Math.max(1, totalScenes - allocated);
		phaseCounts.push({ name: p.name, count, purpose: p.purpose });
		allocated += count;
	});

	// Build beats
	const beats: { sceneId: number; startSec: number; endSec: number; beat: string; purpose: string }[] = [];
	let sceneId = 1;
	const flavor = genreFlavor[genre] ?? genreFlavor.drama;

	for (const phase of phaseCounts) {
		for (let i = 0; i < phase.count; i++) {
			const startSec = (sceneId - 1) * secPerScene;
			const endSec = startSec + secPerScene;
			const isFirst = i === 0;
			const isLast = i === phase.count - 1;

			let beat = `[${phase.name.toUpperCase()} ${i + 1}/${phase.count}] ${phase.purpose}`;
			if (phase.name === "teaser_hook") {
				beat = `SCENE 1 — TEASER MONTAGE: Rapid emotional flash-cuts from the most gripping moments later in this film. NO context given — pure visual tension and emotion to hook the viewer immediately. Genre visual style: ${flavor}.`;
			} else if (phase.name === "closing") {
				beat = `FINAL SCENE — CLOSING CREDITS: Wide, slow, reflective shot. The protagonist in a moment of stillness — peace, loss, or quiet acceptance. Opening-credit style text can appear. Fade to black. Music swells softly. Genre feel: ${flavor}.`;
			} else {
				beat = `${phase.purpose}${isFirst ? " — scene opens this phase" : isLast ? " — scene closes this phase, sets up next" : " — deepens this phase"}. Genre visual approach: ${flavor}.`;
			}

			beats.push({ sceneId, startSec, endSec, beat, purpose: phase.purpose });
			sceneId++;
		}
	}

	return beats;
}

// ─── MAIN HOOK ───────────────────────────────────────────────────────────────

export default function useShortMovieGenerator(): ShortMovieGeneratorConfig {
	const { toast, show: showToast } = useToast();

	const [config, setConfig] = useState<ShortMovieConfig>(getDefaultConfig);
	const [isGenerating, setIsGenerating] = useState(false);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [seoPack, setSeoPack] = useState<SeoPack | null>(null);
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [currentScene, setCurrentScene] = useState(1);

	const totalScenes = Math.max(2, Math.floor((config.totalMinutes * 60) / Math.max(1, config.secPerScene)));

	// ── Config updaters ───────────────────────────────────────────────────────

	function updateConfig(updates: Partial<ShortMovieConfig>) {
		setConfig(prev => ({ ...prev, ...updates }));
	}

	function setGenre(genre: ShortMovieConfig["genre"]) {
		const movies = MOVIE_REFS[genre];
		const first = movies[0];
		updateConfig({
			genre,
			movieRefTitle: first.title,
			movieRefStory: first.story,
		});
	}

	function setMovieRef(title: string) {
		const movies = MOVIE_REFS[config.genre];
		const found = movies.find(m => m.title === title);
		if (found) {
			updateConfig({ movieRefTitle: found.title, movieRefStory: found.story });
		}
	}

	// Handle input manual — judul film di luar list, user isi sendiri
	// Story bisa diisi manual atau dikosongkan (AI akan generate berdasarkan judul)
	function setMovieRefManual(title: string, story?: string) {
		updateConfig({
			movieRefTitle: title,
			movieRefStory: story ?? config.movieRefStory,
		});
	}

	function setMovieStoryManual(story: string) {
		updateConfig({ movieRefStory: story });
	}

	function setAiProvider(provider: AIProviderKey) {
		updateConfig({ aiProvider: provider, aiModelId: DEFAULT_AI_MODEL_ID[provider] });
	}

	function setDuration(minutes: number, secPerScene: number) {
		updateConfig({ totalMinutes: minutes, secPerScene });
		setAllPrompts([]);
		setSeoPack(null);
		setShowAllPrompts(false);
		setCurrentScene(1);
	}

	// ── Main AI generation ───────────────────────────────────────────────────

	const generateAllWithAI = useCallback(async () => {
		setIsGenerating(true);
		setSeoPack(null);
		setAllPrompts([]);
		setShowAllPrompts(false);

		try {
			const { genre, movieRefTitle, movieRefStory, castCountMode, mainGender, storyIntensity, narrationMode, dialogLanguage, visualStyle, aiProvider, aiModelId } = config;
			const genreLabel = GENRE_CATEGORIES.find(g => g.key === genre)?.label ?? genre;
			const castCount = castCountMode === "auto" ? "1 to 4 (AI decides)" : castCountMode;
			const genderLabel = mainGender === "auto" ? "AI decides" : mainGender;
			const arcBeats = buildShortMovieArcBeats(totalScenes, config.secPerScene, storyIntensity, genre);
			const totalDurSec = totalScenes * config.secPerScene;

			// ── Build narration instruction block ──────────────────────────────
			const narrationBlock = narrationMode === "none"
				? `NARRATION / DIALOG MODE: PURE VISUAL
- No dialog, no voiceover, no subtitle text in any scene
- Story is told entirely through visuals: expression, body language, action, cinematography, and sound design
- deliverable.dialog field should be null or omitted in all scenes`

				: narrationMode === "subtitle"
					? `NARRATION / DIALOG MODE: SUBTITLE DIALOG (Language: ${dialogLanguage})
- User has REQUESTED on-screen subtitle dialog in ${dialogLanguage}
- HOWEVER: You are the director — use your judgment. Only add dialog when it feels natural and necessary
- ADD dialog when: the scene involves conversation, argument, confession, key revelation, or emotional exchange between characters
- SKIP dialog (leave dialog null) when: the scene is action, chase, horror tension, silent reflection, nature establishing shot, montage, or when silence is more powerful
- If this genre (${genreLabel}) or this specific scene type makes dialog unnatural (e.g. action setpiece, horror dread, visual montage), output dialog: null
- When dialog IS included: write it as natural ${dialogLanguage} dialogue — realistic, concise, character-specific. Max 2–3 lines per scene.
- Format in deliverable: "dialog": { "type": "subtitle", "language": "${dialogLanguage}", "lines": ["Character Name: line here", "..."] } OR "dialog": null`

					: `NARRATION / DIALOG MODE: VOICEOVER NARRATION (Language: ${dialogLanguage})
- User has REQUESTED off-screen voiceover narration in ${dialogLanguage}
- HOWEVER: You are the director — use your judgment. Only add voiceover when it genuinely enhances the scene
- ADD voiceover when: the scene benefits from internal monologue, poetic reflection, story narration, or contextual explanation that visual alone cannot convey
- SKIP voiceover (leave dialog null) when: the scene is kinetic action, intense horror, fast-paced chase, or when silence and natural sound is more powerful
- If this genre (${genreLabel}) tends to use silence for impact (horror, action, thriller), use voiceover sparingly or not at all
- When voiceover IS included: write natural ${dialogLanguage} narration — poetic, reflective, or story-advancing. Max 2 sentences per scene.
- Format in deliverable: "dialog": { "type": "voiceover", "language": "${dialogLanguage}", "speaker": "narrator OR character name", "lines": ["narration text here"] } OR "dialog": null`

			const systemPrompt = `You are an expert short film director, screenwriter, and AI video prompt engineer.
You write scene-by-scene AI video prompts for short films where EVERY scene is a seamless visual continuation of the previous.
Output MUST be valid JSON only — no markdown fences, no trailing commas, no code comments.
Your prompts are highly specific: they describe exactly what the camera sees, who is in frame, what they are doing, the lighting, and the sound.
You have full directorial discretion over dialog and narration — add it only when it enhances the scene, never when it feels forced.`;

			const userPrompt = `Generate a ${totalScenes}-scene SHORT FILM AI video prompt bundle as JSON.

══════════════════════════════════════════════
FILM REFERENCE (story arc inspiration only):
Genre: ${genreLabel}
Title: "${movieRefTitle}"
Story: ${movieRefStory}

CRITICAL: Do NOT copy the film title, character names, or any actor/actress likeness.
Create ORIGINAL characters with original names and face descriptions.
The story arc should be INSPIRED by and REMIX the reference — not a copy.
══════════════════════════════════════════════

CAST RULES:
- Total cast: ${castCount}
- Main character gender: ${genderLabel}
- Every character needs: original name, role, detailed face description (age, features, hair, expression), and outfit
- Characters must remain VISUALLY IDENTICAL across all scenes (same face, same clothes)

SPECS:
- Total scenes: ${totalScenes} (EXACTLY — output exactly this many scenes, no more, no less)
- Duration per scene: ${config.secPerScene}s
- Total film duration: ${totalDurSec}s (~${config.totalMinutes} minutes)
- Visual style: ${visualStyle}
- Story intensity: ${storyIntensity}
  ${storyIntensity === "light" ? "→ Minimal conflict, many beautiful and quiet moments, gentle pacing" : storyIntensity === "balanced" ? "→ 1-2 meaningful setbacks with clear resolution, rising and falling tension" : "→ Multiple obstacles, high stakes, dramatic reversals — but coherent and resolved"}

══════════════════════════════════════════════
NARRATION & DIALOG INSTRUCTIONS:
${narrationBlock}
══════════════════════════════════════════════

══════════════════════════════════════════════
SCENE-BY-SCENE STORY BLUEPRINT (${totalScenes} scenes × ${config.secPerScene}s = ${totalDurSec}s):
${arcBeats.map(b => `Scene ${b.sceneId} [${b.startSec}s→${b.endSec}s]: ${b.beat}`).join("\n")}
══════════════════════════════════════════════

ABSOLUTE SCENE CONTINUITY RULES (apply to every scene prompt):
1. VISUAL BRIDGE: Every scene from scene 2 onward MUST begin with: "Continuing directly from scene [N-1] — [one-sentence description of what was just shown and where we left off]..."
2. LOCATION LOCK: Background environment stays consistent within the same story location. Establish a location clearly in the first scene it appears. Never teleport without a travel/transition beat.
3. CHARACTER LOCK: Same face, same hair, same outfit throughout the entire film. Clothes may accumulate wear/dirt. Never change appearance.
4. TIME-OF-DAY LOCK: If a scene is at dusk, the next scene cannot suddenly be midday unless the beat explicitly calls for a time jump with a clear visual bridge.
5. CAMERA MATCH CUTS: End each scene's camera position in a way that cuts naturally to the next opening. No jarring jumps.
6. OBJECT CONTINUITY: If a character is holding something in scene N, they still have it in scene N+1 unless explicitly dropped/given away.
7. WEATHER/ATMOSPHERE CONSISTENCY: Rain doesn't stop between scenes without cause. Fog, sunlight, fire — all persist logically.
8. SHELTER/SET CONSISTENCY: Any interior or exterior location shown stays exactly the same in subsequent scenes in that location.
9. NO UNEXPLAINED JUMPS: Every major location change needs either a travel scene or a clear ellipsis indicated in the beat.
10. NARRATIVE COHERENCE: Each scene advances the story — even quiet scenes reveal character or deepen the emotional journey.

EACH deliverable.prompt MUST include ALL of these elements in ONE vivid paragraph:
- Visual bridge sentence (scene 2+)
- Exact camera angle and movement (e.g., "slow push-in medium close-up")
- Character(s) in frame with brief physical description lock
- Precise action — what are hands doing, what expression, what body language
- Location description — light quality, color palette, textures visible
- Sound design — what is heard (ambient, specific sounds, music cue if any)
- Emotional register — what does this scene FEEL like
- Negative prompt elements specific to this scene's risks

OUTPUT JSON STRUCTURE (strict):
{
  "schema": "aiVideoPrompt.v1",
  "tool": "short-movie",
  "genre": "${genre}",
  "movieRef": "${movieRefTitle}",
  "visualStyle": "${visualStyle}",
  "narrationMode": "${narrationMode}",
  "dialogLanguage": "${narrationMode !== "none" ? dialogLanguage : "none"}",
  "totalDurationSec": ${totalDurSec},
  "characters": [
    {
      "id": "char1",
      "name": "...",
      "role": "protagonist",
      "gender": "...",
      "age": "...",
      "faceDescription": "detailed face, hair, expression description",
      "outfit": "full outfit description that NEVER changes"
    }
  ],
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
      "beat": "teaser_hook",
      "phase": "...",
      "time": { "startSec": 0, "endSec": ${config.secPerScene} },
      "deliverable": {
        "prompt": "...",
        "negativePrompt": "...",
        "dialog": null
      }
    }
  ]
}

LEAN JSON RULES (critical for performance):
- "seo" exists ONLY ONCE at root — NEVER inside scenes[] items
- scenes[] items contain ONLY: id, sceneNumber, beat, phase, time, deliverable
- deliverable contains: prompt, negativePrompt, dialog (dialog is null OR a dialog object — never omitted)
- No redundant fields inside scenes[] items
- dialog field: always present in deliverable, either null or { type, language, lines } or { type, language, speaker, lines }

SEO PACK RULES (root level, generated once):
- seo.title: Original YouTube title INSPIRED by "${movieRefTitle}" — remixed, not copied. Must represent the entire film's story arc. SEO optimized.
- seo.description: Indonesian language, minimum 900 characters. First 2 lines = strong hook. Then story summary (no spoilers of the ending). Soft CTA to watch. 5-10 relevant hashtags.
- seo.tags: Exactly 30 tags. Mix: broad genre terms + niche short film terms + emotion keywords + character/setting specific + long-tail search phrases. All relevant to this specific film.
- seo.thumbnailPrompt: Highly specific AI image generation prompt. Include: exact composition (rule of thirds/centered), subject description with outfit, facial expression, lighting direction and quality, background/setting, color grade style, mood, 3-5 word text overlay suggestion. No real celebrity names.

Output only the JSON object. No explanation text outside the JSON.`;

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: aiProvider,
					modelId: aiModelId,
					maxTokens: 16000,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error ?? "AI request failed");

			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as {
				scenes?: unknown[];
				seo?: SeoPack;
				characters?: unknown[];
			};

			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== totalScenes) {
				throw new Error(`AI menghasilkan ${bundle.scenes.length} scene, tapi harus ${totalScenes}. Coba generate ulang.`);
			}

			if (bundle.seo) setSeoPack(bundle.seo);

			// Strip seo from per-scene output — seo cukup sekali di seoPack section
			const { seo: _seo, ...bundleWithoutSeo } = bundle as Record<string, unknown>;

			const prompts = (bundle.scenes as unknown[]).map(scene =>
				jsonStringify({ ...bundleWithoutSeo, scenes: [scene] }),
			);

			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setCurrentScene(1);
			showToast(`🎬 AI: ${totalScenes} scene short film berhasil dibuat!`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unknown error";
			showToast(`⚠ ${msg}`);
		} finally {
			setIsGenerating(false);
		}
	}, [config, totalScenes, showToast]);

	// ── Copy / Download ──────────────────────────────────────────────────────

	function copyPrompt() {
		const p = allPrompts[currentScene - 1];
		if (!p) return;
		navigator.clipboard.writeText(p);
		showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
	}

	function copyAll() {
		if (!allPrompts.length) return;
		navigator.clipboard.writeText(allPrompts.join("\n\n---\n\n"));
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		if (!allPrompts.length) return;
		downloadJsonFile(
			`short-movie-${config.genre}-${Date.now()}.json`,
			JSON.stringify({ prompts: allPrompts }, null, 2),
		);
		showToast("💾 JSON bundle berhasil didownload!");
	}

	async function downloadAllZip() {
		if (!allPrompts.length) return;
		const files = [
			{
				path: "prompts.json",
				text: JSON.stringify({ prompts: allPrompts }, null, 2),
			},
			...allPrompts.map((p, i) => ({
				path: `scenes/scene-${String(i + 1).padStart(2, "0")}.json`,
				text: p,
			})),
		];

		if (seoPack) {
			const payload = {
				schema: "aiSeoPack.v1",
				tool: "short-movie",
				genre: config.genre,
				movieRef: config.movieRefTitle,
				createdAt: new Date().toISOString(),
				seo: seoPack,
			};
			const text =
				`SEO PACK — Short Movie\n` +
				`Genre: ${config.genre}\n` +
				`Ref: ${config.movieRefTitle}\n` +
				`\n` +
				`TITLE:\n${seoPack.title}\n\n` +
				`DESCRIPTION:\n${seoPack.description}\n\n` +
				`TAGS (30):\n${seoPack.tags.join(", ")}\n\n` +
				`THUMBNAIL PROMPT:\n${seoPack.thumbnailPrompt}`;
			files.push({ path: "seo-pack.json", text: JSON.stringify(payload, null, 2) });
			files.push({ path: "seo-pack.txt", text });
		}

		const blob = await buildZipBlob(files);
		downloadBlobFile(`short-movie-${config.genre}-${Date.now()}.zip`, blob);
		showToast("💾 ZIP berhasil didownload!");
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
			`seo-pack-short-movie-${Date.now()}.json`,
			JSON.stringify({ schema: "aiSeoPack.v1", tool: "short-movie", genre: config.genre, movieRef: config.movieRefTitle, seo: seoPack }, null, 2),
		);
		showToast("💾 SEO pack .json berhasil didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		downloadTextFile(
			`seo-pack-short-movie-${Date.now()}.txt`,
			`SEO PACK — Short Movie\nGenre: ${config.genre}\nRef: ${config.movieRefTitle}\n\nTITLE:\n${seoPack.title}\n\nDESCRIPTION:\n${seoPack.description}\n\nTAGS (30):\n${seoPack.tags.join(", ")}\n\nTHUMBNAIL PROMPT:\n${seoPack.thumbnailPrompt}`,
		);
		showToast("💾 SEO pack .txt berhasil didownload!");
	}

	return {
		// Config
		config,
		updateConfig,
		setGenre,
		setMovieRef,
		setMovieRefManual,
		setMovieStoryManual,
		setAiProvider,
		setDuration,

		// Computed
		totalScenes,
		movieOptions: MOVIE_REFS[config.genre] ?? [],

		// Generation
		isGenerating,
		generateAllWithAI,

		// Output
		allPrompts,
		seoPack,
		showAllPrompts,
		setShowAllPrompts,
		currentScene,
		setCurrentScene,

		// Actions
		copyPrompt,
		copyAll,
		downloadAllJson,
		downloadAllZip,
		copySeoTitle,
		copySeoDescription,
		copySeoTags,
		copySeoThumbnailPrompt,
		downloadSeoPackJson,
		downloadSeoPackTxt,

		toast,
	};
}
