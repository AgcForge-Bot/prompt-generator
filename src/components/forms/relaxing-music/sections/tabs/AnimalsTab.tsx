"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function AnimalsTab({ gen }: { gen: RelaxingMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🦅 Burung">
				<Sel
					id="ani-birds"
					value={gen.getSceneConfig(gen.currentScene).aniBirds}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { aniBirds: v })}
					options={[...OPTIONS.aniBirds]}
				/>
			</Field>
			<Field label="🐑 Hewan Darat">
				<Sel
					id="ani-land"
					value={gen.getSceneConfig(gen.currentScene).aniLand}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { aniLand: v })}
					options={[...OPTIONS.aniLand]}
				/>
			</Field>
			<Field label="🦋 Serangga">
				<Sel
					id="ani-insects"
					value={gen.getSceneConfig(gen.currentScene).aniInsects}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { aniInsects: v })
					}
					options={[...OPTIONS.aniInsects]}
				/>
			</Field>
			<Field label="🐟 Hewan Air">
				<Sel
					id="ani-water"
					value={gen.getSceneConfig(gen.currentScene).aniWater}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { aniWater: v })}
					options={[...OPTIONS.aniWater]}
				/>
			</Field>
		</div>
	);
}

