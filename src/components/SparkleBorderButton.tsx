'use client';

import React from 'react';

interface SparkleBorderButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  as?: 'button' | 'span';
  className?: string;
}

export default function SparkleBorderButton({
  children,
  size = 'sm',
  onClick,
  type = 'button',
  as = 'button',
  className = '',
}: SparkleBorderButtonProps) {
  const classes = `sparkle-border-btn sparkle-border-btn--${size} ${className}`;

  if (as === 'span') {
    return (
      <span onClick={onClick} className={classes}>
        <span>{children}</span>
      </span>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      <span>{children}</span>
    </button>
  );
}
