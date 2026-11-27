'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Lock,
  Mail,
  User,
  Building2,
  Hash,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserRole } from '@/types';
import SparkleBorderButton from './SparkleBorderButton';

interface AuthPortalClientProps {
  initialRole?: UserRole;
  embedded?: boolean;
}

export default function AuthPortalClient({
  initialRole = 'recruiter',
  embedded = false,
}: AuthPortalClientProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleSwitch = (nextRole: UserRole) => {
    setRole(nextRole);
    setErrorMsg(null);
  };

  const handleModeSwitch = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: identifier.trim(),
            password,
            role,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Sign in failed');
        }

        router.push('/');
        router.refresh();
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role,
            fullName: fullName.trim(),
            email: identifier.trim(),
            password,
            companyName: role === 'recruiter' ? companyName.trim() : undefined,
            studentId: role === 'student' ? studentId.trim().toUpperCase() : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Account creation failed');
        }

        router.push(role === 'recruiter' ? '/' : '/submit?from=home');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.045] backdrop-blur-md border border-white/15 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:bg-white/[0.075] focus:border-white/40 focus:ring-2 focus:ring-white/15 text-sm font-normal transition';

  return (
    <div className={embedded ? 'w-full max-w-lg mx-auto px-4 pb-16' : 'min-h-[82vh] flex items-center justify-center px-4 py-12'}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg glass-card rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/15 text-zinc-200 text-xs font-normal">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>{role === 'recruiter' ? 'Recruiter Access' : 'Student Access'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            {mode === 'login'
              ? role === 'recruiter'
                ? 'Recruiter Sign In'
                : 'Student Sign In'
              : role === 'recruiter'
              ? 'Create Recruiter Account'
              : 'Create Student Account'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal">
            {role === 'recruiter'
              ? 'Sign in to browse verified student profiles, projects, certificates, and resumes.'
              : 'Sign in to publish, edit, or manage your professional digital profile.'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/80 border border-white/10">
          <button
            type="button"
            onClick={() => handleRoleSwitch('recruiter')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-normal transition cursor-pointer ${
              role === 'recruiter'
                ? 'bg-white/12 text-white border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruiter</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('student')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-normal transition cursor-pointer ${
              role === 'student'
                ? 'bg-white/12 text-white border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
        </div>

        {/* Sign In / Register Switch */}
        <div className="flex items-center justify-center gap-6 border-b border-white/10 pb-3 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`pb-1 transition cursor-pointer border-b-2 ${
              mode === 'login'
                ? 'text-white border-white font-medium'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 font-normal'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`pb-1 transition cursor-pointer border-b-2 ${
              mode === 'register'
                ? 'text-white border-white font-medium'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 font-normal'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-xl bg-red-950/75 border border-red-700/50 flex items-center gap-2.5 text-red-200 text-xs sm:text-sm font-normal"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'recruiter' ? 'e.g. Ananya Rao' : 'e.g. Rushita Jalla'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {role === 'recruiter' ? (
                <div>
                  <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Acme Tech Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
                    Student ID / Roll Number *
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 22CS101"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
              {mode === 'login' && role === 'student'
                ? 'Institutional Email or Student ID *'
                : role === 'recruiter'
                ? 'Work Email *'
                : 'Institutional Email *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={mode === 'login' && role === 'student' ? 'text' : 'email'}
                required
                placeholder={
                  mode === 'login' && role === 'student'
                    ? 'rushita.j@college.edu or 22CS101'
                    : role === 'recruiter'
                    ? 'recruiter@company.com'
                    : 'rushita.j@college.edu'
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-normal text-zinc-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <SparkleBorderButton type="submit" size="md" className="w-full">
              {loading
                ? mode === 'login'
                  ? 'Signing In...'
                  : 'Creating Account...'
                : mode === 'login'
                ? role === 'recruiter'
                  ? 'Sign In to Recruiter Portal'
                  : 'Sign In to Student Profile'
                : role === 'recruiter'
                ? 'Register as Recruiter'
                : 'Register & Build Profile'}
            </SparkleBorderButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
