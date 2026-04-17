import { OPTIONS, SCENE_ORDER_CONS, SCENE_ORDER_REST, SCENE_TYPES } from "./constants";
import type { ProjectTypeKey, SceneConfig, SceneTypeKey } from "./types";

export function rnd<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function mmss(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function getDefaultSceneTypes(
	projectType: ProjectTypeKey,
	totalScenes: number,
): Record<number, SceneTypeKey> {
	const order =
		projectType === "restoration" ? SCENE_ORDER_REST : SCENE_ORDER_CONS;
	const map: Record<number, SceneTypeKey> = {};
	for (let i = 1; i <= totalScenes; i++) {
		map[i] = order[(i - 1) % order.length] as SceneTypeKey;
	}
	return map;
}

export function getDefaultSceneConfig(): SceneConfig {
	return {
		tlMode: OPTIONS.tlMode[0],
		tlCompression: OPTIONS.tlCompression[0],
		tlProgress: OPTIONS.tlProgress[0],
		tlSky: OPTIONS.tlSky[0],

		eqMain: OPTIONS.eqMain[0],
		eqSupport: OPTIONS.eqSupport[0],
		eqHand: OPTIONS.eqHand[0],
		eqMotion: OPTIONS.eqMotion[0],

		narFreq: OPTIONS.narFreq[0],
		narStyle: OPTIONS.narStyle[0],
		narLine: OPTIONS.narLine[0],
		narAudio: OPTIONS.narAudio[0],

		lightMain: OPTIONS.lightMain[0],
		lightFx: OPTIONS.lightFx[0],
		lightColor: OPTIONS.lightColor[0],
		lightShadow: OPTIONS.lightShadow[0],

		asmrMusic: OPTIONS.asmrMusic[0],
		asmrLayer: OPTIONS.asmrLayer[0],
		asmrAmbient: OPTIONS.asmrAmbient[0],
		asmrMoment: OPTIONS.asmrMoment[0],

		camAngle: OPTIONS.camAngle[0],
		camMove: OPTIONS.camMove[0],
		camMood: OPTIONS.camMood[0],
		camQuality: OPTIONS.camQuality[0],
		camGrade: OPTIONS.camGrade[0],
		camLens: OPTIONS.camLens[0],
	};
}

export function getSceneTypeLabel(
	projectType: ProjectTypeKey,
	sceneType: SceneTypeKey,
) {
	if (projectType === "restoration") {
		return (
			SCENE_TYPES.restoration[
			sceneType as keyof typeof SCENE_TYPES.restoration
			] ?? String(sceneType)
		);
	}
	return (
		SCENE_TYPES.construction[
		sceneType as keyof typeof SCENE_TYPES.construction
		] ?? String(sceneType)
	);
}
