'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PhotoLightboxModalProps {
  photo: { url: string; name: string; subtitle?: string } | null;
  onClose: () => void;
}

export default function PhotoLightboxModal({ photo, onClose }: PhotoLightboxModalProps) {
  return (
    <AnimatePresence>
      {photo && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-zinc-950 rounded-3xl w-full max-w-xl overflow-hidden border border-white/15 shadow-2xl"
          >
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{photo.name}</p>
                {photo.subtitle && (
                  <p className="text-[11px] text-zinc-400 font-normal truncate">{photo.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-normal text-zinc-300 hover:text-white transition"
                >
                  Open Original
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 bg-black/75 flex items-center justify-center">
              <img
                src={photo.url}
                alt={photo.name}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
