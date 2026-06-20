import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X, Locate } from 'lucide-react';
import type { Station } from '../../lib/types';
import { searchStations } from '../../lib/api';
import { Spinner, TOKENS, IconButton } from './Primitives';
import Input from './Input';
import ErrorDiagnostics from '../JourneySearch/ErrorDiagnostics';

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
  const [errorConfig, setErrorConfig] = useState<{ msg: string; status: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const wrapRef = useRef<HTMLDivElement>(null);
  
  /** Hält die Referenz zum aktuellen API-Request, um ihn bei Bedarf abzubrechen */
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const openDropdown = () => {
    const event = new CustomEvent('close-other-dropdowns', { detail: { id } });
    document.dispatchEvent(event);
    setOpen(true);
  };

  useEffect(() => {
    const handleCloseOthers = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.id !== id) {
        setOpen(false);
      }
    };
    document.addEventListener('close-other-dropdowns', handleCloseOthers);
    return () => document.removeEventListener('close-other-dropdowns', handleCloseOthers);
  }, [id]);

  const search = useCallback((q: string) => {
    clearTimeout(timer.current);

    if (value && value.name === q) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      setErrorConfig(null);
      return;
    }

    timer.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setErrorConfig(null);

      try {
        const stations = await searchStations(q, controller.signal);
        setResults(stations);
        setErrorConfig(null);
        openDropdown();
      } catch (err: any) {
        /** Verhindert Error-Handling bei absichtlich abgebrochenen Requests */
        if (err.name === 'AbortError') {
          return;
        }

        setResults([]);
        setErrorConfig({ msg: 'Deutsche Bahn lookup engine currently down', status: 503 });
        openDropdown();
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

  }, [id, value]);

  function handleInput(q: string) {
    setQuery(q);
    onChange(null);
    search(q);
  }

  function select(s: Station) {
    onChange(s);
    setQuery(s.name);
    setResults([]);
    setOpen(false);
    setErrorConfig(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          select(results[activeIndex]);
        } else if (results.length > 0) {
          select(results[0]);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <Input
        id={id}
        label={label}
        leftIcon={<MapPin size={18} />}
        rightElement={
          <>
            {query && !loading && (
              <button
                type="button"
                onClick={() => { onChange(null); setQuery(''); setResults([]); setErrorConfig(null); }}
                className="text-slate-500 hover:text-accent transition-colors py-3 pl-2"
                aria-label={`Clear ${label}`}
              >
                <X size={16} />
              </button>
            )}
            {loading && <Spinner className="h-4 w-4" />}
          </>
        }
        actionButton={showLocationButton && onLocate ? (
          <IconButton onClick={onLocate} disabled={locating}>
            {locating ? <Spinner className="h-[18px] w-[18px]" /> : <Locate size={18} />}
          </IconButton>
        ) : undefined}
        error={null}
      >
        <input
          id={id}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0 || errorConfig) openDropdown(); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          className={`${TOKENS.inputs.base} ${TOKENS.inputs.iconPadding}`}
        />
      </Input>

      {open && (results.length > 0 || errorConfig) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-none">
          {errorConfig ? (
            <div className="p-3 bg-white">
              <ErrorDiagnostics
                message={errorConfig.msg}
                statusCode={errorConfig.status}
                upstreamUrl={`https://v6.db.transport.rest/locations?query=${encodeURIComponent(query)}`}
                onRetry={() => search(query)}
              />
            </div>
          ) : (
            <ul id={`${id}-listbox`} role="listbox" className="max-h-64 overflow-y-auto">
              {results.map((s, i) => {
                const isHighlighted = i === activeIndex;
                return (
                  <li key={s.id} id={`${id}-option-${i}`} role="option" aria-selected={isHighlighted}>
                    <button
                      type="button"
                      onClick={() => select(s)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left px-4 py-2.5 transition-colors text-sm flex items-center gap-2 font-body ${
                        isHighlighted ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700 hover:bg-primary/5'
                      }`}
                    >
                      <MapPin size={14} className={isHighlighted ? 'text-primary' : 'text-slate-400 shrink-0'} />
                      <span className="truncate">{s.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}