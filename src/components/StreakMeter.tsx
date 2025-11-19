import { Flame, Award, Sparkles } from 'lucide-react';

interface StreakMeterProps {
  current: number;
  best: number;
  firstTrySolves: number;
  perfectEligible?: boolean;
}

export function StreakMeter({ current, best, firstTrySolves, perfectEligible = true }: StreakMeterProps) {
  const progress = Math.min(100, (current / (best || 1)) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 min-w-[200px] space-y-3 border border-indigo-100">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span className="flex items-center gap-2 font-semibold text-indigo-700">
          <Flame size={16} className="text-amber-500" />
          Streak
        </span>
        <span className="text-indigo-900 font-bold">{current} 🔥</span>
      </div>

      <div className="h-2 w-full bg-indigo-50 rounded-full overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="flex items-center gap-2">
          <Award size={14} className="text-purple-500" />
          Best: {best}
        </span>
        <span className="flex items-center gap-1">
          <Sparkles size={14} className="text-emerald-500" />
          First-try: {firstTrySolves}
        </span>
      </div>

      <div
        className={`text-xs font-semibold px-3 py-2 rounded-xl text-center ${
          perfectEligible
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}
      >
        {perfectEligible ? 'Perfect case streak intact' : 'Perfect case bonus lost this run'}
      </div>
    </div>
  );
}

