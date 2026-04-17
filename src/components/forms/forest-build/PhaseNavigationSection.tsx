"use client";

import type { ScenePhaseKey, SceneConfig } from "./types";
import { PHASE_META } from "./utils";

export default function PhaseNavigationSection({
	phases,
	currentPhase,
	setCurrentPhase,
	scenes,
	currentPhaseScenes,
	currentScene,
	onSelectScene,
	totalScenes,
	generatedCount,
}: {
	phases: { key: ScenePhaseKey; count: number }[];
	currentPhase: ScenePhaseKey;
	setCurrentPhase: (key: ScenePhaseKey) => void;
	scenes: SceneConfig[];
	currentPhaseScenes: SceneConfig[];
	currentScene: number;
	onSelectScene: (id: number) => void;
	totalScenes: number;
	generatedCount: number;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🗺 Navigasi Scene per Fase</div>
			<div className="flex flex-wrap gap-2 mb-3">
				{phases.map((p) => (
					<button
						key={p.key}
						className={`phase-chip ${currentPhase === p.key ? "active" : ""} ${scenes.some((s) => s.phase === p.key && s.isEmotional) ? "has-emotion" : ""}`}
						onClick={() => setCurrentPhase(p.key)}
					>
						{PHASE_META[p.key].emoji} {PHASE_META[p.key].label} ({p.count})
					</button>
				))}
			</div>

			<div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-bark/30 rounded-xl border border-leaf/10 mb-3">
				{currentPhaseScenes.map((s) => (
					<button
						key={s.id}
						className={`scene-mini ${s.id === currentScene ? "active" : ""} ${s.isEmotional ? "emotional" : ""} ${s.generatedPrompt ? "generated" : ""}`}
						onClick={() => onSelectScene(s.id)}
						title={`Scene ${s.id} — ${PHASE_META[s.phase].label}${s.isEmotional ? " ★ Emotional" : ""}`}
					>
						{s.id}
						{s.isEmotional && <span className="text-[6px] text-amber2">★</span>}
					</button>
				))}
			</div>

			<div className="flex items-center gap-3">
				<span className="font-mono text-[9px] text-stone2 uppercase tracking-wide whitespace-nowrap">
					Progress
				</span>
				<div className="flex-1 h-1.5 bg-bark/50 rounded-full overflow-hidden">
					<div
						className="h-full bg-linear-to-r from-moss via-leaf to-amber rounded-full transition-all duration-500"
						style={{
							width: `${totalScenes > 0 ? (generatedCount / totalScenes) * 100 : 0}%`,
						}}
					/>
				</div>
				<span className="font-mono text-[9px] text-leaf2 whitespace-nowrap font-bold">
					{generatedCount}/{totalScenes}
				</span>
			</div>
		</section>
	);
}
