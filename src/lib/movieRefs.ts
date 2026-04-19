export type MovieRef = { title: string; story: string };

export function parseNumberedMovieList(text: string): MovieRef[] {
	const lines = String(text ?? "")
		.split(/\r?\n/)
		.map((l) => l.trim());

	const items: MovieRef[] = [];
	let current: MovieRef | null = null;

	for (const line of lines) {
		if (!line) continue;
		const m = line.match(/^\d+\.\s*(.+)$/);
		if (m) {
			if (current) items.push(current);
			current = { title: m[1].trim(), story: "" };
			continue;
		}
		if (!current) continue;
		current.story = current.story ? `${current.story}\n${line}` : line;
	}

	if (current) items.push(current);
	return items.filter((x) => x.title.length > 0);
}

