import type { ModelType } from "./types";

export const CAM_ANGLES = [
	"wide establishing fixed — full environment, subject small in frame, nature dominant",
	"aerial drone descending — top-down to eye-level reveal, immense scale shown",
	"medium documentary — subject fills 1/3 frame, work context clear, authentic",
	"close following — just behind subject, seeing what they see, POV adjacent",
	"extreme close-up — hands, tools, materials — pure ASMR texture detail",
	"overhead top-down — bird's eye on work surface, craft from above",
	"low ground level — looking up at subject and structure, dramatic scale",
	"profile side silhouette — subject in rim light against landscape",
	"handheld tracking — walking alongside subject, documentary intimacy",
];

export const CAM_MOVES = [
	"completely static locked-off — pure stillness, subject and nature move inside frame",
	"very slow push-in — barely perceptible approach, meditative pace",
	"slow pull-back reveal — intimacy expands to show full environment scale",
	"gentle handheld drift — organic micro-movement, breathes with scene",
	"slow upward tilt — begins on ground, rises to reveal horizon or canopy",
	"slow orbit — circles subject, reveals full 360° environment context",
	"drone lateral sweep — wide slow pan reveals landscape depth",
	"POV walk — camera moves as subject moves, first-person journey feel",
	"slow zoom out — starts tight on detail, opens to wide establishing",
];

export const CAM_MOODS = [
	"meditative & deeply satisfying — unhurried, every movement has weight and meaning",
	"documentary realism — honest, unfiltered, raw — exactly as it happened",
	"lyrical and poetic — movement as music, light as emotion",
	"primitive & earthy — gritty texture, weathered reality, no glamour",
	"wonder & reverence — nature is the cathedral, human is small within it",
	"intimate & personal — close, warm, felt rather than observed",
	"triumphant & earned — hard work made beautiful by persistence",
];

export const CRAFT_ACTIVITIES = [
	"chopping and splitting wood — axe strikes rhythmic, chips flying, satisfying thwack",
	"digging and excavating — earth turned methodically, roots cut, cavity deepening",
	"carving and shaping timber — slow deliberate cuts, curled shavings accumulating",
	"laying stones or logs — each piece placed with care, level checked, fitted perfectly",
	"weaving and lashing — vines or rope wound tightly, knots pulled firm",
	"mixing and applying clay mortar — earthy wet sound, hands press into gaps",
	"thatching the roof — bundles tied in overlapping rows, waterproof layer built",
	"installing interior furnishings — arranging, fitting, making it home",
	"gathering materials through forest — moving, selecting, carrying, harvesting",
	"assembling and testing — pieces come together, joints checked, structure proves itself",
	"cooking over open fire — preparation, fire management, watching food transform",
	"fishing or hunting — patient waiting, skilled technique, nature provides",
];

export const SOUND_PRIMARIES = [
	"axe chopping wood — deep meaty thwack, ring resonance, totally satisfying",
	"hand saw through grain — rhythmic rasp, sawdust whisper, steady tempo",
	"mud and clay applied — wet thick slap, organic and rich in texture",
	"stones placed and stacked — soft clunk and scrape, dry stone settling sound",
	"fire crackling — irregular snap and pop, warmth audible in the sound",
	"water boiling in pot — bubbling gentle rhythm, steam hiss occasional",
	"footsteps on leaves and earth — complex natural percussion, pace tells story",
	"rope pulled taut — creak and stretch, tension building to satisfying hold",
	"rain on leaves and shelter roof — meditative patter, layers of percussion",
	"wind through forest canopy — deep organic drone with leaf rustle texture",
];

export const SOUND_AMBIENTS = [
	"rich multi-species bird chorus — full forest alive, spatial and layered",
	"stream over stones — moving water nearby, constant meditative flow",
	"rain on leaves — gentle building patter, humid acoustic richness",
	"complete forest silence — only work sounds, rare and powerful",
	"insects — cicadas, crickets, life density of warm forest day",
	"wind through tall pines — deep organic drone, ancient sound",
	"dawn chorus peak — richest birdsong of the day, morning at its finest",
	"night sounds — frogs, owls, deep forest alive in darkness",
	"lake water lapping — soft rhythmic wave against shore",
];

export const LENS_OPTIONS = [
	"wide 24mm — environment present, spatial context always clear",
	"standard 35mm — natural balanced perspective",
	"macro 100mm — extreme material detail, grain and surface texture",
	"tilt-shift — selective miniature focus on key detail",
	"telephoto 85mm — compressed depth, forest layers as bokeh",
];

export const COLOR_GRADE_OPTIONS = [
	"warm natural earthy — Kodak Vision3 film, honest color, lifted blacks",
	"clean documentary neutral — accurate color, light organic grain",
	"golden hour amber — warm saturation, rich highlights, cinematic",
	"desaturated naturalistic — muted palette, documentary realism",
	"night fire glow — warm amber vs deep blue-black, high contrast",
];

export const VISUAL_STYLE_LABELS = {
	cinematic: "Cinematic",
	"semi-cinematic": "Semi-Cinematic",
	"cinematic-realistic": "Cinematic Realistic",
	realistic: "Realistic",
	"hyper-realistic": "Hyper Realistic",
} as const;

export const VISUAL_STYLE_HINTS = {
	cinematic:
		"strong cinematic lighting, dramatic composition, filmic contrast, tasteful grain",
	"semi-cinematic":
		"balanced cinematic look, clean composition, moderate depth of field, polished feel",
	"cinematic-realistic":
		"photorealistic baseline with cinematic framing and lighting, natural textures, film-grade polish",
	realistic:
		"natural documentary realism, neutral grading, minimal stylization, true-to-life lighting and colors",
	"hyper-realistic":
		"ultra photoreal, micro-detail textures, crisp clarity, high dynamic range realism",
} as const;

export const EMO_TONE_OPTIONS = [
	"quiet joy — subtle, genuine, never over-performed",
	"deep relief — tension releasing, shoulders drop, peace returns",
	"tender care — gentle touch, slowed pace, full attention to living thing",
	"awe and wonder — stops and stares, nature overwhelms the person",
	"determination — setback faced, jaw set, work resumes stronger",
	"unexpected connection — eyes meeting with animal or human, pause",
	"pride and satisfaction — stepping back, looking at what was made",
];

export const EMO_SOUND_OPTIONS = [
	"music swells softly — first music in entire video, quiet emotional uplift",
	"complete silence — all ambient drops, only the moment exists",
	"natural ambient heightened — birds louder, wind intimate, more alive",
	"sound continues unchanged — contrast between unchanged sound and deep emotion",
];

export function getVisionProviderLabel(model: ModelType) {
	switch (model) {
		case "CLAUDE":
			return "Claude (Anthropic)";
		case "OPENAI":
			return "OpenAI";
		case "GEMINI":
			return "Gemini";
		case "OPENROUTER":
			return "OpenRouter";
	}
}

export function getDefaultVisionModelId(provider: ModelType) {
	switch (provider) {
		case "CLAUDE":
			return "claude-sonnet-4-20250514";
		case "OPENAI":
			return "gpt-4o-mini";
		case "GEMINI":
			return "gemini-3.1-flash-lite-preview";
		case "OPENROUTER":
			return "google/gemini-3.1-flash-lite-preview";
	}
}

export const STORY_MODE_LABELS = {
	classic: "Classic (Mode Lama)",
	"ai-film": "Short Film Inspired by Movie (Mode 2 — AI Utama)",
} as const;

export const SURVIVAL_MOVIE_REFS = [
	{ title: "Cast Away (2000)", story: "A man stranded on a remote island after a plane crash, learning to survive alone." },
	{ title: "The Revenant (2015)", story: "A frontiersman fights for survival and revenge after being mauled by a bear and left for dead." },
	{ title: "Into the Wild (2007)", story: "A young man rejects society and ventures into the Alaskan wilderness, seeking freedom but facing harsh realities." },
	{ title: "127 Hours (2010)", story: "A hiker gets trapped by a boulder in a remote canyon and must make a life-changing decision to survive." },
	{ title: "The Edge (1997)", story: "Two men stranded in the wilderness must outsmart nature and a deadly bear to stay alive." },
	{ title: "Life of Pi (2012)", story: "A boy survives a shipwreck and drifts on a lifeboat with a Bengal tiger, testing faith and endurance." },
	{ title: "All Is Lost (2013)", story: "A lone sailor battles the elements and isolation after his yacht is damaged in the Indian Ocean." },
	{ title: "The Martian (2015)", story: "An astronaut is stranded on Mars and must use ingenuity and science to stay alive and signal for rescue." },
	{ title: "Arctic (2018)", story: "A man stranded in the Arctic must choose between staying safe or risking everything to rescue another survivor." },
	{ title: "Jungle (2017)", story: "A traveler gets lost in the Amazon jungle and struggles against hunger, injury, and despair to survive." },
	{ title: "Alive (1993)", story: "Survivors of a plane crash in the Andes face extreme cold, starvation, and moral dilemmas to stay alive." },
	{ title: "The Grey (2011)", story: "Plane crash survivors in the wilderness fight the elements and a pack of wolves while searching for safety." },
	{ title: "Swiss Army Man (2016)", story: "A stranded man forms an unlikely bond with a corpse, using it as a tool to survive and find purpose." },
	{ title: "The Road (2009)", story: "A father and son journey through a post-apocalyptic wasteland, fighting hunger and danger to survive." },
	{ title: "I Am Legend (2007)", story: "A man believes he is the last human in a city overrun by infected creatures, struggling to survive and find a cure." },
	{ title: "A Quiet Place (2018)", story: "A family survives in silence while hunted by creatures that attack anything making noise." },
	{ title: "The Hunger Games (2012)", story: "A young woman fights for survival in a deadly televised arena, balancing strategy, alliances, and sacrifice." },
	{ title: "Dunkirk (2017)", story: "Soldiers trapped on a beach during WWII attempt evacuation while facing relentless attacks." },
	{ title: "War for the Planet of the Apes (2017)", story: "An ape leader and his tribe struggle for survival against a ruthless military force." },
	{ title: "No Country for Old Men (2007)", story: "A man stumbles upon a drug deal gone wrong and is hunted relentlessly after taking the money." },
	{ title: "Gravity (2013)", story: "Astronauts are stranded in space after debris destroys their shuttle, forcing them to improvise to survive." },
	{ title: "The Book of Eli (2010)", story: "A lone traveler carries a sacred book across a violent wasteland, facing threats and protecting his mission." },
	{ title: "The Purge (2013)", story: "A family must survive a night when all crime is legal, facing intruders and moral choices." },
	{ title: "The Maze Runner (2014)", story: "A group of teens trapped in a mysterious maze must work together to escape and survive." },
	{ title: "Oblivion (2013)", story: "A technician stationed on a devastated Earth uncovers a conspiracy and must fight to survive and reveal truth." },
	{ title: "Avatar (2009)", story: "A human in an alien world must survive, adapt, and choose sides amid conflict and discovery." },
	{ title: "Lost (TV Series) (2004)", story: "Plane crash survivors on a mysterious island face survival challenges and uncover strange secrets." },
	{ title: "The Walking Dead (TV Series) (2010)", story: "A group of survivors navigate a zombie apocalypse while battling scarcity, threats, and internal conflict." },
	{ title: "The 100 (TV Series) (2014)", story: "Teenagers sent back to Earth after a nuclear apocalypse must survive hostile conditions and moral conflicts." },
] as const;
