"use client";

import { useMemo, useState } from "react";
import useToast from "@/components/forms/forest-build/useToast";
import { DNA_OPTIONS, OPTIONS, SCENE_TYPES, VISUAL_STYLE_LABELS } from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { AsmrTimelapseGenerator, DnaState, ProjectTypeKey, RandomGroupKey, SceneConfig, SceneTypeKey, TabKey, TodKey, VisualStyleKey } from "./types";
import { getDefaultSceneConfig, getDefaultSceneTypes, getSceneTypeLabel, rnd } from "./utils";

export default function useAsmrTimelapseGenerator(): AsmrTimelapseGenerator {
	const tabs = useMemo(
		() =>
			[
				{ key: "timelapse", label: "⏱️ Timelapse" },
				{ key: "equipment", label: "🚜 Alat Berat" },
				{ key: "narration", label: "🔊 Narasi" },
				{ key: "lighting", label: "☀️ Lighting" },
				{ key: "asmr", label: "🎵 ASMR" },
				{ key: "camera", label: "🎬 Kamera" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const [projectType, setProjectType] = useState<ProjectTypeKey>("restoration");
	const [narratorGender, setNarratorGender] = useState<"male" | "female">(
		"male",
	);
	const [timeOfDay, setTimeOfDay] = useState<TodKey>("noon");
	const [totalMinutes, setTotalMinutes] = useState(3);
	const [secPerScene, setSecPerScene] = useState(15);
	const [visualStyle, setVisualStyle] = useState<VisualStyleKey>("cinematic-realistic");
	const [dnaLocked, setDnaLocked] = useState(false);
	const [dnaPreviewOpen, setDnaPreviewOpen] = useState(false);
	const [currentScene, setCurrentScene] = useState(1);
	const [activeTab, setActiveTab] = useState<TabKey>("timelapse");

	const totalScenes = Math.max(
		2,
		Math.floor((totalMinutes * 60) / Math.max(1, secPerScene)),
	);

	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultSceneTypes("restoration", totalScenes),
	);

	const [dna, setDna] = useState<DnaState>(() => ({
		building: DNA_OPTIONS.building[0].value,
		location: DNA_OPTIONS.location[0].value,
		climate: DNA_OPTIONS.climate[0].value,
		material: DNA_OPTIONS.material[0].value,
		palette: DNA_OPTIONS.palette[0].value,
		team: DNA_OPTIONS.team[0].value,
	}));

	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);

	const [randomGroups, setRandomGroups] = useState<
		Record<RandomGroupKey, boolean>
	>(() => ({
		timelapse: true,
		equipment: true,
		narration: true,
		lighting: true,
		asmr: true,
		camera: true,
	}));

	const [promptOutput, setPromptOutput] = useState(
		"🔒 Kunci Project DNA terlebih dahulu, lalu klik ⚡ Generate Prompt.",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);

	const { toast, show: showToast } = useToast();

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
				camQuality: pickOption(OPTIONS.camQuality, ["red camera", "8k"]),
				camGrade: pickOption(OPTIONS.camGrade, ["kodak", "rich warm", "bleach bypass"]),
				camLens: pickOption(OPTIONS.camLens, ["wide 24mm", "tilt-shift"]),
				camMood: pickOption(OPTIONS.camMood, ["industrial poetry", "triumphant"]),
			};
		}
		if (style === "semi-cinematic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "professional drone"]),
				camGrade: pickOption(OPTIONS.camGrade, ["clean documentary", "warm natural"]),
				camLens: pickOption(OPTIONS.camLens, ["standard 35mm", "wide 24mm"]),
				camMood: pickOption(OPTIONS.camMood, ["immersive asmr", "contemplative"]),
			};
		}
		if (style === "cinematic-realistic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["8k", "red camera", "professional drone"]),
				camGrade: pickOption(OPTIONS.camGrade, ["clean documentary", "warm natural"]),
				camLens: pickOption(OPTIONS.camLens, ["standard 35mm", "wide 24mm"]),
				camMood: pickOption(OPTIONS.camMood, ["documentary realism", "immersive asmr"]),
			};
		}
		if (style === "realistic") {
			return {
				camQuality: pickOption(OPTIONS.camQuality, ["professional drone", "red camera"]),
				camGrade: pickOption(OPTIONS.camGrade, ["clean documentary", "desaturated cool"]),
				camLens: pickOption(OPTIONS.camLens, ["standard 35mm", "telephoto 85mm"]),
				camMood: pickOption(OPTIONS.camMood, ["documentary realism", "contemplative"]),
			};
		}
		return {
			camQuality: pickOption(OPTIONS.camQuality, ["unreal engine", "8k"]),
			camGrade: pickOption(OPTIONS.camGrade, ["bleach bypass", "rich warm", "deep amber"]),
			camLens: pickOption(OPTIONS.camLens, ["macro", "telephoto 85mm"]),
			camMood: pickOption(OPTIONS.camMood, ["immersive asmr", "industrial poetry"]),
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

	function generatePromptFor(
		sceneNum: number,
		ptOverride?: ProjectTypeKey,
		durOverride?: { totalScenes: number; secPerScene: number },
	) {
		const effectiveTotalScenes = durOverride?.totalScenes ?? totalScenes;
		const effectiveSecPerScene = durOverride?.secPerScene ?? secPerScene;
		if (!dnaLocked) {
			setPromptOutput(
				`⚠️ Kunci Project DNA terlebih dahulu!\n\nKlik tombol "🔒 Kunci Project DNA" untuk memastikan semua ${effectiveTotalScenes} scene menggunakan proyek yang sama dan sinkron.`,
			);
			return;
		}

		const projectType2 = ptOverride ?? projectType;
		const fallbackSceneType =
			projectType2 === "restoration" ? "assess" : "groundwork";
		const sceneType = (sceneTypes[sceneNum] ??
			fallbackSceneType) as SceneTypeKey;
		const config = getSceneConfig(sceneNum);
		const prompt = buildPrompt({
			sceneNum,
			totalScenes: effectiveTotalScenes,
			secPerScene: effectiveSecPerScene,
			sceneType,
			visualStyle,
			projectType: projectType2,
			narratorGender,
			timeOfDay,
			dna,
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
		if (!dnaLocked) return;
		const next = currentScene < totalScenes ? currentScene + 1 : 1;
		setCurrentScene(next);
		setTimeout(() => generatePromptFor(next), 50);
	}

	function copyPrompt() {
		if (promptOutput.startsWith("⚠") || promptOutput.startsWith("🔒")) return;
		navigator.clipboard.writeText(promptOutput);
		showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
	}

	function generateAll() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		const prompts: string[] = [];
		const updated: Record<number, SceneConfig> = { ...sceneConfigs };
		const fallbackSceneType =
			projectType === "restoration" ? "assess" : "groundwork";
		for (let s = 1; s <= totalScenes; s++) {
			const sceneType = (sceneTypes[s] ?? fallbackSceneType) as SceneTypeKey;
			const prompt = buildPrompt({
				sceneNum: s,
				totalScenes,
				secPerScene,
				sceneType,
				visualStyle,
				projectType,
				narratorGender,
				timeOfDay,
				dna,
				config: getSceneConfig(s),
			});
			prompts.push(prompt);
			updated[s] = { ...getSceneConfig(s), generatedPrompt: prompt };
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

	function randomizeDNA() {
		setDna({
			building: rnd(DNA_OPTIONS.building.map((o) => o.value)),
			location: rnd(DNA_OPTIONS.location.map((o) => o.value)),
			climate: rnd(DNA_OPTIONS.climate.map((o) => o.value)),
			material: rnd(DNA_OPTIONS.material.map((o) => o.value)),
			palette: rnd(DNA_OPTIONS.palette.map((o) => o.value)),
			team: rnd(DNA_OPTIONS.team.map((o) => o.value)),
		});
		setDnaPreviewOpen(true);
		showToast("🎲 DNA di-randomize! Kunci setelah puas.");
	}

	function lockDNA() {
		setDnaLocked(true);
		setDnaPreviewOpen(true);
		showToast(`🔒 Project DNA terkunci! Semua ${totalScenes} scene akan sinkron.`);
		setTimeout(() => generatePromptFor(currentScene), 50);
	}

	function randomCurrentScene() {
		const updates: Partial<SceneConfig> = {};

		if (randomGroups.timelapse) {
			updates.tlMode = rnd(OPTIONS.tlMode);
			updates.tlCompression = rnd(OPTIONS.tlCompression);
			updates.tlProgress = rnd(OPTIONS.tlProgress);
			updates.tlSky = rnd(OPTIONS.tlSky);
		}
		if (randomGroups.equipment) {
			updates.eqMain = rnd(OPTIONS.eqMain);
			updates.eqSupport = rnd(OPTIONS.eqSupport);
			updates.eqHand = rnd(OPTIONS.eqHand);
			updates.eqMotion = rnd(OPTIONS.eqMotion);
		}
		if (randomGroups.narration) {
			updates.narFreq = rnd(OPTIONS.narFreq);
			updates.narStyle = rnd(OPTIONS.narStyle);
			updates.narLine = rnd(OPTIONS.narLine);
			updates.narAudio = rnd(OPTIONS.narAudio);
		}
		if (randomGroups.lighting) {
			updates.lightMain = rnd(OPTIONS.lightMain);
			updates.lightFx = rnd(OPTIONS.lightFx);
			updates.lightColor = rnd(OPTIONS.lightColor);
			updates.lightShadow = rnd(OPTIONS.lightShadow);
		}
		if (randomGroups.asmr) {
			updates.asmrMusic = rnd(OPTIONS.asmrMusic);
			updates.asmrLayer = rnd(OPTIONS.asmrLayer);
			updates.asmrAmbient = rnd(OPTIONS.asmrAmbient);
			updates.asmrMoment = rnd(OPTIONS.asmrMoment);
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
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function randomSceneType() {
		const types = Object.keys(SCENE_TYPES[projectType]) as SceneTypeKey[];
		const pick = rnd(types);
		setSceneTypes((prev) => ({ ...prev, [currentScene]: pick }));
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎴 Fase: ${getSceneTypeLabel(projectType, pick)}`);
	}

	function randomAllScenes() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		const nextConfigs: Record<number, SceneConfig> = {};
		for (let s = 1; s <= totalScenes; s++) {
			const base = getDefaultSceneConfig();
			const updates: Partial<SceneConfig> = {};
			if (randomGroups.timelapse) {
				updates.tlMode = rnd(OPTIONS.tlMode);
				updates.tlCompression = rnd(OPTIONS.tlCompression);
				updates.tlProgress = rnd(OPTIONS.tlProgress);
				updates.tlSky = rnd(OPTIONS.tlSky);
			}
			if (randomGroups.equipment) {
				updates.eqMain = rnd(OPTIONS.eqMain);
				updates.eqSupport = rnd(OPTIONS.eqSupport);
				updates.eqHand = rnd(OPTIONS.eqHand);
				updates.eqMotion = rnd(OPTIONS.eqMotion);
			}
			if (randomGroups.narration) {
				updates.narFreq = rnd(OPTIONS.narFreq);
				updates.narStyle = rnd(OPTIONS.narStyle);
				updates.narLine = rnd(OPTIONS.narLine);
				updates.narAudio = rnd(OPTIONS.narAudio);
			}
			if (randomGroups.lighting) {
				updates.lightMain = rnd(OPTIONS.lightMain);
				updates.lightFx = rnd(OPTIONS.lightFx);
				updates.lightColor = rnd(OPTIONS.lightColor);
				updates.lightShadow = rnd(OPTIONS.lightShadow);
			}
			if (randomGroups.asmr) {
				updates.asmrMusic = rnd(OPTIONS.asmrMusic);
				updates.asmrLayer = rnd(OPTIONS.asmrLayer);
				updates.asmrAmbient = rnd(OPTIONS.asmrAmbient);
				updates.asmrMoment = rnd(OPTIONS.asmrMoment);
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
		setSceneConfigs(nextConfigs);
		showToast(`🎰 Semua ${totalScenes} scene di-randomize dengan DNA yang sama!`);
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
		setSceneTypes(getDefaultSceneTypes(projectType, nextTotalScenes));
		setAllPrompts([]);
		setShowAllPrompts(false);

		if (dnaLocked) {
			setTimeout(
				() =>
					generatePromptFor(1, undefined, {
						totalScenes: nextTotalScenes,
						secPerScene: safeSec,
					}),
				50,
			);
		} else {
			setPromptOutput(
				"🔒 Kunci Project DNA terlebih dahulu, lalu klik ⚡ Generate Prompt.",
			);
		}
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
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎞️ Visual style: ${VISUAL_STYLE_LABELS[next]}`);
	}

	function setProjectTypeSafe(next: ProjectTypeKey) {
		setProjectType(next);
		setSceneTypes(getDefaultSceneTypes(next, totalScenes));
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene, next), 50);
	}

	function setNarratorGenderSafe(next: "male" | "female") {
		setNarratorGender(next);
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
	}

	function setTimeOfDaySafe(next: TodKey) {
		setTimeOfDay(next);
		if (dnaLocked) setTimeout(() => generatePromptFor(currentScene), 50);
	}

	function setCurrentSceneSafe(sceneNum: number) {
		const safe = Math.min(totalScenes, Math.max(1, sceneNum));
		setCurrentScene(safe);
		if (dnaLocked) setTimeout(() => generatePromptFor(safe), 50);
	}

	function setSceneTypeForScene(sceneNum: number, next: SceneTypeKey) {
		setSceneTypes((prev) => ({ ...prev, [sceneNum]: next }));
		if (dnaLocked) setTimeout(() => generatePromptFor(sceneNum), 50);
	}

	const fallbackSceneType = projectType === "restoration" ? "assess" : "groundwork";
	const scType = (sceneTypes[currentScene] ?? fallbackSceneType) as SceneTypeKey;
	const scTypeLabel = getSceneTypeLabel(projectType, scType);
	const progressPct = Math.round((currentScene / totalScenes) * 100);
	const visualStyleLabel = VISUAL_STYLE_LABELS[visualStyle] ?? visualStyle;

	return {
		tabs,

		totalMinutes,
		secPerScene,
		totalScenes,
		onDurationChange,

		visualStyle,
		visualStyleLabel,
		setVisualStyleSafe,

		projectType,
		setProjectTypeSafe,

		narratorGender,
		setNarratorGenderSafe,

		timeOfDay,
		setTimeOfDaySafe,

		dnaLocked,
		dnaPreviewOpen,
		setDnaPreviewOpen,

		currentScene,
		setCurrentSceneSafe,

		activeTab,
		setActiveTab,

		sceneTypes,
		setSceneTypes,
		setSceneTypeForScene,

		dna,
		setDna,

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

		randomizeDNA,
		lockDNA,
		randomCurrentScene,
		randomAllScenes,
		randomSceneType,

		scType,
		scTypeLabel,
		progressPct,

		toast,
	};
}
