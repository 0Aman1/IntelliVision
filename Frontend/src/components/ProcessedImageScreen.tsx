import { useMemo, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  Eye, FileText, Camera, Sparkles, RotateCcw,
  Shield, Search, User, AlertTriangle, Lock,
  Info, MapPin, Clock, Activity, Download
} from "lucide-react";

// ─── Type Definitions ───────────────────────────────────────────────────────

interface ObjectItem {
  label?: string;
  name?: string;
  confidence?: number;
  score?: number;
  source?: string;
}

interface ForensicAnalysis {
  ela?: { ela_score?: number; ela_suspicious?: boolean };
  compression_artifacts?: { blockiness?: number; artifact_suspicious?: boolean };
  noise_analysis?: { noise_inconsistency?: number; noise_suspicious?: boolean };
  manipulation_suspicion_level?: string;
  confidence?: number;
}

interface StegoMetric {
  lsb_one_ratio?: number;
  lsb_balance_deviation?: number;
}

interface SteganographyAnalysis {
  lsb_channel_metrics?: { blue?: StegoMetric; green?: StegoMetric; red?: StegoMetric };
  lsb_entropy?: number;
  lsb_suspicion_score?: number;
  hidden_data_likelihood?: string;
  evidence?: string[];
}

interface MalwareScan {
  binary_signature_scan?: { signature_hits?: string[]; base64_segment_count?: number };
  yara_matches?: string[];
  binwalk_findings?: string[];
  malware_suspicion_level?: string;
  scan_status?: string;
}

interface BasicInfo {
  width?: number;
  height?: number;
  mode?: string;
  format?: string | null;
  size_bytes?: number;
}

interface Metadata {
  basic_info?: BasicInfo;
  camera_model?: string;
  timestamp?: string;
  gps?: string;
  gps_decimal?: { lat?: number; lon?: number } | null;
  editing_software?: string;
  metadata_inconsistencies?: string[];
  raw_exif_preview?: Record<string, string>;
}

interface PatternAnalysis {
  repeated_blocks?: number;
  texture_irregularity?: number;
  noise_inconsistency?: number;
  pattern_risk?: string;
  unique_patterns?: Array<{ y: number; x: number; block_size: number; mean: number; grad: number; frequency: number }>;
  duplicates_removed_count?: number;
  duplicates_top?: Array<{ sig: string; count: number }>;
}

interface NlpSummary {
  summary?: string;
  sentences?: string[];
  caption_nouns?: string[];
}

interface ImageInfo {
  filename?: string;
  size_bytes?: number;
}

interface VisualAnalysis {
  objects?: ObjectItem[];
  caption?: string;
  scene?: string;
  ocr_text?: string[];
  local_models?: { yolo_used?: boolean; blip_used?: boolean };
  external_apis?: { hf_detr_used?: boolean; ocr_space_used?: boolean; warnings?: string[] };
}

interface AnalyzeResponse {
  image_info?: ImageInfo;
  visual_analysis?: VisualAnalysis;
  forensic_analysis?: ForensicAnalysis;
  steganography_analysis?: SteganographyAnalysis;
  malware_scan?: MalwareScan;
  metadata?: Metadata;
  pattern_analysis?: PatternAnalysis;
  nlp_summary?: NlpSummary;
  perspectives?: { agent?: unknown; detective?: unknown; user?: unknown };
  // flat compat
  objects?: ObjectItem[];
  text?: string[];
  scene?: string;
  caption?: string;
  api_warnings?: Array<{ source: string; message: string }>;
}

interface ProcessedImageScreenProps {
  onNewAnalysis: () => void;
  analysisResult: AnalyzeResponse;
  imageUrl?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function perspectiveText(value: unknown): string {
  if (!value) return "No data available.";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function RiskBadge({ level }: { level: string }) {
  const l = (level || "unknown").toLowerCase();
  let color = "#64748b", bg = "#f1f5f9", border = "#cbd5e1";
  if (l === "high")   { color = "#dc2626"; bg = "#fee2e2"; border = "#fca5a5"; }
  if (l === "medium") { color = "#d97706"; bg = "#fef3c7"; border = "#fcd34d"; }
  if (l === "low")    { color = "#16a34a"; bg = "#dcfce7"; border = "#86efac"; }
  return (
    <span
      className="px-3 py-0.5 rounded-full text-xs font-bold border"
      style={{ color, backgroundColor: bg, borderColor: border }}
    >
      {l.toUpperCase()}
    </span>
  );
}

function SuspicionFlag({ flag }: { flag?: boolean }) {
  if (flag) return <span style={{ color: "#dc2626" }} className="text-xs font-semibold">⚠ Suspicious</span>;
  return <span style={{ color: "#16a34a" }} className="text-xs font-semibold">✓ Normal</span>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ProcessedImageScreen({ onNewAnalysis, analysisResult, imageUrl }: ProcessedImageScreenProps) {
  const va  = analysisResult.visual_analysis ?? {};
  const fa  = analysisResult.forensic_analysis ?? {};
  const sa  = analysisResult.steganography_analysis ?? {};
  const ms  = analysisResult.malware_scan ?? {};
  const md  = analysisResult.metadata ?? {};
  const pa  = analysisResult.pattern_analysis ?? {};
  const nlp = analysisResult.nlp_summary ?? {};
  const persp = analysisResult.perspectives ?? {};

  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<null | "png" | "jpeg" | "pdf">(null);
  const [address, setAddress] = useState<string>("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const processed = Boolean(analysisResult?.image_info && (va || fa || sa || ms || md));

  const objects  = va.objects ?? analysisResult.objects ?? [];
  const ocrLines = va.ocr_text ?? analysisResult.text ?? [];
  const scene    = va.scene ?? analysisResult.scene ?? "unknown";
  const caption  = va.caption ?? analysisResult.caption ?? "";

  const objectRows = useMemo(() => {
    return objects.map((item) => {
      const label = String(item.label ?? item.name ?? "unknown");
      const raw   = Number(item.confidence ?? item.score ?? 0);
      const pct   = raw <= 1 ? raw * 100 : raw;
      return { label, pct: Math.round(pct * 10) / 10, source: item.source ?? "" };
    }).sort((a, b) => b.pct - a.pct);
  }, [objects]);

  useEffect(() => {
    const lat = md.gps_decimal?.lat ?? null;
    const lon = md.gps_decimal?.lon ?? null;
    if (lat == null || lon == null) {
      setAddress("");
      setAddressError("");
      setAddressLoading(false);
      return;
    }
    let cancelled = false;
    setAddressLoading(true);
    setAddressError("");
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const disp = typeof j?.display_name === "string" ? j.display_name : "";
        setAddress(disp);
        setAddressLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAddress("");
        setAddressError("Address lookup failed");
        setAddressLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [md.gps_decimal?.lat, md.gps_decimal?.lon]);

  async function handleExport(format: "png" | "jpeg" | "pdf") {
    if (!reportRef.current) return;
    try {
      setExporting(format);
      const html2canvas = (await import("html2canvas")).default;
      
      // Wait a bit for any layout shifts or images to be ready
      await new Promise(r => setTimeout(r, 500));

      const canvas = await html2canvas(reportRef.current, {
        useCORS: true,
        allowTaint: false, // Don't allow tainted canvas, rely on CORS
        scale: 2,
        backgroundColor: "#ffffff",
        logging: true, // Enable logging to help debug if needed
        onclone: (clonedDoc) => {
          const report = clonedDoc.querySelector(".max-w-7xl");
          if (report) {
            (report as HTMLElement).style.padding = "40px";
            (report as HTMLElement).style.backgroundColor = "#ffffff";
          }
          // Hide elements that shouldn't be in the export
          const buttons = clonedDoc.querySelectorAll("button");
          buttons.forEach(b => (b as HTMLElement).style.display = "none");
          const dropdowns = clonedDoc.querySelectorAll("[role='menu'], [role='combobox']");
          dropdowns.forEach(d => (d as HTMLElement).style.display = "none");
        }
      });

      const imgType = format === "pdf" ? "image/jpeg" : `image/${format}`;
      const dataUrl = canvas.toDataURL(imgType, 0.95);

      if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        // Use a standard format like a4 if the canvas is too large, 
        // or keep the custom size but with sensible limits
        const imgProps = {
          width: canvas.width,
          height: canvas.height
        };
        
        const pdf = new jsPDF({
          orientation: imgProps.width > imgProps.height ? "l" : "p",
          unit: "px",
          format: [imgProps.width, imgProps.height]
        });

        pdf.addImage(dataUrl, "JPEG", 0, 0, imgProps.width, imgProps.height);
        pdf.save(`intellivision-report-${Date.now()}.pdf`);
      } else {
        const link = document.createElement("a");
        link.download = `intellivision-report-${Date.now()}.${format}`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export report. This might be due to image security restrictions or browser memory limits.");
    } finally {
      setExporting(null);
    }
  }

  const sigHits = (ms.binary_signature_scan?.signature_hits ?? []).filter(
    (h) => !h.includes("unavailable") && !h.includes("error")
  );
  const yaraHits = (ms.yara_matches ?? []).filter(
    (h) => !h.includes("unavailable") && !h.includes("error")
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div ref={reportRef} className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1 drop-shadow-sm">Analysis Report</h1>
            <p className="text-sm text-muted-foreground">
              {analysisResult.image_info?.filename ?? "Image"}
              {analysisResult.image_info?.size_bytes ? ` · ${formatBytes(analysisResult.image_info.size_bytes)}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {processed && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={exporting !== null}
                      className="bg-gradient-to-r from-[var(--pastel-mint-dark)] to-[var(--pastel-blue-dark)] text-white rounded-2xl font-semibold flex items-center gap-2"
                    >
                      {exporting ? (
                        <RotateCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {exporting ? "Exporting..." : "Export Report"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 rounded-xl p-2">
                    <DropdownMenuItem className="rounded-lg gap-2" onClick={() => handleExport("png")}>
                      <Download className="w-4 h-4" /> PNG Image
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg gap-2" onClick={() => handleExport("jpeg")}>
                      <Download className="w-4 h-4" /> JPEG Image
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg gap-2" onClick={() => handleExport("pdf")}>
                      <FileText className="w-4 h-4" /> PDF Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="hidden sm:flex gap-2">
                  <Button variant="outline" className="rounded-xl flex items-center gap-1" disabled={exporting !== null} onClick={() => handleExport("png")}>
                    <Download className="w-3 h-3" /> PNG
                  </Button>
                  <Button variant="outline" className="rounded-xl flex items-center gap-1" disabled={exporting !== null} onClick={() => handleExport("jpeg")}>
                    <Download className="w-3 h-3" /> JPEG
                  </Button>
                  <Button variant="outline" className="rounded-xl flex items-center gap-1" disabled={exporting !== null} onClick={() => handleExport("pdf")}>
                    <FileText className="w-3 h-3" /> PDF
                  </Button>
                </div>
              </>
            )}
            <Button
              onClick={onNewAnalysis}
              className="bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] text-white rounded-2xl font-semibold hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* ── Row 1: Image Preview + Risk / NLP Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Image Preview */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                <Camera className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
                Uploaded Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative bg-gradient-to-br from-[var(--pastel-blue)]/20 to-[var(--pastel-lavender)]/20 rounded-2xl border-2 border-border overflow-hidden mb-4">
                {imageUrl ? (
                  <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded-xl" crossOrigin="anonymous" />
                ) : (
                  <div className="h-56 flex items-center justify-center text-muted-foreground">Preview unavailable</div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">SCENE</span>
                  <Badge variant="secondary" className="rounded-full text-xs capitalize">{scene}</Badge>
                </div>
                {caption && (
                  <p className="text-sm text-card-foreground bg-accent/40 p-3 rounded-2xl leading-relaxed border border-border">
                    <span className="font-semibold">Caption: </span>{caption}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap pt-1">
                  {va.local_models?.yolo_used  && <Badge variant="outline" className="rounded-full text-xs">YOLOv8</Badge>}
                  {va.local_models?.blip_used  && <Badge variant="outline" className="rounded-full text-xs">BLIP</Badge>}
                  {va.external_apis?.hf_detr_used  && <Badge variant="outline" className="rounded-full text-xs">DETR API</Badge>}
                  {va.external_apis?.ocr_space_used && <Badge variant="outline" className="rounded-full text-xs">OCR.Space</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Overview + NLP Summary */}
          <div className="space-y-6">

            {/* Risk Overview */}
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Risk Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { label: "Manipulation",  level: fa.manipulation_suspicion_level ?? "unknown" },
                    { label: "Hidden Data",   level: sa.hidden_data_likelihood ?? "unknown" },
                    { label: "Malware Risk",  level: ms.malware_suspicion_level ?? "unknown" },
                    { label: "Pattern Risk",  level: pa.pattern_risk ?? "unknown" },
                  ].map(({ label, level }) => (
                    <div key={label} className="p-3 bg-accent/40 rounded-2xl border border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
                      <RiskBadge level={level} />
                    </div>
                  ))}
                </div>
                {(md.metadata_inconsistencies ?? []).length > 0 && (
                  <div className="p-3 rounded-2xl border" style={{ backgroundColor: "#fef9c3", borderColor: "#fde047" }}>
                    <p className="text-xs font-bold mb-1" style={{ color: "#854d0e" }}>⚠ Metadata Anomalies</p>
                    <div className="flex flex-wrap gap-1">
                      {md.metadata_inconsistencies!.map((flag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ color: "#92400e", backgroundColor: "#fde68a" }}>
                          {flag.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* NLP Summary */}
            {nlp.summary && (
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                    <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-card-foreground bg-accent/40 p-4 rounded-2xl border border-border">
                    {nlp.summary}
                  </p>
                  {(nlp.caption_nouns ?? []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {nlp.caption_nouns!.map((noun, i) => (
                        <Badge key={i} variant="secondary" className="rounded-full text-xs capitalize">{noun}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        {/* ── Row 2: Object Detection + OCR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                <Eye className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
                Detected Objects ({objectRows.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {objectRows.length ? (
                <div className="space-y-3">
                  {objectRows.map((row, i) => (
                    <div key={`${row.label}-${i}`} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-card-foreground capitalize">{row.label}</span>
                          {row.source && (
                            <Badge variant="outline" className="rounded-full text-xs">{row.source.replace("_", " ")}</Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="rounded-full text-xs font-bold">
                          {row.pct.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={row.pct} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No objects detected.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                <FileText className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
                Extracted Text ({ocrLines.length} lines)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ocrLines.length ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {ocrLines.map((line, i) => (
                    <div key={`ocr-${i}`} className="flex items-start gap-2">
                      <div className="w-2 h-2 mt-1 bg-[var(--pastel-mint-dark)] rounded-full flex-shrink-0" />
                      <p className="text-sm text-card-foreground leading-relaxed">{line}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-sm text-muted-foreground text-center">No readable text found in this image.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* ── Row 3: Forensic + Steganography + Malware ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Forensic Analysis */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-card-foreground drop-shadow-sm">
                <Search className="w-4 h-4 text-[var(--pastel-lavender-dark)]" />
                Forensic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground mb-2">Manipulation Level</p>
                <RiskBadge level={fa.manipulation_suspicion_level ?? "unknown"} />
                {fa.confidence != null && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Confidence</span><span>{(fa.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(fa.confidence ?? 0) * 100} className="h-1" />
                  </div>
                )}
              </div>
              {[
                { label: "ELA Score",             val: fa.ela?.ela_score,                         flag: fa.ela?.ela_suspicious },
                { label: "Compression Artifacts",  val: fa.compression_artifacts?.blockiness,     flag: fa.compression_artifacts?.artifact_suspicious },
                { label: "Noise Inconsistency",    val: fa.noise_analysis?.noise_inconsistency,   flag: fa.noise_analysis?.noise_suspicious },
              ].map(({ label, val, flag }) => (
                <div key={label} className="p-3 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground" style={{ fontFamily: "monospace" }}>
                      {val != null ? val.toFixed(4) : "—"}
                    </span>
                    <SuspicionFlag flag={flag} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Steganography */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-card-foreground drop-shadow-sm">
                <Lock className="w-4 h-4 text-[var(--pastel-beige-dark)]" />
                Steganography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground mb-2">Hidden Data Likelihood</p>
                <RiskBadge level={sa.hidden_data_likelihood ?? "unknown"} />
                {sa.lsb_suspicion_score != null && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Suspicion Score</span>
                      <span>{(sa.lsb_suspicion_score * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(sa.lsb_suspicion_score ?? 0) * 100} className="h-1" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">LSB Entropy</p>
                <span className="text-sm text-card-foreground" style={{ fontFamily: "monospace" }}>
                  {sa.lsb_entropy?.toFixed(6) ?? "—"}
                </span>
              </div>
              {sa.lsb_channel_metrics && (
                <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Channel Deviations (LSB)</p>
                  {(["blue", "green", "red"] as const).map((ch) => (
                    <div key={ch} className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground capitalize">{ch}</span>
                      <span className="text-card-foreground" style={{ fontFamily: "monospace" }}>
                        {sa.lsb_channel_metrics![ch]?.lsb_balance_deviation?.toFixed(4) ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {(sa.evidence ?? []).length > 0 && (
                <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Evidence</p>
                  {sa.evidence!.map((e, i) => (
                    <p key={i} className="text-xs text-card-foreground" style={{ fontFamily: "monospace" }}>{e}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Malware Scan */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-card-foreground drop-shadow-sm">
                <Shield className="w-4 h-4 text-red-500" />
                Malware Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground mb-2">Risk Level</p>
                <RiskBadge level={ms.malware_suspicion_level ?? "unknown"} />
                <p className="text-xs text-muted-foreground mt-2">{ms.scan_status?.replace(/_/g, " ") ?? ""}</p>
              </div>
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Binary Signatures</p>
                {sigHits.length ? (
                  <div className="flex flex-wrap gap-1">
                    {sigHits.map((h, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded"
                        style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}>
                        {h}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>✓ None found</span>
                )}
              </div>
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Base64 Segments</p>
                <span className="text-sm text-card-foreground" style={{ fontFamily: "monospace" }}>
                  {ms.binary_signature_scan?.base64_segment_count ?? 0}
                </span>
              </div>
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1">YARA Matches</p>
                {yaraHits.length ? (
                  <div className="flex flex-wrap gap-1">
                    {yaraHits.map((h, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded"
                        style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}>
                        {h}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>✓ None matched</span>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ── Row 4: Metadata + Pattern Analysis ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Metadata */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                <Info className="w-5 h-5 text-[var(--pastel-beige-dark)]" />
                Image Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {md.basic_info && (
                <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">File Information</p>
                  <div className="space-y-1">
                    {[
                      { k: "Dimensions", v: `${md.basic_info.width ?? "?"} × ${md.basic_info.height ?? "?"}` },
                      { k: "Format",     v: md.basic_info.format ?? "—" },
                      { k: "Color Mode", v: md.basic_info.mode ?? "—" },
                      { k: "File Size",  v: md.basic_info.size_bytes ? formatBytes(md.basic_info.size_bytes) : "—" },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="text-card-foreground" style={{ fontFamily: "monospace" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Camera &amp; Device</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Camera className="w-3 h-3" /> Camera</span>
                    <span className="text-card-foreground">{md.camera_model !== "not_available" ? md.camera_model : "Not available"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> Timestamp</span>
                    <span className="text-card-foreground">{md.timestamp !== "not_available" ? md.timestamp : "Not available"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" /> GPS</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={md.gps === "present" ? "default" : "secondary"} className="rounded-full text-xs">
                        {md.gps === "present" ? "GPS Present" : "Not available"}
                      </Badge>
                      {md.gps_decimal?.lat != null && md.gps_decimal?.lon != null && (
                        <span className="text-xs font-mono">
                          {md.gps_decimal.lat!.toFixed(6)}, {md.gps_decimal.lon!.toFixed(6)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {md.gps_decimal?.lat != null && md.gps_decimal?.lon != null && (
                <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Location</p>
                  {addressLoading ? (
                    <span className="text-xs text-muted-foreground">Resolving address…</span>
                  ) : address ? (
                    <p className="text-xs text-card-foreground">{address}</p>
                  ) : (
                    <span className="text-xs text-muted-foreground">{addressError || "Readable address not available"}</span>
                  )}
                </div>
              )}
              <div className="p-3 rounded-2xl border"
                style={md.editing_software && md.editing_software !== "not_available"
                  ? { backgroundColor: "#fee2e2", borderColor: "#fca5a5" }
                  : { backgroundColor: "var(--accent)", borderColor: "var(--border)" }}
              >
                <p className="text-xs font-semibold text-muted-foreground mb-1">Editing Software Detected</p>
                <span className="text-sm font-semibold"
                  style={{ color: md.editing_software && md.editing_software !== "not_available" ? "#dc2626" : "#16a34a" }}>
                  {md.editing_software && md.editing_software !== "not_available" ? md.editing_software : "✓ Not detected"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Analysis */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground drop-shadow-sm">
                <Activity className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
                Pattern Analysis
                <div className="ml-auto">
                  <RiskBadge level={pa.pattern_risk ?? "unknown"} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Repeated Blocks",
                  value: (pa.repeated_blocks ?? 0),
                  display: `${((pa.repeated_blocks ?? 0) * 100).toFixed(1)}%`,
                  pct: (pa.repeated_blocks ?? 0) * 100,
                },
                {
                  label: "Texture Irregularity",
                  value: pa.texture_irregularity ?? 0,
                  display: (pa.texture_irregularity ?? 0).toFixed(4),
                  pct: Math.min(100, (pa.texture_irregularity ?? 0) * 50),
                },
                {
                  label: "Noise Inconsistency",
                  value: pa.noise_inconsistency ?? 0,
                  display: (pa.noise_inconsistency ?? 0).toFixed(4),
                  pct: Math.min(100, (pa.noise_inconsistency ?? 0) * 500),
                },
              ].map(({ label, display, pct }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">{label}</span>
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: "monospace" }}>{display}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              ))}
              <div className="p-3 bg-accent/40 rounded-2xl border border-border mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pattern analysis detects copy-move forgery via repeated block matching, GLCM texture
                  irregularities, and localized noise inconsistencies across image regions.
                </p>
              </div>
              {Array.isArray(pa.unique_patterns) && (
                <div className="p-3 bg-accent/40 rounded-2xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Duplicate Patterns</p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Removed Duplicates</span>
                    <span className="font-mono">{pa.duplicates_removed_count ?? 0}</span>
                  </div>
                  {Array.isArray(pa.duplicates_top) && (pa.duplicates_top?.length ?? 0) > 0 && (
                    <div className="space-y-1">
                      {(pa.duplicates_top ?? []).slice(0, 5).map((d: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Pattern {i + 1}</span>
                          <span className="font-mono">{d?.count ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* ── Row 5: Multi-Perspective Report ── */}
        <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center text-card-foreground drop-shadow-sm">
              <Sparkles className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
              Multi-Perspective Intelligence Report
              <Sparkles className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="agent" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-accent/40 p-1">
                <TabsTrigger value="agent"
                  className="rounded-xl font-semibold data-[state=active]:bg-card data-[state=active]:shadow-lg">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Agent
                </TabsTrigger>
                <TabsTrigger value="detective"
                  className="rounded-xl font-semibold data-[state=active]:bg-card data-[state=active]:shadow-lg">
                  <Search className="w-4 h-4 mr-2" />
                  Detective
                </TabsTrigger>
                <TabsTrigger value="user"
                  className="rounded-xl font-semibold data-[state=active]:bg-card data-[state=active]:shadow-lg">
                  <User className="w-4 h-4 mr-2" />
                  Everyday User
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agent" className="mt-6">
                <div className="bg-gradient-to-r from-[var(--pastel-blue)]/20 to-[var(--pastel-blue)]/10 rounded-2xl p-6 border-2 border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
                    <h3 className="font-bold text-card-foreground">Security Assessment</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-card-foreground font-medium">
                    {perspectiveText(persp.agent)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="detective" className="mt-6">
                <div className="bg-gradient-to-r from-[var(--pastel-lavender)]/20 to-[var(--pastel-lavender)]/10 rounded-2xl p-6 border-2 border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-5 h-5 text-[var(--pastel-lavender-dark)]" />
                    <h3 className="font-bold text-card-foreground">Forensic Investigation</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-card-foreground font-medium">
                    {perspectiveText(persp.detective)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="user" className="mt-6">
                <div className="bg-gradient-to-r from-[var(--pastel-mint)]/20 to-[var(--pastel-mint)]/10 rounded-2xl p-6 border-2 border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-[var(--pastel-mint-dark)]" />
                    <h3 className="font-bold text-card-foreground">Everyday Interpretation</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-card-foreground font-medium">
                    {perspectiveText(persp.user)}
                  </p>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
