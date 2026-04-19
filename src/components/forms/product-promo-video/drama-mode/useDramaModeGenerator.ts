"use client";

import { useState, useCallback } from "react";
import type { DramaDNA, DramaImageRef, DramaOutput, ManualSceneInstruction } from "./types";
import {
	DEFAULT_DRAMA_DNA,
	DEFAULT_CTA,
	calcDramaActs,
	calcCtaScenes,
	calcTotalDramaScenes,
	DRAMA_CTA_TEXT_PRESETS,
} from "./constants";
import { buildDramaSystemPrompt, buildDramaUserPrompt } from "./promptBuilder";

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

export default function useDramaModeGenerator() {
	const { toast, showToast } = useToast();

	const [dna, setDnaState] = useState<DramaDNA>(DEFAULT_DRAMA_DNA);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isUploadingImages, setIsUploadingImages] = useState(false);
	const [output, setOutput] = useState<DramaOutput | null>(null);
	const [outputJson, setOutputJson] = useState<string>("");
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState<"config" | "output">("config");

	// ─── DNA SETTER ──────────────────────────────────────────────────────────────

	function setDna(updates: Partial<DramaDNA>) {
		setDnaState((prev) => {
			const next = { ...prev, ...updates };

			// Recalc jika durasi berubah
			if (updates.totalDurationSec !== undefined || updates.secPerScene !== undefined) {
				next.totalScenes = calcTotalDramaScenes(next.totalDurationSec, next.secPerScene);
				next.autoActs = calcDramaActs(next.totalDurationSec, next.secPerScene);
			}

			return next;
		});
	}

	function updateCta(updates: Partial<DramaDNA["cta"]>) {
		setDna({ cta: { ...dna.cta, ...updates } });
	}

	function updateManualInstruction(sceneId: number, updates: Partial<ManualSceneInstruction>) {
		const existing = dna.manualInstructions.find((m) => m.sceneId === sceneId);
		if (existing) {
			setDna({
				manualInstructions: dna.manualInstructions.map((m) =>
					m.sceneId === sceneId ? { ...m, ...updates } : m
				),
			});
		} else {
			setDna({
				manualInstructions: [
					...dna.manualInstructions,
					{
						sceneId,
						actNumber: 1,
						description: "",
						gimmick: "",
						productMention: false,
						...updates,
					} as ManualSceneInstruction,
				],
			});
		}
	}

	// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;

		if (dna.productImages.length + files.length > 5) {
			showToast("⚠ Maksimal 5 gambar produk");
			e.target.value = "";
			return;
		}

		setIsUploadingImages(true);
		const newRefs: DramaImageRef[] = [];

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

			// Quick AI description via analyze-product endpoint
			let aiDescription: string | undefined;
			try {
				const res = await fetch("/api/analyze-product", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						base64,
						mediaType: file.type || "image/jpeg",
						model: dna.aiProvider,
						modelId: dna.aiModelId || undefined,
					}),
				});
				const json = await res.json();
				aiDescription = json.description;
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

		setDna({ productImages: [...dna.productImages, ...newRefs] });
		setIsUploadingImages(false);
		e.target.value = "";
		showToast(`✅ ${newRefs.length} gambar produk ditambahkan!`);
	}

	function removeImage(id: string) {
		setDna({ productImages: dna.productImages.filter((img) => img.id !== id) });
	}

	// ─── GENERATE ─────────────────────────────────────────────────────────────────

	const handleGenerate = useCallback(async () => {
		if (!dna.productName.trim()) {
			setError("Isi nama produk terlebih dahulu");
			return;
		}

		setIsGenerating(true);
		setError("");
		setOutput(null);
		setOutputJson("");

		try {
			const systemPrompt = buildDramaSystemPrompt();
			const userPrompt = buildDramaUserPrompt(dna);
			const images = dna.productImages.map((img) => ({
				base64: img.base64,
				mediaType: img.mediaType,
			}));

			const res = await fetch("/api/drama-mode-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: dna.aiProvider,
					modelId: dna.aiModelId || undefined,
					images,
					maxTokens: 8000,
				}),
			});

			const json = await res.json();
			if (!res.ok || json.error) {
				setError(json.error ?? "Generate gagal. Coba lagi.");
				return;
			}

			const parsed = json.data as DramaOutput;
			// Inject timestamp jika kosong
			parsed.generatedAt = parsed.generatedAt || new Date().toISOString();

			setOutput(parsed);
			setOutputJson(JSON.stringify(parsed, null, 2));
			setDna({ isGenerated: true });
			setActiveTab("output");
			showToast(`🎬 Script drama berhasil di-generate! ${parsed.scenes?.length ?? 0} scene ready.`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Network error. Coba lagi.");
		} finally {
			setIsGenerating(false);
		}
	}, [dna, showToast]);

	// ─── COPY & DOWNLOAD ─────────────────────────────────────────────────────────

	async function copyOutput() {
		if (!outputJson) { showToast("⚠ Generate dulu!"); return; }
		await navigator.clipboard.writeText(outputJson);
		showToast("📋 JSON script disalin!");
	}

	function downloadOutput() {
		if (!outputJson) { showToast("⚠ Generate dulu!"); return; }
		const blob = new Blob([outputJson], { type: "application/json;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `drama-ad-${dna.productName.replace(/\s+/g, "-").toLowerCase() || "produk"}-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
		showToast("💾 File .json didownload!");
	}

	async function copyScene(sceneIndex: number) {
		if (!output) return;
		const allScenes = [...(output.scenes ?? []), ...(output.ctaScenes ?? [])];
		const scene = allScenes[sceneIndex];
		if (!scene) return;
		await navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
		showToast(`📋 Scene ${scene.sceneNumber} disalin!`);
	}

	// ─── COMPUTED ─────────────────────────────────────────────────────────────────

	const allScenes = output ? [...(output.scenes ?? []), ...(output.ctaScenes ?? [])] : [];
	const totalScenes = dna.totalScenes;
	const ctaCount = calcCtaScenes(dna.totalDurationSec, dna.secPerScene);
	const dramaSceneCount = totalScenes - ctaCount;

	return {
		dna,
		setDna,
		updateCta,
		updateManualInstruction,
		isGenerating,
		isUploadingImages,
		output,
		outputJson,
		allScenes,
		totalScenes,
		ctaCount,
		dramaSceneCount,
		error,
		setError,
		activeTab,
		setActiveTab,
		handleGenerate,
		handleImageUpload,
		removeImage,
		copyOutput,
		downloadOutput,
		copyScene,
		toast,
	};
}
