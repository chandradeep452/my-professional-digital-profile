# Comprehensive Figma AI & Prototype Prompt: "My Professional Digital Profile"

Use this prompt in **Figma AI**, **Figma Plugins** (such as Galileo AI, Relume, Builder.io), or as an exact design brief for Figma UI designers. It includes the complete design system, component variants, auto-layout hierarchies, and the **explicit Figma Prototype Connection Map** so every interactive button, modal, dropdown, and link works.

---

```markdown
# FIGMA UI DESIGN & INTERACTIVE PROTOTYPE SPECIFICATION
PROJECT: My Professional Digital Profile — Campus Placement & Recruiter Portal
PLATFORM: Web App (Responsive Desktop 1440px + Mobile 390px)
GRID: 12-column responsive grid (72px columns, 24px gutters, 80px margins)

================================================================================
1. DESIGN SYSTEM & DESIGN TOKENS (FIGMA LOCAL STYLES & VARIABLES)
================================================================================

A. COLOR PALETTE (Figma Color Styles)
- Brand/Primary:
  * Primary/600 (Main CTA): #4F46E5
  * Primary/700 (Hover): #4338CA
  * Primary/50 (Soft Tint): #EEF2FF
  * Primary/100 (Border Tint): #E0E7FF
- Neutral / Surface:
  * Surface/Background: #F8FAFC (Slate 50)
  * Surface/Card: #FFFFFF (White)
  * Surface/Subtle: #F1F5F9 (Slate 100)
  * Border/Default: #E2E8F0 (Slate 200)
  * Border/Active: #CBD5E1 (Slate 300)
- Typography Colors:
  * Text/Heading: #0F172A (Slate 900)
  * Text/Body: #334155 (Slate 700)
  * Text/Muted: #64748B (Slate 500)
  * Text/Disabled: #94A3B8 (Slate 400)
- Functional / Status:
  * Success/Text: #047857 | Success/Bg: #ECFDF5 | Success/Border: #A7F3D0
  * Warning/Text: #92400E | Warning/Bg: #FFFBEB | Warning/Border: #FDE68A
  * Danger/Text: #B91C1C | Danger/Bg: #FEF2F2

B. TYPOGRAPHY HIERARCHY (Inter or System UI)
- Display H1: 40px / Line Height: 48px | Font-Weight: 800 (Extrabold)
- Section H2: 24px / Line Height: 32px | Font-Weight: 700 (Bold)
- Card Title H3: 18px / Line Height: 24px | Font-Weight: 700 (Bold)
- Body Regular: 14px / Line Height: 20px | Font-Weight: 400 & 500
- Caption / Badge: 12px / Line Height: 16px | Font-Weight: 600 (Semibold)
- Micro Text: 10px / Line Height: 12px | Font-Weight: 600

C. CORNER RADII & ELEVATION
- Radius: Cards = 24px (rounded-3xl), Buttons/Inputs = 12px (rounded-xl), Pills = 9999px
- Shadows:
  * Elevation/Low: 0px 1px 2px rgba(0,0,0,0.05)
  * Elevation/Mid: 0px 4px 6px -1px rgba(0,0,0,0.07), 0px 2px 4px -2px rgba(0,0,0,0.05)
  * Elevation/Modal: 0px 20px 25px -5px rgba(0,0,0,0.2)

================================================================================
2. COMPONENT LIBRARY (FIGMA MASTER COMPONENTS & COMPONENT SETS)
================================================================================

1. [Component: Navbar]
   - Frame: 1440px x 64px, White bg, bottom border #E2E8F0, Fixed / Sticky.
   - Elements:
     * Left: Graduation Cap icon (Indigo container) + "My Professional Digital Profile" (16px Bold) + subtitle "Recruiter & Student Showcase" (11px).
     * Right:
       - Nav Link: "Recruiter Portal" (Icon + Text, Slate 700)
       - Primary Button: "+ Submit / Update Profile" (Solid Indigo 600, White text, 14px Semibold, 10px 16px padding).

2. [Component: Button]
   - Variants:
     * Style: Primary (Solid Indigo), Secondary (White + Slate 300 border), Danger (Red icon button), Ghost (Link).
     * State: Default, Hover (Darker tone), Pressed, Disabled (Opacity 50%).

3. [Component: Candidate Card]
   - Frame: Auto-layout vertical, White bg, Border #E2E8F0, Radius 20px, Padding 24px, Gap 16px.
   - Child Layers:
     * Row 1: Student Name (18px Bold) + Student ID pill (`ID: 22CS101`) + CGPA badge (`CGPA 9.15` green tint).
     * Row 2: Graduation cap icon + Degree & Branch ("B.Tech • Computer Science & Engineering (2026)").
     * Row 3: Headline Bio snippet (2 lines truncated).
     * Row 4: Skill Tags row (Auto-layout wrap, badges: `React`, `TypeScript`, `Node.js`).
     * Row 5: Stats row (`2 Projects`, `2 Certificates`).
     * Card Footer:
       - Button "View Profile" (Primary Indigo, Width: Fill).
       - Button "Resume" (Secondary Outline with document icon).

4. [Component: Project Card]
   - Border #E2E8F0, Radius 16px, Padding 20px.
   - Title (16px Bold), Problem-Solution description (13px), Tech Stack tags, Links row: "Source Code" (GitHub icon) + "Live Demo" (External icon).

5. [Component: Certificate Card]
   - Border #E2E8F0, Radius 16px, Padding 18px.
   - Award icon badge (Amber), Certificate Name (14px Bold), Issuer, Date.
   - Action row: "Verify Online" link + "View Doc" button (Eye icon).

================================================================================
3. SCREEN LAYOUTS (TOP-LEVEL FRAMES)
================================================================================

--------------------------------------------------------------------------------
FRAME 1: [Desktop_Recruiter_Directory] (1440px x auto)
--------------------------------------------------------------------------------
- Top: Global Navbar.
- Hero Section (Dark Indigo Gradient Frame, Height 260px):
  * "Campus Talent & Recruitment Directory" badge.
  * H1: "My Professional Digital Profile".
  * Subtext: "A verified platform where recruiters can discover campus talent, inspect student projects, review accredited certificates, and access official resumes."
  * Stats Row: 3 metric chips (Active Profiles: 3 | Resumes Attached: 3 | Showcased Projects: 5).
- Search & Filter Bar (White Floating Container, Width 1280px):
  * Search field with magnifying glass ("Search by student name, skill, or department...").
  * Dropdown 1: "All Departments" (Options: Computer Science, IT, AI & Data Science, ECE, EEE, Mechanical).
  * Dropdown 2: "All Batches" (Options: Class of 2024 through Class of 2035).
  * Right link: "Are you a student? Submit your profile ->".
- Results Header: "Candidate Profiles (3 candidates)".
- Grid: 3-column auto-layout grid displaying Candidate Cards.

--------------------------------------------------------------------------------
FRAME 2: [Desktop_Recruiter_Directory_Empty] (1440px x 900px)
--------------------------------------------------------------------------------
- Same as Frame 1, but Candidate Cards Grid is replaced with:
- Empty State Container (Radius 24px, Border #E2E8F0, Center aligned):
  * Large User Avatar placeholder icon in Indigo 50 round-square container.
  * H3: "No Student Profiles Yet".
  * Description: "The talent directory is currently fresh and ready for submissions. You can start by submitting a new student profile."
  * Primary Button: "Submit First Profile ->".

--------------------------------------------------------------------------------
FRAME 3: [Desktop_Student_Profile_Showcase] (1440px x auto)
--------------------------------------------------------------------------------
- Top: Global Navbar.
- Container: Width 1024px centered, Auto-layout vertical, Gap 32px.
- Back Action: "<- Back to Recruiter Directory" link.
- Profile Hero Card (Radius 24px, White, Overflow Hidden):
  * Banner strip: Indigo Gradient, Height 140px.
  * Profile Body (Padding 32px, Top 0):
    - Top row:
      * Avatar: 112px x 112px rounded-2xl container with white border (4px) overlapping banner (-56px top margin), displays initials "RJ".
      * Action Buttons (Positioned cleanly in white area below banner, NO overlap):
        - Button 1: "Download Resume (PDF)" (Indigo Solid, Download icon).
        - Button 2: "Contact via Email" (White Outline, Mail icon).
    - Student Identity: Full Name ("Rushita Jalla") + Student ID badge + "CGPA 9.15 / 10.0".
    - Academics: "B.Tech in Computer Science & Engineering • Class of 2026".
    - Elevator Bio Paragraph (14px Slate 700).
    - Verified Links Row: LinkedIn pill, GitHub pill, Portfolio pill.
    - Footer Strip: Shield icon + "Verified Profile: Student phone number and sensitive credentials withheld per privacy protection standards."
- Section: Technical Skills Matrix (Categorized cards: Frontend, Backend, Database, Cloud/DevOps).
- Section: Featured Projects (2-column grid of Project Cards).
- Section: Verified Certifications (3-column grid of Certificate Cards).

--------------------------------------------------------------------------------
FRAME 4: [Desktop_Student_Submission_Portal] (1440px x auto)
--------------------------------------------------------------------------------
- Top: Global Navbar.
- Container: Width 960px centered, Auto-layout vertical, Gap 32px.
- Page Header:
  * Title: "Create Your Professional Digital Profile".
  * Description: "Present your technical achievements, projects, verified certificates, and resume to top campus recruiters."
  * Privacy Notice Box (Amber Background #FFFBEB, Amber Border #FDE68A):
    - Shield Alert icon + "Privacy Notice: Do not enter phone numbers, passwords, or sensitive personal IDs. Recruiters will evaluate you based on your verified academic details, projects, code repositories, certificates, and uploaded resume."
- Form Cards (White containers, Radius 20px, Border #E2E8F0, Padding 24px):
  * Card 1: Academic & Identity Details (Student ID, Full Name, Institutional Email, CGPA, Degree select, Branch select, Graduation Year select: 2024 to 2035, Bio textarea).
  * Card 2: Professional Profiles (LinkedIn URL, GitHub URL, Portfolio URL).
  * Card 3: Technical Skills
    - Initial State: "No skills added yet. Enter a skill name below and click 'Add Skill'."
    - Input row: Skill text field + Category dropdown + "Add Skill" button.
  * Card 4: Key Projects
    - Project fields + "+ Add Project" button (Indigo tint) + Trash icon button.
  * Card 5: Certificates Showcase
    - "+ Add Certificate" button + Document upload picker.
  * Card 6: Official Resume Attachment (PDF only)
    - Dashed border dropzone (#C7D2FE border, Indigo 50 bg) + Upload icon + "Click to Upload Resume (PDF) - Max 5MB".
- Form Action Bar:
  * Disclaimer text on left.
  * Primary Button: "Save & Publish Digital Profile" (Solid Indigo).

--------------------------------------------------------------------------------
FRAME 5: [Modal_Certificate_Viewer] (Overlay Frame: 800px x 600px)
--------------------------------------------------------------------------------
- Set as Figma Overlay (`Centered`, `Add background behind overlay: #0F172A at 70%`).
- Modal Frame: White bg, Radius 20px, Shadow Elevation/Modal.
- Header: Award icon + "Certificate Document: AWS Certified Cloud Practitioner" + "Open in New Tab" link + "X" Close Button.
- Canvas: Document viewport rendering sample certificate PDF with high fidelity.

================================================================================
4. FIGMA INTERACTIVE PROTOTYPE CONNECTION MAP (HOW TO WIRE ALL BUTTONS)
================================================================================

Wire the prototype in Figma's "Prototype" tab with the following interactions:

1. GLOBAL NAVIGATION CONNECTIONS:
   - Node: [Navbar -> Brand Logo / Title]
     * Trigger: On click -> Action: Navigate to [Desktop_Recruiter_Directory]
     * Animation: Instant
   - Node: [Navbar -> "Recruiter Portal" Link]
     * Trigger: On click -> Action: Navigate to [Desktop_Recruiter_Directory]
     * Animation: Instant
   - Node: [Navbar -> "+ Submit / Update Profile" Button]
     * Trigger: On click -> Action: Navigate to [Desktop_Student_Submission_Portal]
     * Animation: Smart Animate (Ease out 200ms)

2. RECRUITER DIRECTORY CONNECTIONS (FRAME 1):
   - Node: [Candidate Card -> "View Profile" Button]
     * Trigger: On click -> Action: Navigate to [Desktop_Student_Profile_Showcase]
     * Animation: Smart Animate (Ease out 200ms)
   - Node: [Candidate Card -> "Resume" Button]
     * Trigger: On click -> Action: Open Overlay -> [Modal_Certificate_Viewer] (or Open Link)
   - Node: [Filter Bar -> "Are you a student? Submit your profile"]
     * Trigger: On click -> Action: Navigate to [Desktop_Student_Submission_Portal]

3. EMPTY STATE DIRECTORY CONNECTIONS (FRAME 2):
   - Node: [Empty Container -> "Submit First Profile" Button]
     * Trigger: On click -> Action: Navigate to [Desktop_Student_Submission_Portal]
     * Animation: Smart Animate (Ease out 200ms)

4. STUDENT PROFILE SHOWCASE CONNECTIONS (FRAME 3):
   - Node: ["<- Back to Recruiter Directory" Link]
     * Trigger: On click -> Action: Navigate to [Desktop_Recruiter_Directory]
     * Animation: Smart Animate (Ease out 200ms)
   - Node: ["Download Resume (PDF)" Button]
     * Trigger: While hovering: Change to Hover State; On click: Trigger download prompt / Toast notification
   - Node: ["Contact via Email" Button]
     * Trigger: On click -> Action: Open URL (`mailto:rushita.jalla@engineering.edu`)
   - Node: [Certificate Card -> "View Doc" Button]
     * Trigger: On click -> Action: Open Overlay -> [Modal_Certificate_Viewer]
     * Overlay Settings: Centered, Close when clicking outside, Add background blur #0F172A at 70%

5. CERTIFICATE MODAL VIEWER CONNECTIONS (FRAME 5):
   - Node: [Modal Header -> "X" Button]
     * Trigger: On click -> Action: Close Overlay
     * Animation: Dissolve (150ms)
   - Node: [Modal Header -> "Open in New Tab" Link]
     * Trigger: On click -> Action: Open Link in new tab

6. STUDENT SUBMISSION PORTAL CONNECTIONS (FRAME 4):
   - Node: ["Add Skill" Button]
     * Trigger: On click -> Action: Append skill pill with interactive "x" delete icon
   - Node: ["+ Add Project" Button]
     * Trigger: On click -> Action: Appends duplicate empty project card variant
   - Node: [Resume Upload Dropzone]
     * Trigger: On click -> Action: Change variant to "Uploaded State" (Displays green checkmark and "resume-rushita.pdf")
   - Node: ["Save & Publish Digital Profile" Button]
     * Trigger: On click -> Action: Navigate to [Desktop_Student_Profile_Showcase]
     * Animation: Smart Animate (Ease out 250ms)
```
