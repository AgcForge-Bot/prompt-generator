"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import type { RelaxingMusicVideoGenerator } from "../types";

export default function DurationEngineSection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">⏱ Duration Engine</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
				<Field label="Total Durasi Video">
					<Sel
						id="dur-total-relax"
						value={String(gen.totalMinutes)}
						onChange={(v) => gen.onDurationChange(+v, gen.secPerScene)}
						options={["1", "2", "3", "5", "8", "10", "12", "15"].map((v) => ({
							value: v,
							label: `${v} Menit`,
						}))}
					/>
				</Field>
				<Field label="Durasi Per-Scene (AI)">
					<Sel
						id="dur-scene-relax"
						value={String(gen.secPerScene)}
						onChange={(v) => gen.onDurationChange(gen.totalMinutes, +v)}
						options={[
							{ value: "6", label: "6 Detik / scene" },
							{ value: "8", label: "8 Detik / scene" },
							{ value: "10", label: "10 Detik / scene" },
							{ value: "12", label: "12 Detik / scene" },
							{ value: "15", label: "15 Detik / scene" },
						]}
					/>
				</Field>
				<Field label="Total Scene (Auto)">
					<Sel
						id="dur-scenes-relax"
						value={String(gen.totalScenes)}
						onChange={() => {}}
						options={[
							{
								value: String(gen.totalScenes),
								label: `${gen.totalScenes} Scene`,
							},
						]}
					/>
				</Field>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bark/40 rounded-xl p-4 border border-leaf/10">
				{[
					[gen.totalScenes.toString(), "Total Scene"],
					[gen.totalMinutes.toString(), "Menit"],
					[gen.secPerScene.toString(), "Detik/Scene"],
					[Math.floor(gen.totalScenes / 10).toString(), "Highlight Moments"],
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

