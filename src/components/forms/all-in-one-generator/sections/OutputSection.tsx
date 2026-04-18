"use client";

import type { SceneConfig, AllInOneDNA } from "../types";

type Props = {
	dna: AllInOneDNA;
	scenes: SceneConfig[];
	currentScene: number;
	promptOutput: string;
	allPrompts: string[];
	showAllPrompts: boolean;
	generatedCount: number;
	progressPct: number;
	isGeneratingAll: boolean;
	onSetShowAll: (v: boolean) => void;
	onSelectScene: (id: number) => void;
	onCopyPrompt: (id?: number) => void;
	onCopyAll: () => void;
	onDownload: () => void;
	onGenerateAll: () => void;
	onGenerateAllWithVideo: () => void;
};

export default function OutputSection({
	dna,
	scenes,
	currentScene,
	promptOutput,
	allPrompts,
	showAllPrompts,
	generatedCount,
	progressPct,
	isGeneratingAll,
	onSetShowAll,
	onSelectScene,
	onCopyPrompt,
	onCopyAll,
	onDownload,
	onGenerateAll,
	onGenerateAllWithVideo,
}: Props) {
	const currentSceneData = scenes.find((s) => s.id === currentScene);
	const allDone = generatedCount === scenes.length && scenes.length > 0;

	return (
		<div className="flex flex-col gap-5">
			{/* ── GENERATE ACTION BUTTONS ── */}
			<section className="card">
				<div className="section-label">🚀 Generate Semua Prompt</div>

				<div className="flex items-center gap-3 mb-4">
					<div className="flex-1 h-2 bg-bark/50 rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{
								width: `${progressPct}%`,
								background: allDone
									? "linear-gradient(90deg, #7ab648, #96d45a)"
									: "linear-gradient(90deg, #3d5c2e, #7ab648, #d4941a)",
							}}
						/>
					</div>
					<span className="font-mono text-[10px] text-stone2 whitespace-nowrap">
						{generatedCount}/{scenes.length}
						{allDone && <span className="ml-1 text-leaf2">✓ Selesai!</span>}
					</span>
				</div>

				{/* Generate buttons */}
				<div className="flex flex-col gap-2">
					<button
						type="button"
						disabled={isGeneratingAll}
						onClick={onGenerateAll}
						className="w-full rounded-xl font-bold py-3 px-6 text-sm font-sans transition-all duration-150 flex items-center justify-center gap-2"
						style={{
							background: isGeneratingAll
								? "rgba(122,182,72,0.15)"
								: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
							border: "none",
							color: isGeneratingAll ? "var(--leaf)" : "#fff",
							boxShadow: isGeneratingAll
								? "none"
								: "0 4px 18px rgba(61,92,46,0.45)",
						}}
					>
						{isGeneratingAll ? (
							<>
								<span className="animate-pulse">⏳</span> Generating semua
								scene...
							</>
						) : (
							<>
								<span>🎬</span> Generate All {scenes.length} Scene Prompt
							</>
						)}
					</button>

					{/* Generate with video button */}
					<button
						type="button"
						disabled={isGeneratingAll}
						onClick={onGenerateAllWithVideo}
						className="w-full rounded-xl font-bold py-3 px-6 text-sm font-sans transition-all duration-150 flex items-center justify-center gap-2"
						style={{
							background: isGeneratingAll
								? "rgba(212,148,26,0.08)"
								: "rgba(212,148,26,0.15)",
							border: "1.5px solid rgba(212,148,26,0.4)",
							color: isGeneratingAll ? "rgba(232,171,48,0.4)" : "var(--amber2)",
						}}
					>
						<span>🎞️</span>
						Generate All + Export Script for Claude Code (Remotion)
					</button>
				</div>

				<div className="mt-2 font-mono text-[9px] text-stone2/70 leading-relaxed">
					Tombol kedua akan generate semua prompt lalu memberikan script siap
					pakai untuk terminal Claude Code + Remotion.
				</div>
			</section>

			{/* ── CURRENT SCENE PROMPT ── */}
			<section className="card">
				<div className="flex items-center justify-between mb-3">
					<div className="section-label mb-0">
						📄 Prompt Scene {currentScene}
						{currentSceneData?.generatedPrompt && (
							<span className="ml-2 font-mono text-[8px] px-2 py-0.5 rounded-full bg-leaf/20 border border-leaf/30 text-leaf2 uppercase">
								✓ Done
							</span>
						)}
					</div>
					{currentSceneData?.generatedPrompt && (
						<button
							type="button"
							className="btn-ghost text-[9px] py-1 px-2"
							onClick={() => onCopyPrompt(currentScene)}
						>
							📋 Copy
						</button>
					)}
				</div>

				<div className="prompt-box min-h-45">{promptOutput}</div>

				<div className="flex gap-2 mt-3">
					<button
						type="button"
						className="btn-ghost flex-1 py-2 text-xs"
						disabled={currentScene <= 1}
						onClick={() => onSelectScene(currentScene - 1)}
					>
						← Sebelumnya
					</button>
					<button
						type="button"
						className="btn-ghost flex-1 py-2 text-xs"
						disabled={currentScene >= scenes.length}
						onClick={() => onSelectScene(currentScene + 1)}
					>
						Berikutnya →
					</button>
				</div>
			</section>

			{/* ── EXPORT ALL ── */}
			{allPrompts.length > 0 && (
				<section className="card">
					<div className="section-label">📦 Export Semua Prompt</div>

					<div className="grid grid-cols-3 gap-2 mb-4">
						{[
							["Scene", `${scenes.length}`],
							["Video", `${dna.totalDurationSec}s`],
							["Theme", dna.theme.split("-").slice(0, 2).join(" ")],
						].map(([label, value]) => (
							<div
								key={label}
								className="rounded-lg bg-bark/30 border border-leaf/10 px-3 py-2 text-center"
							>
								<div className="font-mono text-[8px] text-stone2 uppercase tracking-wider">
									{label}
								</div>
								<div className="font-playfair text-sm text-cream font-bold truncate">
									{value}
								</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-2 gap-2 mb-4">
						<button
							type="button"
							className="btn-primary py-2.5 text-sm"
							onClick={onCopyAll}
						>
							📋 Copy Semua
						</button>
						<button
							type="button"
							className="btn-amber py-2.5 text-sm"
							onClick={onDownload}
						>
							💾 Download .txt
						</button>
					</div>

					<button
						type="button"
						className="btn-ghost w-full py-2 text-sm mb-4"
						onClick={() => onSetShowAll(!showAllPrompts)}
					>
						{showAllPrompts
							? "🙈 Sembunyikan Preview"
							: "👁 Preview Semua Prompt"}
					</button>

					{/* All prompts preview */}
					{showAllPrompts && (
						<div className="flex flex-col gap-3">
							{allPrompts.map((prompt, i) => (
								<div
									key={i}
									className="rounded-xl border border-leaf/15 overflow-hidden"
								>
									<div className="flex items-center justify-between px-4 py-2 bg-bark/40 border-b border-leaf/10">
										<span className="font-mono text-[10px] text-leaf2 font-bold">
											Scene {i + 1}/{scenes.length}
										</span>
										<button
											type="button"
											className="font-mono text-[9px] text-stone2 hover:text-leaf2 transition-colors"
											onClick={async () =>
												await navigator.clipboard.writeText(prompt)
											}
										>
											📋 Copy
										</button>
									</div>
									<div className="prompt-box text-[10px] max-h-44 rounded-none border-0">
										{prompt}
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}

// ─── REMOTION MODAL ───────────────────────────────────────────────────────────

export function RemotionModal({
	script,
	onClose,
}: {
	script: string;
	onClose: () => void;
}) {
	async function copyScript() {
		await navigator.clipboard.writeText(script);
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ background: "rgba(10,18,10,0.85)", backdropFilter: "blur(8px)" }}
		>
			<div
				className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
				style={{
					background: "rgba(26,46,26,0.97)",
					border: "1px solid rgba(122,182,72,0.3)",
				}}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-leaf/15">
					<div>
						<div className="font-playfair text-lg font-bold text-cream">
							🎞️ Generate Video dengan Claude Code
						</div>
						<div className="font-mono text-[9px] text-stone2 mt-0.5">
							Remotion + Claude Code Terminal Script
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="btn-ghost text-sm px-3 py-1.5"
					>
						✕ Tutup
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-5">
					{/* Step guide */}
					<div className="rounded-xl bg-amber/8 border border-amber/25 p-4 mb-4">
						<div className="font-mono text-[9px] text-amber2 uppercase tracking-wider mb-3">
							📋 Cara Pakai — 3 Langkah
						</div>
						<ol className="flex flex-col gap-2">
							{[
								[
									"Install Remotion Skill",
									"Di terminal Claude Code: npx skills add remotion dev skill",
								],
								[
									"Copy Script di bawah",
									"Lalu paste ke terminal Claude Code kamu",
								],
								[
									"Preview & Export",
									"Claude akan buat Remotion project, buka browser preview, lalu export MP4",
								],
							].map(([title, desc], i) => (
								<li key={i} className="flex items-start gap-3">
									<span className="font-mono text-[11px] font-bold text-amber2 shrink-0 mt-0.5">
										{i + 1}.
									</span>
									<div>
										<div className="font-mono text-[10px] text-cream font-bold">
											{title}
										</div>
										<div className="font-mono text-[9px] text-stone2">
											{desc}
										</div>
									</div>
								</li>
							))}
						</ol>
					</div>

					{/* Info box */}
					<div className="rounded-xl bg-forest/60 border border-leaf/15 px-4 py-3 mb-4">
						<div className="font-mono text-[9px] text-stone2 leading-relaxed">
							⚠ <strong className="text-leaf2">Requirement:</strong> Claude
							Pro/Max account + Claude Code terinstall di komputer kamu. Ini
							adalah approach yang realistis karena Remotion membutuhkan Node.js
							runtime lokal untuk render video. Deploy ke server/Vercel tidak
							memungkinkan untuk render video berdurasi panjang.
						</div>
					</div>

					{/* Script */}
					<div className="rounded-xl border border-leaf/15 overflow-hidden">
						<div className="flex items-center justify-between px-4 py-2.5 bg-bark/50 border-b border-leaf/10">
							<span className="font-mono text-[10px] text-leaf2 font-bold">
								Claude Code Terminal Script
							</span>
							<button
								type="button"
								onClick={copyScript}
								className="btn-ghost text-[9px] py-1 px-2"
							>
								📋 Copy Script
							</button>
						</div>
						<pre className="prompt-box text-[10px] max-h-64 rounded-none border-0 whitespace-pre-wrap">
							{script}
						</pre>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-2 px-5 py-4 border-t border-leaf/15">
					<button
						type="button"
						className="btn-primary flex-1 py-2.5"
						onClick={copyScript}
					>
						📋 Copy Script ke Clipboard
					</button>
					<button
						type="button"
						className="btn-ghost py-2.5 px-4"
						onClick={onClose}
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
}
