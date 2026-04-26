"use client";

export default function SectionCard({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<section className="card mb-5">
			<div className="section-label">{label}</div>
			{children}
		</section>
	);
}
