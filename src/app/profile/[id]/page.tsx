import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudentById, getStudentByStudentId } from '@/lib/db';
import { 
  GraduationCap, 
  FileText, 
  Download, 
  ExternalLink, 
  Globe, 
  Mail, 
  Award, 
  Code, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import ProfileCertificateViewer from './ProfileCertificateViewer';

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

export const dynamic = 'force-dynamic';

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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recruiter Directory</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 sm:h-36 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800" />
          
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            {/* Top row: Avatar overlaps banner; Action Buttons sit cleanly in the white section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Avatar placeholder with Initials */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-md border-4 border-white shrink-0 -mt-12 sm:-mt-14">
                <div className="w-full h-full rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-2xl sm:text-3xl">
                  {student.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </div>

              {/* Action Buttons: Resume Download & Contact - positioned with clean breathing space */}
              <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
                {student.resumePath ? (
                  <a
                    href={student.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume (PDF)</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Resume Not Uploaded</span>
                  </button>
                )}

                <a
                  href={`mailto:${student.institutionalEmail}?subject=Recruiter Inquiry: ${encodeURIComponent(student.fullName)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-xs transition"
                >
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Contact via Email</span>
                </a>
              </div>
            </div>

            {/* Name, Student ID & Academics */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student.fullName}
                </h1>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  ID: {student.studentId}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  CGPA {student.cgpa.toFixed(2)} / 10.0
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>
                    {student.degree} in {student.branch}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Class of {student.graduationYear}</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed max-w-3xl pt-2">
                {student.headlineBio}
              </p>

              {/* Social and Portfolio links */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {student.institutionalEmail && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{student.institutionalEmail}</span>
                  </span>
                )}

                {student.linkedinUrl && (
                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition"
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition"
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
          <div className="px-6 sm:px-10 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Verified Profile:</strong> Student phone number and sensitive credentials withheld per privacy protection standards.
            </span>
          </div>
        </div>

        {/* Section 1: Technical Skills Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Code className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Technical Skills Matrix</h2>
          </div>

          {Object.keys(skillsByCategory).length === 0 ? (
            <p className="text-xs text-slate-400 italic">No specific skills listed.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skillName, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Featured Projects</h2>
          </div>

          {(!student.projects || student.projects.length === 0) ? (
            <p className="text-xs text-slate-400 italic">No projects added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {proj.description}
                    </p>

                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Links */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Verified Certifications & Credentials</h2>
          </div>

          <ProfileCertificateViewer certificates={student.certificates || []} />
        </div>
      </div>
    </div>
  );
}
