"use client";

import type {
	PromoDNA,
	VideoStyleKey,
	ModelGenderAge,
	ProductCategoryKey,
} from "../types";
import {
	PRODUCT_CATEGORIES,
	VIDEO_STYLES,
	MODEL_GENDER_AGE,
} from "../constants";

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────

export function CategorySection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	const catKeys = Object.keys(PRODUCT_CATEGORIES) as ProductCategoryKey[];
	const currentCat = PRODUCT_CATEGORIES[dna.productCategory];

	return (
		<section className="card mb-5">
			<div className="section-label">🏷️ Kategori Produk</div>

			{/* Category grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
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
									isFashionProduct: cat.isFashion,
								})
							}
							className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
								isActive
									? "border-leaf bg-moss/25 shadow-sm"
									: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
							}`}
						>
							<div className="text-lg mb-1">{cat.emoji}</div>
							<div
								className={`font-playfair text-xs font-bold leading-tight ${isActive ? "text-leaf2" : "text-cream"}`}
							>
								{cat.label}
							</div>
						</button>
					);
				})}
			</div>

			{/* Subcategory */}
			<div>
				<label className="field-label">Tipe / Sub-kategori</label>
				<select
					className="forest-select"
					value={dna.productSubcategory}
					onChange={(e) => setDna({ productSubcategory: e.target.value })}
				>
					{currentCat.subcategories.map((sub) => (
						<option key={sub.value} value={sub.value}>
							{sub.label}
						</option>
					))}
				</select>
			</div>

			{dna.isFashionProduct && (
				<div className="mt-3 px-3 py-2 rounded-lg bg-amber/10 border border-amber/20 font-mono text-[9px] text-amber2">
					👗 Produk fashion — model akan mengenakan / memperagakan produk secara
					langsung
				</div>
			)}
		</section>
	);
}

// ─── VIDEO STYLE SECTION ──────────────────────────────────────────────────────

export function VideoStyleSection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	const styleKeys = Object.keys(VIDEO_STYLES) as VideoStyleKey[];

	return (
		<section className="card mb-5">
			<div className="section-label">🎬 Gaya Video Promosi</div>

			<div className="flex flex-col gap-2 mb-4">
				{styleKeys.map((key) => {
					const style = VIDEO_STYLES[key];
					const isActive = dna.videoStyle === key;
					return (
						<button
							key={key}
							type="button"
							onClick={() => {
								const modelCount = key === "multi-model" ? 2 : 1;
								setDna({ videoStyle: key, modelCount });
							}}
							className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
								isActive
									? "border-leaf bg-moss/25"
									: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
							}`}
						>
							<div className="flex items-start gap-3">
								<span className="text-xl">{style.emoji}</span>
								<div className="flex-1">
									<div
										className={`font-playfair text-sm font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
									>
										{style.label}
									</div>
									<div className="font-mono text-[10px] text-stone2 leading-relaxed mt-0.5">
										{style.description}
									</div>
								</div>
								<span
									className={`w-4 h-4 mt-0.5 rounded-full border shrink-0 flex items-center justify-center ${
										isActive ? "border-leaf bg-leaf/20" : "border-leaf/25"
									}`}
								>
									{isActive && (
										<span className="w-2 h-2 rounded-full bg-leaf2" />
									)}
								</span>
							</div>
						</button>
					);
				})}
			</div>

			{/* Problem/Solution Toggle */}
			<div
				className={`rounded-xl border p-4 transition-all ${
					dna.enableProblemSolution
						? "border-amber/40 bg-amber/8"
						: "border-leaf/15 bg-bark/20"
				}`}
			>
				<div className="flex items-center justify-between mb-2">
					<div>
						<div className="font-playfair text-sm font-bold text-cream">
							🎭 Drama Sebelum & Sesudah (Before/After)
						</div>
						<div className="font-mono text-[10px] text-stone2 mt-0.5">
							Tambahkan scene masalah di awal sebelum memperkenalkan produk
							sebagai solusi
						</div>
					</div>
					<button
						type="button"
						onClick={() =>
							setDna({ enableProblemSolution: !dna.enableProblemSolution })
						}
						className={`relative w-12 h-6 rounded-full transition-all ${
							dna.enableProblemSolution
								? "bg-amber/60"
								: "bg-bark/60 border border-leaf/20"
						}`}
					>
						<span
							className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
								dna.enableProblemSolution
									? "left-6 bg-amber2"
									: "left-0.5 bg-stone"
							}`}
						/>
					</button>
				</div>

				{dna.enableProblemSolution && (
					<div className="mt-3 flex flex-col gap-2">
						<div>
							<label className="field-label">Deskripsi Masalah (Before)</label>
							<textarea
								className="forest-input resize-none min-h-15"
								placeholder='Contoh: "Sering susah cari baju yang nyaman dan tetap stylish? Udah coba banyak brand tapi hasilnya mengecewakan?"'
								value={dna.problemDescription}
								onChange={(e) => setDna({ problemDescription: e.target.value })}
							/>
						</div>
						<div>
							<label className="field-label">
								Narasi Solusi / Transisi ke Produk
							</label>
							<input
								className="forest-input"
								placeholder={`Contoh: "Tenang, ada solusinya! Perkenalkan ${dna.productName || "produk terbaru"}..."`}
								value={dna.solutionDescription}
								onChange={(e) =>
									setDna({ solutionDescription: e.target.value })
								}
							/>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

// ─── MODEL SECTION ────────────────────────────────────────────────────────────

export function ModelSection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	const modelKeys = Object.keys(MODEL_GENDER_AGE) as ModelGenderAge[];

	return (
		<section className="card mb-5">
			<div className="section-label">👤 Gender & Usia Model</div>

			<div className="grid grid-cols-2 gap-2">
				{modelKeys.map((key) => {
					const model = MODEL_GENDER_AGE[key];
					const isActive = dna.modelGenderAge === key;
					return (
						<button
							key={key}
							type="button"
							onClick={() => setDna({ modelGenderAge: key })}
							className={`rounded-xl border px-3 py-3 text-left transition-all ${
								isActive
									? "border-leaf bg-moss/25"
									: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
							}`}
						>
							<div className="text-2xl mb-1">{model.emoji}</div>
							<div
								className={`font-playfair text-xs font-bold leading-tight ${isActive ? "text-leaf2" : "text-cream"}`}
							>
								{model.label}
							</div>
							<div className="font-mono text-[9px] text-stone2 mt-1 leading-relaxed">
								{model.voiceDesc.substring(0, 60)}...
							</div>
						</button>
					);
				})}
			</div>

			{dna.videoStyle === "multi-model" && (
				<div className="mt-3 px-3 py-2 rounded-lg bg-moss/15 border border-leaf/20 font-mono text-[9px] text-stone2 leading-relaxed">
					👥 <span className="text-leaf2">Multi Model:</span>{" "}
					{dna.isFashionProduct
						? "Model 1 sebagai pembicara, Model 2 mengenakan / memperagakan produk untuk close-up kamera"
						: "Model 1 sebagai pembicara, Model 2 memegang produk untuk demonstrasi close-up kamera"}
				</div>
			)}
		</section>
	);
}
