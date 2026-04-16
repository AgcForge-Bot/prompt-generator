"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { CarMusicVideoGenerator } from "../../types";

export default function LocationTab({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Lokasi Utama">
				<Sel
					id="loc-main"
					value={gen.getSceneConfig(gen.currentScene).locMain}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { locMain: v })}
					options={[...OPTIONS.locMain]}
				/>
			</Field>
			<Field label="Waktu">
				<Sel
					id="loc-time"
					value={gen.getSceneConfig(gen.currentScene).locTime}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { locTime: v })}
					options={[...OPTIONS.locTime]}
				/>
			</Field>
			<Field label="Palette">
				<Sel
					id="loc-palette"
					value={gen.getSceneConfig(gen.currentScene).locPalette}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { locPalette: v })
					}
					options={[...OPTIONS.locPalette]}
				/>
			</Field>
			<Field label="Atmosphere">
				<Sel
					id="loc-atmo"
					value={gen.getSceneConfig(gen.currentScene).locAtmo}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { locAtmo: v })}
					options={[...OPTIONS.locAtmo]}
				/>
			</Field>
		</div>
	);
}

