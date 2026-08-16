"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Scale,
  Send,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Briefcase,
  Home,
  Users,
  CreditCard,
  Car,
  Shield,
  Building2,
  Gavel,
  Globe,
  Loader2,
  ChevronDown,
  Lock,
  BookOpen,
  ImageIcon,
  ArrowDown,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import PrivacyNoticeDialog from "@/components/privacy-notice-dialog";
import KnowledgeLibrary from "@/components/knowledge-library";

/* ───────── Types ───────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  visualizing?: boolean;
  visualizationId?: string;
  visualizationError?: boolean;
}

interface TopicButton {
  icon: React.ReactNode;
  labelAr: string;
  labelEn: string;
  queryAr: string;
  queryEn: string;
  gradient: string;
  iconBg: string;
}

/* ───────── Constants ───────── */
const TOPICS: TopicButton[] = [
  {
    icon: <Briefcase className="h-5 w-5" />,
    labelAr: "قانون العمل",
    labelEn: "Labor Law",
    queryAr: "أريد معرفة حقوقي في قانون العمل الأردني",
    queryEn: "I want to know my rights under Jordanian labor law",
    gradient: "from-amber-500/8 to-orange-500/5",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: <Home className="h-5 w-5" />,
    labelAr: "الإيجار والعقار",
    labelEn: "Rent & Real Estate",
    queryAr: "ما هي حقوقي ك مستأجر في الأردن؟",
    queryEn: "What are my rights as a tenant in Jordan?",
    gradient: "from-emerald-500/8 to-teal-500/5",
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: <Users className="h-5 w-5" />,
    labelAr: "القانون الأسري",
    labelEn: "Family Law",
    queryAr: "أسئلة حول القانون الأسري في الأردن",
    queryEn: "Questions about family law in Jordan",
    gradient: "from-rose-500/8 to-pink-500/5",
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    labelAr: "الديون والتنفيذ",
    labelEn: "Debt & Enforcement",
    queryAr: "كيف أتعامل مع ديون وقيود تنفيذية؟",
    queryEn: "How do I deal with debts and enforcement actions?",
    gradient: "from-yellow-500/8 to-amber-500/5",
    iconBg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    icon: <Car className="h-5 w-5" />,
    labelAr: "الحوادث والتعويض",
    labelEn: "Accidents & Compensation",
    queryAr: "ما هي إجراءات التعويض عن حادث مروري؟",
    queryEn: "What are the procedures for traffic accident compensation?",
    gradient: "from-orange-500/8 to-red-500/5",
    iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    labelAr: "الجرم الإلكتروني",
    labelEn: "Cybercrime",
    queryAr: "كيف أحمي نفسي من الجرائم الإلكترونية؟",
    queryEn: "How do I protect myself from cybercrime?",
    gradient: "from-violet-500/8 to-purple-500/5",
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    labelAr: "المؤسسات الصغيرة",
    labelEn: "Small Business",
    queryAr: "ما هي خطوات تأسيس شركة في الأردن؟",
    queryEn: "What are the steps to register a company in Jordan?",
    gradient: "from-sky-500/8 to-cyan-500/5",
    iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  },
  {
    icon: <Gavel className="h-5 w-5" />,
    labelAr: "إجراءات المحاكم",
    labelEn: "Court Procedures",
    queryAr: "ما هي خطوات رفع دعوى أمام المحاكم الأردنية؟",
    queryEn: "What are the steps to file a case in Jordanian courts?",
    gradient: "from-stone-500/8 to-neutral-500/5",
    iconBg: "bg-stone-100 text-stone-700 dark:bg-stone-800/40 dark:text-stone-300",
  },
];

const DISCLAIMER_AR =
  "هذه معلومات قانونية عامة وليست استشارة قانونية. للتقييم النهائي لحالتك، يُنصح بمراجعة محامٍ مرخّص.";
const DISCLAIMER_EN =
  "This is general legal information, not legal advice. For a final assessment of your situation, consult a licensed lawyer.";

/* ───────── Component ───────── */
export default function LegalChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isRTL = language === "ar";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollAreaRef.current;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
      }
    };
    const el = scrollAreaRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Send message ── */
  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text || input).trim();
      if (!content || isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);
      setIsTyping(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            language,
          }),
        });

        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message || "عذراً، لم أتمكن من معالجة طلبك.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            language === "ar"
              ? "عذراً، حدث خطأ في الاتصال. يُرجى المحاولة مرة أخرى."
              : "Sorry, a connection error occurred. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
        textareaRef.current?.focus();
      }
    },
    [input, isLoading, messages, language]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setIsTyping(false);
    textareaRef.current?.focus();
  };

  const handleTopicClick = (topic: TopicButton) => {
    const query = isRTL ? topic.queryAr : topic.queryEn;
    sendMessage(query);
  };

  /* ── Visualize handler ── */
  const handleVisualize = useCallback(
    async (msgId: string, answerText: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, visualizing: true, visualizationError: false }
            : m
        )
      );

      try {
        const res = await fetch("/api/visualizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answerId: msgId, answerText, language }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Visualization failed");
        }

        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, visualizing: false, visualizationId: data.id }
              : m
          )
        );
        window.location.href = `/visualizations/${data.id}`;
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, visualizing: false, visualizationError: true }
              : m
          )
        );
      }
    },
    [language]
  );

  /* ── Render ── */
  return (
    <div className="h-screen flex flex-col bg-legal-surface noise-overlay">
      {/* ═══════════════════════════════════════════════════
          HEADER — Clean glass bar with warm tones
          ═══════════════════════════════════════════════════ */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_50)] to-[oklch(0.28_0.06_40)] text-white shadow-lg shadow-[oklch(0.28_0.06_40)/0.2]">
              <Scale className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[15px] font-bold leading-tight tracking-tight text-foreground">
                {isRTL ? "المساعد القانوني" : "Legal Assistant"}
              </h1>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5 font-medium">
                {isRTL
                  ? "المملكة الأردنية الهاشمية"
                  : "Hashemite Kingdom of Jordan"}
              </p>
            </div>
          </div>

          {/* Actions — pill group */}
          <div className="flex items-center gap-0.5 bg-legal-surface-elevated rounded-full p-1 border border-border/50 shadow-sm">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLanguage(isRTL ? "en" : "ar")}
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-legal-sand-muted/60"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {isRTL ? "English" : "العربية"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLibrary(true)}
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-legal-sand-muted/60"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {isRTL ? "مكتبة المعرفة" : "Knowledge Library"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPrivacy(true)}
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-legal-sand-muted/60"
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {isRTL ? "إشعار الخصوصية" : "Privacy Notice"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {messages.length > 0 && (
              <>
                <div className="h-5 w-px bg-border/50 mx-1" />
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetChat}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-legal-sand-muted/60"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {isRTL ? "محادثة جديدة" : "New chat"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto relative overflow-hidden">
        {/* Disclaimer — subtle bar */}
        <div className="px-4 sm:px-6 pt-3 animate-fade-in">
          <div className="disclaimer-gradient flex items-center gap-2 rounded-xl px-3.5 py-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[var(--legal-terracotta)]" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {isRTL ? DISCLAIMER_AR : DISCLAIMER_EN}
            </p>
          </div>
        </div>

        {/* Messages / Welcome */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 chat-scroll"
          style={{ minHeight: 0 }}
        >
          {/* ═══ WELCOME SCREEN ═══ */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-6 gap-10 animate-fade-in">
              {/* Hero area */}
              <div className="text-center space-y-5 max-w-md">
                {/* Large animated icon */}
                <div className="mx-auto relative hero-glow">
                  <div className="flex items-center justify-center h-[88px] w-[88px] rounded-3xl bg-gradient-to-br from-[oklch(0.40_0.08_50)/0.10] to-[oklch(0.65_0.14_45)/0.08] ring-1 ring-[oklch(0.40_0.08_50)/0.08] shadow-xl shadow-[oklch(0.40_0.08_50)/0.06]">
                    <Sparkles className="h-10 w-10 text-[var(--legal-terracotta)]" strokeWidth={1.3} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-[28px] sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                    {isRTL ? "مرحباً بك" : "Welcome"}
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {isRTL
                      ? "يمكنني مساعدتك في فهم القوانين والإجراءات القانونية في الأردن. اختر موضوعاً أو اطرح سؤالك مباشرة."
                      : "I can help you understand Jordanian laws and legal procedures. Choose a topic or ask directly."}
                  </p>
                </div>
              </div>

              {/* Topic grid */}
              <div className="w-full max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50 mb-4 px-1">
                  {isRTL ? "استكشف المواضيع" : "Explore Topics"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TOPICS.map((topic, idx) => (
                    <button
                      key={topic.labelEn}
                      onClick={() => handleTopicClick(topic)}
                      className="topic-card group relative flex flex-col items-center gap-3 rounded-2xl bg-legal-surface-elevated border border-border/40 px-4 py-5 text-center transition-all duration-250 active:scale-[0.97]"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <span
                        className={`flex items-center justify-center h-12 w-12 rounded-xl ${topic.iconBg} shrink-0 transition-transform duration-250 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {topic.icon}
                      </span>
                      <span className="text-[13px] font-medium leading-tight text-foreground">
                        {isRTL ? topic.labelAr : topic.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
                {[
                  { ar: "ما حقوقي كموظف؟", en: "What are my employee rights?" },
                  { ar: "كيف أرفع دعوى؟", en: "How do I file a lawsuit?" },
                  { ar: "حقوق المستأجر", en: "Tenant rights" },
                ].map((q) => (
                  <button
                    key={q.en}
                    onClick={() => sendMessage(isRTL ? q.ar : q.en)}
                    className="text-xs text-muted-foreground bg-legal-surface-elevated border border-border/40 rounded-full px-4 py-2 hover:border-[var(--legal-terracotta)]/30 hover:text-foreground hover:bg-legal-surface-overlay transition-all duration-200 hover:shadow-sm"
                  >
                    {isRTL ? q.ar : q.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ MESSAGE LIST ═══ */}
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex mb-6 animate-fade-in-up ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${Math.min(idx * 0.05, 0.2)}s` }}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] ${
                  msg.role === "user" ? "msg-user" : "msg-assistant"
                } px-5 py-4`}
              >
                {/* Assistant header — refined */}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-border/25">
                    <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-[var(--legal-cedar-muted)]">
                      <Scale className="h-3.5 w-3.5 text-[var(--legal-cedar)]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--legal-cedar)]">
                      {isRTL ? "المساعد القانوني" : "Legal Assistant"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 ml-auto">
                      {msg.timestamp.toLocaleTimeString(isRTL ? "ar-JO" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div
                  className={`prose prose-sm max-w-none leading-relaxed prose-legal ${
                    msg.role === "user"
                      ? "prose-invert"
                      : "prose-neutral dark:prose-invert"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* User timestamp */}
                {msg.role === "user" && (
                  <p className="text-[10px] mt-2 text-white/35 text-end">
                    {msg.timestamp.toLocaleTimeString(isRTL ? "ar-JO" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}

                {/* ── Visualize Answer Button ── */}
                {msg.role === "assistant" && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <button
                      type="button"
                      disabled={msg.visualizing}
                      onClick={() => handleVisualize(msg.id, msg.content)}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[var(--legal-terracotta)] to-[oklch(0.55_0.12_50)] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm shadow-[var(--legal-terracotta)]/15 transition-all duration-200 hover:shadow-lg hover:shadow-[var(--legal-terracotta)]/20 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 active:scale-[0.98]"
                    >
                      {msg.visualizing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {msg.visualizing
                          ? isRTL
                            ? "جارٍ الإنشاء..."
                            : "Creating..."
                          : isRTL
                            ? "حوّلها إلى إنفوغرافيك"
                            : "Visualize Answer"}
                      </span>
                    </button>
                    {msg.visualizationError && (
                      <p className="mt-2 text-[11px] text-red-500/70">
                        {isRTL
                          ? "تعذر الإنشاء. حاول مرة أخرى."
                          : "Unable to create. Please try again."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ═══ TYPING INDICATOR ═══ */}
          {isTyping && (
            <div className="flex mb-6 justify-start animate-fade-in">
              <div className="msg-assistant px-5 py-4">
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-border/25">
                  <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-[var(--legal-cedar-muted)]">
                    <Scale className="h-3.5 w-3.5 text-[var(--legal-cedar)]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--legal-cedar)]">
                    {isRTL ? "المساعد القانوني" : "Legal Assistant"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-1 py-1">
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--legal-terracotta)]/40" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--legal-terracotta)]/40" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--legal-terracotta)]/40" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ═══ SCROLL TO BOTTOM ═══ */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center h-9 w-9 rounded-full glass shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-in"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {/* ═══════════════════════════════════════════════════
            INPUT BAR — Warm, elevated, floating
            ═══════════════════════════════════════════════════ */}
        <div className="sticky bottom-0 z-20 pb-4 pt-2 px-4 sm:px-6 bg-gradient-to-t from-legal-surface via-legal-surface/97 to-transparent">
          {/* Lawyer CTA */}
          {messages.length > 0 && (
            <div className="flex items-center justify-center mb-3 animate-fade-in">
              <button className="group flex items-center gap-2 text-[11px] text-muted-foreground hover:text-[var(--legal-terracotta)] transition-colors duration-200">
                <Gavel className="h-3 w-3 group-hover:scale-110 transition-transform" />
                <span>
                  {isRTL ? "تحدث مع محامٍ مرخّص" : "Talk to a licensed lawyer"}
                </span>
              </button>
            </div>
          )}

          {/* Input container */}
          <div className="input-glow relative flex items-end gap-2.5 rounded-2xl bg-legal-surface-elevated border border-border/70 px-3.5 py-2.5 shadow-lg shadow-black/[0.03]">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRTL
                  ? "اسأل سؤالك القانوني..."
                  : "Ask your legal question..."
              }
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[36px] max-h-[120px] placeholder:text-muted-foreground/40"
              style={{
                height: "auto",
                overflow: "hidden",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="shrink-0 rounded-xl h-10 w-10 p-0 bg-gradient-to-br from-[var(--legal-terracotta)] to-[oklch(0.50_0.10_50)] text-white shadow-md shadow-[var(--legal-terracotta)]/15 hover:shadow-lg hover:shadow-[var(--legal-terracotta)]/25 disabled:opacity-35 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Tiny footer note */}
          <p className="text-center text-[10px] text-muted-foreground/35 mt-2.5 font-medium">
            {isRTL
              ? "ذكاء اصطناعي — تحقق من المعلومات دائماً"
              : "AI-generated — always verify information"}
          </p>
        </div>
      </main>

      {/* ═══ OVERLAYS ═══ */}
      <PrivacyNoticeDialog
        open={showPrivacy}
        onOpenChange={setShowPrivacy}
        language={language}
      />
      <KnowledgeLibrary
        open={showLibrary}
        onOpenChange={setShowLibrary}
        language={language}
        onSelectTopic={(topic) => {
          const query = isRTL ? topic.titleAr : topic.titleEn;
          sendMessage(query);
          setShowLibrary(false);
        }}
      />
    </div>
  );
}
