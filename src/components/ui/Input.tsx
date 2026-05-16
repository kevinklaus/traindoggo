import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TOKENS } from './Primitives';

interface InputProps {
  id: string;
  label: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  actionButton?: React.ReactNode;
  error?: string | null;
  children: React.ReactNode;
}

export default function Input({
  id,
  label,
  leftIcon,
  rightElement,
  actionButton,
  error,
  children,
}: InputProps) {
  return (
    <div className="w-full min-w-0">
      {/* 1. Standardized Structural Form Header */}
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 tracking-wide mb-1.5 select-none">
        {label}
      </label>

      {/* 2. Interactive Input Component Wrapper Layout */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0 group">
          {/* Absolute Left-Aligned Icon Overlay */}
          {leftIcon && (
            <span 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors pointer-events-none z-10" 
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {/* Primitive Field Elements (Passed dynamically by specialized sub-components) */}
          {children}

          {/* Absolute Right-Aligned Clear Controls / Loading Spinners */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center gap-1.5">
              {rightElement}
            </div>
          )}
        </div>

        {/* Optional Context Action Block (e.g., GPS Locate Element) */}
        {actionButton && (
          <div className="shrink-0 flex items-center">
            {actionButton}
          </div>
        )}
      </div>

      {/* 3. Universal Realtime Validation Diagnostics Error Message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium select-none animate-fade-in" role="alert">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}