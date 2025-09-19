"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, User, Palette, Languages } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';


export default function SettingsPage() {
    const { setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLocaleChange = (locale: string) => {
        const newPath = `/${locale}${pathname.substring(3)}`;
        startTransition(() => {
             router.replace(newPath);
        });
    };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="Default Farmer" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="farmer@example.com" />
                    </div>
                </div>
                 <Button>Save Changes</Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette/> Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                     <Select defaultValue="system" onValueChange={(theme) => setTheme(theme)}>
                        <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                     <Select defaultValue={pathname.split('/')[1]} onValueChange={handleLocaleChange} disabled={isPending}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Pest & Disease Alerts</h3>
                        <p className="text-sm text-muted-foreground">Receive alerts for potential risks in your area.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Irrigation Reminders</h3>
                        <p className="text-sm text-muted-foreground">Get reminders based on your smart irrigation schedule.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Market Price Changes</h3>
                        <p className="text-sm text-muted-foreground">Notify me about significant price fluctuations for my crops.</p>
                    </div>
                    <Switch />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Weekly Summary</h3>
                        <p className="text-sm text-muted-foreground">Receive a weekly summary report via email.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
