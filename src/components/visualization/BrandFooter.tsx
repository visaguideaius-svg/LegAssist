import React from "react";

interface BrandFooterProps {
  language: "ar" | "en";
  direction: "rtl" | "ltr";
}

export default function BrandFooter({ language, direction }: BrandFooterProps) {
  const fontFamily =
    language === "ar"
      ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
      : "'Inter', 'IBM Plex Sans', sans-serif";
  const isRTL = direction === "rtl";

  const platformName =
    language === "ar"
      ? "منصة المعرفة القانونية الأردنية"
      : "Jordanian Legal Knowledge Platform";

  return (
    <div
      style={{
        backgroundColor: "#0B1F3A",
        padding: "14px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: isRTL ? "flex-end" : "flex-start",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: "11px",
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.5)",
          letterSpacing: "0.5px",
        }}
      >
        {platformName}
      </span>
    </div>
  );
}
