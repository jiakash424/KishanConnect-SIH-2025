"use client";
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Bot,
  Cloudy,
  IndianRupee,
  Droplets,
  Sprout,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Lightbulb,
  Flower,
  Sun,
  CloudSun,
  CloudRain,
  ChevronRight,
  LocateFixed,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Bar, BarChart, CartesianGrid, XAxis, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

const weatherIconMap = {
  Sun: <Sun className="h-full w-full" />,
  CloudSun: <CloudSun className="h-full w-full" />,
  Cloudy: <Cloudy className="h-full w-full" />,
  CloudRain: <CloudRain className="h-full w-full" />,
  Wind: <Wind className="h-full w-full" />,
}

const hourlyChartConfig = {
  temperature: {
    label: "Temp",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


function WeatherCard() {
  const [weather, setWeather] = useState<GetWeatherForecastOutput | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [locationError, setLocationError] = useState<string | null>(null);


  const fetchWeather = useCallback(async (location: string) => {
    setLoadingWeather(true);
    setLocationError(null);
    try {
      const weatherData = await getWeather({ location });
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setLocationError("Could not fetch weather data. Showing default.");
       // Fetch for default location if user's location fails
      if (location !== 'Delhi') {
        fetchWeather('Delhi');
      }
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocationError("Could not get your location. Showing weather for default location.");
          fetchWeather('Delhi'); // Fallback to a default location
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser. Showing weather for default location.");
      fetchWeather('Delhi'); // Fallback for browsers that don't support geolocation
    }
  }, [fetchWeather]);

  if (loadingWeather || !weather) {
    return <Card className="lg:col-span-2"><CardContent className="p-4"><Skeleton className="h-96 w-full" /></CardContent></Card>
  }
  
  const { location, currentTime, lastUpdated, current, daily, hourly } = weather;
  const todayForecast = daily[0];

  const convertTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return Math.round(celsius * 9/5 + 32);
    }
    return celsius;
  }

  return (
      <Card className="lg:col-span-2">
         <CardHeader>
            <CardTitle>Weather</CardTitle>
          </CardHeader>
        <CardContent className="p-4 pt-0">
          {locationError && (
             <Alert variant="default" className="mb-2 text-xs bg-muted/80">
                <LocateFixed className="h-4 w-4" />
                <AlertDescription>
                  {locationError}
                </AlertDescription>
              </Alert>
          )}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{location} {currentTime}</h3>
              <p className="text-xs text-muted-foreground">{lastUpdated}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
              <Button onClick={() => setTempUnit('F')} size="sm" className={cn('h-6 w-10 rounded-full', tempUnit === 'F' ? 'bg-background shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted/50')}>°F</Button>
              <Button onClick={() => setTempUnit('C')} size="sm" className={cn('h-6 w-10 rounded-full', tempUnit === 'C' ? 'bg-background shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted/50')}>°C</Button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 my-4">
            <div className="w-24 h-24 text-yellow-400">
              {weatherIconMap[current.icon]}
            </div>
            <div>
              <span className="text-7xl font-bold">{convertTemp(current.temp)}</span><span className="text-5xl align-top text-muted-foreground">°{tempUnit}</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-medium">{current.condition}</p>
              <p className="text-muted-foreground">H {convertTemp(todayForecast.temp_max)}° L {convertTemp(todayForecast.temp_min)}°</p>
            </div>
          </div>
          
          <div className="mt-6">
            <ScrollArea>
              <div className="flex w-max space-x-2 pb-4">
                {daily.map((day, index) => (
                  <div key={index} className={cn("flex flex-col items-center gap-1 p-3 rounded-lg w-20", index === 0 ? "bg-muted border" : "")}>
                    <p className="text-sm font-medium">{day.day}</p>
                    <div className="w-8 h-8 text-yellow-400">{weatherIconMap[day.icon]}</div>
                    <p className="text-sm">{convertTemp(day.temp_max)}° {convertTemp(day.temp_min)}°</p>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <ChevronRight />
                  </Button>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          
          <div className="h-40 w-full mt-4">
            <ChartContainer config={hourlyChartConfig} className="h-full w-full">
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-temperature)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-temperature)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                 <XAxis 
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.split(' ')[0] + value.split(' ')[1].substring(0,1)}
                  className="text-xs"
                />
                 <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => (
                          <>
                            <div className="font-bold text-center">{props.payload.time}</div>
                            <div>{convertTemp(props.payload.temp)}°{tempUnit}</div>
                            {props.payload.precip > 0 && <div className="text-blue-400">💧 {props.payload.precip}%</div>}
                          </>
                        )}
                        hideLabel
                        hideIndicator
                      />
                    }
                  />
                <Area type="monotone" dataKey="temp" stroke="var(--color-temperature)" fill="url(#colorUv)" />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
  )
}


export default function DashboardPage() {
  const [marketPrices, setMarketPrices] = useState<GetMarketPriceOutput | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

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
    fetchMarketPrices();
  }, [fetchMarketPrices]);
  

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
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
         <WeatherCard />
         <Card>
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
      </div>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/diagnostics">
                    <Sprout className="h-6 w-6" />
                    <span>Diagnostics</span>
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/soil-analysis">
                    <Activity className="h-6 w-6" />
                    <span>Soil Analysis</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/pest-prediction">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Pest Prediction</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/market">
                    <IndianRupee className="h-6 w-6" />
                    <span>Market</span>
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/crop-advisor">
                    <Lightbulb className="h-6 w-6" />
                    <span>Crop Advisor</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/irrigation-schedule">
                    <Droplets className="h-6 w-6" />
                    <span>Irrigation</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/weed-identification">
                    <Flower className="h-6 w-6" />
                    <span>Weed ID</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/voice-assistant">
                    <Bot className="h-6 w-6" />
                    <span>Assistant</span>
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
