export function parseJsonFromModelOutput(raw: string): unknown {
	const text = String(raw ?? "").trim();
	if (!text) throw new Error("AI output kosong");

	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
	const candidate = (fenced?.[1] ?? text).trim();

	if (candidate.startsWith("{") || candidate.startsWith("[")) {
		return JSON.parse(candidate);
	}

	const start = candidate.indexOf("{");
	const end = candidate.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) {
		throw new Error("AI output tidak mengandung JSON object yang valid");
	}

	return JSON.parse(candidate.slice(start, end + 1));
}

