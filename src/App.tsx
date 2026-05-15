import { useState, useCallback, useEffect } from 'react';
import { Dog, Github, Mail, Linkedin, TrainFront } from 'lucide-react';
import type { Journey, SearchParams } from './lib/types';
import { searchJourneys, setMockApiMode } from './lib/api';
import SearchForm from './components/SearchForm';
import JourneyResults from './components/JourneyResults';

function getDefaultDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function LogoMark({ size = 'default' }: { size?: 'default' | 'large' }) {
  const wrap = size === 'large' ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl';
  const iconSize = size === 'large' ? 34 : 26;
  return (
    <div
      className={`relative flex items-center justify-center bg-primary shadow-lg shadow-primary/25 ${wrap}`}
      aria-hidden="true"
    >
      <TrainFront size={iconSize} className="text-white" strokeWidth={2} />
    </div>
  );
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 72" className="w-full block h-12 sm:h-16 -mb-px text-secondary" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        transform="translate(0 72) scale(1 -1)"
        d="M0,48 C240,72 480,24 720,48 C960,72 1200,24 1440,52 L1440,0 L0,0 Z"
      />
    </svg>
  );
}

export default function App() {
  const [params, setParams] = useState<SearchParams>({
    from: null,
    to: null,
    date: getDefaultDate(),
    time: getDefaultTime(),
    dogMode: 'large',
  });
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [useMockApi, setUseMockApi] = useState(import.meta.env.VITE_USE_MOCK_API === 'true');
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    setMockApiMode(useMockApi);
  }, [useMockApi]);

  const handleSearch = useCallback(async () => {
    if (!params.from || !params.to) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // v6 accepts local wall time without a fixed offset (avoids wrong DST vs hardcoded +02:00).
      const departure = `${params.date}T${params.time}:00`;
      const result = await searchJourneys(params.from.id, params.to.id, departure);
      setJourneys(result.journeys ?? []);
      if (!result.journeys?.length) {
        setError('No journeys found for this route and time.');
      }
      setApiUnavailable(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed. Please try again.';
      setError(message);
      setJourneys([]);
      setApiUnavailable(!useMockApi);
    } finally {
      setLoading(false);
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/[0.03] flex flex-col">
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 min-w-0">
          <LogoMark />
          <div className="min-w-0 flex-1">
            <h1 className="text-[clamp(1.05rem,4vw,1.35rem)] font-bold text-slate-900 tracking-tight font-heading leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Ticket to Tail
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-body leading-snug mt-0.5">
              Trains for you and your dog
            </p>
          </div>
          {params.dogMode !== 'none' && (
            <div
              className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 whitespace-nowrap"
              aria-live="polite"
            >
              <Dog size={13} aria-hidden="true" />
              {params.dogMode === 'large' ? 'Large dog' : 'Small dog'}
            </div>
          )}
        </div>
      </header>

      {apiUnavailable && !useMockApi && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium">
              Live timetable API unavailable. Enable offline mock mode to continue testing without network access.
            </p>
            <button
              type="button"
              onClick={() => setUseMockApi(true)}
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-200/60 hover:bg-amber-700 transition-all"
            >
              Enable offline mock mode
            </button>
          </div>
        </div>
      )}

      {useMockApi && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-100 text-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium">Offline mock mode is active. Live timetable API calls are disabled.</p>
            <button
              type="button"
              onClick={() => setUseMockApi(false)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Switch back to live mode
            </button>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 w-full flex-1 min-w-0">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <SearchForm params={params} onChange={setParams} onSearch={handleSearch} loading={loading} />
        </section>

        {searched && (
          <section>
            <JourneyResults journeys={journeys} dogMode={params.dogMode} loading={loading} error={error} />
          </section>
        )}

        {!searched && (
          <div className="text-center py-16 space-y-4 px-1">
            <div className="inline-flex items-center justify-center" aria-hidden="true">
              <LogoMark size="large" />
            </div>
            <div>
              <p className="text-slate-600 font-medium font-body">Plan a journey with your dog in mind</p>
              <p className="text-slate-400 text-sm mt-1 font-body max-w-md mx-auto">
                Pick stations, then review legs, example carriage layouts, and dog-friendly Großraum areas before you reserve.
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-body flex-wrap">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Dog size={14} aria-hidden="true" />
                Dog-first planning
              </span>
              <span className="whitespace-nowrap">Live timetable data</span>
            </div>
          </div>
        )}
      </main>

      <WaveDivider />
      <footer className="bg-secondary text-white relative" role="contentinfo">
        <div className="max-w-3xl mx-auto px-4 pt-2 pb-10">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center justify-center rounded-2xl bg-white/10 border border-white/15 p-4" aria-hidden="true">
              <TrainFront size={52} className="text-white" strokeWidth={1.75} />
            </div>
            <div className="space-y-2 max-w-md">
              <p className="font-heading font-bold text-xl tracking-tight text-white">Ticket to Tail</p>
              <p className="text-sm text-white/85 font-body leading-relaxed">
                Find a comfortable seat for you and your dog, peek at example carriage layouts, then reserve the space that works for both of you.
              </p>
            </div>
            <p className="text-sm font-semibold text-white/95 font-heading">Kevin Klaus</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/kevinklaus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15"
                aria-label="Kevin Klaus on GitHub"
              >
                <Github size={22} strokeWidth={2} />
              </a>
              <a
                href="mailto:kevintheklaus@gmail.com"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15"
                aria-label="Email Kevin Klaus"
              >
                <Mail size={22} strokeWidth={2} />
              </a>
              <a
                href="https://www.linkedin.com/in/kevinklaus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/12 hover:bg-white/22 text-white transition-all hover:scale-105 border border-white/15"
                aria-label="Kevin Klaus on LinkedIn"
              >
                <Linkedin size={22} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
