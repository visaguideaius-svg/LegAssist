import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import type { InfographicSource } from "@/lib/infographic-schema";

interface LegalSourcesFooterProps {
  sources: InfographicSource[];
  language: "ar" | "en";
  direction: "rtl" | "ltr";
}

const BRAND = {
  secondary: "#0E6268",
};

export default function LegalSourcesFooter({
  sources,
  language,
  direction,
}: LegalSourcesFooterProps) {
  const fontFamily =
    language === "ar"
      ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
      : "'Inter', 'IBM Plex Sans', sans-serif";
  const isRTL = direction === "rtl";

  const heading =
    language === "ar" ? "المصادر القانونية" : "Legal Sources";

  return (
    <div
      style={{
        backgroundColor: BRAND.secondary,
        padding: "24px 48px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <h3
        style={{
          fontFamily,
          fontSize: "14px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: "14px",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {heading}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {sources.map((source, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                minWidth: "28px",
                borderRadius: "7px",
                backgroundColor: "rgba(255,255,255,0.15)",
                marginTop: "1px",
              }}
            >
              <FileText size={14} style={{ color: "#FFFFFF" }} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    lineHeight: 1.5,
                  }}
                >
                  {source.label}
                </span>
                {source.reference && (
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.7)",
                      backgroundColor: "rgba(255,255,255,0.12)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {source.reference}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
