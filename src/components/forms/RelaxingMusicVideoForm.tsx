"use client";

import useRelaxingMusicVideoGenerator from "./relaxing-music/useRelaxingMusicVideoGenerator";
import ExportAllPromptsSection from "./relaxing-music/sections/ExportAllPromptsSection";
import DurationEngineSection from "./relaxing-music/sections/DurationEngineSection";
import HeaderSection from "./relaxing-music/sections/HeaderSection";
import ProgressSection from "./relaxing-music/sections/ProgressSection";
import PromptOutputSection from "./relaxing-music/sections/PromptOutputSection";
import RandomGeneratorSection from "./relaxing-music/sections/RandomGeneratorSection";
import SceneConfigSection from "./relaxing-music/sections/SceneConfigSection";
import SceneTypeSection from "./relaxing-music/sections/SceneTypeSection";
import TimeOfDaySection from "./relaxing-music/sections/TimeOfDaySection";
import TimelineSection from "./relaxing-music/sections/TimelineSection";
import VisualStyleSection from "./relaxing-music/sections/VisualStyleSection";

export default function RelaxingMusicVideoForm() {
	const gen = useRelaxingMusicVideoGenerator();

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				<HeaderSection gen={gen} />
				<DurationEngineSection gen={gen} />
				<VisualStyleSection gen={gen} />
				<ProgressSection gen={gen} />
				<TimeOfDaySection gen={gen} />
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
