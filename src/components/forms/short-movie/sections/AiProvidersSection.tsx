"use client";

import type { ShortMovieGeneratorConfig, AIProviderKey } from "../types";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";

export default function AiProvidersSection({
	gen,
	totalDurSec,
	totalDurMin,
}: {
	gen: ShortMovieGeneratorConfig;
	totalDurSec: number;
	totalDurMin: string;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🤖 AI Provider & Model</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<label className="field-label">Provider</label>
					<select
						className="forest-select"
						value={gen.config.aiProvider}
						onChange={(e) => {
							const p = e.target.value;
							gen.setAiProvider(p as AIProviderKey);
						}}
					>
						{AI_MODELS_PROVIDER.map((p) => (
							<option key={p.value} value={p.value}>
								{p.label}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="field-label">Model</label>
					<select
						className="forest-select"
						value={
							gen.config.aiModelId || getDefaultModelId(gen.config.aiProvider)
						}
						onChange={(e) => gen.updateConfig({ aiModelId: e.target.value })}
					>
						{getModelOptions(gen.config.aiProvider).map((m) => (
							<option key={m.value} value={m.value}>
								{m.label}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="mt-3 p-3 rounded-xl bg-bark/40 border border-leaf/10 font-mono text-[10px] text-stone2">
				Total scene:{" "}
				<span className="text-leaf2 font-bold">{gen.totalScenes}</span> ×{" "}
				{gen.config.secPerScene}s ={" "}
				<span className="text-amber2 font-bold">
					{totalDurSec}s ({totalDurMin} menit)
				</span>
				. maxTokens: 16000. Estimasi waktu generate:{" "}
				<span className="text-amber2">30–90 detik</span>.
			</div>
		</section>
	);
}
