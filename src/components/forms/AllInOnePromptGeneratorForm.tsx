"use client";

import useAllInOneGenerator from "./all-in-one-generator/useAllInOneGenerator";
import DnaSection from "./all-in-one-generator/sections/DnaSection";
import SceneConfigSection from "./all-in-one-generator/sections/SceneConfigSection";
import OutputSection, {
	RemotionModal,
} from "./all-in-one-generator/sections/OutputSection";
import { VIDEO_THEMES } from "./all-in-one-generator/constants";

export default function AllInOnePromptGeneratorForm() {
	const gen = useAllInOneGenerator();
	const { dna } = gen;

	const tabs = [
		{ key: "dna" as const, label: "DNA Konfigurasi", emoji: "🧬" },
		{ key: "scenes" as const, label: "Scene Setup", emoji: "🎞️" },
		{ key: "output" as const, label: "Generate & Output", emoji: "⚡" },
	];

	const themeInfo = VIDEO_THEMES[dna.theme];

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				{/* ── HEADER ── */}
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-sm">🎬</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
									All-in-One · AI Video Prompt Generator
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								All-in-One
								<br />
								<em className="text-leaf2 italic">Prompt Generator</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								Full AI auto-generate prompt per scene dengan image reference
								<br />
								Kling · Runway · Pika · Sora · Hailuo · VEO · Grok
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							{[
								["Tema", `${themeInfo.icon} ${themeInfo.label}`],
								["Total Scene", `${dna.totalScenes}`],
								["Durasi", `${dna.totalDurationSec}s`],
								["Per Scene", `${dna.secPerScene}s`],
							].map(([k, v]) => (
								<div
									key={k as string}
									className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap"
								>
									{k}: <span className="text-leaf2 font-bold">{v}</span>
								</div>
							))}
							{dna.dnaLocked && (
								<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/40 bg-leaf/10 text-leaf2">
									🔒 DNA Terkunci
								</div>
							)}
						</div>
					</div>
				</header>

				{/* ── TABS ── */}
				<div className="flex gap-0.5 mb-5 bg-bark/40 rounded-xl p-1">
					{tabs.map((tab) => {
						const isDisabled =
							(tab.key === "scenes" || tab.key === "output") && !dna.dnaLocked;
						return (
							<button
								key={tab.key}
								type="button"
								disabled={isDisabled}
								onClick={() => !isDisabled && gen.setActiveTab(tab.key)}
								className={`flex-1 rounded-lg py-2.5 font-bold text-xs transition-all font-sans flex items-center justify-center gap-1.5 ${
									gen.activeTab === tab.key
										? "bg-moss/50 text-leaf2"
										: isDisabled
											? "text-stone2/30 cursor-not-allowed"
											: "text-stone2 hover:text-cream"
								}`}
							>
								{tab.emoji} {tab.label}
								{tab.key === "output" && gen.generatedCount > 0 && (
									<span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-leaf/20 border border-leaf/20 text-leaf2">
										{gen.generatedCount}/{gen.scenes.length}
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* ── DNA TAB ── */}
				{gen.activeTab === "dna" && (
					<DnaSection
						dna={dna}
						setDna={gen.setDna}
						onLock={gen.lockDNA}
						error={gen.error}
					/>
				)}

				{/* ── SCENES TAB ── */}
				{gen.activeTab === "scenes" && dna.dnaLocked && (
					<SceneConfigSection
						dna={dna}
						scenes={gen.scenes}
						currentScene={gen.currentScene}
						generatedCount={gen.generatedCount}
						progressPct={gen.progressPct}
						isGeneratingAll={gen.isGeneratingAll}
						isGeneratingImages={gen.isGeneratingImages}
						onSelectScene={gen.selectScene}
						onUpdateScene={gen.updateScene}
						onImageUpload={gen.handleSceneImageUpload}
						onRemoveImage={gen.removeSceneImage}
						onGenerateSingle={gen.generateSingle}
						onUnlockDNA={gen.unlockDNA}
					/>
				)}

				{/* ── OUTPUT TAB ── */}
				{gen.activeTab === "output" && dna.dnaLocked && (
					<OutputSection
						dna={dna}
						scenes={gen.scenes}
						currentScene={gen.currentScene}
						promptOutput={gen.promptOutput}
						allPrompts={gen.allPrompts}
						showAllPrompts={gen.showAllPrompts}
						generatedCount={gen.generatedCount}
						progressPct={gen.progressPct}
						isGeneratingAll={gen.isGeneratingAll}
						onSetShowAll={gen.setShowAllPrompts}
						onSelectScene={gen.selectScene}
						onCopyPrompt={gen.copyPrompt}
						onCopyAll={gen.copyAll}
						onDownload={gen.downloadAll}
						onGenerateAll={gen.generateAll}
						onGenerateAllWithVideo={gen.generateAllWithVideo}
					/>
				)}
			</div>

			{/* ── REMOTION MODAL ── */}
			{gen.showRemotionModal && (
				<RemotionModal
					script={gen.remotionScript}
					onClose={() => gen.setShowRemotionModal(false)}
				/>
			)}

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
