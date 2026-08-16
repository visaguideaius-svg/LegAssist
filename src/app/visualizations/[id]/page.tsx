"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-[#0E6268] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">
            Loading visualization...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            Visualization Not Found
          </h2>
          <p className="text-sm text-gray-500">
            {error ||
              "The visualization you are looking for does not exist or may have been removed."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0E6268] hover:bg-[#0A4E53] rounded-lg transition-colors"
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
