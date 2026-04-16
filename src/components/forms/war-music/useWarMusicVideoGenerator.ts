"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { OPTIONS, SCENE_TYPE_LABELS, TOTAL_SCENES } from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { SceneConfig, SceneTypeKey, TabKey, WarMusicVideoGenerator } from "./types";
import { getDefaultSceneConfig, getDefaultTypes, getSceneTypeLabel, rnd } from "./utils";

export default function useWarMusicVideoGenerator(): WarMusicVideoGenerator {
	const tabs = useMemo(
		() =>
			[
				{ key: "soldiers", label: "⚔️ Pasukan" },
				{ key: "dj", label: "🎧 DJ" },
				{ key: "civilian", label: "👥 Sipil" },
				{ key: "vehicles", label: "🚁 Kendaraan" },
				{ key: "location", label: "📍 Lokasi" },
				{ key: "lighting", label: "💡 Lighting" },
				{ key: "vfx", label: "💥 VFX & Senjata" },
				{ key: "camera", label: "🎬 Kamera" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const { toast, show: showToast } = useToast();

	const [activeTab, setActiveTab] = useState<TabKey>("soldiers");
	const [currentScene, setCurrentScene] = useState(1);
	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultTypes(),
	);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);
	const [randomGroups, setRandomGroups] = useState<Record<TabKey, boolean>>(() => ({
		soldiers: true,
		dj: true,
		civilian: true,
		vehicles: true,
		location: true,
		lighting: true,
		vfx: true,
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

	function generatePromptFor(sceneNum: number) {
		const sceneType = sceneTypes[sceneNum] ?? "ground-assault";
		const config = getSceneConfig(sceneNum);
		const prompt = buildPrompt({ sceneNum, sceneType, config });
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
			const sceneType = sceneTypes[s] ?? "ground-assault";
			const config = getSceneConfig(s);
			const prompt = buildPrompt({ sceneNum: s, sceneType, config });
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
		if (randomGroups.soldiers) {
			updates.solHero = rnd(OPTIONS.solHero);
			updates.solSquad = rnd(OPTIONS.solSquad);
			updates.solAction = rnd(OPTIONS.solAction);
			updates.solGear = rnd(OPTIONS.solGear);
			updates.solScale = rnd(OPTIONS.solScale);
			updates.solEnemy = rnd(OPTIONS.solEnemy);
		}
		if (randomGroups.dj) {
			updates.djType = rnd(OPTIONS.djType);
			updates.djSetup = rnd(OPTIONS.djSetup);
			updates.djAction = rnd(OPTIONS.djAction);
			updates.djOutfit = rnd(OPTIONS.djOutfit);
			updates.djFx = rnd(OPTIONS.djFx);
			updates.djSound = rnd(OPTIONS.djSound);
		}
		if (randomGroups.civilian) {
			updates.civType = rnd(OPTIONS.civType);
			updates.civEmotion = rnd(OPTIONS.civEmotion);
			updates.civInteraction = rnd(OPTIONS.civInteraction);
			updates.civDensity = rnd(OPTIONS.civDensity);
		}
		if (randomGroups.vehicles) {
			updates.vehGround = rnd(OPTIONS.vehGround);
			updates.vehAir = rnd(OPTIONS.vehAir);
			updates.vehNaval = rnd(OPTIONS.vehNaval);
			updates.vehAction = rnd(OPTIONS.vehAction);
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
		if (randomGroups.vfx) {
			updates.vfxFire = rnd(OPTIONS.vfxFire);
			updates.vfxSmoke = rnd(OPTIONS.vfxSmoke);
			updates.vfxWeapons = rnd(OPTIONS.vfxWeapons);
			updates.vfxDuel = rnd(OPTIONS.vfxDuel);
			updates.vfxProps = rnd(OPTIONS.vfxProps);
			updates.vfxSfx = rnd(OPTIONS.vfxSfx);
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
		for (let s = 1; s <= TOTAL_SCENES; s++) {
			nextTypes[s] = Math.random() > 0.4 ? rnd(keys) : keys[s % keys.length];
			const base = getDefaultSceneConfig();
			const updates: Partial<SceneConfig> = {};
			if (randomGroups.soldiers) {
				updates.solHero = rnd(OPTIONS.solHero);
				updates.solSquad = rnd(OPTIONS.solSquad);
				updates.solAction = rnd(OPTIONS.solAction);
				updates.solGear = rnd(OPTIONS.solGear);
				updates.solScale = rnd(OPTIONS.solScale);
				updates.solEnemy = rnd(OPTIONS.solEnemy);
			}
			if (randomGroups.dj) {
				updates.djType = rnd(OPTIONS.djType);
				updates.djSetup = rnd(OPTIONS.djSetup);
				updates.djAction = rnd(OPTIONS.djAction);
				updates.djOutfit = rnd(OPTIONS.djOutfit);
				updates.djFx = rnd(OPTIONS.djFx);
				updates.djSound = rnd(OPTIONS.djSound);
			}
			if (randomGroups.civilian) {
				updates.civType = rnd(OPTIONS.civType);
				updates.civEmotion = rnd(OPTIONS.civEmotion);
				updates.civInteraction = rnd(OPTIONS.civInteraction);
				updates.civDensity = rnd(OPTIONS.civDensity);
			}
			if (randomGroups.vehicles) {
				updates.vehGround = rnd(OPTIONS.vehGround);
				updates.vehAir = rnd(OPTIONS.vehAir);
				updates.vehNaval = rnd(OPTIONS.vehNaval);
				updates.vehAction = rnd(OPTIONS.vehAction);
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
			if (randomGroups.vfx) {
				updates.vfxFire = rnd(OPTIONS.vfxFire);
				updates.vfxSmoke = rnd(OPTIONS.vfxSmoke);
				updates.vfxWeapons = rnd(OPTIONS.vfxWeapons);
				updates.vfxDuel = rnd(OPTIONS.vfxDuel);
				updates.vfxProps = rnd(OPTIONS.vfxProps);
				updates.vfxSfx = rnd(OPTIONS.vfxSfx);
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
		showToast("🎰 Semua 12 scene di-randomize!");
		setTimeout(() => generateAll(), 50);
	}

	function setCurrentSceneSafe(sceneNum: number) {
		setCurrentScene(sceneNum);
		setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	function setSceneTypeForScene(sceneNum: number, next: SceneTypeKey) {
		setSceneTypes((prev) => ({ ...prev, [sceneNum]: next }));
		setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	const scType = sceneTypes[currentScene] ?? "ground-assault";
	const scTypeLabel = getSceneTypeLabel(scType);

	return {
		tabs,
		activeTab,
		setActiveTab,

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

