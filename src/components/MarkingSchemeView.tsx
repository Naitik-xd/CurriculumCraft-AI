import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import { SchoolMetadata } from '../types/curriculum';
import { executePrint } from '../utils/printHelper';
import { downloadPdfFromElement } from '../utils/pdfExporter';
import {
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Edit3,
  ShieldAlert,
  Award,
  FileDown,
  Loader2,
} from 'lucide-react';

interface MarkingSchemeViewProps {
  markdown: string;
  metadata: SchoolMetadata;
  grade: string;
  subjectName: string;
  onUpdateMarkdown?: (newMarkdown: string) => void;
  onPrint?: () => void;
}

export const MarkingSchemeView: React.FC<MarkingSchemeViewProps> = ({
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
      executePrint(`Marking Scheme - ${metadata.schoolName}`);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const fileName = `${grade}_${subjectName}_Marking_Scheme`;
      await downloadPdfFromElement('curriculumcraft-marking-scheme-container', fileName);
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
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-xs no-print">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white">
            Teacher Confidential
          </span>
          <span className="text-xs text-slate-600 font-medium hidden sm:inline">
            Step-by-step partial credit rubrics & key equations
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
                <span>Save Rubric</span>
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
              <span>Edit Rubric</span>
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
                <span>Copy Rubric</span>
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
            <span>Print Rubric</span>
          </button>
        </div>
      </div>

      {/* Main Rubric Sheet */}
      <div
        id="curriculumcraft-marking-scheme-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12 print:p-0 print:border-none print:shadow-none print-full-width"
      >
        {/* Confidential Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Strictly Confidential &bull; For Evaluator Use Only</span>
            </div>
            <div className="text-xs font-extrabold text-slate-600">
              CBSE BENCHMARK RUBRIC
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            TEACHER MARKING SCHEME & MODEL ANSWERS
          </h1>
          <div className="text-sm font-bold text-slate-700 mt-1 uppercase">
            {metadata.schoolName || 'ABC PUBLIC SCHOOL'} &bull; {metadata.examName} ({metadata.academicSession})
          </div>

          {/* Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 py-2 px-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs font-semibold text-slate-800 print:bg-transparent print:border-black">
            <div>
              <span className="text-slate-600">Class:</span> <span className="font-bold">{grade}</span>
            </div>
            <div>
              <span className="text-slate-600">Subject:</span>{' '}
              <span className="font-bold">{metadata.subjectCode || subjectName}</span>
            </div>
            <div>
              <span className="text-slate-600">Max Marks:</span>{' '}
              <span className="font-extrabold text-indigo-700 print:text-black">{metadata.maxMarks}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-600">Rubric Standard:</span>{' '}
              <span className="font-bold text-emerald-700">CBSE Marking Code</span>
            </div>
          </div>
        </div>

        {/* Pedagogical Guidance Banner */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-1 print:hidden">
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>CBSE Evaluation Guidelines for Examiners:</span>
          </div>
          <p>
            1. Award partial credit according to the step indicators in bold brackets (e.g. <strong>[½ Mark]</strong>, <strong>[1 Mark]</strong>).
          </p>
          <p>
            2. In numerical calculations, full credit must be given if the method is correct even if an arithmetic slip occurs (deduct only ½ mark for final computation).
          </p>
          <p>
            3. Balanced equations require correct state symbols where mandated; alternative correct chemical representations or IUPAC names should receive full credit.
          </p>
        </div>

        {/* Rubric Content */}
        {isEditing ? (
          <div className="space-y-3 no-print">
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

        {/* Bottom Verification */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-600 font-medium print:mt-8">
          *** CONFIDENTIAL MARKING SCHEME CONCLUDED &bull; PRESERVE UNDER SECURE CUSTODY ***
        </div>
      </div>
    </div>
  );
};
