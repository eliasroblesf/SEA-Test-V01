export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  key: OptionKey;
  text: string;
}

export interface Question {
  id: string; // e.g. "m1-q1"
  globalNumber: number; // 1 to 240
  module: number; // 1 to 6
  moduleName: string;
  topic: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: OptionKey;
  explanation?: string;
}

export type ExamMode = 'm1_2' | 'm3_4' | 'm5_6' | 'full';

export interface ExamPreset {
  id: ExamMode;
  name: string;
  badge: string;
  modules: number[];
  moduleTitles: string[];
  questionCount: number;
  timeLimitMinutes: number;
  description: string;
}

export interface ModuleScore {
  moduleNumber: number;
  moduleName: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface ExamAttempt {
  id: string;
  authCode: string;
  studentName: string;
  studentId?: string;
  examMode: ExamMode;
  examTitle: string;
  timestamp: string;
  formattedDate: string;
  formattedTime: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  answeredCount?: number;
  correctCount: number;
  scorePercentage: number;
  scaledScore: number; // 125-200 scale, GBCI passing threshold 170
  passed: boolean; // >= 70% or scaled >= 170
  moduleScores: ModuleScore[];
  userAnswers: Record<string, string>;
  flaggedQuestionIds?: string[];
  questions?: Question[];
}

export type AppView = 'select' | 'exam' | 'results';
