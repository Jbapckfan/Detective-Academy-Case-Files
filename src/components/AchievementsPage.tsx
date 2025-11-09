import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { useAchievements } from '../hooks/useAchievements';
import { RARITY_COLORS, type AchievementCategory } from '../data/achievements';

interface Props {
  onBack: () => void;
}

const CATEGORY_INFO: Record<AchievementCategory, { name: string; icon: string; color: string }> = {
  puzzle_mastery: { name: 'Puzzle Mastery', icon: '🎯', color: 'from-blue-500 to-blue-600' },
  speed: { name: 'Speed Demon', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  perfection: { name: 'Perfectionist', icon: '💎', color: 'from-purple-500 to-pink-500' },
  progression: { name: 'Case Progress', icon: '📚', color: 'from-green-500 to-emerald-600' },
  dedication: { name: 'Dedication', icon: '🔥', color: 'from-red-500 to-rose-600' },
  skill_mastery: { name: 'Skill Mastery', icon: '🧠', color: 'from-indigo-500 to-violet-600' },
  exploration: { name: 'Explorer', icon: '🗺️', color: 'from-teal-500 to-cyan-600' },
  companion: { name: 'Companion Bond', icon: '❤️', color: 'from-pink-500 to-rose-500' }
};

export function AchievementsPage({ onBack }: Props) {
  const {
    getAllAchievementsWithProgress,
    unlockedCount,
    totalCount,
    completionPercentage
  } = useAchievements();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const allAchievements = getAllAchievementsWithProgress();

  const filteredAchievements = allAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  // Group by category
  const achievementsByCategory: Record<string, typeof filteredAchievements> = {};
  filteredAchievements.forEach(achievement => {
    if (!achievementsByCategory[achievement.category]) {
      achievementsByCategory[achievement.category] = [];
    }
    achievementsByCategory[achievement.category].push(achievement);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-white"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={20} />
            Back to Menu
          </motion.button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Achievements</h1>
              <p className="text-slate-300">Track your detective progress and unlock rewards</p>
            </div>

            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <div className="text-6xl font-bold text-amber-400">
                {unlockedCount}/{totalCount}
              </div>
              <div className="text-sm text-slate-300">Achievements Unlocked</div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="text-right text-sm text-slate-400 mt-1">
            {Math.round(completionPercentage)}% Complete
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div>
            <div className="text-sm font-semibold text-slate-300 mb-2">Filter by Category</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as AchievementCategory)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${info.color} text-white`
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {info.icon} {info.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity Filter */}
          <div>
            <div className="text-sm font-semibold text-slate-300 mb-2">Filter by Rarity</div>
            <div className="flex gap-2">
              {['all', 'common', 'rare', 'epic', 'legendary'].map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setSelectedRarity(rarity)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    selectedRarity === rarity
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="space-y-8">
          {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
            const info = CATEGORY_INFO[category as AchievementCategory];
            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${info.color} text-white font-bold`}>
                    {info.icon} {info.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {categoryAchievements.filter(a => a.unlocked).length} / {categoryAchievements.length} unlocked
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {categoryAchievements.map((achievement, index) => {
                      const colors = RARITY_COLORS[achievement.rarity];
                      const isUnlocked = achievement.unlocked;

                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          className={`relative bg-gradient-to-br ${
                            isUnlocked ? colors.bg : 'from-slate-800 to-slate-700'
                          } border-2 ${
                            isUnlocked ? colors.border : 'border-slate-600'
                          } rounded-xl p-5 ${
                            isUnlocked ? `shadow-lg ${colors.glow}` : ''
                          } transition-all hover:scale-105`}
                        >
                          {/* Locked Overlay */}
                          {!isUnlocked && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                              <Lock size={32} className="text-slate-400" />
                            </div>
                          )}

                          {/* Icon */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-5xl">{achievement.icon}</div>
                            {isUnlocked && (
                              <Trophy size={24} className={colors.text} />
                            )}
                          </div>

                          {/* Title & Rarity */}
                          <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? colors.text : 'text-slate-300'}`}>
                            {achievement.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                              isUnlocked ? `bg-white/30 ${colors.text}` : 'bg-slate-600 text-slate-400'
                            }`}>
                              <Sparkles size={10} />
                              {achievement.rarity}
                            </div>
                          </div>

                          {/* Description */}
                          <p className={`text-sm mb-3 ${isUnlocked ? colors.text + ' opacity-80' : 'text-slate-400'}`}>
                            {achievement.description}
                          </p>

                          {/* Progress Bar (if not unlocked) */}
                          {!isUnlocked && achievement.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(achievement.progress)}%</span>
                              </div>
                              <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${achievement.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Rewards */}
                          {achievement.reward && isUnlocked && (
                            <div className="flex gap-2 text-xs font-semibold">
                              {achievement.reward.xp && (
                                <span className={`px-2 py-1 rounded-lg bg-white/20 ${colors.text}`}>
                                  +{achievement.reward.xp} XP
                                </span>
                              )}
                              {achievement.reward.companionXP && (
                                <span className={`px-2 py-1 rounded-lg bg-white/20 ${colors.text}`}>
                                  +{achievement.reward.companionXP} 💕
                                </span>
                              )}
                            </div>
                          )}

                          {/* Unlocked Date */}
                          {isUnlocked && achievement.unlockedAt && (
                            <div className="text-xs text-slate-500 mt-2">
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
