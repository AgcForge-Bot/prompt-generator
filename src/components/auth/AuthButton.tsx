"use client";

import type { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	variant?: "primary" | "outline";
}

export default function AuthButton({
	children,
	loading,
	variant = "primary",
	className,
	...props
}: AuthButtonProps) {
	const base =
		"w-full flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 font-bold text-[13px] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			"bg-gradient-to-r from-moss to-moss2 text-white border-0 shadow-[0_4px_18px_rgba(61,92,46,0.45)] hover:shadow-[0_6px_24px_rgba(61,92,46,0.55)] hover:-translate-y-0.5 active:translate-y-0",
		outline:
			"bg-transparent text-leaf2 border border-leaf/30 hover:border-leaf hover:bg-leaf/5",
	};

	return (
		<button
			{...props}
			disabled={loading || props.disabled}
			className={`${base} ${variants[variant]} ${className ?? ""}`}
		>
			{loading ? (
				<>
					<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
					<span>Memproses...</span>
				</>
			) : (
				children
			)}
		</button>
	);
}
