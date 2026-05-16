import React from 'react';

// ============================================================================
// SYSTEM DESIGN TOKENS
// ============================================================================
export const TOKENS = {
  inputs: {
    base: "w-full py-3 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm",
    iconPadding: "pl-10 pr-9",
  },
  buttons: {
    iconButton: "box-border h-12 w-12 shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-0 text-slate-500 hover:text-primary hover:border-primary/30 transition-all active:scale-95 disabled:opacity-50",
    dogChip: "p-3 rounded-xl border-2 text-center transition-all active:scale-[0.97] text-sm font-semibold",
    primarySubmit: "w-full min-h-[3.25rem] inline-flex items-center justify-center py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 font-heading",
  },
  layouts: {
    card: "bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden",
    popoverList: "absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto overflow-x-hidden",
  }
};

// ============================================================================
// ATOMIC COMPONENTS
// ============================================================================

export function Spinner({ className = 'h-5 w-5 text-primary' }: { className?: string }) {
  return (
    <svg className={`ttt-spinner ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export function IconButton({ children, className = '', ...props }: IconButtonProps) {
  return (
    <button type="button" className={`${TOKENS.buttons.iconButton} ${className}`} {...props}>
      {children}
    </button>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
  className?: string;
}
export function Badge({ children, style, title, className = '' }: BadgeProps) {
  return (
    <span
      title={title}
      className={`text-xs font-bold px-2 py-0.5 rounded-md truncate max-w-full block text-center ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}