import React from "react";
import InfographicHeader from "./InfographicHeader";
import UrgencyBanner from "./UrgencyBanner";
import InfographicSection from "./InfographicSection";
import LegalSourcesFooter from "./LegalSourcesFooter";
import DisclaimerFooter from "./DisclaimerFooter";
import BrandFooter from "./BrandFooter";
import type { InfographicSpec } from "@/lib/infographic-schema";

interface LegalInfographicProps {
  spec: InfographicSpec;
}

export default function LegalInfographic({ spec }: LegalInfographicProps) {
  return (
    <div
      id="legal-infographic"
      style={{
        width: "1080px",
        minHeight: "1350px",
        backgroundColor: "#FFFFFF",
        direction: spec.direction,
        fontFamily:
          spec.language === "ar"
            ? "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Cairo', sans-serif"
            : "'Inter', 'IBM Plex Sans', sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <InfographicHeader
        title={spec.title}
        subtitle={spec.subtitle}
        jurisdiction={spec.jurisdiction}
        language={spec.language}
        direction={spec.direction}
        branding={spec.branding}
      />

      {/* Urgency Banner */}
      {spec.urgency.enabled && (
        <UrgencyBanner
          urgency={spec.urgency}
          language={spec.language}
        />
      )}

      {/* Sections */}
      <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        {spec.sections.map((section) => (
          <InfographicSection
            key={section.number}
            section={section}
            language={spec.language}
            direction={spec.direction}
            branding={spec.branding}
          />
        ))}
      </div>

      {/* Sources */}
      <LegalSourcesFooter
        sources={spec.sources}
        language={spec.language}
        direction={spec.direction}
      />

      {/* Disclaimer */}
      <DisclaimerFooter
        disclaimer={spec.disclaimer}
        language={spec.language}
        direction={spec.direction}
      />

      {/* Brand Footer */}
      <BrandFooter
        language={spec.language}
        direction={spec.direction}
      />
    </div>
  );
}
