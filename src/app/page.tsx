import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
        {loginBg && (
          <div className="absolute -z-10 h-full w-full">
            <Image
              src={loginBg.imageUrl}
              alt=""
              fill
              className="object-cover brightness-50"
              data-ai-hint={loginBg.imageHint}
              priority
            />
          </div>
        )}
      <div className="mx-auto w-[350px] space-y-6 rounded-lg bg-card/90 p-8 shadow-lg backdrop-blur-sm">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
          </div>
          <LoginForm />
      </div>
    </div>
  );
}
