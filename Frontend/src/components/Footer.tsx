import {
  Brain,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md border-t border-border mt-16 shadow-2xl">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full blur-lg opacity-40 scale-110"></div>
                <div className="relative bg-gradient-to-br from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full p-4 shadow-xl border-2 border-white/20">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-foreground drop-shadow-sm">
                  IntelliVision
                </h3>
                <p className="text-sm font-medium text-[var(--pastel-lavender-dark)] drop-shadow-sm">
                  AI-Powered Image Insights
                </p>
              </div>
            </div>
          </div>

          {/* Main Footer Text */}
          <div className="bg-gradient-to-r from-card via-card/90 to-card backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-2xl mx-auto shadow-xl border-2 border-border">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-[var(--pastel-beige-dark)] drop-shadow-md" />
              <span className="text-lg font-bold text-foreground drop-shadow-sm">
                Final Year Major Project
              </span>
              <GraduationCap className="w-6 h-6 text-[var(--pastel-mint-dark)] drop-shadow-md" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-3 drop-shadow-sm">
              Lokmanya Tilak College of Engineering
            </h4>
            <p className="text-base font-semibold text-[var(--pastel-blue-dark)] drop-shadow-sm">
              Department of Computer Science Engineering - AI & ML
            </p>
          </div>

          {/* Team Members */}
          <div className="bg-gradient-to-r from-card via-card/90 to-card backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-4xl mx-auto shadow-xl border-2 border-border">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[var(--pastel-blue-dark)] drop-shadow-md" />
              <span className="text-lg font-bold text-foreground drop-shadow-sm">
                Built by
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[var(--pastel-blue)]/40 to-[var(--pastel-lavender)]/40 rounded-2xl p-4 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <p className="font-bold text-foreground drop-shadow-sm text-center">
                  Aman Pal
                </p>
              </div>
              <div className="bg-gradient-to-br from-[var(--pastel-mint)]/40 to-[var(--pastel-blue)]/40 rounded-2xl p-4 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <p className="font-bold text-foreground drop-shadow-sm text-center">
                  Sagar Raikwar
                </p>
              </div>
              <div className="bg-gradient-to-br from-[var(--pastel-lavender)]/40 to-[var(--pastel-beige)]/40 rounded-2xl p-4 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <p className="font-bold text-foreground drop-shadow-sm text-center">
                  Siddhesh Shinde
                </p>
              </div>
              <div className="bg-gradient-to-br from-[var(--pastel-beige)]/40 to-[var(--pastel-mint)]/40 rounded-2xl p-4 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <p className="font-bold text-foreground drop-shadow-sm text-center">
                  Saurabh Yadav
                </p>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[var(--pastel-blue)]/30 to-[var(--pastel-blue)]/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--pastel-blue-dark)] drop-shadow-md" />
                <span className="font-bold text-foreground drop-shadow-sm">
                  Advanced AI
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--pastel-blue-dark)] drop-shadow-sm">
                Computer Vision & Machine Learning
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--pastel-lavender)]/30 to-[var(--pastel-lavender)]/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)] drop-shadow-md" />
                <span className="font-bold text-foreground drop-shadow-sm">
                  Multi-Perspective
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--pastel-lavender-dark)] drop-shadow-sm">
                Comprehensive Image Analysis
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--pastel-mint)]/30 to-[var(--pastel-mint)]/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)] drop-shadow-md" />
                <span className="font-bold text-foreground drop-shadow-sm">
                  Real-time
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--pastel-mint-dark)] drop-shadow-sm">
                Instant Insight Generation
              </p>
            </div>
          </div>

          {/* Academic Year */}
          <div className="border-t-2 border-border pt-8">
            <div className="bg-gradient-to-r from-accent/40 to-accent/20 rounded-2xl p-6 border border-border shadow-lg">
              <p className="text-sm font-semibold text-foreground drop-shadow-sm mb-3">
                Academic Year 2024-2025 | Developed with passion for AI innovation
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium text-foreground drop-shadow-sm">
                  Made with
                </span>
                <span className="text-red-500 text-lg drop-shadow-md animate-pulse">♥</span>
                <span className="text-sm font-medium text-foreground drop-shadow-sm">
                  for Computer Science Engineering - AI & ML
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}