"use client";

import { TOD_DATA } from "../constants";
import type { AsmrTimelapseGenerator, TodKey } from "../types";

export default function TimeOfDaySection({
	gen,
}: {
	gen: AsmrTimelapseGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🕒 Waktu Shooting</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{(Object.keys(TOD_DATA) as TodKey[]).map((k) => (
					<button
						key={k}
						type="button"
						onClick={() => gen.setTimeOfDaySafe(k)}
						className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${
							gen.timeOfDay === k
								? "border-leaf bg-moss/20"
								: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
						}`}
					>
						<span className="text-2xl">{TOD_DATA[k].emoji}</span>
						<div className="font-playfair text-sm text-cream">
							{TOD_DATA[k].label.split(" ")[0]}
						</div>
						<div className="font-mono text-[8px] text-stone2 text-center leading-tight">
							{TOD_DATA[k].timeRange}
						</div>
					</button>
				))}
			</div>
			<div className="mt-3 rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-stone2 leading-relaxed">
				{TOD_DATA[gen.timeOfDay].hint}
			</div>
		</section>
	);
}
