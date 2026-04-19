"use client";

import { useState } from "react";
import useProductPromoGenerator from "./product-promo-video/useProductPromoGenerator";
import PromoModeSelector, {
	type PromoVideoMode,
} from "./product-promo-video/PromoModeSelector";
import StandardModeForm from "./product-promo-video/StandarModeForm";
import DramaModeForm from "./product-promo-video/drama-mode/DramaModeForm";

export default function ProductPromoVideoForm() {
	const gen = useProductPromoGenerator();
	const [promoMode, setPromoMode] = useState<PromoVideoMode>("standard");

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-sm">🛍️</span>
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
								Generate prompt video iklan produk siap pakai untuk AI Video
								<br />
								Kling · Runway · Pika · Sora · Hailuo · VEO · Grok
							</p>
						</div>

						{/* Stats badges */}
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
							{gen.dna.productName && (
								<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-amber/30 bg-amber/10 text-amber2 max-w-50 truncate">
									📦 {gen.dna.productName}
								</div>
							)}
						</div>
					</div>
				</header>
				{/* ── MODE SELECTOR — tambahan baru ── */}
				<PromoModeSelector selected={promoMode} onChange={setPromoMode} />

				{/* ── CONDITIONAL: Standard atau Drama Mode ── */}
				{promoMode === "standard" ? <StandardModeForm /> : <DramaModeForm />}
			</div>
			{/* ── TOAST ── */}
			<div
				className={`toast-base transition-all duration-300 ${
					gen.toast.visible
						? "bg-moss/90 text-leaf2 opacity-100 translate-y-0"
						: "opacity-0 translate-y-4 pointer-events-none"
				}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
