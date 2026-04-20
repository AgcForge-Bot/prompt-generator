"use client";
// FILE: RelaxingModeSelector.tsx

export type RelaxingModeKey = "manual" | "ai";

type Props = {
	selected: RelaxingModeKey;
	onChange: (mode: RelaxingModeKey) => void;
};

export default function RelaxingModeSelector({ selected, onChange }: Props) {
	const MODES = [
		{
			key: "manual" as const,
			label: "Manual Configure",
			subtitle: "Mode 1 — Konfigurasi Per Scene",
			emoji: "🎛️",
			desc: "Atur setiap tab (Nature, Location, Animals, Visuals, Lighting, Drone, Elements, Style) per scene secara manual dengan randomizer.",
			tags: [
				"Kontrol Penuh",
				"Per-Scene Config",
				"Randomizer",
				"Tab Konfigurasi",
			],
			borderActive: "border-leaf",
			bgActive: "bg-moss/25",
			textActive: "text-leaf2",
		},
		{
			key: "ai" as const,
			label: "AI Location Explorer",
			subtitle: "Mode 2 — Full AI Generate",
			emoji: "🤖",
			desc: 'Pilih kategori lokasi (hutan, pegunungan, pantai, dll). AI otomatis explore semua detail visual per scene dengan instruksi "Continuing from scene N..." untuk konsistensi sempurna.',
			tags: [
				"25 Kategori Lokasi Dunia",
				"AI Explore Visual",
				"Continuing from scene...",
				"SEO Pack",
			],
			borderActive: "border-leaf",
			bgActive: "bg-leaf/12",
			textActive: "text-leaf2",
		},
	];

	return (
		<section className="card mb-6">
			<div className="section-label">🎬 Pilih Mode Generate</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{MODES.map((mode) => {
					const isActive = selected === mode.key;
					return (
						<button
							key={mode.key}
							type="button"
							onClick={() => onChange(mode.key)}
							className={`rounded-xl border p-4 text-left transition-all cursor-pointer active:scale-95 ${
								isActive
									? `${mode.borderActive} ${mode.bgActive}`
									: "border-leaf/15 bg-bark/25 hover:border-leaf/35 hover:bg-bark/35"
							}`}
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-2.5">
									<span className="text-3xl">{mode.emoji}</span>
									<div>
										<div
											className={`font-playfair text-sm font-bold leading-tight ${isActive ? mode.textActive : "text-cream"}`}
										>
											{mode.label}
										</div>
										<div className="font-mono text-[9px] text-stone2 mt-0.5">
											{mode.subtitle}
										</div>
									</div>
								</div>
								<span
									className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${isActive ? `border-current ${mode.textActive}` : "border-leaf/25"}`}
								>
									<span
										className={`w-2 h-2 rounded-full transition-all ${isActive ? "bg-current" : "bg-transparent"}`}
									/>
								</span>
							</div>
							<div className="font-mono text-[9px] text-stone2 leading-relaxed mb-3">
								{mode.desc}
							</div>
							<div className="flex flex-wrap gap-1">
								{mode.tags.map((tag) => (
									<span
										key={tag}
										className={`font-mono text-[8px] px-2 py-0.5 rounded-full border ${isActive ? `${mode.bgActive} ${mode.borderActive} ${mode.textActive}` : "bg-bark/30 border-leaf/10 text-stone2"}`}
									>
										{tag}
									</span>
								))}
							</div>
						</button>
					);
				})}
			</div>
			{selected === "ai" && (
				<div className="mt-3 rounded-xl bg-leaf/8 border border-leaf/20 px-4 py-3">
					<div className="font-mono text-[9px] text-leaf2 leading-relaxed">
						🌍 Mode AI menyediakan <strong>25 kategori lokasi</strong> dari
						seluruh dunia — hutan tropis, alpin, arktik, danau, pantai, bawah
						laut, musim gugur, dan lainnya. AI akan generate visual detail yang
						kaya untuk setiap scene.
					</div>
				</div>
			)}
		</section>
	);
}
