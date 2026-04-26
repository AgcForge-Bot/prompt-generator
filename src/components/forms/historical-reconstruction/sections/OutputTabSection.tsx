"use client";

import type { Dispatch, SetStateAction } from "react";
import type {
	HistoricalReconGeneratorConfig,
	HistoricalReconConfig,
} from "../types";

export default function OutputTabSection({
	gen,
	config,
	setActiveTab,
	mmss,
}: {
	gen: HistoricalReconGeneratorConfig;
	config: HistoricalReconConfig;
	setActiveTab: Dispatch<SetStateAction<"config" | "output">>;
	mmss(sec: number): string;
}) {
	return (
		<>
			{gen.allPrompts.length === 0 ? (
				<div className="card text-center py-12">
					<div className="text-4xl mb-4">🏛️</div>
					<div className="font-playfair text-xl text-cream mb-2">
						Belum Ada Output
					</div>
					<div className="font-mono text-[10px] text-stone2 mb-4">
						Isi konfigurasi dan klik Generate di tab Konfigurasi.
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
								border: "1px solid rgba(212,148,26,0.35)",
								background: "rgba(212,148,26,0.04)",
							}}
						>
							<div className="section-label" style={{ color: "var(--amber2)" }}>
								📊 SEO Pack — AI Generated
							</div>
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
							<div className="mb-4">
								<div className="flex items-center justify-between mb-1">
									<label className="field-label mb-0">📝 Deskripsi Video</label>
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
									<label className="field-label mb-0">🏷️ 30 Tags SEO</label>
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
											className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bark/40 border border-amber/20 text-stone2"
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
						<div className="section-label">📦 Export Semua Scene Prompt</div>
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
									className="h-full bg-linear-to-r from-leaf to-leaf2 rounded-full"
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
									const startSec = i * config.secPerScene;
									const endSec = startSec + config.secPerScene;
									return (
										<div
											key={i + 1}
											className="rounded-xl border border-leaf/15 overflow-hidden"
										>
											<div className="flex items-center justify-between px-4 py-2 bg-bark/40 border-b border-leaf/10">
												<div className="flex items-center gap-2">
													<span className="font-mono text-[10px] text-leaf2 font-bold">
														Scene {i + 1}/{gen.totalScenes}
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
	);
}
