import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, RotateCw, RotateCcw, FlipHorizontal } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';

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
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  useEffect(() => {
    updateCompanionState('curious');
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Spatial Puzzle</h2>
          <p className="text-gray-600">Rotate and flip the shape to match the target</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Target Shape</h3>
            <div className="flex justify-center">
              {renderCube(targetRotation, targetFlip, shuffledColors)}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Shape</h3>
            <div className="flex justify-center">
              {renderCube(currentRotation, currentFlip, shuffledColors)}
            </div>
          </div>
        </div>

        {hints > 0 && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> Try rotating the shape and flipping it to match the target orientation!
            </p>
          </motion.div>
        )}

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

          <div className="flex gap-2">
            <button
              onClick={handleRotateLeft}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Rotate Left
            </button>
            <button
              onClick={handleRotateRight}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
            >
              <RotateCw size={20} />
              Rotate Right
            </button>
            <button
              onClick={handleFlip}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors"
            >
              <FlipHorizontal size={20} />
              Flip
            </button>
          </div>

          <button
            onClick={handleCheck}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            Check Solution
          </button>
        </div>
      </motion.div>
    </div>
  );
}
