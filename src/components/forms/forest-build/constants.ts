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
			return "gemini-2.0-flash";
		case "OPENROUTER":
			return "openai/gpt-4o-mini";
	}
}
