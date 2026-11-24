'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '@/types';
import CustomSelect from '@/components/CustomSelect';
import IridescentButton from '@/components/IridescentButton';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  FileText, 
  Award, 
  Code, 
  ArrowRight,
  Sparkles,
  User,
  ChevronRight
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
      if (selectedBranch !== 'All' && student.branch !== selectedBranch) return false;
      if (selectedYear !== 'All' && String(student.graduationYear) !== selectedYear) return false;
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
    <div className="space-y-10 pb-16">
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-black/75 via-black/45 to-transparent backdrop-blur-[2px]">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/90 border border-white/15 text-zinc-200 text-xs font-normal uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
            <span>Campus Talent & Recruitment Directory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-medium tracking-tight leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
          >
            <EncryptedText
              text="My Professional Digital Profile"
              encryptedClassName="text-zinc-400"
              revealedClassName="text-white"
              revealDelayMs={95}
              flipDelayMs={45}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
          >
            Discover verified campus talent, review high-impact student projects, inspect accredited certifications, and download official resumes with zero sensitive data friction.
          </motion.p>

          {/* Interactive Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/15"
            >
              <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-zinc-200">
                <User className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-xl font-medium text-white block leading-none">{initialStudents.length}</span>
                <span className="text-xs text-zinc-400 font-normal">Active Profiles</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/15"
            >
              <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-zinc-200">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-xl font-medium text-white block leading-none">
                  {initialStudents.filter((s) => s.resumePath).length}
                </span>
                <span className="text-xs text-zinc-400 font-normal">Resumes Attached</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/15"
            >
              <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-zinc-200">
                <Code className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-xl font-medium text-white block leading-none">
                  {initialStudents.reduce((acc, s) => acc + (s.projects?.length || 0), 0)}
                </span>
                <span className="text-xs text-zinc-400 font-normal">Showcased Projects</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Animated Search & Filter Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between relative z-30"
        >
          {/* Animated Search Box */}
          <div className="relative w-full md:w-1/2 group">
            <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-200 transition-colors absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, skill (e.g. React, Python), or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/15 text-sm font-normal transition-all shadow-inner"
            />
          </div>

          {/* Dropdown Filters with CustomSelect */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <Filter className="w-4 h-4 text-zinc-300 shrink-0" />
              <CustomSelect
                value={selectedBranch}
                onChange={setSelectedBranch}
                fullWidth
                className="md:w-auto md:min-w-[180px]"
                options={branches.map((b) => ({
                  value: b,
                  label: b === 'All' ? 'All Departments' : b,
                }))}
              />
            </div>

            <div className="flex-1 md:flex-initial">
              <CustomSelect
                value={selectedYear}
                onChange={setSelectedYear}
                fullWidth
                className="md:w-auto md:min-w-[155px]"
                options={years.map((y) => ({
                  value: String(y),
                  label: y === 'All' ? 'All Batches' : `Class of ${y}`,
                }))}
              />
            </div>
          </div>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-white flex items-center gap-2.5 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            <span>Candidate Profiles</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-zinc-200 border border-white/15">
              {filteredStudents.length} candidate{filteredStudents.length === 1 ? '' : 's'}
            </span>
          </h2>

          <Link href="/submit">
            <motion.span
              whileHover={{ x: 3 }}
              className="text-xs font-normal text-zinc-300 hover:text-white flex items-center gap-1.5 transition drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
            >
              <span>Are you a student? Submit your profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </div>

        {/* Empty State vs Candidate Grid */}
        {initialStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl border border-white/15 p-12 sm:p-16 text-center space-y-5 max-w-xl mx-auto shadow-2xl relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/8 border border-white/15 flex items-center justify-center text-zinc-200 mx-auto shadow-lg animate-bounce">
              <User className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-medium text-white">No Student Profiles Yet</h3>
              <p className="text-sm text-zinc-400 font-normal leading-relaxed max-w-md mx-auto">
                The talent directory is currently fresh and ready for submissions. Students can enter their academic credentials, projects, certifications, and resumes.
              </p>
            </div>
            <Link href="/submit" className="inline-block">
              <IridescentButton size="md">Submit First Profile</IridescentButton>
            </Link>
          </motion.div>
        ) : filteredStudents.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/15 p-12 text-center space-y-3">
            <User className="w-12 h-12 text-zinc-500 mx-auto" />
            <h3 className="text-base font-medium text-zinc-100">No matching student profiles found</h3>
            <p className="text-sm text-zinc-400 font-normal max-w-md mx-auto">
              Try adjusting your search query or reset your filters to browse all students.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBranch('All');
                setSelectedYear('All');
              }}
              className="mt-2 text-xs font-normal text-zinc-300 hover:text-white underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredStudents.map((student, idx) => (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="glass-card rounded-3xl p-6 flex flex-col justify-between space-y-5 relative overflow-hidden group border border-white/12"
                >
                  <div className="space-y-4">
                    {/* Header: Name, Student ID, CGPA badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-lg text-white group-hover:text-zinc-200 transition tracking-tight">
                          {student.fullName}
                        </h3>
                        <p className="text-xs text-zinc-400 font-normal">
                          ID: <span className="text-zinc-300 font-normal">{student.studentId}</span>
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-zinc-100 border border-white/20 shadow-xs">
                        CGPA {student.cgpa.toFixed(2)}
                      </span>
                    </div>

                    {/* Academic Information */}
                    <div className="flex items-center gap-2 text-xs text-zinc-300 font-normal">
                      <GraduationCap className="w-4 h-4 text-zinc-300 shrink-0" />
                      <span className="line-clamp-1">
                        {student.degree} • {student.branch} ({student.graduationYear})
                      </span>
                    </div>

                    {/* Bio snippet */}
                    <p className="text-xs text-zinc-400 font-normal line-clamp-2 leading-relaxed">
                      {student.headlineBio}
                    </p>

                    {/* Skills pills */}
                    {student.skills && student.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {student.skills.slice(0, 4).map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-normal bg-zinc-900/90 text-zinc-200 border border-white/10"
                          >
                            {sk.name}
                          </span>
                        ))}
                        {student.skills.length > 4 && (
                          <span className="px-2 py-1 rounded-lg text-[11px] font-normal bg-white/10 text-zinc-200 border border-white/15">
                            +{student.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Badges: Projects & Certificates */}
                    <div className="flex items-center gap-4 text-xs text-zinc-400 font-normal pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-zinc-300" />
                        <span>{student.projects?.length || 0} Projects</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-zinc-300" />
                        <span>{student.certificates?.length || 0} Certificates</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Footer with Fluid Motion */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <Link href={`/profile/${student.id}`} className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full text-center py-2.5 px-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium shadow-md shadow-black/40 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>View Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.div>
                    </Link>

                    {student.resumePath ? (
                      <a
                        href={student.resumePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-white/15 bg-zinc-950 text-zinc-200 text-xs font-normal hover:bg-zinc-900 transition cursor-pointer"
                          title="View PDF Resume"
                        >
                          <FileText className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Resume</span>
                        </motion.div>
                      </a>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic py-2 px-2">No Resume</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
