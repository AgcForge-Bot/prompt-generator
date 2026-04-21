"use client";

import type { ShortMovieGeneratorConfig } from "../types";
import {
	CAST_COUNT_OPTIONS,
	GENDER_OPTIONS,
	STORY_INTENSITY_OPTIONS,
} from "../constants";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";

export default function CastStoryConfigSection({
	gen,
}: {
	gen: ShortMovieGeneratorConfig;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎭 Konfigurasi Cast & Cerita</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				<Field label="👥 Jumlah Cast">
					<Sel
						id="sm-cast-count"
						value={gen.config.castCountMode}
						onChange={(v) =>
							gen.updateConfig({
								castCountMode: v as typeof gen.config.castCountMode,
							})
						}
						options={CAST_COUNT_OPTIONS}
					/>
				</Field>
				<Field label="🧑 Gender Karakter Utama">
					<Sel
						id="sm-gender"
						value={gen.config.mainGender}
						onChange={(v) =>
							gen.updateConfig({
								mainGender: v as typeof gen.config.mainGender,
							})
						}
						options={GENDER_OPTIONS}
					/>
				</Field>
				<Field label="📈 Story Intensity">
					<Sel
						id="sm-intensity"
						value={gen.config.storyIntensity}
						onChange={(v) =>
							gen.updateConfig({
								storyIntensity: v as typeof gen.config.storyIntensity,
							})
						}
						options={STORY_INTENSITY_OPTIONS}
					/>
				</Field>
			</div>

			<div className="mt-3 p-3 rounded-xl bg-bark/40 border border-leaf/10 font-mono text-[10px] text-stone2 leading-relaxed">
				<span className="text-amber2 font-bold">ℹ Karakter:</span> Nama, wajah,
				dan outfit semua karakter akan dibuat original oleh AI — tidak meniru
				aktor/aktris asli dari film referensi. Konsistensi wajah & pakaian
				terjaga di seluruh scene.
			</div>
		</section>
	);
}
