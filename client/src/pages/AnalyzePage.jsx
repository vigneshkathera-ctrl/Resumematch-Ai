import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../services/authService';
import {
  UploadCloud,
  FileText,
  X,
  AlertTriangle,
  AlertCircle,
  Clock,
  Sparkles,
  Loader2,
  FileUp,
  CheckCircle2
} from 'lucide-react';

const SAMPLE_JOB_DESCRIPTION = `Senior Full Stack Engineer - AI Powered Platforms
Company: NextGen Systems Inc.
Location: San Francisco, CA (Hybrid / Remote options)

About the Role:
We are looking for an experienced Senior Full Stack Engineer to lead the architecture, design, and development of our next-generation AI-powered cloud applications. You will collaborate closely with AI researchers, product managers, and UI/UX designers to bring high-performance web products to life.

Key Responsibilities:
- Architect and develop robust, highly-available web applications and distributed microservices using Node.js, Express, and React.
- Integrate modern LLMs and generative AI APIs (e.g., Google Gemini, OpenAI) into user-facing workflows with streaming responses and structured outputs.
- Design performant MongoDB and PostgreSQL data models, caching layers with Redis, and optimized aggregation pipelines.
- Implement CI/CD pipelines, containerized deployments using Docker, and cloud infrastructure management on AWS/GCP.
- Champion engineering best practices, conduct thorough code reviews, ensure comprehensive test automation (Jest, Cypress), and mentor mid-level and junior engineers.
- Drive web performance optimization, accessibility standards (WCAG), and application security (OWASP standards, JWT authentication, rate limiting).

Required Qualifications:
- 4+ years of professional full-stack software development experience with JavaScript / TypeScript, Node.js, and React.
- Strong proficiency with NoSQL databases (MongoDB / Mongoose) and relational databases (PostgreSQL).
- Proven track record in designing RESTful APIs, microservices, and asynchronous event-driven architectures.
- Hands-on experience with cloud deployment, Docker containers, and CI/CD pipelines.
- Familiarity with AI/LLM integration (prompt engineering, model serving, or GenAI SDKs) is a huge plus.
- Excellent problem-solving skills, ownership mindset, and clear communication.`;

export const AnalyzePage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError({
        type: 'invalid_format',
        message: 'Invalid file type. Please upload a PDF document (.pdf).'
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError({
        type: 'file_too_large',
        message: 'File size exceeds 5 MB. Please upload a smaller PDF resume.'
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteSampleJD = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError({
        type: 'missing_file',
        message: 'Please attach your resume PDF before submitting.'
      });
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setError({
        type: 'short_jd',
        message: 'Please paste a comprehensive job description (at least 30 characters).'
      });
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      setIsSubmitting(true);
      setStatusMessage('Extracting plain text from PDF resume...');

      const timer = setTimeout(() => {
        setStatusMessage('Evaluating resume against job requirements with Gemini AI...');
      }, 1500);

      const timer2 = setTimeout(() => {
        setStatusMessage('Computing ATS score, missing keywords & bullet improvements...');
      }, 4000);

      const response = await analysisService.analyze(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      clearTimeout(timer);
      clearTimeout(timer2);

      if (response.success && response.data?._id) {
        navigate(`/results/${response.data._id}`, { state: { analysis: response.data } });
      }
    } catch (err) {
      const resp = err.response?.data;
      const status = err.response?.status;

      if (resp?.isScannedPdf) {
        setError({
          type: 'scanned_pdf',
          title: 'Scanned or Image-Only PDF Detected',
          message:
            'The uploaded resume contains no extractable text. ATS parsers cannot read scanned images. Please export a text-selectable PDF from Google Docs, MS Word, or Canva.'
        });
      } else if (status === 429) {
        setError({
          type: 'rate_limit',
          title: 'Analysis Rate Limit Reached',
          message:
            'You have exceeded the hourly analysis quota. Please wait a few moments before submitting another resume.'
        });
      } else {
        setError({
          type: 'server_error',
          title: 'Analysis Failed',
          message:
            resp?.message ||
            'An unexpected error occurred while communicating with the AI service. Please verify your file and try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setStatusMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-brand-200 dark:border-brand-900">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>New Analysis</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Evaluate Your Resume Match
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Upload your resume in PDF format, paste the job description, and receive an instant ATS score with rewrite recommendations.
        </p>
      </div>

      {/* Error state banners */}
      {error && (
        <div className="mb-6 rounded-2xl p-5 border bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 shadow-sm transition-all animate-in fade-in">
          <div className="flex items-start space-x-3">
            {error.type === 'scanned_pdf' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            ) : error.type === 'rate_limit' ? (
              <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {error.title || 'Submission Notice'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {error.message}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Upload PDF */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Upload Resume PDF
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              PDF only • Max 5 MB
            </span>
          </div>

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 scale-[0.99]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                Drag & Drop your resume PDF here
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                or click to browse your computer files. Text will be securely extracted in memory.
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Browse PDF File
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • PDF Document
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for parsing</span>
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Paste Job Description */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Paste Job Description
              </h3>
            </div>
            <button
              type="button"
              onClick={handlePasteSampleJD}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1 self-start sm:self-auto"
            >
              <span>+ Paste Sample Tech Lead JD</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={8}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here (responsibilities, required skills, tools, experience expectations)..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-sm leading-relaxed transition-all"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-1">
              <span>Includes ATS keywords, requirements & qualifications</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !file || !jobDescription.trim()}
            className="w-full flex items-center justify-center space-x-2.5 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.005] active:scale-[0.995]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{statusMessage || 'Analyzing Resume with Gemini AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run Intelligent Resume Match</span>
              </>
            )}
          </button>

          {isSubmitting && (
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3 animate-pulse">
              This process typically takes 5–10 seconds while the LLM parses skills, verifies requirements, and rewrites bullet points.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

