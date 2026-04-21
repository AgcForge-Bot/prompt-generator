"use client";

import type { ShortMovieGeneratorConfig } from "../types";
import { GENRE_CATEGORIES } from "../constants";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";

export default function GenreMovieSection({
	gen,
	isManualInput,
	setIsManualInput,
}: {
	gen: ShortMovieGeneratorConfig;
	isManualInput: boolean;
	setIsManualInput: (v: boolean) => void;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎭 Genre & Referensi Film</div>
			<div className="bg-leaf/10 border border-leaf/20 rounded-xl p-3 mb-4 font-mono text-[11px] text-sand leading-relaxed">
				<span className="text-leaf2 font-bold">💡 Cara kerja:</span> Pilih genre
				→ pilih film referensi dari list{" "}
				<span className="text-amber2">atau input manual</span> → AI buat cerita
				original terinspirasi film tersebut dengan karakter & nama baru.
			</div>

			{/* Genre selector buttons */}
			<div className="flex flex-wrap gap-2 mb-4">
				{GENRE_CATEGORIES.map((cat) => (
					<button
						key={cat.key}
						type="button"
						onClick={() => {
							gen.setGenre(cat.key);
							setIsManualInput(false);
						}}
						className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all ${
							gen.config.genre === cat.key
								? "bg-moss/40 border-leaf text-leaf2"
								: "bg-bark/30 border-leaf/20 text-stone2 hover:border-leaf/50 hover:text-cream"
						}`}
					>
						{cat.label}
					</button>
				))}
			</div>

			{/* Toggle: list vs manual */}
			<div className="flex gap-1 mb-4 bg-bark/40 rounded-xl p-1">
				<button
					type="button"
					className={`flex-1 py-2 rounded-lg font-mono text-[10px] font-bold transition-all ${!isManualInput ? "bg-moss/50 text-leaf2" : "text-stone2 hover:text-cream"}`}
					onClick={() => {
						setIsManualInput(false);
						// Reset ke film pertama dari genre saat ini
						gen.setGenre(gen.config.genre);
					}}
				>
					📋 Pilih dari List
				</button>
				<button
					type="button"
					className={`flex-1 py-2 rounded-lg font-mono text-[10px] font-bold transition-all ${isManualInput ? "bg-amber/30 text-amber2" : "text-stone2 hover:text-cream"}`}
					onClick={() => setIsManualInput(true)}
				>
					✏️ Input Manual
				</button>
			</div>

			{!isManualInput ? (
				/* ── MODE: Pilih dari list ── */
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Field label="🎞️ Referensi Film">
						<Sel
							id="sm-movie-ref"
							value={gen.config.movieRefTitle}
							onChange={(v) => gen.setMovieRef(v)}
							options={gen.movieOptions.map((m) => ({
								value: m.title,
								label: m.title,
							}))}
						/>
					</Field>

					{/* Story preview */}
					<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 flex flex-col justify-center">
						<div className="font-mono text-[10px] text-leaf2 font-bold mb-1">
							📖 Storyline Referensi
						</div>
						<div className="font-mono text-[10px] text-stone2 leading-relaxed">
							{gen.config.movieRefStory}
						</div>
					</div>
				</div>
			) : (
				/* ── MODE: Input manual ── */
				<div className="flex flex-col gap-3">
					<div className="bg-amber/10 border border-amber/25 rounded-xl p-3 font-mono text-[10px] text-amber2 leading-relaxed">
						✏️ <span className="font-bold">Mode Manual:</span> Masukkan judul
						film lain sesuai genre{" "}
						<span className="text-cream font-bold">
							{GENRE_CATEGORIES.find((c) => c.key === gen.config.genre)?.label}
						</span>
						. Sinopsis bisa diisi untuk hasil lebih akurat, atau kosongkan dan
						AI akan menyesuaikan berdasarkan judul.
					</div>

					<Field label="🎞️ Judul Film (Manual)">
						<input
							className="forest-input"
							value={
								isManualInput &&
								!gen.movieOptions.find(
									(m) => m.title === gen.config.movieRefTitle,
								)
									? gen.config.movieRefTitle
									: ""
							}
							placeholder={`Contoh: The Dark Knight, Parasite, Your Name...`}
							onChange={(e) => gen.setMovieRefManual(e.target.value)}
						/>
					</Field>

					<Field label="📖 Sinopsis / Storyline (Opsional)">
						<textarea
							className="forest-input min-h-24 resize-y"
							value={gen.config.movieRefStory}
							placeholder="Opsional — deskripsikan singkat cerita film untuk hasil yang lebih akurat. Kosongkan jika ingin AI generate sendiri berdasarkan judul."
							onChange={(e) => gen.setMovieStoryManual(e.target.value)}
							rows={4}
						/>
					</Field>

					{/* Preview what will be sent to AI */}
					{gen.config.movieRefTitle && (
						<div className="rounded-xl border border-amber/20 bg-amber/5 p-3">
							<div className="font-mono text-[9px] text-amber2 uppercase tracking-widest mb-2">
								Preview — Yang dikirim ke AI:
							</div>
							<div className="font-mono text-[10px] text-sand leading-relaxed">
								<span className="text-leaf2">Judul:</span>{" "}
								{gen.config.movieRefTitle || "—"}
							</div>
							<div className="font-mono text-[10px] text-sand leading-relaxed mt-1">
								<span className="text-leaf2">Sinopsis:</span>{" "}
								{gen.config.movieRefStory || (
									<span className="text-stone italic">
										(AI akan generate berdasarkan judul)
									</span>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</section>
	);
}
