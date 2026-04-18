import type { VideoThemeKey, SeoFormState, CustomThemeData } from "./types";
import { VIDEO_THEMES } from "./constants";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function langNote(lang: string): string {
	if (lang === "id") return "Semua output dalam Bahasa Indonesia (kecuali tags yang boleh campuran ID+EN)";
	if (lang === "en") return "All output in English";
	return "Titles in both Bahasa Indonesia and English. Description in Bahasa Indonesia. Tags mix ID+EN.";
}

// Bangun konteks dari tema preset
function presetThemeContext(theme: Exclude<VideoThemeKey, "other-video-theme">, lang: string): string {
	const t = VIDEO_THEMES[theme];
	return `TEMA VIDEO: ${t.label}
NICHE: ${t.niche}
PLATFORM TARGET: ${t.platform}
KEYWORD SEED: ${t.keywordSeed.join(", ")}
TARGET AUDIENCE: ${t.audienceDesc}
CONTENT STYLE: ${t.contentStyle}
BAHASA OUTPUT: ${lang === "id" ? "Bahasa Indonesia" : lang === "en" ? "English" : "Bilingual"}`;
}

// Bangun konteks dari custom theme (other-video-theme)
function customThemeContext(ct: CustomThemeData, lang: string): string {
	const imageNote = ct.imageRefs.length > 0
		? `\nREFERENSI GAMBAR: ${ct.imageRefs.length} gambar referensi telah disertakan — gunakan sebagai acuan visual untuk storyboard dan thumbnail prompt.`
		: "";

	return `TEMA VIDEO: ${ct.themeName || "Tema Custom"}
NICHE/GENRE: ${ct.themeNiche || "—"}
PLATFORM TARGET: ${ct.targetPlatform || "YouTube"}
DESKRIPSI TEMA & ALUR CERITA:
${ct.videoDescription || "—"}
TARGET AUDIENCE: ${ct.targetAudienceCustom || "—"}
GAYA KONTEN: ${ct.contentStyle || "—"}
KEYWORD HINT DARI USER: ${ct.keywordHints || "—"}
BAHASA OUTPUT: ${lang === "id" ? "Bahasa Indonesia" : lang === "en" ? "English" : "Bilingual"}${imageNote}`;
}

// ─── JSON SCHEMA TEMPLATE ─────────────────────────────────────────────────────

const JSON_SCHEMA = `{
  "titleVariants": [
    {
      "title": "judul video yang menarik dan SEO-friendly",
      "seoScore": 85,
      "searchVolume": "High",
      "clickbaitScore": 78,
      "charCount": 67,
      "keywords": ["keyword1", "keyword2"],
      "reason": "penjelasan singkat kenapa judul ini efektif"
    }
  ],
  "bestTitleIndex": 0,
  "description": "deskripsi lengkap SEO dengan hook di 2 baris pertama, body konten, hashtag di akhir. Minimum 800 karakter.",
  "descriptionKeywords": ["keyword utama", "secondary keyword"],
  "descriptionCharCount": 950,
  "tags": [
    {
      "tag": "nama tag",
      "volume": "High",
      "relevance": 92,
      "category": "broad"
    }
  ],
  "totalTagCount": 30,
  "overallTagScore": 82,
  "thumbnailPrompt": "prompt detail untuk generate thumbnail menggunakan AI image generator seperti Midjourney atau Grok. Sertakan: komposisi, warna, teks overlay yang disarankan, ekspresi/aksi, latar belakang, gaya visual.",
  "storyboardCore": "1 prompt inti keseluruhan video yang komprehensif — mendeskripsikan visual keseluruhan, mood, gaya sinematik, dan arc cerita dari awal ke akhir.",
  "storyboardScenes": [
    {
      "sceneNum": 1,
      "title": "judul scene",
      "imagePrompt": "prompt spesifik untuk generate image reference scene ini di Grok/VEO — detail visual, komposisi, pencahayaan, mood",
      "duration": "0:00–0:15",
      "description": "deskripsi singkat apa yang terjadi di scene ini"
    }
  ]
}`;

const GENERATE_RULES = (note: string, totalScenes: number, secPerScene: number, totalDurationSec: number) => `ATURAN WAJIB:
- titleVariants: TEPAT 5 variasi judul. Variasi dalam panjang, angle, dan gaya (angka, pertanyaan, how-to, emotional, mystery). ${note}
- seoScore: estimasi 0-100 berdasarkan keyword density, panjang optimal (50-70 char), CTR potential
- searchVolume: estimasi volume pencarian ("High" >10k/bulan, "Medium" 1k-10k, "Low" <1k)
- description: wajib ada hook 2 baris pertama yang kuat, keyword natural di body, minimal 5 hashtag trending di akhir
- tags: TEPAT 30 tags. Campuran: 8 broad tags (volume tinggi), 12 niche tags (relevan), 10 long-tail tags (spesifik). Semua relevan dengan tema
- thumbnailPrompt: detail dan spesifik — langsung bisa dipakai untuk Midjourney/Grok image generation
- storyboardCore: comprehensive overview prompt untuk keseluruhan video
- storyboardScenes: WAJIB TEPAT ${totalScenes} scene image reference prompts. Kalkulasi: ${totalDurationSec} detik ÷ ${secPerScene} detik per scene = ${totalScenes} scene. Setiap scene mewakili segmen ${secPerScene} detik dari video. Distribusikan arc cerita dari intro → body → climax → outro secara proporsional di ${totalScenes} scene. Format duration setiap scene: "m:ss–m:ss" sesuai posisi waktu.
- Output HANYA JSON valid. Tidak ada teks sebelum { atau setelah }`;

// ─── GENERATE PROMPT — PRESET THEME ──────────────────────────────────────────

export function buildGeneratePrompt(state: SeoFormState): string {
	const isCustom = state.theme === "other-video-theme";
	const note = langNote(state.language);

	const themeCtx = isCustom
		? customThemeContext(state.customTheme, state.language)
		: presetThemeContext(state.theme as Exclude<VideoThemeKey, "other-video-theme">, state.language);

	const extraContext = [
		state.customKeyword ? `Keyword tambahan dari user: "${state.customKeyword}"` : "",
		state.targetAudience ? `Target audience spesifik: "${state.targetAudience}"` : "",
		state.videoStyle ? `Style video: "${state.videoStyle}"` : "",
	]
		.filter(Boolean)
		.join("\n");

	const imageInstruction = isCustom && state.customTheme.imageRefs.length > 0
		? `\nPERHATIAN GAMBAR REFERENSI: User telah menyertakan ${state.customTheme.imageRefs.length} gambar referensi. Gunakan deskripsi visual dari gambar-gambar tersebut sebagai inspirasi utama untuk thumbnailPrompt dan imagePrompt di setiap storyboardScenes. Buat prompt yang konsisten secara visual dengan apa yang ditampilkan di gambar referensi.\n`
		: "";

	const totalScenes = state.totalStoryboardScenes ?? (Math.floor(state.totalDurationSec / state.secPerScene) || 6);
	const secPerScene = state.secPerScene ?? 10;
	const totalDurationSec = state.totalDurationSec ?? 60;

	return `Kamu adalah pakar YouTube & Facebook SEO setara VidIQ dan TubeBuddy. Tugas kamu adalah menghasilkan konten SEO yang fully optimized untuk video dengan tema berikut:

${themeCtx}
${extraContext ? `\nINFO TAMBAHAN:\n${extraContext}` : ""}${imageInstruction}

KONFIGURASI DURASI VIDEO:
- Total durasi: ${totalDurationSec} detik
- Durasi per scene: ${secPerScene} detik
- Total scene yang harus dibuat: ${totalScenes} scene (hasil kalkulasi ${totalDurationSec} ÷ ${secPerScene} = ${totalScenes})

INSTRUKSI OUTPUT:
Hasilkan response dalam format JSON murni (tidak ada markdown, tidak ada backtick, tidak ada penjelasan di luar JSON).

JSON SCHEMA:
${JSON_SCHEMA}

${GENERATE_RULES(note, totalScenes, secPerScene, totalDurationSec)}`;
}

// ─── GENERATE PROMPT — CUSTOM THEME WITH IMAGES (multipart) ──────────────────
// Dipakai di API saat ada image refs — return messages array format

export function buildCustomThemeMessages(state: SeoFormState): {
	text: string;
	images: { base64: string; mediaType: string }[];
} {
	const note = langNote(state.language);
	const ct = state.customTheme;

	const extraContext = [
		state.customKeyword ? `Keyword tambahan dari user: "${state.customKeyword}"` : "",
		state.targetAudience ? `Target audience spesifik: "${state.targetAudience}"` : "",
		state.videoStyle ? `Style video: "${state.videoStyle}"` : "",
	]
		.filter(Boolean)
		.join("\n");

	const totalScenes2 = state.totalStoryboardScenes ?? (Math.floor(state.totalDurationSec / state.secPerScene) || 6);
	const secPerScene2 = state.secPerScene ?? 10;
	const totalDurationSec2 = state.totalDurationSec ?? 60;

	const text = `Kamu adalah pakar YouTube & Facebook SEO setara VidIQ dan TubeBuddy. Hasilkan konten SEO fully optimized untuk video custom theme berikut:

${customThemeContext(ct, state.language)}
${extraContext ? `\nINFO TAMBAHAN:\n${extraContext}` : ""}

KONFIGURASI DURASI VIDEO:
- Total durasi: ${totalDurationSec2} detik
- Durasi per scene: ${secPerScene2} detik
- Total scene yang harus dibuat: ${totalScenes2} scene

INSTRUKSI GAMBAR REFERENSI:
${ct.imageRefs.length > 0
			? `User telah menyertakan ${ct.imageRefs.length} gambar referensi visual untuk tema ini. Analisa gambar-gambar tersebut dan gunakan sebagai inspirasi utama untuk:
- thumbnailPrompt: buat prompt thumbnail yang secara visual konsisten dengan gambar referensi
- storyboardCore: deskripsikan visual keseluruhan video yang mencerminkan estetika gambar referensi
- imagePrompt di setiap storyboardScenes: buat prompt yang mengacu pada gaya visual gambar referensi`
			: "Tidak ada gambar referensi. Hasilkan berdasarkan deskripsi tema saja."
		}

INSTRUKSI OUTPUT:
Hasilkan response dalam format JSON murni (tidak ada markdown, tidak ada backtick).

JSON SCHEMA:
${JSON_SCHEMA}

${GENERATE_RULES(note, totalScenes2, secPerScene2, totalDurationSec2)}`;

	return {
		text,
		images: ct.imageRefs.map((img) => ({
			base64: img.base64,
			mediaType: img.mediaType,
		})),
	};
}

// ─── ANALYZE PROMPT ───────────────────────────────────────────────────────────

export function buildAnalyzePrompt(state: SeoFormState): string {
	const isCustom = state.theme === "other-video-theme";

	const themeCtx = isCustom
		? customThemeContext(state.customTheme, "id")
		: presetThemeContext(state.theme as Exclude<VideoThemeKey, "other-video-theme">, "id");

	const themeLabel = isCustom
		? (state.customTheme.themeName || "Tema Custom")
		: VIDEO_THEMES[state.theme as Exclude<VideoThemeKey, "other-video-theme">]?.label ?? state.theme;

	return `Kamu adalah auditor SEO YouTube & Facebook profesional setara VidIQ Score. Analisa video dari URL berikut dan berikan skor SEO komprehensif.

URL VIDEO: ${state.videoUrl}
${themeCtx}

TUGAS:
1. Akses atau asumsikan konten dari URL tersebut berdasarkan pola URL (YouTube/Facebook)
2. Analisa semua elemen SEO yang bisa diidentifikasi
3. Berikan skor objektif dan saran perbaikan yang konkret dan actionable

PENTING: Jika tidak bisa mengakses konten URL secara langsung, analisa berdasarkan:
- Struktur URL (apakah ada keyword di URL)
- Pola platform (YouTube vs Facebook)
- Berikan analisa framework SEO yang bisa diterapkan untuk tema ${themeLabel}

Format output: JSON murni tanpa markdown atau backtick.

JSON SCHEMA:
{
  "url": "${state.videoUrl}",
  "platform": "youtube",
  "theme": "${state.theme}",
  "titleScore": {
    "score": 72,
    "grade": "B",
    "detectedTitle": "judul yang terdeteksi atau null",
    "strengths": ["hal positif"],
    "issues": ["masalah"],
    "suggestions": ["saran konkret"]
  },
  "thumbnailScore": {
    "score": 65,
    "grade": "C",
    "thumbnailSuggestion": "deskripsi thumbnail ideal untuk tema ini",
    "strengths": [],
    "issues": ["masalah thumbnail"],
    "suggestions": ["saran visual thumbnail"]
  },
  "descriptionScore": {
    "score": 55,
    "grade": "C",
    "detectedDescription": null,
    "strengths": [],
    "issues": ["masalah deskripsi"],
    "suggestions": ["saran perbaikan dengan contoh konkret"]
  },
  "tagsScore": {
    "score": 60,
    "grade": "C",
    "detectedTags": [],
    "strengths": [],
    "issues": ["masalah tags"],
    "suggestions": ["rekomendasikan 10 tags yang harus ada"]
  },
  "overallScore": 63,
  "overallGrade": "C",
  "priorityFixes": ["Perbaikan #1 paling berdampak", "Perbaikan #2", "Perbaikan #3"]
}

ATURAN SKOR:
- 85-100: Grade A — Fully optimized
- 70-84: Grade B — Good, minor improvements needed
- 55-69: Grade C — Average, significant improvements needed
- 40-54: Grade D — Poor, major rework required
- 0-39: Grade F — Critical issues

Setiap suggestions harus spesifik, actionable, dan disesuaikan dengan tema ${themeLabel}.
Output HANYA JSON valid.`;
}
