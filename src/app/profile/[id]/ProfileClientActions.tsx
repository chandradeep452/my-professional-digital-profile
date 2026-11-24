'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, FileText } from 'lucide-react';

interface Props {
  resumePath?: string;
  institutionalEmail?: string;
  fullName: string;
}

export default function ProfileClientActions({ resumePath, institutionalEmail, fullName }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
      {resumePath ? (
        <a
          href={resumePath}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 24px rgba(255, 255, 255, 0.25)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium shadow-lg shadow-black/40 border border-white/40 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume (PDF)</span>
          </motion.div>
        </a>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 text-zinc-500 text-sm font-normal cursor-not-allowed border border-white/10"
        >
          <FileText className="w-4 h-4" />
          <span>Resume Not Uploaded</span>
        </button>
      )}

      {institutionalEmail && (
        <a
          href={`mailto:${institutionalEmail}?subject=Recruiter Inquiry: ${encodeURIComponent(fullName)}`}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl border border-white/15 bg-zinc-950 hover:bg-zinc-900 text-zinc-100 text-sm font-normal shadow-md transition cursor-pointer"
          >
            <Mail className="w-4 h-4 text-zinc-300" />
            <span>Contact via Email</span>
          </motion.div>
        </a>
      )}
    </div>
  );
}
