"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { AsmrTimelapseGenerator } from "../../types";

export default function AsmrTab({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🎵 Musik">
				<Sel
					id="asmr-music"
					value={gen.getSceneConfig(gen.currentScene).asmrMusic}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { asmrMusic: v })
					}
					options={[...OPTIONS.asmrMusic]}
				/>
			</Field>
			<Field label="🧩 Layer Utama">
				<Sel
					id="asmr-layer"
					value={gen.getSceneConfig(gen.currentScene).asmrLayer}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { asmrLayer: v })
					}
					options={[...OPTIONS.asmrLayer]}
				/>
			</Field>
			<Field label="🌿 Ambient">
				<Sel
					id="asmr-ambient"
					value={gen.getSceneConfig(gen.currentScene).asmrAmbient}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { asmrAmbient: v })
					}
					options={[...OPTIONS.asmrAmbient]}
				/>
			</Field>
			<Field label="✨ Special Moment">
				<Sel
					id="asmr-moment"
					value={gen.getSceneConfig(gen.currentScene).asmrMoment}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { asmrMoment: v })
					}
					options={[...OPTIONS.asmrMoment]}
				/>
			</Field>
		</div>
	);
}

