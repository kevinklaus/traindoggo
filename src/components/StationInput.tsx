import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X, AlertCircle, Locate } from 'lucide-react';
import type { Station } from '../lib/types';
import { searchStations } from '../lib/api';

interface Props {
  label: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  placeholder: string;
  id: string;
  showLocationButton?: boolean;
  onLocate?: () => void;
  locating?: boolean;
}

export default function StationInput({ label, value, onChange, placeholder, id, showLocationButton, onLocate, locating }: Props) {
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

  function clear() {
    onChange(null);
    setQuery('');
    setResults([]);
    setError(null);
  }

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            <MapPin size={18} />
          </span>
          <input
            id={id}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            placeholder={placeholder}
            aria-label={label}
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            role="combobox"
            className="w-full pl-10 pr-9 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body"
          />
          {query && !loading && (
            <button
              onClick={clear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={`Clear ${label}`}
            >
              <X size={16} />
            </button>
          )}
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Loading">
              <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          )}
        </div>
        {showLocationButton && onLocate && (
          <button
            type="button"
            onClick={onLocate}
            disabled={locating}
            className="shrink-0 p-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/30 transition-all active:scale-95 disabled:opacity-50"
            aria-label="Use my location"
            title="Find nearby stations"
          >
            {locating ? (
              <svg className="animate-spin h-[18px] w-[18px] text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Locate size={18} />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {open && results.length > 0 && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto"
        >
          {results.map((s) => (
            <li key={s.id} role="option" aria-selected={false}>
              <button
                onClick={() => select(s)}
                className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors text-sm text-slate-700 flex items-center gap-2"
              >
                <MapPin size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
