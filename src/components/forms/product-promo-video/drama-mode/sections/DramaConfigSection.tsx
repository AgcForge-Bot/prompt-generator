/* eslint-disable @next/next/no-img-element */
"use client";

import type { DramaDNA, DramaImageRef, ManualSceneInstruction } from "../types";
import {
	DRAMA_TOTAL_DURATION_OPTIONS,
	DRAMA_SEC_PER_SCENE_OPTIONS,
	DRAMA_CTA_GIMMICK_PRESETS,
	DRAMA_CTA_TEXT_PRESETS,
	AUTO_GIMMICK_TEMPLATES,
	calcDramaActs,
	calcCtaScenes,
	calcTotalDramaScenes,
} from "../constants";
import {
	PRODUCT_CATEGORIES,
	MODEL_GENDER_AGE,
} from "@/components/forms/product-promo-video/constants";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";
import type {
	ProductCategoryKey,
	ModelGenderAge,
} from "@/components/forms/product-promo-video/types";

type Props = {
	dna: DramaDNA;
	setDna: (u: Partial<DramaDNA>) => void;
	updateCta: (u: Partial<DramaDNA["cta"]>) => void;
	updateManualInstruction: (
		sceneId: number,
		u: Partial<ManualSceneInstruction>,
	) => void;
	isUploadingImages: boolean;
	onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveImage: (id: string) => void;
	onGenerate: () => void;
	isGenerating: boolean;
	error: string;
};

const catKeys = Object.keys(PRODUCT_CATEGORIES) as ProductCategoryKey[];
const modelKeys = Object.keys(MODEL_GENDER_AGE) as ModelGenderAge[];

export default function DramaConfigSection({
	dna,
	setDna,
	updateCta,
	updateManualInstruction,
	isUploadingImages,
	onImageUpload,
	onRemoveImage,
	onGenerate,
	isGenerating,
	error,
}: Props) {
	const totalScenes = calcTotalDramaScenes(
		dna.totalDurationSec,
		dna.secPerScene,
	);
	const ctaCount = calcCtaScenes(dna.totalDurationSec, dna.secPerScene);
	const dramaScenes = totalScenes - ctaCount;
	const acts = calcDramaActs(dna.totalDurationSec, dna.secPerScene);
	const catMeta = PRODUCT_CATEGORIES[dna.productCategory as ProductCategoryKey];
	const hasTemplate = Boolean(AUTO_GIMMICK_TEMPLATES[dna.productCategory]);

	return (
		<div className="flex flex-col gap-5">
			{/* ── PRODUCT INFO ── */}
			<section className="card">
				<div className="section-label">📦 Informasi Produk</div>

				<div className="mb-4">
					<label className="field-label">
						Nama Produk <span className="text-amber2">*</span>
					</label>
					<input
						className="forest-input"
						placeholder='Contoh: "Serum Glowing Nusantara" atau "Sepatu Badminton Pro-X"'
						value={dna.productName}
						onChange={(e) => setDna({ productName: e.target.value })}
					/>
				</div>

				<div className="mb-4">
					<label className="field-label">🔗 URL Produk (opsional)</label>
					<input
						className="forest-input"
						placeholder="https://shopee.co.id/... atau https://tokopedia.com/..."
						value={dna.productUrl}
						onChange={(e) => setDna({ productUrl: e.target.value })}
					/>
					<div className="font-mono text-[9px] text-stone2 mt-1">
						Link marketplace sebagai referensi tambahan untuk AI
					</div>
				</div>

				{/* Foto produk — maks 5 */}
				<div>
					<div className="flex items-center justify-between mb-1">
						<label className="field-label mb-0">
							📸 Foto Produk (opsional, maks 5)
						</label>
						<span className="font-mono text-[9px] text-stone2">
							{dna.productImages.length}/5
						</span>
					</div>
					<div className="font-mono text-[9px] text-stone2/70 mb-2 leading-relaxed">
						AI akan analisa foto produk untuk deskripsi visual yang konsisten di
						semua scene.
					</div>
					{dna.productImages.length < 5 && (
						<label
							className={`flex items-center gap-3 border-2 border-dashed border-leaf/20 rounded-xl p-3 mb-2 cursor-pointer hover:border-leaf/40 transition-all ${isUploadingImages ? "opacity-60 cursor-wait" : ""}`}
						>
							<input
								type="file"
								className="hidden"
								accept="image/*"
								multiple
								disabled={isUploadingImages}
								onChange={onImageUpload}
							/>
							<span className="text-xl">{isUploadingImages ? "⏳" : "📁"}</span>
							<div className="font-mono text-[9px] text-stone2">
								<span className="text-leaf2">
									{isUploadingImages ? "Menganalisa..." : "Klik untuk upload"}
								</span>{" "}
								foto produk · JPG · PNG · WEBP
							</div>
						</label>
					)}
					{dna.productImages.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{dna.productImages.map((img) => (
								<ImageCard
									key={img.id}
									img={img}
									onRemove={() => onRemoveImage(img.id)}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* ── KATEGORI PRODUK ── */}
			<section className="card">
				<div className="section-label">🏷️ Kategori Produk</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
					{catKeys.map((key) => {
						const cat = PRODUCT_CATEGORIES[key];
						const isActive = dna.productCategory === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() =>
									setDna({
										productCategory: key,
										productSubcategory: cat.subcategories[0]?.value ?? "",
									})
								}
								className={`rounded-xl border px-3 py-2.5 text-left transition-all ${isActive ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"}`}
							>
								<div className="text-lg mb-0.5">{cat.emoji}</div>
								<div
									className={`font-playfair text-xs font-bold leading-tight ${isActive ? "text-leaf2" : "text-cream"}`}
								>
									{cat.label}
								</div>
							</button>
						);
					})}
				</div>
				<div>
					<label className="field-label">Sub-kategori</label>
					<select
						className="forest-select"
						value={dna.productSubcategory}
						onChange={(e) => setDna({ productSubcategory: e.target.value })}
					>
						{(
							PRODUCT_CATEGORIES[dna.productCategory as ProductCategoryKey]
								?.subcategories ?? []
						).map((sub) => (
							<option key={sub.value} value={sub.value}>
								{sub.label}
							</option>
						))}
					</select>
				</div>
				{hasTemplate && (
					<div className="mt-3 rounded-lg bg-amber/8 border border-amber/20 px-3 py-2">
						<div className="font-mono text-[9px] text-amber2">
							🎭 Template gimmick AUTO tersedia untuk kategori{" "}
							<strong>{catMeta?.label}</strong>
						</div>
					</div>
				)}
			</section>

			{/* ── DURASI & SCENE ── */}
			<section className="card">
				<div className="section-label">⏱️ Durasi Film Pendek</div>
				<div className="mb-4">
					<label className="field-label">Total Durasi (min 2 menit)</label>
					<div className="flex flex-wrap gap-2">
						{DRAMA_TOTAL_DURATION_OPTIONS.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => setDna({ totalDurationSec: opt.value })}
								className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] transition-all ${dna.totalDurationSec === opt.value ? "border-leaf bg-moss/30 text-leaf2 font-bold" : "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"}`}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>
				<div className="mb-4">
					<label className="field-label">Durasi Per Scene</label>
					<div className="flex gap-2 flex-wrap">
						{DRAMA_SEC_PER_SCENE_OPTIONS.map((sec) => (
							<button
								key={sec}
								type="button"
								onClick={() => setDna({ secPerScene: sec })}
								className={`flex-1 min-w-13 rounded-lg border py-2 font-mono text-[10px] transition-all ${dna.secPerScene === sec ? "border-amber/60 bg-amber/15 text-amber2 font-bold" : "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"}`}
							>
								{sec}s
							</button>
						))}
					</div>
				</div>
				{/* Act breakdown */}
				<div className="rounded-xl bg-bark/25 border border-leaf/15 p-3">
					<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
						Distribusi Scene Otomatis ({totalScenes} total)
					</div>
					<div className="flex flex-col gap-1.5">
						{acts.map((act) => (
							<div key={act.actNumber} className="flex items-center gap-2">
								<div
									className={`w-2 h-2 rounded-full shrink-0 ${act.actNumber === 1 ? "bg-stone2" : act.actNumber === 2 ? "bg-amber" : "bg-leaf"}`}
								/>
								<div className="font-mono text-[9px] text-cream font-bold w-32 shrink-0">
									Babak {act.actNumber}: {act.actLabel}
								</div>
								<div className="flex-1 h-1 bg-bark/50 rounded-full overflow-hidden">
									<div
										className="h-full bg-leaf/40 rounded-full"
										style={{
											width: `${(act.sceneCount / totalScenes) * 100}%`,
										}}
									/>
								</div>
								<div className="font-mono text-[9px] text-stone2 w-16 text-right">
									{act.sceneCount} scene
								</div>
							</div>
						))}
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full shrink-0 bg-amber2" />
							<div className="font-mono text-[9px] text-cream font-bold w-32 shrink-0">
								Babak 4: CTA
							</div>
							<div className="flex-1 h-1 bg-bark/50 rounded-full overflow-hidden">
								<div
									className="h-full bg-amber/50 rounded-full"
									style={{ width: `${(ctaCount / totalScenes) * 100}%` }}
								/>
							</div>
							<div className="font-mono text-[9px] text-stone2 w-16 text-right">
								{ctaCount} scene
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── MODEL / PEMERAN ── */}
			<section className="card">
				<div className="section-label">👤 Pemeran Utama</div>
				<div className="grid grid-cols-2 gap-2">
					{modelKeys.map((key) => {
						const m = MODEL_GENDER_AGE[key];
						const isActive = dna.modelGenderAge === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setDna({ modelGenderAge: key })}
								className={`rounded-xl border px-3 py-2.5 text-left transition-all ${isActive ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/35"}`}
							>
								<div className="text-xl mb-0.5">{m.emoji}</div>
								<div
									className={`font-playfair text-xs font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
								>
									{m.label}
								</div>
							</button>
						);
					})}
				</div>
				<div className="mt-2 font-mono text-[9px] text-stone2 px-1">
					Penampilan pemeran akan dikunci konsisten di semua {totalScenes} scene
					oleh AI.
				</div>
			</section>

			{/* ── STORYBOARD MODE ── */}
			<section className="card">
				<div className="section-label">🎭 Mode Instruksi Storyboard</div>
				<div className="grid grid-cols-2 gap-2 mb-4">
					{[
						{
							key: "auto" as const,
							label: "AUTO",
							emoji: "⚡",
							desc: "AI generate instruksi gimmick otomatis berdasar kategori & template Thailand",
						},
						{
							key: "manual" as const,
							label: "MANUAL",
							emoji: "✏️",
							desc: "User input instruksi per scene/babak secara manual",
						},
					].map((m) => (
						<button
							key={m.key}
							type="button"
							onClick={() => setDna({ storyboardMode: m.key })}
							className={`rounded-xl border p-4 text-left transition-all ${dna.storyboardMode === m.key ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/40"}`}
						>
							<div className="text-2xl mb-2">{m.emoji}</div>
							<div
								className={`font-playfair text-sm font-bold mb-1 ${dna.storyboardMode === m.key ? "text-leaf2" : "text-cream"}`}
							>
								{m.label}
							</div>
							<div className="font-mono text-[9px] text-stone2 leading-relaxed">
								{m.desc}
							</div>
						</button>
					))}
				</div>

				{/* AUTO mode — tampilkan preview template */}
				{dna.storyboardMode === "auto" && (
					<div className="rounded-xl bg-bark/25 border border-leaf/10 p-3">
						<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
							🎬 Preview Template Gimmick — {catMeta?.label}
						</div>
						{hasTemplate ? (
							<div className="flex flex-col gap-2">
								{[
									[
										"🎭 Babak 1 Setup",
										AUTO_GIMMICK_TEMPLATES[dna.productCategory]?.setupTrope,
									],
									[
										"🌀 Babak 2 Eskalasi",
										AUTO_GIMMICK_TEMPLATES[dna.productCategory]
											?.escalationGimmick,
									],
									[
										"💥 Babak 3 Twist",
										AUTO_GIMMICK_TEMPLATES[dna.productCategory]?.twistEntry,
									],
									[
										"🛒 CTA Gimmick",
										AUTO_GIMMICK_TEMPLATES[dna.productCategory]?.ctaGimmick,
									],
								].map(([label, text]) => (
									<div
										key={label as string}
										className="rounded-lg bg-bark/30 border border-leaf/8 p-2"
									>
										<div className="font-mono text-[8px] text-leaf2 uppercase tracking-wider mb-1">
											{label}
										</div>
										<div className="font-mono text-[9px] text-stone2 leading-relaxed">
											{text}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="font-mono text-[9px] text-stone2">
								Menggunakan template generic. AI akan adapt ke kategori &quot;
								{catMeta?.label}&quot;.
							</div>
						)}
					</div>
				)}

				{/* MANUAL mode — input instruksi per babak */}
				{dna.storyboardMode === "manual" && (
					<div className="flex flex-col gap-3">
						<div className="font-mono text-[9px] text-stone2 leading-relaxed">
							Isi instruksi untuk masing-masing babak. AI akan menggunakan ini
							sebagai panduan utama.
						</div>
						{acts.map((act) => (
							<div
								key={act.actNumber}
								className="rounded-xl border border-leaf/15 bg-bark/20 p-3"
							>
								<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-1">
									Babak {act.actNumber}: {act.actLabel} ({act.sceneCount} scene,{" "}
									{act.startSec}s–{act.endSec}s)
								</div>
								<textarea
									className="forest-input resize-none min-h-20 text-[11px]"
									placeholder={act.autoHint.substring(0, 120) + "..."}
									value={
										dna.manualInstructions.find(
											(m) => m.actNumber === act.actNumber,
										)?.description ?? ""
									}
									onChange={(e) =>
										updateManualInstruction(act.actNumber, {
											actNumber: act.actNumber as 1 | 2 | 3 | 4,
											description: e.target.value,
										})
									}
								/>
							</div>
						))}
					</div>
				)}
			</section>

			{/* ── CTA CONFIG ── */}
			<section className="card">
				<div className="section-label">
					🛒 Konfigurasi CTA ({ctaCount} scene)
				</div>

				<div className="mb-4">
					<label className="field-label">Gaya Gimmick CTA</label>
					<div className="flex flex-col gap-2">
						{DRAMA_CTA_GIMMICK_PRESETS.map((preset) => (
							<button
								key={preset.value}
								type="button"
								onClick={() => updateCta({ ctaGimmick: preset.value })}
								className={`rounded-xl border px-4 py-3 text-left transition-all ${dna.cta.ctaGimmick === preset.value ? "border-amber/60 bg-amber/10" : "border-leaf/15 bg-bark/25 hover:border-leaf/35"}`}
							>
								<div
									className={`font-playfair text-sm font-bold mb-0.5 ${dna.cta.ctaGimmick === preset.value ? "text-amber2" : "text-cream"}`}
								>
									{preset.label}
								</div>
								<div className="font-mono text-[9px] text-stone2 leading-relaxed">
									{preset.desc}
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="mb-3">
					<label className="field-label">
						Tagline / Teks CTA (Bahasa Indonesia)
					</label>
					<textarea
						className="forest-input resize-none min-h-18"
						placeholder="Contoh: [Nama Brand] — Jangan sampai hidupmu lebih dramatis dari sinetron!"
						value={dna.cta.ctaText}
						onChange={(e) =>
							updateCta({ ctaText: e.target.value, ctaCustom: true })
						}
					/>
				</div>
				<div>
					<label className="field-label">Template Cepat</label>
					<div className="flex flex-col gap-1.5">
						{DRAMA_CTA_TEXT_PRESETS.map((text, i) => (
							<button
								key={i}
								type="button"
								onClick={() => updateCta({ ctaText: text, ctaCustom: false })}
								className={`text-left rounded-lg border px-3 py-2 font-mono text-[10px] transition-all leading-relaxed ${dna.cta.ctaText === text && !dna.cta.ctaCustom ? "border-amber/50 bg-amber/12 text-amber2" : "border-leaf/12 bg-bark/20 text-stone2 hover:border-leaf/30 hover:text-cream"}`}
							>
								{text}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* ── AI MODEL ── */}
			<section className="card">
				<div className="section-label">🤖 AI Model</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label className="field-label">Provider</label>
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
				<div className="mt-2 font-mono text-[9px] text-stone2 px-1 leading-relaxed">
					Model dengan context window besar direkomendasikan (Claude
					Sonnet/Opus, GPT-4o) karena output JSON bisa mencapai 6000+ token
					untuk video panjang.
				</div>
			</section>

			{/* ── VISUAL ── */}
			<section className="card">
				<div className="section-label">🎨 Format & Visual</div>
				<div className="grid grid-cols-2 gap-3">
					{[
						{
							value: "9:16",
							label: "9:16 Vertikal",
							emoji: "📱",
							desc: "TikTok · Reels · Shorts",
						},
						{
							value: "16:9",
							label: "16:9 Horizontal",
							emoji: "🖥️",
							desc: "YouTube · Facebook",
						},
					].map((r) => (
						<button
							key={r.value}
							type="button"
							onClick={() =>
								setDna({ aspectRatio: r.value as "9:16" | "16:9" })
							}
							className={`rounded-xl border p-4 text-center transition-all ${dna.aspectRatio === r.value ? "border-leaf bg-moss/25" : "border-leaf/15 bg-bark/25 hover:border-leaf/40"}`}
						>
							<div className="text-3xl mb-2">{r.emoji}</div>
							<div
								className={`font-playfair text-sm font-bold ${dna.aspectRatio === r.value ? "text-leaf2" : "text-cream"}`}
							>
								{r.label}
							</div>
							<div className="font-mono text-[9px] text-stone2 mt-1">
								{r.desc}
							</div>
						</button>
					))}
				</div>
			</section>

			{/* ── ERROR ── */}
			{error && (
				<div
					className="card"
					style={{
						border: "1px solid rgba(239,68,68,0.3)",
						background: "rgba(127,29,29,0.1)",
					}}
				>
					<div className="flex items-start gap-2">
						<span className="text-red-400 shrink-0">⚠</span>
						<div className="font-mono text-[10px] text-red-300/80">{error}</div>
					</div>
				</div>
			)}

			{/* ── GENERATE BUTTON ── */}
			<button
				type="button"
				disabled={isGenerating}
				onClick={onGenerate}
				className="w-full rounded-xl font-bold py-4 px-6 text-sm font-sans transition-all duration-150 flex items-center justify-center gap-2"
				style={{
					background: isGenerating
						? "rgba(212,148,26,0.15)"
						: "linear-gradient(135deg, #d4941a, #e8ab30)",
					border: "none",
					color: isGenerating ? "var(--amber)" : "#1a2e1a",
					boxShadow: isGenerating ? "none" : "0 4px 18px rgba(212,148,26,0.35)",
				}}
			>
				{isGenerating ? (
					<>
						<span className="animate-pulse">⏳</span> AI sedang menulis skenario
						drama ({totalScenes} scene)...
					</>
				) : (
					<>🎬 Generate Full Drama Script — {totalScenes} Scene JSON</>
				)}
			</button>
		</div>
	);
}

// ─── IMAGE CARD ───────────────────────────────────────────────────────────────

function ImageCard({
	img,
	onRemove,
}: {
	img: DramaImageRef;
	onRemove: () => void;
}) {
	return (
		<div
			className="relative group rounded-xl overflow-hidden border border-leaf/25 bg-bark/30"
			style={{ width: 90 }}
		>
			<div style={{ height: 72 }} className="relative">
				<img
					src={img.previewUrl}
					alt={img.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<button
						type="button"
						onClick={onRemove}
						className="w-7 h-7 rounded-full bg-earth/80 text-cream text-sm flex items-center justify-center"
					>
						×
					</button>
				</div>
			</div>
			<div className="px-1.5 py-1">
				<div className="font-mono text-[7px] text-stone2 truncate">
					{img.name}
				</div>
			</div>
		</div>
	);
}
