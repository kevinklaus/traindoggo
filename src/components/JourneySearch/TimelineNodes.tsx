import { Circle, Train, Footprints, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Primitives';

// ============================================================================
// MOLECULE: INTER-CONNECTED CONNECTION/TRANSFERS
// ============================================================================
interface TransferNodeProps {
  minutes: number;
  isRisky: boolean;
  showDogWarning: boolean;
}
export function TimelineTransferNode({ minutes, isRisky, showDogWarning }: TransferNodeProps) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-6 flex-wrap">
      <Circle size={8} fill={isRisky ? '#dc2626' : '#94a3b8'} className="shrink-0" />
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isRisky ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
        {minutes}m transfer
      </span>
      {showDogWarning && (
        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium" role="alert">
          <AlertTriangle size={12} /> Risky for dogs
        </span>
      )}
    </div>
  );
}

// ============================================================================
// MOLECULE: LEG DEPARTURE STATION DETAILS
// ============================================================================
interface DepartureNodeProps {
  time: string;
  stationName: string;
  badgeLabel: string;
  badgeTitle: string;
  platform?: string;
  delay?: number;
  isWalking: boolean;
  lineStyle: { bg: string; text: string };
  showConnector: boolean;
}
export function TimelineDepartureNode({
  time,
  stationName,
  badgeLabel,
  badgeTitle,
  platform,
  delay,
  isWalking,
  lineStyle,
  showConnector,
}: DepartureNodeProps) {
  return (
    <div className="flex items-start gap-3 py-1.5 min-w-0">
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: lineStyle.bg }}>
          {isWalking ? <Footprints size={8} className="text-slate-400" /> : <Train size={8} style={{ color: lineStyle.bg }} />}
        </div>
        {showConnector && <div className="w-[2px] flex-1 min-h-[20px]" style={{ backgroundColor: lineStyle.bg, opacity: 0.3 }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-800 tabular-nums">{time}</span>
          <Badge style={{ backgroundColor: lineStyle.bg, color: lineStyle.text }} title={badgeTitle}>{badgeLabel}</Badge>
          {platform && <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{platform}</span>}
          {delay && delay > 0 ? <span className="text-xs text-red-600">+{delay}m</span> : null}
        </div>
        <div className="text-sm text-slate-600 mt-0.5">{stationName}</div>
      </div>
    </div>
  );
}

// ============================================================================
// ATOM: GEOMETRIC TRACKING LINE SPACER
// ============================================================================
export function TimelineConnectorLine({ lineStyle }: { lineStyle: { bg: string } }) {
  return (
    <div className="flex items-start gap-3 ml-[7px]">
      <div className="w-[2px] min-h-[16px]" style={{ backgroundColor: lineStyle.bg, opacity: 0.3 }} />
    </div>
  );
}

// ============================================================================
// MOLECULE: LEG ARRIVAL STATION DETAILS
// ============================================================================
interface ArrivalNodeProps {
  time: string;
  stationName: string;
  platform?: string;
  delay?: number;
  lineStyle: { bg: string };
}
export function TimelineArrivalNode({ time, stationName, platform, delay, lineStyle }: ArrivalNodeProps) {
  return (
    <div className="flex items-start gap-3 py-1.5 min-w-0">
      <div className="flex flex-col items-center pt-1 shrink-0"><Circle size={4} fill={lineStyle.bg} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-800 tabular-nums">{time}</span>
          {platform && <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{platform}</span>}
          {delay && delay > 0 ? <span className="text-xs text-red-600">+{delay}m</span> : null}
        </div>
        <div className="text-sm text-slate-600 mt-0.5 font-semibold">
          {stationName} <span className="font-normal text-slate-400 ml-1 text-xs">Get off</span>
        </div>
      </div>
    </div>
  );
}