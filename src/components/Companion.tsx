import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { CompanionState, Personality } from '../types';
import { soundEngine } from '../lib/soundEngine';

const PERSONALITY_STYLES: Record<Personality, { colors: string[]; icon: typeof Brain; name: string }> = {
  owl: { colors: ['#8b5cf6', '#a78bfa'], icon: Brain, name: 'Wise Owl' },
  fox: { colors: ['#f97316', '#fb923c'], icon: Zap, name: 'Clever Fox' },
  robot: { colors: ['#06b6d4', '#22d3ee'], icon: Sparkles, name: 'Detective Bot' }
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

interface CompanionProps {
  message?: string | null;
  isHint?: boolean;
  onDismiss?: () => void;
}

function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayedText}</span>;
}

export function Companion({ message, isHint, onDismiss }: CompanionProps) {
  const companion = useGameStore(state => state.companion);
  const [showFullMessage, setShowFullMessage] = useState(false);

  // Play personality-specific sound when message appears
  useEffect(() => {
    if (message && companion) {
      soundEngine.playCompanionSpeak(companion.personality);
      if (isHint) {
        setTimeout(() => soundEngine.playHint(), 200);
      }
    }
  }, [message, companion, isHint]);

  if (!companion) return null;

  const style = PERSONALITY_STYLES[companion.personality];
  const animation = STATE_ANIMATIONS[companion.state];
  const Icon = style.icon;

  return (
    <>
      <div className="fixed top-6 left-6 z-50">
        <motion.div
          className="relative"
          animate={animation}
        >
          {/* Companion Avatar */}
          <motion.div
            className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})`
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => message && setShowFullMessage(true)}
          >
            <Icon size={48} className="text-white" strokeWidth={2} />

            {/* Level Badge */}
            {companion.level > 1 && (
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                {companion.level}
              </motion.div>
            )}

            {/* Cheering Particle Effect */}
            {companion.state === 'cheering' && (
              <>
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
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-yellow-400"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos((i * Math.PI * 2) / 8) * 60],
                      y: [0, Math.sin((i * Math.PI * 2) / 8) * 60],
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </>
            )}

            {/* Message Indicator */}
            {message && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <span className="text-white text-xs font-bold">💬</span>
              </motion.div>
            )}
          </motion.div>

          {/* Compact Message Bubble */}
          <AnimatePresence>
            {message && !showFullMessage && (
              <motion.div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-3 rounded-xl shadow-xl min-w-[220px] max-w-[300px] cursor-pointer ${
                  isHint
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300'
                    : 'bg-white'
                }`}
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ type: 'spring', bounce: 0.3 }}
                onClick={() => setShowFullMessage(true)}
              >
                <div className={`text-sm font-medium ${isHint ? 'text-amber-900' : 'text-gray-800'}`}>
                  <TypewriterText text={message.split('\n\n')[0].slice(0, 60) + (message.length > 60 ? '...' : '')} />
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
                {isHint && (
                  <div className="mt-1 text-xs text-amber-700 font-semibold">💡 Click for full hint</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Companion Info */}
        <div className="mt-28 space-y-2">
          <div className="text-sm font-semibold text-slate-800">{companion.name}</div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${style.colors[0]}, ${style.colors[1]})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(companion.xp % 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="text-xs text-gray-600 font-medium">
            Level {companion.level} • {companion.xp % 100}/100 XP
          </div>
        </div>
      </div>

      {/* Full Message Modal */}
      <AnimatePresence>
        {showFullMessage && message && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullMessage(false)}
          >
            <motion.div
              className={`relative max-w-lg w-full rounded-2xl shadow-2xl p-6 ${
                isHint
                  ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50 border-2 border-amber-300'
                  : 'bg-gradient-to-br from-white to-slate-50'
              }`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowFullMessage(false);
                  onDismiss?.();
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Companion Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})`
                  }}
                >
                  <Icon size={32} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800">{companion.name}</div>
                  <div className="text-sm text-gray-600">{style.name}</div>
                </div>
              </div>

              {/* Message Content */}
              <div className={`prose prose-sm max-w-none ${isHint ? 'text-amber-900' : 'text-gray-800'}`}>
                {message.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 leading-relaxed whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>

              {isHint && (
                <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                  <div className="text-xs font-semibold text-amber-800">💡 Hint provided - keep trying!</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
