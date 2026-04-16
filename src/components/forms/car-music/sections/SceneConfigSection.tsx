"use client";

import type { CarMusicVideoGenerator } from "../types";
import CameraTab from "./tabs/CameraTab";
import CarsTab from "./tabs/CarsTab";
import CrowdTab from "./tabs/CrowdTab";
import DjTab from "./tabs/DjTab";
import LightingTab from "./tabs/LightingTab";
import LocationTab from "./tabs/LocationTab";
import PropsTab from "./tabs/PropsTab";

export default function SceneConfigSection({ gen }: { gen: CarMusicVideoGenerator }) {
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

			{gen.activeTab === "cars" ? (
				<CarsTab gen={gen} />
			) : gen.activeTab === "dj" ? (
				<DjTab gen={gen} />
			) : gen.activeTab === "crowd" ? (
				<CrowdTab gen={gen} />
			) : gen.activeTab === "location" ? (
				<LocationTab gen={gen} />
			) : gen.activeTab === "lighting" ? (
				<LightingTab gen={gen} />
			) : gen.activeTab === "props" ? (
				<PropsTab gen={gen} />
			) : (
				<CameraTab gen={gen} />
			)}
		</section>
	);
}

