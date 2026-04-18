"use client";

import { useState } from "react";
import type { SeoFormState, VideoThemeKey, ModelType, GenerateOutput, AnalyzeOutput } from "./types";
import { DEFAULT_SEO_STATE, getDefaultModelId } from "./constants";
import { buildGeneratePrompt, buildAnalyzePrompt } from "./promptBuilder";

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

	// ─── GENERATE ────────────────────────────────────────────────────────────────

	async function handleGenerate() {
		update({ isGenerating: true, error: "", generateOutput: null });

		try {
			const prompt = buildGeneratePrompt(state);
			const res = await fetch("/api/seo-optimizer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "generate",
					prompt,
					model: state.aiModel,
					modelId: state.aiModelId || undefined,
				}),
			});

			const json = await res.json();
			if (!res.ok || json.error) {
				update({ error: json.error ?? "Generate gagal. Coba lagi." });
				return;
			}

			const output = json.data as GenerateOutput;
			// Inject meta
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

		update({ isAnalyzing: true, error: "", analyzeOutput: null });

		try {
			const prompt = buildAnalyzePrompt(state);
			const res = await fetch("/api/seo-optimizer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "analyze",
					prompt,
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
		const tagStr = state.generateOutput.tags.map((t) => t.tag).join(", ");
		copyToClipboard(tagStr, "Tags");
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
		const scene = state.generateOutput.storyboardScenes.find(
			(s) => s.sceneNum === sceneNum,
		);
		if (!scene) return;
		copyToClipboard(scene.imagePrompt, `Storyboard Scene ${sceneNum}`);
	}

	function copyAllOutput() {
		const out = state.generateOutput;
		if (!out) return;

		const bestTitle = out.titleVariants[out.bestTitleIndex];
		const allTitles = out.titleVariants
			.map((t, i) => `${i === out.bestTitleIndex ? "★ " : "  "}[${t.seoScore}] ${t.title}`)
			.join("\n");
		const tags = out.tags.map((t) => t.tag).join(", ");
		const scenes = out.storyboardScenes
			.map((s) => `Scene ${s.sceneNum}: ${s.title}\n${s.imagePrompt}`)
			.join("\n\n");

		const fullText = `═══════════════════════════════════════
SEO CONTENT GENERATOR OUTPUT
Tema: ${out.theme} | ${out.generatedAt}
═══════════════════════════════════════

📌 JUDUL TERPILIH (Skor: ${bestTitle?.seoScore}/100):
${bestTitle?.title}

📋 SEMUA VARIASI JUDUL:
${allTitles}

📝 DESKRIPSI:
${out.description}

🏷️ TAGS (${out.totalTagCount} tags):
${tags}

🖼️ THUMBNAIL PROMPT:
${out.thumbnailPrompt}

🎬 STORYBOARD INTI:
${out.storyboardCore}

🎞️ STORYBOARD SCENES:
${scenes}`;

		copyToClipboard(fullText, "Semua output");
	}

	// ─── DOWNLOAD ─────────────────────────────────────────────────────────────────

	function downloadOutput() {
		const out = state.generateOutput;
		if (!out) return;

		const bestTitle = out.titleVariants[out.bestTitleIndex];
		const content = `SEO CONTENT — ${out.theme.toUpperCase()}
Generated: ${out.generatedAt} | AI: ${out.aiModel}
${"═".repeat(60)}

JUDUL TERPILIH [Score: ${bestTitle?.seoScore}/100]:
${bestTitle?.title}

SEMUA VARIASI JUDUL:
${out.titleVariants.map((t, i) => `${i + 1}. [${t.seoScore}] ${t.title}\n   Volume: ${t.searchVolume} | CTR: ${t.clickbaitScore}/100\n   Alasan: ${t.reason}`).join("\n\n")}

${"═".repeat(60)}
DESKRIPSI (${out.descriptionCharCount} karakter):
${out.description}

${"═".repeat(60)}
TAGS (${out.totalTagCount} tags | Score: ${out.overallTagScore}/100):
${out.tags.map((t) => `[${t.volume}][${t.category}] ${t.tag}`).join("\n")}

${"═".repeat(60)}
THUMBNAIL PROMPT:
${out.thumbnailPrompt}

${"═".repeat(60)}
STORYBOARD INTI:
${out.storyboardCore}

${"═".repeat(60)}
STORYBOARD SCENES:
${out.storyboardScenes.map((s) => `Scene ${s.sceneNum}: ${s.title} (${s.duration})\n${s.description}\n\nImage Prompt:\n${s.imagePrompt}`).join("\n\n─────────────\n\n")}
`;

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
		setTheme,
		setModel,
		setModelId,
		setMode,
		handleGenerate,
		handleAnalyze,
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
