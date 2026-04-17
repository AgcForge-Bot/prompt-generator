"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";

export default function ForgotPasswordPage() {
	const searchParams = useSearchParams();
	const errorParam   = searchParams.get("error");

	const [email, setEmail]       = useState("");
	const [loading, setLoading]   = useState(false);
	const [error, setError]       = useState("");
	const [success, setSuccess]   = useState("");
	const [fieldError, setFieldError] = useState("");

	const paramError = useMemo(() => {
		if (errorParam === "link_expired") {
			return "Link reset password sudah kadaluarsa atau tidak valid. Silakan minta ulang.";
		}
		return "";
	}, [errorParam]);

	function validate() {
		if (!email.trim())                                 { setFieldError("Email wajib diisi"); return false; }
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   { setFieldError("Format email tidak valid"); return false; }
		setFieldError("");
		return true;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		setError("");
		setSuccess("");

		const supabase = createClient();
		const { error: authError } = await supabase.auth.resetPasswordForEmail(
			email.trim().toLowerCase(),
			{ redirectTo: `${window.location.origin}/auth/callback?type=recovery` }
		);

		setLoading(false);

		if (authError) {
			setError(`Gagal mengirim email: ${authError.message}`);
			return;
		}

		// Selalu tampilkan pesan sukses meski email tidak terdaftar
		// (security: jangan bocorkan apakah email terdaftar atau tidak)
		setSuccess(
			`Jika ${email} terdaftar, link reset password telah dikirim. Cek inbox dan folder spam sobat.`
		);
	}

	return (
		<AuthCard
			title={<>Lupa<br /><em className="text-amber2">Password?</em></>}
			subtitle="Masukkan email akun — kami kirimkan link reset password"
		>
			<div className="flex flex-col gap-4">
				{(paramError || error) && (
					<AuthAlert type="error" message={paramError || error} />
				)}
				{success && <AuthAlert type="success" message={success} />}

				{!success && (
					<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
						<AuthInput
							label="Email Akun"
							icon="📧"
							type="email"
							placeholder="nama@email.com"
							value={email}
							autoComplete="email"
							autoFocus
							error={fieldError}
							onChange={e => { setEmail(e.target.value); setFieldError(""); }}
						/>

						<AuthButton type="submit" loading={loading}>
							📨 Kirim Link Reset Password
						</AuthButton>
					</form>
				)}

				{/* Kirim ulang jika sudah sukses */}
				{success && (
					<AuthButton
						type="button"
						variant="outline"
						onClick={() => { setSuccess(""); setEmail(""); }}
					>
						↩ Kirim ke email lain
					</AuthButton>
				)}

				<div className="text-center pt-1 border-t border-leaf/10">
					<Link
						href="/login"
						className="inline-flex items-center gap-1.5 font-mono text-[10px] text-stone2 hover:text-leaf2 transition-colors mt-3"
					>
						← Kembali ke halaman login
					</Link>
				</div>
			</div>
		</AuthCard>
	);
}
