"use client";

import type { RelaxingMusicVideoGenerator } from "../types";
import AnimalsTab from "./tabs/AnimalsTab";
import DroneTab from "./tabs/DroneTab";
import ElementsTab from "./tabs/ElementsTab";
import LightingTab from "./tabs/LightingTab";
import LocationTab from "./tabs/LocationTab";
import NatureTab from "./tabs/NatureTab";
import StyleTab from "./tabs/StyleTab";
import VisualsTab from "./tabs/VisualsTab";

export default function SceneConfigSection({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🧩 Konfigurasi Detail Scene</div>
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

			{gen.activeTab === "nature" ? (
				<NatureTab gen={gen} />
			) : gen.activeTab === "location" ? (
				<LocationTab gen={gen} />
			) : gen.activeTab === "animals" ? (
				<AnimalsTab gen={gen} />
			) : gen.activeTab === "visuals" ? (
				<VisualsTab gen={gen} />
			) : gen.activeTab === "lighting" ? (
				<LightingTab gen={gen} />
			) : gen.activeTab === "drone" ? (
				<DroneTab gen={gen} />
			) : gen.activeTab === "elements" ? (
				<ElementsTab gen={gen} />
			) : (
				<StyleTab gen={gen} />
			)}
		</section>
	);
}

