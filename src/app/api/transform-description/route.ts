import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OpenRouter } from "@openrouter/sdk";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { ProductSpec } from "@/components/forms/product-promo-video/types";

const claudeClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const openRouterClient = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TRANSFORM_PROMPT = `Kamu adalah copywriter profesional dan ahli strategi konten video iklan produk untuk marketplace Indonesia (Tokopedia, Shopee, Lazada, TikTok Shop).

Tugasmu: Transform teks deskripsi produk marketplace mentah menjadi format TERSTRUKTUR yang optimal untuk pembuatan prompt video iklan AI.

INPUT dari user adalah teks deskripsi produk mentah (format listing marketplace).

OUTPUT harus dalam format JSON murni (tanpa markdown, tanpa backtick, tanpa penjelasan tambahan):
{
  "visual": "Deskripsi tampilan fisik produk: warna dominan, material/bahan, tekstur, bentuk, ukuran, detail yang terlihat — ditulis sinematik dan konkret untuk prompt video AI",
  "usp": "Unique Selling Point utama: apa yang paling membedakan produk ini, keunggulan kompetitif, alasan customer harus beli — max 2 kalimat, punchy dan persuasif",
  "specs": "Spesifikasi teknis penting yang bisa divisualisasikan: ukuran/dimensi, berat, bahan, kapasitas — format readable (bukan kode singkatan), contoh: 'Lingkar dada 108cm, panjang 132cm, muat berat badan 55-65kg'",
  "targetAudience": "Siapa target pembeli ideal: usia, gender, gaya hidup, kebutuhan spesifik — ditulis konkret dan vivid",
  "keyNarration": "Satu kalimat narasi/tagline dalam Bahasa Indonesia yang catchy, relatable, dan persuasif — max 15 kata, seperti tagline iklan TV yang mudah diingat",
  "problemSolved": "Masalah spesifik yang dirasakan target audience sebelum menemukan produk ini — untuk scene drama before/after di video"
}

RULES WAJIB:
- Semua value dalam Bahasa Indonesia yang natural dan conversational
- keyNarration harus singkat (max 15 kata) dan memorable, bukan kalimat formal
- visual harus deskriptif dan spesifik — bayangkan mendeskripsikan produk ke director video
- usp fokus pada manfaat nyata yang dirasakan pembeli, bukan hanya spesifikasi teknis
- Ubah singkatan marketplace (LD, PJ, BB, dll) ke bahasa normal di specs
- problemSolved harus relatable dan emosional, bukan teknis
- Output HANYA JSON valid, tidak ada teks apapun sebelum { atau sesudah }`;

// ─── SAFE JSON PARSE ─────────────────────────────────────────────────────────

function safeParseSpec(raw: string): Partial<ProductSpec> {
	try {
		// Strip markdown backticks jika ada
		const clean = raw
			.replace(/```json\n?/g, "")
			.replace(/```\n?/g, "")
			.trim();
		return JSON.parse(clean);
	} catch {
		// Fallback: extract manual jika JSON gagal parse
		return {
			visual: raw.substring(0, 200),
			usp: "",
			specs: "",
			targetAudience: "",
			keyNarration: "",
			problemSolved: "",
		};
	}
}
async function callAI(
	provider: string,
	modelId: string,
	userMessage: string
): Promise<string> {
	switch (provider) {
		case "CLAUDE": {
			const res = await claudeClient.messages.create({
				model: modelId || "claude-sonnet-4-5",
				max_tokens: 800,
				messages: [
					{ role: "user", content: `${TRANSFORM_PROMPT}\n\n---\nTeks deskripsi produk:\n${userMessage}` }
				],
			});
			return res.content.find((b) => b.type === "text")?.text ?? "";
		}

		case "OPENAI": {
			const res = await openAIClient.chat.completions.create({
				model: modelId || "gpt-4o-mini",
				max_tokens: 800,
				messages: [
					{ role: "system", content: TRANSFORM_PROMPT },
					{ role: "user", content: `Teks deskripsi produk:\n${userMessage}` }
				],
			});
			return res.choices[0]?.message?.content ?? "";
		}

		case "GEMINI": {
			const res = await geminiClient.models.generateContent({
				model: modelId || "gemini-3.1-flash-lite-preview",
				contents: [{
					role: "user",
					parts: [{ text: `${TRANSFORM_PROMPT}\n\n---\nTeks deskripsi produk:\n${userMessage}` }]
				}],
			});
			return res.text ?? "";
		}

		case "OPENROUTER": {
			const res = await openRouterClient.chat.send({
				chatRequest: {
					model: modelId || "google/gemini-3.1-flash-lite-preview",
					maxTokens: 800,
					messages: [
						{ role: "system", content: TRANSFORM_PROMPT },
						{ role: "user", content: `Teks deskripsi produk:\n${userMessage}` }
					],
				}
			});
			return res.choices[0]?.message?.content ?? "";
		}

		default:
			throw new Error("Provider tidak dikenal");
	}
}
export async function POST(req: NextRequest) {
	let body: {
		rawText: string;
		productName?: string;
		productCategory?: string;
		model?: string;
		modelId?: string;
	};

	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
	}

	const { rawText, productName, productCategory, model, modelId } = body;

	if (!rawText?.trim()) {
		return NextResponse.json({ error: "rawText tidak boleh kosong." }, { status: 400 });
	}

	const provider = model ?? "CLAUDE";

	// Cek API key
	const keyMap: Record<string, string | undefined> = {
		CLAUDE: process.env.ANTHROPIC_API_KEY,
		OPENAI: process.env.OPENAI_API_KEY,
		GEMINI: process.env.GEMINI_API_KEY,
		OPENROUTER: process.env.OPENROUTER_API_KEY,
	};

	if (!keyMap[provider]) {
		return NextResponse.json(
			{ error: `${provider}_API_KEY belum dikonfigurasi di environment.` },
			{ status: 500 }
		);
	}

	// Tambah konteks produk jika ada
	const contextNote = [
		productName ? `Nama produk: "${productName}"` : "",
		productCategory ? `Kategori: ${productCategory}` : "",
	]
		.filter(Boolean)
		.join(". ");

	const userMessage = contextNote
		? `${contextNote}\n\n${rawText}`
		: rawText;

	try {
		const rawOutput = await callAI(provider, modelId ?? "", userMessage);
		const parsed = safeParseSpec(rawOutput);

		const productSpec: ProductSpec = {
			rawMarketplaceText: rawText,
			visual: parsed.visual ?? "",
			usp: parsed.usp ?? "",
			specs: parsed.specs ?? "",
			targetAudience: parsed.targetAudience ?? "",
			keyNarration: parsed.keyNarration ?? "",
			problemSolved: parsed.problemSolved ?? "",
			isTransformed: true,
		};

		return NextResponse.json({ productSpec });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
