"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { WarMusicVideoGenerator } from "../../types";

export default function CivilianTab({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Tipe Sipil">
				<Sel
					id="civ-type"
					value={gen.getSceneConfig(gen.currentScene).civType}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { civType: v })}
					options={[...OPTIONS.civType]}
				/>
			</Field>
			<Field label="Emosi">
				<Sel
					id="civ-emotion"
					value={gen.getSceneConfig(gen.currentScene).civEmotion}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { civEmotion: v })
					}
					options={[...OPTIONS.civEmotion]}
				/>
			</Field>
			<Field label="Interaksi">
				<Sel
					id="civ-interaction"
					value={gen.getSceneConfig(gen.currentScene).civInteraction}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { civInteraction: v })
					}
					options={[...OPTIONS.civInteraction]}
				/>
			</Field>
			<Field label="Kepadatan">
				<Sel
					id="civ-density"
					value={gen.getSceneConfig(gen.currentScene).civDensity}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { civDensity: v })
					}
					options={[...OPTIONS.civDensity]}
				/>
			</Field>
		</div>
	);
}

