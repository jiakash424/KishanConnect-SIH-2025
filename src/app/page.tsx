import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';
import {useTranslations} from 'next-intl';
import {redirect} from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}