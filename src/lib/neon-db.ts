import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';
import {
  AuthUser,
  UserRole,
  Student,
  StudentSubmissionPayload,
  Skill,
  Project,
  Certificate,
} from '@/types';

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaInitialized: Promise<void> | null = null;

function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.STORAGE_POSTGRES_URL ||
    process.env.STORAGE_URL ||
    process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error(
      'Missing DATABASE_URL environment variable. Add your Neon Postgres connection string to .env.local and Vercel Environment Variables.'
    );
  }
  return url;
}

function getSql(): NeonQueryFunction<false, false> {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl());
  }
  return sqlClient;
}

async function ensureSchema(): Promise<NeonQueryFunction<false, false>> {
  const sql = getSql();
  if (!schemaInitialized) {
    schemaInitialized = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL,
          full_name TEXT NOT NULL,
          company_name TEXT,
          student_id TEXT,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          student_id TEXT UNIQUE NOT NULL,
          user_id TEXT,
          full_name TEXT NOT NULL,
          institutional_email TEXT UNIQUE NOT NULL,
          degree TEXT NOT NULL,
          branch TEXT NOT NULL,
          graduation_year INTEGER NOT NULL,
          cgpa DOUBLE PRECISION NOT NULL,
          headline_bio TEXT NOT NULL,
          linkedin_url TEXT,
          github_url TEXT,
          portfolio_url TEXT,
          resume_path TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `;

      await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS user_id TEXT`;

      await sql`
        CREATE TABLE IF NOT EXISTS skills (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          category TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          tech_stack TEXT NOT NULL,
          github_url TEXT,
          live_demo_url TEXT
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS certificates (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          issuing_org TEXT NOT NULL,
          issue_date TEXT,
          credential_url TEXT,
          file_path TEXT
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS uploaded_files (
          path_key TEXT PRIMARY KEY,
          mime_type TEXT NOT NULL,
          original_name TEXT NOT NULL,
          data_base64 TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_students_search ON students(branch, graduation_year)
      `;
    })().catch((err) => {
      schemaInitialized = null;
      throw err;
    });
  }
  await schemaInitialized;
  return sql;
}

export interface DbUserRow extends AuthUser {
  passwordHash: string;
}

function mapUserRow(row: any): DbUserRow {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role as UserRole,
    fullName: row.full_name,
    companyName: row.company_name || undefined,
    studentId: row.student_id || undefined,
    createdAt: row.created_at,
  };
}

export async function neonCreateUser(input: {
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  companyName?: string;
  studentId?: string;
}): Promise<AuthUser> {
  const sql = await ensureSchema();
  const id = randomUUID();
  const now = new Date().toISOString();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanStudentId = input.studentId ? input.studentId.trim().toUpperCase() : null;

  await sql`
    INSERT INTO users (id, email, password_hash, role, full_name, company_name, student_id, created_at)
    VALUES (
      ${id},
      ${cleanEmail},
      ${input.passwordHash},
      ${input.role},
      ${input.fullName.trim()},
      ${input.companyName?.trim() || null},
      ${cleanStudentId},
      ${now}
    )
  `;

  return {
    id,
    email: cleanEmail,
    role: input.role,
    fullName: input.fullName.trim(),
    companyName: input.companyName?.trim() || undefined,
    studentId: cleanStudentId || undefined,
    createdAt: now,
  };
}

export async function neonGetUserByEmail(email: string): Promise<DbUserRow | null> {
  const sql = await ensureSchema();
  const rows = await sql`SELECT * FROM users WHERE email = ${email.trim().toLowerCase()} LIMIT 1`;
  if (!rows.length) return null;
  return mapUserRow(rows[0]);
}

export async function neonGetUserByStudentId(studentId: string): Promise<DbUserRow | null> {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT * FROM users WHERE role = 'student' AND student_id = ${studentId.trim().toUpperCase()} LIMIT 1
  `;
  if (!rows.length) return null;
  return mapUserRow(rows[0]);
}

export async function neonGetUserById(id: string): Promise<AuthUser | null> {
  const sql = await ensureSchema();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  if (!rows.length) return null;
  const { passwordHash: _, ...user } = mapUserRow(rows[0]);
  return user;
}

function mapStudentRow(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id,
    userId: row.user_id || undefined,
    fullName: row.full_name,
    institutionalEmail: row.institutional_email,
    degree: row.degree,
    branch: row.branch,
    graduationYear: Number(row.graduation_year),
    cgpa: Number(row.cgpa),
    headlineBio: row.headline_bio,
    linkedinUrl: row.linkedin_url || undefined,
    githubUrl: row.github_url || undefined,
    portfolioUrl: row.portfolio_url || undefined,
    resumePath: row.resume_path || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function hydrateStudents(sql: NeonQueryFunction<false, false>, rows: any[]): Promise<Student[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);

  const [skillRows, projectRows, certRows] = await Promise.all([
    sql`SELECT * FROM skills WHERE student_id = ANY(${ids})`,
    sql`SELECT * FROM projects WHERE student_id = ANY(${ids})`,
    sql`SELECT * FROM certificates WHERE student_id = ANY(${ids})`,
  ]);

  const skillsByStudent = new Map<string, Skill[]>();
  for (const s of skillRows as any[]) {
    const arr = skillsByStudent.get(s.student_id) || [];
    arr.push({ id: s.id, studentId: s.student_id, name: s.name, category: s.category });
    skillsByStudent.set(s.student_id, arr);
  }

  const projectsByStudent = new Map<string, Project[]>();
  for (const p of projectRows as any[]) {
    const arr = projectsByStudent.get(p.student_id) || [];
    arr.push({
      id: p.id,
      studentId: p.student_id,
      title: p.title,
      description: p.description,
      techStack: JSON.parse(p.tech_stack || '[]'),
      githubUrl: p.github_url || undefined,
      liveDemoUrl: p.live_demo_url || undefined,
    });
    projectsByStudent.set(p.student_id, arr);
  }

  const certsByStudent = new Map<string, Certificate[]>();
  for (const c of certRows as any[]) {
    const arr = certsByStudent.get(c.student_id) || [];
    arr.push({
      id: c.id,
      studentId: c.student_id,
      title: c.title,
      issuingOrg: c.issuing_org,
      issueDate: c.issue_date || undefined,
      credentialUrl: c.credential_url || undefined,
      filePath: c.file_path || undefined,
    });
    certsByStudent.set(c.student_id, arr);
  }

  return rows.map((row) => {
    const student = mapStudentRow(row);
    student.skills = skillsByStudent.get(row.id) || [];
    student.projects = projectsByStudent.get(row.id) || [];
    student.certificates = certsByStudent.get(row.id) || [];
    return student;
  });
}

export async function neonGetAllStudents(filters?: {
  search?: string;
  branch?: string;
  year?: number;
}): Promise<Student[]> {
  const sql = await ensureSchema();
  const branchFilter = filters?.branch && filters.branch !== 'All' ? filters.branch : '';
  const yearFilter = filters?.year && filters.year > 0 ? filters.year : 0;
  const searchTerm = filters?.search?.trim() ? `%${filters.search.trim()}%` : '';

  const rows = await sql`
    SELECT * FROM students
    WHERE (${branchFilter} = '' OR branch = ${branchFilter})
      AND (${yearFilter} = 0 OR graduation_year = ${yearFilter})
      AND (
        ${searchTerm} = ''
        OR full_name ILIKE ${searchTerm}
        OR student_id ILIKE ${searchTerm}
        OR headline_bio ILIKE ${searchTerm}
        OR branch ILIKE ${searchTerm}
        OR id IN (SELECT student_id FROM skills WHERE name ILIKE ${searchTerm})
        OR id IN (SELECT student_id FROM projects WHERE title ILIKE ${searchTerm} OR tech_stack ILIKE ${searchTerm})
      )
    ORDER BY full_name ASC
  `;

  return hydrateStudents(sql, rows as any[]);
}

export async function neonGetStudentById(id: string): Promise<Student | null> {
  const sql = await ensureSchema();
  const rows = await sql`SELECT * FROM students WHERE id = ${id} LIMIT 1`;
  if (!rows.length) return null;
  const hydrated = await hydrateStudents(sql, rows as any[]);
  return hydrated[0] || null;
}

export async function neonGetStudentByStudentId(studentId: string): Promise<Student | null> {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT * FROM students WHERE student_id = ${studentId.trim().toUpperCase()} LIMIT 1
  `;
  if (!rows.length) return null;
  const hydrated = await hydrateStudents(sql, rows as any[]);
  return hydrated[0] || null;
}

export async function neonGetStudentByUserId(userId: string): Promise<Student | null> {
  const sql = await ensureSchema();
  const rows = await sql`SELECT * FROM students WHERE user_id = ${userId} LIMIT 1`;
  if (!rows.length) return null;
  const hydrated = await hydrateStudents(sql, rows as any[]);
  return hydrated[0] || null;
}

export async function neonSaveStudent(
  payload: StudentSubmissionPayload,
  ownerUserId?: string
): Promise<Student> {
  const sql = await ensureSchema();
  const now = new Date().toISOString();
  const normalizedStudentId = payload.studentId.trim().toUpperCase();

  let existingRows: any[] = [];
  if (ownerUserId) {
    existingRows = (await sql`
      SELECT id, user_id FROM students WHERE user_id = ${ownerUserId} LIMIT 1
    `) as any[];
  }
  if (existingRows.length === 0) {
    existingRows = (await sql`
      SELECT id, user_id FROM students WHERE student_id = ${normalizedStudentId} LIMIT 1
    `) as any[];
  }

  let studentUuid: string;

  if (existingRows.length > 0) {
    studentUuid = existingRows[0].id;
    await sql`
      UPDATE students SET
        student_id = ${normalizedStudentId},
        user_id = COALESCE(${ownerUserId || null}, user_id),
        full_name = ${payload.fullName},
        institutional_email = ${payload.institutionalEmail},
        degree = ${payload.degree},
        branch = ${payload.branch},
        graduation_year = ${payload.graduationYear},
        cgpa = ${payload.cgpa},
        headline_bio = ${payload.headlineBio},
        linkedin_url = ${payload.linkedinUrl || null},
        github_url = ${payload.githubUrl || null},
        portfolio_url = ${payload.portfolioUrl || null},
        resume_path = COALESCE(${payload.resumePath || null}, resume_path),
        updated_at = ${now}
      WHERE id = ${studentUuid}
    `;

    await Promise.all([
      sql`DELETE FROM skills WHERE student_id = ${studentUuid}`,
      sql`DELETE FROM projects WHERE student_id = ${studentUuid}`,
      sql`DELETE FROM certificates WHERE student_id = ${studentUuid}`,
    ]);
  } else {
    studentUuid = randomUUID();
    await sql`
      INSERT INTO students (
        id, student_id, user_id, full_name, institutional_email, degree, branch,
        graduation_year, cgpa, headline_bio, linkedin_url, github_url,
        portfolio_url, resume_path, created_at, updated_at
      ) VALUES (
        ${studentUuid},
        ${normalizedStudentId},
        ${ownerUserId || null},
        ${payload.fullName},
        ${payload.institutionalEmail},
        ${payload.degree},
        ${payload.branch},
        ${payload.graduationYear},
        ${payload.cgpa},
        ${payload.headlineBio},
        ${payload.linkedinUrl || null},
        ${payload.githubUrl || null},
        ${payload.portfolioUrl || null},
        ${payload.resumePath || null},
        ${now},
        ${now}
      )
    `;
  }

  for (const sk of payload.skills || []) {
    if (sk.name && sk.name.trim()) {
      await sql`
        INSERT INTO skills (id, student_id, name, category)
        VALUES (${randomUUID()}, ${studentUuid}, ${sk.name.trim()}, ${sk.category || 'General'})
      `;
    }
  }

  for (const proj of payload.projects || []) {
    if (proj.title && proj.title.trim()) {
      await sql`
        INSERT INTO projects (id, student_id, title, description, tech_stack, github_url, live_demo_url)
        VALUES (
          ${randomUUID()},
          ${studentUuid},
          ${proj.title.trim()},
          ${proj.description || ''},
          ${JSON.stringify(proj.techStack || [])},
          ${proj.githubUrl || null},
          ${proj.liveDemoUrl || null}
        )
      `;
    }
  }

  for (const cert of payload.certificates || []) {
    if (cert.title && cert.title.trim()) {
      await sql`
        INSERT INTO certificates (id, student_id, title, issuing_org, issue_date, credential_url, file_path)
        VALUES (
          ${randomUUID()},
          ${studentUuid},
          ${cert.title.trim()},
          ${cert.issuingOrg.trim()},
          ${cert.issueDate || null},
          ${cert.credentialUrl || null},
          ${cert.filePath || null}
        )
      `;
    }
  }

  const saved = await neonGetStudentById(studentUuid);
  if (!saved) {
    throw new Error('Failed to retrieve saved student profile');
  }
  return saved;
}

export async function neonDeleteStudentById(id: string): Promise<boolean> {
  const sql = await ensureSchema();
  const deleted = await sql`DELETE FROM students WHERE id = ${id} RETURNING id`;
  return deleted.length > 0;
}

export async function neonSaveUploadedFile(input: {
  pathKey: string;
  mimeType: string;
  originalName: string;
  buffer: Buffer;
}): Promise<void> {
  const sql = await ensureSchema();
  const now = new Date().toISOString();
  const base64 = input.buffer.toString('base64');

  await sql`
    INSERT INTO uploaded_files (path_key, mime_type, original_name, data_base64, created_at)
    VALUES (${input.pathKey}, ${input.mimeType}, ${input.originalName}, ${base64}, ${now})
    ON CONFLICT (path_key) DO UPDATE SET
      mime_type = EXCLUDED.mime_type,
      original_name = EXCLUDED.original_name,
      data_base64 = EXCLUDED.data_base64,
      created_at = EXCLUDED.created_at
  `;
}

export async function neonGetUploadedFile(
  pathKey: string
): Promise<{ mimeType: string; originalName: string; buffer: Buffer } | null> {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT mime_type, original_name, data_base64 FROM uploaded_files WHERE path_key = ${pathKey} LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as any;
  return {
    mimeType: row.mime_type,
    originalName: row.original_name,
    buffer: Buffer.from(row.data_base64, 'base64'),
  };
}
