import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  AuthUser,
  UserRole,
  Student,
  StudentSubmissionPayload,
  Skill,
} from '@/types';
import type { DbUserRow } from './neon-db';

let sqliteInstance: Database.Database | null = null;

function getSqliteDb(): Database.Database {
  if (!sqliteInstance) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'portfolio.db');
    sqliteInstance = new Database(dbPath);
    sqliteInstance.pragma('journal_mode = WAL');
    sqliteInstance.pragma('foreign_keys = ON');
    initLocalTables(sqliteInstance);
  }
  return sqliteInstance;
}

function initLocalTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      full_name TEXT NOT NULL,
      company_name TEXT,
      student_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL,
      user_id TEXT,
      full_name TEXT NOT NULL,
      institutional_email TEXT UNIQUE NOT NULL,
      degree TEXT NOT NULL,
      branch TEXT NOT NULL,
      graduation_year INTEGER NOT NULL,
      cgpa REAL NOT NULL,
      headline_bio TEXT NOT NULL,
      linkedin_url TEXT,
      github_url TEXT,
      portfolio_url TEXT,
      resume_path TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      github_url TEXT,
      live_demo_url TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      title TEXT NOT NULL,
      issuing_org TEXT NOT NULL,
      issue_date TEXT,
      credential_url TEXT,
      file_path TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS uploaded_files (
      path_key TEXT PRIMARY KEY,
      mime_type TEXT NOT NULL,
      original_name TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const cols = db.prepare(`PRAGMA table_info(students)`).all() as any[];
  if (!cols.some((c) => c.name === 'user_id')) {
    db.exec(`ALTER TABLE students ADD COLUMN user_id TEXT`);
  }
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

export function localCreateUser(input: {
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  companyName?: string;
  studentId?: string;
}): AuthUser {
  const db = getSqliteDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanStudentId = input.studentId ? input.studentId.trim().toUpperCase() : null;

  db.prepare(`
    INSERT INTO users (id, email, password_hash, role, full_name, company_name, student_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    cleanEmail,
    input.passwordHash,
    input.role,
    input.fullName.trim(),
    input.companyName?.trim() || null,
    cleanStudentId,
    now
  );

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

export function localGetUserByEmail(email: string): DbUserRow | null {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1').get(email.trim().toLowerCase()) as any;
  return row ? mapUserRow(row) : null;
}

export function localGetUserByStudentId(studentId: string): DbUserRow | null {
  const db = getSqliteDb();
  const row = db
    .prepare(`SELECT * FROM users WHERE role = 'student' AND student_id = ? LIMIT 1`)
    .get(studentId.trim().toUpperCase()) as any;
  return row ? mapUserRow(row) : null;
}

export function localGetUserById(id: string): AuthUser | null {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').get(id) as any;
  if (!row) return null;
  const { passwordHash: _, ...user } = mapUserRow(row);
  return user;
}

function mapStudentRow(db: Database.Database, row: any): Student {
  const student: Student = {
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
  student.skills = db.prepare('SELECT * FROM skills WHERE student_id = ?').all(row.id) as Skill[];
  student.projects = (db.prepare('SELECT * FROM projects WHERE student_id = ?').all(row.id) as any[]).map((p) => ({
    id: p.id,
    studentId: p.student_id,
    title: p.title,
    description: p.description,
    githubUrl: p.github_url || undefined,
    liveDemoUrl: p.live_demo_url || undefined,
    techStack: JSON.parse(p.tech_stack || '[]'),
  }));
  student.certificates = (db.prepare('SELECT * FROM certificates WHERE student_id = ?').all(row.id) as any[]).map(
    (c) => ({
      id: c.id,
      studentId: c.student_id,
      title: c.title,
      issuingOrg: c.issuing_org,
      issueDate: c.issue_date || undefined,
      credentialUrl: c.credential_url || undefined,
      filePath: c.file_path || undefined,
    })
  );
  return student;
}

export function localGetAllStudents(filters?: {
  search?: string;
  branch?: string;
  year?: number;
}): Student[] {
  const db = getSqliteDb();
  let query = `SELECT * FROM students WHERE 1=1`;
  const params: any[] = [];

  if (filters?.branch && filters.branch !== 'All') {
    query += ` AND branch = ?`;
    params.push(filters.branch);
  }
  if (filters?.year && filters.year > 0) {
    query += ` AND graduation_year = ?`;
    params.push(filters.year);
  }
  if (filters?.search && filters.search.trim()) {
    const term = `%${filters.search.trim()}%`;
    query += ` AND (
      full_name LIKE ? OR
      student_id LIKE ? OR
      headline_bio LIKE ? OR
      branch LIKE ? OR
      id IN (SELECT student_id FROM skills WHERE name LIKE ?) OR
      id IN (SELECT student_id FROM projects WHERE title LIKE ? OR tech_stack LIKE ?)
    )`;
    params.push(term, term, term, term, term, term, term);
  }
  query += ` ORDER BY full_name ASC`;

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => mapStudentRow(db, r));
}

export function localGetStudentById(id: string): Student | null {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM students WHERE id = ? LIMIT 1').get(id) as any;
  return row ? mapStudentRow(db, row) : null;
}

export function localGetStudentByStudentId(studentId: string): Student | null {
  const db = getSqliteDb();
  const row = db
    .prepare('SELECT * FROM students WHERE student_id = ? LIMIT 1')
    .get(studentId.trim().toUpperCase()) as any;
  return row ? mapStudentRow(db, row) : null;
}

export function localGetStudentByUserId(userId: string): Student | null {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM students WHERE user_id = ? LIMIT 1').get(userId) as any;
  return row ? mapStudentRow(db, row) : null;
}

export function localSaveStudent(payload: StudentSubmissionPayload, ownerUserId?: string): Student {
  const db = getSqliteDb();
  const now = new Date().toISOString();
  const normalizedStudentId = payload.studentId.trim().toUpperCase();

  let existing: any = null;
  if (ownerUserId) {
    existing = db.prepare('SELECT id FROM students WHERE user_id = ? LIMIT 1').get(ownerUserId);
  }
  if (!existing) {
    existing = db.prepare('SELECT id FROM students WHERE student_id = ? LIMIT 1').get(normalizedStudentId);
  }

  const tx = db.transaction(() => {
    let studentUuid: string;
    if (existing) {
      studentUuid = existing.id;
      db.prepare(`
        UPDATE students SET
          student_id = ?,
          user_id = COALESCE(?, user_id),
          full_name = ?,
          institutional_email = ?,
          degree = ?,
          branch = ?,
          graduation_year = ?,
          cgpa = ?,
          headline_bio = ?,
          linkedin_url = ?,
          github_url = ?,
          portfolio_url = ?,
          resume_path = COALESCE(?, resume_path),
          updated_at = ?
        WHERE id = ?
      `).run(
        normalizedStudentId,
        ownerUserId || null,
        payload.fullName,
        payload.institutionalEmail,
        payload.degree,
        payload.branch,
        payload.graduationYear,
        payload.cgpa,
        payload.headlineBio,
        payload.linkedinUrl || null,
        payload.githubUrl || null,
        payload.portfolioUrl || null,
        payload.resumePath || null,
        now,
        studentUuid
      );

      db.prepare('DELETE FROM skills WHERE student_id = ?').run(studentUuid);
      db.prepare('DELETE FROM projects WHERE student_id = ?').run(studentUuid);
      db.prepare('DELETE FROM certificates WHERE student_id = ?').run(studentUuid);
    } else {
      studentUuid = randomUUID();
      db.prepare(`
        INSERT INTO students (
          id, student_id, user_id, full_name, institutional_email, degree, branch,
          graduation_year, cgpa, headline_bio, linkedin_url, github_url,
          portfolio_url, resume_path, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        studentUuid,
        normalizedStudentId,
        ownerUserId || null,
        payload.fullName,
        payload.institutionalEmail,
        payload.degree,
        payload.branch,
        payload.graduationYear,
        payload.cgpa,
        payload.headlineBio,
        payload.linkedinUrl || null,
        payload.githubUrl || null,
        payload.portfolioUrl || null,
        payload.resumePath || null,
        now,
        now
      );
    }

    const insertSkill = db.prepare(`INSERT INTO skills (id, student_id, name, category) VALUES (?, ?, ?, ?)`);
    for (const sk of payload.skills || []) {
      if (sk.name?.trim()) {
        insertSkill.run(randomUUID(), studentUuid, sk.name.trim(), sk.category || 'General');
      }
    }

    const insertProj = db.prepare(`
      INSERT INTO projects (id, student_id, title, description, tech_stack, github_url, live_demo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const proj of payload.projects || []) {
      if (proj.title?.trim()) {
        insertProj.run(
          randomUUID(),
          studentUuid,
          proj.title.trim(),
          proj.description || '',
          JSON.stringify(proj.techStack || []),
          proj.githubUrl || null,
          proj.liveDemoUrl || null
        );
      }
    }

    const insertCert = db.prepare(`
      INSERT INTO certificates (id, student_id, title, issuing_org, issue_date, credential_url, file_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const cert of payload.certificates || []) {
      if (cert.title?.trim()) {
        insertCert.run(
          randomUUID(),
          studentUuid,
          cert.title.trim(),
          cert.issuingOrg.trim(),
          cert.issueDate || null,
          cert.credentialUrl || null,
          cert.filePath || null
        );
      }
    }

    return studentUuid;
  });

  const savedId = tx();
  return localGetStudentById(savedId)!;
}

export function localDeleteStudentById(id: string): boolean {
  const db = getSqliteDb();
  const info = db.prepare('DELETE FROM students WHERE id = ?').run(id);
  return info.changes > 0;
}

export function localSaveUploadedFile(input: {
  pathKey: string;
  mimeType: string;
  originalName: string;
  buffer: Buffer;
}): void {
  const db = getSqliteDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO uploaded_files (path_key, mime_type, original_name, data_base64, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(path_key) DO UPDATE SET
      mime_type = excluded.mime_type,
      original_name = excluded.original_name,
      data_base64 = excluded.data_base64,
      created_at = excluded.created_at
  `).run(input.pathKey, input.mimeType, input.originalName, input.buffer.toString('base64'), now);
}

export function localGetUploadedFile(
  pathKey: string
): { mimeType: string; originalName: string; buffer: Buffer } | null {
  const db = getSqliteDb();
  const row = db
    .prepare('SELECT mime_type, original_name, data_base64 FROM uploaded_files WHERE path_key = ? LIMIT 1')
    .get(pathKey) as any;
  if (!row) return null;
  return {
    mimeType: row.mime_type,
    originalName: row.original_name,
    buffer: Buffer.from(row.data_base64, 'base64'),
  };
}
