import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const areas = await db.practiceArea.findMany({
      orderBy: { titleEn: "asc" },
      include: {
        _count: {
          select: { topics: { where: { isActive: true } } },
        },
      },
    });

    const formatted = areas.map((a) => ({
      slug: a.slug,
      titleAr: a.titleAr,
      titleEn: a.titleEn,
      descriptionAr: a.descriptionAr,
      descriptionEn: a.descriptionEn,
      topicCount: a._count.topics,
    }));

    return NextResponse.json({ practiceAreas: formatted });
  } catch (error) {
    console.error("Practice areas API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice areas" },
      { status: 500 }
    );
  }
}
