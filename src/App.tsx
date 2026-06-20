import { useState, useCallback, useEffect } from 'react';
import type { SearchParams } from './lib/types';
import { setMockApiMode } from './lib/api';
import { getDefaultDate, getDefaultTime } from './lib/helpers';
import { DEV_INITIAL_FROM, DEV_INITIAL_TO } from './lib/mockData';
import { getRandomRoute } from './lib/randomDestinations';

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

// NEU: Die Ergebnisseite importieren
import JourneyResultsPage from './components/JourneySearch/JourneyResultsPage';

export type Page = 'home' | 'results' | 'tips' | 'destinations' | 'nightTrains' | 'about';

export default function App() {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const isDev = import.meta.env.VITE_USE_MOCK_API === 'true' && isLocalhost; 
  
  const [params, setParams] = useState<SearchParams>(() => {
    const randomRoute = getRandomRoute();
    
    return {
      from: isDev ? DEV_INITIAL_FROM : randomRoute.from,
      to: isDev ? DEV_INITIAL_TO : randomRoute.to,
      date: getDefaultDate(),
      time: isDev ? '06:00' : getDefaultTime(),
      dogMode: 'large',
    };
  });
  
  const [useMockApi, setUseMockApi] = useState(import.meta.env.VITE_USE_MOCK_API === 'true');
  const [showImprint, setShowImprint] = useState(false);

  const [activePage, setActivePage] = useState<Page>('home');

  useEffect(() => {
    setMockApiMode(useMockApi);
  }, [useMockApi]);

  // Wenn auf Suchen geklickt wird, wechseln wir einfach die Seite!
  // Die ResultsPage kümmert sich dann um den Rest.
  const handleSearch = useCallback((searchParams = params) => {
    if (!searchParams.from || !searchParams.to) return;
    setActivePage('results');
  }, [params]);

  return (
    <div className="min-h-screen bg-primary/10 from-slate-50 via-white to-primary/[0.03] flex flex-col">
      <Header 
        dogMode={params.dogMode} 
        activePage={activePage} 
        onNavigate={setActivePage} 
        onLogoClick={() => setActivePage('home')} 
      />
      
      <DevBanners 
        isDev={isDev} 
        apiUnavailable={false} 
        useMockApi={useMockApi} 
        setUseMockApi={setUseMockApi} 
      />

      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-8 w-full flex-1 min-w-0 min-h-[calc(100vh-73px)] flex flex-col justify-start">
        
        {activePage === 'home' && (
          <LandingContent 
            params={params}
            setParams={setParams}
            handleSearch={handleSearch}
          />
        )}

        {/* NEU: Die smarte Ergebnisseite */}
        {activePage === 'results' && (
          <JourneyResultsPage 
            params={params}
            setParams={setParams}
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