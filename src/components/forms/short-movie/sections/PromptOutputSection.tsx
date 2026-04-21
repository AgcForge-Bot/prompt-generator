"use-client";

import type { ShortMovieGeneratorConfig } from "../types";

export default function PromptOutputSection({
	gen,
}: {
	gen: ShortMovieGeneratorConfig;
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
				{/* Scene navigator */}
				<div className="flex items-center justify-between mb-4 flex-wrap gap-2">
					<span className="font-playfair text-lg italic text-sand">
						Scene Prompts
					</span>
					<div className="flex items-center gap-2">
						<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-leaf/10 text-leaf2 border border-leaf/25">
							{gen.allPrompts.length}/{gen.totalScenes} scenes
						</span>
					</div>
				</div>

				{/* Current scene viewer */}
				<div className="mb-3">
					<div className="flex items-center gap-2 mb-2 flex-wrap">
						<span className="font-mono text-[9px] text-leaf uppercase tracking-wider">
							◆ Scene {gen.currentScene}/{gen.totalScenes}
						</span>
						<div className="flex gap-1 flex-wrap">
							{[
								Math.max(1, gen.currentScene - 1),
								gen.currentScene,
								Math.min(gen.totalScenes, gen.currentScene + 1),
							]
								.filter((v, i, a) => a.indexOf(v) === i)
								.map((n) => (
									<button
										key={n}
										type="button"
										onClick={() => gen.setCurrentScene(n)}
										className={`w-7 h-7 rounded-lg font-mono text-[9px] font-bold border transition-all ${
											n === gen.currentScene
												? "bg-leaf/20 border-leaf text-leaf2"
												: "bg-bark/40 border-leaf/20 text-stone2 hover:border-leaf/50"
										}`}
									>
										{n}
									</button>
								))}
						</div>
					</div>
					<pre className="prompt-box font-mono text-[9.5px] text-stone2 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
						{gen.allPrompts[gen.currentScene - 1] ?? ""}
					</pre>
					<div className="flex gap-2 mt-2 flex-wrap">
						<button
							type="button"
							className="btn-ghost"
							onClick={gen.copyPrompt}
						>
							📋 Copy Scene {gen.currentScene}
						</button>
						<button
							type="button"
							className="btn-ghost"
							onClick={() =>
								gen.setCurrentScene(
									Math.min(gen.totalScenes, gen.currentScene + 1),
								)
							}
							disabled={gen.currentScene >= gen.totalScenes}
						>
							Next →
						</button>
					</div>
				</div>

				{/* Show/hide all prompts */}
				<button
					type="button"
					className="btn-outline w-full mb-3"
					onClick={() => gen.setShowAllPrompts(!gen.showAllPrompts)}
				>
					👁 {gen.showAllPrompts ? "Sembunyikan" : "Lihat"} Semua{" "}
					{gen.totalScenes} Scene
				</button>

				{gen.showAllPrompts && (
					<div className="space-y-3 max-h-150 overflow-y-auto">
						{gen.allPrompts.map((p, i) => (
							<div
								key={i}
								className={`rounded-xl p-4 border-l-4 ${
									i === 0 || i === gen.allPrompts.length - 1
										? "border-amber bg-amber/5"
										: "border-moss2 bg-bark/30"
								} border border-leaf/10`}
							>
								<div className="font-mono text-[9px] text-leaf mb-2 uppercase tracking-wide">
									◆ Scene {i + 1}/{gen.totalScenes}
									{i === 0
										? " · 🎬 TEASER HOOK"
										: i === gen.allPrompts.length - 1
											? " · 🎬 CLOSING CREDITS"
											: ""}
								</div>
								<pre className="font-mono text-[9.5px] text-stone2 whitespace-pre-wrap leading-relaxed">
									{p}
								</pre>
							</div>
						))}
					</div>
				)}

				{/* SEO PACK */}
				{gen.seoPack && (
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

						{/* Title */}
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
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-sand mb-4">
							{gen.seoPack.title}
						</div>

						{/* Description */}
						<div className="flex items-center justify-between gap-2 mb-2">
							<div className="font-mono text-[10px] text-stone2">Deskripsi</div>
							<button
								type="button"
								className="btn-ghost text-[10px] py-1 px-3"
								onClick={gen.copySeoDescription}
							>
								📋 Copy
							</button>
						</div>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 mb-4">
							<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
								{gen.seoPack.description}
							</pre>
						</div>

						{/* Tags */}
						<div className="flex items-center justify-between gap-2 mb-2">
							<div className="font-mono text-[10px] text-stone2">
								Tags ({gen.seoPack.tags.length})
							</div>
							<button
								type="button"
								className="btn-ghost text-[10px] py-1 px-3"
								onClick={gen.copySeoTags}
							>
								📋 Copy
							</button>
						</div>
						<div className="flex flex-wrap gap-1 mb-4">
							{gen.seoPack.tags.map((t) => (
								<span
									key={t}
									className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bark/40 border border-stone/20 text-stone2"
								>
									{t}
								</span>
							))}
						</div>

						{/* Thumbnail */}
						<div className="flex items-center justify-between gap-2 mb-2">
							<div className="font-mono text-[10px] text-stone2">
								Thumbnail Prompt
							</div>
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
			</div>
		</section>
	);
}
