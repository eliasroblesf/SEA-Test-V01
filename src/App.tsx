import React, { useState, useEffect } from 'react';
import { ExamMode, Question, ExamAttempt, ExamPreset, ModuleScore } from './types';
import { examPresets, generateExamQuestions, generateAttemptAuthCode } from './data';
import { Header } from './components/Header';
import { ExamSelector } from './components/ExamSelector';
import { ExamView } from './components/ExamView';
import { ResultsView } from './components/ResultsView';

export default function App() {
  const [view, setView] = useState<'select' | 'exam' | 'results'>('select');
  const [activeMode, setActiveMode] = useState<ExamMode>('m1_2');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [studentName, setStudentName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);

  // Persistent attempt history in client-side localStorage
  const [attemptHistory, setAttemptHistory] = useState<ExamAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('sea_exam_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sea_exam_history', JSON.stringify(attemptHistory));
    } catch {
      // Safe fallback if storage quota exceeded
    }
  }, [attemptHistory]);

  const activePreset = examPresets.find((p) => p.id === activeMode) || examPresets[0];

  const handleStartExam = (mode: ExamMode, name: string, id: string) => {
    setActiveMode(mode);
    setStudentName(name);
    setStudentId(id);

    // Generate randomized questions from pool
    const randomizedQuestions = generateExamQuestions(mode);
    setCurrentQuestions(randomizedQuestions);
    setView('exam');
  };

  const handleSubmitExam = (userAnswers: Record<string, string>, timeSpentSeconds: number) => {
    const now = new Date();
    let correctCount = 0;
    const moduleMap: Record<number, { name: string; total: number; correct: number }> = {};

    currentQuestions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctAnswer;
      if (isCorrect) correctCount++;

      if (!moduleMap[q.module]) {
        moduleMap[q.module] = {
          name: q.moduleName.split(':')[0],
          total: 0,
          correct: 0,
        };
      }
      moduleMap[q.module].total++;
      if (isCorrect) moduleMap[q.module].correct++;
    });

    const totalQuestions = currentQuestions.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;

    // GBCI Scaled Score model: Range 125 to 200, with 170 passing (corresponding to 70% threshold)
    // Scaled formula: 125 + (percentage / 100) * 75
    const scaledScore = Math.round(125 + (scorePercentage / 100) * 75);
    const passed = scaledScore >= 170; // Equivalent to >= 60-70% standard

    const moduleScores: ModuleScore[] = Object.keys(moduleMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map((modNum) => {
        const item = moduleMap[modNum];
        return {
          moduleNumber: modNum,
          moduleName: item.name,
          total: item.total,
          correct: item.correct,
          percentage: item.total > 0 ? (item.correct / item.total) * 100 : 0,
        };
      });

    // Formatted date and time strings
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const authCode = generateAttemptAuthCode(studentName, now, correctCount);

    const newAttempt: ExamAttempt = {
      id: `attempt-${now.getTime()}`,
      examMode: activeMode,
      examTitle: activePreset.name,
      studentName,
      studentId: studentId || undefined,
      authCode,
      timestamp: now.toISOString(),
      formattedDate,
      formattedTime,
      totalQuestions,
      correctCount,
      scorePercentage,
      scaledScore,
      passed,
      timeSpentSeconds,
      userAnswers,
      moduleScores,
    };

    setCurrentAttempt(newAttempt);
    setAttemptHistory((prev) => [newAttempt, ...prev]);
    setView('results');
  };

  const handleRetakeExam = () => {
    // Generate fresh randomized questions
    const randomizedQuestions = generateExamQuestions(activeMode);
    setCurrentQuestions(randomizedQuestions);
    setView('exam');
  };

  const handleViewPastAttempt = (attempt: ExamAttempt) => {
    setCurrentAttempt(attempt);
    // If questions aren't loaded or differ, re-construct or keep current
    if (currentQuestions.length === 0) {
      setCurrentQuestions(generateExamQuestions(attempt.examMode));
    }
    setView('results');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local exam history?')) {
      setAttemptHistory([]);
      localStorage.removeItem('sea_exam_history');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <Header
        onResetToHome={() => setView('select')}
        isExamInProgress={view === 'exam'}
      />

      <main className="flex-1">
        {view === 'select' && (
          <ExamSelector
            onStartExam={handleStartExam}
            attemptHistory={attemptHistory}
            onClearHistory={handleClearHistory}
            onViewPastAttempt={handleViewPastAttempt}
          />
        )}

        {view === 'exam' && (
          <ExamView
            preset={activePreset}
            questions={currentQuestions}
            studentName={studentName}
            studentId={studentId}
            onSubmitExam={handleSubmitExam}
            onQuitExam={() => setView('select')}
          />
        )}

        {view === 'results' && currentAttempt && (
          <ResultsView
            attempt={currentAttempt}
            questions={currentQuestions}
            onRetake={handleRetakeExam}
            onHome={() => setView('select')}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-300">
            Sustainability Excellence Associate (SEA) Independent Practice Examination Engine
          </p>
          <p className="text-slate-500">
            Standalone Client HTML Application • Question Pools 1–6 (240 Questions) • Zero External AI Dependencies
          </p>
        </div>
      </footer>
    </div>
  );
}
