import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'pa'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  // Match all pathnames except for static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};