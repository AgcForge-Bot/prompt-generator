"use client";

import type { AsmrTimelapseGenerator } from "../types";

export default function ProjectTypeSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">🧭 Project Type</div>
			<div className="grid grid-cols-2 gap-2">
				<button
					type="button"
					onClick={() => gen.setProjectTypeSafe("restoration")}
					className={`rounded-lg border px-3 py-3 transition-all ${
						gen.projectType === "restoration"
							? "border-leaf bg-moss/20"
							: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
					}`}
				>
					<div className="font-playfair font-bold text-cream">🏚️ Restoration</div>
					<div className="font-mono text-[10px] text-stone2">
						Perbaikan · Renovasi · Pemulihan
					</div>
				</button>
				<button
					type="button"
					onClick={() => gen.setProjectTypeSafe("construction")}
					className={`rounded-lg border px-3 py-3 transition-all ${
						gen.projectType === "construction"
							? "border-leaf bg-moss/20"
							: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
					}`}
				>
					<div className="font-playfair font-bold text-cream">🏗️ New Construction</div>
					<div className="font-mono text-[10px] text-stone2">
						Bangunan Baru · Infrastruktur
					</div>
				</button>
			</div>
		</section>
	);
}

