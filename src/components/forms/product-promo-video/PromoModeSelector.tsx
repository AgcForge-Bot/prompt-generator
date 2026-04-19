"use client";

export type PromoVideoMode = "standard" | "drama-thailand";

type Props = {
	selected: PromoVideoMode;
	onChange: (mode: PromoVideoMode) => void;
};

const MODES: {
	key: PromoVideoMode;
	label: string;
	subtitle: string;
	emoji: string;
	desc: string;
	tags: string[];
	accentColor: string;
	borderActive: string;
	bgActive: string;
	textActive: string;
}[] = [
	{
		key: "standard",
		label: "Standard Promo",
		subtitle: "Mode 1 — Review & Feature",
		emoji: "🛍️",
		desc: "Video promosi produk standar: review produk, tampilkan fitur & keunggulan, call to action. Support review-only, single model, atau multi model.",
		tags: ["Review Produk", "Feature Demo", "Model Presenter", "CTA Langsung"],
		accentColor: "var(--leaf2)",
		borderActive: "border-leaf",
		bgActive: "bg-moss/25",
		textActive: "text-leaf2",
	},
	{
		key: "drama-thailand",
		label: "Drama Ad — Gimmick Mode",
		subtitle: "Mode 2 — Thailand-Style Film Pendek",
		emoji: "🇹🇭",
		desc: 'Film pendek iklan bergaya Thailand — slice of life dramatis yang di-hiperbola, eskalasi absurd, lalu plot twist produk sebagai solusi. Formula "tertipu tapi terhibur".',
		tags: [
			"Slice of Life",
			"Sinetron Drama",
			"Gimmick Absurd",
			"Plot Twist Produk",
			"Full AI Generate",
		],
		accentColor: "var(--amber2)",
		borderActive: "border-amber/60",
		bgActive: "bg-amber/10",
		textActive: "text-amber2",
	},
];

export default function PromoModeSelector({ selected, onChange }: Props) {
	return (
		<section className="card mb-6">
			<div className="section-label">🎬 Pilih Gaya Video Iklan</div>
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
									<span
										className="text-3xl"
										role="img"
										aria-label={mode.emoji}
										style={{ fontSize: "2em" }}
									>
										{mode.emoji}
									</span>
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
								{/* Radio indicator */}
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
												? `${mode.bgActive} ${mode.borderActive} ${mode.textActive}`
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
		</section>
	);
}
