"use client";

import { useEffect, useState } from "react";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { AI_MODELS_PROVIDER, getDefaultModelId, getModelOptions } from "@/lib/modelProviders";
import { STORY_MODE_LABELS, SURVIVAL_MOVIE_REFS } from "./constants";
import type { MovieRef } from "@/lib/movieRefs";
import type { ModelGender, ModelType, ProjectDNA, StoryIntensityKey, StoryModeKey } from "./types";
import { GENDER_OPTIONS } from "./utils";

export default function StoryModeSection({
	dna,
	onChange,
	disabled,
	totalScenes,
}: {
	dna: ProjectDNA;
	onChange: (next: ProjectDNA) => void;
	disabled: boolean;
	totalScenes: number;
}) {
	const modes = Object.keys(STORY_MODE_LABELS) as StoryModeKey[];
	const [movieRefs, setMovieRefs] = useState<MovieRef[]>(
		SURVIVAL_MOVIE_REFS as unknown as MovieRef[],
	);

	function setStoryMode(next: StoryModeKey) {
		onChange({ ...dna, storyMode: next });
	}

	function setMovie(title: string) {
		const ref = movieRefs.find((r) => r.title === title);
		onChange({
			...dna,
			storyMovieRefTitle: title,
			storyMovieRefStory: ref?.story ?? "",
		});
	}

	useEffect(() => {
		let mounted = true;
		fetch("/api/survival-movie-refs")
			.then((r) => r.json())
			.then((data) => {
				const items = Array.isArray(data?.items) ? (data.items as MovieRef[]) : [];
				if (!mounted) return;
				if (items.length > 0) setMovieRefs(items);
			})
			.catch(() => {});
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (disabled) return;
		if (dna.storyMode !== "ai-film") return;
		if (dna.storyMovieRefTitle) return;
		const first = movieRefs[0];
		if (!first) return;
		onChange({
			...dna,
			storyMovieRefTitle: first.title,
			storyMovieRefStory: first.story,
		});
	}, [disabled, dna, movieRefs, onChange]);

	return (
		<section className="card mb-5">
			<div className="section-label">🎬 Story Mode</div>

			<div className="flex flex-wrap gap-2 mb-3">
				{modes.map((m) => {
					const active = dna.storyMode === m;
					return (
						<button
							key={m}
							type="button"
							className={active ? "btn-primary" : "btn-outline"}
							onClick={() => setStoryMode(m)}
							disabled={disabled}
						>
							{STORY_MODE_LABELS[m]}
						</button>
					);
				})}
			</div>

			{dna.storyMode === "ai-film" && (
				<div className="grid grid-cols-1 gap-3">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="🎞️ Referensi Film (Survival)">
							<Sel
								id="forest-movie-ref"
								value={dna.storyMovieRefTitle || movieRefs[0]?.title || ""}
								onChange={(v) => setMovie(v)}
								disabled={disabled}
								options={movieRefs.map((r) => ({ value: r.title, label: r.title }))}
							/>
						</Field>
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								Mode 2 fokus short film survival yang ceritanya nyambung antar scene. Scene 1 adalah teaser montage.
							</div>
						</div>
					</div>

					{(dna.storyMovieRefStory || movieRefs[0]?.story) && (
						<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
							<div className="font-mono text-[10px] text-leaf2 font-bold mb-1">
								Storyline (Referensi)
							</div>
							<div className="font-mono text-[10px] text-stone2 leading-relaxed">
								{dna.storyMovieRefStory || movieRefs[0]?.story}
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="👥 Jumlah Model">
							<Sel
								id="forest-cast-mode"
								value={dna.storyCastCountMode}
								onChange={(v) => onChange({ ...dna, storyCastCountMode: v as "auto" | "manual" })}
								disabled={disabled}
								options={[
									{ value: "auto", label: "Auto (AI pilih)" },
									{ value: "manual", label: "Manual" },
								]}
							/>
						</Field>
						{dna.storyCastCountMode === "manual" && (
							<Field label="Jumlah Model (Manual)">
								<Sel
									id="forest-cast-count"
									value={String(dna.storyCastCount)}
									onChange={(v) => onChange({ ...dna, storyCastCount: Number(v) })}
									disabled={disabled}
									options={Array.from({ length: 6 }, (_, i) => ({
										value: String(i + 1),
										label: `${i + 1} model`,
									}))}
								/>
							</Field>
						)}
						<Field label="🧑 Gender Karakter Utama">
							<Sel
								id="forest-gender-mode"
								value={dna.storyGenderMode}
								onChange={(v) => onChange({ ...dna, storyGenderMode: v as "auto" | "manual" })}
								disabled={disabled}
								options={[
									{ value: "auto", label: "Auto (AI pilih)" },
									{ value: "manual", label: "Manual" },
								]}
							/>
						</Field>
						{dna.storyGenderMode === "manual" && (
							<Field label="Gender (Manual)">
								<Sel
									id="forest-gender"
									value={dna.modelGender}
									onChange={(v) => onChange({ ...dna, modelGender: v as ModelGender })}
									disabled={disabled}
									options={GENDER_OPTIONS}
								/>
							</Field>
						)}
						<Field label="📈 Story Intensity">
							<Sel
								id="forest-story-intensity"
								value={dna.storyIntensity}
								onChange={(v) => onChange({ ...dna, storyIntensity: v as StoryIntensityKey })}
								disabled={disabled}
								options={[
									{ value: "relaxing", label: "Relaxing (min konflik, banyak ASMR craft)" },
									{ value: "balanced", label: "Balanced (progres + 1-2 setback)" },
									{ value: "intense", label: "Intense (lebih banyak konflik/setback)" },
								]}
							/>
						</Field>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="🤖 AI Provider (Generate All With AI)">
							<Sel
								id="forest-story-ai-provider"
								value={dna.storyAiProvider}
								onChange={(v) => {
									const p = v as ModelType;
									onChange({ ...dna, storyAiProvider: p, storyAiModelId: getDefaultModelId(p) });
								}}
								disabled={disabled}
								options={AI_MODELS_PROVIDER.map((p) => ({ value: p.value, label: p.label }))}
							/>
						</Field>
						<Field label="🧠 AI Model">
							<Sel
								id="forest-story-ai-model"
								value={dna.storyAiModelId || getDefaultModelId(dna.storyAiProvider)}
								onChange={(v) => onChange({ ...dna, storyAiModelId: v })}
								disabled={disabled}
								options={getModelOptions(dna.storyAiProvider).map((m) => ({
									value: m.value,
									label: m.label,
								}))}
							/>
						</Field>
					</div>

					<div className="rounded-lg border border-leaf/10 bg-bark/25 p-3">
						<div className="font-mono text-[10px] text-stone2 leading-relaxed">
							Target: {totalScenes} scene. Scene 1 teaser montage, scene 2+ nyambung ceritanya.
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
