"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function LocationTab({
	gen,
}: {
	gen: RelaxingMusicVideoGenerator;
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🇪🇺 Negara / Region Eropa">
				<Sel
					id="loc-country"
					value={gen.getSceneConfig(gen.currentScene).locCountry}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { locCountry: v })
					}
					options={[...OPTIONS.locCountry]}
				/>
			</Field>
			<Field label="🏡 Setting Lokasi">
				<Sel
					id="loc-setting"
					value={gen.getSceneConfig(gen.currentScene).locSetting}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { locSetting: v })
					}
					options={[...OPTIONS.locSetting]}
				/>
			</Field>
			<Field label="🌤️ Weather / Atmosfer">
				<Sel
					id="loc-weather"
					value={gen.getSceneConfig(gen.currentScene).locWeather}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { locWeather: v })
					}
					options={[...OPTIONS.locWeather]}
				/>
			</Field>
			<Field label="🎨 Palet Warna">
				<Sel
					id="loc-palette"
					value={gen.getSceneConfig(gen.currentScene).locPalette}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { locPalette: v })
					}
					options={[...OPTIONS.locPalette]}
				/>
			</Field>
		</div>
	);
}

