import React from 'react';
import { ShieldCheck, BookOpen, Clock, Award } from 'lucide-react';

interface HeaderProps {
  onResetToHome?: () => void;
  isExamInProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetToHome, isExamInProgress }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          onClick={isExamInProgress ? undefined : onResetToHome}
          className={`flex items-center gap-3 ${!isExamInProgress && onResetToHome ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">SEA Mock Test Engine</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Standalone Client HTML
              </span>
            </div>
            <p className="text-xs text-slate-400">Sustainability Excellence Associate Practice Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>2-Hour Timed Window</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Authenticated PDF Reports</span>
          </div>
        </div>
      </div>
    </header>
  );
};
