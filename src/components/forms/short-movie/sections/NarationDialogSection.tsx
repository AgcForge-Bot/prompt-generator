"use client";

import type { ShortMovieGeneratorConfig } from "../types";
import {
	NARRATION_MODE_OPTIONS,
	NARRATION_HINTS,
	DIALOG_LANGUAGE_OPTIONS,
} from "../constants";
import Field from "@/components/forms/forest-build/Field";

export default function NarationDialogSection({
	gen,
}: {
	gen: ShortMovieGeneratorConfig;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🎙️ Narasi & Dialog</div>

			{/* Mode selector — 3 cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
				{NARRATION_MODE_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() =>
							gen.updateConfig({
								narrationMode: opt.value as typeof gen.config.narrationMode,
							})
						}
						className={`text-left p-3 rounded-xl border-2 transition-all ${
							gen.config.narrationMode === opt.value
								? opt.value === "none"
									? "border-leaf bg-leaf/10"
									: opt.value === "subtitle"
										? "border-amber bg-amber/10"
										: "border-purple-500/60 bg-purple-900/15"
								: "border-leaf/15 bg-bark/30 hover:border-leaf/35"
						}`}
					>
						<div className="font-playfair text-sm font-bold text-cream mb-1">
							{opt.label}
						</div>
						<div className="font-mono text-[9px] text-stone2 leading-relaxed">
							{opt.desc}
						</div>
					</button>
				))}
			</div>

			{/* Hint for selected mode */}
			<div
				className={`rounded-xl p-3 mb-4 font-mono text-[10px] leading-relaxed ${
					gen.config.narrationMode === "none"
						? "bg-leaf/10 border border-leaf/25 text-sand"
						: gen.config.narrationMode === "subtitle"
							? "bg-amber/10 border border-amber/25 text-amber2"
							: "bg-purple-900/20 border border-purple-500/30 text-purple-300"
				}`}
			>
				{gen.config.narrationMode !== "none" && (
					<span className="font-bold">⚠ AI tetap punya kendali penuh: </span>
				)}
				{NARRATION_HINTS[gen.config.narrationMode]}
			</div>

			{/* Language selector — only show when not pure visual */}
			{gen.config.narrationMode !== "none" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Field label="🌐 Bahasa Dialog / Narasi">
						<div className="flex flex-wrap gap-2">
							{DIALOG_LANGUAGE_OPTIONS.map((lang) => (
								<button
									key={lang.value}
									type="button"
									onClick={() =>
										gen.updateConfig({
											dialogLanguage:
												lang.value as typeof gen.config.dialogLanguage,
										})
									}
									className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all ${
										gen.config.dialogLanguage === lang.value
											? "bg-amber/20 border-amber text-amber2"
											: "bg-bark/30 border-leaf/20 text-stone2 hover:border-leaf/50 hover:text-cream"
									}`}
								>
									{lang.flag} {lang.value}
								</button>
							))}
						</div>
					</Field>

					<div className="rounded-xl border border-leaf/10 bg-bark/25 p-3 flex flex-col justify-center">
						<div className="font-mono text-[10px] text-leaf2 font-bold mb-2">
							{gen.config.narrationMode === "subtitle"
								? "💬 Contoh Output Dialog"
								: "🎙️ Contoh Output Voiceover"}
						</div>
						<div className="font-mono text-[9px] text-stone2 leading-relaxed">
							{gen.config.narrationMode === "subtitle"
								? `"dialog": {\n  "type": "subtitle",\n  "language": "${gen.config.dialogLanguage}",\n  "lines": [\n    "Char A: ...",\n    "Char B: ..."\n  ]\n}\n— atau —\n"dialog": null (jika AI anggap tidak perlu)`
								: `"dialog": {\n  "type": "voiceover",\n  "language": "${gen.config.dialogLanguage}",\n  "speaker": "narrator",\n  "lines": ["narasi..."\n  ]\n}\n— atau —\n"dialog": null (jika AI anggap tidak perlu)`}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
