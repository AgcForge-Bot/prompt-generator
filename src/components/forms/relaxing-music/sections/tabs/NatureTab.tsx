"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function NatureTab({ gen }: { gen: RelaxingMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🏔️ Spot Pemandangan Alam">
				<Sel
					id="nat-spot"
					value={gen.getSceneConfig(gen.currentScene).natSpot}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { natSpot: v })}
					options={[...OPTIONS.natSpot]}
				/>
			</Field>
			<Field label="🌊 Elemen Air">
				<Sel
					id="nat-water"
					value={gen.getSceneConfig(gen.currentScene).natWater}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { natWater: v })}
					options={[...OPTIONS.natWater]}
				/>
			</Field>
			<Field label="🌳 Vegetasi & Tumbuhan">
				<Sel
					id="nat-vegetation"
					value={gen.getSceneConfig(gen.currentScene).natVegetation}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { natVegetation: v })
					}
					options={[...OPTIONS.natVegetation]}
				/>
			</Field>
			<Field label="⛰️ Topografi / Terrain">
				<Sel
					id="nat-terrain"
					value={gen.getSceneConfig(gen.currentScene).natTerrain}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { natTerrain: v })
					}
					options={[...OPTIONS.natTerrain]}
				/>
			</Field>
		</div>
	);
}

