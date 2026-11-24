'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Student } from '@/types';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  Award, 
  Code, 
  ArrowRight,
  Mail,
  User
} from 'lucide-react';

interface Props {
  initialStudents: Student[];
}

export default function RecruiterDirectoryClient({ initialStudents }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Extract unique branches and years for filters
  const branches = useMemo(() => {
    const list = Array.from(new Set(initialStudents.map((s) => s.branch).filter(Boolean)));
    return ['All', ...list];
  }, [initialStudents]);

  const years = useMemo(() => {
    const list = Array.from(new Set(initialStudents.map((s) => s.graduationYear).filter(Boolean)));
    return ['All', ...list.sort()];
  }, [initialStudents]);

  // Filter logic
  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      // Branch filter
      if (selectedBranch !== 'All' && student.branch !== selectedBranch) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'All' && String(student.graduationYear) !== selectedYear) {
        return false;
      }
      // Search keyword filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const skillsText = (student.skills || []).map((sk) => sk.name).join(' ').toLowerCase();
        const projectsText = (student.projects || []).map((p) => `${p.title} ${(p.techStack || []).join(' ')}`).join(' ').toLowerCase();
        const matchesName = student.fullName.toLowerCase().includes(query);
        const matchesId = student.studentId.toLowerCase().includes(query);
        const matchesBio = student.headlineBio.toLowerCase().includes(query);
        const matchesBranch = student.branch.toLowerCase().includes(query);
        const matchesSkills = skillsText.includes(query);
        const matchesProjects = projectsText.includes(query);

        return matchesName || matchesId || matchesBio || matchesBranch || matchesSkills || matchesProjects;
      }
      return true;
    });
  }, [initialStudents, searchTerm, selectedBranch, selectedYear]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, skill (e.g. React, Python), or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Departments' : b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 md:flex-initial">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {years.map((y) => (
                <option key={String(y)} value={String(y)}>
                  {y === 'All' ? 'All Batches' : `Class of ${y}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          Candidate Profiles{' '}
          <span className="text-sm font-normal text-slate-500">
            ({filteredStudents.length} candidate{filteredStudents.length === 1 ? '' : 's'})
          </span>
        </h2>
        <Link
          href="/submit"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>Are you a student? Submit your profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Student Cards Grid */}
      {initialStudents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No Student Profiles Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              The talent directory is currently fresh and ready for submissions. You can start your test bench by submitting a new student profile.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition"
          >
            <span>Submit / Add Student Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <User className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No matching student profiles found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to view all registered students.
          </p>
          {(searchTerm || selectedBranch !== 'All' || selectedYear !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBranch('All');
                setSelectedYear('All');
              }}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Header: Name, ID, CGPA */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition">
                      {student.fullName}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      ID: <span className="font-semibold text-slate-700">{student.studentId}</span>
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    CGPA {student.cgpa.toFixed(2)}
                  </span>
                </div>

                {/* Academic info */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {student.degree} • {student.branch} ({student.graduationYear})
                  </span>
                </div>

                {/* Headline Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {student.headlineBio}
                </p>

                {/* Skills Preview */}
                {student.skills && student.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {student.skills.slice(0, 4).map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {sk.name}
                      </span>
                    ))}
                    {student.skills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500">
                        +{student.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Badges: Projects & Certificates */}
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{student.projects?.length || 0} Projects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{student.certificates?.length || 0} Certificates</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/profile/${student.id}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  View Profile
                </Link>

                {student.resumePath ? (
                  <a
                    href={student.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
                    title="View Resume PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Resume</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 italic py-2 px-2">No Resume</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
