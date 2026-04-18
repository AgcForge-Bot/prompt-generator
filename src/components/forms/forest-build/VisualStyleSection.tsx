"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { VISUAL_STYLE_HINTS, VISUAL_STYLE_LABELS } from "./constants";
import type { VisualStyleKey } from "./types";

export default function VisualStyleSection({
	visualStyle,
	onChange,
}: {
	visualStyle: VisualStyleKey;
	onChange: (next: VisualStyleKey) => void;
}) {
	const keys = Object.keys(VISUAL_STYLE_LABELS) as VisualStyleKey[];

	return (
		<section className="card mb-5">
			<div className="section-label">🎞️ Visual Style</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<Field label="Level Visual">
					<Sel
						id="forest-visual-style"
						value={visualStyle}
						onChange={(v) => onChange(v as VisualStyleKey)}
						options={keys.map((k) => ({
							value: k,
							label: VISUAL_STYLE_LABELS[k],
						}))}
					/>
				</Field>
				<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
					<div className="font-mono text-[10px] text-leaf2 font-bold mb-1">
						Hint (dipakai di prompt)
					</div>
					<div className="font-mono text-[10px] text-stone2 leading-relaxed">
						{VISUAL_STYLE_HINTS[visualStyle]}
					</div>
				</div>
			</div>
		</section>
	);
}

