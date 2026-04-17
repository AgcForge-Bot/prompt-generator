import { DEFAULT_TYPES, OPTIONS, SCENE_TYPE_LABELS } from "./constants";
import type { SceneConfig, SceneTypeKey } from "./types";

export function rnd<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
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
		solHero: OPTIONS.solHero[0],
		solSquad: OPTIONS.solSquad[0],
		solAction: OPTIONS.solAction[0],
		solGear: OPTIONS.solGear[0],
		solScale: OPTIONS.solScale[0],
		solEnemy: OPTIONS.solEnemy[0],

		djType: OPTIONS.djType[0],
		djSetup: OPTIONS.djSetup[0],
		djAction: OPTIONS.djAction[0],
		djOutfit: OPTIONS.djOutfit[0],
		djFx: OPTIONS.djFx[0],
		djSound: OPTIONS.djSound[0],

		civType: OPTIONS.civType[0],
		civEmotion: OPTIONS.civEmotion[0],
		civInteraction: OPTIONS.civInteraction[0],
		civDensity: OPTIONS.civDensity[0],

		vehGround: OPTIONS.vehGround[0],
		vehAir: OPTIONS.vehAir[0],
		vehNaval: OPTIONS.vehNaval[0],
		vehAction: OPTIONS.vehAction[0],

		locMain: OPTIONS.locMain[0],
		locTime: OPTIONS.locTime[0],
		locPalette: OPTIONS.locPalette[0],
		locAtmo: OPTIONS.locAtmo[0],

		lightMain: OPTIONS.lightMain[0],
		lightFx: OPTIONS.lightFx[0],
		lightColor: OPTIONS.lightColor[0],
		lightShadow: OPTIONS.lightShadow[0],

		vfxFire: OPTIONS.vfxFire[0],
		vfxSmoke: OPTIONS.vfxSmoke[0],
		vfxWeapons: OPTIONS.vfxWeapons[0],
		vfxDuel: OPTIONS.vfxDuel[0],
		vfxProps: OPTIONS.vfxProps[0],
		vfxSfx: OPTIONS.vfxSfx[0],

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
