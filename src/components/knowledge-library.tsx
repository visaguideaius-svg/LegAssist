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
  low: "bg-legal-amber-muted/60 text-legal-amber",
  medium: "bg-legal-amber-muted text-legal-amber",
  high: "bg-legal-amber/15 text-legal-amber",
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
    if (!content) return null;
    if (content.steps_employee) return { labelAr: "خطوات الموظف", labelEn: "Employee Steps", steps: content.steps_employee };
    if (content.steps_tenant) return { labelAr: "خطوات المستأجر", labelEn: "Tenant Steps", steps: content.steps_tenant };
    return { labelAr: "خطوات", labelEn: "Steps", steps: [] as string[] };
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
          className="w-full sm:max-w-lg p-0 flex flex-col bg-legal-surface-elevated"
        >
          {/* Header */}
          <div className="border-b border-border/50 px-5 py-4 shrink-0">
            <SheetHeader className="text-start space-y-0">
              {/* Minimal back navigation */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2 group"
              >
                {isRTL ? (
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                )}
                <span>{isRTL ? "رجوع" : "Back"}</span>
              </button>
              <SheetTitle className="text-base font-semibold leading-tight text-primary">
                {isRTL ? selectedTopic.titleAr : selectedTopic.titleEn}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                <span>
                  {selectedTopic.practiceArea
                    ? isRTL
                      ? selectedTopic.practiceArea.titleAr
                      : selectedTopic.practiceArea.titleEn
                    : ""}
                </span>
                {selectedTopic.confidenceLevel && (
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 rounded-full ${
                      selectedTopic.confidenceLevel === "high"
                        ? "bg-legal-indigo-muted text-legal-indigo"
                        : "bg-legal-amber-muted text-legal-amber"
                    }`
                  }
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
            <div className="px-5 py-5 space-y-5 animate-fade-in">
              {/* Explanation */}
              {content && (
                <div className="rounded-2xl bg-legal-indigo-muted/40 p-4 shadow-sm">
                  <p className="text-sm leading-relaxed prose-legal">
                    {isRTL ? content.explanation_ar : content.explanation_en}
                  </p>
                </div>
              )}

              {/* Key Facts */}
              {content?.key_facts && content.key_facts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-primary">
                    <FileCheck className="h-3.5 w-3.5" />
                    {isRTL ? "حقائق رئيسية" : "Key Facts"}
                  </h4>
                  <ul className="space-y-1.5">
                    {content.key_facts.map((fact, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2.5"
                      >
                        <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-legal-indigo" />
                        <span className="prose-legal">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps 1 */}
              {steps1 && steps1.steps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-primary">
                    <UserCheck className="h-3.5 w-3.5" />
                    {isRTL ? steps1.labelAr : steps1.labelEn}
                  </h4>
                  <ol className="space-y-2">
                    {steps1.steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2.5"
                      >
                        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-legal-indigo-muted text-legal-indigo text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="prose-legal">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Steps 2 */}
              {steps2 && steps2.steps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-primary">
                    <UserCheck className="h-3.5 w-3.5" />
                    {isRTL ? steps2.labelAr : steps2.labelEn}
                  </h4>
                  <ol className="space-y-2">
                    {steps2.steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2.5"
                      >
                        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-legal-indigo-muted text-legal-indigo text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="prose-legal">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Documents */}
              {content?.documents_to_keep && content.documents_to_keep.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-primary">
                    <FileCheck className="h-3.5 w-3.5" />
                    {isRTL ? "مستندات يجب الاحتفاظ بها" : "Documents to Keep"}
                  </h4>
                  <ul className="space-y-1.5">
                    {content.documents_to_keep.map((doc, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2.5"
                      >
                        <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-legal-amber" />
                        <span className="prose-legal">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deadlines */}
              {content?.deadlines && content.deadlines.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-primary">
                    <Clock className="h-3.5 w-3.5 text-legal-amber" />
                    {isRTL ? "مواعيد مهمة" : "Important Deadlines"}
                  </h4>
                  <ul className="space-y-1.5">
                    {content.deadlines.map((dl, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2.5"
                      >
                        <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-legal-amber" />
                        <span className="prose-legal">{dl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to see a lawyer */}
              {content?.when_to_see_lawyer && content.when_to_see_lawyer.length > 0 && (
                <div className="rounded-2xl bg-legal-amber-muted/50 p-4 shadow-sm">
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-legal-amber">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {isRTL ? "متى تحتاج إلى محامٍ" : "When to See a Lawyer"}
                  </h4>
                  <ul className="space-y-1.5">
                    {content.when_to_see_lawyer.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-foreground/80 flex items-start gap-2.5"
                      >
                        <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-legal-amber" />
                        <span className="prose-legal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal Sources */}
              {selectedTopic.legalSources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 text-primary">
                    <Scale className="h-3.5 w-3.5" />
                    {isRTL ? "المصادر القانونية" : "Legal Sources"}
                  </h4>
                  <div className="space-y-2">
                    {selectedTopic.legalSources.map((src, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border/50 p-3 text-xs shadow-sm bg-legal-surface-elevated"
                      >
                        <p className="font-medium text-foreground">
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
                <div className="disclaimer-gradient rounded-2xl p-4">
                  <p className="text-[11px] text-foreground/60 leading-relaxed prose-legal">
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
        className="w-full sm:max-w-md p-0 flex flex-col bg-legal-surface-elevated"
      >
        {/* Header */}
        <div className="border-b border-border/50 px-5 py-4 shrink-0">
          <SheetHeader className="text-start space-y-1">
            <SheetTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              {isRTL ? "مكتبة المعرفة القانونية" : "Legal Knowledge Library"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {isRTL
                ? "تصفّح المواضيع القانونية المنقّحة"
                : "Browse curated legal topics"}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-5 animate-fade-in">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2.5">
                    <Skeleton className="h-4 w-28 rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-xl" />
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
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="flex items-center justify-center h-7 w-7 rounded-xl bg-legal-indigo-muted text-legal-indigo">
                        {PRACTICE_ICONS[area.slug] || (
                          <BookOpen className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <h3 className="text-xs font-semibold text-primary">
                        {isRTL ? area.titleAr : area.titleEn}
                      </h3>
                      {area.topicCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0 rounded-full bg-legal-indigo-muted/60 text-legal-indigo"
                        >
                          {area.topicCount}
                        </Badge>
                      )}
                    </div>

                    {areaTopics.length > 0 ? (
                      <div className="space-y-2">
                        {areaTopics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                            className="topic-card w-full flex items-center gap-3 rounded-xl border border-border/50 px-3.5 py-3 text-start shadow-sm bg-legal-surface-elevated hover:shadow-md hover:border-border transition-all duration-200 active:scale-[0.99]"
                          >
                            <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-legal-indigo-muted text-legal-indigo shrink-0">
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
                                className={`text-[9px] px-1.5 py-0 rounded-full shrink-0 ${
                                  URGENCY_COLORS[topic.urgency] || ""
                                }`
                              }
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

                    <div className="mt-4 h-px bg-border/50" />
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer stats */}
        <div className="border-t border-border/50 px-5 py-2.5 shrink-0">
          <p className="text-[10px] text-muted-foreground/70 text-center">
            {isRTL
              ? `${practiceAreas.length} مجالات ممارسة • ${topics.length} مواضيع منقّحة`
              : `${practiceAreas.length} practice areas • ${topics.length} curated topics`}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}