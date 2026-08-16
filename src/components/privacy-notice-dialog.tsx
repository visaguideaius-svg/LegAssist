"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Database,
  Lock,
  Globe,
  Clock,
  UserCheck,
  AlertCircle,
  FileText,
  Mail,
} from "lucide-react";

/* ───────── Bilingual Privacy Content ───────── */

interface PrivacySection {
  icon: React.ReactNode;
  titleAr: string;
  titleEn: string;
  contentAr: React.ReactNode;
  contentEn: React.ReactNode;
}

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    icon: <Database className="h-5 w-5" />,
    titleAr: "ما هي البيانات التي نجمعها",
    titleEn: "What Data We Collect",
    contentAr: (
      <>
        <p className="mb-2">
          نجمع الأنواع التالية من البيانات عند استخدامك للمنصة:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>البريد الإلكتروني وكلمة المرور (مخزّنة بشكل مشفّر)</li>
          <li>الأسئلة التي تطرحها على المساعد القانوني</li>
          <li>المواضيع التي تتصفّحها واستعلامات البحث</li>
          <li>معلومات الجهاز والمتصفّح (عنوان IP، نوع المتصفح، الموقع التقريبي)</li>
        </ul>
        <p className="text-muted-foreground text-xs mt-3 p-2 rounded bg-muted/50">
          <strong>لا نطلب منك:</strong> الرقم الوطني، صور الهوية، أو تفاصيل حساسة
          عن العائلة أو الصحة. إذا شاركت مثل هذه البيانات طواعية، ننصحك بعدم
          فعل ذلك.
        </p>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">
          We collect the following types of data when you use the Platform:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>Email address and password (stored in hashed form)</li>
          <li>Questions you ask the AI legal assistant</li>
          <li>Topics you browse and search queries</li>
          <li>Device and browser information (IP address, user agent, approximate location)</li>
        </ul>
        <p className="text-muted-foreground text-xs mt-3 p-2 rounded bg-muted/50">
          <strong>We do not require:</strong> National ID numbers, full ID scans, or
          sensitive family, health, or criminal details. If shared voluntarily, we advise
          against it.
        </p>
      </>
    ),
  },
  {
    icon: <FileText className="h-5 w-5" />,
    titleAr: "لماذا نعالج بياناتك",
    titleEn: "Why We Process Your Data",
    contentAr: (
      <>
        <p className="mb-2">
          نعالج بياناتك فقط لأغراض مشروعة ومحدّدة:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>تقديم خدمة المعرفة القانونية والإجابة على أسئلتك</li>
          <li>الأمان ومنع الاحتيال والوصول غير المصرّح به</li>
          <li>التحليل وتحسين المنتج (فهم المواضيع الأكثر استخداماً)</li>
          <li>إحالتك لمحامٍ (إذا استخدمت هذه الميزة)</li>
          <li>الامتثال للقوانين الأردنية بما في ذلك قانون حماية البيانات</li>
        </ol>
        <p className="mt-3 font-medium text-sm">لا نبيع بياناتك لأطراف ثالثة.</p>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">
          We process your data only for specific, legitimate purposes:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Providing the legal knowledge service and answering your questions</li>
          <li>Security, fraud prevention, and unauthorized access detection</li>
          <li>Analytics and product improvement (understanding most-used topics)</li>
          <li>Lawyer referral (if you use this feature)</li>
          <li>Compliance with Jordanian laws including the PDPL</li>
        </ol>
        <p className="mt-3 font-medium text-sm">We do not sell your data to third parties.</p>
      </>
    ),
  },
  {
    icon: <Lock className="h-5 w-5" />,
    titleAr: "الأساس القانوني للمعالجة",
    titleEn: "Legal Basis for Processing",
    contentAr: (
      <>
        <p className="mb-2">
          وفقاً لقانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023، نعتمد على:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>تنفيذ العقد:</strong> المعالجة اللازمة لتقديم المنصة وخدماتها</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>المصالح المشروعة:</strong> الأمان والتحليل وتحسين الخدمة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>الموافقة:</strong> لمعالجة البيانات الحساسة أو التسويق عند الحاجة</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          يمكنك سحب موافقتك في أي وقت عبر إعدادات حسابك أو بالاتصال بنا.
        </p>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">
          Under Jordan's PDPL No. 24 of 2023, we rely on:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Contract performance:</strong> Processing necessary to provide the Platform</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Legitimate interests:</strong> Security, analytics, and service improvement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Consent:</strong> For sensitive data processing or marketing where required</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          You can withdraw consent at any time via account settings or by contacting us.
        </p>
      </>
    ),
  },
  {
    icon: <UserCheck className="h-5 w-5" />,
    titleAr: "من نشارك بياناتك معه",
    titleEn: "Who We Share Your Data With",
    contentAr: (
      <>
        <p className="mb-2">قد نشارك بياناتك مع:</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>مقدمو الخدمات:</strong> استضافة سحابية، بريد إلكتروني، تحليلات</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>المحامون:</strong> فقط إذا قدمت طلب اتصال (اسمك وتفاصيل الموضوع)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>الجهات الرسمية:</strong> عند وجود طلب قانوني من المحاكم أو الجهات الرقابية</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          لا نشارك بياناتك مع المعلنين أو وسطاء البيانات.
        </p>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">We may share your data with:</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Service providers:</strong> Cloud hosting, email, analytics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Lawyers:</strong> Only if you submit a contact request</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Authorities:</strong> In response to lawful requests from courts or regulators</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          We do not share your data with advertisers or data brokers.
        </p>
      </>
    ),
  },
  {
    icon: <Globe className="h-5 w-5" />,
    titleAr: "النقل الدولي للبيانات",
    titleEn: "International Data Transfers",
    contentAr: (
      <>
        <p>
          قد تتضمن بنيتنا التحتية استضافة أو معالجة خارج الأردن. عند نقل البيانات
          الشخصية خارج الأردن، نتخذ الضمانات المناسبة مثل الشروط التعاقدية لحماية
          بياناتك، ونتوافق مع متطلبات قانون حماية البيانات المتعلقة بالنقل
          عبر الحدود.
        </p>
      </>
    ),
    contentEn: (
      <>
        <p>
          Our infrastructure may involve hosting or processing outside Jordan. Where personal
          data is transferred outside Jordan, we implement appropriate safeguards such as
          contractual clauses and comply with PDPL cross-border transfer requirements.
        </p>
      </>
    ),
  },
  {
    icon: <Clock className="h-5 w-5" />,
    titleAr: "احتفاظ البيانات",
    titleEn: "Data Retention",
    contentAr: (
      <>
        <p className="mb-2">
          نحتفظ ببياناتك الشخصية فقط طالما كان ذلك ضرورياً:
        </p>
        <ul className="space-y-1">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>بيانات الحساب:</strong> طوال فترة نشاط الحساب وفترة معقولة بعدها</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>بيانات الاستخدام:</strong> بشكل مجمع أو مجهول الهوية حيثما أمكن</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>سجلات الأمان:</strong> حسبما يتطلبه القانون</span>
          </li>
        </ul>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">
          We retain your personal data only for as long as necessary:
        </p>
        <ul className="space-y-1">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Account data:</strong> While your account is active and a reasonable period after</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Usage data:</strong> In aggregated or pseudonymized form where possible</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Security logs:</strong> As required by law</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <Shield className="h-5 w-5" />,
    titleAr: "حقوقك بموجب قانون حماية البيانات",
    titleEn: "Your Rights Under the PDPL",
    contentAr: (
      <>
        <p className="mb-2">وفقاً لقانون حماية البيانات الشخصية الأردني، لديك الحق في:</p>
        <ul className="space-y-1 mb-3">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>الوصول</strong> إلى بياناتك الشخصية المحفوظة لدينا</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>تصحيح</strong> البيانات غير الدقيقة أو الناقصة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>طلب المسح</strong> في ظروف معينة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>التقييد أو الاعتراض</strong> على أنشطة معالجة معينة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>نقل البيانات</strong> حيثما ينطبق ذلك</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>سحب الموافقة</strong> في أي وقت</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>تقديم شكوى</strong> للجهة المعنية بحماية البيانات في الأردن</span>
          </li>
        </ul>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">Under Jordan's PDPL, you have the right to:</p>
        <ul className="space-y-1 mb-3">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Access</strong> your personal data held by us</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Correct</strong> inaccurate or incomplete data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Request erasure</strong> in certain circumstances</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Restrict or object</strong> to certain processing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Data portability</strong> where applicable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Withdraw consent</strong> at any time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span><strong>Lodge a complaint</strong> with the data protection authority</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <AlertCircle className="h-5 w-5" />,
    titleAr: "إجراءات الأمان",
    titleEn: "Security Measures",
    contentAr: (
      <>
        <p className="mb-2">نتخذ إجراءات تقنية وتنظيمية لحماية بياناتك، بما في ذلك:</p>
        <ul className="space-y-1">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>تشفير البيانات أثناء النقل (HTTPS/TLS) وفي التخزين</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>ضوابط الوصول وصلاحيات مبنية على الأدوار</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>مراجعات أمنية دورية وإدارة الثغرات</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>إجراءات للكشف عن اختراقات البيانات وإخطارك حسب القانون</span>
          </li>
        </ul>
      </>
    ),
    contentEn: (
      <>
        <p className="mb-2">We implement technical and organizational security measures:</p>
        <ul className="space-y-1">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Encryption in transit (HTTPS/TLS) and at rest</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Access controls and role-based permissions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Regular security reviews and vulnerability management</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Breach detection and notification procedures per PDPL</span>
          </li>
        </ul>
      </>
    ),
  },
];

/* ───────── Component Props ───────── */
interface PrivacyNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: "ar" | "en";
}

export default function PrivacyNoticeDialog({
  open,
  onOpenChange,
  language,
}: PrivacyNoticeDialogProps) {
  const isRTL = language === "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-base font-bold leading-tight">
              {isRTL
                ? "إشعار الخصوصية"
                : "Privacy Notice"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              {isRTL
                ? "متوافق مع قانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023"
                : "Aligned with Jordan Personal Data Protection Law No. 24 of 2023"}
            </DialogDescription>
          </div>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="px-6 py-4 space-y-5">
            {PRIVACY_SECTIONS.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    {section.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold mb-2 leading-tight">
                      {isRTL ? section.titleAr : section.titleEn}
                    </h3>
                    <div className="text-sm leading-relaxed text-foreground/80">
                      {isRTL ? section.contentAr : section.contentEn}
                    </div>
                  </div>
                </div>
                {idx < PRIVACY_SECTIONS.length - 1 && (
                  <Separator className="mt-5" />
                )}
              </div>
            ))}

            {/* Contact / DPO section */}
            <div className="rounded-xl border border-[var(--legal-teal-light)] bg-[var(--legal-teal-light)]/30 p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    {isRTL ? "الاتصال بنا" : "Contact Us"}
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {isRTL
                      ? "لأي أسئلة حول هذا الإشعار أو لممارسة حقوقك، تواصل معنا عبر:"
                      : "For questions about this notice or to exercise your rights, contact us at:"}
                  </p>
                  <p className="text-sm font-medium mt-1.5">
                    privacy@example.jo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 shrink-0">
          <p className="text-[11px] text-muted-foreground text-center">
            {isRTL
              ? "آخر تحديث: 2026-08-16 — هذا إشعار مسوّدة ويجب مراجعته من مستشار قانوني مؤهّل"
              : "Last updated: 2026-08-16 — This is a draft notice and should be reviewed by qualified legal counsel"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
