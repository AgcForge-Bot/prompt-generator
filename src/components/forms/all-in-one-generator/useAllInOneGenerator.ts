/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback } from "react";
import type {
	AllInOneDNA,
	AllInOneState,
	SceneConfig,
	SceneImageRef,
} from "./types";
import {
	DEFAULT_DNA,
	buildScenesFromDNA,
	calcTotalScenes,
	createDefaultScene,
	OUTFIT_OPTIONS,
} from "./constants";
import {
	buildAIGenerateSystemPrompt,
	buildAIGenerateUserPrompt,
	buildLocalPrompt,
	buildRemotionClaudeCodeScript,
} from "./promptBuilder";

// ─── TOAST ───────────────────────────────────────────────────────────────────

function useToast() {
	const [toast, setToast] = useState({ msg: "", show: false });
	function showToast(msg: string) {
		setToast({ msg, show: true });
		setTimeout(() => setToast({ msg: "", show: false }), 3200);
	}
	return { toast, showToast };
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────

export default function useAllInOneGenerator() {
	const { toast, showToast } = useToast();

	const [dna, setDnaState] = useState<AllInOneDNA>(DEFAULT_DNA);
	const [scenes, setScenes] = useState<SceneConfig[]>(buildScenesFromDNA(DEFAULT_DNA));
	const [currentScene, setCurrentScene] = useState(1);
	const [isGeneratingAll, setIsGeneratingAll] = useState(false);
	const [isGeneratingImages, setIsGeneratingImages] = useState(false);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [promptOutput, setPromptOutput] = useState("Klik ⚡ Generate untuk membuat prompt scene ini...");
	const [activeTab, setActiveTab] = useState<"dna" | "scenes" | "output">("dna");
	const [error, setError] = useState("");
	const [remotionScript, setRemotionScript] = useState("");
	const [showRemotionModal, setShowRemotionModal] = useState(false);

	// ─── DNA SETTER ──────────────────────────────────────────────────────────────

	function setDna(updates: Partial<AllInOneDNA>) {
		setDnaState((prev) => {
			const next = { ...prev, ...updates };

			// Auto recalc scenes jika durasi berubah
			if (updates.totalDurationSec !== undefined || updates.secPerScene !== undefined) {
				next.totalScenes = calcTotalScenes(next.totalDurationSec, next.secPerScene);
			}

			return next;
		});
	}

	// ─── LOCK DNA ────────────────────────────────────────────────────────────────

	function lockDNA() {
		if (!dna.videoTitle.trim()) {
			setError("Isi judul video terlebih dahulu");
			return;
		}
		if (!dna.coreStoryboard.trim()) {
			setError("Isi inti storyboard terlebih dahulu");
			return;
		}
		setError("");

		// Rebuild scenes dari DNA terkini
		const freshScenes = buildScenesFromDNA(dna);

		// Preserve storyboard & image yang sudah diisi jika total scene sama
		if (freshScenes.length === scenes.length) {
			setScenes((prev) =>
				freshScenes.map((s, i) => ({
					...s,
					storyboard: prev[i]?.storyboard ?? "",
					imageRefs: prev[i]?.imageRefs ?? [],
				}))
			);
		} else {
			setScenes(freshScenes);
		}

		setDna({ dnaLocked: true });
		setCurrentScene(1);
		setAllPrompts([]);
		setShowAllPrompts(false);
		setPromptOutput("DNA dikunci! Sekarang isi storyboard per scene dan klik Generate.");
		setActiveTab("scenes");
		showToast(`🔒 DNA dikunci! ${dna.totalScenes} scene siap dikonfigurasi.`);
	}

	function unlockDNA() {
		setDna({ dnaLocked: false });
		setActiveTab("dna");
		showToast("🔓 DNA dibuka untuk diedit.");
	}

	// ─── SCENE UPDATE ─────────────────────────────────────────────────────────────

	function updateScene(id: number, updates: Partial<SceneConfig>) {
		setScenes((prev) =>
			prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
		);
	}

	function getScene(id: number): SceneConfig {
		return scenes.find((s) => s.id === id) ?? createDefaultScene(id);
	}

	// ─── IMAGE UPLOAD PER SCENE ───────────────────────────────────────────────────

	async function handleSceneImageUpload(
		sceneId: number,
		e: React.ChangeEvent<HTMLInputElement>
	) {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;

		const current = getScene(sceneId);
		if (current.imageRefs.length + files.length > 3) {
			showToast("⚠ Maksimal 3 gambar per scene");
			e.target.value = "";
			return;
		}

		setIsGeneratingImages(true);
		const newRefs: SceneImageRef[] = [];

		for (const file of files) {
			const base64 = await new Promise<string>((res, rej) => {
				const reader = new FileReader();
				reader.onload = (ev) => res((ev.target?.result as string).split(",")[1]);
				reader.onerror = () => rej(new Error("Read failed"));
				reader.readAsDataURL(file);
			});
			const previewUrl = await new Promise<string>((res) => {
				const r2 = new FileReader();
				r2.onload = (ev) => res(ev.target?.result as string);
				r2.readAsDataURL(file);
			});

			// Analisa image via AI
			let aiDescription: string | undefined;
			try {
				const res = await fetch("/api/all-in-one-generator", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						systemPrompt: "You are a visual reference analyst. Describe this image in 1-2 sentences focusing on: main subject, visual style, lighting, colors, and atmosphere. Be concise and specific.",
						userPrompt: "Describe this reference image for video prompt generation:",
						provider: dna.aiProvider,
						modelId: dna.aiModelId,
						images: [{ base64, mediaType: file.type || "image/jpeg" }],
					}),
				});
				const json = await res.json();
				aiDescription = json.prompt;
			} catch {
				aiDescription = undefined;
			}

			newRefs.push({
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				name: file.name,
				base64,
				mediaType: file.type || "image/jpeg",
				previewUrl,
				aiDescription,
			});
		}

		updateScene(sceneId, {
			imageRefs: [...current.imageRefs, ...newRefs],
		});
		setIsGeneratingImages(false);
		e.target.value = "";
		showToast(`✅ ${newRefs.length} gambar ditambahkan ke Scene ${sceneId}!`);
	}

	function removeSceneImage(sceneId: number, imageId: string) {
		const sc = getScene(sceneId);
		updateScene(sceneId, {
			imageRefs: sc.imageRefs.filter((img) => img.id !== imageId),
		});
	}

	// ─── GENERATE SINGLE ─────────────────────────────────────────────────────────

	const generateSingle = useCallback(
		async (sceneId?: number) => {
			if (!dna.dnaLocked) {
				showToast("⚠ Kunci DNA terlebih dahulu!");
				return;
			}
			const targetId = sceneId ?? currentScene;
			const scene = getScene(targetId);

			updateScene(targetId, { isGenerating: true });

			try {
				const systemPrompt = buildAIGenerateSystemPrompt(dna);
				const userPrompt = buildAIGenerateUserPrompt(dna, scene, dna.totalScenes);
				const images = scene.imageRefs.map((img) => ({
					base64: img.base64,
					mediaType: img.mediaType,
				}));

				const res = await fetch("/api/all-in-one-generator", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						systemPrompt,
						userPrompt,
						provider: dna.aiProvider,
						modelId: dna.aiModelId,
					maxTokens: 8000,
						images,
					}),
				});

				const json = await res.json();
				if (!res.ok || json.error) {
					showToast(`⚠ Scene ${targetId}: ${json.error}`);
					updateScene(targetId, { isGenerating: false });
					return;
				}

				const generated = json.prompt as string;
				updateScene(targetId, { generatedPrompt: generated, isGenerating: false });
				if (targetId === currentScene) setPromptOutput(generated);
				showToast(`✅ Prompt Scene ${targetId} berhasil!`);
			} catch (err) {
				updateScene(targetId, { isGenerating: false });
				showToast(`⚠ Error: ${err instanceof Error ? err.message : "Unknown"}`);
			}
		},
		[currentScene, dna, getScene, showToast]
	);

	// ─── GENERATE ALL ─────────────────────────────────────────────────────────────

	const generateAll = useCallback(async () => {
		if (!dna.dnaLocked) {
			showToast("⚠ Kunci DNA terlebih dahulu!");
			return;
		}

		setIsGeneratingAll(true);
		setError("");
		const prompts: string[] = [];
		const systemPrompt = buildAIGenerateSystemPrompt(dna);

		for (let i = 0; i < scenes.length; i++) {
			const scene = scenes[i];
			updateScene(scene.id, { isGenerating: true });

			try {
				const userPrompt = buildAIGenerateUserPrompt(dna, scene, dna.totalScenes);
				const images = scene.imageRefs.map((img) => ({
					base64: img.base64,
					mediaType: img.mediaType,
				}));

				const res = await fetch("/api/all-in-one-generator", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						systemPrompt,
						userPrompt,
						provider: dna.aiProvider,
						modelId: dna.aiModelId,
						images,
					}),
				});

				const json = await res.json();
				const generated = json.error
					? buildLocalPrompt(dna, scene, dna.totalScenes)
					: (json.prompt as string);

				prompts.push(generated);
				updateScene(scene.id, { generatedPrompt: generated, isGenerating: false });

				// Update display jika ini scene aktif
				if (scene.id === currentScene) setPromptOutput(generated);

				showToast(`⚡ Scene ${scene.id}/${scenes.length} selesai...`);
			} catch {
				const fallback = buildLocalPrompt(dna, scene, dna.totalScenes);
				prompts.push(fallback);
				updateScene(scene.id, { generatedPrompt: fallback, isGenerating: false });
			}
		}

		setAllPrompts(prompts);
		setShowAllPrompts(true);
		setActiveTab("output");
		setIsGeneratingAll(false);
		showToast(`🎬 Semua ${scenes.length} prompt selesai!`);
	}, [dna, showToast, scenes, currentScene]);

	// ─── GENERATE ALL WITH VIDEO (Remotion) ──────────────────────────────────────

	const generateAllWithVideo = useCallback(async () => {
		// Pertama generate semua prompt
		await generateAll();

		// Buat Remotion script
		const currentPrompts = scenes
			.map((s) => s.generatedPrompt ?? buildLocalPrompt(dna, s, dna.totalScenes));
		const script = buildRemotionClaudeCodeScript(dna, currentPrompts);
		setRemotionScript(script);
		setShowRemotionModal(true);
	}, [dna, scenes, generateAll]);

	// ─── COPY & DOWNLOAD ─────────────────────────────────────────────────────────

	async function copyPrompt(sceneId?: number) {
		const id = sceneId ?? currentScene;
		const scene = getScene(id);
		if (!scene.generatedPrompt) {
			showToast("⚠ Generate prompt dulu!");
			return;
		}
		await navigator.clipboard.writeText(scene.generatedPrompt);
		showToast(`📋 Prompt Scene ${id} disalin!`);
	}

	async function copyAll() {
		if (!allPrompts.length) {
			showToast("⚠ Generate semua dulu!");
			return;
		}
		const separator = "\n\n" + "═".repeat(56) + "\n\n";
		await navigator.clipboard.writeText(allPrompts.join(separator));
		showToast("📋 Semua prompt disalin!");
	}

	function downloadAll() {
		if (!allPrompts.length) {
			showToast("⚠ Generate semua dulu!");
			return;
		}
		const separator = "\n\n" + "═".repeat(56) + "\n\n";
		const header = `ALL-IN-ONE PROMPT GENERATOR\nVideo: "${dna.videoTitle}"\nTheme: ${dna.theme} | Style: ${dna.visualStyle}\nScenes: ${dna.totalScenes} x ${dna.secPerScene}s\nGenerated: ${new Date().toLocaleString("id-ID")}\n\n${"═".repeat(56)}\n\n`;
		const content = header + allPrompts.join(separator);
		const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `all-in-one-${dna.theme}-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
		showToast("💾 File .txt didownload!");
	}

	// ─── SELECT SCENE ─────────────────────────────────────────────────────────────

	function selectScene(id: number) {
		setCurrentScene(id);
		const sc = getScene(id);
		if (sc.generatedPrompt) setPromptOutput(sc.generatedPrompt);
		else setPromptOutput("Klik ⚡ Generate untuk membuat prompt scene ini...");
	}

	// ─── COMPUTED ─────────────────────────────────────────────────────────────────

	const generatedCount = scenes.filter((s) => s.generatedPrompt).length;
	const progressPct = scenes.length > 0 ? Math.round((generatedCount / scenes.length) * 100) : 0;
	const currentSceneData = getScene(currentScene);

	return {
		// DNA
		dna,
		setDna,
		lockDNA,
		unlockDNA,
		error,
		setError,

		// Scenes
		scenes,
		currentScene,
		currentSceneData,
		selectScene,
		updateScene,
		getScene,
		generatedCount,
		progressPct,

		// Generate
		generateSingle,
		generateAll,
		generateAllWithVideo,
		isGeneratingAll,
		isGeneratingImages,

		// Images
		handleSceneImageUpload,
		removeSceneImage,

		// Output
		allPrompts,
		showAllPrompts,
		setShowAllPrompts,
		promptOutput,
		setPromptOutput,
		copyPrompt,
		copyAll,
		downloadAll,

		// Remotion
		remotionScript,
		showRemotionModal,
		setShowRemotionModal,

		// UI
		activeTab,
		setActiveTab,
		toast,
		showToast,
	};
}
