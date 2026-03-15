import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Eye, 
  FileText, 
  Network, 
  MapPin, 
  Clock, 
  Camera,
  Sparkles
} from "lucide-react";

interface ResultsSectionProps {
  hasResults: boolean;
}

export function ResultsSection({ hasResults }: ResultsSectionProps) {
  if (!hasResults) return null;

  // Mock data for demonstration
  const objectDetection = [
    { name: "Person", confidence: 96.7, color: "bg-[var(--pastel-blue)]" },
    { name: "Car", confidence: 92.3, color: "bg-[var(--pastel-mint)]" },
    { name: "Building", confidence: 89.1, color: "bg-[var(--pastel-lavender)]" },
    { name: "Tree", confidence: 84.5, color: "bg-[var(--pastel-beige)]" },
  ];

  const extractedText = [
    "STOP",
    "Main Street",
    "Speed Limit 25",
    "No Parking"
  ];

  const metadata = {
    timestamp: "2025-01-09 14:30:25",
    location: "New York, NY",
    device: "iPhone 15 Pro",
    resolution: "4032 x 3024",
    fileSize: "2.3 MB"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
          <h2 className="text-2xl font-semibold text-foreground">Analysis Results</h2>
          <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Object & Scene Detection */}
        <Card className="rounded-3xl shadow-lg border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Eye className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
              Object & Scene Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectDetection.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="font-medium text-card-foreground">{item.name}</span>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {item.confidence}%
                    </Badge>
                  </div>
                  <Progress value={item.confidence} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* OCR Text Extraction */}
        <Card className="rounded-3xl shadow-lg border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <FileText className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
              OCR Text Extraction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {extractedText.map((text, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--pastel-mint-dark)] rounded-full"></div>
                  <Badge variant="outline" className="rounded-full">
                    {text}
                  </Badge>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[var(--pastel-mint)]/20 rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Full Text:</strong> "STOP Main Street Speed Limit 25 No Parking"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Element Relationships */}
        <Card className="rounded-3xl shadow-lg border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Network className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
              Element Relationships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[var(--pastel-lavender)]/20 rounded-2xl">
                <span className="text-card-foreground">Person → Car</span>
                <Badge className="bg-[var(--pastel-lavender-dark)] text-white rounded-full">
                  Near
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--pastel-lavender)]/20 rounded-2xl">
                <span className="text-card-foreground">Car → Building</span>
                <Badge className="bg-[var(--pastel-lavender-dark)] text-white rounded-full">
                  Adjacent
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--pastel-lavender)]/20 rounded-2xl">
                <span className="text-card-foreground">Stop Sign → Street</span>
                <Badge className="bg-[var(--pastel-lavender-dark)] text-white rounded-full">
                  On
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="rounded-3xl shadow-lg border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Camera className="w-5 h-5 text-[var(--pastel-beige-dark)]" />
              Image Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[var(--pastel-beige-dark)]" />
                <span className="text-sm text-card-foreground">{metadata.timestamp}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--pastel-beige-dark)]" />
                <span className="text-sm text-card-foreground">{metadata.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-[var(--pastel-beige-dark)]" />
                <span className="text-sm text-card-foreground">{metadata.device}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Resolution:</span>
                  <span className="text-card-foreground">{metadata.resolution}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>File Size:</span>
                  <span className="text-card-foreground">{metadata.fileSize}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card className="rounded-3xl shadow-lg border border-border bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm mt-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center text-card-foreground">
            <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
            AI-Generated Image Summary
            <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-accent/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <p className="leading-relaxed text-card-foreground">
              This urban street scene captures a typical city intersection with a person walking near a parked car. 
              The image contains clear signage including a stop sign and speed limit markers indicating "Speed Limit 25". 
              The setting appears to be on Main Street during daytime hours, with buildings visible in the background 
              and trees lining the street, suggesting a well-maintained urban environment with proper traffic management infrastructure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}