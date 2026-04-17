"use client";

import type { RelaxingMusicVideoGenerator } from "../types";

export default function HeaderSection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🌿 Relaxing Music Video — Nature Drone</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
				<div className="font-mono text-[11px] text-stone2 leading-relaxed">
					European Nature · Calming Cinematic Drone · Slow Meditative
				</div>
				<div className="flex flex-wrap gap-2 sm:justify-end">
					<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
						Durasi:{" "}
						<span className="text-leaf2 font-bold">{gen.totalMinutes} menit</span>
					</div>
					<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
						Scene:{" "}
						<span className="text-leaf2 font-bold">
							{gen.totalScenes} × {gen.secPerScene} detik
						</span>
					</div>
					<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
						TOD:{" "}
						<span className="text-leaf2 font-bold">{gen.timeOfDay}</span>
					</div>
				</div>
			</div>
		</section>
	);
}
