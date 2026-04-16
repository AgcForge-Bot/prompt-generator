"use client";

import DurationEngineSection from "@/components/forms/forest-build/DurationEngineSection";
import ExportAllPromptsSection from "@/components/forms/forest-build/ExportAllPromptsSection";
import ImageReferenceSection from "@/components/forms/forest-build/ImageReferenceSection";
import PromptOutputSection from "@/components/forms/forest-build/PromptOutputSection";
import ProjectDnaSection from "@/components/forms/forest-build/ProjectDnaSection";
import SceneConfigSection from "@/components/forms/forest-build/SceneConfigSection";
import TimeOfDaySection from "@/components/forms/forest-build/TimeOfDaySection";
import useForestBuildGenerator from "@/components/forms/forest-build/useForestBuildGenerator";

export default function ForestBuildPrimitiveCraftForm() {
	const {
		activeTab,
		addImageURL,
		allPrompts,
		autoInjectEmotions,
		copyAll,
		copyPrompt,
		currentPhase,
		currentPhaseScenes,
		currentScene,
		dna,
		dnaLocked,
		generateAll,
		generatePrompt,
		generatePromptFor,
		generatedCount,
		handleDurationChange,
		handleImageUpload,
		hasAnyImages,
		imagesForScope,
		imgAnalyzing,
		imgModel,
		imgModelId,
		imgProgress,
		imgScope,
		lockDNA,
		nextScene,
		phases,
		promptOutput,
		randomCurrentScene,
		randomDNA,
		sc,
		scenes,
		secPerScene,
		setActiveTab,
		setCurrentPhase,
		setCurrentScene,
		setDna,
		setGlobalImages,
		setImgModel,
		setImgModelId,
		setImgScope,
		setShowAllPrompts,
		setUrlInput,
		showAllPrompts,
		toast,
		totalMinutes,
		totalScenes,
		updateScene,
		urlInput,
	} = useForestBuildGenerator();

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-leaf text-sm">🌿</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
									ASMR Survival Build · AI Video Prompt Generator
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								Forest Build
								<br />
								<em className="text-leaf2 italic">Primitive Craft</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								ASMR · Story-driven Survival · Relaxing + Emotional
								<br />
								Grok · VEO · Kling · Runway · Pika · Luma
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							{[
								["Total Scene", `${totalScenes}`],
								["Durasi", `${totalMinutes} menit`],
								["Per-scene", `${secPerScene} detik`],
								["Platform", "Grok + VEO"],
							].map(([k, v]) => (
								<div
									key={k}
									className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap"
								>
									{k}: <span className="text-leaf2 font-bold">{v}</span>
								</div>
							))}
						</div>
					</div>
				</header>

				<DurationEngineSection
					totalMinutes={totalMinutes}
					secPerScene={secPerScene}
					totalScenes={totalScenes}
					onDurationChange={handleDurationChange}
				/>

				<ProjectDnaSection
					dna={dna}
					setDna={setDna}
					dnaLocked={dnaLocked}
					totalScenes={totalScenes}
					onLock={lockDNA}
					onRandom={randomDNA}
				/>

				<ImageReferenceSection
					imgScope={imgScope}
					setImgScope={setImgScope}
					imgAnalyzing={imgAnalyzing}
					imgProgress={imgProgress}
					imgModel={imgModel}
					setImgModel={setImgModel}
					imgModelId={imgModelId}
					setImgModelId={setImgModelId}
					urlInput={urlInput}
					setUrlInput={setUrlInput}
					onUpload={handleImageUpload}
					onAddUrl={addImageURL}
					images={imagesForScope}
					hasAnyImages={hasAnyImages}
					onRemoveAt={(i) => {
						if (imgScope === "global") {
							setGlobalImages((g) => g.filter((_, j) => j !== i));
							return;
						}
						updateScene(currentScene, {
							imageRefs: (sc?.imageRefs ?? []).filter((_, j) => j !== i),
						});
					}}
					currentScene={currentScene}
				/>

				<TimeOfDaySection
					sc={sc}
					currentScene={currentScene}
					updateScene={updateScene}
				/>

				<SceneConfigSection
					dnaLocked={dnaLocked}
					sc={sc}
					scenes={scenes}
					phases={phases}
					currentPhase={currentPhase}
					setCurrentPhase={setCurrentPhase}
					currentPhaseScenes={currentPhaseScenes}
					currentScene={currentScene}
					setCurrentScene={setCurrentScene}
					secPerScene={secPerScene}
					totalScenes={totalScenes}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					generatedCount={generatedCount}
					updateScene={updateScene}
					generatePromptFor={generatePromptFor}
					onGeneratePrompt={generatePrompt}
					onGenerateAll={generateAll}
					onRandomScene={randomCurrentScene}
					onAutoInjectEmotions={autoInjectEmotions}
					onNextScene={nextScene}
				/>

				<PromptOutputSection
					promptOutput={promptOutput}
					sc={sc}
					currentScene={currentScene}
					totalScenes={totalScenes}
					onGeneratePrompt={generatePrompt}
					onCopyPrompt={copyPrompt}
					onCopyAll={copyAll}
					onNextScene={nextScene}
				/>

				<ExportAllPromptsSection
					totalScenes={totalScenes}
					onGenerateAll={generateAll}
					onCopyAll={copyAll}
					showAllPrompts={showAllPrompts}
					setShowAllPrompts={setShowAllPrompts}
					allPrompts={allPrompts}
					scenes={scenes}
				/>

				<footer className="text-center pt-6 border-t border-leaf/15 font-mono text-[10px] text-stone leading-loose">
					<p>
						ASMR Survival Build ·{" "}
						<span className="text-leaf2">AI Video Prompt Generator</span>
					</p>
				</footer>
			</div>

			<div
				className={`toast-base bg-moss/95 text-white transition-all ${toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
			>
				{toast.msg}
			</div>
		</div>
	);
}
