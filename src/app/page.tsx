"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  MessageSquare,
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
  ChevronUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

/* ───────── Types ───────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TopicButton {
  icon: React.ReactNode;
  labelAr: string;
  labelEn: string;
  queryAr: string;
  queryEn: string;
}

/* ───────── Constants ───────── */
const TOPICS: TopicButton[] = [
  {
    icon: <Briefcase className="h-4 w-4" />,
    labelAr: "قانون العمل",
    labelEn: "Labor Law",
    queryAr: "أريد معرفة حقوقي في قانون العمل الأردني",
    queryEn: "I want to know my rights under Jordanian labor law",
  },
  {
    icon: <Home className="h-4 w-4" />,
    labelAr: "الإيجار والعقار",
    labelEn: "Rent & Real Estate",
    queryAr: "ما هي حقوقي ك مستأجر في الأردن؟",
    queryEn: "What are my rights as a tenant in Jordan?",
  },
  {
    icon: <Users className="h-4 w-4" />,
    labelAr: "القانون الأسري",
    labelEn: "Family Law",
    queryAr: "أسئلة حول القانون الأسري في الأردن",
    queryEn: "Questions about family law in Jordan",
  },
  {
    icon: <CreditCard className="h-4 w-4" />,
    labelAr: "الديون والتنفيذ",
    labelEn: "Debt & Enforcement",
    queryAr: "كيف أتعامل مع ديون وقيود تنفيذية؟",
    queryEn: "How do I deal with debts and enforcement actions?",
  },
  {
    icon: <Car className="h-4 w-4" />,
    labelAr: "الحوادث والتعويض",
    labelEn: "Accidents & Compensation",
    queryAr: "ما هي إجراءات التعويض عن حادث مروري؟",
    queryEn: "What are the procedures for traffic accident compensation?",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    labelAr: "الجرم الإلكتروني",
    labelEn: "Cybercrime",
    queryAr: "كيف أحمي نفسي من الجرائم الإلكترونية؟",
    queryEn: "How do I protect myself from cybercrime?",
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    labelAr: "المؤسسات الصغيرة",
    labelEn: "Small Business",
    queryAr: "ما هي خطوات تأسيس شركة في الأردن؟",
    queryEn: "What are the steps to register a company in Jordan?",
  },
  {
    icon: <Gavel className="h-4 w-4" />,
    labelAr: "إجراءات المحاكم",
    labelEn: "Court Procedures",
    queryAr: "ما هي خطوات رفع دعوى أمام المحاكم الأردنية؟",
    queryEn: "What are the steps to file a case in Jordanian courts?",
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
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
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

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message || "عذراً، لم أتمكن من معالجة طلبك.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
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

  /* ── Render ── */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                {isRTL ? "المساعد القانوني الأردني" : "Jordanian Legal Assistant"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isRTL
                  ? "دليل المعرفة القانونية — وليس بديلاً عن المحامي"
                  : "Legal knowledge guide — not a substitute for a lawyer"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLanguage(isRTL ? "en" : "ar")}
                    className="gap-1.5 text-xs"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {isRTL ? "English" : "عربي"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRTL ? "Switch to English" : "التبديل إلى العربية"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Reset */}
            {messages.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetChat}
                      className="h-8 w-8"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRTL ? "محادثة جديدة" : "New chat"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Main content area ═══ */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto relative">
        {/* Disclaimer banner */}
        <div className="px-4 pt-3">
          <div className="flex items-start gap-2 rounded-lg border border-[var(--legal-gold)]/30 bg-[var(--legal-gold-light)]/50 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[var(--legal-gold)]" />
            <p className="text-xs leading-relaxed text-foreground/80">
              {isRTL ? DISCLAIMER_AR : DISCLAIMER_EN}
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto px-4 py-4 chat-scroll"
          style={{ minHeight: 0 }}
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-6">
              {/* Welcome */}
              <div className="text-center space-y-3 max-w-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">
                  {isRTL
                    ? "مرحباً بك في المساعد القانوني"
                    : "Welcome to the Legal Assistant"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isRTL
                    ? "يمكنني مساعدتك في فهم القوانين والإجراءات القانونية في الأردن. اختر موضوعاً أدناه أو اطرح سؤالك مباشرة."
                    : "I can help you understand Jordanian laws and legal procedures. Choose a topic below or ask your question directly."}
                </p>
              </div>

              {/* Topic grid */}
              <div className="w-full max-w-lg">
                <p className="text-xs font-medium text-muted-foreground mb-3 px-1">
                  {isRTL ? "مواضيع شائعة:" : "Common topics:"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.labelEn}
                      onClick={() => handleTopicClick(topic)}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-start hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-[0.98]"
                    >
                      <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0">
                        {topic.icon}
                      </span>
                      <span className="text-sm font-medium leading-tight">
                        {isRTL ? topic.labelAr : topic.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md shadow-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                    <div className="flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary">
                      <Scale className="h-3 w-3" />
                    </div>
                    <span className="text-[11px] font-semibold text-primary">
                      {isRTL ? "المساعد القانوني" : "Legal Assistant"}
                    </span>
                  </div>
                )}
                <div
                  className={`prose prose-sm max-w-none leading-relaxed ${
                    msg.role === "user"
                      ? "prose-invert"
                      : "prose-neutral dark:prose-invert"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <p
                  className={`text-[10px] mt-2 ${
                    msg.role === "user"
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString(isRTL ? "ar-JO" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex mb-4 justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                  <div className="flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary">
                    <Scale className="h-3 w-3" />
                  </div>
                  <span className="text-[11px] font-semibold text-primary">
                    {isRTL ? "المساعد القانوني" : "Legal Assistant"}
                  </span>
                </div>
                <div className="flex gap-1.5 px-1 py-1">
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary/50" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary/50" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary/50" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center h-8 w-8 rounded-full bg-card border border-border shadow-md hover:bg-primary/5 transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}

        {/* ── Input area ── */}
        <div className="sticky bottom-0 border-t border-border bg-card/80 backdrop-blur-md">
          <div className="px-4 py-3">
            <div className="relative flex items-end gap-2 rounded-xl border border-border bg-background focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRTL
                    ? "اكتب سؤالك القانوني هنا..."
                    : "Type your legal question here..."
                }
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[120px]"
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
                className="m-1.5 shrink-0 rounded-lg h-8 w-8 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Lawyer referral CTA */}
            <div className="flex items-center justify-center mt-2.5">
              <Separator className="flex-1 max-w-[80px]" />
              <p className="text-[11px] text-muted-foreground mx-3">
                {isRTL
                  ? "تحتاج مساعدة متخصصة؟"
                  : "Need specialized help?"}
              </p>
              <Separator className="flex-1 max-w-[80px]" />
            </div>
            <div className="flex justify-center mt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs rounded-full px-4 h-8 border-[var(--legal-gold)]/40 text-[var(--legal-gold)] hover:bg-[var(--legal-gold-light)]/50"
              >
                <Gavel className="h-3.5 w-3.5" />
                {isRTL ? "تحدث مع محامٍ" : "Talk to a Lawyer"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
