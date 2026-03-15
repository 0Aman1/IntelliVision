import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Eye, FileText, Camera, Sparkles, RotateCcw, Shield, Search, User } from "lucide-react";

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

interface ProcessedImageScreenProps {
  onNewAnalysis: () => void;
  analysisResult: AnalyzeResponse;
  imageUrl?: string;
}

interface ObjectRow {
  label: string;
  confidence: number;
  confidenceDisplay: string;
}

function pretty(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value, null, 2);
}

export function ProcessedImageScreen({ onNewAnalysis, analysisResult, imageUrl }: ProcessedImageScreenProps) {
  const objectRows = useMemo<ObjectRow[]>(() => {
    return analysisResult.objects.map((item) => {
      const label = String(item.label ?? item.name ?? "unknown");
      const scoreValue = Number(item.score ?? item.confidence ?? 0);
      const confidence = Number.isFinite(scoreValue) ? scoreValue : 0;
      const confidenceDisplay = confidence <= 1 ? (confidence * 100).toFixed(1) : confidence.toFixed(1);

      return {
        label,
        confidence,
        confidenceDisplay,
      };
    });
  }, [analysisResult.objects]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 drop-shadow-sm">Image Analysis Complete</h1>
            <p className="text-muted-foreground drop-shadow-sm">Results generated from API inference services.</p>
          </div>
          <Button
            onClick={onNewAnalysis}
            className="bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] text-white rounded-2xl font-semibold hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {analysisResult.api_warnings?.length ? (
          <Card className="mb-6 bg-yellow-50 border-yellow-200 rounded-3xl">
            <CardHeader>
              <CardTitle>API Warnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {analysisResult.api_warnings.map((warning, index) => (
                <p key={`${warning.source}-${index}`}>
                  <strong>{warning.source}:</strong> {warning.message}
                </p>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                <Camera className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
                Uploaded Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative bg-gradient-to-br from-[var(--pastel-blue)]/20 to-[var(--pastel-lavender)]/20 rounded-2xl border-2 border-border overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded-xl" />
                ) : (
                  <div className="h-56 flex items-center justify-center text-muted-foreground">Preview unavailable</div>
                )}
              </div>
              <div className="mt-4 p-4 bg-accent/40 rounded-2xl border border-border space-y-2">
                <p className="text-sm"><strong>Scene:</strong> {analysisResult.scene || "unknown"}</p>
                <p className="text-sm"><strong>Caption:</strong> {analysisResult.caption || "No caption returned"}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                  <Eye className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
                  Detection Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {objectRows.length ? (
                  <div className="space-y-3">
                    {objectRows.map((row, index) => (
                      <div key={`${row.label}-${index}`} className="flex items-center justify-between p-3 bg-accent/40 rounded-2xl border border-border">
                        <span className="font-semibold text-card-foreground">{row.label}</span>
                        <Badge variant="secondary" className="rounded-full font-semibold">
                          {row.confidenceDisplay}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No objects detected.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                  <FileText className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
                  Extracted Text ({analysisResult.text.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.text.length ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analysisResult.text.map((line, index) => (
                      <div key={`ocr-${index}`} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--pastel-mint-dark)] rounded-full flex-shrink-0"></div>
                        <Badge variant="outline" className="rounded-full font-medium text-xs">
                          {line}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No readable text found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center text-card-foreground drop-shadow-sm">
              <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
              Multi-Perspective AI Insights
              <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="agent" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-accent/40 p-1">
                <TabsTrigger value="agent" className="rounded-xl font-semibold data-[state=active]:bg-card data-[state=active]:shadow-lg">
                  <Shield className="w-4 h-4 mr-2" />
                  Agent's View
                </TabsTrigger>
                <TabsTrigger value="detective" className="rounded-xl font-semibold data-[state=active]:bg-card data-[state=active]:shadow-lg">
                  <Search className="w-4 h-4 mr-2" />
                  Detective's View
                </TabsTrigger>
                <TabsTrigger value="user" className="rounded-xl font-semibold data-[state=active]:bg-card data-[state=active]:shadow-lg">
                  <User className="w-4 h-4 mr-2" />
                  User's View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agent" className="mt-6">
                <div className="bg-gradient-to-r from-[var(--pastel-blue)]/20 to-[var(--pastel-blue)]/10 rounded-2xl p-6 border-2 border-border">
                  <pre className="text-sm whitespace-pre-wrap break-words text-card-foreground font-medium drop-shadow-sm">
                    {pretty(analysisResult.perspectives.agent)}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="detective" className="mt-6">
                <div className="bg-gradient-to-r from-[var(--pastel-lavender)]/20 to-[var(--pastel-lavender)]/10 rounded-2xl p-6 border-2 border-border">
                  <pre className="text-sm whitespace-pre-wrap break-words text-card-foreground font-medium drop-shadow-sm">
                    {pretty(analysisResult.perspectives.detective)}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="user" className="mt-6">
                <div className="bg-gradient-to-r from-[var(--pastel-mint)]/20 to-[var(--pastel-mint)]/10 rounded-2xl p-6 border-2 border-border">
                  <pre className="text-sm whitespace-pre-wrap break-words text-card-foreground font-medium drop-shadow-sm">
                    {pretty(analysisResult.perspectives.user)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
