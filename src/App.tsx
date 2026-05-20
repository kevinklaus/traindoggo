import { useState, useCallback, useEffect, useRef } from 'react';
import type { Journey, SearchParams } from './lib/types';
import { searchJourneys, setMockApiMode } from './lib/api';
import { getDefaultDate, getDefaultTime } from './lib/helpers';
import { DEV_INITIAL_FROM, DEV_INITIAL_TO } from './lib/mockData';

import SearchForm from './components/SearchForm';
import JourneyResults from './components/JourneyResults';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DevBanners from './components/layout/DevBanners';
import LandingContent from './components/content/LandingContent';
import Imprint from './components/content/Imprint';

export default function App() {
  const isDev = import.meta.env.DEV;
  
  // 1. Initial State (Greift jetzt auf die helper und mockData zurück)
  const [params, setParams] = useState<SearchParams>({
    from: isDev ? DEV_INITIAL_FROM : null,
    to: isDev ? DEV_INITIAL_TO : null,
    date: getDefaultDate(),
    time: isDev ? '06:00' : getDefaultTime(),
    dogMode: 'large',
  });
  
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  const [useMockApi, setUseMockApi] = useState(isDev);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [showImprint, setShowImprint] = useState(false);

  const hasAutoSearched = useRef(false);

  // 2. API Modus synchronisieren
  useEffect(() => {
    setMockApiMode(useMockApi);
  }, [useMockApi]);

  // 3. Such-Logik
  const handleSearch = useCallback(async (searchParams = params) => {
    if (!searchParams.from || !searchParams.to) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const departure = `${searchParams.date}T${searchParams.time}:00`;
      const result = await searchJourneys(searchParams.from.id, searchParams.to.id, departure);
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
  }, [params, useMockApi]);

  // 4. Auto-Suche für Dev-Modus
  useEffect(() => {
    if (isDev && !hasAutoSearched.current) {
      hasAutoSearched.current = true;
      handleSearch(params); 
    }
  }, [isDev, handleSearch, params]);

  // 5. Layout (Extrem sauber, da Header, Footer und Banner ausgelagert sind)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/[0.03] flex flex-col">
      <Header dogMode={params.dogMode} onLogoClick={() => setSearched(false)} />
      
      <DevBanners 
        isDev={isDev} 
        apiUnavailable={apiUnavailable} 
        useMockApi={useMockApi} 
        setUseMockApi={setUseMockApi} 
      />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 min-w-0 min-h-[calc(100vh-73px)] flex flex-col justify-start">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 z-10 relative">
          <SearchForm params={params} onChange={setParams} onSearch={() => handleSearch(params)} loading={loading} />
        </section>

        {searched ? (
          <div className="mt-8">
            <JourneyResults journeys={journeys} dogMode={params.dogMode} loading={loading} error={error} />
          </div>
        ) : (
          <LandingContent />
        )}
      </main>

      <Footer onShowImprint={() => setShowImprint(true)} />
      
      {showImprint && <Imprint onClose={() => setShowImprint(false)} />}
    </div>
  );
}