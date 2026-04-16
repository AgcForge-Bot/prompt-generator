import type { PromoDNA, SceneConfig, ImageRef } from "./types";
import {
	PRODUCT_CATEGORIES,
	VIDEO_STYLES,
	MODEL_GENDER_AGE,
	LOCATIONS,
	NARRATION_TONES,
	VOICE_STYLES,
	SCENE_TYPE_META,
} from "./constants";

// ─── TECHNICAL CONSISTENCY NOTE ──────────────────────────────────────────────

function buildConsistencyNote(dna: PromoDNA, images: ImageRef[]): string {
	const hasImages = images.length > 0;
	const imageDescriptions = images
		.filter((img) => img.aiDescription && img.status === "done")
		.map((img) => img.aiDescription)
		.join(" | ");

	const modelDesc = MODEL_GENDER_AGE[dna.modelGenderAge];
	const catMeta = PRODUCT_CATEGORIES[dna.productCategory];

	let note = `
📌 CATATAN TEKNIS KONSISTENSI AI:
• Produk: "${dna.productName}" — ${catMeta.label}${dna.productSubcategory ? ` (${dna.productSubcategory})` : ""}
• Gunakan gambar referensi produk yang diupload sebagai acuan visual UTAMA di setiap scene
• Pastikan warna, bentuk, logo, dan detail produk IDENTIK di setiap scene — tidak boleh berubah
• Model: ${modelDesc.label} — ${modelDesc.voiceDesc}
• Tampilan model harus KONSISTEN di setiap scene (wajah, pakaian, rambut, ekspresi dasar)
• Rasio video: ${dna.aspectRatio} — pastikan framing sesuai di setiap scene
• Bahasa narasi: BAHASA INDONESIA yang jelas, alami, dan mudah dipahami
• DILARANG: CGI berlebihan, model berbeda di tiap scene, produk berubah tampilan`;

	if (hasImages && imageDescriptions) {
		note += `\n• Referensi visual produk dari AI: ${imageDescriptions.substring(0, 300)}...`;
	}

	// Tambahkan visual reference dari structured spec jika ada
	const spec = dna.productSpec;
	if (spec.isTransformed && spec.visual) {
		note += `\n• Deskripsi visual produk: ${spec.visual}`;
	}
	if (spec.isTransformed && spec.specs) {
		note += `\n• Spesifikasi teknis: ${spec.specs}`;
	}

	return note;
}

// ─── LOCATION CONTEXT ────────────────────────────────────────────────────────

function buildLocationContext(dna: PromoDNA): string {
	const loc = LOCATIONS[dna.location];
	const detail = dna.locationDetail || loc.detail;
	return `${loc.label}: ${detail}`;
}

// ─── NARRATOR VOICE SPEC ─────────────────────────────────────────────────────

function buildVoiceSpec(dna: PromoDNA): string {
	const tone = NARRATION_TONES[dna.narrationTone];
	const voice = VOICE_STYLES[dna.voiceStyle];
	const modelVoice = MODEL_GENDER_AGE[dna.modelGenderAge].voiceDesc;
	const extra = dna.customNarrationNote ? ` | Catatan tambahan: ${dna.customNarrationNote}` : "";
	return `${voice.label} — ${tone.label} — ${modelVoice}${extra}`;
}

// ─── MODEL DESCRIPTION ───────────────────────────────────────────────────────

function buildModelDesc(dna: PromoDNA): string {
	const modelMeta = MODEL_GENDER_AGE[dna.modelGenderAge];
	const styleMeta = VIDEO_STYLES[dna.videoStyle];
	const isFashion = PRODUCT_CATEGORIES[dna.productCategory].isFashion;

	if (dna.videoStyle === "review-only") {
		return "Tidak ada model. Kamera sepenuhnya fokus pada produk. Voice over narasi di latar.";
	}

	if (dna.videoStyle === "single-model") {
		return `Satu model: ${modelMeta.label}, tampil sebagai presenter/reviewer produk`;
	}

	// multi-model
	const secondModelRole = isFashion
		? `Model kedua: ${modelMeta.label}, sebagai pemakai produk (mengenakan/menggunakan produk untuk di-closeup kamera)`
		: `Model kedua: ${modelMeta.label}, sebagai pemegang produk untuk di-closeup kamera`;

	return `Dua model: Model pertama (${modelMeta.label}) sebagai pembicara/presenter. ${secondModelRole}`;
}

// ─── PRODUCT ACTION CONTEXT ───────────────────────────────────────────────────

function buildProductAction(dna: PromoDNA, sceneIndex: number): string {
	const isFashion = PRODUCT_CATEGORIES[dna.productCategory].isFashion;
	const cat = dna.productCategory;

	if (isFashion) {
		const fashionActions = [
			`Model mengenakan ${dna.productName}, kamera slow-motion dari kepala ke kaki`,
			`Close-up tekstur dan material ${dna.productName}, tangan model menyentuh kain/bahan`,
			`Model berputar 360 derajat memperlihatkan seluruh sisi ${dna.productName}`,
			`Detail jahitan, motif, dan finishing ${dna.productName} dalam extreme close-up`,
			`Model berjalan natural sambil mengenakan ${dna.productName}`,
		];
		return fashionActions[sceneIndex % fashionActions.length];
	}

	// Non-fashion
	const techActions = [
		`Produk ${dna.productName} di-unboxing atau dikeluarkan dari kemasan dengan elegan`,
		`Demonstrasi fitur utama ${dna.productName} secara langsung`,
		`Close-up detail dan tombol/fitur ${dna.productName} dari berbagai sudut`,
		`Produk ${dna.productName} digunakan secara nyata dalam kehidupan sehari-hari`,
		`Perbandingan size/scale ${dna.productName} dengan objek referensi`,
	];
	return techActions[sceneIndex % techActions.length];
}

// ─── CAMERA SPECS ─────────────────────────────────────────────────────────────

const CAMERA_SPECS_BY_SCENE: Record<string, string> = {
	problem: "Medium shot, handheld sedikit shake untuk kesan dramatis, warm-to-cool color grade",
	intro: "Wide shot lalu zoom in ke produk, smooth gimbal movement, dramatic reveal",
	"feature-1": "Close-up 50mm, slow-motion 120fps, shallow depth of field, bokeh background",
	"feature-2": "Medium close-up, lateral tracking shot, product in focus, background blur",
	"feature-3": "Macro close-up extreme detail, static tripod, clinical sharp focus",
	"detail-closeup": "Extreme close-up macro, studio lighting, 100% sharp focus pada detail produk",
	testimonial: "Medium shot model, eye-level camera, natural handheld, genuine reaction",
	comparison: "Split screen atau cut antara before-after, consistent angle, color coded",
	cta: "Medium shot model to camera, confident pose, text overlay CTA, upbeat lighting",
};

// ─── MAIN PROMPT BUILDER ──────────────────────────────────────────────────────

export function buildScenePrompt(
	dna: PromoDNA,
	scene: SceneConfig,
	sceneIndex: number,
	totalScenes: number,
	images: ImageRef[]
): string {
	const sceneMeta = SCENE_TYPE_META[scene.sceneType];
	const locationContext = buildLocationContext(dna);
	const voiceSpec = buildVoiceSpec(dna);
	const modelDesc = buildModelDesc(dna);
	const productAction = buildProductAction(dna, sceneIndex);
	const cameraSpec = CAMERA_SPECS_BY_SCENE[scene.sceneType] || CAMERA_SPECS_BY_SCENE["feature-1"];
	const consistencyNote = buildConsistencyNote(dna, images);
	const catMeta = PRODUCT_CATEGORIES[dna.productCategory];

	// Product spec block — gunakan structured spec jika sudah di-transform, fallback ke productDescription
	const spec = dna.productSpec;
	const hasStructuredSpec = spec.isTransformed && (spec.visual || spec.usp || spec.specs);

	const prodDescBlock = hasStructuredSpec
		? `
🔍 ANALISA PRODUK (TERSTRUKTUR):
• VISUAL    : ${spec.visual || "—"}
• USP       : ${spec.usp || "—"}
• SPESIFIKASI: ${spec.specs || "—"}
• TARGET    : ${spec.targetAudience || "—"}
• NARASI KUNCI: "${spec.keyNarration || "—"}"
• MASALAH DISELESAIKAN: ${spec.problemSolved || "—"}`
		: dna.productDescription
			? `\n🔍 ANALISA PRODUK:\n${dna.productDescription}`
			: "";

	// Scene-specific content
	let sceneContent = "";

	switch (scene.sceneType) {
		case "problem":
			sceneContent = `
🎭 ADEGAN MASALAH / BEFORE:
${dna.videoStyle !== "review-only"
					? `Model menunjukkan ekspresi frustrasi, kesulitan, atau ketidakpuasan. Situasi: ${dna.problemDescription || (dna.productSpec.isTransformed && dna.productSpec.problemSolved ? dna.productSpec.problemSolved : `kondisi sebelum menggunakan ${dna.productName} — tampilkan masalah yang relevan dengan produk ${catMeta.label}`)}`
					: `Narasi voice over mendeskripsikan masalah: "${dna.problemDescription || (dna.productSpec.isTransformed && dna.productSpec.problemSolved ? dna.productSpec.problemSolved : `Pernah merasa kesulitan atau tidak puas dengan produk ${catMeta.label} yang ada?`)}" — kamera menampilkan visual masalah yang relevan`
				}
${dna.productSpec.isTransformed && dna.productSpec.targetAudience ? `Target audience: ${dna.productSpec.targetAudience}` : ""}
Durasi adegan: ${scene.duration} detik
Nada: dramatis ringan, empati, relatable untuk target audience`;
			break;

		case "intro":
			sceneContent = `
✨ SCENE INTRO PRODUK:
${dna.enableProblemSolution && dna.solutionDescription
					? `Transisi dari masalah ke solusi. Narasi: "${dna.solutionDescription || `Tenang, ada solusinya! Perkenalkan — ${dna.productName}!`}"`
					: `Perkenalan produk "${dna.productName}" secara dramatis dan menarik`}
${dna.videoStyle !== "review-only" ? `Model muncul dengan ekspresi percaya diri sambil memperlihatkan produk ke kamera` : `Produk muncul dari angle dramatis — hero shot produk utama`}
Narasi dialog (Bahasa Indonesia): "Halo! Hari ini aku mau kenalin kalian sama [${dna.productName}] yang udah bikin aku jatuh cinta. Yuk kita lihat!"
Durasi: ${scene.duration} detik`;
			break;

		case "feature-1":
			sceneContent = `
⭐ FITUR & KEUNGGULAN UTAMA:
Sorot fitur unggulan pertama dan terpenting dari ${dna.productName}
${dna.productSpec.isTransformed && dna.productSpec.usp ? `USP Produk: ${dna.productSpec.usp}` : ""}
${productAction}
Narasi dialog (Bahasa Indonesia): ${dna.productSpec.isTransformed && dna.productSpec.keyNarration ? `Gunakan tagline: "${dna.productSpec.keyNarration}" — lalu elaborasi keunggulan utama produk` : "Jelaskan dengan antusias keunggulan utama produk — material, kualitas, fungsi, atau keunikan yang membuat produk ini spesial dibanding kompetitor"}
${catMeta.isFashion ? "Tampilkan detail bahan/material dari dekat, cara fitting/pakai yang mudah" : "Demonstrasi langsung fungsi utama produk secara nyata"}
Durasi: ${scene.duration} detik`;
			break;

		case "feature-2":
			sceneContent = `
🌟 FITUR KEDUA & NILAI TAMBAH:
Tampilkan keunggulan kedua yang melengkapi fitur pertama dari ${dna.productName}
${productAction}
Narasi dialog (Bahasa Indonesia): "Yang bikin aku makin suka adalah... [sebutkan fitur kedua]. Ini yang bikin [${dna.productName}] beda dari yang lain!"
${catMeta.isFashion ? "Perlihatkan versatilitas — bisa dipakai untuk berbagai kesempatan atau di-styling berbeda" : "Tunjukkan secondary feature yang memudahkan kehidupan sehari-hari"}
Durasi: ${scene.duration} detik`;
			break;

		case "feature-3":
			sceneContent = `
💫 FITUR KETIGA & DETAIL SPESIAL:
Keunggulan ketiga atau detail spesial dari ${dna.productName} yang sering terlewat tapi sangat berharga
${productAction}
Narasi dialog (Bahasa Indonesia): "Dan masih ada lagi yang aku suka... [detailkan fitur ketiga]. Seriously, ini worth banget!"
Fokus pada detail finishing, packaging, bonus, atau value tambahan yang membuat harga sebanding
Durasi: ${scene.duration} detik`;
			break;

		case "detail-closeup":
			sceneContent = `
🔍 DETAIL EXTREME CLOSE-UP:
Extreme macro shot pada detail terpenting ${dna.productName}
${dna.productSpec.isTransformed && dna.productSpec.specs ? `Spesifikasi yang harus terlihat: ${dna.productSpec.specs}` : ""}
${catMeta.isFashion
					? `Detail: tekstur kain/material, jahitan presisi, aksesoris, logo, warna actual product`
					: `Detail: port/tombol, material build quality, branding, packaging detail`
				}
Kamera: macro lens atau extreme close-up, tripod statis, pencahayaan merata
Narasi: voice-over singkat menjelaskan spesifikasi yang terlihat, membangun kepercayaan kualitas
Durasi: ${scene.duration} detik`;
			break;

		case "testimonial":
			sceneContent = `
😍 TESTIMONI & REAKSI NYATA:
${dna.videoStyle === "multi-model"
					? "Model kedua memberikan reaksi genuine setelah mencoba/melihat produk. Model pertama bertanya pendapatnya"
					: dna.videoStyle === "single-model"
						? "Model berekspresi puas dan excited, memberikan testimoni langsung ke kamera dengan ekspresi yang genuine"
						: "Narasi voice-over testimonial pelanggan nyata dengan visual produk sedang digunakan"
				}
Narasi dialog (Bahasa Indonesia): "Jujur ya, pertama kali coba [${dna.productName}] aku langsung wow! [Ceritakan pengalaman positif spesifik]. Beneran recommended banget!"
Ekspresi: natural, genuine, tidak dibuat-buat. Reaksi autentik membangun trust
Durasi: ${scene.duration} detik`;
			break;

		case "comparison":
			sceneContent = `
🔄 PERBANDINGAN BEFORE & AFTER:
Visual perbandingan jelas antara kondisi sebelum dan sesudah menggunakan ${dna.productName}
${catMeta.isFashion
					? "Before: outfit biasa/kusam. After: tampil percaya diri dengan produk"
					: "Before: masalah yang relevan. After: masalah terselesaikan dengan produk"
				}
Narasi dialog (Bahasa Indonesia): "Ini bedanya sebelum dan sesudah pakai [${dna.productName}]... coba lihat sendiri!"
Gunakan transisi visual yang dramatis (split screen, wipe, atau cut langsung)
Durasi: ${scene.duration} detik`;
			break;

		case "cta":
			sceneContent = `
🛒 CALL TO ACTION — PENUTUP:
${dna.videoStyle !== "review-only" ? "Model menatap kamera dengan penuh keyakinan, gestur tangan menunjuk ke layar/keranjang" : "Produk tampil hero shot dengan text overlay CTA yang bold"}
Narasi dialog (Bahasa Indonesia): "${dna.ctaText}"
Visual: tampilkan produk ${dna.productName} sekali lagi secara jelas, sertakan teks harga/promo jika relevan
Ending: freeze frame atau slow-motion produk dengan music swell
Durasi: ${scene.duration} detik`;
			break;
	}

	// ─── ASSEMBLE FULL PROMPT ─────────────────────────────────────────────────

	return `═══════════════════════════════════════════
🎬 SCENE ${scene.id} / ${totalScenes} — ${sceneMeta.emoji} ${sceneMeta.label.toUpperCase()}
Durasi: ${scene.duration} detik | Rasio: ${dna.aspectRatio} | Platform: TikTok/Instagram/YouTube Shorts
═══════════════════════════════════════════

📦 PRODUK: ${dna.productName}
🏷️ Kategori: ${catMeta.emoji} ${catMeta.label}${dna.productSubcategory ? ` › ${dna.productSubcategory}` : ""}${prodDescBlock}

🎥 GAYA VIDEO: ${VIDEO_STYLES[dna.videoStyle].label}
👤 MODEL: ${modelDesc}

📍 LOKASI: ${locationContext}
💡 PENCAHAYAAN: ${dna.lightingStyle}
🎨 GAYA SINEMATIK: ${dna.cinematicStyle}
📷 KAMERA: ${cameraSpec}
🔊 NARASI: ${voiceSpec}
${sceneContent}

🎬 SPESIFIKASI TEKNIS:
• Format: ${dna.aspectRatio} ${dna.aspectRatio === "9:16" ? "(Vertikal — TikTok/Reels/Shorts)" : "(Horizontal — YouTube/Facebook)"}
• Durasi scene: ${scene.duration} detik
• Kualitas: 4K ultra-realistic, cinematic color grade
• Audio: narasi bahasa Indonesia jernih + background music yang sesuai mood
• Transisi: smooth cut atau gentle transition ke scene berikutnya

${consistencyNote}

💡 INSTRUKSI UNTUK AI VIDEO GENERATOR:
Gunakan gambar referensi produk yang disertakan sebagai anchor visual UTAMA.
Pastikan ${dna.productName} terlihat IDENTIK dengan referensi di setiap shot.
Realism priority: photographic, no CGI artifacts, natural human movement.
═══════════════════════════════════════════`;
}

// ─── AUTO GENERATE ALL SCENES ─────────────────────────────────────────────────

export function buildAllScenePrompts(
	dna: PromoDNA,
	scenes: SceneConfig[],
	images: ImageRef[]
): string[] {
	return scenes.map((scene, index) =>
		buildScenePrompt(dna, scene, index, scenes.length, images)
	);
}

// ─── AI PRODUCT ANALYSIS PROMPT ───────────────────────────────────────────────

export const PRODUCT_ANALYSIS_PROMPT = `Kamu adalah analis produk profesional untuk pembuatan video promosi iklan.

Analisa gambar produk ini dan buat deskripsi yang komprehensif untuk digunakan dalam pembuatan prompt video AI. Fokus pada:

1. NAMA & JENIS: Identifikasi produk secara spesifik
2. TAMPILAN VISUAL: Warna dominan, material, tekstur, bentuk, ukuran estimasi
3. BRANDING: Logo, tulisan, label yang terlihat
4. KEUNGGULAN VISUAL: Apa yang membuat produk ini menarik secara visual?
5. TARGET MARKET: Siapa yang cocok menggunakan produk ini?
6. USP (Unique Selling Point): Apa keunikan atau keunggulan yang terlihat?
7. SARAN SCENE: Saran angle kamera dan adegan yang cocok untuk video promosi produk ini

Tulis dalam bahasa Indonesia yang jelas dan detail. Format: paragraf singkat 120-180 kata.
Mulai dengan "PRODUK TERIDENTIFIKASI:" dan deskripsikan secara sinematik dan menarik.`;
