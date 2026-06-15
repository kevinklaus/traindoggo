import { useTranslation } from 'react-i18next';
import type { Journey, DogMode } from '../../lib/types';
import JourneyCard from './JourneyCard';
import { Spinner } from '../ui/Primitives';
import ErrorDiagnostics from './ErrorDiagnostics';

interface Props {
  journeys: Journey[];
  dogMode: DogMode;
  loading: boolean;
  error: string | null;
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

export default function JourneyResults({ journeys, dogMode, loading, error }: Props) {
  const { t, i18n } = useTranslation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4" role="status" aria-live="polite">
        <Spinner className="h-10 w-10 text-primary" />
        <p className="text-slate-500 font-medium font-body whitespace-nowrap">{t('journeys.searching')}</p>
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

  let globalIndex = 0; // Hält die Animation über die Gruppen hinweg flüssig

  return (
    <section className="space-y-6" aria-label="Journey results">
      <div className="space-y-8">
        {groupedJourneys.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3">
            {/* ABSCHNITTSÜBERSCHRIFT: Das Datum */}
            <h3 className="text-lg font-bold text-slate-800 pb-1.5 ml-1">
              {group.dateLabel}
            </h3>
            
            <div className="space-y-4">
              {group.journeys.map((j) => {
                const currentIndex = globalIndex++;
                return (
                  <JourneyCard 
                    key={`${groupIdx}-${currentIndex}`} 
                    journey={j} 
                    dogMode={dogMode} 
                    index={currentIndex} 
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}