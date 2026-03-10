import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const token = request.cookies.get('domatechUser')

	if (request.nextUrl.pathname.startsWith('/home') && !token) {
		return NextResponse.redirect(new URL('/auth/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.otf$).*)'
	],
	missing: [
		{ type: 'header', key: 'next-router-prefetch' },
		{ type: 'header', key: 'purpose', value: 'prefetch' },
	],
}