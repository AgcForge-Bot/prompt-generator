"use client";

import type { SceneConfig, SeoPack, StoryModeKey } from "./types";
import { PHASE_META } from "./utils";

export default function PromptOutputSection({
	promptOutput,
	sc,
	currentScene,
	totalScenes,
	onGeneratePrompt,
	onCopyPrompt,
	onCopyAll,
	onNextScene,
	storyMode,
	seoPack,
	onCopySeoTitle,
	onCopySeoDescription,
	onCopySeoTags,
	onCopySeoThumbnailPrompt,
	onDownloadSeoPackJson,
	onDownloadSeoPackTxt,
}: {
	promptOutput: string;
	sc: SceneConfig | null;
	currentScene: number;
	totalScenes: number;
	onGeneratePrompt: () => void;
	onCopyPrompt: () => void;
	onCopyAll: () => void;
	onNextScene: () => void;
	storyMode: StoryModeKey;
	seoPack: SeoPack | null;
	onCopySeoTitle: () => void;
	onCopySeoDescription: () => void;
	onCopySeoTags: () => void;
	onCopySeoThumbnailPrompt: () => void;
	onDownloadSeoPackJson: () => void;
	onDownloadSeoPackTxt: () => void;
}) {
	return (
		<section
			className="mb-5 rounded-2xl overflow-hidden"
			style={{
				background: "rgba(10,20,10,0.88)",
				border: "1px solid rgba(122,182,72,0.2)",
				boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
			}}
		>
			<div className="h-0.5 bg-linear-to-r from-moss via-leaf2 to-amber" />
			<div className="p-6">
				<div className="flex items-center justify-between mb-3 flex-wrap gap-2">
					<span className="font-playfair text-lg italic text-sand">
						Generated Prompt
					</span>
					<div className="flex items-center gap-2">
						{sc?.isEmotional && (
							<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-amber/15 text-amber2 border border-amber/30">
								⭐ EMOTIONAL
							</span>
						)}
						{sc && (
							<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-amber/10 text-amber2 border border-amber/25">
								{PHASE_META[sc.phase]?.emoji} {PHASE_META[sc.phase]?.label}
							</span>
						)}
						<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-leaf/10 text-leaf2 border border-leaf/25">
							Scene {currentScene}/{totalScenes}
						</span>
					</div>
				</div>
				<div className="prompt-box">{promptOutput}</div>
				<div className="flex gap-2 flex-wrap mt-3">
					{storyMode !== "ai-film" && (
						<button className="btn-primary" onClick={onGeneratePrompt}>
							⚡ Generate
						</button>
					)}
					<button className="btn-ghost" onClick={onCopyPrompt}>
						📋 Copy
					</button>
					<button className="btn-ghost" onClick={onCopyAll}>
						📋 Copy Semua
					</button>
					<button className="btn-ghost ml-auto" onClick={onNextScene}>
						Next →
					</button>
				</div>

				{storyMode === "ai-film" && seoPack && (
					<div className="rounded-xl border border-leaf/15 bg-bark/20 p-4 mt-4">
						<div className="flex items-center justify-between gap-2 mb-3">
							<div className="font-mono text-[9px] text-stone2 uppercase tracking-wider">
								📈 SEO Pack (AI)
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="btn-outline text-[10px] py-1 px-3"
									onClick={onDownloadSeoPackJson}
								>
									⬇️ JSON
								</button>
								<button
									type="button"
									className="btn-outline text-[10px] py-1 px-3"
									onClick={onDownloadSeoPackTxt}
								>
									⬇️ TXT
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between gap-2 mb-2">
							<div className="font-mono text-[10px] text-stone2">Judul</div>
							<button
								type="button"
								className="btn-ghost text-[10px] py-1 px-3"
								onClick={onCopySeoTitle}
							>
								📋 Copy
							</button>
						</div>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-stone2 whitespace-pre-wrap">
							{seoPack.title}
						</div>

						<div className="flex items-center justify-between gap-2 mt-4 mb-2">
							<div className="font-mono text-[10px] text-stone2">Deskripsi</div>
							<button
								type="button"
								className="btn-ghost text-[10px] py-1 px-3"
								onClick={onCopySeoDescription}
							>
								📋 Copy
							</button>
						</div>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
							<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
								{seoPack.description}
							</pre>
						</div>

						<div className="flex items-center justify-between gap-2 mt-4 mb-2">
							<div className="font-mono text-[10px] text-stone2">Tags (30)</div>
							<button
								type="button"
								className="btn-ghost text-[10px] py-1 px-3"
								onClick={onCopySeoTags}
							>
								📋 Copy
							</button>
						</div>
						<div className="flex flex-wrap gap-1">
							{seoPack.tags.map((t) => (
								<span
									key={t}
									className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bark/40 border border-stone/20 text-stone2"
								>
									{t}
								</span>
							))}
						</div>

						<div className="flex items-center justify-between gap-2 mt-4 mb-2">
							<div className="font-mono text-[10px] text-stone2">Thumbnail Prompt</div>
							<button
								type="button"
								className="btn-ghost text-[10px] py-1 px-3"
								onClick={onCopySeoThumbnailPrompt}
							>
								📋 Copy
							</button>
						</div>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
							<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
								{seoPack.thumbnailPrompt}
							</pre>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
