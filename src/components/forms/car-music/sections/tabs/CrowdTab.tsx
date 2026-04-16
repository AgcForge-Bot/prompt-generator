"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { CarMusicVideoGenerator } from "../../types";

export default function CrowdTab({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Komposisi Penonton">
				<Sel
					id="crowd-mix"
					value={gen.getSceneConfig(gen.currentScene).crowdMix}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { crowdMix: v })
					}
					options={[...OPTIONS.crowdMix]}
				/>
			</Field>
			<Field label="Energi Penonton">
				<Sel
					id="crowd-energy"
					value={gen.getSceneConfig(gen.currentScene).crowdEnergy}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { crowdEnergy: v })
					}
					options={[...OPTIONS.crowdEnergy]}
				/>
			</Field>
			<Field label="Aksi Penonton">
				<Sel
					id="crowd-action"
					value={gen.getSceneConfig(gen.currentScene).crowdAction}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { crowdAction: v })
					}
					options={[...OPTIONS.crowdAction]}
				/>
			</Field>
			<Field label="Fashion Penonton">
				<Sel
					id="crowd-fashion"
					value={gen.getSceneConfig(gen.currentScene).crowdFashion}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { crowdFashion: v })
					}
					options={[...OPTIONS.crowdFashion]}
				/>
			</Field>
			<Field label="Kepadatan">
				<Sel
					id="crowd-density"
					value={gen.getSceneConfig(gen.currentScene).crowdDensity}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { crowdDensity: v })
					}
					options={[...OPTIONS.crowdDensity]}
				/>
			</Field>
			<Field label="Moment">
				<Sel
					id="crowd-moment"
					value={gen.getSceneConfig(gen.currentScene).crowdMoment}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { crowdMoment: v })
					}
					options={[...OPTIONS.crowdMoment]}
				/>
			</Field>
		</div>
	);
}

