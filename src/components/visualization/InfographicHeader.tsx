import React from "react";
import { Scale } from "lucide-react";
import type { InfographicSpec } from "@/lib/infographic-schema";

interface InfographicHeaderProps {
  title: string;
  subtitle: string;
  jurisdiction: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  branding: InfographicSpec["branding"];
}

const BRAND = {
  primary: "#0B1F3A",
  secondary: "#0E6268",
  accent: "#C69214",
  background: "#FFFFFF",
  text: "#101828",
  muted: "#667085",
  border: "#D0D5DD",
};

export default function InfographicHeader({
  title,
  subtitle,
  jurisdiction,
  language,
  direction,
  branding,
}: InfographicHeaderProps) {
  const isRTL = direction === "rtl";
  const fontFamily =
    language === "ar"
      ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
      : "'Inter', 'IBM Plex Sans', sans-serif";

  return (
    <div
      style={{
        backgroundColor: branding.primary_color,
        padding: "40px 48px 32px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${branding.secondary_color}, ${branding.accent_color}, ${branding.secondary_color})`,
        }}
      />

      {/* Subtle decorative pattern */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          right: isRTL ? "0" : "auto",
          left: isRTL ? "auto" : "0",
          bottom: 0,
          width: "200px",
          background: `linear-gradient(${isRTL ? "270deg" : "90deg"}, transparent, rgba(255,255,255,0.03))`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isRTL ? "flex-end" : "flex-start",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Jurisdiction badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: branding.secondary_color,
            color: "#FFFFFF",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily,
            marginBottom: "20px",
            letterSpacing: "0.5px",
          }}
        >
          <Scale size={14} style={{ color: "#FFFFFF" }} />
          {jurisdiction}
        </div>

        {/* Title */}
        <h1
          style={{
            color: "#FFFFFF",
            fontFamily,
            fontSize: "32px",
            fontWeight: 800,
            lineHeight: 1.3,
            margin: "0 0 12px 0",
            textAlign: isRTL ? "right" : "left",
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontFamily,
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.6,
            margin: 0,
            textAlign: isRTL ? "right" : "left",
            maxWidth: "880px",
          }}
        >
          {subtitle}
        </p>

        {/* Bottom decorative bar */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "3px",
              borderRadius: "2px",
              backgroundColor: branding.secondary_color,
            }}
          />
          <div
            style={{
              width: "12px",
              height: "3px",
              borderRadius: "2px",
              backgroundColor: branding.accent_color,
            }}
          />
          <div
            style={{
              width: "6px",
              height: "3px",
              borderRadius: "2px",
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
