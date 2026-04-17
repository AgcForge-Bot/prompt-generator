"use client";

import useCarMusicVideoGenerator from "./car-music/useCarMusicVideoGenerator";
import ExportAllPromptsSection from "./car-music/sections/ExportAllPromptsSection";
import HeaderSection from "./car-music/sections/HeaderSection";
import PromptOutputSection from "./car-music/sections/PromptOutputSection";
import RandomGeneratorSection from "./car-music/sections/RandomGeneratorSection";
import SceneConfigSection from "./car-music/sections/SceneConfigSection";
import SceneTypeSection from "./car-music/sections/SceneTypeSection";
import TimelineSection from "./car-music/sections/TimelineSection";

export default function CarMusicVideoClipForm() {
	const gen = useCarMusicVideoGenerator();

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				<HeaderSection gen={gen} />
				<TimelineSection gen={gen} />
				<SceneTypeSection gen={gen} />
				<SceneConfigSection gen={gen} />
				<RandomGeneratorSection gen={gen} />
				<PromptOutputSection gen={gen} />
				<ExportAllPromptsSection gen={gen} />
			</div>
			<div
				className={`toast-base bg-moss/95 text-white transition-all ${
					gen.toast.show
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
				}`}
			>
				{gen.toast.msg}
			</div>
		</div>
	);
}
