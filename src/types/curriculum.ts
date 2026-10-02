export type Grade = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export interface Chapter {
  id: string;
  name: string;
  recommendedMarks?: number;
  typicalSubtopics?: string[];
}

export interface SubjectInfo {
  id: string;
  name: string;
  code?: string;
  iconName: string;
  chapters: Chapter[];
}

export type AssessmentType = 'slip_test' | 'unit_test' | 'periodic_assessment' | 'board_specimen';

export interface AssessmentPreset {
  id: AssessmentType;
  label: string;
  defaultMarks: number;
  durationMinutes: number;
  description: string;
  sectionsDistribution: {
    mcq: number; // 1 mark
    vsa: number; // 2 marks
    sa: number;  // 3 marks
    la: number;  // 5 marks
    caseStudy: number; // 4 marks
  };
}

export type DifficultyLevel = 'foundation' | 'standard' | 'hots';

export interface SchoolMetadata {
  schoolName: string;
  examName: string;
  academicSession: string;
  subjectCode: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstructions?: string[];
}

export interface GeneratorConfig {
  grade: Grade;
  subjectId: string;
  selectedChapterIds: string[];
  focusSubtopics: string[];
  assessmentType: AssessmentType;
  totalMarks: number;
  durationMinutes: number;
  difficulty: DifficultyLevel;
  questionBlend: {
    includeMcq: boolean;
    includeVsa: boolean;
    includeSa: boolean;
    includeLa: boolean;
    includeCaseStudy: boolean;
  };
  schoolMetadata: SchoolMetadata;
}

export interface GeneratedAssessment {
  id: string;
  createdAt: string;
  config: GeneratorConfig;
  rawResponse: string;
  studentPaperMarkdown: string;
  markingSchemeMarkdown: string;
  title: string;
  grade: Grade;
  subjectName: string;
  totalMarks: number;
}

export type AcademicMonth =
  | 'April'
  | 'May'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December'
  | 'January'
  | 'February';

export interface LessonPlanConfig {
  grade: Grade;
  subjectId: string;
  selectedChapterIds: string[];
  month: AcademicMonth;
  academicSession: string;
  totalPeriods: number;
  schoolName: string;
  teacherName: string;
  focusPedagogy: string[];
  includeArtIntegration: boolean;
  includeLabExperiments: boolean;
  includeRemedialStrategy: boolean;
}

export interface GeneratedLessonPlan {
  id: string;
  createdAt: string;
  config: LessonPlanConfig;
  title: string;
  grade: Grade;
  subjectName: string;
  month: AcademicMonth;
  planMarkdown: string;
  scheduleMarkdown: string;
}

export type AppMode = 'assessment' | 'lesson_plan';
