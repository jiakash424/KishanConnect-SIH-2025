"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Cloud,
  Cloudy,
  CloudSun,
  Sun,
  CloudRain,
  Sprout,
  Bug,
  TestTube,
  AreaChart,
  Bot,
  Landmark,
  Droplets,
  CalendarDays,
  Clock,
  ArrowRight
} from "lucide-react";
import { getWeather, GetWeatherForecastOutput } from "@/ai/flows/get-weather-forecast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const WeatherIcon = ({ iconName, ...props }: { iconName: string, [key: string]: any }) => {
    switch (iconName) {
        case 'Sun': return <Sun {...props} />;
        case 'CloudSun': return <CloudSun {...props} />;
        case 'Cloudy': return <Cloudy {...props} />;
        case 'CloudRain': return <CloudRain {...props} />;
        default: return <Cloud {...props} />;
    }
};

const QuickLinkCard = ({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string; }) => (
    <Link href={href} className="block hover:bg-muted/50 rounded-lg p-1 transition-colors">
        <Card className="h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
             <CardFooter className="pt-0">
                <div className="flex items-center text-xs text-primary">
                    Go to {title} <ArrowRight className="ml-1 h-3 w-3" />
                </div>
            </CardFooter>
        </Card>
    </Link>
);


export default function DashboardPage() {
  const [weather, setWeather] = useState<GetWeatherForecastOutput | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const farmImage = PlaceHolderImages.find((p) => p.id === 'farm-image');

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoadingWeather(true);
        const forecast = await getWeather({ location: 'Delhi' });
        setWeather(forecast);
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoadingWeather(false);
      }
    }
    fetchWeather();
  }, []);

  const irrigationSchedule = [
    { crop: 'Wheat', field: 'Field A', time: '6:00 AM', duration: '45 mins' },
    { crop: 'Rice', field: 'Field B', time: '7:00 AM', duration: '60 mins' },
    { crop: 'Maize', field: 'Field C', time: '8:00 AM', duration: '30 mins' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Yield</CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,250 Quintals</div>
                <p className="text-xs text-muted-foreground">+15.2% from last season</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pest Alerts</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3 Active</div>
                <p className="text-xs text-muted-foreground">Aphids detected in Field A</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">Optimal range: 35-55%</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Watch (Wheat)</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹2,275/qtl</div>
                <p className="text-xs text-muted-foreground">+1.5% from yesterday</p>
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Weather Forecast (Delhi)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {loadingWeather ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-2 space-y-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-6 w-12" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))
                    ) : (
                        weather?.map((day, index) => (
                            <div key={index} className={`flex flex-col items-center justify-center text-center rounded-lg p-2 ${index === 0 ? 'bg-muted/50' : ''}`}>
                                <p className="font-semibold text-sm">{day.day}</p>
                                <WeatherIcon iconName={day.icon} className="h-7 w-7 text-yellow-500 my-2"/>
                                <p className="font-bold text-md">{day.temp_max}°/{day.temp_min}°</p>
                                <p className="text-xs text-muted-foreground">{day.condition}</p>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Today's Irrigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {irrigationSchedule.map(item => (
                            <li key={item.field} className="flex items-center justify-between text-sm">
                                <div className="font-medium">{item.crop} <span className="text-xs text-muted-foreground">({item.field})</span></div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{item.time} ({item.duration})</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickLinkCard 
                href="/dashboard/diagnostics"
                icon={<Sprout className="h-4 w-4 text-muted-foreground" />}
                title="Diagnostics"
                description="Identify crop diseases & pests"
            />
            <QuickLinkCard 
                href="/dashboard/soil-analysis"
                icon={<TestTube className="h-4 w-4 text-muted-foreground" />}
                title="Soil Analysis"
                description="Get soil health recommendations"
            />
            <QuickLinkCard 
                href="/dashboard/pest-prediction"
                icon={<Bug className="h-4 w-4 text-muted-foreground" />}
                title="Pest Prediction"
                description="Forecast pest & disease risks"
            />
            <QuickLinkCard 
                href="/dashboard/analysis"
                icon={<AreaChart className="h-4 w-4 text-muted-foreground" />}
                title="Analytics"
                description="View farm performance trends"
            />
             <QuickLinkCard 
                href="/dashboard/market"
                icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
                title="Market Prices"
                description="Track real-time crop prices"
            />
            <QuickLinkCard 
                href="/dashboard/voice-assistant"
                icon={<Bot className="h-4 w-4 text-muted-foreground" />}
                title="AI Assistant"
                description="Ask questions in your language"
            />
        </div>
    </div>
  );
}
