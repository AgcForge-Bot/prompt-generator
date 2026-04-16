"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { CarMusicVideoGenerator } from "../../types";

export default function PropsTab({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Fire">
				<Sel
					id="prop-fire"
					value={gen.getSceneConfig(gen.currentScene).propFire}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { propFire: v })
					}
					options={[...OPTIONS.propFire]}
				/>
			</Field>
			<Field label="Smoke">
				<Sel
					id="prop-smoke"
					value={gen.getSceneConfig(gen.currentScene).propSmoke}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { propSmoke: v })
					}
					options={[...OPTIONS.propSmoke]}
				/>
			</Field>
			<Field label="Animal">
				<Sel
					id="prop-animal"
					value={gen.getSceneConfig(gen.currentScene).propAnimal}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { propAnimal: v })
					}
					options={[...OPTIONS.propAnimal]}
				/>
			</Field>
			<Field label="Decor">
				<Sel
					id="prop-deco"
					value={gen.getSceneConfig(gen.currentScene).propDeco}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { propDeco: v })
					}
					options={[...OPTIONS.propDeco]}
				/>
			</Field>
			<Field label="Character Props">
				<Sel
					id="prop-char"
					value={gen.getSceneConfig(gen.currentScene).propChar}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { propChar: v })
					}
					options={[...OPTIONS.propChar]}
				/>
			</Field>
			<Field label="SFX">
				<Sel
					id="prop-sfx"
					value={gen.getSceneConfig(gen.currentScene).propSfx}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { propSfx: v })
					}
					options={[...OPTIONS.propSfx]}
				/>
			</Field>
		</div>
	);
}

