"use client";

import { PHASE_META } from "@/lib/data";

export default function PromptOutputSection({
	promptOutput,
	sc,
	currentScene,
	totalScenes,
	onGeneratePrompt,
	onCopyPrompt,
	onCopyAll,
	onNextScene,
}: {
	promptOutput: string;
	sc: SceneConfig | null;
	currentScene: number;
	totalScenes: number;
	onGeneratePrompt: () => void;
	onCopyPrompt: () => void;
	onCopyAll: () => void;
	onNextScene: () => void;
}) {
	return (
		<section
			className="mb-5 rounded-2xl overflow-hidden"
			style={{
				background: "rgba(10,20,10,0.88)",
				border: "1px solid rgba(122,182,72,0.2)",
				boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
			}}
		>
			<div className="h-0.5 bg-linear-to-r from-moss via-leaf2 to-amber" />
			<div className="p-6">
				<div className="flex items-center justify-between mb-3 flex-wrap gap-2">
					<span className="font-playfair text-lg italic text-sand">
						Generated Prompt
					</span>
					<div className="flex items-center gap-2">
						{sc?.isEmotional && (
							<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-amber/15 text-amber2 border border-amber/30">
								⭐ EMOTIONAL
							</span>
						)}
						{sc && (
							<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-amber/10 text-amber2 border border-amber/25">
								{PHASE_META[sc.phase]?.emoji} {PHASE_META[sc.phase]?.label}
							</span>
						)}
						<span className="font-mono text-[9px] px-2 py-1 rounded-full bg-leaf/10 text-leaf2 border border-leaf/25">
							Scene {currentScene}/{totalScenes}
						</span>
					</div>
				</div>
				<div className="prompt-box">{promptOutput}</div>
				<div className="flex gap-2 flex-wrap mt-3">
					<button className="btn-primary" onClick={onGeneratePrompt}>
						⚡ Generate
					</button>
					<button className="btn-ghost" onClick={onCopyPrompt}>
						📋 Copy
					</button>
					<button className="btn-ghost" onClick={onCopyAll}>
						📋 Copy Semua
					</button>
					<button className="btn-ghost ml-auto" onClick={onNextScene}>
						Next →
					</button>
				</div>
			</div>
		</section>
	);
}

