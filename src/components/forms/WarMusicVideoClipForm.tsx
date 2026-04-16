"use client";

import useWarMusicVideoGenerator from "./war-music/useWarMusicVideoGenerator";
import ExportAllPromptsSection from "./war-music/sections/ExportAllPromptsSection";
import HeaderSection from "./war-music/sections/HeaderSection";
import PromptOutputSection from "./war-music/sections/PromptOutputSection";
import RandomGeneratorSection from "./war-music/sections/RandomGeneratorSection";
import SceneConfigSection from "./war-music/sections/SceneConfigSection";
import SceneTypeSection from "./war-music/sections/SceneTypeSection";
import TimelineSection from "./war-music/sections/TimelineSection";

export default function WarMusicVideoClipForm() {
	const gen = useWarMusicVideoGenerator();

	return (
		<div>
			<HeaderSection gen={gen} />
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

