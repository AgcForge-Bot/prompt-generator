"use client";

import { useState, useCallback } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { parseJsonFromModelOutput } from "@/lib/aiJson";
import {
	downloadJsonFile,
	downloadTextFile,
	jsonBundleFromSceneJsonStrings,
	jsonStringify,
} from "@/lib/promptJson";
import { getDefaultModelId } from "@/lib/modelProviders";
import { DEFAULT_HISTORICAL_CONFIG } from "./constants";
import type {
	HistoricalReconConfig,
	SeoPack,
	HistoricalCategoryKey,
	HistoricalReconGeneratorConfig,
} from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./utils";

export default function useHistoricalReconGenerator(): HistoricalReconGeneratorConfig {
	const { toast, show: showToast } = useToast();

	const [config, setConfigState] = useState<HistoricalReconConfig>(DEFAULT_HISTORICAL_CONFIG);
	const [isGenerating, setIsGenerating] = useState(false);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);
	const [seoPack, setSeoPack] = useState<SeoPack | null>(null);
	const [error, setError] = useState("");

	const totalScenes = Math.max(2, Math.floor((config.totalMinutes * 60) / Math.max(1, config.secPerScene)));

	function updateConfig(updates: Partial<HistoricalReconConfig>) {
		setConfigState((prev) => ({ ...prev, ...updates }));
	}

	function setDuration(minutes: number, secPerScene: number) {
		setConfigState((prev) => ({ ...prev, totalMinutes: minutes, secPerScene }));
	}

	function setCategory(category: HistoricalCategoryKey) {
		setConfigState((prev) => ({
			...prev,
			category,
			civilization: "",
			topicTitle: "",
		}));
	}

	function setAiProvider(provider: string) {
		setConfigState((prev) => ({
			...prev,
			aiProvider: provider,
			aiModelId: getDefaultModelId(provider),
		}));
	}

	// ─── GENERATE ────────────────────────────────────────────────────────────────

	const generateAllWithAI = useCallback(async () => {
		if (!config.topicTitle.trim() && !config.civilization.trim()) {
			setError("Isi topik / judul dan peradaban/subjek terlebih dahulu");
			return;
		}

		setIsGenerating(true);
		setError("");
		setSeoPack(null);
		setAllPrompts([]);

		try {
			const systemPrompt = buildSystemPrompt();
			const userPrompt = buildUserPrompt(config, totalScenes);

			const res = await fetch("/api/all-in-one-generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt,
					userPrompt,
					provider: config.aiProvider,
					modelId: config.aiModelId,
					maxTokens: 16000,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "AI request failed");

			const raw = String(data?.prompt ?? "");
			const bundle = parseJsonFromModelOutput(raw) as {
				scenes?: unknown[];
				seo?: SeoPack;
			};

			if (!bundle || !Array.isArray(bundle.scenes)) {
				throw new Error("AI output tidak mengandung scenes[]");
			}
			if (bundle.scenes.length !== totalScenes) {
				throw new Error(`AI menghasilkan ${bundle.scenes.length} scene, harus ${totalScenes}`);
			}

			if (bundle.seo) setSeoPack(bundle.seo);

			const { seo: _seo, ...bundleWithoutSeo } = bundle as Record<string, unknown>;
			const prompts = (bundle.scenes as unknown[]).map((scene) =>
				jsonStringify({ ...bundleWithoutSeo, scenes: [scene] })
			);

			setAllPrompts(prompts);
			setShowAllPrompts(true);
			showToast(`🎬 AI: ${totalScenes} scene historical reconstruction + SEO pack berhasil!`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unknown error";
			setError(msg);
			showToast(`⚠ ${msg}`);
		} finally {
			setIsGenerating(false);
		}
	}, [config, showToast, totalScenes]);

	// ─── COPY / DOWNLOAD ─────────────────────────────────────────────────────────

	function copyAll() {
		if (!allPrompts.length) return;
		navigator.clipboard.writeText(jsonBundleFromSceneJsonStrings(allPrompts));
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		if (!allPrompts.length) return;
		downloadJsonFile(`historical-recon-${config.category}-${Date.now()}.json`, jsonBundleFromSceneJsonStrings(allPrompts));
		showToast("💾 JSON bundle didownload!");
	}

	function copySeoTitle() { if (seoPack?.title) { navigator.clipboard.writeText(seoPack.title); showToast("📋 Judul SEO tersalin!"); } }
	function copySeoDescription() { if (seoPack?.description) { navigator.clipboard.writeText(seoPack.description); showToast("📋 Deskripsi SEO tersalin!"); } }
	function copySeoTags() { if (seoPack?.tags?.length) { navigator.clipboard.writeText(seoPack.tags.join(", ")); showToast("📋 Tags SEO tersalin!"); } }
	function copySeoThumbnailPrompt() { if (seoPack?.thumbnailPrompt) { navigator.clipboard.writeText(seoPack.thumbnailPrompt); showToast("📋 Thumbnail prompt tersalin!"); } }

	function downloadSeoPackJson() {
		if (!seoPack) return;
		downloadJsonFile(
			`seo-pack-historical-recon-${Date.now()}.json`,
			JSON.stringify({ schema: "aiSeoPack.v1", tool: "historical-reconstruction", category: config.category, civilization: config.civilization, seo: seoPack }, null, 2)
		);
		showToast("💾 SEO pack .json didownload!");
	}

	function downloadSeoPackTxt() {
		if (!seoPack) return;
		const text = [
			"SEO PACK (AI — Historical Reconstruction)",
			`Category: ${config.category} | Subject: ${config.civilization}`,
			"",
			"TITLE:", seoPack.title,
			"",
			"DESCRIPTION:", seoPack.description,
			"",
			"TAGS (30):", seoPack.tags.join(", "),
			"",
			"THUMBNAIL PROMPT:", seoPack.thumbnailPrompt,
		].join("\n");
		downloadTextFile(`seo-pack-historical-recon-${Date.now()}.txt`, text);
		showToast("💾 SEO pack .txt didownload!");
	}

	const progressPct = allPrompts.length > 0 ? Math.round((allPrompts.length / totalScenes) * 100) : 0;

	return {
		config,
		updateConfig,
		setCategory,
		setDuration,
		setAiProvider,
		isGenerating,
		generateAllWithAI,
		allPrompts,
		showAllPrompts,
		setShowAllPrompts,
		seoPack,
		error,
		setError,
		totalScenes,
		progressPct,
		copyAll,
		downloadAllJson,
		copySeoTitle,
		copySeoDescription,
		copySeoTags,
		copySeoThumbnailPrompt,
		downloadSeoPackJson,
		downloadSeoPackTxt,
		toast,
		showToast,
	};
}
