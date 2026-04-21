export function jsonStringify(value: unknown) {
	return JSON.stringify(value, null, 2);
}

export function jsonArrayFromJsonStrings(items: string[]) {
	try {
		const arr = items.map((s) => JSON.parse(s));
		return JSON.stringify(arr, null, 2);
	} catch {
		return JSON.stringify(items, null, 2);
	}
}

export function jsonBundleFromSceneJsonStrings(items: string[]) {
	try {
		const parsed = items.map((s) => JSON.parse(s));
		const first = parsed[0];
		const scenes = parsed.flatMap((p) =>
			Array.isArray(p?.scenes) ? p.scenes : [],
		);
		if (!first || !Array.isArray(scenes) || scenes.length === 0) {
			return JSON.stringify(parsed, null, 2);
		}
		const bundle = { ...first, scenes };
		return JSON.stringify(bundle, null, 2);
	} catch {
		return JSON.stringify(items, null, 2);
	}
}

export function downloadJsonFile(filename: string, json: string) {
	const blob = new Blob([json], { type: "application/json;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, text: string) {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function downloadBlobFile(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
