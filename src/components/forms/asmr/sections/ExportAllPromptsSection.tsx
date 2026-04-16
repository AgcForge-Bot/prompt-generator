"use client";

import { SCENE_TYPES, SEC_PER_SCENE, TOTAL_SCENES } from "../constants";
import type { AsmrTimelapseGenerator, SceneTypeKey } from "../types";
import { mmss } from "../utils";

export default function ExportAllPromptsSection({
	gen,
}: {
	gen: AsmrTimelapseGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">📦 Export Semua Prompt</div>
			<div className="flex flex-wrap gap-2">
				<button type="button" className="btn-primary" onClick={gen.generateAll}>
					🎬 Generate Semua 12 Prompt
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
						const sceneType = (gen.sceneTypes[s] ?? gen.scType) as SceneTypeKey;
						const label =
							(gen.projectType === "restoration"
								? SCENE_TYPES.restoration[
										sceneType as keyof typeof SCENE_TYPES.restoration
									]
								: SCENE_TYPES.construction[
										sceneType as keyof typeof SCENE_TYPES.construction
									]) ?? String(sceneType);
						return (
							<div key={s} className="rounded-lg border border-leaf/15 bg-bark/20 p-3">
								<div className="font-mono text-[10px] text-stone2 mb-2">
									◆ Scene {s}/{TOTAL_SCENES} · {mmss(i * SEC_PER_SCENE)}–
									{mmss((i + 1) * SEC_PER_SCENE)} ·{" "}
									<span className="text-leaf2">[{label}]</span>
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

