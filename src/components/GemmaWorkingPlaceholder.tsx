import React, { useEffect, useState } from 'react';
import { SchoolMetadata } from '../types/curriculum';
import { Sparkles, Brain, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface GemmaWorkingPlaceholderProps {
  metadata: SchoolMetadata;
  grade: string;
  subjectName: string;
  statusMessage?: string;
  mode?: 'assessment' | 'lesson_plan';
  onCancel?: () => void;
}

export const GemmaWorkingPlaceholder: React.FC<GemmaWorkingPlaceholderProps> = ({
  metadata,
  grade,
  subjectName,
  statusMessage,
  mode = 'assessment',
  onCancel,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine active step based on elapsed time (typical ~35-45s for Gemma)
  const step = secondsElapsed < 8 ? 1 : secondsElapsed < 22 ? 2 : secondsElapsed < 36 ? 3 : 4;

  const isAssessment = mode === 'assessment';

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Official Header Preview on Paper Canvas */}
      <div className="bg-white rounded-2xl border border-indigo-200/90 shadow-sm p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        {/* Soft background pulse */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-transparent to-transparent pointer-events-none" />

        {/* Academic School Header Bar */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                CBSE Affiliated Academic Evaluation
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {metadata.schoolName || 'ABC PUBLIC SCHOOL'}
              </h1>
              <div className="text-sm font-bold text-slate-700 mt-0.5 uppercase">
                {metadata.examName || 'PERIODIC ASSESSMENT'} &bull; SESSION {metadata.academicSession || '2026-2027'}
              </div>
            </div>

            {/* Candidate Roll Number Grid */}
            <div className="border border-slate-800 p-2 rounded bg-slate-50">
              <div className="text-[10px] font-bold text-slate-800 uppercase mb-1 tracking-wider text-center">
                Candidate Roll Number
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-7 border border-slate-800 rounded-xs flex items-center justify-center text-xs font-mono font-bold text-slate-400 bg-white"
                  >
                    &nbsp;
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 px-3 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200">
            <div>
              <span className="text-slate-600">Class:</span> <span className="font-bold">{grade}</span>
            </div>
            <div>
              <span className="text-slate-600">Subject:</span>{' '}
              <span className="font-bold">{metadata.subjectCode || subjectName}</span>
            </div>
            <div>
              <span className="text-slate-600">Time Allowed:</span>{' '}
              <span className="font-bold">{metadata.timeAllowed || '45 Mins'}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-600">Maximum Marks:</span>{' '}
              <span className="font-black text-indigo-700">{metadata.maxMarks}</span>
            </div>
          </div>
        </div>

        {/* Gemma Active Generation Centerpiece */}
        <div className="my-8 py-8 px-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border-2 border-dashed border-indigo-200/90 text-center relative flex flex-col items-center">
          {/* Animated Brain / Gemma Icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
              <Brain className="w-8 h-8" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gemma Powered</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gemma is working on your {isAssessment ? 'question paper' : 'lesson plan'}...
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-md font-medium">
            Please wait! Gemma is authoring high-yield questions according to the latest rationalized NCERT curriculum.
          </p>

          {/* Real-time Timer Counter */}
          <div className="flex items-center space-x-2 mt-4 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
            <span>
              Time elapsed: <strong className="text-indigo-700 font-bold">{secondsElapsed}s</strong> &bull; Gemma typically takes ~30–45s
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-slate-200 rounded-full h-2 mt-5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(95, Math.max(15, secondsElapsed * 2.3))}%` }}
            />
          </div>

          {/* Pipeline Checklist */}
          <div className="w-full max-w-md mt-6 space-y-2 text-left text-xs">
            <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              {step > 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              )}
              <span className={step >= 1 ? 'font-bold text-slate-800' : 'text-slate-400'}>
                1. Parsing NCERT syllabus & {grade} {subjectName} learning outcomes
              </span>
            </div>

            <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              {step > 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : step === 2 ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span className={step >= 2 ? 'font-bold text-slate-800' : 'text-slate-400'}>
                2. Structuring {isAssessment ? 'CBSE section blueprints (MCQ, VSA, SA, Case Study)' : 'weekly instructional periods'}
              </span>
            </div>

            <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              {step > 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : step === 3 ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span className={step >= 3 ? 'font-bold text-slate-800' : 'text-slate-400'}>
                3. Authoring {isAssessment ? 'Student Question Paper & LaTeX equations' : 'Monthly Curricular Plan & Activities'}
              </span>
            </div>

            <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              {step === 4 ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span className={step === 4 ? 'font-bold text-slate-800' : 'text-slate-400'}>
                4. Compiling {isAssessment ? 'Teacher Marking Scheme & Step Rubrics' : 'Administrative Endorsement & Diary'}
              </span>
            </div>
          </div>

          {statusMessage && (
            <div className="mt-4 text-xs text-indigo-700 font-medium italic">
              &ldquo;{statusMessage}&rdquo;
            </div>
          )}

          {/* Cancel Generation Button */}
          {onCancel && (
            <div className="mt-6 flex flex-col items-center">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-400 active:scale-98 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Cancel Generation & Save Tokens</span>
              </button>
              <span className="text-[11px] text-slate-400 mt-1.5 font-medium">
                Aborts model execution immediately to preserve token quotas
              </span>
            </div>
          )}
        </div>

        {/* Paper bottom note */}
        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
          Official CBSE Format &bull; High Resolution KaTeX &bull; A4 Printable
        </div>
      </div>
    </div>
  );
};
