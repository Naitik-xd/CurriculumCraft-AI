/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarConfig } from './components/SidebarConfig';
import { QuestionPaperView } from './components/QuestionPaperView';
import { MarkingSchemeView } from './components/MarkingSchemeView';
import { BlueprintView } from './components/BlueprintView';
import { LessonPlanView } from './components/LessonPlanView';
import { ExamLibraryModal } from './components/ExamLibraryModal';
import { PrintModal } from './components/PrintModal';
import { INITIAL_MOCK_PAPER } from './data/initialMockPaper';
import { INITIAL_MOCK_LESSON_PLAN } from './data/initialMockLessonPlan';
import { CURRICULUM_DATA } from './data/curriculumData';
import { executePrint, downloadHtmlFile } from './utils/printHelper';
import { downloadPdfFromElement } from './utils/pdfExporter';
import { GemmaWorkingPlaceholder } from './components/GemmaWorkingPlaceholder';
import {
  GeneratorConfig,
  GeneratedAssessment,
  AppMode,
  LessonPlanConfig,
  GeneratedLessonPlan,
} from './types/curriculum';
import {
  generateAssessmentWithGemma,
  generateLessonPlanWithGemma,
} from './services/openRouterService';
import {
  FileText,
  Award,
  BarChart3,
  Code2,
  BookmarkPlus,
  Printer,
  Copy,
  Check,
  Sparkles,
  Info,
  CheckCircle,
  Cpu,
  CalendarDays,
} from 'lucide-react';

const STORAGE_LIBRARY_KEY = 'curriculumcraft_exam_library';

export default function App() {
  // App Mode: Assessment vs Monthly Lesson Plan
  const [appMode, setAppMode] = useState<AppMode>('assessment');

  // Active Assessment State
  const [currentAssessment, setCurrentAssessment] = useState<GeneratedAssessment>(INITIAL_MOCK_PAPER);
  const [assessmentConfig, setAssessmentConfig] = useState<GeneratorConfig>(INITIAL_MOCK_PAPER.config);
  const [assessmentTab, setAssessmentTab] = useState<'paper' | 'marking' | 'blueprint' | 'markdown'>('paper');

  // Active Lesson Plan State
  const [currentLessonPlan, setCurrentLessonPlan] = useState<GeneratedLessonPlan>(INITIAL_MOCK_LESSON_PLAN);
  const [lessonPlanConfig, setLessonPlanConfig] = useState<LessonPlanConfig>(INITIAL_MOCK_LESSON_PLAN.config);

  // Teacher Custom Directives for AI
  const [teacherCustomPrompt, setTeacherCustomPrompt] = useState<string>('');

  // Generation Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Modals & Notifications
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedContent, setCopiedContent] = useState(false);

  // Saved Exam Papers Library
  const [savedPapers, setSavedPapers] = useState<GeneratedAssessment[]>([]);

  // Load Library on mount
  useEffect(() => {
    try {
      const storedLib = localStorage.getItem(STORAGE_LIBRARY_KEY);
      if (storedLib) {
        const parsed = JSON.parse(storedLib);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPapers(parsed);
        } else {
          setSavedPapers([INITIAL_MOCK_PAPER]);
        }
      } else {
        setSavedPapers([INITIAL_MOCK_PAPER]);
      }
    } catch (e) {
      console.error('Failed to load exam library', e);
      setSavedPapers([INITIAL_MOCK_PAPER]);
    }
  }, []);

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const [rateLimitInfo, setRateLimitInfo] = useState<{ limit: number; remaining: number; resetInMinutes: number }>({
    limit: 30,
    remaining: 30,
    resetInMinutes: 300,
  });

  const refreshRateLimit = async () => {
    try {
      const res = await fetch('/api/rate-limit-status');
      if (res.ok) {
        const data = await res.json();
        setRateLimitInfo(data);
      }
    } catch {
      // offline/fallback mode
    }
  };

  useEffect(() => {
    refreshRateLimit();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setStatusMessage('');
    refreshRateLimit();
    showToast('Generation cancelled & tokens saved.');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (appMode === 'assessment') {
      setStatusMessage('Sending request to Gemma with CBSE assessment rules...');
      try {
        const newAssessment = await generateAssessmentWithGemma(
          assessmentConfig,
          teacherCustomPrompt,
          (status) => setStatusMessage(status),
          controller.signal
        );

        setCurrentAssessment(newAssessment);
        showToast('CBSE Paper & Marking Scheme generated successfully!');

        // Save to library
        const updatedLib = [newAssessment, ...savedPapers.filter(p => p.id !== newAssessment.id)];
        setSavedPapers(updatedLib);
        localStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(updatedLib.slice(0, 20)));
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        const msg = err instanceof Error ? err.message : String(err);
        showToast(`Error: ${msg}`);
      } finally {
        setIsGenerating(false);
        setStatusMessage('');
        abortControllerRef.current = null;
        refreshRateLimit();
      }
    } else {
      // Monthly Lesson Plan Mode
      setStatusMessage(`Architecting ${lessonPlanConfig.month} lesson plan with Gemma...`);
      try {
        const newPlan = await generateLessonPlanWithGemma(
          lessonPlanConfig,
          teacherCustomPrompt,
          (status) => setStatusMessage(status),
          controller.signal
        );

        setCurrentLessonPlan(newPlan);
        showToast(`Monthly Lesson Plan for ${lessonPlanConfig.month} generated successfully!`);
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        const msg = err instanceof Error ? err.message : String(err);
        showToast(`Error: ${msg}`);
      } finally {
        setIsGenerating(false);
        setStatusMessage('');
        abortControllerRef.current = null;
        refreshRateLimit();
      }
    }
  };

  const getActiveTitle = () => {
    if (appMode === 'assessment') {
      return assessmentTab === 'marking'
        ? `Marking Scheme - ${currentAssessment.title}`
        : currentAssessment.title;
    }
    return currentLessonPlan.title;
  };

  const getActiveContainerId = () => {
    if (appMode === 'assessment') {
      return assessmentTab === 'marking'
        ? 'curriculumcraft-marking-scheme-container'
        : 'curriculumcraft-question-paper-container';
    }
    return 'curriculumcraft-lesson-plan-container';
  };

  const getActiveMarkdown = () => {
    if (appMode === 'assessment') {
      return assessmentTab === 'marking'
        ? currentAssessment.markingSchemeMarkdown
        : currentAssessment.studentPaperMarkdown;
    }
    return currentLessonPlan.planMarkdown;
  };

  const handlePrint = () => {
    // Open Print Modal with print triggers and downloads
    setIsPrintModalOpen(true);
    // Also directly attempt window.print()
    executePrint(getActiveTitle());
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const containerId = getActiveContainerId();
      const filename = `${getActiveTitle().replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      const ok = await downloadPdfFromElement(containerId, filename);
      if (ok) {
        showToast('A4 PDF Document downloaded!');
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyContentMarkdown = async () => {
    const textToCopy = getActiveMarkdown();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedContent(true);
      showToast('Markdown copied to clipboard!');
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (e) {
      showToast('Could not copy to clipboard.');
    }
  };

  const handleSaveToLibrary = () => {
    const exists = savedPapers.some(p => p.id === currentAssessment.id);
    let updated: GeneratedAssessment[];
    if (exists) {
      updated = savedPapers.map(p => (p.id === currentAssessment.id ? currentAssessment : p));
    } else {
      updated = [currentAssessment, ...savedPapers];
    }
    setSavedPapers(updated);
    localStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(updated.slice(0, 25)));
    showToast('Saved to your exam library!');
  };

  const handleDeletePaper = (paperId: string) => {
    const updated = savedPapers.filter(p => p.id !== paperId);
    setSavedPapers(updated);
    localStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(updated));
    showToast('Assessment removed from library.');
  };

  const handleSelectPaper = (paper: GeneratedAssessment) => {
    setCurrentAssessment(paper);
    setAssessmentConfig(paper.config);
    setAppMode('assessment');
    showToast(`Loaded: ${paper.title}`);
  };

  // Find subject display name
  const currentGradeSubjects = CURRICULUM_DATA[currentAssessment.grade] || [];
  const currentSub = currentGradeSubjects.find(s => s.id === currentAssessment.config.subjectId);
  const currentSubjectName = currentSub ? currentSub.name : currentAssessment.subjectName;

  return (
    <div className="min-h-screen bg-slate-50 bg-dot-grid text-slate-800 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 no-print text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Print and Export Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={getActiveTitle()}
        targetContainerId={getActiveContainerId()}
        markdownContent={getActiveMarkdown()}
      />

      {/* Library Modal */}
      <ExamLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedPapers={savedPapers}
        onSelectPaper={handleSelectPaper}
        onDeletePaper={handleDeletePaper}
      />

      {/* Dashboard Top Header */}
      <Header
        mode={appMode}
        onSelectMode={setAppMode}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onPrint={handlePrint}
        onCopyContent={handleCopyContentMarkdown}
        copiedContent={copiedContent}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Banner Announcement / Status */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-sm border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                {appMode === 'assessment' ? 'CBSE Assessment Architect' : 'Monthly Pedagogical Tracker (NEP 2020)'}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Grades 9–12 NCERT Rationalized Syllabus
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              {appMode === 'assessment' ? currentAssessment.title : currentLessonPlan.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              {appMode === 'assessment'
                ? `${currentAssessment.grade} • ${currentSubjectName} • ${currentAssessment.totalMarks} Marks (${currentAssessment.config.durationMinutes} mins) • ${currentAssessment.config.difficulty.toUpperCase()}`
                : `${currentLessonPlan.grade} • ${currentLessonPlan.subjectName} • Month: ${currentLessonPlan.month} • ${currentLessonPlan.config.totalPeriods} Teaching Periods`}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {appMode === 'assessment' && (
              <button
                type="button"
                onClick={handleSaveToLibrary}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save to Library</span>
              </button>
            )}
            <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white border border-indigo-500 shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-indigo-200" />
              <span>Gemma 2 Powered</span>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Config + Workspace Tabs */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Config Stepper / Sidebar */}
          <SidebarConfig
            mode={appMode}
            onSelectMode={setAppMode}
            config={assessmentConfig}
            onChangeConfig={setAssessmentConfig}
            lessonPlanConfig={lessonPlanConfig}
            onChangeLessonPlanConfig={setLessonPlanConfig}
            teacherCustomPrompt={teacherCustomPrompt}
            onChangeTeacherCustomPrompt={setTeacherCustomPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            statusMessage={statusMessage}
            onCancelGeneration={handleCancelGeneration}
            rateLimitInfo={rateLimitInfo}
          />

          {/* Right Column: Tabbed Preview Workspace */}
          <div className="flex-1 w-full min-w-0 flex flex-col space-y-4">
            {appMode === 'assessment' ? (
              <>
                {/* Workspace Tab Bar for Assessment */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 no-print overflow-x-auto">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      type="button"
                      onClick={() => setAssessmentTab('paper')}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        assessmentTab === 'paper'
                          ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Student Question Paper</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssessmentTab('marking')}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        assessmentTab === 'marking'
                          ? 'bg-white text-amber-700 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Teacher Marking Scheme</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssessmentTab('blueprint')}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        assessmentTab === 'blueprint'
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">CBSE Blueprint</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssessmentTab('markdown')}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        assessmentTab === 'markdown'
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Code2 className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">Raw Markdown</span>
                    </button>
                  </div>

                  <div className="hidden xl:flex items-center space-x-2 text-xs text-slate-500 font-medium">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>LaTeX rendered via KaTeX</span>
                  </div>
                </div>

                {/* Tab Views */}
                <div className="w-full">
                  {isGenerating ? (
                    <GemmaWorkingPlaceholder
                      metadata={assessmentConfig.schoolMetadata}
                      grade={assessmentConfig.grade}
                      subjectName={currentSubjectName}
                      statusMessage={statusMessage}
                      mode="assessment"
                      onCancel={handleCancelGeneration}
                    />
                  ) : (
                    <>
                      {assessmentTab === 'paper' && (
                        <QuestionPaperView
                          markdown={currentAssessment.studentPaperMarkdown}
                          metadata={currentAssessment.config.schoolMetadata}
                          grade={currentAssessment.grade}
                          subjectName={currentSubjectName}
                          onUpdateMarkdown={newMd => {
                            setCurrentAssessment({
                              ...currentAssessment,
                              studentPaperMarkdown: newMd,
                            });
                            showToast('Question paper updated.');
                          }}
                          onPrint={handlePrint}
                        />
                      )}

                      {assessmentTab === 'marking' && (
                        <MarkingSchemeView
                          markdown={currentAssessment.markingSchemeMarkdown}
                          metadata={currentAssessment.config.schoolMetadata}
                          grade={currentAssessment.grade}
                          subjectName={currentSubjectName}
                          onUpdateMarkdown={newMd => {
                            setCurrentAssessment({
                              ...currentAssessment,
                              markingSchemeMarkdown: newMd,
                            });
                            showToast('Marking scheme updated.');
                          }}
                          onPrint={handlePrint}
                        />
                      )}

                      {assessmentTab === 'blueprint' && (
                        <BlueprintView
                          config={currentAssessment.config}
                          subjectName={currentSubjectName}
                        />
                      )}

                      {assessmentTab === 'markdown' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <h3 className="text-sm font-bold text-slate-900">
                              Exportable Markdown with LaTeX Equations
                            </h3>
                            <button
                              type="button"
                              onClick={handleCopyContentMarkdown}
                              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Full Markdown</span>
                            </button>
                          </div>
                          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-xs font-mono max-h-[600px] leading-relaxed select-all">
                            {`# PART 1: STUDENT QUESTION PAPER\n\n${currentAssessment.studentPaperMarkdown}\n\n# PART 2: TEACHER MARKING SCHEME\n\n${currentAssessment.markingSchemeMarkdown}`}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              /* MONTHLY LESSON PLAN WORKSPACE */
              isGenerating ? (
                <GemmaWorkingPlaceholder
                  metadata={{
                    schoolName: lessonPlanConfig.schoolName,
                    examName: `MONTHLY LESSON PLAN (${lessonPlanConfig.month.toUpperCase()})`,
                    academicSession: lessonPlanConfig.academicSession,
                    subjectCode: '',
                    timeAllowed: `${lessonPlanConfig.totalPeriods} Periods`,
                    maxMarks: 100,
                  }}
                  grade={lessonPlanConfig.grade}
                  subjectName={currentSubjectName}
                  statusMessage={statusMessage}
                  mode="lesson_plan"
                  onCancel={handleCancelGeneration}
                />
              ) : (
                <LessonPlanView
                  lessonPlan={currentLessonPlan}
                  onUpdatePlan={updated => {
                    setCurrentLessonPlan(updated);
                    showToast('Lesson plan updated.');
                  }}
                  onPrint={handlePrint}
                />
              )
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 bg-white/80 backdrop-blur-sm text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800">CurriculumCraft AI</span>
            <span>&bull;</span>
            <span>Indian CBSE/NCERT Pedagogical Architecture (Grades 9–12)</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <span>Made with ❤️ by</span>
            <a
              href="https://na1t1k.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors cursor-pointer"
            >
              naitik
            </a>
          </div>

          <div className="flex items-center space-x-3 text-slate-500">
            <span>Gemma 2 Powered</span>
            <span>&bull;</span>
            <span>A4 Print & PDF Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
