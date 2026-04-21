"use-client";

import type { ShortMovieGeneratorConfig, VisualStyleKey } from "../types";
import { VISUAL_STYLE_LABELS, VISUAL_STYLE_HINTS } from "../constants";

export default function VisualStyleSection({
	gen,
}: {
	gen: ShortMovieGeneratorConfig;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎞️ Visual Style</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div className="flex flex-col gap-2">
					{(Object.keys(VISUAL_STYLE_LABELS) as VisualStyleKey[]).map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => gen.updateConfig({ visualStyle: key })}
							className={`text-left px-3 py-2 rounded-xl border transition-all ${
								gen.config.visualStyle === key
									? "bg-moss/30 border-leaf text-cream"
									: "bg-bark/30 border-leaf/15 text-stone2 hover:border-leaf/40"
							}`}
						>
							<span className="font-playfair text-sm font-bold">
								{VISUAL_STYLE_LABELS[key]}
							</span>
						</button>
					))}
				</div>
				<div className="rounded-xl border border-leaf/10 bg-bark/25 p-4 flex flex-col justify-center">
					<div className="font-mono text-[10px] text-leaf2 font-bold mb-2">
						Hint Visual
					</div>
					<div className="font-mono text-[10px] text-stone2 leading-relaxed">
						{VISUAL_STYLE_HINTS[gen.config.visualStyle]}
					</div>
				</div>
			</div>
		</section>
	);
}
