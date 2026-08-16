import { db } from '../src/lib/db';

async function seed() {
  console.log('🌱 Seeding Jordanian Legal Knowledge Platform...');

  // ─── 1. Practice Areas ────────────────────────────
  console.log('  Creating practice areas...');

  const labor = await db.practiceArea.create({
    data: {
      slug: 'labor',
      titleAr: 'العمل',
      titleEn: 'Labor & Employment',
      descriptionAr: 'قضايا العمل: الفصل، الأجور، الإجازات، ساعات العمل، الضمان الاجتماعي.',
      descriptionEn: 'Employment matters: termination, wages, leave, working hours, social security.',
    },
  });

  const rent = await db.practiceArea.create({
    data: {
      slug: 'rent',
      titleAr: 'الإيجارات والعقارات',
      titleEn: 'Rent & Real Estate',
      descriptionAr: 'قضايا الإيجار: الإخلاء، الأجرة، الصيانة، الوديعة، البيع والشراء.',
      descriptionEn: 'Tenancy and real estate: eviction, rent, maintenance, security deposit, sale and purchase.',
    },
  });

  await db.practiceArea.createMany({
    data: [
      {
        slug: 'family',
        titleAr: 'الأسرة',
        titleEn: 'Family Law',
        descriptionAr: 'قضايا الأسرة: النفقة، الحضانة، التفريق، الميراث، تنفيذ الأحكام.',
        descriptionEn: 'Family matters: maintenance, custody, separation, inheritance, enforcement of judgments.',
      },
      {
        slug: 'debt',
        titleAr: 'الديون والتنفيذ',
        titleEn: 'Debt & Enforcement',
        descriptionAr: 'قضايا الديون: سند الدين، الشيك، الحجز، التقسيط، التبليغ.',
        descriptionEn: 'Debt and enforcement: debt instruments, cheques, attachment, installment plans, service of process.',
      },
      {
        slug: 'traffic',
        titleAr: 'المرور والتعويض',
        titleEn: 'Traffic & Compensation',
        descriptionAr: 'حوادث السير، التأمين، الإصابات، الأضرار، المطالبات التعويضية.',
        descriptionEn: 'Traffic accidents, insurance, injuries, damages, compensation claims.',
      },
      {
        slug: 'cybercrime',
        titleAr: 'الجرائم الإلكترونية',
        titleEn: 'Cybercrime',
        descriptionAr: 'الابتزاز، التشهير، انتحال الشخصية، حفظ الأدلة الإلكترونية.',
        descriptionEn: 'Extortion, defamation, impersonation, preservation of electronic evidence.',
      },
      {
        slug: 'court_procedure',
        titleAr: 'الإجراءات القضائية',
        titleEn: 'Court Procedures',
        descriptionAr: 'المحكمة المختصة، الاستئناف، المدد، التبليغ، الطعون.',
        descriptionEn: 'Competent court, appeals, deadlines, service of process, challenges.',
      },
      {
        slug: 'small_business',
        titleAr: 'الأعمال الصغيرة',
        titleEn: 'Small Business',
        descriptionAr: 'تسجيل الشركة، العقود، الشركاء، الفواتير، التحصيل.',
        descriptionEn: 'Company registration, contracts, partners, invoices, collection.',
      },
    ],
  });

  // ─── 2. Legal Sources ─────────────────────────────
  console.log('  Creating legal sources...');

  const art27 = await db.legalSource.create({
    data: {
      sourceType: 'law',
      titleAr: 'قانون العمل الأردني',
      titleEn: 'Jordan Labor Law',
      referenceNumber: 'Law No. 8 of 1996',
      articleNumber: 'Article 27',
      effectiveDate: new Date('1996-01-01'),
      sourceUrl: 'https://www.moj.gov.jo',
      notes: 'General provisions on termination of employment contracts.',
    },
  });

  const art28 = await db.legalSource.create({
    data: {
      sourceType: 'law',
      titleAr: 'قانون العمل الأردني',
      titleEn: 'Jordan Labor Law',
      referenceNumber: 'Law No. 8 of 1996',
      articleNumber: 'Article 28',
      effectiveDate: new Date('1996-01-01'),
      sourceUrl: 'https://www.moj.gov.jo',
      notes: 'Notice period and related obligations.',
    },
  });

  const art31 = await db.legalSource.create({
    data: {
      sourceType: 'law',
      titleAr: 'قانون العمل الأردني',
      titleEn: 'Jordan Labor Law',
      referenceNumber: 'Law No. 8 of 1996',
      articleNumber: 'Article 31',
      effectiveDate: new Date('1996-01-01'),
      sourceUrl: 'https://www.moj.gov.jo',
      notes: 'End-of-service gratuity and related entitlements.',
    },
  });

  // ─── 3. Topic: Employment Termination ──────────────
  console.log('  Creating topic: Employment Termination...');

  const empTerm = await db.topic.create({
    data: {
      slug: 'employee-termination-jordan',
      titleAr: 'إنهاء خدمة العامل في الأردن',
      titleEn: 'Employment Termination in Jordan',
      practiceAreaId: labor.id,
      audience: JSON.stringify(['employee', 'employer']),
      jurisdiction: 'Jordan',
      contentType: 'general_information',
      urgency: 'medium',
      isActive: true,
    },
  });

  const empTermContent = {
    user_questions: [
      'تم فصلي من العمل',
      'هل الفصل تعسفي؟',
      'ما حقوقي بعد إنهاء العقد؟',
      'كم مدة الإشعار الواجبة؟',
      'ما هي مستحقات نهاية الخدمة؟',
    ],
    key_facts: [
      'نوع العقد (محدد المدة / غير محدد المدة)',
      'مدة الخدمة',
      'سبب الإنهاء (من قبل العامل / صاحب العمل)',
      'تاريخ الإنهاء',
      'الأجر الأساسي والبدلات',
      'وجود إشعار مسبق',
      'وجود مخالفات تأديبية مزعومة',
    ],
    explanation_ar:
      'إنهاء خدمة العامل في الأردن ينظمه قانون العمل الأردني. تختلف الحقوق حسب نوع العقد، ومدة الخدمة، وسبب الإنهاء، وما إذا تم الالتزام بالإجراءات القانونية. هذه الصفحة تقدم معلومات عامة ولا تحدد حقوقك النهائية في واقعة معينة.',
    explanation_en:
      'Employment termination in Jordan is governed by the Jordan Labor Law. Rights differ depending on the type of contract, length of service, reason for termination, and whether legal procedures were followed. This page provides general information only.',
    steps_employee: [
      'راجع عقد العمل لتحديد نوعه ومدته وشروط الإنهاء.',
      'تحقق من وجود إشعار مسبق وما إذا تم الالتزام به.',
      'اجمع مستنداتك: العقد، كشوف الراتب، أي خطابات إنذار أو قرار فصل.',
      'احسب مستحقاتك التقريبية (أجر فترة الإشعار، نهاية الخدمة، إجازات مستحقة).',
      'إذا كان الفصل يبدو مخالفًا، استشر محامٍ لتقييم إمكانية رفع شكوى أو دعوى عمالية.',
    ],
    steps_employer: [
      'تحقق من وجود سبب مشروع للإنهاء وفقًا للعقد والقانون.',
      'التزم بمدة الإشعار الواجبة أو ادفع بدل الإشعار.',
      'أصدر قرار الفصل خطيًا وبلغة واضحة، مع ذكر التاريخ والأسباب العامة.',
      'احسب مستحقات العامل النهائية (أجر، إشعار، نهاية خدمة، إجازات).',
      'احفظ ملفًا كاملًا بالمستندات تحسبًا لأي نزاع مستقبلي.',
    ],
    documents_to_keep: [
      'عقد العمل',
      'كشوف الراتب',
      'خطابات الإنذار (إن وُجدت)',
      'قرار الفصل أو رسالة الإنهاء',
      'إثباتات دفع المستحقات النهائية',
    ],
    deadlines: [
      'فترة الإشعار حسب العقد أو القانون (عادة شهر).',
      'مواعيد دفع المستحقات النهائية بعد الإنهاء.',
      'المدد القانونية لرفع الدعاوى العمالية (تختلف حسب نوع المطالبة).',
    ],
    competent_authorities_ar:
      'وزارة العمل (للشكاوى الإدارية الأولية)، ومحاكم العمل المختصة للنزاعات القضائية.',
    competent_authorities_en:
      'Ministry of Labor (for initial administrative complaints) and competent labor courts for judicial disputes.',
    when_to_see_lawyer: [
      'إذا كان الفصل بدون إشعار أو بدون سبب واضح.',
      'إذا كانت المستحقات كبيرة أو غير مدفوعة.',
      'إذا كانت هناك مخالفات تأديبية مزعومة قد تؤثر على سمعتك أو مستقبلك الوظيفي.',
      'إذا كنت تخطط لرفع دعوى عمالية أو الدفاع عن دعوى ضدك.',
    ],
    disclaimer_ar:
      'هذه معلومات قانونية عامة وليست استشارة قانونية. للتقييم النهائي لحالتك، يُنصح بمراجعة محامٍ مرخّص.',
    disclaimer_en:
      'This is general legal information, not legal advice. For a final assessment of your situation, consult a licensed lawyer.',
  };

  await db.topicVersion.create({
    data: {
      topicId: empTerm.id,
      versionNumber: 1,
      contentJson: JSON.stringify(empTermContent),
      lastReviewedAt: new Date('2026-08-01'),
      confidenceLevel: 'high',
      isCurrent: true,
    },
  });

  // Link legal sources
  for (const src of [art27, art28, art31]) {
    await db.topicLegalSource.create({
      data: {
        topicId: empTerm.id,
        legalSourceId: src.id,
        relevanceNoteAr: 'ينظم أحكام إنهاء عقد العمل والإشعار.',
        relevanceNoteEn: 'Governs termination of employment contracts and notice periods.',
      },
    });
  }

  // ─── 4. Topic: Security Deposit ────────────────────
  console.log('  Creating topic: Security Deposit...');

  const secDep = await db.topic.create({
    data: {
      slug: 'tenant-security-deposit-refund-jordan',
      titleAr: 'إرجاع وديعة الضمان للمستأجر في الأردن',
      titleEn: 'Tenant Security Deposit Refund in Jordan',
      practiceAreaId: rent.id,
      audience: JSON.stringify(['tenant', 'landlord']),
      jurisdiction: 'Jordan',
      contentType: 'general_information',
      urgency: 'medium',
      isActive: true,
    },
  });

  const secDepContent = {
    user_questions: [
      'المالك يرفض إرجاع مبلغ الضمان',
      'متى يحق للمالك خصم من الوديعة؟',
      'كيف أسترد وديعة الإيجار؟',
      'هل يحق للمالك خصم مبلغ للصيانة؟',
    ],
    key_facts: [
      'مبلغ الوديعة',
      'تاريخ دفع الوديعة',
      'تاريخ الإخلاء وتسليم المفاتيح',
      'حالة العقار عند التسليم',
      'وجود محضر استلام/تسليم أو صور',
      'أي إيجارات أو فواتير متأخرة',
      'نص بند الوديعة في العقد',
    ],
    explanation_ar:
      'وديعة الضمان في عقود الإيجار تُدفع لتغطية الأضرار المحتملة أو الإيجارات المتأخرة. عند انتهاء الإيجار، يجب إرجاع الوديعة بعد خصم المبالغ المستحقة والمثبتة فقط. هذه الصفحة تقدم معلومات عامة ولا تحسم النزاع في حالتك الخاصة.',
    explanation_en:
      'A security deposit in tenancy contracts is paid to cover potential damages or unpaid rent. At the end of the tenancy, the deposit should be refunded after deducting only proven, due amounts. This page provides general information and does not decide your specific dispute.',
    steps_tenant: [
      'راجع عقد الإيجار وبند الوديعة.',
      'اجمع إثبات دفع الوديعة (تحويل، إيصال، رسائل).',
      'وثّق حالة العقار عند التسليم (صور، فيديو، محضر إن وُجد).',
      'أرسل طلبًا خطيًا للمالك بإرجاع الوديعة خلال مهلة معقولة.',
      'إذا رفض المالك دون سبب واضح، استشر محامٍ لرفع دعوى استرداد المبلغ.',
    ],
    steps_landlord: [
      'راجع العقد وبند الوديعة وشروط الخصم.',
      'وثّق أي أضرار تتجاوز الاستهلاك الطبيعي بفواتير أو تقديرات.',
      'أرسل للمستأجر كشفًا مفصلاً بالخصومات المبررة.',
      'أرجع الباقي من الوديعة خلال مهلة معقولة.',
      'احفظ كل المستندات تحسبًا لأي نزاع.',
    ],
    documents_to_keep: [
      'عقد الإيجار',
      'إثبات دفع الوديعة',
      'صور أو محضر استلام/تسليم',
      'فواتير الصيانة أو الإصلاحات (إن وُجدت)',
      'المراسلات بين المالك والمستأجر',
    ],
    deadlines: [
      'مهلة معقولة لإرجاع الوديعة بعد الإخلاء (حسب العرف والعقد).',
      'المدد القانونية لرفع دعاوى استرداد المبالغ (تختلف حسب قيمة المبلغ).',
    ],
    competent_authorities_ar:
      'محاكم الصلح (للمبالغ الصغيرة) أو المحاكم المدنية المختصة حسب قيمة المطالبة.',
    competent_authorities_en:
      "Magistrates' Courts (for small amounts) or competent civil courts depending on the claim value.",
    when_to_see_lawyer: [
      'إذا كان مبلغ الوديعة كبيرًا.',
      'إذا كان المالك يخصم مبالغ كبيرة دون فواتير أو إثبات.',
      'إذا كانت هناك نزاعات إضافية (إيجار متأخر، أضرار مزعومة).',
      'إذا رغبت برفع دعوى استرداد مبلغ بشكل رسمي.',
    ],
    disclaimer_ar:
      'هذه معلومات قانونية عامة وليست استشارة قانونية. للتقييم النهائي لحالتك، يُنصح بمراجعة محامٍ مرخّص.',
    disclaimer_en:
      'This is general legal information, not legal advice. For a final assessment of your situation, consult a licensed lawyer.',
  };

  await db.topicVersion.create({
    data: {
      topicId: secDep.id,
      versionNumber: 1,
      contentJson: JSON.stringify(secDepContent),
      lastReviewedAt: new Date('2026-08-01'),
      confidenceLevel: 'high',
      isCurrent: true,
    },
  });

  // ─── 5. Sample Lawyers ────────────────────────────
  console.log('  Creating sample lawyers...');

  await db.lawyer.createMany({
    data: [
      {
        fullName: 'أحمد محمد الخطيب',
        barMembershipNumber: 'JBA-12345',
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        practiceAreas: JSON.stringify(['labor', 'debt']),
        governoratesServed: JSON.stringify(['Amman']),
        languages: JSON.stringify(['ar', 'en']),
        serviceTypes: JSON.stringify(['consultation', 'litigation', 'drafting']),
        pricingInfoAr: 'استشارة ساعة واحدة: 50 دينار أردني. الدعاوى حسب الاتفاق.',
        pricingInfoEn: 'One-hour consultation: 50 JOD. Litigation fees by agreement.',
        contactEmail: 'ahmed.khatib@example.jo',
        contactPhone: '+962-7-XXXX-XXXX',
        profileUrl: '/lawyers/ahmed-khatib',
        complaintsPolicyAr: 'يمكن تقديم شكوى عبر البريد الإلكتروني للمكتب.',
        complaintsPolicyEn: 'Complaints can be submitted via office email.',
        lastUpdatedAt: new Date(),
        isActive: true,
      },
      {
        fullName: 'سارة يوسف العمري',
        barMembershipNumber: 'JBA-67890',
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        practiceAreas: JSON.stringify(['rent', 'family']),
        governoratesServed: JSON.stringify(['Amman', 'Zarqa']),
        languages: JSON.stringify(['ar']),
        serviceTypes: JSON.stringify(['consultation', 'litigation']),
        pricingInfoAr: 'الاستشارة الأولى مجانًا، الدعاوى حسب التعقيد.',
        pricingInfoEn: 'First consultation free, litigation fees depend on complexity.',
        contactEmail: 'sara.omari@example.jo',
        contactPhone: '+962-7-YYYY-YYYY',
        profileUrl: '/lawyers/sara-omari',
        complaintsPolicyAr: 'سياسة الشكاوى متاحة عند الطلب.',
        complaintsPolicyEn: 'Complaints policy available upon request.',
        lastUpdatedAt: new Date(),
        isActive: true,
      },
    ],
  });

  // ─── 6. Unanswered Questions ───────────────────────
  console.log('  Creating sample unanswered questions...');

  await db.unansweredQuestion.create({
    data: {
      questionTextAr: 'المالك يرفض إرجاع مبلغ الضمان',
      questionTextEn: 'Landlord refuses to return security deposit',
      practiceAreaGuess: 'rent',
      relatedTopicId: secDep.id,
      isResolved: false,
    },
  });

  // ─── 7. Analytics Events ──────────────────────────
  console.log('  Creating sample analytics events...');

  await db.topicAnalytics.createMany({
    data: [
      {
        topicId: empTerm.id,
        eventType: 'page_view',
        sessionId: 'session-demo-001',
        metadataJson: JSON.stringify({ source: 'seed_data' }),
      },
      {
        topicId: secDep.id,
        eventType: 'page_view',
        sessionId: 'session-demo-001',
        metadataJson: JSON.stringify({ source: 'seed_data' }),
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log(`   - 8 practice areas`);
  console.log(`   - 2 topics (Employment Termination, Security Deposit)`);
  console.log(`   - 3 legal sources (Labor Law Art. 27, 28, 31)`);
  console.log(`   - 2 topic versions`);
  console.log(`   - 2 lawyers`);
  console.log(`   - 1 unanswered question`);
  console.log(`   - 2 analytics events`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
