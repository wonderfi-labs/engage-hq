"use client";

export const SurveyLoadingMobile = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-4 w-32 rounded bg-slate-300" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 text-sm">
            <div>
              <div className="mb-1 h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-12 rounded bg-slate-100" />
            </div>
            <div>
              <div className="mb-1 h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-8 rounded bg-slate-100" />
            </div>
            <div>
              <div className="mb-1 h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded bg-slate-100" />
            </div>
            <div>
              <div className="mb-1 h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-12 rounded bg-slate-100" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-3">
            <div className="h-8 w-20 rounded bg-slate-200" />
            <div className="h-8 w-8 rounded-md bg-slate-300" />
          </div>
        </div>
      ))}
    </div>
  );
};
