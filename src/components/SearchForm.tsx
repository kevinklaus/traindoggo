import { useState } from 'react';
import { ArrowDownUp, Dog } from 'lucide-react';
import type { SearchParams, Station, DogMode } from '../lib/types';
import { searchStationsByCoords } from '../lib/api';
import StationInput from './StationInput';

interface Props {
  params: SearchParams;
  onChange: (params: SearchParams) => void;
  onSearch: () => void;
  loading: boolean;
}

function SpinnerIcon({ className = 'h-4 w-4 text-white' }: { className?: string }) {
  return (
    <svg className={`ttt-spinner ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function SearchForm({ params, onChange, onSearch, loading }: Props) {
  const [shaking, setShaking] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  function swap() {
    onChange({ ...params, from: params.to, to: params.from });
  }

  function setDog(mode: DogMode) {
    onChange({ ...params, dogMode: mode });
  }

  async function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const stations = await searchStationsByCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          if (stations.length > 0) {
            onChange({ ...params, from: stations[0] });
          }
        } catch {
          // silently fail
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!params.from || !params.to) {
      setShaking(true);
      setValidationMsg(
        !params.from && !params.to
          ? 'Please select departure and destination stations'
          : !params.from
            ? 'Please select a departure station'
            : 'Please select a destination station'
      );
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setValidationMsg(null);
    onSearch();
  }

  const dogModes: { key: DogMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: 'none', label: 'No dog', desc: 'Standard ticket', icon: null },
    { key: 'small', label: 'Small dog', desc: 'Free in carrier', icon: <Dog size={14} /> },
    { key: 'large', label: 'Large dog', desc: 'Dog ticket required', icon: <Dog size={16} /> },
  ];

  const m3Field =
    'w-full min-w-0 py-3 px-3 rounded-t-xl bg-slate-100/90 border-0 border-b-2 border-slate-400/80 text-slate-900 font-body text-sm tracking-tight tabular-nums placeholder:text-slate-400/90 focus:outline-none focus:bg-violet-50/50 focus:border-primary transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-0">
        <div className="flex gap-2 items-stretch">
          <div className="flex-1 min-w-0">
            <StationInput
              id="station-from"
              label="From"
              value={params.from}
              onChange={(s: Station | null) => onChange({ ...params, from: s })}
              placeholder="z. B. München Hbf"
              showLocationButton
              onLocate={handleLocate}
              locating={locating}
            />
          </div>
        </div>

        <div className="flex justify-center py-1.5">
          <button
            type="button"
            onClick={swap}
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-slate-200 bg-white text-slate-500 shadow-sm hover:text-primary hover:border-primary/40 hover:bg-violet-50/40 transition-all active:scale-95"
            aria-label="Swap departure and destination"
            title="Swap direction"
          >
            <ArrowDownUp size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="flex gap-2 items-stretch">
          <div className="flex-1 min-w-0">
            <StationInput
              id="station-to"
              label="To"
              value={params.to}
              onChange={(s: Station | null) => onChange({ ...params, to: s })}
              placeholder="z. B. Berlin Hbf"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 min-w-0">
        <div className="min-w-0 w-full">
          <label htmlFor="search-date" className="block text-xs font-semibold text-slate-600 tracking-wide mb-1">
            Date
          </label>
          <input
            id="search-date"
            type="date"
            value={params.date}
            min={today}
            onChange={(e) => onChange({ ...params, date: e.target.value })}
            onClick={(e) => {
              const el = e.currentTarget;
              if ('showPicker' in el && typeof (el as HTMLInputElement & { showPicker: () => void }).showPicker === 'function') {
                (el as HTMLInputElement & { showPicker: () => void }).showPicker();
              }
            }}
            className={m3Field}
            autoComplete="off"
          />
        </div>
        <div className="min-w-0 w-full">
          <label htmlFor="search-time" className="block text-xs font-semibold text-slate-600 tracking-wide mb-1">
            Time
          </label>
          <input
            id="search-time"
            type="time"
            step={60}
            value={params.time}
            onChange={(e) => onChange({ ...params, time: e.target.value })}
            onClick={(e) => {
              const el = e.currentTarget;
              if ('showPicker' in el && typeof (el as HTMLInputElement & { showPicker: () => void }).showPicker === 'function') {
                (el as HTMLInputElement & { showPicker: () => void }).showPicker();
              }
            }}
            className={m3Field}
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <span className="block text-xs font-semibold text-slate-600 tracking-wide mb-2">
          Dog logistics
        </span>
        <div className="grid grid-cols-3 gap-2">
          {dogModes.map(({ key, label, desc, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setDog(key)}
              className={`p-3 rounded-xl border-2 text-center transition-all active:scale-[0.97] ${
                params.dogMode === key
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
              aria-pressed={params.dogMode === key}
              aria-label={`${label}: ${desc}`}
            >
              {icon && <span className="flex justify-center mb-1">{icon}</span>}
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-xs mt-0.5 opacity-70">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {validationMsg && (
        <div className="flex items-center gap-2 text-sm text-red-600 font-medium" role="alert" aria-live="polite">
          {validationMsg}
        </div>
      )}

      <button
        type="submit"
        className={`w-full min-h-[3.25rem] inline-flex items-center justify-center py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 font-heading ${shaking ? 'animate-shake' : ''}`}
        aria-label="Search journeys"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2.5">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden" aria-hidden="true">
              <SpinnerIcon />
            </span>
            <span>Searching…</span>
          </span>
        ) : (
          'Search journeys'
        )}
      </button>
    </form>
  );
}
