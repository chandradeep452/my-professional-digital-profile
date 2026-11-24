import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudentById, getStudentByStudentId } from '@/lib/db';
import { 
  GraduationCap, 
  ExternalLink, 
  Globe, 
  Mail, 
  Award, 
  Code, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Briefcase
} from 'lucide-react';
import ProfileCertificateViewer from './ProfileCertificateViewer';
import ProfileClientActions from './ProfileClientActions';

export const dynamic = 'force-dynamic';

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let student = getStudentById(id);
  if (!student) {
    student = getStudentByStudentId(id.toUpperCase());
  }

  if (!student) {
    notFound();
  }

  // Group skills by category
  const skillsByCategory: { [key: string]: string[] } = {};
  (student.skills || []).forEach((sk) => {
    const cat = sk.category || 'General';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(sk.name);
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-normal text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recruiter Directory</span>
          </Link>
        </div>

        {/* Profile Card Header with Smoked Obsidian Banner */}
        <div className="glass-panel rounded-3xl border border-white/12 shadow-2xl overflow-hidden relative">
          <div className="h-36 sm:h-44 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          </div>

          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            {/* Top row: Avatar cleanly overlaps banner; Action Buttons sit cleanly below */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Avatar placeholder with Initials */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-zinc-950 p-1.5 shadow-2xl border-4 border-zinc-950 shrink-0 -mt-12 sm:-mt-14">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-white font-medium text-2xl sm:text-3xl shadow-inner border border-white/20">
                  {student.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </div>

              {/* Action Buttons with Interactive Client Motion */}
              <ProfileClientActions
                resumePath={student.resumePath}
                institutionalEmail={student.institutionalEmail}
                fullName={student.fullName}
              />
            </div>

            {/* Name, Student ID & Academics */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-medium text-white tracking-tight">
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

              {/* Social and Portfolio links */}
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

          {/* Privacy safe footer bar */}
          <div className="px-6 sm:px-10 py-3.5 bg-black/75 border-t border-white/10 flex items-center gap-2.5 text-xs text-zinc-400 font-normal">
            <ShieldCheck className="w-4 h-4 text-zinc-200 shrink-0" />
            <span>
              <span className="text-zinc-100 font-medium">Verified Profile:</span> Student phone number and sensitive credentials withheld per privacy protection standards.
            </span>
          </div>
        </div>

        {/* Section 1: Technical Skills Matrix */}
        <div className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Code className="w-5 h-5 text-zinc-200" />
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

        {/* Section 2: Featured Projects */}
        <div className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Briefcase className="w-5 h-5 text-zinc-200" />
            <h2 className="text-lg font-medium text-white">Featured Projects</h2>
          </div>

          {(!student.projects || student.projects.length === 0) ? (
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

                  {/* Project Links */}
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
        </div>

        {/* Section 3: Verified Certificates Showcase */}
        <div className="glass-panel rounded-3xl border border-white/12 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Award className="w-5 h-5 text-zinc-200" />
            <h2 className="text-lg font-medium text-white">Verified Certifications & Credentials</h2>
          </div>

          <ProfileCertificateViewer certificates={student.certificates || []} />
        </div>
      </div>
    </div>
  );
}
