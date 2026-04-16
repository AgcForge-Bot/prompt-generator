"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function ElementsTab({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🌬️ Wind">
				<Sel
					id="elem-wind"
					value={gen.getSceneConfig(gen.currentScene).elemWind}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { elemWind: v })}
					options={[...OPTIONS.elemWind]}
				/>
			</Field>
			<Field label="👤 Human Element">
				<Sel
					id="elem-human"
					value={gen.getSceneConfig(gen.currentScene).elemHuman}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { elemHuman: v })}
					options={[...OPTIONS.elemHuman]}
				/>
			</Field>
			<Field label="🌫️ Atmosphere">
				<Sel
					id="elem-atmo"
					value={gen.getSceneConfig(gen.currentScene).elemAtmo}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { elemAtmo: v })}
					options={[...OPTIONS.elemAtmo]}
				/>
			</Field>
			<Field label="🍁 Season">
				<Sel
					id="elem-season"
					value={gen.getSceneConfig(gen.currentScene).elemSeason}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { elemSeason: v })}
					options={[...OPTIONS.elemSeason]}
				/>
			</Field>
		</div>
	);
}

