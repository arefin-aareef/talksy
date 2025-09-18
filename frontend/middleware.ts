import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if user is trying to access auth pages
	if (pathname.startsWith('/auth')) {
		return NextResponse.next();
	}

	// For all other pages, we'll let the client-side handle authentication
<<<<<<< HEAD
	// But we'll add cache control headers to prevent back button issues
	const response = NextResponse.next();

	// Add headers to prevent caching of authenticated pages
	if (
		!pathname.startsWith('/auth') &&
		!pathname.startsWith('/_next') &&
		!pathname.startsWith('/api')
	) {
		response.headers.set(
			'Cache-Control',
			'no-cache, no-store, must-revalidate'
		);
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');
	}

	return response;
=======
	return NextResponse.next();
>>>>>>> 3b1baf70efa958465b17a7ba6eb0b828695b622e
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
