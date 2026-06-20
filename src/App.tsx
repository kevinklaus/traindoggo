import { useState, useCallback, useEffect } from 'react';
import type { Journey, SearchParams } from './lib/types';
import { searchJourneys, setMockApiMode } from './lib/api';
import { getDefaultDate, getDefaultTime } from './lib/helpers';
import { DEV_INITIAL_FROM, DEV_INITIAL_TO } from './lib/mockData';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DevBanners from './components/layout/DevBanners';
import LandingContent from './components/content/LandingContent';
import Imprint from './components/content/Imprint';

// Content-Seiten importieren
import DoggoTips from './components/content/DoggoTips';
import NightTrains from './components/content/NightTrains';
import Destinations from './components/content/Destinations';
import AboutUs from './components/content/AboutUs';

export type Page = 'home' | 'tips' | 'destinations' | 'nightTrains' | 'about';

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

  const [activePage, setActivePage] = useState<Page>('home');

  // Pagination States
  const [earlierRef, setEarlierRef] = useState<string | null>(null);
  const [laterRef, setLaterRef] = useState<string | null>(null);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);

  useEffect(() => {
    setMockApiMode(useMockApi);
  }, [useMockApi]);

  const handleSearch = useCallback(async (searchParams = params) => {
    if (!searchParams.from || !searchParams.to) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    setActivePage('home'); 

    setJourneys([]);
    setEarlierRef(null);
    setLaterRef(null);

    try {
      const localDate = new Date(`${searchParams.date}T${searchParams.time}:00`);
      const departure = localDate.toISOString();
      
      const result = await searchJourneys(
        searchParams.from.id, 
        searchParams.to.id, 
        departure,
        searchParams.maxChanges,
        searchParams.minTransferTime
      );
      
      setJourneys(result.journeys ?? []);
      setEarlierRef(result.earlierRef ?? null);
      setLaterRef(result.laterRef ?? null);

      if (!result.journeys?.length) {
        setError('No journeys found for this route and time.');
      }
      setApiUnavailable(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed. Please try again.';
      setError(message);
      setJourneys([]);
      setEarlierRef(null);
      setLaterRef(null);
      setApiUnavailable(!useMockApi);
    } finally {
      setLoading(false);
    }
  }, [params, useMockApi]);

  const handleLoadEarlier = useCallback(async () => {
    if (!params.from || !params.to || !earlierRef) return;
    setLoadingEarlier(true);
    try {
      const result = await searchJourneys(
        params.from.id, params.to.id, undefined, params.maxChanges, params.minTransferTime, earlierRef, undefined
      );
      setJourneys(prev => [...(result.journeys ?? []), ...prev]);
      setEarlierRef(result.earlierRef ?? null);
    } catch (err) {
      console.error("Failed to load earlier journeys", err);
    } finally {
      setLoadingEarlier(false);
    }
  }, [params, earlierRef]);

  const handleLoadLater = useCallback(async () => {
    if (!params.from || !params.to || !laterRef) return;
    setLoadingLater(true);
    try {
      const result = await searchJourneys(
        params.from.id, params.to.id, undefined, params.maxChanges, params.minTransferTime, undefined, laterRef
      );
      setJourneys(prev => [...prev, ...(result.journeys ?? [])]);
      setLaterRef(result.laterRef ?? null);
    } catch (err) {
      console.error("Failed to load later journeys", err);
    } finally {
      setLoadingLater(false);
    }
  }, [params, laterRef]);

  const handleDayChange = (newDateStr: string) => {
    const newParams = { ...params, date: newDateStr };
    setParams(newParams);
    handleSearch(newParams);
  };

  return (
    <div className="min-h-screen bg-primary/10 from-slate-50 via-white to-primary/[0.03] flex flex-col">
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

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 min-w-0 min-h-[calc(100vh-73px)] flex flex-col justify-start">
        
        {activePage === 'home' && (
          <LandingContent 
            params={params}
            setParams={setParams}
            handleSearch={handleSearch}
            handleDayChange={handleDayChange}
            loading={loading}
            error={error}
            searched={searched}
            journeys={journeys}
            onLoadEarlier={handleLoadEarlier}
            onLoadLater={handleLoadLater}
            hasEarlier={!!earlierRef}
            hasLater={!!laterRef}
            loadingEarlier={loadingEarlier}
            loadingLater={loadingLater}
          />
        )}

        {activePage === 'tips' && <DoggoTips />}
        {activePage === 'destinations' && <Destinations />}
        {activePage === 'nightTrains' && <NightTrains />}
        {activePage === 'about' && <AboutUs />}

      </main>

      <Footer onShowImprint={() => setShowImprint(true)} />
      
      {showImprint && <Imprint onClose={() => setShowImprint(false)} />}
    </div>
  );
}