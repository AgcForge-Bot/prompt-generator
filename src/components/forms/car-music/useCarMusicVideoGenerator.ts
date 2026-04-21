"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import {
	CAR_MOVIE_REFS,
	CAR_TRAILER_SETPIECES,
	OPTIONS,
	SCENE_TYPE_LABELS,
	TRAILER_BEAT_OPTIONS,
	TRAILER_CHARACTER_ROLES,
	TRAILER_EMOTION_BEATS,
	VISUAL_STYLE_LABELS,
} from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { AIProviderKey, CarMusicVideoGenerator, ClipModeKey, SceneConfig, SceneTypeKey, SeoPack, TabKey, TrailerCharacter, VisualStyleKey } from "./types";
import { getDefaultSceneConfig, getDefaultTypes, getSceneTypeLabel, rnd } from "./utils";
import {
	downloadBlobFile,
	downloadJsonFile,
	downloadTextFile,
	jsonBundleFromSceneJsonStrings,
	jsonStringify,
} from "@/lib/promptJson";
import { getDefaultModelId } from "@/lib/modelProviders";
import { parseJsonFromModelOutput } from "@/lib/aiJson";
import { buildZipBlob } from "@/lib/promptZip";

export default function useCarMusicVideoGenerator(): CarMusicVideoGenerator {
	const { toast, show: showToast } = useToast();

	const [clipMode, setClipModeState] = useState<ClipModeKey>("classic");
	const [filmRef, setFilmRef] = useState<string>(CAR_MOVIE_REFS[0] ?? "Car Movie");
	const [lastDropdownFilmRef, setLastDropdownFilmRef] = useState<string>(
		CAR_MOVIE_REFS[0] ?? "Car Movie",
	);
	const [hasPickedDropdownFilmRef, setHasPickedDropdownFilmRef] = useState(false);
	const [aiProvider, setAiProvider] = useState<AIProviderKey>("CLAUDE");
	const [aiModelId, setAiModelId] = useState<string>(getDefaultModelId("CLAUDE"));
	const [isGeneratingAI, setIsGeneratingAI] = useState(false);
	const [seoPack, setSeoPack] = useState<SeoPack | null>(null);

	const isFilmRefValid = clipMode !== "trailer" ? true : filmRef.trim().length > 0;

	function setFilmRefFromDropdown(next: string) {
		setFilmRef(next);
		setLastDropdownFilmRef(next);
		setHasPickedDropdownFilmRef(true);
	}

	function useDropdownFilmRef() {
		if (!hasPickedDropdownFilmRef || !lastDropdownFilmRef.trim()) {
			showToast("⚠ Pilih film dari dropdown dulu.");
			return;
		}
		setFilmRef(lastDropdownFilmRef);
		showToast("✓ Menggunakan film dari dropdown.");
	}

	const [trailerCharacters, setTrailerCharacters] = useState<TrailerCharacter[]>(() => [
		{
			name: "Ari Vance",
			role: "the driver",
			faceDescription:
				"male, late 20s, sharp jawline, short wavy dark hair, subtle scar on eyebrow, focused eyes",
			introSceneNumber: 2,
		},
		{
			name: "Naya Rios",
			role: "the strategist",
			faceDescription:
				"female, early 30s, sleek bob haircut, intense gaze, minimal makeup, confident expression",
			introSceneNumber: 3,
		},
		{
			name: "Raka Steel",
			role: "the rival",
			faceDescription:
				"male, early 30s, athletic build, stubble beard, piercing eyes, confident smirk",
			introSceneNumber: 4,
		},
	]);

	function updateTrailerCharacter(index: number, next: Partial<TrailerCharacter>) {
		setTrailerCharacters((prev) => prev.map((c, i) => (i === index ? { ...c, ...next } : c)));
	}

	function randomizeTrailerCharacters() {
		const first = ["Ari", "Raka", "Naya", "Dimas", "Tara", "Juno", "Kael", "Raya"];
		const last = ["Vance", "Rios", "Stone", "Kane", "Nova", "Drift", "Hale", "Sable"];
		const faces = [
			"male, late 20s, short messy hair, subtle freckles, intense eyes",
			"female, early 30s, long hair tied back, sharp cheekbones, calm gaze",
			"male, mid 30s, shaved head, stubble beard, hardened expression",
			"female, late 20s, pixie cut, bold eyebrows, determined eyes",
		];
		setTrailerCharacters((prev) =>
			prev.map((c, i) => ({
				...c,
				name: `${rnd(first)} ${rnd(last)}`,
				role: c.role || "the driver",
				faceDescription: rnd(faces),
				introSceneNumber: i + 2,
			})),
		);
		showToast("🎭 Karakter trailer di-randomize!");
	}

	function normalizeTrailerIntroScenes() {
		setTrailerCharacters((prev) => {
			const used = new Set<number>();
			const next = prev.map((c, i) => {
				const preferred = c.introSceneNumber ?? i + 2;
				let pick = Math.min(totalScenes, Math.max(1, preferred));
				while (used.has(pick)) {
					pick++;
					if (pick > totalScenes) pick = 1;
					if (used.size >= totalScenes) break;
				}
				used.add(pick);
				return { ...c, introSceneNumber: pick };
			});
			return next;
		});
		showToast("✅ Intro scene karakter dirapikan (unik).");
	}

	const tabs = useMemo(() => {
		if (clipMode === "trailer") {
			return [
				{ key: "trailer", label: "🎞️ Trailer" },
				{ key: "location", label: "📍 Lokasi" },
				{ key: "lighting", label: "💡 Lighting" },
				{ key: "camera", label: "🎬 Kamera" },
			] as { key: TabKey; label: string }[];
		}
		return [
			{ key: "cars", label: "🚗 Mobil" },
			{ key: "dj", label: "🎧 DJ" },
			{ key: "crowd", label: "🙌 Penonton" },
			{ key: "location", label: "📍 Lokasi" },
			{ key: "lighting", label: "💡 Lighting" },
			{ key: "props", label: "🔥 Props" },
			{ key: "camera", label: "🎬 Kamera" },
		] as { key: TabKey; label: string }[];
	}, [clipMode]);

	const [activeTab, setActiveTab] = useState<TabKey>("cars");
	const [totalMinutes, setTotalMinutes] = useState(2);
	const [secPerScene, setSecPerScene] = useState(10);
	const [visualStyle, setVisualStyle] = useState<VisualStyleKey>("semi-cinematic");
	const [currentScene, setCurrentScene] = useState(1);

	const totalScenes = Math.max(
		2,
		Math.floor((totalMinutes * 60) / Math.max(1, secPerScene)),
	);
	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultTypes(totalScenes),
	);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);
	const [randomGroups, setRandomGroups] = useState<Record<TabKey, boolean>>(() => ({
		cars: true,
		dj: true,
		crowd: true,
		trailer: true,
		location: true,
		lighting: true,
		props: true,
		camera: true,
	}));

	const [promptOutput, setPromptOutput] = useState(
		"Klik ⚡ Generate Prompt untuk membuat prompt scene ini...",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);

	function setClipMode(next: ClipModeKey) {
		setClipModeState(next);
		setAllPrompts([]);
		setShowAllPrompts(false);
		setSeoPack(null);
		setPromptOutput("Klik ⚡ Generate Prompt untuk membuat prompt scene ini...");
		setActiveTab(next === "trailer" ? "trailer" : "cars");
		showToast(`🎬 Mode: ${next}`);
	}

	function pickOption(options: readonly string[], prefers: string[]) {
		const lower = options.map((o) => o.toLowerCase());
		for (const p of prefers) {
			const idx = lower.findIndex((o) => o.includes(p.toLowerCase()));
			if (idx >= 0) return options[idx];
		}
		return options[0] ?? "";
	}

	function getVisualPreset(style: VisualStyleKey): Partial<SceneConfig> {
		if (style === "cinematic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["red imax", "8k"]),
				camGrade: pickOption(OPTIONS.camGrade, ["teal-orange", "bleach bypass"]),
				camLens: pickOption(OPTIONS.camLens, ["anamorphic", "50mm", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["epic blockbuster", "luxury glamour"]),
			};
		}
		if (style === "semi-cinematic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "red imax"]),
				camGrade: pickOption(OPTIONS.camGrade, ["blue shadow", "teal-orange"]),
				camLens: pickOption(OPTIONS.camLens, ["50mm", "wide-angle", "anamorphic"]),
				camMood: pickOption(OPTIONS.camMood, ["cool underground", "euphoric rave"]),
			};
		}
		if (style === "cinematic-realistic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "red imax"]),
				camGrade: pickOption(OPTIONS.camGrade, ["teal-orange", "blue shadow"]),
				camLens: pickOption(OPTIONS.camLens, ["50mm", "anamorphic", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["luxury glamour", "cool underground"]),
			};
		}
		if (style === "realistic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "unreal engine"]),
				camGrade: pickOption(OPTIONS.camGrade, ["desaturated gritty", "bleach bypass"]),
				camLens: pickOption(OPTIONS.camLens, ["50mm", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["documentary", "raw adrenaline"]),
			};
		}
		return {
			camQuality: pickOption(OPTIONS.camQuality, ["unreal engine", "8k"]),
			camGrade: pickOption(OPTIONS.camGrade, ["vivid", "teal-orange"]),
			camLens: pickOption(OPTIONS.camLens, ["macro", "telephoto", "anamorphic"]),
			camMood: pickOption(OPTIONS.camMood, ["epic blockbuster", "raw adrenaline"]),
		};
	}

	function getSceneConfig(sceneNum: number): SceneConfig {
		return sceneConfigs[sceneNum] ?? getDefaultSceneConfig();
	}

	function updateSceneConfig(sceneNum: number, updates: Partial<SceneConfig>) {
		setSceneConfigs((prev) => ({
			...prev,
			[sceneNum]: { ...getSceneConfig(sceneNum), ...updates },
		}));
	}

	function generatePromptFor(
		sceneNum: number,
		durOverride?: { totalScenes: number; secPerScene: number },
	) {
		const effectiveTotalScenes = durOverride?.totalScenes ?? totalScenes;
		const effectiveSecPerScene = durOverride?.secPerScene ?? secPerScene;
		const sceneType = sceneTypes[sceneNum] ?? "dj-party";
		const config = getSceneConfig(sceneNum);
		const promptObj = buildPrompt({
			clipMode,
			filmRef,
			trailerCharacters,
			sceneNum,
			totalScenes: effectiveTotalScenes,
			secPerScene: effectiveSecPerScene,
			sceneType,
			visualStyle,
			config,
		});
		const prompt = jsonStringify(promptObj);
		setPromptOutput(prompt);
		updateSceneConfig(sceneNum, { generatedPrompt: prompt });
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
		showToast(`✓ Prompt Scene ${currentScene} berhasil!`);
	}

	function nextScene() {
		const next = currentScene < totalScenes ? currentScene + 1 : 1;
		setCurrentScene(next);
		setTimeout(() => generatePromptFor(next), 50);
	}

	function copyPrompt() {
		if (!promptOutput.trim()) return;
		navigator.clipboard.writeText(promptOutput);
		showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
	}

	function generateAll() {
		const prompts: string[] = [];
		const updated: Record<number, SceneConfig> = { ...sceneConfigs };
		for (let s = 1; s <= totalScenes; s++) {
			const sceneType = sceneTypes[s] ?? "dj-party";
			const config = getSceneConfig(s);
			const promptObj = buildPrompt({
				clipMode,
				filmRef,
				trailerCharacters,
				sceneNum: s,
				totalScenes,
				secPerScene,
				sceneType,
				visualStyle,
				config,
			});
			const prompt = jsonStringify(promptObj);
			prompts.push(prompt);
			updated[s] = { ...config, generatedPrompt: prompt };
		}
		setSceneConfigs(updated);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${totalScenes} prompt berhasil di-generate!`);
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
		let prompts = allPrompts;
		if (!prompts.length) {
			prompts = [];
			const updated: Record<number, SceneConfig> = { ...sceneConfigs };
			for (let s = 1; s <= totalScenes; s++) {
				const sceneType = sceneTypes[s] ?? "dj-party";
				const config = getSceneConfig(s);
				const promptObj = buildPrompt({
					clipMode,
					filmRef,
					trailerCharacters,
					sceneNum: s,
					totalScenes,
					secPerScene,
					sceneType,
					visualStyle,
					config,
				});
				const prompt = jsonStringify(promptObj);
				prompts.push(prompt);
				updated[s] = { ...config, generatedPrompt: prompt };
			}
			setSceneConfigs(updated);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setPromptOutput(prompts[currentScene - 1] ?? "");
		}
		downloadJsonFile(
			`car-music-video-clip-${Date.now()}.json`,
			jsonBundleFromSceneJsonStrings(prompts),
		);
		showToast("💾 JSON bundle berhasil didownload!");
	}

	async function generateAllWithAI() {
		if (clipMode !== "trailer") {
			showToast("⚠ Fitur AI ini khusus untuk Mode Trailer.");
			return;
		}
		if (!filmRef.trim()) {
			showToast("⚠ Referensi film wajib diisi untuk Mode Trailer.");
			return;
		}
		setIsGeneratingAI(true);
		try {
			const systemPrompt =
				"You are an expert film trailer director and AI video prompt engineer. Output MUST be valid JSON only — no markdown fences, no trailing commas, no comments.";

			const userPrompt = `Generate a ${totalScenes}-scene car film trailer AI video prompt bundle as JSON (schema: aiVideoPrompt.v1).

FILM REFERENCE: "${filmRef}"
- Inspired by the film's pacing, tension, and visual language — but use ORIGINAL characters and story. Do NOT copy actor names, real faces, or exact film plot.

CHARACTERS (use exactly as described — do not recreate any real actor likeness):
${trailerCharacters
					.map(
						(c, i) =>
							`${i + 1}. ${c.name} | role: ${c.role} | face: ${c.faceDescription} | introScene: ${c.introSceneNumber ?? i + 2}`,
					)
					.join("\n")}

SPECS:
- Total scenes: ${totalScenes} (EXACTLY — no more, no less)
- Duration per scene: ${secPerScene}s
- Visual style: ${visualStyle}
- Genre: car film trailer / opening — NO DJ, NO nightclub, NO rave crowd

TRAILER PACING (distribute scenes across these beats in order):
establish → inciting_incident → character_intro(s) → rising_action → setpiece → emotional_beat → climax → closing_shot

CHARACTER INTRO RULE: Insert "character-intro" beat (cinematic close-up + opening credit style) at EXACTLY the introScene number specified per character. Each character gets exactly ONE intro scene.

SCENE CONTINUITY RULES (critical for AI video coherence):
1. Every scene (except scene 1) MUST start deliverable.prompt with: "Continuing from scene [N-1] — [one sentence describing what was just shown]..."
2. Location and environment: once established, stays consistent unless a new location is explicitly required by the beat
3. Characters: same face, same outfit throughout — never change appearance mid-trailer
4. Camera: end frame of each scene should feel like a natural match cut to the next

OPTIONAL BEATS: ${TRAILER_BEAT_OPTIONS.join(", ")}
SETPIECE IDEAS: ${CAR_TRAILER_SETPIECES.join(" | ")}
EMOTION IDEAS: ${TRAILER_EMOTION_BEATS.join(", ")}
ROLE IDEAS: ${TRAILER_CHARACTER_ROLES.join(", ")}

OUTPUT JSON STRUCTURE:
{
  "schema": "aiVideoPrompt.v1",
  "tool": "car-music-video-clip",
  "filmRef": "${filmRef}",
  "characters": [{ "name": "...", "role": "...", "faceDescription": "...", "introSceneNumber": 0 }],
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
      "beat": "establish",
      "time": { "startSec": 0, "endSec": ${secPerScene} },
      "deliverable": {
        "prompt": "...",
        "negativePrompt": "..."
      }
    }
  ]
}

IMPORTANT LEAN JSON RULES:
- "seo" object exists ONLY ONCE at root level — do NOT include seo inside any scenes[] item
- scenes[] items contain ONLY: id, sceneNumber, beat, time, deliverable
- No other fields inside scenes[] items

SEO RULES (root level only, generated ONCE):
- seo.title: original title inspired by "${filmRef}" but remixed — represents the full trailer story
- seo.description: Indonesian, min 900 chars, strong hook in first 2 lines, story beats summary, soft CTA, 5-10 hashtags
- seo.tags: exactly 30 tags (broad + niche + long-tail car/racing/film terms)
- seo.thumbnailPrompt: specific AI image prompt with composition, pose, lighting, color, background, 3-5 word text overlay — NO real actor names

Output only JSON. No explanation.`;

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: aiProvider,
					modelId: aiModelId,
					maxTokens: 12000,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.error || "AI request failed");
			}
			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as { scenes?: unknown[]; seo?: SeoPack };
			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== totalScenes) {
				throw new Error(`AI scenes tidak sesuai. Dapat ${bundle.scenes.length}, harus ${totalScenes}`);
			}
			if (bundle.seo) {
				setSeoPack(bundle.seo);
			}
			// ── Strip seo dari per-scene output ──
			// seo cukup sekali di seoPack section, tidak perlu diulang di setiap scene JSON
			const { seo: _seo, ...bundleWithoutSeo } = bundle as Record<string, unknown>;
			const prompts = (bundle.scenes as unknown[]).map((scene) =>
				jsonStringify({ ...bundleWithoutSeo, scenes: [scene] }),
			);
			const updated: Record<number, SceneConfig> = { ...sceneConfigs };
			for (let s = 1; s <= totalScenes; s++) {
				updated[s] = { ...getSceneConfig(s), generatedPrompt: prompts[s - 1] };
			}
			setSceneConfigs(updated);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setPromptOutput(prompts[currentScene - 1] ?? "");
			showToast(`🤖 AI: ${totalScenes} prompt trailer berhasil dibuat!`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unknown error";
			showToast(`⚠ ${msg}`);
		} finally {
			setIsGeneratingAI(false);
		}
	}

	async function downloadAllZip() {
		let prompts = allPrompts;
		if (!prompts.length) {
			prompts = [];
			const updated: Record<number, SceneConfig> = { ...sceneConfigs };
			for (let s = 1; s <= totalScenes; s++) {
				const sceneType = sceneTypes[s] ?? "dj-party";
				const config = getSceneConfig(s);
				const promptObj = buildPrompt({
					clipMode,
					filmRef,
					trailerCharacters,
					sceneNum: s,
					totalScenes,
					secPerScene,
					sceneType,
					visualStyle,
					config,
				});
				const prompt = jsonStringify(promptObj);
				prompts.push(prompt);
				updated[s] = { ...config, generatedPrompt: prompt };
			}
			setSceneConfigs(updated);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setPromptOutput(prompts[currentScene - 1] ?? "");
		}

		const files = [
			{ path: "prompts.json", text: jsonBundleFromSceneJsonStrings(prompts) },
			...prompts.map((p, i) => ({
				path: `scenes/scene-${String(i + 1).padStart(2, "0")}.json`,
				text: p,
			})),
		];

		if (seoPack) {
			const payload = {
				schema: "aiSeoPack.v1",
				tool: "car-music-video-clip",
				clipMode,
				filmRef,
				createdAt: new Date().toISOString(),
				seo: seoPack,
			};
			const text =
				`SEO PACK (AI)\n` +
				`Tool: car-music-video-clip\n` +
				`Mode: ${clipMode}\n` +
				`Film Ref: ${filmRef}\n` +
				`\n` +
				`TITLE:\n${seoPack.title}\n\n` +
				`DESCRIPTION:\n${seoPack.description}\n\n` +
				`TAGS (30):\n${seoPack.tags.join(", ")}\n\n` +
				`THUMBNAIL PROMPT:\n${seoPack.thumbnailPrompt}\n`;
			files.push({ path: "seo-pack.json", text: JSON.stringify(payload, null, 2) });
			files.push({ path: "seo-pack.txt", text });
		}

		const blob = await buildZipBlob(files);
		downloadBlobFile(`car-music-video-clip-${Date.now()}.zip`, blob);
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
		const payload = {
			schema: "aiSeoPack.v1",
			tool: "car-music-video-clip",
			clipMode,
			filmRef,
			createdAt: new Date().toISOString(),
			seo: seoPack,
		};
		downloadJsonFile(
			`seo-pack-car-music-video-clip-${Date.now()}.json`,
			JSON.stringify(payload, null, 2),
		);
		showToast("💾 SEO pack .json berhasil didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		const text =
			`SEO PACK (AI)\n` +
			`Tool: car-music-video-clip\n` +
			`Mode: ${clipMode}\n` +
			`Film Ref: ${filmRef}\n` +
			`\n` +
			`TITLE:\n${seoPack.title}\n\n` +
			`DESCRIPTION:\n${seoPack.description}\n\n` +
			`TAGS (30):\n${seoPack.tags.join(", ")}\n\n` +
			`THUMBNAIL PROMPT:\n${seoPack.thumbnailPrompt}\n`;
		downloadTextFile(`seo-pack-car-music-video-clip-${Date.now()}.txt`, text);
		showToast("💾 SEO pack .txt berhasil didownload!");
	}

	function randomizeCurrentScene() {
		const updates: Partial<SceneConfig> = {};
		if (clipMode === "trailer") {
			if (randomGroups.trailer) {
				updates.trailerBeat = rnd(TRAILER_BEAT_OPTIONS);
				updates.trailerSetpiece = rnd(CAR_TRAILER_SETPIECES);
				updates.trailerEmotion = rnd(TRAILER_EMOTION_BEATS);
				updates.trailerFocusCharacter =
					rnd(trailerCharacters).name || rnd(TRAILER_CHARACTER_ROLES);
				const c = rnd(trailerCharacters);
				updates.trailerCreditText = `${c.name || "Ari Vance"} — ${c.role || rnd(TRAILER_CHARACTER_ROLES)}`;
			}
		} else if (randomGroups.cars) {
			updates.carHero = rnd(OPTIONS.carHero);
			updates.carSecondary = rnd(OPTIONS.carSecondary);
			updates.carAction = rnd(OPTIONS.carAction);
			updates.carDetail = rnd(OPTIONS.carDetail);
			updates.carColor = rnd(OPTIONS.carColor);
			updates.carCount = rnd(OPTIONS.carCount);
		}
		if (clipMode !== "trailer" && randomGroups.dj) {
			updates.djType = rnd(OPTIONS.djType);
			updates.djSetup = rnd(OPTIONS.djSetup);
			updates.djAction = rnd(OPTIONS.djAction);
			updates.djOutfit = rnd(OPTIONS.djOutfit);
			updates.djFx = rnd(OPTIONS.djFx);
			updates.djSound = rnd(OPTIONS.djSound);
		}
		if (clipMode !== "trailer" && randomGroups.crowd) {
			updates.crowdMix = rnd(OPTIONS.crowdMix);
			updates.crowdEnergy = rnd(OPTIONS.crowdEnergy);
			updates.crowdAction = rnd(OPTIONS.crowdAction);
			updates.crowdFashion = rnd(OPTIONS.crowdFashion);
			updates.crowdDensity = rnd(OPTIONS.crowdDensity);
			updates.crowdMoment = rnd(OPTIONS.crowdMoment);
		}
		if (randomGroups.location) {
			updates.locMain = rnd(OPTIONS.locMain);
			updates.locTime = rnd(OPTIONS.locTime);
			updates.locPalette = rnd(OPTIONS.locPalette);
			updates.locAtmo = rnd(OPTIONS.locAtmo);
		}
		if (randomGroups.lighting) {
			updates.lightMain = rnd(OPTIONS.lightMain);
			updates.lightFx = rnd(OPTIONS.lightFx);
			updates.lightColor = rnd(OPTIONS.lightColor);
			updates.lightShadow = rnd(OPTIONS.lightShadow);
		}
		if (clipMode !== "trailer" && randomGroups.props) {
			updates.propFire = rnd(OPTIONS.propFire);
			updates.propSmoke = rnd(OPTIONS.propSmoke);
			updates.propAnimal = rnd(OPTIONS.propAnimal);
			updates.propDeco = rnd(OPTIONS.propDeco);
			updates.propChar = rnd(OPTIONS.propChar);
			updates.propSfx = rnd(OPTIONS.propSfx);
		}
		if (randomGroups.camera) {
			updates.camAngle = rnd(OPTIONS.camAngle);
			updates.camMove = rnd(OPTIONS.camMove);
			updates.camMood = rnd(OPTIONS.camMood);
			updates.camQuality = rnd(OPTIONS.camQuality);
			updates.camGrade = rnd(OPTIONS.camGrade);
			updates.camLens = rnd(OPTIONS.camLens);
		}
		updateSceneConfig(currentScene, updates);
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function randomSceneType() {
		if (clipMode === "trailer") {
			showToast("🎴 Mode Trailer tidak memakai Scene Type (pakai Trailer Beat).");
			return;
		}
		const keys = Object.keys(SCENE_TYPE_LABELS) as SceneTypeKey[];
		const pick = rnd(keys);
		setSceneTypes((prev) => ({ ...prev, [currentScene]: pick }));
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎴 Tipe adegan: ${SCENE_TYPE_LABELS[pick]}`);
	}

	function randomAllScenes() {
		const keys = Object.keys(SCENE_TYPE_LABELS) as SceneTypeKey[];
		const nextTypes: Record<number, SceneTypeKey> = {};
		const nextConfigs: Record<number, SceneConfig> = {};
		for (let s = 1; s <= totalScenes; s++) {
			nextTypes[s] = Math.random() > 0.4 ? rnd(keys) : keys[s % keys.length];
			const base = getDefaultSceneConfig();
			const updates: Partial<SceneConfig> = {};
			if (clipMode === "trailer") {
				if (randomGroups.trailer) {
					updates.trailerBeat = rnd(TRAILER_BEAT_OPTIONS);
					updates.trailerSetpiece = rnd(CAR_TRAILER_SETPIECES);
					updates.trailerEmotion = rnd(TRAILER_EMOTION_BEATS);
					updates.trailerFocusCharacter =
						rnd(trailerCharacters).name || rnd(TRAILER_CHARACTER_ROLES);
				}
			} else {
				if (randomGroups.cars) {
					updates.carHero = rnd(OPTIONS.carHero);
					updates.carSecondary = rnd(OPTIONS.carSecondary);
					updates.carAction = rnd(OPTIONS.carAction);
					updates.carDetail = rnd(OPTIONS.carDetail);
					updates.carColor = rnd(OPTIONS.carColor);
					updates.carCount = rnd(OPTIONS.carCount);
				}
				if (randomGroups.dj) {
					updates.djType = rnd(OPTIONS.djType);
					updates.djSetup = rnd(OPTIONS.djSetup);
					updates.djAction = rnd(OPTIONS.djAction);
					updates.djOutfit = rnd(OPTIONS.djOutfit);
					updates.djFx = rnd(OPTIONS.djFx);
					updates.djSound = rnd(OPTIONS.djSound);
				}
				if (randomGroups.crowd) {
					updates.crowdMix = rnd(OPTIONS.crowdMix);
					updates.crowdEnergy = rnd(OPTIONS.crowdEnergy);
					updates.crowdAction = rnd(OPTIONS.crowdAction);
					updates.crowdFashion = rnd(OPTIONS.crowdFashion);
					updates.crowdDensity = rnd(OPTIONS.crowdDensity);
					updates.crowdMoment = rnd(OPTIONS.crowdMoment);
				}
			}
			if (randomGroups.location) {
				updates.locMain = rnd(OPTIONS.locMain);
				updates.locTime = rnd(OPTIONS.locTime);
				updates.locPalette = rnd(OPTIONS.locPalette);
				updates.locAtmo = rnd(OPTIONS.locAtmo);
			}
			if (randomGroups.lighting) {
				updates.lightMain = rnd(OPTIONS.lightMain);
				updates.lightFx = rnd(OPTIONS.lightFx);
				updates.lightColor = rnd(OPTIONS.lightColor);
				updates.lightShadow = rnd(OPTIONS.lightShadow);
			}
			if (clipMode !== "trailer" && randomGroups.props) {
				updates.propFire = rnd(OPTIONS.propFire);
				updates.propSmoke = rnd(OPTIONS.propSmoke);
				updates.propAnimal = rnd(OPTIONS.propAnimal);
				updates.propDeco = rnd(OPTIONS.propDeco);
				updates.propChar = rnd(OPTIONS.propChar);
				updates.propSfx = rnd(OPTIONS.propSfx);
			}
			if (randomGroups.camera) {
				updates.camAngle = rnd(OPTIONS.camAngle);
				updates.camMove = rnd(OPTIONS.camMove);
				updates.camMood = rnd(OPTIONS.camMood);
				updates.camQuality = rnd(OPTIONS.camQuality);
				updates.camGrade = rnd(OPTIONS.camGrade);
				updates.camLens = rnd(OPTIONS.camLens);
			}
			nextConfigs[s] = { ...base, ...updates };
		}
		setSceneTypes(nextTypes);
		setSceneConfigs(nextConfigs);
		showToast(`🎰 Semua ${totalScenes} scene di-randomize!`);
		setTimeout(() => generateAll(), 50);
	}

	function onDurationChange(min: number, sec: number) {
		const safeMin = Math.max(1, Math.floor(min));
		const safeSec = Math.max(1, Math.floor(sec));
		const nextTotalScenes = Math.max(
			2,
			Math.floor((safeMin * 60) / Math.max(1, safeSec)),
		);

		setTotalMinutes(safeMin);
		setSecPerScene(safeSec);
		setCurrentScene(1);
		setSceneTypes(getDefaultTypes(nextTotalScenes));
		setAllPrompts([]);
		setShowAllPrompts(false);
		setSeoPack(null);
		setTimeout(
			() =>
				generatePromptFor(1, {
					totalScenes: nextTotalScenes,
					secPerScene: safeSec,
				}),
			50,
		);
		showToast(
			`⏱ Durasi update: ${safeMin} menit · ${safeSec}s/scene = ${nextTotalScenes} scene`,
		);
	}

	function setVisualStyleSafe(next: VisualStyleKey) {
		setVisualStyle(next);
		const preset = getVisualPreset(next);
		setSceneConfigs((prev) => {
			const nextMap: Record<number, SceneConfig> = { ...prev };
			for (let s = 1; s <= totalScenes; s++) {
				const base = nextMap[s] ?? getDefaultSceneConfig();
				nextMap[s] = { ...base, ...preset };
			}
			return nextMap;
		});
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎞️ Visual style: ${VISUAL_STYLE_LABELS[next]}`);
	}

	function setCurrentSceneSafe(sceneNum: number) {
		const safe = Math.min(totalScenes, Math.max(1, sceneNum));
		setCurrentScene(safe);
		setTimeout(() => generatePromptFor(safe), 50);
	}

	function setSceneTypeForScene(sceneNum: number, next: SceneTypeKey) {
		setSceneTypes((prev) => ({ ...prev, [sceneNum]: next }));
		setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	const scType = sceneTypes[currentScene] ?? "dj-party";
	const scTypeLabel = getSceneTypeLabel(scType);
	const visualStyleLabel = VISUAL_STYLE_LABELS[visualStyle] ?? visualStyle;

	return {
		tabs,
		activeTab,
		setActiveTab,

		totalMinutes,
		secPerScene,
		totalScenes,
		onDurationChange,

		visualStyle,
		visualStyleLabel,
		setVisualStyleSafe,

		clipMode,
		setClipMode,
		filmRef,
		setFilmRef,
		aiProvider,
		setFilmRefFromDropdown,
		useDropdownFilmRef,
		isFilmRefValid,
		aiModelId,
		setAiProvider,
		setAiModelId,
		isGeneratingAI,
		trailerCharacters,
		updateTrailerCharacter,
		randomizeTrailerCharacters,
		normalizeTrailerIntroScenes,

		currentScene,
		setCurrentSceneSafe,

		sceneTypes,
		setSceneTypeForScene,
		scType,
		scTypeLabel,

		randomGroups,
		setRandomGroups,

		sceneConfigs,
		getSceneConfig,
		updateSceneConfig,

		promptOutput,
		allPrompts,
		showAllPrompts,
		setShowAllPrompts,

		seoPack,
		copySeoTitle,
		copySeoDescription,
		copySeoTags,
		copySeoThumbnailPrompt,
		downloadSeoPackJson,
		downloadSeoPackTxt,

		generatePrompt,
		nextScene,
		copyPrompt,
		copyAll,
		downloadAllJson,
		downloadAllZip,
		generateAllWithAI,
		generateAll,

		randomizeCurrentScene,
		randomAllScenes,
		randomSceneType,

		toast,
	};
}
