import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get('code')
	const token_hash = searchParams.get('token_hash')
	const type = searchParams.get('type')
	const redirectTo = searchParams.get('redirectTo') ?? '/'

	const supabase = await createClient()

	// Handle password reset link dari email
	if (token_hash && type === 'recovery') {
		const { error } = await supabase.auth.verifyOtp({
			token_hash,
			type: 'recovery',
		})
		if (!error) {
			// Session sudah aktif — redirect ke halaman set password baru
			return NextResponse.redirect(`${origin}/reset-password`)
		}
		return NextResponse.redirect(`${origin}/forgot-password?error=link_expired`)
	}

	// Handle magic link email confirmation
	if (token_hash && type === 'email') {
		const { error } = await supabase.auth.verifyOtp({
			token_hash,
			type: 'email',
		})
		if (!error) {
			return NextResponse.redirect(`${origin}${redirectTo}`)
		}
	}

	// Handle OAuth code exchange (jika suatu saat ditambahkan)
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code)
		if (!error) {
			return NextResponse.redirect(`${origin}${redirectTo}`)
		}
	}

	// Fallback error
	return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
