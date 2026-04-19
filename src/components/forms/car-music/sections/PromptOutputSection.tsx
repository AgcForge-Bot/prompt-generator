"use client";

import { SCENE_TYPE_LABELS } from "../constants";
import type { CarMusicVideoGenerator } from "../types";

export default function PromptOutputSection({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">📝 Generated Prompt</div>
			<div className="flex items-center gap-2 mb-3">
				<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-stone2">
					Scene {gen.currentScene} / {gen.totalScenes}
				</span>
				{gen.clipMode === "classic" && (
					<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-moss/15 text-leaf2">
						{SCENE_TYPE_LABELS[gen.scType]}
					</span>
				)}
			</div>
			<div className="prompt-box">{gen.promptOutput}</div>
			<div className="flex flex-wrap gap-2 mt-3">
				<button type="button" className="btn-primary" onClick={gen.generatePrompt}>
					⚡ Generate Prompt Scene Ini
				</button>
				<button type="button" className="btn-outline" onClick={gen.copyPrompt}>
					📋 Copy
				</button>
				<button type="button" className="btn-amber" onClick={gen.nextScene}>
					Scene Berikutnya →
				</button>
			</div>

			{gen.clipMode === "trailer" && gen.seoPack && (
				<div className="rounded-xl border border-leaf/15 bg-bark/20 p-4 mt-4">
					<div className="flex items-center justify-between gap-2 mb-3">
						<div className="font-mono text-[9px] text-stone2 uppercase tracking-wider">
							📈 SEO Pack (AI)
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="btn-outline text-[10px] py-1 px-3"
								onClick={gen.downloadSeoPackJson}
							>
								⬇️ JSON
							</button>
							<button
								type="button"
								className="btn-outline text-[10px] py-1 px-3"
								onClick={gen.downloadSeoPackTxt}
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
							onClick={gen.copySeoTitle}
						>
							📋 Copy
						</button>
					</div>
					<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-stone2 whitespace-pre-wrap">
						{gen.seoPack.title}
					</div>

					<div className="flex items-center justify-between gap-2 mt-4 mb-2">
						<div className="font-mono text-[10px] text-stone2">Deskripsi</div>
						<button
							type="button"
							className="btn-ghost text-[10px] py-1 px-3"
							onClick={gen.copySeoDescription}
						>
							📋 Copy
						</button>
					</div>
					<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
						<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
							{gen.seoPack.description}
						</pre>
					</div>

					<div className="flex items-center justify-between gap-2 mt-4 mb-2">
						<div className="font-mono text-[10px] text-stone2">Tags (30)</div>
						<button
							type="button"
							className="btn-ghost text-[10px] py-1 px-3"
							onClick={gen.copySeoTags}
						>
							📋 Copy
						</button>
					</div>
					<div className="flex flex-wrap gap-1">
						{gen.seoPack.tags.map((t) => (
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
							onClick={gen.copySeoThumbnailPrompt}
						>
							📋 Copy
						</button>
					</div>
					<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
						<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
							{gen.seoPack.thumbnailPrompt}
						</pre>
					</div>
				</div>
			)}
		</section>
	);
}
