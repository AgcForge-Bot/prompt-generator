"use client";

import type { AsmrTimelapseGenerator } from "../types";

export default function ProgressSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">📊 Progress Scene</div>
			<div className="flex items-center gap-3">
				<div className="flex-1 h-2 rounded-full bg-bark/50 overflow-hidden border border-leaf/10">
					<div
						className="h-full bg-linear-to-r from-moss to-leaf2"
						style={{ width: `${gen.progressPct}%` }}
					/>
				</div>
				<div className="font-mono text-[10px] text-leaf2 font-bold">
					{gen.currentScene}/{gen.totalScenes}
				</div>
			</div>
		</section>
	);
}
