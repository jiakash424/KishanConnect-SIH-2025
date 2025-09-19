"use client";

import { useState } from "react";
import Image from "next/image";
import { generateSpectralMap, GenerateSpectralMapOutput } from "@/ai/flows/generate-spectral-map";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, UploadCloud, AlertCircle, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export default function HealthMapPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateSpectralMapOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerateMap = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const mapResult = await generateSpectralMap({ farmImageUri: preview });
      setResult(mapResult);
    } catch (err) {
      setError("An error occurred while generating the map. This may be due to high demand or image restrictions. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          AI Spectral Health Map Generator
        </h1>
        <p className="text-muted-foreground">
          Upload a satellite or drone image of your field to generate a crop health map.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Upload Field Image</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
            <label htmlFor="field-image-upload" className="w-full h-64 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
              {preview ? (
                <Image src={preview} alt="Field preview" width={300} height={300} className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">Satellite or drone imagery (PNG, JPG)</p>
                </div>
              )}
              <input id="field-image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            <Button onClick={handleGenerateMap} disabled={!file || loading} className="w-full">
              {loading ? "Generating Map..." : "Generate Spectral Map"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers />Generated Health Map</CardTitle>
            <CardDescription>AI-generated analysis of your field's health.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {loading && (
                  <div className="space-y-4">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <Skeleton className="h-16 w-full" />
                  </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Generating Map</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="w-full aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={result.spectralMapUri}
                      alt="Generated spectral map"
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground p-2 rounded-lg bg-muted">
                    <span>Unhealthy</span>
                    <div className="w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                    <span>Healthy</span>
                  </div>
                   <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="text-primary"/>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{result.analysis}</p>
                    </CardContent>
                   </Card>
                </div>
              )}

              {!result && !loading && !error && (
                <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground text-center">Your generated spectral map and analysis will appear here.</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
