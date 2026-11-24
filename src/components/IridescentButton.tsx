'use client';

import React from 'react';

interface IridescentButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function IridescentButton({
  children,
  size = 'sm',
  onClick,
  type = 'button',
  className = '',
}: IridescentButtonProps) {
  return (
    <div
      className={`iridescent-btn-wrapper iridescent-btn-wrapper--${size} ${className}`}
    >
      <div className="iridescent-light" />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '0s', animationDuration: '25s' }}
      />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '0.15s', animationDuration: '15.9s' }}
      />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '0.53s', animationDuration: '26.4s' }}
      />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '0.45s', animationDuration: '17.8s' }}
      />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '1.6s', animationDuration: '19.2s' }}
      />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '1.6s', animationDuration: '29.2s' }}
      />
      <div
        className="iridescent-gradient-layer"
        style={{ animationDelay: '1.6s', animationDuration: '20.2s' }}
      />
      <button type={type} onClick={onClick} className="iridescent-gradient-btn">
        {children}
      </button>
      <div className="iridescent-text-overlay">{children}</div>
    </div>
  );
}
