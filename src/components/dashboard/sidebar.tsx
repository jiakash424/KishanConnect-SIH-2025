"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  BarChart2,
  Tractor,
  Wheat,
  Banknote,
  Thermometer,
  Settings,
  LogOut,
  Landmark,
  Bot
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/analysis", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/diagnostics", icon: Tractor, label: "Diagnostics" },
  { href: "/dashboard/health-map", icon: Wheat, label: "Health Map" },
  { href: "/dashboard/market", icon: Landmark, label: "Market" },
  { href: "/dashboard/voice-assistant", icon: Bot, label: "Assistant" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="border-r-0">
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
                className="justify-start data-[active=true]:bg-green-200/20 data-[active=true]:text-green-300 font-semibold"
                size="lg"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t-0 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start font-semibold" size="lg">
              <Link href="/">
                <LogOut />
                <span>Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
