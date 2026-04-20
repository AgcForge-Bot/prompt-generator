"use client";

import { useState } from "react";
import useAsmrAiGenerator, {
	TIMELAPSE_SPEED_OPTIONS,
	NARRATOR_STYLE_OPTIONS,
	TIME_OF_DAY_PROGRESSIONS,
	WEATHER_PROGRESSIONS,
	WORKER_COUNT_OPTIONS,
	MAIN_EQUIPMENT_OPTIONS,
	ASMR_FOCUS_OPTIONS,
	type TimelapseSpeedKey,
} from "./useAsmrAiGenerator";
import { DNA_OPTIONS, VISUAL_STYLE_LABELS } from "./constants";
import type { VisualStyleKey, ProjectTypeKey } from "./types";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";

// ─── HELPER ───────────────────────────────────────────────────────────────────

function Sel({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	options: readonly { value: string; label: string }[] | readonly string[];
}) {
	const normalized =
		typeof options[0] === "string"
			? (options as string[]).map((o) => ({ value: o, label: o }))
			: (options as { value: string; label: string }[]);
	return (
		<div>
			<label className="field-label">{label}</label>
			<select
				className="forest-select"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{normalized.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
		</div>
	);
}

function SectionCard({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">{label}</div>
			{children}
		</section>
	);
}

function mmss(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AsmrAiModeForm() {
	const gen = useAsmrAiGenerator();
	const { dna, setDna, dnaLocked, lockDNA, unlockDNA } = gen;
	const [activeSection, setActiveSection] = useState<"config" | "output">(
		"config",
	);

	const totalSec = dna.totalMinutes * 60;
	const speedInfo = TIMELAPSE_SPEED_OPTIONS[dna.timelapseSpeed];

	const MINUTE_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10].map((m) => ({
		value: m,
		label: `${m} menit`,
	}));
	const SEC_PER_SCENE_OPTIONS = [8, 10, 12, 15, 20];
	const VISUAL_STYLE_KEYS = Object.keys(
		VISUAL_STYLE_LABELS,
	) as VisualStyleKey[];

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-4">
				{/* ── HEADER MODE 2 ── */}
				<div className="mb-6 rounded-xl bg-amber/8 border border-amber/25 px-5 py-4">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="font-mono text-[9px] text-amber2 uppercase tracking-wider mb-1">
								🤖 Mode 2 — Full AI Generate
							</div>
							<div className="font-playfair text-xl text-cream font-bold mb-1">
								ASMR Timelapse — AI Advanced Mode
							</div>
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								Setup DNA sekali, AI generate semua {gen.totalScenes} scene
								dengan instruksi &quot;Continuing from scene...&quot; otomatis.
								Konsisten &amp; sambung menyambung.
							</div>
						</div>
						<div className="flex flex-col gap-1.5 shrink-0">
							{[
								["Scene", `${gen.totalScenes}`],
								["Durasi", `${mmss(totalSec)}`],
								["Speed", speedInfo.multiplier],
							].map(([k, v]) => (
								<div
									key={k as string}
									className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-amber/25 bg-amber/10 text-amber2 whitespace-nowrap"
								>
									{k}: <span className="font-bold">{v}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ── TAB NAV ── */}
				<div className="flex gap-0.5 mb-5 bg-bark/40 rounded-xl p-1">
					{[
						{ key: "config" as const, label: "DNA & Konfigurasi", emoji: "🧬" },
						{ key: "output" as const, label: "Output & SEO", emoji: "📦" },
					].map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => setActiveSection(tab.key)}
							className={`flex-1 rounded-lg py-2.5 font-bold text-xs transition-all font-sans flex items-center justify-center gap-1.5 ${
								activeSection === tab.key
									? "bg-amber/25 text-amber2"
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

				{/* ══════════════════════════════════════════
				    CONFIG TAB
				══════════════════════════════════════════ */}
				{activeSection === "config" && (
					<>
						{/* DNA Locked banner */}
						{dnaLocked && (
							<div className="mb-5 rounded-xl bg-leaf/8 border border-leaf/30 px-4 py-3 flex items-center justify-between">
								<div>
									<div className="font-mono text-[10px] text-leaf2 font-bold">
										🔒 DNA Terkunci
									</div>
									<div className="font-mono text-[9px] text-stone2">
										{dna.building} · {dna.location} · {dna.projectType} ·{" "}
										{dna.totalScenes} scene
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

						{/* ── DURASI & SCENE ── */}
						<SectionCard label="⏱️ Durasi & Kalkulasi Scene">
							<div className="mb-4">
								<label className="field-label">Total Durasi Video</label>
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
													: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
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
													: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
											} disabled:opacity-40 disabled:cursor-not-allowed`}
										>
											{sec}s
										</button>
									))}
								</div>
							</div>
							{/* Result */}
							<div className="flex gap-3 rounded-xl bg-forest/50 border border-leaf/20 p-3">
								{[
									["Total", `${mmss(totalSec)}`],
									["Per Scene", `${dna.secPerScene}s`],
									["Jumlah Scene", `${gen.totalScenes}`],
									["Speed", speedInfo.multiplier],
								].map(([label, value]) => (
									<div key={label as string} className="flex-1 text-center">
										<div className="font-mono text-[7px] text-stone2 uppercase tracking-wider">
											{label}
										</div>
										<div className="font-playfair text-sm text-leaf2 font-bold">
											{value}
										</div>
									</div>
								))}
							</div>
						</SectionCard>

						{/* ── TIMELAPSE SPEED ── */}
						<SectionCard label="⚡ Kecepatan Timelapse">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{(
									Object.keys(TIMELAPSE_SPEED_OPTIONS) as TimelapseSpeedKey[]
								).map((key) => {
									const opt = TIMELAPSE_SPEED_OPTIONS[key];
									const isActive = dna.timelapseSpeed === key;
									return (
										<button
											key={key}
											type="button"
											disabled={dnaLocked}
											onClick={() => setDna({ timelapseSpeed: key })}
											className={`rounded-xl border px-3 py-3 text-left transition-all ${
												isActive
													? "border-amber/60 bg-amber/12"
													: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
											} disabled:opacity-40 disabled:cursor-not-allowed`}
										>
											<div
												className={`font-playfair text-sm font-bold mb-0.5 ${isActive ? "text-amber2" : "text-cream"}`}
											>
												{opt.label}
											</div>
											<div className="font-mono text-[8px] text-amber2/80 mb-1">
												{opt.multiplier}
											</div>
											<div className="font-mono text-[8px] text-stone2 leading-tight">
												{opt.desc}
											</div>
										</button>
									);
								})}
							</div>
							{dna.timelapseSpeed && (
								<div className="mt-3 rounded-lg bg-bark/30 border border-leaf/10 px-3 py-2">
									<div className="font-mono text-[9px] text-stone2 leading-relaxed">
										🎬 Motion:{" "}
										<span className="text-cream">{speedInfo.motionNote}</span>
									</div>
								</div>
							)}
						</SectionCard>

						{/* ── VISUAL STYLE ── */}
						<SectionCard label="🎨 Visual Style">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{VISUAL_STYLE_KEYS.map((key) => {
									const isActive = dna.visualStyle === key;
									return (
										<button
											key={key}
											type="button"
											disabled={dnaLocked}
											onClick={() => setDna({ visualStyle: key })}
											className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
												isActive
													? "border-leaf bg-moss/25"
													: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
											} disabled:opacity-40 disabled:cursor-not-allowed`}
										>
											<div
												className={`font-playfair text-xs font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
											>
												{VISUAL_STYLE_LABELS[key]}
											</div>
										</button>
									);
								})}
							</div>
						</SectionCard>

						{/* ── PROJECT DNA ── */}
						<SectionCard label="🧬 Project DNA — Master Konsistensi">
							<div className="font-mono text-[9px] text-stone2 mb-4 leading-relaxed">
								DNA dikunci ke semua scene. AI wajib mematuhi — tidak boleh
								ganti elemen di tengah video.
							</div>
							<div className="mb-3">
								<label className="field-label">Nama Proyek (opsional)</label>
								<input
									className="forest-input"
									placeholder='Contoh: "Restorasi Villa Tua Toscana Italia 2025"'
									value={dna.projectName}
									disabled={dnaLocked}
									onChange={(e) => setDna({ projectName: e.target.value })}
								/>
							</div>
							{/* Project Type */}
							<div className="mb-4">
								<label className="field-label">Tipe Proyek</label>
								<div className="grid grid-cols-2 gap-2">
									{(["restoration", "construction"] as ProjectTypeKey[]).map(
										(pt) => (
											<button
												key={pt}
												type="button"
												disabled={dnaLocked}
												onClick={() => setDna({ projectType: pt })}
												className={`rounded-xl border px-4 py-3 text-left transition-all ${
													dna.projectType === pt
														? "border-leaf bg-moss/25"
														: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
												} disabled:opacity-40 disabled:cursor-not-allowed`}
											>
												<div className="text-xl mb-1">
													{pt === "restoration" ? "🏚️" : "🏗️"}
												</div>
												<div
													className={`font-playfair text-sm font-bold ${dna.projectType === pt ? "text-leaf2" : "text-cream"}`}
												>
													{pt === "restoration" ? "Restorasi" : "Konstruksi"}
												</div>
												<div className="font-mono text-[9px] text-stone2">
													{pt === "restoration"
														? "Renovasi / pemulihan bangunan lama"
														: "Pembangunan dari nol / baru"}
												</div>
											</button>
										),
									)}
								</div>
							</div>
							{/* DNA fields grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{(
									[
										["🏠 Jenis Bangunan", "building"],
										["📍 Setting Lokasi", "location"],
										["🌡️ Iklim & Musim", "climate"],
										["🧱 Material Utama", "material"],
										["🎨 Palet Warna", "palette"],
										["👷 Tim Pekerja", "team"],
									] as [string, keyof typeof DNA_OPTIONS][]
								).map(([label, key]) => (
									<Sel
										key={key}
										label={label}
										value={(dna as unknown as Record<string, string>)[key]}
										onChange={(v) =>
											!dnaLocked && setDna({ [key]: v } as Partial<typeof dna>)
										}
										options={DNA_OPTIONS[key]}
									/>
								))}
							</div>
						</SectionCard>

						{/* ── ADVANCED CONFIG ── */}
						<SectionCard label="⚙️ Konfigurasi Advanced">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Sel
									label="⏰ Progressi Waktu Hari"
									value={dna.timeOfDayProgression}
									onChange={(v) => setDna({ timeOfDayProgression: v })}
									options={TIME_OF_DAY_PROGRESSIONS}
								/>
								<Sel
									label="🌤️ Progressi Cuaca"
									value={dna.weatherProgression}
									onChange={(v) => setDna({ weatherProgression: v })}
									options={WEATHER_PROGRESSIONS}
								/>
								<Sel
									label="👷 Jumlah Pekerja"
									value={dna.workerCount}
									onChange={(v) => setDna({ workerCount: v })}
									options={WORKER_COUNT_OPTIONS}
								/>
								<Sel
									label="🚜 Peralatan Utama"
									value={dna.mainEquipment}
									onChange={(v) => setDna({ mainEquipment: v })}
									options={MAIN_EQUIPMENT_OPTIONS}
								/>
								<div className="sm:col-span-2">
									<Sel
										label="🎵 Fokus Suara ASMR"
										value={dna.asmrFocus}
										onChange={(v) => setDna({ asmrFocus: v })}
										options={ASMR_FOCUS_OPTIONS}
									/>
								</div>
							</div>
						</SectionCard>

						{/* ── NARASI ── */}
						<SectionCard label="🔊 Narasi">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
								<div>
									<label className="field-label">Gender Narator</label>
									<div className="flex gap-2">
										{(["male", "female", "none"] as const).map((g) => (
											<button
												key={g}
												type="button"
												onClick={() => setDna({ narratorGender: g })}
												className={`flex-1 rounded-lg border py-2 font-mono text-[10px] transition-all ${
													dna.narratorGender === g
														? "border-leaf bg-moss/25 text-leaf2 font-bold"
														: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
												}`}
											>
												{g === "male"
													? "🎙 Pria"
													: g === "female"
														? "🎙 Wanita"
														: "🔇 Tanpa"}
											</button>
										))}
									</div>
								</div>
							</div>
							{dna.narratorGender !== "none" && (
								<Sel
									label="Gaya Narasi"
									value={dna.narratorStyle}
									onChange={(v) => setDna({ narratorStyle: v })}
									options={NARRATOR_STYLE_OPTIONS}
								/>
							)}
						</SectionCard>

						{/* ── AI MODEL ── */}
						<SectionCard label="🤖 AI Model">
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
							<div className="mt-2 font-mono text-[9px] text-stone2 leading-relaxed">
								Direkomendasikan: Claude Sonnet/Opus, GPT-4o, atau Gemini 2.5
								Flash. AI akan generate {gen.totalScenes} scene sekaligus —
								butuh model dengan context window besar.
							</div>
						</SectionCard>

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
										? "rgba(212,148,26,0.15)"
										: "linear-gradient(135deg, #d4941a, #e8ab30)",
									border: "none",
									color: gen.isGeneratingAI ? "var(--amber)" : "#1a2e1a",
									boxShadow: gen.isGeneratingAI
										? "none"
										: "0 4px 18px rgba(212,148,26,0.35)",
								}}
							>
								{gen.isGeneratingAI ? (
									<>
										<span className="animate-pulse">⏳</span>
										AI sedang generate {gen.totalScenes} scene + SEO pack...
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

				{/* ══════════════════════════════════════════
				    OUTPUT TAB
				══════════════════════════════════════════ */}
				{activeSection === "output" && (
					<>
						{gen.allPrompts.length === 0 ? (
							<div className="card text-center py-12">
								<div className="text-4xl mb-4">🤖</div>
								<div className="font-playfair text-xl text-cream mb-2">
									Belum Ada Output
								</div>
								<div className="font-mono text-[10px] text-stone2 mb-4">
									Kunci DNA dan klik Generate di tab Konfigurasi.
								</div>
								<button
									type="button"
									className="btn-primary py-2.5 px-6 text-sm"
									onClick={() => setActiveSection("config")}
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
											border: "1px solid rgba(212,148,26,0.35)",
											background: "rgba(212,148,26,0.04)",
										}}
									>
										<div
											className="section-label"
											style={{ color: "var(--amber2)" }}
										>
											📊 SEO Pack — AI Generated
										</div>

										{/* Title */}
										<div className="mb-4">
											<div className="flex items-center justify-between mb-1">
												<label className="field-label mb-0">
													🏆 Judul Video (SEO Optimized)
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

										{/* Description */}
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

										{/* Tags */}
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

										{/* Thumbnail prompt */}
										<div className="mb-4">
											<div className="flex items-center justify-between mb-1">
												<label className="field-label mb-0">
													🖼️ Thumbnail Prompt (AI Image Gen)
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

										{/* Download SEO */}
										<div className="flex gap-2">
											<button
												type="button"
												className="btn-amber flex-1 py-2 text-xs"
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

									{/* Progress info */}
									<div className="flex items-center gap-3 mb-3">
										<div className="flex-1 h-1.5 bg-bark/50 rounded-full overflow-hidden">
											<div
												className="h-full bg-linear-to-r from-leaf to-leaf2 rounded-full transition-all"
												style={{ width: `${gen.progressPct}%` }}
											/>
										</div>
										<span className="font-mono text-[9px] text-stone2 whitespace-nowrap">
											{gen.allPrompts.length}/{gen.totalScenes} scene ✓
										</span>
									</div>

									{/* Scene preview */}
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
																	<span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-amber/10 border border-amber/20 text-amber2">
																		↑ Continuing...
																	</span>
																)}
															</div>
															<button
																type="button"
																className="font-mono text-[9px] text-stone2 hover:text-leaf2 transition-colors"
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
						? "bg-amber/90 text-forest opacity-100 translate-y-0"
						: "opacity-0 translate-y-4 pointer-events-none"
				}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
