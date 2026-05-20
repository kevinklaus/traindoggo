import DogRulesMap from '../DogRulesMap';
import { HelpCircle, MapPin, Compass } from 'lucide-react';

export default function LandingContent() {
  return (
    <div className="space-y-8 mt-8 animate-fade-in w-full">
      {/* Zentrale Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
            <HelpCircle size={24} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading">Reisen mit Train Doggo</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          {/* Linke Spalte */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <Compass size={18} className="text-primary" /> Fernverkehr (ICE/IC)
            </h3>
            <ul className="space-y-2 list-disc pl-5 marker:text-primary">
              <li><b>Kleine Hunde</b> (Katzengröße) reisen gratis in der Box.</li>
              <li><b>Große Hunde</b> zahlen den halben Ticketpreis.</li>
              <li>Es gilt strikte <b>Leinen- & Maulkorbpflicht</b>!</li>
            </ul>
          </div>
          
          {/* Rechte Spalte (Kombiniert mit Map-Intro) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <MapPin size={18} className="text-primary" /> Nahverkehr & D-Ticket
            </h3>
            <p>
              Die Regeln sind ein absoluter Flickenteppich! 🐶 In manchen Regionen fährt dein Hund kostenlos mit, in anderen wird ein Zusatzticket fällig. 
            </p>
            <p>
              Ob dein Doggo gratis einsteigt, siehst du auf unserer <i>pfotenstarken</i> Übersichtskarte unten. 👇
            </p>
          </div>
        </div>
      </div>

      {/* Nur noch die Karte selbst */}
      <DogRulesMap />
    </div>
  );
}