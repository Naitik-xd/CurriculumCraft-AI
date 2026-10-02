import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import { GeneratedLessonPlan } from '../types/curriculum';
import { executePrint } from '../utils/printHelper';
import { downloadPdfFromElement } from '../utils/pdfExporter';
import {
  CalendarDays,
  Printer,
  Copy,
  Check,
  Edit3,
  FileDown,
  BookOpen,
  TableProperties,
  Award,
  Loader2,
} from 'lucide-react';

interface LessonPlanViewProps {
  lessonPlan: GeneratedLessonPlan;
  onUpdatePlan?: (updated: GeneratedLessonPlan) => void;
  onPrint?: () => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  lessonPlan,
  onUpdatePlan,
  onPrint,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'schedule'>('plan');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(lessonPlan.planMarkdown);
  const [editedSchedule, setEditedSchedule] = useState(lessonPlan.scheduleMarkdown);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  React.useEffect(() => {
    setEditedPlan(lessonPlan.planMarkdown);
    setEditedSchedule(lessonPlan.scheduleMarkdown);
  }, [lessonPlan]);

  const handleSaveEdit = () => {
    onUpdatePlan?.({
      ...lessonPlan,
      planMarkdown: editedPlan,
      scheduleMarkdown: editedSchedule,
    });
    setIsEditing(false);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      executePrint(lessonPlan.title);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const fileName = `${lessonPlan.grade}_${lessonPlan.subjectName}_LessonPlan_${lessonPlan.month}`;
      await downloadPdfFromElement('curriculumcraft-lesson-plan-container', fileName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyMarkdown = async () => {
    const textToCopy = activeSubTab === 'plan' ? editedPlan : editedSchedule;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-xs no-print">
        {/* Sub-tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveSubTab('plan')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'plan'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curricular Lesson Plan</span>
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'schedule'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Week-by-Week Tracker</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setEditedPlan(lessonPlan.planMarkdown);
                  setEditedSchedule(lessonPlan.scheduleMarkdown);
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100/80 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Plan</span>
            </button>
          )}

          <button
            onClick={handleCopyMarkdown}
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
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print A4 Plan</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div
        id="curriculumcraft-lesson-plan-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12 print:p-0 print:border-none print:shadow-none print-full-width"
      >
        {isEditing ? (
          <div className="space-y-3 no-print">
            <div className="text-xs text-slate-600 font-medium">
              Editing{' '}
              {activeSubTab === 'plan' ? 'Curricular Lesson Plan' : 'Week-by-Week Tracker'}.
              All markdown updates will re-render automatically.
            </div>
            {activeSubTab === 'plan' ? (
              <textarea
                value={editedPlan}
                onChange={e => setEditedPlan(e.target.value)}
                rows={28}
                className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed"
              />
            ) : (
              <textarea
                value={editedSchedule}
                onChange={e => setEditedSchedule(e.target.value)}
                rows={28}
                className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed"
              />
            )}
          </div>
        ) : (
          <div className="print-question-block">
            <MathRenderer content={activeSubTab === 'plan' ? editedPlan : editedSchedule} />
          </div>
        )}
      </div>
    </div>
  );
};
