"use client";

import { RANDOM_GROUP_FIELDS } from "../constants";
import type { RandomGroupKey, RelaxingMusicVideoGenerator } from "../types";

export default function RandomGeneratorSection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎲 Random Generator</div>
			<div className="flex flex-wrap gap-2">
				{(Object.keys(RANDOM_GROUP_FIELDS) as RandomGroupKey[]).map((k) => (
					<label
						key={k}
						className={`rnd-toggle ${gen.randomGroups[k] ? "checked" : ""}`}
					>
						<input
							type="checkbox"
							checked={gen.randomGroups[k]}
							onChange={() =>
								gen.setRandomGroups((p) => ({ ...p, [k]: !p[k] }))
							}
						/>
						<span className="capitalize">{k}</span>
					</label>
				))}
			</div>
			<div className="flex flex-wrap gap-2 mt-3">
				<button
					type="button"
					className="btn-outline"
					onClick={gen.randomizeCurrentScene}
				>
					🎲 Random Scene Ini
				</button>
				<button type="button" className="btn-outline" onClick={gen.randomAllScenes}>
					🎰 Random Semua 12 Scene
				</button>
				<button type="button" className="btn-amber" onClick={gen.randomSceneType}>
					🎴 Random Scene Type
				</button>
			</div>
		</section>
	);
}

