import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getScoreColor } from '../utils/formatDate';
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ScoreGauge = ({ score = 0, jobTitle = 'Target Role' }) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  const colorScheme = getScoreColor(safeScore);

  const data = [
    { name: 'Achieved Score', value: safeScore },
    { name: 'Remaining Gap', value: 100 - safeScore }
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${colorScheme.bg} ${colorScheme.border} shadow-sm`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Score Gauge */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={225}
                endAngle={-45}
                innerRadius="72%"
                outerRadius="90%"
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell key="achieved" fill={colorScheme.stroke} />
                <Cell key="remaining" fill="currentColor" className="text-slate-200 dark:text-slate-800" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Score Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${colorScheme.text}`}>
              {safeScore}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
              out of 100
            </span>
          </div>
        </div>

        {/* Right: Summary Information */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {safeScore >= 80 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : safeScore >= 60 ? (
              <Award className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={colorScheme.text}>{colorScheme.label}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {jobTitle}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {safeScore >= 80
              ? 'Your resume demonstrates high-density technical and experiential alignment with this position. Minor keyword tuning will position you as a top-tier candidate.'
              : safeScore >= 60
              ? 'Your resume shows viable transferable qualifications, but lacks several priority keywords and quantifiable impact metrics explicitly highlighted in the job description.'
              : 'Significant gaps were detected between your resume content and the core competencies demanded by this role. Follow the recommended high-impact revisions below to pass ATS screening.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Matched Competencies</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Keyword Gaps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

