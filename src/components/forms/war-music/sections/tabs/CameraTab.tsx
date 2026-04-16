"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { WarMusicVideoGenerator } from "../../types";

export default function CameraTab({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Angle Kamera">
				<Sel
					id="cam-angle"
					value={gen.getSceneConfig(gen.currentScene).camAngle}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { camAngle: v })
					}
					options={[...OPTIONS.camAngle]}
				/>
			</Field>
			<Field label="Gerakan Kamera">
				<Sel
					id="cam-move"
					value={gen.getSceneConfig(gen.currentScene).camMove}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camMove: v })}
					options={[...OPTIONS.camMove]}
				/>
			</Field>
			<Field label="Mood">
				<Sel
					id="cam-mood"
					value={gen.getSceneConfig(gen.currentScene).camMood}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camMood: v })}
					options={[...OPTIONS.camMood]}
				/>
			</Field>
			<Field label="Quality">
				<Sel
					id="cam-quality"
					value={gen.getSceneConfig(gen.currentScene).camQuality}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { camQuality: v })
					}
					options={[...OPTIONS.camQuality]}
				/>
			</Field>
			<Field label="Color Grade">
				<Sel
					id="cam-grade"
					value={gen.getSceneConfig(gen.currentScene).camGrade}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { camGrade: v })
					}
					options={[...OPTIONS.camGrade]}
				/>
			</Field>
			<Field label="Lens">
				<Sel
					id="cam-lens"
					value={gen.getSceneConfig(gen.currentScene).camLens}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { camLens: v })}
					options={[...OPTIONS.camLens]}
				/>
			</Field>
		</div>
	);
}

