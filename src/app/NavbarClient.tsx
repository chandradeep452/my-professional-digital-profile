'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, LogOut } from 'lucide-react';
import { AuthUser } from '@/types';
import SparkleBorderButton from '@/components/SparkleBorderButton';

interface NavbarClientProps {
  initialUser: AuthUser | null;
}

export default function NavbarClient({ initialUser }: NavbarClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const currentProfileId = pathname?.startsWith('/profile/')
    ? pathname.replace('/profile/', '').split('/')[0]
    : null;
  const recruiterHref = initialUser?.role === 'recruiter' ? '/' : '/recruiter/login';
  const studentHref =
    initialUser?.role === 'student'
      ? currentProfileId
        ? `/submit?from=profile&profileId=${encodeURIComponent(currentProfileId)}`
        : '/submit?from=home'
      : '/student/login';
  const studentLabel = initialUser?.role === 'student' ? 'Edit Profile' : 'Student Portal';

  return (
    <header className="sticky top-0 z-50 bg-[#090a14]/45 backdrop-blur-2xl border-b border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo with Motion */}
        <Link href="/" className="flex items-center gap-3.5 group min-w-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-13 h-11 rounded-2xl bg-black overflow-hidden flex items-center justify-center shadow-lg shadow-white/10 border border-white/20 p-0.5 shrink-0"
          >
            <img
              src="/logo.jpg?v=2"
              alt="Professional Digital Profile Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div className="min-w-0">
            <span className="font-medium text-sm sm:text-lg text-zinc-100 group-hover:text-white transition tracking-tight flex items-center gap-1.5 truncate">
              <span className="truncate">Professional Digital Profile</span>
              <Sparkles className="w-3.5 h-3.5 text-zinc-300 opacity-85 shrink-0" />
            </span>
            <span className="hidden sm:block text-xs text-zinc-400 font-normal">
              Verified Campus Talent & Recruiter Directory
            </span>
          </div>
        </Link>

        {/* Action Navigation Buttons */}
        <nav className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <Link href={recruiterHref}>
            <SparkleBorderButton as="span" size="sm">Recruiter Portal</SparkleBorderButton>
          </Link>

          <Link href={studentHref}>
            <SparkleBorderButton as="span" size="sm">{studentLabel}</SparkleBorderButton>
          </Link>

          {initialUser && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              title={`Signed in as ${initialUser.fullName} (${initialUser.role})`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-zinc-950/90 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-normal transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
