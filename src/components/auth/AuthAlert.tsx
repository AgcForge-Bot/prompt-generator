"use client";

export default function AuthAlert({
	type,
	message,
}: {
	type: "success" | "error";
	message: string;
}) {
	if (!message) return null;

	const s =
		type === "success"
			? {
					wrapper: "bg-leaf/10 border border-leaf/30",
					icon: "✅",
					text: "text-leaf2",
				}
			: {
					wrapper: "bg-red-950/30 border border-red-500/40",
					icon: "⚠",
					text: "text-red-400",
				};

	return (
		<div
			className={`flex items-start gap-2.5 rounded-xl px-4 py-3 ${s.wrapper}`}
		>
			<span className="text-sm shrink-0 mt-0.5">{s.icon}</span>
			<p className={`font-mono text-[11px] leading-relaxed ${s.text}`}>
				{message}
			</p>
		</div>
	);
}
