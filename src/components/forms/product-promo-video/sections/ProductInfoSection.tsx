/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import type { ModelType, PromoDNA, ImageRef } from "../types";
import {
	PRODUCT_CATEGORIES,
	getDefaultVisionModelId,
	getVisionProviderLabel,
} from "../constants";

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

const AI_PROVIDERS: { value: ModelType; label: string }[] = [
	{ value: "CLAUDE", label: "Claude (Anthropic)" },
	{ value: "OPENAI", label: "OpenAI GPT-4o" },
	{ value: "GEMINI", label: "Gemini" },
	{ value: "OPENROUTER", label: "OpenRouter" },
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
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
				<div>
					<label className="field-label">🤖 AI Analisa Foto Produk</label>
					<select
						className="forest-select"
						value={imgModel}
						onChange={(e) => {
							const p = e.target.value as ModelType;
							setImgModel(p);
							setImgModelId(getDefaultVisionModelId(p));
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
					<label className="field-label">🧠 Model ID (opsional)</label>
					<input
						className="forest-input"
						placeholder={getDefaultVisionModelId(imgModel)}
						value={imgModelId}
						onChange={(e) => setImgModelId(e.target.value)}
					/>
				</div>
			</div>

			{/* Upload area */}
			{imgAnalyzing && (
				<div className="mb-3 px-3 py-2 rounded-lg bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2 flex items-center gap-2">
					<span className="animate-pulse">⏳</span> {imgProgress}
				</div>
			)}

			<label className="block mb-3 border-2 border-dashed border-leaf/25 rounded-xl p-5 text-center cursor-pointer hover:border-leaf hover:bg-moss/10 transition-all group">
				<input
					type="file"
					className="hidden"
					accept="image/*"
					multiple
					onChange={(e) => onUpload(e)}
					disabled={imgAnalyzing}
				/>
				<div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
					📸
				</div>
				<div className="font-mono text-[11px] text-stone2">
					<span className="text-leaf2 font-bold">Klik atau drag</span> foto
					produk ke sini
					<br />
					JPG · PNG · WEBP · Multiple files OK
					<br />
					<span className="text-leaf text-[9px]">
						{getVisionProviderLabel(imgModel)} otomatis analisa & identifikasi
						produk
					</span>
				</div>
			</label>

			{/* URL input */}
			<div className="flex gap-2 mb-2">
				<input
					className="forest-input flex-1"
					placeholder="https://... (URL langsung ke gambar produk)"
					value={urlInput}
					onChange={(e) => setUrlInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && urlInput) {
							onAddUrl(urlInput, dna.productName, dna.productCategory);
						}
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
					+ URL Gambar
				</button>
			</div>

			{/* Marketplace URL */}
			<div className="flex gap-2 mb-4">
				<input
					className="forest-input flex-1"
					placeholder="URL marketplace (Tokopedia, Shopee, Lazada) — opsional, untuk referensi"
					value={marketplaceUrl}
					onChange={(e) => setMarketplaceUrl(e.target.value)}
				/>
				<span className="flex items-center px-2 font-mono text-[9px] text-stone2 bg-bark/30 border border-leaf/10 rounded-lg whitespace-nowrap">
					🛍️ Marketplace
				</span>
			</div>

			{/* Preview images */}
			{hasImages && (
				<div className="mt-2">
					<div className="font-mono text-[9px] text-stone2 mb-2 uppercase tracking-wider">
						Foto Produk ({productImages.length})
					</div>
					<div className="flex flex-wrap gap-2">
						{productImages.map((img, i) => (
							<div key={img.id} className="relative group">
								<div
									className={`w-20 h-20 rounded-lg border overflow-hidden ${
										img.status === "done"
											? "border-leaf/40"
											: img.status === "failed"
												? "border-amber/40"
												: "border-stone/30"
									}`}
								>
									<img
										src={img.url}
										alt={img.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div
									className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${
										img.status === "done"
											? "bg-leaf text-forest"
											: img.status === "failed"
												? "bg-amber text-forest"
												: "bg-stone"
									}`}
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
										{img.aiDescription.substring(0, 50)}...
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* AI Description result */}
			{dna.productDescription && (
				<div className="mt-3 rounded-xl bg-moss/15 border border-leaf/20 p-3">
					<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-1">
						🔍 Hasil Analisa AI
					</div>
					<div className="font-mono text-[10px] text-stone2 leading-relaxed">
						{dna.productDescription}
					</div>
					<button
						type="button"
						className="mt-2 text-[9px] font-mono text-stone2 hover:text-cream transition-colors"
						onClick={() => setDna({ productDescription: "" })}
					>
						× Hapus deskripsi
					</button>
				</div>
			)}

			{/* Manual description */}
			{!dna.productDescription && (
				<div className="mt-3">
					<label className="field-label">
						Deskripsi Produk (manual, jika tidak upload foto)
					</label>
					<textarea
						className="forest-input min-h-20 resize-none"
						placeholder="Deskripsikan produk Anda: warna, material, ukuran, keunggulan, target pasar..."
						value={dna.productDescription}
						onChange={(e) => setDna({ productDescription: e.target.value })}
					/>
				</div>
			)}
		</section>
	);
}
