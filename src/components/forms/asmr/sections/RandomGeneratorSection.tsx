"use client";

import { RANDOM_IDS } from "../constants";
import type { AsmrTimelapseGenerator, RandomGroupKey } from "../types";

export default function RandomGeneratorSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎲 Random Generator</div>
			<div className="flex flex-wrap gap-2">
				{(Object.keys(RANDOM_IDS) as RandomGroupKey[]).map((k) => (
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
				<label className="rnd-toggle checked opacity-60 pointer-events-none">
					<input type="checkbox" checked readOnly />
					<span>DNA (Terkunci)</span>
				</label>
			</div>
			<div className="flex flex-wrap gap-2 mt-3">
				<button type="button" className="btn-outline" onClick={gen.randomCurrentScene}>
					🎲 Random Scene Ini
				</button>
				<button type="button" className="btn-outline" onClick={gen.randomAllScenes}>
					🎰 Random Semua 12 Scene
				</button>
				<button type="button" className="btn-amber" onClick={gen.randomSceneType}>
					🎴 Random Fase Pekerjaan
				</button>
			</div>
		</section>
	);
}

