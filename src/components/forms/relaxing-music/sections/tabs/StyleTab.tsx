"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { RelaxingMusicVideoGenerator } from "../../types";

export default function StyleTab({ gen }: { gen: RelaxingMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🎭 Mood">
				<Sel
					id="sty-mood"
					value={gen.getSceneConfig(gen.currentScene).styMood}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { styMood: v })}
					options={[...OPTIONS.styMood]}
				/>
			</Field>
			<Field label="🎨 Color Grade">
				<Sel
					id="sty-grade"
					value={gen.getSceneConfig(gen.currentScene).styGrade}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { styGrade: v })}
					options={[...OPTIONS.styGrade]}
				/>
			</Field>
			<Field label="🧿 Quality">
				<Sel
					id="sty-quality"
					value={gen.getSceneConfig(gen.currentScene).styQuality}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { styQuality: v })
					}
					options={[...OPTIONS.styQuality]}
				/>
			</Field>
			<Field label="🎵 Music Match">
				<Sel
					id="sty-music"
					value={gen.getSceneConfig(gen.currentScene).styMusic}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { styMusic: v })
					}
					options={[...OPTIONS.styMusic]}
				/>
			</Field>
		</div>
	);
}

