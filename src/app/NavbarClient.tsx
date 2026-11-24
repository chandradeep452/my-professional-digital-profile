'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import IridescentButton from '@/components/IridescentButton';

export default function NavbarClient() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Motion */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-11 h-11 rounded-2xl bg-black overflow-hidden flex items-center justify-center shadow-lg shadow-white/10 border border-white/20"
          >
            <img
              src="/logo.jpg"
              alt="My Professional Digital Profile Logo"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <span className="font-medium text-base sm:text-lg text-zinc-100 group-hover:text-white transition tracking-tight flex items-center gap-1.5">
              My Professional Digital Profile
              <Sparkles className="w-3.5 h-3.5 text-zinc-300 opacity-85" />
            </span>
            <span className="block text-xs text-zinc-400 font-normal">
              Verified Campus Talent & Recruiter Directory
            </span>
          </div>
        </Link>

        {/* Action Navigation Buttons */}
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link href="/">
            <IridescentButton size="sm">Recruiter Portal</IridescentButton>
          </Link>

          <Link href="/submit">
            <IridescentButton size="sm">Submit Profile</IridescentButton>
          </Link>
        </nav>
      </div>
    </header>
  );
}
