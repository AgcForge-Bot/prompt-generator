/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { useState, useCallback } from "react";
import type { PromoDNA, SceneConfig, SceneTypeKey } from "./types";
import {
	DEFAULT_PROMO_DNA,
	calculateSceneOrder,
	SCENE_TYPE_META,
} from "./constants";
import { buildScenePrompt, buildAllScenePrompts } from "./promptBuilder";
import useProductPromoImageState from "./useProductPromoImageState";

// ─── TOAST ───────────────────────────────────────────────────────────────────

function useToast() {
	const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });

	function showToast(msg: string) {
		setToast({ msg, visible: true });
		setTimeout(() => setToast({ msg: "", visible: false }), 3000);
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
	const [scenes, setScenes] = useState<SceneConfig[]>(buildScenes(DEFAULT_PROMO_DNA));
	const [currentScene, setCurrentScene] = useState(1);
	const [isGeneratingAll, setIsGeneratingAll] = useState(false);
	const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
	const [activeTab, setActiveTab] = useState<"setup" | "scenes" | "output">("setup");
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);

	const imgState = useProductPromoImageState(showToast);

	// ─── DNA SETTER (recalculate scenes on key changes) ─────────────────────────

	function setDna(updates: Partial<PromoDNA>) {
		setDnaState((prev) => {
			const next = { ...prev, ...updates };

			// Recalculate totalScenes jika durasi atau secPerScene berubah
			if (updates.totalDurationSec !== undefined || updates.secPerScene !== undefined) {
				next.totalScenes = Math.floor(next.totalDurationSec / next.secPerScene);
				if (next.totalScenes < 2) next.totalScenes = 2;
			}

			// Auto-set isFashionProduct
			if (updates.productCategory !== undefined) {
				const { PRODUCT_CATEGORIES } = require("./constants");
				next.isFashionProduct = PRODUCT_CATEGORIES[next.productCategory]?.isFashion ?? false;
			}

			return next;
		});
	}

	// Rebuild scenes whenever DNA core changes
	function rebuildScenes(updatedDna?: PromoDNA) {
		const d = updatedDna ?? dna;
		setScenes(buildScenes(d));
		setAllPrompts([]);
		setCurrentScene(1);
	}

	// ─── GENERATE SINGLE SCENE ──────────────────────────────────────────────────

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
					prev.map((s) => (s.id === targetId ? { ...s, generatedPrompt: prompt } : s))
				);
				showToast(`✅ Prompt Scene ${targetId} berhasil di-generate!`);
			} finally {
				setIsGeneratingSingle(false);
			}
		},
		[currentScene, scenes, dna, imgState.productImages, showToast]
	);

	// ─── GENERATE ALL SCENES ────────────────────────────────────────────────────

	const generateAll = useCallback(async () => {
		setIsGeneratingAll(true);
		try {
			const prompts = buildAllScenePrompts(dna, scenes, imgState.productImages);
			setScenes((prev) =>
				prev.map((s, i) => ({ ...s, generatedPrompt: prompts[i] }))
			);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setActiveTab("output");
			showToast(`🎬 Semua ${scenes.length} prompt berhasil di-generate!`);
		} finally {
			setIsGeneratingAll(false);
		}
	}, [dna, scenes, imgState.productImages, showToast]);

	// ─── AUTO GENERATE (dari upload produk saja) ────────────────────────────────

	const autoGenerate = useCallback(async () => {
		if (!dna.productName && imgState.productImages.length === 0) {
			showToast("⚠ Upload foto produk atau masukkan nama produk terlebih dahulu!");
			return;
		}

		// Set product description dari AI analysis jika sudah ada
		const firstAnalysis = imgState.productImages.find(
			(img) => img.aiDescription && img.status === "done"
		);
		if (firstAnalysis?.aiDescription) {
			setDna({ productDescription: firstAnalysis.aiDescription });
		}

		// Rebuild scenes dulu
		const updatedDna = {
			...dna,
			productDescription: firstAnalysis?.aiDescription ?? dna.productDescription,
		};

		const freshScenes = buildScenes(updatedDna);
		setScenes(freshScenes);

		// Generate semua
		setIsGeneratingAll(true);
		try {
			const prompts = buildAllScenePrompts(updatedDna, freshScenes, imgState.productImages);
			setScenes(freshScenes.map((s, i) => ({ ...s, generatedPrompt: prompts[i] })));
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setActiveTab("output");
			showToast(`🚀 Auto-generate selesai! ${freshScenes.length} scene prompt siap!`);
		} finally {
			setIsGeneratingAll(false);
		}
	}, [dna, imgState.productImages, showToast]);

	// ─── COPY ────────────────────────────────────────────────────────────────────

	async function copyPrompt(sceneId?: number) {
		const id = sceneId ?? currentScene;
		const scene = scenes.find((s) => s.id === id);
		if (!scene?.generatedPrompt) {
			showToast("⚠ Generate prompt dulu!");
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
		await navigator.clipboard.writeText(allPrompts.join("\n\n"));
		showToast("📋 Semua prompt disalin ke clipboard!");
	}

	// ─── COMPUTED ────────────────────────────────────────────────────────────────

	const currentSceneData = scenes.find((s) => s.id === currentScene) ?? scenes[0];
	const generatedCount = scenes.filter((s) => s.generatedPrompt).length;

	return {
		// DNA
		dna,
		setDna,
		rebuildScenes,

		// Scenes
		scenes,
		setScenes,
		currentScene,
		setCurrentScene,
		currentSceneData,
		generatedCount,

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

		// UI
		activeTab,
		setActiveTab,
		toast,
		showToast,

		// Image
		...imgState,
	};
}
