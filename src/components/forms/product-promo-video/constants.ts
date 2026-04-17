import type {
	ProductCategoryKey,
	ProductSubcategory,
	ModelGenderAge,
	VideoStyleKey,
	LocationKey,
	NarrationToneKey,
	VoiceStyleKey,
	AspectRatioKey,
	SceneTypeKey,
	ModelType,
	PromoDNA,
	ProductSpec,
} from "./types";

// ─── PRODUCT CATEGORIES ──────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES: Record<
	ProductCategoryKey,
	{ label: string; emoji: string; isFashion: boolean; subcategories: ProductSubcategory[] }
> = {
	"fashion-wanita": {
		label: "Pakaian Wanita",
		emoji: "👗",
		isFashion: true,
		subcategories: [
			{ value: "baju", label: "Baju / Atasan" },
			{ value: "celana", label: "Celana" },
			{ value: "one-set", label: "One Set (Baju & Celana)" },
			{ value: "tas", label: "Tas" },
			{ value: "sandal", label: "Sandal" },
			{ value: "hijab", label: "Hijab / Kerudung" },
			{ value: "gamis", label: "Gamis / Dress Muslim" },
			{ value: "kemeja", label: "Kemeja Wanita" },
			{ value: "rok", label: "Rok / Skirt" },
			{ value: "dress", label: "Dress / Gaun" },
			{ value: "cardigan", label: "Cardigan / Outer" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	"fashion-pria": {
		label: "Pakaian Pria",
		emoji: "👕",
		isFashion: true,
		subcategories: [
			{ value: "baju", label: "Baju / Kaos" },
			{ value: "celana", label: "Celana" },
			{ value: "one-set", label: "One Set (Baju & Celana)" },
			{ value: "tas", label: "Tas / Ransel" },
			{ value: "sandal", label: "Sandal" },
			{ value: "baju-muslim", label: "Baju Koko / Muslim" },
			{ value: "kemeja", label: "Kemeja Pria" },
			{ value: "jaket", label: "Jaket / Hoodie" },
			{ value: "polo", label: "Polo Shirt" },
			{ value: "setelan-formal", label: "Setelan Formal / Jas" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	"fashion-anak": {
		label: "Pakaian Anak",
		emoji: "🧒",
		isFashion: true,
		subcategories: [
			{ value: "baju", label: "Baju Anak" },
			{ value: "celana", label: "Celana Anak" },
			{ value: "one-set", label: "One Set Anak" },
			{ value: "dress", label: "Dress / Rok Anak" },
			{ value: "seragam", label: "Seragam Sekolah" },
			{ value: "piyama", label: "Piyama / Baju Tidur" },
			{ value: "bayi", label: "Pakaian Bayi" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	aksesoris: {
		label: "Aksesoris",
		emoji: "⌚",
		isFashion: true,
		subcategories: [
			{ value: "topi", label: "Topi / Cap" },
			{ value: "jam-tangan", label: "Jam Tangan" },
			{ value: "ikat-pinggang", label: "Ikat Pinggang" },
			{ value: "kacamata", label: "Kacamata" },
			{ value: "gelang", label: "Gelang / Bracelet" },
			{ value: "kalung", label: "Kalung / Necklace" },
			{ value: "cincin", label: "Cincin" },
			{ value: "dompet", label: "Dompet" },
			{ value: "scarf", label: "Scarf / Syal" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	elektronik: {
		label: "Elektronik",
		emoji: "🔊",
		isFashion: false,
		subcategories: [
			{ value: "speaker", label: "Speaker Bluetooth" },
			{ value: "headset", label: "Headset / Earphone" },
			{ value: "televisi", label: "Televisi / Smart TV" },
			{ value: "powerbank", label: "Powerbank" },
			{ value: "audio", label: "Perangkat Audio" },
			{ value: "kipas", label: "Kipas / AC Portable" },
			{ value: "lampu", label: "Lampu / Smart Light" },
			{ value: "kamera", label: "Kamera / Action Cam" },
			{ value: "drone", label: "Drone" },
			{ value: "robot", label: "Robot / Smart Device" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	sepatu: {
		label: "Sepatu Pria / Wanita",
		emoji: "👟",
		isFashion: true,
		subcategories: [
			{ value: "sneakers", label: "Sneakers" },
			{ value: "formal", label: "Sepatu Formal / Pantofel" },
			{ value: "boot", label: "Boot / Ankle Boot" },
			{ value: "heels", label: "High Heels" },
			{ value: "flat", label: "Flat Shoes" },
			{ value: "olahraga", label: "Sepatu Olahraga" },
			{ value: "sandal-jepit", label: "Sandal / Slippers" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	kosmetik: {
		label: "Kosmetik & Perawatan",
		emoji: "💄",
		isFashion: false,
		subcategories: [
			{ value: "lipstik", label: "Lipstik / Lip Cream" },
			{ value: "foundation", label: "Foundation / BB Cream" },
			{ value: "skincare", label: "Skincare / Serum" },
			{ value: "parfum", label: "Parfum / Body Mist" },
			{ value: "maskara", label: "Maskara / Eye Shadow" },
			{ value: "blush", label: "Blush On / Highlighter" },
			{ value: "sabun", label: "Sabun / Body Wash" },
			{ value: "shampoo", label: "Shampoo / Kondisioner" },
			{ value: "sunscreen", label: "Sunscreen / SPF" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	handphone: {
		label: "Handphone & Aksesoris",
		emoji: "📱",
		isFashion: false,
		subcategories: [
			{ value: "smartphone", label: "Smartphone / HP" },
			{ value: "case", label: "Case / Cover HP" },
			{ value: "charger", label: "Charger / Kabel Data" },
			{ value: "screen-protector", label: "Screen Protector / Tempered Glass" },
			{ value: "holder", label: "Holder / Stand HP" },
			{ value: "ring-light", label: "Ring Light / Lighting Selfie" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	komputer: {
		label: "Komputer & Aksesoris",
		emoji: "💻",
		isFashion: false,
		subcategories: [
			{ value: "laptop", label: "Laptop / Notebook" },
			{ value: "pc", label: "PC Desktop" },
			{ value: "monitor", label: "Monitor / Display" },
			{ value: "keyboard", label: "Keyboard / Mouse" },
			{ value: "webcam", label: "Webcam / Headset PC" },
			{ value: "harddisk", label: "Harddisk / SSD" },
			{ value: "cooling", label: "Cooling Pad / Fan" },
			{ value: "tas-laptop", label: "Tas Laptop / Sleeve" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
	lainnya: {
		label: "Produk Lainnya",
		emoji: "📦",
		isFashion: false,
		subcategories: [
			{ value: "makanan-minuman", label: "Makanan & Minuman" },
			{ value: "kesehatan", label: "Produk Kesehatan" },
			{ value: "olahraga", label: "Perlengkapan Olahraga" },
			{ value: "mainan", label: "Mainan / Hobi" },
			{ value: "peralatan-rumah", label: "Peralatan Rumah Tangga" },
			{ value: "tanaman", label: "Tanaman & Berkebun" },
			{ value: "hewan-peliharaan", label: "Produk Hewan Peliharaan" },
			{ value: "buku", label: "Buku & Alat Tulis" },
			{ value: "lainnya", label: "Lainnya" },
		],
	},
};

// ─── VIDEO STYLES ─────────────────────────────────────────────────────────────

export const VIDEO_STYLES: Record<VideoStyleKey, { label: string; emoji: string; description: string }> = {
	"review-only": {
		label: "Review Tanpa Model",
		emoji: "📦",
		description: "Hanya tampilan produk dengan narasi voice-over. Kamera fokus pada produk secara detail.",
	},
	"single-model": {
		label: "1 Model Reviewer",
		emoji: "🎙️",
		description: "Satu model tampil sebagai reviewer yang mempresentasikan dan menggunakan produk.",
	},
	"multi-model": {
		label: "Multi Model",
		emoji: "👥",
		description: "2 model: satu pembicara, satu sebagai pemakai/pemegang produk untuk close-up.",
	},
};

// ─── MODEL GENDER & AGE ───────────────────────────────────────────────────────

export const MODEL_GENDER_AGE: Record<ModelGenderAge, { label: string; emoji: string; voiceDesc: string }> = {
	"pria-muda": {
		label: "Laki-laki Muda Indonesia",
		emoji: "👦",
		voiceDesc: "suara pria muda Indonesia yang energetik dan ramah, usia 18–28 tahun",
	},
	"pria-tua": {
		label: "Laki-laki Dewasa Indonesia",
		emoji: "👨",
		voiceDesc: "suara pria dewasa Indonesia yang berwibawa dan meyakinkan, usia 35–50 tahun",
	},
	"wanita-muda": {
		label: "Wanita Muda Indonesia",
		emoji: "👧",
		voiceDesc: "suara wanita muda Indonesia yang ceria dan antusias, usia 18–28 tahun",
	},
	"wanita-tua": {
		label: "Wanita Dewasa Indonesia",
		emoji: "👩",
		voiceDesc: "suara wanita dewasa Indonesia yang hangat dan terpercaya, usia 30–45 tahun",
	},
};

// ─── LOCATIONS ────────────────────────────────────────────────────────────────

export const LOCATIONS: Record<LocationKey, { label: string; emoji: string; detail: string }> = {
	studio: {
		label: "Studio",
		emoji: "🎬",
		detail: "professional studio dengan background clean, pencahayaan ring light atau softbox",
	},
	"ruangan-khusus": {
		label: "Ruangan Khusus",
		emoji: "🏠",
		detail: "ruangan yang didekorasi khusus sesuai tema produk, aesthetic interior",
	},
	"ruangan-rumah": {
		label: "Ruangan di Dalam Rumah",
		emoji: "🛋️",
		detail: "ruang tamu, kamar tidur, kamar mandi, dapur, atau ruang kerja yang natural dan realistis",
	},
	outdoor: {
		label: "Outdoor",
		emoji: "🌳",
		detail: "taman depan rumah, jalanan pinggir kota, kafe outdoor, atau lokasi publik yang natural",
	},
};

// ─── NARRATION TONES ──────────────────────────────────────────────────────────

export const NARRATION_TONES: Record<NarrationToneKey, { label: string; emoji: string }> = {
	lembut: { label: "Lembut & Tenang", emoji: "🌸" },
	tegas: { label: "Tegas & Percaya Diri", emoji: "💪" },
	ramah: { label: "Ramah & Hangat", emoji: "😊" },
	santai: { label: "Santai & Casual", emoji: "😎" },
	cepat: { label: "Sedikit Cepat & Dinamis", emoji: "⚡" },
	antusias: { label: "Antusias & Excited", emoji: "🎉" },
	profesional: { label: "Profesional & Formal", emoji: "💼" },
	kasual: { label: "Kasual & Natural", emoji: "☕" },
};

// ─── VOICE STYLES ─────────────────────────────────────────────────────────────

export const VOICE_STYLES: Record<VoiceStyleKey, { label: string; emoji: string; description: string }> = {
	"narasi-langsung": {
		label: "Narasi Langsung",
		emoji: "🎤",
		description: "Berbicara langsung ke kamera menjelaskan produk",
	},
	"dialog-interaktif": {
		label: "Dialog Interaktif",
		emoji: "💬",
		description: "Percakapan antara 2 model atau model dengan penonton",
	},
	"monolog-testimonial": {
		label: "Monolog Testimonial",
		emoji: "🗣️",
		description: "Cerita pengalaman pribadi menggunakan produk",
	},
	"voice-over": {
		label: "Voice Over",
		emoji: "🔊",
		description: "Narasi terpisah, kamera fokus pada produk",
	},
};

// ─── SCENE TYPE META ──────────────────────────────────────────────────────────

export const SCENE_TYPE_META: Record<SceneTypeKey, { label: string; emoji: string; color: string }> = {
	problem: { label: "Masalah / Before", emoji: "😟", color: "amber" },
	intro: { label: "Intro Produk", emoji: "✨", color: "leaf" },
	"feature-1": { label: "Fitur Utama", emoji: "⭐", color: "leaf" },
	"feature-2": { label: "Fitur Kedua", emoji: "🌟", color: "moss" },
	"feature-3": { label: "Fitur Ketiga", emoji: "💫", color: "moss" },
	"detail-closeup": { label: "Close-up Detail", emoji: "🔍", color: "leaf" },
	testimonial: { label: "Testimoni / Reaksi", emoji: "😍", color: "amber" },
	comparison: { label: "Before & After", emoji: "🔄", color: "amber" },
	cta: { label: "Call to Action", emoji: "🛒", color: "amber" },
};

// ─── CTA PRESETS ──────────────────────────────────────────────────────────────

export const CTA_PRESETS = [
	"Promo dan diskon hanya untuk hari ini. Mumpung stoknya masih ada, yuk cek keranjang sekarang!",
	"Dapatkan gratis ongkir hari ini juga! Langsung klik tombol keranjang sekarang.",
	"Stok terbatas! Jangan sampai kehabisan, pesan sekarang sebelum kehabisan.",
	"Flash sale berakhir malam ini. Segera order sebelum harga naik kembali!",
	"Beli sekarang dan dapatkan bonus spesial yang tidak akan kamu temukan di tempat lain.",
	"Hubungi kami sekarang dan dapatkan konsultasi gratis plus penawaran terbaik!",
];

// ─── DURATION OPTIONS ─────────────────────────────────────────────────────────

export const TOTAL_DURATION_OPTIONS = [30, 40, 45, 60, 75, 90, 105, 120];
export const SEC_PER_SCENE_OPTIONS = [8, 10, 12, 15, 20];

// ─── CINEMATIC STYLES ─────────────────────────────────────────────────────────

export const CINEMATIC_STYLES = [
	{ value: "natural-realistis", label: "Natural & Realistis" },
	{ value: "cinematic-warm", label: "Cinematic Warm Tone" },
	{ value: "bright-clean", label: "Bright & Clean (TikTok style)" },
	{ value: "moody-dramatic", label: "Moody & Dramatic" },
	{ value: "vintage-film", label: "Vintage Film Look" },
	{ value: "hyper-real", label: "Hyper Realistic" },
	{ value: "editorial-magazine", label: "Editorial Magazine" },
	{ value: "lifestyle-casual", label: "Lifestyle Casual" },
];

// ─── LIGHTING STYLES ─────────────────────────────────────────────────────────

export const LIGHTING_STYLES = [
	{ value: "natural-daylight", label: "Cahaya Alami (Siang Hari)" },
	{ value: "golden-hour", label: "Golden Hour (Sore Hari)" },
	{ value: "studio-softbox", label: "Studio Softbox" },
	{ value: "ring-light", label: "Ring Light (Beauty)" },
	{ value: "backlit-dramatic", label: "Backlit Dramatis" },
	{ value: "neon-urban", label: "Neon / Urban Night" },
	{ value: "window-natural", label: "Cahaya Jendela Natural" },
];

// ─── DEFAULT PRODUCT SPEC ────────────────────────────────────────────────────

export const DEFAULT_PRODUCT_SPEC: ProductSpec = {
	rawMarketplaceText: "",
	visual: "",
	usp: "",
	specs: "",
	targetAudience: "",
	keyNarration: "",
	problemSolved: "",
	isTransformed: false,
};

// ─── DEFAULT DNA ──────────────────────────────────────────────────────────────

export const DEFAULT_PROMO_DNA: PromoDNA = {
	productName: "",
	productDescription: "",
	productSpec: { ...DEFAULT_PRODUCT_SPEC },
	productCategory: "fashion-wanita",
	productSubcategory: "baju",
	isFashionProduct: true,

	videoStyle: "single-model",
	enableProblemSolution: false,
	problemDescription: "",
	solutionDescription: "",

	modelGenderAge: "wanita-muda",
	modelCount: 1,

	narrationTone: "ramah",
	voiceStyle: "narasi-langsung",
	customNarrationNote: "",

	location: "studio",
	locationDetail: "",

	totalDurationSec: 60,
	secPerScene: 10,
	totalScenes: 6,

	aspectRatio: "9:16",
	cinematicStyle: "natural-realistis",
	lightingStyle: "natural-daylight",

	ctaText: CTA_PRESETS[0],
	ctaCustom: false,

	mode: "auto",
};

// ─── VISION MODEL DEFAULTS ───────────────────────────────────────────────────

export const VISION_MODEL_DEFAULTS: Record<ModelType, string> = {
	CLAUDE: "claude-opus-4-5",
	OPENAI: "gpt-4o",
	GEMINI: "gemini-2.5-flash-lite",
	OPENROUTER: "google/gemini-2.5-flash-lite",
};

export function getDefaultVisionModelId(provider: ModelType): string {
	return VISION_MODEL_DEFAULTS[provider];
}

export function getVisionProviderLabel(provider: ModelType): string {
	const labels: Record<ModelType, string> = {
		CLAUDE: "Claude (Anthropic)",
		OPENAI: "OpenAI GPT-4o",
		GEMINI: "Gemini",
		OPENROUTER: "OpenRouter",
	};
	return labels[provider];
}

// ─── SCENE ORDER CALCULATOR ───────────────────────────────────────────────────

export function calculateSceneOrder(
	totalScenes: number,
	enableProblemSolution: boolean,
	totalDurationSec: number
): SceneTypeKey[] {
	const scenes: SceneTypeKey[] = [];

	let remaining = totalScenes;

	// 1. Problem scene (jika diaktifkan)
	if (enableProblemSolution && remaining > 2) {
		scenes.push("problem");
		remaining--;
	}

	// 2. Intro produk - SELALU ada
	scenes.push("intro");
	remaining--;

	// 3. CTA di akhir - SELALU ada, kita sisihkan dulu
	remaining--; // untuk CTA

	// 4. Isi tengah: fitur, detail, testimoni
	const featureKeys: SceneTypeKey[] = ["feature-1", "feature-2", "detail-closeup", "feature-3", "testimonial", "comparison"];
	let fi = 0;
	while (remaining > 0) {
		scenes.push(featureKeys[fi % featureKeys.length]);
		fi++;
		remaining--;
	}

	// 5. Tambahkan CTA di paling akhir
	scenes.push("cta");

	return scenes;
}
