"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Briefcase,
  Home,
  Users,
  CreditCard,
  Car,
  Shield,
  Building2,
  Gavel,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  Scale,
  AlertTriangle,
  UserCheck,
  Loader2,
} from "lucide-react";

/* ───────── Types ───────── */
interface PracticeArea {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  topicCount: number;
}

interface TopicSummary {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  practiceArea: { slug: string; titleAr: string; titleEn: string };
  audience: string[];
  urgency: string;
}

interface TopicDetail extends TopicSummary {
  contentJson: TopicContent | null;
  lastReviewed: string | null;
  confidenceLevel: string | null;
  legalSources: LegalSourceRef[];
}

interface TopicContent {
  user_questions?: string[];
  key_facts?: string[];
  explanation_ar?: string;
  explanation_en?: string;
  steps_employee?: string[];
  steps_employer?: string[];
  steps_tenant?: string[];
  steps_landlord?: string[];
  documents_to_keep?: string[];
  deadlines?: string[];
  competent_authorities_ar?: string;
  competent_authorities_en?: string;
  when_to_see_lawyer?: string[];
  disclaimer_ar?: string;
  disclaimer_en?: string;
}

interface LegalSourceRef {
  sourceType: string;
  titleAr: string;
  titleEn: string;
  referenceNumber: string;
  articleNumber: string | null;
  effectiveDate: string;
  sourceUrl: string | null;
  notes: string | null;
}

/* ───────── Constants ───────── */
const PRACTICE_ICONS: Record<string, React.ReactNode> = {
  labor: <Briefcase className="h-4 w-4" />,
  rent: <Home className="h-4 w-4" />,
  family: <Users className="h-4 w-4" />,
  debt: <CreditCard className="h-4 w-4" />,
  traffic: <Car className="h-4 w-4" />,
  cybercrime: <Shield className="h-4 w-4" />,
  court_procedure: <Building2 className="h-4 w-4" />,
  small_business: <Gavel className="h-4 w-4" />,
};

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

/* ───────── Props ───────── */
interface KnowledgeLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: "ar" | "en";
  onSelectTopic: (topic: TopicSummary) => void;
}

/* ───────── Component ───────── */
export default function KnowledgeLibrary({
  open,
  onOpenChange,
  language,
  onSelectTopic,
}: KnowledgeLibraryProps) {
  const isRTL = language === "ar";
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (open && practiceAreas.length === 0) {
      fetchLibrary();
    }
  }, [open]);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const [areasRes, topicsRes] = await Promise.all([
        fetch("/api/practice-areas"),
        fetch("/api/topics"),
      ]);
      const areasData = await areasRes.json();
      const topicsData = await topicsRes.json();
      setPracticeAreas(areasData.practiceAreas || []);
      setTopics(topicsData.topics || []);
    } catch (e) {
      console.error("Failed to fetch library:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicDetail = async (slug: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/topics/${slug}`);
      const data = await res.json();
      setSelectedTopic(data.topic);
    } catch (e) {
      console.error("Failed to fetch topic detail:", e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleTopicClick = (topic: TopicSummary) => {
    fetchTopicDetail(topic.slug);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  const getSteps = (content: TopicContent | null) => {
    if (!content) return [];
    if (content.steps_employee) return { labelAr: "خطوات الموظف", labelEn: "Employee Steps", steps: content.steps_employee };
    if (content.steps_tenant) return { labelAr: "خطوات المستأجر", labelEn: "Tenant Steps", steps: content.steps_tenant };
    return { labelAr: "خطوات", labelEn: "Steps", steps: [] };
  };

  const getSteps2 = (content: TopicContent | null) => {
    if (!content) return null;
    if (content.steps_employer) return { labelAr: "خطوات صاحب العمل", labelEn: "Employer Steps", steps: content.steps_employer };
    if (content.steps_landlord) return { labelAr: "خطوات المالك", labelEn: "Landlord Steps", steps: content.steps_landlord };
    return null;
  };

  /* ── Topic Detail View ── */
  if (selectedTopic) {
    const content = selectedTopic.contentJson;
    const steps1 = getSteps(content);
    const steps2 = getSteps2(content);

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={isRTL ? "right" : "left"}
          className="w-full sm:max-w-lg p-0 flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-border px-4 py-3 shrink-0">
            <SheetHeader className="text-start space-y-0">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors"
                >
                  {isRTL ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
                <SheetTitle className="text-sm font-bold leading-tight">
                  {isRTL ? selectedTopic.titleAr : selectedTopic.titleEn}
                </SheetTitle>
              </div>
              <SheetDescription className="text-[11px]">
                {selectedTopic.practiceArea
                  ? isRTL
                    ? selectedTopic.practiceArea.titleAr
                    : selectedTopic.practiceArea.titleEn
                  : ""}
                {selectedTopic.confidenceLevel && (
                  <Badge
                    variant="secondary"
                    className={`ml-2 text-[10px] px-1.5 py-0 ${
                      selectedTopic.confidenceLevel === "high"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isRTL
                      ? selectedTopic.confidenceLevel === "high"
                        ? "ثقة عالية"
                        : "ثقة متوسطة"
                      : selectedTopic.confidenceLevel}
                  </Badge>
                )}
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="px-4 py-4 space-y-4">
              {/* Explanation */}
              {content && (
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-sm leading-relaxed">
                    {isRTL ? content.explanation_ar : content.explanation_en}
                  </p>
                </div>
              )}

              {/* Key Facts */}
              {content?.key_facts && content.key_facts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-primary" />
                    {isRTL ? "حقائق رئيسية" : "Key Facts"}
                  </h4>
                  <ul className="space-y-1">
                    {content.key_facts.map((fact, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps 1 */}
              {steps1 && steps1.steps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    {isRTL ? steps1.labelAr : steps1.labelEn}
                  </h4>
                  <ol className="space-y-1.5">
                    {steps1.steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Steps 2 */}
              {steps2 && steps2.steps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    {isRTL ? steps2.labelAr : steps2.labelEn}
                  </h4>
                  <ol className="space-y-1.5">
                    {steps2.steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Documents */}
              {content?.documents_to_keep && content.documents_to_keep.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-primary" />
                    {isRTL ? "مستندات يجب الاحتفاظ بها" : "Documents to Keep"}
                  </h4>
                  <ul className="space-y-1">
                    {content.documents_to_keep.map((doc, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deadlines */}
              {content?.deadlines && content.deadlines.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    {isRTL ? "مواعيد مهمة" : "Important Deadlines"}
                  </h4>
                  <ul className="space-y-1">
                    {content.deadlines.map((dl, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {dl}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to see a lawyer */}
              {content?.when_to_see_lawyer && content.when_to_see_lawyer.length > 0 && (
                <div className="rounded-lg border border-amber-300/50 bg-amber-50/50 p-3">
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {isRTL ? "متى تحتاج إلى محامٍ" : "When to See a Lawyer"}
                  </h4>
                  <ul className="space-y-1">
                    {content.when_to_see_lawyer.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2"
                      >
                        <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-amber-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal Sources */}
              {selectedTopic.legalSources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-primary" />
                    {isRTL ? "المصادر القانونية" : "Legal Sources"}
                  </h4>
                  <div className="space-y-2">
                    {selectedTopic.legalSources.map((src, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border p-2.5 text-xs"
                      >
                        <p className="font-medium">
                          {isRTL ? src.titleAr : src.titleEn}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          {src.referenceNumber}
                          {src.articleNumber && ` — ${src.articleNumber}`}
                        </p>
                        {src.notes && (
                          <p className="text-muted-foreground mt-1 italic">
                            {src.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              {content && (
                <div className="rounded-lg border border-[var(--legal-gold)]/30 bg-[var(--legal-gold-light)]/30 p-3">
                  <p className="text-[11px] text-foreground/70 leading-relaxed">
                    {isRTL ? content.disclaimer_ar : content.disclaimer_en}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  /* ── Library List View ── */
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-border px-4 py-3 shrink-0">
          <SheetHeader className="text-start space-y-0.5">
            <SheetTitle className="text-sm font-bold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              {isRTL ? "مكتبة المعرفة القانونية" : "Legal Knowledge Library"}
            </SheetTitle>
            <SheetDescription className="text-[11px]">
              {isRTL
                ? "تصفّح المواضيع القانونية المنقّحة"
                : "Browse curated legal topics"}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="px-4 py-3 space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              practiceAreas.map((area) => {
                const areaTopics = topics.filter(
                  (t) => t.practiceArea.slug === area.slug
                );

                return (
                  <div key={area.slug}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary">
                        {PRACTICE_ICONS[area.slug] || (
                          <BookOpen className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <h3 className="text-xs font-semibold">
                        {isRTL ? area.titleAr : area.titleEn}
                      </h3>
                      {area.topicCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {area.topicCount}
                        </Badge>
                      )}
                    </div>

                    {areaTopics.length > 0 ? (
                      <div className="space-y-1.5">
                        {areaTopics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                            className="w-full flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-start hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-[0.99]"
                          >
                            <span className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary shrink-0">
                              {PRACTICE_ICONS[area.slug] || (
                                <BookOpen className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium leading-tight truncate">
                                {isRTL ? topic.titleAr : topic.titleEn}
                              </p>
                            </div>
                            {topic.urgency && (
                              <Badge
                                variant="secondary"
                                className={`text-[9px] px-1.5 py-0 shrink-0 ${
                                  URGENCY_COLORS[topic.urgency] || ""
                                }`}
                              >
                                {topic.urgency}
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground px-1">
                        {isRTL
                          ? "لا توجد مواضيع بعد"
                          : "No topics yet"}
                      </p>
                    )}

                    <Separator className="mt-3" />
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer stats */}
        <div className="border-t border-border px-4 py-2 shrink-0">
          <p className="text-[10px] text-muted-foreground text-center">
            {isRTL
              ? `${practiceAreas.length} مجالات ممارسة • ${topics.length} مواضيع منقّحة`
              : `${practiceAreas.length} practice areas • ${topics.length} curated topics`}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
