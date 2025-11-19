import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSequencePuzzle } from '../../lib/puzzles/sequence-generator';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { HelpCircle, Search, Clock, Target } from 'lucide-react';
import { casePuzzles } from '../../data/puzzles';
import { caseThemes } from '../../data/cases';

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
  const theme = currentZone?.theme || caseThemes[1];
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  // Memoize puzzle generation to prevent re-computation
  const puzzle = useMemo(
    () => generateSequencePuzzle(config.seed, config.difficulty, currentZone?.id, theme),
    [config.seed, config.difficulty, currentZone?.id, theme]
  );

  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Get story context from puzzle data (memoized)
  const storyData = useMemo(() => {
    const caseId = currentZone?.id || 1;
    const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'sequence');
    return {
      storyContext: casePuzzleData?.storyContext || 'Analyze the pattern to find the next element in the sequence.',
      explanation: casePuzzleData?.explanation || 'Pattern identified successfully!'
    };
  }, [currentZone?.id]);

  const surfaceStyle = useMemo(() => ({
    backgroundImage: `${theme.background}, url(${theme.textures.background})`
  }), [theme]);

  const glowStyle = { ['--glow-color' as any]: theme.glow };

  useEffect(() => {
    updateCompanionState('curious');
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, updateCompanionState]);

  const handleAnswer = useCallback((answer: string | number) => {
    setSelectedAnswer(answer);
    setAttempts(prev => prev + 1);

    const correct = String(answer) === String(puzzle.correctAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      updateCompanionState('cheering');
      setShowExplanation(true);
      setTimeout(() => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        onComplete({
          solved: true,
          timeTaken,
          attemptsUsed: attempts + 1,
          hintsUsed: hints,
          actualMoves: 1
        });
      }, 3000);
    } else {
      updateCompanionState('thinking');
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1200);
    }
  }, [puzzle.correctAnswer, attempts, hints, startTime, onComplete, updateCompanionState]);

  const handleHint = useCallback(() => {
    setHints(prev => prev + 1);
    updateCompanionState('stuck');
  }, [updateCompanionState]);

  const renderElement = useCallback((element: string | number, index: number) => {
    const colorValue = typeof element === 'string' && element.startsWith('#')
      ? element
      : COLOR_MAP[element];

    if (typeof element === 'number') {
      return (
        <motion.div
          key={index}
          className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold text-white shadow-2xl border border-white/20 piece-shine"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.secondary}), url(${theme.textures.surface})`,
            boxShadow: '0 12px 28px rgba(0,0,0,0.35)'
          }}
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
          className="w-20 h-20 rounded-lg backdrop-blur-sm flex items-center justify-center text-4xl shadow-2xl border border-white/20 piece-snap piece-shine"
          style={{
            backgroundImage: `linear-gradient(145deg, ${theme.palette.secondary}, ${theme.palette.accent}), url(${theme.textures.surface})`
          }}
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
            className="flex gap-1 piece-snap"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {parsed.map((item: string, i: number) => {
              const color = item.startsWith('#') ? item : (COLOR_MAP[item] || theme.palette.highlight);
              return (
                <div
                  key={i}
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </motion.div>
        );
      }
    } catch {}

    if (colorValue) {
      return (
        <motion.div
          key={index}
          className="w-20 h-20 rounded-lg shadow-2xl border border-white/20 piece-snap"
          style={{ backgroundColor: colorValue, backgroundImage: `url(${theme.textures.surface})` }}
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
          className="w-20 h-20 piece-snap"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d={SHAPE_SVG[element]}
              fill={index % 2 === 0 ? theme.palette.accent : theme.palette.highlight}
              stroke={theme.palette.primary}
              strokeWidth="4"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
            />
          </svg>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={index}
        className="w-20 h-20 rounded-lg backdrop-blur-sm flex items-center justify-center text-lg font-semibold text-white shadow-2xl border border-white/20 piece-snap"
        style={{ backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary}, ${theme.palette.highlight}), url(${theme.textures.surface})` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring' }}
      >
        {element}
      </motion.div>
    );
  }, [theme]);


  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 relative overflow-hidden"
      style={surfaceStyle}
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      <motion.div
        className="backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative"
        style={{
          backgroundImage: `linear-gradient(145deg, ${theme.palette.primary}, ${theme.palette.secondary})`,
          border: `1px solid ${theme.palette.accent}33`,
          boxShadow: `0 20px 40px ${theme.palette.primary}55`
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header with detective theme */}
        <div className="mb-6 border-b pb-4" style={{ borderColor: `${theme.palette.accent}55` }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2 rounded-lg border"
              style={{ background: `${theme.palette.accent}22`, borderColor: `${theme.palette.accent}55` }}
            >
              <Search className="w-6 h-6" style={{ color: theme.palette.highlight }} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: theme.palette.highlight }}>EVIDENCE ANALYSIS</h2>
              <p className="text-slate-200/80 text-sm">Pattern Recognition Required</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-100/80">
              <Clock className="w-4 h-4" style={{ color: theme.palette.accent }} />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-100/80">
              <Target className="w-4 h-4" style={{ color: theme.palette.accent }} />
              <span>Attempts: {attempts}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-100/80">
              <HelpCircle className="w-4 h-4" style={{ color: theme.palette.accent }} />
              <span>Hints Used: {hints}</span>
            </div>
          </div>
        </div>

        {/* Story Context */}
        <motion.div
          className="mb-6 p-4 rounded-lg backdrop-blur-sm"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary}33, ${theme.palette.accent}22)`,
            border: `1px solid ${theme.palette.accent}55`
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔍</div>
            <div>
              <h3 className="font-semibold mb-1 text-sm uppercase tracking-wide" style={{ color: theme.palette.highlight }}>Case Evidence</h3>
              <p className="text-slate-100 leading-relaxed italic">{storyData.storyContext}</p>
            </div>
          </div>
        </motion.div>

        {/* Sequence display */}
        <div
          className="mb-8 p-6 rounded-xl border"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary}44, ${theme.palette.secondary}33)`,
            borderColor: `${theme.palette.accent}55`
          }}
        >
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: theme.palette.highlight }}>Evidence Sequence</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
            {puzzle.sequence.map((element, index) => renderElement(element, index))}
            <motion.div
              className="w-20 h-20 rounded-lg border-2 border-dashed border-amber-600/50 flex items-center justify-center text-4xl text-amber-600/70 bg-slate-800/30"
              animate={{
                scale: [1, 1.05, 1],
                borderColor: ['rgba(217, 119, 6, 0.5)', 'rgba(217, 119, 6, 0.8)', 'rgba(217, 119, 6, 0.5)']
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ?
            </motion.div>
          </div>
        </div>

        {/* Hints */}
        <AnimatePresence>
          {hints > 0 && (
            <motion.div
              className="mb-6 p-4 rounded-lg backdrop-blur-sm"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary}33, ${theme.palette.accent}22)`,
                border: `1px dashed ${theme.palette.accent}77`
              }}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: theme.palette.highlight }}>Detective's Note:</p>
                  <p className="text-slate-100 text-sm">Look for the pattern! Does it repeat? Does it change by a certain amount? Mathematical sequences often follow addition, multiplication, or positional rules.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer choices */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: theme.palette.highlight }}>Select Your Deduction</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {puzzle.choices.map((choice, index) => (
              <motion.button
                key={index}
                onClick={() => !showFeedback && handleAnswer(choice)}
                className={`relative p-4 rounded-lg border-2 transition-all backdrop-blur-sm ${
                  selectedAnswer === choice && showFeedback
                    ? isCorrect
                      ? 'border-green-400/80 bg-green-900/30 shadow-lg shadow-green-500/30 success-glow'
                      : 'border-red-500 bg-red-900/30 shadow-lg shadow-red-500/20'
                    : 'border-white/20 hover:border-white/50 hover:bg-white/5 bg-slate-900/50'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: showFeedback ? 1 : 1.05, y: showFeedback ? 0 : -2 }}
                whileTap={{ scale: showFeedback ? 1 : 0.95 }}
                disabled={showFeedback}
              >
                <div className="flex items-center justify-center min-h-[60px]">
                  {renderElement(choice, 0)}
                </div>
                {selectedAnswer === choice && showFeedback && (
                  <motion.div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    } success-glow`}
                    style={glowStyle}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Explanation after solving */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              className="mb-6 p-4 rounded-lg backdrop-blur-sm success-glow"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.palette.accent}33, ${theme.palette.highlight}22)`,
                border: `1px solid ${theme.palette.accent}77`,
                ...glowStyle
              }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold mb-2" style={{ color: theme.palette.highlight }}>Case Breakthrough!</p>
                  <p className="text-slate-100 text-sm leading-relaxed">{storyData.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              background: `${theme.palette.accent}22`,
              border: `1px solid ${theme.palette.accent}66`,
              color: theme.palette.highlight
            }}
          >
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Request Hint</span>
          </button>

          <div className="text-xs text-slate-100/70 italic">
            Follow the evidence...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
