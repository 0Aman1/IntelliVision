import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { ImageUpload } from "./ImageUpload";
import { ProcessedImageScreen } from "./ProcessedImageScreen";

interface UploadPageProps {
  onNavigateToHome: () => void;
}

interface AnalyzeResponse {
  objects: Array<Record<string, unknown>>;
  text: string[];
  scene: string;
  caption: string;
  perspectives: {
    agent: Record<string, unknown>;
    detective: Record<string, unknown>;
    user: Record<string, unknown>;
  };
  api_warnings?: Array<{ source: string; message: string }>;
}

export function UploadPage({ onNavigateToHome }: UploadPageProps) {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:8001";
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage("");
    setResult(null);

    const localImageUrl = URL.createObjectURL(file);
    setImageUrl(localImageUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiBaseUrl}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || "Image analysis failed");
      }

      setResult(data as AnalyzeResponse);
      setHasUploadedImage(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error while analyzing image";
      setErrorMessage(message);
      setHasUploadedImage(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewAnalysis = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setHasUploadedImage(false);
    setIsProcessing(false);
    setResult(null);
    setImageUrl("");
    setErrorMessage("");

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    onNavigateToHome();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  if (hasUploadedImage && result) {
    return (
      <ProcessedImageScreen
        onNewAnalysis={handleNewAnalysis}
        analysisResult={result}
        imageUrl={imageUrl}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="rounded-full hover:bg-accent/50 transition-all duration-300 group hover:scale-105 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>

            <div className="text-center">
              <h1 className="font-bold text-foreground drop-shadow-sm">Image Analysis</h1>
              <p className="text-sm font-medium text-muted-foreground drop-shadow-sm">Upload and analyze your images</p>
            </div>

            <div className="w-[120px]"></div>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <ImageUpload
          onImageUpload={handleImageUpload}
          isProcessing={isProcessing}
        />
        {errorMessage ? (
          <div className="max-w-4xl mx-auto px-6 mt-4">
            <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive font-medium">
              {errorMessage}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
