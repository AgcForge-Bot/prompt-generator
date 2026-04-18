import type { VideoThemeKey, SeoFormState } from "./types";
import { VIDEO_THEMES } from "./constants";

// ─── HELPER ───────────────────────────────────────────────────────────────────

function themeContext(theme: VideoThemeKey, lang: string): string {
	const t = VIDEO_THEMES[theme];
	return `
TEMA VIDEO: ${t.label}
NICHE: ${t.niche}
PLATFORM TARGET: ${t.platform}
KEYWORD SEED: ${t.keywordSeed.join(", ")}
TARGET AUDIENCE: ${t.audienceDesc}
CONTENT STYLE: ${t.contentStyle}
BAHASA OUTPUT: ${lang === "id" ? "Bahasa Indonesia" : lang === "en" ? "English" : "Bilingual (Bahasa Indonesia dan English, judul dalam kedua bahasa)"}
`.trim();
}

// ─── GENERATE PROMPT ──────────────────────────────────────────────────────────

export function buildGeneratePrompt(state: SeoFormState): string {
	const theme = VIDEO_THEMES[state.theme];
	const langNote =
		state.language === "id"
			? "Semua output dalam Bahasa Indonesia (kecuali tags yang boleh campuran ID+EN)"
			: state.language === "en"
				? "All output in English"
				: "Titles in both Bahasa Indonesia and English. Description in Bahasa Indonesia. Tags mix ID+EN.";

	const extraContext = [
		state.customKeyword ? `Keyword tambahan dari user: "${state.customKeyword}"` : "",
		state.targetAudience ? `Target audience spesifik: "${state.targetAudience}"` : "",
		state.videoStyle ? `Style video: "${state.videoStyle}"` : "",
	]
		.filter(Boolean)
		.join("\n");

	return `Kamu adalah pakar YouTube & Facebook SEO setara VidIQ dan TubeBuddy. Tugas kamu adalah menghasilkan konten SEO yang fully optimized untuk video dengan tema berikut:

${themeContext(state.theme, state.language)}
${extraContext ? `\nINFO TAMBAHAN:\n${extraContext}` : ""}

INSTRUKSI OUTPUT:
Hasilkan response dalam format JSON murni (tidak ada markdown, tidak ada backtick, tidak ada penjelasan di luar JSON).

JSON SCHEMA:
{
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
}

ATURAN WAJIB:
- titleVariants: TEPAT 5 variasi judul. Variasi dalam panjang, angle, dan gaya (angka, pertanyaan, how-to, emotional, mystery). ${langNote}
- seoScore: estimasi 0-100 berdasarkan keyword density, panjang optimal (50-70 char), CTR potential
- searchVolume: estimasi volume pencarian ("High" >10k/bulan, "Medium" 1k-10k, "Low" <1k)
- description: wajib ada hook 2 baris pertama yang kuat, keyword natural di body, minimal 5 hashtag trending di akhir
- tags: TEPAT 30 tags. Campuran: 8 broad tags (volume tinggi), 12 niche tags (relevan), 10 long-tail tags (spesifik). Semua relevan dengan tema
- thumbnailPrompt: detail dan spesifik — langsung bisa dipakai untuk Midjourney/Grok image generation
- storyboardCore: comprehensive overview prompt untuk keseluruhan video
- storyboardScenes: 3 scene image reference prompts (opening, middle, climax/ending)
- Output HANYA JSON valid. Tidak ada teks sebelum { atau setelah }`;
}

// ─── ANALYZE PROMPT ───────────────────────────────────────────────────────────

export function buildAnalyzePrompt(state: SeoFormState): string {
	return `Kamu adalah auditor SEO YouTube & Facebook profesional setara VidIQ Score. Analisa video dari URL berikut dan berikan skor SEO komprehensif.

URL VIDEO: ${state.videoUrl}
${themeContext(state.theme, "id")}

TUGAS:
1. Akses atau asumsikan konten dari URL tersebut berdasarkan pola URL (YouTube/Facebook)
2. Analisa semua elemen SEO yang bisa diidentifikasi
3. Berikan skor objektif dan saran perbaikan yang konkret dan actionable

PENTING: Jika tidak bisa mengakses konten URL secara langsung, analisa berdasarkan:
- Struktur URL (apakah ada keyword di URL)
- Pola platform (YouTube vs Facebook)
- Berikan analisa framework SEO yang bisa diterapkan untuk tema ${VIDEO_THEMES[state.theme].label}

Format output: JSON murni tanpa markdown atau backtick.

JSON SCHEMA:
{
  "url": "${state.videoUrl}",
  "platform": "youtube",
  "theme": "${state.theme}",
  "titleScore": {
    "score": 72,
    "grade": "B",
    "detectedTitle": "judul yang terdeteksi atau null jika tidak bisa diakses",
    "strengths": ["hal positif 1", "hal positif 2"],
    "issues": ["masalah 1", "masalah 2"],
    "suggestions": ["saran perbaikan konkret 1", "saran perbaikan konkret 2"]
  },
  "thumbnailScore": {
    "score": 65,
    "grade": "C",
    "thumbnailSuggestion": "deskripsi thumbnail yang ideal untuk tema ini",
    "strengths": [],
    "issues": ["masalah thumbnail umum untuk tema ini"],
    "suggestions": ["saran visual thumbnail yang optimal"]
  },
  "descriptionScore": {
    "score": 55,
    "grade": "C",
    "detectedDescription": null,
    "strengths": [],
    "issues": ["masalah deskripsi"],
    "suggestions": ["saran perbaikan deskripsi dengan contoh konkret"]
  },
  "tagsScore": {
    "score": 60,
    "grade": "C",
    "detectedTags": [],
    "strengths": [],
    "issues": ["masalah tags"],
    "suggestions": ["rekomendasikan 10 tags yang harus ada untuk tema ini"]
  },
  "overallScore": 63,
  "overallGrade": "C",
  "priorityFixes": [
    "Perbaikan #1 yang paling berdampak",
    "Perbaikan #2",
    "Perbaikan #3"
  ]
}

ATURAN SKOR:
- 85-100: Grade A — Fully optimized
- 70-84: Grade B — Good, minor improvements needed
- 55-69: Grade C — Average, significant improvements needed
- 40-54: Grade D — Poor, major rework required
- 0-39: Grade F — Critical issues

Setiap suggestions harus:
- Spesifik dan actionable (bukan generik)
- Disertai contoh konkret jika memungkinkan
- Disesuaikan dengan tema ${VIDEO_THEMES[state.theme].label}

Output HANYA JSON valid.`;
}
