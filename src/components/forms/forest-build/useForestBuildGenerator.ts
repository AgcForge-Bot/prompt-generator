"use client";

import useToast from "@/components/forms/forest-build/useToast";
import useForestBuildImageState from "@/components/forms/forest-build/useForestBuildImageState";
import useForestBuildProjectState from "@/components/forms/forest-build/useForestBuildProjectState";
import useForestBuildPromptState from "@/components/forms/forest-build/useForestBuildPromptState";
import { useState } from "react";

export default function useForestBuildGenerator() {
	const { toast, show: showToast } = useToast();
	const project = useForestBuildProjectState({ showToast });
	const [imgScope, setImgScope] = useState<"global" | "scene">("global");
	const derivedSc = project.dnaLocked
		? (project.scenes.find((s) => s.id === project.currentScene) ??
				project.scenes[0])
		: null;
	const images = useForestBuildImageState({
		currentScene: project.currentScene,
		getScene: project.getScene,
		imgScope,
		setImgScope,
		sc: derivedSc,
		showToast,
		updateScene: project.updateScene,
	});
	const prompt = useForestBuildPromptState({
		currentPhase: project.currentPhase,
		currentScene: project.currentScene,
		dna: project.dna,
		dnaLocked: project.dnaLocked,
		globalImages: images.globalImages,
		scenes: project.scenes,
		secPerScene: project.secPerScene,
		setCurrentPhase: project.setCurrentPhase,
		setCurrentScene: project.setCurrentScene,
		setScenes: project.setScenes,
		showToast,
		totalScenes: project.totalScenes,
		updateScene: project.updateScene,
	});

	return {
		...project,
		...images,
		...prompt,
		toast,
	};
}
