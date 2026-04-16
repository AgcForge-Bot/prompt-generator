"use client";

import {
	CAM_ANGLES,
	CAM_MOODS,
	CAM_MOVES,
	COLOR_GRADE_OPTIONS,
	CRAFT_ACTIVITIES,
	EMO_SOUND_OPTIONS,
	EMO_TONE_OPTIONS,
	LENS_OPTIONS,
	SOUND_AMBIENTS,
	SOUND_PRIMARIES,
} from "@/components/forms/forest-build/constants";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import {
	FILM_STYLE_OPTIONS,
	PHASE_META,
	SCENE_TYPES_EMOTION,
	SCENE_TYPES_NORMAL,
} from "@/lib/data";

export default function SceneEditorSection({
	sc,
	currentScene,
	secPerScene,
	activeTab,
	setActiveTab,
	updateScene,
	onGeneratePrompt,
	onGenerateAll,
	onRandomScene,
	onAutoInjectEmotions,
	onNextScene,
}: {
	sc: SceneConfig;
	currentScene: number;
	secPerScene: number;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	updateScene: (id: number, updates: Partial<SceneConfig>) => void;
	onGeneratePrompt: () => void;
	onGenerateAll: () => void;
	onRandomScene: () => void;
	onAutoInjectEmotions: () => void;
	onNextScene: () => void;
}) {
	return (
		<section className="card mb-5">
			<div className="flex items-center gap-3 mb-4 flex-wrap">
				<span className="font-playfair text-3xl italic text-leaf2">
					{String(currentScene).padStart(2, "0")}
				</span>
				<div>
					<div className="font-mono text-[10px] text-sand">
						{PHASE_META[sc.phase].emoji} {PHASE_META[sc.phase].label}
					</div>
					<div className="font-mono text-[8.5px] text-stone">
						{(() => {
							const s = (currentScene - 1) * secPerScene;
							const e = s + secPerScene;
							const f = (n: number) =>
								Math.floor(n / 60) +
								":" +
								(n % 60 < 10 ? "0" : "") +
								(n % 60);
							return `${f(s)} – ${f(e)}`;
						})()}
					</div>
				</div>
				<button
					className={`ml-auto px-3 py-1.5 rounded-full font-mono text-[9px] font-bold border transition-all ${sc.isEmotional ? "bg-amber/20 border-amber2 text-amber2" : "bg-bark/40 border-amber/30 text-amber hover:border-amber"}`}
					onClick={() => updateScene(currentScene, { isEmotional: !sc.isEmotional })}
				>
					⭐ {sc.isEmotional ? "Emotional ON" : "Jadikan Emotional"}
				</button>
			</div>

			<div className="mb-4">
				<label className="field-label mb-2">Tipe Scene</label>
				<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
					{SCENE_TYPES_NORMAL.map((t) => (
						<button
							key={t.key}
							className={`stype-card ${sc.sceneType === t.key ? "active" : ""}`}
							onClick={() =>
								updateScene(currentScene, { sceneType: t.key as SceneTypeKey })
							}
						>
							<div className="text-lg mb-1">{t.icon}</div>
							<div
								className={`font-mono text-[8px] leading-tight ${sc.sceneType === t.key ? "text-leaf2" : "text-sand"}`}
							>
								{t.name}
							</div>
						</button>
					))}
				</div>
				{sc.isEmotional && (
					<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
						{SCENE_TYPES_EMOTION.map((t) => (
							<button
								key={t.key}
								className={`stype-card emotion ${sc.sceneType === t.key ? "active" : ""}`}
								onClick={() =>
									updateScene(currentScene, {
										sceneType: t.key as SceneTypeKey,
									})
								}
							>
								<div className="text-lg mb-1">{t.icon}</div>
								<div
									className={`font-mono text-[8px] leading-tight ${sc.sceneType === t.key ? "text-amber2" : "text-sand"}`}
								>
									{t.name}
								</div>
							</button>
						))}
					</div>
				)}
			</div>

			<div className="flex gap-1 flex-wrap border-b border-leaf/15 pb-0 mb-4">
				{[
					"shot",
					"craft",
					"sound",
					"visual",
					"nature",
					...(sc.isEmotional ? ["emotion"] : []),
				].map((tab) => (
					<button
						key={tab}
						className={`tab-btn ${activeTab === tab ? "active" : ""}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab === "shot"
							? "🎬 Shot"
							: tab === "craft"
								? "⚒️ Craft"
								: tab === "sound"
									? "🎵 Sound"
									: tab === "visual"
										? "✨ Visual"
										: tab === "nature"
											? "🌿 Nature"
											: "⭐ Emotion"}
					</button>
				))}
			</div>

			{activeTab === "shot" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Field label="📷 Camera Angle">
						<Sel
							id="cam-angle"
							value={sc.camAngle}
							onChange={(v) => updateScene(currentScene, { camAngle: v })}
							options={CAM_ANGLES}
						/>
					</Field>
					<Field label="🎥 Camera Movement">
						<Sel
							id="cam-move"
							value={sc.camMove}
							onChange={(v) => updateScene(currentScene, { camMove: v })}
							options={CAM_MOVES}
						/>
					</Field>
					<Field label="🎭 Cinematic Mood">
						<Sel
							id="cam-mood"
							value={sc.camMood}
							onChange={(v) => updateScene(currentScene, { camMood: v })}
							options={CAM_MOODS}
						/>
					</Field>
					<Field label="📽️ Film Quality (Anti-CGI)">
						<Sel
							id="cam-quality"
							value={sc.filmQuality}
							onChange={(v) =>
								updateScene(currentScene, { filmQuality: v })
							}
							options={FILM_STYLE_OPTIONS}
						/>
					</Field>
					<Field label="🔭 Lens">
						<Sel
							id="cam-lens"
							value={sc.camLens}
							onChange={(v) => updateScene(currentScene, { camLens: v })}
							options={LENS_OPTIONS}
						/>
					</Field>
					<Field label="🎨 Color Grade">
						<Sel
							id="cam-grade"
							value={sc.colorGrade}
							onChange={(v) => updateScene(currentScene, { colorGrade: v })}
							options={COLOR_GRADE_OPTIONS}
						/>
					</Field>
				</div>
			)}

			{activeTab === "craft" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Field label="⚒️ Aktivitas Utama Scene">
						<Sel
							id="activity"
							value={sc.activity}
							onChange={(v) => updateScene(currentScene, { activity: v })}
							options={CRAFT_ACTIVITIES}
						/>
					</Field>
					<Field label="🔊 Primary ASMR Sound">
						<Sel
							id="sound-primary"
							value={sc.soundPrimary}
							onChange={(v) =>
								updateScene(currentScene, { soundPrimary: v })
							}
							options={SOUND_PRIMARIES}
						/>
					</Field>
					<Field label="🌿 Ambient Forest Sound">
						<Sel
							id="sound-ambient"
							value={sc.soundAmbient}
							onChange={(v) =>
								updateScene(currentScene, { soundAmbient: v })
							}
							options={SOUND_AMBIENTS}
						/>
					</Field>
				</div>
			)}

			{activeTab === "emotion" && sc.isEmotional && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-amber/5 border border-amber/20">
					<div className="col-span-full font-mono text-[9px] text-amber uppercase tracking-widest mb-1">
						⭐ Emotional Injection Configuration
					</div>
					<Field label="💉 Emotional Tone">
						<Sel
							id="emo-tone"
							value={sc.emoTone ?? "quiet joy"}
							onChange={(v) => updateScene(currentScene, { emoTone: v })}
							options={EMO_TONE_OPTIONS}
						/>
					</Field>
					<Field label="🔊 Emotional Sound Shift">
						<Sel
							id="emo-sound"
							value={sc.emoSound ?? "natural ambient heightened"}
							onChange={(v) => updateScene(currentScene, { emoSound: v })}
							options={EMO_SOUND_OPTIONS}
						/>
					</Field>
				</div>
			)}

			<div className="flex gap-2 flex-wrap mt-4">
				<button className="btn-primary" onClick={onGeneratePrompt}>
					⚡ Generate Prompt
				</button>
				<button className="btn-amber" onClick={onGenerateAll}>
					🎬 Generate Semua
				</button>
				<button className="btn-ghost" onClick={onRandomScene}>
					🎲 Random Scene
				</button>
				<button className="btn-ghost" onClick={onAutoInjectEmotions}>
					⭐ Auto-Inject Emotions
				</button>
				<button className="btn-ghost ml-auto" onClick={onNextScene}>
					Next Scene →
				</button>
			</div>
		</section>
	);
}
