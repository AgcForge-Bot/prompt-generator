"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { AsmrTimelapseGenerator } from "../../types";

export default function TimelapseTab({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="⏱️ Mode Timelapse">
				<Sel
					id="tl-mode"
					value={gen.getSceneConfig(gen.currentScene).tlMode}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { tlMode: v })}
					options={[...OPTIONS.tlMode]}
				/>
			</Field>
			<Field label="🕐 Kompresi Waktu">
				<Sel
					id="tl-compression"
					value={gen.getSceneConfig(gen.currentScene).tlCompression}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { tlCompression: v })
					}
					options={[...OPTIONS.tlCompression]}
				/>
			</Field>
			<Field label="📊 Progress Visual">
				<Sel
					id="tl-progress"
					value={gen.getSceneConfig(gen.currentScene).tlProgress}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { tlProgress: v })}
					options={[...OPTIONS.tlProgress]}
				/>
			</Field>
			<Field label="🌤️ Sky / Weather">
				<Sel
					id="tl-sky"
					value={gen.getSceneConfig(gen.currentScene).tlSky}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { tlSky: v })}
					options={[...OPTIONS.tlSky]}
				/>
			</Field>
		</div>
	);
}

