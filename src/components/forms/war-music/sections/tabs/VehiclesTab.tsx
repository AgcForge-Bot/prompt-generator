"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { WarMusicVideoGenerator } from "../../types";

export default function VehiclesTab({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Ground Vehicle">
				<Sel
					id="veh-ground"
					value={gen.getSceneConfig(gen.currentScene).vehGround}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vehGround: v })
					}
					options={[...OPTIONS.vehGround]}
				/>
			</Field>
			<Field label="Air Vehicle">
				<Sel
					id="veh-air"
					value={gen.getSceneConfig(gen.currentScene).vehAir}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { vehAir: v })}
					options={[...OPTIONS.vehAir]}
				/>
			</Field>
			<Field label="Naval">
				<Sel
					id="veh-naval"
					value={gen.getSceneConfig(gen.currentScene).vehNaval}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vehNaval: v })
					}
					options={[...OPTIONS.vehNaval]}
				/>
			</Field>
			<Field label="Aksi Kendaraan">
				<Sel
					id="veh-action"
					value={gen.getSceneConfig(gen.currentScene).vehAction}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vehAction: v })
					}
					options={[...OPTIONS.vehAction]}
				/>
			</Field>
		</div>
	);
}

