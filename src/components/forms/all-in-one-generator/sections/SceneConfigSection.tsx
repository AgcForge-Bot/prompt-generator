/* eslint-disable @next/next/no-img-element */
"use client";

import type { SceneConfig, AllInOneDNA, SceneImageRef } from "../types";

type Props = {
	dna: AllInOneDNA;
	scenes: SceneConfig[];
	currentScene: number;
	generatedCount: number;
	progressPct: number;
	isGeneratingAll: boolean;
	isGeneratingImages: boolean;
	onSelectScene: (id: number) => void;
	onUpdateScene: (id: number, updates: Partial<SceneConfig>) => void;
	onImageUpload: (
		sceneId: number,
		e: React.ChangeEvent<HTMLInputElement>,
	) => void;
	onRemoveImage: (sceneId: number, imageId: string) => void;
	onGenerateSingle: (sceneId: number) => void;
	onUnlockDNA: () => void;
};

export default function SceneConfigSection({
	dna,
	scenes,
	currentScene,
	generatedCount,
	progressPct,
	isGeneratingAll,
	isGeneratingImages,
	onSelectScene,
	onUpdateScene,
	onImageUpload,
	onRemoveImage,
	onGenerateSingle,
	onUnlockDNA,
}: Props) {
	const currentSceneData =
		scenes.find((s) => s.id === currentScene) ?? scenes[0];

	return (
		<div className="flex flex-col gap-5">
			{/* ── DNA SUMMARY (locked) ── */}
			<section
				className="card"
				style={{
					border: "1px solid rgba(122,182,72,0.3)",
					background: "rgba(61,92,46,0.08)",
				}}
			>
				<div className="flex items-center justify-between mb-3">
					<div className="section-label mb-0">🔒 DNA Terkunci</div>
					<button
						type="button"
						className="btn-ghost text-[9px] py-1 px-2"
						onClick={onUnlockDNA}
					>
						🔓 Edit DNA
					</button>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{[
						["🎬", "Tema", dna.theme.replace(/-/g, " ")],
						["🎨", "Style", dna.visualStyle],
						[
							"⏱️",
							"Durasi",
							`${dna.totalDurationSec}s / ${dna.secPerScene}s per scene`,
						],
						["🤖", "AI", dna.aiProvider],
					].map(([emoji, label, value]) => (
						<div
							key={label as string}
							className="rounded-lg bg-bark/30 border border-leaf/10 px-3 py-2"
						>
							<div className="font-mono text-[8px] text-stone2 uppercase tracking-wider mb-0.5">
								{emoji} {label}
							</div>
							<div className="font-mono text-[10px] text-cream font-bold truncate">
								{value}
							</div>
						</div>
					))}
				</div>
				{dna.videoTitle && (
					<div className="mt-2 font-playfair text-sm text-leaf2 font-bold truncate">
						&quot;{dna.videoTitle}&quot;
					</div>
				)}
			</section>

			{/* ── SCENE NAVIGATOR ── */}
			<section className="card">
				<div className="section-label">🗺️ Scene Navigator</div>

				{/* Progress */}
				<div className="flex items-center gap-3 mb-4">
					<div className="flex-1 h-2 bg-bark/50 rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{
								width: `${progressPct}%`,
								background:
									progressPct === 100
										? "linear-gradient(90deg, #7ab648, #96d45a)"
										: "linear-gradient(90deg, #3d5c2e, #7ab648, #d4941a)",
							}}
						/>
					</div>
					<span className="font-mono text-[10px] text-stone2 whitespace-nowrap">
						{generatedCount}/{scenes.length} prompt
					</span>
				</div>

				{/* Scene chips */}
				<div className="flex flex-wrap gap-1.5 mb-4 max-h-28 overflow-y-auto p-1">
					{scenes.map((scene) => {
						const isActive = scene.id === currentScene;
						const hasDone = Boolean(scene.generatedPrompt);
						const hasStory = scene.storyboard.trim().length > 0;
						return (
							<button
								key={scene.id}
								type="button"
								onClick={() => onSelectScene(scene.id)}
								className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[9px] transition-all whitespace-nowrap ${
									isActive
										? "border-leaf bg-moss/30 text-leaf2 font-bold"
										: hasDone
											? "border-leaf/35 bg-moss/10 text-leaf"
											: hasStory
												? "border-amber/35 bg-amber/8 text-amber2"
												: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/30 hover:text-cream"
								}`}
							>
								{scene.isGenerating ? (
									<span className="animate-pulse">⏳</span>
								) : hasDone ? (
									"✓"
								) : hasStory ? (
									"📝"
								) : (
									"○"
								)}
								<span>{scene.id}</span>
								{scene.imageRefs.length > 0 && (
									<span className="text-[8px] opacity-70">
										🖼{scene.imageRefs.length}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</section>

			{/* ── SCENE CONFIG EDITOR ── */}
			{currentSceneData && (
				<section className="card">
					<div className="flex items-center justify-between mb-4">
						<div className="section-label mb-0">
							✏️ Scene {currentSceneData.id} / {scenes.length}
						</div>
						{currentSceneData.generatedPrompt && (
							<span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-leaf/20 border border-leaf/30 text-leaf2">
								✓ Generated
							</span>
						)}
					</div>

					{/* Storyboard input */}
					<div className="mb-4">
						<label className="field-label">
							📖 Storyboard Scene {currentSceneData.id}
						</label>
						<div className="font-mono text-[9px] text-stone2/70 mb-1.5">
							Deskripsikan aksi, komposisi, atau momen spesifik untuk scene ini.
							Kosongkan jika ingin AI yang tentukan berdasarkan inti storyboard.
						</div>
						<textarea
							className="forest-input resize-none min-h-22.5"
							placeholder={`Contoh Scene ${currentSceneData.id}: "Tangan model menggali tanah liat basah dengan kayu tajam. Close-up tangan dan tanah. Suara galian dan air menggenang. Sore hari, cahaya golden hour miring masuk dari sisi kiri."`}
							value={currentSceneData.storyboard}
							onChange={(e) =>
								onUpdateScene(currentSceneData.id, {
									storyboard: e.target.value,
								})
							}
						/>
					</div>

					{/* Image upload */}
					<div className="mb-4">
						<div className="flex items-center justify-between mb-1">
							<label className="field-label mb-0">
								🖼️ Gambar Referensi (opsional, maks 3)
							</label>
							<span className="font-mono text-[9px] text-stone2">
								{currentSceneData.imageRefs.length}/3
							</span>
						</div>
						<div className="font-mono text-[9px] text-stone2/70 mb-2 leading-relaxed">
							Upload gambar referensi visual untuk scene ini. AI akan
							menggunakannya sebagai acuan warna, komposisi, dan mood.
						</div>

						{currentSceneData.imageRefs.length < 3 && (
							<label
								className={`flex items-center gap-3 border-2 border-dashed border-leaf/20 rounded-xl p-3 mb-2 cursor-pointer hover:border-leaf/40 hover:bg-leaf/5 transition-all ${isGeneratingImages ? "opacity-60 cursor-wait" : ""}`}
							>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									multiple
									disabled={isGeneratingImages}
									onChange={(e) => onImageUpload(currentSceneData.id, e)}
								/>
								<span className="text-xl">
									{isGeneratingImages ? "⏳" : "📁"}
								</span>
								<div className="font-mono text-[9px] text-stone2">
									<span className="text-leaf2">
										{isGeneratingImages
											? "Menganalisa..."
											: "Klik untuk upload"}
									</span>{" "}
									gambar referensi · JPG · PNG · WEBP
								</div>
							</label>
						)}

						{/* Image preview */}
						{currentSceneData.imageRefs.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{currentSceneData.imageRefs.map((img) => (
									<ImageCard
										key={img.id}
										img={img}
										onRemove={() => onRemoveImage(currentSceneData.id, img.id)}
									/>
								))}
							</div>
						)}
					</div>

					{/* Generate single button */}
					<button
						type="button"
						disabled={isGeneratingAll || currentSceneData.isGenerating}
						onClick={() => onGenerateSingle(currentSceneData.id)}
						className="w-full rounded-xl font-bold py-2.5 px-4 text-sm font-sans transition-all duration-150"
						style={{
							background:
								isGeneratingAll || currentSceneData.isGenerating
									? "rgba(122,182,72,0.15)"
									: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
							border: "none",
							color:
								isGeneratingAll || currentSceneData.isGenerating
									? "var(--leaf)"
									: "#fff",
						}}
					>
						{currentSceneData.isGenerating
							? "⏳ Generating..."
							: `⚡ Generate Prompt Scene ${currentSceneData.id}`}
					</button>
				</section>
			)}

			{/* Nav prev/next */}
			<div className="flex gap-2">
				<button
					type="button"
					className="btn-ghost flex-1 py-2 text-xs"
					disabled={currentScene <= 1}
					onClick={() => onSelectScene(currentScene - 1)}
				>
					← Scene Sebelumnya
				</button>
				<button
					type="button"
					className="btn-ghost flex-1 py-2 text-xs"
					disabled={currentScene >= scenes.length}
					onClick={() => onSelectScene(currentScene + 1)}
				>
					Scene Berikutnya →
				</button>
			</div>
		</div>
	);
}

// ─── IMAGE CARD ───────────────────────────────────────────────────────────────

function ImageCard({
	img,
	onRemove,
}: {
	img: SceneImageRef;
	onRemove: () => void;
}) {
	return (
		<div
			className="relative group rounded-xl overflow-hidden border border-leaf/25 bg-bark/30"
			style={{ width: 100 }}
		>
			<div style={{ height: 76 }} className="relative">
				<img
					src={img.previewUrl}
					alt={img.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<button
						type="button"
						onClick={onRemove}
						className="w-7 h-7 rounded-full bg-earth/80 text-cream text-sm flex items-center justify-center hover:bg-earth"
					>
						×
					</button>
				</div>
			</div>
			<div className="px-1.5 py-1">
				<div className="font-mono text-[7px] text-stone2 truncate">
					{img.name}
				</div>
				{img.aiDescription && (
					<div
						className="font-mono text-[7px] text-leaf/60 leading-tight mt-0.5 line-clamp-2"
						title={img.aiDescription}
					>
						{img.aiDescription.substring(0, 50)}...
					</div>
				)}
			</div>
		</div>
	);
}
