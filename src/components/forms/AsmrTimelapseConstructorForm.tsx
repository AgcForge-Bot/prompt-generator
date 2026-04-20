"use client";

import { useState } from "react";
import useAsmrTimelapseGenerator from "./asmr/useAsmrTimelapseGenerator";
import AsmrModeSelector, { type AsmrModeKey } from "./asmr/AsmrModeSelector";
import AsmrAiModeForm from "./asmr/AsmrAiModeForm";
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
import VisualStyleSection from "./asmr/sections/VisualStyleSection";

export default function AsmrTimelapseConstructorForm() {
	const gen = useAsmrTimelapseGenerator();
	const [asmrMode, setAsmrMode] = useState<AsmrModeKey>("manual");

	return (
		<div>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-6">
				<HeaderSection gen={gen} mode={asmrMode} />

				{/* ── MODE SELECTOR — selalu tampil ── */}
				<AsmrModeSelector selected={asmrMode} onChange={setAsmrMode} />

				{/* ── MODE 1: MANUAL ── */}
				{asmrMode === "manual" && (
					<>
						<DurationEngineSection gen={gen} />
						<VisualStyleSection gen={gen} />
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
					</>
				)}
			</div>

			{asmrMode === "ai" && <AsmrAiModeForm />}

			{asmrMode === "manual" && (
				<div
					className={`toast-base bg-moss/95 text-white transition-all ${
						gen.toast.show
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-8 pointer-events-none"
					}`}
				>
					{gen.toast.msg}
				</div>
			)}
		</div>
	);
}
