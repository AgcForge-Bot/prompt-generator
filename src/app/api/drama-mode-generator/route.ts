import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OpenRouter } from "@openrouter/sdk";
import { GoogleGenAI, createPartFromBase64, createPartFromText } from "@google/genai";

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

// ─── SAFE JSON PARSE ─────────────────────────────────────────────────────────

function safeParseJSON(raw: string): unknown {
	try {
		const clean = raw
			.replace(/^```json\s*/i, "")
			.replace(/^```\s*/i, "")
			.replace(/```\s*$/i, "")
			.trim();
		return JSON.parse(clean);
	} catch {
		const match = raw.match(/\{[\s\S]*\}/);
		if (match) {
			try { return JSON.parse(match[0]); } catch { return null; }
		}
		return null;
	}
}

// ─── CALL AI WITH OPTIONAL IMAGES ─────────────────────────────────────────────

async function callAI(
	provider: string,
	modelId: string,
	systemPrompt: string,
	userPrompt: string,
	images: { base64: string; mediaType: string }[] = [],
	maxTokens = 8000,
): Promise<string> {
	const hasImages = images.length > 0;

	switch (provider) {
		case "CLAUDE": {
			const client = getClaudeClient();
			if (!client) throw new Error("ANTHROPIC_API_KEY not configured");

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
				: [{
					type: "text" as const,
					text: `${systemPrompt}\n\n${userPrompt}`
				}];

			const res = await client.chat.send({
				chatRequest: {
					model: modelId || "openrouter/auto",
					maxTokens: maxTokens,
					messages: [
						{
							role: "user",
							content: contentParts,
						}
					],
				},
			});
			const content = res.choices?.[0]?.message?.content;
			if (typeof content === "string") return content;
			if (Array.isArray(content)) {
				return content
					.filter((p: unknown) => typeof p === "object" && p !== null && (p as { type?: string }).type === "text")
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
		const raw = await callAI(provider, modelId, systemPrompt, userPrompt, images, maxTokens);
		const parsed = safeParseJSON(raw);

		if (!parsed) {
			return NextResponse.json({ error: "AI tidak menghasilkan JSON valid. Coba lagi.", rawOutput: raw }, { status: 422 });
		}

		return NextResponse.json({ data: parsed });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
