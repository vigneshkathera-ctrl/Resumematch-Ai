import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { analysisService } from '../services/authService';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillChips } from '../components/SkillChips';
import { SectionFeedback } from '../components/SectionFeedback';
import { BulletComparison } from '../components/BulletComparison';
import { ActionList } from '../components/ActionList';
import { formatDate } from '../utils/formatDate';
import {
  Printer,
  ArrowLeft,
  Trash2,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  Share2
} from 'lucide-react';

export const ResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // If analysis was passed via navigation state, no need to re-fetch immediately unless missing
    if (!analysis && id) {
      const fetchAnalysis = async () => {
        try {
          setLoading(true);
          const response = await analysisService.getAnalysisById(id);
          if (response.success && response.data) {
            setAnalysis(response.data);
          } else {
            setError('Analysis record could not be loaded.');
          }
        } catch (err) {
          setError(
            err.response?.data?.message || 'Failed to retrieve analysis report. Please try again.'
          );
        } finally {
          setLoading(false);
        }
      };

      fetchAnalysis();
    }
  }, [id, analysis]);

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analysis report from your history?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await analysisService.deleteAnalysis(id);
      navigate('/history');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete analysis.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600 dark:text-brand-400" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading evaluation report...
        </p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analysis Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {error || 'The requested analysis record does not exist or has been removed.'}
        </p>
        <div className="pt-4">
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-500 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Create New Analysis</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 print-page">
      {/* Top action header (hidden during printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            to="/analyze"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Analyze"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Evaluation Report
            </span>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(analysis.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-brand-500" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
            title="Delete this analysis"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Print header visible only on paper/PDF export */}
      <div className="hidden print:block pb-4 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold">ResumeMatch AI - ATS Evaluation Report</h1>
        <p className="text-xs text-gray-600">
          Generated on {formatDate(analysis.createdAt)} for role: {analysis.jobTitle}
        </p>
      </div>

      {/* 1. Circular Score Gauge */}
      <section className="print-break-inside-avoid">
        <ScoreGauge score={analysis.matchScore} jobTitle={analysis.jobTitle} />
      </section>

      {/* 2. Matched Skills & Missing Keywords */}
      <section className="print-break-inside-avoid">
        <SkillChips
          matchedSkills={analysis.matchedSkills}
          missingKeywords={analysis.missingKeywords}
        />
      </section>

      {/* 3. Top 5 Actions */}
      <section className="print-break-inside-avoid">
        <ActionList topActions={analysis.topActions} />
      </section>

      {/* 4. Section-Wise Feedback */}
      <section className="print-break-inside-avoid">
        <SectionFeedback sectionFeedback={analysis.sectionFeedback} />
      </section>

      {/* 5. Original vs Improved Bullet Points */}
      <section className="print-break-inside-avoid">
        <BulletComparison improvedBullets={analysis.improvedBullets} />
      </section>

      {/* Bottom Navigation */}
      <div className="no-print pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
        <Link
          to="/history"
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
        >
          ← View All Saved Analyses
        </Link>
        <Link
          to="/analyze"
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-xs"
        >
          Analyze Another Position →
        </Link>
      </div>
    </div>
  );
};

