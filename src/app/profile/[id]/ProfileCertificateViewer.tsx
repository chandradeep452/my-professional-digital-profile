'use client';

import React, { useState } from 'react';
import { Certificate } from '@/types';
import { Award, ExternalLink, Eye, X, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  certificates: Certificate[];
}

export default function ProfileCertificateViewer({ certificates }: Props) {
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string } | null>(null);

  if (certificates.length === 0) {
    return <p className="text-xs text-slate-400 italic">No certificates attached.</p>;
  }

  const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-indigo-300 transition"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 inline-block">
                  <Award className="w-4 h-4" />
                </span>
                {cert.issueDate && (
                  <span className="text-[10px] font-semibold text-slate-500">
                    {cert.issueDate}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{cert.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{cert.issuingOrg}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Verify Online</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {cert.filePath ? (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: cert.filePath!, title: cert.title })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Doc</span>
                </button>
              ) : (
                <span className="text-[10px] text-slate-400">Doc not attached</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Certificate Document: {selectedDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Open in New Tab
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-auto bg-slate-100 flex items-center justify-center min-h-[400px]">
              {isPdf(selectedDoc.url) ? (
                <iframe
                  src={selectedDoc.url}
                  title="Certificate PDF Preview"
                  className="w-full h-[65vh] rounded-lg border border-slate-300 bg-white"
                />
              ) : (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.title}
                  className="max-h-[70vh] max-w-full rounded-lg shadow-sm object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
