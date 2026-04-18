/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import type { ModelType, PromoDNA, ProductSpec, ImageRef } from "../types";
import { PRODUCT_CATEGORIES } from "../constants";
import { redirectToLogin } from "@/lib/auth/redirectToLogin";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
	getProviderLabel,
} from "@/lib/modelProviders";

type Props = {
	dna: PromoDNA;
	setDna: (updates: Partial<PromoDNA>) => void;
	productImages: ImageRef[];
	imgAnalyzing: boolean;
	imgProgress: string;
	imgModel: ModelType;
	setImgModel: (m: ModelType) => void;
	imgModelId: string;
	setImgModelId: (id: string) => void;
	urlInput: string;
	setUrlInput: (v: string) => void;
	marketplaceUrl: string;
	setMarketplaceUrl: (v: string) => void;
	onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onAddUrl: (url: string, name?: string, cat?: string) => void;
	removeImage: (i: number) => void;
};

type SpecFieldKey = keyof Omit<
	ProductSpec,
	"rawMarketplaceText" | "isTransformed"
>;

type SpecField = {
	key: SpecFieldKey;
	label: string;
	emoji: string;
	placeholder: string;
	hint: string;
	rows: number;
};

const SPEC_FIELDS: SpecField[] = [
	{
		key: "visual",
		label: "Visual Produk",
		emoji: "🎨",
		placeholder:
			'Contoh: "Dress katun micro salur warna pastel sage green, siluet loose fit flowy, detail kancing depan dan lengan 3/4, tekstur lembut dan jatuh"',
		hint: "Deskripsi tampilan fisik — warna, material, tekstur, bentuk, detail. Bayangkan mendeskripsikan ke director video.",
		rows: 2,
	},
	{
		key: "usp",
		label: "Keunggulan Utama (USP)",
		emoji: "⭐",
		placeholder:
			'Contoh: "Bahan katun micro super adem anti gerah, cocok untuk bumil & busui, harga terjangkau dengan kualitas premium"',
		hint: "Unique Selling Point — apa yang paling membedakan produk ini dari kompetitor.",
		rows: 2,
	},
	{
		key: "specs",
		label: "Spesifikasi Teknis",
		emoji: "📐",
		placeholder:
			'Contoh: "Lingkar dada 108cm, panjang 132cm, cocok berat badan 55-65kg, bahan katun micro salur, 1kg muat 4-5 pcs"',
		hint: "Ukuran, bahan, dimensi, kapasitas — dalam bahasa yang mudah dipahami (bukan singkatan LD/PJ/BB).",
		rows: 2,
	},
	{
		key: "targetAudience",
		label: "Target Pembeli",
		emoji: "👤",
		placeholder:
			'Contoh: "Wanita usia 20-35 tahun, ibu muda yang ingin tampil stylish tapi tetap nyaman, bekerja atau di rumah, suka fashion casual kekinian"',
		hint: "Siapa yang paling cocok membeli produk ini — usia, gender, gaya hidup, kebutuhan.",
		rows: 2,
	},
	{
		key: "keyNarration",
		label: "Tagline / Narasi Kunci",
		emoji: "🎤",
		placeholder:
			'Contoh: "Tampil cantik seharian, nyaman dari pagi sampai malam!" atau "Adem, stylish, dan ramah di kantong!"',
		hint: "Satu kalimat singkat (max 15 kata) yang diucapkan model — catchy, relatable, memorable seperti tagline iklan.",
		rows: 1,
	},
	{
		key: "problemSolved",
		label: "Masalah yang Diselesaikan (Before)",
		emoji: "😟",
		placeholder:
			'Contoh: "Susah cari baju yang nyaman dipakai seharian tapi tetap keliatan stylish dan tidak terkesan murahan"',
		hint: "Masalah nyata yang dirasakan target audience sebelum menemukan produk ini — untuk scene drama before/after.",
		rows: 2,
	},
];

export default function ProductInfoSection({
	dna,
	setDna,
	productImages,
	imgAnalyzing,
	imgProgress,
	imgModel,
	setImgModel,
	imgModelId,
	setImgModelId,
	urlInput,
	setUrlInput,
	marketplaceUrl,
	setMarketplaceUrl,
	onUpload,
	onAddUrl,
	removeImage,
}: Props) {
	const hasImages = productImages.length > 0;
	const spec = dna.productSpec;

	const [descTab, setDescTab] = useState<"paste" | "structured">("paste");
	const [isTransforming, setIsTransforming] = useState(false);
	const [transformError, setTransformError] = useState("");

	function updateSpec(updates: Partial<ProductSpec>) {
		setDna({ productSpec: { ...spec, ...updates } });
	}

	async function handleTransform() {
		if (!spec.rawMarketplaceText.trim()) {
			setTransformError(
				"Paste deskripsi produk dari marketplace terlebih dahulu.",
			);
			return;
		}
		setIsTransforming(true);
		setTransformError("");
		try {
			const res = await fetch("/api/transform-description", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					rawText: spec.rawMarketplaceText,
					productName: dna.productName,
					productCategory: dna.productCategory,
					model: imgModel,
					modelId: imgModelId || undefined,
				}),
			});
			if (res.status === 401) {
				redirectToLogin();
				return;
			}
			const data = await res.json();
			if (data.error) {
				setTransformError(data.error);
				return;
			}
			if (data.productSpec) {
				setDna({ productSpec: data.productSpec });
				setDescTab("structured");
			}
		} catch {
			setTransformError("Gagal menghubungi server. Cek koneksi dan API key.");
		} finally {
			setIsTransforming(false);
		}
	}

	function handleResetSpec() {
		setDna({
			productSpec: {
				rawMarketplaceText: spec.rawMarketplaceText,
				visual: "",
				usp: "",
				specs: "",
				targetAudience: "",
				keyNarration: "",
				problemSolved: "",
				isTransformed: false,
			},
		});
		setDescTab("paste");
	}

	return (
		<section className="card mb-5">
			<div className="section-label">📦 Informasi Produk</div>

			{/* Nama Produk */}
			<div className="mb-4">
				<label className="field-label">Nama Produk *</label>
				<input
					className="forest-input"
					placeholder='Contoh: "Hijab Cerutti Premium Motif Bunga" atau "Sepatu Sneakers Pria Casual"'
					value={dna.productName}
					onChange={(e) => setDna({ productName: e.target.value })}
				/>
			</div>

			{/* AI Provider */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
				<div>
					<label className="field-label">🤖 AI Analisa & Transform</label>
					<select
						className="forest-select"
						value={imgModel}
						onChange={(e) => {
							const p = e.target.value as ModelType;
							setImgModel(p);
							setImgModelId(getDefaultModelId(p));
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
					<label className="field-label">🧠 Model</label>
					<select
						className="forest-select"
						value={imgModelId || getDefaultModelId(imgModel)}
						onChange={(e) => setImgModelId(e.target.value)}
					>
						{getModelOptions(imgModel).map((m) => (
							<option key={m.value} value={m.value}>
								{m.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Foto Produk */}
			<div className="mb-5">
				<label className="field-label">📸 Foto Produk</label>
				{imgAnalyzing && (
					<div className="mb-2 px-3 py-2 rounded-lg bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2 flex items-center gap-2">
						<span className="animate-pulse">⏳</span> {imgProgress}
					</div>
				)}
				<label className="flex items-start gap-4 border-2 border-dashed border-leaf/25 rounded-xl p-4 cursor-pointer hover:border-leaf hover:bg-moss/10 transition-all group mb-2">
					<input
						type="file"
						className="hidden"
						accept="image/*"
						multiple
						onChange={(e) => onUpload(e)}
						disabled={imgAnalyzing}
					/>
					<span className="text-3xl group-hover:scale-110 transition-transform mt-0.5">
						📁
					</span>
					<div>
						<div className="font-mono text-[11px] text-cream font-bold mb-0.5">
							<span className="text-leaf2">Klik atau drag</span> foto produk ke
							sini
						</div>
						<div className="font-mono text-[9px] text-stone2">
							JPG · PNG · WEBP · Multiple OK
							<br />
							<span className="text-leaf">
								{getProviderLabel(imgModel)} otomatis analisa &
								identifikasi produk dari foto
							</span>
						</div>
					</div>
				</label>
				<div className="flex gap-2 mb-2">
					<input
						className="forest-input flex-1"
						placeholder="https://... (URL langsung ke gambar produk)"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && urlInput)
								onAddUrl(urlInput, dna.productName, dna.productCategory);
						}}
					/>
					<button
						type="button"
						className="btn-ghost whitespace-nowrap"
						disabled={!urlInput || imgAnalyzing}
						onClick={() =>
							onAddUrl(urlInput, dna.productName, dna.productCategory)
						}
					>
						+ URL
					</button>
				</div>
				<div className="flex gap-2">
					<input
						className="forest-input flex-1"
						placeholder="URL marketplace Tokopedia/Shopee/Lazada (opsional, referensi saja)"
						value={marketplaceUrl}
						onChange={(e) => setMarketplaceUrl(e.target.value)}
					/>
					<span className="flex items-center px-3 font-mono text-[9px] text-stone2 bg-bark/30 border border-leaf/10 rounded-lg whitespace-nowrap">
						🛍️
					</span>
				</div>
				{hasImages && (
					<div className="mt-3">
						<div className="font-mono text-[9px] text-stone2 mb-2 uppercase tracking-wider">
							Foto Produk ({productImages.length})
						</div>
						<div className="flex flex-wrap gap-2">
							{productImages.map((img, i) => (
								<div key={img.id} className="relative group">
									<div
										className={`w-20 h-20 rounded-lg border overflow-hidden ${img.status === "done" ? "border-leaf/40" : img.status === "failed" ? "border-amber/40" : "border-stone/30"}`}
									>
										<img
											src={img.url}
											alt={img.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div
										className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${img.status === "done" ? "bg-leaf text-forest" : img.status === "failed" ? "bg-amber text-forest" : "bg-stone"}`}
									>
										{img.status === "done"
											? "✓"
											: img.status === "failed"
												? "!"
												: "…"}
									</div>
									<button
										type="button"
										className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-earth/80 text-cream text-[8px] hidden group-hover:flex items-center justify-center"
										onClick={() => removeImage(i)}
									>
										×
									</button>
									{img.aiDescription && (
										<div className="absolute bottom-0 left-0 right-0 bg-forest/80 text-[7px] text-leaf2 px-1 py-0.5 rounded-b-lg leading-tight opacity-0 group-hover:opacity-100 transition-opacity truncate">
											{img.aiDescription.substring(0, 60)}...
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* ── DESKRIPSI PRODUK ── */}
			<div>
				<div className="flex items-center justify-between mb-1">
					<label className="field-label mb-0">📝 Deskripsi Produk</label>
					{spec.isTransformed && (
						<span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-leaf/20 border border-leaf/30 text-leaf2">
							✓ Sudah di-transform AI
						</span>
					)}
				</div>

				{/* Tab switcher */}
				<div className="flex gap-0.5 bg-bark/40 rounded-xl p-1 mb-3">
					<button
						type="button"
						onClick={() => setDescTab("paste")}
						className={`flex-1 rounded-lg py-2 font-bold text-[11px] transition-all font-sans ${descTab === "paste" ? "bg-moss/50 text-leaf2" : "text-stone2 hover:text-cream"}`}
					>
						📋 Paste dari Marketplace
					</button>
					<button
						type="button"
						onClick={() => setDescTab("structured")}
						className={`flex-1 rounded-lg py-2 font-bold text-[11px] transition-all font-sans ${descTab === "structured" ? "bg-moss/50 text-leaf2" : "text-stone2 hover:text-cream"}`}
					>
						✨ Format Terstruktur
					</button>
				</div>

				{/* TAB: PASTE RAW */}
				{descTab === "paste" && (
					<div>
						<div className="rounded-xl border border-leaf/15 bg-bark/25 p-3 mb-3">
							<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
								💡 Cara Pakai
							</div>
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								<span className="text-cream font-bold">1.</span> Copy-paste
								deskripsi produk langsung dari Tokopedia / Shopee / Lazada /
								TikTok Shop
								<br />
								<span className="text-cream font-bold">2.</span> Klik{" "}
								<span className="text-amber2 font-bold">
									Transform dengan AI
								</span>{" "}
								— format mentah diubah ke format optimal untuk prompt video
								<br />
								<span className="text-cream font-bold">3.</span> Review & edit
								hasil di tab{" "}
								<span className="text-leaf2 font-bold">Format Terstruktur</span>
							</div>
						</div>

						<div className="rounded-xl border border-stone/20 bg-bark/20 p-3 mb-3">
							<div className="font-mono text-[9px] text-stone2 uppercase tracking-wider mb-2">
								📄 Contoh format marketplace yang diterima:
							</div>
							<pre className="font-mono text-[9px] text-stone2/70 leading-relaxed whitespace-pre-wrap">{`Rincian Produk :
• LD         : 108 Cm
• PJ          : 132 Cm
• Maksimal BB : 55 - 65 Kg
• Bahan   : Katun Micro salur

Warna Sesuai Foto, Ketidaksesuaian Akibat Efek Cahaya
Bahan Adem & Nyaman Di Pakai
Tampil Fashionable & Kekinian Dengan Harga Bersahabat
1 Kg Muat : 4 - 5 Pcs
Bumil & Busui Friendly`}</pre>
						</div>

						<textarea
							className="forest-input resize-none min-h-40 mb-3 font-mono text-[11px] leading-relaxed"
							placeholder={`Paste deskripsi produk dari marketplace di sini...\n\nContoh:\nLD: 108cm | PJ: 132cm | BB: 55-65kg\nBahan: Katun Micro Salur\nBumil & Busui Friendly\nTampil fashionable & kekinian...`}
							value={spec.rawMarketplaceText}
							onChange={(e) =>
								updateSpec({ rawMarketplaceText: e.target.value })
							}
						/>

						{transformError && (
							<div className="mb-3 px-3 py-2 rounded-lg bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2">
								⚠ {transformError}
							</div>
						)}

						<button
							type="button"
							disabled={isTransforming || !spec.rawMarketplaceText.trim()}
							onClick={handleTransform}
							className="w-full rounded-xl font-bold py-3 px-4 text-sm transition-all duration-150 font-sans flex items-center justify-center gap-2 mb-3"
							style={{
								background:
									isTransforming || !spec.rawMarketplaceText.trim()
										? "rgba(212,148,26,0.15)"
										: "linear-gradient(135deg, #d4941a, #e8ab30)",
								border: "none",
								color:
									isTransforming || !spec.rawMarketplaceText.trim()
										? "var(--amber)"
										: "#1a2e1a",
								opacity: !spec.rawMarketplaceText.trim() ? 0.5 : 1,
								boxShadow:
									isTransforming || !spec.rawMarketplaceText.trim()
										? "none"
										: "0 4px 18px rgba(212,148,26,0.35)",
							}}
						>
							{isTransforming ? (
								<>
									<span className="animate-pulse">⏳</span> AI sedang
									menganalisa & mentransform deskripsi...
								</>
							) : (
								<>✨ Transform dengan {getProviderLabel(imgModel)}</>
							)}
						</button>

						{spec.isTransformed && (
							<div className="rounded-xl bg-leaf/8 border border-leaf/25 p-3">
								<div className="flex items-center justify-between mb-2">
									<span className="font-mono text-[9px] text-leaf uppercase tracking-wider">
										✓ Hasil Transform Tersimpan
									</span>
									<button
										type="button"
										className="font-mono text-[9px] text-stone2 hover:text-amber2 transition-colors"
										onClick={handleResetSpec}
									>
										× Reset
									</button>
								</div>
								<div className="font-mono text-[10px] text-stone2 leading-relaxed space-y-1">
									{spec.visual && (
										<div>
											<span className="text-leaf2">Visual:</span>{" "}
											{spec.visual.substring(0, 90)}...
										</div>
									)}
									{spec.usp && (
										<div>
											<span className="text-leaf2">USP:</span>{" "}
											{spec.usp.substring(0, 90)}...
										</div>
									)}
									{spec.keyNarration && (
										<div>
											<span className="text-amber2">Tagline:</span> &quot;
											{spec.keyNarration}&quot;
										</div>
									)}
								</div>
								<button
									type="button"
									className="mt-2 font-mono text-[9px] text-leaf2 hover:text-leaf transition-colors"
									onClick={() => setDescTab("structured")}
								>
									→ Lihat & edit detail lengkap
								</button>
							</div>
						)}
					</div>
				)}

				{/* TAB: STRUCTURED */}
				{descTab === "structured" && (
					<div>
						{!spec.isTransformed && (
							<div className="rounded-xl border border-amber/25 bg-amber/8 p-3 mb-4">
								<div className="font-mono text-[10px] text-amber2 leading-relaxed">
									💡 Isi manual di bawah, atau gunakan tab{" "}
									<strong>&quot;Paste dari Marketplace&quot;</strong> untuk
									auto-transform via AI.
								</div>
							</div>
						)}

						<div className="flex flex-col gap-4">
							{SPEC_FIELDS.map((field) => (
								<div key={field.key}>
									<div className="flex items-center gap-2 mb-1">
										<label className="field-label mb-0">
											{field.emoji} {field.label}
										</label>
										{spec.isTransformed && spec[field.key] && (
											<span className="font-mono text-[8px] text-leaf/60">
												✓ dari AI
											</span>
										)}
									</div>
									<div className="font-mono text-[9px] text-stone2/70 mb-1.5 leading-relaxed">
										{field.hint}
									</div>
									{field.rows === 1 ? (
										<input
											className="forest-input"
											placeholder={field.placeholder}
											value={spec[field.key] as string}
											onChange={(e) =>
												updateSpec({ [field.key]: e.target.value })
											}
										/>
									) : (
										<textarea
											className={`forest-input resize-none ${field.rows === 2 ? "min-h-18" : "min-h-25"}`}
											placeholder={field.placeholder}
											value={spec[field.key] as string}
											onChange={(e) =>
												updateSpec({ [field.key]: e.target.value })
											}
										/>
									)}
								</div>
							))}
						</div>

						{!spec.isTransformed &&
							(spec.visual || spec.usp || spec.keyNarration) && (
								<button
									type="button"
									className="mt-4 w-full btn-outline text-sm py-2"
									onClick={() => updateSpec({ isTransformed: true })}
								>
									✓ Tandai selesai & gunakan untuk generate prompt
								</button>
							)}
						{spec.isTransformed && (
							<button
								type="button"
								className="mt-4 font-mono text-[9px] text-stone2 hover:text-amber2 transition-colors"
								onClick={handleResetSpec}
							>
								× Reset dan transform ulang
							</button>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
