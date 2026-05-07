import { Trophy, ShieldCheck, Sparkles } from 'lucide-react';
import type { Session } from '../types';

interface PerfectCaseSummaryModalProps {
  session: Session;
  zoneName: string;
  onContinue: () => void;
}

export function PerfectCaseSummaryModal({ session, zoneName, onContinue }: PerfectCaseSummaryModalProps) {
  const hintFree = session.attempts.every(attempt => attempt.hintsUsed === 0);
  const singleAttemptClears = session.attempts.every(attempt => attempt.attemptsUsed === 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-10 border border-amber-100 mx-4">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="text-amber-500" size={48} />
          <div>
            <p className="text-sm uppercase tracking-wide text-amber-600 font-semibold">Perfect Case</p>
            <h2 className="text-3xl font-bold text-slate-900">Flawless work on {zoneName}</h2>
          </div>
        </div>

        <p className="text-slate-700 mb-6">
          Every puzzle in this case was solved without slipping. Keep chasing these clean runs for extra prestige!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
            <div className="text-xs text-emerald-700 font-semibold mb-1">First-Try Solves</div>
            <div className="text-2xl font-bold text-emerald-900">{session.firstTrySolves || 0}</div>
            <div className="text-xs text-emerald-700 mt-1">All puzzles cracked on the opening move.</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="text-xs text-indigo-700 font-semibold mb-1">Best Streak</div>
            <div className="text-2xl font-bold text-indigo-900">{session.bestStreak || 0}</div>
            <div className="text-xs text-indigo-700 mt-1">Continuous solves without a stumble.</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="text-xs text-amber-700 font-semibold mb-1">Puzzles Cleared</div>
            <div className="text-2xl font-bold text-amber-900">{session.puzzlesCompleted}</div>
            <div className="text-xs text-amber-700 mt-1">Zero hints and no retries across the case.</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm text-slate-800">
            <ShieldCheck className="text-emerald-600" size={18} />
            <span>{hintFree ? 'No hints taken' : 'Hints minimized'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-800">
            <Sparkles className="text-amber-500" size={18} />
            <span>{singleAttemptClears ? 'All first-attempt clears' : 'Fast clears with minimal retries'}</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
        >
          Bask in the glory
        </button>
      </div>
    </div>
  );
}

