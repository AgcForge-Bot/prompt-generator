"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { AsmrTimelapseGenerator } from "../../types";

export default function NarrationTab({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-2">
				<button
					type="button"
					className={`rounded-lg border px-3 py-2 transition-all ${
						gen.narratorGender === "male"
							? "border-leaf bg-moss/20 text-leaf2"
							: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/40 hover:bg-moss/10"
					}`}
					onClick={() => gen.setNarratorGenderSafe("male")}
				>
					<div className="font-bold text-sm">👨 Male Voice</div>
					<div className="font-mono text-[10px] opacity-75">Deep Authoritative</div>
				</button>
				<button
					type="button"
					className={`rounded-lg border px-3 py-2 transition-all ${
						gen.narratorGender === "female"
							? "border-leaf bg-moss/20 text-leaf2"
							: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/40 hover:bg-moss/10"
					}`}
					onClick={() => gen.setNarratorGenderSafe("female")}
				>
					<div className="font-bold text-sm">👩 Female Voice</div>
					<div className="font-mono text-[10px] opacity-75">Clear Confident</div>
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<Field label="🔊 Frekuensi Narasi">
					<Sel
						id="nar-freq"
						value={gen.getSceneConfig(gen.currentScene).narFreq}
						onChange={(v) => gen.updateSceneConfig(gen.currentScene, { narFreq: v })}
						options={[...OPTIONS.narFreq]}
					/>
				</Field>
				<Field label="📣 Gaya Instruksi">
					<Sel
						id="nar-style"
						value={gen.getSceneConfig(gen.currentScene).narStyle}
						onChange={(v) =>
							gen.updateSceneConfig(gen.currentScene, { narStyle: v })
						}
						options={[...OPTIONS.narStyle]}
					/>
				</Field>
				<Field label="💬 Contoh Instruksi">
					<Sel
						id="nar-line"
						value={gen.getSceneConfig(gen.currentScene).narLine}
						onChange={(v) =>
							gen.updateSceneConfig(gen.currentScene, { narLine: v })
						}
						options={[...OPTIONS.narLine]}
					/>
				</Field>
				<Field label="🎙️ Kualitas Audio">
					<Sel
						id="nar-audio"
						value={gen.getSceneConfig(gen.currentScene).narAudio}
						onChange={(v) =>
							gen.updateSceneConfig(gen.currentScene, { narAudio: v })
						}
						options={[...OPTIONS.narAudio]}
					/>
				</Field>
			</div>
		</div>
	);
}

