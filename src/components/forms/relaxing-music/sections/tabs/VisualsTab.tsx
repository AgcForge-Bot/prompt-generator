"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function VisualsTab({ gen }: { gen: RelaxingMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🌱 Komposisi Dominan">
				<Sel
					id="vis-composition"
					value={gen.getSceneConfig(gen.currentScene).visComposition}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { visComposition: v })
					}
					options={[...OPTIONS.visComposition]}
				/>
			</Field>
			<Field label="🌸 Bunga / Flora Detail">
				<Sel
					id="vis-flowers"
					value={gen.getSceneConfig(gen.currentScene).visFlowers}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { visFlowers: v })
					}
					options={[...OPTIONS.visFlowers]}
				/>
			</Field>
			<Field label="🪨 Rocks / Geology">
				<Sel
					id="vis-rocks"
					value={gen.getSceneConfig(gen.currentScene).visRocks}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { visRocks: v })
					}
					options={[...OPTIONS.visRocks]}
				/>
			</Field>
			<Field label="☁️ Sky Detail">
				<Sel
					id="vis-sky"
					value={gen.getSceneConfig(gen.currentScene).visSky}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { visSky: v })}
					options={[...OPTIONS.visSky]}
				/>
			</Field>
		</div>
	);
}

