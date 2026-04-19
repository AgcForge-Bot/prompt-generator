import { parseNumberedMovieList } from "@/lib/movieRefs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
	try {
		const filePath = path.join(process.cwd(), "example", "List Movies Ideas Survival.txt");
		const raw = await readFile(filePath, "utf8");
		const items = parseNumberedMovieList(raw);
		return Response.json({ items });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unknown error";
		return Response.json({ items: [], error: msg }, { status: 200 });
	}
}

