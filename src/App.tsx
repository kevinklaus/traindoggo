import { useState, useCallback } from 'react';
import { Brain as Train, Dog, Globe, Mail, Linkedin, PawPrint } from 'lucide-react';
import type { Journey, SearchParams, DogMode } from './lib/types';
import { searchJourneys } from './lib/api';
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
  const s = size === 'large' ? 14 : 11;
  const iconSize = size === 'large' ? 24 : 20;
  const pawSize = size === 'large' ? 12 : 10;
  return (
    <div className={`relative flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 ${size === 'large' ? 'w-14 h-14' : 'w-11 h-11'}`}>
      <Train size={iconSize} className="text-white" />
      <PawPrint size={pawSize} className="text-accent absolute -bottom-0.5 -right-0.5 drop-shadow-sm" />
    </div>
  );
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 60" className="w-full block -mb-px" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,0 L0,0 Z"
        fill="#00017a"
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
    dogMode: 'none',
  });
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!params.from || !params.to) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const departure = `${params.date}T${params.time}:00+02:00`;
      const result = await searchJourneys(params.from.id, params.to.id, departure);
      setJourneys(result.journeys ?? []);
      if (!result.journeys?.length) {
        setError('No journeys found for this route and time.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setJourneys([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/[0.03] flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-heading leading-tight">
              Ticket to Tail
            </h1>
            <p className="text-[11px] text-slate-500 font-body leading-tight">
              Trains for you and your dog
            </p>
          </div>
          {params.dogMode !== 'none' && (
            <div className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium shrink-0" aria-live="polite">
              <Dog size={13} aria-hidden="true" />
              {params.dogMode === 'large' ? 'Large dog' : 'Small dog'}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 w-full flex-1">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <SearchForm
            params={params}
            onChange={setParams}
            onSearch={handleSearch}
            loading={loading}
          />
        </section>

        {searched && (
          <section>
            <JourneyResults
              journeys={journeys}
              dogMode={params.dogMode}
              loading={loading}
              error={error}
            />
          </section>
        )}

        {!searched && (
          <div className="text-center py-16 space-y-4">
            <div className="inline-flex items-center justify-center" aria-hidden="true">
              <LogoMark size="large" />
            </div>
            <div>
              <p className="text-slate-600 font-medium font-body">Search for German rail journeys</p>
              <p className="text-slate-400 text-sm mt-1 font-body">
                Enter your departure and destination stations to get started
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-body flex-wrap">
              <span className="flex items-center gap-1.5">
                <Dog size={14} aria-hidden="true" />
                Dog-friendly planning
              </span>
              <span>Real-time data</span>
              <span>Price estimates</span>
            </div>
          </div>
        )}
      </main>

      <WaveDivider />
      <footer className="bg-secondary text-white" role="contentinfo">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center gap-5">
            <PawPrint size={32} className="text-accent" aria-hidden="true" />
            <div>
              <p className="font-heading font-bold text-lg tracking-tight">Ticket to Tail</p>
              <p className="text-sm text-white/60 font-body mt-1 max-w-xs leading-relaxed">
                Find the best seat for you and your dog on German trains. Check carriage layouts, dog-friendly spots, and book with confidence.
              </p>
            </div>
            <p className="text-xs text-white/40 font-body">
              Built by Kevin Klaus
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://kevinklaus.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent/80 text-white transition-all hover:scale-110"
                aria-label="Visit kevinklaus.github.io"
              >
                <Globe size={18} />
              </a>
              <a
                href="mailto:kevintheklaus@gmail.com"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent/80 text-white transition-all hover:scale-110"
                aria-label="Email kevintheklaus@gmail.com"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://linkedin.com/in/kevinklaus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent/80 text-white transition-all hover:scale-110"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
