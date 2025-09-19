import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '../i18n';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale,
});
 
export const config = {
  // Match all pathnames except for static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  i18n: {
    locales,
    defaultLocale,
    path: '../i18n'
  }
};
