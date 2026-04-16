"use client";

import { SCENE_TYPE_LABELS } from "../constants";
import type { SceneTypeKey, WarMusicVideoGenerator } from "../types";

export default function SceneTypeSection({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">
				🏷️ Tipe Adegan Scene
				<span className="ml-auto font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-leaf2">
					{SCENE_TYPE_LABELS[gen.scType]}
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{(Object.keys(SCENE_TYPE_LABELS) as SceneTypeKey[]).map((k) => (
					<button
						key={k}
						type="button"
						onClick={() => gen.setSceneTypeForScene(gen.currentScene, k)}
						className={`phase-chip ${gen.scType === k ? "active" : ""}`}
					>
						{SCENE_TYPE_LABELS[k]}
					</button>
				))}
			</div>
		</section>
	);
}

