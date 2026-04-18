"use client";

import { useState } from "react";
import type { ProjectDNATab, ProjectDNA, SceneConfig, ScenePhaseKey, VisualStyleKey } from "./types"
import {
	CLIMATE_OPTIONS,
	DNA_DEFAULTS,
	FILM_STYLE_OPTIONS,
	LOCATION_OPTIONS,
	SHELTER_OPTIONS,
	TRAVEL_MODE_OPTIONS,
} from "./utils";
import { generateScenes } from "./sceneGenerator";
import { CAM_MOODS, COLOR_GRADE_OPTIONS, LENS_OPTIONS, VISUAL_STYLE_LABELS } from "./constants";

export default function useForestBuildProjectState({
	showToast,
}: {
	showToast: (msg: string) => void;
}) {
	const [totalMinutes, setTotalMinutes] = useState(10);
	const [secPerScene, setSecPerScene] = useState(10);
	const totalScenes = Math.floor((totalMinutes * 60) / secPerScene);

	const [dna, setDna] = useState<ProjectDNA>(DNA_DEFAULTS);
	const [dnaLocked, setDnaLocked] = useState(false);
	const [dnaTab, setDnaTab] = useState<ProjectDNATab>('identity')

	const [scenes, setScenes] = useState<SceneConfig[]>([]);
	const [currentScene, setCurrentScene] = useState(1);
	const [currentPhase, setCurrentPhase] = useState<ScenePhaseKey>("hook");
	const [activeTab, setActiveTab] = useState("shot");

	function pickOption(options: readonly string[], prefers: string[]) {
		const lower = options.map((o) => o.toLowerCase());
		for (const p of prefers) {
			const idx = lower.findIndex((o) => o.includes(p.toLowerCase()));
			if (idx >= 0) return options[idx];
		}
		return options[0] ?? "";
	}

	function getVisualPreset(style: VisualStyleKey) {
		if (style === "cinematic") {
			return {
				filmQuality: pickOption(FILM_STYLE_OPTIONS.map((o) => o.value), ["red", "cinematic"]),
				colorGrade: pickOption(COLOR_GRADE_OPTIONS, ["golden hour", "warm natural"]),
				camLens: pickOption(LENS_OPTIONS, ["wide 24mm", "telephoto 85mm"]),
				camMood: pickOption(CAM_MOODS, ["lyrical", "wonder"]),
			};
		}
		if (style === "semi-cinematic") {
			return {
				filmQuality: pickOption(FILM_STYLE_OPTIONS.map((o) => o.value), ["sony fx3", "cinematic"]),
				colorGrade: pickOption(COLOR_GRADE_OPTIONS, ["warm natural", "clean documentary"]),
				camLens: pickOption(LENS_OPTIONS, ["standard 35mm", "wide 24mm"]),
				camMood: pickOption(CAM_MOODS, ["meditative", "intimate"]),
			};
		}
		if (style === "cinematic-realistic") {
			return {
				filmQuality: pickOption(FILM_STYLE_OPTIONS.map((o) => o.value), ["sony fx3", "red"]),
				colorGrade: pickOption(COLOR_GRADE_OPTIONS, ["clean documentary", "warm natural"]),
				camLens: pickOption(LENS_OPTIONS, ["standard 35mm", "wide 24mm"]),
				camMood: pickOption(CAM_MOODS, ["documentary realism", "meditative"]),
			};
		}
		if (style === "realistic") {
			return {
				filmQuality: pickOption(FILM_STYLE_OPTIONS.map((o) => o.value), ["documentary", "sony fx3"]),
				colorGrade: pickOption(COLOR_GRADE_OPTIONS, ["clean documentary", "desaturated naturalistic"]),
				camLens: pickOption(LENS_OPTIONS, ["standard 35mm", "wide 24mm"]),
				camMood: pickOption(CAM_MOODS, ["documentary realism", "primitive & earthy"]),
			};
		}
		return {
			filmQuality: pickOption(FILM_STYLE_OPTIONS.map((o) => o.value), ["red", "sony fx3"]),
			colorGrade: pickOption(COLOR_GRADE_OPTIONS, ["clean documentary", "warm natural"]),
			camLens: pickOption(LENS_OPTIONS, ["macro 100mm", "telephoto 85mm"]),
			camMood: pickOption(CAM_MOODS, ["wonder", "triumphant"]),
		};
	}

	function applyVisualStyleToScenes(nextScenes: SceneConfig[], style: VisualStyleKey) {
		const preset = getVisualPreset(style);
		return nextScenes.map((s) => ({ ...s, ...preset }));
	}

	function handleDurationChange(min: number, sec: number) {
		setTotalMinutes(min);
		setSecPerScene(sec);
		setCurrentScene(1);
		setCurrentPhase("hook");
		if (dnaLocked) {
			const newTotal = Math.floor((min * 60) / sec);
			setScenes(applyVisualStyleToScenes(generateScenes(newTotal, dna), dna.visualStyle));
		}
	}

	function lockDNA() {
		const newScenes = applyVisualStyleToScenes(generateScenes(totalScenes, dna), dna.visualStyle);
		setScenes(newScenes);
		setDnaLocked(true);
		setCurrentScene(1);
		setCurrentPhase("hook");
		showToast(`🔒 DNA Terkunci! ${totalScenes} scene siap di-generate.`);
	}

	function randomDNA() {
		setDna({
			...dna,
			location:
				LOCATION_OPTIONS[Math.floor(Math.random() * LOCATION_OPTIONS.length)]
					.value,
			climate:
				CLIMATE_OPTIONS[Math.floor(Math.random() * CLIMATE_OPTIONS.length)].value,
			shelterType:
				SHELTER_OPTIONS[Math.floor(Math.random() * SHELTER_OPTIONS.length)].value,
			travelMode:
				TRAVEL_MODE_OPTIONS[
					Math.floor(Math.random() * TRAVEL_MODE_OPTIONS.length)
				].value,
			filmStyle:
				FILM_STYLE_OPTIONS[
					Math.floor(Math.random() * FILM_STYLE_OPTIONS.length)
				].value,
		});
		showToast("🎲 DNA di-randomize!");
	}

	function setVisualStyleSafe(next: VisualStyleKey) {
		setDna({ ...dna, visualStyle: next });
		if (dnaLocked) {
			setScenes((prev) => applyVisualStyleToScenes(prev, next));
		}
		showToast(`🎞️ Visual style: ${VISUAL_STYLE_LABELS[next]}`);
	}

	function getScene(id: number): SceneConfig {
		return scenes.find((s) => s.id === id) ?? scenes[0];
	}

	function updateScene(id: number, updates: Partial<SceneConfig>) {
		setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
	}

	return {
		activeTab,
		currentPhase,
		currentScene,
		dna,
		dnaLocked,
		dnaTab,
		getScene,
		handleDurationChange,
		lockDNA,
		randomDNA,
		scenes,
		secPerScene,
		setActiveTab,
		setCurrentPhase,
		setCurrentScene,
		setDna,
		setDnaTab,
		setScenes,
		setSecPerScene,
		setTotalMinutes,
		totalMinutes,
		totalScenes,
		setVisualStyleSafe,
		updateScene,
	};
}
