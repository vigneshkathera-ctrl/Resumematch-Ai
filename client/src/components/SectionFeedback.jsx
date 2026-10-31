import React from 'react';
import { UserCheck, Code2, Briefcase, FolderGit2 } from 'lucide-react';

export const SectionFeedback = ({ sectionFeedback = {} }) => {
  const sections = [
    {
      key: 'summary',
      title: 'Professional Summary',
      icon: UserCheck,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
      content: sectionFeedback?.summary || 'No specific critique provided for the summary section.'
    },
    {
      key: 'skills',
      title: 'Technical & Core Skills',
      icon: Code2,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
      content: sectionFeedback?.skills || 'No specific critique provided for the skills section.'
    },
    {
      key: 'experience',
      title: 'Work Experience & Impact',
      icon: Briefcase,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
      content: sectionFeedback?.experience || 'No specific critique provided for work experience.'
    },
    {
      key: 'projects',
      title: 'Key Projects & Portfolio',
      icon: FolderGit2,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900',
      content: sectionFeedback?.projects || 'No specific critique provided for projects.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Section-by-Section Feedback
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Targeted ATS & Recruiter Guidance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.key}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-xl border ${section.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                    {section.title}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

