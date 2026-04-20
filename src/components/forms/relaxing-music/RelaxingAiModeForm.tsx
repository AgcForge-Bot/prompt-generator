"use client";

import { useState } from "react";
import useRelaxingAiGenerator, {
	LOCATION_CATEGORIES,
	LOCATION_CATEGORY_GROUPS,
	MOOD_OPTIONS,
	MUSIC_STYLE_OPTIONS,
	DEFAULT_RELAXING_AI_DNA,
	type LocationCategoryKey,
} from "./useRelaxingAiGenerator";
import { OPTIONS, TOD_DATA, VISUAL_STYLE_LABELS } from "./constants";
import type { TodKey, VisualStyleKey } from "./types";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function mmss(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

function OptionRow({
	label,
	value,
	options,
	onChange,
	disabled,
}: {
	label: string;
	value: string;
	options: readonly string[];
	onChange: (v: string) => void;
	disabled?: boolean;
}) {
	return (
		<div>
			<label className="field-label">{label}</label>
			<select
				className="forest-select"
				value={value}
				disabled={disabled}
				onChange={(e) => onChange(e.target.value)}
			>
				{options.map((o) => (
					<option key={o} value={o}>
						{o}
					</option>
				))}
			</select>
		</div>
	);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RelaxingAiModeForm() {
	const gen = useRelaxingAiGenerator();
	const { dna, setDna, dnaLocked, lockDNA, unlockDNA } = gen;
	const [activeTab, setActiveTab] = useState<"config" | "output">("config");

	const MINUTE_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10].map((m) => ({
		value: m,
		label: `${m} menit`,
	}));
	const SEC_PER_SCENE_OPTIONS = [8, 10, 12, 15, 20];
	const VISUAL_STYLE_KEYS = Object.keys(
		VISUAL_STYLE_LABELS,
	) as VisualStyleKey[];
	const TOD_KEYS = Object.keys(TOD_DATA) as TodKey[];
	const totalSec = dna.totalMinutes * 60;
	const catInfo = LOCATION_CATEGORIES[dna.locationCategory];

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-4">
				{/* ── HEADER ── */}
				<div className="mb-6 rounded-xl bg-leaf/8 border border-leaf/25 px-5 py-4">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="font-mono text-[9px] text-leaf2 uppercase tracking-wider mb-1">
								🤖 Mode 2 — Full AI Generate
							</div>
							<div className="font-playfair text-xl text-cream font-bold mb-1">
								Relaxing Music Video — AI Mode
							</div>
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								Pilih kategori lokasi, AI explore semua detail visual tiap
								scene. Setiap scene dapat instruksi &quot;Continuing from
								scene...&quot; untuk konsistensi sempurna.
							</div>
						</div>
						<div className="flex flex-col gap-1.5 shrink-0">
							{[
								["Scene", `${gen.totalScenes}`],
								["Durasi", mmss(totalSec)],
								["Lokasi", catInfo.icon],
							].map(([k, v]) => (
								<div
									key={k as string}
									className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-leaf/25 bg-leaf/10 text-leaf2 whitespace-nowrap"
								>
									{k}: <span className="font-bold">{v}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ── TABS ── */}
				<div className="flex gap-0.5 mb-5 bg-bark/40 rounded-xl p-1">
					{[
						{ key: "config" as const, emoji: "🌍", label: "Konfigurasi" },
						{ key: "output" as const, emoji: "📦", label: "Output & SEO" },
					].map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => setActiveTab(tab.key)}
							className={`flex-1 rounded-lg py-2.5 font-bold text-xs transition-all font-sans flex items-center justify-center gap-1.5 ${
								activeTab === tab.key
									? "bg-leaf/20 text-leaf2"
									: "text-stone2 hover:text-cream"
							}`}
						>
							{tab.emoji} {tab.label}
							{tab.key === "output" && gen.allPrompts.length > 0 && (
								<span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-leaf/20 border border-leaf/20 text-leaf2">
									{gen.allPrompts.length} ✓
								</span>
							)}
						</button>
					))}
				</div>

				{/* ════════════════════════════════
				    CONFIG TAB
				════════════════════════════════ */}
				{activeTab === "config" && (
					<>
						{dnaLocked && (
							<div className="mb-5 rounded-xl bg-leaf/8 border border-leaf/30 px-4 py-3 flex items-center justify-between">
								<div>
									<div className="font-mono text-[10px] text-leaf2 font-bold">
										🔒 DNA Terkunci
									</div>
									<div className="font-mono text-[9px] text-stone2">
										{catInfo.icon} {catInfo.label} · {gen.totalScenes} scene ·{" "}
										{VISUAL_STYLE_LABELS[dna.visualStyle]}
									</div>
								</div>
								<button
									type="button"
									className="btn-ghost text-[9px] py-1 px-2"
									onClick={unlockDNA}
								>
									🔓 Edit
								</button>
							</div>
						)}

						{/* ── DURASI ── */}
						<section className="card mb-5">
							<div className="section-label">⏱️ Durasi & Kalkulasi Scene</div>
							<div className="mb-4">
								<label className="field-label">Total Durasi</label>
								<div className="flex flex-wrap gap-2">
									{MINUTE_OPTIONS.map((opt) => (
										<button
											key={opt.value}
											type="button"
											disabled={dnaLocked}
											onClick={() => setDna({ totalMinutes: opt.value })}
											className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] transition-all ${
												dna.totalMinutes === opt.value
													? "border-leaf bg-moss/30 text-leaf2 font-bold"
													: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30"
											} disabled:opacity-40 disabled:cursor-not-allowed`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
							<div className="mb-4">
								<label className="field-label">Durasi Per Scene</label>
								<div className="flex gap-2 flex-wrap">
									{SEC_PER_SCENE_OPTIONS.map((sec) => (
										<button
											key={sec}
											type="button"
											disabled={dnaLocked}
											onClick={() => setDna({ secPerScene: sec })}
											className={`flex-1 min-w-13 rounded-lg border py-2 font-mono text-[10px] transition-all ${
												dna.secPerScene === sec
													? "border-amber/60 bg-amber/15 text-amber2 font-bold"
													: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30"
											} disabled:opacity-40 disabled:cursor-not-allowed`}
										>
											{sec}s
										</button>
									))}
								</div>
							</div>
							<div className="flex gap-3 rounded-xl bg-forest/50 border border-leaf/20 p-3">
								{[
									["Total", mmss(totalSec)],
									["Per Scene", `${dna.secPerScene}s`],
									["Scenes", `${gen.totalScenes}`],
								].map(([l, v]) => (
									<div key={l as string} className="flex-1 text-center">
										<div className="font-mono text-[7px] text-stone2 uppercase tracking-wider">
											{l}
										</div>
										<div className="font-playfair text-sm text-leaf2 font-bold">
											{v}
										</div>
									</div>
								))}
							</div>
						</section>

						{/* ── LOKASI KATEGORI ── */}
						<section className="card mb-5">
							<div className="section-label">
								🌍 Kategori Lokasi & Pemandangan
							</div>
							<div className="font-mono text-[9px] text-stone2 mb-4 leading-relaxed">
								Pilih satu kategori. AI akan explore detail visual, hewan,
								tumbuhan, dan elemen alam secara otomatis sesuai kategori ini.
							</div>

							{/* Input nama video */}
							<div className="mb-4">
								<label className="field-label">
									🎬 Nama / Tema Video (opsional)
								</label>
								<input
									className="forest-input"
									placeholder='Contoh: "Swiss Alps 4K Drone — Relaxing Nature Meditation Music"'
									value={dna.videoTheme}
									disabled={dnaLocked}
									onChange={(e) => setDna({ videoTheme: e.target.value })}
								/>
							</div>

							{/* Sub-focus */}
							<div className="mb-4">
								<label className="field-label">
									📍 Sub-fokus Lokasi Spesifik (opsional)
								</label>
								<input
									className="forest-input"
									placeholder='Contoh: "Zhangjiajie National Forest, Hunan China" atau "Faroe Islands, North Atlantic"'
									value={dna.locationSubFocus}
									disabled={dnaLocked}
									onChange={(e) => setDna({ locationSubFocus: e.target.value })}
								/>
								<div className="font-mono text-[9px] text-stone2 mt-1">
									Kosongkan = AI pilih spot paling indah dari kategori ini
								</div>
							</div>

							{/* Category groups */}
							{LOCATION_CATEGORY_GROUPS.map((group) => (
								<div key={group.label} className="mb-4">
									<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
										{group.icon} {group.label}
									</div>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
										{group.keys.map((key) => {
											const cat = LOCATION_CATEGORIES[key];
											const isActive = dna.locationCategory === key;
											return (
												<button
													key={key}
													type="button"
													disabled={dnaLocked}
													onClick={() => setDna({ locationCategory: key })}
													className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
														isActive
															? "border-leaf bg-moss/30"
															: "border-leaf/12 bg-bark/25 hover:border-leaf/35"
													} disabled:opacity-40 disabled:cursor-not-allowed`}
												>
													<div className="text-lg mb-1">{cat.icon}</div>
													<div
														className={`font-playfair text-xs font-bold leading-tight ${isActive ? "text-leaf2" : "text-cream"}`}
													>
														{cat.label}
													</div>
													<div className="font-mono text-[7px] text-stone2 mt-0.5 leading-tight truncate">
														{cat.exampleCountries.split(",")[0]}...
													</div>
												</button>
											);
										})}
									</div>
								</div>
							))}

							{/* Selected category info */}
							<div className="rounded-xl bg-bark/25 border border-leaf/15 p-3 mt-2">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xl">{catInfo.icon}</span>
									<div>
										<div className="font-playfair text-sm text-cream font-bold">
											{catInfo.label}
										</div>
										<div className="font-mono text-[9px] text-stone2">
											{catInfo.description}
										</div>
									</div>
								</div>
								<div className="font-mono text-[9px] text-stone2/70 mb-2">
									<span className="text-stone2">Contoh lokasi:</span>{" "}
									{catInfo.exampleCountries}
								</div>
								<div className="rounded-lg bg-leaf/8 border border-leaf/10 px-3 py-2">
									<div className="font-mono text-[8px] text-leaf uppercase mb-1">
										AI Instruction Preview
									</div>
									<div className="font-mono text-[8px] text-stone2/70 leading-relaxed">
										{catInfo.aiInstruction.substring(0, 150)}...
									</div>
								</div>
							</div>
						</section>

						{/* ── VISUAL STYLE & TIME OF DAY ── */}
						<section className="card mb-5">
							<div className="section-label">🎨 Visual Style & Waktu</div>
							<div className="mb-4">
								<label className="field-label">Visual Style</label>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
									{VISUAL_STYLE_KEYS.map((key) => (
										<button
											key={key}
											type="button"
											disabled={dnaLocked}
											onClick={() => setDna({ visualStyle: key })}
											className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
												dna.visualStyle === key
													? "border-leaf bg-moss/25"
													: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
											} disabled:opacity-40 disabled:cursor-not-allowed`}
										>
											<div
												className={`font-playfair text-xs font-bold ${dna.visualStyle === key ? "text-leaf2" : "text-cream"}`}
											>
												{VISUAL_STYLE_LABELS[key]}
											</div>
										</button>
									))}
								</div>
							</div>
							<div>
								<label className="field-label">
									⏰ Waktu dalam Hari (Time of Day)
								</label>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
									{TOD_KEYS.map((key) => {
										const tod = TOD_DATA[key];
										return (
											<button
												key={key}
												type="button"
												disabled={dnaLocked}
												onClick={() => setDna({ timeOfDay: key })}
												className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
													dna.timeOfDay === key
														? "border-amber/60 bg-amber/12"
														: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
												} disabled:opacity-40 disabled:cursor-not-allowed`}
											>
												<div
													className={`font-playfair text-xs font-bold mb-0.5 ${dna.timeOfDay === key ? "text-amber2" : "text-cream"}`}
												>
													{tod.label}
												</div>
												<div className="font-mono text-[8px] text-stone2 leading-tight truncate">
													{tod.timeRange}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						</section>

						{/* ── DRONE & CAMERA ── */}
						<section className="card mb-5">
							<div className="section-label">
								🚁 Drone & Camera (User Config)
							</div>
							<div className="font-mono text-[9px] text-stone2 mb-3 leading-relaxed">
								Konfigurasi drone ini menjadi &quot;home base&quot; style. AI
								akan variasikan secara natural antar scene.
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<OptionRow
									label="🚁 Drone Movement"
									value={dna.camMove}
									options={OPTIONS.camMove}
									onChange={(v) => setDna({ camMove: v })}
									disabled={dnaLocked}
								/>
								<OptionRow
									label="📐 Camera Angle"
									value={dna.camAngle}
									options={OPTIONS.camAngle}
									onChange={(v) => setDna({ camAngle: v })}
									disabled={dnaLocked}
								/>
								<OptionRow
									label="🔭 Lens"
									value={dna.camLens}
									options={OPTIONS.camLens}
									onChange={(v) => setDna({ camLens: v })}
									disabled={dnaLocked}
								/>
								<OptionRow
									label="⏱️ Speed"
									value={dna.camSpeed}
									options={OPTIONS.camSpeed}
									onChange={(v) => setDna({ camSpeed: v })}
									disabled={dnaLocked}
								/>
							</div>
						</section>

						{/* ── MOOD & MUSIK ── */}
						<section className="card mb-5">
							<div className="section-label">🎵 Mood & Musik</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<OptionRow
									label="🎭 Mood Video"
									value={dna.mood}
									options={MOOD_OPTIONS}
									onChange={(v) => setDna({ mood: v })}
									disabled={dnaLocked}
								/>
								<OptionRow
									label="🎶 Gaya Musik"
									value={dna.musicStyle}
									options={MUSIC_STYLE_OPTIONS}
									onChange={(v) => setDna({ musicStyle: v })}
									disabled={dnaLocked}
								/>
							</div>
						</section>

						{/* ── AI MODEL ── */}
						<section className="card mb-5">
							<div className="section-label">🤖 AI Model</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div>
									<label className="field-label">Provider</label>
									<select
										className="forest-select"
										value={dna.aiProvider}
										onChange={(e) => {
											const p = e.target.value;
											setDna({
												aiProvider: p,
												aiModelId: getDefaultModelId(p),
											});
										}}
									>
										{AI_MODELS_PROVIDER.map((p) => (
											<option key={p.value} value={p.value}>
												{p.label}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="field-label">Model</label>
									<select
										className="forest-select"
										value={dna.aiModelId || getDefaultModelId(dna.aiProvider)}
										onChange={(e) => setDna({ aiModelId: e.target.value })}
									>
										{getModelOptions(dna.aiProvider).map((m) => (
											<option key={m.value} value={m.value}>
												{m.label}
											</option>
										))}
									</select>
								</div>
							</div>
						</section>

						{/* ── LOCK & GENERATE ── */}
						{!dnaLocked ? (
							<button
								type="button"
								onClick={lockDNA}
								className="w-full rounded-xl font-bold py-3.5 px-6 text-sm font-sans transition-all mb-5"
								style={{
									background: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
									border: "none",
									color: "#fff",
									boxShadow: "0 4px 18px rgba(61,92,46,0.45)",
								}}
							>
								🔒 Kunci DNA & Siap Generate
							</button>
						) : (
							<button
								type="button"
								disabled={gen.isGeneratingAI}
								onClick={gen.generateAllWithAI}
								className="w-full rounded-xl font-bold py-4 px-6 text-sm font-sans transition-all mb-5 flex items-center justify-center gap-2"
								style={{
									background: gen.isGeneratingAI
										? "rgba(122,182,72,0.15)"
										: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
									border: "none",
									color: gen.isGeneratingAI ? "var(--leaf)" : "#fff",
									boxShadow: gen.isGeneratingAI
										? "none"
										: "0 4px 18px rgba(61,92,46,0.45)",
								}}
							>
								{gen.isGeneratingAI ? (
									<>
										<span className="animate-pulse">⏳</span> AI sedang generate{" "}
										{gen.totalScenes} scene + SEO pack...
									</>
								) : (
									<>
										🤖 Generate All {gen.totalScenes} Scene With AI + SEO Pack
									</>
								)}
							</button>
						)}
					</>
				)}

				{/* ════════════════════════════════
				    OUTPUT TAB
				════════════════════════════════ */}
				{activeTab === "output" && (
					<>
						{gen.allPrompts.length === 0 ? (
							<div className="card text-center py-12">
								<div className="text-4xl mb-4">🌿</div>
								<div className="font-playfair text-xl text-cream mb-2">
									Belum Ada Output
								</div>
								<div className="font-mono text-[10px] text-stone2 mb-4">
									Kunci DNA dan Generate di tab Konfigurasi.
								</div>
								<button
									type="button"
									className="btn-primary py-2.5 px-6 text-sm"
									onClick={() => setActiveTab("config")}
								>
									← Ke Konfigurasi
								</button>
							</div>
						) : (
							<>
								{/* ── SEO PACK ── */}
								{gen.seoPack && (
									<section
										className="card mb-5"
										style={{
											border: "1px solid rgba(122,182,72,0.35)",
											background: "rgba(61,92,46,0.06)",
										}}
									>
										<div className="section-label">
											📊 SEO Pack — AI Generated
										</div>

										<div className="mb-4">
											<div className="flex items-center justify-between mb-1">
												<label className="field-label mb-0">
													🏆 Judul Video (SEO)
												</label>
												<button
													type="button"
													className="btn-ghost text-[9px] py-1 px-2"
													onClick={gen.copySeoTitle}
												>
													📋 Copy
												</button>
											</div>
											<div className="prompt-box text-sm font-playfair font-bold text-cream min-h-10">
												{gen.seoPack.title}
											</div>
										</div>

										<div className="mb-4">
											<div className="flex items-center justify-between mb-1">
												<label className="field-label mb-0">
													📝 Deskripsi Video
												</label>
												<button
													type="button"
													className="btn-ghost text-[9px] py-1 px-2"
													onClick={gen.copySeoDescription}
												>
													📋 Copy
												</button>
											</div>
											<div className="prompt-box text-[10px] min-h-30 max-h-48 overflow-y-auto">
												{gen.seoPack.description}
											</div>
										</div>

										<div className="mb-4">
											<div className="flex items-center justify-between mb-2">
												<label className="field-label mb-0">
													🏷️ 30 Tags SEO
												</label>
												<button
													type="button"
													className="btn-ghost text-[9px] py-1 px-2"
													onClick={gen.copySeoTags}
												>
													📋 Copy
												</button>
											</div>
											<div className="flex flex-wrap gap-1.5">
												{gen.seoPack.tags.map((tag, i) => (
													<span
														key={i}
														className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bark/40 border border-leaf/15 text-stone2"
													>
														{tag}
													</span>
												))}
											</div>
										</div>

										<div className="mb-4">
											<div className="flex items-center justify-between mb-1">
												<label className="field-label mb-0">
													🖼️ Thumbnail Prompt
												</label>
												<button
													type="button"
													className="btn-ghost text-[9px] py-1 px-2"
													onClick={gen.copySeoThumbnailPrompt}
												>
													📋 Copy
												</button>
											</div>
											<div className="prompt-box text-[10px] min-h-15">
												{gen.seoPack.thumbnailPrompt}
											</div>
										</div>

										<div className="flex gap-2">
											<button
												type="button"
												className="btn-primary flex-1 py-2 text-xs"
												onClick={gen.downloadSeoPackJson}
											>
												💾 Download .json
											</button>
											<button
												type="button"
												className="btn-outline flex-1 py-2 text-xs"
												onClick={gen.downloadSeoPackTxt}
											>
												📄 Download .txt
											</button>
										</div>
									</section>
								)}

								{/* ── EXPORT PROMPTS ── */}
								<section className="card mb-5">
									<div className="section-label">📦 Export Semua Prompt</div>
									<div className="flex flex-wrap gap-2 mb-4">
										<button
											type="button"
											className="btn-primary"
											onClick={gen.copyAll}
										>
											📋 Copy Semua JSON
										</button>
										<button
											type="button"
											className="btn-amber"
											onClick={gen.downloadAllJson}
										>
											💾 Download JSON
										</button>
										<button
											type="button"
											className="btn-ghost"
											onClick={() => gen.setShowAllPrompts(!gen.showAllPrompts)}
										>
											👁 {gen.showAllPrompts ? "Sembunyikan" : "Lihat"} Semua
										</button>
									</div>

									<div className="flex items-center gap-3 mb-3">
										<div className="flex-1 h-1.5 bg-bark/50 rounded-full overflow-hidden">
											<div
												className="h-full bg-linear-to-r from-leaf to-leaf2 rounded-full transition-all"
												style={{ width: `${gen.progressPct}%` }}
											/>
										</div>
										<span className="font-mono text-[9px] text-stone2 whitespace-nowrap">
											{gen.allPrompts.length}/{gen.totalScenes} ✓
										</span>
									</div>

									{gen.showAllPrompts && gen.allPrompts.length > 0 && (
										<div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
											{gen.allPrompts.map((p, i) => {
												const sceneNum = i + 1;
												const startSec = i * dna.secPerScene;
												const endSec = startSec + dna.secPerScene;
												return (
													<div
														key={sceneNum}
														className="rounded-xl border border-leaf/15 overflow-hidden"
													>
														<div className="flex items-center justify-between px-4 py-2 bg-bark/40 border-b border-leaf/10">
															<div className="flex items-center gap-2">
																<span className="font-mono text-[10px] text-leaf2 font-bold">
																	Scene {sceneNum}/{gen.totalScenes}
																</span>
																<span className="font-mono text-[9px] text-stone2">
																	{mmss(startSec)}–{mmss(endSec)}
																</span>
																{i > 0 && (
																	<span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-leaf/10 border border-leaf/20 text-leaf2">
																		↑ Continuing...
																	</span>
																)}
															</div>
															<button
																type="button"
																className="font-mono text-[9px] text-stone2 hover:text-leaf2"
																onClick={() => navigator.clipboard.writeText(p)}
															>
																📋
															</button>
														</div>
														<div className="prompt-box text-[9px] max-h-48 rounded-none border-0 leading-relaxed">
															{p}
														</div>
													</div>
												);
											})}
										</div>
									)}
								</section>
							</>
						)}
					</>
				)}
			</div>

			{/* ── TOAST ── */}
			<div
				className={`toast-base transition-all duration-300 ${
					gen.toast.show
						? "bg-moss/90 text-leaf2 opacity-100 translate-y-0"
						: "opacity-0 translate-y-4 pointer-events-none"
				}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
