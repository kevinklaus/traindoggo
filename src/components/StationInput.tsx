import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X, AlertCircle, Locate } from 'lucide-react';
import type { Station } from '../lib/types';
import { searchStations } from '../lib/api';
import { Spinner, TOKENS, IconButton } from './ui/Primitives';

interface Props {
  label: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  placeholder: string;
  id: string;
  showLocationButton?: boolean;
  onLocate?: () => void;
  locating?: boolean;
  iconButtonClassName?: string;
}

export default function StationInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  showLocationButton,
  onLocate,
  locating,
}: Props) {
  const [query, setQuery] = useState(value?.name ?? '');
  const [results, setResults] = useState<Station[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = useCallback((q: string) => {
    clearTimeout(timer.current);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      setError(null);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const stations = await searchStations(q);
        setResults(stations);
        setOpen(stations.length > 0);
      } catch {
        setResults([]);
        setError('Search failed. Try again.');
      } finally {
        setLoading(false);
      }
    }, 150);
  }, []);

  function handleInput(q: string) {
    setQuery(q);
    onChange(null);
    search(q);
  }

  function select(s: Station) {
    onChange(s);
    setQuery(s.name);
    setOpen(false);
    setError(null);
  }

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true">
            <MapPin size={18} />
          </span>
          <input
            id={id}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            role="combobox"
            className={`${TOKENS.inputs.base} ${TOKENS.inputs.iconPadding}`}
          />
          {query && !loading && (
            <button
              type="button"
              onClick={() => { onChange(null); setQuery(''); setResults([]); setError(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={`Clear ${label}`}
            >
              <X size={16} />
            </button>
          )}
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden" aria-label="Loading">
              <Spinner className="h-4 w-4" />
            </span>
          )}
        </div>
        {showLocationButton && onLocate && (
          <IconButton onClick={onLocate} disabled={locating} aria-label="Use my location" title="Find nearby stations">
            {locating ? <Spinner className="h-[18px] w-[18px]" /> : <Locate size={18} />}
          </IconButton>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {open && results.length > 0 && (
        <ul id={`${id}-listbox`} role="listbox" className={TOKENS.layouts.popoverList}>
          {results.map((s) => (
            <li key={s.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => select(s)}
                className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors text-sm text-slate-700 flex items-center gap-2 min-w-0"
              >
                <MapPin size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap overflow-x-auto max-w-[85vw] sm:max-w-none min-w-0 font-body">{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}