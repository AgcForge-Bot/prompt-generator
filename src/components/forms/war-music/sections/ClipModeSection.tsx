"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";
import {
	CLIP_MODE_LABELS,
	TRAILER_CHARACTER_ROLES,
	WAR_MOVIE_REFS,
} from "../constants";
import type {
	AIProviderKey,
	ClipModeKey,
	WarMusicVideoGenerator,
} from "../types";

export default function ClipModeSection({
	gen,
}: {
	gen: WarMusicVideoGenerator;
}) {
	const clipModes = Object.keys(CLIP_MODE_LABELS) as ClipModeKey[];

	return (
		<section className="card mb-5">
			<div className="section-label">🎬 Mode Video Clip</div>

			<div className="flex flex-wrap gap-2 mb-3">
				{clipModes.map((m) => {
					const active = gen.clipMode === m;
					return (
						<button
							key={m}
							type="button"
							className={active ? "btn-primary" : "btn-outline"}
							onClick={() => gen.setClipMode(m)}
						>
							{CLIP_MODE_LABELS[m]}
						</button>
					);
				})}
			</div>

			{gen.clipMode === "trailer" && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="🎞️ Referensi Film (Trailer)">
							<Sel
								id="war-film-ref"
								value={gen.filmRef}
								onChange={(v) => gen.setFilmRefFromDropdown(v)}
								options={[
									...((WAR_MOVIE_REFS as readonly string[]).includes(
										gen.filmRef,
									)
										? []
										: gen.filmRef
											? [
													{
														value: gen.filmRef,
														label: `${gen.filmRef} (Custom)`,
													},
												]
											: []),
									...WAR_MOVIE_REFS.map((f) => ({ value: f, label: f })),
								]}
							/>
							{!gen.isFilmRefValid && (
								<div className="font-mono text-[10px] text-amber mt-2">
									⚠ Referensi film wajib diisi untuk Mode Trailer.
								</div>
							)}
						</Field>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								Mode Trailer memakai vibe & pacing film referensi, tapi karakter
								tetap original (bukan meniru aktor asli).
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
						<Field label="⌨️ Atau ketik judul film sendiri">
							<input
								className="forest-input"
								value={gen.filmRef}
								onChange={(e) => gen.setFilmRef(e.target.value)}
								placeholder="Contoh: Iron Horizon (2026)"
							/>
							<div className="flex items-center gap-2 mt-2">
								<button
									type="button"
									className="btn-outline text-[10px] py-1 px-3"
									onClick={gen.useDropdownFilmRef}
								>
									Use Dropdown
								</button>
								<button
									type="button"
									className="btn-ghost text-[10px] py-1 px-3"
									onClick={() => gen.setFilmRef("")}
								>
									Clear Custom
								</button>
							</div>
						</Field>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								Judul custom akan dipakai di semua prompt/SEO (tetap karakter
								original, tanpa meniru aktor asli).
							</div>
						</div>
					</div>

					<div className="rounded-xl border border-leaf/15 bg-bark/20 p-4 mt-3">
						<div className="flex items-center justify-between gap-2 mb-3">
							<div className="font-mono text-[9px] text-stone2 uppercase tracking-wider">
								🎭 Karakter Trailer (Global)
							</div>
							<div className="flex items-center gap-2">
								{(() => {
									const used = new Map<number, number>();
									for (const c of gen.trailerCharacters) {
										const n = c.introSceneNumber;
										if (!n) continue;
										used.set(n, (used.get(n) ?? 0) + 1);
									}
									const dup = [...used.entries()]
										.filter(([, count]) => count > 1)
										.map(([n]) => n)
										.sort((a, b) => a - b);
									if (dup.length === 0) return null;
									return (
										<div className="font-mono text-[10px] text-amber">
											⚠ Duplicate intro scene: {dup.join(", ")}
										</div>
									);
								})()}
								<button
									type="button"
									className="btn-outline text-[10px] py-1 px-3"
									onClick={gen.normalizeTrailerIntroScenes}
								>
									🧹 Auto Fix
								</button>
								<button
									type="button"
									className="btn-ghost text-[10px] py-1 px-3"
									onClick={gen.randomizeTrailerCharacters}
								>
									🎲 Random Karakter
								</button>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-3">
							{gen.trailerCharacters.map((c, i) => (
								<div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
									<input
										className="forest-input"
										placeholder="Nama karakter"
										value={c.name}
										onChange={(e) =>
											gen.updateTrailerCharacter(i, { name: e.target.value })
										}
									/>
									<Sel
										id={`war-trailer-role-${i}`}
										value={c.role}
										onChange={(v) => gen.updateTrailerCharacter(i, { role: v })}
										options={TRAILER_CHARACTER_ROLES.map((r) => ({
											value: r,
											label: r,
										}))}
									/>
									<Sel
										id={`war-trailer-intro-${i}`}
										value={String(c.introSceneNumber ?? i + 2)}
										onChange={(v) =>
											gen.updateTrailerCharacter(i, {
												introSceneNumber: Number(v),
											})
										}
										options={Array.from(
											{ length: gen.totalScenes },
											(_, idx) => {
												const sn = idx + 1;
												return {
													value: String(sn),
													label: `Intro Scene ${sn}`,
												};
											},
										)}
									/>
									<input
										className="forest-input"
										placeholder="Deskripsi wajah (original)"
										value={c.faceDescription}
										onChange={(e) =>
											gen.updateTrailerCharacter(i, {
												faceDescription: e.target.value,
											})
										}
									/>
								</div>
							))}
						</div>
					</div>
				</>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
				<Field label="🤖 AI Provider (untuk Generate All With AI)">
					<Sel
						id="war-ai-provider"
						value={gen.aiProvider}
						onChange={(v) => {
							const p = v as AIProviderKey;
							gen.setAiProvider(p);
							gen.setAiModelId(getDefaultModelId(p));
						}}
						options={AI_MODELS_PROVIDER.map((p) => ({
							value: p.value,
							label: p.label,
						}))}
					/>
				</Field>
				<Field label="🧠 AI Model">
					<Sel
						id="war-ai-model"
						value={gen.aiModelId || getDefaultModelId(gen.aiProvider)}
						onChange={(v) => gen.setAiModelId(v)}
						options={getModelOptions(gen.aiProvider).map((m) => ({
							value: m.value,
							label: m.label,
						}))}
					/>
				</Field>
			</div>
		</section>
	);
}
