import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RotateCw, RotateCcw, FlipHorizontal, Box, Clock, Target } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';
import { casePuzzles } from '../../data/puzzles';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

export function SpatialPuzzle({ config, onComplete }: Props) {
  const rng = seedrandom(config.seed);
  const currentZone = useGameStore(state => state.currentZone);

  const caseColors: Record<number, string[]> = {
    1: ['#fbbf24', '#d1d5db', '#dc2626', '#1e40af', '#059669', '#92400e'],
    2: ['#991b1b', '#0284c7', '#7c3aed', '#d97706', '#0d9488', '#b91c1c'],
    3: ['#1e3a8a', '#374151', '#e5e7eb', '#6b7280', '#1f2937', '#111827']
  };

  const colors = currentZone?.id && caseColors[currentZone.id]
    ? caseColors[currentZone.id]
    : ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899'];
  const shuffledColors = colors.sort(() => rng() - 0.5);

  const targetRotation = Math.floor(rng() * 4) * 90;
  const targetFlip = rng() > 0.5;

  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentFlip, setCurrentFlip] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  // Get story context
  const caseId = currentZone?.id || 1;
  const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'spatial');
  const storyContext = casePuzzleData?.storyContext || 'Rotate and flip the object to match the target orientation.';
  const explanation = casePuzzleData?.explanation || 'Evidence orientation analyzed successfully!';

  useEffect(() => {
    updateCompanionState('curious');
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleRotateRight = () => {
    setCurrentRotation((prev) => (prev + 90) % 360);
    setAttempts(prev => prev + 1);
  };

  const handleRotateLeft = () => {
    setCurrentRotation((prev) => (prev - 90 + 360) % 360);
    setAttempts(prev => prev + 1);
  };

  const handleFlip = () => {
    setCurrentFlip(prev => !prev);
    setAttempts(prev => prev + 1);
  };

  const handleCheck = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const rotationMatch = currentRotation === targetRotation;
    const flipMatch = currentFlip === targetFlip;
    const solved = rotationMatch && flipMatch;

    updateCompanionState(solved ? 'cheering' : 'thinking');

    setTimeout(() => {
      onComplete({
        solved,
        timeTaken,
        attemptsUsed: attempts,
        hintsUsed: hints,
        actualMoves: attempts
      });
    }, solved ? 1500 : 500);
  };

  const handleHint = () => {
    setHints(prev => prev + 1);
    updateCompanionState('stuck');
  };

  const renderCube = (rotation: number, flip: boolean, colors: string[]) => {
    return (
      <div
        className="relative w-48 h-48"
        style={{
          transform: `rotate(${rotation}deg) scaleX(${flip ? -1 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease'
        }}
      >
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2">
          {colors.slice(0, 4).map((color, i) => (
            <div
              key={i}
              className="rounded-lg shadow-lg"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div
          className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 z-10 border-4 border-white shadow-lg"
          style={{ backgroundColor: colors[4] }}
        />
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isMatching = currentRotation === targetRotation && currentFlip === targetFlip;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-slate-900 relative overflow-hidden">
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      <motion.div
        className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full border border-amber-900/30 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 border-b border-amber-900/30 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-600/20 rounded-lg border border-amber-600/30">
              <Box className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-wide">EVIDENCE ORIENTATION</h2>
              <p className="text-slate-400 text-sm">Spatial Analysis Required</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Moves: {attempts}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Hints Used: {hints}</span>
            </div>
            {isMatching && (
              <motion.div
                className="flex items-center gap-2 text-green-400 font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <span>✓ ORIENTATION MATCHED</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Story Context */}
        <motion.div
          className="mb-6 p-4 bg-gradient-to-br from-amber-900/20 to-slate-800/40 border border-amber-700/30 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">📦</div>
            <div>
              <h3 className="text-amber-400 font-semibold mb-1 text-sm uppercase tracking-wide">Physical Evidence</h3>
              <p className="text-slate-200 leading-relaxed italic">{storyContext}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="mb-4 p-2 bg-green-900/20 rounded-lg border border-green-700/30">
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">Target Orientation</h3>
            </div>
            <div className="flex justify-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              {renderCube(targetRotation, targetFlip, shuffledColors)}
            </div>
          </div>

          <div className="text-center">
            <div className="mb-4 p-2 bg-amber-900/20 rounded-lg border border-amber-700/30">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Current Orientation</h3>
            </div>
            <div className="flex justify-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              {renderCube(currentRotation, currentFlip, shuffledColors)}
            </div>
          </div>
        </div>

        {/* Hints */}
        <AnimatePresence>
          {hints > 0 && (
            <motion.div
              className="mb-6 p-4 bg-amber-900/20 border border-amber-700/40 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-amber-300 font-semibold text-sm mb-1">Detective's Note:</p>
                  <p className="text-amber-100 text-sm">Try rotating the evidence and flipping it to match the target orientation. Use the controls to manipulate the object until both orientations align perfectly!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="mb-6 p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
          <h3 className="text-amber-400 text-sm font-semibold mb-3 uppercase tracking-wider">Manipulation Controls</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={handleRotateLeft}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-all border border-blue-700/30 hover:border-blue-600/50"
            >
              <RotateCcw size={18} />
              <span className="text-sm font-medium">Rotate Left</span>
            </button>
            <button
              onClick={handleRotateRight}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-all border border-blue-700/30 hover:border-blue-600/50"
            >
              <RotateCw size={18} />
              <span className="text-sm font-medium">Rotate Right</span>
            </button>
            <button
              onClick={handleFlip}
              className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-lg transition-all border border-purple-700/30 hover:border-purple-600/50"
            >
              <FlipHorizontal size={18} />
              <span className="text-sm font-medium">Flip Horizontal</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-slate-700/50">
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 rounded-lg transition-all border border-amber-700/30 hover:border-amber-600/50"
          >
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Request Hint</span>
          </button>

          <button
            onClick={handleCheck}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg border border-amber-500/30"
          >
            <span>Verify Orientation</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
