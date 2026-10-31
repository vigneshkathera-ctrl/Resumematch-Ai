import React, { useState } from 'react';
import { Check, AlertCircle, Copy, CheckCheck } from 'lucide-react';

export const SkillChips = ({ matchedSkills = [], missingKeywords = [] }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (items, sectionName) => {
    if (!items.length) return;
    navigator.clipboard.writeText(items.join(', '));
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Skills Card (Green Chips) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Matched Skills
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Found in your resume and requested by the employer
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              {matchedSkills.length}
            </span>
            {matchedSkills.length > 0 && (
              <button
                onClick={() => copyToClipboard(matchedSkills, 'matched')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy all matched skills"
              >
                {copiedSection === 'matched' ? (
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {matchedSkills.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No direct skill matches identified. Consider revising technical terms.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
              >
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Keywords Card (Red Chips) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Missing Keywords
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key terms in the job description absent from your resume
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
              {missingKeywords.length}
            </span>
            {missingKeywords.length > 0 && (
              <button
                onClick={() => copyToClipboard(missingKeywords, 'missing')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy all missing keywords"
              >
                {copiedSection === 'missing' ? (
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {missingKeywords.length === 0 ? (
          <div className="py-8 text-center text-sm text-emerald-600 dark:text-emerald-400">
            Great work! No significant keyword deficits detected for this role.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              >
                <span className="text-rose-500 font-bold">+</span>
                <span>{keyword}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

