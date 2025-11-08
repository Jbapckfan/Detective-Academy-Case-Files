import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateSequencePuzzle } from '../../lib/puzzles/sequence-generator';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { HelpCircle, RotateCcw } from 'lucide-react';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

const SHAPE_SVG: Record<string, string> = {
  circle: 'M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10',
  square: 'M 10 10 L 90 10 L 90 90 L 10 90 Z',
  triangle: 'M 50 10 L 90 90 L 10 90 Z',
  star: 'M 50 5 L 58 38 L 95 38 L 65 60 L 75 95 L 50 72 L 25 95 L 35 60 L 5 38 L 42 38 Z',
  heart: 'M 50 80 C 50 80 10 50 10 30 C 10 10 30 10 50 30 C 70 10 90 10 90 30 C 90 50 50 80 50 80 Z',
  diamond: 'M 50 10 L 90 50 L 50 90 L 10 50 Z'
};

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  purple: '#a855f7',
  orange: '#f97316',
  gold: '#fbbf24',
  silver: '#d1d5db',
  ruby: '#dc2626',
  sapphire: '#1e40af',
  emerald: '#059669',
  bronze: '#92400e',
  crimson: '#991b1b',
  azure: '#0284c7',
  violet: '#7c3aed',
  amber: '#d97706',
  teal: '#0d9488',
  scarlet: '#b91c1c',
  navy: '#1e3a8a',
  charcoal: '#374151',
  platinum: '#e5e7eb',
  steel: '#6b7280',
  carbon: '#1f2937',
  graphite: '#111827'
};

export function SequencePuzzle({ config, onComplete }: Props) {
  const currentZone = useGameStore(state => state.currentZone);
  const [puzzle] = useState(() => generateSequencePuzzle(config.seed, config.difficulty, currentZone?.id));
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  useEffect(() => {
    updateCompanionState('curious');
  }, []);

  const handleAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
    setAttempts(prev => prev + 1);

    const correct = String(answer) === String(puzzle.correctAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      updateCompanionState('cheering');
      setTimeout(() => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        onComplete({
          solved: true,
          timeTaken,
          attemptsUsed: attempts + 1,
          hintsUsed: hints,
          actualMoves: 1
        });
      }, 1500);
    } else {
      updateCompanionState('thinking');
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const handleHint = () => {
    setHints(prev => prev + 1);
    updateCompanionState('stuck');
  };

  const renderElement = (element: string | number, index: number) => {
    if (typeof element === 'number') {
      return (
        <motion.div
          key={index}
          className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl font-bold text-amber-400 shadow-lg border-2 border-amber-600"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
        >
          {element}
        </motion.div>
      );
    }

    const isEmoji = /[\u{1F000}-\u{1F9FF}]/u.test(element);

    if (isEmoji) {
      return (
        <motion.div
          key={index}
          className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-600"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
        >
          {element}
        </motion.div>
      );
    }

    try {
      const parsed = JSON.parse(element);
      if (Array.isArray(parsed)) {
        return (
          <motion.div
            key={index}
            className="flex gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {parsed.map((item: string, i: number) => (
              <div
                key={i}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: COLOR_MAP[item] || '#ccc' }}
              />
            ))}
          </motion.div>
        );
      }
    } catch {}

    if (COLOR_MAP[element]) {
      return (
        <motion.div
          key={index}
          className="w-20 h-20 rounded-xl shadow-lg border-2 border-slate-700"
          style={{ backgroundColor: COLOR_MAP[element] }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
        />
      );
    }

    if (SHAPE_SVG[element]) {
      return (
        <motion.div
          key={index}
          className="w-20 h-20"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d={SHAPE_SVG[element]}
              fill="#6366f1"
              className="drop-shadow-lg"
            />
          </svg>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={index}
        className="w-20 h-20 rounded-xl bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        {element}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Pattern Puzzle</h2>
          <p className="text-gray-600">What comes next in the sequence?</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 min-h-[100px]">
          {puzzle.sequence.map((element, index) => renderElement(element, index))}
          <motion.div
            className="w-20 h-20 rounded-xl border-4 border-dashed border-gray-400 flex items-center justify-center text-4xl text-gray-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ?
          </motion.div>
        </div>

        {hints > 0 && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> Look for the pattern! Does it repeat? Does it change by a certain amount?
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {puzzle.choices.map((choice, index) => (
            <motion.button
              key={index}
              onClick={() => !showFeedback && handleAnswer(choice)}
              className={`relative p-4 rounded-xl border-4 transition-all ${
                selectedAnswer === choice && showFeedback
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
              whileHover={{ scale: showFeedback ? 1 : 1.05 }}
              whileTap={{ scale: showFeedback ? 1 : 0.95 }}
              disabled={showFeedback}
            >
              <div className="flex items-center justify-center min-h-[60px]">
                {renderElement(choice, 0)}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
            >
              <HelpCircle size={20} />
              Hint ({hints})
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Attempts: {attempts}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
