"use client";

import type { AsmrTimelapseGenerator } from "../types";

export default function HeaderSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">🏗️ ASMR Timelapse — Restoration & Construction</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
				<div className="font-mono text-[11px] text-stone2 leading-relaxed">
					Cinematic Build Process · Satisfying Progress · Ambient Soundscape
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
						DNA: <span className="text-leaf2 font-bold">{gen.dnaLocked ? "🔒 Terkunci" : "Belum"}</span>
					</div>
				</div>
			</div>
		</section>
	);
}
