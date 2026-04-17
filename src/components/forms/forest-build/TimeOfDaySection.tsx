"use client";

import type { TimeOfDay, SceneConfig } from "./types";
import { TOD_DATA } from "./utils";

export default function TimeOfDaySection({
	sc,
	currentScene,
	updateScene,
}: {
	sc: SceneConfig | null;
	currentScene: number;
	updateScene: (id: number, updates: Partial<SceneConfig>) => void;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🌤 Waktu Shooting Scene</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{(
					Object.entries(TOD_DATA) as [
						TimeOfDay,
						(typeof TOD_DATA)[keyof typeof TOD_DATA],
					][]
				).map(([key, tod]) => (
					<button
						key={key}
						className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
							sc?.timeOfDay === key
								? key === "morning"
									? "border-amber bg-amber/10"
									: key === "noon"
										? "border-leaf bg-leaf/10"
										: key === "afternoon"
											? "border-clay/80 bg-clay/10"
											: "border-purple-500/60 bg-purple-900/20"
								: "border-leaf/15 bg-bark/30 hover:border-leaf/40"
						}`}
						onClick={() => sc && updateScene(currentScene, { timeOfDay: key })}
					>
						<span className="text-2xl">{tod.emoji}</span>
						<span className="font-playfair text-sm text-cream">
							{tod.label}
						</span>
						<span className="font-mono text-[8px] text-stone2 text-center leading-tight">
							{tod.range}
						</span>
					</button>
				))}
			</div>
		</section>
	);
}
