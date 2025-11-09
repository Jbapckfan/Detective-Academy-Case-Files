import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';
import { RARITY_COLORS, type Achievement } from '../data/achievements';
import { soundEngine } from '../lib/soundEngine';

interface Props {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: Props) {
  const colors = RARITY_COLORS[achievement.rarity];

  // Play achievement sound when notification appears
  useEffect(() => {
    soundEngine.playAchievementUnlock();
  }, []);

  return (
    <motion.div
      className="fixed top-24 right-6 z-[999] max-w-sm"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div
        className={`relative bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl shadow-2xl ${colors.glow} overflow-hidden`}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors z-10"
        >
          <X size={18} className={colors.text} />
        </button>

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className={`w-16 h-16 rounded-full bg-gradient-to-br from-white/50 to-white/30 flex items-center justify-center text-4xl shadow-lg`}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: 2
              }}
            >
              {achievement.icon}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} className={colors.text} />
                <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                  Achievement Unlocked!
                </span>
              </div>
              <h3 className={`text-xl font-bold ${colors.text}`}>
                {achievement.name}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className={`text-sm ${colors.text} opacity-90 mb-3`}>
            {achievement.description}
          </p>

          {/* Rarity Badge */}
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/40 border ${colors.border}`}>
              <Sparkles size={12} className={colors.text} />
              <span className={`text-xs font-bold uppercase ${colors.text}`}>
                {achievement.rarity}
              </span>
            </div>

            {/* Rewards */}
            {achievement.reward && (
              <div className="flex items-center gap-2 text-xs font-semibold">
                {achievement.reward.xp && (
                  <span className={`px-2 py-1 rounded-lg bg-white/30 ${colors.text}`}>
                    +{achievement.reward.xp} XP
                  </span>
                )}
                {achievement.reward.companionXP && (
                  <span className={`px-2 py-1 rounded-lg bg-white/30 ${colors.text}`}>
                    +{achievement.reward.companionXP} 💕
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      </div>
    </motion.div>
  );
}

// Achievement notification container component
interface AchievementNotificationsProps {
  achievements: Array<{ achievement: Achievement; timestamp: number }>;
  onDismiss: (achievementId: string) => void;
}

export function AchievementNotifications({ achievements, onDismiss }: AchievementNotificationsProps) {
  return (
    <div className="fixed top-0 right-0 z-[999] pointer-events-none">
      <div className="p-6 space-y-4 pointer-events-auto">
        <AnimatePresence>
          {achievements.map((unlock, index) => (
            <motion.div
              key={unlock.achievement.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: index * 10 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ delay: index * 0.1 }}
            >
              <AchievementNotification
                achievement={unlock.achievement}
                onDismiss={() => onDismiss(unlock.achievement.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
