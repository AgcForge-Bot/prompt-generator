"use client";

import type { VideoThemeKey, ModelType } from "../types";
import {
	VIDEO_THEMES,
	AI_PROVIDERS,
	LANGUAGE_OPTIONS,
	getDefaultModelId,
} from "../constants";

type Props = {
	mode: "generate" | "analyze";
	theme: VideoThemeKey;
	aiModel: ModelType;
	aiModelId: string;
	language: "id" | "en" | "both";
	onMode: (m: "generate" | "analyze") => void;
	onTheme: (t: VideoThemeKey) => void;
	onModel: (m: ModelType) => void;
	onModelId: (id: string) => void;
	onLanguage: (l: "id" | "en" | "both") => void;
};

export default function ThemeModelSection({
	mode,
	theme,
	aiModel,
	aiModelId,
	language,
	onMode,
	onTheme,
	onModel,
	onModelId,
	onLanguage,
}: Props) {
	const themeKeys = Object.keys(VIDEO_THEMES) as VideoThemeKey[];

	return (
		<>
			{/* ── MODE SELECTOR ── */}
			<section className="card mb-5">
				<div className="section-label">🎛️ Mode Tools</div>
				<div className="grid grid-cols-2 gap-2">
					{[
						{
							key: "generate" as const,
							label: "Auto Generate SEO",
							emoji: "✨",
							desc: "Generate judul, deskripsi, tags, thumbnail prompt & storyboard",
						},
						{
							key: "analyze" as const,
							label: "Analisa SEO Video",
							emoji: "🔍",
							desc: "Analisa skor SEO video YouTube/Facebook yang sudah diupload",
						},
					].map((m) => (
						<button
							key={m.key}
							type="button"
							onClick={() => onMode(m.key)}
							className={`rounded-xl border p-4 text-left transition-all ${
								mode === m.key
									? "border-leaf bg-moss/25"
									: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
							}`}
						>
							<div className="text-2xl mb-2">{m.emoji}</div>
							<div
								className={`font-playfair text-sm font-bold mb-1 ${mode === m.key ? "text-leaf2" : "text-cream"}`}
							>
								{m.label}
							</div>
							<div className="font-mono text-[9px] text-stone2 leading-relaxed">
								{m.desc}
							</div>
						</button>
					))}
				</div>
			</section>

			{/* ── TEMA VIDEO ── */}
			<section className="card mb-5">
				<div className="section-label">🎬 Tema Video</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{themeKeys.map((key) => {
						const t = VIDEO_THEMES[key];
						const isActive = theme === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => onTheme(key)}
								className={`rounded-xl border px-4 py-3 text-left transition-all ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
								}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<span className="text-lg">{t.icon}</span>
									<span
										className={`font-playfair text-sm font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
									>
										{t.label}
									</span>
								</div>
								<div className="font-mono text-[9px] text-stone2">
									{t.niche}
								</div>
							</button>
						);
					})}
				</div>

				{/* Info tema terpilih */}
				<div className="mt-3 rounded-xl bg-bark/25 border border-leaf/10 p-3">
					<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-1">
						{VIDEO_THEMES[theme].icon} Info Tema
					</div>
					<div className="font-mono text-[10px] text-stone2 leading-relaxed">
						<span className="text-cream">Platform:</span>{" "}
						{VIDEO_THEMES[theme].platform}
						<br />
						<span className="text-cream">Audience:</span>{" "}
						{VIDEO_THEMES[theme].audienceDesc}
					</div>
					<div className="mt-2 flex flex-wrap gap-1">
						{VIDEO_THEMES[theme].keywordSeed.slice(0, 5).map((kw) => (
							<span
								key={kw}
								className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-moss/20 border border-leaf/15 text-leaf2"
							>
								{kw}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* ── AI MODEL ── */}
			<section className="card mb-5">
				<div className="section-label">🤖 AI Model</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
					<div>
						<label className="field-label">Provider AI</label>
						<select
							className="forest-select"
							value={aiModel}
							onChange={(e) => {
								const p = e.target.value as ModelType;
								onModel(p);
								onModelId(getDefaultModelId(p));
							}}
						>
							{AI_PROVIDERS.map((p) => (
								<option key={p.value} value={p.value}>
									{p.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="field-label">Model ID (opsional)</label>
						<input
							className="forest-input"
							placeholder={getDefaultModelId(aiModel)}
							value={aiModelId}
							onChange={(e) => onModelId(e.target.value)}
						/>
					</div>
				</div>

				{/* Bahasa output — hanya untuk generate mode */}
				{mode === "generate" && (
					<div>
						<label className="field-label">🌐 Bahasa Output</label>
						<div className="flex gap-2">
							{LANGUAGE_OPTIONS.map((l) => (
								<button
									key={l.value}
									type="button"
									onClick={() => onLanguage(l.value)}
									className={`flex-1 rounded-lg border py-2 font-mono text-[10px] transition-all ${
										language === l.value
											? "border-leaf bg-moss/25 text-leaf2 font-bold"
											: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/35 hover:text-cream"
									}`}
								>
									{l.label}
								</button>
							))}
						</div>
					</div>
				)}
			</section>
		</>
	);
}
