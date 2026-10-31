import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';

export const BulletComparison = ({ improvedBullets = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyBullet = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllBullets = () => {
    if (!improvedBullets.length) return;
    const allText = improvedBullets
      .map((b, i) => `${i + 1}. ${b.improved}`)
      .join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!improvedBullets.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Original vs. Improved Bullet Points
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Re-engineered using active verbs and measurable outcomes (XYZ formula) without fabricating experience
          </p>
        </div>

        <button
          onClick={copyAllBullets}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Copied All Improvements!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All Rewrites</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {improvedBullets.map((bullet, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Original Bullet */}
              <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>Original Bullet Point #{idx + 1}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{bullet.original}"
                  </p>
                </div>
              </div>

              {/* Improved Bullet */}
              <div className="rounded-xl p-4 bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 flex flex-col justify-between relative group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      <span>Optimized Impact Rewrite</span>
                    </div>

                    <button
                      onClick={() => copyBullet(bullet.improved, idx)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                      title="Copy improved bullet point"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                    {bullet.improved}
                  </p>
                </div>
              </div>
            </div>

            {/* Why this is better */}
            {bullet.reason && (
              <div className="flex items-start space-x-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Why this ranks higher: </span>
                  <span className="text-slate-700 dark:text-slate-300">{bullet.reason}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

