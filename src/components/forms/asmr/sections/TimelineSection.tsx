"use client";

import { SEC_PER_SCENE, TOTAL_SCENES } from "../constants";
import type { AsmrTimelapseGenerator } from "../types";
import { mmss } from "../utils";

export default function TimelineSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">🧩 Timeline Scene</div>
			<div className="flex flex-wrap gap-2">
				{Array.from({ length: TOTAL_SCENES }).map((_, i) => {
					const n = i + 1;
					const has = Boolean(gen.getSceneConfig(n).generatedPrompt);
					return (
						<button
							key={n}
							type="button"
							onClick={() => gen.setCurrentSceneSafe(n)}
							className={`font-mono text-[10px] px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
								n === gen.currentScene
									? "border-leaf bg-moss/20 text-leaf2"
									: has
										? "border-leaf/40 text-leaf2 bg-moss/10 hover:bg-moss/15"
										: "border-leaf/15 text-stone2 bg-bark/20 hover:border-leaf/35 hover:bg-moss/10"
							}`}
						>
							S{n} ({mmss(i * SEC_PER_SCENE)})
						</button>
					);
				})}
			</div>
		</section>
	);
}

