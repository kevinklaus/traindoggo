import { useState } from 'react';
import { ArrowDownUp, Route, ChevronDown, ChevronUp, Footprints } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SearchParams } from '../../lib/types';
import StationInput from '../ui/StationInput';
import DateTimeInput from '../ui/DateTimeInput';
import SelectInput from '../ui/SelectInput';
import { Spinner, TOKENS, IconButton } from '../ui/Primitives';

interface Props {
  params: SearchParams;
  onChange: (params: SearchParams) => void;
  onSearch: () => void;
  loading: boolean;
  isAdvancedOpenDefault?: boolean; // <-- NEU
}

export default function SearchForm({ params, onChange, onSearch, loading, isAdvancedOpenDefault = false }: Props) {
  const { t } = useTranslation();
  const [shaking, setShaking] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  
  // NEU: Accordion State
  const [advancedOpen, setAdvancedOpen] = useState(isAdvancedOpenDefault);
  const today = new Date().toISOString().split('T')[0];

  const handleParamChange = (key: keyof SearchParams, value: any) => {
    onChange({ ...params, [key]: value });
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!params.from || !params.to) {
      setShaking(true);
      setValidationMsg(
        !params.from && !params.to
          ? t('searchForm.validation.both', 'Bitte Start- und Zielbahnhof wählen')
          : !params.from ? t('searchForm.validation.from', 'Bitte Startbahnhof wählen') : t('searchForm.validation.to', 'Bitte Zielbahnhof wählen')
      );
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setValidationMsg(null);
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-5" noValidate>
      {/* 1. ROUTING BLOCK */}
      <div className="space-y-2 sm:space-y-3">
        <StationInput
          id="station-from"
          label={t('searchForm.fromLabel', 'Von')}
          value={params.from}
          onChange={(s) => handleParamChange('from', s)}
          placeholder={t('searchForm.fromPlaceholder', 'z. B. München Hbf')}
        />

        <div className="flex gap-1.5 items-start">
          <div className="flex-1 min-w-0">
            <StationInput
              id="station-to"
              label={t('searchForm.toLabel', 'Nach')}
              value={params.to}
              onChange={(s) => handleParamChange('to', s)}
              placeholder={t('searchForm.toPlaceholder', 'z. B. Berlin Hbf')}
            />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="block text-xs font-semibold opacity-0 select-none mb-1" aria-hidden="true">&nbsp;</span>
            <IconButton 
              onClick={() => onChange({ ...params, from: params.to, to: params.from })} 
              aria-label={t('searchForm.swapAria', 'Abfahrt und Ziel tauschen')} 
              title={t('searchForm.swapTitle', 'Richtung tauschen')}
            >
              <ArrowDownUp size={18} strokeWidth={2.25} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* 2. ZEIT BLOCK */}
      <div className="grid grid-cols-2 gap-3 min-w-0">
        <DateTimeInput
          id="search-date"
          label={t('searchForm.dateLabel', 'Datum')}
          iconType="date"
          value={params.date}
          min={today}
          onChange={(e) => handleParamChange('date', e.target.value)}
          onClick={(e) => 'showPicker' in e.currentTarget && e.currentTarget.showPicker()}
        />
        <DateTimeInput
          id="search-time"
          label={t('searchForm.timeLabel', 'Zeit')}
          iconType="time"
          step={60}
          value={params.time}
          onChange={(e) => handleParamChange('time', e.target.value)}
          onClick={(e) => 'showPicker' in e.currentTarget && e.currentTarget.showPicker()}
        />
      </div>

      {/* 3. OPTIONEN BLOCK (Accordion) */}
      <div className="space-y-3 min-w-0 pb-2">
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors focus:outline-none"
        >
          {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {advancedOpen ? t('searchForm.lessOptions', 'Weniger Optionen') : t('searchForm.moreOptions', 'Weitere Optionen')}
        </button>

        {advancedOpen && (
          <div className="grid grid-cols-2 gap-3 min-w-0 animate-in fade-in slide-in-from-top-2 duration-200">
            <SelectInput
              id="max-changes"
              label={t('searchForm.maxChanges', 'Max. Umstiege')}
              icon={<Route size={18} />}
              value={params.maxChanges ?? ''}
              onChange={(e) => handleParamChange('maxChanges', e.target.value === '' ? undefined : Number(e.target.value))}
            >
              <option value="">{t('searchForm.changesAny', 'Beliebig')}</option>
              <option value="0">{t('searchForm.changesDirect', 'Direkt (0)')}</option>
              <option value="1">{t('searchForm.changesOne', 'Max. 1 Umstieg')}</option>
              <option value="2">{t('searchForm.changesTwo', 'Max. 2 Umstiege')}</option>
            </SelectInput>

            <SelectInput
              id="min-transfer-time"
              label={t('searchForm.minTransfer', 'Gassi-Puffer')}
              icon={<Footprints size={18} />}
              value={params.minTransferTime ?? ''}
              onChange={(e) => handleParamChange('minTransferTime', e.target.value === '' ? undefined : Number(e.target.value))}
            >
              <option value="">{t('searchForm.transferAny', 'Egal')}</option>
              <option value="15">{t('searchForm.transfer15', '15 Min')}</option>
              <option value="30">{t('searchForm.transfer30', '30 Min')}</option>
              <option value="45">{t('searchForm.transfer45', '45 Min')}</option>
              <option value="60">{t('searchForm.transfer60', '1 Stunde')}</option>
              <option value="90">{t('searchForm.transfer90', '1.5 Stunden')}</option>
              <option value="120">{t('searchForm.transfer120', '2 Stunden')}</option>
            </SelectInput>
          </div>
        )}
      </div>

      {/* 4. AKTION */}
      {validationMsg && (
        <div className="text-sm text-red-600 font-medium" role="alert" aria-live="polite">
          {validationMsg}
        </div>
      )}

      <button 
        type="submit" 
        className={`${TOKENS.buttons.primarySubmit} ${shaking ? 'animate-shake' : ''}`} 
        aria-label={t('searchForm.submitBtn', 'Suchen')}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2.5">
            <Spinner className="h-4 w-4 text-white" />
            <span>{t('searchForm.loadingBtn', 'Suche läuft…')}</span>
          </span>
        ) : (
          t('searchForm.submitBtn', 'Suchen')
        )}
      </button>
    </form>
  );
}