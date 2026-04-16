"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { OPTIONS, RANDOM_GROUP_FIELDS, SCENE_TYPES, TOD_DATA, TOTAL_SCENES } from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { RandomGroupKey, RelaxingMusicVideoGenerator, SceneConfig, SceneTypeKey, TabKey, TodKey } from "./types";
import { getDefaultSceneConfig, getDefaultTypes, getSceneTypeLabel, rnd } from "./utils";

export default function useRelaxingMusicVideoGenerator(): RelaxingMusicVideoGenerator {
	const tabs = useMemo(
		() =>
			[
				{ key: "nature", label: "🏔️ Nature View" },
				{ key: "location", label: "🇪🇺 Location" },
				{ key: "animals", label: "🦋 Animals" },
				{ key: "visuals", label: "🌱 Visuals" },
				{ key: "lighting", label: "☀️ Lighting" },
				{ key: "drone", label: "🚁 Drone & Camera" },
				{ key: "elements", label: "✨ Elements" },
				{ key: "style", label: "🎨 Style & Mood" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const { toast, show: showToast } = useToast();

	const [activeTab, setActiveTab] = useState<TabKey>("nature");
	const [timeOfDay, setTimeOfDay] = useState<TodKey>("morning");
	const [currentScene, setCurrentScene] = useState(1);
	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultTypes(),
	);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);
	const [randomGroups, setRandomGroups] = useState<Record<RandomGroupKey, boolean>>(
		() => ({
			nature: true,
			location: true,
			animals: true,
			visuals: true,
			lighting: true,
			drone: true,
			elements: true,
			style: true,
		}),
	);

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

	function generatePromptFor(sceneNum: number) {
		const sceneType = sceneTypes[sceneNum] ?? "mountain";
		const config = getSceneConfig(sceneNum);
		const prompt = buildPrompt({ sceneNum, sceneType, timeOfDay, config });
		setPromptOutput(prompt);
		updateSceneConfig(sceneNum, { generatedPrompt: prompt });
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
		showToast(`✓ Prompt Scene ${currentScene} berhasil!`);
	}

	function nextScene() {
		const next = currentScene < TOTAL_SCENES ? currentScene + 1 : 1;
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
		for (let s = 1; s <= TOTAL_SCENES; s++) {
			const sceneType = sceneTypes[s] ?? "mountain";
			const config = getSceneConfig(s);
			const prompt = buildPrompt({ sceneNum: s, sceneType, timeOfDay, config });
			prompts.push(prompt);
			updated[s] = { ...config, generatedPrompt: prompt };
		}
		setSceneConfigs(updated);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${TOTAL_SCENES} prompt berhasil di-generate!`);
	}

	function copyAll() {
		if (!allPrompts.length) {
			generateAll();
			return;
		}
		navigator.clipboard.writeText(allPrompts.join("\n\n" + "─".repeat(64) + "\n\n"));
		showToast(`📋 Semua ${TOTAL_SCENES} prompt tersalin!`);
	}

	function randomizeCurrentScene() {
		const updates: Partial<SceneConfig> = {};

		if (randomGroups.nature) {
			updates.natSpot = rnd(OPTIONS.natSpot);
			updates.natWater = rnd(OPTIONS.natWater);
			updates.natVegetation = rnd(OPTIONS.natVegetation);
			updates.natTerrain = rnd(OPTIONS.natTerrain);
		}
		if (randomGroups.location) {
			updates.locCountry = rnd(OPTIONS.locCountry);
			updates.locSetting = rnd(OPTIONS.locSetting);
			updates.locWeather = rnd(OPTIONS.locWeather);
			updates.locPalette = rnd(OPTIONS.locPalette);
		}
		if (randomGroups.animals) {
			updates.aniBirds = rnd(OPTIONS.aniBirds);
			updates.aniLand = rnd(OPTIONS.aniLand);
			updates.aniInsects = rnd(OPTIONS.aniInsects);
			updates.aniWater = rnd(OPTIONS.aniWater);
		}
		if (randomGroups.visuals) {
			updates.visComposition = rnd(OPTIONS.visComposition);
			updates.visFlowers = rnd(OPTIONS.visFlowers);
			updates.visRocks = rnd(OPTIONS.visRocks);
			updates.visSky = rnd(OPTIONS.visSky);
		}
		if (randomGroups.lighting) {
			updates.lightMain = rnd(OPTIONS.lightMain);
			updates.lightFx = rnd(OPTIONS.lightFx);
			updates.lightColor = rnd(OPTIONS.lightColor);
			updates.lightShadow = rnd(OPTIONS.lightShadow);
		}
		if (randomGroups.drone) {
			updates.camMove = rnd(OPTIONS.camMove);
			updates.camAngle = rnd(OPTIONS.camAngle);
			updates.camLens = rnd(OPTIONS.camLens);
			updates.camSpeed = rnd(OPTIONS.camSpeed);
		}
		if (randomGroups.elements) {
			updates.elemWind = rnd(OPTIONS.elemWind);
			updates.elemHuman = rnd(OPTIONS.elemHuman);
			updates.elemAtmo = rnd(OPTIONS.elemAtmo);
			updates.elemSeason = rnd(OPTIONS.elemSeason);
		}
		if (randomGroups.style) {
			updates.styMood = rnd(OPTIONS.styMood);
			updates.styGrade = rnd(OPTIONS.styGrade);
			updates.styQuality = rnd(OPTIONS.styQuality);
			updates.styMusic = rnd(OPTIONS.styMusic);
		}

		updateSceneConfig(currentScene, updates);
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function randomSceneType() {
		const keys = Object.keys(SCENE_TYPES) as SceneTypeKey[];
		const pick = rnd(keys);
		setSceneTypes((prev) => ({ ...prev, [currentScene]: pick }));
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎴 Tipe adegan: ${SCENE_TYPES[pick]}`);
	}

	function randomAllScenes() {
		const keys = Object.keys(SCENE_TYPES) as SceneTypeKey[];
		const optionsByField =
			OPTIONS as unknown as Record<keyof SceneConfig, readonly string[]>;
		const nextTypes: Record<number, SceneTypeKey> = {};
		const nextConfigs: Record<number, SceneConfig> = {};
		for (let s = 1; s <= TOTAL_SCENES; s++) {
			nextTypes[s] = Math.random() > 0.4 ? rnd(keys) : keys[s % keys.length];
			const base = getDefaultSceneConfig();
			const updates: Partial<SceneConfig> = {};

			(Object.keys(RANDOM_GROUP_FIELDS) as RandomGroupKey[]).forEach((group) => {
				if (!randomGroups[group]) return;
				RANDOM_GROUP_FIELDS[group].forEach((field) => {
					const fieldKey = field as keyof SceneConfig;
					updates[fieldKey] = rnd(optionsByField[fieldKey]);
				});
			});

			nextConfigs[s] = { ...base, ...updates };
		}
		setSceneTypes(nextTypes);
		setSceneConfigs(nextConfigs);
		showToast("🎰 Semua 12 scene di-randomize!");
		setTimeout(() => generateAll(), 50);
	}

	function setTimeOfDaySafe(next: TodKey) {
		setTimeOfDay(next);
		setTimeout(() => generatePromptFor(currentScene), 50);
	}

	function setCurrentSceneSafe(sceneNum: number) {
		setCurrentScene(sceneNum);
		setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	function setSceneTypeForScene(sceneNum: number, next: SceneTypeKey) {
		setSceneTypes((prev) => ({ ...prev, [sceneNum]: next }));
		setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	const scType = sceneTypes[currentScene] ?? "mountain";
	const scTypeLabel = getSceneTypeLabel(scType);
	const progressPct = Math.round((currentScene / TOTAL_SCENES) * 100);

	return {
		tabs,
		activeTab,
		setActiveTab,

		timeOfDay,
		setTimeOfDaySafe,

		currentScene,
		setCurrentSceneSafe,

		sceneTypes,
		setSceneTypeForScene,
		scType,
		scTypeLabel,
		progressPct,

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
