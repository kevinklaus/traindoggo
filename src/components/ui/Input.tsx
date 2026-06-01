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
      {/* Used global input label design token */}
      <label htmlFor={id} className={TOKENS.inputs.label}>
        {label}
      </label>

      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0 group">
          {leftIcon && (
            <span 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors pointer-events-none z-10" 
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {children}

          {rightElement && (
            <div className="absolute bg-white right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center gap-1.5">
              {rightElement}
            </div>
          )}
        </div>

        {actionButton && (
          <div className="shrink-0 flex items-center">
            {actionButton}
          </div>
        )}
      </div>

      {/* Used global input error diagnostics design token */}
      {error && (
        <p className={TOKENS.inputs.error} role="alert">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}