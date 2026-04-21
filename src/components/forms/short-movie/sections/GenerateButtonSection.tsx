"use-client";

import type { ShortMovieGeneratorConfig } from "../types";

export default function GenerateButtonSection({
	gen,
}: {
	gen: ShortMovieGeneratorConfig;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🚀 Generate</div>
			<div className="flex gap-3 flex-wrap items-center">
				<button
					type="button"
					className="btn-amber"
					onClick={gen.generateAllWithAI}
					disabled={gen.isGenerating}
				>
					<span className="inline-flex items-center gap-2">
						{gen.isGenerating && (
							<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
						)}
						{gen.isGenerating
							? `⏳ Generating ${gen.totalScenes} scenes...`
							: `🎬 Generate ${gen.totalScenes} Scene Short Film`}
					</span>
				</button>
				{gen.allPrompts.length > 0 && (
					<>
						<button type="button" className="btn-ghost" onClick={gen.copyAll}>
							📋 Copy Semua
						</button>
						<button
							type="button"
							className="btn-ghost"
							onClick={gen.downloadAllJson}
						>
							💾 Download JSON
						</button>
						<button
							type="button"
							className="btn-ghost"
							onClick={gen.downloadAllZip}
						>
							🗜️ Download All (ZIP)
						</button>
					</>
				)}
			</div>
			{gen.isGenerating && (
				<div className="mt-4 p-3 rounded-xl bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2 leading-relaxed">
					🤖 AI sedang menulis {gen.totalScenes} scene short film... Proses ini
					memakan waktu 30–90 detik tergantung jumlah scene dan provider AI yang
					dipilih.
				</div>
			)}
		</section>
	);
}
