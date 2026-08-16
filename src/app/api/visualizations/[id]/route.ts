import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─── GET handler ─────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // 1. Fetch from Prisma
    const visualization = await db.visualization.findUnique({
      where: { id },
    });

    // 2. If not found, return 404
    if (!visualization) {
      return NextResponse.json(
        { error: 'Visualization not found' },
        { status: 404 }
      );
    }

    // 3. Parse infographicSpec JSON string back to object
    let spec: unknown;
    try {
      spec = JSON.parse(visualization.infographicSpec);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse infographic spec data' },
        { status: 500 }
      );
    }

    // 4. Return response
    return NextResponse.json({
      id: visualization.id,
      language: visualization.language,
      template: visualization.template,
      status: visualization.status,
      spec,
      createdAt: visualization.createdAt.toISOString(),
      updatedAt: visualization.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Visualization fetch error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to fetch visualization: ${errorMessage}` },
      { status: 500 }
    );
  }
}
