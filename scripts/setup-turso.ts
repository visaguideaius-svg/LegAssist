import { createClient } from '@libsql/client';

const DB_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODY5MjYxMzUsImlkIjoiMDFhMDBjZTAtYTIwMS03MjRhLTg2MmEtNzI1NWFhZjUxYzUyIiwia2lkIjoiR01XdTkxZWljZEgxVDdrQUFsd1lFSUJDTUtjMzM2NDJfQmtrOHpaVDg2ZyIsInJpZCI6ImM0YmM2ZjdjLTZjYTItNDc1OS04NWRhLTZhZWY0Y2U4Y2Y4ZCJ9.JP8FmdTkSwCp75L6so3YusoVTArd9pMpWz1_DEx5F1PU7PKspflpsUHb7D6Py9sxUX3mlR3Oai5OpU82OBB8CA";

const turso = createClient({
  url: 'libsql://legassist-visaguideaius-svg.aws-eu-west-1.turso.io',
  authToken: DB_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS practice_areas (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    practice_area_id TEXT NOT NULL,
    audience TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    content_type TEXT NOT NULL,
    urgency TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (practice_area_id) REFERENCES practice_areas(id)
  )`,
  `CREATE TABLE IF NOT EXISTS topic_versions (
    id TEXT PRIMARY KEY NOT NULL,
    topic_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    content_json TEXT NOT NULL,
    last_reviewed_at DATETIME NOT NULL,
    reviewed_by_user_id TEXT,
    confidence_level TEXT NOT NULL,
    is_current INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
  )`,
  `CREATE TABLE IF NOT EXISTS legal_sources (
    id TEXT PRIMARY KEY NOT NULL,
    source_type TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    article_number TEXT,
    effective_date DATETIME NOT NULL,
    source_url TEXT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS topic_legal_sources (
    id TEXT PRIMARY KEY NOT NULL,
    topic_id TEXT NOT NULL,
    legal_source_id TEXT NOT NULL,
    relevance_note_ar TEXT,
    relevance_note_en TEXT,
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (legal_source_id) REFERENCES legal_sources(id)
  )`,
  `CREATE TABLE IF NOT EXISTS lawyers (
    id TEXT PRIMARY KEY NOT NULL,
    full_name TEXT NOT NULL,
    bar_membership_number TEXT NOT NULL UNIQUE,
    verification_status TEXT NOT NULL,
    verified_at DATETIME,
    practice_areas TEXT NOT NULL,
    governorates_served TEXT NOT NULL,
    languages TEXT NOT NULL,
    service_types TEXT NOT NULL,
    pricing_info_ar TEXT NOT NULL,
    pricing_info_en TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    profile_url TEXT,
    complaints_policy_ar TEXT,
    complaints_policy_en TEXT,
    last_updated_at DATETIME NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS unanswered_questions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    question_text_ar TEXT NOT NULL,
    question_text_en TEXT,
    practice_area_guess TEXT,
    related_topic_id TEXT,
    is_resolved INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS visualizations (
    id TEXT PRIMARY KEY NOT NULL,
    topic_id TEXT,
    topic_version_id TEXT,
    source_answer_hash TEXT NOT NULL,
    language TEXT NOT NULL,
    template TEXT NOT NULL DEFAULT 'legal-summary',
    input_answer TEXT NOT NULL,
    infographic_spec TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'generated',
    rendered_image_path TEXT,
    rendered_pdf_path TEXT,
    generated_by_model TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
  )`,
  `CREATE TABLE IF NOT EXISTS topic_analytics (
    id TEXT PRIMARY KEY NOT NULL,
    topic_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    user_id TEXT,
    session_id TEXT,
    metadata_json TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
  )`,
];

async function setup() {
  console.log('Creating tables on Turso...\n');
  for (const sql of statements) {
    const tableMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
    const tableName = tableMatch ? tableMatch[1] : 'unknown';
    try {
      await turso.execute(sql);
      console.log(`  ✅ ${tableName}`);
    } catch (e: any) {
      console.log(`  ❌ ${tableName}: ${e.message?.substring(0, 80)}`);
    }
  }

  // Verify
  const result = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('\nTables in Turso:');
  for (const row of result.rows) {
    console.log(`  • ${row.name}`);
  }

  // Seed practice areas
  console.log('\nSeeding practice areas...');
  const areas = [
    { slug: 'labor-law', title_ar: 'قانون العمل', title_en: 'Labor Law', description_ar: 'قوانين العمل والأجور وحقوق العمال في الأردن', description_en: 'Jordanian labor laws, wages, and worker rights' },
    { slug: 'rent-real-estate', title_ar: 'الإيجار والعقار', title_en: 'Rent & Real Estate', description_ar: 'قوانين الإيجار والملكية العقارية', description_en: 'Rental and property ownership laws' },
    { slug: 'family-law', title_ar: 'القانون الأسري', title_en: 'Family Law', description_ar: 'قوانين الأحوال الشخصية والزواج والطلاق', description_en: 'Personal status, marriage, and divorce laws' },
    { slug: 'debt-enforcement', title_ar: 'الديون والتنفيذ', title_en: 'Debt & Enforcement', description_ar: 'قوانين الدين والتنفيذ والحجز', description_en: 'Debt collection and enforcement laws' },
    { slug: 'accidents-compensation', title_ar: 'الحوادث والتعويض', title_en: 'Accidents & Compensation', description_ar: 'قوانين الحوادث والتعويضات', description_en: 'Accident and compensation laws' },
    { slug: 'cybercrime', title_ar: 'الجرم الإلكتروني', title_en: 'Cybercrime', description_ar: 'قوانين الجرائم الإلكترونية وأمن المعلومات', description_en: 'Cybercrime and information security laws' },
    { slug: 'small-business', title_ar: 'المؤسسات الصغيرة', title_en: 'Small Business', description_ar: 'تأسيس الشركات والمؤسسات الصغيرة', description_en: 'Company formation and small business laws' },
    { slug: 'court-procedures', title_ar: 'إجراءات المحاكم', title_en: 'Court Procedures', description_ar: 'إجراءات التقاضي والمحاكم', description_en: 'Litigation and court procedures' },
  ];

  for (const area of areas) {
    const id = area.slug.replace(/-/g, '') + '01';
    try {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO practice_areas (id, slug, title_ar, title_en, description_ar, description_en) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [id, area.slug, area.title_ar, area.title_en, area.description_ar, area.description_en],
      });
      console.log(`  ✅ Seeded: ${area.title_en}`);
    } catch (e: any) {
      console.log(`  ❌ ${area.title_en}: ${e.message?.substring(0, 60)}`);
    }
  }

  console.log('\nDone! Turso database is ready.');
}

setup().catch(console.error);
