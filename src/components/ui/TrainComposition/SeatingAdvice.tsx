import { PawPrint, Armchair, Accessibility } from 'lucide-react';
import { TFunction } from 'i18next';
import { CarriageDef } from '../../../lib/trainLayoutFallbacks';

// Bild-Importe aus demselben Ordner
import AbteilImg from './Abteil-Wagen.jpg';
import ZweiKlImg from './2.Kl Wagen.jpg';
import EinKlImg from './1. Kl Wagen.jpg';
import MehrzweckImg from './Mehrzweck-Wagen.jpg';

interface Props {
  exampleGross: CarriageDef | undefined;
  t: TFunction;
}


export function SeatingAdvice({exampleGross, t }: Props) {

  return (
    <div>
        {/* 2. Der illustrative Hunde-Sitzplan (4-Box-Grid mit Bildern) */}
        {exampleGross && (
        <div className="mt-4 p-4 rounded-2xl bg-secondary/10 shrink-0">
          <div className="text-secondary flex items-center gap-2 mb-4">
            <Armchair size={18} className="" />
            <span className="text-md font-bold text-slate-800">{t('composition.advice.title', 'Sitzplatz-Empfehlung')}</span>
          </div>
          {/* Grid Layout für Mobile & Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* BOX 1: 2. KL GROSSRAUM */}
            <div className="bg-white rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-700 text-white rounded-sm px-1 py-0.5 text-[10px] font-bold">2.</span>
                <h3 className="font-bold text-slate-700 text-sm">Großraum</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img src={ZweiKlImg} alt="2. Klasse Großraum Layout" className="w-full max-w-[140px] h-auto object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* BOX 2: 1. KL GROSSRAUM */}
            <div className="bg-white rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-400 text-slate-900 rounded-sm px-1 py-0.5 text-[10px] font-bold">1.</span>
                <h3 className="font-bold text-slate-700 text-sm">Großraum</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img src={EinKlImg} alt="1. Klasse Großraum Layout" className="w-full max-w-[140px] h-auto object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* BOX 3: MEHRZWECK */}
            <div className="bg-white rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-secondary text-white rounded-sm px-1 py-0.5 text-[10px] font-bold flex items-center justify-center gap-0.5">
                   <Accessibility size={12} />
                </span>
                <h3 className="font-bold text-slate-700 text-sm">Mehrzweck</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img src={MehrzweckImg} alt="Mehrzweckwagen Layout" className="w-full max-w-[140px] h-auto object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* BOX 4: ABTEILWAGEN */}
            <div className="bg-white rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  <span className="bg-yellow-400 text-slate-900 rounded-sm px-1 py-0.5 text-[10px] font-bold">1.</span>
                  <span className="bg-green-700 text-white rounded-sm px-1 py-0.5 text-[10px] font-bold">2.</span>
                </div>
                <h3 className="font-bold text-slate-700 text-sm">Abteil</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img src={AbteilImg} alt="Abteilwagen Layout" className="w-full max-w-[140px] h-auto object-contain mix-blend-multiply" />
              </div>
            </div>

          </div>
          
          {/* Legende bleibt bestehen, um die visuellen Codes deiner Bilder zu erklären */}
          <div className="flex gap-6 mt-6 justify-center text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <PawPrint size={14} className="text-primary fill-primary" /> = Empfohlener Platz
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-4 border-l-[3px] border-indigo-950 bg-indigo-100 rounded-[2px]"></div> = Rückenlehne
            </div>
          </div>
            {/* Text um die Bilder zu erklären */}
            <div className="mt-4 text-sm">
                <p>{t('composition.ui.vagonwebBestSeats', 'Rücken-an-Rücken-Plätze oder Sitze direkt an Gepäckablagen und Raumtrennern sind meistens die besten Optionen.')}</p>
            </div>
        </div>
      )}
    </div>
 );
}