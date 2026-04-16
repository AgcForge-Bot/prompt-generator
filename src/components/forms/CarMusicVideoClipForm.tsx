"use client";

import { useMemo, useState } from "react";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import useToast from "@/components/forms/forest-build/useToast";

type TabKey =
	| "cars"
	| "dj"
	| "crowd"
	| "location"
	| "lighting"
	| "props"
	| "camera";

type SceneTypeKey =
	| "dj-party"
	| "street-race"
	| "crowd"
	| "car-show"
	| "engine"
	| "street-drift"
	| "hero-shot"
	| "night-vibe";

type SceneConfig = {
	carHero: string;
	carSecondary: string;
	carAction: string;
	carDetail: string;
	carColor: string;
	carCount: string;

	djType: string;
	djSetup: string;
	djAction: string;
	djOutfit: string;
	djFx: string;
	djSound: string;

	crowdMix: string;
	crowdEnergy: string;
	crowdAction: string;
	crowdFashion: string;
	crowdDensity: string;
	crowdMoment: string;

	locMain: string;
	locTime: string;
	locPalette: string;
	locAtmo: string;

	lightMain: string;
	lightFx: string;
	lightColor: string;
	lightShadow: string;

	propFire: string;
	propSmoke: string;
	propAnimal: string;
	propDeco: string;
	propChar: string;
	propSfx: string;

	camAngle: string;
	camMove: string;
	camMood: string;
	camQuality: string;
	camGrade: string;
	camLens: string;

	generatedPrompt?: string;
};

const TOTAL_SCENES = 12;
const SEC_PER_SCENE = 10;

const SCENE_TYPE_LABELS: Record<SceneTypeKey, string> = {
	"dj-party": "DJ Freestyle Party",
	"street-race": "Aksi Balapan",
	crowd: "Penonton Antusias",
	"car-show": "Car Show / Parkir",
	engine: "Raungan Mesin",
	"street-drift": "Drift Jalanan",
	"hero-shot": "Hero Shot Sinematik",
	"night-vibe": "Night Vibe",
};

const DEFAULT_TYPES: SceneTypeKey[] = [
	"car-show",
	"dj-party",
	"crowd",
	"street-race",
	"engine",
	"street-drift",
	"hero-shot",
	"night-vibe",
	"dj-party",
	"crowd",
	"street-race",
	"hero-shot",
];

const OPTIONS = {
	carHero: [
		"Nissan Skyline GTR R34, midnight purple",
		"Mitsubishi Eclipse GSX, neon orange wrap",
		"Mazda RX-7 FD, electric blue",
		"Toyota Supra MK4, chrome gold",
		"Honda Civic EG hatchback, slammed, wide-body",
		"Dodge Charger SRT, matte black",
		"Ford Mustang GT500, candy red",
		"Lamborghini Huracán, pearl white",
		"Subaru Impreza WRX STI, rally blue",
		"Nissan 240SX S13, kouki, gunmetal",
	],
	carSecondary: [
		"5–8 colorful JDM cars parked in formation",
		"row of lowered muscle cars, chrome rims gleaming",
		"mix of exotic supercars, hoods open showing engines",
		"lifted trucks and baja buggies flanking the road",
		"line of slammed hatchbacks with underglow neon",
		"vintage American classics and modern hypercars mixed",
	],
	carAction: [
		"full throttle burnout, thick white smoke clouds",
		"aggressive drift sideways, tire screech",
		"dramatic launch, front wheels lifting off ground",
		"stationary, engine revving, hood vibrating",
		"slow cruise through crowd parting the way",
		"high-speed flyby with motion blur",
		"spinning donuts in center of crowd circle",
		"parked showpiece, low with air suspension",
	],
	carDetail: [
		"underglow neon strips, glowing brake calipers",
		"exhaust flames shooting, turbo whistle visible steam",
		"chrome deep-dish rims spinning, wide fender flares",
		"custom decals, carbon fiber hood, pop-up headlights",
		"roof rack, roll cage visible, racing harness",
		"hydraulic suspension bouncing, hydraulic pumps exposed",
		"racing exhaust pipes glowing red hot, side exit",
	],
	carColor: [
		"vibrant multi-color neon wraps across all cars",
		"all-black fleet with red accent trim",
		"orange and white Fast & Furious palette",
		"JDM rainbow — blue, yellow, red, green",
		"chrome and metallic mixed tones",
		"monochrome grey and black with cyan lighting",
	],
	carCount: [
		"hero car solo, crowd in background",
		"2 cars side by side, head-to-head",
		"3–5 cars in dynamic formation",
		"large convoy 10+ cars stretching to horizon",
		"dozens parked, 1 hero car center stage",
	],

	djType: [
		"male DJ, athletic build, 25s, confident swagger",
		"female DJ, fierce expression, commanding energy",
		"masked mystery DJ, LED skull helmet",
		"twin DJs performing back-to-back",
		"DJ with glowing cyborg arm enhancements",
	],
	djSetup: [
		"full Pioneer CDJ setup on car hood",
		"massive DJ booth mounted on flatbed truck",
		"portable deck on rooftop, city below",
		"turntables on industrial cable spool, outdoor",
		"raised stage with LED wall backdrop and trusses",
		"DJ inside open garage, crowd outside",
	],
	djAction: [
		"hands raised, crowd hyping with both arms",
		"intense scratch performance, headphones on neck",
		"jumping on DJ booth, fist pumping to beat",
		"leaning into crowd, face ecstatic and electric",
		"spinning and pointing at crowd",
		"dramatic drop pose, crouching at bass hit",
		"slow cinematic hero walk toward camera",
	],
	djOutfit: [
		"open chest leather jacket, gold chain, cap backward",
		"all-black streetwear, neon LED strips on jacket",
		"sleeveless hoodie, tattoos visible, chain necklaces",
		"racing jacket customized with DJ patches",
		"futuristic metallic suit, visor sunglasses",
		"casual tank top, ripped jeans, snapback",
	],
	djFx: [
		"confetti explosion, colored smoke cannons",
		"laser beams shooting from stage into crowd",
		"giant CO2 cannons blasting cold vapor",
		"sparks raining down from overhead rig",
		"massive fireworks burst above DJ",
		"flame thrower jets left and right of stage",
	],
	djSound: [
		"visible bass waves distorting air around speakers",
		"equalizer light bars reacting on DJ table",
		"subwoofer vibrating hood of nearby car",
		"frequency rings emanating from speakers",
		"music reactive LED floor pulsing to beat",
	],

	crowdMix: [
		"diverse mixed crowd, male and female 50/50",
		"mostly young adults 18–30, street fashion",
		"car enthusiasts with branded merchandise",
		"multicultural international crowd",
		"influencer types, phones raised recording",
	],
	crowdEnergy: [
		"hands up screaming with euphoric energy",
		"circle pit forming around drifting car",
		"swaying in unison to deep bass drops",
		"jumping wildly, crowd surfing",
		"fists raised chanting, stadium energy",
		"awed silence watching burnout, then erupting",
	],
	crowdAction: [
		"filming on phones, flashes everywhere",
		"dancing freely, breaking freestyle moves",
		"cheering wildly as car spins donuts",
		"leaning on cars posing, looking cool",
		"pouring drinks, toasting in celebration",
		"parting like a sea as hero car approaches",
	],
	crowdFashion: [
		"streetwear — hoodies, Jordans, caps, chains",
		"car show style — racing jackets, brand tees",
		"festival EDM fashion, crop tops and neon",
		"biker and urban mixed aesthetic",
		"luxury streetwear — Balenciaga, Off-White",
	],
	crowdDensity: [
		"massive packed crowd hundreds deep",
		"tight inner circle 50–80 people",
		"scattered groups across wide area",
		"VIP section close, general crowd behind barrier",
	],
	crowdMoment: [
		"collective euphoria at bass drop moment",
		"shock and awe at car stunt performance",
		"singing along to recognizable music hook",
		"golden hour glow over jubilant crowd",
		"night crowd lit by stage and car headlights",
	],

	locMain: [
		"abandoned multilevel parking structure, graffiti walls",
		"winding mountain canyon road, steep cliff edge",
		"downtown city street blocked off, skyscrapers towering",
		"rooftop of high-rise building, city skyline 360°",
		"industrial port with shipping containers and cranes",
		"dense forest road tunnel of trees at night",
		"airport runway, deserted, massive open flat tarmac",
		"underground storm drain tunnel, Los Angeles vibes",
		"beach road at sunset, ocean waves on one side",
		"massive concrete plaza, urban brutalist architecture",
		"abandoned factory floor, industrial ruins",
		"bridge overpass with city lights below",
	],
	locTime: [
		"deep night, 2AM illegal street race atmosphere",
		"golden hour dusk, warm orange amber glow",
		"blue hour magic, navy sky, city lights waking",
		"foggy midnight, visibility limited, dramatic",
		"stormy night, light rain, wet reflective ground",
		"overcast day, flat dramatic diffused light",
		"neon-drenched night, cyberpunk city glow",
		"dawn first light, purple pink horizon",
	],
	locPalette: [
		"orange and teal cinematic contrast",
		"neon purple and deep blue night",
		"red and black aggressive power palette",
		"warm fire amber and dark shadows",
		"green forest and headlight white",
		"cyan and charcoal urban cold palette",
		"golden hour warm glow over everything",
	],
	locAtmo: [
		"tire smoke drifting across ground, low rolling fog",
		"heavy rain, puddle reflections of neon lights",
		"dry desert heat shimmer distortion on horizon",
		"cold mountain air, visible breath and mist",
		"humid tropical night, warm air haze",
		"concrete dust kicked up from burnouts",
		"smoke machine ground fog mixed with crowd steam",
	],

	lightMain: [
		"massive LED truss rigs overhead, concert-grade",
		"car headlights as primary source, dramatic forward beams",
		"sodium street lamps, warm amber pools of light",
		"natural golden hour backlight, rim lighting everything",
		"neon signs and storefronts washing scene in color",
		"bonfire and barrel fires, flickering warm orange",
		"stadium floodlights, hard top-down shadows",
	],
	lightFx: [
		"strobing laser grid cutting through tire smoke",
		"moving head spot lights sweeping crowd and cars",
		"LED underglow reflecting off wet tarmac",
		"flame effects casting dramatic dancing shadows",
		"anamorphic lens flares from car lights",
		"CO2 cryo jet beams lit from below",
		"sparkler shower raining from overhead rig",
	],
	lightColor: [
		"deep red and amber — aggressive, powerful",
		"cyan and electric blue — cool and sharp",
		"purple and magenta — euphoric night vibe",
		"warm orange and gold — fire and heat",
		"green matrix style — underground rebel",
		"white strobe with color washes — rave energy",
		"full RGB spectrum cycling — festival mayhem",
	],
	lightShadow: [
		"extreme high contrast, deep blacks, bright highlights",
		"soft diffused fill, cinematic balanced exposure",
		"silhouette moments, backlit against bright sky",
		"single harsh sidelight, half face in shadow",
		"volumetric god rays through smoke and haze",
		"multiple shadow angles, chaotic energy",
	],

	propFire: [
		"steel barrel drums with roaring fire, lined roadside",
		"flame throwers erupting from stage left and right",
		"exhaust backfire shooting 2-foot flames",
		"bonfire center of crowd circle, sparks flying",
		"tiki torches lining entrance pathway",
		"fire breathing performer in crowd",
		"molotov cocktail-style fire decoration props",
	],
	propSmoke: [
		"thick white tire smoke blanketing ground",
		"colored smoke grenades — orange and purple",
		"cold CO2 cryo jets creating ground fog",
		"cigarette and cigar smoke clouds in crowd",
		"smoke cannons from DJ booth blasting upward",
	],
	propAnimal: [
		"massive Rottweiler on leash beside car owner",
		"white pit bull sitting proud on car hood",
		"pair of black panthers on chains flanking DJ stage",
		"trained hawk circling overhead scene dramatically",
		"two Dobermans standing guard at car convoy",
		"exotic white lion cub in VIP area",
		"no animal — focus on cars and people",
	],
	propDeco: [
		"massive speaker stacks on flatbed trucks",
		"neon signs — \"NO LIMIT\" \"FAST LIFE\" \"STREET KINGS\"",
		"racing flags and checkered banners everywhere",
		"trophy stands with gold cups, product placements",
		"scaffolding VIP towers with views over crowd",
		"spray paint artists doing live murals on walls",
		"food trucks and mobile bars surrounding perimeter",
	],
	propChar: [
		"gold chains, Rolex watches, diamond grills",
		"bandanas, backwards caps, sunglasses at night",
		"racing gloves and helmets worn casually",
		"phones recording, selfie sticks extended",
		"drinks in hand — bottles raised, cups spilling",
	],
	propSfx: [
		"confetti cannon burst raining down on crowd",
		"low-crawl fog machine across entire ground",
		"fireworks finale over cars and crowd",
		"giant balloons and inflatables floating",
		"glitter shower from ceiling rig",
	],

	camAngle: [
		"ultra-low tracking at wheel level",
		"aerial drone wide establishing shot",
		"tight close-up on face — sweat, intensity",
		"driver POV through windshield",
		"over-shoulder toward crowd horizon",
		"360 orbit spin around hero car",
		"wide Dutch tilt — dynamic energy",
		"God's eye top-down looking straight down",
	],
	camMove: [
		"fast aggressive push-in dolly",
		"slow dramatic cinematic pullback reveal",
		"handheld frenetic energy shake",
		"smooth stabilized Steadicam glide through crowd",
		"rapid whip pan transition between subjects",
		"hyperlapse crowd energy compression",
		"crane rising up from ground to sky",
	],
	camMood: [
		"testosterone-fueled raw adrenaline energy",
		"cool underground rebel outlaw vibes",
		"euphoric rave party electric atmosphere",
		"epic blockbuster cinematic power",
		"gritty guerrilla street documentary feel",
		"luxury glamour and high-octane excess",
	],
	camQuality: [
		"8K ultra-cinematic photorealistic",
		"Unreal Engine 5 hyperreal quality",
		"RED IMAX camera system quality",
		"Hollywood blockbuster VFX CGI quality",
	],
	camGrade: [
		"teal-orange high-contrast Hollywood LUT",
		"warm red-amber aggressive grade",
		"desaturated gritty noir with color accents",
		"vivid oversaturated punch, deep blacks",
		"bleach bypass filmic grain texture",
		"blue shadow orange highlight fast film look",
	],
	camLens: [
		"wide-angle 16mm, exaggerated perspective",
		"telephoto 200mm compressed crowd bokeh",
		"anamorphic lens flares and oval bokeh",
		"fisheye 8mm extreme distortion energy",
		"50mm natural film-like perspective",
		"macro extreme close-up on details",
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
		"dj-party": `MAIN ACTION: DJ FREESTYLE — ${config.djAction}. Setup: ${config.djSetup}. Effect: ${config.djFx}. ${config.djSound}.`,
		"street-race": `MAIN ACTION: STREET RACE — Hero car ${config.carAction}. ${config.carCount} in frame. ${config.carDetail}.`,
		crowd: `MAIN ACTION: CROWD ENERGY — ${config.crowdEnergy}. ${config.crowdAction}. ${config.crowdMoment}.`,
		"car-show": `MAIN ACTION: CAR SHOW DISPLAY — ${config.carCount}, ${config.carColor}. ${config.carDetail}. Crowd: ${config.crowdMix}.`,
		engine: `MAIN ACTION: ENGINE ROAR — ${config.carHero} ${config.carAction}. Close-up engine bay/exhaust. ${config.carDetail}.`,
		"street-drift": `MAIN ACTION: DRIFT SEQUENCE — ${config.carHero} drifting sideways. ${config.carAction}. Smoke: ${config.propSmoke}.`,
		"hero-shot": `MAIN ACTION: CINEMATIC HERO SHOT — ${config.djType} and hero car together. ${config.djAction}. Dramatic pose, epic scale.`,
		"night-vibe": `MAIN ACTION: NIGHT ATMOSPHERE — ${config.crowdMoment}. ${config.crowdAction}. Fire: ${config.propFire}.`,
	};

	return `[SCENE ${sceneNum}/${TOTAL_SCENES} | ${mmss(start)} – ${mmss(end)} | ★ ${typeLabel.toUpperCase()} ★]
THEME: Fast & Furious Car Party × DJ Music Video | Semi-Cinematic Realistic

${actionLines[sceneType] ?? actionLines["dj-party"]}

CARS: ${config.carHero}. Background: ${config.carSecondary}. Color scheme: ${config.carColor}.

DJ SETUP: ${config.djType} wearing ${config.djOutfit}. Platform: ${config.djSetup}.

CROWD: ${config.crowdMix}, ${config.crowdDensity}. Fashion: ${config.crowdFashion}.

LOCATION: ${config.locMain} | Time: ${config.locTime} | Palette: ${config.locPalette} | Atmo: ${config.locAtmo}.

LIGHTING: ${config.lightMain}. Effects: ${config.lightFx}. Colors: ${config.lightColor}. ${config.lightShadow}.

PROPS: Fire — ${config.propFire}. Smoke — ${config.propSmoke}. Animal — ${config.propAnimal}. Deco — ${config.propDeco}. SFX — ${config.propSfx}.

CAMERA: ${config.camAngle}, ${config.camMove}. Lens: ${config.camLens}. Mood: ${config.camMood}.

STYLE: ${config.camQuality}, ${config.camGrade}. No watermarks. No text overlays. Photorealistic humans and animals. Semi-cinematic music video production quality.`;
}

export default function CarMusicVideoClipForm() {
	const tabs = useMemo(
		() =>
			[
				{ key: "cars", label: "🚗 Mobil" },
				{ key: "dj", label: "🎧 DJ" },
				{ key: "crowd", label: "🙌 Penonton" },
				{ key: "location", label: "📍 Lokasi" },
				{ key: "lighting", label: "💡 Lighting" },
				{ key: "props", label: "🔥 Props" },
				{ key: "camera", label: "🎬 Kamera" },
			] as { key: TabKey; label: string }[],
		[],
	);

	const { toast, show: showToast } = useToast();

	const [activeTab, setActiveTab] = useState<TabKey>("cars");
	const [currentScene, setCurrentScene] = useState(1);
	const [sceneTypes, setSceneTypes] = useState<Record<number, SceneTypeKey>>(
		() => getDefaultTypes(),
	);
	const [sceneConfigs, setSceneConfigs] = useState<Record<number, SceneConfig>>(
		() => ({}),
	);
	const [randomGroups, setRandomGroups] = useState<
		Record<TabKey, boolean>
	>(() => ({
		cars: true,
		dj: true,
		crowd: true,
		location: true,
		lighting: true,
		props: true,
		camera: true,
	}));

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

	const scType = sceneTypes[currentScene] ?? "dj-party";

	function generatePromptFor(sceneNum: number) {
		const sceneType = sceneTypes[sceneNum] ?? "dj-party";
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
			const sceneType = sceneTypes[s] ?? "dj-party";
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
		if (randomGroups.cars) {
			updates.carHero = rnd([...OPTIONS.carHero]);
			updates.carSecondary = rnd([...OPTIONS.carSecondary]);
			updates.carAction = rnd([...OPTIONS.carAction]);
			updates.carDetail = rnd([...OPTIONS.carDetail]);
			updates.carColor = rnd([...OPTIONS.carColor]);
			updates.carCount = rnd([...OPTIONS.carCount]);
		}
		if (randomGroups.dj) {
			updates.djType = rnd([...OPTIONS.djType]);
			updates.djSetup = rnd([...OPTIONS.djSetup]);
			updates.djAction = rnd([...OPTIONS.djAction]);
			updates.djOutfit = rnd([...OPTIONS.djOutfit]);
			updates.djFx = rnd([...OPTIONS.djFx]);
			updates.djSound = rnd([...OPTIONS.djSound]);
		}
		if (randomGroups.crowd) {
			updates.crowdMix = rnd([...OPTIONS.crowdMix]);
			updates.crowdEnergy = rnd([...OPTIONS.crowdEnergy]);
			updates.crowdAction = rnd([...OPTIONS.crowdAction]);
			updates.crowdFashion = rnd([...OPTIONS.crowdFashion]);
			updates.crowdDensity = rnd([...OPTIONS.crowdDensity]);
			updates.crowdMoment = rnd([...OPTIONS.crowdMoment]);
		}
		if (randomGroups.location) {
			updates.locMain = rnd([...OPTIONS.locMain]);
			updates.locTime = rnd([...OPTIONS.locTime]);
			updates.locPalette = rnd([...OPTIONS.locPalette]);
			updates.locAtmo = rnd([...OPTIONS.locAtmo]);
		}
		if (randomGroups.lighting) {
			updates.lightMain = rnd([...OPTIONS.lightMain]);
			updates.lightFx = rnd([...OPTIONS.lightFx]);
			updates.lightColor = rnd([...OPTIONS.lightColor]);
			updates.lightShadow = rnd([...OPTIONS.lightShadow]);
		}
		if (randomGroups.props) {
			updates.propFire = rnd([...OPTIONS.propFire]);
			updates.propSmoke = rnd([...OPTIONS.propSmoke]);
			updates.propAnimal = rnd([...OPTIONS.propAnimal]);
			updates.propDeco = rnd([...OPTIONS.propDeco]);
			updates.propChar = rnd([...OPTIONS.propChar]);
			updates.propSfx = rnd([...OPTIONS.propSfx]);
		}
		if (randomGroups.camera) {
			updates.camAngle = rnd([...OPTIONS.camAngle]);
			updates.camMove = rnd([...OPTIONS.camMove]);
			updates.camMood = rnd([...OPTIONS.camMood]);
			updates.camQuality = rnd([...OPTIONS.camQuality]);
			updates.camGrade = rnd([...OPTIONS.camGrade]);
			updates.camLens = rnd([...OPTIONS.camLens]);
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
			if (randomGroups.cars) {
				updates.carHero = rnd([...OPTIONS.carHero]);
				updates.carSecondary = rnd([...OPTIONS.carSecondary]);
				updates.carAction = rnd([...OPTIONS.carAction]);
				updates.carDetail = rnd([...OPTIONS.carDetail]);
				updates.carColor = rnd([...OPTIONS.carColor]);
				updates.carCount = rnd([...OPTIONS.carCount]);
			}
			if (randomGroups.dj) {
				updates.djType = rnd([...OPTIONS.djType]);
				updates.djSetup = rnd([...OPTIONS.djSetup]);
				updates.djAction = rnd([...OPTIONS.djAction]);
				updates.djOutfit = rnd([...OPTIONS.djOutfit]);
				updates.djFx = rnd([...OPTIONS.djFx]);
				updates.djSound = rnd([...OPTIONS.djSound]);
			}
			if (randomGroups.crowd) {
				updates.crowdMix = rnd([...OPTIONS.crowdMix]);
				updates.crowdEnergy = rnd([...OPTIONS.crowdEnergy]);
				updates.crowdAction = rnd([...OPTIONS.crowdAction]);
				updates.crowdFashion = rnd([...OPTIONS.crowdFashion]);
				updates.crowdDensity = rnd([...OPTIONS.crowdDensity]);
				updates.crowdMoment = rnd([...OPTIONS.crowdMoment]);
			}
			if (randomGroups.location) {
				updates.locMain = rnd([...OPTIONS.locMain]);
				updates.locTime = rnd([...OPTIONS.locTime]);
				updates.locPalette = rnd([...OPTIONS.locPalette]);
				updates.locAtmo = rnd([...OPTIONS.locAtmo]);
			}
			if (randomGroups.lighting) {
				updates.lightMain = rnd([...OPTIONS.lightMain]);
				updates.lightFx = rnd([...OPTIONS.lightFx]);
				updates.lightColor = rnd([...OPTIONS.lightColor]);
				updates.lightShadow = rnd([...OPTIONS.lightShadow]);
			}
			if (randomGroups.props) {
				updates.propFire = rnd([...OPTIONS.propFire]);
				updates.propSmoke = rnd([...OPTIONS.propSmoke]);
				updates.propAnimal = rnd([...OPTIONS.propAnimal]);
				updates.propDeco = rnd([...OPTIONS.propDeco]);
				updates.propChar = rnd([...OPTIONS.propChar]);
				updates.propSfx = rnd([...OPTIONS.propSfx]);
			}
			if (randomGroups.camera) {
				updates.camAngle = rnd([...OPTIONS.camAngle]);
				updates.camMove = rnd([...OPTIONS.camMove]);
				updates.camMood = rnd([...OPTIONS.camMood]);
				updates.camQuality = rnd([...OPTIONS.camQuality]);
				updates.camGrade = rnd([...OPTIONS.camGrade]);
				updates.camLens = rnd([...OPTIONS.camLens]);
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
				<div className="section-label">🚗 Fast & Furious Car Party × DJ</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
					<div className="font-mono text-[11px] text-stone2 leading-relaxed">
						Cinematic Street Racing · Music Car Party · DJ Freestyle
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
							Mode: <span className="text-leaf2 font-bold">Semi-Cinematic</span>
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

				{activeTab === "cars" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Hero Car (Utama)">
							<Sel
								id="car-hero"
								value={getSceneConfig(currentScene).carHero}
								onChange={(v) => updateSceneConfig(currentScene, { carHero: v })}
								options={[...OPTIONS.carHero]}
							/>
						</Field>
						<Field label="Secondary Cars (Latar)">
							<Sel
								id="car-secondary"
								value={getSceneConfig(currentScene).carSecondary}
								onChange={(v) =>
									updateSceneConfig(currentScene, { carSecondary: v })
								}
								options={[...OPTIONS.carSecondary]}
							/>
						</Field>
						<Field label="Aksi Hero Car">
							<Sel
								id="car-action"
								value={getSceneConfig(currentScene).carAction}
								onChange={(v) =>
									updateSceneConfig(currentScene, { carAction: v })
								}
								options={[...OPTIONS.carAction]}
							/>
						</Field>
						<Field label="Detail Visual Mobil">
							<Sel
								id="car-detail"
								value={getSceneConfig(currentScene).carDetail}
								onChange={(v) =>
									updateSceneConfig(currentScene, { carDetail: v })
								}
								options={[...OPTIONS.carDetail]}
							/>
						</Field>
						<Field label="Warna Dominan Mobil">
							<Sel
								id="car-color"
								value={getSceneConfig(currentScene).carColor}
								onChange={(v) =>
									updateSceneConfig(currentScene, { carColor: v })
								}
								options={[...OPTIONS.carColor]}
							/>
						</Field>
						<Field label="Jumlah Mobil di Frame">
							<Sel
								id="car-count"
								value={getSceneConfig(currentScene).carCount}
								onChange={(v) =>
									updateSceneConfig(currentScene, { carCount: v })
								}
								options={[...OPTIONS.carCount]}
							/>
						</Field>
					</div>
				) : activeTab === "dj" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Penampilan DJ">
							<Sel
								id="dj-type"
								value={getSceneConfig(currentScene).djType}
								onChange={(v) => updateSceneConfig(currentScene, { djType: v })}
								options={[...OPTIONS.djType]}
							/>
						</Field>
						<Field label="Setup DJ">
							<Sel
								id="dj-setup"
								value={getSceneConfig(currentScene).djSetup}
								onChange={(v) => updateSceneConfig(currentScene, { djSetup: v })}
								options={[...OPTIONS.djSetup]}
							/>
						</Field>
						<Field label="Aksi DJ Freestyle">
							<Sel
								id="dj-action"
								value={getSceneConfig(currentScene).djAction}
								onChange={(v) =>
									updateSceneConfig(currentScene, { djAction: v })
								}
								options={[...OPTIONS.djAction]}
							/>
						</Field>
						<Field label="Outfit DJ">
							<Sel
								id="dj-outfit"
								value={getSceneConfig(currentScene).djOutfit}
								onChange={(v) =>
									updateSceneConfig(currentScene, { djOutfit: v })
								}
								options={[...OPTIONS.djOutfit]}
							/>
						</Field>
						<Field label="Visual Effect DJ">
							<Sel
								id="dj-fx"
								value={getSceneConfig(currentScene).djFx}
								onChange={(v) => updateSceneConfig(currentScene, { djFx: v })}
								options={[...OPTIONS.djFx]}
							/>
						</Field>
						<Field label="Sound Visualizer">
							<Sel
								id="dj-sound"
								value={getSceneConfig(currentScene).djSound}
								onChange={(v) =>
									updateSceneConfig(currentScene, { djSound: v })
								}
								options={[...OPTIONS.djSound]}
							/>
						</Field>
					</div>
				) : activeTab === "crowd" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Komposisi Penonton">
							<Sel
								id="crowd-mix"
								value={getSceneConfig(currentScene).crowdMix}
								onChange={(v) =>
									updateSceneConfig(currentScene, { crowdMix: v })
								}
								options={[...OPTIONS.crowdMix]}
							/>
						</Field>
						<Field label="Energi Penonton">
							<Sel
								id="crowd-energy"
								value={getSceneConfig(currentScene).crowdEnergy}
								onChange={(v) =>
									updateSceneConfig(currentScene, { crowdEnergy: v })
								}
								options={[...OPTIONS.crowdEnergy]}
							/>
						</Field>
						<Field label="Aksi Penonton">
							<Sel
								id="crowd-action"
								value={getSceneConfig(currentScene).crowdAction}
								onChange={(v) =>
									updateSceneConfig(currentScene, { crowdAction: v })
								}
								options={[...OPTIONS.crowdAction]}
							/>
						</Field>
						<Field label="Fashion Penonton">
							<Sel
								id="crowd-fashion"
								value={getSceneConfig(currentScene).crowdFashion}
								onChange={(v) =>
									updateSceneConfig(currentScene, { crowdFashion: v })
								}
								options={[...OPTIONS.crowdFashion]}
							/>
						</Field>
						<Field label="Density Penonton">
							<Sel
								id="crowd-density"
								value={getSceneConfig(currentScene).crowdDensity}
								onChange={(v) =>
									updateSceneConfig(currentScene, { crowdDensity: v })
								}
								options={[...OPTIONS.crowdDensity]}
							/>
						</Field>
						<Field label="Momen Crowd">
							<Sel
								id="crowd-moment"
								value={getSceneConfig(currentScene).crowdMoment}
								onChange={(v) =>
									updateSceneConfig(currentScene, { crowdMoment: v })
								}
								options={[...OPTIONS.crowdMoment]}
							/>
						</Field>
					</div>
				) : activeTab === "location" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Lokasi Utama">
							<Sel
								id="loc-main"
								value={getSceneConfig(currentScene).locMain}
								onChange={(v) => updateSceneConfig(currentScene, { locMain: v })}
								options={[...OPTIONS.locMain]}
							/>
						</Field>
						<Field label="Waktu & Suasana">
							<Sel
								id="loc-time"
								value={getSceneConfig(currentScene).locTime}
								onChange={(v) => updateSceneConfig(currentScene, { locTime: v })}
								options={[...OPTIONS.locTime]}
							/>
						</Field>
						<Field label="Palet Warna Lokasi">
							<Sel
								id="loc-palette"
								value={getSceneConfig(currentScene).locPalette}
								onChange={(v) =>
									updateSceneConfig(currentScene, { locPalette: v })
								}
								options={[...OPTIONS.locPalette]}
							/>
						</Field>
						<Field label="Atmosfer Latar">
							<Sel
								id="loc-atmo"
								value={getSceneConfig(currentScene).locAtmo}
								onChange={(v) => updateSceneConfig(currentScene, { locAtmo: v })}
								options={[...OPTIONS.locAtmo]}
							/>
						</Field>
					</div>
				) : activeTab === "lighting" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Pencahayaan Utama">
							<Sel
								id="light-main"
								value={getSceneConfig(currentScene).lightMain}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightMain: v })
								}
								options={[...OPTIONS.lightMain]}
							/>
						</Field>
						<Field label="Lighting Effect">
							<Sel
								id="light-fx"
								value={getSceneConfig(currentScene).lightFx}
								onChange={(v) => updateSceneConfig(currentScene, { lightFx: v })}
								options={[...OPTIONS.lightFx]}
							/>
						</Field>
						<Field label="Warna Lighting">
							<Sel
								id="light-color"
								value={getSceneConfig(currentScene).lightColor}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightColor: v })
								}
								options={[...OPTIONS.lightColor]}
							/>
						</Field>
						<Field label="Shadow & Contrast">
							<Sel
								id="light-shadow"
								value={getSceneConfig(currentScene).lightShadow}
								onChange={(v) =>
									updateSceneConfig(currentScene, { lightShadow: v })
								}
								options={[...OPTIONS.lightShadow]}
							/>
						</Field>
					</div>
				) : activeTab === "props" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="Elemen Api / Pyro">
							<Sel
								id="prop-fire"
								value={getSceneConfig(currentScene).propFire}
								onChange={(v) =>
									updateSceneConfig(currentScene, { propFire: v })
								}
								options={[...OPTIONS.propFire]}
							/>
						</Field>
						<Field label="Elemen Smoke / Asap">
							<Sel
								id="prop-smoke"
								value={getSceneConfig(currentScene).propSmoke}
								onChange={(v) =>
									updateSceneConfig(currentScene, { propSmoke: v })
								}
								options={[...OPTIONS.propSmoke]}
							/>
						</Field>
						<Field label="Hewan Pemeran Pendukung">
							<Sel
								id="prop-animal"
								value={getSceneConfig(currentScene).propAnimal}
								onChange={(v) =>
									updateSceneConfig(currentScene, { propAnimal: v })
								}
								options={[...OPTIONS.propAnimal]}
							/>
						</Field>
						<Field label="Props Dekorasi Lainnya">
							<Sel
								id="prop-deco"
								value={getSceneConfig(currentScene).propDeco}
								onChange={(v) =>
									updateSceneConfig(currentScene, { propDeco: v })
								}
								options={[...OPTIONS.propDeco]}
							/>
						</Field>
						<Field label="Props Aksesoris Karakter">
							<Sel
								id="prop-char"
								value={getSceneConfig(currentScene).propChar}
								onChange={(v) =>
									updateSceneConfig(currentScene, { propChar: v })
								}
								options={[...OPTIONS.propChar]}
							/>
						</Field>
						<Field label="Efek Khusus Lapangan">
							<Sel
								id="prop-sfx"
								value={getSceneConfig(currentScene).propSfx}
								onChange={(v) =>
									updateSceneConfig(currentScene, { propSfx: v })
								}
								options={[...OPTIONS.propSfx]}
							/>
						</Field>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<Field label="Sudut Kamera">
							<Sel
								id="cam-angle"
								value={getSceneConfig(currentScene).camAngle}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camAngle: v })
								}
								options={[...OPTIONS.camAngle]}
							/>
						</Field>
						<Field label="Gerakan Kamera">
							<Sel
								id="cam-move"
								value={getSceneConfig(currentScene).camMove}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camMove: v })
								}
								options={[...OPTIONS.camMove]}
							/>
						</Field>
						<Field label="Mood Sinematik">
							<Sel
								id="cam-mood"
								value={getSceneConfig(currentScene).camMood}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camMood: v })
								}
								options={[...OPTIONS.camMood]}
							/>
						</Field>
						<Field label="Kualitas Render">
							<Sel
								id="cam-quality"
								value={getSceneConfig(currentScene).camQuality}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camQuality: v })
								}
								options={[...OPTIONS.camQuality]}
							/>
						</Field>
						<Field label="Color Grade">
							<Sel
								id="cam-grade"
								value={getSceneConfig(currentScene).camGrade}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camGrade: v })
								}
								options={[...OPTIONS.camGrade]}
							/>
						</Field>
						<Field label="Lens & Depth">
							<Sel
								id="cam-lens"
								value={getSceneConfig(currentScene).camLens}
								onChange={(v) =>
									updateSceneConfig(currentScene, { camLens: v })
								}
								options={[...OPTIONS.camLens]}
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
								onChange={() =>
									setRandomGroups((p) => ({ ...p, [k]: !p[k] }))
								}
							/>
							<span className="capitalize">{k}</span>
						</label>
					))}
				</div>
				<div className="flex flex-wrap gap-2 mt-3">
					<button type="button" className="btn-outline" onClick={randomizeCurrentScene}>
						🎲 Random Scene Ini
					</button>
					<button type="button" className="btn-outline" onClick={randomAllScenes}>
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
					<button type="button" className="btn-primary" onClick={generatePrompt}>
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
							const sceneType = sceneTypes[s] ?? "dj-party";
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
