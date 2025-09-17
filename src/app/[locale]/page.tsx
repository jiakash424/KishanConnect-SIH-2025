import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-background');
  const t = useTranslations('LoginPage');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <p className="text-balance text-muted-foreground mt-2">
              {t('description')}
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginBg && (
          <Image
            src={loginBg.imageUrl}
            alt={loginBg.description}
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            data-ai-hint={loginBg.imageHint}
            priority
          />
        )}
      </div>
    </div>
  );
}
