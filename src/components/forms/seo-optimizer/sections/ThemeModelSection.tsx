"use client";

import type { VideoThemeKey, ModelType } from "../types";
import {
	VIDEO_THEMES,
	LANGUAGE_OPTIONS,
	getThemeIcon,
	getThemeLabel,
} from "../constants";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";

type Props = {
	mode: "generate" | "analyze";
	theme: VideoThemeKey;
	aiModel: ModelType;
	aiModelId: string;
	language: "id" | "en" | "both";
	customThemeName?: string;
	onMode: (m: "generate" | "analyze") => void;
	onTheme: (t: VideoThemeKey) => void;
	onModel: (m: ModelType) => void;
	onModelId: (id: string) => void;
	onLanguage: (l: "id" | "en" | "both") => void;
};

const PRESET_THEME_KEYS = Object.keys(VIDEO_THEMES) as Exclude<
	VideoThemeKey,
	"other-video-theme"
>[];

export default function ThemeModelSection({
	mode,
	theme,
	aiModel,
	aiModelId,
	language,
	customThemeName,
	onMode,
	onTheme,
	onModel,
	onModelId,
	onLanguage,
}: Props) {
	const isCustom = theme === "other-video-theme";

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

				{/* Preset themes (5 tema fix) */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
					{PRESET_THEME_KEYS.map((key) => {
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

					{/* ── OTHER THEME BUTTON ── */}
					<button
						type="button"
						onClick={() => onTheme("other-video-theme")}
						className={`rounded-xl border px-4 py-3 text-left transition-all ${
							isCustom
								? "border-amber/60 bg-amber/10"
								: "border-amber/20 bg-bark/20 hover:border-amber/40 hover:bg-amber/5"
						}`}
					>
						<div className="flex items-center gap-2 mb-1">
							<span className="text-lg">🎨</span>
							<span
								className={`font-playfair text-sm font-bold ${isCustom ? "text-amber2" : "text-cream"}`}
							>
								Tema Lainnya
							</span>
						</div>
						<div className="font-mono text-[9px] text-stone2">
							{isCustom && customThemeName
								? customThemeName
								: "Tema bebas — isi manual + upload gambar referensi"}
						</div>
					</button>
				</div>

				{/* Info / preview tema yang dipilih */}
				{!isCustom && (
					<div className="mt-1 rounded-xl bg-bark/25 border border-leaf/10 p-3">
						<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-1">
							{
								VIDEO_THEMES[
									theme as Exclude<VideoThemeKey, "other-video-theme">
								].icon
							}{" "}
							Info Tema
						</div>
						<div className="font-mono text-[10px] text-stone2 leading-relaxed">
							<span className="text-cream">Platform:</span>{" "}
							{
								VIDEO_THEMES[
									theme as Exclude<VideoThemeKey, "other-video-theme">
								].platform
							}
							<br />
							<span className="text-cream">Audience:</span>{" "}
							{
								VIDEO_THEMES[
									theme as Exclude<VideoThemeKey, "other-video-theme">
								].audienceDesc
							}
						</div>
						<div className="mt-2 flex flex-wrap gap-1">
							{VIDEO_THEMES[
								theme as Exclude<VideoThemeKey, "other-video-theme">
							].keywordSeed
								.slice(0, 5)
								.map((kw) => (
									<span
										key={kw}
										className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-moss/20 border border-leaf/15 text-leaf2"
									>
										{kw}
									</span>
								))}
						</div>
					</div>
				)}

				{/* Notif jika custom tapi belum diisi */}
				{isCustom && (
					<div className="mt-1 rounded-xl bg-amber/8 border border-amber/20 p-3">
						<div className="font-mono text-[10px] text-amber2 leading-relaxed">
							✏️ Isi detail tema kamu di bagian{" "}
							<strong>&quot;Detail Tema Lainnya&quot;</strong> di bawah. Semakin
							detail deskripsi tema & alur ceritamu, semakin optimal SEO yang
							dihasilkan AI.
						</div>
					</div>
				)}
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
							value={aiModelId || getDefaultModelId(aiModel)}
							onChange={(e) => onModelId(e.target.value)}
						>
							{getModelOptions(aiModel).map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>
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

				{/* Info vision support jika custom theme + images */}
				{isCustom && mode === "generate" && (
					<div className="mt-3 px-3 py-2 rounded-lg bg-moss/10 border border-leaf/15">
						<div className="font-mono text-[9px] text-leaf2 leading-relaxed">
							🖼️ <strong>Claude, GPT-4o, dan Gemini</strong> mendukung analisa
							gambar referensi. Jika kamu upload gambar referensi, AI akan
							menggunakannya untuk menghasilkan thumbnail prompt dan storyboard
							yang lebih akurat secara visual.
						</div>
					</div>
				)}
			</section>
		</>
	);
}
