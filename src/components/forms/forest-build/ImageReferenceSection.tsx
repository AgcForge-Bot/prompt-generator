"use client";

import type { ModelType, ImageRef } from "./types";
import Image from "next/image";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
	getProviderLabel,
} from "@/lib/modelProviders";

export default function ImageReferenceSection({
	imgScope,
	setImgScope,
	imgAnalyzing,
	imgProgress,
	imgModel,
	setImgModel,
	imgModelId,
	setImgModelId,
	urlInput,
	setUrlInput,
	onUpload,
	onAddUrl,
	images,
	hasAnyImages,
	onRemoveAt,
	currentScene,
}: {
	imgScope: "global" | "scene";
	setImgScope: (scope: "global" | "scene") => void;
	imgAnalyzing: boolean;
	imgProgress: string;
	imgModel: ModelType;
	setImgModel: (model: ModelType) => void;
	imgModelId: string;
	setImgModelId: (id: string) => void;
	urlInput: string;
	setUrlInput: (v: string) => void;
	onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onAddUrl: (url: string) => void;
	images: ImageRef[];
	hasAnyImages: boolean;
	onRemoveAt: (index: number) => void;
	currentScene: number;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">
				📸 Image Reference — {getProviderLabel(imgModel)}
			</div>
			<div className="flex gap-1 mb-4 bg-bark/40 rounded-xl p-1">
				{(["global", "scene"] as const).map((scope) => (
					<button
						key={scope}
						className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${imgScope === scope ? "bg-moss/50 text-leaf2" : "text-stone2 hover:text-cream"}`}
						onClick={() => setImgScope(scope)}
					>
						{scope === "global"
							? "🌐 Global — Semua Scene"
							: `🎬 Scene ${currentScene} Saja`}
					</button>
				))}
			</div>

			{imgAnalyzing && (
				<div className="mb-3 px-3 py-2 rounded-lg bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2">
					⏳ {imgProgress}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
				<Field label="🤖 AI Analisa Gambar">
					<Sel
						id="img-model"
						value={imgModel}
						onChange={(v) => {
							const provider = v as ModelType;
							setImgModel(provider);
							setImgModelId(getDefaultModelId(provider));
						}}
						options={AI_MODELS_PROVIDER.map((p) => ({
							value: p.value,
							label: p.label,
						}))}
					/>
				</Field>
				<Field label="🧠 Model">
					<Sel
						id="img-model-id"
						value={imgModelId || getDefaultModelId(imgModel)}
						onChange={(v) => setImgModelId(v)}
						options={getModelOptions(imgModel).map((m) => ({
							value: m.value,
							label: m.label,
						}))}
					/>
				</Field>
			</div>

			<label className="block mb-3 border-2 border-dashed border-leaf/25 rounded-xl p-5 text-center cursor-pointer hover:border-leaf hover:bg-moss/10 transition-all">
				<input
					type="file"
					className="hidden"
					accept="image/*"
					multiple
					onChange={onUpload}
				/>
				<div className="text-3xl mb-2">📁</div>
				<div className="font-mono text-[11px] text-stone2">
					<span className="text-leaf2 font-bold">Klik atau drag</span> gambar
					referensi
					<br />
					JPG / PNG / WEBP · Multiple files OK
					<br />
					<span className="text-leaf text-[9px]">
						AI otomatis analisa & deskripsikan setiap gambar
					</span>
				</div>
			</label>

			<div className="flex gap-2 mb-3">
				<input
					className="forest-input flex-1"
					placeholder="https://example.com/reference.jpg"
					value={urlInput}
					onChange={(e) => setUrlInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							onAddUrl(urlInput);
							setUrlInput("");
						}
					}}
				/>
				<button
					className="btn-ghost whitespace-nowrap"
					onClick={() => {
						onAddUrl(urlInput);
						setUrlInput("");
					}}
				>
					+ URL
				</button>
			</div>

			{hasAnyImages && (
				<div className="flex gap-2 flex-wrap">
					{images.map((img, i) => (
						<div key={img.id} className="relative">
							{img.type === "upload" ? (
								<div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-leaf/25 group">
									<Image
										src={img.url}
										alt="ref"
										fill
										sizes="80px"
										className="object-cover"
										unoptimized
									/>
									<span className="absolute top-1 left-1 px-1 rounded text-[7px] font-bold font-mono bg-forest/90 text-leaf2">
										{img.scope === "global" ? "ALL" : `S${img.sceneNum}`}
									</span>
									<span
										className={`absolute bottom-1 right-1 px-1 rounded text-[7px] font-bold font-mono ${img.status === "done" ? "bg-moss/90 text-leaf2" : "bg-red-900/90 text-red-300"}`}
									>
										{img.status === "done" ? "✓AI" : "✗"}
									</span>
									<div className="absolute inset-0 bg-forest/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											className="text-red-400 text-xs font-bold font-mono"
											onClick={() => onRemoveAt(i)}
										>
											✕ Remove
										</button>
									</div>
								</div>
							) : (
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bark/50 border border-leaf/15">
									<span>🔗</span>
									<span className="font-mono text-[9px] text-stone2 max-w-25 truncate">
										{img.name}
									</span>
									<span
										className={`font-mono text-[7px] font-bold ${img.status === "done" ? "text-leaf" : "text-red-400"}`}
									>
										{img.status === "done" ? "✓AI" : "✗"}
									</span>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</section>
	);
}
