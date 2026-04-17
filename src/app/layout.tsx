import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import UserNav from "@/components/auth/UserNav";

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

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// ── SSR session check (double protection lapis kedua setelah middleware)
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<html lang="id" className="scroll-smooth">
			<body className="antialiased">
				<div className="top-accent" />

				{/* Navbar — hanya muncul kalau sudah login */}
				{user && (
					<div
						className="sticky top-0.75 z-50 border-b border-leaf/10"
						style={{
							background: "rgba(14,24,14,0.90)",
							backdropFilter: "blur(14px)",
						}}
					>
						<div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-4">
							<div className="flex items-center gap-2 shrink-0">
								{/* <span className="text-sm">🌿</span> */}
								<Image
									src="/favicon.ico"
									width={14}
									height={14}
									alt="AI Video Tools"
									sizes="14px"
									className="object-cover h-6 w-6"
								/>

								<span className="font-mono text-[9px] tracking-[0.18em] uppercase text-leaf hidden sm:block">
									AI Video Tools
								</span>
							</div>
							<UserNav email={user.email ?? "user"} />
						</div>
					</div>
				)}

				{children}
			</body>
		</html>
	);
}
