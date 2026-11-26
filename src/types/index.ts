export type UserRole = 'recruiter' | 'student';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
  studentId?: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  studentId: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  title: string;
  issuingOrg: string;
  issueDate?: string;
  credentialUrl?: string;
  filePath?: string;
}

export interface Student {
  id: string;
  studentId: string;
  userId?: string;
  fullName: string;
  institutionalEmail: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  headlineBio: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  photoPath?: string;
  resumePath?: string;
  createdAt: string;
  updatedAt: string;
  skills?: Skill[];
  projects?: Project[];
  certificates?: Certificate[];
}

export interface StudentSubmissionPayload {
  studentId: string;
  fullName: string;
  institutionalEmail: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  headlineBio: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  photoPath?: string;
  resumePath?: string;
  skills: Array<{ name: string; category: string }>;
  projects: Array<{
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveDemoUrl?: string;
  }>;
  certificates: Array<{
    title: string;
    issuingOrg: string;
    issueDate?: string;
    credentialUrl?: string;
    filePath?: string;
  }>;
}
