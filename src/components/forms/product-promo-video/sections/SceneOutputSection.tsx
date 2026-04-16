"use client";

import type { SceneConfig, PromoDNA } from "../types";
import { SCENE_TYPE_META } from "../constants";

type Props = {
	dna: PromoDNA;
	scenes: SceneConfig[];
	currentScene: number;
	setCurrentScene: (id: number) => void;
	generatedCount: number;
	progressPct: number;
	isGeneratingSingle: boolean;
	isGeneratingAll: boolean;
	allPrompts: string[];
	showAllPrompts: boolean;
	setShowAllPrompts: (v: boolean) => void;
	onGenerateSingle: (id?: number) => void;
	onGenerateAll: () => void;
	onCopySingle: (id?: number) => void;
	onCopyAll: () => void;
	onDownload: () => void;
};

export default function SceneOutputSection({
	dna,
	scenes,
	currentScene,
	setCurrentScene,
	generatedCount,
	progressPct,
	isGeneratingSingle,
	isGeneratingAll,
	allPrompts,
	showAllPrompts,
	setShowAllPrompts,
	onGenerateSingle,
	onGenerateAll,
	onCopySingle,
	onCopyAll,
	onDownload,
}: Props) {
	const currentSceneData =
		scenes.find((s) => s.id === currentScene) ?? scenes[0];
	const isAllDone = generatedCount === scenes.length && scenes.length > 0;

	return (
		<div>
			{/* ── SCENE NAVIGATOR ── */}
			<section className="card mb-5">
				<div className="section-label">🗺️ Navigator Scene</div>

				{/* Progress bar */}
				<div className="flex items-center gap-3 mb-4">
					<div className="flex-1 h-2 bg-bark/50 rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-700"
							style={{
								width: `${progressPct}%`,
								background:
									progressPct === 100
										? "linear-gradient(90deg, #7ab648, #96d45a)"
										: "linear-gradient(90deg, #3d5c2e, #7ab648, #d4941a)",
							}}
						/>
					</div>
					<span className="font-mono text-[10px] text-stone2 whitespace-nowrap">
						{generatedCount}/{scenes.length}
						{isAllDone && <span className="ml-1 text-leaf2"> ✓ Selesai!</span>}
					</span>
				</div>

				{/* Scene chips */}
				<div className="flex flex-wrap gap-1.5 mb-4 max-h-32 overflow-y-auto p-1">
					{scenes.map((scene) => {
						const meta = SCENE_TYPE_META[scene.sceneType];
						const isActive = scene.id === currentScene;
						const hasPrompt = Boolean(scene.generatedPrompt);
						return (
							<button
								key={scene.id}
								type="button"
								onClick={() => setCurrentScene(scene.id)}
								title={`Scene ${scene.id}: ${meta.label}`}
								className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[9px] transition-all whitespace-nowrap ${
									isActive
										? "border-leaf bg-moss/30 text-leaf2 font-bold"
										: hasPrompt
											? "border-leaf/35 bg-moss/10 text-leaf"
											: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
								}`}
							>
								<span>{meta.emoji}</span>
								<span>{scene.id}</span>
								{hasPrompt && <span className="text-[7px] opacity-70">✓</span>}
							</button>
						);
					})}
				</div>

				{/* Current scene info card */}
				{currentSceneData && (
					<div className="rounded-xl bg-bark/30 border border-leaf/15 p-3 mb-4">
						<div className="flex items-center justify-between mb-1">
							<span className="font-mono text-[9px] text-stone2 uppercase tracking-wider">
								Scene {currentSceneData.id} / {scenes.length}
							</span>
							<span className="font-mono text-[9px] text-stone2">
								{currentSceneData.duration} detik
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xl">
								{SCENE_TYPE_META[currentSceneData.sceneType].emoji}
							</span>
							<div>
								<div className="font-playfair text-sm text-cream font-bold">
									{SCENE_TYPE_META[currentSceneData.sceneType].label}
								</div>
								<div className="font-mono text-[9px] text-stone2">
									{dna.productName || "—"} · {dna.aspectRatio} ·{" "}
									{dna.cinematicStyle}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Generate buttons */}
				<div className="grid grid-cols-2 gap-2">
					<button
						type="button"
						className="btn-primary py-2.5 text-sm"
						disabled={isGeneratingSingle || isGeneratingAll}
						onClick={() => onGenerateSingle(currentScene)}
					>
						{isGeneratingSingle ? "⏳ Generating..." : "⚡ Scene Ini"}
					</button>
					<button
						type="button"
						className="btn-amber py-2.5 text-sm"
						disabled={isGeneratingAll || isGeneratingSingle}
						onClick={onGenerateAll}
					>
						{isGeneratingAll
							? "⏳ Generating..."
							: `🎬 Semua (${scenes.length})`}
					</button>
				</div>
			</section>

			{/* ── PROMPT OUTPUT ── */}
			<section className="card mb-5">
				<div className="flex items-center justify-between mb-3">
					<div className="font-mono text-[9px] text-leaf uppercase tracking-wider flex items-center gap-2">
						<span>📄 Output Prompt</span>
						<span className="text-stone2">
							— {SCENE_TYPE_META[currentSceneData?.sceneType]?.emoji} Scene{" "}
							{currentScene}
						</span>
					</div>
					{currentSceneData?.generatedPrompt && (
						<button
							type="button"
							className="btn-ghost text-[10px] py-1 px-3"
							onClick={() => onCopySingle(currentScene)}
						>
							📋 Copy
						</button>
					)}
				</div>

				<div className="prompt-box">
					{currentSceneData?.generatedPrompt ? (
						currentSceneData.generatedPrompt
					) : (
						<span className="text-stone2 italic">
							Klik &quot;⚡ Scene Ini&quot; untuk generate prompt scene{" "}
							{currentScene}...
						</span>
					)}
				</div>

				{/* Prev / Next nav */}
				<div className="flex gap-2 mt-3">
					<button
						type="button"
						className="btn-ghost flex-1 py-2 text-xs"
						disabled={currentScene <= 1}
						onClick={() => setCurrentScene(currentScene - 1)}
					>
						← Sebelumnya
					</button>
					<button
						type="button"
						className="btn-ghost flex-1 py-2 text-xs"
						disabled={currentScene >= scenes.length}
						onClick={() => setCurrentScene(currentScene + 1)}
					>
						Berikutnya →
					</button>
				</div>
			</section>

			{/* ── EXPORT ALL ── */}
			{allPrompts.length > 0 && (
				<section className="card mb-5">
					<div className="section-label">📦 Export Semua Prompt</div>

					{/* Summary */}
					<div className="grid grid-cols-3 gap-2 mb-4">
						{[
							["Scene", `${scenes.length} prompt`],
							["Produk", dna.productName || "—"],
							["Format", dna.aspectRatio],
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

					{/* Action buttons */}
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
						onClick={() => setShowAllPrompts(!showAllPrompts)}
					>
						{showAllPrompts
							? "🙈 Sembunyikan Preview"
							: "👁 Preview Semua Prompt"}
					</button>

					{/* Preview semua prompt */}
					{showAllPrompts && (
						<div className="flex flex-col gap-3">
							{allPrompts.map((prompt, i) => {
								const scene = scenes[i];
								const meta = scene ? SCENE_TYPE_META[scene.sceneType] : null;
								return (
									<div
										key={i}
										className="rounded-xl border border-leaf/15 overflow-hidden"
									>
										<div className="flex items-center justify-between px-4 py-2 bg-bark/40 border-b border-leaf/10">
											<span className="font-mono text-[10px] text-leaf2 font-bold">
												{meta?.emoji} Scene {i + 1} — {meta?.label}
											</span>
											<div className="flex items-center gap-2">
												<span className="font-mono text-[9px] text-stone2">
													{scene?.duration}s
												</span>
												<button
													type="button"
													className="font-mono text-[9px] text-stone2 hover:text-leaf2 transition-colors"
													onClick={async () => {
														await navigator.clipboard.writeText(prompt);
													}}
												>
													📋 Copy
												</button>
											</div>
										</div>
										<div className="prompt-box max-h-48 text-[10px] rounded-none border-0">
											{prompt}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
