"use client";

import type { AsmrTimelapseGenerator } from "../types";
import AsmrTab from "./tabs/AsmrTab";
import CameraTab from "./tabs/CameraTab";
import EquipmentTab from "./tabs/EquipmentTab";
import LightingTab from "./tabs/LightingTab";
import NarrationTab from "./tabs/NarrationTab";
import TimelapseTab from "./tabs/TimelapseTab";

export default function SceneConfigSection({
	gen,
}: {
	gen: AsmrTimelapseGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🧩 Konfigurasi Per-Scene</div>
			<div className="flex flex-wrap gap-2 mb-4">
				{gen.tabs.map((t) => (
					<button
						key={t.key}
						type="button"
						className={`tab-btn ${gen.activeTab === t.key ? "active" : ""}`}
						onClick={() => gen.setActiveTab(t.key)}
					>
						{t.label}
					</button>
				))}
			</div>

			{gen.activeTab === "timelapse" ? (
				<TimelapseTab gen={gen} />
			) : gen.activeTab === "equipment" ? (
				<EquipmentTab gen={gen} />
			) : gen.activeTab === "narration" ? (
				<NarrationTab gen={gen} />
			) : gen.activeTab === "lighting" ? (
				<LightingTab gen={gen} />
			) : gen.activeTab === "asmr" ? (
				<AsmrTab gen={gen} />
			) : (
				<CameraTab gen={gen} />
			)}
		</section>
	);
}
