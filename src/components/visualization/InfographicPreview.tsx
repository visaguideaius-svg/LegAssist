"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  FileDown,
  RefreshCw,
  ArrowLeft,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import LegalInfographic from "./LegalInfographic";
import type { InfographicSpec } from "@/lib/infographic-schema";

interface InfographicPreviewProps {
  spec: InfographicSpec;
  visualizationId: string;
  status: string;
}

export default function InfographicPreview({
  spec,
  visualizationId,
  status,
}: InfographicPreviewProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const infographicRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Responsive scaling to fit viewport
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const availableWidth = containerWidth - 48;
      const newScale = Math.min(availableWidth / 1080, 1);
      setScale(newScale);
    }
  }, []);

  useEffect(() => {
    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [updateScale]);

  const needsReview = status === "needs_review";

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const element = infographicRef.current;
      if (!element) return;

      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(element, {
        width: 1080,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `infographic-${visualizationId}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setDownloadError(
        spec.language === "ar"
          ? "تعذر تنزيل الصورة حالياً"
          : "Unable to download image"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const element = infographicRef.current;
      if (!element) return;

      const { default: jsPDF } = await import("jspdf");
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(element, {
        width: 1080,
        pixelRatio: 2,
        cacheBust: true,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdfWidth = 1080 * 0.264583;
      const pdfHeight = (img.height / img.width) * pdfWidth;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`infographic-${visualizationId}.pdf`);
    } catch {
      setDownloadError(
        spec.language === "ar"
          ? "تعذر تنزيل PDF حالياً"
          : "Unable to download PDF"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const isRTL = spec.direction === "rtl";
  const lang = spec.language;

  return (
    <div
      className="min-h-screen bg-legal-surface flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Toolbar — glass style */}
      <div className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-legal-surface-overlay rounded-xl transition-colors duration-200"
              aria-label={lang === "ar" ? "رجوع" : "Back"}
            >
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
              />
              {lang === "ar" ? "رجوع" : "Back"}
            </button>

            <div className="h-6 w-px bg-border/50" />

            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[var(--legal-cedar)]" />
              <span className="text-sm font-semibold text-foreground">
                {lang === "ar" ? "معاينة" : "Preview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status badge */}
            {needsReview && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--legal-terracotta-muted)] text-[var(--legal-terracotta)] border border-[var(--legal-terracotta)]/15">
                <AlertCircle className="h-3.5 w-3.5" />
                {lang === "ar" ? "يحتاج مراجعة" : "Needs Review"}
              </span>
            )}

            {/* Download PNG */}
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#c9a962] hover:bg-[#b8963f] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              PNG
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <FileDown className="h-4 w-4" />
              PDF
            </button>

            {/* Regenerate */}
            <button
              onClick={async () => {
                setIsRegenerating(true);
                try {
                  const res = await fetch(
                    `/api/visualizations/${visualizationId}/regenerate`,
                    { method: "POST" }
                  );
                  if (res.ok) {
                    const data = await res.json();
                    router.push(`/visualizations/${data.id}`);
                  }
                } catch {
                  // Silently fail
                } finally {
                  setIsRegenerating(false);
                }
              }}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-legal-surface-elevated border border-border/60 hover:text-foreground hover:bg-legal-surface-overlay disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
            >
              {isRegenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {lang === "ar" ? "إعادة توليد" : "Regenerate"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Error toast */}
      {downloadError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-xl shadow-lg animate-slide-in-bottom">
          <AlertCircle className="h-4 w-4" />
          {downloadError}
        </div>
      )}

      {/* Preview area */}
      <div className="flex-1 flex items-start justify-center py-8 px-4 overflow-auto bg-legal-surface">
        <div ref={containerRef} className="w-full max-w-[1128px]">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              marginBottom: `${(1 / scale) * 100}%`,
            }}
          >
            <div ref={infographicRef}>
              <LegalInfographic spec={spec} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
