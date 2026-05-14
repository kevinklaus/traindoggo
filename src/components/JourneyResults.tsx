import type { Journey, DogMode } from '../lib/types';
import JourneyCard from './JourneyCard';

interface Props {
  journeys: Journey[];
  dogMode: DogMode;
  loading: boolean;
  error: string | null;
}

export default function JourneyResults({ journeys, dogMode, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4" role="status" aria-live="polite">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium font-body">Searching for journeys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center" role="alert">
        <p className="text-red-700 font-medium">{error}</p>
        <p className="text-red-500 text-sm mt-1">Please try a different search or check your connection.</p>
      </div>
    );
  }

  if (journeys.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-label="Journey results">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 font-heading">
          {journeys.length} journey{journeys.length > 1 ? 's' : ''} found
        </h2>
        <span className="text-xs text-slate-400">Prices are estimates</span>
      </div>
      {journeys.map((j, i) => (
        <JourneyCard key={i} journey={j} dogMode={dogMode} index={i} />
      ))}
    </section>
  );
}
