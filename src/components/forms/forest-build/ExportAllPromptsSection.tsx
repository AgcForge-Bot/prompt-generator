"use client";

import type { SceneConfig, StoryModeKey } from "./types";
import { PHASE_META } from "./utils";

export default function ExportAllPromptsSection({
	totalScenes,
	onGenerateAll,
	storyMode,
	onGenerateAllWithAI,
	isGeneratingAI,
	onCopyAll,
	onDownloadAllJson,
	showAllPrompts,
	setShowAllPrompts,
	allPrompts,
	scenes,
}: {
	totalScenes: number;
	onGenerateAll: () => void;
	storyMode: StoryModeKey;
	onGenerateAllWithAI: () => void;
	isGeneratingAI: boolean;
	onCopyAll: () => void;
	onDownloadAllJson: () => void;
	showAllPrompts: boolean;
	setShowAllPrompts: (v: boolean) => void;
	allPrompts: string[];
	scenes: SceneConfig[];
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">📤 Export Semua Prompt</div>
			<p className="font-mono text-[11px] text-stone2 mb-4 leading-relaxed">
				Generate semua{" "}
				<span className="text-leaf2 font-bold">{totalScenes}</span> prompt
				sekaligus.
			</p>
			<div className="flex gap-2 flex-wrap mb-4">
				{storyMode !== "ai-film" && (
					<button className="btn-primary" onClick={onGenerateAll}>
						🎬 Generate Semua {totalScenes} Prompt
					</button>
				)}
				{storyMode === "ai-film" && (
					<button
						className="btn-amber"
						onClick={onGenerateAllWithAI}
						disabled={isGeneratingAI}
					>
						🤖 Generate All With AI
					</button>
				)}
				<button className="btn-ghost" onClick={onCopyAll}>
					📋 Copy Semua
				</button>
				<button className="btn-ghost" onClick={onDownloadAllJson}>
					💾 Download JSON
				</button>
				<button
					className="btn-ghost"
					onClick={() => setShowAllPrompts(!showAllPrompts)}
				>
					👁 {showAllPrompts ? "Sembunyikan" : "Lihat Semua"}
				</button>
			</div>
			{showAllPrompts && allPrompts.length > 0 && (
				<div className="space-y-3 max-h-150 overflow-y-auto">
					{allPrompts.map((p, i) => {
						const sc2 = scenes[i];
						return (
							<div
								key={i}
								className={`rounded-xl p-4 border-l-4 ${sc2?.isEmotional ? "border-amber bg-amber/5" : "border-moss2 bg-bark/30"} border border-leaf/10`}
							>
								<div className="font-mono text-[9px] text-leaf mb-2 uppercase tracking-wide">
									◆ Scene {i + 1}/{totalScenes}
									{sc2
										? " · " +
											PHASE_META[sc2.phase].emoji +
											" " +
											PHASE_META[sc2.phase].label
										: ""}
									{sc2?.isEmotional ? " · ⭐ EMOTIONAL" : ""}
								</div>
								<pre className="font-mono text-[9.5px] text-stone2 whitespace-pre-wrap wrap-break-word leading-relaxed">
									{p}
								</pre>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}
