"use client";

import type { SceneConfig, PromoDNA } from "../types";
import { SCENE_TYPE_META } from "../constants";

type Props = {
	dna: PromoDNA;
	scenes: SceneConfig[];
	currentScene: number;
	setCurrentScene: (id: number) => void;
	generatedCount: number;
	isGeneratingSingle: boolean;
	isGeneratingAll: boolean;
	allPrompts: string[];
	showAllPrompts: boolean;
	setShowAllPrompts: (v: boolean) => void;
	onGenerateSingle: (id?: number) => void;
	onGenerateAll: () => void;
	onCopySingle: (id?: number) => void;
	onCopyAll: () => void;
};

export default function SceneOutputSection({
	dna,
	scenes,
	currentScene,
	setCurrentScene,
	generatedCount,
	isGeneratingSingle,
	isGeneratingAll,
	allPrompts,
	showAllPrompts,
	setShowAllPrompts,
	onGenerateSingle,
	onGenerateAll,
	onCopySingle,
	onCopyAll,
}: Props) {
	const currentSceneData =
		scenes.find((s) => s.id === currentScene) ?? scenes[0];

	return (
		<div>
			{/* Scene Navigator */}
			<section className="card mb-5">
				<div className="section-label">🗺️ Navigasi Scene</div>

				{/* Progress */}
				<div className="flex items-center gap-3 mb-4">
					<div className="flex-1 h-1.5 bg-bark/50 rounded-full overflow-hidden">
						<div
							className="h-full bg-linear-to-r from-moss via-leaf to-amber2 rounded-full transition-all duration-500"
							style={{
								width: `${scenes.length > 0 ? (generatedCount / scenes.length) * 100 : 0}%`,
							}}
						/>
					</div>
					<span className="font-mono text-[9px] text-stone2 whitespace-nowrap">
						{generatedCount}/{scenes.length} prompt
					</span>
				</div>

				{/* Scene chips */}
				<div className="flex flex-wrap gap-1.5 mb-4">
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
								className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-mono text-[9px] transition-all ${
									isActive
										? "border-leaf bg-moss/30 text-leaf2 font-bold"
										: hasPrompt
											? "border-leaf/35 bg-moss/10 text-leaf"
											: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
								}`}
							>
								<span>{meta.emoji}</span>
								<span>{scene.id}</span>
								{hasPrompt && <span className="text-[7px]">✓</span>}
							</button>
						);
					})}
				</div>

				{/* Current scene info */}
				{currentSceneData && (
					<div className="rounded-xl bg-bark/30 border border-leaf/15 p-3 mb-4">
						<div className="flex items-center justify-between mb-1">
							<span className="font-mono text-[10px] text-leaf uppercase tracking-wider">
								Scene {currentSceneData.id} / {scenes.length}
							</span>
							<span className="font-mono text-[9px] text-stone2">
								{currentSceneData.duration} detik
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-lg">
								{SCENE_TYPE_META[currentSceneData.sceneType].emoji}
							</span>
							<span className="font-playfair text-sm text-cream font-bold">
								{SCENE_TYPE_META[currentSceneData.sceneType].label}
							</span>
						</div>
					</div>
				)}

				{/* Generate buttons */}
				<div className="flex gap-2 flex-wrap">
					<button
						type="button"
						className="btn-primary flex-1"
						disabled={isGeneratingSingle || isGeneratingAll}
						onClick={() => onGenerateSingle(currentScene)}
					>
						{isGeneratingSingle ? "⏳ Generating..." : "⚡ Generate Scene Ini"}
					</button>
					<button
						type="button"
						className="btn-amber flex-1"
						disabled={isGeneratingAll || isGeneratingSingle}
						onClick={onGenerateAll}
					>
						{isGeneratingAll
							? "⏳ Generating..."
							: `🎬 Generate Semua (${scenes.length})`}
					</button>
				</div>
			</section>

			{/* Prompt Output */}
			<section className="card mb-5">
				<div className="flex items-center justify-between mb-3">
					<div className="font-mono text-[9px] text-leaf uppercase tracking-wider flex items-center gap-2">
						<span>📄 Output Prompt</span>
						<span className="text-stone2">— Scene {currentScene}</span>
					</div>
					{currentSceneData?.generatedPrompt && (
						<button
							type="button"
							className="btn-ghost text-[10px] py-1 px-2"
							onClick={() => onCopySingle(currentScene)}
						>
							📋 Copy
						</button>
					)}
				</div>

				<div className="prompt-box">
					{currentSceneData?.generatedPrompt || (
						<span className="text-stone2 italic">
							Klik &quot;Generate Scene Ini&quot; untuk membuat prompt scene{" "}
							{currentScene}...
						</span>
					)}
				</div>

				{/* Nav arrows */}
				<div className="flex gap-2 mt-3">
					<button
						type="button"
						className="btn-ghost flex-1"
						disabled={currentScene <= 1}
						onClick={() => setCurrentScene(currentScene - 1)}
					>
						← Scene Sebelumnya
					</button>
					<button
						type="button"
						className="btn-ghost flex-1"
						disabled={currentScene >= scenes.length}
						onClick={() => setCurrentScene(currentScene + 1)}
					>
						Scene Berikutnya →
					</button>
				</div>
			</section>

			{/* Export All */}
			{allPrompts.length > 0 && (
				<section className="card mb-5">
					<div className="section-label">📦 Export Semua Prompt</div>
					<div className="flex gap-2 mb-4">
						<button
							type="button"
							className="btn-primary flex-1"
							onClick={onCopyAll}
						>
							📋 Copy Semua ke Clipboard
						</button>
						<button
							type="button"
							className="btn-outline"
							onClick={() => setShowAllPrompts(!showAllPrompts)}
						>
							{showAllPrompts ? "🙈 Sembunyikan" : "👁 Lihat Semua"}
						</button>
					</div>

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
											<button
												type="button"
												className="font-mono text-[9px] text-stone2 hover:text-cream transition-colors"
												onClick={async () => {
													await navigator.clipboard.writeText(prompt);
												}}
											>
												📋 Copy
											</button>
										</div>
										<div className="prompt-box max-h-52 text-[10px] rounded-none border-none">
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
