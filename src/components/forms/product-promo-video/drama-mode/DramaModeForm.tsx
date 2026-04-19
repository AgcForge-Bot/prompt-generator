"use client";

import useDramaModeGenerator from "./useDramaModeGenerator";
import DramaConfigSection from "./sections/DramaConfigSection";
import DramaOutputSection from "./sections/DramaOutputSection";

export default function DramaModeForm() {
	const gen = useDramaModeGenerator();

	const tabs = [
		{ key: "config" as const, label: "Konfigurasi", emoji: "🎭" },
		{ key: "output" as const, label: "Script Output", emoji: "📄" },
	];

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<header className="mb-6 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-sm">🇹🇭</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-amber2">
									Thailand-Style Drama Ad · AI Film Pendek
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								Drama Ad
								<br />
								<em className="text-amber2 italic">Gimmick Mode</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								Iklan film pendek gaya Thailand — slice of life + gimmick absurd
								+ plot twist produk
								<br />
								&quot;Tertipu tapi terhibur&quot; formula · Full AI JSON Script
								Generation
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							{[
								["Total Scene", `${gen.totalScenes}`],
								["Durasi", `${gen.dna.totalDurationSec}s`],
								["Per Scene", `${gen.dna.secPerScene}s`],
								["CTA Scene", `${gen.ctaCount}`],
							].map(([k, v]) => (
								<div
									key={k as string}
									className="font-mono text-[10px] px-3 py-1 rounded-full border border-amber/25 bg-amber/10 text-amber2 whitespace-nowrap"
								>
									{k}: <span className="font-bold">{v}</span>
								</div>
							))}
						</div>
					</div>

					{/* Formula banner */}
					<div className="mt-4 rounded-xl bg-bark/30 border border-amber/20 px-4 py-3">
						<div className="flex items-center gap-4 flex-wrap">
							{[
								["😭", "Setup Klise", "Situasi drama yang sangat familiar"],
								[
									"🌀",
									"Eskalasi Absurd",
									"Drama naik ke level tidak masuk akal",
								],
								["💥", "Twist Produk", "Produk hadir sebagai solusi lucu"],
								[
									"😂",
									"CTA Gimmick",
									"Closing yang menghibur + call to action",
								],
							].map(([emoji, label, desc]) => (
								<div key={label as string} className="flex items-center gap-2">
									<span className="text-xl">{emoji}</span>
									<div>
										<div className="font-mono text-[9px] text-amber2 font-bold">
											{label}
										</div>
										<div className="font-mono text-[8px] text-stone2">
											{desc}
										</div>
									</div>
									{label !== "CTA Gimmick" && (
										<span className="text-leaf/40 font-mono text-lg">→</span>
									)}
								</div>
							))}
						</div>
					</div>
				</header>

				{/* ── TABS ── */}
				<div className="flex gap-0.5 mb-5 bg-bark/40 rounded-xl p-1">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => gen.setActiveTab(tab.key)}
							className={`flex-1 rounded-lg py-2.5 font-bold text-xs transition-all font-sans flex items-center justify-center gap-1.5 ${
								gen.activeTab === tab.key
									? "bg-amber/25 text-amber2 shadow-sm"
									: "text-stone2 hover:text-cream"
							}`}
						>
							{tab.emoji} {tab.label}
							{tab.key === "output" && gen.output && (
								<span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-leaf/20 border border-leaf/20 text-leaf2">
									{gen.allScenes.length} scene ✓
								</span>
							)}
						</button>
					))}
				</div>

				{/* ── CONFIG TAB ── */}
				{gen.activeTab === "config" && (
					<DramaConfigSection
						dna={gen.dna}
						setDna={gen.setDna}
						updateCta={gen.updateCta}
						updateManualInstruction={gen.updateManualInstruction}
						isUploadingImages={gen.isUploadingImages}
						onImageUpload={gen.handleImageUpload}
						onRemoveImage={gen.removeImage}
						onGenerate={gen.handleGenerate}
						isGenerating={gen.isGenerating}
						error={gen.error}
					/>
				)}

				{/* ── OUTPUT TAB ── */}
				{gen.activeTab === "output" && gen.output && (
					<DramaOutputSection
						output={gen.output}
						outputJson={gen.outputJson}
						allScenes={gen.allScenes}
						onCopy={gen.copyOutput}
						onDownload={gen.downloadOutput}
						onCopyScene={gen.copyScene}
					/>
				)}

				{/* Output tab tapi belum generate */}
				{gen.activeTab === "output" && !gen.output && (
					<div className="card text-center py-12">
						<div className="text-4xl mb-4">🎬</div>
						<div className="font-playfair text-xl text-cream mb-2">
							Belum Ada Script
						</div>
						<div className="font-mono text-[10px] text-stone2 mb-4">
							Konfigurasi dulu di tab Konfigurasi, lalu klik Generate.
						</div>
						<button
							type="button"
							className="btn-primary py-2.5 px-6 text-sm"
							onClick={() => gen.setActiveTab("config")}
						>
							← Ke Konfigurasi
						</button>
					</div>
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
