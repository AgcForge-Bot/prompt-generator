"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import {
	OPTIONS,
	SCENE_TYPE_LABELS,
	TRAILER_BEAT_OPTIONS,
	TRAILER_CHARACTER_ROLES,
	TRAILER_EMOTION_BEATS,
	VISUAL_STYLE_LABELS,
	WAR_MOVIE_REFS,
	WAR_TRAILER_SETPIECES,
} from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { AIProviderKey, ClipModeKey, SceneConfig, SceneTypeKey, SeoPack, TabKey, TrailerCharacter, VisualStyleKey, WarMusicVideoGenerator } from "./types";
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

export default function useWarMusicVideoGenerator(): WarMusicVideoGenerator {
	const { toast, show: showToast } = useToast();

	const [clipMode, setClipModeState] = useState<ClipModeKey>("classic");
	const [filmRef, setFilmRef] = useState<string>(WAR_MOVIE_REFS[0] ?? "War Movie");
	const [lastDropdownFilmRef, setLastDropdownFilmRef] = useState<string>(
		WAR_MOVIE_REFS[0] ?? "War Movie",
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
			name: "Kael Draven",
			role: "the commander",
			faceDescription:
				"male, late 30s, stern eyes, short dark hair, weathered face, subtle facial scar",
			introSceneNumber: 2,
		},
		{
			name: "Raya Solenne",
			role: "the strategist",
			faceDescription:
				"female, early 30s, braided hair, sharp cheekbones, focused gaze, calm authority",
			introSceneNumber: 3,
		},
		{
			name: "Arden Vale",
			role: "the champion",
			faceDescription:
				"male, early 30s, rugged stubble, intense eyes, battle-worn expression",
			introSceneNumber: 4,
		},
	]);

	function updateTrailerCharacter(index: number, next: Partial<TrailerCharacter>) {
		setTrailerCharacters((prev) => prev.map((c, i) => (i === index ? { ...c, ...next } : c)));
	}

	function randomizeTrailerCharacters() {
		const first = ["Kael", "Arden", "Raya", "Sora", "Juno", "Dain", "Lyra", "Ronan"];
		const last = ["Draven", "Vale", "Storm", "Kane", "Ashford", "Blackwood", "Sable", "Varyn"];
		const faces = [
			"male, late 30s, stern gaze, short hair, weathered face",
			"female, early 30s, braided hair, focused eyes, calm authority",
			"male, early 30s, rugged stubble, intense eyes, battle-worn expression",
			"female, late 20s, sharp eyes, windswept hair, determined expression",
		];
		setTrailerCharacters((prev) =>
			prev.map((c, i) => ({
				...c,
				name: `${rnd(first)} ${rnd(last)}`,
				role: c.role || "the commander",
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
			{ key: "soldiers", label: "⚔️ Pasukan" },
			{ key: "dj", label: "🎧 DJ" },
			{ key: "civilian", label: "👥 Sipil" },
			{ key: "vehicles", label: "🚁 Kendaraan" },
			{ key: "location", label: "📍 Lokasi" },
			{ key: "lighting", label: "💡 Lighting" },
			{ key: "vfx", label: "💥 VFX & Senjata" },
			{ key: "camera", label: "🎬 Kamera" },
		] as { key: TabKey; label: string }[];
	}, [clipMode]);

	const [activeTab, setActiveTab] = useState<TabKey>("soldiers");
	const [totalMinutes, setTotalMinutes] = useState(2);
	const [secPerScene, setSecPerScene] = useState(10);
	const [visualStyle, setVisualStyle] = useState<VisualStyleKey>("cinematic-realistic");
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
		soldiers: true,
		dj: true,
		civilian: true,
		vehicles: true,
		trailer: true,
		location: true,
		lighting: true,
		vfx: true,
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
		setActiveTab(next === "trailer" ? "trailer" : "soldiers");
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
				camQuality: pickOption(OPTIONS.camQuality, ["imax", "8k"]),
				camGrade: pickOption(OPTIONS.camGrade, ["teal-orange", "bleach bypass"]),
				camLens: pickOption(OPTIONS.camLens, ["anamorphic", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["epic heroic", "melancholic beauty"]),
			};
		}
		if (style === "semi-cinematic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "imax"]),
				camGrade: pickOption(OPTIONS.camGrade, ["cold steel blue", "rich warm", "teal-orange"]),
				camLens: pickOption(OPTIONS.camLens, ["50mm", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["cold tactical", "melancholic beauty"]),
			};
		}
		if (style === "cinematic-realistic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "imax"]),
				camGrade: pickOption(OPTIONS.camGrade, ["saving private ryan", "dunkirk", "rich warm"]),
				camLens: pickOption(OPTIONS.camLens, ["50mm", "anamorphic", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["brutal unflinching", "cold tactical"]),
			};
		}
		if (style === "realistic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "unreal engine"]),
				camGrade: pickOption(OPTIONS.camGrade, ["flat documentary", "saving private ryan"]),
				camLens: pickOption(OPTIONS.camLens, ["50mm", "wide-angle"]),
				camMood: pickOption(OPTIONS.camMood, ["brutal unflinching", "cold tactical"]),
			};
		}
		return {
			camQuality: pickOption(OPTIONS.camQuality, ["unreal engine", "8k"]),
			camGrade: pickOption(OPTIONS.camGrade, ["teal-orange", "bleach bypass"]),
			camLens: pickOption(OPTIONS.camLens, ["macro", "telephoto", "anamorphic"]),
			camMood: pickOption(OPTIONS.camMood, ["apocalyptic overwhelm", "rage and adrenaline"]),
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
		const sceneType = sceneTypes[sceneNum] ?? "ground-assault";
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
			const sceneType = sceneTypes[s] ?? "ground-assault";
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
				const sceneType = sceneTypes[s] ?? "ground-assault";
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
			`war-music-video-clip-${Date.now()}.json`,
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
				"You are an expert war epic film trailer director and AI video prompt engineer. Output MUST be valid JSON only — no markdown fences, no trailing commas, no comments.";

			const userPrompt = `Generate a ${totalScenes}-scene war epic film trailer AI video prompt bundle as JSON (schema: aiVideoPrompt.v1).

FILM REFERENCE: "${filmRef}"
- Inspired by the film's epic scale, dramatic tension, and visual language — but use ORIGINAL characters and story. Do NOT copy actor names, real faces, or exact film plot.

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
- Genre: war epic film trailer / opening — NO DJ, NO stage performance, NO music rave

TRAILER PACING (distribute scenes across these beats in order):
establish → inciting_incident → character_intro(s) → armies_gather → setpiece_battle → emotional_vow → climax_charge → closing_shot

CHARACTER INTRO RULE: Insert "character-intro" beat (cinematic close-up + opening credit style) at EXACTLY the introScene number specified per character. Each character gets exactly ONE intro scene.

SCENE CONTINUITY RULES (critical for AI video coherence):
1. Every scene (except scene 1) MUST start deliverable.prompt with: "Continuing from scene [N-1] — [one sentence describing what was just shown]..."
2. Battlefield/location: once established stays consistent unless the beat explicitly requires a new location
3. Characters: same face, same armor/uniform throughout — never change appearance mid-trailer
4. Visual grammar: match cuts — end frame of each scene should transition naturally to the next
5. Scale continuity: if armies are shown in scene N, they don't disappear in scene N+1 without reason

OPTIONAL BEATS: ${TRAILER_BEAT_OPTIONS.join(", ")}
SETPIECE IDEAS: ${WAR_TRAILER_SETPIECES.join(" | ")}
EMOTION IDEAS: ${TRAILER_EMOTION_BEATS.join(", ")}
ROLE IDEAS: ${TRAILER_CHARACTER_ROLES.join(", ")}

OUTPUT JSON STRUCTURE:
{
  "schema": "aiVideoPrompt.v1",
  "tool": "war-music-video-clip",
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
- seo.title: original title inspired by "${filmRef}" but remixed — represents the full trailer epic
- seo.description: Indonesian, min 900 chars, strong hook in first 2 lines, story beats summary, soft CTA, 5-10 hashtags
- seo.tags: exactly 30 tags (broad + niche + long-tail war/epic/film terms)
- seo.thumbnailPrompt: specific AI image prompt with composition, pose, lighting, color, background, 3-5 word text overlay — NO real actor names, NO gore

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
				const sceneType = sceneTypes[s] ?? "battlefield";
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
				tool: "war-music-video-clip",
				clipMode,
				filmRef,
				createdAt: new Date().toISOString(),
				seo: seoPack,
			};
			const text =
				`SEO PACK (AI)\n` +
				`Tool: war-music-video-clip\n` +
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
		downloadBlobFile(`war-music-video-clip-${Date.now()}.zip`, blob);
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
			tool: "war-music-video-clip",
			clipMode,
			filmRef,
			createdAt: new Date().toISOString(),
			seo: seoPack,
		};
		downloadJsonFile(
			`seo-pack-war-music-video-clip-${Date.now()}.json`,
			JSON.stringify(payload, null, 2),
		);
		showToast("💾 SEO pack .json berhasil didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		const text =
			`SEO PACK (AI)\n` +
			`Tool: war-music-video-clip\n` +
			`Mode: ${clipMode}\n` +
			`Film Ref: ${filmRef}\n` +
			`\n` +
			`TITLE:\n${seoPack.title}\n\n` +
			`DESCRIPTION:\n${seoPack.description}\n\n` +
			`TAGS (30):\n${seoPack.tags.join(", ")}\n\n` +
			`THUMBNAIL PROMPT:\n${seoPack.thumbnailPrompt}\n`;
		downloadTextFile(`seo-pack-war-music-video-clip-${Date.now()}.txt`, text);
		showToast("💾 SEO pack .txt berhasil didownload!");
	}

	function randomizeCurrentScene() {
		const updates: Partial<SceneConfig> = {};
		if (clipMode === "trailer") {
			if (randomGroups.trailer) {
				updates.trailerBeat = rnd(TRAILER_BEAT_OPTIONS);
				updates.trailerSetpiece = rnd(WAR_TRAILER_SETPIECES);
				updates.trailerEmotion = rnd(TRAILER_EMOTION_BEATS);
				updates.trailerFocusCharacter =
					rnd(trailerCharacters).name || rnd(TRAILER_CHARACTER_ROLES);
				const c = rnd(trailerCharacters);
				updates.trailerCreditText = `${c.name || "Kael Draven"} — ${c.role || rnd(TRAILER_CHARACTER_ROLES)}`;
			}
		} else if (randomGroups.soldiers) {
			updates.solHero = rnd(OPTIONS.solHero);
			updates.solSquad = rnd(OPTIONS.solSquad);
			updates.solAction = rnd(OPTIONS.solAction);
			updates.solGear = rnd(OPTIONS.solGear);
			updates.solScale = rnd(OPTIONS.solScale);
			updates.solEnemy = rnd(OPTIONS.solEnemy);
		}
		if (clipMode !== "trailer" && randomGroups.dj) {
			updates.djType = rnd(OPTIONS.djType);
			updates.djSetup = rnd(OPTIONS.djSetup);
			updates.djAction = rnd(OPTIONS.djAction);
			updates.djOutfit = rnd(OPTIONS.djOutfit);
			updates.djFx = rnd(OPTIONS.djFx);
			updates.djSound = rnd(OPTIONS.djSound);
		}
		if (clipMode !== "trailer" && randomGroups.civilian) {
			updates.civType = rnd(OPTIONS.civType);
			updates.civEmotion = rnd(OPTIONS.civEmotion);
			updates.civInteraction = rnd(OPTIONS.civInteraction);
			updates.civDensity = rnd(OPTIONS.civDensity);
		}
		if (clipMode !== "trailer" && randomGroups.vehicles) {
			updates.vehGround = rnd(OPTIONS.vehGround);
			updates.vehAir = rnd(OPTIONS.vehAir);
			updates.vehNaval = rnd(OPTIONS.vehNaval);
			updates.vehAction = rnd(OPTIONS.vehAction);
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
		if (clipMode !== "trailer" && randomGroups.vfx) {
			updates.vfxFire = rnd(OPTIONS.vfxFire);
			updates.vfxSmoke = rnd(OPTIONS.vfxSmoke);
			updates.vfxWeapons = rnd(OPTIONS.vfxWeapons);
			updates.vfxDuel = rnd(OPTIONS.vfxDuel);
			updates.vfxProps = rnd(OPTIONS.vfxProps);
			updates.vfxSfx = rnd(OPTIONS.vfxSfx);
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
					updates.trailerSetpiece = rnd(WAR_TRAILER_SETPIECES);
					updates.trailerEmotion = rnd(TRAILER_EMOTION_BEATS);
					updates.trailerFocusCharacter =
						rnd(trailerCharacters).name || rnd(TRAILER_CHARACTER_ROLES);
				}
			} else {
				if (randomGroups.soldiers) {
					updates.solHero = rnd(OPTIONS.solHero);
					updates.solSquad = rnd(OPTIONS.solSquad);
					updates.solAction = rnd(OPTIONS.solAction);
					updates.solGear = rnd(OPTIONS.solGear);
					updates.solScale = rnd(OPTIONS.solScale);
					updates.solEnemy = rnd(OPTIONS.solEnemy);
				}
				if (randomGroups.dj) {
					updates.djType = rnd(OPTIONS.djType);
					updates.djSetup = rnd(OPTIONS.djSetup);
					updates.djAction = rnd(OPTIONS.djAction);
					updates.djOutfit = rnd(OPTIONS.djOutfit);
					updates.djFx = rnd(OPTIONS.djFx);
					updates.djSound = rnd(OPTIONS.djSound);
				}
				if (randomGroups.civilian) {
					updates.civType = rnd(OPTIONS.civType);
					updates.civEmotion = rnd(OPTIONS.civEmotion);
					updates.civInteraction = rnd(OPTIONS.civInteraction);
					updates.civDensity = rnd(OPTIONS.civDensity);
				}
				if (randomGroups.vehicles) {
					updates.vehGround = rnd(OPTIONS.vehGround);
					updates.vehAir = rnd(OPTIONS.vehAir);
					updates.vehNaval = rnd(OPTIONS.vehNaval);
					updates.vehAction = rnd(OPTIONS.vehAction);
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
			if (clipMode !== "trailer" && randomGroups.vfx) {
				updates.vfxFire = rnd(OPTIONS.vfxFire);
				updates.vfxSmoke = rnd(OPTIONS.vfxSmoke);
				updates.vfxWeapons = rnd(OPTIONS.vfxWeapons);
				updates.vfxDuel = rnd(OPTIONS.vfxDuel);
				updates.vfxProps = rnd(OPTIONS.vfxProps);
				updates.vfxSfx = rnd(OPTIONS.vfxSfx);
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

	const scType = sceneTypes[currentScene] ?? "ground-assault";
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
		setFilmRefFromDropdown,
		useDropdownFilmRef,
		isFilmRefValid,
		aiProvider,
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
