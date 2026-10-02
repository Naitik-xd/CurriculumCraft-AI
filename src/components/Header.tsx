import React from 'react';
import {
  GraduationCap,
  Printer,
  Copy,
  Check,
  FolderOpen,
  FileText,
  CalendarDays,
  FileDown,
} from 'lucide-react';
import { AppMode } from '../types/curriculum';

interface HeaderProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenLibrary: () => void;
  onPrint: () => void;
  onCopyContent: () => void;
  copiedContent: boolean;
  onDownloadPdf?: () => void;
  isDownloadingPdf?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  onOpenLibrary,
  onPrint,
  onCopyContent,
  copiedContent,
  onDownloadPdf,
  isDownloadingPdf,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                CurriculumCraft<span className="text-indigo-600 font-black">.ai</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemma Only
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Grades 9–12 Assessments & Monthly Lesson Plans
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => onSelectMode('assessment')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'assessment'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Question Paper</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('lesson_plan')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'lesson_plan'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Monthly Lesson Plan</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Saved Papers / Library */}
          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Open Exam Library"
          >
            <FolderOpen className="w-4 h-4 text-slate-500" />
            <span className="hidden lg:inline">Library</span>
          </button>

          {/* Quick Copy */}
          <button
            type="button"
            onClick={onCopyContent}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Copy active view markdown"
          >
            {copiedContent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Copy MD</span>
              </>
            )}
          </button>

          {/* Download PDF Button */}
          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs disabled:opacity-50"
              title="Download formatted A4 PDF file"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">
                {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}
              </span>
            </button>
          )}

          {/* Print / PDF Button */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
            title="Print or export A4 document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
