import type { DramaDNA, CTAConfig, DramaAct, ManualSceneInstruction } from "./types";

// ─── DURASI OPTIONS ───────────────────────────────────────────────────────────

export const DRAMA_TOTAL_DURATION_OPTIONS = [
	{ value: 120, label: "2 menit" },
	{ value: 150, label: "2.5 menit" },
	{ value: 180, label: "3 menit" },
	{ value: 210, label: "3.5 menit" },
	{ value: 240, label: "4 menit" },
	{ value: 300, label: "5 menit" },
];

export const DRAMA_SEC_PER_SCENE_OPTIONS = [8, 10, 12, 15, 20];

// ─── ACT DISTRIBUTION ─────────────────────────────────────────────────────────
// Formula: Babak 1 (20%) | Babak 2 (45%) | Babak 3/Twist (25%) | CTA (10%)

export function calcDramaActs(totalDurationSec: number, secPerScene: number): DramaAct[] {
	const totalScenes = Math.floor(totalDurationSec / secPerScene);

	// Distribusi scene per babak
	const act1Scenes = Math.max(1, Math.floor(totalScenes * 0.20));
	const act3Scenes = Math.max(1, Math.floor(totalScenes * 0.25));
	const ctaScenes = Math.min(3, Math.max(2, Math.floor(totalScenes * 0.10)));
	const act2Scenes = Math.max(2, totalScenes - act1Scenes - act3Scenes - ctaScenes);

	let cursor = 0;
	const acts: DramaAct[] = [];

	const buildAct = (
		n: number,
		label: string,
		sceneCount: number,
		autoHint: string
	): DramaAct => {
		const startSec = cursor;
		const durationSec = sceneCount * secPerScene;
		cursor += durationSec;
		return {
			actNumber: n,
			actLabel: label,
			startSec,
			endSec: cursor,
			durationSec,
			sceneCount,
			instruction: "",
			autoHint,
		};
	};

	acts.push(buildAct(1, "Setup Klise",
		act1Scenes,
		`Buka dengan situasi SANGAT familiar dan klise yang relatable. Gunakan tropes sinetron/drama Asia yang dikenali penonton secara universal. Setting harus establish problem/konflik emosional yang terhubung dengan kategori produk. Tone: dramatis berlebihan, scoring musik sinetron. Perkenalkan karakter utama dengan jelas — tampilan fisik, ekspresi, situasi.`
	));

	acts.push(buildAct(2, "Eskalasi Absurd",
		act2Scenes,
		`Naikkan drama ke level ABSURD yang tidak masuk akal. Setiap scene harus lebih hiperbolis dari scene sebelumnya. Gaya kamera seperti drama Korea (zoom dramatis ke wajah, slow motion air mata, lighting dramatis). Konflik makin parah tapi dengan cara yang konyol/lucu. Penonton harus tertawa DAN ikut merasakan drama. Jangan munculkan produk dulu.`
	));

	acts.push(buildAct(3, "Twist Produk (Gimmick)",
		act3Scenes,
		`THE TWIST — Produk masuk sebagai solusi dari keabsurdan. Transisi visual WAJIB: dari color grade gelap/dramatis ke cerah/colorful ala iklan kecantikan/produk. Karakter menemukan/menggunakan produk dengan cara teatrikal. Produk harus tampil jelas, identitas konsisten dengan referensi gambar. Detail & keunggulan produk diungkap dengan cara yang entertaining. Efek "tertipu tapi terhibur".`
	));

	return acts;
}

export function calcCtaScenes(totalDurationSec: number, secPerScene: number): number {
	const total = Math.floor(totalDurationSec / secPerScene);
	return Math.min(3, Math.max(2, Math.floor(total * 0.10)));
}

export function calcTotalDramaScenes(totalDurationSec: number, secPerScene: number): number {
	return Math.max(4, Math.floor(totalDurationSec / secPerScene));
}

// ─── AUTO-TEMPLATE BY CATEGORY ────────────────────────────────────────────────
// Template gimmick otomatis berdasar kategori produk

export const AUTO_GIMMICK_TEMPLATES: Record<string, {
	setupTrope: string;
	escalationGimmick: string;
	twistEntry: string;
	ctaGimmick: string;
}> = {
	"fashion-wanita": {
		setupTrope: "A woman is dramatically rejected for a date/job/social event because her outfit looks terrible. Extreme reaction from bystanders — gasps, fainting, Instagram unfollows shown on screen.",
		escalationGimmick: "The fashion crisis escalates: pigeons avoid her, plants wilt as she walks by, a fashion police siren goes off, a runway model blocks her path and shakes her head in slow motion.",
		twistEntry: "Product reveals itself as the fashion salvation. Quick transformation montage: product applied/worn → color grade shifts from desaturated dreary to vibrant pop-art palette.",
		ctaGimmick: "Character confidently struts back to the same locations — pigeons bow, plants bloom, the fashion police clap. End with wink to camera holding product.",
	},
	"fashion-pria": {
		setupTrope: "A man is dressed so poorly that his dates keep ghosting him, his friends roast him mercilessly in a group chat shown on-screen, and even his reflection looks disappointed.",
		escalationGimmick: "His bad fashion causes supernatural events: mirrors crack when he passes, fashion magazines spontaneously combust, a passing tailor collapses dramatically.",
		twistEntry: "Product (clothing/outfit) appears as a divine intervention — perhaps falling from the sky or emerging from a glowing box. Putting it on transforms everything.",
		ctaGimmick: "He walks the street as a fashion icon now. The tailor who fainted revives and bows. Group chat notifications flood in — now all compliments.",
	},
	"fashion-anak": {
		setupTrope: "A child is teased at school for unfashionable clothes. Other children refuse to let them join the 'Cool Kids Club'. The parent watches from afar, heartbroken.",
		escalationGimmick: "The child's unfashionable situation escalates comically: teacher gives homework based on fashion grades, the school mascot turns away, even the cafeteria lunch is served cold.",
		twistEntry: "Parent discovers the product and presents it to the child. Outfit change sequence with magical sparkle effects and triumphant music.",
		ctaGimmick: "Child is now president of the Cool Kids Club. Former bullies become biggest fans. Parent weeps happy tears, product held up like a trophy.",
	},
	"aksesoris": {
		setupTrope: "Person has a complete outfit but something is missing — shown through dramatic reactions: people squinting at their wrist/neck/waist, judges' panels giving low scores.",
		escalationGimmick: "The missing accessory causes increasingly absurd problems: unable to enter fancy restaurant, rejected from a time machine, a peacock scoffs at them.",
		twistEntry: "Product (watch/belt/bag/hat) discovered and worn. Slow-mo reveal shot. Immediately the world changes.",
		ctaGimmick: "The peacock approves. The time machine opens. Restaurant rolls out red carpet. Product displayed proudly.",
	},
	"elektronik": {
		setupTrope: "A person's old device fails catastrophically at the worst moment — during an important presentation, on a first date, or trying to capture a once-in-a-lifetime moment.",
		escalationGimmick: "Device failures cascade: the old gadget starts crying, forms a support group with other broken devices, applies for early retirement, gives a farewell speech.",
		twistEntry: "New product appears — unboxing done in cinematic slow motion with divine lighting. The old device waves goodbye tearfully.",
		ctaGimmick: "All previous failed moments are retried with new device and succeed perfectly. Old device watches from a distance, smiling and nodding.",
	},
	"sepatu": {
		setupTrope: "Person wears terrible shoes — shown by floor tiles cracking under each step, music skipping, other people switching to slow motion to avoid them.",
		escalationGimmick: "The bad shoes cause supernatural chaos: they accidentally win a dance battle, causing rivals to faint from embarrassment, the floor refuses to be stepped on.",
		twistEntry: "New shoes (product) discovered — fitting scene in cinematic slo-mo. The floor suddenly glows. The rival wakes up and applauds.",
		ctaGimmick: "Dance battle rematch — now they win legitimately. Floor tiles spell out product name. Rivals become backup dancers.",
	},
	"kosmetik": {
		setupTrope: "Person's skin/makeup situation causes comic horror reactions — mirrors fog up, photo filters refuse to work, even AI beauty apps crash looking at their face.",
		escalationGimmick: "Skin crisis escalates: skincare products hold an intervention, a dermatologist gives a eulogy for the skin, a ghost appears and says 'my skin is better and I'm dead'.",
		twistEntry: "Product (skincare/cosmetics) introduced with sacred-object lighting. Application shown in detail with satisfying close-up texture shots.",
		ctaGimmick: "The ghost becomes jealous of the glowing skin. Mirrors now show extra beautiful reflections. AI beauty app gives a perfect score and crashes from joy.",
	},
	"handphone": {
		setupTrope: "Old phone causes social embarrassment — loading circles during important moments, camera too blurry, battery dying before sending a critical message.",
		escalationGimmick: "Old phone forms a union with other old phones to protest working conditions, files for retirement, the battery percentage starts crying.",
		twistEntry: "New phone (product) unboxed with cinematic reverence — slow motion, choir music, light rays. Old phone accepts its fate gracefully.",
		ctaGimmick: "All the missed moments are recaptured perfectly with new phone. Old phone is given a hero's retirement party.",
	},
	"komputer": {
		setupTrope: "Old laptop/PC crashes at the worst possible professional moment — deadline, virtual interview, game final round. Blue screen of death shown with dramatic music.",
		escalationGimmick: "The computer starts displaying increasingly absurd error messages: 'Error 404: Your Dreams Not Found', 'Please pray before restarting'. Coworkers form a funeral circle.",
		twistEntry: "New computer (product) arrives in a delivery box that glows with divine light. Unboxing like opening a holy relic. Boots up instantly to a heavenly sound.",
		ctaGimmick: "The old computer gets a Viking funeral (floating on a tiny boat). New computer processes everything at light speed. All previous failures reversed.",
	},
	"lainnya": {
		setupTrope: "A person faces a relatable everyday struggle that the product solves — shown in exaggerated, over-dramatic fashion typical of Thai commercials.",
		escalationGimmick: "The everyday problem escalates to absurd cosmic levels — nature itself seems to be conspiring against them, inanimate objects react dramatically.",
		twistEntry: "Product appears as the solution with theatrical presentation — cinematic lighting, possibly slow motion, transition from problem color grade to solution color grade.",
		ctaGimmick: "All previous problems are solved simultaneously. The universe applauds. Product held triumphantly. Characters wink to camera.",
	},
};

// ─── CTA PRESET TEMPLATES ─────────────────────────────────────────────────────

export const DRAMA_CTA_GIMMICK_PRESETS = [
	{ value: "reverse-reveal", label: "Reverse Reveal", desc: "Cut kembali ke semua momen konyol di babak 1-2, tapi sekarang dengan produk — semua berhasil. Karakter noleh ke kamera, tersenyum, winked." },
	{ value: "side-character-react", label: "Reaksi Karakter Sampingan", desc: "Karakter yang dulu menghina/mengejek kini terpukau, iri, atau bertobat secara dramatis. Produk ditunjuk sebagai penyebabnya." },
	{ value: "breaking-fourth-wall", label: "Pecahkan Tembok Keempat", desc: "Karakter bicara langsung ke kamera — 'Makanya, kalau kamu juga mau [manfaat produk], ini solusinya!' sambil pegang produk." },
	{ value: "emotional-twist", label: "Twist Emosional", desc: "Twist kecil yang mengharukan — terungkap bahwa situasi dramatis tadi adalah flashback/impian, dan produk adalah yang membuat masa kini lebih baik." },
	{ value: "absurd-happy-end", label: "Happy Ending Absurd", desc: "Semua karakter dari semua scene berkumpul dalam ending yang tidak masuk akal tapi menyenangkan — parade, pesta, atau flash mob. Produk jadi pusat perhatian." },
];

export const DRAMA_CTA_TEXT_PRESETS = [
	"[Nama Brand] — Jangan sampai hidupmu lebih dramatis dari sinetron. Coba sekarang!",
	"Plot twist terbaik? Ternyata solusinya cuma [Nama Produk]. Order sekarang, stok terbatas!",
	"Drama boleh berlanjut, tapi masalahnya sudah selesai. Thanks to [Nama Brand]!",
	"Hidup terlalu singkat untuk drama tanpa solusi. [Nama Produk] hadir untuk kamu.",
	"Kamu sudah tonton dramanya. Sekarang saatnya dapatkan solusinya. Cek keranjang sekarang!",
];

// ─── DEFAULT CTA ──────────────────────────────────────────────────────────────

export const DEFAULT_CTA: CTAConfig = {
	ctaSceneCount: 2,
	ctaGimmick: "breaking-fourth-wall",
	ctaText: DRAMA_CTA_TEXT_PRESETS[0],
	ctaCustom: false,
};

// ─── DEFAULT DRAMA DNA ────────────────────────────────────────────────────────

export const DEFAULT_DRAMA_DNA: DramaDNA = {
	productName: "",
	productUrl: "",
	productCategory: "fashion-wanita",
	productSubcategory: "baju",
	productImages: [],

	totalDurationSec: 120,
	secPerScene: 10,
	totalScenes: 12,

	modelGenderAge: "wanita-muda",

	storyboardMode: "auto",
	autoActs: calcDramaActs(120, 10),
	manualInstructions: [],

	cta: DEFAULT_CTA,

	aiProvider: "CLAUDE",
	aiModelId: "claude-sonnet-4-20250514",

	aspectRatio: "9:16",
	cinematicStyle: "cinematic-realistic",

	isGenerated: false,
};
