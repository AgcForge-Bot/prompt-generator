"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserNav({ email }: { email: string }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const initial = email?.[0]?.toUpperCase() ?? "?";

	async function handleLogout() {
		setLoading(true);
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
		router.refresh();
	}

	return (
		<div className="relative">
			{/* Trigger */}
			<button
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-leaf/20 bg-moss/15 hover:bg-moss/25 hover:border-leaf/35 transition-all"
			>
				<span className="w-6 h-6 rounded-full bg-leaf/20 border border-leaf/40 flex items-center justify-center font-bold text-[11px] text-leaf2 font-mono shrink-0">
					{initial}
				</span>
				<span className="font-mono text-[10px] text-stone2 max-w-40 truncate hidden sm:block">
					{email}
				</span>
				<svg
					width="10"
					height="6"
					viewBox="0 0 10 6"
					className={`text-stone2 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
				>
					<path
						d="M1 1l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.5"
						fill="none"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			{/* Dropdown */}
			{open && (
				<>
					{/* Backdrop */}
					<div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

					<div
						className="absolute right-0 top-full mt-2 w-60 rounded-xl z-40 overflow-hidden"
						style={{
							background: "rgba(18,30,18,0.97)",
							border: "1px solid rgba(122,182,72,0.2)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
							backdropFilter: "blur(14px)",
						}}
					>
						{/* User info */}
						<div className="px-4 py-3 border-b border-leaf/10">
							<p className="font-mono text-[8px] text-stone uppercase tracking-widest mb-0.5">
								Login sebagai
							</p>
							<p className="font-sans text-[12px] font-semibold text-cream truncate">
								{email}
							</p>
						</div>

						{/* Logout */}
						<div className="p-1.5">
							<button
								onClick={handleLogout}
								disabled={loading}
								className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left font-sans text-[12px] font-semibold text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
							>
								{loading ? (
									<span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
								) : (
									<span className="text-sm">🚪</span>
								)}
								{loading ? "Keluar..." : "Keluar (Logout)"}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
