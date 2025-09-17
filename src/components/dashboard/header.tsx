"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Moon, Sun, Languages, LogOut } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const locales: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ் (Tamil)",
  te: "తెలుగు (Telugu)",
  bn: "বাংলা (Bengali)",
  mr: "मराठी (Marathi)",
  pa: "ਪੰਜਾਬੀ (Punjabi)",
};

export function AppHeader() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");
  const { setTheme, theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const onLocaleChange = (locale: string) => {
    // The pathname is like `/en/dashboard/settings`
    // We want to replace the first part with the new locale.
    const newPath = `/${locale}/${pathname.split("/").slice(2).join("/")}`;
    router.replace(newPath);
  };
  
  const handleLogout = () => {
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.keys(locales).map((locale) => (
            <DropdownMenuItem key={locale} onClick={() => onLocaleChange(locale)}>
              {locales[locale]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    {userAvatar && <AvatarImage src={user?.photoURL || userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />}
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'F'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings"><DropdownMenuItem>{t('settings')}</DropdownMenuItem></Link>
            <Link href="/dashboard/support"><DropdownMenuItem>{t('support')}</DropdownMenuItem></Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
