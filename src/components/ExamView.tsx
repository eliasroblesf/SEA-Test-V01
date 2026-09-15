import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question, ExamPreset } from '../types';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Send, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2,
  X,
  List,
  Layers,
  AlertTriangle
} from 'lucide-react';

interface ExamViewProps {
  preset: ExamPreset;
  questions: Question[];
  studentName: string;
  studentId: string;
  onSubmitExam: (answers: Record<string, string>, timeSpentSeconds: number) => void;
  onQuitExam: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  preset,
  questions,
  studentName,
  onSubmitExam,
  onQuitExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showPaletteModal, setShowPaletteModal] = useState<boolean>(false);
  const [showQuitModal, setShowQuitModal] = useState<boolean>(false);

  // 2 hours = 120 * 60 = 7200 seconds
  const totalSeconds = preset.timeLimitMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time expires
          onSubmitExam(answers, totalSeconds);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers, totalSeconds, onSubmitExam]);

  const timeSpentSeconds = totalSeconds - secondsRemaining;

  // Format time display MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 360);
    const minutes = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;
  const isTimeCritical = secondsRemaining < 300; // < 5 mins
  const isTimeWarning = secondsRemaining < 900 && !isTimeCritical; // < 15 mins

  const handleSelectOption = useCallback((optionKey: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  }, [currentQ]);

  const handleToggleFlag = () => {
    if (!currentQ) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation for exam speed & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showPaletteModal || showQuitModal) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
      } else if (['a', 'A', '1'].includes(e.key)) {
        handleSelectOption('A');
      } else if (['b', 'B', '2'].includes(e.key)) {
        handleSelectOption('B');
      } else if (['c', 'C', '3'].includes(e.key)) {
        handleSelectOption('C');
      } else if (['d', 'D', '4'].includes(e.key)) {
        handleSelectOption('D');
      } else if (['f', 'F'].includes(e.key)) {
        handleToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalQuestions, showSubmitModal, showPaletteModal, showQuitModal, handleSelectOption]);

  const unansweredIndices = useMemo(() => {
    const list: number[] = [];
    questions.forEach((q, idx) => {
      if (!answers[q.id]) list.push(idx);
    });
    return list;
  }, [questions, answers]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col justify-between">
      {/* Sticky Top Control Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Exam title & Question info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQuitModal(true)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Exit
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{preset.name}</span>
                <span className="text-xs text-slate-500 hidden md:inline">({studentName})</span>
              </div>
              <div className="text-xs text-slate-500">
                Question <strong className="text-slate-800 font-semibold">{currentIndex + 1}</strong> of{' '}
                <strong className="text-slate-800 font-semibold">{totalQuestions}</strong>
              </div>
            </div>
          </div>

          {/* Center: Live Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold transition ${
              isTimeCritical
                ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                : isTimeWarning
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-500' : 'text-slate-500'}`} />
            <span>{formatTime(secondsRemaining)}</span>
            <span className="text-[10px] font-sans text-slate-500 font-normal uppercase hidden sm:inline">
              remaining
            </span>
          </div>

          {/* Right: Palette Toggle & Submit Action */}
          <div className="flex items-center gap-2">
            <button
              id="btn-question-navigator"
              onClick={() => setShowPaletteModal(!showPaletteModal)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <List className="w-3.5 h-3.5" />
              <span>Grid ({answeredCount}/{totalQuestions})</span>
            </button>

            <button
              id="btn-submit-exam-top"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden" id="exam-progress-bar">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Examination Content Body */}
      <div className="max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        {currentQ ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6" id={`question-card-${currentQ.id}`}>
            {/* Question Header & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  Question {currentIndex + 1}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  {currentQ.moduleName.split(':')[0]}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200">
                  {currentQ.topic}
                </span>
              </div>

              <button
                id="btn-flag-question"
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                  flagged[currentQ.id]
                    ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed" id="question-prompt-text">
              {currentQ.question}
            </div>

            {/* Answer Options A, B, C, D */}
            <div className="space-y-3 pt-2" id="question-options-container">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option.key;

                return (
                  <div
                    key={option.key}
                    id={`option-${option.key}`}
                    onClick={() => handleSelectOption(option.key)}
                    className={`cursor-pointer rounded-xl p-4 transition border flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {option.key}
                    </div>

                    <div className="text-sm sm:text-base text-slate-800 flex-1 leading-relaxed">
                      {option.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Bottom Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            id="btn-prev-question"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl border font-semibold text-sm flex items-center gap-2 transition ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-500 hidden sm:block">
            Keyboard shortcuts: <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-700 font-mono">A</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-700 font-mono">B</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-700 font-mono">C</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-700 font-mono">D</kbd> or <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-700 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-700 font-mono">→</kbd>
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              id="btn-next-question"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-submit-exam-bottom"
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition"
            >
              <span>Review & Submit</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Question Grid Drawer / Modal */}
      {showPaletteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Question Navigator</h3>
                <p className="text-xs text-slate-500">
                  Select any number to jump directly. Status: {answeredCount} answered,{' '}
                  {totalQuestions - answeredCount} remaining.
                </p>
              </div>
              <button
                onClick={() => setShowPaletteModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600" />
                <span className="text-slate-700">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-slate-300" />
                <span className="text-slate-700">Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span className="text-slate-700">Flagged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded ring-2 ring-slate-900 bg-slate-200" />
                <span className="text-slate-700">Current</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isFlagged = !!flagged[q.id];
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowPaletteModal(false);
                      }}
                      className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition relative ${
                        isCurrent
                          ? 'ring-2 ring-slate-900 font-extrabold z-10'
                          : ''
                      } ${
                        isFlagged
                          ? 'bg-amber-400 text-slate-900 border border-amber-500'
                          : isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
              <span className="text-xs text-slate-500 font-medium">
                {unansweredIndices.length > 0
                  ? `${unansweredIndices.length} question${unansweredIndices.length > 1 ? 's' : ''} still blank`
                  : 'All questions completed!'}
              </span>
              <button
                onClick={() => setShowPaletteModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Navigator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Assessment?</h3>
                <p className="text-xs text-slate-500">Your attempt will be scored immediately.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Questions Answered:</span>
                <strong>{answeredCount} / {totalQuestions}</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Time Spent:</span>
                <strong>{formatTime(timeSpentSeconds)}</strong>
              </div>
              {unansweredIndices.length > 0 ? (
                <div className="pt-2 text-amber-700 font-semibold flex items-center gap-1.5 border-t border-slate-200">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Warning: You have {unansweredIndices.length} unanswered questions!</span>
                </div>
              ) : (
                <div className="pt-2 text-emerald-700 font-semibold flex items-center gap-1.5 border-t border-slate-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>All questions answered! Ready to score.</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Return to Test
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmitExam(answers, timeSpentSeconds);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Test Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Exit Assessment?</h3>
                <p className="text-xs text-slate-500">Your current test progress will be lost.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to exit? You can take unlimited practice attempts whenever you are ready.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Continue Test
              </button>
              <button
                onClick={onQuitExam}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
