"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthCard({
	title,
	subtitle,
	children,
}: {
	title: ReactNode;
	subtitle?: string;
	children: ReactNode;
}) {
	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
			<div className="w-full max-w-md animate-slide-up">
				{/* Brand */}
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2 mb-4">
						<span className="text-2xl">🌿</span>
						<span className="font-mono text-[9px] tracking-[0.22em] uppercase text-leaf">
							AI Video Tools
						</span>
					</Link>
					<h1 className="font-playfair text-3xl font-bold text-cream leading-tight mb-2">
						{title}
					</h1>
					{subtitle && (
						<p className="font-mono text-[11px] text-stone2 leading-relaxed">
							{subtitle}
						</p>
					)}
				</div>

				{/* Card */}
				<div
					className="rounded-2xl p-7 backdrop-blur-sm"
					style={{
						background: "rgba(26,46,26,0.72)",
						border: "1px solid rgba(122,182,72,0.20)",
						boxShadow: "0 8px 40px rgba(0,0,0,0.32)",
					}}
				>
					{children}
				</div>

				<p className="text-center font-mono text-[9px] text-stone mt-6 leading-relaxed">
					Prompt Video Generator · Internal Tools
				</p>
			</div>
		</main>
	);
}
