import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';
import { infographicSpecSchema, type InfographicSpec } from '@/lib/infographic-schema';
import {
  VISUALIZATION_SYSTEM_PROMPT,
  DISCLAIMER_AR,
  DISCLAIMER_EN,
  HIGH_RISK_KEYWORDS_AR,
  HIGH_RISK_KEYWORDS_EN,
} from '@/lib/visualization-system-prompt';

// ─── Request schema ────────────────────────────────────
const createVisualizationSchema = z.object({
  answerId: z.string().min(1),
  answerText: z.string().min(20),
  language: z.enum(['ar', 'en']),
  template: z
    .enum(['legal-summary', 'procedural-guide', 'document-checklist', 'deadline-warning'])
    .default('legal-summary'),
});

type CreateVisualizationInput = z.infer<typeof createVisualizationSchema>;

// ─── Helpers ────────────────────────────────────────────
async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function extractSourcesFromText(text: string): string[] {
  // Look for patterns that resemble legal references
  const sourcePatterns = [
    // Article references like "المادة 12" or "Article 12"
    /(?:المادة|مادة|Article|article)\s+\d+/gi,
    // Law references like "قانون العمل رقم 8 لسنة 1996"
    /(?:قانون|Law|law|Act|act)\s+[^.\n]{5,80}/gi,
    // Code references like "المرسوم بالقانون رقم"
    /(?:مرسوم|المرسوم|Decree|decree|Bylaw|bylaw|Instruction|instruction)\s+[^.\n]{5,80}/gi,
  ];

  const sources: string[] = [];
  for (const pattern of sourcePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      sources.push(...new Set(matches));
    }
  }
  return sources;
}

function checkHighRisk(text: string, language: 'ar' | 'en'): boolean {
  const keywords = language === 'ar' ? HIGH_RISK_KEYWORDS_AR : HIGH_RISK_KEYWORDS_EN;
  return keywords.some((keyword) => text.includes(keyword));
}

function hasDisclaimerLikeText(text: string): boolean {
  const disclaimerIndicators = [
    'ليست استشارة قانونية',
    'not legal advice',
    'عامة وليست استشارة',
    'general legal information',
  ];
  return disclaimerIndicators.some((indicator) => text.toLowerCase().includes(indicator));
}

function stripCodeFences(raw: string): string {
  let cleaned = raw.trim();
  // Remove ```json ... ``` or ``` ... ``` fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```\s*$/, '');
  }
  return cleaned.trim();
}

function parseJsonFromLLM(content: string): Record<string, unknown> | null {
  // Try direct parse first
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch {
    // Try stripping code fences
    const cleaned = stripCodeFences(content);
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch {
      // Try to find JSON object in the content
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
          }
        } catch {
          // All parsing attempts failed
        }
      }
    }
  }
  return null;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── LLM call ───────────────────────────────────────────
async function generateInfographicSpec(
  answerText: string,
  language: 'ar' | 'en',
  template: string,
  sources: string[],
  riskLevel: string
): Promise<{ spec: InfographicSpec; model?: string }> {
  const zai = await ZAI.create();
  const disclaimer = language === 'ar' ? DISCLAIMER_AR : DISCLAIMER_EN;

  const llmInput = {
    answerText,
    language,
    jurisdiction: 'Jordan',
    disclaimer,
    lastReviewed: getTodayDate(),
    sources,
    riskLevel,
    template,
  };

  const apiMessages = [
    { role: 'assistant' as const, content: VISUALIZATION_SYSTEM_PROMPT },
    { role: 'user' as const, content: JSON.stringify(llmInput) },
  ];

  const completion = await zai.chat.completions.create({
    messages: apiMessages,
    thinking: { type: 'disabled' },
  });

  const rawContent = completion.choices?.[0]?.message?.content || '';
  const model = completion.model;

  const parsedJson = parseJsonFromLLM(rawContent);
  if (!parsedJson) {
    throw new Error('Failed to parse LLM response as JSON');
  }

  // Validate with Zod schema
  const validationResult = infographicSpecSchema.safeParse(parsedJson);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    throw new Error(
      `LLM output failed validation: ${JSON.stringify(errorDetails)}`
    );
  }

  return { spec: validationResult.data, model };
}

// ─── POST handler ───────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body: unknown = await request.json();
    const parsed = createVisualizationSchema.safeParse(body);

    if (!parsed.success) {
      const errorDetails = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', details: errorDetails },
        { status: 400 }
      );
    }

    const input: CreateVisualizationInput = parsed.data;
    const { answerText, language, template } = input;

    // 2. Validate answer contains key elements
    const hasDisclaimer = hasDisclaimerLikeText(answerText);
    const extractedSources = extractSourcesFromText(answerText);

    // 3. Check for high-risk keywords
    const isHighRisk = checkHighRisk(answerText, language);

    // 4. Build risk level string for LLM context
    const riskLevel = isHighRisk ? 'high' : extractedSources.length > 0 ? 'low' : 'medium';

    // 5–6. Call LLM and validate
    const { spec, model } = await generateInfographicSpec(
      answerText,
      language,
      template,
      extractedSources,
      riskLevel
    );

    // 8. Determine status
    const status =
      isHighRisk || extractedSources.length === 0 ? 'needs_review' : 'generated';

    // 9. Save to Prisma
    const sourceAnswerHash = await hashText(answerText);

    const visualization = await db.visualization.create({
      data: {
        sourceAnswerHash,
        language,
        template,
        inputAnswer: answerText,
        infographicSpec: JSON.stringify(spec),
        status,
        generatedByModel: model || null,
      },
    });

    // 10. Return response
    return NextResponse.json({
      id: visualization.id,
      status: visualization.status,
      spec,
    });
  } catch (error) {
    console.error('Visualization creation error:', error);

    // Handle Zod validation errors from LLM output (return 422)
    if (error instanceof Error && error.message.startsWith('LLM output failed validation')) {
      return NextResponse.json(
        { error: 'LLM output validation failed', details: error.message },
        { status: 422 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to create visualization: ${errorMessage}` },
      { status: 500 }
    );
  }
}
