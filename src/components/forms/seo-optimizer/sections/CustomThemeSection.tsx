/* eslint-disable @next/next/no-img-element */
"use client";

import type { CustomThemeData, CustomThemeImageRef } from "../types";
import { PLATFORM_OPTIONS, CONTENT_STYLE_OPTIONS } from "../constants";

type Props = {
	data: CustomThemeData;
	isAnalyzingImage: boolean;
	onUpdate: (updates: Partial<CustomThemeData>) => void;
	onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveImage: (id: string) => void;
};

export default function CustomThemeSection({
	data,
	isAnalyzingImage,
	onUpdate,
	onImageUpload,
	onRemoveImage,
}: Props) {
	const remainingSlots = 3 - data.imageRefs.length;

	return (
		<section
			className="card mb-5"
			style={{
				border: "1px solid rgba(212,148,26,0.35)",
				background: "rgba(212,148,26,0.04)",
			}}
		>
			{/* Header */}
			<div className="section-label" style={{ color: "var(--amber2)" }}>
				🎨 Detail Tema Lainnya
			</div>
			<p className="font-mono text-[10px] text-stone2 mb-5 leading-relaxed">
				Isi informasi tema video kustom kamu. Semakin detail, semakin akurat SEO
				content yang dihasilkan AI. Upload gambar referensi (opsional) agar AI
				memahami visual yang kamu bayangkan.
			</p>

			{/* ── FORM FIELDS ── */}
			<div className="flex flex-col gap-4">
				{/* Nama Tema */}
				<div>
					<label className="field-label">
						🏷️ Nama Tema / Judul Konsep <span className="text-amber2">*</span>
					</label>
					<input
						className="forest-input"
						placeholder='Contoh: "Underwater Fishing ASMR", "Street Food Jakarta Night Market", "Cinematic Hiking Indonesia"'
						value={data.themeName}
						onChange={(e) => onUpdate({ themeName: e.target.value })}
					/>
				</div>

				{/* Niche */}
				<div>
					<label className="field-label">🎯 Niche / Genre Konten</label>
					<input
						className="forest-input"
						placeholder='Contoh: "Fishing ASMR", "Street Food Documentary", "Nature Hiking", "Motorcycle Adventure"'
						value={data.themeNiche}
						onChange={(e) => onUpdate({ themeNiche: e.target.value })}
					/>
				</div>

				{/* Platform Target + Content Style (2 kolom) */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label className="field-label">📺 Platform Target</label>
						<select
							className="forest-select"
							value={data.targetPlatform}
							onChange={(e) => onUpdate({ targetPlatform: e.target.value })}
						>
							{PLATFORM_OPTIONS.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="field-label">🎥 Gaya Konten</label>
						<select
							className="forest-select"
							value={data.contentStyle}
							onChange={(e) => onUpdate({ contentStyle: e.target.value })}
						>
							<option value="">— Pilih gaya konten —</option>
							{CONTENT_STYLE_OPTIONS.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Deskripsi Tema & Alur Cerita */}
				<div>
					<label className="field-label">
						📖 Deskripsi Tema & Alur Cerita{" "}
						<span className="text-amber2">*</span>
					</label>
					<div className="font-mono text-[9px] text-stone2/70 mb-1.5 leading-relaxed">
						Jelaskan secara detail: apa isi video, alur cerita/narasi, setting
						lokasi, karakter, mood, dan hal-hal penting lainnya yang harus
						dipahami AI.
					</div>
					<textarea
						className="forest-input resize-none min-h-32.5"
						placeholder={`Contoh:\n"Video tentang memancing ikan di sungai pegunungan Jawa Tengah. Dimulai dari persiapan alat pancing di pagi hari saat kabut masih ada, perjalanan ke lokasi sungai tersembunyi, proses memancing yang tenang dengan suara alam, mendapat ikan besar, dan diakhiri dengan memasak ikan di tepi sungai. Gaya ASMR dengan close-up suara air, suara alam, dan aktivitas memancing yang satisfying. Tidak ada narasi, hanya suara alam dan ambient music."`}
						value={data.videoDescription}
						onChange={(e) => onUpdate({ videoDescription: e.target.value })}
					/>
					<div className="flex justify-end mt-1">
						<span
							className={`font-mono text-[9px] ${data.videoDescription.length < 50 ? "text-amber2" : "text-stone2"}`}
						>
							{data.videoDescription.length} karakter{" "}
							{data.videoDescription.length < 50 && "— minimal 50 karakter"}
						</span>
					</div>
				</div>

				{/* Target Audience */}
				<div>
					<label className="field-label">👥 Target Penonton</label>
					<input
						className="forest-input"
						placeholder='Contoh: "Pecinta alam dan hobi memancing usia 25-45 tahun, suka konten ASMR dan outdoor Indonesia"'
						value={data.targetAudienceCustom}
						onChange={(e) => onUpdate({ targetAudienceCustom: e.target.value })}
					/>
				</div>

				{/* Keyword Hints */}
				<div>
					<label className="field-label">🔑 Keyword Hints (opsional)</label>
					<input
						className="forest-input"
						placeholder='Contoh: "memancing sungai, asmr fishing, peaceful fishing, ikan besar"'
						value={data.keywordHints}
						onChange={(e) => onUpdate({ keywordHints: e.target.value })}
					/>
					<div className="font-mono text-[9px] text-stone2/70 mt-1">
						Keyword spesifik yang ingin diprioritaskan. Pisahkan dengan koma.
					</div>
				</div>

				{/* ── IMAGE REFERENCES ── */}
				<div>
					<div className="flex items-center justify-between mb-1">
						<label className="field-label mb-0">
							🖼️ Gambar Referensi Visual (opsional, maks 3)
						</label>
						<span className="font-mono text-[9px] text-stone2">
							{data.imageRefs.length}/3
						</span>
					</div>
					<div className="font-mono text-[9px] text-stone2/70 mb-3 leading-relaxed">
						Upload 1–3 gambar referensi agar AI memahami visual, mood, dan
						estetika yang kamu inginkan. Bisa berupa foto lokasi, screenshot
						referensi video, mood board, atau gambar inspirasi lainnya.
					</div>

					{/* Upload area */}
					{remainingSlots > 0 && (
						<label
							className={`flex items-center gap-4 border-2 border-dashed rounded-xl p-4 mb-3 transition-all ${
								isAnalyzingImage
									? "border-amber/40 bg-amber/5 cursor-wait"
									: "border-amber/25 cursor-pointer hover:border-amber/50 hover:bg-amber/5"
							}`}
						>
							<input
								type="file"
								className="hidden"
								accept="image/*"
								multiple
								disabled={isAnalyzingImage || remainingSlots <= 0}
								onChange={onImageUpload}
							/>
							<span className="text-3xl">{isAnalyzingImage ? "⏳" : "📁"}</span>
							<div>
								<div className="font-mono text-[10px] font-bold text-amber2">
									{isAnalyzingImage
										? "AI menganalisa gambar..."
										: `Klik untuk upload gambar referensi`}
								</div>
								<div className="font-mono text-[9px] text-stone2">
									JPG · PNG · WEBP · Maks {remainingSlots} gambar lagi
								</div>
							</div>
						</label>
					)}

					{/* Preview images */}
					{data.imageRefs.length > 0 && (
						<div className="flex flex-wrap gap-3">
							{data.imageRefs.map((img, i) => (
								<ImageRefCard
									key={img.id}
									img={img}
									index={i}
									onRemove={() => onRemoveImage(img.id)}
								/>
							))}
						</div>
					)}

					{/* Info jika sudah 3 gambar */}
					{data.imageRefs.length >= 3 && (
						<div className="mt-2 px-3 py-2 rounded-lg bg-leaf/8 border border-leaf/20 font-mono text-[9px] text-leaf2">
							✓ 3 gambar referensi sudah ditambahkan (maksimum tercapai)
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

// ─── IMAGE REF CARD ───────────────────────────────────────────────────────────

function ImageRefCard({
	img,
	index,
	onRemove,
}: {
	img: CustomThemeImageRef;
	index: number;
	onRemove: () => void;
}) {
	return (
		<div
			className="relative group rounded-xl overflow-hidden border border-amber/25 bg-bark/30"
			style={{ width: 120 }}
		>
			{/* Gambar preview */}
			<div className="relative" style={{ height: 90 }}>
				<img
					src={img.previewUrl}
					alt={img.name}
					className="w-full h-full object-cover"
				/>
				{/* Overlay on hover */}
				<div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<button
						type="button"
						onClick={onRemove}
						className="w-8 h-8 rounded-full bg-earth/80 border border-amber/30 text-cream text-sm flex items-center justify-center hover:bg-earth transition-colors"
						title="Hapus gambar"
					>
						×
					</button>
				</div>
				{/* Index badge */}
				<div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber/80 text-forest font-mono text-[9px] font-bold flex items-center justify-center">
					{index + 1}
				</div>
			</div>

			{/* Info */}
			<div className="px-2 py-1.5">
				<div className="font-mono text-[8px] text-stone2 truncate">
					{img.name}
				</div>
				{img.aiDescription && (
					<div
						className="font-mono text-[8px] text-leaf/70 leading-tight mt-0.5 line-clamp-2"
						title={img.aiDescription}
					>
						{img.aiDescription.substring(0, 60)}...
					</div>
				)}
			</div>
		</div>
	);
}
