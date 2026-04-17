"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? "/";
	const errorParam = searchParams.get("error");

	const [email, setEmail]       = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading]   = useState(false);
	const [error, setError]       = useState("");
	const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

	const paramError = useMemo(() => {
		if (errorParam === "auth_callback_failed") {
			return "Link autentikasi tidak valid atau sudah kadaluarsa. Silakan coba lagi.";
		}
		return "";
	}, [errorParam]);

	function validate() {
		const errs: typeof fieldErrors = {};
		if (!email.trim())
			errs.email = "Email wajib diisi";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			errs.email = "Format email tidak valid";
		if (!password)
			errs.password = "Password wajib diisi";
		setFieldErrors(errs);
		return Object.keys(errs).length === 0;
	}

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		setError("");

		const supabase = createClient();
		const { error: authError } = await supabase.auth.signInWithPassword({
			email: email.trim().toLowerCase(),
			password,
		});

		setLoading(false);

		if (authError) {
			setError(
				authError.message.includes("Invalid login credentials")
					? "Email atau password salah. Periksa kembali dan coba lagi."
					: authError.message.includes("Email not confirmed")
						? "Email belum dikonfirmasi. Hubungi admin."
						: authError.message.includes("Too many requests")
							? "Terlalu banyak percobaan login. Tunggu beberapa menit."
							: `Login gagal: ${authError.message}`
			);
			return;
		}

		router.push(redirectTo);
		router.refresh();
	}

	return (
		<AuthCard
			title={<>Selamat Datang<br /><em className="text-leaf2">Masuk ke Tools</em></>}
			subtitle="Masuk menggunakan akun yang dibuat oleh admin"
		>
			<form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
				{(paramError || error) && (
					<AuthAlert type="error" message={paramError || error} />
				)}

				<AuthInput
					label="Email"
					icon="📧"
					type="email"
					placeholder="nama@email.com"
					value={email}
					autoComplete="email"
					autoFocus
					error={fieldErrors.email}
					onChange={e => {
						setEmail(e.target.value);
						setFieldErrors(p => ({ ...p, email: undefined }));
					}}
				/>

				<div className="flex flex-col gap-1">
					<AuthInput
						label="Password"
						icon="🔒"
						type="password"
						placeholder="••••••••"
						value={password}
						autoComplete="current-password"
						error={fieldErrors.password}
						onChange={e => {
							setPassword(e.target.value);
							setFieldErrors(p => ({ ...p, password: undefined }));
						}}
					/>
					<div className="text-right mt-1">
						<Link
							href="/forgot-password"
							className="font-mono text-[10px] text-leaf2/75 hover:text-leaf2 transition-colors underline underline-offset-2"
						>
							Lupa password?
						</Link>
					</div>
				</div>

				<AuthButton type="submit" loading={loading} className="mt-1">
					🔐 Masuk
				</AuthButton>
			</form>
		</AuthCard>
	);
}
