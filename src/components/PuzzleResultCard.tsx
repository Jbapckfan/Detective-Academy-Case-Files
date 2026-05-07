import { CheckCircle2, XCircle, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';
import type { Difficulty, PuzzleType } from '../types';

interface NextClue {
  title: string;
  detail: string;
}

interface PuzzleResultCardProps {
  solved: boolean;
  puzzleType: PuzzleType;
  difficulty: Difficulty;
  timeTaken: number;
  attemptsUsed: number;
  hintsUsed: number;
  isFirstTry: boolean;
  companionReaction?: string;
  nextClue?: NextClue;
  streakSnapshot?: { current: number; best: number; firstTrySolves: number };
  onContinue: () => void;
}

const typeLabels: Record<PuzzleType, string> = {
  sequence: 'Sequence',
  mirror: 'Light & Mirrors',
  gear: 'Gears',
  logic: 'Logic',
  spatial: 'Spatial'
};

export function PuzzleResultCard({
  solved,
  puzzleType,
  difficulty,
  timeTaken,
  attemptsUsed,
  hintsUsed,
  isFirstTry,
  companionReaction,
  nextClue,
  streakSnapshot,
  onContinue
}: PuzzleResultCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 border border-slate-100">
        <div className="flex items-start gap-4 mb-6">
          {solved ? (
            <CheckCircle2 className="text-emerald-500" size={48} />
          ) : (
            <XCircle className="text-rose-500" size={48} />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  solved ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {solved ? 'Case Detail Solved' : 'Lead Missed'}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                {typeLabels[puzzleType]} · {difficulty}
              </span>
            </div>
            <p className="text-lg text-slate-800 font-semibold leading-snug">
              {companionReaction ||
                (solved
                  ? 'Nice work! Your solve keeps the investigation on track.'
                  : 'We stumbled here, but the investigation continues.')} 
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-sm text-slate-500">Time</div>
            <div className="text-xl font-bold text-slate-900">{timeTaken}s</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-sm text-slate-500">Attempts</div>
            <div className="text-xl font-bold text-slate-900">{attemptsUsed}</div>
            {isFirstTry && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <Sparkles size={14} /> First try!
              </div>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-sm text-slate-500">Hints Used</div>
            <div className="text-xl font-bold text-slate-900">{hintsUsed}</div>
          </div>
        </div>

        {streakSnapshot && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="text-xs text-amber-700 font-semibold mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-amber-900">{streakSnapshot.current}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
              <div className="text-xs text-indigo-700 font-semibold mb-1">Best Streak</div>
              <div className="text-2xl font-bold text-indigo-900">{streakSnapshot.best}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
              <div className="text-xs text-emerald-700 font-semibold mb-1">First-Try Solves</div>
              <div className="text-2xl font-bold text-emerald-900">{streakSnapshot.firstTrySolves}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-start">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-2">
              <Lightbulb size={16} /> Case Hook
            </div>
            <div className="text-sm text-indigo-900 font-bold mb-1">{nextClue?.title || 'Next steps'}</div>
            <p className="text-sm text-indigo-800 whitespace-pre-line">
              {nextClue?.detail || 'Stay sharp—another piece of the mystery is waiting.'}
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

