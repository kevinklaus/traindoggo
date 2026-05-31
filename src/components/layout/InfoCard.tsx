// Wiederverwendbare Sub-Komponente für alle Content-Seiten
export default function InfoCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-xl shrink-0">{icon}</div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed ml-[52px]">{text}</p>
    </div>
  );
}