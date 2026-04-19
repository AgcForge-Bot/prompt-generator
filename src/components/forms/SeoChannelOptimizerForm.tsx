"use client";

import useSeoOptimizer from "./seo-optimizer/useSeoOptimizer";
import ThemeModelSection from "./seo-optimizer/sections/ThemeModelSection";
import CustomThemeSection from "./seo-optimizer/sections/CustomThemeSection";
import {
	GenerateConfigSection,
	AnalyzeSection,
} from "./seo-optimizer/sections/InputSections";
import GenerateOutputSection from "./seo-optimizer/sections/GenerateOutputSection";
import AnalyzeOutputSection from "./seo-optimizer/sections/AnalyzeOutputSection";
import { getThemeIcon, getThemeLabel } from "./seo-optimizer/constants";

export default function SeoChannelOptimizerForm() {
	const gen = useSeoOptimizer();
	const { state, update } = gen;

	const isCustomTheme = state.theme === "other-video-theme";

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-sm">📊</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
									SEO Channel Optimizer · AI Powered
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								SEO & Channel
								<br />
								<em className="text-leaf2 italic">Optimizer</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								Auto generate judul, deskripsi, tags & storyboard full SEO
								<br />
								Analisa skor SEO video YouTube & Facebook seperti VidIQ
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							<div
								className={`font-mono text-[10px] px-3 py-1 rounded-full border whitespace-nowrap ${
									state.mode === "generate"
										? "border-leaf/20 bg-moss/20 text-leaf2"
										: "border-amber/30 bg-amber/10 text-amber2"
								}`}
							>
								{state.mode === "generate"
									? "✨ Mode Generate"
									: "🔍 Mode Analisa"}
							</div>
							<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
								{getThemeIcon(state.theme)}{" "}
								{getThemeLabel(state.theme, state.customTheme.themeName)}
							</div>
							<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
								🤖 {state.aiModel}
							</div>
						</div>
					</div>
				</header>

				{/* ── TEMA + MODE + MODEL ── */}
				<ThemeModelSection
					mode={state.mode}
					theme={state.theme}
					aiModel={state.aiModel}
					aiModelId={state.aiModelId}
					language={state.language}
					customThemeName={state.customTheme.themeName}
					onMode={gen.setMode}
					onTheme={gen.setTheme}
					onModel={gen.setModel}
					onModelId={gen.setModelId}
					onLanguage={(l) => update({ language: l })}
				/>

				{/* ── CUSTOM THEME FIELDS (muncul hanya jika other-video-theme) ── */}
				{isCustomTheme && (
					<CustomThemeSection
						data={state.customTheme}
						isAnalyzingImage={state.isAnalyzingImage}
						onUpdate={gen.updateCustomTheme}
						onImageUpload={gen.handleCustomImageUpload}
						onRemoveImage={gen.removeCustomImage}
					/>
				)}

				{/* ── ERROR ── */}
				{state.error && (
					<div
						className="card mb-5"
						style={{
							border: "1px solid rgba(239,68,68,0.3)",
							background: "rgba(127,29,29,0.1)",
						}}
					>
						<div className="flex items-start gap-2">
							<span className="text-red-400 text-lg shrink-0">⚠</span>
							<div>
								<div className="font-mono text-[10px] text-red-400 font-bold mb-1">
									Error
								</div>
								<div className="font-mono text-[10px] text-red-300/80 leading-relaxed">
									{state.error}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* ── GENERATE MODE ── */}
				{state.mode === "generate" && (
					<>
						<GenerateConfigSection
							customKeyword={state.customKeyword}
							targetAudience={state.targetAudience}
							videoStyle={state.videoStyle}
							totalDurationSec={state.totalDurationSec}
							secPerScene={state.secPerScene}
							isGenerating={state.isGenerating}
							isCustomTheme={isCustomTheme}
							hasCustomImages={state.customTheme.imageRefs.length > 0}
							onCustomKeyword={(v) => update({ customKeyword: v })}
							onTargetAudience={(v) => update({ targetAudience: v })}
							onVideoStyle={(v) => update({ videoStyle: v })}
							onDurationChange={gen.setDuration}
							onGenerate={gen.handleGenerate}
						/>

						{state.generateOutput && (
							<GenerateOutputSection
								output={state.generateOutput}
								activeTab={state.activeOutputTab}
								onTabChange={(t) => update({ activeOutputTab: t })}
								onCopyTitle={gen.copyTitle}
								onCopyDescription={gen.copyDescription}
								onCopyTags={gen.copyTags}
								onCopyThumbnail={gen.copyThumbnailPrompt}
								onCopyStoryboardCore={gen.copyStoryboardCore}
								onCopyStoryboardScene={gen.copyStoryboardScene}
								onCopyAll={gen.copyAllOutput}
								onDownload={gen.downloadOutput}
							/>
						)}
					</>
				)}

				{/* ── ANALYZE MODE ── */}
				{state.mode === "analyze" && (
					<>
						<AnalyzeSection
							videoUrl={state.videoUrl}
							isAnalyzing={state.isAnalyzing}
							onVideoUrl={(v) => update({ videoUrl: v })}
							onAnalyze={gen.handleAnalyze}
						/>

						{state.analyzeOutput && (
							<AnalyzeOutputSection
								output={state.analyzeOutput}
								onApplyToGenerate={gen.applyAnalyzeToGenerate}
								onCopyRecommendedTitle={gen.copyAnalyzeTitle}
								onCopyRecommendedDescription={gen.copyAnalyzeDescription}
								onCopyRecommendedTags={gen.copyAnalyzeTags}
								onCopyRecommendedThumbnailPrompt={gen.copyAnalyzeThumbnailPrompt}
							/>
						)}
					</>
				)}
			</div>

			{/* ── TOAST ── */}
			<div
				className={`toast-base transition-all duration-300 ${
					gen.toast.show
						? "bg-moss/90 text-leaf2 opacity-100 translate-y-0"
						: "opacity-0 translate-y-4 pointer-events-none"
				}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
