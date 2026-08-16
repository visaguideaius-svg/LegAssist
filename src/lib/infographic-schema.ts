import { z } from "zod";

// ─── Section Schema ────────────────────────────────────
export const infographicSectionSchema = z.object({
  number: z.number().int().min(1).max(8),
  title: z.string().min(1).max(120),
  icon: z.enum([
    "scales",
    "warning",
    "clock",
    "calendar",
    "documents",
    "folder",
    "money",
    "shield",
    "gavel",
    "checklist",
    "person",
  ]),
  layout: z.enum(["bullets", "checklist", "two_columns", "timeline", "documents"]),
  items: z.array(z.string().min(1).max(180)).max(6).default([]),
  columns: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        text: z.string().min(1).max(220),
        icon: z.string().optional(),
      })
    )
    .max(2)
    .optional(),
});

// ─── Source Schema ──────────────────────────────────────
export const infographicSourceSchema = z.object({
  label: z.string().min(1).max(250),
  reference: z.string().max(250).optional(),
  url: z.string().url().nullable().optional(),
});

// ─── Full InfographicSpec Schema ────────────────────────
export const infographicSpecSchema = z.object({
  language: z.enum(["ar", "en"]),
  direction: z.enum(["rtl", "ltr"]),
  jurisdiction: z.literal("Jordan"),
  template: z.enum([
    "legal-summary",
    "procedural-guide",
    "document-checklist",
    "deadline-warning",
  ]),
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(180),

  urgency: z.object({
    enabled: z.boolean(),
    label: z.string().max(60).optional(),
    text: z.string().max(180).optional(),
    severity: z.enum(["info", "warning", "urgent"]).default("info"),
  }),

  sections: z.array(infographicSectionSchema).min(2).max(5),

  sources: z.array(infographicSourceSchema).min(1).max(4),

  disclaimer: z.string().min(1).max(300),
  last_reviewed: z.string().date(),

  branding: z.object({
    primary_color: z.string(),
    secondary_color: z.string(),
    accent_color: z.string(),
    logo_url: z.string().optional(),
  }),
});

export type InfographicSpec = z.infer<typeof infographicSpecSchema>;
export type InfographicSection = z.infer<typeof infographicSectionSchema>;
export type InfographicSource = z.infer<typeof infographicSourceSchema>;
