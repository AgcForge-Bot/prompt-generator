"use client";

import type { AnalyzeOutput, ScoreItem } from "../types";
import { getGradeColor, getScoreBarColor } from "../constants";

type Props = {
	output: AnalyzeOutput;
};

function ScoreCard({
	label,
	emoji,
	item,
	extra,
}: {
	label: string;
	emoji: string;
	item: ScoreItem;
	extra?: React.ReactNode;
}) {
	const gradeClass = getGradeColor(item.grade);

	return (
		<div className="rounded-xl border border-leaf/15 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 bg-bark/40 border-b border-leaf/10">
				<div className="flex items-center gap-2">
					<span className="text-lg">{emoji}</span>
					<span className="font-playfair text-sm font-bold text-cream">
						{label}
					</span>
				</div>
				<div
					className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold font-mono text-sm ${gradeClass}`}
				>
					{item.grade}
					<span className="text-[10px] opacity-70">({item.score}/100)</span>
				</div>
			</div>

			<div className="p-4">
				{/* Score bar */}
				<div className="flex items-center gap-2 mb-4">
					<div className="flex-1 h-2 bg-bark/50 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full bg-linear-to-r ${getScoreBarColor(item.score)} transition-all duration-700`}
							style={{ width: `${item.score}%` }}
						/>
					</div>
					<span className="font-mono text-[11px] font-bold text-cream">
						{item.score}/100
					</span>
				</div>

				{/* Extra info (detected content) */}
				{extra}

				{/* Strengths */}
				{item.strengths.length > 0 && (
					<div className="mb-3">
						<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-1.5">
							✓ Kelebihan
						</div>
						<ul className="flex flex-col gap-1">
							{item.strengths.map((s, i) => (
								<li
									key={i}
									className="font-mono text-[10px] text-stone2 flex items-start gap-2"
								>
									<span className="text-leaf mt-0.5 shrink-0">•</span>
									{s}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Issues */}
				{item.issues.length > 0 && (
					<div className="mb-3">
						<div className="font-mono text-[9px] text-amber2 uppercase tracking-wider mb-1.5">
							⚠ Masalah
						</div>
						<ul className="flex flex-col gap-1">
							{item.issues.map((issue, i) => (
								<li
									key={i}
									className="font-mono text-[10px] text-stone2 flex items-start gap-2"
								>
									<span className="text-amber mt-0.5 shrink-0">•</span>
									{issue}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Suggestions */}
				{item.suggestions.length > 0 && (
					<div>
						<div className="font-mono text-[9px] text-leaf2 uppercase tracking-wider mb-1.5">
							💡 Saran Perbaikan
						</div>
						<ul className="flex flex-col gap-1.5">
							{item.suggestions.map((sug, i) => (
								<li
									key={i}
									className="font-mono text-[10px] text-cream flex items-start gap-2 rounded-lg bg-leaf/5 border border-leaf/10 px-3 py-2"
								>
									<span className="text-leaf2 mt-0.5 shrink-0 font-bold">
										{i + 1}.
									</span>
									{sug}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

function OverallScoreRing({ score, grade }: { score: number; grade: string }) {
	const gradeClass = getGradeColor(grade as "A" | "B" | "C" | "D" | "F");
	const circumference = 2 * Math.PI * 36;
	const strokeDash = (score / 100) * circumference;

	const strokeColor =
		score >= 85
			? "#96d45a"
			: score >= 70
				? "#e8ab30"
				: score >= 55
					? "#c9a87c"
					: "#a0714f";

	return (
		<div className="flex flex-col items-center">
			<div className="relative w-24 h-24">
				<svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
					<circle
						cx="40"
						cy="40"
						r="36"
						fill="none"
						stroke="rgba(45,31,14,0.6)"
						strokeWidth="7"
					/>
					<circle
						cx="40"
						cy="40"
						r="36"
						fill="none"
						stroke={strokeColor}
						strokeWidth="7"
						strokeLinecap="round"
						strokeDasharray={`${strokeDash} ${circumference}`}
						className="transition-all duration-700"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span
						className={`font-mono text-2xl font-bold ${gradeClass.split(" ")[0]}`}
					>
						{grade}
					</span>
					<span className="font-mono text-[10px] text-stone2">{score}/100</span>
				</div>
			</div>
			<div className="font-mono text-[9px] text-stone2 mt-1 uppercase tracking-wider">
				Overall SEO
			</div>
		</div>
	);
}

export default function AnalyzeOutputSection({ output }: Props) {
	return (
		<section className="card mb-5">
			<div className="section-label">📊 Hasil Analisa SEO</div>

			{/* Overall score + meta */}
			<div className="flex items-center gap-6 mb-5 p-4 rounded-xl bg-bark/25 border border-leaf/15">
				<OverallScoreRing
					score={output.overallScore}
					grade={output.overallGrade}
				/>
				<div className="flex-1 min-w-0">
					<div className="font-playfair text-base text-cream font-bold mb-1 truncate">
						{output.url}
					</div>
					<div className="flex flex-wrap gap-1.5 mb-2">
						<span
							className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${
								output.platform === "youtube"
									? "text-red-400 border-red-500/30 bg-red-950/20"
									: "text-blue-400 border-blue-500/30 bg-blue-950/20"
							}`}
						>
							{output.platform === "youtube" ? "▶ YouTube" : "f Facebook"}
						</span>
						<span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-leaf/20 bg-moss/10 text-leaf2">
							🎬 {output.theme}
						</span>
						<span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-stone/20 bg-bark/30 text-stone2">
							🕐 {output.analyzedAt}
						</span>
					</div>

					{/* Mini score overview */}
					<div className="grid grid-cols-2 gap-x-4 gap-y-1">
						{[
							["Judul", output.titleScore.score],
							["Thumbnail", output.thumbnailScore.score],
							["Deskripsi", output.descriptionScore.score],
							["Tags", output.tagsScore.score],
						].map(([label, score]) => (
							<div key={label as string} className="flex items-center gap-2">
								<span className="font-mono text-[9px] text-stone2 w-16">
									{label}
								</span>
								<div className="flex-1 h-1 bg-bark/50 rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full bg-linear-to-r ${getScoreBarColor(score as number)}`}
										style={{ width: `${score}%` }}
									/>
								</div>
								<span className="font-mono text-[9px] text-cream w-6 text-right">
									{score}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Priority fixes */}
			{output.priorityFixes.length > 0 && (
				<div className="rounded-xl bg-amber/8 border border-amber/25 p-4 mb-5">
					<div className="font-mono text-[9px] text-amber2 uppercase tracking-wider mb-2">
						🚨 Perbaikan Prioritas Utama
					</div>
					<ol className="flex flex-col gap-1.5">
						{output.priorityFixes.map((fix, i) => (
							<li
								key={i}
								className="font-mono text-[10px] text-cream flex items-start gap-2"
							>
								<span className="text-amber2 font-bold shrink-0">{i + 1}.</span>
								{fix}
							</li>
						))}
					</ol>
				</div>
			)}

			{/* Score cards per section */}
			<div className="flex flex-col gap-4">
				<ScoreCard
					label="Judul Video"
					emoji="🏆"
					item={output.titleScore}
					extra={
						output.titleScore.detectedTitle && (
							<div className="rounded-lg bg-bark/30 border border-leaf/10 px-3 py-2 mb-3">
								<div className="font-mono text-[9px] text-stone2 mb-1">
									Judul terdeteksi:
								</div>
								<div className="font-playfair text-sm text-cream">
									{output.titleScore.detectedTitle}
								</div>
							</div>
						)
					}
				/>
				<ScoreCard
					label="Thumbnail"
					emoji="🖼️"
					item={output.thumbnailScore}
					extra={
						output.thumbnailScore.thumbnailSuggestion && (
							<div className="rounded-lg bg-bark/30 border border-leaf/10 px-3 py-2 mb-3">
								<div className="font-mono text-[9px] text-stone2 mb-1">
									Thumbnail ideal untuk tema ini:
								</div>
								<div className="font-mono text-[10px] text-cream leading-relaxed">
									{output.thumbnailScore.thumbnailSuggestion}
								</div>
							</div>
						)
					}
				/>
				<ScoreCard
					label="Deskripsi"
					emoji="📝"
					item={output.descriptionScore}
				/>
				<ScoreCard
					label="Tags"
					emoji="🏷️"
					item={output.tagsScore}
					extra={
						output.tagsScore.detectedTags &&
						output.tagsScore.detectedTags.length > 0 && (
							<div className="mb-3">
								<div className="font-mono text-[9px] text-stone2 mb-1.5">
									Tags terdeteksi:
								</div>
								<div className="flex flex-wrap gap-1">
									{output.tagsScore.detectedTags.map((tag) => (
										<span
											key={tag}
											className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bark/40 border border-stone/20 text-stone2"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)
					}
				/>
			</div>
		</section>
	);
}
