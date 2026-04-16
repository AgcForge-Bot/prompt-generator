"use client";

import { useEffect, useMemo, useState } from "react";
import ForestBuildPrimitiveCraftForm from "@/components/forms/ForestBuildPrimitiveCraftForm";
import AsmrTimelapseConstructorForm from "@/components/forms/AsmrTimelapseConstructorForm";
import CarMusicVideoClipForm from "@/components/forms/CarMusicVideoClipForm";
import WarMusicVideoClipForm from "@/components/forms/WarMusicVideoClipForm";
import RelaxingMusicVideoForm from "@/components/forms/RelaxingMusicVideoForm";
import ProductPromoVideoForm from "@/components/forms/product-promo-video/ProductPromoVideoForm";

type HomeToolKey =
	| "forest-build-primitive-craft"
	| "asmr-timelapse-constructor"
	| "car-music-video-clip"
	| "war-music-video-clip"
	| "relaxing-music-video-clip"
	| "product-promo-video";

type ToolMeta = {
	key: HomeToolKey;
	label: string;
	title: string;
	description: string;
	badge?: string;
};

function setMetaTitleAndDescription(title: string, description: string) {
	if (typeof document === "undefined") return;
	document.title = title;
	const existing = document.querySelector('meta[name="description"]');
	if (existing) {
		existing.setAttribute("content", description);
		return;
	}
	const meta = document.createElement("meta");
	meta.setAttribute("name", "description");
	meta.setAttribute("content", description);
	document.head.appendChild(meta);

	const link = document.createElement("link");
	link.setAttribute("rel", "icon");
	link.setAttribute("href", "/favicon.ico");
	document.head.appendChild(link);
}

function RadioCard({
	checked,
	label,
	badge,
	onSelect,
}: {
	checked: boolean;
	label: string;
	badge?: string;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`w-full text-left rounded-xl border transition-all px-4 py-3 ${
				checked
					? "border-leaf bg-moss/20"
					: "border-leaf/15 bg-bark/30 hover:border-leaf/40 hover:bg-moss/10"
			}`}
		>
			<div className="flex items-center gap-3">
				<span
					className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
						checked ? "border-leaf bg-leaf/20" : "border-leaf/25"
					}`}
				>
					<span
						className={`w-2 h-2 rounded-full transition-all ${
							checked ? "bg-leaf2" : "bg-transparent"
						}`}
					/>
				</span>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<div className="font-playfair text-base text-cream font-bold truncate">
							{label}
						</div>
						{badge && (
							<span className="flex-shrink-0 font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-amber/20 border border-amber/40 text-amber2 uppercase tracking-wider">
								{badge}
							</span>
						)}
					</div>
					<div className="font-mono text-[10px] text-stone2">
						{checked ? "AKTIF" : "Klik untuk pilih"}
					</div>
				</div>
			</div>
		</button>
	);
}

export default function Home() {
	const tools = useMemo<ToolMeta[]>(
		() => [
			{
				key: "product-promo-video",
				label: "Promo Video Iklan Produk",
				badge: "NEW",
				title: "Product Promo Video — AI Prompt Generator",
				description:
					"Generator prompt video iklan produk dengan AI. Upload foto produk, pilih kategori, gaya video, model, durasi — generate prompt scene-by-scene siap untuk Kling, Runway, Pika, VEO, dan lainnya.",
			},
			{
				key: "forest-build-primitive-craft",
				label: "Forest Build Primitive Craft",
				title: "Forest Build Primitive Craft — AI Prompt Generator",
				description:
					"Generator prompt AI untuk ASMR Survival Build (Forest Build Primitive Craft). Fokus: cinematic documentary realism + scene-by-scene prompt.",
			},
			{
				key: "asmr-timelapse-constructor",
				label: "ASMR timelapse constuctor",
				title: "ASMR Timelapse Constructor — AI Prompt Generator",
				description:
					"Generator prompt untuk ASMR timelapse constructor: DNA lock, timeline 12 scene, tabs konfigurasi, randomizer, generate/copy/export prompt.",
			},
			{
				key: "car-music-video-clip",
				label: "Car Music Video Clip",
				title: "Car Music Video Clip — AI Prompt Generator",
				description:
					"Generator prompt untuk car music video clip: timeline 12 scene, tipe adegan, tabs konfigurasi, randomizer, generate/copy/export prompt.",
			},
			{
				key: "war-music-video-clip",
				label: "War Music Video Clip",
				title: "War Music Video Clip — AI Prompt Generator",
				description:
					"Generator prompt untuk war cinematic × DJ battle zone: timeline 12 scene, tipe adegan, tabs konfigurasi, randomizer, generate/copy/export prompt.",
			},
			{
				key: "relaxing-music-video-clip",
				label: "Relaxing Music Video Clip",
				title: "Relaxing Music Video Clip — AI Prompt Generator",
				description:
					"Generator prompt untuk relaxing nature drone music clip: time-of-day, timeline 12 scene, scene type, tabs konfigurasi, randomizer, generate/copy/export prompt.",
			},
		],
		[],
	);

	const [selected, setSelected] = useState<HomeToolKey>("product-promo-video");

	const activeMeta = tools.find((t) => t.key === selected) ?? tools[0];

	useEffect(() => {
		setMetaTitleAndDescription(activeMeta.title, activeMeta.description);
	}, [activeMeta.title, activeMeta.description]);

	return (
		<main className="z-content min-h-screen">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-12">
				<header className="mb-6 pb-6 border-b border-leaf/20">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<span className="text-leaf text-sm">🧰</span>
							<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
								AI Video Tools
							</span>
						</div>
						<h1 className="font-playfair text-3xl sm:text-4xl font-bold text-cream leading-tight">
							Home
							<span className="text-leaf2"> · </span>
							<span className="text-leaf2 italic">{activeMeta.label}</span>
							{activeMeta.badge && (
								<span className="ml-3 font-mono text-xs px-2 py-0.5 rounded-full bg-amber/20 border border-amber/40 text-amber2 uppercase tracking-wider align-middle">
									{activeMeta.badge}
								</span>
							)}
						</h1>
						<p className="font-mono text-[11px] text-stone2 leading-relaxed max-w-3xl">
							{activeMeta.description}
						</p>
					</div>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
					{/* ── SIDEBAR TOOL SELECTOR ── */}
					<section className="card h-fit">
						<div className="section-label">🎛️ Pilih Tools</div>
						<div className="flex flex-col gap-2">
							{tools.map((t) => (
								<RadioCard
									key={t.key}
									checked={selected === t.key}
									label={t.label}
									badge={t.badge}
									onSelect={() => setSelected(t.key)}
								/>
							))}
						</div>
					</section>

					{/* ── FORM AREA ── */}
					<div>
						{selected === "forest-build-primitive-craft" ? (
							<ForestBuildPrimitiveCraftForm />
						) : selected === "asmr-timelapse-constructor" ? (
							<AsmrTimelapseConstructorForm />
						) : selected === "car-music-video-clip" ? (
							<CarMusicVideoClipForm />
						) : selected === "war-music-video-clip" ? (
							<WarMusicVideoClipForm />
						) : selected === "product-promo-video" ? (
							<ProductPromoVideoForm />
						) : (
							<RelaxingMusicVideoForm />
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
