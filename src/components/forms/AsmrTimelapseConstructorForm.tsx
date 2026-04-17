"use client";

import useAsmrTimelapseGenerator from "./asmr/useAsmrTimelapseGenerator";
import ExportAllPromptsSection from "./asmr/sections/ExportAllPromptsSection";
import DurationEngineSection from "./asmr/sections/DurationEngineSection";
import HeaderSection from "./asmr/sections/HeaderSection";
import ProgressSection from "./asmr/sections/ProgressSection";
import ProjectDnaSection from "./asmr/sections/ProjectDnaSection";
import ProjectTypeSection from "./asmr/sections/ProjectTypeSection";
import PromptOutputSection from "./asmr/sections/PromptOutputSection";
import RandomGeneratorSection from "./asmr/sections/RandomGeneratorSection";
import SceneConfigSection from "./asmr/sections/SceneConfigSection";
import ScenePhaseSection from "./asmr/sections/ScenePhaseSection";
import TimeOfDaySection from "./asmr/sections/TimeOfDaySection";
import TimelineSection from "./asmr/sections/TimelineSection";

export default function AsmrTimelapseConstructorForm() {
	const gen = useAsmrTimelapseGenerator();

	return (
		<div>
			<HeaderSection gen={gen} />
			<DurationEngineSection gen={gen} />
			<ProjectDnaSection gen={gen} />
			<ProgressSection gen={gen} />
			<TimeOfDaySection gen={gen} />
			<ProjectTypeSection gen={gen} />
			<TimelineSection gen={gen} />
			<ScenePhaseSection gen={gen} />
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
