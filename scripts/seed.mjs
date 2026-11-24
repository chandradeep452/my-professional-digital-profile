import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

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
`);

// Clear existing test data
db.exec(`
  DELETE FROM certificates;
  DELETE FROM projects;
  DELETE FROM skills;
  DELETE FROM students;
`);

const now = new Date().toISOString();

const studentsData = [
  {
    studentId: '22CS101',
    fullName: 'Rushita Jalla',
    institutionalEmail: 'rushita.jalla@engineering.edu',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 9.15,
    headlineBio: 'Passionate Full-Stack Developer specializing in React, Next.js, and cloud backends. Experienced in building responsive recruitment platforms and data-intensive web apps.',
    linkedinUrl: 'https://linkedin.com/in/rushita-jalla',
    githubUrl: 'https://github.com/rushita-jalla',
    portfolioUrl: 'https://rushitajalla.dev',
    resumePath: '/uploads/resumes/resume-sample-rushita.pdf',
    skills: [
      { name: 'React', category: 'Frontend' },
      { name: 'Next.js', category: 'Frontend' },
      { name: 'TypeScript', category: 'Languages' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Tailwind CSS', category: 'Frontend' },
      { name: 'SQLite / PostgreSQL', category: 'Database' },
      { name: 'Docker', category: 'Cloud/DevOps' },
      { name: 'Git & GitHub', category: 'Tools' },
    ],
    projects: [
      {
        title: 'My Professional Digital Profile Portal',
        description: 'Comprehensive campus recruitment platform empowering students to showcase verified skills, certifications, and resumes with zero phone number / privacy risk.',
        techStack: ['Next.js', 'React', 'Tailwind CSS', 'SQLite', 'Node.js'],
        githubUrl: 'https://github.com/rushita-jalla/digital-profile-portal',
        liveDemoUrl: 'https://portfolio-showcase.demo',
      },
      {
        title: 'Distributed Cloud Task Orchestrator',
        description: 'Lightweight job scheduling and distributed worker pool with real-time websocket monitoring, telemetry, and automated retry policies.',
        techStack: ['Node.js', 'Redis', 'Docker', 'WebSockets'],
        githubUrl: 'https://github.com/rushita-jalla/cloud-task-runner',
        liveDemoUrl: '',
      },
    ],
    certificates: [
      {
        title: 'AWS Certified Cloud Practitioner',
        issuingOrg: 'Amazon Web Services',
        issueDate: '2025-08-15',
        credentialUrl: 'https://aws.amazon.com/verification',
        filePath: '/uploads/certificates/cert-aws-cloud.pdf',
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        issuingOrg: 'Meta / Coursera',
        issueDate: '2025-03-20',
        credentialUrl: 'https://coursera.org/verify/meta-cert',
        filePath: '/uploads/certificates/cert-meta-frontend.pdf',
      },
    ],
  },
  {
    studentId: '22AI204',
    fullName: 'Aanya Sharma',
    institutionalEmail: 'aanya.sharma@engineering.edu',
    degree: 'B.Tech',
    branch: 'AI & Data Science',
    graduationYear: 2026,
    cgpa: 9.42,
    headlineBio: 'Machine Learning enthusiast with hands-on experience in Natural Language Processing, computer vision, and building RAG pipelines using LLMs and vector databases.',
    linkedinUrl: 'https://linkedin.com/in/aanya-sharma-ai',
    githubUrl: 'https://github.com/aanya-sharma',
    portfolioUrl: 'https://aanya-ai.me',
    resumePath: '/uploads/resumes/resume-sample-aanya.pdf',
    skills: [
      { name: 'Python', category: 'Languages' },
      { name: 'PyTorch', category: 'AI/ML' },
      { name: 'TensorFlow', category: 'AI/ML' },
      { name: 'Hugging Face', category: 'AI/ML' },
      { name: 'FastAPI', category: 'Backend' },
      { name: 'ChromaDB', category: 'Database' },
      { name: 'LangChain', category: 'AI/ML' },
    ],
    projects: [
      {
        title: 'Document Intelligence & Question Answering RAG',
        description: 'Retrieval-Augmented Generation system using open-source models for semantic search and question answering over research papers.',
        techStack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB'],
        githubUrl: 'https://github.com/aanya-sharma/doc-qa-rag',
        liveDemoUrl: '',
      },
      {
        title: 'Medical Image Classification with CNNs',
        description: 'Convolutional neural network model trained on chest X-ray datasets achieving 94.8% precision with Grad-CAM visualization.',
        techStack: ['PyTorch', 'Torchvision', 'Streamlit'],
        githubUrl: 'https://github.com/aanya-sharma/medical-vision-cnn',
        liveDemoUrl: '',
      },
    ],
    certificates: [
      {
        title: 'Deep Learning Specialization',
        issuingOrg: 'DeepLearning.AI',
        issueDate: '2025-06-10',
        credentialUrl: 'https://coursera.org/verify/deeplearning-ai',
        filePath: '/uploads/certificates/cert-deeplearning.pdf',
      },
    ],
  },
  {
    studentId: '21IT308',
    fullName: 'Karthik Verma',
    institutionalEmail: 'karthik.verma@engineering.edu',
    degree: 'B.Tech',
    branch: 'Information Technology',
    graduationYear: 2025,
    cgpa: 8.76,
    headlineBio: 'DevOps & Site Reliability Engineering aspirant. Experienced with Kubernetes cluster orchestration, CI/CD pipeline automation with GitHub Actions, and Golang microservices.',
    linkedinUrl: 'https://linkedin.com/in/karthik-verma-devops',
    githubUrl: 'https://github.com/karthik-verma',
    portfolioUrl: '',
    resumePath: '/uploads/resumes/resume-sample-karthik.pdf',
    skills: [
      { name: 'Go (Golang)', category: 'Languages' },
      { name: 'Kubernetes', category: 'Cloud/DevOps' },
      { name: 'Docker', category: 'Cloud/DevOps' },
      { name: 'Terraform', category: 'Cloud/DevOps' },
      { name: 'Linux System Admin', category: 'General' },
      { name: 'Prometheus & Grafana', category: 'Tools' },
    ],
    projects: [
      {
        title: 'Automated Multi-Cluster Kubernetes Deployment',
        description: 'Terraform and ArgoCD GitOps workflow for reproducible microservice deployment across hybrid cloud environments.',
        techStack: ['Kubernetes', 'Terraform', 'ArgoCD', 'Helm'],
        githubUrl: 'https://github.com/karthik-verma/gitops-infra',
        liveDemoUrl: '',
      },
    ],
    certificates: [
      {
        title: 'AWS Certified Cloud Practitioner',
        issuingOrg: 'Amazon Web Services',
        issueDate: '2024-11-05',
        credentialUrl: 'https://aws.amazon.com/verification',
        filePath: '/uploads/certificates/cert-aws-cloud.pdf',
      },
    ],
  },
];

const insertStudent = db.prepare(`
  INSERT INTO students (
    id, student_id, full_name, institutional_email, degree, branch,
    graduation_year, cgpa, headline_bio, linkedin_url, github_url,
    portfolio_url, resume_path, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSkill = db.prepare(`
  INSERT INTO skills (id, student_id, name, category) VALUES (?, ?, ?, ?)
`);

const insertProject = db.prepare(`
  INSERT INTO projects (id, student_id, title, description, tech_stack, github_url, live_demo_url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertCert = db.prepare(`
  INSERT INTO certificates (id, student_id, title, issuing_org, issue_date, credential_url, file_path)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const s of studentsData) {
  const studentId = randomUUID();
  insertStudent.run(
    studentId,
    s.studentId,
    s.fullName,
    s.institutionalEmail,
    s.degree,
    s.branch,
    s.graduationYear,
    s.cgpa,
    s.headlineBio,
    s.linkedinUrl,
    s.githubUrl,
    s.portfolioUrl,
    s.resumePath,
    now,
    now
  );

  for (const sk of s.skills) {
    insertSkill.run(randomUUID(), studentId, sk.name, sk.category);
  }

  for (const p of s.projects) {
    insertProject.run(
      randomUUID(),
      studentId,
      p.title,
      p.description,
      JSON.stringify(p.techStack),
      p.githubUrl,
      p.liveDemoUrl
    );
  }

  for (const c of s.certificates) {
    insertCert.run(
      randomUUID(),
      studentId,
      c.title,
      c.issuingOrg,
      c.issueDate,
      c.credentialUrl,
      c.filePath
    );
  }
}

console.log(`Seeded ${studentsData.length} students with projects, skills, certificates, and resumes.`);
db.close();
