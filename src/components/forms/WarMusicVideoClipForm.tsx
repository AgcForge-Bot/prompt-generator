"use client";

import { useMemo, useState } from "react";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import useToast from "@/components/forms/forest-build/useToast";

type TabKey =
	| "battle"
	| "soldiers"
	| "environment"
	| "vehicles"
	| "vfx"
	| "camera"
	| "style";

type SceneTypeKey =
	| "establishing"
	| "advance"
	| "trench"
	| "explosion"
	| "close-combat"
	| "air-support"
	| "tank"
	| "aftermath"
	| "hero-moment"
	| "finale";

type SceneConfig = {
	conflictEra: string;
	factionA: string;
	factionB: string;
	objective: string;

	soldierLook: string;
	soldierAction: string;
	soldierEmotion: string;
	soldierGear: string;
	soldierCount: string;

	envLocation: string;
	envWeather: string;
	envTime: string;
	envTerrain: string;
	envMood: string;

	vehGround: string;
	vehAir: string;
	vehNaval: string;
	vehPresence: string;

	vfxExplosions: string;
	vfxSmoke: string;
	vfxDebris: string;
	vfxFire: string;
	vfxTracers: string;

	camAngle: string;
	camMove: string;
	camLens: string;
	camShake: string;

	styleQuality: string;
	styleGrade: string;
	styleReference: string;
	styleAudio: string;

	generatedPrompt?: string;
};

const TOTAL_SCENES = 12;
const SEC_PER_SCENE = 10;

const SCENE_TYPE_LABELS: Record<SceneTypeKey, string> = {
	establishing: "Establishing Battlefield",
	advance: "Advance / Charge",
	trench: "Trench / Cover",
	explosion: "Explosion Moment",
	"close-combat": "Close Combat",
	"air-support": "Air Support",
	tank: "Tank Assault",
	aftermath: "Aftermath",
	"hero-moment": "Hero Moment",
	finale: "Finale / Victory",
};

const DEFAULT_TYPES: SceneTypeKey[] = [
	"establishing",
	"advance",
	"trench",
	"explosion",
	"close-combat",
	"air-support",
	"tank",
	"advance",
	"explosion",
	"hero-moment",
	"aftermath",
	"finale",
];

const OPTIONS = {
	conflictEra: [
		"World War II — 1944–1945 European front",
		"Modern war — 2020s urban conflict",
		"Futuristic war — near-future drones and exosuits",
		"Vietnam era — jungle warfare",
		"Desert war — armored columns and air strikes",
	],
	factionA: [
		"allied infantry platoon, mixed uniforms, gritty",
		"special forces unit with night-vision gear",
		"armored brigade support with mechanized infantry",
		"resistance fighters with improvised gear",
	],
	factionB: [
		"enemy armored infantry with steel helmets",
		"enemy mechanized unit with APC support",
		"enemy drones and robotic infantry (future)",
		"enemy militia with pickup trucks and RPGs",
	],
	objective: [
		"capture a strategic bridge under heavy fire",
		"hold the trench line against incoming assault",
		"evacuate civilians through a burning corridor",
		"push through city block to secure radio tower",
		"break through defensive line with tanks",
		"survive an ambush and regroup at extraction point",
	],

	soldierLook: [
		"mud-caked uniforms, bruised faces, exhausted eyes",
		"tactical modern uniforms, plate carriers, helmets",
		"winter coats, frost on gear, breath visible",
		"desert camo, dusty goggles, sun glare",
		"jungle fatigues, sweat, camouflage paint",
	],
	soldierAction: [
		"sprinting through rubble, taking cover",
		"firing from behind barricade, controlled bursts",
		"reloading in panic, hands shaking",
		"dragging wounded comrade to safety",
		"stacking up on doorway, entering building",
		"signaling with hand gestures under fire",
		"charging forward yelling, chaos everywhere",
	],
	soldierEmotion: [
		"fear and adrenaline, desperate survival",
		"focused determination, mission-first",
		"shock and disbelief after blast",
		"rage and intensity, unstoppable push",
		"heroic resolve, cinematic courage",
	],
	soldierGear: [
		"rifles with muzzle flash, tracer rounds",
		"grenades, smoke grenades, tactical radios",
		"bayonets and knives, close combat gear",
		"night vision goggles, IR lasers, suppressors",
		"heavy machine gun, ammo belts, tripod",
		"medic bag, tourniquets, blood-stained gloves",
	],
	soldierCount: [
		"small squad 6–10 soldiers close together",
		"platoon 20–30 soldiers spread across area",
		"large battle line 50+ soldiers in distance",
		"solo hero soldier in foreground, war behind",
	],

	envLocation: [
		"bombed-out European village street, rubble everywhere",
		"wide open field with cratered mud and barbed wire",
		"urban city block, burned cars, shattered glass",
		"mountain pass, snow and smoke, cliffs",
		"desert highway, sandstorms and wreckage",
		"jungle clearing, dense fog and rain",
	],
	envWeather: [
		"heavy rain, puddles reflecting fire and tracer rounds",
		"thick fog, limited visibility, silhouettes",
		"snow storm, wind blasting, cold haze",
		"dust storm, orange sky, particles everywhere",
		"clear night with smoke clouds illuminated by fire",
		"overcast day, gloomy and oppressive",
	],
	envTime: [
		"dawn first light, blue cold tones",
		"midday harsh sun, high contrast",
		"golden hour, warm light over devastation",
		"blue hour, dim ambient with bright fire",
		"deep night, only muzzle flashes and flares",
	],
	envTerrain: [
		"trenches, barbed wire, sandbags, cratered mud",
		"collapsed buildings, twisted metal, broken concrete",
		"forest debris, fallen trees, muddy paths",
		"street barricades, burned vehicles, broken asphalt",
		"ridge line and rocky cover points",
	],
	envMood: [
		"apocalyptic chaos, constant danger",
		"tense suspense, quiet before the storm",
		"relentless brutal realism, documentary grit",
		"heroic epic scale, cinematic war grandeur",
		"claustrophobic, smoke and darkness closing in",
	],

	vehGround: [
		"tank column rolling forward, treads crushing rubble",
		"APCs and trucks moving in convoy",
		"jeeps speeding through, soldiers hanging on",
		"burned-out wrecks lining road, no movement",
		"artillery guns firing in distance",
	],
	vehAir: [
		"fighter jets screaming overhead, sonic boom",
		"attack helicopters firing rockets, rotor wash",
		"drones swarming, red lights blinking",
		"bombers dropping payload far away",
		"no air presence",
	],
	vehNaval: [
		"warships firing distant artillery from sea",
		"landing crafts on beach under fire",
		"submarine periscope moment offshore",
		"no naval elements",
	],
	vehPresence: [
		"dominant presence, vehicles are main focus",
		"supporting role, vehicles background atmosphere",
		"brief cameo, one fast pass",
		"none, infantry-only scene",
	],

	vfxExplosions: [
		"massive shockwave explosion, dirt flying high",
		"grenade blast close to camera, debris hits lens",
		"artillery impact crater, earth erupting",
		"building collapses after explosion, dust cloud",
		"air strike impact in distance, fireball silhouette",
	],
	vfxSmoke: [
		"thick black smoke pillars rising to sky",
		"white smoke grenade screen drifting",
		"burning oil smoke dark and heavy",
		"fog mixed with smoke, low rolling haze",
	],
	vfxDebris: [
		"shattered glass and concrete dust particles floating",
		"metal shrapnel sparks, dirt clods raining down",
		"paper and ash swirling in wind",
		"brick chunks tumbling in slow motion",
	],
	vfxFire: [
		"burning cars, flames licking upward",
		"street fires in barrels and rubble pockets",
		"napalm-like fire spread across ground",
		"small embers drifting, glowing in dark smoke",
	],
	vfxTracers: [
		"tracer rounds streaking across frame, glowing lines",
		"continuous machine gun fire, bright muzzle flashes",
		"sporadic sniper shots with sparks on impact",
		"flak bursts in sky, bright flashes",
	],

	camAngle: [
		"handheld eye-level soldier POV, immersive",
		"low-angle hero shot, epic silhouette",
		"wide aerial battlefield overview, massive scale",
		"tight close-up on face, tears and dirt",
		"over-the-shoulder aiming down sights",
		"top-down drone, explosions below",
	],
	camMove: [
		"shaky handheld sprinting, chaotic energy",
		"smooth cinematic dolly through smoke",
		"slow motion push-in as explosion behind",
		"rapid whip pan following tracer fire",
		"Steadicam tracking in trench corridors",
		"hyperlapse war chaos montage",
	],
	camLens: [
		"anamorphic lens flares, cinematic bokeh",
		"wide 24mm, environment heavy",
		"telephoto 135mm, compressed action",
		"50mm natural, documentary",
		"macro close-up on shell casings",
	],
	camShake: [
		"intense camera shake from blasts",
		"moderate realistic handheld shake",
		"minimal stabilized, cinematic composed",
	],

	styleQuality: [
		"8K photorealistic cinematic war film quality",
		"Unreal Engine 5 hyperreal battlefield",
		"IMAX documentary war realism",
		"Hollywood blockbuster VFX war sequence",
	],
	styleGrade: [
		"desaturated gritty war grade, muted colors",
		"teal-orange contrast with warm fires",
		"cold blue shadows, harsh highlights",
		"warm golden but tragic, smoke hazed",
		"black-and-white documentary with film grain",
	],
	styleReference: [
		"cinematic like Saving Private Ryan realism",
		"cinematic like 1917 continuous shot vibe",
		"cinematic like Black Hawk Down urban chaos",
		"cinematic like Dunkirk aerial and beach tension",
		"cinematic like Fury tank warfare grit",
	],
	styleAudio: [
		"war cinematic soundtrack + heavy bass hits",
		"raw battlefield soundscape, intense and loud",
		"slow tragic orchestral score, emotional",
		"percussion-driven intense action rhythm",
		"music video beat synced to explosions and movement",
	],
} as const;

function rnd<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function mmss(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function getDefaultTypes(): Record<number, SceneTypeKey> {
	const map: Record<number, SceneTypeKey> = {};
	for (let i = 1; i <= TOTAL_SCENES; i++) map[i] = DEFAULT_TYPES[i - 1];
	return map;
}

function getDefaultSceneConfig(): SceneConfig {
	return {
		conflictEra: OPTIONS.conflictEra[0],
		factionA: OPTIONS.factionA[0],
		factionB: OPTIONS.factionB[0],
		objective: OPTIONS.objective[0],

		soldierLook: OPTIONS.soldierLook[0],
		soldierAction: OPTIONS.soldierAction[0],
		soldierEmotion: OPTIONS.soldierEmotion[0],
		soldierGear: OPTIONS.soldierGear[0],
		soldierCount: OPTIONS.soldierCount[0],

		envLocation: OPTIONS.envLocation[0],
		envWeather: OPTIONS.envWeather[0],
		envTime: OPTIONS.envTime[0],
		envTerrain: OPTIONS.envTerrain[0],
		envMood: OPTIONS.envMood[0],

		vehGround: OPTIONS.vehGround[0],
		vehAir: OPTIONS.vehAir[0],
		vehNaval: OPTIONS.vehNaval[0],
		vehPresence: OPTIONS.vehPresence[0],

		vfxExplosions: OPTIONS.vfxExplosions[0],
		vfxSmoke: OPTIONS.vfxSmoke[0],
		vfxDebris: OPTIONS.vfxDebris[0],
		vfxFire: OPTIONS.vfxFire[0],
		vfxTracers: OPTIONS.vfxTracers[0],

		camAngle: OPTIONS.camAngle[0],
		camMove: OPTIONS.camMove[0],
		camLens: OPTIONS.camLens[0],
		camShake: OPTIONS.camShake[0],

		styleQuality: OPTIONS.styleQuality[0],
		styleGrade: OPTIONS.styleGrade[0],
		styleReference: OPTIONS.styleReference[0],
		styleAudio: OPTIONS.styleAudio[0],
	};
}

function buildPrompt(args: {
	sceneNum: number;
	sceneType: SceneTypeKey;
	config: SceneConfig;
}) {
	const { sceneNum, sceneType, config } = args;
	const start = (sceneNum - 1) * SEC_PER_SCENE;
	const end = start + SEC_PER_SCENE;
	const typeLabel = SCENE_TYPE_LABELS[sceneType] ?? sceneType;

	const actionLines: Record<SceneTypeKey, string> = {
		establishing: `MAIN ACTION: ESTABLISHING — reveal battlefield scale, smoke pillars, distant artillery. Objective: ${config.objective}.`,
		advance: `MAIN ACTION: ADVANCE — ${config.soldierCount} pushing forward, ${config.soldierAction}.`,
		trench: `MAIN ACTION: TRENCH — soldiers in cover, ${config.soldierAction}, tension rising.`,
		explosion: `MAIN ACTION: EXPLOSION — ${config.vfxExplosions}, ${config.vfxDebris}, ${config.camShake}.`,
		"close-combat": `MAIN ACTION: CLOSE COMBAT — chaotic, intense, ${config.soldierEmotion}, sparks and debris.`,
		"air-support": `MAIN ACTION: AIR SUPPORT — ${config.vehAir}, flares, explosions in distance.`,
		tank: `MAIN ACTION: TANK ASSAULT — ${config.vehGround}, muzzle flash, shockwave, soldiers advancing.`,
		aftermath: `MAIN ACTION: AFTERMATH — smoke and silence, wounded evacuation, tragic tone.`,
		"hero-moment": `MAIN ACTION: HERO MOMENT — solo hero soldier foreground, cinematic resolve, ${config.soldierEmotion}.`,
		finale: `MAIN ACTION: FINALE — decisive moment, dramatic scale, closing shot on mission outcome.`,
	};

	return `[SCENE ${sceneNum}/${TOTAL_SCENES} | ${mmss(start)} – ${mmss(end)} | ★ ${typeLabel.toUpperCase()} ★]
THEME: War Cinematic Music Video | Intense Realistic Battlefield

${actionLines[sceneType]}

ERA: ${config.conflictEra}
FACTIONS: A — ${config.factionA} | B — ${config.factionB}
OBJECTIVE: ${config.objective}

SOLDIERS: Look — ${config.soldierLook}. Count — ${config.soldierCount}. Action — ${config.soldierAction}.
Emotion — ${config.soldierEmotion}. Gear — ${config.soldierGear}.

ENVIRONMENT: ${config.envLocation}. Weather — ${config.envWeather}. Time — ${config.envTime}.
Terrain — ${config.envTerrain}. Mood — ${config.envMood}.

VEHICLES: Ground — ${config.vehGround} (${config.vehPresence}). Air — ${config.vehAir}. Naval — ${config.vehNaval}.

VFX: Explosions — ${config.vfxExplosions}. Smoke — ${config.vfxSmoke}. Fire — ${config.vfxFire}.
Tracers — ${config.vfxTracers}. Debris — ${config.vfxDebris}.

CAMERA: ${config.camAngle}, ${config.camMove}. Lens: ${config.camLens}. Shake: ${config.camShake}.

STYLE: ${config.styleQuality}, grade: ${config.styleGrade}. Reference: ${config.styleReference}.
AUDIO: ${config.styleAudio}.

RULES: No text overlays. No watermarks. Photorealistic humans. Accurate anatomy. Avoid gore/explicit violence. Focus cinematic action and environment realism.`;
}

export default function WarMusicVideoClipForm() {
	const tabs = useMemo(
		() =>
			[
				{ key: "battle", label: "⚔️ Battle" },
				{ key: "soldiers", label: "🪖 Soldiers" },
				{ key: "environment", label: "🌧️ Environment" },
				{ key: "vehicles", label: "🚁 Vehicles" },
				{ key: "vfx", label: "💥 VFX" },
				{ key: "camera", label: "🎥 Camera" },
				{ key: "style", label: "🎞️ Style" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const { toast, show: showToast } = useToast();

	const [activeTab, setActiveTab] = useState<TabKey>("battle");
	const [currentScene, setCurrentScene] = useState(1);
	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultTypes(),
	);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);
	const [randomGroups, setRandomGroups] = useState<Record<TabKey, boolean>>(
		() => ({
			battle: true,
			soldiers: true,
			environment: true,
			vehicles: true,
			vfx: true,
			camera: true,
			style: true,
		}),
	);

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

	const scType = sceneTypes[currentScene] ?? "establishing";

	function generatePromptFor(sceneNum: number) {
		const sceneType = sceneTypes[sceneNum] ?? "establishing";
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
			const sceneType = sceneTypes[s] ?? "establishing";
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
		navigator.clipboard.writeText(
			allPrompts.join("\n\n" + "─".repeat(64) + "\n\n"),
		);
		showToast(`📋 Semua ${TOTAL_SCENES} prompt tersalin!`);
	}

	function randomizeCurrentScene() {
		const updates: Partial<SceneConfig> = {};
		if (randomGroups.battle) {
			updates.conflictEra = rnd([...OPTIONS.conflictEra]);
			updates.factionA = rnd([...OPTIONS.factionA]);
			updates.factionB = rnd([...OPTIONS.factionB]);
			updates.objective = rnd([...OPTIONS.objective]);
		}
		if (randomGroups.soldiers) {
			updates.soldierLook = rnd([...OPTIONS.soldierLook]);
			updates.soldierAction = rnd([...OPTIONS.soldierAction]);
			updates.soldierEmotion = rnd([...OPTIONS.soldierEmotion]);
			updates.soldierGear = rnd([...OPTIONS.soldierGear]);
			updates.soldierCount = rnd([...OPTIONS.soldierCount]);
		}
		if (randomGroups.environment) {
			updates.envLocation = rnd([...OPTIONS.envLocation]);
			updates.envWeather = rnd([...OPTIONS.envWeather]);
			updates.envTime = rnd([...OPTIONS.envTime]);
			updates.envTerrain = rnd([...OPTIONS.envTerrain]);
			updates.envMood = rnd([...OPTIONS.envMood]);
		}
		if (randomGroups.vehicles) {
			updates.vehGround = rnd([...OPTIONS.vehGround]);
			updates.vehAir = rnd([...OPTIONS.vehAir]);
			updates.vehNaval = rnd([...OPTIONS.vehNaval]);
			updates.vehPresence = rnd([...OPTIONS.vehPresence]);
		}
		if (randomGroups.vfx) {
			updates.vfxExplosions = rnd([...OPTIONS.vfxExplosions]);
			updates.vfxSmoke = rnd([...OPTIONS.vfxSmoke]);
			updates.vfxDebris = rnd([...OPTIONS.vfxDebris]);
			updates.vfxFire = rnd([...OPTIONS.vfxFire]);
			updates.vfxTracers = rnd([...OPTIONS.vfxTracers]);
		}
		if (randomGroups.camera) {
			updates.camAngle = rnd([...OPTIONS.camAngle]);
			updates.camMove = rnd([...OPTIONS.camMove]);
			updates.camLens = rnd([...OPTIONS.camLens]);
			updates.camShake = rnd([...OPTIONS.camShake]);
		}
		if (randomGroups.style) {
			updates.styleQuality = rnd([...OPTIONS.styleQuality]);
			updates.styleGrade = rnd([...OPTIONS.styleGrade]);
			updates.styleReference = rnd([...OPTIONS.styleReference]);
			updates.styleAudio = rnd([...OPTIONS.styleAudio]);
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
			if (randomGroups.battle) {
				updates.conflictEra = rnd([...OPTIONS.conflictEra]);
				updates.factionA = rnd([...OPTIONS.factionA]);
				updates.factionB = rnd([...OPTIONS.factionB]);
				updates.objective = rnd([...OPTIONS.objective]);
			}
			if (randomGroups.soldiers) {
				updates.soldierLook = rnd([...OPTIONS.soldierLook]);
				updates.soldierAction = rnd([...OPTIONS.soldierAction]);
				updates.soldierEmotion = rnd([...OPTIONS.soldierEmotion]);
				updates.soldierGear = rnd([...OPTIONS.soldierGear]);
				updates.soldierCount = rnd([...OPTIONS.soldierCount]);
			}
			if (randomGroups.environment) {
				updates.envLocation = rnd([...OPTIONS.envLocation]);
				updates.envWeather = rnd([...OPTIONS.envWeather]);
				updates.envTime = rnd([...OPTIONS.envTime]);
				updates.envTerrain = rnd([...OPTIONS.envTerrain]);
				updates.envMood = rnd([...OPTIONS.envMood]);
			}
			if (randomGroups.vehicles) {
				updates.vehGround = rnd([...OPTIONS.vehGround]);
				updates.vehAir = rnd([...OPTIONS.vehAir]);
				updates.vehNaval = rnd([...OPTIONS.vehNaval]);
				updates.vehPresence = rnd([...OPTIONS.vehPresence]);
			}
			if (randomGroups.vfx) {
				updates.vfxExplosions = rnd([...OPTIONS.vfxExplosions]);
				updates.vfxSmoke = rnd([...OPTIONS.vfxSmoke]);
				updates.vfxDebris = rnd([...OPTIONS.vfxDebris]);
				updates.vfxFire = rnd([...OPTIONS.vfxFire]);
				updates.vfxTracers = rnd([...OPTIONS.vfxTracers]);
			}
			if (randomGroups.camera) {
				updates.camAngle = rnd([...OPTIONS.camAngle]);
				updates.camMove = rnd([...OPTIONS.camMove]);
				updates.camLens = rnd([...OPTIONS.camLens]);
				updates.camShake = rnd([...OPTIONS.camShake]);
			}
			if (randomGroups.style) {
				updates.styleQuality = rnd([...OPTIONS.styleQuality]);
				updates.styleGrade = rnd([...OPTIONS.styleGrade]);
				updates.styleReference = rnd([...OPTIONS.styleReference]);
				updates.styleAudio = rnd([...OPTIONS.styleAudio]);
			}
			nextConfigs[s] = { ...base, ...updates };
		}
		setSceneTypes(nextTypes);
		setSceneConfigs(nextConfigs);
		showToast("🎰 Semua 12 scene di-randomize!");
		setTimeout(() => generateAll(), 50);
	}

	return (
		<div>
			<section className="card mb-5">
				<div className="section-label">⚔️ War Cinematic Music Video</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
					<div className="font-mono text-[11px] text-stone2 leading-relaxed">
						Intense Battlefield · Epic Cinematic · Music Video Beat Sync
					</div>
					<div className="flex flex-wrap gap-2 sm:justify-end">
						<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
							Durasi: <span className="text-leaf2 font-bold">2 menit</span>
						</div>
						<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
							Scene:{" "}
							<span className="text-leaf2 font-bold">
								{TOTAL_SCENES} × {SEC_PER_SCENE} detik
							</span>
						</div>
						<div className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap">
							Safety: <span className="text-leaf2 font-bold">No Gore</span>
						</div>
					</div>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">🧩 Timeline Scene</div>
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: TOTAL_SCENES }).map((_, i) => {
						const n = i + 1;
						const has = Boolean(getSceneConfig(n).generatedPrompt);
						return (
							<button
								key={n}
								type="button"
								onClick={() => {
									setCurrentScene(n);
									setTimeout(() => generatePromptFor(n), 30);
								}}
								className={`font-mono text-[10px] px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
									n === currentScene
										? "border-leaf bg-moss/20 text-leaf2"
										: has
											? "border-leaf/40 text-leaf2 bg-moss/10 hover:bg-moss/15"
											: "border-leaf/15 text-stone2 bg-bark/20 hover:border-leaf/35 hover:bg-moss/10"
								}`}
							>
								S{n} ({i * SEC_PER_SCENE}s)
							</button>
						);
					})}
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">
					🏷️ Tipe Adegan Scene
					<span className="ml-auto font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-leaf2">
						{SCENE_TYPE_LABELS[scType]}
					</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{(Object.keys(SCENE_TYPE_LABELS) as SceneTypeKey[]).map((k) => (
						<button
							key={k}
							type="button"
							onClick={() => {
								setSceneTypes((prev) => ({ ...prev, [currentScene]: k }));
								setTimeout(() => generatePromptFor(currentScene), 30);
							}}
							className={`phase-chip ${scType === k ? "active" : ""}`}
						>
							{SCENE_TYPE_LABELS[k]}
						</button>
					))}
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">🧩 Konfigurasi Detail Scene</div>
				<div className="flex flex-wrap gap-2 mb-4">
					{tabs.map((t) => (
						<button
							key={t.key}
							type="button"
							className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
							onClick={() => setActiveTab(t.key)}
						>
							{t.label}
						</button>
					))}
				</div>

				{activeTab === "battle" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Era Konflik">
							<Sel
								id="conflict-era"
								value={getSceneConfig(currentScene).conflictEra}
								onChange={(v) =>
									updateSceneConfig(currentScene, { conflictEra: v })
								}
								options={[...OPTIONS.conflictEra]}
							/>
						</Field>
						<Field label="Faksi A">
							<Sel
								id="faction-a"
								value={getSceneConfig(currentScene).factionA}
								onChange={(v) =>
									updateSceneConfig(currentScene, { factionA: v })
								}
								options={[...OPTIONS.factionA]}
							/>
						</Field>
						<Field label="Faksi B">
							<Sel
								id="faction-b"
								value={getSceneConfig(currentScene).factionB}
								onChange={(v) =>
									updateSceneConfig(currentScene, { factionB: v })
								}
								options={[...OPTIONS.factionB]}
							/>
						</Field>
						<Field label="Objective Scene">
							<Sel
								id="objective"
								value={getSceneConfig(currentScene).objective}
								onChange={(v) =>
									updateSceneConfig(currentScene, { objective: v })
								}
								options={[...OPTIONS.objective]}
							/>
						</Field>
					</div>
				) : activeTab === "soldiers" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Look Soldier">
							<Sel
								id="soldier-look"
								value={getSceneConfig(currentScene).soldierLook}
								onChange={(v) =>
									updateSceneConfig(currentScene, { soldierLook: v })
								}
								options={[...OPTIONS.soldierLook]}
							/>
						</Field>
						<Field label="Jumlah Soldier">
							<Sel
								id="soldier-count"
								value={getSceneConfig(currentScene).soldierCount}
								onChange={(v) =>
									updateSceneConfig(currentScene, { soldierCount: v })
								}
								options={[...OPTIONS.soldierCount]}
							/>
						</Field>
						<Field label="Action Soldier">
							<Sel
								id="soldier-action"
								value={getSceneConfig(currentScene).soldierAction}
								onChange={(v) =>
									updateSceneConfig(currentScene, { soldierAction: v })
								}
								options={[...OPTIONS.soldierAction]}
							/>
						</Field>
						<Field label="Emosi Soldier">
							<Sel
								id="soldier-emotion"
								value={getSceneConfig(currentScene).soldierEmotion}
								onChange={(v) =>
									updateSceneConfig(currentScene, { soldierEmotion: v })
								}
								options={[...OPTIONS.soldierEmotion]}
							/>
						</Field>
						<Field label="Gear / Senjata">
							<Sel
								id="soldier-gear"
								value={getSceneConfig(currentScene).soldierGear}
								onChange={(v) =>
									updateSceneConfig(currentScene, { soldierGear: v })
								}
								options={[...OPTIONS.soldierGear]}
							/>
						</Field>
					</div>
				) : activeTab === "environment" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Lokasi Perang">
							<Sel
								id="env-location"
								value={getSceneConfig(currentScene).envLocation}
								onChange={(v) =>
									updateSceneConfig(currentScene, { envLocation: v })
								}
								options={[...OPTIONS.envLocation]}
							/>
						</Field>
						<Field label="Cuaca">
							<Sel
								id="env-weather"
								value={getSceneConfig(currentScene).envWeather}
								onChange={(v) =>
									updateSceneConfig(currentScene, { envWeather: v })
								}
								options={[...OPTIONS.envWeather]}
							/>
						</Field>
						<Field label="Waktu">
							<Sel
								id="env-time"
								value={getSceneConfig(currentScene).envTime}
								onChange={(v) =>
									updateSceneConfig(currentScene, { envTime: v })
								}
								options={[...OPTIONS.envTime]}
							/>
						</Field>
						<Field label="Terrain">
							<Sel
								id="env-terrain"
								value={getSceneConfig(currentScene).envTerrain}
								onChange={(v) =>
									updateSceneConfig(currentScene, { envTerrain: v })
								}
								options={[...OPTIONS.envTerrain]}
							/>
						</Field>
						<Field label="Mood Battlefield">
							<Sel
								id="env-mood"
								value={getSceneConfig(currentScene).envMood}
								onChange={(v) =>
									updateSceneConfig(currentScene, { envMood: v })
								}
								options={[...OPTIONS.envMood]}
							/>
						</Field>
					</div>
				) : activeTab === "vehicles" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Ground Vehicles">
							<Sel
								id="veh-ground"
								value={getSceneConfig(currentScene).vehGround}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vehGround: v })
								}
								options={[...OPTIONS.vehGround]}
							/>
						</Field>
						<Field label="Air Support">
							<Sel
								id="veh-air"
								value={getSceneConfig(currentScene).vehAir}
								onChange={(v) => updateSceneConfig(currentScene, { vehAir: v })}
								options={[...OPTIONS.vehAir]}
							/>
						</Field>
						<Field label="Naval Elements">
							<Sel
								id="veh-naval"
								value={getSceneConfig(currentScene).vehNaval}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vehNaval: v })
								}
								options={[...OPTIONS.vehNaval]}
							/>
						</Field>
						<Field label="Vehicle Presence">
							<Sel
								id="veh-presence"
								value={getSceneConfig(currentScene).vehPresence}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vehPresence: v })
								}
								options={[...OPTIONS.vehPresence]}
							/>
						</Field>
					</div>
				) : activeTab === "vfx" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Explosions">
							<Sel
								id="vfx-explosions"
								value={getSceneConfig(currentScene).vfxExplosions}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vfxExplosions: v })
								}
								options={[...OPTIONS.vfxExplosions]}
							/>
						</Field>
						<Field label="Smoke">
							<Sel
								id="vfx-smoke"
								value={getSceneConfig(currentScene).vfxSmoke}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vfxSmoke: v })
								}
								options={[...OPTIONS.vfxSmoke]}
							/>
						</Field>
						<Field label="Fire">
							<Sel
								id="vfx-fire"
								value={getSceneConfig(currentScene).vfxFire}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vfxFire: v })
								}
								options={[...OPTIONS.vfxFire]}
							/>
						</Field>
						<Field label="Tracers / Gunfire">
							<Sel
								id="vfx-tracers"
								value={getSceneConfig(currentScene).vfxTracers}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vfxTracers: v })
								}
								options={[...OPTIONS.vfxTracers]}
							/>
						</Field>
						<Field label="Debris / Partikel">
							<Sel
								id="vfx-debris"
								value={getSceneConfig(currentScene).vfxDebris}
								onChange={(v) =>
									updateSceneConfig(currentScene, { vfxDebris: v })
								}
								options={[...OPTIONS.vfxDebris]}
							/>
						</Field>
					</div>
				) : activeTab === "camera" ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<Field label="Camera Angle">
							<Sel
								id="cam-angle"
								value={getSceneConfig(currentScene).camAngle}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camAngle: v })
								}
								options={[...OPTIONS.camAngle]}
							/>
						</Field>
						<Field label="Camera Move">
							<Sel
								id="cam-move"
								value={getSceneConfig(currentScene).camMove}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camMove: v })
								}
								options={[...OPTIONS.camMove]}
							/>
						</Field>
						<Field label="Lens">
							<Sel
								id="cam-lens"
								value={getSceneConfig(currentScene).camLens}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camLens: v })
								}
								options={[...OPTIONS.camLens]}
							/>
						</Field>
						<Field label="Camera Shake">
							<Sel
								id="cam-shake"
								value={getSceneConfig(currentScene).camShake}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camShake: v })
								}
								options={[...OPTIONS.camShake]}
							/>
						</Field>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Quality">
							<Sel
								id="style-quality"
								value={getSceneConfig(currentScene).styleQuality}
								onChange={(v) =>
									updateSceneConfig(currentScene, { styleQuality: v })
								}
								options={[...OPTIONS.styleQuality]}
							/>
						</Field>
						<Field label="Color Grade">
							<Sel
								id="style-grade"
								value={getSceneConfig(currentScene).styleGrade}
								onChange={(v) =>
									updateSceneConfig(currentScene, { styleGrade: v })
								}
								options={[...OPTIONS.styleGrade]}
							/>
						</Field>
						<Field label="Reference Film Style">
							<Sel
								id="style-ref"
								value={getSceneConfig(currentScene).styleReference}
								onChange={(v) =>
									updateSceneConfig(currentScene, { styleReference: v })
								}
								options={[...OPTIONS.styleReference]}
							/>
						</Field>
						<Field label="Audio / Beat">
							<Sel
								id="style-audio"
								value={getSceneConfig(currentScene).styleAudio}
								onChange={(v) =>
									updateSceneConfig(currentScene, { styleAudio: v })
								}
								options={[...OPTIONS.styleAudio]}
							/>
						</Field>
					</div>
				)}
			</section>

			<section className="card mb-5">
				<div className="section-label">🎲 Random Generator</div>
				<div className="flex flex-wrap gap-2">
					{(tabs.map((t) => t.key) as TabKey[]).map((k) => (
						<label
							key={k}
							className={`rnd-toggle ${randomGroups[k] ? "checked" : ""}`}
						>
							<input
								type="checkbox"
								checked={randomGroups[k]}
								onChange={() => setRandomGroups((p) => ({ ...p, [k]: !p[k] }))}
							/>
							<span className="capitalize">{k}</span>
						</label>
					))}
				</div>
				<div className="flex flex-wrap gap-2 mt-3">
					<button
						type="button"
						className="btn-outline"
						onClick={randomizeCurrentScene}
					>
						🎲 Random Scene Ini
					</button>
					<button
						type="button"
						className="btn-outline"
						onClick={randomAllScenes}
					>
						🎰 Random Semua 12 Scene
					</button>
					<button type="button" className="btn-amber" onClick={randomSceneType}>
						🎴 Random Tipe Adegan
					</button>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">📝 Generated Prompt</div>
				<div className="flex items-center gap-2 mb-3">
					<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-stone2">
						Scene {currentScene} / {TOTAL_SCENES}
					</span>
					<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-moss/15 text-leaf2">
						{SCENE_TYPE_LABELS[scType]}
					</span>
				</div>
				<div className="prompt-box">{promptOutput}</div>
				<div className="flex flex-wrap gap-2 mt-3">
					<button
						type="button"
						className="btn-primary"
						onClick={generatePrompt}
					>
						⚡ Generate Prompt
					</button>
					<button type="button" className="btn-outline" onClick={copyPrompt}>
						📋 Copy
					</button>
					<button type="button" className="btn-amber" onClick={nextScene}>
						Scene Berikutnya →
					</button>
				</div>
			</section>

			<section className="card mb-5">
				<div className="section-label">📦 Export Semua Prompt</div>
				<div className="flex flex-wrap gap-2">
					<button type="button" className="btn-primary" onClick={generateAll}>
						🎬 Generate Semua 12 Prompt
					</button>
					<button type="button" className="btn-outline" onClick={copyAll}>
						📋 Copy Semua
					</button>
					<button
						type="button"
						className="btn-ghost"
						onClick={() => setShowAllPrompts((v) => !v)}
					>
						👁 Lihat / Sembunyikan
					</button>
				</div>
				{showAllPrompts && allPrompts.length > 0 && (
					<div className="mt-4 flex flex-col gap-2">
						{allPrompts.map((p, i) => {
							const s = i + 1;
							const sceneType = sceneTypes[s] ?? "establishing";
							const label = SCENE_TYPE_LABELS[sceneType];
							return (
								<div
									key={s}
									className="rounded-lg border border-leaf/15 bg-bark/20 p-3"
								>
									<div className="font-mono text-[10px] text-stone2 mb-2">
										◆ Scene {s}/{TOTAL_SCENES} · {i * SEC_PER_SCENE}s–
										{(i + 1) * SEC_PER_SCENE}s ·{" "}
										<span className="text-leaf2">[{label}]</span>
									</div>
									<pre className="font-mono text-[10px] text-stone2 whitespace-pre-wrap leading-relaxed">
										{p}
									</pre>
								</div>
							);
						})}
					</div>
				)}
			</section>

			<div
				className={`toast-base bg-moss/95 text-white transition-all ${
					toast.show
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
				}`}
			>
				{toast.msg}
			</div>
		</div>
	);
}
