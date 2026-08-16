"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Scale, Loader2 } from "lucide-react";
import InfographicPreview from "@/components/visualization/InfographicPreview";
import type { InfographicSpec } from "@/lib/infographic-schema";

interface VisualizationData {
  id: string;
  status: string;
  language: string;
  template: string;
  spec: InfographicSpec;
  createdAt: string;
  updatedAt: string;
}

export default function VisualizationPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<VisualizationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    async function fetchVisualization() {
      try {
        const res = await fetch(`/api/visualizations/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "not_found" : "fetch_failed");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.message === "not_found") {
          setError("Visualization not found");
        } else {
          setError("Failed to load visualization");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVisualization();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-legal-surface">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-[oklch(0.45_0.18_270)/0.12] to-[oklch(0.75_0.14_75)/0.08]">
            <Scale className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading visualization...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-legal-surface">
        <div className="flex flex-col items-center gap-5 max-w-md text-center px-6 animate-fade-in">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 ring-1 ring-red-500/10">
            <svg
              className="h-7 w-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-foreground">
              Visualization Not Found
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error ||
                "The visualization you are looking for does not exist or may have been removed."}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-[oklch(0.45_0.18_270)] to-[oklch(0.38_0.15_270)] rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <InfographicPreview
      spec={data.spec}
      visualizationId={data.id}
      status={data.status}
    />
  );
}
