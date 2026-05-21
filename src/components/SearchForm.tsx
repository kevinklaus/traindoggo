import { useState } from 'react';
import { ArrowDownUp, Dog } from 'lucide-react';
import type { SearchParams, DogMode } from '../lib/types';
// import { searchStationsByCoords } from '../lib/api'; // <-- 1. Auskommentiert
import StationInput from './ui/StationInput';
import DateTimeInput from './ui/DateTimeInput';
import { Spinner, TOKENS, IconButton } from './ui/Primitives';

interface Props {
  params: SearchParams;
  onChange: (params: SearchParams) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchForm({ params, onChange, onSearch, loading }: Props) {
  const [shaking, setShaking] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  // const [locating, setLocating] = useState(false); // <-- 2. Auskommentiert
  const today = new Date().toISOString().split('T')[0];

  const dogModes: { key: DogMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: 'none', label: 'No dog', desc: 'Standard ticket', icon: null },
    { key: 'small', label: 'Small dog', desc: 'Free in carrier', icon: <Dog size={14} /> },
    { key: 'large', label: 'Large dog', desc: 'Dog ticket required', icon: <Dog size={16} /> },
  ];

  /* 3. Funktion komplett auskommentiert
  async function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const stations = await searchStationsByCoords(pos.coords.latitude, pos.coords.longitude);
          if (stations.length > 0) onChange({ ...params, from: stations[0] });
        } catch { } finally { setLocating(false); }
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }
  */

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!params.from || !params.to) {
      setShaking(true);
      setValidationMsg(
        !params.from && !params.to
          ? 'Please select departure and destination stations'
          : !params.from ? 'Please select a departure station' : 'Please select a destination station'
      );
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setValidationMsg(null);
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* 1. Station Routing Setup Block */}
      <div className="space-y-3">
        <StationInput
          id="station-from"
          label="From"
          value={params.from}
          onChange={(s) => onChange({ ...params, from: s })}
          placeholder="z. B. München Hbf"
          // showLocationButton       // <-- 4. Auskommentiert
          // onLocate={handleLocate}  // <-- 4. Auskommentiert
          // locating={locating}      // <-- 4. Auskommentiert
        />

        <div className="flex gap-1.5 items-start">
          <div className="flex-1 min-w-0">
            <StationInput
              id="station-to"
              label="To"
              value={params.to}
              onChange={(s) => onChange({ ...params, to: s })}
              placeholder="z. B. Berlin Hbf"
            />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="block text-xs font-semibold opacity-0 select-none mb-1.5" aria-hidden="true">
              &nbsp;
            </span>
            <IconButton 
              onClick={() => onChange({ ...params, from: params.to, to: params.from })} 
              aria-label="Swap departure and destination" 
              title="Swap direction"
            >
              <ArrowDownUp size={18} strokeWidth={2.25} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* 2. Temporal Configuration Grid */}
      <div className="grid grid-cols-2 gap-3 min-w-0">
        <DateTimeInput
          id="search-date"
          label="Date"
          iconType="date"
          value={params.date}
          min={today}
          onChange={(e) => onChange({ ...params, date: e.target.value })}
          onClick={(e) => 'showPicker' in e.currentTarget && e.currentTarget.showPicker()}
        />
        <DateTimeInput
          id="search-time"
          label="Time"
          iconType="time"
          step={60}
          value={params.time}
          onChange={(e) => onChange({ ...params, time: e.target.value })}
          onClick={(e) => 'showPicker' in e.currentTarget && e.currentTarget.showPicker()}
        />
      </div>

      {/* 3. Dog Logistics Parameter Matrices */}
{/*       <div>
        <span className="block text-xs font-semibold text-slate-600 tracking-wide mb-2 select-none">
          Dog logistics
        </span>
        <div className="grid grid-cols-3 gap-2">
          {dogModes.map(({ key, label, desc, icon }) => {
            const isActive = params.dogMode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ ...params, dogMode: key })}
                className={`${TOKENS.buttons.dogChip} ${
                  isActive 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
                aria-pressed={isActive}
                aria-label={`${label}: ${desc}`}
              >
                {icon && <span className="flex justify-center mb-1 text-current">{icon}</span>}
                <div className="font-semibold">{label}</div>
                <div className="text-xs mt-0.5 opacity-70 font-normal">{desc}</div>
              </button>
            );
          })}
        </div>
      </div> */}

      {validationMsg && (
        <div className="text-sm text-red-600 font-medium" role="alert" aria-live="polite">
          {validationMsg}
        </div>
      )}

      {/* 4. Action Request Execution Trigger */}
      <button 
        type="submit" 
        className={`${TOKENS.buttons.primarySubmit} ${shaking ? 'animate-shake' : ''}`} 
        aria-label="Search journeys"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2.5">
            <Spinner className="h-4 w-4 text-white" />
            <span>Searching…</span>
          </span>
        ) : (
          'Search journeys'
        )}
      </button>
    </form>
  );
}