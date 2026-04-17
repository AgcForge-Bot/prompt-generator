import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
	return await updateSession(request)
}

export const config = {
	matcher: [
		/*
		 * Match semua request path KECUALI:
		 * - _next/static (static files)
		 * - _next/image (image optimization)
		 * - favicon.ico dan file statis lainnya
		 */
		'/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
