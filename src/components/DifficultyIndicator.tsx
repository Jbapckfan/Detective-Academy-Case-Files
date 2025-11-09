import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Brain, Zap, AlertCircle } from 'lucide-react';
import type { AdaptiveState, CognitiveProfiles } from '../types';

interface Props {
  adaptiveState: AdaptiveState | null;
  currentPuzzleIndex: number;
  totalPuzzles: number;
}

const SKILL_NAMES: Record<keyof CognitiveProfiles, string> = {
  patterns: 'Pattern Recognition',
  spatial: 'Spatial Reasoning',
  logic: 'Logic & Deduction',
  lateral: 'Lateral Thinking',
  sequencing: 'Sequential Planning'
};

const SKILL_ICONS: Record<keyof CognitiveProfiles, string> = {
  patterns: '🎯',
  spatial: '🔲',
  logic: '🧩',
  lateral: '💡',
  sequencing: '📊'
};

function DifficultyIndicatorComponent({ adaptiveState, currentPuzzleIndex, totalPuzzles }: Props) {
  if (!adaptiveState) return null;

  const currentPuzzle = adaptiveState.nextPuzzles[currentPuzzleIndex];
  if (!currentPuzzle) return null;

  // Calculate difficulty insights
  const insights = useMemo(() => {
    const profileAverage = Object.values(adaptiveState.profiles).reduce((a, b) => a + b, 0) / 5;
    const weakestValue = adaptiveState.profiles[adaptiveState.weakestSkill];
    const strongestValue = adaptiveState.profiles[adaptiveState.strongestSkill];
    const balanceScore = 100 - (strongestValue - weakestValue);

    const reasons: string[] = [];

    // Why this puzzle type was selected
    if (currentPuzzleIndex < 2) {
      reasons.push(
        `Targeting ${SKILL_NAMES[adaptiveState.weakestSkill]} (${Math.round(weakestValue)}/100) - your area for growth`
      );
    } else if (currentPuzzleIndex < 4) {
      reasons.push('Building balanced skills across multiple areas');
    } else {
      reasons.push(`Reinforcing ${SKILL_NAMES[adaptiveState.strongestSkill]} - maintaining your strengths`);
    }

    // Difficulty explanation
    if (currentPuzzle.difficultyRating < 40) {
      reasons.push('Difficulty set to Easy to build confidence');
    } else if (currentPuzzle.difficultyRating < 70) {
      reasons.push('Difficulty set to Medium to challenge your current skills');
    } else {
      reasons.push('Difficulty set to Hard - pushing your limits!');
    }

    // Progression feedback
    if (adaptiveState.sessionProgression > 5) {
      reasons.push(`Session ${adaptiveState.sessionProgression + 1} - difficulty increasing with your progress`);
    }

    return {
      profileAverage: Math.round(profileAverage),
      weakestValue: Math.round(weakestValue),
      strongestValue: Math.round(strongestValue),
      balanceScore: Math.round(balanceScore),
      reasons
    };
  }, [adaptiveState, currentPuzzleIndex, currentPuzzle]);

  // Determine trend
  const trend = useMemo(() => {
    if (currentPuzzleIndex === 0) return 'neutral';
    const prevPuzzle = adaptiveState.nextPuzzles[currentPuzzleIndex - 1];
    if (!prevPuzzle) return 'neutral';

    if (currentPuzzle.difficultyRating > prevPuzzle.difficultyRating + 5) return 'increasing';
    if (currentPuzzle.difficultyRating < prevPuzzle.difficultyRating - 5) return 'decreasing';
    return 'stable';
  }, [adaptiveState.nextPuzzles, currentPuzzleIndex, currentPuzzle]);

  return (
    <motion.div
      className="fixed top-24 right-6 z-40 w-80"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain size={20} />
              <h3 className="font-bold text-sm">Adaptive System</h3>
            </div>
            {trend === 'increasing' && <TrendingUp size={18} className="text-green-300" />}
            {trend === 'decreasing' && <TrendingDown size={18} className="text-orange-300" />}
            {trend === 'stable' && <Target size={18} className="text-blue-300" />}
          </div>
          <div className="text-xs opacity-90">
            Puzzle {currentPuzzleIndex + 1} of {totalPuzzles}
          </div>
        </div>

        {/* Current Puzzle Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Puzzle Type
              </div>
              <div className="text-lg font-bold text-gray-800 capitalize">
                {currentPuzzle.type}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Difficulty
              </div>
              <div className={`text-lg font-bold ${
                currentPuzzle.difficulty === 'easy'
                  ? 'text-green-600'
                  : currentPuzzle.difficulty === 'medium'
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}>
                {currentPuzzle.difficulty.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Difficulty Rating Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Rating</span>
              <span className="font-bold">{currentPuzzle.difficultyRating}/100</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  currentPuzzle.difficultyRating < 40
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : currentPuzzle.difficultyRating < 70
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${currentPuzzle.difficultyRating}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Skill Focus */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-indigo-600" />
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Focus Areas
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{SKILL_ICONS[adaptiveState.weakestSkill]}</span>
                <span className="text-sm text-gray-700">
                  {SKILL_NAMES[adaptiveState.weakestSkill]}
                </span>
              </div>
              <div className="text-xs font-bold text-red-600">
                {insights.weakestValue}/100
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{SKILL_ICONS[adaptiveState.strongestSkill]}</span>
                <span className="text-sm text-gray-700">
                  {SKILL_NAMES[adaptiveState.strongestSkill]}
                </span>
              </div>
              <div className="text-xs font-bold text-green-600">
                {insights.strongestValue}/100
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Reasoning */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-amber-600" />
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Why This Puzzle?
            </div>
          </div>
          <div className="space-y-2">
            {insights.reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-2 text-xs text-gray-700 bg-white rounded-lg p-2 border border-gray-200"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <AlertCircle size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">Your Overall Skill Level</div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-3 bg-white rounded-full overflow-hidden border border-indigo-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.profileAverage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="text-lg font-bold text-indigo-900">
              {insights.profileAverage}
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Skill Balance: {insights.balanceScore}/100
            {insights.balanceScore > 80 && ' - Excellent!'}
            {insights.balanceScore > 60 && insights.balanceScore <= 80 && ' - Good'}
            {insights.balanceScore <= 60 && ' - Keep practicing!'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const DifficultyIndicator = memo(DifficultyIndicatorComponent);
