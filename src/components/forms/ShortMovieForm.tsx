"use client";

import { useState } from "react";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import {
	AI_MODELS,
	CAST_COUNT_OPTIONS,
	DURATION_MINUTE_OPTIONS,
	DURATION_SEC_PER_SCENE_OPTIONS,
	GENDER_OPTIONS,
	GENRE_CATEGORIES,
	STORY_INTENSITY_OPTIONS,
	VISUAL_STYLE_HINTS,
	VISUAL_STYLE_LABELS,
} from "./short-movie/constants";
import useShortMovieGenerator from "./short-movie/useShortMovieGenerator";
import type { AIProviderKey, VisualStyleKey } from "./short-movie/types";

export default function ShortMovieForm() {
	const g = useShortMovieGenerator();
	const [isManualInput, setIsManualInput] = useState(false);

	const totalDurSec = g.totalScenes * g.config.secPerScene;
	const totalDurMin = (totalDurSec / 60).toFixed(1);

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-leaf text-sm">🎬</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
									Short Movie · AI Video Prompt Generator
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								Short Movie
								<br />
								<em className="text-leaf2 italic">AI Film Generator</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								Film Pendek · Full AI Auto Generate · Scene-by-Scene
								<br />
								Grok · VEO · Kling · Runway · Pika · Sora
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							{[
								["Total Scene", `${g.totalScenes}`],
								["Durasi", `${totalDurMin} menit`],
								["Per-scene", `${g.config.secPerScene} detik`],
								[
									"Genre",
									GENRE_CATEGORIES.find((c) => c.key === g.config.genre)
										?.emoji ?? "🎬",
								],
							].map(([k, v]) => (
								<div
									key={k}
									className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap"
								>
									{k}: <span className="text-leaf2 font-bold">{v}</span>
								</div>
							))}
						</div>
					</div>
				</header>

				{/* ── DURATION ENGINE ── */}
				<section className="card mb-5">
					<div className="section-label">⏱ Duration Engine</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
						<Field label="Total Durasi Video">
							<Sel
								id="sm-dur-total"
								value={String(g.config.totalMinutes)}
								onChange={(v) => g.setDuration(+v, g.config.secPerScene)}
								options={DURATION_MINUTE_OPTIONS}
							/>
						</Field>
						<Field label="Durasi Per-Scene">
							<Sel
								id="sm-dur-scene"
								value={String(g.config.secPerScene)}
								onChange={(v) => g.setDuration(g.config.totalMinutes, +v)}
								options={DURATION_SEC_PER_SCENE_OPTIONS}
							/>
						</Field>
						<Field label="Format Prompt">
							<Sel
								id="sm-fmt"
								value="json-lean"
								onChange={() => {}}
								options={[
									{ value: "json-lean", label: "JSON Lean (aiVideoPrompt.v1)" },
								]}
							/>
						</Field>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bark/40 rounded-xl p-4 border border-leaf/10">
						{[
							[g.totalScenes.toString(), "Total Scene"],
							[totalDurMin, "Menit"],
							[g.config.secPerScene.toString(), "Detik/Scene"],
							[
								Math.max(1, Math.floor(g.totalScenes / 10)).toString(),
								"Emotional Moments",
							],
						].map(([v, l]) => (
							<div key={l} className="flex flex-col items-center gap-1">
								<span className="font-playfair text-3xl font-bold text-leaf2">
									{v}
								</span>
								<span className="font-mono text-[8.5px] text-stone2 uppercase tracking-wide">
									{l}
								</span>
							</div>
						))}
					</div>
				</section>

				{/* ── GENRE & FILM SELECTOR ── */}
				<section className="card mb-5">
					<div className="section-label">🎭 Genre & Referensi Film</div>
					<div className="bg-leaf/10 border border-leaf/20 rounded-xl p-3 mb-4 font-mono text-[11px] text-sand leading-relaxed">
						<span className="text-leaf2 font-bold">💡 Cara kerja:</span> Pilih
						genre → pilih film referensi dari list{" "}
						<span className="text-amber2">atau input manual</span> → AI buat
						cerita original terinspirasi film tersebut dengan karakter & nama
						baru.
					</div>

					{/* Genre selector buttons */}
					<div className="flex flex-wrap gap-2 mb-4">
						{GENRE_CATEGORIES.map((cat) => (
							<button
								key={cat.key}
								type="button"
								onClick={() => {
									g.setGenre(cat.key);
									setIsManualInput(false);
								}}
								className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all ${
									g.config.genre === cat.key
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
								g.setGenre(g.config.genre);
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
									value={g.config.movieRefTitle}
									onChange={(v) => g.setMovieRef(v)}
									options={g.movieOptions.map((m) => ({
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
									{g.config.movieRefStory}
								</div>
							</div>
						</div>
					) : (
						/* ── MODE: Input manual ── */
						<div className="flex flex-col gap-3">
							<div className="bg-amber/10 border border-amber/25 rounded-xl p-3 font-mono text-[10px] text-amber2 leading-relaxed">
								✏️ <span className="font-bold">Mode Manual:</span> Masukkan
								judul film lain sesuai genre{" "}
								<span className="text-cream font-bold">
									{
										GENRE_CATEGORIES.find((c) => c.key === g.config.genre)
											?.label
									}
								</span>
								. Sinopsis bisa diisi untuk hasil lebih akurat, atau kosongkan
								dan AI akan menyesuaikan berdasarkan judul.
							</div>

							<Field label="🎞️ Judul Film (Manual)">
								<input
									className="forest-input"
									value={
										isManualInput &&
										!g.movieOptions.find(
											(m) => m.title === g.config.movieRefTitle,
										)
											? g.config.movieRefTitle
											: ""
									}
									placeholder={`Contoh: The Dark Knight, Parasite, Your Name...`}
									onChange={(e) => g.setMovieRefManual(e.target.value)}
								/>
							</Field>

							<Field label="📖 Sinopsis / Storyline (Opsional)">
								<textarea
									className="forest-input min-h-24 resize-y"
									value={g.config.movieRefStory}
									placeholder="Opsional — deskripsikan singkat cerita film untuk hasil yang lebih akurat. Kosongkan jika ingin AI generate sendiri berdasarkan judul."
									onChange={(e) => g.setMovieStoryManual(e.target.value)}
									rows={4}
								/>
							</Field>

							{/* Preview what will be sent to AI */}
							{g.config.movieRefTitle && (
								<div className="rounded-xl border border-amber/20 bg-amber/5 p-3">
									<div className="font-mono text-[9px] text-amber2 uppercase tracking-widest mb-2">
										Preview — Yang dikirim ke AI:
									</div>
									<div className="font-mono text-[10px] text-sand leading-relaxed">
										<span className="text-leaf2">Judul:</span>{" "}
										{g.config.movieRefTitle || "—"}
									</div>
									<div className="font-mono text-[10px] text-sand leading-relaxed mt-1">
										<span className="text-leaf2">Sinopsis:</span>{" "}
										{g.config.movieRefStory || (
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

				{/* ── CAST & STORY CONFIG ── */}
				<section className="card mb-5">
					<div className="section-label">🎭 Konfigurasi Cast & Cerita</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						<Field label="👥 Jumlah Cast">
							<Sel
								id="sm-cast-count"
								value={g.config.castCountMode}
								onChange={(v) =>
									g.updateConfig({
										castCountMode: v as typeof g.config.castCountMode,
									})
								}
								options={CAST_COUNT_OPTIONS}
							/>
						</Field>
						<Field label="🧑 Gender Karakter Utama">
							<Sel
								id="sm-gender"
								value={g.config.mainGender}
								onChange={(v) =>
									g.updateConfig({
										mainGender: v as typeof g.config.mainGender,
									})
								}
								options={GENDER_OPTIONS}
							/>
						</Field>
						<Field label="📈 Story Intensity">
							<Sel
								id="sm-intensity"
								value={g.config.storyIntensity}
								onChange={(v) =>
									g.updateConfig({
										storyIntensity: v as typeof g.config.storyIntensity,
									})
								}
								options={STORY_INTENSITY_OPTIONS}
							/>
						</Field>
					</div>

					<div className="mt-3 p-3 rounded-xl bg-bark/40 border border-leaf/10 font-mono text-[10px] text-stone2 leading-relaxed">
						<span className="text-amber2 font-bold">ℹ Karakter:</span> Nama,
						wajah, dan outfit semua karakter akan dibuat original oleh AI —
						tidak meniru aktor/aktris asli dari film referensi. Konsistensi
						wajah & pakaian terjaga di seluruh scene.
					</div>
				</section>

				{/* ── VISUAL STYLE ── */}
				<section className="card mb-5">
					<div className="section-label">🎞️ Visual Style</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="flex flex-col gap-2">
							{(Object.keys(VISUAL_STYLE_LABELS) as VisualStyleKey[]).map(
								(key) => (
									<button
										key={key}
										type="button"
										onClick={() => g.updateConfig({ visualStyle: key })}
										className={`text-left px-3 py-2 rounded-xl border transition-all ${
											g.config.visualStyle === key
												? "bg-moss/30 border-leaf text-cream"
												: "bg-bark/30 border-leaf/15 text-stone2 hover:border-leaf/40"
										}`}
									>
										<span className="font-playfair text-sm font-bold">
											{VISUAL_STYLE_LABELS[key]}
										</span>
									</button>
								),
							)}
						</div>
						<div className="rounded-xl border border-leaf/10 bg-bark/25 p-4 flex flex-col justify-center">
							<div className="font-mono text-[10px] text-leaf2 font-bold mb-2">
								Hint Visual
							</div>
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								{VISUAL_STYLE_HINTS[g.config.visualStyle]}
							</div>
						</div>
					</div>
				</section>

				{/* ── AI PROVIDER ── */}
				<section className="card mb-5">
					<div className="section-label">🤖 AI Provider & Model</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Provider">
							<Sel
								id="sm-ai-provider"
								value={g.config.aiProvider}
								onChange={(v) => g.setAiProvider(v as AIProviderKey)}
								options={Object.entries(AI_MODELS).map(([k, v]) => ({
									value: k,
									label: v.label,
								}))}
							/>
						</Field>
						<Field label="Model">
							<Sel
								id="sm-ai-model"
								value={g.config.aiModelId}
								onChange={(v) => g.updateConfig({ aiModelId: v })}
								options={g.aiModelOptions}
							/>
						</Field>
					</div>
					<div className="mt-3 p-3 rounded-xl bg-bark/40 border border-leaf/10 font-mono text-[10px] text-stone2">
						Total scene:{" "}
						<span className="text-leaf2 font-bold">{g.totalScenes}</span> ×{" "}
						{g.config.secPerScene}s ={" "}
						<span className="text-amber2 font-bold">
							{totalDurSec}s ({totalDurMin} menit)
						</span>
						. maxTokens: 16000. Estimasi waktu generate:{" "}
						<span className="text-amber2">30–90 detik</span>.
					</div>
				</section>

				{/* ── GENERATE BUTTON ── */}
				<section className="card mb-5">
					<div className="section-label">🚀 Generate</div>
					<div className="flex gap-3 flex-wrap items-center">
						<button
							type="button"
							className="btn-amber"
							onClick={g.generateAllWithAI}
							disabled={g.isGenerating}
						>
							<span className="inline-flex items-center gap-2">
								{g.isGenerating && (
									<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
								)}
								{g.isGenerating
									? `⏳ Generating ${g.totalScenes} scenes...`
									: `🎬 Generate ${g.totalScenes} Scene Short Film`}
							</span>
						</button>
						{g.allPrompts.length > 0 && (
							<>
								<button type="button" className="btn-ghost" onClick={g.copyAll}>
									📋 Copy Semua
								</button>
								<button
									type="button"
									className="btn-ghost"
									onClick={g.downloadAllJson}
								>
									💾 Download JSON
								</button>
							</>
						)}
					</div>
					{g.isGenerating && (
						<div className="mt-4 p-3 rounded-xl bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2 leading-relaxed">
							🤖 AI sedang menulis {g.totalScenes} scene short film... Proses
							ini memakan waktu 30–90 detik tergantung jumlah scene dan provider
							AI yang dipilih.
						</div>
					)}
				</section>

				{/* ── PROMPT OUTPUT ── */}
				{g.allPrompts.length > 0 && (
					<section
						className="mb-5 rounded-2xl overflow-hidden"
						style={{
							background: "rgba(10,20,10,0.88)",
							border: "1px solid rgba(122,182,72,0.2)",
							boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
						}}
					>
						<div className="h-0.5 bg-linear-to-r from-moss via-leaf2 to-amber" />
						<div className="p-6">
							{/* Scene navigator */}
							<div className="flex items-center justify-between mb-4 flex-wrap gap-2">
								<span className="font-playfair text-lg italic text-sand">
									Scene Prompts
								</span>
								<div className="flex items-center gap-2">
									<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-leaf/10 text-leaf2 border border-leaf/25">
										{g.allPrompts.length}/{g.totalScenes} scenes
									</span>
								</div>
							</div>

							{/* Current scene viewer */}
							<div className="mb-3">
								<div className="flex items-center gap-2 mb-2 flex-wrap">
									<span className="font-mono text-[9px] text-leaf uppercase tracking-wider">
										◆ Scene {g.currentScene}/{g.totalScenes}
									</span>
									<div className="flex gap-1 flex-wrap">
										{[
											Math.max(1, g.currentScene - 1),
											g.currentScene,
											Math.min(g.totalScenes, g.currentScene + 1),
										]
											.filter((v, i, a) => a.indexOf(v) === i)
											.map((n) => (
												<button
													key={n}
													type="button"
													onClick={() => g.setCurrentScene(n)}
													className={`w-7 h-7 rounded-lg font-mono text-[9px] font-bold border transition-all ${
														n === g.currentScene
															? "bg-leaf/20 border-leaf text-leaf2"
															: "bg-bark/40 border-leaf/20 text-stone2 hover:border-leaf/50"
													}`}
												>
													{n}
												</button>
											))}
									</div>
								</div>
								<pre className="prompt-box font-mono text-[9.5px] text-stone2 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
									{g.allPrompts[g.currentScene - 1] ?? ""}
								</pre>
								<div className="flex gap-2 mt-2 flex-wrap">
									<button
										type="button"
										className="btn-ghost"
										onClick={g.copyPrompt}
									>
										📋 Copy Scene {g.currentScene}
									</button>
									<button
										type="button"
										className="btn-ghost"
										onClick={() =>
											g.setCurrentScene(
												Math.min(g.totalScenes, g.currentScene + 1),
											)
										}
										disabled={g.currentScene >= g.totalScenes}
									>
										Next →
									</button>
								</div>
							</div>

							{/* Show/hide all prompts */}
							<button
								type="button"
								className="btn-outline w-full mb-3"
								onClick={() => g.setShowAllPrompts(!g.showAllPrompts)}
							>
								👁 {g.showAllPrompts ? "Sembunyikan" : "Lihat"} Semua{" "}
								{g.totalScenes} Scene
							</button>

							{g.showAllPrompts && (
								<div className="space-y-3 max-h-150 overflow-y-auto">
									{g.allPrompts.map((p, i) => (
										<div
											key={i}
											className={`rounded-xl p-4 border-l-4 ${
												i === 0 || i === g.allPrompts.length - 1
													? "border-amber bg-amber/5"
													: "border-moss2 bg-bark/30"
											} border border-leaf/10`}
										>
											<div className="font-mono text-[9px] text-leaf mb-2 uppercase tracking-wide">
												◆ Scene {i + 1}/{g.totalScenes}
												{i === 0
													? " · 🎬 TEASER HOOK"
													: i === g.allPrompts.length - 1
														? " · 🎬 CLOSING CREDITS"
														: ""}
											</div>
											<pre className="font-mono text-[9.5px] text-stone2 whitespace-pre-wrap leading-relaxed">
												{p}
											</pre>
										</div>
									))}
								</div>
							)}

							{/* SEO PACK */}
							{g.seoPack && (
								<div className="rounded-xl border border-leaf/15 bg-bark/20 p-4 mt-4">
									<div className="flex items-center justify-between gap-2 mb-3">
										<div className="font-mono text-[9px] text-stone2 uppercase tracking-wider">
											📈 SEO Pack (AI)
										</div>
										<div className="flex items-center gap-2">
											<button
												type="button"
												className="btn-outline text-[10px] py-1 px-3"
												onClick={g.downloadSeoPackJson}
											>
												⬇️ JSON
											</button>
											<button
												type="button"
												className="btn-outline text-[10px] py-1 px-3"
												onClick={g.downloadSeoPackTxt}
											>
												⬇️ TXT
											</button>
										</div>
									</div>

									{/* Title */}
									<div className="flex items-center justify-between gap-2 mb-2">
										<div className="font-mono text-[10px] text-stone2">
											Judul
										</div>
										<button
											type="button"
											className="btn-ghost text-[10px] py-1 px-3"
											onClick={g.copySeoTitle}
										>
											📋 Copy
										</button>
									</div>
									<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 font-mono text-[10px] text-sand mb-4">
										{g.seoPack.title}
									</div>

									{/* Description */}
									<div className="flex items-center justify-between gap-2 mb-2">
										<div className="font-mono text-[10px] text-stone2">
											Deskripsi
										</div>
										<button
											type="button"
											className="btn-ghost text-[10px] py-1 px-3"
											onClick={g.copySeoDescription}
										>
											📋 Copy
										</button>
									</div>
									<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3 mb-4">
										<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
											{g.seoPack.description}
										</pre>
									</div>

									{/* Tags */}
									<div className="flex items-center justify-between gap-2 mb-2">
										<div className="font-mono text-[10px] text-stone2">
											Tags ({g.seoPack.tags.length})
										</div>
										<button
											type="button"
											className="btn-ghost text-[10px] py-1 px-3"
											onClick={g.copySeoTags}
										>
											📋 Copy
										</button>
									</div>
									<div className="flex flex-wrap gap-1 mb-4">
										{g.seoPack.tags.map((t) => (
											<span
												key={t}
												className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bark/40 border border-stone/20 text-stone2"
											>
												{t}
											</span>
										))}
									</div>

									{/* Thumbnail */}
									<div className="flex items-center justify-between gap-2 mb-2">
										<div className="font-mono text-[10px] text-stone2">
											Thumbnail Prompt
										</div>
										<button
											type="button"
											className="btn-ghost text-[10px] py-1 px-3"
											onClick={g.copySeoThumbnailPrompt}
										>
											📋 Copy
										</button>
									</div>
									<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
										<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
											{g.seoPack.thumbnailPrompt}
										</pre>
									</div>
								</div>
							)}
						</div>
					</section>
				)}

				{/* FOOTER */}
				<footer className="text-center pt-6 border-t border-leaf/15 font-mono text-[10px] text-stone leading-loose">
					<p>
						Short Movie AI Generator ·{" "}
						<span className="text-leaf2">AI Video Prompt Generator</span>
					</p>
				</footer>
			</div>

			{/* Toast */}
			<div
				className={`toast-base bg-moss/95 text-white transition-all ${
					g.toast.show
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
				}`}
			>
				{g.toast.msg}
			</div>
		</div>
	);
}
