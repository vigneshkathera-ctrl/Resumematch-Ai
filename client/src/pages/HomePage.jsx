import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileSearch,
  Zap,
  Target,
  BarChart3,
  Sliders
} from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-brand-200 dark:border-brand-900 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Next-Generation Resume Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          Beat the ATS. Match the Role.{' '}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Land the Interview.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload your resume PDF and paste target job descriptions. Uncover hidden keyword deficits, calculate match density, and transform passive bullet points into high-impact XYZ achievements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? '/analyze' : '/register'}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{isAuthenticated ? 'Start Resume Analysis' : 'Get Started Free'}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-base border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              Sign In to Existing Account
            </Link>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Zero Data Selling</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>In-Memory PDF Extraction</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Strict Anti-Hallucination AI</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Rigorous Career Engineering
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Generic AI rewrites fabricate false qualifications. ResumeMatch AI preserves total factual integrity while optimizing ATS ranking metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Objective Match Scoring
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Get an unvarnished 0–100 score calculating experiential depth, technical synergy, and qualification coverage against the employer's exact requirements.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Keyword Gap Diagnostics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Instantly discover missing terminology, frameworks, and methodologies required by ATS parsers before your resume ever reaches human eyes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              XYZ Bullet Rewriting
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert passive duty descriptions into high-leverage accomplishments: "Accomplished [X], as measured by [Y], by doing [Z]" with 1-click copy.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 bg-slate-100/60 dark:bg-slate-900/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
          Three Simple Steps to Higher Callback Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Upload Resume PDF</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag and drop your existing PDF resume (up to 5 MB). Pure text is extracted in memory.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Paste Job Description</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste the full job posting from LinkedIn, Indeed, Greenhouse, or Lever.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Review & Export</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect scores, replace weak bullets, integrate keywords, and print or save the audit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

