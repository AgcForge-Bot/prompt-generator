"use client";

import { useState } from "react";
import type { ProjectDNA, SceneConfig, ImageRef, ScenePhaseKey, SceneTypeKey, ProjectDNATab } from './types'
import {
	CAM_ANGLES,
	CAM_MOODS,
	CAM_MOVES,
	CRAFT_ACTIVITIES,
	SOUND_AMBIENTS,
	SOUND_PRIMARIES,
} from "@/components/forms/forest-build/constants";
import { buildScenePrompt } from "./promptBuilder";
import { computePhases } from "./sceneGenerator";
import { downloadJsonFile, jsonBundleFromSceneJsonStrings, jsonStringify } from "@/lib/promptJson";

export default function useForestBuildPromptState({
	currentPhase,
	currentScene,
	dna,
	dnaLocked,
	dnaTab,
	globalImages,
	scenes,
	secPerScene,
	setCurrentPhase,
	setCurrentScene,
	setScenes,
	showToast,
	totalScenes,
	updateScene,
}: {
	currentPhase: ScenePhaseKey;
	currentScene: number;
	dna: ProjectDNA;
	dnaLocked: boolean;
	dnaTab: ProjectDNATab;
	globalImages: ImageRef[];
	scenes: SceneConfig[];
	secPerScene: number;
	setCurrentPhase: (k: ScenePhaseKey) => void;
	setCurrentScene: (id: number) => void;
	setScenes: React.Dispatch<React.SetStateAction<SceneConfig[]>>;
	showToast: (msg: string) => void;
	totalScenes: number;
	updateScene: (id: number, updates: Partial<SceneConfig>) => void;
}) {
	const [promptOutput, setPromptOutput] = useState(
		"🔒 Kunci Project DNA terlebih dahulu, lalu klik ⚡ Generate.",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);

	function generatePromptFor(sceneId: number) {
		if (!dnaLocked) {
			setPromptOutput("🔒 Kunci Project DNA terlebih dahulu!");
			return;
		}
		const sc = scenes.find((s) => s.id === sceneId);
		if (!sc) return;
		const promptObj = buildScenePrompt(
			sc,
			dna,
			globalImages,
			totalScenes,
			secPerScene,
		);
		const prompt = jsonStringify(promptObj);
		setPromptOutput(prompt);
		updateScene(sceneId, { generatedPrompt: prompt });
		showToast(`✓ Prompt Scene ${sceneId} berhasil!`);
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
	}

	function generateAll() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		const prompts = scenes.map((sc) =>
			jsonStringify(buildScenePrompt(sc, dna, globalImages, totalScenes, secPerScene)),
		);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		const updated = scenes.map((sc, i) => ({
			...sc,
			generatedPrompt: prompts[i],
		}));
		setScenes(updated);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${totalScenes} prompt berhasil di-generate!`);
	}

	function copyPrompt() {
		if (!promptOutput.startsWith("🔒")) {
			navigator.clipboard.writeText(promptOutput);
			showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
		}
	}

	function copyAll() {
		if (!allPrompts.length) {
			generateAll();
			return;
		}
		navigator.clipboard.writeText(jsonBundleFromSceneJsonStrings(allPrompts));
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		let prompts = allPrompts;
		if (!prompts.length) {
			prompts = scenes.map((sc) =>
				jsonStringify(
					buildScenePrompt(sc, dna, globalImages, totalScenes, secPerScene),
				),
			);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			const updated = scenes.map((sc, i) => ({
				...sc,
				generatedPrompt: prompts[i],
			}));
			setScenes(updated);
			setPromptOutput(prompts[currentScene - 1] ?? "");
		}
		downloadJsonFile(
			`forest-build-primitive-craft-${Date.now()}.json`,
			jsonBundleFromSceneJsonStrings(prompts),
		);
		showToast("💾 JSON bundle berhasil didownload!");
	}

	function nextScene() {
		if (!dnaLocked) return;
		const next = currentScene < totalScenes ? currentScene + 1 : 1;
		setCurrentScene(next);
		const sc2 = scenes.find((s) => s.id === next);
		if (sc2) setCurrentPhase(sc2.phase);
		generatePromptFor(next);
	}

	function randomCurrentScene() {
		function rnd<T>(arr: T[]): T {
			return arr[Math.floor(Math.random() * arr.length)];
		}
		updateScene(currentScene, {
			camAngle: rnd(CAM_ANGLES),
			camMove: rnd(CAM_MOVES),
			camMood: rnd(CAM_MOODS),
			activity: rnd(CRAFT_ACTIVITIES),
			soundPrimary: rnd(SOUND_PRIMARIES),
			soundAmbient: rnd(SOUND_AMBIENTS),
		});
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function autoInjectEmotions() {
		const interval = Math.floor(totalScenes / 5);
		const emotionTypes: SceneTypeKey[] = [
			"emo-civilian",
			"emo-animal",
			"emo-wonder",
			"emo-rescue",
			"emo-cook",
		];
		setScenes((prev) =>
			prev.map((sc) => {
				if (sc.id % interval === 0 && sc.id < totalScenes) {
					const emoIdx = Math.floor(sc.id / interval) - 1;
					return {
						...sc,
						isEmotional: true,
						sceneType: emotionTypes[emoIdx % emotionTypes.length],
					};
				}
				return sc;
			}),
		);
		showToast(`⭐ Emotional moments di-inject otomatis!`);
	}

	const phases = dnaLocked ? computePhases(totalScenes) : [];
	const currentPhaseScenes = dnaLocked
		? scenes.filter((s) => s.phase === currentPhase)
		: [];
	const sc = dnaLocked
		? (scenes.find((s) => s.id === currentScene) ?? scenes[0])
		: null;
	const generatedCount = scenes.filter((s) => s.generatedPrompt).length;

	return {
		allPrompts,
		autoInjectEmotions,
		copyAll,
		copyPrompt,
		downloadAllJson,
		currentPhaseScenes,
		generateAll,
		generatePrompt,
		generatePromptFor,
		generatedCount,
		nextScene,
		phases,
		promptOutput,
		randomCurrentScene,
		sc,
		setShowAllPrompts,
		showAllPrompts,
	};
}
