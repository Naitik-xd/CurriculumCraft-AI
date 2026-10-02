import React from 'react';
import { GeneratedAssessment } from '../types/curriculum';
import {
  FolderOpen,
  Calendar,
  BookOpen,
  Trash2,
  ExternalLink,
  X,
  FileCheck,
  Download,
} from 'lucide-react';

interface ExamLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPapers: GeneratedAssessment[];
  onSelectPaper: (paper: GeneratedAssessment) => void;
  onDeletePaper: (paperId: string) => void;
}

export const ExamLibraryModal: React.FC<ExamLibraryModalProps> = ({
  isOpen,
  onClose,
  savedPapers,
  onSelectPaper,
  onDeletePaper,
}) => {
  if (!isOpen) return null;

  const downloadPaper = (paper: GeneratedAssessment) => {
    const fullText = `# ${paper.title}\n\n${paper.studentPaperMarkdown}\n\n---\n\n${paper.markingSchemeMarkdown}`;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${paper.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Exam Paper Library
              </h3>
              <p className="text-[11px] text-slate-700 font-medium">
                {savedPapers.length} assessment{savedPapers.length === 1 ? '' : 's'} saved in local workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Saved Papers */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedPapers.length === 0 ? (
            <div className="text-center py-12 text-slate-700 text-xs">
              No saved exam papers found. Click "Save to Library" on any generated test!
            </div>
          ) : (
            savedPapers.map(paper => (
              <div
                key={paper.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {paper.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {paper.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {paper.totalMarks} Marks
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {paper.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-700">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span>{paper.config.schoolMetadata.schoolName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => downloadPaper(paper)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Download Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeletePaper(paper.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete paper"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectPaper(paper);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
