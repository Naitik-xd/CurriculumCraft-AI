import React, { useState } from 'react';
import {
  Grade,
  GeneratorConfig,
  AssessmentType,
  DifficultyLevel,
  AppMode,
  LessonPlanConfig,
  AcademicMonth,
} from '../types/curriculum';
import { CURRICULUM_DATA, ASSESSMENT_PRESETS } from '../data/curriculumData';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Building,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Check,
  CheckSquare,
  Square,
  Cpu,
  Layers,
  FlaskConical,
  Palette,
  Users,
  XCircle,
} from 'lucide-react';

interface SidebarConfigProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  config: GeneratorConfig;
  onChangeConfig: (newConfig: GeneratorConfig) => void;
  lessonPlanConfig: LessonPlanConfig;
  onChangeLessonPlanConfig: (newPlanConfig: LessonPlanConfig) => void;
  teacherCustomPrompt: string;
  onChangeTeacherCustomPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  statusMessage?: string;
  onCancelGeneration?: () => void;
  rateLimitInfo?: { limit: number; remaining: number; resetInMinutes: number };
}

const MONTHS: AcademicMonth[] = [
  'April',
  'May',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
];

export const SidebarConfig: React.FC<SidebarConfigProps> = ({
  mode,
  onSelectMode,
  config,
  onChangeConfig,
  lessonPlanConfig,
  onChangeLessonPlanConfig,
  teacherCustomPrompt,
  onChangeTeacherCustomPrompt,
  onGenerate,
  isGenerating,
  statusMessage,
  onCancelGeneration,
  rateLimitInfo,
}) => {
  const [isSchoolDetailsOpen, setIsSchoolDetailsOpen] = useState(false);
  const [subtopicInput, setSubtopicInput] = useState('');

  const grades: Grade[] = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const activeGrade = mode === 'assessment' ? config.grade : lessonPlanConfig.grade;
  const availableSubjects = CURRICULUM_DATA[activeGrade] || [];
  
  const currentSubjectId = mode === 'assessment' ? config.subjectId : lessonPlanConfig.subjectId;
  const currentSubject = availableSubjects.find(s => s.id === currentSubjectId) || availableSubjects[0];

  const handleGradeChange = (newGrade: Grade) => {
    const newSubjects = CURRICULUM_DATA[newGrade] || [];
    const firstSub = newSubjects[0];
    const initialChapters = firstSub?.chapters.slice(0, 2).map(c => c.id) || [];

    if (mode === 'assessment') {
      onChangeConfig({
        ...config,
        grade: newGrade,
        subjectId: firstSub?.id || '',
        selectedChapterIds: initialChapters,
        focusSubtopics: [],
        schoolMetadata: {
          ...config.schoolMetadata,
          subjectCode: firstSub?.name ? `${firstSub.name.toUpperCase()} (${firstSub.code || 'CBSE'})` : 'CBSE',
        }
      });
    } else {
      onChangeLessonPlanConfig({
        ...lessonPlanConfig,
        grade: newGrade,
        subjectId: firstSub?.id || '',
        selectedChapterIds: initialChapters,
      });
    }
  };

  const handleSubjectChange = (newSubjectId: string) => {
    const subj = availableSubjects.find(s => s.id === newSubjectId);
    const initialChapters = subj?.chapters.slice(0, 2).map(c => c.id) || [];

    if (mode === 'assessment') {
      onChangeConfig({
        ...config,
        subjectId: newSubjectId,
        selectedChapterIds: initialChapters,
        focusSubtopics: [],
        schoolMetadata: {
          ...config.schoolMetadata,
          subjectCode: subj ? `${subj.name.toUpperCase()} (${subj.code || 'CBSE'})` : 'CBSE',
        }
      });
    } else {
      onChangeLessonPlanConfig({
        ...lessonPlanConfig,
        subjectId: newSubjectId,
        selectedChapterIds: initialChapters,
      });
    }
  };

  const toggleChapter = (chapterId: string) => {
    const currentList = mode === 'assessment' ? config.selectedChapterIds : lessonPlanConfig.selectedChapterIds;
    const exists = currentList.includes(chapterId);
    let updated: string[];

    if (exists) {
      if (currentList.length === 1) return; // Keep at least 1
      updated = currentList.filter(id => id !== chapterId);
    } else {
      updated = [...currentList, chapterId];
    }

    if (mode === 'assessment') {
      onChangeConfig({
        ...config,
        selectedChapterIds: updated,
      });
    } else {
      onChangeLessonPlanConfig({
        ...lessonPlanConfig,
        selectedChapterIds: updated,
      });
    }
  };

  const handleSelectAllChapters = () => {
    if (!currentSubject) return;
    const allIds = currentSubject.chapters.map(c => c.id);
    if (mode === 'assessment') {
      onChangeConfig({ ...config, selectedChapterIds: allIds });
    } else {
      onChangeLessonPlanConfig({ ...lessonPlanConfig, selectedChapterIds: allIds });
    }
  };

  const handleClearChapters = () => {
    if (!currentSubject?.chapters[0]) return;
    const reset = [currentSubject.chapters[0].id];
    if (mode === 'assessment') {
      onChangeConfig({ ...config, selectedChapterIds: reset });
    } else {
      onChangeLessonPlanConfig({ ...lessonPlanConfig, selectedChapterIds: reset });
    }
  };

  const handlePresetChange = (presetId: AssessmentType) => {
    const preset = ASSESSMENT_PRESETS[presetId];
    if (!preset) return;

    let timeText = `${preset.durationMinutes} Minutes`;
    if (preset.durationMinutes === 180) timeText = '3 Hours';
    if (preset.durationMinutes === 90) timeText = '1 Hour 30 Minutes';

    onChangeConfig({
      ...config,
      assessmentType: presetId,
      totalMarks: preset.defaultMarks,
      durationMinutes: preset.durationMinutes,
      schoolMetadata: {
        ...config.schoolMetadata,
        maxMarks: preset.defaultMarks,
        timeAllowed: timeText,
      }
    });
  };

  const handleAddSubtopic = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = subtopicInput.trim();
    if (!trimmed) return;
    if (!config.focusSubtopics.includes(trimmed)) {
      onChangeConfig({
        ...config,
        focusSubtopics: [...config.focusSubtopics, trimmed],
      });
    }
    setSubtopicInput('');
  };

  const handleRemoveSubtopic = (topicToRemove: string) => {
    onChangeConfig({
      ...config,
      focusSubtopics: config.focusSubtopics.filter(t => t !== topicToRemove),
    });
  };

  const toggleQuestionBlend = (key: keyof GeneratorConfig['questionBlend']) => {
    onChangeConfig({
      ...config,
      questionBlend: {
        ...config.questionBlend,
        [key]: !config.questionBlend[key],
      }
    });
  };

  const selectedChapterIds = mode === 'assessment' ? config.selectedChapterIds : lessonPlanConfig.selectedChapterIds;

  return (
    <aside className="w-full lg:w-96 shrink-0 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col space-y-5 no-print">
      {/* Mode Indicator / Selector */}
      <div className="p-1 bg-slate-100 rounded-xl flex items-center">
        <button
          type="button"
          onClick={() => onSelectMode('assessment')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
            mode === 'assessment'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Question Paper
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('lesson_plan')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
            mode === 'lesson_plan'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Monthly Lesson Plan
        </button>
      </div>

      {/* Step 1: Grade Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span>1. Select Grade (CBSE / NCERT)</span>
          <span className="text-[10px] text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
            {activeGrade}
          </span>
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
          {grades.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => handleGradeChange(g)}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeGrade === g
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Subject Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span>2. Subject Curriculum</span>
          <span className="text-[11px] font-medium text-slate-500">
            {availableSubjects.length} subjects
          </span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
          {availableSubjects.map(sub => {
            const isSelected = currentSubjectId === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubjectChange(sub.id)}
                className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="truncate">{sub.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Target NCERT Chapters Multi-select */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Target NCERT Chapters ({selectedChapterIds.length})
          </label>
          <div className="flex items-center space-x-2 text-[11px]">
            <button
              type="button"
              onClick={handleSelectAllChapters}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              All
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleClearChapters}
              className="text-slate-500 hover:text-slate-800"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 p-1">
          {currentSubject?.chapters.map(chap => {
            const isChecked = selectedChapterIds.includes(chap.id);
            return (
              <div
                key={chap.id}
                onClick={() => toggleChapter(chap.id)}
                className={`p-2 rounded-lg cursor-pointer flex items-start space-x-2.5 transition-colors text-xs ${
                  isChecked
                    ? 'bg-indigo-50/90 text-indigo-950 font-medium'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-indigo-600">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 fill-indigo-600 text-white" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{chap.name}</div>
                  {chap.typicalSubtopics && chap.typicalSubtopics.length > 0 && (
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      e.g. {chap.typicalSubtopics.slice(0, 2).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODE SPECIFIC CONTROLS */}
      {mode === 'assessment' ? (
        <>
          {/* Assessment Preset */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              4. Assessment Type Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ASSESSMENT_PRESETS).map(preset => {
                const isCurrent = config.assessmentType === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetChange(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {preset.label}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {preset.defaultMarks}M
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {preset.durationMinutes} mins
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Blend Toggles */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              5. Question Blend (CBSE Sections)
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100/60">
                <span className="font-medium">Sec A: MCQs & Assertion-Reason (1M)</span>
                <input
                  type="checkbox"
                  checked={config.questionBlend.includeMcq}
                  onChange={() => toggleQuestionBlend('includeMcq')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100/60">
                <span className="font-medium">Sec B: Very Short Answer (2M)</span>
                <input
                  type="checkbox"
                  checked={config.questionBlend.includeVsa}
                  onChange={() => toggleQuestionBlend('includeVsa')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100/60">
                <span className="font-medium">Sec C: Short Answer (3M)</span>
                <input
                  type="checkbox"
                  checked={config.questionBlend.includeSa}
                  onChange={() => toggleQuestionBlend('includeSa')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100/60">
                <span className="font-medium">Sec D: Case-Based Study (4M)</span>
                <input
                  type="checkbox"
                  checked={config.questionBlend.includeCaseStudy}
                  onChange={() => toggleQuestionBlend('includeCaseStudy')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100/60">
                <span className="font-medium">Sec E: Long Answer / Derivations (5M)</span>
                <input
                  type="checkbox"
                  checked={config.questionBlend.includeLa}
                  onChange={() => toggleQuestionBlend('includeLa')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </>
      ) : (
        /* LESSON PLAN MODE CONTROLS */
        <>
          {/* Target Month Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
              <span>4. Target Academic Month</span>
              <span className="text-[10px] font-bold text-indigo-600">{lessonPlanConfig.month}</span>
            </label>
            <div className="grid grid-cols-5 gap-1 max-h-24 overflow-y-auto">
              {MONTHS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChangeLessonPlanConfig({ ...lessonPlanConfig, month: m })}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                    lessonPlanConfig.month === m
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Total Teaching Periods */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
              <span>5. Periods Budget (Month)</span>
              <span className="text-xs font-black text-slate-900">{lessonPlanConfig.totalPeriods} Periods</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="12"
                max="36"
                step="2"
                value={lessonPlanConfig.totalPeriods}
                onChange={e => onChangeLessonPlanConfig({ ...lessonPlanConfig, totalPeriods: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-600"
              />
              <span className="text-xs font-mono font-bold text-slate-700 w-8 text-right">
                {lessonPlanConfig.totalPeriods}
              </span>
            </div>
          </div>

          {/* Pedagogical Components */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              6. Pedagogical Features
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100">
                <span className="flex items-center space-x-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                  <span>NCERT Core Lab Experiments</span>
                </span>
                <input
                  type="checkbox"
                  checked={lessonPlanConfig.includeLabExperiments}
                  onChange={e => onChangeLessonPlanConfig({ ...lessonPlanConfig, includeLabExperiments: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100">
                <span className="flex items-center space-x-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Art-Integrated Activities (NEP 2020)</span>
                </span>
                <input
                  type="checkbox"
                  checked={lessonPlanConfig.includeArtIntegration}
                  onChange={e => onChangeLessonPlanConfig({ ...lessonPlanConfig, includeArtIntegration: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-700 cursor-pointer hover:bg-slate-100">
                <span className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Remedial & HOTS Enrichment</span>
                </span>
                <input
                  type="checkbox"
                  checked={lessonPlanConfig.includeRemedialStrategy}
                  onChange={e => onChangeLessonPlanConfig({ ...lessonPlanConfig, includeRemedialStrategy: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>
            </div>
          </div>
        </>
      )}

      {/* Collapsible School / Teacher Details */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
        <button
          type="button"
          onClick={() => setIsSchoolDetailsOpen(!isSchoolDetailsOpen)}
          className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-100/60 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-slate-500" />
            <span>School & Educator Header</span>
          </div>
          {isSchoolDetailsOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isSchoolDetailsOpen && (
          <div className="p-3 border-t border-slate-200/80 space-y-2.5 bg-white text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={mode === 'assessment' ? config.schoolMetadata.schoolName : lessonPlanConfig.schoolName}
                onChange={e => {
                  if (mode === 'assessment') {
                    onChangeConfig({
                      ...config,
                      schoolMetadata: { ...config.schoolMetadata, schoolName: e.target.value }
                    });
                  } else {
                    onChangeLessonPlanConfig({ ...lessonPlanConfig, schoolName: e.target.value });
                  }
                }}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {mode === 'assessment' ? 'Exam Name' : 'Educator Name'}
              </label>
              <input
                type="text"
                value={mode === 'assessment' ? config.schoolMetadata.examName : lessonPlanConfig.teacherName}
                onChange={e => {
                  if (mode === 'assessment') {
                    onChangeConfig({
                      ...config,
                      schoolMetadata: { ...config.schoolMetadata, examName: e.target.value }
                    });
                  } else {
                    onChangeLessonPlanConfig({ ...lessonPlanConfig, teacherName: e.target.value });
                  }
                }}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Educator Custom Instructions / Directives for AI */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
          <span>{mode === 'assessment' ? 'Custom Directives for Paper' : 'Custom Directives for Lesson Plan'}</span>
          <span className="text-[10px] text-slate-400 font-normal">Optional</span>
        </label>
        <textarea
          value={teacherCustomPrompt}
          onChange={e => onChangeTeacherCustomPrompt(e.target.value)}
          rows={3}
          placeholder={
            mode === 'assessment'
              ? 'e.g., Include 2 numericals on Kohlrausch law, focus on lens maker formula derivation, make Section C tough, avoid solubility questions...'
              : 'e.g., Emphasize project-based green energy lab, include a zero-period remedial schedule, focus on board exam high-weightage topics...'
          }
          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed placeholder:text-slate-400"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Gemma will prioritize these exact instructions during question setting.
        </p>
      </div>

      {/* Generation Execution Button */}
      <div className="pt-2">
        {/* Rate Limiting Quota Display (30 req / 5 hours) */}
        {rateLimitInfo && (
          <div className="flex items-center justify-between text-[11px] mb-2 px-1">
            <span className="text-slate-500 font-medium">5-Hour Quota:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                rateLimitInfo.remaining === 0
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                  : rateLimitInfo.remaining <= 5
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {rateLimitInfo.remaining} / {rateLimitInfo.limit} requests left
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || selectedChapterIds.length === 0 || (rateLimitInfo?.remaining === 0)}
          className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>
                {mode === 'assessment' ? 'Generating Paper & Rubric...' : 'Architecting Lesson Plan...'}
              </span>
            </>
          ) : rateLimitInfo?.remaining === 0 ? (
            <span>5h Quota Exhausted (Resets in {rateLimitInfo.resetInMinutes}m)</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {mode === 'assessment' ? 'Generate Paper & Rubric' : 'Generate Monthly Lesson Plan'}
              </span>
            </>
          )}
        </button>

        {statusMessage && (
          <p className="mt-2 text-center text-[11px] font-medium text-indigo-700 animate-pulse">
            {statusMessage}
          </p>
        )}

        {/* Cancel Generation Button */}
        {isGenerating && onCancelGeneration && (
          <button
            type="button"
            onClick={onCancelGeneration}
            className="w-full mt-2.5 py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 active:scale-98 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Cancel Generation (Save Tokens)</span>
          </button>
        )}

        <div className="mt-2 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemma Powered &bull; CBSE AI Engine</span>
        </div>
      </div>
    </aside>
  );
};
