import { useEffect } from 'react';
import type { SearchParams } from '../../lib/types';
import { useJourneySearch } from '../../lib/useJourneySearch'; 
import CondensedSearchBar from './CondensedSearchBar';
import RecommendedDays from './RecommendedDays';
import JourneyResults from './JourneyResults';

interface Props {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
}

export default function JourneyResultsPage({ params, setParams }: Props) {
  const { 
    journeys, loading, error, fetchJourneys, 
    loadingEarlier, loadingLater, earlierRef, laterRef 
  } = useJourneySearch();

  // Wenn die Seite zum ersten Mal gerendert wird (Nutzer kam vom Startbildschirm),
  // feuern wir sofort die Suche ab.
  useEffect(() => {
    fetchJourneys(params);
    window.scrollTo({ top: 0, behavior: 'instant' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDayChange = (newDateStr: string) => {
    const newParams = { ...params, date: newDateStr };
    setParams(newParams);
    fetchJourneys(newParams);
  };

  const handleTriggerSearch = () => {
    fetchJourneys(params);
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in pb-24">
      {/* 1. Die neue kompakte Leiste oben */}
      <CondensedSearchBar 
        params={params} 
        onUpdateParams={setParams} 
        onTriggerSearch={handleTriggerSearch} 
      />

      {/* 2. Der eigentliche Content */}
      <div className="w-full max-w-4xl mt-3">
        <RecommendedDays 
          currentDateStr={params.date} 
          onDateChange={handleDayChange} 
        />
        
        <JourneyResults 
          journeys={journeys} 
          dogMode={params.dogMode} 
          loading={loading} 
          error={error} 
          onLoadEarlier={() => fetchJourneys(params, true, 'earlier')}
          onLoadLater={() => fetchJourneys(params, true, 'later')}
          hasEarlier={!!earlierRef}
          hasLater={!!laterRef}
          loadingEarlier={loadingEarlier}
          loadingLater={loadingLater}
        />
      </div>
    </div>
  );
}