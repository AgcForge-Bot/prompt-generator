import { DEFAULT_TYPES, OPTIONS, SCENE_TYPE_LABELS } from "./constants";
import type { SceneConfig, SceneTypeKey } from "./types";

export function rnd<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function mmss(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function getDefaultTypes(totalScenes: number): Record<number, SceneTypeKey> {
	const map: Record<number, SceneTypeKey> = {};
	for (let i = 1; i <= totalScenes; i++) {
		map[i] = DEFAULT_TYPES[(i - 1) % DEFAULT_TYPES.length];
	}
	return map;
}

export function getDefaultSceneConfig(): SceneConfig {
	return {
		carHero: OPTIONS.carHero[0],
		carSecondary: OPTIONS.carSecondary[0],
		carAction: OPTIONS.carAction[0],
		carDetail: OPTIONS.carDetail[0],
		carColor: OPTIONS.carColor[0],
		carCount: OPTIONS.carCount[0],

		djType: OPTIONS.djType[0],
		djSetup: OPTIONS.djSetup[0],
		djAction: OPTIONS.djAction[0],
		djOutfit: OPTIONS.djOutfit[0],
		djFx: OPTIONS.djFx[0],
		djSound: OPTIONS.djSound[0],

		crowdMix: OPTIONS.crowdMix[0],
		crowdEnergy: OPTIONS.crowdEnergy[0],
		crowdAction: OPTIONS.crowdAction[0],
		crowdFashion: OPTIONS.crowdFashion[0],
		crowdDensity: OPTIONS.crowdDensity[0],
		crowdMoment: OPTIONS.crowdMoment[0],

		locMain: OPTIONS.locMain[0],
		locTime: OPTIONS.locTime[0],
		locPalette: OPTIONS.locPalette[0],
		locAtmo: OPTIONS.locAtmo[0],

		lightMain: OPTIONS.lightMain[0],
		lightFx: OPTIONS.lightFx[0],
		lightColor: OPTIONS.lightColor[0],
		lightShadow: OPTIONS.lightShadow[0],

		propFire: OPTIONS.propFire[0],
		propSmoke: OPTIONS.propSmoke[0],
		propAnimal: OPTIONS.propAnimal[0],
		propDeco: OPTIONS.propDeco[0],
		propChar: OPTIONS.propChar[0],
		propSfx: OPTIONS.propSfx[0],

		camAngle: OPTIONS.camAngle[0],
		camMove: OPTIONS.camMove[0],
		camMood: OPTIONS.camMood[0],
		camQuality: OPTIONS.camQuality[0],
		camGrade: OPTIONS.camGrade[0],
		camLens: OPTIONS.camLens[0],
	};
}

export function getSceneTypeLabel(sceneType: SceneTypeKey) {
	return SCENE_TYPE_LABELS[sceneType] ?? sceneType;
}
