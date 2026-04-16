"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { WarMusicVideoGenerator } from "../../types";

export default function SoldiersTab({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Hero Soldier / Karakter Utama">
				<Sel
					id="sol-hero"
					value={gen.getSceneConfig(gen.currentScene).solHero}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { solHero: v })}
					options={[...OPTIONS.solHero]}
				/>
			</Field>
			<Field label="Pasukan Pendukung (Background)">
				<Sel
					id="sol-squad"
					value={gen.getSceneConfig(gen.currentScene).solSquad}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { solSquad: v })}
					options={[...OPTIONS.solSquad]}
				/>
			</Field>
			<Field label="Aksi Hero Utama">
				<Sel
					id="sol-action"
					value={gen.getSceneConfig(gen.currentScene).solAction}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { solAction: v })
					}
					options={[...OPTIONS.solAction]}
				/>
			</Field>
			<Field label="Gear / Era">
				<Sel
					id="sol-gear"
					value={gen.getSceneConfig(gen.currentScene).solGear}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { solGear: v })}
					options={[...OPTIONS.solGear]}
				/>
			</Field>
			<Field label="Skala">
				<Sel
					id="sol-scale"
					value={gen.getSceneConfig(gen.currentScene).solScale}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { solScale: v })
					}
					options={[...OPTIONS.solScale]}
				/>
			</Field>
			<Field label="Musuh">
				<Sel
					id="sol-enemy"
					value={gen.getSceneConfig(gen.currentScene).solEnemy}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { solEnemy: v })
					}
					options={[...OPTIONS.solEnemy]}
				/>
			</Field>
		</div>
	);
}

