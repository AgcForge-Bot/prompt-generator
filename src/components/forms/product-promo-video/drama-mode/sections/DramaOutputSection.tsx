"use client";

import type { DramaOutput, DramaScene } from "../types";

type Props = {
	output: DramaOutput;
	outputJson: string;
	allScenes: DramaScene[];
	onCopy: () => void;
	onDownload: () => void;
	onCopyScene: (index: number) => void;
};

export default function DramaOutputSection({
	output,
	outputJson,
	allScenes,
	onCopy,
	onDownload,
	onCopyScene,
}: Props) {
	const actColors: Record<number, string> = {
		1: "border-stone/40 bg-stone/5 text-stone2",
		2: "border-amber/30 bg-amber/5 text-amber2",
		3: "border-leaf/40 bg-leaf/5 text-leaf2",
		4: "border-amber2/40 bg-amber2/5 text-amber2",
	};

	return (
		<div className="flex flex-col gap-5">
			{/* ── SCRIPT SUMMARY ── */}
			<section
				className="card"
				style={{
					border: "1px solid rgba(122,182,72,0.3)",
					background: "rgba(61,92,46,0.08)",
				}}
			>
				<div className="section-label">
					✅ Drama Script Selesai Di-Generate!
				</div>

				{/* Video concept */}
				{output.video && (
					<div className="mb-4">
						<div className="font-playfair text-xl text-cream font-bold mb-2">
							&quot;{output.video.title}&quot;
						</div>
						<div className="font-mono text-[10px] text-stone2 leading-relaxed">
							{output.video.concept}
						</div>
					</div>
				)}

				{/* Stats */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
					{[
						["🎬", "Total Scene", `${allScenes.length}`],
						["⏱️", "Durasi", `${output.video?.totalDurationSec ?? "—"}s`],
						["📐", "Format", output.video?.aspectRatio ?? "—"],
						["🎭", "Mode", "Thailand Drama"],
					].map(([emoji, label, value]) => (
						<div
							key={label as string}
							className="rounded-lg bg-bark/30 border border-leaf/10 px-3 py-2 text-center"
						>
							<div className="font-mono text-[8px] text-stone2 uppercase">
								{emoji} {label}
							</div>
							<div className="font-playfair text-sm text-cream font-bold">
								{value}
							</div>
						</div>
					))}
				</div>

				{/* Acts */}
				{output.acts && output.acts.length > 0 && (
					<div className="flex flex-col gap-1.5 mb-4">
						{output.acts.map((act) => (
							<div
								key={act.actNumber}
								className={`rounded-lg border px-3 py-2 ${actColors[act.actNumber] ?? actColors[1]}`}
							>
								<div className="flex items-center justify-between">
									<span className="font-mono text-[10px] font-bold">
										Babak {act.actNumber}: {act.actLabel}
									</span>
									<span className="font-mono text-[9px] opacity-70">
										{act.timeRange}
									</span>
								</div>
								<div className="font-mono text-[9px] opacity-70 mt-0.5">
									{act.purpose}
								</div>
							</div>
						))}
					</div>
				)}

				{/* Continuity anchor */}
				{output.continuityAnchor && (
					<div className="rounded-xl bg-bark/30 border border-leaf/10 p-3">
						<div className="font-mono text-[9px] text-leaf uppercase tracking-wider mb-2">
							🔒 Continuity Anchor (Dikunci AI)
						</div>
						<div className="font-mono text-[9px] text-stone2 leading-relaxed">
							<span className="text-cream">Model:</span>{" "}
							{output.continuityAnchor.modelDescription?.substring(0, 100)}...
							<br />
							<span className="text-cream">Produk:</span>{" "}
							{output.continuityAnchor.productDescription?.substring(0, 100)}...
						</div>
					</div>
				)}
			</section>

			{/* ── EXPORT BUTTONS ── */}
			<section className="card">
				<div className="section-label">📦 Export Script</div>
				<div className="grid grid-cols-2 gap-2 mb-3">
					<button
						type="button"
						className="btn-primary py-2.5 text-sm"
						onClick={onCopy}
					>
						📋 Copy Full JSON
					</button>
					<button
						type="button"
						className="btn-amber py-2.5 text-sm"
						onClick={onDownload}
					>
						💾 Download .json
					</button>
				</div>
				<div className="font-mono text-[9px] text-stone2 leading-relaxed">
					Format JSON siap pakai untuk AI video generator (Kling, Runway, VEO,
					Grok, dll). Paste per-scene atau bundel penuh.
				</div>
			</section>

			{/* ── SCENE VIEWER ── */}
			<section className="card">
				<div className="section-label">🎞️ Preview Scene-by-Scene</div>
				<div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
					{allScenes.map((scene, idx) => (
						<SceneCard
							key={scene.sceneNumber}
							scene={scene}
							index={idx}
							actColor={actColors[scene.actNumber] ?? actColors[1]}
							onCopy={() => onCopyScene(idx)}
						/>
					))}
				</div>
			</section>

			{/* ── FULL JSON PREVIEW ── */}
			<section className="card">
				<div className="flex items-center justify-between mb-2">
					<div className="section-label mb-0">{}📄 Full JSON Output</div>
					<button
						type="button"
						className="btn-ghost text-[9px] py-1 px-2"
						onClick={onCopy}
					>
						📋 Copy
					</button>
				</div>
				<div className="prompt-box text-[9px] max-h-80 leading-relaxed">
					{outputJson}
				</div>
			</section>
		</div>
	);
}

// ─── SCENE CARD ───────────────────────────────────────────────────────────────

function SceneCard({
	scene,
	index,
	actColor,
	onCopy,
}: {
	scene: DramaScene;
	index: number;
	actColor: string;
	onCopy: () => void;
}) {
	return (
		<div className="rounded-xl border border-leaf/15 overflow-hidden">
			{/* Header */}
			<div
				className={`flex items-center justify-between px-4 py-2.5 border-b border-leaf/10 ${actColor} bg-opacity-20`}
			>
				<div className="flex items-center gap-2">
					<span className="font-mono text-[11px] font-bold">
						Scene {scene.sceneNumber}/{scene.totalScenes}
					</span>
					<span className="font-mono text-[9px] opacity-70">
						{scene.timeLabel}
					</span>
					<span
						className={`font-mono text-[8px] px-2 py-0.5 rounded-full border ${actColor}`}
					>
						Babak {scene.actNumber}: {scene.actLabel}
					</span>
				</div>
				<button
					type="button"
					className="font-mono text-[9px] text-stone2 hover:text-leaf2 transition-colors"
					onClick={onCopy}
				>
					📋 Copy JSON
				</button>
			</div>

			{/* Content */}
			<div className="p-4 bg-bark/15">
				{/* Action summary */}
				<div className="font-mono text-[10px] text-cream font-bold mb-2">
					{scene.action?.summary}
				</div>

				{/* Setting + Camera */}
				<div className="grid grid-cols-2 gap-2 mb-2">
					{scene.setting && (
						<div className="rounded-lg bg-bark/30 px-2.5 py-2">
							<div className="font-mono text-[8px] text-leaf uppercase mb-1">
								Setting
							</div>
							<div className="font-mono text-[9px] text-stone2">
								{scene.setting.location}
							</div>
							<div className="font-mono text-[9px] text-stone2/60">
								{scene.setting.colorGrade?.substring(0, 50)}
							</div>
						</div>
					)}
					{scene.camera && (
						<div className="rounded-lg bg-bark/30 px-2.5 py-2">
							<div className="font-mono text-[8px] text-leaf uppercase mb-1">
								Camera
							</div>
							<div className="font-mono text-[9px] text-stone2">
								{scene.camera.shot}
							</div>
							<div className="font-mono text-[9px] text-stone2/60">
								{scene.camera.movement}
							</div>
						</div>
					)}
				</div>

				{/* Gimmick highlight */}
				{scene.action?.gimmick && (
					<div className="rounded-lg bg-amber/8 border border-amber/20 px-3 py-2 mb-2">
						<div className="font-mono text-[8px] text-amber2 uppercase mb-0.5">
							🎭 Gimmick
						</div>
						<div className="font-mono text-[9px] text-stone2">
							{scene.action.gimmick}
						</div>
					</div>
				)}

				{/* Dialogue */}
				{scene.dialogue && scene.dialogue.length > 0 && (
					<div className="flex flex-col gap-1">
						{scene.dialogue.map((d, i) => (
							<div
								key={i}
								className="rounded-lg bg-forest/40 border border-leaf/10 px-3 py-1.5"
							>
								<span className="font-mono text-[8px] text-leaf uppercase">
									{d.speaker}:{" "}
								</span>
								<span className="font-mono text-[9px] text-cream italic">
									&quot;{d.line}&quot;
								</span>
								<span className="font-mono text-[8px] text-stone2/60">
									{" "}
									[{d.tone}]
								</span>
							</div>
						))}
					</div>
				)}

				{/* Product visible badge */}
				{scene.action?.productVisible && (
					<div className="mt-2 font-mono text-[8px] px-2 py-0.5 rounded-full bg-leaf/15 border border-leaf/30 text-leaf2 w-fit">
						✓ Produk terlihat di scene ini
					</div>
				)}

				{/* Continuity note */}
				{scene.continuityNote && (
					<div className="mt-2 font-mono text-[8px] text-stone2/50 leading-relaxed border-t border-leaf/8 pt-2">
						🔗 {scene.continuityNote}
					</div>
				)}
			</div>
		</div>
	);
}
