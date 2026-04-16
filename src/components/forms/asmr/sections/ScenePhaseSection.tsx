"use client";

import { SCENE_TYPES } from "../constants";
import type { AsmrTimelapseGenerator, SceneTypeKey } from "../types";

export default function ScenePhaseSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">
				🏷️ Fase Pekerjaan Scene Ini
				<span className="ml-auto font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-leaf2">
					{gen.scTypeLabel}
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{(Object.entries(SCENE_TYPES[gen.projectType]) as [SceneTypeKey, string][]).map(
					([k, label]) => (
						<button
							key={k}
							type="button"
							onClick={() => gen.setSceneTypeForScene(gen.currentScene, k)}
							className={`phase-chip ${gen.scType === k ? "active" : ""}`}
						>
							{label}
						</button>
					),
				)}
			</div>
		</section>
	);
}

