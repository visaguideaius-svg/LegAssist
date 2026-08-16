import { NextRequest, NextResponse } from 'next/server';
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

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─── Helpers ────────────────────────────────────────────
function extractSourcesFromText(text: string): string[] {
  const sourcePatterns = [
    /(?:المادة|مادة|Article|article)\s+\d+/gi,
    /(?:قانون|Law|law|Act|act)\s+[^.\n]{5,80}/gi,
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

function parseJsonFromLLM(content: string): Record<string, unknown> | null {
  // Try direct parse first
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch {
    // Try stripping code fences
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/\n?```\s*$/, '');
    }
    cleaned = cleaned.trim();

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

// ─── POST handler ───────────────────────────────────────
export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // 1. Fetch existing visualization from Prisma
    const existing = await db.visualization.findUnique({
      where: { id },
    });

    // 2. If not found, return 404
    if (!existing) {
      return NextResponse.json(
        { error: 'Visualization not found' },
        { status: 404 }
      );
    }

    const language = existing.language as 'ar' | 'en';
    const template = existing.template;
    const inputAnswer = existing.inputAnswer;

    // 3. Build LLM input from original data
    const disclaimer = language === 'ar' ? DISCLAIMER_AR : DISCLAIMER_EN;
    const extractedSources = extractSourcesFromText(inputAnswer);
    const isHighRisk = checkHighRisk(inputAnswer, language);
    const riskLevel = isHighRisk ? 'high' : extractedSources.length > 0 ? 'low' : 'medium';

    const llmInput = {
      answerText: inputAnswer,
      language,
      jurisdiction: 'Jordan',
      disclaimer,
      lastReviewed: getTodayDate(),
      sources: extractedSources,
      riskLevel,
      template,
    };

    // 4. Call LLM again
    const zai = await ZAI.create();

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

    // 5. Parse and validate
    const parsedJson = parseJsonFromLLM(rawContent);
    if (!parsedJson) {
      return NextResponse.json(
        { error: 'Failed to parse LLM response as JSON' },
        { status: 422 }
      );
    }

    const validationResult = infographicSpecSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: 'LLM output validation failed', details: errorDetails },
        { status: 422 }
      );
    }

    const spec: InfographicSpec = validationResult.data;

    // 6. Determine status
    const status =
      isHighRisk || extractedSources.length === 0 ? 'needs_review' : 'generated';

    // 7. Update Prisma record
    const updated = await db.visualization.update({
      where: { id },
      data: {
        infographicSpec: JSON.stringify(spec),
        status,
        generatedByModel: model || null,
      },
    });

    // 8. Return response
    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      spec,
    });
  } catch (error) {
    console.error('Visualization regeneration error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to regenerate visualization: ${errorMessage}` },
      { status: 500 }
    );
  }
}
