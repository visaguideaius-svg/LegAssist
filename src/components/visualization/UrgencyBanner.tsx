import React from "react";
import { AlertTriangle, Info } from "lucide-react";
import type { InfographicSpec } from "@/lib/infographic-schema";

interface UrgencyBannerProps {
  urgency: InfographicSpec["urgency"];
  language: "ar" | "en";
}

export default function UrgencyBanner({ urgency, language }: UrgencyBannerProps) {
  if (!urgency.enabled) return null;

  const fontFamily =
    language === "ar"
      ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
      : "'Inter', 'IBM Plex Sans', sans-serif";

  const isRTL = language === "ar";

  const severityConfig: Record<
    string,
    { bg: string; border: string; textColor: string; iconBg: string }
  > = {
    info: {
      bg: "#0E6268",
      border: "#0A4E53",
      textColor: "#FFFFFF",
      iconBg: "rgba(255,255,255,0.2)",
    },
    warning: {
      bg: "#C69214",
      border: "#A67910",
      textColor: "#FFFFFF",
      iconBg: "rgba(255,255,255,0.2)",
    },
    urgent: {
      bg: "#B91C1C",
      border: "#991B1B",
      textColor: "#FFFFFF",
      iconBg: "rgba(255,255,255,0.25)",
    },
  };

  const config = severityConfig[urgency.severity] || severityConfig.info;
  const label =
    urgency.label ||
    (language === "ar"
      ? urgency.severity === "info"
        ? "تنبيه"
        : urgency.severity === "warning"
          ? "تحذير"
          : "عاجل"
      : urgency.severity === "info"
        ? "Notice"
        : urgency.severity === "warning"
          ? "Warning"
          : "Urgent");

  const IconComponent =
    urgency.severity === "info" ? Info : AlertTriangle;

  return (
    <div
      style={{
        backgroundColor: config.bg,
        borderBottom: `3px solid ${config.border}`,
        padding: "16px 48px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          minWidth: "40px",
          borderRadius: "10px",
          backgroundColor: config.iconBg,
        }}
      >
        <IconComponent size={22} style={{ color: config.textColor }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: urgency.text ? "4px" : 0,
          }}
        >
          <span
            style={{
              color: config.textColor,
              fontFamily,
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {label}
          </span>
        </div>
        {urgency.text && (
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontFamily,
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {urgency.text}
          </p>
        )}
      </div>
    </div>
  );
}
