"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthAlert from "@/components/auth/AuthAlert";

function getStrength(pw: string) {
	if (!pw) return null;
	const hasUpper   = /[A-Z]/.test(pw);
	const hasLower   = /[a-z]/.test(pw);
	const hasNumber  = /[0-9]/.test(pw);
	const hasSpecial = /[^A-Za-z0-9]/.test(pw);
	const score = [pw.length >= 8, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
	if (score <= 2) return { label: "Lemah",       color: "bg-red-500",  textColor: "text-red-400",  width: "25%" };
	if (score === 3) return { label: "Sedang",      color: "bg-amber",    textColor: "text-amber2",   width: "50%" };
	if (score === 4) return { label: "Kuat",        color: "bg-leaf",     textColor: "text-leaf",     width: "75%" };
	return             { label: "Sangat Kuat",  color: "bg-leaf2",    textColor: "text-leaf2",    width: "100%" };
}

export default function ResetPasswordPage() {
	const router = useRouter();

	const [password, setPassword] = useState("");
	const [confirm, setConfirm]   = useState("");
	const [loading, setLoading]   = useState(false);
	const [checking, setChecking] = useState(true);
	const [error, setError]       = useState("");
	const [success, setSuccess]   = useState("");
	const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

	// ── SSR double check: pastikan session aktif dari link email
	useEffect(() => {
		const supabase = createClient();
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!session) {
				router.replace("/forgot-password?error=link_expired");
			} else {
				setChecking(false);
			}
		});
	}, [router]);

	function validate() {
		const errs: typeof fieldErrors = {};
		if (!password)
			errs.password = "Password baru wajib diisi";
		else if (password.length < 8)
			errs.password = "Password minimal 8 karakter";
		if (!confirm)
			errs.confirm = "Konfirmasi password wajib diisi";
		else if (password !== confirm)
			errs.confirm = "Password tidak cocok";
		setFieldErrors(errs);
		return Object.keys(errs).length === 0;
	}

	async function handleReset(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		setError("");

		const supabase = createClient();
		const { error: authError } = await supabase.auth.updateUser({ password });

		setLoading(false);

		if (authError) {
			setError(
				authError.message.includes("same password")
					? "Password baru tidak boleh sama dengan password lama."
					: `Gagal mereset password: ${authError.message}`
			);
			return;
		}

		setSuccess("Password berhasil diubah! Mengarahkan ke halaman utama...");
		setTimeout(() => {
			router.push("/");
			router.refresh();
		}, 2000);
	}

	const strength = getStrength(password);

	if (checking) {
		return (
			<AuthCard title="Reset Password">
				<div className="flex flex-col items-center gap-3 py-8">
					<div className="w-6 h-6 border-2 border-leaf border-t-transparent rounded-full animate-spin" />
					<p className="font-mono text-[10px] text-stone2">Memverifikasi link...</p>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard
			title={<>Buat<br /><em className="text-leaf2">Password Baru</em></>}
			subtitle="Buat password baru yang kuat untuk akun sobat"
		>
			<div className="flex flex-col gap-4">
				{error   && <AuthAlert type="error"   message={error} />}
				{success && <AuthAlert type="success" message={success} />}

				{!success && (
					<form onSubmit={handleReset} className="flex flex-col gap-4" noValidate>
						{/* Password field + strength bar */}
						<div className="flex flex-col gap-1.5">
							<AuthInput
								label="Password Baru"
								icon="🔒"
								type="password"
								placeholder="Minimal 8 karakter"
								value={password}
								autoComplete="new-password"
								autoFocus
								error={fieldErrors.password}
								onChange={e => {
									setPassword(e.target.value);
									setFieldErrors(p => ({ ...p, password: undefined }));
								}}
							/>
							{/* Strength indicator */}
							{password && strength && (
								<div className="mt-1 px-1">
									<div className="h-1 bg-bark/60 rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
											style={{ width: strength.width }}
										/>
									</div>
									<p className={`font-mono text-[9px] mt-1 ${strength.textColor}`}>
										Kekuatan: {strength.label}
									</p>
								</div>
							)}
						</div>

						<AuthInput
							label="Konfirmasi Password"
							icon="🔐"
							type="password"
							placeholder="Ketik ulang password baru"
							value={confirm}
							autoComplete="new-password"
							error={fieldErrors.confirm}
							onChange={e => {
								setConfirm(e.target.value);
								setFieldErrors(p => ({ ...p, confirm: undefined }));
							}}
						/>

						<AuthButton type="submit" loading={loading}>
							✅ Simpan Password Baru
						</AuthButton>
					</form>
				)}
			</div>
		</AuthCard>
	);
}
