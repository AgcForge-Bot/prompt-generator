import { DEFAULT_TYPES, OPTIONS, SCENE_TYPES, TOTAL_SCENES } from "./constants";
import type { SceneConfig, SceneTypeKey } from "./types";

export function rnd<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function mmss(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function getDefaultTypes(): Record<number, SceneTypeKey> {
	const map: Record<number, SceneTypeKey> = {};
	for (let i = 1; i <= TOTAL_SCENES; i++) map[i] = DEFAULT_TYPES[i - 1];
	return map;
}

export function getDefaultSceneConfig(): SceneConfig {
	return {
		natSpot: OPTIONS.natSpot[0],
		natWater: OPTIONS.natWater[0],
		natVegetation: OPTIONS.natVegetation[0],
		natTerrain: OPTIONS.natTerrain[0],

		locCountry: OPTIONS.locCountry[0],
		locSetting: OPTIONS.locSetting[0],
		locWeather: OPTIONS.locWeather[0],
		locPalette: OPTIONS.locPalette[0],

		aniBirds: OPTIONS.aniBirds[0],
		aniLand: OPTIONS.aniLand[0],
		aniInsects: OPTIONS.aniInsects[0],
		aniWater: OPTIONS.aniWater[0],

		visComposition: OPTIONS.visComposition[0],
		visFlowers: OPTIONS.visFlowers[0],
		visRocks: OPTIONS.visRocks[0],
		visSky: OPTIONS.visSky[0],

		lightMain: OPTIONS.lightMain[0],
		lightFx: OPTIONS.lightFx[0],
		lightColor: OPTIONS.lightColor[0],
		lightShadow: OPTIONS.lightShadow[0],

		camMove: OPTIONS.camMove[0],
		camAngle: OPTIONS.camAngle[0],
		camLens: OPTIONS.camLens[0],
		camSpeed: OPTIONS.camSpeed[0],

		elemWind: OPTIONS.elemWind[0],
		elemHuman: OPTIONS.elemHuman[0],
		elemAtmo: OPTIONS.elemAtmo[0],
		elemSeason: OPTIONS.elemSeason[0],

		styMood: OPTIONS.styMood[0],
		styGrade: OPTIONS.styGrade[0],
		styQuality: OPTIONS.styQuality[0],
		styMusic: OPTIONS.styMusic[0],
	};
}

export function getSceneTypeLabel(sceneType: SceneTypeKey) {
	return SCENE_TYPES[sceneType] ?? sceneType;
}

