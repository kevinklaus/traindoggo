import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  transferMin: number;
  showDogWarning: boolean;
}

export default function TimelineTransfer({ transferMin, showDogWarning }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 pl-[3.75rem] my-3 relative z-10">
      <div className="w-4 flex justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-slate-200 border border-white shadow-sm" />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 select-none">
          {t('journeys.timeline.transferMin', { count: transferMin })}
        </div>
        {showDogWarning && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200" role="alert">
            <AlertTriangle size={13} strokeWidth={2.5} /> {t('journeys.timeline.tightWindow')}
          </div>
        )}
      </div>
    </div>
  );
}