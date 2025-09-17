"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const yieldData = [
  { date: "2024-01", corn: 240, wheat: 130 },
  { date: "2024-02", corn: 220, wheat: 140 },
  { date: "2024-03", corn: 260, wheat: 155 },
  { date: "2024-04", corn: 280, wheat: 160 },
  { date: "2024-05", corn: 290, wheat: 170 },
  { date: "2024-06", corn: 320, wheat: 180 },
];

const soilData = [
  { date: "Mon", moisture: 35, temperature: 22 },
  { date: "Tue", moisture: 38, temperature: 23 },
  { date: "Wed", moisture: 36, temperature: 21 },
  { date: "Thu", moisture: 42, temperature: 24 },
  { date: "Fri", moisture: 41, temperature: 25 },
  { date: "Sat", moisture: 39, temperature: 24 },
  { date: "Sun", moisture: 37, temperature: 23 },
];

const pestData = [
    { name: 'Aphids', count: 45 },
    { name: 'Bollworms', count: 23 },
    { name: 'Mites', count: 67 },
    { name: 'Thrips', count: 12 },
    { name: 'Whiteflies', count: 38 },
];

const yieldChartConfig = {
  corn: { label: "Corn", color: "hsl(var(--chart-2))" },
  wheat: { label: "Wheat", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const soilChartConfig = {
  moisture: { label: "Moisture (%)", color: "hsl(var(--chart-1))" },
  temperature: { label: "Temperature (°C)", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const pestChartConfig = {
    count: { label: "Incidents" },
    pests: { color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crop Health Analysis</h1>
        <p className="text-muted-foreground">
          Track trends and performance metrics for your farm.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yield Trends</CardTitle>
            <CardDescription>Monthly yield (in tons) for major crops.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={yieldChartConfig} className="h-[300px] w-full">
              <LineChart data={yieldData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="corn" type="monotone" stroke="var(--color-corn)" strokeWidth={2} dot={false} />
                <Line dataKey="wheat" type="monotone" stroke="var(--color-wheat)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Soil Conditions</CardTitle>
                    <CardDescription>Moisture and temperature readings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={soilChartConfig} className="h-[300px] w-full">
                        <BarChart data={soilData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="moisture" fill="var(--color-moisture)" radius={4} />
                            <Bar dataKey="temperature" fill="var(--color-temperature)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pest Incidents</CardTitle>
                    <CardDescription>Count of pest incidents this season.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={pestChartConfig} className="h-[300px] w-full">
                        <BarChart data={pestData} layout="vertical" margin={{left: 10}}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                            <XAxis type="number" />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" layout="vertical" fill="var(--color-pests)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
