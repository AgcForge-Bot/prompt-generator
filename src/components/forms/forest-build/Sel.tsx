"use client";

export default function Sel({
	id,
	value,
	onChange,
	options,
	disabled,
}: {
	id: string;
	value: string;
	onChange: (v: string) => void;
	options: string[] | { value: string; label: string }[];
	disabled?: boolean;
}) {
	return (
		<select
			id={id}
			className="forest-select"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
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
