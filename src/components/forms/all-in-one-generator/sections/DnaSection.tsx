"use client";

import type {
	AllInOneDNA,
	VideoThemeKey,
	VisualStyleKey,
	ModelGenderAge,
} from "../types";
import {
	VIDEO_THEMES,
	VISUAL_STYLES,
	MODEL_GENDER_AGES,
	OUTFIT_OPTIONS,
	TOTAL_DURATION_OPTIONS,
	SEC_PER_SCENE_OPTIONS,
	calcTotalScenes,
} from "../constants";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";

type Props = {
	dna: AllInOneDNA;
	setDna: (u: Partial<AllInOneDNA>) => void;
	onLock: () => void;
	error: string;
};

export default function DnaSection({ dna, setDna, onLock, error }: Props) {
	const themeKeys = Object.keys(VIDEO_THEMES) as VideoThemeKey[];
	const styleKeys = Object.keys(VISUAL_STYLES) as VisualStyleKey[];
	const isForestBuild = dna.theme === "forest-build-primitive-craft";
	const modelKeys = Object.keys(MODEL_GENDER_AGES) as ModelGenderAge[];
	const totalScenes = calcTotalScenes(dna.totalDurationSec, dna.secPerScene);

	return (
		<div className="flex flex-col gap-5">
			{/* ── DURASI ── */}
			<section className="card">
				<div className="section-label">⏱️ Durasi Video</div>

				{/* Total duration */}
				<div className="mb-4">
					<label className="field-label">Total Durasi Video</label>
					<div className="flex flex-wrap gap-2">
						{TOTAL_DURATION_OPTIONS.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => setDna({ totalDurationSec: opt.value })}
								className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] transition-all ${
									dna.totalDurationSec === opt.value
										? "border-leaf bg-moss/30 text-leaf2 font-bold"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
								}`}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>

				{/* Per scene */}
				<div className="mb-4">
					<label className="field-label">Durasi Per Scene</label>
					<div className="flex gap-2 flex-wrap">
						{SEC_PER_SCENE_OPTIONS.map((sec) => (
							<button
								key={sec}
								type="button"
								onClick={() => setDna({ secPerScene: sec })}
								className={`flex-1 min-w-15 rounded-lg border py-2 font-mono text-[10px] transition-all ${
									dna.secPerScene === sec
										? "border-amber/60 bg-amber/15 text-amber2 font-bold"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
								}`}
							>
								{sec}s
							</button>
						))}
					</div>
				</div>

				{/* Result */}
				<div className="flex gap-3 rounded-xl bg-forest/50 border border-leaf/20 p-4">
					{[
						["Total Durasi", `${dna.totalDurationSec}s`],
						["Per Scene", `${dna.secPerScene}s`],
						["Total Scene", `${totalScenes} scene`],
					].map(([label, value]) => (
						<div key={label} className="flex-1 text-center">
							<div className="font-mono text-[8px] text-stone2 uppercase tracking-wider">
								{label}
							</div>
							<div className="font-playfair text-xl text-leaf2 font-bold">
								{value}
							</div>
						</div>
					))}
				</div>
				<div className="font-mono text-[9px] text-stone2 mt-2">
					{dna.totalDurationSec} ÷ {dna.secPerScene} = {totalScenes} scene
					prompt
				</div>
			</section>

			{/* ── TEMA VIDEO ── */}
			<section className="card">
				<div className="section-label">🎬 Tema Video</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{themeKeys.map((key) => {
						const t = VIDEO_THEMES[key];
						const isActive = dna.theme === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setDna({ theme: key })}
								className={`rounded-xl border px-4 py-3 text-left transition-all ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
								}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<span className="text-xl">{t.icon}</span>
									<span
										className={`font-playfair text-sm font-bold leading-tight ${isActive ? "text-leaf2" : "text-cream"}`}
									>
										{t.label}
									</span>
								</div>
								<div className="font-mono text-[9px] text-stone2 leading-relaxed">
									{t.description}
								</div>
								{t.hasModel && (
									<div className="mt-1 font-mono text-[8px] text-amber2 bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-full w-fit">
										👤 Model character tersedia
									</div>
								)}
							</button>
						);
					})}
				</div>
			</section>

			{/* ── VISUAL STYLE ── */}
			<section className="card">
				<div className="section-label">🎨 Visual Style</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{styleKeys.map((key) => {
						const s = VISUAL_STYLES[key];
						const isActive = dna.visualStyle === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setDna({ visualStyle: key })}
								className={`rounded-xl border px-4 py-3 text-left transition-all ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
								}`}
							>
								<div
									className={`font-playfair text-sm font-bold mb-1 ${isActive ? "text-leaf2" : "text-cream"}`}
								>
									{s.label}
								</div>
								<div className="font-mono text-[9px] text-stone2">{s.desc}</div>
							</button>
						);
					})}
				</div>
			</section>

			{/* ── JUDUL & STORYBOARD ── */}
			<section className="card">
				<div className="section-label">📋 Identitas Video</div>

				<div className="mb-4">
					<label className="field-label">
						🎬 Judul Video <span className="text-amber2">*</span>
					</label>
					<input
						className="forest-input"
						placeholder='Contoh: "Primitive Mud House Build in Deep Jungle | ASMR Survival"'
						value={dna.videoTitle}
						onChange={(e) => setDna({ videoTitle: e.target.value })}
					/>
				</div>

				<div>
					<label className="field-label">
						🗺️ Inti Storyboard Keseluruhan Video{" "}
						<span className="text-amber2">*</span>
					</label>
					<div className="font-mono text-[9px] text-stone2/70 mb-1.5 leading-relaxed">
						Deskripsikan alur keseluruhan video — arc cerita, setting, mood, dan
						apa yang terjadi dari awal hingga akhir. Ini akan jadi anchor semua
						scene.
					</div>
					<textarea
						className="forest-input resize-none min-h-27.5"
						placeholder={`Contoh: "Video ASMR survival build di hutan tropis lebat. Dimulai dari perjalanan masuk hutan di pagi hari berkabut, memilih lokasi, menggali fondasi, membangun dinding lumpur satu per satu, membuat atap dari daun palm, hingga selesai berdiam dalam shelter malam hari dengan api unggun. Tone: tenang, satisfying, dokumenter primitif. No narasi, hanya suara alam dan aktivitas."`}
						value={dna.coreStoryboard}
						onChange={(e) => setDna({ coreStoryboard: e.target.value })}
					/>
				</div>
			</section>

			{/* ── MODEL CHARACTER (forest-build only) ── */}
			{isForestBuild && (
				<section
					className="card"
					style={{
						border: "1px solid rgba(212,148,26,0.3)",
						background: "rgba(212,148,26,0.04)",
					}}
				>
					<div className="section-label" style={{ color: "var(--amber2)" }}>
						👤 Model Character (Forest Build)
					</div>

					{/* Gender & Age */}
					<div className="mb-4">
						<label className="field-label">Gender & Usia Model</label>
						<div className="grid grid-cols-2 gap-2">
							{modelKeys.map((key) => {
								const m = MODEL_GENDER_AGES[key];
								const isActive = dna.modelGenderAge === key;
								return (
									<button
										key={key}
										type="button"
										onClick={() => setDna({ modelGenderAge: key })}
										className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
											isActive
												? "border-amber/60 bg-amber/10"
												: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
										}`}
									>
										<div className="text-xl mb-1">{m.emoji}</div>
										<div
											className={`font-playfair text-xs font-bold ${isActive ? "text-amber2" : "text-cream"}`}
										>
											{m.label}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Outfit */}
					<div>
						<label className="field-label">🧥 Outfit Model</label>
						<select
							className="forest-select"
							value={dna.outfitKey}
							onChange={(e) => setDna({ outfitKey: e.target.value })}
						>
							{OUTFIT_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
						{dna.outfitKey && (
							<div className="font-mono text-[9px] text-stone2 mt-1.5 leading-relaxed px-1">
								{OUTFIT_OPTIONS.find((o) => o.value === dna.outfitKey)?.desc}
							</div>
						)}
					</div>
				</section>
			)}

			{/* ── AI MODEL ── */}
			<section className="card">
				<div className="section-label">🤖 AI Model</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label className="field-label">Provider AI</label>
						<select
							className="forest-select"
							value={dna.aiProvider}
							onChange={(e) => {
								const p = e.target.value;
								setDna({ aiProvider: p, aiModelId: getDefaultModelId(p) });
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
				<div className="mt-2 font-mono text-[9px] text-stone2 leading-relaxed px-1">
					AI akan generate prompt sinematik untuk setiap scene berdasarkan DNA
					dan storyboard yang kamu isi. Model dengan vision (Claude, GPT-4o,
					Gemini) mendukung analisa gambar referensi per scene.
				</div>
			</section>

			{/* ── ERROR & LOCK BUTTON ── */}
			{error && (
				<div className="rounded-xl border border-red-500/30 bg-red-950/10 px-4 py-3">
					<div className="font-mono text-[10px] text-red-400">⚠ {error}</div>
				</div>
			)}

			<button
				type="button"
				onClick={onLock}
				className="w-full rounded-xl font-bold py-3.5 px-6 text-sm font-sans transition-all duration-150"
				style={{
					background: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
					border: "none",
					color: "#fff",
					boxShadow: "0 4px 18px rgba(61,92,46,0.45)",
				}}
			>
				🔒 Kunci DNA & Lanjut ke Scene Configuration →
			</button>
		</div>
	);
}
