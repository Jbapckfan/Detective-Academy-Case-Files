import { motion } from 'framer-motion';
import { Brain, Sparkles, Heart, Lightbulb, Zap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { CompanionState, Personality } from '../types';

const PERSONALITY_STYLES: Record<Personality, { colors: string[]; icon: typeof Brain }> = {
  owl: { colors: ['#8b5cf6', '#a78bfa'], icon: Brain },
  fox: { colors: ['#f97316', '#fb923c'], icon: Zap },
  robot: { colors: ['#06b6d4', '#22d3ee'], icon: Sparkles }
};

const STATE_ANIMATIONS: Record<CompanionState, any> = {
  wondering: {
    scale: [1, 1.05, 1],
    rotate: [0, 5, -5, 0],
    transition: { repeat: Infinity, duration: 3 }
  },
  curious: {
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, duration: 1.5 }
  },
  cheering: {
    y: [0, -20, 0],
    rotate: [0, 10, -10, 0],
    transition: { repeat: 3, duration: 0.5 }
  },
  thinking: {
    rotate: [0, -5, 5, 0],
    transition: { repeat: Infinity, duration: 2 }
  },
  stuck: {
    x: [-5, 5, -5],
    transition: { repeat: 2, duration: 0.3 }
  },
  celebrating: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    transition: { duration: 1 }
  },
  bonding: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: { repeat: Infinity, duration: 2 }
  },
  playful: {
    rotate: [0, 10, -10, 10, 0],
    y: [0, -10, 0],
    transition: { repeat: Infinity, duration: 2 }
  }
};

const COMPANION_MESSAGES: Record<CompanionState, string[]> = {
  wondering: [
    "Ready for an adventure?",
    "What puzzle will we solve today?",
    "I wonder what mysteries await us!"
  ],
  curious: [
    "Interesting! What do you think?",
    "This looks like a fun challenge!",
    "Let's figure this out together!"
  ],
  cheering: [
    "WOW! That was amazing!",
    "You're incredible!",
    "That was SO fast!",
    "You really understand this!"
  ],
  thinking: [
    "Take your time...",
    "Think it through carefully",
    "You've got this!",
    "What patterns do you see?"
  ],
  stuck: [
    "Let me help you with a hint...",
    "Don't worry, this is tricky!",
    "Want to think about it differently?"
  ],
  celebrating: [
    "YES! You figured it out!",
    "That took real grit!",
    "You're getting better!",
    "Well done!"
  ],
  bonding: [
    "I'm so proud of you!",
    "We make a great team!",
    "You're really improving!",
    "I can see you're getting stronger!"
  ],
  playful: [
    "That was fun!",
    "Ready for the next one?",
    "You're on a roll!",
    "This is exciting!"
  ]
};

export function Companion() {
  const companion = useGameStore(state => state.companion);

  if (!companion) return null;

  const style = PERSONALITY_STYLES[companion.personality];
  const animation = STATE_ANIMATIONS[companion.state];
  const messages = COMPANION_MESSAGES[companion.state];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const Icon = style.icon;

  return (
    <div className="fixed top-6 left-6 z-50">
      <motion.div
        className="relative"
        animate={animation}
      >
        <motion.div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})`
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Icon size={48} className="text-white" strokeWidth={2} />

          {companion.level > 1 && (
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              {companion.level}
            </motion.div>
          )}

          {companion.state === 'cheering' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${style.colors[1]}88 0%, transparent 70%)`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </motion.div>

        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2 bg-white rounded-lg shadow-lg min-w-[200px] max-w-[280px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm font-medium text-gray-800 text-center">
            {message}
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
        </motion.div>
      </motion.div>

      <div className="mt-28 space-y-2">
        <div className="text-sm font-semibold text-gray-700">{companion.name}</div>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background: `linear-gradient(90deg, ${style.colors[0]}, ${style.colors[1]})`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(companion.xp % 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-gray-500">
          Level {companion.level} • {companion.xp % 100}/100 XP
        </div>
      </div>
    </div>
  );
}
