import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing?: boolean;
}

export function ImageUpload({ onImageUpload, isProcessing = false }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate processing progress
  useState(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProcessingProgress(0);
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[var(--pastel-mint-dark)] animate-spin" />
            <h2 className="text-3xl font-bold text-foreground drop-shadow-sm">Processing Your Image</h2>
            <Sparkles className="w-6 h-6 text-[var(--pastel-lavender-dark)] animate-spin" />
          </div>
          <p className="text-lg text-muted-foreground drop-shadow-sm">
            Our AI is analyzing your image and extracting comprehensive insights...
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border-2 border-border p-12 shadow-xl">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground drop-shadow-sm">Analysis Progress</span>
                <span className="font-bold text-[var(--pastel-blue-dark)] drop-shadow-sm">{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="h-3 rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-accent/40 rounded-2xl border border-border">
                <div className="w-3 h-3 bg-[var(--pastel-mint-dark)] rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-sm font-bold text-foreground drop-shadow-sm">Object Detection</p>
              </div>
              <div className="text-center p-4 bg-accent/40 rounded-2xl border border-border">
                <div className="w-3 h-3 bg-[var(--pastel-beige-dark)] rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-sm font-bold text-foreground drop-shadow-sm">OCR Extraction</p>
              </div>
              <div className="text-center p-4 bg-accent/40 rounded-2xl border border-border">
                <div className="w-3 h-3 bg-[var(--pastel-lavender-dark)] rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-sm font-bold text-foreground drop-shadow-sm">Scene Analysis</p>
              </div>
              <div className="text-center p-4 bg-accent/40 rounded-2xl border border-border">
                <div className="w-3 h-3 bg-[var(--pastel-blue-dark)] rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-sm font-bold text-foreground drop-shadow-sm">AI Summary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-[var(--pastel-mint-dark)]" />
          <h2 className="text-3xl font-bold text-foreground drop-shadow-sm">Upload Image to Extract Insights</h2>
          <Sparkles className="w-6 h-6 text-[var(--pastel-lavender-dark)]" />
        </div>
        <p className="text-lg font-medium text-muted-foreground drop-shadow-sm">
          Drag and drop your image or click to browse. Supports JPG, PNG, GIF, and WebP formats.
        </p>
      </div>

      <div
        className={`
          relative border-4 border-dashed rounded-3xl p-16 text-center transition-all duration-300 cursor-pointer
          bg-card/60 backdrop-blur-sm shadow-xl hover:shadow-2xl
          ${isDragging 
            ? 'border-[var(--pastel-blue-dark)] bg-[var(--pastel-blue)]/30 scale-105' 
            : 'border-border hover:border-[var(--pastel-lavender-dark)] hover:bg-[var(--pastel-lavender)]/20'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-300">
            <Upload className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <p className="text-lg font-bold text-foreground drop-shadow-sm">
              or click to browse from your device
            </p>
            
            <Button 
              className="bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] hover:from-[var(--pastel-blue-dark)]/90 hover:to-[var(--pastel-lavender-dark)]/90 text-white rounded-2xl px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
              size="lg"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Choose Image
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[var(--pastel-mint-dark)] rounded-full"></div>
              <span className="text-sm font-bold text-foreground drop-shadow-sm">Object Detection</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[var(--pastel-beige-dark)] rounded-full"></div>
              <span className="text-sm font-bold text-foreground drop-shadow-sm">OCR Text Extraction</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[var(--pastel-lavender-dark)] rounded-full"></div>
              <span className="text-sm font-bold text-foreground drop-shadow-sm">Scene Analysis</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[var(--pastel-blue-dark)] rounded-full"></div>
              <span className="text-sm font-bold text-foreground drop-shadow-sm">AI Summary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}