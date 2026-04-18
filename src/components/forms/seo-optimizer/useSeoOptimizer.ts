"use client";

import { useState } from "react";
import type { SeoFormState, VideoThemeKey, ModelType, GenerateOutput, AnalyzeOutput, CustomThemeData, CustomThemeImageRef } from "./types";
import { DEFAULT_SEO_STATE, DEFAULT_CUSTOM_THEME, getDefaultModelId } from "./constants";
import { buildGeneratePrompt, buildAnalyzePrompt, buildCustomThemeMessages } from "./promptBuilder";

export default function useSeoOptimizer() {
	const [state, setState] = useState<SeoFormState>(DEFAULT_SEO_STATE);
	const [toast, setToast] = useState({ msg: "", show: false });

	function showToast(msg: string) {
		setToast({ msg, show: true });
		setTimeout(() => setToast({ msg: "", show: false }), 3200);
	}

	function update(updates: Partial<SeoFormState>) {
		setState((prev) => ({ ...prev, ...updates }));
	}

	function updateCustomTheme(updates: Partial<CustomThemeData>) {
		setState((prev) => ({
			...prev,
			customTheme: { ...prev.customTheme, ...updates },
		}));
	}

	function setTheme(theme: VideoThemeKey) {
		update({ theme, generateOutput: null, analyzeOutput: null, error: "" });
	}

	function setModel(model: ModelType) {
		update({ aiModel: model, aiModelId: getDefaultModelId(model) });
	}

	function setModelId(id: string) {
		update({ aiModelId: id });
	}

	function setMode(mode: "generate" | "analyze") {
		update({ mode, error: "", generateOutput: null, analyzeOutput: null });
	}

	// ─── IMAGE UPLOAD (custom theme) ──────────────────────────────────────────────

	async function handleCustomImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;

		const currentRefs = state.customTheme.imageRefs;
		if (currentRefs.length + files.length > 3) {
			showToast("⚠ Maksimal 3 gambar referensi");
			e.target.value = "";
			return;
		}

		update({ isAnalyzingImage: true });

		const newRefs: CustomThemeImageRef[] = [];
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

			// Analisa gambar via AI (opsional — ringan)
			let aiDescription: string | undefined;
			try {
				const res = await fetch("/api/seo-optimizer", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "generate",
						prompt: `Deskripsikan gambar referensi ini dalam 2-3 kalimat singkat dalam Bahasa Indonesia. Fokus pada: apa yang terlihat, mood/suasana, warna dominan, dan elemen visual yang menonjol. Buat dalam format teks biasa saja, bukan JSON.`,
						model: state.aiModel,
						modelId: state.aiModelId || undefined,
						images: [{ base64, mediaType: file.type || "image/jpeg" }],
					}),
				});
				// Note: endpoint ini return JSON, tapi untuk deskripsi image kita parse rawOutput
				const json = await res.json();
				// Coba ambil dari rawOutput karena prompt tidak minta JSON
				aiDescription = typeof json.rawOutput === "string"
					? json.rawOutput.substring(0, 200)
					: undefined;
			} catch {
				aiDescription = undefined;
			}

			newRefs.push({
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				name: file.name,
				base64,
				mediaType: file.type || "image/jpeg",
				previewUrl,
				aiDescription,
			});
		}

		updateCustomTheme({
			imageRefs: [...currentRefs, ...newRefs],
		});
		update({ isAnalyzingImage: false });
		e.target.value = "";
		showToast(`✅ ${newRefs.length} gambar referensi ditambahkan!`);
	}

	function removeCustomImage(id: string) {
		updateCustomTheme({
			imageRefs: state.customTheme.imageRefs.filter((img) => img.id !== id),
		});
	}

	// ─── GENERATE ────────────────────────────────────────────────────────────────

	async function handleGenerate() {
		// Validasi custom theme
		if (state.theme === "other-video-theme") {
			if (!state.customTheme.themeName.trim()) {
				update({ error: "Isi nama tema terlebih dahulu" });
				return;
			}
			if (!state.customTheme.videoDescription.trim()) {
				update({ error: "Isi deskripsi tema & alur cerita terlebih dahulu" });
				return;
			}
		}

		update({ isGenerating: true, error: "", generateOutput: null });

		try {
			const isCustomWithImages =
				state.theme === "other-video-theme" && state.customTheme.imageRefs.length > 0;

			let requestBody: Record<string, unknown>;

			if (isCustomWithImages) {
				// Gunakan prompt + images khusus untuk custom theme
				const { text, images } = buildCustomThemeMessages(state);
				requestBody = {
					action: "generate",
					prompt: text,
					model: state.aiModel,
					modelId: state.aiModelId || undefined,
					images,
				};
			} else {
				// Preset theme atau custom tanpa gambar
				requestBody = {
					action: "generate",
					prompt: buildGeneratePrompt(state),
					model: state.aiModel,
					modelId: state.aiModelId || undefined,
				};
			}

			const res = await fetch("/api/seo-optimizer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			const json = await res.json();
			if (!res.ok || json.error) {
				update({ error: json.error ?? "Generate gagal. Coba lagi." });
				return;
			}

			const output = json.data as GenerateOutput;
			output.theme = state.theme;
			output.generatedAt = new Date().toLocaleString("id-ID");
			output.aiModel = `${state.aiModel}${state.aiModelId ? ` (${state.aiModelId})` : ""}`;

			update({ generateOutput: output, activeOutputTab: "titles" });
			showToast("🎉 SEO content berhasil di-generate!");
		} catch (err) {
			update({ error: err instanceof Error ? err.message : "Network error" });
		} finally {
			update({ isGenerating: false });
		}
	}

	// ─── ANALYZE ─────────────────────────────────────────────────────────────────

	async function handleAnalyze() {
		if (!state.videoUrl.trim()) {
			update({ error: "Masukkan URL video YouTube atau Facebook terlebih dahulu" });
			return;
		}
		if (!state.videoUrl.startsWith("http")) {
			update({ error: "URL tidak valid. Harus diawali dengan https://" });
			return;
		}
		if (state.theme === "other-video-theme" && !state.customTheme.themeName.trim()) {
			update({ error: "Isi nama tema terlebih dahulu di bagian Tema Lainnya" });
			return;
		}

		update({ isAnalyzing: true, error: "", analyzeOutput: null });

		try {
			const res = await fetch("/api/seo-optimizer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "analyze",
					prompt: buildAnalyzePrompt(state),
					model: state.aiModel,
					modelId: state.aiModelId || undefined,
				}),
			});

			const json = await res.json();
			if (!res.ok || json.error) {
				update({ error: json.error ?? "Analisa gagal. Coba lagi." });
				return;
			}

			const output = json.data as AnalyzeOutput;
			output.analyzedAt = new Date().toLocaleString("id-ID");
			output.aiModel = `${state.aiModel}${state.aiModelId ? ` (${state.aiModelId})` : ""}`;

			update({ analyzeOutput: output });
			showToast("🔍 Analisa SEO selesai!");
		} catch (err) {
			update({ error: err instanceof Error ? err.message : "Network error" });
		} finally {
			update({ isAnalyzing: false });
		}
	}

	// ─── COPY HELPERS ─────────────────────────────────────────────────────────────

	async function copyToClipboard(text: string, label: string) {
		await navigator.clipboard.writeText(text);
		showToast(`📋 ${label} disalin!`);
	}

	function copyTitle(index?: number) {
		const out = state.generateOutput;
		if (!out) return;
		const i = index ?? out.bestTitleIndex;
		copyToClipboard(out.titleVariants[i]?.title ?? "", "Judul");
	}

	function copyDescription() {
		if (!state.generateOutput) return;
		copyToClipboard(state.generateOutput.description, "Deskripsi");
	}

	function copyTags() {
		if (!state.generateOutput) return;
		copyToClipboard(state.generateOutput.tags.map((t) => t.tag).join(", "), "Tags");
	}

	function copyThumbnailPrompt() {
		if (!state.generateOutput) return;
		copyToClipboard(state.generateOutput.thumbnailPrompt, "Thumbnail prompt");
	}

	function copyStoryboardCore() {
		if (!state.generateOutput) return;
		copyToClipboard(state.generateOutput.storyboardCore, "Storyboard inti");
	}

	function copyStoryboardScene(sceneNum: number) {
		if (!state.generateOutput) return;
		const scene = state.generateOutput.storyboardScenes.find((s) => s.sceneNum === sceneNum);
		if (!scene) return;
		copyToClipboard(scene.imagePrompt, `Storyboard Scene ${sceneNum}`);
	}

	function copyAllOutput() {
		const out = state.generateOutput;
		if (!out) return;
		const bestTitle = out.titleVariants[out.bestTitleIndex];
		const allTitles = out.titleVariants.map((t, i) => `${i === out.bestTitleIndex ? "★ " : "  "}[${t.seoScore}] ${t.title}`).join("\n");
		const tags = out.tags.map((t) => t.tag).join(", ");
		const scenes = out.storyboardScenes.map((s) => `Scene ${s.sceneNum}: ${s.title}\n${s.imagePrompt}`).join("\n\n");
		const fullText = `${"═".repeat(40)}\nSEO CONTENT OUTPUT\nTema: ${out.theme} | ${out.generatedAt}\n${"═".repeat(40)}\n\n📌 JUDUL TERPILIH:\n${bestTitle?.title}\n\n📋 SEMUA JUDUL:\n${allTitles}\n\n📝 DESKRIPSI:\n${out.description}\n\n🏷️ TAGS:\n${tags}\n\n🖼️ THUMBNAIL:\n${out.thumbnailPrompt}\n\n🎬 STORYBOARD INTI:\n${out.storyboardCore}\n\n🎞️ SCENES:\n${scenes}`;
		copyToClipboard(fullText, "Semua output");
	}

	function downloadOutput() {
		const out = state.generateOutput;
		if (!out) return;
		const bestTitle = out.titleVariants[out.bestTitleIndex];
		const content = `SEO CONTENT — ${out.theme.toUpperCase()}\nGenerated: ${out.generatedAt} | AI: ${out.aiModel}\n${"═".repeat(60)}\n\nJUDUL TERPILIH [Score: ${bestTitle?.seoScore}/100]:\n${bestTitle?.title}\n\n${"═".repeat(60)}\nSEMUA VARIASI JUDUL:\n${out.titleVariants.map((t, i) => `${i + 1}. [${t.seoScore}] ${t.title}\n   Volume: ${t.searchVolume} | CTR: ${t.clickbaitScore}/100\n   Alasan: ${t.reason}`).join("\n\n")}\n\n${"═".repeat(60)}\nDESKRIPSI:\n${out.description}\n\n${"═".repeat(60)}\nTAGS (${out.totalTagCount}):\n${out.tags.map((t) => `[${t.volume}][${t.category}] ${t.tag}`).join("\n")}\n\n${"═".repeat(60)}\nTHUMBNAIL PROMPT:\n${out.thumbnailPrompt}\n\n${"═".repeat(60)}\nSTORYBOARD INTI:\n${out.storyboardCore}\n\n${"═".repeat(60)}\nSTORYBOARD SCENES:\n${out.storyboardScenes.map((s) => `Scene ${s.sceneNum}: ${s.title} (${s.duration})\n${s.description}\n\nImage Prompt:\n${s.imagePrompt}`).join("\n\n─────────────\n\n")}`;
		const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `seo-${out.theme}-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
		showToast("💾 File .txt berhasil didownload!");
	}

	return {
		state,
		update,
		updateCustomTheme,
		setTheme,
		setModel,
		setModelId,
		setMode,
		handleGenerate,
		handleAnalyze,
		handleCustomImageUpload,
		removeCustomImage,
		copyTitle,
		copyDescription,
		copyTags,
		copyThumbnailPrompt,
		copyStoryboardCore,
		copyStoryboardScene,
		copyAllOutput,
		downloadOutput,
		toast,
	};
}
