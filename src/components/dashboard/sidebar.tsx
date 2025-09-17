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
  BarChart3,
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
  { href: "/dashboard/analysis", icon: BarChart3, label: "Analytics" },
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
    <Sidebar collapsible="icon" className="bg-muted/40 border-r dark:bg-card">
      <SidebarHeader className="h-14 flex items-center px-4 lg:px-6">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
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
             <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && item.href !== "/"}
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
      </SidebarFooter>
    </Sidebar>
  );
}
