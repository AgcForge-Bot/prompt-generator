"use client";

import type {
	HistoricalReconConfig,
	HistoricalReconGeneratorConfig,
} from "../types";

export default function HeaderSection({
	gen,
	config,
	totalSec,
	catInfo,
	mmss,
}: {
	gen: HistoricalReconGeneratorConfig;
	config: HistoricalReconConfig;
	totalSec: number;
	catInfo: {
		label: string;
		icon: string;
		description: string;
		exampleTopics: string[];
		aiDirectorNote: string;
	};
	mmss(sec: number): string;
}) {
	return (
		<header className="mb-8 pb-6 border-b border-leaf/20">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-3">
						<span className="text-sm">🏛️</span>
						<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
							AI Historical Reconstruction · Documentary Generator
						</span>
					</div>
					<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
						Historical
						<br />
						<em className="text-leaf2 italic">Reconstruction AI</em>
					</h1>
					<p className="font-mono text-[11px] text-stone2 leading-relaxed">
						Generate prompt dokumenter rekonstruksi sejarah scene-by-scene
						<br />
						Vikings · Aztec · Maya · Atlantis · WW2 · Mitologi · Peperangan Kuno
					</p>
				</div>
				<div className="flex flex-col gap-2 sm:items-end">
					{[
						["Kategori", catInfo.icon],
						["Scene", `${gen.totalScenes}`],
						["Durasi", `${mmss(totalSec)}`],
						["Per Scene", `${config.secPerScene}s`],
					].map(([k, v]) => (
						<div
							key={k as string}
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
