"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { WarMusicVideoGenerator } from "../../types";

export default function LightingTab({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Lighting Utama">
				<Sel
					id="light-main"
					value={gen.getSceneConfig(gen.currentScene).lightMain}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { lightMain: v })
					}
					options={[...OPTIONS.lightMain]}
				/>
			</Field>
			<Field label="Lighting FX">
				<Sel
					id="light-fx"
					value={gen.getSceneConfig(gen.currentScene).lightFx}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { lightFx: v })}
					options={[...OPTIONS.lightFx]}
				/>
			</Field>
			<Field label="Warna Cahaya">
				<Sel
					id="light-color"
					value={gen.getSceneConfig(gen.currentScene).lightColor}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { lightColor: v })
					}
					options={[...OPTIONS.lightColor]}
				/>
			</Field>
			<Field label="Shadow Style">
				<Sel
					id="light-shadow"
					value={gen.getSceneConfig(gen.currentScene).lightShadow}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { lightShadow: v })
					}
					options={[...OPTIONS.lightShadow]}
				/>
			</Field>
		</div>
	);
}

