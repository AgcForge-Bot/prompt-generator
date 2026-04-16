"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { DNA_OPTIONS } from "../constants";
import type { AsmrTimelapseGenerator } from "../types";

export default function ProjectDnaSection({ gen }: { gen: AsmrTimelapseGenerator }) {
	return (
		<section className="card mb-5">
			<div className="section-label">🧬 Project DNA — Master Configuration</div>
			<div className="font-mono text-[10px] text-stone2 leading-relaxed mb-3">
				DNA mengunci identitas proyek agar konsisten di semua scene.
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<Field label="🏠 Jenis Bangunan / Objek">
					<Sel
						id="dna-building"
						value={gen.dna.building}
						onChange={(v) => gen.setDna((p) => ({ ...p, building: v }))}
						options={DNA_OPTIONS.building.map((o) => ({
							value: o.value,
							label: o.label,
						}))}
					/>
				</Field>
				<Field label="📍 Setting Lokasi Utama">
					<Sel
						id="dna-location"
						value={gen.dna.location}
						onChange={(v) => gen.setDna((p) => ({ ...p, location: v }))}
						options={DNA_OPTIONS.location.map((o) => ({
							value: o.value,
							label: o.label,
						}))}
					/>
				</Field>
				<Field label="🌡️ Iklim & Musim Proyek">
					<Sel
						id="dna-climate"
						value={gen.dna.climate}
						onChange={(v) => gen.setDna((p) => ({ ...p, climate: v }))}
						options={DNA_OPTIONS.climate.map((o) => ({
							value: o.value,
							label: o.label,
						}))}
					/>
				</Field>
				<Field label="🧱 Material Utama (Konsisten)">
					<Sel
						id="dna-material"
						value={gen.dna.material}
						onChange={(v) => gen.setDna((p) => ({ ...p, material: v }))}
						options={DNA_OPTIONS.material.map((o) => ({
							value: o.value,
							label: o.label,
						}))}
					/>
				</Field>
				<Field label="🎨 Palet Warna Visual Proyek">
					<Sel
						id="dna-palette"
						value={gen.dna.palette}
						onChange={(v) => gen.setDna((p) => ({ ...p, palette: v }))}
						options={DNA_OPTIONS.palette.map((o) => ({
							value: o.value,
							label: o.label,
						}))}
					/>
				</Field>
				<Field label="👷 Tim Pekerja (Konsisten)">
					<Sel
						id="dna-team"
						value={gen.dna.team}
						onChange={(v) => gen.setDna((p) => ({ ...p, team: v }))}
						options={DNA_OPTIONS.team.map((o) => ({
							value: o.value,
							label: o.label,
						}))}
					/>
				</Field>
			</div>

			{gen.dnaPreviewOpen && (
				<div className="mt-3 rounded-lg border border-leaf/15 bg-bark/30 p-3 font-mono text-[10px] text-stone2 leading-relaxed">
					<div>
						<span className="text-leaf2 font-bold">BANGUNAN:</span>{" "}
						{gen.dna.building}
					</div>
					<div>
						<span className="text-leaf2 font-bold">LOKASI:</span>{" "}
						{gen.dna.location}
					</div>
					<div>
						<span className="text-leaf2 font-bold">IKLIM:</span> {gen.dna.climate}
					</div>
					<div>
						<span className="text-leaf2 font-bold">MATERIAL:</span>{" "}
						{gen.dna.material}
					</div>
					<div>
						<span className="text-leaf2 font-bold">PALET:</span> {gen.dna.palette}
					</div>
					<div>
						<span className="text-leaf2 font-bold">TIM:</span> {gen.dna.team}
					</div>
				</div>
			)}

			<div className="flex flex-wrap gap-2 mt-4">
				<button type="button" className="btn-primary" onClick={gen.lockDNA}>
					🔒 Kunci Project DNA
				</button>
				<button type="button" className="btn-outline" onClick={gen.randomizeDNA}>
					🎲 Random DNA
				</button>
				<button
					type="button"
					className="btn-ghost"
					onClick={() => gen.setDnaPreviewOpen((v) => !v)}
				>
					👁 Preview DNA
				</button>
			</div>
		</section>
	);
}

