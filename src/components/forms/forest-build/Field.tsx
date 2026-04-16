"use client";

export default function Field({
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

