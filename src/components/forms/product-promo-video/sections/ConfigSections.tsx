"use client";

import type {
	PromoDNA,
	NarrationToneKey,
	VoiceStyleKey,
	LocationKey,
	AspectRatioKey,
} from "../types";
import {
	NARRATION_TONES,
	VOICE_STYLES,
	LOCATIONS,
	CINEMATIC_STYLES,
	LIGHTING_STYLES,
	TOTAL_DURATION_OPTIONS,
	SEC_PER_SCENE_OPTIONS,
	CTA_PRESETS,
} from "../constants";

// ─── NARRATION SECTION ────────────────────────────────────────────────────────

export function NarrationSection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	const toneKeys = Object.keys(NARRATION_TONES) as NarrationToneKey[];
	const voiceKeys = Object.keys(VOICE_STYLES) as VoiceStyleKey[];

	return (
		<section className="card mb-5">
			<div className="section-label">🎤 Narasi & Suara</div>

			{/* Tone */}
			<div className="mb-4">
				<label className="field-label">Nada / Tone Narasi</label>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
					{toneKeys.map((key) => {
						const tone = NARRATION_TONES[key];
						const isActive = dna.narrationTone === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setDna({ narrationTone: key })}
								className={`rounded-lg border px-2 py-2 text-center transition-all ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/35 hover:bg-moss/10"
								}`}
							>
								<div className="text-lg">{tone.emoji}</div>
								<div
									className={`font-mono text-[9px] mt-0.5 leading-tight ${isActive ? "text-leaf2" : "text-stone2"}`}
								>
									{tone.label}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Voice Style */}
			<div className="mb-4">
				<label className="field-label">Gaya Penyampaian Suara</label>
				<div className="flex flex-col gap-2">
					{voiceKeys.map((key) => {
						const voice = VOICE_STYLES[key];
						const isActive = dna.voiceStyle === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setDna({ voiceStyle: key })}
								className={`w-full rounded-lg border px-3 py-2 text-left transition-all flex items-center gap-3 ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/35"
								}`}
							>
								<span className="text-lg">{voice.emoji}</span>
								<div>
									<div
										className={`font-mono text-[10px] font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
									>
										{voice.label}
									</div>
									<div className="font-mono text-[9px] text-stone2">
										{voice.description}
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Catatan Narasi */}
			<div>
				<label className="field-label">Catatan Khusus Narasi (opsional)</label>
				<textarea
					className="forest-input resize-none min-h-15"
					placeholder='Contoh: "Sertakan kata-kata Bahasa Sunda sesekali", "Fokus pada harga terjangkau", "Nada yang relate dengan ibu rumah tangga"'
					value={dna.customNarrationNote}
					onChange={(e) => setDna({ customNarrationNote: e.target.value })}
				/>
			</div>

			<div className="mt-3 px-3 py-2 rounded-lg bg-forest/40 border border-leaf/10 font-mono text-[9px] text-stone2">
				🇮🇩 Semua narasi dan dialog{" "}
				<span className="text-leaf2 font-bold">
					wajib menggunakan Bahasa Indonesia
				</span>{" "}
				yang jelas dan mudah dipahami oleh target audience.
			</div>
		</section>
	);
}

// ─── LOCATION SECTION ─────────────────────────────────────────────────────────

export function LocationSection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	const locKeys = Object.keys(LOCATIONS) as LocationKey[];

	return (
		<section className="card mb-5">
			<div className="section-label">📍 Lokasi & Sinematografi</div>

			{/* Location */}
			<div className="mb-4">
				<label className="field-label">Pilihan Tempat</label>
				<div className="grid grid-cols-2 gap-2 mb-2">
					{locKeys.map((key) => {
						const loc = LOCATIONS[key];
						const isActive = dna.location === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setDna({ location: key })}
								className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
									isActive
										? "border-leaf bg-moss/25"
										: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
								}`}
							>
								<div className="text-xl mb-0.5">{loc.emoji}</div>
								<div
									className={`font-playfair text-xs font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
								>
									{loc.label}
								</div>
							</button>
						);
					})}
				</div>
				<input
					className="forest-input"
					placeholder={`Detail lokasi: ${LOCATIONS[dna.location].detail}`}
					value={dna.locationDetail}
					onChange={(e) => setDna({ locationDetail: e.target.value })}
				/>
			</div>

			{/* Cinematic Style */}
			<div className="mb-3">
				<label className="field-label">🎨 Gaya Sinematik</label>
				<select
					className="forest-select"
					value={dna.cinematicStyle}
					onChange={(e) => setDna({ cinematicStyle: e.target.value })}
				>
					{CINEMATIC_STYLES.map((s) => (
						<option key={s.value} value={s.value}>
							{s.label}
						</option>
					))}
				</select>
			</div>

			{/* Lighting */}
			<div>
				<label className="field-label">💡 Pencahayaan</label>
				<select
					className="forest-select"
					value={dna.lightingStyle}
					onChange={(e) => setDna({ lightingStyle: e.target.value })}
				>
					{LIGHTING_STYLES.map((l) => (
						<option key={l.value} value={l.value}>
							{l.label}
						</option>
					))}
				</select>
			</div>
		</section>
	);
}

// ─── DURATION SECTION ─────────────────────────────────────────────────────────

export function DurationSection({
	dna,
	setDna,
	rebuildScenes,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
	rebuildScenes: () => void;
}) {
	function handleDurationChange(totalSec: number, secPerScene: number) {
		const totalScenes = Math.max(2, Math.floor(totalSec / secPerScene));
		setDna({ totalDurationSec: totalSec, secPerScene, totalScenes });
		rebuildScenes();
	}

	return (
		<section className="card mb-5">
			<div className="section-label">⏱️ Durasi & Scene</div>

			{/* Total duration */}
			<div className="mb-4">
				<label className="field-label">Total Durasi Video</label>
				<div className="flex flex-wrap gap-2">
					{TOTAL_DURATION_OPTIONS.map((sec) => {
						const isActive = dna.totalDurationSec === sec;
						return (
							<button
								key={sec}
								type="button"
								onClick={() => handleDurationChange(sec, dna.secPerScene)}
								className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
									isActive
										? "border-leaf bg-moss/30 text-leaf2 font-bold"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/35 hover:text-cream"
								}`}
							>
								{sec} detik
							</button>
						);
					})}
				</div>
			</div>

			{/* Sec per scene */}
			<div className="mb-4">
				<label className="field-label">Durasi Per Scene (per prompt AI)</label>
				<div className="flex gap-2">
					{SEC_PER_SCENE_OPTIONS.map((sec) => {
						const isActive = dna.secPerScene === sec;
						return (
							<button
								key={sec}
								type="button"
								onClick={() => handleDurationChange(dna.totalDurationSec, sec)}
								className={`flex-1 rounded-lg border py-2 font-mono text-xs transition-all ${
									isActive
										? "border-amber/60 bg-amber/15 text-amber2 font-bold"
										: "border-leaf/15 bg-bark/25 text-stone2 hover:border-leaf/35 hover:text-cream"
								}`}
							>
								{sec} detik / scene
							</button>
						);
					})}
				</div>
			</div>

			{/* Result */}
			<div className="flex gap-3 rounded-xl bg-forest/50 border border-leaf/20 p-4">
				{[
					["Total Durasi", `${dna.totalDurationSec} detik`],
					["Per Scene", `${dna.secPerScene} detik`],
					["Total Scene", `${dna.totalScenes} prompt`],
				].map(([label, value]) => (
					<div key={label} className="flex-1 text-center">
						<div className="font-mono text-[8px] text-stone2 uppercase tracking-wider">
							{label}
						</div>
						<div className="font-playfair text-xl text-leaf2 font-bold">
							{value}
						</div>
					</div>
				))}
			</div>

			<div className="mt-2 font-mono text-[9px] text-stone2">
				Kalkulasi: {dna.totalDurationSec} ÷ {dna.secPerScene} ={" "}
				{dna.totalScenes} scene prompt
				{dna.enableProblemSolution ? " (termasuk 1 scene masalah di awal)" : ""}
				{" (termasuk 1 scene CTA di akhir)"}
			</div>
		</section>
	);
}

// ─── ASPECT RATIO SECTION ─────────────────────────────────────────────────────

export function AspectRatioSection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	const ratios: {
		value: AspectRatioKey;
		label: string;
		emoji: string;
		desc: string;
	}[] = [
		{
			value: "9:16",
			label: "9:16 Vertikal",
			emoji: "📱",
			desc: "TikTok · Instagram Reels · YouTube Shorts",
		},
		{
			value: "16:9",
			label: "16:9 Horizontal",
			emoji: "🖥️",
			desc: "YouTube · Facebook · Website",
		},
	];

	return (
		<section className="card mb-5">
			<div className="section-label">📐 Ukuran & Format Video</div>
			<div className="grid grid-cols-2 gap-3">
				{ratios.map((r) => {
					const isActive = dna.aspectRatio === r.value;
					return (
						<button
							key={r.value}
							type="button"
							onClick={() => setDna({ aspectRatio: r.value })}
							className={`rounded-xl border p-4 text-center transition-all ${
								isActive
									? "border-leaf bg-moss/25"
									: "border-leaf/15 bg-bark/25 hover:border-leaf/40 hover:bg-moss/10"
							}`}
						>
							<div className="text-3xl mb-2">{r.emoji}</div>
							<div
								className={`font-playfair text-sm font-bold ${isActive ? "text-leaf2" : "text-cream"}`}
							>
								{r.label}
							</div>
							<div className="font-mono text-[9px] text-stone2 mt-1">
								{r.desc}
							</div>
						</button>
					);
				})}
			</div>
		</section>
	);
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────

export function CTASection({
	dna,
	setDna,
}: {
	dna: PromoDNA;
	setDna: (u: Partial<PromoDNA>) => void;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">🛒 Call to Action (CTA)</div>

			<div className="mb-3">
				<label className="field-label">Teks CTA Akhir Video</label>
				<textarea
					className="forest-input resize-none min-h-20"
					placeholder="Tuliskan ajakan pembelian yang menarik dalam Bahasa Indonesia..."
					value={dna.ctaText}
					onChange={(e) => setDna({ ctaText: e.target.value, ctaCustom: true })}
				/>
			</div>

			<div>
				<label className="field-label">🎯 Pilih Template CTA Cepat</label>
				<div className="flex flex-col gap-1.5">
					{CTA_PRESETS.map((preset, i) => (
						<button
							key={i}
							type="button"
							onClick={() => setDna({ ctaText: preset, ctaCustom: false })}
							className={`w-full text-left rounded-lg border px-3 py-2 font-mono text-[10px] transition-all leading-relaxed ${
								dna.ctaText === preset && !dna.ctaCustom
									? "border-amber/50 bg-amber/12 text-amber2"
									: "border-leaf/12 bg-bark/20 text-stone2 hover:border-leaf/30 hover:text-cream"
							}`}
						>
							{preset}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}
