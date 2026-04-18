"use client";

// ─── GENERATE CONFIG ──────────────────────────────────────────────────────────

type GenerateConfigProps = {
	customKeyword: string;
	targetAudience: string;
	videoStyle: string;
	isGenerating: boolean;
	onCustomKeyword: (v: string) => void;
	onTargetAudience: (v: string) => void;
	onVideoStyle: (v: string) => void;
	onGenerate: () => void;
};

export function GenerateConfigSection({
	customKeyword,
	targetAudience,
	videoStyle,
	isGenerating,
	onCustomKeyword,
	onTargetAudience,
	onVideoStyle,
	onGenerate,
}: GenerateConfigProps) {
	return (
		<section className="card mb-5">
			<div className="section-label">⚙️ Konfigurasi Generate</div>

			<div className="flex flex-col gap-3 mb-4">
				<div>
					<label className="field-label">🔑 Keyword Tambahan (opsional)</label>
					<input
						className="forest-input"
						placeholder='Contoh: "mud house build 2025", "no tool primitive hut"'
						value={customKeyword}
						onChange={(e) => onCustomKeyword(e.target.value)}
					/>
					<div className="font-mono text-[9px] text-stone2 mt-1">
						Keyword spesifik yang ingin diprioritaskan di judul dan deskripsi
					</div>
				</div>
				<div>
					<label className="field-label">
						👥 Target Audience Spesifik (opsional)
					</label>
					<input
						className="forest-input"
						placeholder='Contoh: "penonton Indonesia yang suka ASMR dan nature video"'
						value={targetAudience}
						onChange={(e) => onTargetAudience(e.target.value)}
					/>
				</div>
				<div>
					<label className="field-label">
						🎥 Gaya / Angle Video (opsional)
					</label>
					<input
						className="forest-input"
						placeholder='Contoh: "timelapse 10 menit", "short-form 60 detik", "cinematic documentary"'
						value={videoStyle}
						onChange={(e) => onVideoStyle(e.target.value)}
					/>
				</div>
			</div>

			{/* Info output yang akan dihasilkan */}
			<div className="rounded-xl bg-bark/25 border border-leaf/10 p-3 mb-4">
				<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
					📋 Yang Akan Dihasilkan
				</div>
				<div className="grid grid-cols-2 gap-1.5">
					{[
						["🏆", "5 Variasi Judul", "dengan SEO score & search volume"],
						["📝", "Deskripsi Full SEO", "hook + body + hashtag trending"],
						["🏷️", "30 Tags", "broad + niche + long-tail"],
						["🖼️", "Thumbnail Prompt", "siap generate di AI image gen"],
						["🎬", "Storyboard Inti", "1 prompt overview keseluruhan video"],
						["🎞️", "3 Scene Prompts", "image reference untuk Grok/VEO"],
					].map(([emoji, label, desc]) => (
						<div key={label} className="flex items-start gap-2">
							<span className="text-base mt-0.5">{emoji}</span>
							<div>
								<div className="font-mono text-[10px] text-cream font-bold">
									{label}
								</div>
								<div className="font-mono text-[9px] text-stone2">{desc}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<button
				type="button"
				disabled={isGenerating}
				onClick={onGenerate}
				className="w-full rounded-xl font-bold py-3 px-6 text-sm font-sans transition-all duration-150 flex items-center justify-center gap-2"
				style={{
					background: isGenerating
						? "rgba(122,182,72,0.15)"
						: "linear-gradient(135deg, #3d5c2e, #5a8a40)",
					border: "none",
					color: isGenerating ? "var(--leaf)" : "#fff",
					boxShadow: isGenerating ? "none" : "0 4px 18px rgba(61,92,46,0.45)",
				}}
			>
				{isGenerating ? (
					<>
						<span className="animate-pulse">⏳</span> AI sedang generate SEO
						content...
					</>
				) : (
					<>✨ Generate SEO Content Sekarang</>
				)}
			</button>
		</section>
	);
}

// ─── ANALYZE SECTION ──────────────────────────────────────────────────────────

type AnalyzeSectionProps = {
	videoUrl: string;
	isAnalyzing: boolean;
	onVideoUrl: (v: string) => void;
	onAnalyze: () => void;
};

export function AnalyzeSection({
	videoUrl,
	isAnalyzing,
	onVideoUrl,
	onAnalyze,
}: AnalyzeSectionProps) {
	const platform =
		videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
			? "YouTube"
			: videoUrl.includes("facebook.com") || videoUrl.includes("fb.watch")
				? "Facebook"
				: null;

	return (
		<section className="card mb-5">
			<div className="section-label">🔍 Analisa SEO Video</div>

			<div className="mb-4">
				<label className="field-label">URL Video YouTube / Facebook</label>
				<div className="flex gap-2">
					<input
						className="forest-input flex-1"
						placeholder="https://www.youtube.com/watch?v=... atau https://fb.watch/..."
						value={videoUrl}
						onChange={(e) => onVideoUrl(e.target.value)}
					/>
					{platform && (
						<span
							className={`flex items-center px-3 font-mono text-[9px] rounded-lg border whitespace-nowrap ${
								platform === "YouTube"
									? "text-red-400 border-red-500/30 bg-red-950/20"
									: "text-blue-400 border-blue-500/30 bg-blue-950/20"
							}`}
						>
							{platform === "YouTube" ? "▶ YT" : "f FB"}
						</span>
					)}
				</div>
				<div className="font-mono text-[9px] text-stone2 mt-1">
					Paste URL video yang sudah diupload untuk dianalisa skor SEO-nya
				</div>
			</div>

			{/* Info yang akan dianalisa */}
			<div className="rounded-xl bg-bark/25 border border-leaf/10 p-3 mb-4">
				<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
					📊 Yang Akan Dianalisa & Diberi Skor
				</div>
				<div className="grid grid-cols-2 gap-1.5">
					{[
						["🏆", "Judul", "panjang, keyword, CTR potential"],
						["🖼️", "Thumbnail", "visual appeal & click worthiness"],
						["📝", "Deskripsi", "keyword density, hook, hashtag"],
						["🏷️", "Tags", "coverage, relevance, volume"],
					].map(([emoji, label, desc]) => (
						<div key={label} className="flex items-start gap-2">
							<span className="text-base mt-0.5">{emoji}</span>
							<div>
								<div className="font-mono text-[10px] text-cream font-bold">
									{label}
								</div>
								<div className="font-mono text-[9px] text-stone2">{desc}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Note */}
			<div className="rounded-lg bg-amber/8 border border-amber/20 px-3 py-2 mb-4">
				<div className="font-mono text-[9px] text-amber2 leading-relaxed">
					⚠ AI akan menganalisa berdasarkan URL dan informasi yang tersedia.
					Untuk analisa yang lebih akurat, pastikan URL bisa diakses publik.
				</div>
			</div>

			<button
				type="button"
				disabled={isAnalyzing || !videoUrl.trim()}
				onClick={onAnalyze}
				className="w-full rounded-xl font-bold py-3 px-6 text-sm font-sans transition-all duration-150 flex items-center justify-center gap-2"
				style={{
					background:
						isAnalyzing || !videoUrl.trim()
							? "rgba(212,148,26,0.15)"
							: "linear-gradient(135deg, #d4941a, #e8ab30)",
					border: "none",
					color: isAnalyzing || !videoUrl.trim() ? "var(--amber)" : "#1a2e1a",
					opacity: !videoUrl.trim() ? 0.5 : 1,
					boxShadow:
						isAnalyzing || !videoUrl.trim()
							? "none"
							: "0 4px 18px rgba(212,148,26,0.35)",
				}}
			>
				{isAnalyzing ? (
					<>
						<span className="animate-pulse">⏳</span> AI sedang menganalisa SEO
						video...
					</>
				) : (
					<>🔍 Analisa SEO Sekarang</>
				)}
			</button>
		</section>
	);
}
