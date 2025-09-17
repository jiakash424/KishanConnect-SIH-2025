import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Layers, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HealthMapPage() {
  const healthMapImage = PlaceHolderImages.find((p) => p.id === "health-map");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Interactive Spectral Health Map
        </h1>
        <p className="text-muted-foreground">
          Visualize crop health, soil conditions, and risk zones.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Field Analysis</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="ndvi">
                <SelectTrigger className="w-[180px]">
                  <Layers className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select a layer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ndvi">NDVI</SelectItem>
                  <SelectItem value="ndre">NDRE</SelectItem>
                  <SelectItem value="soil">Soil Moisture</SelectItem>
                  <SelectItem value="risk">Risk Zones</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="field-a">
                <SelectTrigger className="w-[180px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field-a">Field A</SelectItem>
                  <SelectItem value="field-b">Field B</SelectItem>
                  <SelectItem value="field-c">Field C</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>June 1, 2024 - June 30, 2024</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {healthMapImage && (
            <div className="w-full aspect-video rounded-lg overflow-hidden border">
              <Image
                src={healthMapImage.imageUrl}
                alt={healthMapImage.description}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                data-ai-hint={healthMapImage.imageHint}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
