import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
 
export const config = {
  // Match all pathnames except for static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
