"use client";

import type { ShortMovieGeneratorConfig } from "../types";
import {
	DURATION_MINUTE_OPTIONS,
	DURATION_SEC_PER_SCENE_OPTIONS,
} from "../constants";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";

export default function DurationEngineSection({
	gen,
	totalDurMin,
}: {
	gen: ShortMovieGeneratorConfig;
	totalDurMin: string;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">⏱ Duration Engine</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
				<Field label="Total Durasi Video">
					<Sel
						id="sm-dur-total"
						value={String(gen.config.totalMinutes)}
						onChange={(v) => gen.setDuration(+v, gen.config.secPerScene)}
						options={DURATION_MINUTE_OPTIONS}
					/>
				</Field>
				<Field label="Durasi Per-Scene">
					<Sel
						id="sm-dur-scene"
						value={String(gen.config.secPerScene)}
						onChange={(v) => gen.setDuration(gen.config.totalMinutes, +v)}
						options={DURATION_SEC_PER_SCENE_OPTIONS}
					/>
				</Field>
				<Field label="Format Prompt">
					<Sel
						id="sm-fmt"
						value="json-lean"
						onChange={() => {}}
						options={[
							{ value: "json-lean", label: "JSON Lean (aiVideoPrompt.v1)" },
						]}
					/>
				</Field>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bark/40 rounded-xl p-4 border border-leaf/10">
				{[
					[gen.totalScenes.toString(), "Total Scene"],
					[totalDurMin, "Menit"],
					[gen.config.secPerScene.toString(), "Detik/Scene"],
					[
						Math.max(1, Math.floor(gen.totalScenes / 10)).toString(),
						"Emotional Moments",
					],
				].map(([v, l]) => (
					<div key={l} className="flex flex-col items-center gap-1">
						<span className="font-playfair text-3xl font-bold text-leaf2">
							{v}
						</span>
						<span className="font-mono text-[8.5px] text-stone2 uppercase tracking-wide">
							{l}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
