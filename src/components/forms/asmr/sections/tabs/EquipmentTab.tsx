"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { AsmrTimelapseGenerator } from "../../types";

export default function EquipmentTab({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="🚜 Alat Utama">
				<Sel
					id="eq-main"
					value={gen.getSceneConfig(gen.currentScene).eqMain}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { eqMain: v })}
					options={[...OPTIONS.eqMain]}
				/>
			</Field>
			<Field label="🚚 Kendaraan Pendukung">
				<Sel
					id="eq-support"
					value={gen.getSceneConfig(gen.currentScene).eqSupport}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { eqSupport: v })
					}
					options={[...OPTIONS.eqSupport]}
				/>
			</Field>
			<Field label="🔧 Alat Tangan">
				<Sel
					id="eq-hand"
					value={gen.getSceneConfig(gen.currentScene).eqHand}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { eqHand: v })}
					options={[...OPTIONS.eqHand]}
				/>
			</Field>
			<Field label="⚙️ Gerakan Alat (Timelapse)">
				<Sel
					id="eq-motion"
					value={gen.getSceneConfig(gen.currentScene).eqMotion}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { eqMotion: v })
					}
					options={[...OPTIONS.eqMotion]}
				/>
			</Field>
		</div>
	);
}

