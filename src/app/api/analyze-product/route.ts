import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OpenRouter } from "@openrouter/sdk";
import { GoogleGenAI, createPartFromBase64, createPartFromText, createPartFromUri } from "@google/genai";

import { PRODUCT_ANALYSIS_PROMPT } from "@/components/forms/product-promo-video/promptBuilder";

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

export async function POST(req: NextRequest) {
	let body: {
		base64?: string;
		mediaType?: string;
		url?: string;
		model?: string;
		modelId?: string;
		productName?: string;
		productCategory?: string;
	};

	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
	}

	const { base64, mediaType, url, model, modelId, productName, productCategory } = body;
	const provider = model ?? "CLAUDE";

	if (!base64 && !url) {
		return NextResponse.json({ error: "Either base64 or url must be provided." }, { status: 400 });
	}

	// Build context-aware prompt
	const contextNote = productName || productCategory
		? `\n\nKonteks tambahan: ${productName ? `Nama produk: "${productName}". ` : ""}${productCategory ? `Kategori: ${productCategory}.` : ""}`
		: "";

	const finalPrompt = PRODUCT_ANALYSIS_PROMPT + contextNote;

	try {
		switch (provider) {
			// ─── CLAUDE ─────────────────────────────────────────────────────────────
			case "CLAUDE": {
				if (!process.env.ANTHROPIC_API_KEY) {
					return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured." }, { status: 500 });
				}
				const claudeClient = getClaudeClient();
				if (!claudeClient) {
					return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured." }, { status: 500 });
				}
				const imageContent: Anthropic.ImageBlockParam = base64
					? { type: "image", source: { type: "base64", media_type: (mediaType as Anthropic.Base64ImageSource["media_type"]) ?? "image/jpeg", data: base64 } }
					: { type: "image", source: { type: "url", url: url! } };

				const response = await claudeClient.messages.create({
					model: modelId ?? "claude-opus-4-5",
					max_tokens: 600,
					messages: [{ role: "user", content: [imageContent, { type: "text", text: finalPrompt }] }],
				});
				const description = response.content.find((b) => b.type === "text")?.text ?? "";
				return NextResponse.json({ description });
			}

			// ─── OPENAI ─────────────────────────────────────────────────────────────
			case "OPENAI": {
				if (!process.env.OPENAI_API_KEY) {
					return NextResponse.json({ error: "OPENAI_API_KEY not configured." }, { status: 500 });
				}
				const imageUrl = base64
					? `data:${mediaType ?? "image/jpeg"};base64,${base64}`
					: url!;
				const response = await fetch("https://api.openai.com/v1/chat/completions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					},
					body: JSON.stringify({
						model: modelId ?? "gpt-4o",
						max_tokens: 600,
						messages: [
							{
								role: "user",
								content: [
									{ type: "image_url", image_url: { url: imageUrl } },
									{ type: "text", text: finalPrompt },
								],
							},
						],
					}),
				});

				if (!response.ok) {
					const raw = await response.text().catch(() => "");
					return NextResponse.json({ error: `OpenAI API error: ${response.status} ${raw}` }, { status: 500 });
				}

				const data = await response.json().catch(() => null);
				const description = (data?.choices?.[0]?.message?.content as string | undefined) ?? "";
				return NextResponse.json({ description });
			}

			// ─── GEMINI ──────────────────────────────────────────────────────────────
			case "GEMINI": {
				if (!process.env.GEMINI_API_KEY) {
					return NextResponse.json({ error: "GEMINI_API_KEY not configured." }, { status: 500 });
				}
				const geminiClient = getGeminiClient();
				if (!geminiClient) {
					return NextResponse.json({ error: "GEMINI_API_KEY not configured." }, { status: 500 });
				}
				let parts;
				if (base64) {
					parts = [createPartFromBase64(base64, mediaType ?? "image/jpeg"), createPartFromText(finalPrompt)];
				} else {
					parts = [createPartFromUri(url!, mediaType ?? "image/jpeg"), createPartFromText(finalPrompt)];
				}
				const response = await geminiClient.models.generateContent({
					model: modelId ?? "gemini-2.0-flash",
					contents: [{ role: "user", parts }],
				});
				const description = response.text ?? "";
				return NextResponse.json({ description });
			}

			// ─── OPENROUTER ──────────────────────────────────────────────────────────
			case "OPENROUTER": {
				if (!process.env.OPENROUTER_API_KEY) {
					return NextResponse.json({ error: "OPENROUTER_API_KEY not configured." }, { status: 500 });
				}
				const openRouterClient = getOpenRouterClient();
				if (!openRouterClient) {
					return NextResponse.json({ error: "OPENROUTER_API_KEY not configured." }, { status: 500 });
				}
				const imageUrl = base64
					? `data:${mediaType ?? "image/jpeg"};base64,${base64}`
					: url!;

				const response = await openRouterClient.chat.send({
					chatRequest: {
						model: modelId ?? "google/gemini-2.0-flash-exp:free",
						maxTokens: 600,
						messages: [{
							role: "user",
							content: [
								{ type: "image_url", imageUrl: { url: imageUrl, detail: "auto" } },
								{ type: "text", text: finalPrompt },
							],
						}],
					}
				});
				const description = response.choices[0]?.message?.content ?? "";
				return NextResponse.json({ description });
			}

			default:
				return NextResponse.json({ error: "Provider tidak dikenal." }, { status: 400 });
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
