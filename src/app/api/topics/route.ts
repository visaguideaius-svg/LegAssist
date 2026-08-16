import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const topics = await db.topic.findMany({
      where: { isActive: true },
      include: {
        practiceArea: true,
        versions: {
          where: { isCurrent: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = topics.map((t) => ({
      id: t.id,
      slug: t.slug,
      titleAr: t.titleAr,
      titleEn: t.titleEn,
      practiceArea: {
        slug: t.practiceArea.slug,
        titleAr: t.practiceArea.titleAr,
        titleEn: t.practiceArea.titleEn,
      },
      audience: JSON.parse(t.audience),
      urgency: t.urgency,
      contentType: t.contentType,
      contentJson: t.versions[0]?.contentJson
        ? JSON.parse(t.versions[0].contentJson)
        : null,
      lastReviewed: t.versions[0]?.lastReviewedAt ?? null,
      confidenceLevel: t.versions[0]?.confidenceLevel ?? null,
    }));

    return NextResponse.json({ topics: formatted });
  } catch (error) {
    console.error("Topics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
