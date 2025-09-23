
"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Lightbulb,
  Droplets,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const components: { title: string; href: string; description: string, icon: React.ElementType }[] = [
  {
    title: "Diagnostics",
    href: "/login?redirect_to=/dashboard/diagnostics",
    description: "Identify crop diseases and pests by uploading an image.",
    icon: Sprout,
  },
  {
    title: "Soil Analysis",
    href: "/login?redirect_to=/dashboard/soil-analysis",
    description: "Get detailed soil health reports from a single picture.",
    icon: FlaskConical,
  },
  {
    title: "Pest Prediction",
    href: "/login?redirect_to=/dashboard/pest-prediction",
    description: "Forecast pest and disease risks based on weather data.",
    icon: Bug,
  },
  {
    title: "Crop Advisor",
    href: "/login?redirect_to=/dashboard/crop-advisor",
    description: "Receive AI-powered recommendations for profitable crops.",
    icon: Lightbulb,
  },
  {
    title: "Market Prices",
    href: "/login?redirect_to=/dashboard/market",
    description: "Track real-time prices for your crops from various markets.",
    icon: Landmark,
  },
  {
    title: "Irrigation Schedule",
    href: "/login?redirect_to=/dashboard/irrigation-schedule",
    description: "Optimize water usage with a smart, weather-based schedule.",
    icon: Droplets,
  },
]

export function LandingHeader() {
  const navLinks = [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
            <Logo />
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
             {navLinks.map(link => (
                 <NavigationMenuItem key={link.label}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-semibold")}>
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
             ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        icon={component.icon}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>

        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-4 py-8">
                        {navLinks.map(link => (
                            <Link key={link.label} href={link.href} className="text-lg font-medium text-gray-600 hover:text-primary">
                                {link.label}
                            </Link>
                        ))}
                         <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
             <Icon className="h-5 w-5 text-primary"/>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
