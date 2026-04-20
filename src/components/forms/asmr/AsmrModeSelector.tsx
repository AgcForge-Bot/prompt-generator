"use client";

export type AsmrModeKey = "manual" | "ai";

type Props = {
	selected: AsmrModeKey;
	onChange: (mode: AsmrModeKey) => void;
};

const MODES: {
	key: AsmrModeKey;
	label: string;
	subtitle: string;
	emoji: string;
	desc: string;
	tags: string[];
	borderActive: string;
	bgActive: string;
	textActive: string;
	badgeColor: string;
}[] = [
	{
		key: "manual",
		label: "Manual Configure",
		subtitle: "Mode 1 — Konfigurasi Per Scene",
		emoji: "🎛️",
		desc: "Atur setiap tab (timelapse, equipment, narasi, lighting, ASMR, kamera) per scene secara manual. Cocok untuk kontrol detail penuh.",
		tags: [
			"Kontrol Penuh",
			"Per-Scene Config",
			"Randomizer",
			"Tab Konfigurasi",
		],
		borderActive: "border-leaf",
		bgActive: "bg-moss/25",
		textActive: "text-leaf2",
		badgeColor: "bg-leaf/10 border-leaf/30 text-leaf2",
	},
	{
		key: "ai",
		label: "AI Advanced Mode",
		subtitle: "Mode 2 — Full AI Generate",
		emoji: "🤖",
		desc: 'Setup DNA satu kali, AI generate semua scene. Setiap scene otomatis dapat instruksi "Continuing from scene N..." — konsisten dari awal sampai akhir video.',
		tags: [
			"Full AI Generate",
			"Konsistensi Terjamin",
			"SEO Pack",
			"Continuing from scene...",
		],
		borderActive: "border-amber/60",
		bgActive: "bg-amber/10",
		textActive: "text-amber2",
		badgeColor: "bg-amber/10 border-amber/30 text-amber2",
	},
];

export default function AsmrModeSelector({ selected, onChange }: Props) {
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
								{/* Radio dot */}
								<span
									className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
										isActive
											? `border-current ${mode.textActive}`
											: "border-leaf/25"
									}`}
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
										className={`font-mono text-[8px] px-2 py-0.5 rounded-full border ${
											isActive
												? mode.badgeColor
												: "bg-bark/30 border-leaf/10 text-stone2"
										}`}
									>
										{tag}
									</span>
								))}
							</div>
						</button>
					);
				})}
			</div>

			{/* Info Mode 2 kalau dipilih */}
			{selected === "ai" && (
				<div className="mt-3 rounded-xl bg-amber/8 border border-amber/20 px-4 py-3">
					<div className="font-mono text-[9px] text-amber2 leading-relaxed">
						💡 <strong>Mode AI</strong> memastikan setiap scene mendapat
						instruksi
						<code className="mx-1 px-1 py-0.5 rounded bg-bark/40 text-[8px]">
							&quot;Continuing from scene N — [deskripsi scene
							sebelumnya]...&quot;
						</code>
						sehingga AI video generator bisa menjaga konsistensi visual dari
						scene ke scene berikutnya.
					</div>
				</div>
			)}
		</section>
	);
}
