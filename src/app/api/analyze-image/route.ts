import { type NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { OpenRouter } from '@openrouter/sdk'
import { GoogleGenAI, createPartFromBase64, createPartFromText, createPartFromUri } from '@google/genai'

const claudeClient = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
})
const geminiClient = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY
});
const openRouterClient = new OpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY
});

const VISION_PROMPT = `You are a cinematography and visual reference analyst for AI video generation prompts, specializing in ASMR survival build documentary content.

Analyze this reference image and produce a detailed visual description for use in an AI video generation prompt. Focus on:

1. SETTING & ENVIRONMENT: Location type, natural elements, vegetation, terrain, scale
2. LIGHTING: Light quality, direction, color temperature, shadows, time of day indicators
3. COLOR PALETTE: Dominant colors, tones, saturation, color harmony, mood color
4. TEXTURE & MATERIALS: Key surface textures, natural materials, organic vs manufactured
5. COMPOSITION STYLE: Camera angle, framing, depth of field, foreground/background balance
6. MOOD & ATMOSPHERE: Emotional quality, environmental feeling, human presence or absence
7. REALISM QUALITY: Film-like or CGI? Handheld or static? Documentary or staged?
8. SPECIFIC ELEMENTS TO REPLICATE: What exact visual elements must appear in the video?

Write as a single cohesive paragraph of 100-140 words. Start with "VISUAL REFERENCE:" and be specific, concrete, and cinematic. Include: camera angle suggestion, color temperature, key textures, lighting direction, atmospheric quality.`

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeImageResponse>> {
	let body: AnalyzeImageRequest
	try {
		body = await req.json()
	} catch {
		return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
	}

	const { base64, mediaType, url, scope, sceneNum, model, modelId } = body
	const provider: ModelType = model ?? 'CLAUDE'

	if (!base64 && !url) {
		return NextResponse.json({ error: 'Either base64 or url must be provided.' }, { status: 400 })
	}

	const contextLabel = scope === 'global'
		? 'This image is a GLOBAL visual reference — apply its style across the entire video series.'
		: `This image is a SCENE-SPECIFIC reference for scene ${sceneNum ?? '?'} only.`

	try {
		switch (provider) {
			case 'CLAUDE': {
				if (!process.env.ANTHROPIC_API_KEY) {
					return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured in environment variables.' }, { status: 500 })
				}

				const imageContent: Anthropic.ImageBlockParam = base64
					? {
						type: 'image',
						source: {
							type: 'base64',
							media_type: (mediaType as Anthropic.Base64ImageSource['media_type']) ?? 'image/jpeg',
							data: base64,
						},
					}
					: {
						type: 'image',
						source: {
							type: 'url',
							url: url!,
						},
					}

				const response = await claudeClient.messages.create({
					model: modelId?.trim() || 'claude-sonnet-4-20250514',
					max_tokens: 600,
					messages: [
						{
							role: 'user',
							content: [
								imageContent,
								{
									type: 'text',
									text: `${VISION_PROMPT}\n\nContext: ${contextLabel}`,
								},
							],
						},
					],
				})

				const text = response.content
					.filter(b => b.type === 'text')
					.map(b => (b as Anthropic.TextBlock).text)
					.join('\n')
					.trim()

				return NextResponse.json({ description: text })
			}

			case 'GEMINI': {
				if (!process.env.GEMINI_API_KEY) {
					return NextResponse.json({ error: 'GEMINI_API_KEY not configured in environment variables.' }, { status: 500 })
				}

				const prompt = `${VISION_PROMPT}\n\nContext: ${contextLabel}`
				const mime = mediaType?.trim() || 'image/jpeg'
				const parts = [
					base64 ? createPartFromBase64(base64, mime) : createPartFromUri(url!, mime),
					createPartFromText(prompt),
				]

				const response = await geminiClient.models.generateContent({
					model: modelId?.trim() || 'gemini-2.0-flash',
					contents: [
						{
							role: 'user',
							parts,
						},
					],
				})

				return NextResponse.json({ description: response.text?.trim() })
			}

			case 'OPENAI': {
				if (!process.env.OPENAI_API_KEY) {
					return NextResponse.json({ error: 'OPENAI_API_KEY not configured in environment variables.' }, { status: 500 })
				}

				const prompt = `${VISION_PROMPT}\n\nContext: ${contextLabel}`
				const mime = mediaType?.trim() || 'image/jpeg'
				const imageUrl = base64 ? `data:${mime};base64,${base64}` : url!
				const response = await fetch('https://api.openai.com/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					},
					body: JSON.stringify({
						model: modelId?.trim() || 'gpt-4o-mini',
						max_tokens: 600,
						messages: [
							{
								role: 'user',
								content: [
									{ type: 'text', text: prompt },
									{ type: 'image_url', image_url: { url: imageUrl } },
								],
							},
						],
					}),
				})

				if (!response.ok) {
					const raw = await response.text().catch(() => '')
					return NextResponse.json({ error: `OpenAI API error: ${response.status} ${raw}` }, { status: 500 })
				}

				const data = await response.json().catch(() => null)
				const text = (data?.choices?.[0]?.message?.content as string | undefined)?.trim()
				return NextResponse.json({ description: text })
			}

			case 'OPENROUTER': {
				if (!process.env.OPENROUTER_API_KEY) {
					return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured in environment variables.' }, { status: 500 })
				}

				const prompt = `${VISION_PROMPT}\n\nContext: ${contextLabel}`
				const mime = mediaType?.trim() || 'image/jpeg'
				const imageUrl = base64 ? `data:${mime};base64,${base64}` : url!

				const result = await openRouterClient.chat.send({
					chatRequest: {
						model: modelId?.trim() || 'openai/gpt-4o-mini',
						maxTokens: 600,
						messages: [
							{
								role: 'user',
								content: [
									{ type: 'text', text: prompt },
									{ type: 'image_url', imageUrl: { url: imageUrl, detail: 'auto' } },
								],
							},
						],
					},
				})

				const content = result.choices?.[0]?.message?.content
				if (typeof content === 'string') {
					return NextResponse.json({ description: content.trim() })
				}
				if (Array.isArray(content)) {
					const text = content
						.filter(p => p && typeof p === 'object' && 'type' in p && (p as { type?: string }).type === 'text')
						.map(p => (p as { text?: string }).text)
						.filter(Boolean)
						.join('\n')
						.trim()
					return NextResponse.json({ description: text })
				}

				return NextResponse.json({ error: 'OpenRouter response missing text.' }, { status: 500 })
			}
		}
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : 'Unknown error'
		return NextResponse.json({ error: `${provider} API error: ${msg}` }, { status: 500 })
	}
}
