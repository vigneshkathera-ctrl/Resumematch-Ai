import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

export const ActionList = ({ topActions = [] }) => {
  if (!topActions.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Top Priority Actions to Maximize ATS Fit
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Ranked by Immediate Impact
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {topActions.map((action, index) => (
          <div
            key={index}
            className="flex items-start space-x-3.5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {action}
              </p>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                Priority {index === 0 ? 'Urgent' : index <= 2 ? 'High' : 'Recommended'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

