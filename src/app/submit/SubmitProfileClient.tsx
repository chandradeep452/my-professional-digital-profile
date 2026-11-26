'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AuthUser, Student } from '@/types';
import CustomSelect from '@/components/CustomSelect';
import SparkleBorderButton from '@/components/SparkleBorderButton';
import { 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Award, 
  Code, 
  User, 
  ExternalLink,
  AlertCircle,
  Sparkles,
  CloudUpload,
  Eye,
  ArrowLeft,
  Camera
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

interface SubmitProfileClientProps {
  authUser: AuthUser;
  initialProfile: Student | null;
  fromContext?: string;
  originContext?: string;
  profileIdContext?: string;
}

export default function SubmitProfileClient({
  authUser,
  initialProfile,
  fromContext,
  originContext,
  profileIdContext,
}: SubmitProfileClientProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProfile);

  const targetProfileId = profileIdContext || initialProfile?.id;
  const backHref =
    fromContext === 'profile' && targetProfileId
      ? `/profile/${targetProfileId}${originContext ? `?from=${encodeURIComponent(originContext)}` : ''}`
      : '/';
  const backLabel =
    fromContext === 'profile' && targetProfileId ? 'Back to Student Profile' : 'Back to Home';

  // Basic Details (pre-filled when editing or from student account)
  const [studentId, setStudentId] = useState(
    initialProfile?.studentId || authUser.studentId || ''
  );
  const [fullName, setFullName] = useState(
    initialProfile?.fullName || authUser.fullName || ''
  );
  const [institutionalEmail, setInstitutionalEmail] = useState(
    initialProfile?.institutionalEmail || authUser.email || ''
  );
  const [degree, setDegree] = useState(initialProfile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(
    initialProfile?.branch || 'Computer Science & Engineering'
  );
  const [graduationYear, setGraduationYear] = useState(
    initialProfile?.graduationYear ? String(initialProfile.graduationYear) : '2026'
  );
  const [cgpa, setCgpa] = useState(
    initialProfile?.cgpa !== undefined ? String(initialProfile.cgpa) : ''
  );
  const [headlineBio, setHeadlineBio] = useState(initialProfile?.headlineBio || '');

  // Social Links
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialProfile?.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolioUrl || '');

  // Skills
  const [skills, setSkills] = useState<SkillItem[]>(
    (initialProfile?.skills || []).map((s) => ({ name: s.name, category: s.category }))
  );
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');

  // Projects
  const [projects, setProjects] = useState<ProjectItem[]>(
    initialProfile?.projects && initialProfile.projects.length > 0
      ? initialProfile.projects.map((p) => ({
          title: p.title,
          description: p.description,
          techStackInput: (p.techStack || []).join(', '),
          githubUrl: p.githubUrl || '',
          liveDemoUrl: p.liveDemoUrl || '',
        }))
      : [
          {
            title: '',
            description: '',
            techStackInput: '',
            githubUrl: '',
            liveDemoUrl: '',
          },
        ]
  );

  // Certificates
  const [certificates, setCertificates] = useState<CertificateItem[]>(
    (initialProfile?.certificates || []).map((c) => ({
      title: c.title,
      issuingOrg: c.issuingOrg,
      issueDate: c.issueDate || '',
      credentialUrl: c.credentialUrl || '',
      filePath: c.filePath || '',
      fileName: c.filePath ? c.filePath.split('/').pop() : undefined,
    }))
  );

  // Profile Photo Upload State
  const [photoPath, setPhotoPath] = useState(initialProfile?.photoPath || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Resume Upload State
  const [resumePath, setResumePath] = useState(initialProfile?.resumePath || '');
  const [resumeFileName, setResumeFileName] = useState(
    initialProfile?.resumePath ? initialProfile.resumePath.split('/').pop() || 'Uploaded Resume.pdf' : ''
  );
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isResumeDragOver, setIsResumeDragOver] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Process profile photo upload
  const processPhotoFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Profile photo must be an image file (PNG, JPG, or WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Profile photo size must be less than 5MB.');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setErrorMsg(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'photo');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload profile photo');
      }

      setPhotoPath(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading profile photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Process and upload file
  const processResumeFile = async (file: File) => {
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

  // Drag and drop handlers for resume
  const handleResumeDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeDragOver(true);
  }, []);

  const handleResumeDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeDragOver(false);
  }, []);

  const handleResumeDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processResumeFile(files[0]);
    }
  }, []);

  const handleResumeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processResumeFile(file);
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

  // Skills
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), category: newSkillCategory }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Projects
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

  // Certificates
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

  // Delete Profile Handler
  const handleDeleteProfile = async () => {
    if (!initialProfile) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/students/${initialProfile.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete profile');
      }

      setSuccessMsg('Profile removed successfully.');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete error');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Submit Handler with Confetti
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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
        photoPath: photoPath || '',
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

      // Trigger Confetti Celebration in silver/chrome tones
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#e4e4e7', '#a1a1aa', '#38bdf8', '#c084fc'],
        });
      } catch (e) {
        // Confetti fallback
      }

      setSuccessMsg(
        isEditing
          ? 'Profile updated successfully! Redirecting...'
          : 'Profile published successfully! Redirecting...'
      );
      setTimeout(() => {
        if (fromContext === 'profile') {
          const target = `/profile/${data.student.id}${
            originContext ? `?from=${encodeURIComponent(originContext)}` : ''
          }`;
          router.push(target);
        } else {
          router.push('/');
        }
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-black/75 border border-white/15 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/15 text-sm font-normal transition';
  const innerInputClass =
    'w-full px-3.5 py-2 rounded-xl bg-black/85 border border-white/12 text-zinc-100 placeholder-zinc-500 text-sm font-normal focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/15 transition';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 relative z-10">
      {/* Title & Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950/90 border border-white/15 text-zinc-200 hover:text-white hover:bg-zinc-900 text-xs font-normal transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-200 text-xs font-normal">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Student Profile Editor • {authUser.fullName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {initialProfile && (
              <>
                <Link
                  href={`/profile/${initialProfile.id}?from=editor${
                    fromContext ? `&origin=${encodeURIComponent(fromContext)}` : ''
                  }`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-white/15 text-zinc-200 hover:text-white hover:bg-zinc-900 text-xs font-normal transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  disabled={deleting}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-normal transition cursor-pointer ${
                    confirmDelete
                      ? 'bg-red-600/90 border-red-400 text-white hover:bg-red-600'
                      : 'bg-zinc-950 border-red-500/30 text-red-300 hover:bg-red-950/50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {deleting
                      ? 'Removing...'
                      : confirmDelete
                      ? 'Confirm Remove Profile'
                      : 'Remove Profile'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-medium text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          {isEditing ? 'Edit Your Professional Digital Profile' : 'Create Your Professional Digital Profile'}
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          Present your technical achievements, projects, verified certificates, and resume to top campus recruiters.
        </p>
      </motion.div>

      {/* Error & Success Alerts */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-700/50 flex items-center gap-3 text-red-200 text-sm font-normal"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-zinc-900/95 border border-white/30 flex items-center gap-3 text-white text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Academic & Identity Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/12 space-y-5 relative z-30"
        >
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <User className="w-5 h-5 text-zinc-200" />
            <h2 className="text-lg font-medium text-white">1. Academic & Identity Details</h2>
          </div>

          {/* Student Photo Uploader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/65 border border-white/12">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                {photoPath ? (
                  <img
                    src={photoPath}
                    alt={fullName || 'Student Photo'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-7 h-7 text-zinc-400" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Student Profile Photo</p>
                <p className="text-xs text-zinc-400 font-normal">
                  Displayed on your profile card and recruiter directory (PNG, JPG, WEBP up to 5MB).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingPhoto ? 'Uploading...' : photoPath ? 'Change Photo' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processPhotoFile(f);
                  }}
                />
              </label>

              {photoPath && (
                <button
                  type="button"
                  onClick={() => setPhotoPath('')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950 border border-white/15 text-zinc-300 hover:text-white hover:bg-zinc-900 text-xs font-normal transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Student ID / Registration Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 22CS101"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rushita Jalla"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                placeholder="rushita.j@college.edu"
                value={institutionalEmail}
                onChange={(e) => setInstitutionalEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Current CGPA (out of 10) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                placeholder="e.g. 9.15"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Degree *
              </label>
              <CustomSelect
                value={degree}
                onChange={setDegree}
                fullWidth
                options={[
                  { value: 'B.Tech', label: 'B.Tech (Bachelor of Technology)' },
                  { value: 'B.E.', label: 'B.E. (Bachelor of Engineering)' },
                  { value: 'B.Sc', label: 'B.Sc (Bachelor of Science)' },
                  { value: 'BCA', label: 'BCA (Computer Applications)' },
                  { value: 'M.Tech', label: 'M.Tech' },
                  { value: 'MCA', label: 'MCA' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Branch / Specialization *
              </label>
              <CustomSelect
                value={branch}
                onChange={setBranch}
                fullWidth
                options={[
                  { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
                  { value: 'Information Technology', label: 'Information Technology' },
                  { value: 'AI & Data Science', label: 'AI & Data Science' },
                  { value: 'Electronics & Communication', label: 'Electronics & Communication' },
                  { value: 'Electrical & Electronics', label: 'Electrical & Electronics' },
                  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'Chemistry', label: 'Chemistry' },
                  { value: 'Biology', label: 'Biology' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Graduation Year *
              </label>
              <CustomSelect
                value={graduationYear}
                onChange={setGraduationYear}
                fullWidth
                options={[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map((yr) => ({
                  value: String(yr),
                  label: String(yr),
                }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
              Professional Elevator Bio * (Highlight your focus areas, interests, and impact)
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Dedicated Full-Stack developer with a passion for high-performance React architectures, cloud deployment, and algorithmic problem solving..."
              value={headlineBio}
              onChange={(e) => setHeadlineBio(e.target.value)}
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* Section 2: Professional Profiles & Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/12 space-y-4"
        >
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <ExternalLink className="w-5 h-5 text-zinc-200" />
            <h2 className="text-lg font-medium text-white">2. Professional Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                placeholder="linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="text"
                placeholder="github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                Portfolio URL (Optional)
              </label>
              <input
                type="text"
                placeholder="www.mywebsite.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Technical Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/12 space-y-4 relative z-20"
        >
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Code className="w-5 h-5 text-zinc-200" />
            <h2 className="text-lg font-medium text-white">3. Technical Skills</h2>
          </div>

          {skills.length === 0 ? (
            <p className="text-xs text-zinc-400 italic mb-3 font-normal">
              No skills added yet. Enter a skill name below and click &quot;Add Skill&quot;.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-normal bg-white/10 text-zinc-100 border border-white/20"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">({skill.category})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="hover:text-red-400 transition ml-1 cursor-pointer"
                    >
                      &times;
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Skill name (e.g. Next.js, Python, Docker)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className={'flex-1 ' + inputClass}
            />
            <CustomSelect
              value={newSkillCategory}
              onChange={setNewSkillCategory}
              options={[
                { value: 'Frontend', label: 'Frontend' },
                { value: 'Backend', label: 'Backend' },
                { value: 'Database', label: 'Database' },
                { value: 'Cloud/DevOps', label: 'Cloud / DevOps' },
                { value: 'AI/ML', label: 'AI / ML' },
                { value: 'Languages', label: 'Languages' },
                { value: 'General', label: 'General' },
              ]}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSkill}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-xl text-sm transition cursor-pointer shadow-md shadow-black/40"
            >
              Add Skill
            </motion.button>
          </div>
        </motion.div>

        {/* Section 4: Projects Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/12 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Code className="w-5 h-5 text-zinc-200" />
              <h2 className="text-lg font-medium text-white">4. Key Projects</h2>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-normal text-zinc-100 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </motion.button>
          </div>

          <div className="space-y-5">
            <AnimatePresence>
              {projects.map((proj, pIdx) => (
                <motion.div
                  key={pIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 rounded-2xl bg-black/65 border border-white/10 space-y-3 relative"
                >
                  {projects.length > 1 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1, color: '#f87171' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveProject(pIdx)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                      title="Remove project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-normal text-zinc-300 mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Distributed Task Scheduler"
                        value={proj.title}
                        onChange={(e) => handleProjectChange(pIdx, 'title', e.target.value)}
                        className={innerInputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-normal text-zinc-300 mb-1">
                        Tech Stack (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Go, Redis, Docker, gRPC"
                        value={proj.techStackInput}
                        onChange={(e) => handleProjectChange(pIdx, 'techStackInput', e.target.value)}
                        className={innerInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-normal text-zinc-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief description of the problem solved, architecture choices, and impact..."
                      value={proj.description}
                      onChange={(e) => handleProjectChange(pIdx, 'description', e.target.value)}
                      className={innerInputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="GitHub Repo URL (Optional)"
                      value={proj.githubUrl}
                      onChange={(e) => handleProjectChange(pIdx, 'githubUrl', e.target.value)}
                      className={innerInputClass + ' text-xs'}
                    />
                    <input
                      type="text"
                      placeholder="Live Demo URL (Optional)"
                      value={proj.liveDemoUrl}
                      onChange={(e) => handleProjectChange(pIdx, 'liveDemoUrl', e.target.value)}
                      className={innerInputClass + ' text-xs'}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Section 5: Certificates Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/12 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-zinc-200" />
              <h2 className="text-lg font-medium text-white">5. Certificates & Verified Credentials</h2>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCertificate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-normal text-zinc-100 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Certificate
            </motion.button>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-white/15 rounded-2xl bg-black/60">
              <Award className="w-8 h-8 text-zinc-500 mx-auto mb-2 opacity-70" />
              <p className="text-xs text-zinc-400 font-normal">No certificates added yet.</p>
              <button
                type="button"
                onClick={handleAddCertificate}
                className="mt-2 text-xs font-normal text-zinc-200 hover:text-white transition cursor-pointer underline"
              >
                + Add your first certificate
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {certificates.map((cert, cIdx) => (
                  <motion.div
                    key={cIdx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl bg-black/65 border border-white/10 space-y-3 relative"
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1, color: '#f87171' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveCertificate(cIdx)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                      title="Remove certificate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Certificate Name (e.g. AWS Cloud)"
                        value={cert.title}
                        onChange={(e) => handleCertificateChange(cIdx, 'title', e.target.value)}
                        className={innerInputClass}
                      />
                      <input
                        type="text"
                        placeholder="Issuer (e.g. Amazon Web Services)"
                        value={cert.issuingOrg}
                        onChange={(e) => handleCertificateChange(cIdx, 'issuingOrg', e.target.value)}
                        className={innerInputClass}
                      />
                      <input
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) => handleCertificateChange(cIdx, 'issueDate', e.target.value)}
                        className={innerInputClass}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        placeholder="Verification URL (Optional)"
                        value={cert.credentialUrl}
                        onChange={(e) => handleCertificateChange(cIdx, 'credentialUrl', e.target.value)}
                        className={'flex-1 ' + innerInputClass + ' text-xs'}
                      />

                      <div className="w-full sm:w-auto flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-100 text-xs font-normal rounded-xl cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{cert.filePath ? 'Change Doc' : 'Upload File (PDF/Image)'}</span>
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
                        {cert.uploading && <span className="text-xs text-zinc-300 animate-pulse">Uploading...</span>}
                        {cert.fileName && (
                          <span className="text-xs text-emerald-300 font-normal truncate max-w-[150px]">
                            ✓ {cert.fileName}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Section 6: Official Resume Attachment with Real Drag & Drop Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/12 space-y-4"
        >
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <FileText className="w-5 h-5 text-zinc-200" />
            <h2 className="text-lg font-medium text-white">6. Official Resume Attachment (PDF only) *</h2>
          </div>

          <p className="text-xs text-zinc-400 font-normal">
            Recruiters will view and download your resume directly from your digital profile. Please attach an updated PDF document (max 5MB).
          </p>

          {/* Interactive Drag & Drop Box */}
          <motion.div
            onDragOver={handleResumeDragOver}
            onDragLeave={handleResumeDragLeave}
            onDrop={handleResumeDrop}
            animate={{
              scale: isResumeDragOver ? 1.02 : 1,
              borderColor: isResumeDragOver ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.22)',
              backgroundColor: isResumeDragOver ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.65)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative overflow-hidden group shadow-inner"
          >
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf"
              className="hidden"
              onChange={handleResumeInputChange}
            />
            <label htmlFor="resume-file-input" className="cursor-pointer block space-y-3">
              <motion.div
                animate={{ y: isResumeDragOver ? -8 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-zinc-100 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-black/50"
              >
                {isResumeDragOver ? (
                  <CloudUpload className="w-8 h-8 text-white animate-bounce" />
                ) : (
                  <Upload className="w-8 h-8 text-zinc-200" />
                )}
              </motion.div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-zinc-100 group-hover:text-white transition">
                  {resumeFileName
                    ? 'Drag a new PDF here, or click to replace'
                    : isResumeDragOver
                    ? 'Drop your PDF resume here!'
                    : 'Drag & Drop your Resume (PDF) here, or browse files'}
                </span>
                <p className="text-xs text-zinc-500 font-normal">PDF documents only, up to 5MB</p>
              </div>
            </label>

            {isUploadingResume && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-zinc-100 text-xs font-normal"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Uploading resume document...</span>
              </motion.div>
            )}

            {resumeFileName && !isUploadingResume && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 border border-white/25 text-zinc-100 text-xs font-normal shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Uploaded: <span className="text-white font-medium">{resumeFileName}</span>
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Submit Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <p className="text-xs text-zinc-400 font-normal">
            By submitting, you confirm all details are accurate.
          </p>

          <SparkleBorderButton type="submit" size="md">
            {submitting
              ? isEditing
                ? 'Saving Changes...'
                : 'Publishing Profile...'
              : isEditing
              ? 'Save Profile Changes'
              : 'Save & Publish Digital Profile'}
          </SparkleBorderButton>
        </div>
      </form>
    </div>
  );
}
