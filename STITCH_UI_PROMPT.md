# Stitch UI Prompt: "My Professional Digital Profile" — Campus Talent & Recruitment Platform

Use this complete, multi-screen specification prompt directly in Google Stitch to generate a fully connected, interactive, and modern UI prototype.

---

```markdown
### PROJECT CONTEXT & DESIGN SPECIFICATION
**Project Name**: My Professional Digital Profile
**Industry / Purpose**: Higher Education Campus Placement & Recruiter Showcase Portal
**Target Users**: 
1. Corporate Campus Recruiters (discovering talent, reviewing credentials, downloading resumes)
2. University Students (submitting academic background, showcasing projects, uploading certificates & resume)
**Core Design Philosophy**: 
- Modern, clean, recruiter-focused SaaS aesthetic (Tailwind Slate/Indigo palette)
- High contrast, legible typography, generous card padding (rounded-2xl to rounded-3xl)
- Strict Privacy Architecture: ZERO phone numbers, ZERO passwords, ZERO sensitive identity documents.

---

### DESIGN SYSTEM & ATOMS
- **Primary Color**: Indigo 600 (`#4f46e5`), Hover: Indigo 700 (`#4338ca`), Light Tint: Indigo 50 (`#eef2ff`)
- **Secondary / Success**: Emerald 600 (`#059669`), Badge Tint: Emerald 50 (`#ecfdf5`)
- **Warning / Notice**: Amber 600 (`#d97706`), Amber Tint: Amber 50 (`#fffbeb`)
- **Neutral Backgrounds**: App Background (`#f8fafc`), Surface Card (`#ffffff`), Border Stroke (`#e2e8f0`)
- **Typography**: Inter / System UI; Bold Section Titles, Semibold Badges, Medium Body (14px/16px)

---

### GLOBAL NAVIGATION BAR (Common Header on All Screens)
- **Brand Logo & Title**: Graduation cap icon in rounded-xl indigo box + "My Professional Digital Profile" (subtitle: "Recruiter & Student Showcase")
- **Nav Item 1 (Button/Link)**: "Recruiter Portal" with briefcase icon -> **ON CLICK**: Navigate to [Screen 1: Recruiter Discovery Portal]
- **Nav Item 2 (Primary CTA Button)**: "Submit / Update Profile" with user-check icon (Solid Indigo, white text) -> **ON CLICK**: Navigate to [Screen 4: Student Submission Portal]

---

### SCREEN 1: Recruiter Discovery Portal & Talent Directory (`/`)
1. **Hero Section**:
   - Badge: Sparkles icon + "Campus Talent & Recruitment Directory"
   - Headline: "My Professional Digital Profile" (36px, Bold)
   - Subhead: "A verified platform where recruiters can discover campus talent, inspect student projects, review accredited certificates, and access official resumes."
   - **Live Metrics Counter**:
     * Stat Card 1: Total Active Profiles Counter
     * Stat Card 2: Resumes Attached Counter
     * Stat Card 3: Showcased Projects Counter

2. **Search & Filter Control Bar**:
   - **Search Input Field**: Left search icon + placeholder "Search by student name, skill (e.g. React, Python), or department..."
     * **Interaction**: Live filters the candidate grid below.
   - **Department Filter Dropdown**: Options: ["All Departments", "Computer Science & Engineering", "Information Technology", "AI & Data Science", "Electronics & Communication"]
     * **Interaction**: On change -> Filter candidate cards.
   - **Graduation Year Dropdown**: Options: ["All Batches", "Class of 2024", "Class of 2025", "Class of 2026" ... through "Class of 2035"]
     * **Interaction**: On change -> Filter candidate cards.
   - **Secondary Link (Right)**: "Are you a student? Submit your profile ->" -> **ON CLICK**: Navigate to [Screen 4].

3. **Candidate Cards Grid**:
   - Multi-column responsive grid (3 columns on desktop, 1 on mobile).
   - Each Candidate Card includes:
     * Header: Full Name, Student ID badge (e.g. `ID: 22CS101`), and CGPA pill (`CGPA 9.15` in emerald badge).
     * Academic Line: Degree icon + "B.Tech • Computer Science & Engineering (2026)".
     * Bio Preview: 2-line truncated professional elevator pitch.
     * Skill Tag Pills: Light slate badges displaying top skills (e.g., `React`, `TypeScript`, `Node.js`, `+3 more`).
     * Stats Row: Project count icon (`2 Projects`) and Certificate count icon (`2 Certificates`).
     * Card Action Footer:
       - **Button 1 ("View Profile")**: Full width/flex-1 indigo button -> **ON CLICK**: Navigate to [Screen 2: Student Digital Profile Showcase].
       - **Button 2 ("Resume")**: White button with file icon -> **ON CLICK**: Open Resume PDF preview in viewer or new tab.

---

### SCREEN 2: Student Digital Profile Showcase (`/profile/[id]`)
1. **Breadcrumb / Back Navigation**:
   - Button: "<- Back to Recruiter Directory" -> **ON CLICK**: Navigate to [Screen 1: Recruiter Discovery Portal].

2. **Hero Header Card**:
   - Header Banner: Gradient background (`from-indigo-700 via-indigo-600 to-indigo-800`, height 140px).
   - Avatar Box: Overlapping the banner with `-mt-14`, white rounded-2xl frame (`border-4 border-white shadow-lg`), inside displays student initials in bold (e.g., `RJ`).
   - Action Buttons (Strictly in the white section, right-aligned, zero banner overlap):
     * **Button 1 ("Download Resume (PDF)")**: Solid Indigo with download icon -> **ON CLICK**: Triggers official PDF resume download.
     * **Button 2 ("Contact via Email")**: White outline button with mail icon -> **ON CLICK**: Triggers `mailto:` institutional email client.
   - Identity & Academic Highlights:
     * Full Name (e.g., "Rushita Jalla") + Student ID badge + CGPA highlight (`CGPA 9.15 / 10.0`).
     * Degree, Department, and Graduation Year ("Class of 2026").
     * Professional Elevator Bio paragraph.
     * Verified Links Row: LinkedIn pill button, GitHub pill button, Portfolio pill button.
   - Bottom Privacy Banner: Shield icon + "Verified Profile: Student phone number and sensitive credentials withheld per privacy protection standards."

3. **Technical Skills Matrix Section**:
   - Grouped into categorized clean cards:
     * "Frontend": Skill badges (`React`, `Next.js`, `Tailwind CSS`)
     * "Backend": Skill badges (`Node.js`, `Express`)
     * "Database": Skill badges (`PostgreSQL`, `SQLite`)
     * "Cloud & DevOps": Skill badges (`Docker`, `Git`)

4. **Featured Projects Section**:
   - Project Cards with:
     * Project Title & detailed problem-solution narrative.
     * Tech stack tags.
     * **Action Links**: "Source Code" (GitHub icon) and "Live Demo" (External link icon).

5. **Verified Certifications & Credentials Section**:
   - Credential Cards with:
     * Award badge, Certificate Title, Issuing Organization, Issue Date.
     * **Button 1 ("Verify Online")**: External verification link.
     * **Button 2 ("View Doc")**: Eye icon button -> **ON CLICK**: Opens [Screen 3: Certificate Preview Modal Dialog].

---

### SCREEN 3: Certificate Document Viewer Modal (Overlay Dialog)
- **Backdrop**: Semi-transparent dark blur overlay (`bg-slate-950/70 backdrop-blur-xs`).
- **Modal Header**:
  * Award icon + "Certificate Document: [Certificate Title]"
  * Action 1: "Open in New Tab" link
  * Action 2: "X" Close Button -> **ON CLICK**: Closes modal and returns to [Screen 2].
- **Modal Body**:
  * Embedded PDF / Document Preview viewer with high-resolution inspection.

---

### SCREEN 4: Student Submission Portal (`/submit`)
1. **Notice Box**:
   - Amber warning box with shield icon:
     "Privacy Notice: Do not enter phone numbers, passwords, or sensitive personal IDs. Recruiters will evaluate you based on your verified academic details, projects, code repositories, certificates, and uploaded resume."

2. **Form Sections**:
   - **Section 1: Academic & Identity Details**:
     * Student ID / Roll Number input (e.g. `22CS101`) [Required]
     * Full Name input [Required]
     * Institutional Email input (`@college.edu`) [Required]
     * Current CGPA number input (0.0 to 10.0) [Required]
     * Degree dropdown: `B.Tech`, `B.E.`, `B.Sc`, `BCA`, `M.Tech`, `MCA`
     * Branch dropdown: `Computer Science`, `IT`, `AI & Data Science`, `ECE`, `EEE`, `Mechanical`
     * Graduation Year dropdown: `2024` through `2035`
     * Professional Elevator Bio textarea [Required]
   - **Section 2: Professional Profiles (No phone numbers)**:
     * LinkedIn URL input, GitHub URL input, Portfolio URL input
   - **Section 3: Technical Skills**:
     * Empty state initially: "No skills added yet. Enter a skill name below and click 'Add Skill'."
     * Skill name text input + Category select (`Frontend`, `Backend`, `Database`, `AI/ML`, `Cloud/DevOps`, `General`) + "Add Skill" button -> **ON CLICK**: Appends new tag with a removable "x" button.
   - **Section 4: Key Projects**:
     * Dynamic project row with Title, Description, Tech Stack, Repo URL, and Demo URL.
     * "+ Add Project" button -> **ON CLICK**: Appends new empty project card.
     * "Remove Project" trash icon button -> **ON CLICK**: Deletes that project row.
   - **Section 5: Certificates Showcase**:
     * "+ Add Certificate" button -> **ON CLICK**: Appends certificate card with Title, Issuer, Date, Credential URL, and File Upload button.
   - **Section 6: Official Resume Attachment (PDF only)**:
     * Dashed drag-and-drop file upload zone.
     * "Click to Upload Resume (PDF) - Max 5MB".
     * Upon file selection: Displays green checkmark + filename indicator.

3. **Form Submission Bar**:
   - Legal & privacy confirmation text.
   - **Primary Button ("Save & Publish Digital Profile")**: Solid Indigo CTA -> **ON CLICK**: Validates inputs, rejects if phone numbers are detected, displays success alert, and navigates to [Screen 2: Student Digital Profile Showcase].

---

### SCREEN 5: Empty / Fresh Talent State (Initial State of Screen 1)
- Triggered when 0 student profiles are in the system:
  * Centered large user icon in soft indigo box.
  * Heading: "No Student Profiles Yet"
  * Description: "The talent directory is currently fresh and ready for submissions. You can start by submitting a new student profile."
  * **CTA Button ("Submit / Add Student Profile")** -> **ON CLICK**: Navigates to [Screen 4: Student Submission Portal].

---

### INTERACTION & BUTTON MAPPING MATRIX
| Element Name | Location | Trigger Event | Destination / Result |
| :--- | :--- | :--- | :--- |
| `Brand Logo / Home Link` | Global Navbar | Click | Navigates to Screen 1 |
| `Recruiter Portal Link` | Global Navbar | Click | Navigates to Screen 1 |
| `Submit / Update Profile` | Global Navbar | Click | Navigates to Screen 4 |
| `Search Input` | Screen 1 | Type | Filters candidate cards dynamically |
| `Department Filter` | Screen 1 | Change | Filters candidates by branch |
| `Graduation Year Filter` | Screen 1 | Change | Filters candidates by year (2024-2035) |
| `Candidate Card -> View Profile` | Screen 1 | Click | Navigates to Screen 2 with student data |
| `Candidate Card -> Resume` | Screen 1 | Click | Opens PDF Resume Viewer |
| `Back to Directory` | Screen 2 | Click | Navigates to Screen 1 |
| `Download Resume (PDF)` | Screen 2 | Click | Downloads official student PDF resume |
| `Contact via Email` | Screen 2 | Click | Opens email client with pre-filled subject |
| `Verify Online` | Screen 2 | Click | Opens credential verification URL in new tab |
| `View Doc` | Screen 2 | Click | Opens Screen 3 (Modal Certificate Viewer) |
| `Close Modal (X)` | Screen 3 | Click | Closes Modal, returns to Screen 2 |
| `Add Skill Button` | Screen 4 | Click | Creates new skill pill in Section 3 |
| `Skill Pill (x)` | Screen 4 | Click | Removes selected skill tag |
| `+ Add Project` | Screen 4 | Click | Appends new project input card |
| `Delete Project (Trash)` | Screen 4 | Click | Deletes corresponding project row |
| `+ Add Certificate` | Screen 4 | Click | Appends new certificate input card |
| `Upload Resume Zone` | Screen 4 | File Pick | Validates PDF format (<5MB) and shows uploaded pill |
| `Save & Publish Profile` | Screen 4 | Click | Validates no phone numbers -> Submits -> Redirects to Screen 2 |
| `Submit First Profile (Empty)` | Screen 5 | Click | Navigates to Screen 4 |
```
