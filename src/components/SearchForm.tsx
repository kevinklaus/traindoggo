import { useState } from 'react';
import { ArrowUpDown, Dog } from 'lucide-react';
import type { SearchParams, Station, DogMode } from '../lib/types';
import { searchStationsByCoords } from '../lib/api';
import StationInput from './StationInput';

interface Props {
  params: SearchParams;
  onChange: (params: SearchParams) => void;
  onSearch: () => void;
  loading: boolean;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-3">
        <div className="flex items-end gap-1.5">
          <div className="flex-1 min-w-0">
            <StationInput
              id="station-from"
              label="From"
              value={params.from}
              onChange={(s: Station | null) => onChange({ ...params, from: s })}
              placeholder="e.g. M\u00fcnchen Hbf"
              showLocationButton
              onLocate={handleLocate}
              locating={locating}
            />
          </div>
        </div>
        <div className="flex items-end gap-1.5">
          <div className="flex-1 min-w-0">
            <StationInput
              id="station-to"
              label="To"
              value={params.to}
              onChange={(s: Station | null) => onChange({ ...params, to: s })}
              placeholder="e.g. Berlin Hbf"
            />
          </div>
          <button
            type="button"
            onClick={swap}
            className="shrink-0 p-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
            aria-label="Swap departure and destination"
            title="Swap"
          >
            <ArrowUpDown size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <label htmlFor="search-date" className="block text-xs font-semibold text-slate-600 tracking-wide mb-1.5">
            Date
          </label>
          <div className="relative">
            <input
              id="search-date"
              type="date"
              value={params.date}
              min={today}
              onChange={(e) => onChange({ ...params, date: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border-0 border-b-2 border-slate-300 rounded-t-lg text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-body text-sm"
            />
          </div>
        </div>
        <div className="relative">
          <label htmlFor="search-time" className="block text-xs font-semibold text-slate-600 tracking-wide mb-1.5">
            Time
          </label>
          <div className="relative">
            <input
              id="search-time"
              type="time"
              value={params.time}
              onChange={(e) => onChange({ ...params, time: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border-0 border-b-2 border-slate-300 rounded-t-lg text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-body text-sm"
            />
          </div>
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
        className={`w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 font-heading ${shaking ? 'animate-shake' : ''}`}
        aria-label="Search journeys"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Searching...
          </span>
        ) : (
          'Search journeys'
        )}
      </button>
    </form>
  );
}
