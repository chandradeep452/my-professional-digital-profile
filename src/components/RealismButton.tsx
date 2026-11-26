'use client';

import React from 'react';

interface RealismButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  as?: 'button' | 'span';
  className?: string;
}

export default function RealismButton({
  children,
  size = 'sm',
  onClick,
  type = 'button',
  as = 'button',
  className = '',
}: RealismButtonProps) {
  const content = (
    <>
      <span className="realism-blob1" />
      <span className="realism-blob2" />
      <span className="realism-inner">{children}</span>
    </>
  );

  if (as === 'span') {
    return (
      <span
        onClick={onClick}
        className={`realism-btn realism-btn--${size} ${className}`}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`realism-btn realism-btn--${size} ${className}`}
    >
      {content}
    </button>
  );
}
