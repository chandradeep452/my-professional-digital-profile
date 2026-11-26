'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '@/types';
import ProfileClientActions from '@/app/profile/[id]/ProfileClientActions';
import ProfileCertificateViewer from '@/app/profile/[id]/ProfileCertificateViewer';
import {
  LayoutGrid,
  UserCheck,
  Briefcase,
  Award,
  FileText,
  Pencil,
  Eye,
  GraduationCap,
  Calendar,
  Mail,
  ExternalLink,
  Globe,
  Code,
  Download,
  ChevronRight,
} from 'lucide-react';

export type ProfileTabKey = 'overview' | 'profile' | 'projects' | 'certificates' | 'resume';

interface StudentProfileWorkspaceProps {
  student: Student;
  isOwner: boolean;
  editHref: string;
  previewHref?: string;
}

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function StudentProfileWorkspace({
  student,
  isOwner,
  editHref,
  previewHref,
}: StudentProfileWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('overview');

  const skillsCount = student.skills?.length || 0;
  const projectsCount = student.projects?.length || 0;
  const certificatesCount = student.certificates?.length || 0;

  const skillsByCategory: { [key: string]: string[] } = {};
  (student.skills || []).forEach((sk) => {
    const cat = sk.category || 'General';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(sk.name);
  });

  const navItems: {
    key: ProfileTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutGrid },
    { key: 'profile', label: 'Profile, Edu & Skills', icon: UserCheck, badge: skillsCount > 0 ? String(skillsCount) : undefined },
    { key: 'projects', label: 'Projects', icon: Briefcase, badge: projectsCount > 0 ? String(projectsCount) : undefined },
    {
      key: 'certificates',
      label: 'Certificates & Achievements',
      icon: Award,
      badge: certificatesCount > 0 ? String(certificatesCount) : undefined,
    },
    { key: 'resume', label: 'Resume Management', icon: FileText, badge: student.resumePath ? 'PDF' : undefined },
  ];

  const initials = student.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
      {/* Left Sidebar Navigation */}
      <aside className="w-full lg:w-68 shrink-0 lg:sticky lg:top-24">
        <div className="glass-panel rounded-3xl border border-white/12 p-3.5 sm:p-4 space-y-4 shadow-2xl">
          {/* Compact Student Identity Strip in Sidebar */}
          <div className="flex items-center gap-3 px-2.5 py-2 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-white font-medium text-sm border border-white/20 shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{student.fullName}</p>
              <p className="text-[11px] text-zinc-400 font-normal truncate">
                {student.studentId} • CGPA {student.cgpa.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Sidebar Navigation Pills */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-normal transition-all cursor-pointer shrink-0 lg:w-full text-left ${
                    isActive
                      ? 'bg-[#0b1f33]/90 text-white border border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.12)]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-sky-400' : 'text-sky-400/75 group-hover:text-sky-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>

                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${
                        isActive
                          ? 'bg-sky-400/15 border-sky-400/35 text-sky-200'
                          : 'bg-zinc-900/90 border-white/10 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Owner Actions right on the Left Sidebar */}
          {isOwner && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <Link
                href={editHref}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium shadow-md shadow-black/40 transition"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>

              {previewHref && (
                <Link
                  href={previewHref}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/15 bg-zinc-950/90 hover:bg-zinc-900 text-zinc-200 hover:text-white text-xs font-normal transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Public Card</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              {/* Profile Card Header with Smoked Obsidian Banner */}
              <div className="glass-panel rounded-3xl border border-white/12 shadow-2xl overflow-hidden relative">
                <div className="h-32 sm:h-40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
                </div>

                <div className="px-6 sm:px-8 pb-7 pt-0 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl bg-zinc-950 p-1.5 shadow-2xl border-4 border-zinc-950 shrink-0 -mt-11 sm:-mt-13">
                      <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-white font-medium text-2xl sm:text-3xl shadow-inner border border-white/20">
                        {initials}
                      </div>
                    </div>

                    <ProfileClientActions
                      resumePath={student.resumePath}
                      institutionalEmail={student.institutionalEmail}
                      fullName={student.fullName}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                        {student.fullName}
                      </h1>
                      <span className="px-3 py-1 rounded-full text-xs font-normal bg-zinc-900 text-zinc-200 border border-white/15">
                        ID: {student.studentId}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                        CGPA {student.cgpa.toFixed(2)} / 10.0
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300 font-normal">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-zinc-300" />
                        <span>
                          {student.degree} in {student.branch}
                        </span>
                      </div>
                      <span className="text-zinc-600">•</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-300" />
                        <span>Class of {student.graduationYear}</span>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 font-normal leading-relaxed max-w-3xl pt-1">
                      {student.headlineBio}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {student.institutionalEmail && (
                        <span className="inline-flex items-center gap-2 text-xs font-normal text-zinc-200 bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-white/15">
                          <Mail className="w-3.5 h-3.5 text-zinc-300" />
                          <span>{student.institutionalEmail}</span>
                        </span>
                      )}

                      {student.linkedinUrl && (
                        <a
                          href={student.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-100 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl border border-white/15 transition shadow-xs"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                        </a>
                      )}

                      {student.githubUrl && (
                        <a
                          href={student.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-100 bg-zinc-900 hover:bg-zinc-800 px-3.5 py-1.5 rounded-xl border border-white/15 transition shadow-xs"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                        </a>
                      )}

                      {student.portfolioUrl && (
                        <a
                          href={student.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-100 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl border border-white/15 transition shadow-xs"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Portfolio</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Section Summary Cards (Click any card to jump to that sidebar section) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="glass-card p-5 rounded-3xl border border-white/12 hover:border-sky-400/35 text-left transition group cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
                      <Code className="w-4 h-4 text-sky-400" />
                      <span>Profile, Edu & Skills</span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {skillsCount} Verified Skill{skillsCount === 1 ? '' : 's'}
                    </p>
                    <p className="text-xs text-zinc-400 font-normal truncate">
                      {student.degree} • {student.branch}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="glass-card p-5 rounded-3xl border border-white/12 hover:border-sky-400/35 text-left transition group cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
                      <Briefcase className="w-4 h-4 text-sky-400" />
                      <span>Projects</span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {projectsCount} Featured Project{projectsCount === 1 ? '' : 's'}
                    </p>
                    <p className="text-xs text-zinc-400 font-normal truncate">
                      {projectsCount > 0 && student.projects?.[0] ? student.projects[0].title : 'Open projects showcase'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('certificates')}
                  className="glass-card p-5 rounded-3xl border border-white/12 hover:border-sky-400/35 text-left transition group cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
                      <Award className="w-4 h-4 text-sky-400" />
                      <span>Certificates & Achievements</span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {certificatesCount} Certificate{certificatesCount === 1 ? '' : 's'}
                    </p>
                    <p className="text-xs text-zinc-400 font-normal truncate">
                      {certificatesCount > 0 && student.certificates?.[0] ? student.certificates[0].title : 'Inspect credentials & docs'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className="glass-card p-5 rounded-3xl border border-white/12 hover:border-sky-400/35 text-left transition group cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
                      <FileText className="w-4 h-4 text-sky-400" />
                      <span>Resume Management</span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {student.resumePath ? 'PDF Resume Ready' : 'No Resume Uploaded'}
                    </p>
                    <p className="text-xs text-zinc-400 font-normal truncate">
                      {student.resumePath ? 'View inline or download PDF' : 'Attach a PDF in Edit Profile'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              {/* Academic & Identity Card */}
              <div className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-5 h-5 text-sky-400" />
                    <h2 className="text-lg font-medium text-white">Academic & Identity Details</h2>
                  </div>
                  {isOwner && (
                    <Link
                      href={editHref}
                      className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-300 hover:text-white transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-normal">Student ID</span>
                    <p className="text-white font-medium">{student.studentId}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-normal">Institutional Email</span>
                    <p className="text-white font-normal break-all">{student.institutionalEmail}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-normal">Degree & Branch</span>
                    <p className="text-white font-normal">
                      {student.degree} in {student.branch}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-normal">Class & CGPA</span>
                    <p className="text-white font-normal">
                      Class of {student.graduationYear} • CGPA {student.cgpa.toFixed(2)} / 10.0
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-normal">Headline & Bio</span>
                  <p className="text-sm text-zinc-200 font-normal leading-relaxed">{student.headlineBio}</p>
                </div>
              </div>

              {/* Technical Skills Matrix */}
              <div className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <Code className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-medium text-white">Technical Skills Matrix</h2>
                </div>

                {Object.keys(skillsByCategory).length === 0 ? (
                  <p className="text-xs text-zinc-500 italic font-normal">No specific skills listed.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(skillsByCategory).map(([category, items]) => (
                      <div key={category} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
                        <h3 className="text-xs font-normal text-zinc-400 uppercase tracking-wider">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {items.map((skillName, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-xl text-xs font-normal bg-zinc-900 text-zinc-200 border border-white/12 hover:border-white/30 transition"
                            >
                              {skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-medium text-white">Featured Projects</h2>
                </div>
                {isOwner && (
                  <Link
                    href={editHref}
                    className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-300 hover:text-white transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Manage Projects</span>
                  </Link>
                )}
              </div>

              {!student.projects || student.projects.length === 0 ? (
                <p className="text-xs text-zinc-500 italic font-normal">No projects added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {student.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all group"
                    >
                      <div className="space-y-2.5">
                        <h3 className="text-base font-medium text-white group-hover:text-zinc-200 transition">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-zinc-300 font-normal leading-relaxed whitespace-pre-line">
                          {proj.description}
                        </p>

                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.techStack.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-0.5 rounded-md text-[11px] font-normal bg-white/10 text-zinc-200 border border-white/15"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-300 hover:text-white transition"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>Source Code</span>
                          </a>
                        )}

                        {proj.liveDemoUrl && (
                          <a
                            href={proj.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-200 hover:text-white transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-medium text-white">Verified Certifications & Achievements</h2>
                </div>
                {isOwner && (
                  <Link
                    href={editHref}
                    className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-300 hover:text-white transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Manage Certificates</span>
                  </Link>
                )}
              </div>

              <ProfileCertificateViewer certificates={student.certificates || []} />
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-medium text-white">Official Resume Document</h2>
                </div>

                {student.resumePath && (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={student.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-zinc-950 hover:bg-zinc-900 text-zinc-200 hover:text-white text-xs font-normal transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in New Tab</span>
                    </a>
                    <a
                      href={student.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}
              </div>

              {student.resumePath ? (
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/75">
                  <iframe
                    src={student.resumePath}
                    title={`${student.fullName} Resume PDF`}
                    className="w-full h-[68vh] min-h-[460px] bg-white"
                  />
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-black/60 border border-white/10 text-center space-y-4">
                  <FileText className="w-10 h-10 text-zinc-500 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-200">No Resume Uploaded Yet</p>
                    <p className="text-xs text-zinc-400 font-normal">
                      {isOwner
                        ? 'Upload your official PDF resume in the profile editor so recruiters can preview and download it.'
                        : 'This student has not uploaded a PDF resume yet.'}
                    </p>
                  </div>
                  {isOwner && (
                    <Link
                      href={editHref}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Upload Resume in Edit Profile</span>
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
