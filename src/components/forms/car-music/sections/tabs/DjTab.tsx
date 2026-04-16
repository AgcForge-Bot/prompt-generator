"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { CarMusicVideoGenerator } from "../../types";

export default function DjTab({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Penampilan DJ">
				<Sel
					id="dj-type"
					value={gen.getSceneConfig(gen.currentScene).djType}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { djType: v })}
					options={[...OPTIONS.djType]}
				/>
			</Field>
			<Field label="Setup DJ">
				<Sel
					id="dj-setup"
					value={gen.getSceneConfig(gen.currentScene).djSetup}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { djSetup: v })}
					options={[...OPTIONS.djSetup]}
				/>
			</Field>
			<Field label="Aksi DJ">
				<Sel
					id="dj-action"
					value={gen.getSceneConfig(gen.currentScene).djAction}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { djAction: v })
					}
					options={[...OPTIONS.djAction]}
				/>
			</Field>
			<Field label="Outfit DJ">
				<Sel
					id="dj-outfit"
					value={gen.getSceneConfig(gen.currentScene).djOutfit}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { djOutfit: v })
					}
					options={[...OPTIONS.djOutfit]}
				/>
			</Field>
			<Field label="FX DJ">
				<Sel
					id="dj-fx"
					value={gen.getSceneConfig(gen.currentScene).djFx}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { djFx: v })}
					options={[...OPTIONS.djFx]}
				/>
			</Field>
			<Field label="Sound Visual">
				<Sel
					id="dj-sound"
					value={gen.getSceneConfig(gen.currentScene).djSound}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { djSound: v })
					}
					options={[...OPTIONS.djSound]}
				/>
			</Field>
		</div>
	);
}

