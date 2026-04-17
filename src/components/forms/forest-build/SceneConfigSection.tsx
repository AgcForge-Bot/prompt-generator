"use client";

import type { ScenePhaseKey, SceneConfig } from "./types";
import PhaseNavigationSection from "@/components/forms/forest-build/PhaseNavigationSection";
import SceneEditorSection from "@/components/forms/forest-build/SceneEditorSection";

export default function SceneConfigSection({
	dnaLocked,
	sc,
	scenes,
	phases,
	currentPhase,
	setCurrentPhase,
	currentPhaseScenes,
	currentScene,
	setCurrentScene,
	secPerScene,
	totalScenes,
	activeTab,
	setActiveTab,
	generatedCount,
	updateScene,
	generatePromptFor,
	onGeneratePrompt,
	onGenerateAll,
	onRandomScene,
	onAutoInjectEmotions,
	onNextScene,
}: {
	dnaLocked: boolean;
	sc: SceneConfig | null;
	scenes: SceneConfig[];
	phases: { key: ScenePhaseKey; count: number }[];
	currentPhase: ScenePhaseKey;
	setCurrentPhase: (key: ScenePhaseKey) => void;
	currentPhaseScenes: SceneConfig[];
	currentScene: number;
	setCurrentScene: (id: number) => void;
	secPerScene: number;
	totalScenes: number;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	generatedCount: number;
	updateScene: (id: number, updates: Partial<SceneConfig>) => void;
	generatePromptFor: (sceneId: number) => void;
	onGeneratePrompt: () => void;
	onGenerateAll: () => void;
	onRandomScene: () => void;
	onAutoInjectEmotions: () => void;
	onNextScene: () => void;
}) {
	function selectScene(id: number) {
		if (!dnaLocked) return;
		setCurrentScene(id);
		const scene = scenes.find((s) => s.id === id);
		if (scene) setCurrentPhase(scene.phase);
		generatePromptFor(id);
	}

	if (!dnaLocked) return null;

	return (
		<div>
			<PhaseNavigationSection
				phases={phases}
				currentPhase={currentPhase}
				setCurrentPhase={setCurrentPhase}
				scenes={scenes}
				currentPhaseScenes={currentPhaseScenes}
				currentScene={currentScene}
				onSelectScene={selectScene}
				totalScenes={totalScenes}
				generatedCount={generatedCount}
			/>
			{sc && (
				<SceneEditorSection
					sc={sc}
					currentScene={currentScene}
					secPerScene={secPerScene}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					updateScene={updateScene}
					onGeneratePrompt={onGeneratePrompt}
					onGenerateAll={onGenerateAll}
					onRandomScene={onRandomScene}
					onAutoInjectEmotions={onAutoInjectEmotions}
					onNextScene={onNextScene}
				/>
			)}
		</div>
	);
}
