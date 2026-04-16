"use client";

import useRelaxingMusicVideoGenerator from "./relaxing-music/useRelaxingMusicVideoGenerator";
import ExportAllPromptsSection from "./relaxing-music/sections/ExportAllPromptsSection";
import HeaderSection from "./relaxing-music/sections/HeaderSection";
import ProgressSection from "./relaxing-music/sections/ProgressSection";
import PromptOutputSection from "./relaxing-music/sections/PromptOutputSection";
import RandomGeneratorSection from "./relaxing-music/sections/RandomGeneratorSection";
import SceneConfigSection from "./relaxing-music/sections/SceneConfigSection";
import SceneTypeSection from "./relaxing-music/sections/SceneTypeSection";
import TimeOfDaySection from "./relaxing-music/sections/TimeOfDaySection";
import TimelineSection from "./relaxing-music/sections/TimelineSection";

export default function RelaxingMusicVideoForm() {
	const gen = useRelaxingMusicVideoGenerator();

	return (
		<div>
			<HeaderSection gen={gen} />
			<ProgressSection gen={gen} />
			<TimeOfDaySection gen={gen} />
			<TimelineSection gen={gen} />
			<SceneTypeSection gen={gen} />
			<SceneConfigSection gen={gen} />
			<RandomGeneratorSection gen={gen} />
			<PromptOutputSection gen={gen} />
			<ExportAllPromptsSection gen={gen} />

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
