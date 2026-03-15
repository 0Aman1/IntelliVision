import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Shield, 
  Search, 
  User, 
  AlertTriangle, 
  Eye,
  Target,
  Sparkles
} from "lucide-react";

interface InsightsPanelProps {
  hasResults: boolean;
}

export function InsightsPanel({ hasResults }: InsightsPanelProps) {
  if (!hasResults) return null;

  const agentPerspective = {
    securityLevel: "Medium",
    anomalies: [
      { type: "Vehicle Positioning", severity: "Low", description: "Car parked close to intersection" },
      { type: "Pedestrian Movement", severity: "Low", description: "Person walking near vehicle traffic" },
    ],
    riskFactors: ["Traffic intersection", "Mixed pedestrian/vehicle zone"],
    recommendations: [
      "Monitor pedestrian crossing patterns",
      "Ensure proper traffic signal timing",
      "Consider additional safety signage"
    ]
  };

  const detectivePerspective = {
    clues: [
      { item: "Stop Sign", relevance: "High", note: "Traffic control device present" },
      { item: "Speed Limit Sign", relevance: "Medium", note: "25 mph zone indication" },
      { item: "Street Name", relevance: "High", note: "Main Street identification" },
      { item: "Person Position", relevance: "Medium", note: "Pedestrian near vehicle" }
    ],
    timeContext: "Daytime, well-lit conditions",
    locationContext: "Urban residential/commercial area",
    suspiciousElements: "None detected - normal street activity"
  };

  const userPerspective = {
    setting: "City Street Scene",
    mood: "Calm, everyday urban environment",
    description: "A typical day on Main Street with normal pedestrian and vehicle activity",
    elements: [
      "Person walking on sidewalk",
      "Parked car on street", 
      "Clear traffic signage",
      "Well-maintained urban area",
      "Trees and buildings creating pleasant streetscape"
    ],
    atmosphere: "Safe, organized urban environment with proper infrastructure"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
          <h2 className="text-2xl font-semibold text-gray-800">Multi-Perspective Analysis</h2>
          <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
        </div>
        <p className="text-gray-600">View the same image through different analytical lenses</p>
      </div>

      <Card className="rounded-3xl shadow-xl border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="agent" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-to-r from-[var(--pastel-blue)]/20 to-[var(--pastel-lavender)]/20 rounded-2xl p-2">
              <TabsTrigger 
                value="agent" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                Agent's View
              </TabsTrigger>
              <TabsTrigger 
                value="detective" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Detective's View
              </TabsTrigger>
              <TabsTrigger 
                value="user" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                User's View
              </TabsTrigger>
            </TabsList>

            {/* Agent's Perspective */}
            <TabsContent value="agent" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-50 to-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      Security Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Security Level:</span>
                      <Badge className="bg-yellow-100 text-yellow-800 rounded-full">
                        {agentPerspective.securityLevel}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Detected Anomalies:</h4>
                      {agentPerspective.anomalies.map((anomaly, index) => (
                        <div key={index} className="mb-2 p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{anomaly.type}</span>
                            <Badge variant="outline" className="text-xs rounded-full">
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{anomaly.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Target className="w-5 h-5" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Risk Factors:</h4>
                      <div className="space-y-2">
                        {agentPerspective.riskFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <div className="space-y-2">
                        {agentPerspective.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-white/60 p-2 rounded-lg">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Detective's Perspective */}
            <TabsContent value="detective" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Eye className="w-5 h-5" />
                      Evidence & Clues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {detectivePerspective.clues.map((clue, index) => (
                        <div key={index} className="p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{clue.item}</span>
                            <Badge 
                              className={
                                clue.relevance === "High" 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {clue.relevance}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{clue.note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-0 bg-gradient-to-br from-gray-50 to-slate-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-700">
                      <Search className="w-5 h-5" />
                      Contextual Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Time Context:</h4>
                      <p className="text-sm text-gray-600 bg-white/60 p-3 rounded-xl">
                        {detectivePerspective.timeContext}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Location Context:</h4>
                      <p className="text-sm text-gray-600 bg-white/60 p-3 rounded-xl">
                        {detectivePerspective.locationContext}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Suspicious Elements:</h4>
                      <p className="text-sm text-green-600 bg-green-50 p-3 rounded-xl">
                        {detectivePerspective.suspiciousElements}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* User's Perspective */}
            <TabsContent value="user" className="space-y-6">
              <Card className="rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <User className="w-5 h-5" />
                    Everyday Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Scene Overview:</h4>
                      <p className="text-gray-700 bg-white/60 p-4 rounded-xl leading-relaxed">
                        {userPerspective.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Atmosphere:</h4>
                      <p className="text-gray-700 bg-white/60 p-4 rounded-xl leading-relaxed">
                        {userPerspective.atmosphere}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Key Elements Observed:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {userPerspective.elements.map((element, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm">{element}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl">
                    <h4 className="font-medium mb-2 text-gray-800">Setting & Mood:</h4>
                    <p className="text-gray-700">
                      <span className="font-medium">{userPerspective.setting}</span> - {userPerspective.mood}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}