"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { CarMusicVideoGenerator } from "../../types";

export default function CarsTab({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Hero Car (Utama)">
				<Sel
					id="car-hero"
					value={gen.getSceneConfig(gen.currentScene).carHero}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { carHero: v })}
					options={[...OPTIONS.carHero]}
				/>
			</Field>
			<Field label="Secondary Cars (Latar)">
				<Sel
					id="car-secondary"
					value={gen.getSceneConfig(gen.currentScene).carSecondary}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { carSecondary: v })
					}
					options={[...OPTIONS.carSecondary]}
				/>
			</Field>
			<Field label="Aksi Hero Car">
				<Sel
					id="car-action"
					value={gen.getSceneConfig(gen.currentScene).carAction}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { carAction: v })
					}
					options={[...OPTIONS.carAction]}
				/>
			</Field>
			<Field label="Detail Visual Mobil">
				<Sel
					id="car-detail"
					value={gen.getSceneConfig(gen.currentScene).carDetail}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { carDetail: v })
					}
					options={[...OPTIONS.carDetail]}
				/>
			</Field>
			<Field label="Warna Dominan Mobil">
				<Sel
					id="car-color"
					value={gen.getSceneConfig(gen.currentScene).carColor}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { carColor: v })
					}
					options={[...OPTIONS.carColor]}
				/>
			</Field>
			<Field label="Jumlah Mobil di Frame">
				<Sel
					id="car-count"
					value={gen.getSceneConfig(gen.currentScene).carCount}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { carCount: v })
					}
					options={[...OPTIONS.carCount]}
				/>
			</Field>
		</div>
	);
}

