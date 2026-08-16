"use client";

import React from "react";
import { ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface VisualizeAnswerButtonProps {
  language: "ar" | "en";
  disabled?: boolean;
  onClick: () => void;
  state?: "idle" | "loading" | "error";
}

export default function VisualizeAnswerButton({
  language,
  disabled = false,
  onClick,
  state = "idle",
}: VisualizeAnswerButtonProps) {
  const isRTL = language === "ar";

  const labels = {
    idle: {
      ar: "تحويل إلى إنفوجرافيك",
      en: "Visualize as Infographic",
    },
    loading: {
      ar: "جاري التوليد...",
      en: "Generating...",
    },
    error: {
      ar: "فشل التوليد — إعادة المحاولة",
      en: "Generation Failed — Retry",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || state === "loading"}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
        transition-all duration-200 active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          state === "error"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-[#0E6268] text-white hover:bg-[#0A4E53]"
        }
      `}
      dir={isRTL ? "rtl" : "ltr"}
      title={
        state === "error"
          ? labels.error[language]
          : state === "loading"
            ? labels.loading[language]
            : labels.idle[language]
      }
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <ImageIcon className="h-4 w-4" />
      )}
      <span>
        {state === "error"
          ? labels.error[language]
          : state === "loading"
            ? labels.loading[language]
            : labels.idle[language]}
      </span>
    </button>
  );
}
