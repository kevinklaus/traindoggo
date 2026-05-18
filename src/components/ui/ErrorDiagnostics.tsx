import { useState } from 'react';
import { AlertCircle, Terminal, ChevronDown, ChevronUp, RefreshCw, Layers } from 'lucide-react';
import { TOKENS } from './Primitives';

interface ErrorDiagnosticsProps {
  message: string;
  statusCode?: number;
  upstreamUrl?: string;
  onRetry?: () => void;
}

export default function ErrorDiagnostics({
  message,
  statusCode = 503,
  upstreamUrl = 'https://v6.db.transport.rest/locations',
  onRetry
}: ErrorDiagnosticsProps) {
  const [showDevConsole, setShowDevConsole] = useState(false);
  const timestamp = new Date().toISOString();

  // Map HTTP status codes to context-aware DB infrastructure alerts
  const getContextualAdvice = (code: number) => {
    switch (code) {
      case 503:
        return {
          title: 'Timetable Service Temporarily Overloaded',
          userMessage: 'The central German railway timetable data pool is experiencing a massive wave of requests or an active maintenance window. Your layout data and dog fare calculations remain safe.',
          action: 'Wait a few moments and click retry below. If the server remains jammed, our proxy loop can be set to toggle off live tariffs to restore basic timetable lookups.'
        };
      case 429:
        return {
          title: 'Rate Limit Threshold Exceeded',
          userMessage: 'Too many station queries or journey checks were dispatched within a single minute interval.',
          action: 'Pause your lookup for 30–60 seconds to clear the rate bucket before re-submitting.'
        };
      default:
        return {
          title: 'Gateway Connection Outage',
          userMessage: message || 'An unexpected connection break occurred between our client proxy and the transport endpoint.',
          action: 'Verify your local network conditions, check station spellings, or try running a fallback mock query.'
        };
    }
  };

  const advice = getContextualAdvice(statusCode);

  return (
    <div className={`${TOKENS.layouts.card} border-red-200 bg-red-50/30 overflow-hidden animate-fade-in`} role="alert">
      <div className="p-5 space-y-4">
        
        {/* --- SECTION 1: END USER GUIDANCE --- */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-xl text-red-600 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-bold text-slate-800 font-heading">
              {advice.title} <span className="text-xs font-normal text-red-600 font-body">(HTTP {statusCode})</span>
            </h3>
            <p className="text-xs text-slate-600 font-body leading-relaxed">
              {advice.userMessage}
            </p>
            <div className="bg-white border border-red-100 p-3 rounded-xl mt-2 text-[11px] text-slate-500 leading-normal font-body">
              <span className="font-bold text-slate-700 block mb-0.5">How to resolve this:</span>
              {advice.action}
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:border-primary/30 text-slate-700 hover:text-primary rounded-lg transition-all active:scale-95 shadow-sm"
            >
              <RefreshCw size={12} />
              <span>Retry Search</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDevConsole(!showDevConsole)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border ml-auto transition-all ${
              showDevConsole 
                ? 'bg-slate-800 border-slate-900 text-slate-200' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'
            }`}
          >
            <Terminal size={12} />
            <span>{showDevConsole ? 'Hide' : 'Show'} Developer Console</span>
            {showDevConsole ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* --- SECTION 2: DEVELOPER TELEMETRY DRAWER --- */}
        {showDevConsole && (
          <div className="bg-slate-900 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 space-y-2.5 border border-slate-950 shadow-inner animate-fade-in select-all">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 font-sans text-[10px] font-bold tracking-wider uppercase">
              <span>Upstream System Diagnostics</span>
              <span className="text-red-400">Telemetry Active</span>
            </div>
            
            <div className="space-y-1 font-mono">
              <p><span className="text-slate-500">[TIMESTAMP] :</span> {timestamp}</p>
              <p><span className="text-slate-500">[ENDPOINT]  :</span> {upstreamUrl}</p>
              <p><span className="text-slate-500">[STATUS]    :</span> HTTP {statusCode} — Service Unavailable</p>
              <p className="text-red-400"><span className="text-slate-500">[DIAGNOSTIC]:</span> Upstream down. Code: {statusCode}. Core HAFAS/Vendo gateway layer timeout.</p>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 font-sans text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary tracking-wide uppercase mb-0.5">
                <Layers size={11} />
                <span>Architectural System Recovery Notes</span>
              </div>
              <p className="text-[11px] leading-normal font-body">
                1. <strong>Proxy Loop Failover:</strong> If testing local modifications, verify your client parameters in <code>src/lib/api.ts</code> can gracefully clear out ticket attributes to bypassing pricing checks entirely when 503 blocks arrive.
              </p>
              <p className="text-[11px] leading-normal font-body">
                2. <strong>Upstream Monitor:</strong> Verify if your transport target endpoints require transitioning to updated backends like <code>db-vendo-client</code> to align with modern DB API core network allocations.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}