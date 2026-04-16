"use client";

import { TOD_DATA } from "../constants";
import type { RelaxingMusicVideoGenerator, TodKey } from "../types";

export default function TimeOfDaySection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🕒 Time of Day</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				{(Object.keys(TOD_DATA) as TodKey[]).map((k) => (
					<button
						key={k}
						type="button"
						onClick={() => gen.setTimeOfDaySafe(k)}
						className={`rounded-lg border px-3 py-2 text-left transition-all ${
							gen.timeOfDay === k
								? "border-leaf bg-moss/20"
								: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
						}`}
					>
						<div className="font-playfair text-sm font-bold text-cream">
							{TOD_DATA[k].label.split("/")[0]?.trim()}
						</div>
						<div className="font-mono text-[10px] text-stone2">{k}</div>
					</button>
				))}
			</div>
			<div className="mt-3 rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-stone2 leading-relaxed">
				<div className="text-leaf2 font-bold mb-1">Lighting</div>
				<div>{TOD_DATA[gen.timeOfDay].lighting}</div>
				<div className="text-leaf2 font-bold mt-2 mb-1">Sky</div>
				<div>{TOD_DATA[gen.timeOfDay].sky}</div>
			</div>
		</section>
	);
}

