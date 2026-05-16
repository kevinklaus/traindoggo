import React from 'react';

// ==========================================
// DESIGN STYLING TOKENS
// ==========================================
export const TOKENS = {
  card: "bg-white rounded-2xl border border-slate-200 shadow-sm",
  input: "w-full py-3 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm",
  iconButton: "box-border h-12 w-12 shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-0 text-slate-500 hover:text-primary hover:border-primary/30 transition-all active:scale-95 disabled:opacity-50"
};

// Shared Loading Spinner
export function Spinner({ className = 'h-5 w-5 text-primary' }: { className?: string }) {
  return (
    <svg className={`ttt-spinner ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// Unified Icon Button Wrapper
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export function IconButton({ children, className = '', ...props }: IconButtonProps) {
  return (
    <button type="button" className={`${TOKENS.iconButton} ${className}`} {...props}>
      {children}
    </button>
  );
}