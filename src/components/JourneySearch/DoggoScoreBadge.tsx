import { PawPrint } from "lucide-react";

interface Props {
  score: number;
}

export default function DoggoScoreBadge({ score }: Props) {
  
  // 1. Zentrale Konfiguration der Zustände 
  const getConfig = (s: number) => {
    if (s > 66) {
      return {
        colorClass: 'text-primary',
      };
    }
    if (s > 33) {
      return {
        colorClass: 'text-secondary', 
      };
    }
    return {
      colorClass: 'text-red-500',
    };
  };

  const colorClass = getConfig(score);

  // 2. Einziges, sauberes HTML-Gerüst
  return (
    <div className="flex flex-col items-end bg-primary/5 px-2 py-1 rounded-xl">
      <div className="inline-flex items-center gap-1.5 ">        
        <div className={`flex items-baseline gap-0.5 ${colorClass}`}>
          <span className="text-lg font-bold tracking-tight">{score}</span>
          <span className="text-[10px] font-bold">/ 100</span>
          <span className="ml-1"><PawPrint size={12} className="text-secondary fill-secondary"/></span>
        </div>
      </div>
      {/* <div className="flex text-[10px] font-medium text-secondary">
        Doggo Score
      </div> */}
    </div>
  );
}