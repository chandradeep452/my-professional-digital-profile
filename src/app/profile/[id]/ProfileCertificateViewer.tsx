'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certificate } from '@/types';
import { Award, ExternalLink, Eye, X } from 'lucide-react';

interface Props {
  certificates: Certificate[];
}

export default function ProfileCertificateViewer({ certificates }: Props) {
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string } | null>(null);

  if (certificates.length === 0) {
    return <p className="text-xs text-zinc-400 italic font-normal">No certificates attached.</p>;
  }

  const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl bg-black/60 border border-white/12 flex flex-col justify-between space-y-4 hover:border-white/35 hover:shadow-lg hover:shadow-white/5 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="p-2.5 rounded-xl bg-white/10 text-zinc-100 border border-white/15 inline-block shadow-xs">
                  <Award className="w-4.5 h-4.5" />
                </span>
                {cert.issueDate && (
                  <span className="text-[11px] font-normal text-zinc-400 px-2 py-0.5 rounded-md bg-zinc-900">
                    {cert.issueDate}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-medium text-white group-hover:text-zinc-200 transition leading-snug">
                {cert.title}
              </h3>
              <p className="text-xs text-zinc-400 font-normal">{cert.issuingOrg}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-200 hover:text-white transition"
                >
                  <span>Verify Online</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {cert.filePath ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDoc({ url: cert.filePath!, title: cert.title })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-100 text-xs font-normal border border-white/20 transition cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Doc</span>
                </motion.button>
              ) : (
                <span className="text-[10px] text-zinc-500 italic font-normal">No document</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Modal Dialog */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-zinc-950 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/15"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-zinc-200" />
                  <h3 className="font-medium text-white text-sm sm:text-base truncate max-w-lg">
                    {selectedDoc.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-xs font-normal text-zinc-300 hover:text-white transition"
                  >
                    Open in New Tab
                  </a>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDoc(null)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 flex-1 overflow-auto bg-black/75 flex items-center justify-center min-h-[420px]">
                {isPdf(selectedDoc.url) ? (
                  <iframe
                    src={selectedDoc.url}
                    title="Certificate Document"
                    className="w-full h-[65vh] rounded-2xl border border-white/15 bg-white"
                  />
                ) : (
                  <img
                    src={selectedDoc.url}
                    alt={selectedDoc.title}
                    className="max-h-[70vh] max-w-full rounded-2xl shadow-xl object-contain"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
