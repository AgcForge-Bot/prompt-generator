import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OpenRouter } from "@openrouter/sdk";
import { GoogleGenAI, createPartFromBase64, createPartFromText } from "@google/genai";
import { parseJsonFromModelOutput } from "@/lib/aiJson";

// ─── LAZY CLIENTS ─────────────────────────────────────────────────────────────

function getClaudeClient() {
	if (!process.env.ANTHROPIC_API_KEY) return null;
	return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
function getGeminiClient() {
	if (!process.env.GEMINI_API_KEY) return null;
	return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}
function getOpenRouterClient() {
	if (!process.env.OPENROUTER_API_KEY) return null;
	return new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
}

// ─── CALL AI — TEXT + OPTIONAL IMAGES ────────────────────────────────────────

async function callAI(
	provider: string,
	modelId: string,
	systemPrompt: string,
	userPrompt: string,
	images: { base64: string; mediaType: string }[] = [],
	maxTokens = 1200,
): Promise<string> {
	const hasImages = images.length > 0;

	switch (provider) {
		case "CLAUDE": {
			const client = getClaudeClient();
			if (!client) throw new Error("ANTHROPIC_API_KEY not configured");

			// Build content array
			const userContent: Anthropic.MessageParam["content"] = hasImages
				? [
					...images.map((img): Anthropic.ImageBlockParam => ({
						type: "image",
						source: {
							type: "base64",
							media_type: img.mediaType as Anthropic.Base64ImageSource["media_type"],
							data: img.base64,
						},
					})),
					{ type: "text", text: userPrompt },
				]
				: userPrompt;

			const res = await client.messages.create({
				model: modelId || "claude-sonnet-4-20250514",
				max_tokens: maxTokens,
				system: systemPrompt,
				messages: [{ role: "user", content: userContent }],
			});
			return res.content.find((b) => b.type === "text")?.text ?? "";
		}

		case "OPENAI": {
			if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

			const contentParts: unknown[] = hasImages
				? [
					...images.map((img) => ({
						type: "image_url",
						image_url: { url: `data:${img.mediaType};base64,${img.base64}` },
					})),
					{ type: "text", text: userPrompt },
				]
				: [{ type: "text", text: userPrompt }];

			const res = await fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
				body: JSON.stringify({
					model: modelId || "gpt-4o",
					max_tokens: maxTokens,
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user", content: contentParts },
					],
				}),
			});
			if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
			const data = await res.json();
			return data.choices?.[0]?.message?.content ?? "";
		}

		case "GEMINI": {
			const client = getGeminiClient();
			if (!client) throw new Error("GEMINI_API_KEY not configured");

			const parts = hasImages
				? [
					...images.map((img) => createPartFromBase64(img.base64, img.mediaType)),
					createPartFromText(`${systemPrompt}\n\n${userPrompt}`),
				]
				: [createPartFromText(`${systemPrompt}\n\n${userPrompt}`)];

			const res = await client.models.generateContent({
				model: modelId || "gemini-2.5-flash",
				contents: [{ role: "user", parts }],
			});
			return res.text ?? "";
		}

		case "OPENROUTER": {
			const client = getOpenRouterClient();
			if (!client) throw new Error("OPENROUTER_API_KEY not configured");

			const contentParts = hasImages
				? [
					...images.map((img) => ({
						type: "image_url" as const,
						imageUrl: {
							url: `data:${img.mediaType};base64,${img.base64}`,
							detail: "auto" as const
						},
					})),
					{
						type: "text" as const,
						text: `${systemPrompt}\n\n${userPrompt}`
					},
				]
				: [{ type: "text" as const, text: `${systemPrompt}\n\n${userPrompt}` }];

			const res = await client.chat.send({
				chatRequest: {
					model: modelId || "openrouter/auto",
					maxTokens: maxTokens,
					messages: [
						{
							role: "user" as const,
							content: contentParts
						}
					],
				},
			});
			const content = res.choices?.[0]?.message?.content;
			if (typeof content === "string") return content;
			if (Array.isArray(content)) {
				return content
					.filter((p: unknown) => p && typeof p === "object" && (p as { type?: string }).type === "text")
					.map((p: unknown) => (p as { text?: string }).text ?? "")
					.join("\n");
			}
			return "";
		}

		default:
			throw new Error(`Provider tidak dikenal: ${provider}`);
	}
}

// ─── POST HANDLER ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
	let body: {
		systemPrompt: string;
		userPrompt: string;
		provider: string;
		modelId: string;
		images?: { base64: string; mediaType: string }[];
		maxTokens?: number;
	};

	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { systemPrompt, userPrompt, provider, modelId, images = [], maxTokens = 8000 } = body;

	if (!userPrompt?.trim()) {
		return NextResponse.json({ error: "userPrompt tidak boleh kosong" }, { status: 400 });
	}

	// Cek API key
	const keyMap: Record<string, string | undefined> = {
		CLAUDE: process.env.ANTHROPIC_API_KEY,
		OPENAI: process.env.OPENAI_API_KEY,
		GEMINI: process.env.GEMINI_API_KEY,
		OPENROUTER: process.env.OPENROUTER_API_KEY,
	};

	if (!keyMap[provider]) {
		return NextResponse.json(
			{ error: `${provider}_API_KEY belum dikonfigurasi` },
			{ status: 500 },
		);
	}

	try {
		const raw = (await callAI(provider, modelId, systemPrompt, userPrompt, images, maxTokens)).trim();
		try {
			const parsed = parseJsonFromModelOutput(raw);
			return NextResponse.json({ prompt: JSON.stringify(parsed, null, 2) });
		} catch {
			const fixSystem =
				"Kamu adalah JSON repair tool. Tugasmu memperbaiki output menjadi JSON valid. Output HARUS JSON valid saja, tanpa markdown/backticks.";
			const fixUser =
				"Perbaiki JSON berikut agar valid (tanpa mengubah makna/isi). Pastikan string ter-escape benar, tanpa trailing comma, tanpa komentar.\n\n" +
				raw;
			const fixedRaw = (await callAI(provider, modelId, fixSystem, fixUser, [], maxTokens)).trim();
			const parsed2 = parseJsonFromModelOutput(fixedRaw);
			return NextResponse.json({ prompt: JSON.stringify(parsed2, null, 2), repaired: true });
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
