"use client";

import { useState } from "react";
import type { SceneConfig, ModelType, ImageRef } from "./types";
import { redirectToLogin } from "@/lib/auth/redirectToLogin";
import { getDefaultModelId, getProviderLabel } from "@/lib/modelProviders";

export default function useForestBuildImageState({
	currentScene,
	getScene,
	imgScope,
	setImgScope,
	sc,
	showToast,
	updateScene,
}: {
	currentScene: number;
	getScene: (id: number) => SceneConfig;
	imgScope: "global" | "scene";
	setImgScope: (scope: "global" | "scene") => void;
	sc: SceneConfig | null;
	showToast: (msg: string) => void;
	updateScene: (id: number, updates: Partial<SceneConfig>) => void;
}) {
	const [globalImages, setGlobalImages] = useState<ImageRef[]>([]);
	const [imgAnalyzing, setImgAnalyzing] = useState(false);
	const [imgProgress, setImgProgress] = useState("");
	const [imgModel, setImgModel] = useState<ModelType>("CLAUDE");
	const [imgModelId, setImgModelId] = useState<string>(
		getDefaultModelId("CLAUDE"),
	);
	const [urlInput, setUrlInput] = useState("");

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;
		setImgAnalyzing(true);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			setImgProgress(
				`Menganalisa gambar ${i + 1}/${files.length}: "${file.name}"...`,
			);

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
				const res = await fetch("/api/analyze-image", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						base64,
						mediaType: file.type || "image/jpeg",
						scope: imgScope,
						sceneNum: currentScene,
						model: imgModel,
						modelId: imgModelId || undefined,
					}),
				});
				if (res.status === 401) {
					redirectToLogin();
					return;
				}
				const data = await res.json();
				desc = data.description;
			} catch {
				desc = undefined;
			}

			const ref: ImageRef = {
				id: `${Date.now()}-${i}`,
				type: "upload",
				url: previewUrl,
				name: file.name,
				scope: imgScope,
				sceneNum: currentScene,
				base64,
				mediaType: file.type,
				aiDescription: desc,
				status: desc ? "done" : "failed",
			};

			if (imgScope === "global") {
				setGlobalImages((prev) => [...prev, ref]);
			} else {
				updateScene(currentScene, {
					imageRefs: [...(getScene(currentScene).imageRefs ?? []), ref],
				});
			}
		}

		setImgAnalyzing(false);
		setImgProgress("");
		e.target.value = "";
		showToast(
			`✅ ${files.length} gambar selesai dianalisa ${getProviderLabel(imgModel)}!`,
		);
	}

	async function addImageURL(url: string) {
		if (!url.startsWith("http")) {
			showToast("⚠ URL tidak valid!");
			return;
		}
		setImgAnalyzing(true);
		setImgProgress("Menganalisa URL gambar...");

		let desc: string | undefined;
		try {
			const res = await fetch("/api/analyze-image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					url,
					scope: imgScope,
					sceneNum: currentScene,
					model: imgModel,
					modelId: imgModelId || undefined,
				}),
			});
			if (res.status === 401) {
				redirectToLogin();
				return;
			}
			const data = await res.json();
			desc = data.description;
		} catch {
			desc = undefined;
		}

		const ref: ImageRef = {
			id: Date.now().toString(),
			type: "url",
			url,
			name: url.split("/").pop()?.split("?")[0]?.substring(0, 40) ?? "image",
			scope: imgScope,
			sceneNum: currentScene,
			aiDescription: desc,
			status: desc ? "done" : "failed",
		};

		if (imgScope === "global") {
			setGlobalImages((prev) => [...prev, ref]);
		} else {
			updateScene(currentScene, {
				imageRefs: [...(getScene(currentScene).imageRefs ?? []), ref],
			});
		}

		setImgAnalyzing(false);
		setImgProgress("");
		showToast(
			desc
				? `🎨 URL dianalisa ${getProviderLabel(imgModel)}!`
				: "⚠ URL ditambahkan (analisa gagal)",
		);
	}

	const imagesForScope = imgScope === "global" ? globalImages : sc?.imageRefs ?? [];
	const hasAnyImages = globalImages.length > 0 || (sc?.imageRefs?.length ?? 0) > 0;

	return {
		addImageURL,
		globalImages,
		handleImageUpload,
		hasAnyImages,
		imagesForScope,
		imgAnalyzing,
		imgModel,
		imgModelId,
		imgProgress,
		imgScope,
		setGlobalImages,
		setImgAnalyzing,
		setImgModel,
		setImgModelId,
		setImgProgress,
		setImgScope,
		setUrlInput,
		urlInput,
	};
}
