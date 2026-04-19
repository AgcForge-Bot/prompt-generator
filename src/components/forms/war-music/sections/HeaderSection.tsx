"use client";

import type { WarMusicVideoGenerator } from "../types";

export default function HeaderSection({
	gen,
}: {
	gen: WarMusicVideoGenerator;
}) {
	return (
		<header className="mb-8 pb-6 border-b border-leaf/20">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-3">
						<span className="text-leaf text-sm">⚔️</span>
						<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
							WAR Cinematic × DJ Battle Zone
						</span>
					</div>
					<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
						WAR Cinematic
						<br />
						<em className="text-leaf2 italic">Video Clip</em>
					</h1>
					<p className="font-mono text-[11px] text-stone2 leading-relaxed">
						Film Refs: Saving Private Ryan · 1917 · Braveheart · Dunkirk · Troy
						<br />
						Grok · VEO · Kling · Runway · Pika · Luma
					</p>
				</div>
				<div className="flex flex-col gap-2 sm:items-end">
					{[
						["Total Scene", `${gen.totalScenes}`],
						["Durasi", `${gen.totalMinutes} menit`],
						["Per-scene", `${gen.secPerScene} detik`],
						["Platform", "Grok + VEO"],
						["Scene", `${gen.totalScenes} × ${gen.secPerScene} detik`],
						["Gaya", gen.visualStyleLabel],
						["Mode", gen.clipMode],
					].map(([k, v]) => (
						<div
							key={k}
							className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap"
						>
							{k}: <span className="text-leaf2 font-bold">{v}</span>
						</div>
					))}
				</div>
			</div>
		</header>
	);
}
