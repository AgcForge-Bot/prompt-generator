export type ZipTextFile = {
	path: string;
	text: string;
};

export async function buildZipBlob(files: ZipTextFile[]) {
	const JSZip = (await import("jszip")).default;
	const zip = new JSZip();
	for (const f of files) {
		zip.file(f.path, f.text);
	}
	return zip.generateAsync({ type: "blob" });
}

