"use client";

import { useState } from "react";
import {
	CLIMATE_OPTIONS,
	DNA_DEFAULTS,
	FILM_STYLE_OPTIONS,
	LOCATION_OPTIONS,
	SHELTER_OPTIONS,
	TRAVEL_MODE_OPTIONS,
} from "@/lib/data";
import { generateScenes } from "@/lib/scene-generator";

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

	const [scenes, setScenes] = useState<SceneConfig[]>([]);
	const [currentScene, setCurrentScene] = useState(1);
	const [currentPhase, setCurrentPhase] = useState<ScenePhaseKey>("hook");
	const [activeTab, setActiveTab] = useState("shot");

	function handleDurationChange(min: number, sec: number) {
		setTotalMinutes(min);
		setSecPerScene(sec);
		setCurrentScene(1);
		setCurrentPhase("hook");
		if (dnaLocked) {
			const newTotal = Math.floor((min * 60) / sec);
			setScenes(generateScenes(newTotal, dna));
		}
	}

	function lockDNA() {
		const newScenes = generateScenes(totalScenes, dna);
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
		setScenes,
		setSecPerScene,
		setTotalMinutes,
		totalMinutes,
		totalScenes,
		updateScene,
	};
}

