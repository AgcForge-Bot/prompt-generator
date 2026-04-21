// ─── VISUAL STYLE ────────────────────────────────────────────────────────────

export const VISUAL_STYLE_LABELS = {
	cinematic: 'Cinematic',
	'semi-cinematic': 'Semi-Cinematic',
	'cinematic-realistic': 'Cinematic Realistic',
	realistic: 'Realistic',
	'hyper-realistic': 'Hyper Realistic',
} as const

export const VISUAL_STYLE_HINTS = {
	cinematic:
		'strong cinematic lighting, dramatic composition, shallow depth of field, filmic contrast, tasteful grain',
	'semi-cinematic':
		'balanced cinematic look, clean composition, moderate depth of field, polished film feel',
	'cinematic-realistic':
		'photorealistic baseline with cinematic framing and lighting, natural textures, film-grade polish',
	realistic:
		'natural documentary realism, neutral grading, minimal stylization, true-to-life lighting and colors',
	'hyper-realistic':
		'ultra photoreal, micro-detail textures, crisp clarity, high dynamic range, premium realism',
} as const

// ─── AI PROVIDER ─────────────────────────────────────────────────────────────

export const AI_PROVIDER_LABELS = {
	CLAUDE: 'Claude (Anthropic)',
	OPENAI: 'OpenAI',
	GEMINI: 'Gemini',
	OPENROUTER: 'OpenRouter',
} as const

// ─── GENRE CATEGORIES ────────────────────────────────────────────────────────

export const GENRE_CATEGORIES = [
	{ key: 'drama', label: '🎭 Drama', emoji: '🎭' },
	{ key: 'romance', label: '💕 Romance', emoji: '💕' },
	{ key: 'thriller', label: '😰 Thriller', emoji: '😰' },
	{ key: 'horror', label: '👻 Horror', emoji: '👻' },
	{ key: 'action', label: '💥 Action', emoji: '💥' },
	{ key: 'sci-fi', label: '🚀 Sci-Fi', emoji: '🚀' },
	{ key: 'comedy', label: '😂 Comedy', emoji: '😂' },
	{ key: 'fantasy', label: '✨ Fantasy', emoji: '✨' },
	{ key: 'mystery', label: '🔍 Mystery', emoji: '🔍' },
	{ key: 'anime', label: '🎌 Anime Live Action', emoji: '🎌' },
] as const

export type GenreCategoryKey = typeof GENRE_CATEGORIES[number]['key']

// ─── MOVIE REFERENCES PER GENRE ──────────────────────────────────────────────

export const MOVIE_REFS: Record<GenreCategoryKey, { title: string; story: string }[]> = {
	drama: [
		{ title: 'The Shawshank Redemption (1994)', story: 'A man wrongly convicted befriends a fellow prisoner and finds hope and humanity inside a brutal prison over two decades.' },
		{ title: 'Forrest Gump (1994)', story: 'A kind-hearted man with low intelligence witnesses and influences major historical events while searching for his great love.' },
		{ title: 'Schindler\'s List (1993)', story: 'A German businessman saves over a thousand Jewish lives during the Holocaust by employing them in his factory.' },
		{ title: 'A Beautiful Mind (2001)', story: 'Brilliant mathematician John Nash battles schizophrenia while making groundbreaking discoveries and finding redemption.' },
		{ title: 'The Pursuit of Happyness (2006)', story: 'A struggling salesman becomes homeless with his young son but refuses to give up on his dream of a better life.' },
		{ title: 'Good Will Hunting (1997)', story: 'A genius janitor at MIT must confront his troubled past with the help of a therapist to realize his potential.' },
		{ title: 'Dead Poets Society (1989)', story: 'An unconventional English teacher inspires his students to seize life and pursue their passions against societal expectations.' },
		{ title: 'Manchester by the Sea (2016)', story: 'A grief-stricken man must return to his hometown to care for his nephew after his brother dies, confronting a tragic past.' },
		{ title: '12 Years a Slave (2013)', story: 'A free Black man is kidnapped and sold into slavery in 1841, struggling to survive and reclaim his freedom.' },
		{ title: 'The Green Mile (1999)', story: 'A death row prison guard develops a relationship with an unusual inmate who possesses a miraculous but mysterious gift.' },
	],

	romance: [
		{ title: 'Titanic (1997)', story: 'A poor artist and a wealthy young woman fall in love aboard the ill-fated RMS Titanic during its doomed maiden voyage.' },
		{ title: 'The Notebook (2004)', story: 'An elderly man reads a love story from his notebook to a woman with dementia, revealing their passionate journey across decades.' },
		{ title: 'La La Land (2016)', story: 'An aspiring actress and a jazz musician fall in love in Los Angeles, but their dreams and ambitions pull them in different directions.' },
		{ title: 'Before Sunrise (1995)', story: 'Two strangers meet on a train and spend one magical night in Vienna talking, exploring, and falling in love.' },
		{ title: 'Pride & Prejudice (2005)', story: 'Strong-willed Elizabeth Bennet navigates class, family pressure, and pride as she falls for the brooding Mr. Darcy.' },
		{ title: 'A Walk to Remember (2002)', story: 'A popular teen falls for a quiet, religious girl who is hiding a life-changing secret that will change them both forever.' },
		{ title: 'Call Me by Your Name (2017)', story: 'A teenager falls in love with his father\'s graduate student during a sun-drenched Italian summer in the 1980s.' },
		{ title: 'Eternal Sunshine of the Spotless Mind (2004)', story: 'After a painful breakup, a couple independently decide to erase each other from their memories using experimental technology.' },
		{ title: 'Her (2013)', story: 'A lonely writer develops an unexpected and profound romantic relationship with an AI operating system.' },
		{ title: 'About Time (2013)', story: 'A young man discovers he can travel in time and uses this ability to find love and make the most of his life.' },
	],

	thriller: [
		{ title: 'Parasite (2019)', story: 'A poor family schemes to become employed by a wealthy family, but a dark secret in the house threatens everyone.' },
		{ title: 'Gone Girl (2014)', story: 'On their fifth wedding anniversary, a man\'s wife mysteriously disappears, and he becomes the prime suspect in a media circus.' },
		{ title: 'Prisoners (2013)', story: 'When his daughter goes missing, a desperate father takes the law into his own hands with devastating moral consequences.' },
		{ title: 'The Silence of the Lambs (1991)', story: 'A young FBI agent must seek the help of a brilliant but dangerous cannibal psychiatrist to catch a serial killer.' },
		{ title: 'Oldboy (2003)', story: 'A man is inexplicably imprisoned for 15 years and released, then embarks on a violent quest to find out why.' },
		{ title: 'Knives Out (2019)', story: 'After a crime novelist is found dead, a brilliant detective investigates the eccentric and suspicious family gathered for the funeral.' },
		{ title: 'Rear Window (1954)', story: 'A photographer confined to a wheelchair suspects he has witnessed a murder through the window of his apartment.' },
		{ title: 'Memento (2000)', story: 'A man with short-term memory loss uses tattoos and polaroids to hunt for his wife\'s killer in a story told in reverse.' },
		{ title: 'Se7en (1995)', story: 'Two detectives hunt a serial killer who uses the seven deadly sins as his modus operandi in a decaying, rain-drenched city.' },
		{ title: 'Black Swan (2010)', story: 'A devoted ballet dancer wins the lead role in Swan Lake but begins a psychological descent as she strives for perfection.' },
	],

	horror: [
		{ title: 'Get Out (2017)', story: 'A Black man visits his white girlfriend\'s family and discovers a disturbing secret about their seemingly idyllic estate.' },
		{ title: 'Hereditary (2018)', story: 'After the family matriarch passes away, a family unravels cryptic and terrifying secrets about their ancestry and fate.' },
		{ title: 'Midsommar (2019)', story: 'A grieving woman accompanies her boyfriend to a Swedish midsummer festival that turns into a pagan nightmare.' },
		{ title: 'A Quiet Place (2018)', story: 'A family struggles to survive in a post-apocalyptic world inhabited by creatures that hunt purely by sound.' },
		{ title: 'The Witch (2015)', story: 'A Puritan family is torn apart by paranoia, superstition, and supernatural terror when they are banished from their village.' },
		{ title: 'It Follows (2014)', story: 'A teenager is haunted by a supernatural entity that passes through sexual contact and relentlessly pursues its victim.' },
		{ title: 'The Shining (1980)', story: 'A family becomes the winter caretakers of an isolated hotel, and the father descends into madness and violence.' },
		{ title: 'Annihilation (2018)', story: 'A biologist joins an expedition into a mysterious, expanding quarantine zone where the laws of nature don\'t apply.' },
		{ title: 'The Others (2001)', story: 'A woman living in her darkened mansion begins to suspect her house may be haunted after her children develop an extreme light sensitivity.' },
		{ title: 'Talk to Me (2022)', story: 'A group of teens discover they can contact the dead using an embalmed hand, but the supernatural connection goes too far.' },
	],

	action: [
		{ title: 'Mad Max: Fury Road (2015)', story: 'In a post-apocalyptic wasteland, a rebellious woman flees with a group of female captives and a road warrior in a relentless high-octane chase.' },
		{ title: 'John Wick (2014)', story: 'A retired hitman seeks vengeance against a Russian mobster who killed his puppy and stole his car — the last gift from his deceased wife.' },
		{ title: 'The Dark Knight (2008)', story: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy and test the hero\'s moral limits.' },
		{ title: 'Kill Bill Vol. 1 (2003)', story: 'A former assassin wakes from a coma and embarks on a revenge mission against her former boss who tried to have her killed.' },
		{ title: 'Gladiator (2000)', story: 'A Roman general is betrayed and sold into slavery, becoming a gladiator who seeks revenge against the corrupt emperor.' },
		{ title: 'The Matrix (1999)', story: 'A computer hacker discovers reality is a simulation and joins a rebellion against machine overlords who harvest human energy.' },
		{ title: 'Oldboy (2003)', story: 'A man imprisoned for 15 years is suddenly released and must discover why using only his rage and the skills honed in captivity.' },
		{ title: 'Crouching Tiger Hidden Dragon (2000)', story: 'A legendary warrior and a rebellious young noblewoman are connected by a stolen ancient sword and a secret love.' },
		{ title: 'The Raid: Redemption (2011)', story: 'A rookie SWAT officer is trapped in a building controlled by a ruthless mob boss and must fight his way to survive.' },
		{ title: 'Atomic Blonde (2017)', story: 'An elite MI6 agent navigates Cold War Berlin to retrieve a stolen list of double agents — while determining who to trust.' },
	],

	'sci-fi': [
		{ title: 'Interstellar (2014)', story: 'A farmer and former NASA pilot leaves his family to lead a mission through a wormhole in search of a new home for humanity.' },
		{ title: 'Blade Runner 2049 (2017)', story: 'A blade runner uncovers a long-buried secret that threatens what remains of civilization in a dystopian future Los Angeles.' },
		{ title: 'Arrival (2016)', story: 'A linguist is recruited to communicate with alien spacecraft that have appeared worldwide, in a race to understand their purpose.' },
		{ title: 'Ex Machina (2014)', story: 'A programmer is chosen to evaluate the humanity of an AI robot created by an eccentric tech CEO, with unsettling results.' },
		{ title: 'The Martian (2015)', story: 'An astronaut stranded on Mars must use his ingenuity to survive while NASA races to bring him home.' },
		{ title: 'Moon (2009)', story: 'An astronaut stationed alone on the moon makes a disturbing discovery near the end of his three-year contract.' },
		{ title: 'Annihilation (2018)', story: 'A biologist enters a mysterious expanding quarantine zone where strange mutations blur the line between human and nature.' },
		{ title: 'Coherence (2013)', story: 'During a comet passing, a group of friends at a dinner party discover alternate realities overlapping with their own.' },
		{ title: 'Primer (2004)', story: 'Two engineers accidentally invent a time machine and must grapple with the consequences of paradoxes they cannot control.' },
		{ title: 'Sunshine (2007)', story: 'A crew of astronauts is sent on a mission to reignite the dying Sun with a stellar bomb, facing madness, sacrifice, and terror.' },
	],

	comedy: [
		{ title: 'The Grand Budapest Hotel (2014)', story: 'A legendary hotel concierge and his lobby boy become embroiled in the theft of a priceless painting and a murder mystery.' },
		{ title: 'Game Night (2018)', story: 'A group of friends who regularly attend game night mistakenly believe a murder mystery is part of the game.' },
		{ title: 'About Time (2013)', story: 'A time-traveling young man uses his ability to improve his relationships and appreciate life\'s everyday moments.' },
		{ title: 'Superbad (2007)', story: 'Two inseparable best friends navigate their final weeks of high school and one epic party night before college separates them.' },
		{ title: 'The Secret Life of Walter Mitty (2013)', story: 'A daydreaming photo archivist embarks on a global adventure to find a missing negative for the final issue of LIFE magazine.' },
		{ title: 'Knives Out (2019)', story: 'A star-studded family murder mystery becomes a comedic tangle of lies, greed, and unexpected twists.' },
		{ title: 'What We Do in the Shadows (2014)', story: 'A documentary crew follows the mundane yet hilarious daily lives of vampire flatmates in modern-day New Zealand.' },
		{ title: 'Parasite (2019)', story: 'A poor family\'s ingenious but darkly comic schemes to infiltrate a wealthy household spiral into catastrophic consequences.' },
		{ title: 'Palm Springs (2020)', story: 'Two strangers are trapped in a time loop during a wedding in Palm Springs and must decide how to spend eternity together.' },
		{ title: 'The Death of Stalin (2017)', story: 'Following Stalin\'s sudden death, his inner circle scrambles for power in a darkly comic satire of Soviet politics.' },
	],

	fantasy: [
		{ title: 'Pan\'s Labyrinth (2006)', story: 'A young girl in post-Civil War Spain escapes into a dark fantasy world where she must complete three dangerous tasks.' },
		{ title: 'The Princess Bride (1987)', story: 'A farmhand sets out to rescue his love from an evil prince in a swashbuckling fairy tale full of adventure and true love.' },
		{ title: 'Spirited Away (2001)', story: 'A young girl becomes trapped in a spirit world and must work in a bathhouse to rescue her parents who were turned into pigs.' },
		{ title: 'Big Fish (2003)', story: 'A son tries to learn the truth about his dying father\'s extraordinary life stories, discovering their unexpected truth.' },
		{ title: 'The Shape of Water (2017)', story: 'A mute woman working in a Cold War government lab forms a bond with a captured amphibious creature.' },
		{ title: 'Stardust (2007)', story: 'A young man ventures into a magical kingdom to retrieve a fallen star for the girl he loves, discovering it is actually a woman.' },
		{ title: 'Edward Scissorhands (1990)', story: 'An artificial man with scissors for hands is taken into suburban society and falls in love while struggling to belong.' },
		{ title: 'Labyrinth (1986)', story: 'A teenage girl must solve a labyrinth in 13 hours to rescue her baby brother from the Goblin King.' },
		{ title: 'The Fall (2006)', story: 'A hospitalized stunt man tells an imaginative little girl an elaborate fantasy story while plotting to use her to get morphine.' },
		{ title: 'A Monster Calls (2016)', story: 'A boy coping with his mother\'s illness is visited by a giant tree monster who tells him three stories — then demands one in return.' },
	],

	mystery: [
		{ title: 'Knives Out (2019)', story: 'A detective investigates the death of a wealthy crime novelist, uncovering layers of family greed and unexpected truth.' },
		{ title: 'Zodiac (2007)', story: 'A cartoonist, journalist, and detective become obsessed with the unidentified Zodiac Killer terrorizing San Francisco.' },
		{ title: 'The Prestige (2006)', story: 'Two rival Victorian-era magicians engage in a bitter contest to create the ultimate illusion, with deadly consequences.' },
		{ title: 'Gone Girl (2014)', story: 'The disappearance of a woman on her fifth anniversary exposes the dark secrets of a marriage that seemed perfect.' },
		{ title: 'Shutter Island (2010)', story: 'A U.S. Marshal investigates a missing patient from a mental institution but begins questioning his own sanity.' },
		{ title: 'The Sixth Sense (1999)', story: 'A child psychologist works with a boy who claims he can see and communicate with the dead in a twist-laden mystery.' },
		{ title: 'In the Mouth of Madness (1994)', story: 'An insurance investigator searches for a missing horror writer and finds himself drawn into the author\'s terrifying fictional world.' },
		{ title: 'Brick (2005)', story: 'A teenage loner investigates his ex-girlfriend\'s murder in a high school setting styled like a classic film noir.' },
		{ title: 'The Others (2001)', story: 'A woman in a darkened house becomes convinced it is haunted, but the truth is far more terrifying than ghosts.' },
		{ title: 'Coherence (2013)', story: 'A dinner party descends into paranoid chaos when guests realize multiple versions of themselves exist in overlapping realities.' },
	],

	anime: [
		{ title: 'Your Name (2016)', story: 'A high school boy and girl mysteriously swap bodies and try to find each other before a comet changes their fate forever.' },
		{ title: 'Akira (1988)', story: 'A biker gang leader must stop his childhood friend from unleashing a devastating psychic power in a dystopian Neo-Tokyo.' },
		{ title: 'Ghost in the Shell (1995)', story: 'A cyborg officer investigates a mysterious hacker in a future where the boundary between human and machine is blurred.' },
		{ title: 'Princess Mononoke (1997)', story: 'A young prince becomes embroiled in a war between the gods of the forest and the humans who consume its resources.' },
		{ title: 'Perfect Blue (1997)', story: 'A pop idol transitions to acting but begins losing grip on reality as a stalker and a mysterious lookalike terrorize her.' },
		{ title: 'Grave of the Fireflies (1988)', story: 'Two siblings struggle to survive in Japan after a firebombing during WWII in a devastating anti-war story.' },
		{ title: 'Sword Art Online (2012)', story: 'Players trapped in a virtual reality MMORPG must fight through 100 floors to escape — or die for real.' },
		{ title: 'Attack on Titan (2013)', story: 'In a world where humanity hides behind walls from giant man-eating Titans, a boy vows revenge after his village is destroyed.' },
		{ title: 'Weathering with You (2019)', story: 'A runaway boy meets a girl who can control the weather, but using her power comes at an impossible cost.' },
		{ title: 'The Girl Who Leapt Through Time (2006)', story: 'A high school girl discovers she can leap through time and uses the ability carelessly until she faces irreversible consequences.' },
	],
}

// ─── CAST CONFIGURATION ──────────────────────────────────────────────────────

export const CAST_COUNT_OPTIONS = [
	{ value: 'auto', label: 'Auto (AI pilih 1–4)' },
	{ value: '1', label: '1 karakter' },
	{ value: '2', label: '2 karakter' },
	{ value: '3', label: '3 karakter' },
	{ value: '4', label: '4 karakter' },
	{ value: '5', label: '5 karakter' },
]

export const GENDER_OPTIONS = [
	{ value: 'auto', label: 'Auto (AI pilih)' },
	{ value: 'male', label: 'Pria' },
	{ value: 'female', label: 'Wanita' },
]

// ─── STORY INTENSITY ─────────────────────────────────────────────────────────

export const STORY_INTENSITY_OPTIONS = [
	{ value: 'light', label: '😌 Light — Santai, minim konflik, banyak momen indah' },
	{ value: 'balanced', label: '⚖️ Balanced — Konflik & resolusi seimbang (recommended)' },
	{ value: 'intense', label: '🔥 Intense — Banyak ketegangan, setback, momen dramatis' },
]

// ─── DURATION OPTIONS ────────────────────────────────────────────────────────

export const DURATION_MINUTE_OPTIONS = [
	{ value: '3', label: '3 Menit' },
	{ value: '5', label: '5 Menit' },
	{ value: '8', label: '8 Menit' },
	{ value: '10', label: '10 Menit' },
	{ value: '15', label: '15 Menit' },
	{ value: '20', label: '20 Menit' },
]

export const DURATION_SEC_PER_SCENE_OPTIONS = [
	{ value: '6', label: '6 detik / scene' },
	{ value: '8', label: '8 detik / scene' },
	{ value: '10', label: '10 detik / scene' },
	{ value: '12', label: '12 detik / scene (Sora)' },
	{ value: '15', label: '15 detik / scene (Sora)' },
	{ value: '20', label: '20 detik / scene (Sora)' },
]

// ─── AI MODEL PROVIDERS ──────────────────────────────────────────────────────

export const AI_MODELS: Record<string, { label: string; models: { value: string; label: string }[] }> = {
	CLAUDE: {
		label: 'Claude (Anthropic)',
		models: [
			{ value: 'claude-opus-4-6', label: 'Claude Opus 4.6 (Best)' },
			{ value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (Recommended)' },
		],
	},
	OPENAI: {
		label: 'OpenAI',
		models: [
			{ value: 'gpt-4o', label: 'GPT-4o' },
			{ value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
		],
	},
	GEMINI: {
		label: 'Gemini',
		models: [
			{ value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
			{ value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
			{ value: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite' },
		],
	},
	OPENROUTER: {
		label: 'OpenRouter',
		models: [
			{ value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (OR)' },
			{ value: 'google/gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite (OR)' },
			{ value: 'anthropic/claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (OR)' },
		],
	},
}

export const DEFAULT_AI_MODEL_ID: Record<string, string> = {
	CLAUDE: 'claude-sonnet-4-6',
	OPENAI: 'gpt-4o',
	GEMINI: 'gemini-2.5-flash',
	OPENROUTER: 'google/gemini-2.5-flash',
}

// ─── NARRATION / DIALOG OPTIONS ──────────────────────────────────────────────

export const NARRATION_MODE_OPTIONS = [
	{
		value: 'none',
		label: '🎬 Pure Visual',
		desc: 'Tidak ada dialog atau narasi. Cerita disampaikan murni lewat visual, ekspresi, dan aksi.',
	},
	{
		value: 'subtitle',
		label: '💬 Subtitle Dialog',
		desc: 'Dialog antar karakter ditampilkan sebagai subtitle on-screen. AI memutuskan kapan dialog natural dan kapan scene lebih baik tanpa dialog.',
	},
	{
		value: 'voiceover',
		label: '🎙️ Voiceover Narasi',
		desc: 'Narasi off-screen yang menceritakan atau merefleksikan kejadian. AI memutuskan kapan voiceover natural untuk genre ini.',
	},
] as const

export const DIALOG_LANGUAGE_OPTIONS = [
	{ value: 'English', label: '🇺🇸 English', flag: '🇺🇸' },
	{ value: 'Spanish', label: '🇪🇸 Spanish', flag: '🇪🇸' },
	{ value: 'French', label: '🇫🇷 French', flag: '🇫🇷' },
	{ value: 'Russian', label: '🇷🇺 Russian', flag: '🇷🇺' },
	{ value: 'Chinese', label: '🇨🇳 Chinese', flag: '🇨🇳' },
	{ value: 'Indonesian', label: '🇮🇩 Indonesian', flag: '🇮🇩' },
] as const

// Hint teks yang muncul di UI per narration mode
export const NARRATION_HINTS: Record<string, string> = {
	none: 'Cerita disampaikan 100% lewat visual — ekspresi wajah, body language, aksi, dan sinematografi. Cocok untuk semua genre.',
	subtitle: 'AI akan menambahkan dialog jika natural untuk genre dan momen tertentu. Adegan aksi, horror, atau refleksi mungkin tetap tanpa dialog.',
	voiceover: 'AI akan menambahkan narasi jika cocok untuk genre. Drama dan romance lebih sering dapat voiceover; action dan horror biasanya tidak.',
}

