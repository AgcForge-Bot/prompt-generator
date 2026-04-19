export function parseJsonFromModelOutput(raw: string): unknown {
	const text = String(raw ?? "").trim();
	if (!text) throw new Error("AI output kosong");

	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
	const candidate = (fenced?.[1] ?? text).trim();

	function tryParse(s: string) {
		return JSON.parse(s);
	}

	function extractJsonObject(s: string) {
		const start = s.indexOf("{");
		const end = s.lastIndexOf("}");
		if (start === -1 || end === -1 || end <= start) return null;
		return s.slice(start, end + 1);
	}

	function repairJsonString(s: string) {
		let out = s.replace(/^\uFEFF/, "").trim();
		out = out.replace(/,\s*([}\]])/g, "$1");
		out = out.replace(/([{,]\s*)([A-Za-z_][$\w-]*)(\s*:)/g, '$1"$2"$3');
		out = out.replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, inner: string) => {
			const unescaped = inner.replace(/\\'/g, "'").replace(/\\"/g, '"');
			return `: ${JSON.stringify(unescaped)}`;
		});
		out = out.replace(/,\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, inner: string) => {
			const unescaped = inner.replace(/\\'/g, "'").replace(/\\"/g, '"');
			return `, ${JSON.stringify(unescaped)}`;
		});
		return out;
	}

	try {
		if (candidate.startsWith("{") || candidate.startsWith("[")) {
			return tryParse(candidate);
		}
		const extracted = extractJsonObject(candidate);
		if (extracted) return tryParse(extracted);
	} catch {}

	const extracted2 = candidate.startsWith("{") || candidate.startsWith("[") ? candidate : extractJsonObject(candidate);
	if (!extracted2) {
		throw new Error("AI output tidak mengandung JSON object yang valid");
	}

	try {
		return tryParse(extracted2);
	} catch (e1) {
		try {
			return tryParse(repairJsonString(extracted2));
		} catch (e2) {
			const msg = e2 instanceof Error ? e2.message : "JSON parse error";
			throw new Error(`AI output JSON tidak valid: ${msg}`);
		}
	}
}
