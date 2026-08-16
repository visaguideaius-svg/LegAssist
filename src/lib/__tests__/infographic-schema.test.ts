import { describe, it, expect } from "vitest";
import {
  infographicSpecSchema,
  infographicSectionSchema,
  infographicSourceSchema,
  type InfographicSpec,
} from "../infographic-schema";

// ─── Valid sample spec ────────────────────────────────
const validSpec: InfographicSpec = {
  language: "en",
  direction: "ltr",
  jurisdiction: "Jordan",
  template: "legal-summary",
  title: "Understanding Jordanian Labor Law",
  subtitle: "A guide to your rights as an employee under Jordanian labor regulations",
  urgency: {
    enabled: true,
    label: "Important",
    text: "Some deadlines may apply to your case",
    severity: "warning",
  },
  sections: [
    {
      number: 1,
      title: "What is the issue?",
      icon: "scales",
      layout: "bullets",
      items: [
        "Jordanian labor law governs employment relationships",
        "The Labor Law No. 8 of 1996 is the primary legislation",
        "Your rights depend on your contract type and duration",
      ],
    },
    {
      number: 2,
      title: "Key factors",
      icon: "warning",
      layout: "two_columns",
      items: [],
      columns: [
        {
          title: "Employee Rights",
          text: "You may be entitled to notice period, severance, and end-of-service benefits",
        },
        {
          title: "Employer Obligations",
          text: "The employer must follow legal procedures for termination",
        },
      ],
    },
    {
      number: 3,
      title: "What to do now",
      icon: "checklist",
      layout: "checklist",
      items: [
        "Review your employment contract",
        "Document any workplace violations",
        "Calculate your entitlements",
      ],
    },
  ],
  sources: [
    {
      label: "Jordanian Labor Law No. 8 of 1996",
      reference: "Article 27",
      url: null,
    },
    {
      label: "Labor Regulation No. 30 of 2008",
      reference: "Article 28",
    },
  ],
  disclaimer:
    "This is general legal information, not legal advice. The outcome may vary depending on the facts and available documents.",
  last_reviewed: "2026-01-15",
  branding: {
    primary_color: "#0B1F3A",
    secondary_color: "#0E6268",
    accent_color: "#C69214",
  },
};

// ─── Arabic variant ──────────────────────────────────
const arabicSpec: InfographicSpec = {
  ...validSpec,
  language: "ar",
  direction: "rtl",
  title: "فهم قانون العمل الأردني",
  subtitle: "دليل لحقوقك كموظف بموجب التشريعات العمالية الأردنية",
  sections: validSpec.sections.map((s) => ({
    ...s,
    title: "ما هو الموضوع؟",
    items: ["يحكم قانون العمل الأردني علاقات العمل"],
  })),
  disclaimer:
    "هذه معلومات قانونية عامة وليست استشارة قانونية. قد تختلف النتيجة حسب الوقائع والمستندات.",
};

describe("InfographicSpec Schema", () => {
  it("validates a correct English infographic spec", () => {
    const result = infographicSpecSchema.safeParse(validSpec);
    expect(result.success).toBe(true);
  });

  it("validates a correct Arabic infographic spec with rtl", () => {
    const result = infographicSpecSchema.safeParse(arabicSpec);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe("ar");
      expect(result.data.direction).toBe("rtl");
    }
  });

  it("validates Arabic produces rtl direction", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      language: "ar",
      direction: "rtl",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.direction).toBe("rtl");
    }
  });

  it("validates English produces ltr direction", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      language: "en",
      direction: "ltr",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.direction).toBe("ltr");
    }
  });

  it("rejects missing disclaimer", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      disclaimer: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing last_reviewed date", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      last_reviewed: "invalid-date",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty sources array", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      sources: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing sections", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      sections: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid template", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      template: "invalid-template",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too many sections (more than 5)", () => {
    const specWith6Sections = {
      ...validSpec,
      sections: Array.from({ length: 6 }, (_, i) => ({
        number: i + 1,
        title: `Section ${i + 1}`,
        icon: "scales" as const,
        layout: "bullets" as const,
        items: ["Item 1"],
      })),
    };
    const result = infographicSpecSchema.safeParse(specWith6Sections);
    expect(result.success).toBe(false);
  });

  it("rejects too many items per section (more than 6)", () => {
    const specWith7Items = {
      ...validSpec,
      sections: [
        {
          number: 1,
          title: "Test",
          icon: "scales" as const,
          layout: "bullets" as const,
          items: Array.from({ length: 7 }, (_, i) => `Item ${i + 1}`),
        },
      ],
    };
    const result = infographicSpecSchema.safeParse(specWith7Items);
    expect(result.success).toBe(false);
  });

  it("rejects invalid jurisdiction", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      jurisdiction: "Iraq",
    });
    expect(result.success).toBe(false);
  });

  it("rejects urgency severity outside enum", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      urgency: { enabled: true, severity: "critical" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts urgency enabled=false with defaults", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      urgency: { enabled: false },
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid source URL", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      sources: [
        {
          label: "Test Source",
          url: "https://example.com/law",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid source URL", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      sources: [
        {
          label: "Test Source",
          url: "not-a-url",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("accepts null URL in sources", () => {
    const result = infographicSpecSchema.safeParse({
      ...validSpec,
      sources: [
        {
          label: "Test Source",
          url: null,
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("InfographicSection Schema", () => {
  it("accepts valid section with bullets layout", () => {
    const result = infographicSectionSchema.safeParse({
      number: 1,
      title: "Test Section",
      icon: "scales",
      layout: "bullets",
      items: ["Item 1", "Item 2"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts section with two_columns layout", () => {
    const result = infographicSectionSchema.safeParse({
      number: 1,
      title: "Test Section",
      icon: "scales",
      layout: "two_columns",
      items: [],
      columns: [
        { title: "Col 1", text: "Text 1" },
        { title: "Col 2", text: "Text 2" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects more than 2 columns", () => {
    const result = infographicSectionSchema.safeParse({
      number: 1,
      title: "Test Section",
      icon: "scales",
      layout: "two_columns",
      items: [],
      columns: [
        { title: "Col 1", text: "Text 1" },
        { title: "Col 2", text: "Text 2" },
        { title: "Col 3", text: "Text 3" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid icon name", () => {
    const result = infographicSectionSchema.safeParse({
      number: 1,
      title: "Test Section",
      icon: "invalid_icon",
      layout: "bullets",
      items: ["Item 1"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid layout type", () => {
    const result = infographicSectionSchema.safeParse({
      number: 1,
      title: "Test Section",
      icon: "scales",
      layout: "grid",
      items: ["Item 1"],
    });
    expect(result.success).toBe(false);
  });
});

describe("InfographicSource Schema", () => {
  it("accepts source with just label", () => {
    const result = infographicSourceSchema.safeParse({
      label: "Test Law",
    });
    expect(result.success).toBe(true);
  });

  it("accepts source with label, reference, and URL", () => {
    const result = infographicSourceSchema.safeParse({
      label: "Test Law",
      reference: "Article 12",
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty label", () => {
    const result = infographicSourceSchema.safeParse({
      label: "",
    });
    expect(result.success).toBe(false);
  });
});
