import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Cloud,
  Droplets,
  ScanLine,
  Thermometer,
  Wind,
} from "lucide-react";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", yield: 186 },
  { month: "February", yield: 305 },
  { month: "March", yield: 237 },
  { month: "April", yield: 273 },
  { month: "May", yield: 209 },
  { month: "June", yield: 214 },
];

const chartConfig = {
  yield: {
    label: "Yield",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Farmer!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a summary of your farm&apos;s health and activities.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Health
            </CardTitle>
            <span className="text-sm font-bold text-green-600">Good</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <span className="text-sm font-bold text-yellow-600">2</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pest & Water</div>
            <p className="text-xs text-muted-foreground">Check affected zones</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-lg font-bold">28°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-bold">76%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="text-lg font-bold">12 km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Crop Yield</CardTitle>
            <CardDescription>
              A summary of your crop yield over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="yield" fill="var(--color-yield)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump right into your most important tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              href="/dashboard/diagnostics"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <ScanLine className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Diagnose Crop</p>
                  <p className="text-sm text-muted-foreground">
                    Upload an image to identify diseases or pests.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link
              href="/dashboard/health-map"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Cloud className="h-6 w-6" />
                <div>
                  <p className="font-semibold">View Health Maps</p>
                  <p className="text-sm text-muted-foreground">
                    Analyze spectral imaging data of your fields.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
