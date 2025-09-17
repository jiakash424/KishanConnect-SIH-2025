
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  Cloud,
  Droplets,
  ScanLine,
  Thermometer,
  Wind,
  Cloudy,
  CloudSun,
  Sun,
  CloudRain
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { getWeather, GetWeatherForecastOutput } from "@/ai/flows/get-weather-forecast";
import { Skeleton } from "@/components/ui/skeleton";

const harvestingCostData = [
  { name: 'Wheat', value: 76000, color: 'hsl(var(--chart-1))' },
  { name: 'Rice', value: 24000, color: 'hsl(var(--chart-2))' },
];

const WeatherIcon = ({ iconName, ...props }: { iconName: string, [key: string]: any }) => {
    switch (iconName) {
        case 'Sun': return <Sun {...props} />;
        case 'CloudSun': return <CloudSun {...props} />;
        case 'Cloudy': return <Cloudy {...props} />;
        case 'CloudRain': return <CloudRain {...props} />;
        case 'Wind': return <Wind {...props} />;
        default: return <Cloud {...props} />;
    }
};

export default function DashboardPage() {
  const farmImage = PlaceHolderImages.find((p) => p.id === 'farm-image');
  const [weather, setWeather] = useState<GetWeatherForecastOutput | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoadingWeather(true);
        const forecast = await getWeather({ location: 'Delhi' });
        setWeather(forecast);
      } catch (error) {
        console.error("Failed to fetch weather", error);
        // You might want to set an error state here
      } finally {
        setLoadingWeather(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Wheat</CardTitle>
                <CardDescription className="text-xs">Total production</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
                <p className="text-4xl font-bold">125 <span className="text-2xl font-medium text-muted-foreground">Tons</span></p>
                <div className="flex items-center gap-2 text-green-600">
                    <span>12%</span>
                    <ChartContainer config={{}} className="h-10 w-10">
                        <PieChart accessibilityLayer>
                             <Pie data={[{value:12}, {value:88}]} dataKey="value" innerRadius={10} outerRadius={15} cy="50%" cx="50%" paddingAngle={0} stroke="none">
                                <Cell fill="hsl(var(--chart-1))" />
                                <Cell fill="transparent" />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Rice</CardTitle>
                <CardDescription className="text-xs">Total production</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
                <p className="text-4xl font-bold">980 <span className="text-2xl font-medium text-muted-foreground">Tons</span></p>
                <div className="flex items-center gap-2 text-green-600">
                    <span>33%</span>
                    <ChartContainer config={{}} className="h-10 w-10">
                        <PieChart accessibilityLayer>
                             <Pie data={[{value:33}, {value:67}]} dataKey="value" innerRadius={10} outerRadius={15} cy="50%" cx="50%" paddingAngle={0} stroke="none">
                                <Cell fill="hsl(var(--chart-1))" />
                                <Cell fill="transparent" />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-2 bg-card">
            <CardHeader>
                <CardTitle>Weather forecast (Delhi)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {loadingWeather ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-4">
                            <Skeleton className="h-5 w-16 mb-2" />
                            <Skeleton className="h-8 w-8 my-2 rounded-full" />
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))
                ) : (
                    weather?.map((day, index) => (
                        <div key={index} className={`flex flex-col items-center justify-center ${index === 0 ? 'bg-muted/50 rounded-lg p-4' : ''}`}>
                            <p className="font-semibold">{day.day}</p>
                            <WeatherIcon iconName={day.icon} className="h-8 w-8 text-yellow-500 my-2"/>
                            <p className="font-bold text-lg">{day.temp_max}°/{day.temp_min}°</p>
                            <p className="text-xs text-muted-foreground text-center">{day.condition}</p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Manage your farm</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {farmImage && (
                <Image
                    src={farmImage.imageUrl}
                    alt={farmImage.description}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg object-cover"
                    data-ai-hint={farmImage.imageHint}
                />
            )}
          </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Predictive analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-center font-semibold">January '22</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center"><span className="text-sm">Wheat</span><span className="text-sm font-bold">59%</span></div>
                            <Progress value={59} className="h-2"/>
                            <div className="flex justify-between items-center"><span className="text-sm">Rice</span><span className="text-sm font-bold">81%</span></div>
                            <Progress value={81} className="h-2"/>
                            <div className="flex justify-between items-center"><span className="text-sm">Maize</span><span className="text-sm font-bold">13%</span></div>
                            <Progress value={13} className="h-2"/>
                        </div>
                    </div>
                     <div className="flex flex-col gap-2">
                        <p className="text-center font-semibold">February '22</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center"><span className="text-sm">Wheat</span><span className="text-sm font-bold">59%</span></div>
                            <Progress value={59} className="h-2"/>
                            <div className="flex justify-between items-center"><span className="text-sm">Rice</span><span className="text-sm font-bold">81%</span></div>
                            <Progress value={81} className="h-2"/>
                            <div className="flex justify-between items-center"><span className="text-sm">Maize</span><span className="text-sm font-bold">13%</span></div>
                            <Progress value={13} className="h-2"/>
                        </div>
                    </div>
                     <div className="flex flex-col gap-2">
                        <p className="text-center font-semibold">March '22</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center"><span className="text-sm">Wheat</span><span className="text-sm font-bold">59%</span></div>
                            <Progress value={59} className="h-2"/>
                            <div className="flex justify-between items-center"><span className="text-sm">Rice</span><span className="text-sm font-bold">81%</span></div>
                            <Progress value={81} className="h-2"/>
                            <div className="flex justify-between items-center"><span className="text-sm">Maize</span><span className="text-sm font-bold">13%</span></div>
                            <Progress value={13} className="h-2"/>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Harvesting Cost</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <p className="text-sm">Wheat <span className="font-bold">$76K</span></p>
                  <p className="text-sm">Rice <span className="font-bold">$24K</span></p>
                  <p className="text-sm mt-2">Total estimation</p>
                  <p className="text-3xl font-bold">$100K</p>
                </div>
                 <div className="w-full h-32">
                  <ChartContainer
                    config={{}}
                    className="mx-auto aspect-square h-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={harvestingCostData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={30}
                        strokeWidth={5}
                      >
                         {harvestingCostData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
