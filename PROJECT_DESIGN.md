# My Professional Digital Profile — Project Architecture & Specification

## 1. Executive Summary & Purpose
**My Professional Digital Profile** is a multi-student recruitment and digital portfolio portal. It enables university and college students to showcase their academic background, verified technical skills, projects, certifications, and resumes to recruiters in a structured, professional format.

### Key Rules & Constraints
* **Faculty Mandate**: Strict exclusion of student phone numbers across all user interfaces, databases, and APIs.
* **Security & Privacy**: Zero password requirements, no login barrier, and zero collection of sensitive personal data (e.g., home addresses, national ID cards).
* **Identification**: Students submit their profiles uniquely identified by their **Student ID / Roll Number** and **Institutional Email**.

---

## 2. Decision Log

| Decision ID | Area | Selected Choice | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | **System Architecture** | Multi-student recruitment portal | Single-student portfolio, Client-side export generator | Recruiters require a unified dashboard to search, compare, and view candidates from a college/cohort. |
| **DEC-002** | **Tech Stack** | Next.js (App Router), React, Tailwind CSS, SQLite | Express + React (MERN), Flask + HTML | Unified full-stack repository; zero database server maintenance; optimal for local execution, demos, and rapid deployment. |
| **DEC-003** | **Authentication & Access** | No-password submission keyed by Student ID & Institutional Email | Passwords, Magic Links, OTPs | Faculty explicitly disallowed passwords; reduces friction for students and keeps the project lightweight. |
| **DEC-004** | **Privacy Enforcement** | Complete omission of phone number inputs + server-side regex sanitization | Voluntary phone number field | Strict compliance with faculty guidelines and student data privacy. |
| **DEC-005** | **File Storage** | Local sanitized file system storage (`/public/uploads/`) with SQLite references | S3/Cloud storage | Zero third-party cloud credential dependency; runs completely offline and locally for evaluation. |

---

## 3. System Architecture & Components

```
+-----------------------------------------------------------------------+
|                            Next.js Client                             |
|                                                                       |
|   +-----------------------+ +---------------------+ +---------------+ |
|   |   Recruiter Portal    | |   Profile Showcase  | |  Submission   | |
|   |  - Skill / Dept Search| |  - Bio & Academics  | |  - Student Form| |
|   |  - Candidate Cards    | |  - Projects Matrix  | |  - PDF Upload | |
|   |  - Filter Bar         | |  - Certificate Modal| |  - Validation | |
|   +-----------------------+ |  - Resume Downloader| +---------------+ |
|                             +---------------------+                   |
+-----------------------------------▲-----------------------------------+
                                    │ HTTP Requests / Server Actions
+-----------------------------------▼-----------------------------------+
|                        Next.js Server & APIs                          |
|                                                                       |
|   - GET /api/students (List & Filter)                                 |
|   - GET /api/students/[id] (Detailed profile)                         |
|   - POST /api/students (Create or update student profile)             |
|   - POST /api/upload (Multipart upload for Resumes & Certificates)    |
|   - Privacy Sanitizer (Strips phone numbers and invalid payloads)     |
+-----------------------------------▲-----------------------------------+
                                    │
           +------------------------┴-----------------------+
           ▼                                                ▼
+---------------------+                          +---------------------+
|   SQLite Database   |                          | File System Storage |
|  - Students Table   |                          | /public/uploads/    |
|  - Projects Table   |                          |   ├── resumes/      |
|  - Certificates Tbl |                          |   └── certificates/ |
|  - Skills Table     |                          +---------------------+
+---------------------+
```

---

## 4. Database Schema (SQLite / Prisma)

### `Student`
* `id`: String (UUID, Primary Key)
* `studentId`: String (Unique, e.g. "21CS045")
* `fullName`: String
* `institutionalEmail`: String (Unique)
* `degree`: String (e.g. "B.Tech", "B.Sc", "MCA")
* `branch`: String (e.g. "Computer Science & Engineering")
* `graduationYear`: Integer (e.g. 2026)
* `cgpa`: Float
* `headlineBio`: Text (Professional elevator pitch)
* `linkedinUrl`: String (Optional)
* `githubUrl`: String (Optional)
* `portfolioUrl`: String (Optional)
* `resumePath`: String (Path to uploaded PDF)
* `createdAt`: DateTime
* `updatedAt`: DateTime

### `Skill`
* `id`: String (UUID, Primary Key)
* `studentId`: String (Foreign Key -> Student.id)
* `name`: String (e.g. "React", "Node.js", "Python")
* `category`: String (e.g. "Frontend", "Backend", "Tools")

### `Project`
* `id`: String (UUID, Primary Key)
* `studentId`: String (Foreign Key -> Student.id)
* `title`: String
* `description`: Text
* `techStack`: String (Comma-separated or JSON list)
* `githubUrl`: String (Optional)
* `liveDemoUrl`: String (Optional)

### `Certificate`
* `id`: String (UUID, Primary Key)
* `studentId`: String (Foreign Key -> Student.id)
* `title`: String
* `issuingOrg`: String
* `issueDate`: String (Optional)
* `credentialUrl`: String (Optional)
* `filePath`: String (Path to uploaded certificate file)

---

## 5. UI/UX Specifications

### 1. Home / Recruiter Portal (`/`)
* **Hero Banner**: Highlighting the platform as "My Professional Digital Profile: Verified Campus Talent".
* **Filter Bar**: Dynamic search box (searches student name, skills, and department) + filter dropdowns for Graduation Year and Branch.
* **Student Grid**: Responsive grid of candidate cards featuring:
  * Student Name, Branch, and Graduation Year.
  * Top skill badges.
  * Project count and certificate badge count.
  * Direct action buttons: **"View Profile"** and **"Quick Resume Preview"**.

### 2. Digital Profile Page (`/profile/[id]`)
* **Header & Contact**:
  * Full name, branch, graduation year, CGPA, and institutional email.
  * LinkedIn, GitHub, and Portfolio icons.
  * Prominent **"Download Resume (PDF)"** action.
* **About / Bio**: Professional summary.
* **Academics & Skills**: Structured skill tags grouped by category.
* **Projects**: Clean card grid with descriptions, technology badges, and live demo / GitHub links.
* **Certifications**: Gallery with preview modal for recruiter verification.

### 3. Student Submission Portal (`/submit`)
* Organized into logical sections:
  1. Personal & Academic Credentials (Name, Student ID, Institutional Email, Degree, Branch, CGPA, Bio).
  2. Professional Profiles (GitHub, LinkedIn, Portfolio).
  3. Technical Skills (Add / remove tags).
  4. Projects (Dynamic "+ Add Project" fields).
  5. Certificates (File upload with certificate title & issuer).
  6. Resume Attachment (PDF drag-and-drop file upload).
* Form validation actively prevents empty required fields and ensures file size safety (<5MB).

---

## 6. Implementation Milestones

1. **Phase 1: Project Setup & Foundation**
   * Scaffold Next.js project with Tailwind CSS and Lucide React icons.
   * Configure SQLite database schema and database connection helper.
2. **Phase 2: API & File Upload Backend**
   * Implement file upload handler for resumes and certificates with sanitization and validation.
   * Implement student profile creation, listing, and lookup API endpoints.
3. **Phase 3: Student Submission Experience**
   * Build the multi-step `/submit` form with dynamic project/certificate rows and file upload previews.
4. **Phase 4: Recruiter Directory & Profile View**
   * Build the `/` recruiter directory with real-time search, filters, and student summary cards.
   * Build the `/profile/[id]` comprehensive digital profile view with resume download and certificate modal viewer.
5. **Phase 5: Verification & Polish**
   * Seed demo data with sample student profiles, sample resumes, and certificates.
   * Verify all privacy rules (confirm 0 phone numbers, 0 passwords).
   * Test across responsive screen sizes.
