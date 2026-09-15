import React, { useState, useEffect } from 'react';
import { ExamAttempt, Question } from '../types';
import { generateAttemptPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  ListChecks, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  User,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface ResultsViewProps {
  attempt: ExamAttempt;
  questions: Question[];
  onRetake: () => void;
  onHome: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attempt,
  questions,
  onRetake,
  onHome,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Trigger confetti if passed
  useEffect(() => {
    if (attempt.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [attempt.passed]);

  const filteredQuestions = questions.filter((q) => {
    const userAnswer = attempt.userAnswers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (filterMode === 'incorrect') return !isCorrect;
    if (filterMode === 'correct') return isCorrect;
    return true;
  });

  const minutesSpent = Math.floor(attempt.timeSpentSeconds / 60);
  const secondsSpent = attempt.timeSpentSeconds % 60;
  const avgSecondsPerQ = Math.round(attempt.timeSpentSeconds / attempt.totalQuestions);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Assessment Outcome & Instant Diagnostic
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {attempt.examTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Candidate: <strong className="text-slate-800">{attempt.studentName}</strong>
            {attempt.studentId && ` (${attempt.studentId})`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <button
            onClick={() => generateAttemptPDF(attempt)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Authenticated PDF</span>
          </button>
        </div>
      </div>

      {/* Security & Authentication Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Verifiable Assessment Record
              </span>
              <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">
                {attempt.authCode}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Completed on <strong className="text-white">{attempt.formattedDate}</strong> at{' '}
              <strong className="text-white">{attempt.formattedTime}</strong>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 max-w-sm md:text-right">
          Time-stamped audit record prevents unauthorized document sharing and confirms independent candidate completion.
        </div>
      </div>

      {/* Hero Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Raw Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Raw Score
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {attempt.correctCount} <span className="text-base font-normal text-slate-400">/ {attempt.totalQuestions}</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{attempt.scorePercentage.toFixed(1)}%</span> accuracy
          </div>
        </div>

        {/* Scaled Score (GBCI 125-200) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Scaled Score (GBCI)
          </span>
          <div className={`text-3xl font-extrabold ${attempt.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
            {attempt.scaledScore} <span className="text-base font-normal text-slate-400">/ 200</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Passing Threshold: <strong>170 / 200</strong>
          </div>
        </div>

        {/* Result Status */}
        <div
          className={`rounded-2xl p-5 border shadow-xs ${
            attempt.passed
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-red-50/60 border-red-200'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Certification Standing
          </span>
          <div
            className={`text-2xl font-extrabold flex items-center gap-2 ${
              attempt.passed ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {attempt.passed ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                <span>PASSED</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                <span>NEEDS REVIEW</span>
              </>
            )}
          </div>
          <div className="text-xs text-slate-600 mt-2">
            {attempt.passed ? 'Demonstrates SEA competency' : 'Score fell below 170 threshold'}
          </div>
        </div>

        {/* Pacing & Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Pacing & Duration
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {minutesSpent}m {secondsSpent}s
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Avg {avgSecondsPerQ}s / question</span>
          </div>
        </div>
      </div>

      {/* Module Breakdown Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Module Performance Breakdown
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Target: 70%+ Mastery</span>
        </div>

        <div className="space-y-3 pt-2">
          {attempt.moduleScores.map((m) => {
            const isStrong = m.percentage >= 75;
            const isCompetent = m.percentage >= 60 && !isStrong;

            return (
              <div key={m.moduleNumber} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <span className="text-sm font-bold text-slate-800">
                    {m.moduleName}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-600">
                      {m.correct} of {m.total} correct
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-xs ${
                        isStrong
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCompetent
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {m.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isStrong
                        ? 'bg-emerald-600'
                        : isCompetent
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-by-Question Review with Explanations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Detailed Question Review & Explanations
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterMode === 'incorrect'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Incorrect Only ({questions.length - attempt.correctCount})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterMode === 'correct'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Correct Only ({attempt.correctCount})
            </button>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No questions match the current filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const userAnswer = attempt.userAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              const isExpanded = expandedId === q.id || filterMode === 'incorrect';

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition ${
                    isCorrect
                      ? 'border-slate-200 bg-white'
                      : 'border-red-200 bg-red-50/20'
                  }`}
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">
                            Item {idx + 1} (Q{q.globalNumber})
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {q.topic}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCorrect
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {isCorrect ? 'Correct' : userAnswer ? 'Incorrect' : 'Unanswered'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 leading-snug">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                      {/* Options breakdown */}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isPicked = userAnswer === opt.key;
                          const isRight = q.correctAnswer === opt.key;

                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                                isRight
                                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                                  : isPicked
                                  ? 'bg-red-50 border-red-300 text-red-900 font-medium'
                                  : 'bg-slate-50/50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded font-bold text-[11px] flex items-center justify-center shrink-0 ${
                                  isRight
                                    ? 'bg-emerald-600 text-white'
                                    : isPicked
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span className="leading-relaxed flex-1">{opt.text}</span>
                              {isRight && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                                  Correct Answer
                                </span>
                              )}
                              {isPicked && !isRight && (
                                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded shrink-0">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200 text-emerald-950 space-y-1">
                        <strong className="block text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                          Pedagogical Explanation:
                        </strong>
                        <p className="leading-relaxed text-xs text-slate-800">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={onHome}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
        >
          Return to Exam Menu
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetake}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake This Exam</span>
          </button>
          <button
            onClick={() => generateAttemptPDF(attempt)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Official PDF Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
