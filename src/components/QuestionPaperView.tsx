import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import { SchoolMetadata } from '../types/curriculum';
import { executePrint } from '../utils/printHelper';
import { downloadPdfFromElement } from '../utils/pdfExporter';
import {
  FileText,
  Printer,
  Edit3,
  Check,
  FileDown,
  Copy,
  Loader2,
} from 'lucide-react';

interface QuestionPaperViewProps {
  markdown: string;
  metadata: SchoolMetadata;
  grade: string;
  subjectName: string;
  onUpdateMarkdown?: (newMarkdown: string) => void;
  onPrint?: () => void;
}

export const QuestionPaperView: React.FC<QuestionPaperViewProps> = ({
  markdown,
  metadata,
  grade,
  subjectName,
  onUpdateMarkdown,
  onPrint,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(markdown);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  React.useEffect(() => {
    setEditedText(markdown);
  }, [markdown]);

  const handleSaveEdit = () => {
    onUpdateMarkdown?.(editedText);
    setIsEditing(false);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      executePrint(`${metadata.schoolName} - ${metadata.examName}`);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const fileName = `${grade}_${subjectName}_Question_Paper`;
      await downloadPdfFromElement('curriculumcraft-question-paper-container', fileName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Action Toolbar on Top of Preview (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-xs no-print">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white">
            Official CBSE Format
          </span>
          <span className="text-xs text-slate-600 font-medium hidden sm:inline">
            Print-optimized A4 & LaTeX rendered
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Edits</span>
              </button>
              <button
                onClick={() => {
                  setEditedText(markdown);
                  setIsEditing(false);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Paper</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy MD</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
            title="Download formatted A4 PDF file"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                <span>PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Paper</span>
          </button>
        </div>
      </div>

      {/* Main Paper Content Container (A4 styling) */}
      <div
        id="curriculumcraft-question-paper-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12 print:p-0 print:border-none print:shadow-none print-full-width"
      >
        {/* Academic Exam Header with Roll Number Box for Student */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
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

            {/* Roll Number Box */}
            <div className="border border-slate-800 p-2 rounded bg-slate-50/50 print:bg-transparent">
              <div className="text-[10px] font-bold text-slate-800 uppercase mb-1 tracking-wider text-center">
                Candidate Roll Number
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-7 border border-slate-800 rounded-xs flex items-center justify-center text-xs font-mono font-bold text-slate-400 bg-white print:border-black"
                  >
                    &nbsp;
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 px-3 bg-slate-100/80 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200/60 print:bg-transparent print:border-t print:border-b print:border-black print:rounded-none">
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
              <span className="font-black text-indigo-700 print:text-black">{metadata.maxMarks}</span>
            </div>
          </div>
        </div>

        {/* Paper Content: Either Editor or Math-Rendered Preview */}
        {isEditing ? (
          <div className="space-y-3 no-print">
            <div className="text-xs text-slate-600 font-medium">
              You can edit the markdown and LaTeX directly below. Changes will re-render in real-time.
            </div>
            <textarea
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              rows={28}
              className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed"
            />
          </div>
        ) : (
          <div className="print-question-block">
            <MathRenderer content={markdown} />
          </div>
        )}

        {/* Bottom Paper Verification Note */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-600 font-medium print:mt-8">
          *** END OF QUESTION PAPER &bull; VERIFY ALL SECTIONS BEFORE SUBMISSION ***
        </div>
      </div>
    </div>
  );
};
