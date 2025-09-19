import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'pa'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
