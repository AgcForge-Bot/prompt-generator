"use client";

import type { ProjectDNA, ProjectDNATab } from "./types";
import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import {
	CLIMATE_OPTIONS,
	FILM_STYLE_OPTIONS,
	GENDER_OPTIONS,
	LOCATION_OPTIONS,
	SHELTER_OPTIONS,
	TRAVEL_MODE_OPTIONS,
	CHARACTER_AGE_OPTIONS,
	CHARACTER_FACE_MALE_OPTIONS,
	CHARACTER_FACE_FEMALE_OPTIONS,
	CHARACTER_HAIR_MALE_OPTIONS,
	CHARACTER_HAIR_FEMALE_OPTIONS,
	CHARACTER_BUILD_OPTIONS,
	CHARACTER_OUTFIT_MALE_OPTIONS,
	CHARACTER_OUTFIT_FEMALE_OPTIONS,
	SHELTER_DIMENSION_OPTIONS,
	VEHICLE_OPTIONS,
	SHELTER_EXTERIOR_OPTIONS,
	SHELTER_INTERIOR_OPTIONS,
} from "./utils";

export default function ProjectDnaSection({
	dna,
	dnaTab,
	setDnaTab,
	setDna,
	dnaLocked,
	totalScenes,
	onLock,
	onRandom,
}: {
	dna: ProjectDNA;
	setDna: React.Dispatch<React.SetStateAction<ProjectDNA>>;
	dnaTab: ProjectDNATab;
	setDnaTab: React.Dispatch<React.SetStateAction<ProjectDNATab>>;
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
				<span className="text-leaf2 font-bold">
					⚠ Dikunci untuk semua scene.
				</span>{" "}
				Isi <span className="text-amber2 font-bold">semua 4 tab</span> sebelum
				mengunci — terutama Character Anchor untuk memastikan wajah, kendaraan,
				dan shelter konsisten di setiap scene.
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

			<div className="flex gap-1 flex-wrap border-b border-leaf/15 pb-0 mb-4">
				{(
					[
						["identity", "🌍 Identity & Journey"],
						["character", "🧑 Character Anchor"],
						["vehicle", "🚗 Vehicle Anchor"],
						["shelter", "🏠 Shelter Anchor"],
					] as const
				).map(([tab, label]) => (
					<button
						key={tab}
						className={`tab-btn ${dnaTab === tab ? "active" : ""}`}
						onClick={() => setDnaTab(tab)}
					>
						{label}
					</button>
				))}
			</div>

			{dnaTab === "identity" && (
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
			)}
			{dnaTab === "character" && (
				<div>
					<div className="bg-amber/10 border border-amber/25 rounded-xl p-3 mb-4 font-mono text-[10px] text-amber2 leading-relaxed">
						🎯 <span className="font-bold">Character Anchor</span> — Deskripsi
						fisik ini akan disertakan di SETIAP prompt secara eksplisit untuk
						memastikan wajah, rambut, pakaian, dan postur karakter tidak berubah
						antar scene.
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="🎂 Tampilan Usia">
							<Sel
								id="char-age"
								value={dna.characterAge}
								onChange={(v) => setDna((d) => ({ ...d, characterAge: v }))}
								options={CHARACTER_AGE_OPTIONS}
							/>
						</Field>
						<Field label="👤 Struktur Wajah (Pilih sesuai gender)">
							<Sel
								id="char-face"
								value={dna.characterFace}
								onChange={(v) => setDna((d) => ({ ...d, characterFace: v }))}
								options={
									dna.modelGender === "male"
										? CHARACTER_FACE_MALE_OPTIONS
										: CHARACTER_FACE_FEMALE_OPTIONS
								}
							/>
						</Field>
						<Field label="💇 Rambut">
							<Sel
								id="char-hair"
								value={dna.characterHair}
								onChange={(v) => setDna((d) => ({ ...d, characterHair: v }))}
								options={
									dna.modelGender === "male"
										? CHARACTER_HAIR_MALE_OPTIONS
										: CHARACTER_HAIR_FEMALE_OPTIONS
								}
							/>
						</Field>
						<Field label="💪 Postur & Bentuk Tubuh">
							<Sel
								id="char-build"
								value={dna.characterBuild}
								onChange={(v) => setDna((d) => ({ ...d, characterBuild: v }))}
								options={CHARACTER_BUILD_OPTIONS}
							/>
						</Field>
						<Field label="👕 Outfit Lengkap (Tidak Berubah)">
							<Sel
								id="char-outfit"
								value={dna.characterOutfit}
								onChange={(v) => setDna((d) => ({ ...d, characterOutfit: v }))}
								options={
									dna.modelGender === "male"
										? CHARACTER_OUTFIT_MALE_OPTIONS
										: CHARACTER_OUTFIT_FEMALE_OPTIONS
								}
							/>
						</Field>
						<Field label="🎒 Gear yang Selalu Dibawa">
							<Sel
								id="char-gear"
								value={dna.characterGear}
								onChange={(v) => setDna((d) => ({ ...d, characterGear: v }))}
								options={[
									{
										value:
											"65L olive green backpack with external frame — axe strapped to side, rope coiled on top, canvas roll with tools visible",
										label:
											"🎒 Ransel 65L hijau olive + kapak + tali + tool roll",
									},
									{
										value:
											"70L dark grey technical pack — ice axe, trekking poles, snowshoes strapped outside",
										label:
											"🎒 Ransel 70L abu teknis + kapak es + trekking pole",
									},
									{
										value:
											"vintage leather-strap canvas rucksack 50L — hand tools in canvas roll strapped on top, rope at side",
										label: "🎒 Ransel kanvas vintage 50L + tool roll + tali",
									},
									{
										value:
											"black military-style 60L pack — hatchet on belt separately, small satchel on chest, waterproof dry bags visible",
										label:
											"🎒 Ransel militer 60L hitam + kapak di sabuk + satchel",
									},
								]}
							/>
						</Field>
					</div>

					{/* Preview */}
					<div className="mt-4 p-3 rounded-xl bg-bark/50 border border-leaf/10">
						<div className="font-mono text-[9px] text-stone2 uppercase tracking-widest mb-2">
							Preview Character Anchor (masuk ke setiap prompt):
						</div>
						<div className="font-mono text-[9px] text-sand leading-relaxed">
							<span className="text-leaf2">Age:</span> {dna.characterAge}
							<br />
							<span className="text-leaf2">Face:</span> {dna.characterFace}
							<br />
							<span className="text-leaf2">Hair:</span> {dna.characterHair}
							<br />
							<span className="text-leaf2">Build:</span> {dna.characterBuild}
							<br />
							<span className="text-leaf2">Outfit:</span> {dna.characterOutfit}
							<br />
							<span className="text-leaf2">Gear:</span> {dna.characterGear}
						</div>
					</div>
				</div>
			)}
			{dnaTab === "vehicle" && (
				<div>
					{dna.travelMode === "foot" ? (
						<div className="bg-moss/20 border border-leaf/20 rounded-xl p-4 text-center font-mono text-[11px] text-sand">
							🥾 Mode perjalanan:{" "}
							<span className="text-leaf2 font-bold">Jalan Kaki</span>
							<br />
							Tidak ada kendaraan. Ganti ke tab <em>Identity & Journey</em> dan
							pilih mode kendaraan untuk mengaktifkan Vehicle Anchor.
						</div>
					) : (
						<div>
							<div className="bg-amber/10 border border-amber/25 rounded-xl p-3 mb-4 font-mono text-[10px] text-amber2 leading-relaxed">
								🚗 <span className="font-bold">Vehicle Anchor</span> —
								Spesifikasi kendaraan ini akan disertakan di setiap prompt saat
								kendaraan muncul, memastikan merk, model, dan warna tidak
								berubah. Mode terpilih:{" "}
								<span className="text-cream font-bold">
									{
										TRAVEL_MODE_OPTIONS.find((o) => o.value === dna.travelMode)
											?.label
									}
								</span>
							</div>
							<Field
								label={`🚗 Pilih Spesifikasi ${TRAVEL_MODE_OPTIONS.find((o) => o.value === dna.travelMode)?.label}`}
							>
								<Sel
									id="vehicle-desc"
									value={dna.vehicleDesc}
									onChange={(v) => setDna((d) => ({ ...d, vehicleDesc: v }))}
									options={
										VEHICLE_OPTIONS[dna.travelMode] ?? [
											{ value: "N/A", label: "N/A" },
										]
									}
								/>
							</Field>
							<div className="mt-4 p-3 rounded-xl bg-bark/50 border border-leaf/10">
								<div className="font-mono text-[9px] text-stone2 uppercase tracking-widest mb-2">
									Preview Vehicle Anchor:
								</div>
								<div className="font-mono text-[9px] text-sand leading-relaxed">
									{dna.vehicleDesc}
								</div>
							</div>
						</div>
					)}
				</div>
			)}
			{dnaTab === "shelter" && (
				<div>
					<div className="bg-amber/10 border border-amber/25 rounded-xl p-3 mb-4 font-mono text-[10px] text-amber2 leading-relaxed">
						🏠 <span className="font-bold">Shelter Anchor</span> — Dimensi,
						tampilan luar, dan interior shelter dikunci secara spesifik. Setiap
						prompt juga menyertakan status progress pembangunan otomatis sesuai
						posisi scene.
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Field label="📐 Ukuran & Dimensi Shelter">
							<Sel
								id="shelter-dim"
								value={dna.shelterDimension}
								onChange={(v) => setDna((d) => ({ ...d, shelterDimension: v }))}
								options={SHELTER_DIMENSION_OPTIONS}
							/>
						</Field>
						<Field label="🏚️ Tampak Luar (Exterior)">
							<Sel
								id="shelter-ext"
								value={dna.shelterExterior}
								onChange={(v) => setDna((d) => ({ ...d, shelterExterior: v }))}
								options={SHELTER_EXTERIOR_OPTIONS}
							/>
						</Field>
						<Field label="🛋️ Interior Layout">
							<Sel
								id="shelter-int"
								value={dna.shelterInterior}
								onChange={(v) => setDna((d) => ({ ...d, shelterInterior: v }))}
								options={SHELTER_INTERIOR_OPTIONS}
							/>
						</Field>
					</div>
					<div className="mt-4 p-3 rounded-xl bg-bark/50 border border-leaf/10">
						<div className="font-mono text-[9px] text-stone2 uppercase tracking-widest mb-2">
							Preview Shelter Anchor:
						</div>
						<div className="font-mono text-[9px] text-sand leading-relaxed">
							<span className="text-leaf2">Type:</span>{" "}
							{dna.shelterType.split("—")[0].trim()}
							<br />
							<span className="text-leaf2">Dimension:</span>{" "}
							{dna.shelterDimension}
							<br />
							<span className="text-leaf2">Exterior:</span>{" "}
							{dna.shelterExterior}
							<br />
							<span className="text-leaf2">Interior:</span>{" "}
							{dna.shelterInterior}
							<br />
							<span className="text-amber2">Progress:</span> Auto-calculated per
							scene (0% → 100%)
						</div>
					</div>
				</div>
			)}

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
