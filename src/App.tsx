import { useState, useCallback, useEffect } from 'react';
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
import RecommendedDays from './components/ui/RecommendedDays';

// Neue Content-Seiten importieren
import DoggoTips from './components/content/DoggoTips';
import NightTrains from './components/content/NightTrains';
import Destinations from './components/content/Destinations';

export type Page = 'home' | 'tips' | 'destinations' | 'nightTrains';

export default function App() {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const isDev = import.meta.env.VITE_USE_MOCK_API === 'true' && isLocalhost; 
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
  
  const [useMockApi, setUseMockApi] = useState(import.meta.env.VITE_USE_MOCK_API === 'true');
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [showImprint, setShowImprint] = useState(false);

  // State für das Page-Routing
  const [activePage, setActivePage] = useState<Page>('home');

  useEffect(() => {
    setMockApiMode(useMockApi);
  }, [useMockApi]);

  const handleSearch = useCallback(async (searchParams = params) => {
    if (!searchParams.from || !searchParams.to) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setActivePage('home'); // Springe zurück auf Home, wenn eine Suche gestartet wird

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

  // Handler für Klicks auf die neuen Datums-Tabs
  const handleDayChange = (newDateStr: string) => {
    const newParams = { ...params, date: newDateStr };
    setParams(newParams);
    handleSearch(newParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/[0.03] flex flex-col">
      <Header 
        dogMode={params.dogMode} 
        activePage={activePage} 
        onNavigate={setActivePage} 
        onLogoClick={() => { setActivePage('home'); setSearched(false); }} 
      />
      
      <DevBanners 
        isDev={isDev} 
        apiUnavailable={apiUnavailable} 
        useMockApi={useMockApi} 
        setUseMockApi={setUseMockApi} 
      />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 min-w-0 min-h-[calc(100vh-73px)] flex flex-col justify-start">
        
        {activePage === 'home' && (
          <>
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 z-10 relative">
              <SearchForm params={params} onChange={setParams} onSearch={() => handleSearch(params)} loading={loading} />
            </section>

            {searched ? (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                <RecommendedDays currentDateStr={params.date} onDateChange={handleDayChange} />
                <JourneyResults journeys={journeys} dogMode={params.dogMode} loading={loading} error={error} />
              </div>
            ) : (
              <LandingContent />
            )}
          </>
        )}

        {/* Content Seiten Routing */}
        {activePage === 'tips' && <DoggoTips />}
        {activePage === 'destinations' && <Destinations />}
        {activePage === 'nightTrains' && <NightTrains />}

      </main>

      <Footer onShowImprint={() => setShowImprint(true)} />
      
      {showImprint && <Imprint onClose={() => setShowImprint(false)} />}
    </div>
  );
}