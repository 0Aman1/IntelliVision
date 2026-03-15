import { Brain, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--pastel-blue)] via-[var(--pastel-lavender)] to-[var(--pastel-mint)] opacity-30"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full blur-lg opacity-30 scale-110"></div>
            <div className="relative bg-card/90 backdrop-blur-sm rounded-full p-4 shadow-lg border border-border">
              <Brain className="w-12 h-12 text-[var(--pastel-lavender-dark)]" />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
            <span className="px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border text-sm text-muted-foreground">
              AI-Powered Image Analysis
            </span>
            <Sparkles className="w-5 h-5 text-[var(--pastel-beige-dark)]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-4">
            IntelliVision
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-Powered Image Insight Platform
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Extract comprehensive insights from your images using cutting-edge artificial intelligence.
          Detect objects, analyze scenes, extract text, and understand relationships with unprecedented accuracy.
        </p>

        {/* College Name */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 max-w-md mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
          <p className="text-sm text-muted-foreground mb-1">Final Year Major Project</p>
          <p className="font-semibold text-foreground">Lokmanya Tilak College of Engineering</p>
        </div>
      </div>
    </div>
  );
}