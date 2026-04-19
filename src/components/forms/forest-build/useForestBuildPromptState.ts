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

			const systemPrompt =
				"Kamu adalah penulis short film survival + prompt engineer untuk AI video. Output HARUS JSON valid tanpa markdown/backticks.";

			const userPrompt = `Buat AI video prompt berbentuk JSON dengan schema aiVideoPrompt.v1 untuk tool forest-build-primitive-craft.

KONTEKS (SURVIVAL SHORT FILM):
- Referensi judul: ${movieTitle}
- Referensi storyline (opsional): ${movieStory || "(none)"}
- Durasi: ${totalScenes * secPerScene} detik
- Sec per scene: ${secPerScene}
- Total scene: ${totalScenes}
- Visual style: ${dna.visualStyle}
- Location: ${dna.location}
- Climate: ${dna.climate}
- Shelter type: ${dna.shelterType}
- Build material: ${dna.buildMaterial}
- Film style/camera vibe: ${dna.filmStyle}
- Color palette: ${dna.colorPalette}
- Soundscape: ${dna.soundscape}
- Pet: ${dna.hasPet ? `yes (${dna.petType})` : "no"}
- Story intensity: ${dna.storyIntensity}
- Cast rules:
  - castCount: ${dna.storyCastCountMode === "manual" ? castCount : "AUTO"}
  - mainGender: ${mainGender}

ATURAN CERITA (WAJIB):
- Ini BUKAN trailer/opening. Ini short film yang cerita NYAMBUNG dari scene ke scene (scene 2..N).
- Scene 1 wajib teaser montage: cuplikan singkat dari momen emosional/puncak yang akan terjadi di scene berikutnya (tanpa menjelaskan semuanya).
- Scene 2..N harus urut progres: survive → planning → gathering → building → setback → recovery → completion → reflection.
- Sesuaikan intensitas konflik sesuai story intensity:
  - relaxing: minim konflik, fokus ASMR craft, mood healing, tetap ada progress jelas
  - balanced: ada 1-2 setback realistis, ada recovery
  - intense: lebih banyak hambatan, tapi tetap masuk akal dan tetap nyambung
- Tidak boleh menyebut judul film asli, nama karakter film asli, atau meniru wajah aktor asli.
- Buat karakter original (nama + deskripsi wajah original). Jika castCount AUTO, pilih 1-4 karakter. Jika manual, tepat ${castCount}.
- Jika mainGender manual, karakter utama wajib gender ${dna.modelGender}.

OUTPUT JSON (WAJIB):
- Root harus punya:
  - schema: "aiVideoPrompt.v1"
  - tool: "forest-build-primitive-craft"
  - characters: array karakter original (name, role, gender, faceDescription)
  - scenes: array panjang tepat ${totalScenes}
  - seo: objek SEO pack (lihat bawah)
- Tiap item scenes wajib ada:
  - id (1..${totalScenes})
  - sceneNumber ("Scene X")
  - time.startSec dan time.endSec sesuai urutan (start=(id-1)*${secPerScene}, end=id*${secPerScene})
  - deliverable.prompt (1 paragraf visual; untuk scene 2..N harus jelas melanjutkan dari scene sebelumnya)
  - deliverable.negativePrompt

SEO PACK (WAJIB):
  - seo.title: 1 judul SEO terinspirasi dari ${movieTitle} tapi original (remix, bukan menyalin) dan mewakili keseluruhan cerita.
  - seo.description: deskripsi Indonesia siap tempel, min 900 karakter, 2 baris pertama hook kuat, ringkas alur cerita, CTA halus, 5-10 hashtag.
  - seo.tags: array tepat 30 tags (mix broad/niche/long-tail) relevan survival build + vibe movie + isi scenes.
  - seo.thumbnailPrompt: prompt thumbnail AI image generator, sangat spesifik (komposisi, subject, ekspresi, lighting, warna, background, style, teks overlay 3-5 kata). Tidak boleh pakai nama film asli/aktor asli.

Output hanya JSON.`;

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: dna.storyAiProvider,
					modelId: dna.storyAiModelId,
					maxTokens: 8000,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "AI request failed");

			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as { scenes?: unknown[]; seo?: SeoPack };
			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== totalScenes) {
				throw new Error(
					`AI scenes tidak sesuai. Dapat ${bundle.scenes.length}, harus ${totalScenes}`,
				);
			}

			if (bundle.seo) setSeoPack(bundle.seo);

			const prompts = bundle.scenes.map((scene) =>
				jsonStringify({ ...bundle, scenes: [scene] }),
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
