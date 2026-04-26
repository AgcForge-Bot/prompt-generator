"use client";

import type {
	HistoricalReconGeneratorConfig,
	HistoricalCategoryKey,
	HistoricalReconConfig,
	VisualStyleKey,
} from "../types";
import {
	HISTORICAL_CATEGORIES,
	CIVILIZATIONS_BY_CATEGORY,
	HISTORICAL_ERAS,
	NARRATION_TONES,
	VISUAL_APPROACHES,
	VISUAL_STYLE_LABELS,
	COLOR_GRADE_OPTIONS,
	CONTENT_DEPTH_OPTIONS,
	PLATFORM_OPTIONS,
	TOTAL_MINUTE_OPTIONS,
	SEC_PER_SCENE_OPTIONS,
} from "../constants";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";

import SectionCard from "./SectionCard";

export default function ConfigTabSection({
	gen,
	config,
	catKeys,
	totalSec,
	catInfo,
	visualStyleKeys,
	updateConfig,
	mmss,
}: {
	gen: HistoricalReconGeneratorConfig;
	config: HistoricalReconConfig;
	catKeys: HistoricalCategoryKey[];
	totalSec: number;
	catInfo: {
		label: string;
		icon: string;
		description: string;
		exampleTopics: string[];
		aiDirectorNote: string;
	};
	visualStyleKeys: VisualStyleKey[];
	updateConfig: (updates: Partial<HistoricalReconConfig>) => void;
	mmss: (sec: number) => string;
}) {
	return (
		<>
			{/* ── KATEGORI TEMA ── */}
			<SectionCard label="📚 Kategori Tema Rekonstruksi">
				<div className="font-mono text-[9px] text-stone2 mb-4 leading-relaxed">
					Pilih kategori tema. AI akan menyesuaikan gaya narasi, struktur scene,
					dan detail historis sesuai kategori.
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
					{catKeys.map((key) => {
						const cat = HISTORICAL_CATEGORIES[key];
						const isActive = config.category === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => gen.setCategory(key)}
								className={`rounded-xl border px-3 py-3 text-left transition-all ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
								}`}
							>
								<div className="text-xl mb-1">{cat.icon}</div>
								<div
									className={`font-playfair text-xs font-bold leading-tight ${isActive ? "text-leaf2" : "text-cream"}`}
								>
									{cat.label}
								</div>
								<div className="font-mono text-[8px] text-stone2 mt-0.5 leading-tight">
									{cat.exampleTopics[0].substring(0, 35)}...
								</div>
							</button>
						);
					})}
				</div>

				{/* Info kategori terpilih */}
				<div className="mt-4 rounded-xl bg-bark/25 border border-leaf/15 p-3">
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
					<div className="font-mono text-[8px] text-stone2/60 mb-2">
						Contoh topik:
					</div>
					<div className="flex flex-wrap gap-1">
						{catInfo.exampleTopics.slice(0, 4).map((t) => (
							<button
								key={t}
								type="button"
								className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-bark/40 border border-leaf/12 text-stone2 hover:border-leaf/30 hover:text-cream transition-all text-left"
								onClick={() => updateConfig({ topicTitle: t })}
							>
								{t}
							</button>
						))}
					</div>
				</div>
			</SectionCard>

			{/* ── TOPIK & DETAIL ── */}
			<SectionCard label="📝 Topik & Detail Rekonstruksi">
				<div className="flex flex-col gap-4">
					{/* Judul topik */}
					<div>
						<label className="field-label">
							🎬 Judul / Topik Rekonstruksi{" "}
							<span className="text-amber2">*</span>
						</label>
						<input
							className="forest-input"
							placeholder='Contoh: "The Complete History of the Roman Empire" atau "Battle of Thermopylae: 300 Spartans vs Persia"'
							value={config.topicTitle}
							onChange={(e) => updateConfig({ topicTitle: e.target.value })}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* Peradaban / subjek */}
						<div>
							<label className="field-label">
								🏛️ Peradaban / Subjek Utama{" "}
								<span className="text-amber2">*</span>
							</label>
							<div className="flex gap-2">
								<input
									className="forest-input"
									placeholder='Contoh: "Roman Empire", "Vikings", "Alexander the Great"'
									value={config.civilization}
									onChange={(e) =>
										updateConfig({ civilization: e.target.value })
									}
								/>
							</div>
							{/* Quick pick */}
							<div className="flex flex-wrap gap-1 mt-1.5">
								{CIVILIZATIONS_BY_CATEGORY[config.category]
									.slice(0, 4)
									.map((civ) => (
										<button
											key={civ}
											type="button"
											className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-bark/40 border border-leaf/12 text-stone2 hover:border-leaf/30 hover:text-cream transition-all"
											onClick={() => updateConfig({ civilization: civ })}
										>
											{civ}
										</button>
									))}
							</div>
						</div>

						{/* Era */}
						<div>
							<label className="field-label">⏳ Era Waktu</label>
							<select
								className="forest-select"
								value={config.historicalEra}
								onChange={(e) =>
									updateConfig({
										historicalEra: e.target
											.value as typeof config.historicalEra,
									})
								}
							>
								{Object.entries(HISTORICAL_ERAS).map(([key, era]) => (
									<option key={key} value={key}>
										{era.label} ({era.range})
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Deskripsi detail */}
					<div>
						<label className="field-label">
							📖 Deskripsi Detail (opsional — semakin detail semakin akurat)
						</label>
						<textarea
							className="forest-input resize-none min-h-22.5"
							placeholder={`Deskripsikan secara detail apa yang ingin direkonstruksi. Contoh: "Fokus pada kejatuhan Republik Romawi dan bangkitnya Julius Caesar — dari perang Galia, penyeberangan Rubicon, hingga pengkhianatan di Ides of March. Sertakan perspektif Senat dan rakyat biasa Roma."`}
							value={config.topicDescription}
							onChange={(e) =>
								updateConfig({ topicDescription: e.target.value })
							}
						/>
					</div>

					{/* Key facts */}
					<div>
						<label className="field-label">
							🔍 Fakta Kunci yang Harus Dimasukkan (opsional)
						</label>
						<textarea
							className="forest-input resize-none min-h-17.5"
							placeholder='Contoh: "Include: 1) Caesar crossed the Rubicon in 49 BC with one legion, 2) The phrase alea iacta est, 3) The conspiracy of 23 senators, 4) Death on the Ides of March (March 15, 44 BC)"'
							value={config.keyFacts}
							onChange={(e) => updateConfig({ keyFacts: e.target.value })}
						/>
					</div>

					{/* Angle kontroversial */}
					<div>
						<label className="field-label">
							❓ Angle Kontroversial / Misteri (opsional)
						</label>
						<input
							className="forest-input"
							placeholder='Contoh: "Was Caesar planning to become king? Did he fake resistance to the crown?"'
							value={config.controversialAngle}
							onChange={(e) =>
								updateConfig({ controversialAngle: e.target.value })
							}
						/>
						<div className="font-mono text-[9px] text-stone2 mt-1">
							Tambahkan angle kontroversial untuk membuat konten lebih menarik
							dan mengundang diskusi
						</div>
					</div>
				</div>
			</SectionCard>

			{/* ── DURASI & PLATFORM ── */}
			<SectionCard label="⏱️ Durasi & Platform">
				<div className="mb-4">
					<label className="field-label">Total Durasi</label>
					<div className="flex flex-wrap gap-2">
						{TOTAL_MINUTE_OPTIONS.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => gen.setDuration(opt.value, config.secPerScene)}
								className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] transition-all ${
									config.totalMinutes === opt.value
										? "border-leaf bg-moss/30 text-leaf2 font-bold"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30"
								}`}
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
								onClick={() => gen.setDuration(config.totalMinutes, sec)}
								className={`flex-1 min-w-13 rounded-lg border py-2 font-mono text-[10px] transition-all ${
									config.secPerScene === sec
										? "border-amber/60 bg-amber/15 text-amber2 font-bold"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30"
								}`}
							>
								{sec}s
							</button>
						))}
					</div>
				</div>
				{/* Kalkulasi */}
				<div className="flex gap-3 rounded-xl bg-forest/50 border border-leaf/20 p-3 mb-4">
					{[
						["Total", mmss(totalSec)],
						["Per Scene", `${config.secPerScene}s`],
						["Total Scene", `${gen.totalScenes}`],
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
				{/* Platform */}
				<div className="mb-4">
					<label className="field-label">🎯 Target Platform</label>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
						{PLATFORM_OPTIONS.map((p) => (
							<button
								key={p.value}
								type="button"
								onClick={() => updateConfig({ targetPlatform: p.value })}
								className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
									config.targetPlatform === p.value
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
								}`}
							>
								<div
									className={`font-playfair text-xs font-bold mb-0.5 ${config.targetPlatform === p.value ? "text-leaf2" : "text-cream"}`}
								>
									{p.label}
								</div>
								<div className="font-mono text-[9px] text-stone2">{p.desc}</div>
							</button>
						))}
					</div>
				</div>
				{/* Content depth */}
				<div>
					<label className="field-label">📊 Kedalaman Konten</label>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
						{CONTENT_DEPTH_OPTIONS.map((d) => (
							<button
								key={d.key}
								type="button"
								onClick={() => updateConfig({ contentDepth: d.key })}
								className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
									config.contentDepth === d.key
										? "border-amber/60 bg-amber/12"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
								}`}
							>
								<div
									className={`font-playfair text-xs font-bold mb-0.5 ${config.contentDepth === d.key ? "text-amber2" : "text-cream"}`}
								>
									{d.label}
								</div>
								<div className="font-mono text-[9px] text-stone2">{d.desc}</div>
							</button>
						))}
					</div>
				</div>
			</SectionCard>

			{/* ── NARASI ── */}
			<SectionCard label="🎙️ Narasi Dokumenter">
				<div className="mb-4">
					<div className="flex items-center gap-3 mb-3">
						<button
							type="button"
							onClick={() =>
								updateConfig({
									includeNarration: !config.includeNarration,
								})
							}
							className={`relative w-10 h-5 rounded-full transition-colors ${config.includeNarration ? "bg-leaf" : "bg-bark/50 border border-leaf/20"}`}
						>
							<span
								className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${config.includeNarration ? "left-5" : "left-0.5"}`}
							/>
						</button>
						<label
							className="field-label mb-0 cursor-pointer"
							onClick={() =>
								updateConfig({
									includeNarration: !config.includeNarration,
								})
							}
						>
							Sertakan Narasi Dokumenter
						</label>
					</div>
					<div className="font-mono text-[9px] text-stone2 leading-relaxed">
						{config.includeNarration
							? "AI akan tambahkan narasi voiceover sesuai tone yang dipilih"
							: "Pure visual — AI tidak akan tambahkan narasi, hanya visual yang bicara"}
					</div>
				</div>

				{config.includeNarration && (
					<>
						<div className="mb-4">
							<label className="field-label">Tone Narasi</label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{Object.entries(NARRATION_TONES).map(([key, tone]) => {
									const isActive = config.narrationTone === key;
									return (
										<button
											key={key}
											type="button"
											onClick={() =>
												updateConfig({
													narrationTone: key as typeof config.narrationTone,
												})
											}
											className={`rounded-xl border px-3 py-2.5 text-left transition-all ${isActive ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/35"}`}
										>
											<div className="flex items-center gap-2 mb-0.5">
												<span className="text-base">{tone.icon}</span>
												<span
													className={`font-playfair text-xs font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
												>
													{tone.label}
												</span>
											</div>
											<div className="font-mono text-[8px] text-stone2 leading-tight">
												{tone.desc}
											</div>
										</button>
									);
								})}
							</div>
						</div>
						<div>
							<label className="field-label">Bahasa Narasi</label>
							<div className="flex gap-2">
								{(["English", "Indonesian", "Bilingual"] as const).map(
									(lang) => (
										<button
											key={lang}
											type="button"
											onClick={() => updateConfig({ narrationLanguage: lang })}
											className={`flex-1 rounded-lg border py-2 font-mono text-[10px] transition-all ${config.narrationLanguage === lang ? "border-leaf bg-moss/25 text-leaf2 font-bold" : "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30"}`}
										>
											{lang === "English"
												? "🇺🇸 English"
												: lang === "Indonesian"
													? "🇮🇩 Indonesian"
													: "🌐 Bilingual"}
										</button>
									),
								)}
							</div>
							<div className="font-mono text-[9px] text-stone2 mt-1">
								English direkomendasikan untuk jangkauan penonton global YouTube
								yang lebih luas
							</div>
						</div>
					</>
				)}
			</SectionCard>

			{/* ── VISUAL ── */}
			<SectionCard label="🎨 Visual & Sinematografi">
				<div className="mb-4">
					<label className="field-label">Visual Style</label>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{visualStyleKeys.map((key) => (
							<button
								key={key}
								type="button"
								onClick={() => updateConfig({ visualStyle: key })}
								className={`rounded-xl border px-3 py-2 text-left transition-all ${config.visualStyle === key ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/35"}`}
							>
								<div
									className={`font-playfair text-xs font-bold ${config.visualStyle === key ? "text-leaf2" : "text-cream"}`}
								>
									{VISUAL_STYLE_LABELS[key]}
								</div>
							</button>
						))}
					</div>
				</div>
				<div className="mb-4">
					<label className="field-label">Visual Approach</label>
					<div className="flex flex-col gap-2">
						{Object.entries(VISUAL_APPROACHES).map(([key, approach]) => {
							const isActive = config.visualApproach === key;
							return (
								<button
									key={key}
									type="button"
									onClick={() =>
										updateConfig({
											visualApproach: key as typeof config.visualApproach,
										})
									}
									className={`rounded-xl border px-4 py-3 text-left transition-all ${isActive ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/35"}`}
								>
									<div
										className={`font-playfair text-sm font-bold mb-0.5 ${isActive ? "text-leaf2" : "text-cream"}`}
									>
										{approach.label}
									</div>
									<div className="font-mono text-[9px] text-stone2">
										{approach.desc}
									</div>
								</button>
							);
						})}
					</div>
				</div>
				<div>
					<label className="field-label">🎨 Color Grade</label>
					<select
						className="forest-select"
						value={config.colorGrade}
						onChange={(e) => updateConfig({ colorGrade: e.target.value })}
					>
						{COLOR_GRADE_OPTIONS.map((c) => (
							<option key={c.value} value={c.value}>
								{c.label}
							</option>
						))}
					</select>
				</div>
			</SectionCard>

			{/* ── AI MODEL ── */}
			<SectionCard label="🤖 AI Model">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label className="field-label">Provider</label>
						<select
							className="forest-select"
							value={config.aiProvider}
							onChange={(e) => gen.setAiProvider(e.target.value)}
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
							value={config.aiModelId || getDefaultModelId(config.aiProvider)}
							onChange={(e) => updateConfig({ aiModelId: e.target.value })}
						>
							{getModelOptions(config.aiProvider).map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="mt-2 p-3 rounded-xl bg-bark/40 border border-leaf/10 font-mono text-[10px] text-stone2">
					{gen.totalScenes} scene × {config.secPerScene}s ={" "}
					<span className="text-amber2 font-bold">{mmss(totalSec)}</span> ·
					maxTokens: 16000. Direkomendasikan: Claude Sonnet/Opus atau GPT-4o
					untuk historical accuracy terbaik.
				</div>
			</SectionCard>

			{/* ── ERROR ── */}
			{gen.error && (
				<div
					className="card mb-5"
					style={{
						border: "1px solid rgba(239,68,68,0.3)",
						background: "rgba(127,29,29,0.1)",
					}}
				>
					<div className="flex items-start gap-2">
						<span className="text-red-400 shrink-0">⚠</span>
						<div className="font-mono text-[10px] text-red-300/80">
							{gen.error}
						</div>
					</div>
				</div>
			)}

			{/* ── GENERATE BUTTON ── */}
			<button
				type="button"
				disabled={gen.isGenerating}
				onClick={gen.generateAllWithAI}
				className="w-full rounded-xl font-bold py-4 px-6 text-sm font-sans transition-all mb-5 flex items-center justify-center gap-2"
				style={{
					background: gen.isGenerating
						? "rgba(122,182,72,0.15)"
						: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
					border: "none",
					color: gen.isGenerating ? "var(--leaf)" : "#fff",
					boxShadow: gen.isGenerating
						? "none"
						: "0 4px 18px rgba(61,92,46,0.45)",
				}}
			>
				{gen.isGenerating ? (
					<>
						<span className="animate-pulse">⏳</span> AI sedang merekonstruksi
						sejarah ({gen.totalScenes} scene)...
					</>
				) : (
					<>
						🏛️ Generate {gen.totalScenes} Scene Historical Reconstruction + SEO
						Pack
					</>
				)}
			</button>
		</>
	);
}
