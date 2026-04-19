"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { OPTIONS, RANDOM_GROUP_FIELDS, SCENE_TYPES, TOD_DATA, VISUAL_STYLE_LABELS } from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { RandomGroupKey, RelaxingMusicVideoGenerator, SceneConfig, SceneTypeKey, TabKey, TodKey, VisualStyleKey } from "./types";
import { getDefaultSceneConfig, getDefaultTypes, getSceneTypeLabel, rnd } from "./utils";
import { downloadJsonFile, jsonBundleFromSceneJsonStrings, jsonStringify } from "@/lib/promptJson";

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
	const [totalMinutes, setTotalMinutes] = useState(2);
	const [secPerScene, setSecPerScene] = useState(10);
	const [visualStyle, setVisualStyle] = useState<VisualStyleKey>("cinematic-realistic");
	const [currentScene, setCurrentScene] = useState(1);

	const totalScenes = Math.max(
		2,
		Math.floor((totalMinutes * 60) / Math.max(1, secPerScene)),
	);
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

	function pickOption(options: readonly string[], prefers: string[]) {
		const lower = options.map((o) => o.toLowerCase());
		for (const p of prefers) {
			const idx = lower.findIndex((o) => o.includes(p.toLowerCase()));
			if (idx >= 0) return options[idx];
		}
		return options[0] ?? "";
	}

	function getVisualPreset(style: VisualStyleKey): Partial<SceneConfig> {
		if (style === "cinematic") {
			return {
				styQuality: pickOption(OPTIONS.styQuality, ["4k cinematic", "8k"]),
				styGrade: pickOption(OPTIONS.styGrade, ["cinematic teal", "soft warm film", "golden warm"]),
				camLens: pickOption(OPTIONS.camLens, ["ultra wide", "wide angle"]),
				camSpeed: pickOption(OPTIONS.camSpeed, ["ultra-slow", "slow and graceful"]),
				styMood: pickOption(OPTIONS.styMood, ["awe-inspiring", "romantic and soft", "deeply peaceful"]),
			};
		}
		if (style === "semi-cinematic") {
			return {
				styQuality: pickOption(OPTIONS.styQuality, ["photorealistic", "4k cinematic"]),
				styGrade: pickOption(OPTIONS.styGrade, ["natural vivid", "soft warm film"]),
				camLens: pickOption(OPTIONS.camLens, ["wide angle", "medium focal"]),
				camSpeed: pickOption(OPTIONS.camSpeed, ["slow and graceful", "moderate smooth"]),
				styMood: pickOption(OPTIONS.styMood, ["deeply peaceful", "uplifting and joyful"]),
			};
		}
		if (style === "cinematic-realistic") {
			return {
				styQuality: pickOption(OPTIONS.styQuality, ["photorealistic", "8k"]),
				styGrade: pickOption(OPTIONS.styGrade, ["HDR natural", "natural vivid", "soft warm film"]),
				camLens: pickOption(OPTIONS.camLens, ["wide angle", "slight telephoto", "medium focal"]),
				camSpeed: pickOption(OPTIONS.camSpeed, ["slow and graceful", "moderate smooth"]),
				styMood: pickOption(OPTIONS.styMood, ["intimate and gentle", "deeply peaceful"]),
			};
		}
		if (style === "realistic") {
			return {
				styQuality: pickOption(OPTIONS.styQuality, ["photorealistic", "8k"]),
				styGrade: pickOption(OPTIONS.styGrade, ["log-style flat", "HDR natural", "natural vivid"]),
				camLens: pickOption(OPTIONS.camLens, ["medium focal", "wide angle"]),
				camSpeed: pickOption(OPTIONS.camSpeed, ["moderate smooth", "slow and graceful"]),
				styMood: pickOption(OPTIONS.styMood, ["deeply peaceful", "energizing and fresh"]),
			};
		}
		return {
			styQuality: pickOption(OPTIONS.styQuality, ["8k", "photorealistic"]),
			styGrade: pickOption(OPTIONS.styGrade, ["HDR natural", "natural vivid"]),
			camLens: pickOption(OPTIONS.camLens, ["slight telephoto", "ultra wide"]),
			camSpeed: pickOption(OPTIONS.camSpeed, ["ultra-slow", "slow and graceful"]),
			styMood: pickOption(OPTIONS.styMood, ["mysterious and ethereal", "awe-inspiring grandeur"]),
		};
	}

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
		const promptObj = buildPrompt({
			sceneNum,
			totalScenes,
			secPerScene,
			sceneType,
			visualStyle,
			timeOfDay,
			config,
		});
		const prompt = jsonStringify(promptObj);
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
			const sceneType = sceneTypes[s] ?? "mountain";
			const config = getSceneConfig(s);
			const promptObj = buildPrompt({
				sceneNum: s,
				totalScenes,
				secPerScene,
				sceneType,
				visualStyle,
				timeOfDay,
				config,
			});
			const prompt = jsonStringify(promptObj);
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
		navigator.clipboard.writeText(jsonBundleFromSceneJsonStrings(allPrompts));
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function downloadAllJson() {
		let prompts = allPrompts;
		if (!prompts.length) {
			prompts = [];
			const updated: Record<number, SceneConfig> = { ...sceneConfigs };
			for (let s = 1; s <= totalScenes; s++) {
				const sceneType = sceneTypes[s] ?? "mountain";
				const config = getSceneConfig(s);
				const promptObj = buildPrompt({
					sceneNum: s,
					totalScenes,
					secPerScene,
					sceneType,
					visualStyle,
					timeOfDay,
					config,
				});
				const prompt = jsonStringify(promptObj);
				prompts.push(prompt);
				updated[s] = { ...config, generatedPrompt: prompt };
			}
			setSceneConfigs(updated);
			setAllPrompts(prompts);
			setShowAllPrompts(true);
			setPromptOutput(prompts[currentScene - 1] ?? "");
		}
		downloadJsonFile(
			`relaxing-music-video-clip-${Date.now()}.json`,
			jsonBundleFromSceneJsonStrings(prompts),
		);
		showToast("💾 JSON bundle berhasil didownload!");
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
		for (let s = 1; s <= totalScenes; s++) {
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
		setSceneTypes(getDefaultTypes());
		setAllPrompts([]);
		setShowAllPrompts(false);
		setTimeout(() => generatePromptFor(1), 50);
		showToast(`⏱ Durasi update: ${safeMin} menit · ${safeSec}s/scene = ${nextTotalScenes} scene`);
	}

	function setVisualStyleSafe(next: VisualStyleKey) {
		setVisualStyle(next);
		const preset = getVisualPreset(next);
		setSceneConfigs((prev) => {
			const nextMap: Record<number, SceneConfig> = { ...prev };
			for (let s = 1; s <= totalScenes; s++) {
				const base = nextMap[s] ?? getDefaultSceneConfig();
				nextMap[s] = { ...base, ...preset };
			}
			return nextMap;
		});
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎞️ Visual style: ${VISUAL_STYLE_LABELS[next]}`);
	}

	function setTimeOfDaySafe(next: TodKey) {
		setTimeOfDay(next);
		setTimeout(() => generatePromptFor(currentScene), 50);
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

	const scType = sceneTypes[currentScene] ?? "mountain";
	const scTypeLabel = getSceneTypeLabel(scType);
	const progressPct = Math.round((currentScene / totalScenes) * 100);
	const visualStyleLabel = VISUAL_STYLE_LABELS[visualStyle] ?? visualStyle;

	return {
		tabs,
		activeTab,
		setActiveTab,

		totalMinutes,
		secPerScene,
		totalScenes,
		onDurationChange,

		visualStyle,
		visualStyleLabel,
		setVisualStyleSafe,

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
		downloadAllJson,
		generateAll,

		randomizeCurrentScene,
		randomAllScenes,
		randomSceneType,

		toast,
	};
}
