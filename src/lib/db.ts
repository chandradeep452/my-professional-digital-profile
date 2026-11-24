import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { Student, StudentSubmissionPayload, Skill, Project, Certificate } from '@/types';

// On Vercel Serverless / AWS Lambda, the filesystem is read-only except /tmp
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dataDir = isServerless ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create data directory:', e);
  }
}

const dbPath = path.join(dataDir, 'portfolio.db');

// If running in serverless, copy bundled database to /tmp if present
if (isServerless) {
  const bundledDb = path.join(process.cwd(), 'data', 'portfolio.db');
  if (fs.existsSync(bundledDb) && !fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(bundledDb, dbPath);
    } catch (e) {
      console.warn('Could not copy bundled DB to /tmp, will initialize fresh:', e);
    }
  }
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    if (isServerless) {
      dbInstance.pragma('journal_mode = MEMORY');
    } else {
      dbInstance.pragma('journal_mode = WAL');
    }
    dbInstance.pragma('foreign_keys = ON');
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      student_id TEXT UNIQUE NOT NULL,
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

    CREATE INDEX IF NOT EXISTS idx_students_search ON students(branch, graduation_year);
  `);
}

export function getAllStudents(filters?: { search?: string; branch?: string; year?: number }): Student[] {
  const db = getDb();
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

  return rows.map((row) => {
    const student = mapStudentRow(row);
    student.skills = db.prepare('SELECT * FROM skills WHERE student_id = ?').all(row.id) as Skill[];
    student.projects = (db.prepare('SELECT * FROM projects WHERE student_id = ?').all(row.id) as any[]).map(p => ({
      ...p,
      studentId: p.student_id,
      githubUrl: p.github_url,
      liveDemoUrl: p.live_demo_url,
      techStack: JSON.parse(p.tech_stack || '[]'),
    }));
    student.certificates = (db.prepare('SELECT * FROM certificates WHERE student_id = ?').all(row.id) as any[]).map(c => ({
      ...c,
      studentId: c.student_id,
      issuingOrg: c.issuing_org,
      issueDate: c.issue_date,
      credentialUrl: c.credential_url,
      filePath: c.file_path,
    }));
    return student;
  });
}

export function getStudentById(id: string): Student | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as any;
  if (!row) return null;

  const student = mapStudentRow(row);
  student.skills = db.prepare('SELECT * FROM skills WHERE student_id = ?').all(id) as Skill[];
  student.projects = (db.prepare('SELECT * FROM projects WHERE student_id = ?').all(id) as any[]).map(p => ({
    ...p,
    studentId: p.student_id,
    githubUrl: p.github_url,
    liveDemoUrl: p.live_demo_url,
    techStack: JSON.parse(p.tech_stack || '[]'),
  }));
  student.certificates = (db.prepare('SELECT * FROM certificates WHERE student_id = ?').all(id) as any[]).map(c => ({
    ...c,
    studentId: c.student_id,
    issuingOrg: c.issuing_org,
    issueDate: c.issue_date,
    credentialUrl: c.credential_url,
    filePath: c.file_path,
  }));
  return student;
}

export function getStudentByStudentId(studentId: string): Student | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM students WHERE student_id = ?').get(studentId) as any;
  if (!row) return null;
  return getStudentById(row.id);
}

export function saveStudent(payload: StudentSubmissionPayload): Student {
  const db = getDb();
  const now = new Date().toISOString();

  // Check if student with this studentId already exists
  const existing = db.prepare('SELECT id FROM students WHERE student_id = ?').get(payload.studentId) as any;

  const transaction = db.transaction(() => {
    let studentUuid: string;

    if (existing) {
      studentUuid = existing.id;
      db.prepare(`
        UPDATE students SET 
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

      // Clean existing related entries to refresh
      db.prepare('DELETE FROM skills WHERE student_id = ?').run(studentUuid);
      db.prepare('DELETE FROM projects WHERE student_id = ?').run(studentUuid);
      db.prepare('DELETE FROM certificates WHERE student_id = ?').run(studentUuid);
    } else {
      studentUuid = randomUUID();
      db.prepare(`
        INSERT INTO students (
          id, student_id, full_name, institutional_email, degree, branch,
          graduation_year, cgpa, headline_bio, linkedin_url, github_url,
          portfolio_url, resume_path, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        studentUuid,
        payload.studentId,
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

    // Insert skills
    if (payload.skills && payload.skills.length > 0) {
      const insertSkill = db.prepare(`
        INSERT INTO skills (id, student_id, name, category) VALUES (?, ?, ?, ?)
      `);
      for (const sk of payload.skills) {
        if (sk.name && sk.name.trim()) {
          insertSkill.run(randomUUID(), studentUuid, sk.name.trim(), sk.category || 'General');
        }
      }
    }

    // Insert projects
    if (payload.projects && payload.projects.length > 0) {
      const insertProject = db.prepare(`
        INSERT INTO projects (id, student_id, title, description, tech_stack, github_url, live_demo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const proj of payload.projects) {
        if (proj.title && proj.title.trim()) {
          insertProject.run(
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
    }

    // Insert certificates
    if (payload.certificates && payload.certificates.length > 0) {
      const insertCert = db.prepare(`
        INSERT INTO certificates (id, student_id, title, issuing_org, issue_date, credential_url, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const cert of payload.certificates) {
        if (cert.title && cert.title.trim()) {
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
    }

    return studentUuid;
  });

  const savedId = transaction();
  const student = getStudentById(savedId);
  if (!student) {
    throw new Error('Failed to retrieve saved student');
  }
  return student;
}

function mapStudentRow(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id,
    fullName: row.full_name,
    institutionalEmail: row.institutional_email,
    degree: row.degree,
    branch: row.branch,
    graduationYear: row.graduation_year,
    cgpa: row.cgpa,
    headlineBio: row.headline_bio,
    linkedinUrl: row.linkedin_url || undefined,
    githubUrl: row.github_url || undefined,
    portfolioUrl: row.portfolio_url || undefined,
    resumePath: row.resume_path || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
