import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if user is trying to access auth pages
	if (pathname.startsWith('/auth')) {
		return NextResponse.next();
	}

	// For all other pages, we'll let the client-side handle authentication
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
