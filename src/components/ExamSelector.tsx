import React, { useState } from 'react';
import { ExamPreset, ExamMode, ExamAttempt } from '../types';
import { examPresets } from '../data';
import { generateAttemptPDF } from '../utils/pdfGenerator';
import { 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Award, 
  User, 
  FileText, 
  History, 
  ChevronRight, 
  Download,
  Info,
  Shield,
  Layers
} from 'lucide-react';

interface ExamSelectorProps {
  onStartExam: (mode: ExamMode, studentName: string, studentId: string) => void;
  attemptHistory: ExamAttempt[];
  onClearHistory: () => void;
  onViewPastAttempt: (attempt: ExamAttempt) => void;
}

export const ExamSelector: React.FC<ExamSelectorProps> = ({
  onStartExam,
  attemptHistory,
  onClearHistory,
  onViewPastAttempt,
}) => {
  const [selectedMode, setSelectedMode] = useState<ExamMode>('m1_2');
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('sea_student_name') || '';
  });
  const [studentId, setStudentId] = useState<string>(() => {
    return localStorage.getItem('sea_student_id') || '';
  });
  const [nameError, setNameError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'history'>('presets');

  const handleStart = (mode: ExamMode) => {
    if (!studentName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    localStorage.setItem('sea_student_name', studentName.trim());
    if (studentId.trim()) {
      localStorage.setItem('sea_student_id', studentId.trim());
    }
    onStartExam(mode, studentName.trim(), studentId.trim());
  };

  const selectedPreset = examPresets.find((p) => p.id === selectedMode) || examPresets[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Award className="w-3.5 h-3.5" />
            ISSP Sustainability Excellence Associate (SEA) Preparation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Official Course Mock Examination Suite
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Practice for the SEA certification with verified question pools. Complete randomized 80-question module tests or the comprehensive 100-question course mock exam. Receive immediate performance diagnostics and an authenticated, time-stamped score certificate upon completion.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
              <div className="text-emerald-400 text-lg font-bold">240</div>
              <div className="text-xs text-slate-300">Verified Questions</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
              <div className="text-emerald-400 text-lg font-bold">2 Hours</div>
              <div className="text-xs text-slate-300">Time Limit / Try</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
              <div className="text-emerald-400 text-lg font-bold">Unlimited</div>
              <div className="text-xs text-slate-300">Practice Attempts</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
              <div className="text-emerald-400 text-lg font-bold">100% Offline</div>
              <div className="text-xs text-slate-300">Zero AI / Client-Only</div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Profile Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Candidate Information (For Time-Stamped Certificate)</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Please enter your full name. Your name and submission timestamp will be cryptographically linked to your downloaded PDF score document to authenticate individual completion and prevent unauthorized sharing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (e.target.value.trim()) setNameError(false);
              }}
              placeholder="e.g. Elena Rostova or John D. Miller"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                nameError
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/30'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {nameError && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                Please enter your name before starting the assessment.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Student ID / Cohort Reference (Optional)
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. STU-2026-084 or Cohort B"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>
        </div>
      </div>

      {/* Tabs: Select Exam vs Attempt History */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Select Practice Exam
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            Previous Attempts ({attemptHistory.length})
          </button>
        </div>

        {activeTab === 'history' && attemptHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-medium text-red-600 hover:text-red-700 transition"
          >
            Clear History
          </button>
        )}
      </div>

      {activeTab === 'presets' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPresets.map((preset) => {
              const isSelected = selectedMode === preset.id;
              const isFull = preset.id === 'full';

              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedMode(preset.id)}
                  className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition border-2 flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {isFull && (
                    <div className="absolute -top-3 right-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      Comprehensive Simulator
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {preset.badge} • 120 Mins
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                      {preset.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="space-y-1 mb-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Covered Modules:
                      </div>
                      {preset.moduleTitles.map((title, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span className="truncate">{title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStart(preset.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 mt-2 ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>Begin Test ({preset.badge})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Test Parameters & Guidelines */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
              <Info className="w-4 h-4 text-emerald-600" />
              Examination Guidelines & Authenticated Certification Rules
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">2-Hour Time Limit</strong>
                  You have up to 120 minutes to complete the assessment. The live timer counts down from 02:00:00. If time expires, your answers will auto-submit.
                </div>
              </div>
              <div className="flex gap-2">
                <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">Anti-Sharing Authentication</strong>
                  Each submission generates a verifiable digital authentication code and localized timestamp on your downloadable PDF score report.
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">Instant In-Depth Feedback</strong>
                  Detailed scoring metrics, scaled GBCI benchmarks (passing is 170+), and comprehensive question-by-question explanations appear instantly.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Previous Attempts History */
        <div className="space-y-4">
          {attemptHistory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No Previous Attempts Recorded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Completed exam attempts will be logged here with date stamps, scores, and downloadable PDF reports.
              </p>
              <button
                onClick={() => setActiveTab('presets')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Choose an Exam to Start
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {attemptHistory.map((attempt) => (
                <div
                  key={attempt.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {attempt.examTitle}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          attempt.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attempt.passed ? 'PASSED' : 'NOT PASSED'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Candidate: <strong>{attempt.studentName}</strong></span>
                      <span>•</span>
                      <span>{attempt.formattedDate} at {attempt.formattedTime}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        Auth: {attempt.authCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {attempt.scorePercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {attempt.correctCount}/{attempt.totalQuestions} ({attempt.scaledScore}/200)
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewPastAttempt(attempt)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => generateAttemptPDF(attempt)}
                        className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                        title="Download Authenticated PDF Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
