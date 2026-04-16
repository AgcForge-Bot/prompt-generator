"use client";

import { SEC_PER_SCENE, TOTAL_SCENES } from "../constants";
import type { WarMusicVideoGenerator } from "../types";

export default function HeaderSection({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">⚔️ WAR Cinematic × DJ Battle Zone</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
				<div className="font-mono text-[11px] text-stone2 leading-relaxed">
					Film Refs: Saving Private Ryan · 1917 · Braveheart · Dunkirk · Troy
				</div>
				<div className="flex flex-wrap gap-2 sm:justify-end">
					<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
						Durasi: <span className="text-leaf2 font-bold">2 menit</span>
					</div>
					<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
						Scene:{" "}
						<span className="text-leaf2 font-bold">
							{TOTAL_SCENES} × {SEC_PER_SCENE} detik
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}

