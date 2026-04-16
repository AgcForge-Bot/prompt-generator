import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "ASMR Survival Build — AI Prompt Generator",
	description:
		"Generate cinematic AI video prompts for ASMR Primitive Survival Build content. Sub-niche: Relaxing / ASMR / Satisfying. Optimized for Grok & VEO.",
	keywords: [
		"ASMR",
		"survival build",
		"AI video",
		"prompt generator",
		"VEO",
		"Grok",
		"primitive build",
		"forest shelter",
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="id" className="scroll-smooth">
			<body className="antialiased">
				<div className="top-accent" />
				{children}
			</body>
		</html>
	);
}
