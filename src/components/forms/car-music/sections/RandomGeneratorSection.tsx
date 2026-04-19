"use client";

import type { CarMusicVideoGenerator, TabKey } from "../types";

export default function RandomGeneratorSection({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎲 Random Generator</div>
			<div className="flex flex-wrap gap-2">
				{(gen.tabs.map((t) => t.key) as TabKey[]).map((k) => (
					<label key={k} className={`rnd-toggle ${gen.randomGroups[k] ? "checked" : ""}`}>
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
				<button type="button" className="btn-outline" onClick={gen.randomizeCurrentScene}>
					🎲 Random Scene Ini
				</button>
				<button type="button" className="btn-outline" onClick={gen.randomAllScenes}>
					🎰 Random Semua {gen.totalScenes} Scene
				</button>
				{gen.clipMode === "classic" && (
					<button type="button" className="btn-amber" onClick={gen.randomSceneType}>
						🎴 Random Tipe Adegan
					</button>
				)}
			</div>
		</section>
	);
}
