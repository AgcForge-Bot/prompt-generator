"use client";

import type { WarMusicVideoGenerator } from "../types";
import CameraTab from "./tabs/CameraTab";
import CivilianTab from "./tabs/CivilianTab";
import DjTab from "./tabs/DjTab";
import LightingTab from "./tabs/LightingTab";
import LocationTab from "./tabs/LocationTab";
import SoldiersTab from "./tabs/SoldiersTab";
import TrailerTab from "./tabs/TrailerTab";
import VehiclesTab from "./tabs/VehiclesTab";
import VfxTab from "./tabs/VfxTab";

export default function SceneConfigSection({ gen }: { gen: WarMusicVideoGenerator }) {
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

			{gen.activeTab === "soldiers" ? (
				<SoldiersTab gen={gen} />
			) : gen.activeTab === "trailer" ? (
				<TrailerTab gen={gen} />
			) : gen.activeTab === "dj" ? (
				<DjTab gen={gen} />
			) : gen.activeTab === "civilian" ? (
				<CivilianTab gen={gen} />
			) : gen.activeTab === "vehicles" ? (
				<VehiclesTab gen={gen} />
			) : gen.activeTab === "location" ? (
				<LocationTab gen={gen} />
			) : gen.activeTab === "lighting" ? (
				<LightingTab gen={gen} />
			) : gen.activeTab === "vfx" ? (
				<VfxTab gen={gen} />
			) : (
				<CameraTab gen={gen} />
			)}
		</section>
	);
}
