"use client";

import type { GenerateOutput, SeoFormState } from "../types";
import { getGradeColor, getScoreBarColor, getVolumeColor } from "../constants";

type Props = {
	output: GenerateOutput;
	activeTab: SeoFormState["activeOutputTab"];
	onTabChange: (t: SeoFormState["activeOutputTab"]) => void;
	onCopyTitle: (i: number) => void;
	onCopyDescription: () => void;
	onCopyTags: () => void;
	onCopyThumbnail: () => void;
	onCopyStoryboardCore: () => void;
	onCopyStoryboardScene: (n: number) => void;
	onCopyAll: () => void;
	onDownload: () => void;
};

const OUTPUT_TABS: {
	key: SeoFormState["activeOutputTab"];
	label: string;
	emoji: string;
}[] = [
	{ key: "titles", label: "Judul", emoji: "🏆" },
	{ key: "description", label: "Deskripsi", emoji: "📝" },
	{ key: "tags", label: "Tags", emoji: "🏷️" },
	{ key: "thumbnail", label: "Thumbnail", emoji: "🖼️" },
	{ key: "storyboard", label: "Storyboard", emoji: "🎬" },
];

function ScoreBar({ score, label }: { score: number; label?: string }) {
	return (
		<div className="flex items-center gap-2">
			{label && (
				<span className="font-mono text-[9px] text-stone2 w-16 shrink-0">
					{label}
				</span>
			)}
			<div className="flex-1 h-1.5 bg-bark/50 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full bg-linear-to-r ${getScoreBarColor(score)} transition-all duration-500`}
					style={{ width: `${score}%` }}
				/>
			</div>
			<span className="font-mono text-[10px] text-cream font-bold w-8 text-right">
				{score}
			</span>
		</div>
	);
}

function GradeBadge({ grade, score }: { grade: string; score: number }) {
	return (
		<div
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold font-mono text-sm ${getGradeColor(grade as "A" | "B" | "C" | "D" | "F")}`}
		>
			<span>{grade}</span>
			<span className="text-[10px] opacity-70">({score}/100)</span>
		</div>
	);
}

function PromptBox({ text, onCopy }: { text: string; onCopy: () => void }) {
	return (
		<div className="relative">
			<div className="prompt-box text-[10.5px] min-h-25">{text}</div>
			<button
				type="button"
				onClick={onCopy}
				className="absolute top-2 right-2 btn-ghost text-[9px] py-1 px-2"
			>
				📋 Copy
			</button>
		</div>
	);
}

export default function GenerateOutputSection({
	output,
	activeTab,
	onTabChange,
	onCopyTitle,
	onCopyDescription,
	onCopyTags,
	onCopyThumbnail,
	onCopyStoryboardCore,
	onCopyStoryboardScene,
	onCopyAll,
	onDownload,
}: Props) {
	return (
		<section className="card mb-5">
			{/* Header output */}
			<div className="flex items-center justify-between mb-4">
				<div className="section-label mb-0">✅ Hasil Generate SEO</div>
				<div className="flex gap-2">
					<button
						type="button"
						className="btn-ghost text-[10px] py-1.5 px-3"
						onClick={onCopyAll}
					>
						📋 Copy Semua
					</button>
					<button
						type="button"
						className="btn-amber text-[10px] py-1.5 px-3"
						onClick={onDownload}
					>
						💾 Download
					</button>
				</div>
			</div>

			{/* Meta info */}
			<div className="flex flex-wrap gap-2 mb-4">
				<span className="font-mono text-[9px] px-2.5 py-1 rounded-full bg-moss/20 border border-leaf/20 text-leaf2">
					🎬 {output.theme}
				</span>
				<span className="font-mono text-[9px] px-2.5 py-1 rounded-full bg-bark/30 border border-stone/20 text-stone2">
					🤖 {output.aiModel}
				</span>
				<span className="font-mono text-[9px] px-2.5 py-1 rounded-full bg-bark/30 border border-stone/20 text-stone2">
					🕐 {output.generatedAt}
				</span>
			</div>

			{/* Tab nav */}
			<div className="flex gap-0.5 bg-bark/40 rounded-xl p-1 mb-5 overflow-x-auto">
				{OUTPUT_TABS.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => onTabChange(tab.key)}
						className={`flex-1 rounded-lg py-2 font-bold text-[10px] transition-all font-sans whitespace-nowrap min-w-17.5 ${
							activeTab === tab.key
								? "bg-moss/50 text-leaf2"
								: "text-stone2 hover:text-cream"
						}`}
					>
						{tab.emoji} {tab.label}
					</button>
				))}
			</div>

			{/* ── TAB: JUDUL ── */}
			{activeTab === "titles" && (
				<div className="flex flex-col gap-3">
					{output.titleVariants.map((variant, i) => {
						const isBest = i === output.bestTitleIndex;
						return (
							<div
								key={i}
								className={`rounded-xl border p-4 transition-all ${
									isBest
										? "border-leaf/50 bg-leaf/5"
										: "border-leaf/15 bg-bark/20"
								}`}
							>
								<div className="flex items-start justify-between gap-3 mb-3">
									<div className="flex items-center gap-2">
										{isBest && (
											<span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-leaf/20 border border-leaf/40 text-leaf2 uppercase tracking-wider">
												★ Terpilih
											</span>
										)}
										<span className="font-mono text-[9px] text-stone2">
											#{i + 1} · {variant.charCount} karakter
										</span>
									</div>
									<button
										type="button"
										onClick={() => onCopyTitle(i)}
										className="btn-ghost text-[9px] py-1 px-2 shrink-0"
									>
										📋 Copy
									</button>
								</div>

								<div className="font-playfair text-base text-cream font-bold leading-snug mb-3">
									{variant.title}
								</div>

								<div className="flex flex-wrap gap-1.5 mb-3">
									<span
										className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${getVolumeColor(variant.searchVolume)}`}
									>
										📊 {variant.searchVolume} Volume
									</span>
									<span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-leaf/25 bg-leaf/8 text-leaf2">
										SEO {variant.seoScore}/100
									</span>
									<span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-amber/25 bg-amber/8 text-amber2">
										CTR {variant.clickbaitScore}/100
									</span>
								</div>

								<div className="space-y-1.5 mb-3">
									<ScoreBar score={variant.seoScore} label="SEO Score" />
									<ScoreBar score={variant.clickbaitScore} label="CTR Score" />
								</div>

								<div className="font-mono text-[9px] text-stone2 leading-relaxed mb-2">
									💡 {variant.reason}
								</div>

								{variant.keywords.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{variant.keywords.map((kw) => (
											<span
												key={kw}
												className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-bark/40 text-stone2 border border-stone/15"
											>
												{kw}
											</span>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			{/* ── TAB: DESKRIPSI ── */}
			{activeTab === "description" && (
				<div>
					<div className="flex items-center justify-between mb-3">
						<div className="flex gap-2">
							{output.descriptionKeywords.slice(0, 4).map((kw) => (
								<span
									key={kw}
									className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-moss/20 border border-leaf/20 text-leaf2"
								>
									{kw}
								</span>
							))}
						</div>
						<span className="font-mono text-[9px] text-stone2">
							{output.descriptionCharCount} karakter
						</span>
					</div>
					<PromptBox text={output.description} onCopy={onCopyDescription} />
				</div>
			)}

			{/* ── TAB: TAGS ── */}
			{activeTab === "tags" && (
				<div>
					<div className="flex items-center justify-between mb-4">
						<div className="flex gap-2">
							<span className="font-mono text-[9px] text-stone2">
								{output.totalTagCount} tags
							</span>
							<span
								className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${getVolumeColor(output.overallTagScore >= 70 ? "High" : output.overallTagScore >= 50 ? "Medium" : "Low")}`}
							>
								Score {output.overallTagScore}/100
							</span>
						</div>
						<button
							type="button"
							className="btn-ghost text-[9px] py-1 px-2"
							onClick={onCopyTags}
						>
							📋 Copy Semua Tags
						</button>
					</div>

					{/* Tags grouped by category */}
					{(["broad", "niche", "long-tail"] as const).map((cat) => {
						const catTags = output.tags.filter((t) => t.category === cat);
						if (!catTags.length) return null;
						const catLabel =
							cat === "broad"
								? "🌐 Broad (Volume Tinggi)"
								: cat === "niche"
									? "🎯 Niche (Relevan)"
									: "🔍 Long-tail (Spesifik)";
						return (
							<div key={cat} className="mb-4">
								<div className="font-mono text-[9px] text-stone2 uppercase tracking-wider mb-2">
									{catLabel}
								</div>
								<div className="flex flex-wrap gap-1.5">
									{catTags.map((tag) => (
										<div
											key={tag.tag}
											className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-[10px] cursor-default ${getVolumeColor(tag.volume)}`}
										>
											<span>{tag.tag}</span>
											<span className="opacity-50 text-[8px]">
												·{tag.relevance}
											</span>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* ── TAB: THUMBNAIL ── */}
			{activeTab === "thumbnail" && (
				<div>
					<div className="font-mono text-[9px] text-stone2 mb-3 leading-relaxed">
						Prompt ini siap digunakan langsung di{" "}
						<span className="text-leaf2">Midjourney</span>,{" "}
						<span className="text-leaf2">Grok</span>, atau{" "}
						<span className="text-leaf2">AI image generator</span> lainnya.
					</div>
					<PromptBox text={output.thumbnailPrompt} onCopy={onCopyThumbnail} />
				</div>
			)}

			{/* ── TAB: STORYBOARD ── */}
			{activeTab === "storyboard" && (
				<div>
					{/* Storyboard inti */}
					<div className="mb-5">
						<div className="flex items-center justify-between mb-2">
							<div className="font-mono text-[9px] text-leaf uppercase tracking-wider">
								🎬 Storyboard Inti — Overview Keseluruhan Video
							</div>
						</div>
						<PromptBox
							text={output.storyboardCore}
							onCopy={onCopyStoryboardCore}
						/>
					</div>

					{/* Scene prompts */}
					<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-3">
						🎞️ Scene Image Prompts — Untuk Grok / VEO Image Reference
					</div>
					<div className="flex flex-col gap-3">
						{output.storyboardScenes.map((scene) => (
							<div
								key={scene.sceneNum}
								className="rounded-xl border border-leaf/15 overflow-hidden"
							>
								<div className="flex items-center justify-between px-4 py-2 bg-bark/40 border-b border-leaf/10">
									<div>
										<span className="font-mono text-[10px] text-leaf2 font-bold">
											Scene {scene.sceneNum}: {scene.title}
										</span>
										<span className="font-mono text-[9px] text-stone2 ml-2">
											{scene.duration}
										</span>
									</div>
									<button
										type="button"
										className="font-mono text-[9px] text-stone2 hover:text-leaf2 transition-colors"
										onClick={() => onCopyStoryboardScene(scene.sceneNum)}
									>
										📋 Copy
									</button>
								</div>
								<div className="px-4 py-2 bg-bark/20 border-b border-leaf/8">
									<div className="font-mono text-[9px] text-stone2">
										{scene.description}
									</div>
								</div>
								<div className="prompt-box text-[10px] max-h-40 rounded-none border-0">
									{scene.imagePrompt}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
