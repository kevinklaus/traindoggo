import { useTranslation } from 'react-i18next';
import type { Journey, DogMode } from '../../lib/types';
import JourneyCard from './JourneyCard';
import { Spinner } from '../ui/Primitives';
import ErrorDiagnostics from './ErrorDiagnostics'; // Integrated standard error handler

interface Props {
  journeys: Journey[];
  dogMode: DogMode;
  loading: boolean;
  error: string | null;
}

export default function JourneyResults({ journeys, dogMode, loading, error }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4" role="status" aria-live="polite">
        <Spinner className="h-10 w-10 text-primary" />
        <p className="text-slate-500 font-medium font-body whitespace-nowrap">{t('journeys.searching')}</p>
      </div>
    );
  }

  // CHANGED: Swept away the basic text-only block to trigger the advanced diagnostics tracker panel
  if (error) {
    return (
      <ErrorDiagnostics 
        message={error} 
        statusCode={503} // Safely locks on to the upstream 503 indicator matching terminal loops
        upstreamUrl="https://v6.db.transport.rest/journeys"
        onRetry={() => window.location.reload()} 
      />
    );
  }

  if (journeys.length === 0) return null;

  return (
    <section className="space-y-4" aria-label="Journey results">
      <h2 className="text-lg font-bold text-slate-800 font-heading whitespace-nowrap">
        {journeys.length === 1 
          ? t('journeys.found.one') 
          : t('journeys.found.other', { count: journeys.length })}
      </h2>
      {journeys.map((j, i) => (
        <JourneyCard key={i} journey={j} dogMode={dogMode} index={i} />
      ))}
    </section>
  );
}