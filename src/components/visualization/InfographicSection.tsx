import React from "react";
import {
  CircleDot,
  CircleCheck,
  FileText,
  Clock,
  ChevronRight,
} from "lucide-react";
import iconMap from "./icon-map";
import type { InfographicSection as InfographicSectionType, InfographicSpec } from "@/lib/infographic-schema";

interface InfographicSectionProps {
  section: InfographicSectionType;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  branding: InfographicSpec["branding"];
}

function getFontFamily(language: "ar" | "en") {
  return language === "ar"
    ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
    : "'Inter', 'IBM Plex Sans', sans-serif";
}

function NumberBadge({
  number,
  branding,
}: {
  number: number;
  branding: InfographicSpec["branding"];
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px",
        height: "44px",
        minWidth: "44px",
        borderRadius: "12px",
        backgroundColor: branding.secondary_color,
        color: "#FFFFFF",
        fontSize: "18px",
        fontWeight: 800,
        fontFamily: "'Inter', 'IBM Plex Sans', sans-serif",
        boxShadow: `0 2px 8px ${branding.secondary_color}40`,
      }}
    >
      {number}
    </div>
  );
}

function SectionIcon({
  iconName,
  branding,
}: {
  iconName: string;
  branding: InfographicSpec["branding"];
}) {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        minWidth: "36px",
        borderRadius: "10px",
        backgroundColor: `${branding.primary_color}15`,
      }}
    >
      <IconComponent size={18} style={{ color: branding.primary_color }} />
    </div>
  );
}

function renderBullets(
  items: string[],
  language: "ar" | "en",
  direction: "rtl" | "ltr",
  branding: InfographicSpec["branding"]
) {
  const fontFamily = getFontFamily(language);
  const isRTL = direction === "rtl";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "3px",
              minWidth: "8px",
            }}
          >
            <CircleDot
              size={8}
              style={{ color: branding.secondary_color }}
            />
          </div>
          <span
            style={{
              fontFamily,
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "#344054",
              flex: 1,
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderChecklist(
  items: string[],
  language: "ar" | "en",
  direction: "rtl" | "ltr",
  branding: InfographicSpec["branding"]
) {
  const fontFamily = getFontFamily(language);
  const isRTL = direction === "rtl";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              minWidth: "24px",
              borderRadius: "7px",
              backgroundColor: `${branding.secondary_color}18`,
              marginTop: "1px",
            }}
          >
            <CircleCheck
              size={16}
              style={{ color: branding.secondary_color }}
            />
          </div>
          <span
            style={{
              fontFamily,
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "#344054",
              flex: 1,
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderTwoColumns(
  columns: NonNullable<InfographicSectionType["columns"]>,
  language: "ar" | "en",
  direction: "rtl" | "ltr",
  branding: InfographicSpec["branding"]
) {
  const fontFamily = getFontFamily(language);
  const isRTL = direction === "rtl";

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {columns.map((col, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            backgroundColor: "#F8F9FB",
            border: "1px solid #E4E7EC",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                minWidth: "32px",
                borderRadius: "8px",
                backgroundColor: `${branding.accent_color}20`,
              }}
            >
              <ChevronRight
                size={16}
                style={{
                  color: branding.accent_color,
                  transform: isRTL ? "rotate(180deg)" : "none",
                }}
              />
            </div>
            <span
              style={{
                fontFamily,
                fontSize: "15px",
                fontWeight: 700,
                color: branding.primary_color,
                lineHeight: 1.4,
              }}
            >
              {col.title}
            </span>
          </div>
          <p
            style={{
              fontFamily,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "#475467",
              margin: 0,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {col.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function renderTimeline(
  items: string[],
  language: "ar" | "en",
  direction: "rtl" | "ltr",
  branding: InfographicSpec["branding"]
) {
  const fontFamily = getFontFamily(language);
  const isRTL = direction === "rtl";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        position: "relative",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          bottom: "14px",
          [isRTL ? "right" : "left"]: "21px",
          width: "2px",
          backgroundColor: "#E4E7EC",
        }}
      />

      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            paddingBottom: idx < items.length - 1 ? "18px" : 0,
            position: "relative",
          }}
        >
          {/* Numbered circle */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              minWidth: "44px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: `2px solid ${branding.secondary_color}`,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 800,
                color: branding.secondary_color,
              }}
            >
              {idx + 1}
            </span>
          </div>

          {/* Content card */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#F8F9FB",
              border: "1px solid #E4E7EC",
              borderRadius: "10px",
              padding: "14px 18px",
              marginTop: "2px",
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "#344054",
              }}
            >
              {item}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderDocuments(
  items: string[],
  language: "ar" | "en",
  direction: "rtl" | "ltr",
  branding: InfographicSpec["branding"]
) {
  const fontFamily = getFontFamily(language);
  const isRTL = direction === "rtl";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#FAFBFC",
            border: "1px solid #E4E7EC",
            borderRadius: "10px",
            padding: "14px 18px",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              minWidth: "36px",
              borderRadius: "8px",
              backgroundColor: `${branding.accent_color}18`,
            }}
          >
            <FileText size={18} style={{ color: branding.accent_color }} />
          </div>
          <span
            style={{
              fontFamily,
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#344054",
              flex: 1,
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function InfographicSection({
  section,
  language,
  direction,
  branding,
}: InfographicSectionProps) {
  const fontFamily = getFontFamily(language);
  const isRTL = direction === "rtl";

  return (
    <div
      style={{
        margin: "0 32px 20px 32px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E4E7EC",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <NumberBadge number={section.number} branding={branding} />
        <SectionIcon iconName={section.icon} branding={branding} />
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontFamily,
              fontSize: "18px",
              fontWeight: 700,
              color: branding.primary_color,
              margin: 0,
              lineHeight: 1.4,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {section.title}
          </h2>
          {/* Subtle divider */}
          <div
            style={{
              marginTop: "6px",
              height: "2px",
              width: "40px",
              borderRadius: "1px",
              backgroundColor: branding.secondary_color,
              ...(isRTL ? { marginLeft: "auto" } : {}),
            }}
          />
        </div>
      </div>

      {/* Section content based on layout */}
      <div style={{ paddingLeft: isRTL ? 0 : "60px", paddingRight: isRTL ? "60px" : 0 }}>
        {section.layout === "bullets" &&
          renderBullets(section.items, language, direction, branding)}
        {section.layout === "checklist" &&
          renderChecklist(section.items, language, direction, branding)}
        {section.layout === "two_columns" &&
          section.columns &&
          renderTwoColumns(section.columns, language, direction, branding)}
        {section.layout === "timeline" &&
          renderTimeline(section.items, language, direction, branding)}
        {section.layout === "documents" &&
          renderDocuments(section.items, language, direction, branding)}
      </div>
    </div>
  );
}
