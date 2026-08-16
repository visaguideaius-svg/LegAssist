import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const topic = await db.topic.findUnique({
      where: { slug, isActive: true },
      include: {
        practiceArea: true,
        versions: {
          where: { isCurrent: true },
          take: 1,
        },
        legalSources: {
          include: { legalSource: true },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const formatted = {
      id: topic.id,
      slug: topic.slug,
      titleAr: topic.titleAr,
      titleEn: topic.titleEn,
      practiceArea: {
        slug: topic.practiceArea.slug,
        titleAr: topic.practiceArea.titleAr,
        titleEn: topic.practiceArea.titleEn,
      },
      audience: JSON.parse(topic.audience),
      urgency: topic.urgency,
      contentType: topic.contentType,
      contentJson: topic.versions[0]?.contentJson
        ? JSON.parse(topic.versions[0].contentJson)
        : null,
      lastReviewed: topic.versions[0]?.lastReviewedAt ?? null,
      confidenceLevel: topic.versions[0]?.confidenceLevel ?? null,
      legalSources: topic.legalSources.map((tls) => ({
        id: tls.legalSource.id,
        sourceType: tls.legalSource.sourceType,
        titleAr: tls.legalSource.titleAr,
        titleEn: tls.legalSource.titleEn,
        referenceNumber: tls.legalSource.referenceNumber,
        articleNumber: tls.legalSource.articleNumber,
        effectiveDate: tls.legalSource.effectiveDate,
        sourceUrl: tls.legalSource.sourceUrl,
        notes: tls.legalSource.notes,
        relevanceNoteAr: tls.relevanceNoteAr,
        relevanceNoteEn: tls.relevanceNoteEn,
      })),
    };

    return NextResponse.json({ topic: formatted });
  } catch (error) {
    console.error("Topic detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}
