"use client";

import { useState, useCallback } from "react";
import type { PromoDNA, SceneConfig, SceneTypeKey } from "./types";
import {
	DEFAULT_PROMO_DNA,
	DEFAULT_PRODUCT_SPEC,
	PRODUCT_CATEGORIES,
	calculateSceneOrder,
} from "./constants";
import { buildScenePrompt, buildAllScenePrompts } from "./promptBuilder";
import useProductPromoImageState from "./useProductPromoImageState";

// ─── TOAST ───────────────────────────────────────────────────────────────────

function useToast() {
	const [toast, setToast] = useState<{ msg: string; visible: boolean }>({
		msg: "",
		visible: false,
	});

	function showToast(msg: string) {
		setToast({ msg, visible: true });
		setTimeout(() => setToast({ msg: "", visible: false }), 3200);
	}

	return { toast, showToast };
}

// ─── SCENE BUILDER ────────────────────────────────────────────────────────────

function buildScenes(dna: PromoDNA): SceneConfig[] {
	const order = calculateSceneOrder(
		dna.totalScenes,
		dna.enableProblemSolution,
		dna.totalDurationSec
	);
	return order.map((sceneType, i) => ({
		id: i + 1,
		sceneType: sceneType as SceneTypeKey,
		duration: dna.secPerScene,
		generatedPrompt: undefined,
	}));
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────

export default function useProductPromoGenerator() {
	const { toast, showToast } = useToast();

	const [dna, setDnaState] = useState<PromoDNA>(DEFAULT_PROMO_DNA);
	const [scenes, setScenes] = useState<SceneConfig[]>(
		buildScenes(DEFAULT_PROMO_DNA)
	);
	const [currentScene, setCurrentScene] = useState(1);
	const [isGeneratingAll, setIsGeneratingAll] = useState(false);
	const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
	const [activeTab, setActiveTab] = useState<"setup" | "scenes">("setup");
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);

	const imgState = useProductPromoImageState(showToast);

	// ─── DNA SETTER ─────────────────────────────────────────────────────────────
	// Recalculate totalScenes & isFashionProduct secara otomatis

	function setDna(updates: Partial<PromoDNA>) {
		setDnaState((prev) => {
			const next = { ...prev, ...updates };

			// Recalculate totalScenes jika durasi atau secPerScene berubah
			if (
				updates.totalDurationSec !== undefined ||
				updates.secPerScene !== undefined
			) {
				next.totalScenes = Math.max(
					2,
					Math.floor(next.totalDurationSec / next.secPerScene)
				);
			}

			// Auto-set isFashionProduct berdasar kategori (no require() — pakai import)
			if (updates.productCategory !== undefined) {
				next.isFashionProduct =
					PRODUCT_CATEGORIES[next.productCategory]?.isFashion ?? false;
			}

			return next;
		});
	}

	// ─── REBUILD SCENES ──────────────────────────────────────────────────────────

	function rebuildScenes(overrideDna?: PromoDNA) {
		const d = overrideDna ?? dna;
		setScenes(buildScenes(d));
		setAllPrompts([]);
		setCurrentScene(1);
	}

	// ─── RESET SEMUA ─────────────────────────────────────────────────────────────

	function resetAll() {
		setDnaState(DEFAULT_PROMO_DNA);
		setScenes(buildScenes(DEFAULT_PROMO_DNA));
		setAllPrompts([]);
		setCurrentScene(1);
		imgState.setProductImages([]);
		showToast("🔄 Form direset ke default.");
	}

	// ─── GENERATE SINGLE SCENE ───────────────────────────────────────────────────

	const generatePrompt = useCallback(
		async (sceneId?: number) => {
			const targetId = sceneId ?? currentScene;
			const scene = scenes.find((s) => s.id === targetId);
			if (!scene) return;

			setIsGeneratingSingle(true);
			try {
				const prompt = buildScenePrompt(
					dna,
					scene,
					targetId - 1,
					scenes.length,
					imgState.productImages
				);
				setScenes((prev) =>
					prev.map((s) =>
						s.id === targetId ? { ...s, generatedPrompt: prompt } : s
					)
				);
				showToast(`✅ Prompt Scene ${targetId} berhasil di-generate!`);
			} finally {
				setIsGeneratingSingle(false);
			}
		},
		[currentScene, scenes, dna, imgState.productImages, showToast]
	);

	// ─── GENERATE ALL SCENES ─────────────────────────────────────────────────────

	const generateAll = useCallback(async () => {
		if (scenes.length === 0) {
			showToast("⚠ Rebuild scenes terlebih dahulu.");
			return;
		}
		setIsGeneratingAll(true);
		try {
			const prompts = buildAllScenePrompts(dna, scenes, imgState.productImages);
			setScenes((prev) =>
				prev.map((s, i) => ({ ...s, generatedPrompt: prompts[i] }))
			);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setActiveTab("scenes");
			showToast(`🎬 ${scenes.length} prompt berhasil di-generate!`);
		} finally {
			setIsGeneratingAll(false);
		}
	}, [scenes, showToast, dna, imgState.productImages]);

	// ─── AUTO GENERATE ───────────────────────────────────────────────────────────
	// Mode cepat: hanya butuh foto produk / nama produk + durasi → generate semua

	const autoGenerate = useCallback(async () => {
		const hasPhoto = imgState.productImages.length > 0;
		const hasName = dna.productName.trim().length > 0;
		const hasSpec =
			dna.productSpec.isTransformed &&
			(dna.productSpec.visual || dna.productSpec.usp);

		if (!hasPhoto && !hasName && !hasSpec) {
			showToast(
				"⚠ Upload foto produk atau isi nama produk terlebih dahulu!"
			);
			return;
		}

		setIsGeneratingAll(true);
		try {
			// Sync productDescription dari hasil AI image analysis (jika foto diupload)
			const firstAnalyzed = imgState.productImages.find(
				(img) => img.aiDescription && img.status === "done"
			);

			// Bangun DNA yang dipakai untuk generate (snapshot saat ini + enrichment)
			const enrichedDna: PromoDNA = {
				...dna,
				// Jika ada analisa foto AI tapi belum ada structured spec, masukkan ke description
				productDescription:
					firstAnalyzed?.aiDescription ?? dna.productDescription,
				// Jika structured spec belum ada tapi ada analisa foto, coba isi visual
				productSpec:
					!dna.productSpec.isTransformed && firstAnalyzed?.aiDescription
						? {
							...DEFAULT_PRODUCT_SPEC,
							visual: firstAnalyzed.aiDescription,
							usp: "",
							isTransformed: false,
						}
						: dna.productSpec,
			};

			// Rebuild scenes berdasar DNA terkini
			const freshScenes = buildScenes(enrichedDna);
			setScenes(freshScenes);

			// Generate semua prompt
			const prompts = buildAllScenePrompts(
				enrichedDna,
				freshScenes,
				imgState.productImages
			);

			setScenes(freshScenes.map((s, i) => ({ ...s, generatedPrompt: prompts[i] })));
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setActiveTab("scenes");
			showToast(
				`🚀 Auto-generate selesai! ${freshScenes.length} scene prompt siap!`
			);
		} finally {
			setIsGeneratingAll(false);
		}
	}, [dna, imgState.productImages, showToast]);

	// ─── COPY ────────────────────────────────────────────────────────────────────

	async function copyPrompt(sceneId?: number) {
		const id = sceneId ?? currentScene;
		const scene = scenes.find((s) => s.id === id);
		if (!scene?.generatedPrompt) {
			showToast("⚠ Generate prompt scene ini dulu!");
			return;
		}
		await navigator.clipboard.writeText(scene.generatedPrompt);
		showToast(`📋 Prompt Scene ${id} disalin!`);
	}

	async function copyAllPrompts() {
		if (!allPrompts.length) {
			showToast("⚠ Generate semua prompt dulu!");
			return;
		}
		await navigator.clipboard.writeText(allPrompts.join("\n\n" + "=".repeat(50) + "\n\n"));
		showToast("📋 Semua prompt disalin ke clipboard!");
	}

	// ─── DOWNLOAD TXT ────────────────────────────────────────────────────────────

	function downloadAllPrompts() {
		if (!allPrompts.length) {
			showToast("⚠ Generate semua prompt dulu!");
			return;
		}
		const separator = "\n\n" + "=".repeat(60) + "\n\n";
		const header = `PRODUCT PROMO VIDEO PROMPTS\nProduk: ${dna.productName}\nKategori: ${dna.productCategory} › ${dna.productSubcategory}\nDurasi: ${dna.totalDurationSec} detik | Per scene: ${dna.secPerScene} detik | Total: ${dna.totalScenes} scene\nFormat: ${dna.aspectRatio}\nGenerated: ${new Date().toLocaleString("id-ID")}\n\n` + "=".repeat(60) + "\n\n";
		const content = header + allPrompts.join(separator);
		const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `promo-${dna.productName.replace(/\s+/g, "-").toLowerCase() || "produk"}-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
		showToast("💾 File .txt berhasil didownload!");
	}

	// ─── COMPUTED ────────────────────────────────────────────────────────────────

	const currentSceneData =
		scenes.find((s) => s.id === currentScene) ?? scenes[0];
	const generatedCount = scenes.filter((s) => s.generatedPrompt).length;
	const progressPct =
		scenes.length > 0 ? Math.round((generatedCount / scenes.length) * 100) : 0;

	return {
		// DNA
		dna,
		setDna,
		rebuildScenes,
		resetAll,

		// Scenes
		scenes,
		setScenes,
		currentScene,
		setCurrentScene,
		currentSceneData,
		generatedCount,
		progressPct,

		// Generate
		generatePrompt,
		generateAll,
		autoGenerate,
		isGeneratingAll,
		isGeneratingSingle,

		// Output
		allPrompts,
		showAllPrompts,
		setShowAllPrompts,
		copyPrompt,
		copyAllPrompts,
		downloadAllPrompts,

		// UI
		activeTab,
		setActiveTab,
		toast,
		showToast,

		// Image state (spread semua dari useProductPromoImageState)
		...imgState,
	};
}
