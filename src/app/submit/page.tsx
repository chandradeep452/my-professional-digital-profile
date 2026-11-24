'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Award, 
  Code, 
  User, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface SkillItem {
  name: string;
  category: string;
}

interface ProjectItem {
  title: string;
  description: string;
  techStackInput: string;
  githubUrl: string;
  liveDemoUrl: string;
}

interface CertificateItem {
  title: string;
  issuingOrg: string;
  issueDate: string;
  credentialUrl: string;
  filePath: string;
  fileName?: string;
  uploading?: boolean;
}

export default function SubmitProfilePage() {
  const router = useRouter();

  // Basic Details
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [cgpa, setCgpa] = useState('');
  const [headlineBio, setHeadlineBio] = useState('');

  // Social Links
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Skills
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');

  // Projects
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      title: '',
      description: '',
      techStackInput: '',
      githubUrl: '',
      liveDemoUrl: '',
    },
  ]);

  // Certificates
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  // Resume Upload State
  const [resumePath, setResumePath] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resume Upload Handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Resume must be a PDF document.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Resume file size must be less than 5MB.');
      return;
    }

    try {
      setIsUploadingResume(true);
      setErrorMsg(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'resume');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      setResumePath(data.url);
      setResumeFileName(file.name);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Certificate Upload Handler
  const handleCertUpload = async (index: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Certificate file size must be less than 5MB.');
      return;
    }

    try {
      setErrorMsg(null);
      const updated = [...certificates];
      updated[index].uploading = true;
      setCertificates(updated);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'certificate');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload certificate');
      }

      updated[index].filePath = data.url;
      updated[index].fileName = file.name;
      updated[index].uploading = false;
      setCertificates([...updated]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading certificate');
      const updated = [...certificates];
      updated[index].uploading = false;
      setCertificates(updated);
    }
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), category: newSkillCategory }]);
    setNewSkillName('');
  };

  // Remove Skill
  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Add / Remove Project
  const handleAddProject = () => {
    setProjects([
      ...projects,
      { title: '', description: '', techStackInput: '', githubUrl: '', liveDemoUrl: '' },
    ]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index: number, field: keyof ProjectItem, val: string) => {
    const updated = [...projects];
    updated[index][field] = val;
    setProjects(updated);
  };

  // Add / Remove Certificate
  const handleAddCertificate = () => {
    setCertificates([
      ...certificates,
      { title: '', issuingOrg: '', issueDate: '', credentialUrl: '', filePath: '' },
    ]);
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleCertificateChange = (index: number, field: keyof CertificateItem, val: string) => {
    const updated = [...certificates];
    (updated[index] as any)[field] = val;
    setCertificates(updated);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Front-end sanity checks
    if (!studentId.trim()) {
      setErrorMsg('Student ID is required.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!institutionalEmail.trim()) {
      setErrorMsg('Institutional Email is required.');
      return;
    }
    if (!headlineBio.trim()) {
      setErrorMsg('Please write a headline bio to showcase yourself to recruiters.');
      return;
    }
    if (!resumePath) {
      setErrorMsg('Please attach your resume (PDF). Recruiters rely on this for evaluation.');
      return;
    }

    // Process projects
    const cleanedProjects = projects
      .filter((p) => p.title.trim())
      .map((p) => ({
        title: p.title.trim(),
        description: p.description.trim(),
        techStack: p.techStackInput
          ? p.techStackInput.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        githubUrl: p.githubUrl.trim() || undefined,
        liveDemoUrl: p.liveDemoUrl.trim() || undefined,
      }));

    // Process certificates
    const cleanedCertificates = certificates
      .filter((c) => c.title.trim())
      .map((c) => ({
        title: c.title.trim(),
        issuingOrg: c.issuingOrg.trim() || 'Verified Issuer',
        issueDate: c.issueDate.trim() || undefined,
        credentialUrl: c.credentialUrl.trim() || undefined,
        filePath: c.filePath || undefined,
      }));

    setSubmitting(true);

    try {
      const payload = {
        studentId: studentId.trim(),
        fullName: fullName.trim(),
        institutionalEmail: institutionalEmail.trim(),
        degree,
        branch,
        graduationYear: parseInt(graduationYear, 10),
        cgpa: parseFloat(cgpa) || 8.0,
        headlineBio: headlineBio.trim(),
        linkedinUrl: linkedinUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        resumePath,
        skills,
        projects: cleanedProjects,
        certificates: cleanedCertificates,
      };

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit profile');
      }

      setSuccessMsg('Profile submitted successfully! Redirecting to your recruiter preview...');
      setTimeout(() => {
        router.push(`/profile/${data.student.id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Page Title & Instructions */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Your Professional Digital Profile
        </h1>
        <p className="mt-2 text-slate-600">
          Present your technical achievements, projects, verified certificates, and resume to top campus recruiters.
        </p>

        {/* Privacy Notice */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <strong>Privacy Notice:</strong> Do not enter phone numbers, passwords, or sensitive personal IDs. Recruiters will evaluate you based on your verified academic details, projects, code repositories, certificates, and uploaded resume.
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Academic Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">1. Academic & Identity Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student ID / Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 22CS1045"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                placeholder="alex.m@college.edu"
                value={institutionalEmail}
                onChange={(e) => setInstitutionalEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current CGPA (out of 10) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                placeholder="e.g. 8.85"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Degree *
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                <option value="B.Sc">B.Sc (Computer Science / IT)</option>
                <option value="BCA">BCA (Computer Applications)</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Branch / Specialization *
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Graduation Year *
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                {[
                  2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035
                ].map((yr) => (
                  <option key={yr} value={String(yr)}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Professional Elevator Bio * (What makes you stand out to a recruiter?)
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Dedicated Full-Stack developer with a passion for high-performance React architectures, cloud deployment, and algorithmic problem solving..."
              value={headlineBio}
              onChange={(e) => setHeadlineBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Section 2: Professional Profiles & Links */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ExternalLink className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">2. Professional Links (No phone numbers)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Personal Portfolio URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://mywebsite.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Code className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">3. Technical Skills</h2>
          </div>

          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic mb-3">
              No skills added yet. Enter a skill name below and click &quot;Add Skill&quot;.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-indigo-400">({skill.category})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="hover:text-red-600 transition"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Skill name (e.g. Next.js, Python, Docker)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Cloud/DevOps">Cloud / DevOps</option>
              <option value="AI/ML">AI / ML</option>
              <option value="Languages">Languages</option>
              <option value="General">General</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-sm transition"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Section 4: Projects Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">4. Key Projects</h2>
            </div>
            <button
              type="button"
              onClick={handleAddProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </button>
          </div>

          <div className="space-y-6">
            {projects.map((proj, pIdx) => (
              <div key={pIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
                {projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(pIdx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition"
                    title="Remove project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed Task Scheduler"
                      value={proj.title}
                      onChange={(e) => handleProjectChange(pIdx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Go, Redis, Docker, gRPC"
                      value={proj.techStackInput}
                      onChange={(e) => handleProjectChange(pIdx, 'techStackInput', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the problem solved, design choices, and technical impact..."
                    value={proj.description}
                    onChange={(e) => handleProjectChange(pIdx, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="GitHub Repo URL (Optional)"
                    value={proj.githubUrl}
                    onChange={(e) => handleProjectChange(pIdx, 'githubUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Live Demo URL (Optional)"
                    value={proj.liveDemoUrl}
                    onChange={(e) => handleProjectChange(pIdx, 'liveDemoUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Certificates Showcase */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">5. Certificates & Verified Credentials</h2>
            </div>
            <button
              type="button"
              onClick={handleAddCertificate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Certificate
            </button>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
              <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No certificates added yet.</p>
              <button
                type="button"
                onClick={handleAddCertificate}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                + Add your first certificate
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert, cIdx) => (
                <div key={cIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveCertificate(cIdx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition"
                    title="Remove certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Certificate Name (e.g. AWS Cloud Practitioner)"
                      value={cert.title}
                      onChange={(e) => handleCertificateChange(cIdx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Org (e.g. Amazon Web Services, Coursera)"
                      value={cert.issuingOrg}
                      onChange={(e) => handleCertificateChange(cIdx, 'issuingOrg', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => handleCertificateChange(cIdx, 'issueDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="url"
                      placeholder="Credential Verification URL (Optional)"
                      value={cert.credentialUrl}
                      onChange={(e) => handleCertificateChange(cIdx, 'credentialUrl', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />

                    <div className="w-full sm:w-auto">
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{cert.filePath ? 'Change File' : 'Upload Doc (PDF/Image)'}</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleCertUpload(cIdx, f);
                          }}
                        />
                      </label>
                      {cert.uploading && <span className="ml-2 text-xs text-indigo-500">Uploading...</span>}
                      {cert.fileName && (
                        <span className="ml-2 text-xs text-emerald-600 font-medium">
                          ✓ {cert.fileName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 6: Resume Attachment (Mandatory for Recruiters) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">6. Official Resume Attachment (PDF only) *</h2>
          </div>

          <p className="text-xs text-slate-500">
            Recruiters will view and download your resume directly from your digital profile. Please ensure it is an updated PDF document (max 5MB).
          </p>

          <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-xl p-6 text-center transition">
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf"
              className="hidden"
              onChange={handleResumeUpload}
            />
            <label htmlFor="resume-file-input" className="cursor-pointer block">
              <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
              <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                {resumeFileName ? 'Replace Uploaded Resume' : 'Click to Upload Resume (PDF)'}
              </span>
              <p className="text-xs text-slate-400 mt-1">PDF format up to 5MB</p>
            </label>

            {isUploadingResume && (
              <p className="mt-3 text-xs font-semibold text-indigo-600">Uploading resume document...</p>
            )}

            {resumeFileName && !isUploadingResume && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Uploaded: <strong>{resumeFileName}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            By submitting, you confirm all academic and professional details are accurate and adhere to privacy guidelines.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {submitting ? 'Saving Profile...' : 'Save & Publish Digital Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
