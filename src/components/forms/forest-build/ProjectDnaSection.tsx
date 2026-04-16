"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import {
	CLIMATE_OPTIONS,
	FILM_STYLE_OPTIONS,
	GENDER_OPTIONS,
	LOCATION_OPTIONS,
	SHELTER_OPTIONS,
	TRAVEL_MODE_OPTIONS,
} from "@/lib/data";

export default function ProjectDnaSection({
	dna,
	setDna,
	dnaLocked,
	totalScenes,
	onLock,
	onRandom,
}: {
	dna: ProjectDNA;
	setDna: React.Dispatch<React.SetStateAction<ProjectDNA>>;
	dnaLocked: boolean;
	totalScenes: number;
	onLock: () => void;
	onRandom: () => void;
}) {
	return (
		<section className="card mb-5 relative overflow-hidden">
			<div className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.15em] text-leaf/25 font-bold">
				🧬 DNA
			</div>
			<div className="section-label">🧬 Project DNA — Master Config</div>
			<div className="bg-leaf/10 border border-leaf/20 rounded-xl p-3 mb-4 font-mono text-[11px] text-sand leading-relaxed">
				<span className="text-leaf2 font-bold">⚠ Dikunci untuk semua scene.</span>{" "}
				Lokasi, model, shelter, dan material TIDAK berubah antar scene. Ini yang
				memastikan video sinkron dan konsisten seperti film dokumenter.
			</div>

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
				<button className="btn-primary" onClick={onLock}>
					🔒 Kunci DNA & Mulai
				</button>
				<button className="btn-outline" onClick={onRandom}>
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
	);
}

