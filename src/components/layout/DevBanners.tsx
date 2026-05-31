interface Props {
  isDev: boolean;
  apiUnavailable: boolean;
  useMockApi: boolean;
  setUseMockApi: (val: boolean) => void;
}

export default function DevBanners({ isDev, apiUnavailable, useMockApi, setUseMockApi }: Props) {
  if (!isDev) return null;

  return (
    <>
      {apiUnavailable && !useMockApi && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium">
              Live timetable API unavailable. Enable offline mock mode to continue testing.
            </p>
            <button
              type="button"
              onClick={() => setUseMockApi(true)}
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-200/60 hover:bg-amber-700 transition-all"
            >
              Enable mock mode
            </button>
          </div>
        </div>
      )}

      {useMockApi && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="rounded-2xl border border-slate-200 bg-slate-100 text-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium">Offline mock mode is active.</p>
            <button
              type="button"
              onClick={() => setUseMockApi(false)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Switch to live mode
            </button>
          </div>
        </div>
      )}
    </>
  );
}