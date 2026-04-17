"use client";

import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	icon?: string;
}

export default function AuthInput({ label, error, icon, className, ...props }: AuthInputProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone2">
				{icon && <span className="mr-1">{icon}</span>}
				{label}
			</label>
			<input
				{...props}
				className={`
					w-full rounded-xl px-4 py-3 outline-none transition-all duration-150
					font-sans text-[13px] font-medium text-cream placeholder:text-stone
					${error
						? "border-2 border-red-500/60 bg-red-950/20 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
						: "border border-leaf/20 bg-bark/50 focus:border-leaf focus:shadow-[0_0_0_3px_rgba(122,182,72,0.15)]"
					}
					${className ?? ""}
				`}
			/>
			{error && (
				<p className="font-mono text-[10px] text-red-400 leading-snug">
					⚠ {error}
				</p>
			)}
		</div>
	);
}
