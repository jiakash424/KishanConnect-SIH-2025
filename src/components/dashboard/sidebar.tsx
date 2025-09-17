"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Bot,
  Settings,
  LogOut,
  Map,
  Tractor,
  Lightbulb,
  Droplets,
  Flower,
  Info,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Sidebar");

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("Dashboard") },
    { href: "/dashboard/analysis", icon: Tractor, label: t("Analytics") },
    { href: "/dashboard/diagnostics", icon: Sprout, label: t("Diagnostics") },
    { href: "/dashboard/soil-analysis", icon: FlaskConical, label: t("SoilAnalysis") },
    { href: "/dashboard/pest-prediction", icon: Bug, label: t("PestPrediction") },
    { href: "/dashboard/health-map", icon: Map, label: t("HealthMap") },
    { href: "/dashboard/market", icon: Landmark, label: t("Market") },
    { href: "/dashboard/crop-advisor", icon: Lightbulb, label: t("CropAdvisor") },
    { href: "/dashboard/irrigation-schedule", icon: Droplets, label: t("Irrigation") },
    { href: "/dashboard/weed-identification", icon: Flower, label: t("WeedID") },
    { href: "/dashboard/voice-assistant", icon: Bot, label: t("Assistant") },
  ];
  
  const handleLogout = () => {
    // In a real app, you'd call Firebase signOut here.
    // We are just navigating to the root which is the login page.
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}`);
  };

  const bottomMenuItems = [
      { href: "/dashboard/about", icon: Info, label: t("AboutUs") },
      { href: "/dashboard/support", icon: LifeBuoy, label: t("Support") },
      { href: "/dashboard/settings", icon: Settings, label: t("Settings") },
  ]

  // The pathname will include the locale, e.g., /en/dashboard.
  // We need to strip the locale for the isActive check.
  const currentPath = `/${pathname.split("/").slice(2).join("/")}`;

  return (
    <Sidebar collapsible="icon" className="bg-card border-r">
      <SidebarHeader className="h-14 flex items-center px-4 lg:px-6">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === '/dashboard' ? currentPath === item.href : currentPath.startsWith(item.href)}
                className="justify-start"
                variant="ghost"
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                isActive={currentPath.startsWith(item.href)}
                className="justify-start"
                variant="ghost"
                tooltip={item.label}
                asChild
              >
                <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
            <SidebarMenuItem>
                 <SidebarMenuButton
                    onClick={handleLogout}
                    className="justify-start"
                    variant="ghost"
                    tooltip={t("LogOut")}
                >
                    <LogOut className="h-5 w-5" />
                    <span>{t("LogOut")}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
