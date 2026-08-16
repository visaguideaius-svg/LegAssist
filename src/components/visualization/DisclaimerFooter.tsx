import React from "react";
import { ShieldAlert } from "lucide-react";

interface DisclaimerFooterProps {
  disclaimer: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
}

export default function DisclaimerFooter({
  disclaimer,
  language,
  direction,
}: DisclaimerFooterProps) {
  const fontFamily =
    language === "ar"
      ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
      : "'Inter', 'IBM Plex Sans', sans-serif";
  const isRTL = direction === "rtl";

  const label =
    language === "ar" ? "إخلاء مسؤولية" : "Disclaimer";

  return (
    <div
      style={{
        backgroundColor: "#F8F9FB",
        padding: "20px 48px",
        borderTop: "1px solid #E4E7EC",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            minWidth: "32px",
            borderRadius: "8px",
            backgroundColor: "#F2F4F7",
          }}
        >
          <ShieldAlert size={16} style={{ color: "#667085" }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily,
              fontSize: "12px",
              fontWeight: 700,
              color: "#667085",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            {label}
          </span>
          <p
            style={{
              fontFamily,
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "#667085",
              margin: 0,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {disclaimer}
          </p>

          {/* Jurisdiction badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginTop: "10px",
              backgroundColor: "#EAECF0",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: "#475467",
            }}
          >
            Jordan
          </div>
        </div>
      </div>
    </div>
  );
}
