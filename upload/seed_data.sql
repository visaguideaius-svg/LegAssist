-- =========================================================
-- Seed Data: Practice Areas & Sample Topics
-- Jordanian Legal Knowledge Platform
-- Language: English (for AI agent clarity)
-- =========================================================

-- =========================================
-- 1. PRACTICE AREAS
-- =========================================

INSERT INTO practice_areas (slug, title_ar, title_en, description_ar, description_en)
VALUES
  ('labor', 'العمل', 'Labor & Employment',
   'قضايا العمل: الفصل، الأجور، الإجازات، ساعات العمل، الضمان الاجتماعي.',
   'Employment matters: termination, wages, leave, working hours, social security.'),
  ('rent', 'الإيجارات والعقارات', 'Rent & Real Estate',
   'قضايا الإيجار: الإخلاء، الأجرة، الصيانة، الوديعة، البيع والشراء.',
   'Tenancy and real estate: eviction, rent, maintenance, security deposit, sale and purchase.'),
  ('family', 'الأسرة', 'Family Law',
   'قضايا الأسرة: النفقة، الحضانة، التفريق، الميراث، تنفيذ الأحكام.',
   'Family matters: maintenance, custody, separation, inheritance, enforcement of judgments.'),
  ('debt', 'الديون والتنفيذ', 'Debt & Enforcement',
   'قضايا الديون: سند الدين، الشيك، الحجز، التقسيط، التبليغ.',
   'Debt and enforcement: debt instruments, cheques, attachment, installment plans, service of process.'),
  ('traffic', 'المرور والتعويض', 'Traffic & Compensation',
   'حوادث السير، التأمين، الإصابات، الأضرار، المطالبات التعويضية.',
   'Traffic accidents, insurance, injuries, damages, compensation claims.'),
  ('cybercrime', 'الجرائم الإلكترونية', 'Cybercrime',
   'الابتزاز، التشهير، انتحال الشخصية، حفظ الأدلة الإلكترونية.',
   'Extortion, defamation, impersonation, preservation of electronic evidence.'),
  ('court_procedure', 'الإجراءات القضائية', 'Court Procedures',
   'المحكمة المختصة، الاستئناف، المدد، التبليغ، الطعون.',
   'Competent court, appeals, deadlines, service of process, challenges.'),
  ('small_business', 'الأعمال الصغيرة', 'Small Business',
   'تسجيل الشركة، العقود، الشركاء، الفواتير، التحصيل.',
   'Company registration, contracts, partners, invoices, collection.');

-- =========================================
-- 2. SAMPLE TOPIC: EMPLOYMENT TERMINATION
-- =========================================

INSERT INTO topics (
  slug, title_ar, title_en, practice_area_id,
  audience, jurisdiction, content_type, urgency, is_active
)
SELECT
  'employee-termination-jordan',
  'إنهاء خدمة العامل في الأردن',
  'Employment Termination in Jordan',
  id,
  ARRAY['employee','employer']::TEXT[],
  'Jordan',
  'general_information',
  'medium',
  TRUE
FROM practice_areas
WHERE slug = 'labor';

-- =========================================
-- 3. SAMPLE LEGAL SOURCES (Labor Law example)
-- =========================================

INSERT INTO legal_sources (
  source_type, title_ar, title_en, reference_number,
  article_number, effective_date, source_url, notes
)
VALUES
  (
    'law',
    'قانون العمل الأردني',
    'Jordan Labor Law',
    'Law No. 8 of 1996',
    'Article 27',
    '1996-01-01',
    'https://www.moj.gov.jo',  -- replace with actual Official Gazette link if available
    'General provisions on termination of employment contracts.'
  ),
  (
    'law',
    'قانون العمل الأردني',
    'Jordan Labor Law',
    'Law No. 8 of 1996',
    'Article 28',
    '1996-01-01',
    'https://www.moj.gov.jo',
    'Notice period and related obligations.'
  ),
  (
    'law',
    'قانون العمل الأردني',
    'Jordan Labor Law',
    'Law No. 8 of 1996',
    'Article 31',
    '1996-01-01',
    'https://www.moj.gov.jo',
    'End-of-service gratuity and related entitlements.'
  );

-- =========================================
-- 4. TOPIC VERSION: EMPLOYMENT TERMINATION (structured JSON content)
-- =========================================

INSERT INTO topic_versions (
  topic_id, version_number, content_json,
  last_reviewed_at, reviewed_by_user_id,
  confidence_level, is_current
)
SELECT
  t.id,
  1,
  '{
    "user_questions": [
      "تم فصلي من العمل",
      "هل الفصل تعسفي؟",
      "ما حقوقي بعد إنهاء العقد؟",
      "كم مدة الإشعار الواجبة؟",
      "ما هي مستحقات نهاية الخدمة؟"
    ],
    "key_facts": [
      "نوع العقد (محدد المدة / غير محدد المدة)",
      "مدة الخدمة",
      "سبب الإنهاء (من قبل العامل / صاحب العمل)",
      "تاريخ الإنهاء",
      "الأجر الأساسي والبدلات",
      "وجود إشعار مسبق",
      "وجود مخالفات تأديبية مزعومة"
    ],
    "explanation_ar": "
      إنهاء خدمة العامل في الأردن ينظمه قانون العمل الأردني. 
      تختلف الحقوق حسب نوع العقد، ومدة الخدمة، وسبب الإنهاء، وما إذا تم الالتزام بالإجراءات القانونية.
      هذه الصفحة تقدم معلومات عامة ولا تحدد حقوقك النهائية في واقعة معينة.
    ",
    "explanation_en": "
      Employment termination in Jordan is governed by the Jordan Labor Law.
      Rights differ depending on the type of contract, length of service, reason for termination,
      and whether legal procedures were followed. This page provides general information only.
    ",
    "steps_employee": [
      "راجع عقد العمل لتحديد نوعه ومدته وشروط الإنهاء.",
      "تحقق من وجود إشعار مسبق وما إذا تم الالتزام به.",
      "اجمع مستنداتك: العقد، كشوف الراتب، أي خطابات إنذار أو قرار فصل.",
      "احسب مستحقاتك التقريبية (أجر فترة الإشعار، نهاية الخدمة، إجازات مستحقة).",
      "إذا كان الفصل يبدو مخالفًا، استشر محامٍ لتقييم إمكانية رفع شكوى أو دعوى عمالية."
    ],
    "steps_employer": [
      "تحقق من وجود سبب مشروع للإنهاء وفقًا للعقد والقانون.",
      "التزم بمدة الإشعار الواجبة أو ادفع بدل الإشعار.",
      "أصدر قرار الفصل خطيًا وبلغة واضحة، مع ذكر التاريخ والأسباب العامة.",
      "احسب مستحقات العامل النهائية (أجر، إشعار، نهاية خدمة، إجازات).",
      "احفظ ملفًا كاملًا بالمستندات تحسبًا لأي نزاع مستقبلي."
    ],
    "documents_to_keep": [
      "عقد العمل",
      "كشوف الراتب",
      "خطابات الإنذار (إن وُجدت)",
      "قرار الفصل أو رسالة الإنهاء",
      "إثباتات دفع المستحقات النهائية"
    ],
    "deadlines": [
      "فترة الإشعار حسب العقد أو القانون (عادة شهر).",
      "مواعيد دفع المستحقات النهائية بعد الإنهاء.",
      "المدد القانونية لرفع الدعاوى العمالية (تختلف حسب نوع المطالبة)."
    ],
    "competent_authorities_ar": "
      وزارة العمل (للشكاوى الإدارية الأولية)، ومحاكم العمل المختصة للنزاعات القضائية.
    ",
    "competent_authorities_en": "
      Ministry of Labor (for initial administrative complaints) and competent labor courts for judicial disputes.
    ",
    "when_to_see_lawyer": [
      "إذا كان الفصل بدون إشعار أو بدون سبب واضح.",
      "إذا كانت المستحقات كبيرة أو غير مدفوعة.",
      "إذا كانت هناك مخالفات تأديبية مزعومة قد تؤثر على سمعتك أو مستقبلك الوظيفي.",
      "إذا كنت تخطط لرفع دعوى عمالية أو الدفاع عن دعوى ضدك."
    ],
    "disclaimer_ar": "
      هذه معلومات قانونية عامة وليست استشارة قانونية. 
      للتقييم النهائي لحالتك، يُنصح بمراجعة محامٍ مرخّص.
    ",
    "disclaimer_en": "
      This is general legal information, not legal advice.
      For a final assessment of your situation, consult a licensed lawyer.
    "
  }'::JSONB,
  '2026-08-01',
  NULL,  -- reviewed_by_user_id can be set later
  'high',
  TRUE
FROM topics t
WHERE t.slug = 'employee-termination-jordan';

-- =========================================
-- 5. LINK TOPIC TO LEGAL SOURCES
-- =========================================

INSERT INTO topic_legal_sources (topic_id, legal_source_id, relevance_note_ar, relevance_note_en)
SELECT
  t.id,
  ls.id,
  'ينظم أحكام إنهاء عقد العمل والإشعار.',
  'Governs termination of employment contracts and notice periods.'
FROM topics t
CROSS JOIN legal_sources ls
WHERE t.slug = 'employee-termination-jordan'
  AND ls.reference_number = 'Law No. 8 of 1996'
  AND ls.article_number IN ('Article 27', 'Article 28', 'Article 31');

-- =========================================
-- 6. SAMPLE TOPIC: SECURITY DEPOSIT (RENT)
-- =========================================

INSERT INTO topics (
  slug, title_ar, title_en, practice_area_id,
  audience, jurisdiction, content_type, urgency, is_active
)
SELECT
  'tenant-security-deposit-refund-jordan',
  'إرجاع وديعة الضمان للمستأجر في الأردن',
  'Tenant Security Deposit Refund in Jordan',
  id,
  ARRAY['tenant','landlord']::TEXT[],
  'Jordan',
  'general_information',
  'medium',
  TRUE
FROM practice_areas
WHERE slug = 'rent';

-- =========================================
-- 7. TOPIC VERSION: SECURITY DEPOSIT (structured JSON content)
-- =========================================

INSERT INTO topic_versions (
  topic_id, version_number, content_json,
  last_reviewed_at, reviewed_by_user_id,
  confidence_level, is_current
)
SELECT
  t.id,
  1,
  '{
    "user_questions": [
      "المالك يرفض إرجاع مبلغ الضمان",
      "متى يحق للمالك خصم من الوديعة؟",
      "كيف أسترد وديعة الإيجار؟",
      "هل يحق للمالك خصم مبلغ للصيانة؟"
    ],
    "key_facts": [
      "مبلغ الوديعة",
      "تاريخ دفع الوديعة",
      "تاريخ الإخلاء وتسليم المفاتيح",
      "حالة العقار عند التسليم",
      "وجود محضر استلام/تسليم أو صور",
      "أي إيجارات أو فواتير متأخرة",
      "نص بند الوديعة في العقد"
    ],
    "explanation_ar": "
      وديعة الضمان في عقود الإيجار تُدفع لتغطية الأضرار المحتملة أو الإيجارات المتأخرة.
      عند انتهاء الإيجار، يجب إرجاع الوديعة بعد خصم المبالغ المستحقة والمثبتة فقط.
      هذه الصفحة تقدم معلومات عامة ولا تحسم النزاع في حالتك الخاصة.
    ",
    "explanation_en": "
      A security deposit in tenancy contracts is paid to cover potential damages or unpaid rent.
      At the end of the tenancy, the deposit should be refunded after deducting only proven, due amounts.
      This page provides general information and does not decide your specific dispute.
    ",
    "steps_tenant": [
      "راجع عقد الإيجار وبند الوديعة.",
      "اجمع إثبات دفع الوديعة (تحويل، إيصال، رسائل).",
      "وثّق حالة العقار عند التسليم (صور، فيديو، محضر إن وُجد).",
      "أرسل طلبًا خطيًا للمالك بإرجاع الوديعة خلال مهلة معقولة.",
      "إذا رفض المالك دون سبب واضح، استشر محامٍ لرفع دعوى استرداد المبلغ."
    ],
    "steps_landlord": [
      "راجع العقد وبند الوديعة وشروط الخصم.",
      "وثّق أي أضرار تتجاوز الاستهلاك الطبيعي بفواتير أو تقديرات.",
      "أرسل للمستأجر كشفًا مفصلاً بالخصومات المبررة.",
      "أرجع الباقي من الوديعة خلال مهلة معقولة.",
      "احفظ كل المستندات تحسبًا لأي نزاع."
    ],
    "documents_to_keep": [
      "عقد الإيجار",
      "إثبات دفع الوديعة",
      "صور أو محضر استلام/تسليم",
      "فواتير الصيانة أو الإصلاحات (إن وُجدت)",
      "المراسلات بين المالك والمستأجر"
    ],
    "deadlines": [
      "مهلة معقولة لإرجاع الوديعة بعد الإخلاء (حسب العرف والعقد).",
      "المدد القانونية لرفع دعاوى استرداد المبالغ (تختلف حسب قيمة المبلغ)."
    ],
    "competent_authorities_ar": "
      محاكم الصلح (للمبالغ الصغيرة) أو المحاكم المدنية المختصة حسب قيمة المطالبة.
    ",
    "competent_authorities_en": "
      Magistrates'' Courts (for small amounts) or competent civil courts depending on the claim value.
    ",
    "when_to_see_lawyer": [
      "إذا كان مبلغ الوديعة كبيرًا.",
      "إذا كان المالك يخصم مبالغ كبيرة دون فواتير أو إثبات.",
      "إذا كانت هناك نزاعات إضافية (إيجار متأخر، أضرار مزعومة).",
      "إذا رغبت برفع دعوى استرداد مبلغ بشكل رسمي."
    ],
    "disclaimer_ar": "
      هذه معلومات قانونية عامة وليست استشارة قانونية.
      للتقييم النهائي لحالتك، يُنصح بمراجعة محامٍ مرخّص.
    ",
    "disclaimer_en": "
      This is general legal information, not legal advice.
      For a final assessment of your situation, consult a licensed lawyer.
    "
  }'::JSONB,
  '2026-08-01',
  NULL,
  'high',
  TRUE
FROM topics t
WHERE t.slug = 'tenant-security-deposit-refund-jordan';

-- =========================================
-- 8. SAMPLE LAWYERS (for referral layer)
-- =========================================

INSERT INTO lawyers (
  full_name, bar_membership_number, verification_status,
  verified_at, practice_areas, governorates_served,
  languages, service_types, pricing_info_ar, pricing_info_en,
  contact_email, contact_phone, profile_url,
  complaints_policy_ar, complaints_policy_en,
  last_updated_at, is_active
)
VALUES
  (
    'أحمد محمد الخطيب',
    'JBA-12345',
    'verified',
    NOW(),
    ARRAY['labor','debt']::TEXT[],
    ARRAY['Amman']::TEXT[],
    ARRAY['ar','en']::TEXT[],
    ARRAY['consultation','litigation','drafting']::TEXT[],
    'استشارة ساعة واحدة: 50 دينار أردني. الدعاوى حسب الاتفاق.',
    'One-hour consultation: 50 JOD. Litigation fees by agreement.',
    'ahmed.khatib@example.jo',
    '+962-7-XXXX-XXXX',
    '/lawyers/ahmed-khatib',
    'يمكن تقديم شكوى عبر البريد الإلكتروني للمكتب.',
    'Complaints can be submitted via office email.',
    NOW(),
    TRUE
  ),
  (
    'سارة يوسف العمري',
    'JBA-67890',
    'verified',
    NOW(),
    ARRAY['rent','family']::TEXT[],
    ARRAY['Amman','Zarqa']::TEXT[],
    ARRAY['ar']::TEXT[],
    ARRAY['consultation','litigation']::TEXT[],
    'الاستشارة الأولى مجانًا، الدعاوى حسب التعقيد.',
    'First consultation free, litigation fees depend on complexity.',
    'sara.omari@example.jo',
    '+962-7-YYYY-YYYY',
    '/lawyers/sara-omari',
    'سياسة الشكاوى متاحة عند الطلب.',
    'Complaints policy available upon request.',
    NOW(),
    TRUE
  );

-- =========================================
-- 9. SAMPLE UNANSWERED QUESTIONS (for content gaps)
-- =========================================

INSERT INTO unanswered_questions (
  user_id, question_text_ar, question_text_en,
  practice_area_guess, related_topic_id, is_resolved
)
SELECT
  NULL,
  'المالك يرفض إرجاع مبلغ الضمان',
  'Landlord refuses to return security deposit',
  'rent',
  t.id,
  FALSE
FROM topics t
WHERE t.slug = 'tenant-security-deposit-refund-jordan';

-- =========================================
-- 10. SAMPLE ANALYTICS EVENTS
-- =========================================

INSERT INTO topic_analytics (topic_id, event_type, user_id, session_id, metadata_json)
SELECT
  t.id,
  'page_view',
  NULL,
  'session-demo-001',
  '{"source": "seed_data"}'::JSONB
FROM topics t
WHERE t.slug IN ('employee-termination-jordan', 'tenant-security-deposit-refund-jordan');
