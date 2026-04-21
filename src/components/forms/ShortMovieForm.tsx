"use client";

import { useState } from "react";
import useShortMovieGenerator from "./short-movie/useShortMovieGenerator";
import type { AIProviderKey } from "./short-movie/types";
import {
	AI_MODELS_PROVIDER,
	getDefaultModelId,
	getModelOptions,
} from "@/lib/modelProviders";
import HeaderSection from "./short-movie/sections/HeaderSection";
import DurationEngineSection from "./short-movie/sections/DurationEngineSection";
import GenreMovieSection from "./short-movie/sections/GenreMovieSection";
import CastStoryConfigSection from "./short-movie/sections/CastStoryConfigSection";
import NarationDialogSection from "./short-movie/sections/NarationDialogSection";
import VisualStyleSection from "./short-movie/sections/VisualStyleSection";
import AiProvidersSection from "./short-movie/sections/AiProvidersSection";
import GenerateButtonSection from "./short-movie/sections/GenerateButtonSection";
import PromptOutputSection from "./short-movie/sections/PromptOutputSection";
import FooterSection from "./short-movie/sections/FooterSection";

export default function ShortMovieForm() {
	const g = useShortMovieGenerator();
	const [isManualInput, setIsManualInput] = useState(false);

	const totalDurSec = g.totalScenes * g.config.secPerScene;
	const totalDurMin = (totalDurSec / 60).toFixed(1);

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				<HeaderSection gen={g} totalDurMin={totalDurMin} />
				<DurationEngineSection gen={g} totalDurMin={totalDurMin} />
				<GenreMovieSection
					gen={g}
					isManualInput={isManualInput}
					setIsManualInput={setIsManualInput}
				/>
				<CastStoryConfigSection gen={g} />
				<NarationDialogSection gen={g} />
				<VisualStyleSection gen={g} />
				<AiProvidersSection
					gen={g}
					totalDurSec={totalDurSec}
					totalDurMin={totalDurMin}
				/>
				<GenerateButtonSection gen={g} />

				{g.allPrompts.length > 0 && <PromptOutputSection gen={g} />}

				<FooterSection />
			</div>

			{/* Toast */}
			<div
				className={`toast-base bg-moss/95 text-white transition-all ${
					g.toast.show
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
				}`}
			>
				{g.toast.msg}
			</div>
		</div>
	);
}
