"use client";

import { SCENE_TYPES } from "../constants";
import type { RelaxingMusicVideoGenerator } from "../types";

export default function ExportAllPromptsSection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">📦 Export Semua Prompt</div>
			<div className="flex flex-wrap gap-2">
				<button type="button" className="btn-primary" onClick={gen.generateAll}>
					🎬 Generate Semua {gen.totalScenes} Prompt
				</button>
				<button type="button" className="btn-outline" onClick={gen.copyAll}>
					📋 Copy Semua
				</button>
				<button
					type="button"
					className="btn-ghost"
					onClick={() => gen.setShowAllPrompts(!gen.showAllPrompts)}
				>
					👁 Lihat / Sembunyikan
				</button>
			</div>
			{gen.showAllPrompts && gen.allPrompts.length > 0 && (
				<div className="mt-4 flex flex-col gap-2">
					{gen.allPrompts.map((p, i) => {
						const s = i + 1;
						const sceneType = gen.sceneTypes[s] ?? gen.scType;
						return (
							<div key={s} className="rounded-lg border border-leaf/15 bg-bark/20 p-3">
								<div className="font-mono text-[10px] text-stone2 mb-2">
									◆ Scene {s}/{gen.totalScenes} · {i * gen.secPerScene}s–
									{(i + 1) * gen.secPerScene}s ·{" "}
									<span className="text-leaf2">[{SCENE_TYPES[sceneType]}]</span>
								</div>
								<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
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
