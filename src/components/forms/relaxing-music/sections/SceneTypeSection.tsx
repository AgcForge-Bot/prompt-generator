"use client";

import { SCENE_TYPES } from "../constants";
import type { RelaxingMusicVideoGenerator, SceneTypeKey } from "../types";

export default function SceneTypeSection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">
				🏷️ Scene Category
				<span className="ml-auto font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-leaf2">
					{gen.scTypeLabel}
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{(Object.keys(SCENE_TYPES) as SceneTypeKey[]).map((k) => (
					<button
						key={k}
						type="button"
						onClick={() => gen.setSceneTypeForScene(gen.currentScene, k)}
						className={`phase-chip ${gen.scType === k ? "active" : ""}`}
					>
						{SCENE_TYPES[k]}
					</button>
				))}
			</div>
		</section>
	);
}

