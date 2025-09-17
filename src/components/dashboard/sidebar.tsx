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
  AreaChart,
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Bot,
  Settings,
  LogOut,
  Map,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/analysis", icon: AreaChart, label: "Analytics" },
  { href: "/dashboard/diagnostics", icon: Sprout, label: "Diagnostics" },
  { href: "/dashboard/soil-analysis", icon: FlaskConical, label: "Soil Analysis" },
  { href: "/dashboard/pest-prediction", icon: Bug, label: "Pest Prediction" },
  { href: "/dashboard/health-map", icon: Map, label: "Health Map" },
  { href: "/dashboard/market", icon: Landmark, label: "Market" },
  { href: "/dashboard/voice-assistant", icon: Bot, label: "Assistant" },
];

const bottomMenuItems = [
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/", icon: LogOut, label: "Log Out" },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="border-r bg-background">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
                className="justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-semibold"
                size="lg"
                variant="ghost"
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
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && item.href !== "/"}
                className="justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-semibold"
                size="lg"
                variant="ghost"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
