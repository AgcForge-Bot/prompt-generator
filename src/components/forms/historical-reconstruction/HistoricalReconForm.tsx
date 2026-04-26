"use client";

import { useState } from "react";
import useHistoricalReconGenerator from "./useHistoricalReconGenerator";
import { HISTORICAL_CATEGORIES, VISUAL_STYLE_LABELS } from "./constants";
import type { HistoricalCategoryKey, VisualStyleKey } from "./types";
import HeaderSection from "./sections/HeaderSection";
import TabsSection from "./sections/TabsSection";
import ConfigTabSection from "./sections/ConfigTabSection";
import OutputTabSection from "./sections/OutputTabSection";
import { mmss } from "./utils";

export default function HistoricalReconForm() {
	const gen = useHistoricalReconGenerator();
	const { config, updateConfig } = gen;
	const [activeTab, setActiveTab] = useState<"config" | "output">("config");

	const catKeys = Object.keys(HISTORICAL_CATEGORIES) as HistoricalCategoryKey[];
	const visualStyleKeys = Object.keys(VISUAL_STYLE_LABELS) as VisualStyleKey[];
	const totalSec = config.totalMinutes * 60;
	const catInfo = HISTORICAL_CATEGORIES[config.category];

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<HeaderSection
					gen={gen}
					config={config}
					totalSec={totalSec}
					catInfo={catInfo}
					mmss={mmss}
				/>
				{/* ── TABS ── */}
				<TabsSection
					gen={gen}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>

				{/* ════════════════ CONFIG TAB ════════════════ */}
				{activeTab === "config" && (
					<ConfigTabSection
						gen={gen}
						config={config}
						catKeys={catKeys}
						totalSec={totalSec}
						catInfo={catInfo}
						visualStyleKeys={visualStyleKeys}
						updateConfig={updateConfig}
						mmss={mmss}
					/>
				)}

				{/* ════════════════ OUTPUT TAB ════════════════ */}
				{activeTab === "output" && (
					<OutputTabSection
						gen={gen}
						config={config}
						setActiveTab={setActiveTab}
						mmss={mmss}
					/>
				)}
			</div>

			{/* ── TOAST ── */}
			<div
				className={`toast-base transition-all duration-300 ${
					gen.toast.show
						? "bg-moss/90 text-leaf2 opacity-100 translate-y-0"
						: "opacity-0 translate-y-4 pointer-events-none"
				}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
