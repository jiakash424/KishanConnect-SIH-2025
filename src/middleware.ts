import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // The i18n middleware from next-intl is removed.
  // We just do a basic redirect to `/en` if the user is at the root.
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url))
  }
}
 
export const config = {
  // Match all pathnames except for static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
