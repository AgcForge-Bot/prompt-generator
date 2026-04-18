import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OpenRouter } from "@openrouter/sdk";
import { GoogleGenAI } from "@google/genai";

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
		// Try to extract JSON object from raw text
		const match = raw.match(/\{[\s\S]*\}/);
		if (match) {
			try {
				return JSON.parse(match[0]);
			} catch {
				return null;
			}
		}
		return null;
	}
}

// ─── CALL AI ──────────────────────────────────────────────────────────────────

async function callAI(
	provider: string,
	modelId: string,
	prompt: string,
	maxTokens = 4000,
): Promise<string> {
	switch (provider) {
		case "CLAUDE": {
			const client = getClaudeClient();
			if (!client) throw new Error("ANTHROPIC_API_KEY not configured");
			const res = await client.messages.create({
				model: modelId || "claude-sonnet-4-20250514",
				max_tokens: maxTokens,
				messages: [{ role: "user", content: prompt }],
			});
			return res.content.find((b) => b.type === "text")?.text ?? "";
		}

		case "OPENAI": {
			if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
			const res = await fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
				body: JSON.stringify({
					model: modelId || "gpt-4o",
					max_tokens: maxTokens,
					messages: [{ role: "user", content: prompt }],
				}),
			});
			if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
			const data = await res.json();
			return data.choices?.[0]?.message?.content ?? "";
		}

		case "GEMINI": {
			const client = getGeminiClient();
			if (!client) throw new Error("GEMINI_API_KEY not configured");
			const res = await client.models.generateContent({
				model: modelId || "gemini-2.5-flash-lite",
				contents: [{ role: "user", parts: [{ text: prompt }] }],
			});
			return res.text ?? "";
		}

		case "OPENROUTER": {
			const client = getOpenRouterClient();
			if (!client) throw new Error("OPENROUTER_API_KEY not configured");
			const res = await client.chat.send({
				chatRequest: {
					model: modelId || "google/gemini-2.5-flash-lite",
					maxTokens: maxTokens,
					messages: [{ role: "user", content: prompt }],
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
		action: "generate" | "analyze";
		prompt: string;
		model?: string;
		modelId?: string;
	};

	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { action, prompt, model, modelId } = body;
	const provider = model ?? "CLAUDE";

	if (!prompt?.trim()) {
		return NextResponse.json({ error: "prompt tidak boleh kosong" }, { status: 400 });
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
			{ error: `${provider}_API_KEY belum dikonfigurasi di environment` },
			{ status: 500 },
		);
	}

	try {
		// Generate butuh lebih banyak token karena output lebih panjang
		const maxTokens = action === "generate" ? 5000 : 3000;
		const rawOutput = await callAI(provider, modelId ?? "", prompt, maxTokens);
		const parsed = safeParseJSON(rawOutput);

		if (!parsed) {
			return NextResponse.json(
				{ error: "AI tidak menghasilkan JSON yang valid. Coba lagi.", rawOutput },
				{ status: 422 },
			);
		}

		return NextResponse.json({ data: parsed, rawOutput });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
