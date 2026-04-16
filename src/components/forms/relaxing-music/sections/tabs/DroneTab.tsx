"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function DroneTab({ gen }: { gen: RelaxingMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🚁 Drone Movement">
				<Sel
					id="cam-move"
					value={gen.getSceneConfig(gen.currentScene).camMove}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camMove: v })}
					options={[...OPTIONS.camMove]}
				/>
			</Field>
			<Field label="📐 Camera Angle">
				<Sel
					id="cam-angle"
					value={gen.getSceneConfig(gen.currentScene).camAngle}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camAngle: v })}
					options={[...OPTIONS.camAngle]}
				/>
			</Field>
			<Field label="🔭 Lens">
				<Sel
					id="cam-lens"
					value={gen.getSceneConfig(gen.currentScene).camLens}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camLens: v })}
					options={[...OPTIONS.camLens]}
				/>
			</Field>
			<Field label="⏱️ Speed">
				<Sel
					id="cam-speed"
					value={gen.getSceneConfig(gen.currentScene).camSpeed}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camSpeed: v })}
					options={[...OPTIONS.camSpeed]}
				/>
			</Field>
		</div>
	);
}

