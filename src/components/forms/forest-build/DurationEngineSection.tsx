"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";

export default function DurationEngineSection({
	totalMinutes,
	secPerScene,
	totalScenes,
	onDurationChange,
}: {
	totalMinutes: number;
	secPerScene: number;
	totalScenes: number;
	onDurationChange: (min: number, sec: number) => void;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">⏱ Duration Engine</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
				<Field label="Total Durasi Video">
					<Sel
						id="dur-total"
						value={String(totalMinutes)}
						onChange={(v) => onDurationChange(+v, secPerScene)}
						options={["3", "5", "8", "10", "12", "15", "18", "20"].map((v) => ({
							value: v,
							label: `${v} Menit`,
						}))}
					/>
				</Field>
				<Field label="Durasi Per-Scene (AI)">
					<Sel
						id="dur-scene"
						value={String(secPerScene)}
						onChange={(v) => onDurationChange(totalMinutes, +v)}
						options={[
							{ value: "8", label: "8 Detik / scene" },
							{ value: "10", label: "10 Detik / scene" },
							{ value: "12", label: "12 Detik / scene" },
							{ value: "15", label: "15 Detik / scene" },
							{ value: "20", label: "20 Detik / scene" },
						]}
					/>
					<div className="mt-2 font-mono text-[9px] text-stone2">
						Opsi 12–20 detik cocok untuk AI yang mendukung durasi lebih panjang
						(mis. Sora).
					</div>
				</Field>
				<Field label="Format Prompt">
					<Sel
						id="dur-format"
						value="detailed"
						onChange={() => {}}
						options={[
							"Detailed — Full cinematic description",
							"Compact — Dense key phrases",
						]}
					/>
				</Field>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bark/40 rounded-xl p-4 border border-leaf/10">
				{[
					[totalScenes.toString(), "Total Scene"],
					[totalMinutes.toString(), "Menit"],
					[secPerScene.toString(), "Detik/Scene"],
					[Math.floor(totalScenes / 15).toString(), "Emotional Moments"],
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
