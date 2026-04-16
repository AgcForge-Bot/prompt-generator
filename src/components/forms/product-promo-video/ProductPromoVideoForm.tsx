"use client";

import useProductPromoGenerator from "./useProductPromoGenerator";
import ProductInfoSection from "./sections/ProductInfoSection";
import {
	CategorySection,
	VideoStyleSection,
	ModelSection,
} from "./sections/CategoryAndModelSections";
import {
	NarrationSection,
	LocationSection,
	DurationSection,
	AspectRatioSection,
	CTASection,
} from "./sections/ConfigSections";
import SceneOutputSection from "./sections/SceneOutputSection";

type TabKey = "setup" | "scenes" | "output";

export default function ProductPromoVideoForm() {
	const gen = useProductPromoGenerator();

	const tabs: { key: TabKey; label: string; emoji: string }[] = [
		{ key: "setup", label: "Konfigurasi", emoji: "⚙️" },
		{ key: "scenes", label: "Prompt & Output", emoji: "🎬" },
	];

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-leaf text-sm">🛍️</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
									Product Promo · AI Video Prompt Generator
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								Promo Video
								<br />
								<em className="text-leaf2 italic">Iklan Produk</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								Generate prompt iklan produk yang siap untuk AI Video
								<br />
								Kling · Runway · Pika · Sora · Hailuo · VEO · Grok
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							{[
								["Total Scene", `${gen.dna.totalScenes}`],
								["Durasi", `${gen.dna.totalDurationSec} detik`],
								["Per Scene", `${gen.dna.secPerScene} detik`],
								["Format", gen.dna.aspectRatio],
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

				{/* ── AUTO GENERATE PANEL ── */}
				<section className="card mb-6 border-amber/30 bg-amber/5">
					<div className="section-label" style={{ color: "var(--amber2)" }}>
						🚀 Auto Generate — Mode Cepat
					</div>
					<p className="font-mono text-[10px] text-stone2 mb-4 leading-relaxed">
						Upload foto produk → pilih durasi → klik{" "}
						<strong className="text-amber2">Generate Otomatis</strong>. AI akan
						menganalisa produk dan membuat semua prompt scene secara otomatis.
						Atau atur manual di tab Konfigurasi untuk kontrol penuh.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
						{/* Quick upload */}
						<div>
							<label className="field-label">📸 Upload Foto Produk</label>
							<label className="flex items-center gap-3 border-2 border-dashed border-amber/30 rounded-xl p-3 cursor-pointer hover:border-amber/60 hover:bg-amber/5 transition-all">
								<input
									type="file"
									className="hidden"
									accept="image/*"
									multiple
									disabled={gen.imgAnalyzing}
									onChange={(e) =>
										gen.handleImageUpload(
											e,
											gen.dna.productName,
											gen.dna.productCategory,
										)
									}
								/>
								<span className="text-2xl">📁</span>
								<div>
									<div className="font-mono text-[10px] text-amber2 font-bold">
										{gen.imgAnalyzing
											? gen.imgProgress
											: "Klik untuk upload foto"}
									</div>
									<div className="font-mono text-[9px] text-stone2">
										{gen.productImages.length > 0
											? `${gen.productImages.length} foto dipilih ✓`
											: "JPG · PNG · WEBP"}
									</div>
								</div>
							</label>
						</div>

						{/* Quick product name */}
						<div>
							<label className="field-label">📦 Nama Produk</label>
							<input
								className="forest-input"
								placeholder='Contoh: "Hijab Cerutti Premium"'
								value={gen.dna.productName}
								onChange={(e) => gen.setDna({ productName: e.target.value })}
							/>
							<div className="mt-2">
								<label className="field-label">⏱️ Durasi Video</label>
								<div className="flex gap-1.5 flex-wrap">
									{[30, 60, 90, 120].map((sec) => (
										<button
											key={sec}
											type="button"
											onClick={() =>
												gen.setDna({
													totalDurationSec: sec,
													totalScenes: Math.floor(sec / gen.dna.secPerScene),
												})
											}
											className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] transition-all ${
												gen.dna.totalDurationSec === sec
													? "border-amber/60 bg-amber/20 text-amber2 font-bold"
													: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30"
											}`}
										>
											{sec}s
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					<button
						type="button"
						disabled={gen.isGeneratingAll || gen.imgAnalyzing}
						onClick={gen.autoGenerate}
						className="w-full rounded-xl font-bold py-3 px-6 transition-all duration-150 font-sans text-sm"
						style={{
							background: gen.isGeneratingAll
								? "rgba(212,148,26,0.2)"
								: "linear-gradient(135deg, #d4941a, #e8ab30)",
							border: "none",
							color: "#1a2e1a",
							boxShadow: gen.isGeneratingAll
								? "none"
								: "0 4px 18px rgba(212,148,26,0.35)",
						}}
					>
						{gen.isGeneratingAll
							? `⏳ Generating ${gen.dna.totalScenes} scene prompt...`
							: `🚀 Auto Generate ${gen.dna.totalScenes} Scene Prompt`}
					</button>
				</section>

				{/* ── TABS ── */}
				<div className="flex gap-0.5 mb-5 bg-bark/40 rounded-xl p-1">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => gen.setActiveTab(tab.key as "setup" | "scenes")}
							className={`flex-1 rounded-lg py-2.5 font-bold text-xs transition-all font-sans ${
								gen.activeTab === tab.key
									? "bg-moss/50 text-leaf2 shadow-sm"
									: "text-stone2 hover:text-cream"
							}`}
						>
							{tab.emoji} {tab.label}
						</button>
					))}
				</div>

				{/* ── SETUP TAB ── */}
				{gen.activeTab === "setup" && (
					<div>
						<ProductInfoSection
							dna={gen.dna}
							setDna={gen.setDna}
							productImages={gen.productImages}
							imgAnalyzing={gen.imgAnalyzing}
							imgProgress={gen.imgProgress}
							imgModel={gen.imgModel}
							setImgModel={gen.setImgModel}
							imgModelId={gen.imgModelId}
							setImgModelId={gen.setImgModelId}
							urlInput={gen.urlInput}
							setUrlInput={gen.setUrlInput}
							marketplaceUrl={gen.marketplaceUrl}
							setMarketplaceUrl={gen.setMarketplaceUrl}
							onUpload={(e) =>
								gen.handleImageUpload(
									e,
									gen.dna.productName,
									gen.dna.productCategory,
								)
							}
							onAddUrl={(url) =>
								gen.addImageURL(
									url,
									gen.dna.productName,
									gen.dna.productCategory,
								)
							}
							removeImage={gen.removeImage}
						/>
						<CategorySection dna={gen.dna} setDna={gen.setDna} />
						<VideoStyleSection dna={gen.dna} setDna={gen.setDna} />
						<ModelSection dna={gen.dna} setDna={gen.setDna} />
						<NarrationSection dna={gen.dna} setDna={gen.setDna} />
						<LocationSection dna={gen.dna} setDna={gen.setDna} />
						<DurationSection
							dna={gen.dna}
							setDna={gen.setDna}
							rebuildScenes={gen.rebuildScenes}
						/>
						<AspectRatioSection dna={gen.dna} setDna={gen.setDna} />
						<CTASection dna={gen.dna} setDna={gen.setDna} />

						{/* Proceed to generate */}
						<div className="flex gap-3 mt-2 mb-8">
							<button
								type="button"
								className="btn-primary flex-1 py-3"
								onClick={() => {
									gen.rebuildScenes();
									gen.setActiveTab("scenes");
								}}
							>
								Lanjut ke Generate Prompt →
							</button>
						</div>
					</div>
				)}

				{/* ── SCENES TAB ── */}
				{gen.activeTab === "scenes" && (
					<SceneOutputSection
						dna={gen.dna}
						scenes={gen.scenes}
						currentScene={gen.currentScene}
						setCurrentScene={gen.setCurrentScene}
						generatedCount={gen.generatedCount}
						isGeneratingSingle={gen.isGeneratingSingle}
						isGeneratingAll={gen.isGeneratingAll}
						allPrompts={gen.allPrompts}
						showAllPrompts={gen.showAllPrompts}
						setShowAllPrompts={gen.setShowAllPrompts}
						onGenerateSingle={gen.generatePrompt}
						onGenerateAll={gen.generateAll}
						onCopySingle={gen.copyPrompt}
						onCopyAll={gen.copyAllPrompts}
					/>
				)}
			</div>

			{/* ── TOAST ── */}
			<div
				className={`toast-base ${gen.toast.visible ? "bg-moss/90 text-leaf2 opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
