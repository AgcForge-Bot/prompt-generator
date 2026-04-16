"use client";

import { useState, useCallback, useRef } from "react";
import {
	DNA_DEFAULTS,
	PHASE_META,
	SCENE_TYPES_NORMAL,
	SCENE_TYPES_EMOTION,
	TOD_DATA,
	LOCATION_OPTIONS,
	CLIMATE_OPTIONS,
	SHELTER_OPTIONS,
	TRAVEL_MODE_OPTIONS,
	GENDER_OPTIONS,
	FILM_STYLE_OPTIONS,
} from "@/lib/data";
import { computePhases, generateScenes } from "@/lib/scene-generator";
import { buildScenePrompt } from "@/lib/prompt-builder";

// ─── HELPER: SELECT OPTIONS ──────────────────────────────────────────────────

const CAM_ANGLES = [
	"wide establishing fixed — full environment, subject small in frame, nature dominant",
	"aerial drone descending — top-down to eye-level reveal, immense scale shown",
	"medium documentary — subject fills 1/3 frame, work context clear, authentic",
	"close following — just behind subject, seeing what they see, POV adjacent",
	"extreme close-up — hands, tools, materials — pure ASMR texture detail",
	"overhead top-down — bird's eye on work surface, craft from above",
	"low ground level — looking up at subject and structure, dramatic scale",
	"profile side silhouette — subject in rim light against landscape",
	"handheld tracking — walking alongside subject, documentary intimacy",
];

const CAM_MOVES = [
	"completely static locked-off — pure stillness, subject and nature move inside frame",
	"very slow push-in — barely perceptible approach, meditative pace",
	"slow pull-back reveal — intimacy expands to show full environment scale",
	"gentle handheld drift — organic micro-movement, breathes with scene",
	"slow upward tilt — begins on ground, rises to reveal horizon or canopy",
	"slow orbit — circles subject, reveals full 360° environment context",
	"drone lateral sweep — wide slow pan reveals landscape depth",
	"POV walk — camera moves as subject moves, first-person journey feel",
	"slow zoom out — starts tight on detail, opens to wide establishing",
];

const CAM_MOODS = [
	"meditative & deeply satisfying — unhurried, every movement has weight and meaning",
	"documentary realism — honest, unfiltered, raw — exactly as it happened",
	"lyrical and poetic — movement as music, light as emotion",
	"primitive & earthy — gritty texture, weathered reality, no glamour",
	"wonder & reverence — nature is the cathedral, human is small within it",
	"intimate & personal — close, warm, felt rather than observed",
	"triumphant & earned — hard work made beautiful by persistence",
];

const CRAFT_ACTIVITIES = [
	"chopping and splitting wood — axe strikes rhythmic, chips flying, satisfying thwack",
	"digging and excavating — earth turned methodically, roots cut, cavity deepening",
	"carving and shaping timber — slow deliberate cuts, curled shavings accumulating",
	"laying stones or logs — each piece placed with care, level checked, fitted perfectly",
	"weaving and lashing — vines or rope wound tightly, knots pulled firm",
	"mixing and applying clay mortar — earthy wet sound, hands press into gaps",
	"thatching the roof — bundles tied in overlapping rows, waterproof layer built",
	"installing interior furnishings — arranging, fitting, making it home",
	"gathering materials through forest — moving, selecting, carrying, harvesting",
	"assembling and testing — pieces come together, joints checked, structure proves itself",
	"cooking over open fire — preparation, fire management, watching food transform",
	"fishing or hunting — patient waiting, skilled technique, nature provides",
];

const SOUND_PRIMARIES = [
	"axe chopping wood — deep meaty thwack, ring resonance, totally satisfying",
	"hand saw through grain — rhythmic rasp, sawdust whisper, steady tempo",
	"mud and clay applied — wet thick slap, organic and rich in texture",
	"stones placed and stacked — soft clunk and scrape, dry stone settling sound",
	"fire crackling — irregular snap and pop, warmth audible in the sound",
	"water boiling in pot — bubbling gentle rhythm, steam hiss occasional",
	"footsteps on leaves and earth — complex natural percussion, pace tells story",
	"rope pulled taut — creak and stretch, tension building to satisfying hold",
	"rain on leaves and shelter roof — meditative patter, layers of percussion",
	"wind through forest canopy — deep organic drone with leaf rustle texture",
];

const SOUND_AMBIENTS = [
	"rich multi-species bird chorus — full forest alive, spatial and layered",
	"stream over stones — moving water nearby, constant meditative flow",
	"rain on leaves — gentle building patter, humid acoustic richness",
	"complete forest silence — only work sounds, rare and powerful",
	"insects — cicadas, crickets, life density of warm forest day",
	"wind through tall pines — deep organic drone, ancient sound",
	"dawn chorus peak — richest birdsong of the day, morning at its finest",
	"night sounds — frogs, owls, deep forest alive in darkness",
	"lake water lapping — soft rhythmic wave against shore",
];

function getVisionProviderLabel(model: ModelType) {
	switch (model) {
		case "CLAUDE":
			return "Claude (Anthropic)";
		case "OPENAI":
			return "OpenAI";
		case "GEMINI":
			return "Gemini";
		case "OPENROUTER":
			return "OpenRouter";
	}
}

function getDefaultVisionModelId(provider: ModelType) {
	switch (provider) {
		case "CLAUDE":
			return "claude-sonnet-4-20250514";
		case "OPENAI":
			return "gpt-4o-mini";
		case "GEMINI":
			return "gemini-2.5-flash-lite";
		case "OPENROUTER":
			return "google/gemini-2.5-flash-lite";
	}
}

// ─── FIELD COMPONENT ──────────────────────────────────────────────────────────

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="field-label">{label}</label>
			{children}
		</div>
	);
}

function Sel({
	id,
	value,
	onChange,
	options,
}: {
	id: string;
	value: string;
	onChange: (v: string) => void;
	options: string[] | { value: string; label: string }[];
}) {
	return (
		<select
			id={id}
			className="forest-select"
			value={value}
			onChange={(e) => onChange(e.target.value)}
		>
			{options.map((o, i) =>
				typeof o === "string" ? (
					<option key={i} value={o}>
						{o.length > 80 ? o.substring(0, 78) + "…" : o}
					</option>
				) : (
					<option key={i} value={o.value}>
						{o.label}
					</option>
				),
			)}
		</select>
	);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

function useToast() {
	const [toast, setToast] = useState<{ msg: string; show: boolean }>({
		msg: "",
		show: false,
	});
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const show = useCallback((msg: string) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setToast({ msg, show: true });
		timerRef.current = setTimeout(
			() => setToast((t) => ({ ...t, show: false })),
			2800,
		);
	}, []);
	return { toast, show };
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Home() {
	// ── Duration state
	const [totalMinutes, setTotalMinutes] = useState(10);
	const [secPerScene, setSecPerScene] = useState(10);
	const totalScenes = Math.floor((totalMinutes * 60) / secPerScene);

	// ── DNA state
	const [dna, setDna] = useState<ProjectDNA>(DNA_DEFAULTS);
	const [dnaLocked, setDnaLocked] = useState(false);

	// ── Scenes state
	const [scenes, setScenes] = useState<SceneConfig[]>([]);
	const [currentScene, setCurrentScene] = useState(1);
	const [currentPhase, setCurrentPhase] = useState<ScenePhaseKey>("hook");

	// ── Active scene config (per-scene overrides)
	const [activeTab, setActiveTab] = useState("shot");

	// ── Image refs
	const [globalImages, setGlobalImages] = useState<ImageRef[]>([]);
	const [imgScope, setImgScope] = useState<"global" | "scene">("global");
	const [imgAnalyzing, setImgAnalyzing] = useState(false);
	const [imgProgress, setImgProgress] = useState("");
	const [imgModel, setImgModel] = useState<ModelType>("CLAUDE");
	const [imgModelId, setImgModelId] = useState<string>(
		getDefaultVisionModelId("CLAUDE"),
	);

	// ── Output
	const [promptOutput, setPromptOutput] = useState(
		"🔒 Kunci Project DNA terlebih dahulu, lalu klik ⚡ Generate.",
	);
	const [allPrompts, setAllPrompts] = useState<string[]>([]);
	const [showAllPrompts, setShowAllPrompts] = useState(false);

	// ── Toast
	const { toast, show: showToast } = useToast();

	// ─── DURATION CHANGE ────────────────────────────────────────────────────────

	function handleDurationChange(min: number, sec: number) {
		setTotalMinutes(min);
		setSecPerScene(sec);
		setCurrentScene(1);
		setCurrentPhase("hook");
		if (dnaLocked) {
			const newTotal = Math.floor((min * 60) / sec);
			setScenes(generateScenes(newTotal, dna));
		}
	}

	// ─── DNA LOCK ────────────────────────────────────────────────────────────────

	function lockDNA() {
		const newScenes = generateScenes(totalScenes, dna);
		setScenes(newScenes);
		setDnaLocked(true);
		setCurrentScene(1);
		setCurrentPhase("hook");
		showToast(`🔒 DNA Terkunci! ${totalScenes} scene siap di-generate.`);
	}

	function randomDNA() {
		setDna({
			...dna,
			location:
				LOCATION_OPTIONS[Math.floor(Math.random() * LOCATION_OPTIONS.length)]
					.value,
			climate:
				CLIMATE_OPTIONS[Math.floor(Math.random() * CLIMATE_OPTIONS.length)]
					.value,
			shelterType:
				SHELTER_OPTIONS[Math.floor(Math.random() * SHELTER_OPTIONS.length)]
					.value,
			travelMode:
				TRAVEL_MODE_OPTIONS[
					Math.floor(Math.random() * TRAVEL_MODE_OPTIONS.length)
				].value,
			filmStyle:
				FILM_STYLE_OPTIONS[
					Math.floor(Math.random() * FILM_STYLE_OPTIONS.length)
				].value,
		});
		showToast("🎲 DNA di-randomize!");
	}

	// ─── SCENE ACCESS ────────────────────────────────────────────────────────────

	function getScene(id: number): SceneConfig {
		return scenes.find((s) => s.id === id) ?? scenes[0];
	}

	function updateScene(id: number, updates: Partial<SceneConfig>) {
		setScenes((prev) =>
			prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
		);
	}

	function selectScene(id: number) {
		if (!dnaLocked) return;
		setCurrentScene(id);
		const sc = scenes.find((s) => s.id === id);
		if (sc) setCurrentPhase(sc.phase);
		generatePromptFor(id);
	}

	// ─── GENERATE PROMPT ─────────────────────────────────────────────────────────

	function generatePromptFor(sceneId: number) {
		if (!dnaLocked) {
			setPromptOutput("🔒 Kunci Project DNA terlebih dahulu!");
			return;
		}
		const sc = scenes.find((s) => s.id === sceneId);
		if (!sc) return;
		const prompt = buildScenePrompt(
			sc,
			dna,
			globalImages,
			totalScenes,
			secPerScene,
		);
		setPromptOutput(prompt);
		updateScene(sceneId, { generatedPrompt: prompt });
		showToast(`✓ Prompt Scene ${sceneId} berhasil!`);
	}

	function generatePrompt() {
		generatePromptFor(currentScene);
	}

	function generateAll() {
		if (!dnaLocked) {
			showToast("⚠ Kunci DNA dulu!");
			return;
		}
		const prompts = scenes.map((sc) =>
			buildScenePrompt(sc, dna, globalImages, totalScenes, secPerScene),
		);
		setAllPrompts(prompts);
		setShowAllPrompts(true);
		const updated = scenes.map((sc, i) => ({
			...sc,
			generatedPrompt: prompts[i],
		}));
		setScenes(updated);
		setPromptOutput(prompts[currentScene - 1] ?? "");
		showToast(`✓ ${totalScenes} prompt berhasil di-generate!`);
	}

	function copyPrompt() {
		if (!promptOutput.startsWith("🔒")) {
			navigator.clipboard.writeText(promptOutput);
			showToast(`📋 Prompt Scene ${currentScene} tersalin!`);
		}
	}

	function copyAll() {
		if (!allPrompts.length) {
			generateAll();
			return;
		}
		navigator.clipboard.writeText(
			allPrompts.join("\n\n" + "─".repeat(64) + "\n\n"),
		);
		showToast(`📋 Semua ${totalScenes} prompt tersalin!`);
	}

	function nextScene() {
		const next = currentScene < totalScenes ? currentScene + 1 : 1;
		selectScene(next);
	}

	// ─── RANDOM SCENE ────────────────────────────────────────────────────────────

	function randomCurrentScene() {
		function rnd<T>(arr: T[]): T {
			return arr[Math.floor(Math.random() * arr.length)];
		}
		updateScene(currentScene, {
			camAngle: rnd(CAM_ANGLES),
			camMove: rnd(CAM_MOVES),
			camMood: rnd(CAM_MOODS),
			activity: rnd(CRAFT_ACTIVITIES),
			soundPrimary: rnd(SOUND_PRIMARIES),
			soundAmbient: rnd(SOUND_AMBIENTS),
		});
		setTimeout(() => generatePromptFor(currentScene), 50);
		showToast(`🎲 Scene ${currentScene} di-randomize!`);
	}

	function autoInjectEmotions() {
		const interval = Math.floor(totalScenes / 5);
		const emotionTypes: SceneTypeKey[] = [
			"emo-civilian",
			"emo-animal",
			"emo-wonder",
			"emo-rescue",
			"emo-cook",
		];
		setScenes((prev) =>
			prev.map((sc) => {
				if (sc.id % interval === 0 && sc.id < totalScenes) {
					const emoIdx = Math.floor(sc.id / interval) - 1;
					return {
						...sc,
						isEmotional: true,
						sceneType: emotionTypes[emoIdx % emotionTypes.length],
					};
				}
				return sc;
			}),
		);
		showToast(`⭐ Emotional moments di-inject otomatis!`);
	}

	// ─── IMAGE UPLOAD ────────────────────────────────────────────────────────────

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;
		setImgAnalyzing(true);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			setImgProgress(
				`Menganalisa gambar ${i + 1}/${files.length}: "${file.name}"...`,
			);

			const base64 = await new Promise<string>((res, rej) => {
				const reader = new FileReader();
				reader.onload = (ev) =>
					res((ev.target?.result as string).split(",")[1]);
				reader.onerror = () => rej(new Error("Read failed"));
				reader.readAsDataURL(file);
			});

			const previewUrl = await new Promise<string>((res) => {
				const r2 = new FileReader();
				r2.onload = (ev) => res(ev.target?.result as string);
				r2.readAsDataURL(file);
			});

			let desc: string | undefined;
			try {
				const res = await fetch("/api/analyze-image", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						base64,
						mediaType: file.type || "image/jpeg",
						scope: imgScope,
						sceneNum: currentScene,
						model: imgModel,
						modelId: imgModelId || undefined,
					}),
				});
				const data = await res.json();
				desc = data.description;
			} catch {
				desc = undefined;
			}

			const ref: ImageRef = {
				id: `${Date.now()}-${i}`,
				type: "upload",
				url: previewUrl,
				name: file.name,
				scope: imgScope,
				sceneNum: currentScene,
				base64,
				mediaType: file.type,
				aiDescription: desc,
				status: desc ? "done" : "failed",
			};

			if (imgScope === "global") {
				setGlobalImages((prev) => [...prev, ref]);
			} else {
				updateScene(currentScene, {
					imageRefs: [...(getScene(currentScene).imageRefs ?? []), ref],
				});
			}
		}

		setImgAnalyzing(false);
		setImgProgress("");
		e.target.value = "";
		showToast(
			`✅ ${files.length} gambar selesai dianalisa ${getVisionProviderLabel(imgModel)}!`,
		);
	}

	async function addImageURL(url: string) {
		if (!url.startsWith("http")) {
			showToast("⚠ URL tidak valid!");
			return;
		}
		setImgAnalyzing(true);
		setImgProgress("Menganalisa URL gambar...");

		let desc: string | undefined;
		try {
			const res = await fetch("/api/analyze-image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					url,
					scope: imgScope,
					sceneNum: currentScene,
					model: imgModel,
					modelId: imgModelId || undefined,
				}),
			});
			const data = await res.json();
			desc = data.description;
		} catch {
			desc = undefined;
		}

		const ref: ImageRef = {
			id: Date.now().toString(),
			type: "url",
			url,
			name: url.split("/").pop()?.split("?")[0]?.substring(0, 40) ?? "image",
			scope: imgScope,
			sceneNum: currentScene,
			aiDescription: desc,
			status: desc ? "done" : "failed",
		};

		if (imgScope === "global") {
			setGlobalImages((prev) => [...prev, ref]);
		} else {
			updateScene(currentScene, {
				imageRefs: [...(getScene(currentScene).imageRefs ?? []), ref],
			});
		}

		setImgAnalyzing(false);
		setImgProgress("");
		showToast(
			desc
				? `🎨 URL dianalisa ${getVisionProviderLabel(imgModel)}!`
				: "⚠ URL ditambahkan (analisa gagal)",
		);
	}

	// ─── COMPUTED ────────────────────────────────────────────────────────────────

	const phases = dnaLocked ? computePhases(totalScenes) : [];
	const currentPhaseScenes = dnaLocked
		? scenes.filter((s) => s.phase === currentPhase)
		: [];
	const sc = dnaLocked
		? (scenes.find((s) => s.id === currentScene) ?? scenes[0])
		: null;
	const generatedCount = scenes.filter((s) => s.generatedPrompt).length;

	// ─── URL INPUT STATE ─────────────────────────────────────────────────────────
	const [urlInput, setUrlInput] = useState("");

	// ─────────────────────────────────────────────────────────────────────────────
	// RENDER
	// ─────────────────────────────────────────────────────────────────────────────

	return (
		<main className="z-content min-h-screen">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-12">
				{/* ── HEADER ── */}
				<header className="mb-8 pb-6 border-b border-leaf/20">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<span className="text-leaf text-sm">🌿</span>
								<span className="font-mono text-[9px] tracking-[0.2em] uppercase text-leaf">
									ASMR Survival Build · AI Video Prompt Generator
								</span>
							</div>
							<h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-2">
								Forest Build
								<br />
								<em className="text-leaf2 italic">Primitive Craft</em>
							</h1>
							<p className="font-mono text-[11px] text-stone2 leading-relaxed">
								ASMR · Story-driven Survival · Relaxing + Emotional
								<br />
								Grok · VEO · Kling · Runway · Pika · Luma
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:items-end">
							{[
								["Total Scene", `${totalScenes}`],
								["Durasi", `${totalMinutes} menit`],
								["Per-scene", `${secPerScene} detik`],
								["Platform", "Grok + VEO"],
							].map(([k, v]) => (
								<div
									key={k}
									className="font-mono text-[10px] px-3 py-1 rounded-full border border-leaf/20 bg-moss/20 text-stone2 whitespace-nowrap"
								>
									{k}: <span className="text-leaf2 font-bold">{v}</span>
								</div>
							))}
						</div>
					</div>
				</header>

				{/* ── DURATION ENGINE ── */}
				<section className="card mb-5">
					<div className="section-label">⏱ Duration Engine</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
						<Field label="Total Durasi Video">
							<Sel
								id="dur-total"
								value={String(totalMinutes)}
								onChange={(v) => handleDurationChange(+v, secPerScene)}
								options={["8", "10", "12", "15", "18", "20"].map((v) => ({
									value: v,
									label: `${v} Menit`,
								}))}
							/>
						</Field>
						<Field label="Durasi Per-Scene (AI)">
							<Sel
								id="dur-scene"
								value={String(secPerScene)}
								onChange={(v) => handleDurationChange(totalMinutes, +v)}
								options={[
									{ value: "8", label: "8 Detik / scene" },
									{ value: "10", label: "10 Detik / scene" },
								]}
							/>
						</Field>
						<Field label="Format Prompt">
							<Sel
								id="dur-format"
								value="detailed"
								onChange={() => {}}
								options={[
									"Detailed — Full cinematic description",
									"Compact — Dense key phrases",
								]}
							/>
						</Field>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bark/40 rounded-xl p-4 border border-leaf/10">
						{[
							[totalScenes.toString(), "Total Scene"],
							[totalMinutes.toString(), "Menit"],
							[secPerScene.toString(), "Detik/Scene"],
							[Math.floor(totalScenes / 15).toString(), "Emotional Moments"],
						].map(([v, l]) => (
							<div key={l} className="flex flex-col items-center gap-1">
								<span className="font-playfair text-3xl font-bold text-leaf2">
									{v}
								</span>
								<span className="font-mono text-[8.5px] text-stone2 uppercase tracking-wide">
									{l}
								</span>
							</div>
						))}
					</div>
				</section>

				{/* ── PROJECT DNA ── */}
				<section className="card mb-5 relative overflow-hidden">
					<div className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.15em] text-leaf/25 font-bold">
						🧬 DNA
					</div>
					<div className="section-label">🧬 Project DNA — Master Config</div>
					<div className="bg-leaf/10 border border-leaf/20 rounded-xl p-3 mb-4 font-mono text-[11px] text-sand leading-relaxed">
						<span className="text-leaf2 font-bold">
							⚠ Dikunci untuk semua scene.
						</span>{" "}
						Lokasi, model, shelter, dan material TIDAK berubah antar scene. Ini
						yang memastikan video sinkron dan konsisten seperti film dokumenter.
					</div>

					{/* VIDEO TITLE */}
					<div className="mb-4">
						<Field label="🎬 Judul Video (Story Hook)">
							<input
								className="forest-input"
								value={dna.videoTitle}
								onChange={(e) =>
									setDna((d) => ({ ...d, videoTitle: e.target.value }))
								}
								placeholder="Contoh: Surviving 10 Days in the Forest — Extreme Temperature..."
							/>
						</Field>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
						<Field label="🧑 Model Gender">
							<Sel
								id="dna-gender"
								value={dna.modelGender}
								onChange={(v) =>
									setDna((d) => ({
										...d,
										modelGender: v as typeof d.modelGender,
									}))
								}
								options={GENDER_OPTIONS.map((o) => ({
									value: o.value,
									label: o.label,
								}))}
							/>
						</Field>
						<Field label="🚗 Mode Perjalanan">
							<Sel
								id="dna-travel"
								value={dna.travelMode}
								onChange={(v) =>
									setDna((d) => ({
										...d,
										travelMode: v as typeof d.travelMode,
									}))
								}
								options={TRAVEL_MODE_OPTIONS.map((o) => ({
									value: o.value,
									label: o.label,
								}))}
							/>
						</Field>
						<Field label="🐾 Hewan Peliharaan">
							<Sel
								id="dna-pet"
								value={dna.hasPet ? "yes" : "no"}
								onChange={(v) => setDna((d) => ({ ...d, hasPet: v === "yes" }))}
								options={[
									{ value: "no", label: "🚫 Tanpa Hewan Peliharaan" },
									{ value: "yes", label: "🐕 Ya, Ada Hewan Peliharaan" },
								]}
							/>
						</Field>
						{dna.hasPet && (
							<Field label="🐕 Jenis Hewan Peliharaan">
								<Sel
									id="dna-pettype"
									value={dna.petType}
									onChange={(v) => setDna((d) => ({ ...d, petType: v }))}
									options={[
										{
											value:
												"loyal dog — medium breed, follows closely, rests by fire at night",
											label: "🐕 Anjing setia — medium, selalu di samping",
										},
										{
											value:
												"large husky dog — bred for cold, energetic, sled-dog heritage",
											label: "🐺 Husky — Cocok untuk salju, energik",
										},
										{
											value:
												"small cat — independent, comes and goes, sleeps inside shelter",
											label: "🐈 Kucing kecil — mandiri, tidur di shelter",
										},
									]}
								/>
							</Field>
						)}
						<Field label="📍 Setting Lokasi">
							<Sel
								id="dna-location"
								value={dna.location}
								onChange={(v) => setDna((d) => ({ ...d, location: v }))}
								options={LOCATION_OPTIONS}
							/>
						</Field>
						<Field label="🌡️ Iklim & Musim">
							<Sel
								id="dna-climate"
								value={dna.climate}
								onChange={(v) => setDna((d) => ({ ...d, climate: v }))}
								options={CLIMATE_OPTIONS}
							/>
						</Field>
						<Field label="🏠 Tipe Shelter yang Dibangun">
							<Sel
								id="dna-shelter"
								value={dna.shelterType}
								onChange={(v) => setDna((d) => ({ ...d, shelterType: v }))}
								options={SHELTER_OPTIONS}
							/>
						</Field>
						<Field label="🚚 Cargo Drop (Bahan dari Kota)">
							<Sel
								id="dna-cargo"
								value={dna.hasCargoDrop ? "yes" : "no"}
								onChange={(v) =>
									setDna((d) => ({ ...d, hasCargoDrop: v === "yes" }))
								}
								options={[
									{
										value: "no",
										label: "🌿 Tidak — Semua bahan dari alam sekitar",
									},
									{
										value: "yes",
										label: "🚚 Ya — Mobil cargo datang membawa bahan tambahan",
									},
								]}
							/>
						</Field>
						<Field label="📽️ Film Style (Anti-CGI Anchor)">
							<Sel
								id="dna-film"
								value={dna.filmStyle}
								onChange={(v) => setDna((d) => ({ ...d, filmStyle: v }))}
								options={FILM_STYLE_OPTIONS}
							/>
						</Field>
						<Field label="🎨 Palet Warna Visual">
							<Sel
								id="dna-palette"
								value={dna.colorPalette}
								onChange={(v) => setDna((d) => ({ ...d, colorPalette: v }))}
								options={[
									{
										value:
											"deep forest green, rich earth brown, moss grey, warm amber firelight — organic warm-cool balance",
										label: "🎨 Forest Earthy — Hijau hutan, coklat bumi",
									},
									{
										value:
											"cold blue-white snow, deep evergreen, warm orange fire glow — sharp winter contrast",
										label: "🎨 Winter Contrast — Salju putih, api oranye",
									},
									{
										value:
											"golden bamboo and deep green — warm yellow-green spectrum, tropical dappled light",
										label: "🎨 Bamboo Tropical — Bambu emas, hijau tropis",
									},
									{
										value:
											"grey coastal stone, driftwood white, deep sea blue, pine green",
										label: "🎨 Coastal Nordic — Batu abu, laut biru",
									},
									{
										value:
											"golden autumn amber, russet red leaves, grey stone, dark timber",
										label: "🎨 Autumn Amber — Daun emas, batu abu",
									},
								]}
							/>
						</Field>
					</div>

					<div className="flex gap-3 flex-wrap items-center">
						<button className="btn-primary" onClick={lockDNA}>
							🔒 Kunci DNA & Mulai
						</button>
						<button className="btn-outline" onClick={randomDNA}>
							🎲 Random DNA
						</button>
						{dnaLocked && (
							<div className="flex items-center gap-2 ml-auto px-3 py-2 rounded-full bg-moss/30 border border-leaf/30 font-mono text-[10px] text-leaf2 font-bold">
								<span className="w-2 h-2 rounded-full bg-leaf2 animate-pulse-slow" />
								DNA Aktif — {totalScenes} Scene Terkunci
							</div>
						)}
					</div>
				</section>

				{/* ── IMAGE REFERENCE ── */}
				<section className="card mb-5">
					<div className="section-label">
						📸 Image Reference — {getVisionProviderLabel(imgModel)}
					</div>
					{/* Scope tabs */}
					<div className="flex gap-1 mb-4 bg-bark/40 rounded-xl p-1">
						{(["global", "scene"] as const).map((scope) => (
							<button
								key={scope}
								className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${imgScope === scope ? "bg-moss/50 text-leaf2" : "text-stone2 hover:text-cream"}`}
								onClick={() => setImgScope(scope)}
							>
								{scope === "global"
									? "🌐 Global — Semua Scene"
									: `🎬 Scene ${currentScene} Saja`}
							</button>
						))}
					</div>

					{/* Analysis status */}
					{imgAnalyzing && (
						<div className="mb-3 px-3 py-2 rounded-lg bg-amber/10 border border-amber/30 font-mono text-[10px] text-amber2">
							⏳ {imgProgress}
						</div>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
						<Field label="🤖 AI Analisa Gambar">
							<Sel
								id="img-model"
								value={imgModel}
								onChange={(v) => {
									const provider = v as ModelType;
									setImgModel(provider);
									setImgModelId(getDefaultVisionModelId(provider));
								}}
								options={[
									{ value: "CLAUDE", label: "Claude (Anthropic)" },
									{ value: "OPENAI", label: "OpenAI" },
									{ value: "GEMINI", label: "Gemini" },
									{ value: "OPENROUTER", label: "OpenRouter" },
								]}
							/>
						</Field>
						<Field label="🧠 Model ID (opsional)">
							<input
								className="forest-input"
								placeholder={getDefaultVisionModelId(imgModel)}
								value={imgModelId}
								onChange={(e) => setImgModelId(e.target.value)}
							/>
						</Field>
					</div>

					{/* Upload */}
					<label className="block mb-3 border-2 border-dashed border-leaf/25 rounded-xl p-5 text-center cursor-pointer hover:border-leaf hover:bg-moss/10 transition-all">
						<input
							type="file"
							className="hidden"
							accept="image/*"
							multiple
							onChange={handleImageUpload}
						/>
						<div className="text-3xl mb-2">📁</div>
						<div className="font-mono text-[11px] text-stone2">
							<span className="text-leaf2 font-bold">Klik atau drag</span>{" "}
							gambar referensi
							<br />
							JPG / PNG / WEBP · Multiple files OK
							<br />
							<span className="text-leaf text-[9px]">
								AI otomatis analisa & deskripsikan setiap gambar
							</span>
						</div>
					</label>

					{/* URL input */}
					<div className="flex gap-2 mb-3">
						<input
							className="forest-input flex-1"
							placeholder="https://example.com/reference.jpg"
							value={urlInput}
							onChange={(e) => setUrlInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									addImageURL(urlInput);
									setUrlInput("");
								}
							}}
						/>
						<button
							className="btn-ghost whitespace-nowrap"
							onClick={() => {
								addImageURL(urlInput);
								setUrlInput("");
							}}
						>
							+ URL
						</button>
					</div>

					{/* Previews */}
					{(globalImages.length > 0 || (sc?.imageRefs?.length ?? 0) > 0) && (
						<div className="flex gap-2 flex-wrap">
							{(imgScope === "global"
								? globalImages
								: (sc?.imageRefs ?? [])
							).map((img, i) => (
								<div key={img.id} className="relative">
									{img.type === "upload" ? (
										<div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-leaf/25 group">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={img.url}
												alt="ref"
												className="w-full h-full object-cover"
											/>
											<span className="absolute top-1 left-1 px-1 rounded text-[7px] font-bold font-mono bg-forest/90 text-leaf2">
												{img.scope === "global" ? "ALL" : `S${img.sceneNum}`}
											</span>
											<span
												className={`absolute bottom-1 right-1 px-1 rounded text-[7px] font-bold font-mono ${img.status === "done" ? "bg-moss/90 text-leaf2" : "bg-red-900/90 text-red-300"}`}
											>
												{img.status === "done" ? "✓AI" : "✗"}
											</span>
											<div className="absolute inset-0 bg-forest/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													className="text-red-400 text-xs font-bold font-mono"
													onClick={() => {
														imgScope === "global"
															? setGlobalImages((g) =>
																	g.filter((_, j) => j !== i),
																)
															: updateScene(currentScene, {
																	imageRefs: (sc?.imageRefs ?? []).filter(
																		(_, j) => j !== i,
																	),
																});
													}}
												>
													✕ Remove
												</button>
											</div>
										</div>
									) : (
										<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bark/50 border border-leaf/15">
											<span>🔗</span>
											<span className="font-mono text-[9px] text-stone2 max-w-25 truncate">
												{img.name}
											</span>
											<span
												className={`font-mono text-[7px] font-bold ${img.status === "done" ? "text-leaf" : "text-red-400"}`}
											>
												{img.status === "done" ? "✓AI" : "✗"}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</section>

				{/* ── TIME OF DAY ── */}
				<section className="card mb-5">
					<div className="section-label">🌤 Waktu Shooting Scene</div>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
						{(
							Object.entries(TOD_DATA) as [
								TimeOfDay,
								(typeof TOD_DATA)[keyof typeof TOD_DATA],
							][]
						).map(([key, tod]) => (
							<button
								key={key}
								className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
									sc?.timeOfDay === key
										? key === "morning"
											? "border-amber bg-amber/10"
											: key === "noon"
												? "border-leaf bg-leaf/10"
												: key === "afternoon"
													? "border-clay/80 bg-clay/10"
													: "border-purple-500/60 bg-purple-900/20"
										: "border-leaf/15 bg-bark/30 hover:border-leaf/40"
								}`}
								onClick={() =>
									sc && updateScene(currentScene, { timeOfDay: key })
								}
							>
								<span className="text-2xl">{tod.emoji}</span>
								<span className="font-playfair text-sm text-cream">
									{tod.label}
								</span>
								<span className="font-mono text-[8px] text-stone2 text-center leading-tight">
									{tod.range}
								</span>
							</button>
						))}
					</div>
				</section>

				{/* ── PHASE NAVIGATION ── */}
				{dnaLocked && (
					<section className="card mb-5">
						<div className="section-label">🗺 Navigasi Scene per Fase</div>
						<div className="flex flex-wrap gap-2 mb-3">
							{phases.map((p) => (
								<button
									key={p.key}
									className={`phase-chip ${currentPhase === p.key ? "active" : ""} ${scenes.some((s) => s.phase === p.key && s.isEmotional) ? "has-emotion" : ""}`}
									onClick={() => setCurrentPhase(p.key)}
								>
									{PHASE_META[p.key].emoji} {PHASE_META[p.key].label} ({p.count}
									)
								</button>
							))}
						</div>

						<div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-bark/30 rounded-xl border border-leaf/10 mb-3">
							{currentPhaseScenes.map((s) => (
								<button
									key={s.id}
									className={`scene-mini ${s.id === currentScene ? "active" : ""} ${s.isEmotional ? "emotional" : ""} ${s.generatedPrompt ? "generated" : ""}`}
									onClick={() => selectScene(s.id)}
									title={`Scene ${s.id} — ${PHASE_META[s.phase].label}${s.isEmotional ? " ★ Emotional" : ""}`}
								>
									{s.id}
									{s.isEmotional && (
										<span className="text-[6px] text-amber2">★</span>
									)}
								</button>
							))}
						</div>

						{/* Progress bar */}
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
				)}

				{/* ── SCENE CONFIG ── */}
				{dnaLocked && sc && (
					<section className="card mb-5">
						{/* Scene header */}
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
										const s = (currentScene - 1) * secPerScene,
											e = s + secPerScene;
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
								onClick={() =>
									updateScene(currentScene, { isEmotional: !sc.isEmotional })
								}
							>
								⭐ {sc.isEmotional ? "Emotional ON" : "Jadikan Emotional"}
							</button>
						</div>

						{/* Scene type selector */}
						<div className="mb-4">
							<label className="field-label mb-2">Tipe Scene</label>
							<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
								{SCENE_TYPES_NORMAL.map((t) => (
									<button
										key={t.key}
										className={`stype-card ${sc.sceneType === t.key ? "active" : ""}`}
										onClick={() =>
											updateScene(currentScene, {
												sceneType: t.key as SceneTypeKey,
											})
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

						{/* Config tabs */}
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

						{/* SHOT TAB */}
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
										options={[
											"wide 24mm — environment present, spatial context always clear",
											"standard 35mm — natural balanced perspective",
											"macro 100mm — extreme material detail, grain and surface texture",
											"tilt-shift — selective miniature focus on key detail",
											"telephoto 85mm — compressed depth, forest layers as bokeh",
										]}
									/>
								</Field>
								<Field label="🎨 Color Grade">
									<Sel
										id="cam-grade"
										value={sc.colorGrade}
										onChange={(v) =>
											updateScene(currentScene, { colorGrade: v })
										}
										options={[
											"warm natural earthy — Kodak Vision3 film, honest color, lifted blacks",
											"clean documentary neutral — accurate color, light organic grain",
											"golden hour amber — warm saturation, rich highlights, cinematic",
											"desaturated naturalistic — muted palette, documentary realism",
											"night fire glow — warm amber vs deep blue-black, high contrast",
										]}
									/>
								</Field>
							</div>
						)}

						{/* CRAFT TAB */}
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
								<Field label="🔍 Detail Focus (Close-up)">
									<Sel
										id="detail"
										value={sc.detailFocus}
										onChange={(v) =>
											updateScene(currentScene, { detailFocus: v })
										}
										options={[
											"hands gripping tool — skin texture, calluses, grip strength visible",
											"wood grain revealed as cut — annual rings, natural pattern exposed",
											"perfect joint fit — two pieces meeting exactly, satisfying lock",
											"stone surface texture — mineral pattern, ancient geological character",
											"clay being worked — fingers pressing, smooth surface emerging",
											"tool meeting material — first contact moment, decisive action",
											"completed element — just-finished piece, perfect in its simplicity",
										]}
									/>
								</Field>
								<Field label="📈 Progress Indication">
									<Sel
										id="progress"
										value={sc.progressNote}
										onChange={(v) =>
											updateScene(currentScene, { progressNote: v })
										}
										options={[
											"structure visibly grown since last scene — height and volume increased",
											"new section complete — wall, roof section, or floor now visible",
											"material pile reduced — resources consumed by work, satisfying depletion",
											"steady ongoing — continuous satisfying flow, no dramatic jump",
											"timelapse speed-up within scene — work visually accelerated then back",
										]}
									/>
								</Field>
								<Field label="✨ Satisfying Moment">
									<Sel
										id="satisfy"
										value={sc.satisfyMoment}
										onChange={(v) =>
											updateScene(currentScene, { satisfyMoment: v })
										}
										options={[
											"perfectly split log — two halves fall apart symmetrically, clean break",
											"stone slots exactly into position — satisfying fit, no adjustment needed",
											"roof section complete — shelter becomes real, weathertight achieved",
											"structure stands alone — builder steps back, it holds itself perfectly",
											"smooth surface achieved — rough becomes perfect under patient work",
											"fire lit inside — first smoke from first hearth, home begins",
											"first rain hits completed roof — water sheds perfectly, shelter proven",
										]}
									/>
								</Field>
							</div>
						)}

						{/* SOUND TAB */}
						{activeTab === "sound" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
								<Field label="🎵 Background Music">
									<Sel
										id="sound-bg"
										value={sc.soundBG}
										onChange={(v) => updateScene(currentScene, { soundBG: v })}
										options={[
											"no music at all — pure sound design only, maximally ASMR",
											"single sustained low drone — barely audible, felt more than heard",
											"wooden flute distant — simple pentatonic, natural timber tone",
											"sparse fingerpicked acoustic guitar — minimal and organic",
											"deep ambient pad — no melody, pure atmospheric texture",
										]}
									/>
								</Field>
							</div>
						)}

						{/* VISUAL TAB */}
						{activeTab === "visual" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Field label="☀️ Light Source">
									<Sel
										id="light-src"
										value={sc.lightSource}
										onChange={(v) =>
											updateScene(currentScene, { lightSource: v })
										}
										options={[
											"dappled forest light — moving patches through canopy, never static",
											"warm golden sunrise raking — low angle, every texture illuminated",
											"overcast diffused — soft shadowless, material colors pure and honest",
											"harsh midday shaft — one beam cuts through canopy to work area",
											"fire glow — warm flickering orange light on work and face",
											"blue-hour twilight — cool ambient, work winding down for the night",
											"moonlight and stars — cold silver light, night build or reflection scene",
										]}
									/>
								</Field>
								<Field label="💡 Light Effect">
									<Sel
										id="light-fx"
										value={sc.lightFX}
										onChange={(v) => updateScene(currentScene, { lightFX: v })}
										options={[
											"dust motes in light beam — golden particles floating in sunshaft",
											"lens flare through trees — organic momentary sun burst",
											"steam rising — hot earth or drying clay in direct sun",
											"shadows moving with wind — canopy movement creates dancing shadows",
											"fire sparks — embers rising from fire, constellation of dots",
											"rain in backlight — individual drops caught, each one a gem",
											"fog drifting through — mist rolling between tree trunks at ground",
										]}
									/>
								</Field>
								<Field label="🌈 Atmosphere">
									<Sel
										id="atmo"
										value={sc.atmosphere}
										onChange={(v) =>
											updateScene(currentScene, { atmosphere: v })
										}
										options={[
											"humid haze — slight diffusion, tropical density in air visible",
											"crystal clear — maximum visibility, sharp contrast, crisp cold air",
											"morning mist — low ground fog dissipating as work begins",
											"golden amber — late day, everything warm and soft",
											"stormy heavy — clouds building, air charged, pressure dropping",
											"winter white — cold blue-white air, breath visible as vapor",
											"after rain — washed clean air, surfaces wet, colors intensified",
										]}
									/>
								</Field>
								<Field label="🌱 Foreground Element">
									<Sel
										id="fg"
										value={sc.foreground}
										onChange={(v) =>
											updateScene(currentScene, { foreground: v })
										}
										options={[
											"large fern fronds — frame scene edges, move gently in breeze",
											"fallen moss-covered log — natural foreground frame element",
											"wildflowers — color accent, nature beauty contrasting with work",
											"wood shavings and chips — evidence of work littering the ground",
											"tools resting — axes leaning, brief pause between bursts of effort",
											"stream edge — water visible and audible in foreground",
											"nothing — clean negative space, structure and subject are everything",
										]}
									/>
								</Field>
							</div>
						)}

						{/* NATURE TAB */}
						{activeTab === "nature" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Field label="🐦 Wildlife">
									<Sel
										id="wildlife"
										value={sc.wildlife}
										onChange={(v) => updateScene(currentScene, { wildlife: v })}
										options={[
											"birds active in background — life and movement in forest canopy",
											"single bird lands near work — curious, unafraid, studies the human",
											"small mammal at forest edge — squirrel, rabbit, deer glimpsed briefly",
											"insects on materials — beetles exploring, ants investigating wood",
											"no wildlife visible — pure work focus, nature as backdrop only",
											"dog companion nearby — lies watching faithfully, occasional interaction",
										]}
									/>
								</Field>
								<Field label="🌦️ Weather">
									<Sel
										id="weather"
										value={sc.weather}
										onChange={(v) => updateScene(currentScene, { weather: v })}
										options={[
											"perfect calm — ideal conditions, gentle breeze only",
											"light steady rain — work continues through it, focused determination",
											"heavy dramatic rain — shelter needed, work pauses under eaves",
											"building clouds — weather approaching, urgency in pace",
											"after heavy rain — everything drenched, steam rising, fresh",
											"light snowfall — flakes falling gently, accumulating on surfaces",
											"winter snowstorm — challenging visibility, extreme survival mood",
										]}
									/>
								</Field>
							</div>
						)}

						{/* EMOTION TAB */}
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
										options={[
											"quiet joy — subtle, genuine, never over-performed",
											"deep relief — tension releasing, shoulders drop, peace returns",
											"tender care — gentle touch, slowed pace, full attention to living thing",
											"awe and wonder — stops and stares, nature overwhelms the person",
											"determination — setback faced, jaw set, work resumes stronger",
											"unexpected connection — eyes meeting with animal or human, pause",
											"pride and satisfaction — stepping back, looking at what was made",
										]}
									/>
								</Field>
								<Field label="🔊 Emotional Sound Shift">
									<Sel
										id="emo-sound"
										value={sc.emoSound ?? "natural ambient heightened"}
										onChange={(v) => updateScene(currentScene, { emoSound: v })}
										options={[
											"music swells softly — first music in entire video, quiet emotional uplift",
											"complete silence — all ambient drops, only the moment exists",
											"natural ambient heightened — birds louder, wind intimate, more alive",
											"sound continues unchanged — contrast between unchanged sound and deep emotion",
										]}
									/>
								</Field>
							</div>
						)}

						{/* Scene action buttons */}
						<div className="flex gap-2 flex-wrap mt-4">
							<button className="btn-primary" onClick={generatePrompt}>
								⚡ Generate Prompt
							</button>
							<button className="btn-amber" onClick={generateAll}>
								🎬 Generate Semua
							</button>
							<button className="btn-ghost" onClick={randomCurrentScene}>
								🎲 Random Scene
							</button>
							<button className="btn-ghost" onClick={autoInjectEmotions}>
								⭐ Auto-Inject Emotions
							</button>
							<button className="btn-ghost ml-auto" onClick={nextScene}>
								Next Scene →
							</button>
						</div>
					</section>
				)}

				{/* ── PROMPT OUTPUT ── */}
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
							<button className="btn-primary" onClick={generatePrompt}>
								⚡ Generate
							</button>
							<button className="btn-ghost" onClick={copyPrompt}>
								📋 Copy
							</button>
							<button className="btn-ghost" onClick={copyAll}>
								📋 Copy Semua
							</button>
							<button className="btn-ghost ml-auto" onClick={nextScene}>
								Next →
							</button>
						</div>
					</div>
				</section>

				{/* ── EXPORT ALL ── */}
				<section className="card mb-5">
					<div className="section-label">📤 Export Semua Prompt</div>
					<p className="font-mono text-[11px] text-stone2 mb-4 leading-relaxed">
						Generate semua{" "}
						<span className="text-leaf2 font-bold">{totalScenes}</span> prompt
						sekaligus. DNA terkunci = proyek konsisten di semua scene. Story arc
						dari Hook → Preparation → Journey → Build → Living → Closing
						Credits.
					</p>
					<div className="flex gap-2 flex-wrap mb-4">
						<button className="btn-primary" onClick={generateAll}>
							🎬 Generate Semua {totalScenes} Prompt
						</button>
						<button className="btn-ghost" onClick={copyAll}>
							📋 Copy Semua
						</button>
						<button
							className="btn-ghost"
							onClick={() => setShowAllPrompts((v) => !v)}
						>
							👁 {showAllPrompts ? "Sembunyikan" : "Lihat Semua"}
						</button>
					</div>
					{showAllPrompts && allPrompts.length > 0 && (
						<div className="space-y-3 max-h-150 overflow-y-auto">
							{allPrompts.map((p, i) => {
								const sc2 = scenes[i];
								return (
									<div
										key={i}
										className={`rounded-xl p-4 border-l-4 ${sc2?.isEmotional ? "border-amber bg-amber/5" : "border-moss2 bg-bark/30"} border border-leaf/10`}
									>
										<div className="font-mono text-[9px] text-leaf mb-2 uppercase tracking-wide">
											◆ Scene {i + 1}/{totalScenes} ·{" "}
											{sc2
												? PHASE_META[sc2.phase].emoji +
													" " +
													PHASE_META[sc2.phase].label
												: ""}
											{sc2?.isEmotional ? " · ⭐ EMOTIONAL" : ""}
										</div>
										<pre className="font-mono text-[9.5px] text-stone2 whitespace-pre-wrap wrap-break-word leading-relaxed">
											{p}
										</pre>
									</div>
								);
							})}
						</div>
					)}
				</section>

				{/* ── FOOTER ── */}
				<footer className="text-center pt-6 border-t border-leaf/15 font-mono text-[10px] text-stone leading-loose">
					<p>
						ASMR Survival Build ·{" "}
						<span className="text-leaf2">AI Video Prompt Generator</span>
					</p>
					<p>
						Formula:{" "}
						<span className="text-leaf2">
							HOOK + JOURNEY + BUILD + EMOTIONAL INJECTIONS + LIVING + CLOSING
						</span>
					</p>
					<p>Anti-CGI · Documentary Realism · Story-driven · ASMR Optimized</p>
					<p>
						<span className="text-leaf2">Grok · VEO</span> · Kling · Runway ·
						Pika · Luma · Hailuo · Sora
					</p>
				</footer>
			</div>

			{/* ── TOAST ── */}
			<div
				className={`toast-base bg-moss/95 text-white transition-all ${toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
			>
				{toast.msg}
			</div>
		</main>
	);
}
