import { Dog, Route } from 'lucide-react';
import type { DogMode } from '../../lib/types';

export function LogoMark({ size = 'default' }: { size?: 'default' | 'large' }) {
  const wrap = size === 'large' ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl';
  const iconSize = size === 'large' ? 34 : 26;
  return (
    <div
      className={`relative flex items-center justify-center bg-primary shadow-lg shadow-primary/25 ${wrap}`}
      aria-hidden="true"
    >
      <Route size={iconSize} className="text-white" strokeWidth={2} />
    </div>
  );
}

interface Props {
  dogMode: DogMode;
  onLogoClick?: () => void;
}

export default function Header({ dogMode, onLogoClick }: Props) {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 h-[73px] flex items-center">
      <div className="max-w-3xl mx-auto px-4 w-full flex items-center gap-3 min-w-0">
        <button onClick={onLogoClick} className="hover:opacity-90 transition-opacity flex items-center gap-3 text-left">
          <LogoMark />
          <div className="min-w-0 flex-1">
            <h1 className="text-[clamp(1.05rem,4vw,1.35rem)] font-bold text-slate-900 tracking-tight font-heading leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Train Doggo
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-body leading-snug mt-0.5 hidden sm:block">
              Trains for you and your dog
            </p>
          </div>
        </button>
        {dogMode !== 'none' && (
          <div
            className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 whitespace-nowrap"
            aria-live="polite"
          >
            <Dog size={13} aria-hidden="true" />
            {dogMode === 'large' ? 'Large dog' : 'Small dog'}
          </div>
        )}
      </div>
    </header>
  );
}