import { ArrowRight, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { HeroSection } from "./HeroSection";

interface HomePageProps {
  onNavigateToUpload: () => void;
}

export function HomePage({ onNavigateToUpload }: HomePageProps) {
  const handleStartAnalysis = () => {
    onNavigateToUpload();
    // Scroll to top of the page after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-card/60 backdrop-blur-sm rounded-3xl border border-border p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full mb-6 shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Analyze Your Images?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Upload your images and discover comprehensive insights powered by advanced AI technology. 
              Get object detection, OCR text extraction, scene analysis, and multi-perspective interpretations.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleStartAnalysis}
              className="bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] hover:from-[var(--pastel-blue-dark)]/90 hover:to-[var(--pastel-lavender-dark)]/90 text-white rounded-full px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
            >
              Start Image Analysis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-[var(--pastel-mint-dark)] rounded-full"></div>
                Object Detection
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-[var(--pastel-beige-dark)] rounded-full"></div>
                OCR Extraction
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-[var(--pastel-lavender-dark)] rounded-full"></div>
                Scene Analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-[var(--pastel-blue-dark)] rounded-full"></div>
                AI Insights
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--pastel-blue)]/50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-[var(--pastel-blue-dark)] rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Advanced Detection</h3>
            <p className="text-sm text-muted-foreground">
              Identify objects, people, and scenes with high accuracy AI models
            </p>
          </div>
          
          <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--pastel-lavender)]/50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-[var(--pastel-lavender-dark)] rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Multi-Perspective</h3>
            <p className="text-sm text-muted-foreground">
              View analysis from security, detective, and user perspectives
            </p>
          </div>
          
          <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--pastel-mint)]/50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-6 h-6 bg-[var(--pastel-mint-dark)] rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Instant Results</h3>
            <p className="text-sm text-muted-foreground">
              Get comprehensive insights and summaries in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}