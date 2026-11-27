'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  fullWidth?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = '',
  fullWidth = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${fullWidth ? 'w-full' : 'w-fit min-w-[165px]'} ${className}`}
    >
      {/* Selected Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-normal transition-all duration-300 cursor-pointer border backdrop-blur-md shadow-sm ${
          isOpen
            ? 'bg-white/[0.1] text-white border-white/35 shadow-md shadow-white/10'
            : 'bg-white/[0.045] text-zinc-100 border-white/15 hover:bg-white/[0.08]'
        }`}
      >
        <span className="truncate">{selectedOption?.label ?? 'Select'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className={`w-3 h-3 shrink-0 fill-zinc-300 transition-transform duration-300 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>

      {/* Hover-bridge wrapper */}
      <div
        className={`absolute left-0 right-0 top-full pt-1.5 z-50 transition-all duration-300 origin-top ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="rounded-xl p-1.5 bg-[#0a0c12]/80 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/95 flex flex-col gap-0.5 max-h-60 overflow-y-auto sky-scrollbar">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            if (isSelected) return null;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="w-full shrink-0 text-left px-3 py-2 rounded-lg text-sm font-normal text-zinc-200 bg-transparent hover:bg-white/15 hover:text-white transition-colors duration-200 cursor-pointer truncate"
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
