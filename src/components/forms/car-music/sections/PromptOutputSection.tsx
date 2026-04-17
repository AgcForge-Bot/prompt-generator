"use client";

import { SCENE_TYPE_LABELS } from "../constants";
import type { CarMusicVideoGenerator } from "../types";

export default function PromptOutputSection({ gen }: { gen: CarMusicVideoGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">📝 Generated Prompt</div>
			<div className="flex items-center gap-2 mb-3">
				<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-bark/25 text-stone2">
					Scene {gen.currentScene} / {gen.totalScenes}
				</span>
				<span className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/15 bg-moss/15 text-leaf2">
					{SCENE_TYPE_LABELS[gen.scType]}
				</span>
			</div>
			<div className="prompt-box">{gen.promptOutput}</div>
			<div className="flex flex-wrap gap-2 mt-3">
				<button type="button" className="btn-primary" onClick={gen.generatePrompt}>
					⚡ Generate Prompt Scene Ini
				</button>
				<button type="button" className="btn-outline" onClick={gen.copyPrompt}>
					📋 Copy
				</button>
				<button type="button" className="btn-amber" onClick={gen.nextScene}>
					Scene Berikutnya →
				</button>
			</div>
		</section>
	);
}
