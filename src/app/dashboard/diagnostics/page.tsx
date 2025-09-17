"use client";

import { useState } from "react";
import Image from "next/image";
import {
  identifyCropProblem,
  CropDiseasePestIdentificationOutput,
} from "@/ai/flows/crop-disease-pest-identification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Leaf, Shield, TestTube2, AlertCircle } from "lucide-react";

export default function DiagnosticsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CropDiseasePestIdentificationOutput | null>(null);
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

  const handleIdentify = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const diagnosisResult = await identifyCropProblem({ photoDataUri: preview });
      setResult(diagnosisResult);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ResultCard = ({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5">
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disease & Pest Identification</h1>
        <p className="text-muted-foreground">
          Upload an image of an affected plant to get an AI-powered diagnosis.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
            <label htmlFor="crop-image-upload" className="w-full h-64 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
              {preview ? (
                <Image src={preview} alt="Crop preview" width={300} height={300} className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input id="crop-image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            <Button onClick={handleIdentify} disabled={!file || loading} className="w-full">
              {loading ? "Analyzing..." : "Identify Problem"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {loading && (
            <>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Leaf/>Identification</CardTitle>
                  <CardDescription>Confidence: {Math.round(result.identification.confidence * 100)}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{result.identification.diseaseOrPest}</p>
                </CardContent>
              </Card>

              <ResultCard title="Recommended Solutions" icon={<TestTube2/>} items={result.solutions} />
              <ResultCard title="Preventative Measures" icon={<Shield/>} items={result.preventativeMeasures} />
            </>
          )}

          {!result && !loading && !error && (
             <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Analysis results will appear here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
