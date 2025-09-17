import {redirect} from 'next/navigation';

// This is the root layout, which redirects to the default locale.
// The actual app layout is in src/app/[locale]/layout.tsx.
export default function RootLayout() {
  redirect('/en');
}
