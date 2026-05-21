import { Map } from 'lucide-react';
import mapSvgUrl from './content/VerbundsKarte.svg';

export default function DogRulesMap() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2.5">
        <Map size={18} className="text-slate-500" />
        <h3 className="font-semibold text-slate-700 text-sm">Übersichtskarte: D-Ticket & Hunde</h3>
      </div>
      
      {/* SVG Wrapper */}
      <div className="w-full relative bg-slate-50/50 p-6 flex justify-center items-center">
        <img 
          src={mapSvgUrl} 
          alt="Karte der deutschen Verkehrsverbünde" 
          className="w-full max-w-lg h-auto drop-shadow-sm"
          loading="lazy"
        />
      </div>

      {/* Legende */}
      <div className="px-5 py-4 bg-white border-t border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Legende (Schiene)</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#A38DF5] border border-slate-200 shadow-sm" />
            <span>Hund fährt <b>kostenlos</b> mit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#F9C26B] border border-slate-200 shadow-sm" />
            <span>Hund braucht <b>eigenes Ticket</b></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#94CDDF] border border-slate-200 shadow-sm" />
            <span>Mit D-Ticket möglich</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white border border-slate-300 shadow-sm" />
            <span>Verbundfreies Gebiet</span>
          </div>
        </div>
      </div>

      {/* Footer Attribution Area */}
      <div className="p-4 text-[11px] text-slate-400 bg-slate-50 border-t border-slate-100 text-center leading-relaxed">
        Kartendaten: <a 
          href="https://commons.wikimedia.org/wiki/File:Verbundkarte.svg" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium text-slate-500 hover:text-primary transition-colors underline underline-offset-2 decoration-slate-200"
        >Christoph Sohn</a>,{' '}
        <a 
          href="https://creativecommons.org/licenses/by-sa/4.0" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium text-slate-500 hover:text-primary transition-colors underline underline-offset-2 decoration-slate-200"
        >CC BY-SA 4.0</a>, via Wikimedia Commons. 
        <br className="sm:hidden" />
        <span className="hidden sm:inline"> | </span> 
        Alle Angaben ohne Gewähr.
      </div>
    </div>
  );
}