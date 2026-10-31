import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analysisService } from '../services/authService';
import { formatDate, getScoreColor } from '../utils/formatDate';
import {
  History,
  Search,
  Calendar,
  Trash2,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  Plus
} from 'lucide-react';

export const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const res = await analysisService.getAnalyses();
      if (res.success && res.data) {
        setAnalyses(res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load past analyses from database.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis report?')) {
      return;
    }

    try {
      setDeletingId(id);
      await analysisService.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete analysis.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAnalyses = analyses.filter((item) =>
    (item.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Analysis Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Past Resume Analyses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reopen previous evaluations, review keyword scores, and track your optimization progress
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Search Input */}
      {analyses.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm shadow-2xs"
          />
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading analysis history...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No analyses recorded yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Upload your resume PDF and match it against any job description to build your archive.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs sm:text-sm hover:bg-brand-500 shadow-sm"
            >
              <span>Run Your First Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          No analyses matched your search term "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAnalyses.map((item) => {
            const colorScheme = getScoreColor(item.matchScore);
            return (
              <div
                key={item._id}
                onClick={() => navigate(`/results/${item._id}`)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {/* Score badge pill */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border font-bold ${colorScheme.bg} ${colorScheme.border}`}
                  >
                    <span className={`text-xl font-extrabold ${colorScheme.text}`}>
                      {item.matchScore}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 -mt-0.5">
                      score
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {item.jobTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{item.matchedSkills?.length || 0} matched</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>{item.missingKeywords?.length || 0} missing</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline">
                    Open Report →
                  </span>

                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    disabled={deletingId === item._id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete record"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

