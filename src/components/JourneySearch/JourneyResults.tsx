import { useTranslation } from 'react-i18next';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import type { Journey, DogMode } from '../../lib/types';
import JourneyCard from './JourneyCard';
import { TrainSpinner } from '../ui/TrainSpinner';
import ErrorDiagnostics from './ErrorDiagnostics';
import { getMedianJourneyDuration } from '../../lib/doggoScore'; 

interface Props {
  journeys: Journey[];
  dogMode: DogMode;
  loading: boolean;
  error: string | null;
  onLoadEarlier?: () => void;
  onLoadLater?: () => void;
  hasEarlier?: boolean;
  hasLater?: boolean;
  loadingEarlier?: boolean;
  loadingLater?: boolean;
  chuuchuuStats?: Record<string, any>;
  loadingChuuchuu?: boolean;
}

// Gruppiert die Verbindungen nach ihrem Startdatum
function groupJourneysByDate(journeys: Journey[], locale: string) {
  const groups: { dateLabel: string; journeys: Journey[] }[] = [];
  
  journeys.forEach(journey => {
    const firstLeg = journey.legs?.[0];
    if (!firstLeg?.departure) return;

    const depDate = new Date(firstLeg.departure);
    const dateLabel = depDate.toLocaleDateString(locale, {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit'
    });

    const lastGroup = groups[groups.length - 1];
    // Wenn das Datum gleich dem vorherigen ist, hängen wir es an die Gruppe an
    if (lastGroup && lastGroup.dateLabel === dateLabel) {
      lastGroup.journeys.push(journey);
    } else {
      // Neues Datum = Neue Gruppe
      groups.push({ dateLabel, journeys: [journey] });
    }
  });
  
  return groups;
}

export default function JourneyResults({ 
  journeys, dogMode, loading, error, 
  onLoadEarlier, onLoadLater, hasEarlier, hasLater, loadingEarlier, loadingLater,
  chuuchuuStats, loadingChuuchuu
}: Props) {
  const { t, i18n } = useTranslation();

  // Die Haupt-Ladeanzeige
  if (loading && !loadingEarlier && !loadingLater) {
    return (
      <div className="pt-6" role="status" aria-live="polite">
        <TrainSpinner/>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDiagnostics 
        message={error} 
        statusCode={503} 
        upstreamUrl="https://v6.db.transport.rest/journeys"
        onRetry={() => window.location.reload()} 
      />
    );
  }

  if (journeys.length === 0) return null;

  const locale = i18n.language === 'de' ? 'de-DE' : 'en-GB';
  const groupedJourneys = groupJourneysByDate(journeys, locale);
  let globalIndex = 0; 

  const medianDurationMin = getMedianJourneyDuration(journeys);

  return (
    <section className="mt-6 sm:mt-12 space-y-4 sm:space-y-6" aria-label="Journey results">
      
      <div className="space-y-8">
        {groupedJourneys.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3">
            
            {/* ABSCHNITTSÜBERSCHRIFT: Datum & Frühere Verbindungen Button kombiniert */}
            <div className="flex items-center justify-between pb-1.5 ml-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                {group.dateLabel}
              </h3>
              
              {/* Zeige den Earlier-Button nur beim allerersten Datum an */}
              {groupIdx === 0 && hasEarlier && (
                <button
                  type="button"
                  onClick={onLoadEarlier}
                  disabled={loadingEarlier}
                  className="mr-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-secondary border-2 border-secondary text-sm font-bold hover:text-white hover:bg-primary transition-all disabled:opacity-50"
                >
                  {loadingEarlier ? <Loader2 size={18} className="animate-spin" /> : <ChevronUp size={18} />}
                  <span>{t('journeys.loadEarlier')}</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {group.journeys.map((j) => {
                const currentIndex = globalIndex++;
                return (
                  <JourneyCard 
                    key={`${groupIdx}-${currentIndex}`} 
                    journey={j} 
                    dogMode={dogMode} 
                    index={currentIndex}
                    comparisonDurationMin={medianDurationMin}
                    chuuchuuStats={chuuchuuStats}
                    loadingChuuchuu={loadingChuuchuu}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON: Spätere Verbindungen (Rechtsbündig am Ende der Liste) */}
      {hasLater && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onLoadLater}
            disabled={loadingLater}
            className="mr-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-secondary border-2 border-secondary text-sm font-bold hover:text-white hover:bg-primary transition-all disabled:opacity-50"
          >
            {loadingLater ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
            <span>{t('journeys.loadLater')}</span>
          </button>
        </div>
      )}

    </section>
  );
}