# My Professional Digital Profile — Campus Recruitment Portal

A student portfolio and recruitment platform built specifically for campus hiring, verified academic showcasing, and recruiter discovery.

---

## 🌟 Core Highlights & Faculty Compliance

* **Privacy & Security First**:
  * **Strict Faculty Rule**: **Zero Phone Numbers** collected or displayed anywhere on the platform.
  * **Zero Passwords**: Students submit and update their profiles frictionless using their **Student ID / Roll Number** and **Institutional Email**.
  * **Zero Sensitive PII**: No government IDs, birthdates, or private personal information.
  * **Automated Privacy Guard**: The backend API actively rejects submissions containing phone numbers or digit patterns.
* **Recruiter Discovery Portal (`/`)**:
  * Instant search by candidate name, skills (e.g. *React, Python, Docker*), department, or bio.
  * Filter candidates by department/branch (*Computer Science, IT, AI & Data Science, etc.*) and graduation year.
  * Direct one-click **Resume PDF viewer** and **Profile inspection**.
* **Student Showcase Profile (`/profile/[id]`)**:
  * Clean academic highlights (Degree, Specialization, Batch, CGPA).
  * Technical Skills Matrix grouped by category.
  * Featured Projects with live demo links and GitHub repository badges.
  * Verified Certifications showcase with modal document viewer.
  * One-click **Download Resume (PDF)** CTA.
* **Student Submission Portal (`/submit`)**:
  * Clean, sectioned form with dynamic `+ Add Project`, `+ Add Certificate`, and skill tags.
  * PDF Resume upload handler with automated size validation (<5MB).

---

## 🚀 Running the Project

### 1. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Re-seed Sample Data
To populate realistic student candidates (including sample resumes and certificates):
```bash
node scripts/generate-docs.mjs
node scripts/seed.mjs
```

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
├── data/
│   └── portfolio.db             # Embedded SQLite database (zero-setup)
├── public/
│   └── uploads/
│       ├── resumes/             # Uploaded student resumes (PDF)
│       └── certificates/        # Uploaded certificate credentials (PDF / Images)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── students/        # List & Create student profiles (with privacy validator)
│   │   │   ├── students/[id]/   # Single student lookup by UUID or Student ID
│   │   │   └── upload/          # Multipart upload handler for resumes & certificates
│   │   ├── profile/[id]/        # Recruiter student showcase page & certificate modal
│   │   ├── submit/              # Student submission form
│   │   ├── layout.tsx           # Global responsive navigation & footer
│   │   └── page.tsx             # Recruiter candidate discovery dashboard
│   ├── lib/
│   │   └── db.ts                # SQLite database queries & transaction helpers
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── scripts/
│   ├── generate-docs.mjs        # Generates sample valid PDF resumes & certificates
│   ├── seed.mjs                 # Seeds demo students into SQLite
│   └── test-privacy.mjs         # Verifies automated phone number rejection
└── PROJECT_DESIGN.md            # Complete architecture & decision log
```
