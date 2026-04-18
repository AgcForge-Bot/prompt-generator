"use client";

import { useState } from "react";
import type { ImageRef, ModelType } from "./types";
import { redirectToLogin } from "@/lib/auth/redirectToLogin";
import { getDefaultModelId, getProviderLabel } from "@/lib/modelProviders";

export default function useProductPromoImageState(showToast: (msg: string) => void) {
	const [productImages, setProductImages] = useState<ImageRef[]>([]);
	const [imgAnalyzing, setImgAnalyzing] = useState(false);
	const [imgProgress, setImgProgress] = useState("");
	const [imgModel, setImgModel] = useState<ModelType>("CLAUDE");
	const [imgModelId, setImgModelId] = useState<string>(getDefaultModelId("CLAUDE"));
	const [urlInput, setUrlInput] = useState("");
	const [marketplaceUrl, setMarketplaceUrl] = useState("");

	async function analyzeImageViaAPI(params: {
		base64?: string;
		mediaType?: string;
		url?: string;
		productName?: string;
		productCategory?: string;
	}): Promise<string | undefined> {
		const res = await fetch("/api/analyze-product", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...params,
				model: imgModel,
				modelId: imgModelId || undefined,
			}),
		});
		if (res.status === 401) {
			redirectToLogin();
			return undefined;
		}
		const data = await res.json();
		return data.description;
	}

	async function handleImageUpload(
		e: React.ChangeEvent<HTMLInputElement>,
		productName?: string,
		productCategory?: string
	) {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;
		setImgAnalyzing(true);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			setImgProgress(`Menganalisa foto produk ${i + 1}/${files.length}: "${file.name}"...`);

			const base64 = await new Promise<string>((res, rej) => {
				const reader = new FileReader();
				reader.onload = (ev) => res((ev.target?.result as string).split(",")[1]);
				reader.onerror = () => rej(new Error("Read failed"));
				reader.readAsDataURL(file);
			});

			const previewUrl = await new Promise<string>((res) => {
				const r2 = new FileReader();
				r2.onload = (ev) => res(ev.target?.result as string);
				r2.readAsDataURL(file);
			});

			let desc: string | undefined;
			try {
				desc = await analyzeImageViaAPI({
					base64,
					mediaType: file.type || "image/jpeg",
					productName,
					productCategory,
				});
			} catch {
				desc = undefined;
			}

			const ref: ImageRef = {
				id: `${Date.now()}-${i}`,
				type: "upload",
				url: previewUrl,
				name: file.name,
				base64,
				mediaType: file.type,
				aiDescription: desc,
				status: desc ? "done" : "failed",
			};

			setProductImages((prev) => [...prev, ref]);
		}

		setImgAnalyzing(false);
		setImgProgress("");
		e.target.value = "";
		showToast(
			`✅ ${files.length} foto produk selesai dianalisa dengan ${getProviderLabel(imgModel)}!`,
		);
	}

	async function addImageURL(
		url: string,
		productName?: string,
		productCategory?: string
	) {
		if (!url.startsWith("http")) {
			showToast("⚠ URL tidak valid!");
			return;
		}
		setImgAnalyzing(true);
		setImgProgress("Menganalisa gambar dari URL...");

		let desc: string | undefined;
		try {
			desc = await analyzeImageViaAPI({ url, productName, productCategory });
		} catch {
			desc = undefined;
		}

		const ref: ImageRef = {
			id: Date.now().toString(),
			type: "url",
			url,
			name: url.split("/").pop()?.split("?")[0]?.substring(0, 40) ?? "image",
			aiDescription: desc,
			status: desc ? "done" : "failed",
		};

		setProductImages((prev) => [...prev, ref]);
		setImgAnalyzing(false);
		setImgProgress("");
		setUrlInput("");
		showToast(desc ? `🎨 Foto produk berhasil dianalisa!` : "⚠ URL ditambahkan (analisa gagal)");
	}

	function removeImage(index: number) {
		setProductImages((prev) => prev.filter((_, i) => i !== index));
	}

	return {
		productImages,
		setProductImages,
		imgAnalyzing,
		imgProgress,
		imgModel,
		setImgModel,
		imgModelId,
		setImgModelId,
		urlInput,
		setUrlInput,
		marketplaceUrl,
		setMarketplaceUrl,
		handleImageUpload,
		addImageURL,
		removeImage,
	};
}
