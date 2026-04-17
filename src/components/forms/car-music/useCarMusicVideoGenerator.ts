"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { OPTIONS, SCENE_TYPE_LABELS } from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { CarMusicVideoGenerator, SceneConfig, SceneTypeKey, TabKey } from "./types";
import { getDefaultSceneConfig, getDefaultTypes, getSceneTypeLabel, rnd } from "./utils";

export default function useCarMusicVideoGenerator(): CarMusicVideoGenerator {
	const tabs = useMemo(
		() =>
			[
				{ key: "cars", label: "🚗 Mobil" },
				{ key: "dj", label: "🎧 DJ" },
				{ key: "crowd", label: "🙌 Penonton" },
				{ key: "location", label: "📍 Lokasi" },
				{ key: "lighting", label: "💡 Lighting" },
				{ key: "props", label: "🔥 Props" },
				{ key: "camera", label: "🎬 Kamera" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const { toast, show: showToast } = useToast();

	const [activeTab, setActiveTab] = useState<TabKey>("cars");
	const [totalMinutes, setTotalMinutes] = useState(2);
	const [secPerScene, setSecPerScene] = useState(10);
	const [currentScene, setCurrentScene] = useState(1);

	const totalScenes = Math.max(
		2,
		Math.floor((totalMinutes * 60) / Math.max(1, secPerScene)),
	);
	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultTypes(totalScenes),
	);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);
	const [randomGroups, setRandomGroups] = useState<Record<TabKey, boolean>>(() => ({
		cars: true,
		dj: true,
		crowd: true,
		location: true,
		lighting: true,
		props: true,
		camera: true,
	}));

	const [promptOutput, setPromptOutput] = useState(
		"Klik ⚡ Generate Prompt untuk membuat prompt scene ini...",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);

	function getSceneConfig(sceneNum: number): SceneConfig {
		return sceneConfigs[sceneNum] ?? getDefaultSceneConfig();
	}

	function updateSceneConfig(sceneNum: number, updates: Partial<SceneConfig>) {
		setSceneConfigs((prev) => ({
			...prev,
			[sceneNum]: { ...getSceneConfig(sceneNum), ...updates },
		}));
	}

	function generatePromptFor(
		sceneNum: number,
		durOverride?: { totalScenes: number; secPerScene: number },
	) {
		const effectiveTotalScenes = durOverride?.totalScenes ?? totalScenes;
		const effectiveSecPerScene = durOverride?.secPerScene ?? secPerScene;
		const sceneType = sceneTypes[sceneNum] ?? "dj-party";
		const config = getSceneConfig(sceneNum);
		const prompt = buildPrompt({
			sceneNum,
			totalScenes: effectiveTotalScenes,
			secPerScene: effectiveSecPerScene,
			sceneType,
			config,
		});
		setPromptOutput(prompt);
		updateSceneConfig(sceneNum, { generatedPrompt: prompt });
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
		showToast(`✓ Prompt Scene ${currentScene} berhasil!`);
	}

	function nextScene() {
		const next = currentScene < totalScenes ? currentScene + 1 : 1;
		setCurrentScene(next);
		setTimeout(() => generatePromptFor(next), 50);
	}

	function copyPrompt() {
		if (!promptOutput.trim()) return;
		navigator.clipboard.writeText(promptOutput);
		showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
	}

	function generateAll() {
		const prompts: string[] = [];
		const updated: Record<number, SceneConfig> = { ...sceneConfigs };
		for (let s = 1; s <= totalScenes; s++) {
			const sceneType = sceneTypes[s] ?? "dj-party";
			const config = getSceneConfig(s);
			const prompt = buildPrompt({
				sceneNum: s,
				totalScenes,
				secPerScene,
				sceneType,
				config,
			});
			prompts.push(prompt);
			updated[s] = { ...config, generatedPrompt: prompt };
		}
		setSceneConfigs(updated);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${totalScenes} prompt berhasil di-generate!`);
	}

	function copyAll() {
		if (!allPrompts.length) {
			generateAll();
			return;
		}
		navigator.clipboard.writeText(allPrompts.join("\n\n" + "─".repeat(64) + "\n\n"));
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function randomizeCurrentScene() {
		const updates: Partial<SceneConfig> = {};
		if (randomGroups.cars) {
			updates.carHero = rnd(OPTIONS.carHero);
			updates.carSecondary = rnd(OPTIONS.carSecondary);
			updates.carAction = rnd(OPTIONS.carAction);
			updates.carDetail = rnd(OPTIONS.carDetail);
			updates.carColor = rnd(OPTIONS.carColor);
			updates.carCount = rnd(OPTIONS.carCount);
		}
		if (randomGroups.dj) {
			updates.djType = rnd(OPTIONS.djType);
			updates.djSetup = rnd(OPTIONS.djSetup);
			updates.djAction = rnd(OPTIONS.djAction);
			updates.djOutfit = rnd(OPTIONS.djOutfit);
			updates.djFx = rnd(OPTIONS.djFx);
			updates.djSound = rnd(OPTIONS.djSound);
		}
		if (randomGroups.crowd) {
			updates.crowdMix = rnd(OPTIONS.crowdMix);
			updates.crowdEnergy = rnd(OPTIONS.crowdEnergy);
			updates.crowdAction = rnd(OPTIONS.crowdAction);
			updates.crowdFashion = rnd(OPTIONS.crowdFashion);
			updates.crowdDensity = rnd(OPTIONS.crowdDensity);
			updates.crowdMoment = rnd(OPTIONS.crowdMoment);
		}
		if (randomGroups.location) {
			updates.locMain = rnd(OPTIONS.locMain);
			updates.locTime = rnd(OPTIONS.locTime);
			updates.locPalette = rnd(OPTIONS.locPalette);
			updates.locAtmo = rnd(OPTIONS.locAtmo);
		}
		if (randomGroups.lighting) {
			updates.lightMain = rnd(OPTIONS.lightMain);
			updates.lightFx = rnd(OPTIONS.lightFx);
			updates.lightColor = rnd(OPTIONS.lightColor);
			updates.lightShadow = rnd(OPTIONS.lightShadow);
		}
		if (randomGroups.props) {
			updates.propFire = rnd(OPTIONS.propFire);
			updates.propSmoke = rnd(OPTIONS.propSmoke);
			updates.propAnimal = rnd(OPTIONS.propAnimal);
			updates.propDeco = rnd(OPTIONS.propDeco);
			updates.propChar = rnd(OPTIONS.propChar);
			updates.propSfx = rnd(OPTIONS.propSfx);
		}
		if (randomGroups.camera) {
			updates.camAngle = rnd(OPTIONS.camAngle);
			updates.camMove = rnd(OPTIONS.camMove);
			updates.camMood = rnd(OPTIONS.camMood);
			updates.camQuality = rnd(OPTIONS.camQuality);
			updates.camGrade = rnd(OPTIONS.camGrade);
			updates.camLens = rnd(OPTIONS.camLens);
		}
		updateSceneConfig(currentScene, updates);
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function randomSceneType() {
		const keys = Object.keys(SCENE_TYPE_LABELS) as SceneTypeKey[];
		const pick = rnd(keys);
		setSceneTypes((prev) => ({ ...prev, [currentScene]: pick }));
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎴 Tipe adegan: ${SCENE_TYPE_LABELS[pick]}`);
	}

	function randomAllScenes() {
		const keys = Object.keys(SCENE_TYPE_LABELS) as SceneTypeKey[];
		const nextTypes: Record<number, SceneTypeKey> = {};
		const nextConfigs: Record<number, SceneConfig> = {};
		for (let s = 1; s <= totalScenes; s++) {
			nextTypes[s] = Math.random() > 0.4 ? rnd(keys) : keys[s % keys.length];
			const base = getDefaultSceneConfig();
			const updates: Partial<SceneConfig> = {};
			if (randomGroups.cars) {
				updates.carHero = rnd(OPTIONS.carHero);
				updates.carSecondary = rnd(OPTIONS.carSecondary);
				updates.carAction = rnd(OPTIONS.carAction);
				updates.carDetail = rnd(OPTIONS.carDetail);
				updates.carColor = rnd(OPTIONS.carColor);
				updates.carCount = rnd(OPTIONS.carCount);
			}
			if (randomGroups.dj) {
				updates.djType = rnd(OPTIONS.djType);
				updates.djSetup = rnd(OPTIONS.djSetup);
				updates.djAction = rnd(OPTIONS.djAction);
				updates.djOutfit = rnd(OPTIONS.djOutfit);
				updates.djFx = rnd(OPTIONS.djFx);
				updates.djSound = rnd(OPTIONS.djSound);
			}
			if (randomGroups.crowd) {
				updates.crowdMix = rnd(OPTIONS.crowdMix);
				updates.crowdEnergy = rnd(OPTIONS.crowdEnergy);
				updates.crowdAction = rnd(OPTIONS.crowdAction);
				updates.crowdFashion = rnd(OPTIONS.crowdFashion);
				updates.crowdDensity = rnd(OPTIONS.crowdDensity);
				updates.crowdMoment = rnd(OPTIONS.crowdMoment);
			}
			if (randomGroups.location) {
				updates.locMain = rnd(OPTIONS.locMain);
				updates.locTime = rnd(OPTIONS.locTime);
				updates.locPalette = rnd(OPTIONS.locPalette);
				updates.locAtmo = rnd(OPTIONS.locAtmo);
			}
			if (randomGroups.lighting) {
				updates.lightMain = rnd(OPTIONS.lightMain);
				updates.lightFx = rnd(OPTIONS.lightFx);
				updates.lightColor = rnd(OPTIONS.lightColor);
				updates.lightShadow = rnd(OPTIONS.lightShadow);
			}
			if (randomGroups.props) {
				updates.propFire = rnd(OPTIONS.propFire);
				updates.propSmoke = rnd(OPTIONS.propSmoke);
				updates.propAnimal = rnd(OPTIONS.propAnimal);
				updates.propDeco = rnd(OPTIONS.propDeco);
				updates.propChar = rnd(OPTIONS.propChar);
				updates.propSfx = rnd(OPTIONS.propSfx);
			}
			if (randomGroups.camera) {
				updates.camAngle = rnd(OPTIONS.camAngle);
				updates.camMove = rnd(OPTIONS.camMove);
				updates.camMood = rnd(OPTIONS.camMood);
				updates.camQuality = rnd(OPTIONS.camQuality);
				updates.camGrade = rnd(OPTIONS.camGrade);
				updates.camLens = rnd(OPTIONS.camLens);
			}
			nextConfigs[s] = { ...base, ...updates };
		}
		setSceneTypes(nextTypes);
		setSceneConfigs(nextConfigs);
		showToast(`🎰 Semua ${totalScenes} scene di-randomize!`);
		setTimeout(() => generateAll(), 50);
	}

	function onDurationChange(min: number, sec: number) {
		const safeMin = Math.max(1, Math.floor(min));
		const safeSec = Math.max(1, Math.floor(sec));
		const nextTotalScenes = Math.max(
			2,
			Math.floor((safeMin * 60) / Math.max(1, safeSec)),
		);

		setTotalMinutes(safeMin);
		setSecPerScene(safeSec);
		setCurrentScene(1);
		setSceneTypes(getDefaultTypes(nextTotalScenes));
		setAllPrompts([]);
		setShowAllPrompts(false);
		setTimeout(
			() =>
				generatePromptFor(1, {
					totalScenes: nextTotalScenes,
					secPerScene: safeSec,
				}),
			50,
		);
		showToast(
			`⏱ Durasi update: ${safeMin} menit · ${safeSec}s/scene = ${nextTotalScenes} scene`,
		);
	}

	function setCurrentSceneSafe(sceneNum: number) {
		const safe = Math.min(totalScenes, Math.max(1, sceneNum));
		setCurrentScene(safe);
		setTimeout(() => generatePromptFor(safe), 50);
	}

	function setSceneTypeForScene(sceneNum: number, next: SceneTypeKey) {
		setSceneTypes((prev) => ({ ...prev, [sceneNum]: next }));
		setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	const scType = sceneTypes[currentScene] ?? "dj-party";
	const scTypeLabel = getSceneTypeLabel(scType);

	return {
		tabs,
		activeTab,
		setActiveTab,

		totalMinutes,
		secPerScene,
		totalScenes,
		onDurationChange,

		currentScene,
		setCurrentSceneSafe,

		sceneTypes,
		setSceneTypeForScene,
		scType,
		scTypeLabel,

		randomGroups,
		setRandomGroups,

		sceneConfigs,
		getSceneConfig,
		updateSceneConfig,

		promptOutput,
		allPrompts,
		showAllPrompts,
		setShowAllPrompts,

		generatePrompt,
		nextScene,
		copyPrompt,
		copyAll,
		generateAll,

		randomizeCurrentScene,
		randomAllScenes,
		randomSceneType,

		toast,
	};
}
