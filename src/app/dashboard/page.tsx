"use client";
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Cloudy,
  DollarSign,
  Droplets,
  Sprout,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GetWeatherForecastOutput, getWeather } from '@/ai/flows/get-weather-forecast';
import { GetMarketPriceOutput, getMarketPrices } from '@/ai/flows/get-market-price';
import { useCallback, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartData = [
  { month: "January", yield: 186 },
  { month: "February", yield: 305 },
  { month: "March", yield: 237 },
  { month: "April", yield: 73 },
  { month: "May", yield: 209 },
  { month: "June", yield: 214 },
]

const chartConfig = {
  yield: {
    label: "Yield",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [weather, setWeather] = useState<GetWeatherForecastOutput | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [marketPrices, setMarketPrices] = useState<GetMarketPriceOutput | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  const fetchWeather = useCallback(async () => {
    setLoadingWeather(true);
    try {
      const weatherData = await getWeather({ location: 'Delhi' });
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const fetchMarketPrices = useCallback(async () => {
    setLoadingPrices(true);
    try {
      const pricesData = await getMarketPrices({ crop: 'Wheat' });
      setMarketPrices(pricesData);
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    fetchMarketPrices();
  }, [fetchWeather, fetchMarketPrices]);
  
  const currentWeather = weather?.[0];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Crop Health
            </CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              -1.2% from yesterday
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Soil Moisture
            </CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Optimal level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 new pest alert
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Yield Analytics</CardTitle>
            <CardDescription>Showing yield for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="yield" fill="var(--color-yield)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weather</CardTitle>
            <CardDescription>{currentWeather?.full_description || "Loading weather..."}</CardDescription>
          </CardHeader>
          {loadingWeather || !currentWeather ? (
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          ) : (
             <CardContent className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-center text-6xl font-bold text-primary">
                  {currentWeather.temp}°
                  <Cloudy className="h-16 w-16 ml-4" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-muted-foreground" /> <span>High: {currentWeather.temp_max}°</span></div>
                  <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-muted-foreground" /> <span>Low: {currentWeather.temp_min}°</span></div>
                  <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-muted-foreground" /> <span>Wind: 12 km/h</span></div>
                  <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-muted-foreground" /> <span>Humidity: 78%</span></div>
                  <div className="flex items-center gap-2"><Sunrise className="w-4 h-4 text-muted-foreground" /> <span>Sunrise: 05:45 AM</span></div>
                  <div className="flex items-center gap-2"><Sunset className="w-4 h-4 text-muted-foreground" /> <span>Sunset: 07:15 PM</span></div>
                </div>
            </CardContent>
          )}
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/diagnostics">
                    <Sprout className="h-6 w-6" />
                    <span>Diagnose Crop</span>
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/soil-analysis">
                    <Activity className="h-6 w-6" />
                    <span>Analyze Soil</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/pest-prediction">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Predict Pests</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/market">
                    <DollarSign className="h-6 w-6" />
                    <span>Check Market</span>
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Prices (Wheat)</CardTitle>
            <CardDescription>Latest prices from major markets.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPrices ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : marketPrices && marketPrices.length > 0 ? (
              <ul className="space-y-3">
                {marketPrices.map((price, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="font-medium">{price.location}</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-primary font-bold text-base">₹{price.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs">/ quintal</span>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No market price data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
