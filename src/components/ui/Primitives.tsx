import { PawPrint } from 'lucide-react';
import React from 'react';

// ============================================================================
// SYSTEM DESIGN TOKENS
// ============================================================================
export const TOKENS = {
  inputs: {
    base: "w-full py-3 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm",
    iconPadding: "pl-9 pr-3 sm:pl-10 sm:pr-4",
    label: "block text-xs font-semibold text-slate-600 tracking-wide mb-1.5 select-none",
    error: "mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium select-none animate-fade-in"
  },
  buttons: {
    iconButton: "box-border h-12 w-12 shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-0 text-slate-500 hover:text-primary hover:border-primary/30 transition-all active:scale-[0.95] disabled:opacity-50",
    dogChip: "p-3 rounded-xl border-2 text-center transition-all active:scale-[0.97] text-sm font-semibold",
    primarySubmit: "w-full min-h-[3.25rem] inline-flex items-center justify-center py-3.5 bg-primary hover:bg-secondary text-white font-semibold rounded-xl transition-all active:scale-[0.98] font-heading",
  },
  layouts: {
    card: "bg-white rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden",
    popoverList: "absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto overflow-x-hidden",
  }
};


// ============================================================================
// ATOMIC COMPONENTS
// ============================================================================


// ============================================================================
// LOGO COMPONENT
// ============================================================================
export function LogoMark({ size = 'default' }: { size?: 'default' | 'large' }) {
  const wrap = size === 'large' ? 'w-16 h-16 rounded-full' : 'w-10 h-10 sm:w-10 sm:h-10 rounded-full';
  const iconSize = size === 'large' ? 36 : 22;
  return (
    <div
      className={`relative flex items-center justify-center bg-accent shrink-0 ${wrap}`}
      aria-hidden="true"
    >
      <PawPrint size={iconSize} className="text-white fill-white" strokeWidth={2} />
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
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

// ============================================================================
// CENTRALIZED TRANSPORT BRAND COLOR ENGINE
// ============================================================================
export interface LegThemeResult {
  badge: string;
  border: string;
  dot: string;
  bgHex: string;
  textHex: string;
}

export function getLegColorTheme(product?: string, name?: string, isWalking?: boolean): LegThemeResult {
  const prod = (product || '').toLowerCase();
  const trName = (name || '').toLowerCase();

  if (isWalking) {
    return {
      badge: 'bg-slate-100 text-slate-600',
      border: 'border-dashed border-slate-200',
      dot: 'border-slate-300 bg-slate-100',
      bgHex: '#f1f5f9',   // slate-100
      textHex: '#475569', // slate-600
    };
  }

  // ICE, IC, and EC long-distance line identifiers
  if (
    prod === 'ice' || 
    prod === 'ic' || 
    prod === 'ec' || 
    trName.startsWith('ice') || 
    trName.startsWith('ic') || 
    trName.startsWith('ec')
  ) {
    return {
      badge: 'bg-red-600 text-white',
      border: 'border-solid border-red-600/40',
      dot: 'border-red-600 bg-white shadow-sm',
      bgHex: '#dc2626',   // red-600
      textHex: '#ffffff',
    };
  }

  // FlixTrain / Flix lines explicitly
  if (trName.startsWith('flx')) {
    return {
      badge: 'bg-lime-500 text-slate-900 font-extrabold',
      border: 'border-solid border-lime-500/40',
      dot: 'border-lime-500 bg-white shadow-sm',
      bgHex: '#84cc16',   // lime-500
      textHex: '#0f172a', // slate-900
    };
  }

  // CHANGED: Standard Bus / SEV (Verkehrspurpur) isolated from green Flix items
  if (
    prod === 'bus' || 
    prod === 'sev' || 
    trName.startsWith('bus') || 
    trName.startsWith('sev')
  ) {
    return {
      badge: 'bg-purple-600 text-white',
      border: 'border-solid border-purple-600/40',
      dot: 'border-purple-600 bg-white shadow-sm',
      bgHex: '#9333ea',   // purple-600
      textHex: '#ffffff',
    };
  }
  
  // Regional networks (RE, RB, MEX, etc.)
  if (
    prod === 'regionalexpress' || 
    prod === 're' || 
    prod === 'nationalexpress' ||  
    prod === 'regional' || 
    prod === 'rb' || 
    trName.startsWith('rb') || 
    trName.startsWith('mex') || 
    trName.startsWith('re')  
  ) {
    return {
      badge: 'bg-blue-600 text-white',
      border: 'border-solid border-blue-600/40',
      dot: 'border-blue-600 bg-white shadow-sm',
      bgHex: '#2563eb',   // blue-600
      textHex: '#ffffff',
    };
  }
  
  if (prod === 'suburban' || prod === 's' || trName.startsWith('s ')) {
    return {
      badge: 'bg-emerald-600 text-white',
      border: 'border-solid border-emerald-600/40',
      dot: 'border-emerald-600 bg-white shadow-sm',
      bgHex: '#059669',   // emerald-600
      textHex: '#ffffff',
    };
  }

  if (prod === 'night' || prod === 'EN' || prod === 'NJ' || trName.includes('night') || trName.includes('sleeper')) {
    return {
      badge: 'bg-secondary text-white',
      border: 'border-solid border-secondary/40',
      dot: 'border-secondary bg-white shadow-sm',
      bgHex: '#00017a',  
      textHex: '#ffffff',
    };
  }

  return {
    badge: 'bg-slate-700 text-white',
    border: 'border-solid border-slate-300',
    dot: 'border-slate-500 bg-white shadow-sm',
    bgHex: '#334155',     // slate-700
    textHex: '#ffffff',
  };
}
