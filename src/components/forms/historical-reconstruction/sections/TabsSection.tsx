"use client";

import type { Dispatch, SetStateAction } from "react";
import type { HistoricalReconGeneratorConfig } from "../types";

export default function TabsSection({
	gen,
	activeTab,
	setActiveTab,
}: {
	gen: HistoricalReconGeneratorConfig;
	activeTab: "config" | "output";
	setActiveTab: Dispatch<SetStateAction<"config" | "output">>;
}) {
	return (
		<div className="flex gap-0.5 mb-5 bg-bark/40 rounded-xl p-1">
			{[
				{ key: "config" as const, emoji: "🎛️", label: "Konfigurasi" },
				{ key: "output" as const, emoji: "🎬", label: "Output & SEO" },
			].map((tab) => (
				<button
					key={tab.key}
					type="button"
					onClick={() => setActiveTab(tab.key)}
					className={`flex-1 rounded-lg py-2.5 font-bold text-xs transition-all font-sans flex items-center justify-center gap-1.5 ${
						activeTab === tab.key
							? "bg-moss/50 text-leaf2"
							: "text-stone2 hover:text-cream"
					}`}
				>
					{tab.emoji} {tab.label}
					{tab.key === "output" && gen.allPrompts.length > 0 && (
						<span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-leaf/20 border border-leaf/20 text-leaf2">
							{gen.allPrompts.length} ✓
						</span>
					)}
				</button>
			))}
		</div>
	);
}
