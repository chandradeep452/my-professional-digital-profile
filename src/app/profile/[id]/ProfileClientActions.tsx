'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Mail,
  FileText,
  Copy,
  Check,
  ExternalLink,
  X,
  Send,
} from 'lucide-react';

interface Props {
  resumePath?: string;
  institutionalEmail?: string;
  fullName: string;
}

export default function ProfileClientActions({
  resumePath,
  institutionalEmail,
  fullName,
}: Props) {
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState(`Interview / Recruitment Inquiry: ${fullName}`);
  const [message, setMessage] = useState(
    `Hi ${fullName},\n\nWe reviewed your Professional Digital Profile and would love to connect regarding an opportunity.`
  );

  const handleCopyEmail = async () => {
    if (!institutionalEmail) return;
    try {
      await navigator.clipboard.writeText(institutionalEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / restricted clipboard contexts
      const input = document.createElement('input');
      input.value = institutionalEmail;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mailtoHref = institutionalEmail
    ? `mailto:${institutionalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : '#';

  const gmailHref = institutionalEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(institutionalEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : '#';

  return (
    <>
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
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-zinc-100 text-sm font-normal shadow-md transition cursor-pointer"
          >
            <Mail className="w-4 h-4 text-zinc-300" />
            <span>Contact via Email</span>
          </motion.button>
        )}
      </div>

      {/* Contact Candidate Modal */}
      <AnimatePresence>
        {contactOpen && institutionalEmail && (
          <div
            onClick={() => setContactOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="glass-modal rounded-3xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between bg-white/[0.04]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4.5 h-4.5 text-sky-400 shrink-0" />
                  <h3 className="text-base font-medium text-white truncate">
                    Contact {fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setContactOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Direct Email & Copy */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 uppercase tracking-wider font-normal">
                    Student Email
                  </label>
                  <div className="flex items-center gap-2 p-2.5 pl-3.5 rounded-xl bg-black/75 border border-white/15">
                    <span className="text-sm text-zinc-100 font-normal truncate flex-1 select-all">
                      {institutionalEmail}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-100 text-xs font-normal transition cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 uppercase tracking-wider font-normal">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/75 border border-white/15 text-zinc-100 placeholder-zinc-500 text-sm font-normal focus:outline-none focus:border-white/40 transition"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 uppercase tracking-wider font-normal">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/75 border border-white/15 text-zinc-100 placeholder-zinc-500 text-sm font-normal focus:outline-none focus:border-white/40 transition resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={gmailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-normal transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Default Mail App</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
