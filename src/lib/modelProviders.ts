export const AI_MODELS_PROVIDER = [
	{
		value: "CLAUDE",
		label: "Claude (Anthropic)",
		defaultModel: "claude-sonnet-4-20250514",
		models: [
			{ value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
			{ value: "claude-opus-4-20250514", label: "Claude Opus 4" },
			{ value: "claude-opus-4-1-20250805", label: "Claude Opus 4.1" },
			{ value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
			{ value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5" },
			{ value: "claude-opus-4-5-20251101", label: "Claude Opus 4.5" },
			{ value: "claude-opus-4-6", label: "Claude Opus 4.6" },
			{ value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
			{ value: "claude-opus-4-7", label: "Claude Opus 4.7" }
		]
	},
	{
		value: "OPENAI",
		label: "OpenAI",
		defaultModel: "gpt-5.4-mini",
		models: [
			{ value: "o3-pro-2025-06-10", label: "OpenAI O3 Pro" },
			{ value: "o4-mini-2025-04-16", label: "OpenAI O4 Mini" },
			{ value: "gpt-4.1-nano-2025-04-14", label: "GPT-4.1 Nano" },
			{ value: "gpt-4o-search-preview-2025-03-11", label: "GPT-4o Search Preview" },
			{ value: "gpt-4-0613", label: "GPT-4 (0613)" },
			{ value: "gpt-4o-mini-2024-07-18", label: "GPT-4o Mini" },
			{ value: "gpt-4o-mini-search-preview-2025-03-11", label: "GPT-4o Mini Search" },
			{ value: "gpt-4o-2024-08-06", label: "GPT-4o" },
			{ value: "chatgpt-4o-latest", label: "ChatGPT-4o Latest" },
			{ value: "gpt-4.1-mini-2025-04-14", label: "GPT-4.1 Mini" },
			{ value: "gpt-5-chat-latest", label: "GPT-5 Chat Latest" },
			{ value: "gpt-5.4", label: "GPT-5.4" },
			{ value: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
			{ value: "gpt-5.4-nano", label: "GPT-5.4 Nano" },
			{ value: "gpt-5.4-pro-2026-03-05", label: "GPT-5.4 Pro" },
			{ value: "gpt-5.2-pro-2025-12-11", label: "GPT-5.2 Pro" },
			{ value: "gpt-5.4-nano-2026-03-17", label: "GPT-5.4 Nano" },
			{ value: "gpt-5-nano-2025-08-07", label: "GPT-5 Nano" },
			{ value: "gpt-4.1-2025-04-14", label: "GPT-4.1" },
			{ value: "gpt-5.4-mini-2026-03-17", label: "GPT-5.4 Mini" },
			{ value: "gpt-5-mini-2025-08-07", label: "GPT-5 Mini" },
			{ value: "gpt-5-2025-08-07", label: "GPT-5" }
		]
	},
	{
		value: "GEMINI",
		label: "Google Gemini",
		defaultModel: "gemini-2.5-flash",
		models: [
			{ value: "gemini-3.1-flash-lite-preview", label: "Gemini 3.1 Flash Lite Preview" },
			{ value: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
			{ value: "gemini-flash-latest", label: "Gemini Flash Latest" },
			{ value: "gemini-flash-lite-latest", label: "Gemini Flash Lite Latest" },
			{ value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
			{ value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" }
		]
	},
	{
		value: "OPENROUTER",
		label: "OpenRouter",
		defaultModel: "openrouter/auto",
		models: [
			{ value: "openrouter/auto", label: "Auto (Best Available)" },
			{ value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
			{ value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
			{ value: "google/gemini-2.5-flash-lite-preview-09-2025", label: "Gemini 2.5 Flash Lite Preview" },
			{ value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
			{ value: "google/gemini-3.1-flash-lite-preview", label: "Gemini 3.1 Flash Lite Preview" },
			{ value: "openai/gpt-4o-mini", label: "OpenAI GPT-4o Mini" },
			{ value: "openai/gpt-5-mini", label: "OpenAI GPT-5 Mini" },
			{ value: "openai/gpt-4.1-mini", label: "OpenAI GPT-4.1 Mini" },
			{ value: "openai/gpt-5.4-mini", label: "OpenAI GPT-5.4 Mini" },
			{ value: "openai/gpt-oss-120b:free", label: "GPT-OSS 120B (Free)" },
			{ value: "openai/gpt-5-chat", label: "GPT-5 Chat" },
			{ value: "openai/gpt-5.3-codex", label: "GPT-5.3 Codex" },
			{ value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
			{ value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6" },
			{ value: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5" },
			{ value: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
			{ value: "anthropic/claude-opus-4.7", label: "Claude Opus 4.7" },
			{ value: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4" },
			{ value: "anthropic/claude-opus-4.5", label: "Claude Opus 4.5" },
			{ value: "deepseek/deepseek-v3.2", label: "DeepSeek V3.2" },
			{ value: "deepseek/deepseek-chat-v3-0324", label: "DeepSeek Chat V3" },
			{ value: "deepseek/deepseek-chat-v3.1", label: "DeepSeek Chat V3.1" },
			{ value: "deepseek/deepseek-v3.1-terminus", label: "DeepSeek V3.1 Terminus" },
			{ value: "deepseek/deepseek-chat", label: "DeepSeek Chat" },
			{ value: "deepseek/deepseek-v3.2-speciale", label: "DeepSeek V3.2 Speciale" },
			{ value: "x-ai/grok-4.1-fast", label: "Grok 4.1 Fast" },
			{ value: "x-ai/grok-4-fast", label: "Grok 4 Fast" },
			{ value: "x-ai/grok-4.20", label: "Grok 4.20" },
			{ value: "x-ai/grok-code-fast-1", label: "Grok Code Fast" },
			{ value: "x-ai/grok-4", label: "Grok 4" },
			{ value: "x-ai/grok-3-mini", label: "Grok 3 Mini" },
			{ value: "x-ai/grok-4.20-multi-agent", label: "Grok 4.20 Multi-Agent" },
			{ value: "x-ai/grok-3", label: "Grok 3" },
			{ value: "x-ai/grok-3-mini-beta", label: "Grok 3 Mini Beta" },
			{ value: "x-ai/grok-3-beta", label: "Grok 3 Beta" },
			{ value: "x-ai/grok-4.20-multi-agent-beta", label: "Grok 4.20 Multi-Agent Beta" },
			{ value: "x-ai/grok-4.20-beta", label: "Grok 4.20 Beta" }
		]
	}
];

export function getProviderInfo(provider: string) {
	return AI_MODELS_PROVIDER.find((p) => p.value === provider) ?? AI_MODELS_PROVIDER[0];
}

export function getProviderLabel(provider: string) {
	return getProviderInfo(provider)?.label ?? String(provider);
}

export function getDefaultModelId(provider: string) {
	return getProviderInfo(provider)?.defaultModel ?? "";
}

export function getModelOptions(provider: string) {
	const p = getProviderInfo(provider);
	return p?.models ?? [];
}
