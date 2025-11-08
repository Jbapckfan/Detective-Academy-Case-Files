import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, RotateCcw, Check } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

interface Mirror {
  id: string;
  x: number;
  y: number;
  angle: number;
}

interface LightPath {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function MirrorPuzzle({ config, onComplete }: Props) {
  const rng = seedrandom(config.seed);
  const gridSize = 8;
  const cellSize = 60;

  const startPos = { x: 0, y: Math.floor(gridSize / 2) };
  const targetPos = { x: gridSize - 1, y: Math.floor(gridSize / 2) };

  const [mirrors, setMirrors] = useState<Mirror[]>([]);
  const [selectedMirror, setSelectedMirror] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  const maxMirrors = config.difficulty === 'easy' ? 2 : config.difficulty === 'medium' ? 4 : 6;

  useEffect(() => {
    updateCompanionState('curious');
  }, []);

  const calculateLightPath = (): { paths: LightPath[], hitsTarget: boolean } => {
    const paths: LightPath[] = [];
    let currentPos = { x: startPos.x + 0.5, y: startPos.y + 0.5 };
    let currentAngle = 0;
    let bounces = 0;
    const maxBounces = 20;

    while (bounces < maxBounces) {
      const dx = Math.cos((currentAngle * Math.PI) / 180);
      const dy = Math.sin((currentAngle * Math.PI) / 180);

      let nearestMirror: Mirror | null = null;
      let minDistance = Infinity;

      for (const mirror of mirrors) {
        const mirrorX = mirror.x + 0.5;
        const mirrorY = mirror.y + 0.5;

        const t = ((mirrorX - currentPos.x) * dx + (mirrorY - currentPos.y) * dy) / (dx * dx + dy * dy);

        if (t > 0.01) {
          const intersectX = currentPos.x + t * dx;
          const intersectY = currentPos.y + t * dy;

          const distToMirror = Math.sqrt((intersectX - mirrorX) ** 2 + (intersectY - mirrorY) ** 2);

          if (distToMirror < 0.3 && t < minDistance) {
            minDistance = t;
            nearestMirror = mirror;
          }
        }
      }

      if (nearestMirror) {
        const mirrorX = nearestMirror.x + 0.5;
        const mirrorY = nearestMirror.y + 0.5;

        paths.push({
          x1: currentPos.x,
          y1: currentPos.y,
          x2: mirrorX,
          y2: mirrorY
        });

        currentPos = { x: mirrorX, y: mirrorY };
        const mirrorAngleRad = (nearestMirror.angle * Math.PI) / 180;
        const incidentAngleRad = (currentAngle * Math.PI) / 180;
        const reflectedAngleRad = 2 * mirrorAngleRad - incidentAngleRad;
        currentAngle = (reflectedAngleRad * 180) / Math.PI;
        bounces++;
      } else {
        const endX = currentPos.x + dx * gridSize * 2;
        const endY = currentPos.y + dy * gridSize * 2;

        let finalX = endX;
        let finalY = endY;

        if (endX < 0) finalX = 0;
        if (endX > gridSize) finalX = gridSize;
        if (endY < 0) finalY = 0;
        if (endY > gridSize) finalY = gridSize;

        paths.push({
          x1: currentPos.x,
          y1: currentPos.y,
          x2: finalX,
          y2: finalY
        });

        const distToTarget = Math.sqrt(
          (finalX - (targetPos.x + 0.5)) ** 2 + (finalY - (targetPos.y + 0.5)) ** 2
        );

        return { paths, hitsTarget: distToTarget < 0.4 };
      }
    }

    return { paths, hitsTarget: false };
  };

  const { paths, hitsTarget } = calculateLightPath();

  const handleAddMirror = (x: number, y: number) => {
    if (mirrors.length >= maxMirrors) return;
    if (mirrors.some(m => m.x === x && m.y === y)) return;
    if ((x === startPos.x && y === startPos.y) || (x === targetPos.x && y === targetPos.y)) return;

    const newMirror: Mirror = {
      id: `mirror-${Date.now()}-${Math.random()}`,
      x,
      y,
      angle: 45
    };

    setMirrors([...mirrors, newMirror]);
    setAttempts(prev => prev + 1);
  };

  const handleRotateMirror = (id: string) => {
    setMirrors(mirrors.map(m =>
      m.id === id ? { ...m, angle: (m.angle + 45) % 360 } : m
    ));
    setAttempts(prev => prev + 1);
  };

  const handleRemoveMirror = (id: string) => {
    setMirrors(mirrors.filter(m => m.id !== id));
    setAttempts(prev => prev + 1);
  };

  const handleCheck = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const solved = hitsTarget;

    updateCompanionState(solved ? 'cheering' : 'thinking');

    setTimeout(() => {
      onComplete({
        solved,
        timeTaken,
        attemptsUsed: attempts,
        hintsUsed: hints,
        actualMoves: mirrors.length
      });
    }, solved ? 1500 : 500);
  };

  const handleReset = () => {
    setMirrors([]);
    setAttempts(prev => prev + 1);
  };

  const handleHint = () => {
    setHints(prev => prev + 1);
    updateCompanionState('stuck');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-cyan-50 to-blue-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Mirror Puzzle</h2>
          <p className="text-gray-600">Place mirrors to guide the light beam to the target</p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative bg-gray-900 rounded-2xl p-4" style={{ width: gridSize * cellSize + 32, height: gridSize * cellSize + 32 }}>
            <svg
              width={gridSize * cellSize}
              height={gridSize * cellSize}
              className="absolute top-4 left-4"
              style={{ pointerEvents: 'none' }}
            >
              {paths.map((path, i) => (
                <motion.line
                  key={i}
                  x1={path.x1 * cellSize}
                  y1={path.y1 * cellSize}
                  x2={path.x2 * cellSize}
                  y2={path.y2 * cellSize}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                  }}
                />
              ))}
            </svg>

            <div
              className="grid gap-0 relative"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const x = i % gridSize;
                const y = Math.floor(i / gridSize);
                const isStart = x === startPos.x && y === startPos.y;
                const isTarget = x === targetPos.x && y === targetPos.y;
                const mirror = mirrors.find(m => m.x === x && m.y === y);

                return (
                  <div
                    key={i}
                    onClick={() => !mirror && !isStart && !isTarget && handleAddMirror(x, y)}
                    className={`border border-gray-700 flex items-center justify-center cursor-pointer transition-all ${
                      !mirror && !isStart && !isTarget ? 'hover:bg-gray-800' : ''
                    }`}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {isStart && (
                      <motion.div
                        className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-2xl shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ☀️
                      </motion.div>
                    )}
                    {isTarget && (
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                          hitsTarget ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        animate={hitsTarget ? { scale: [1, 1.2, 1] } : {}}
                        transition={hitsTarget ? { repeat: Infinity, duration: 0.8 } : {}}
                      >
                        🎯
                      </motion.div>
                    )}
                    {mirror && (
                      <motion.div
                        className="relative w-full h-full flex items-center justify-center"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMirror(mirror.id);
                        }}
                      >
                        <div
                          className="w-12 h-2 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full shadow-lg cursor-pointer"
                          style={{ transform: `rotate(${mirror.angle}deg)` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotateMirror(mirror.id);
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMirror(mirror.id);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
                        >
                          ✕
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Click empty cells to place mirrors • Click mirrors to rotate them • Click ✕ to remove
          </p>
        </div>

        {hints > 0 && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> Mirrors reflect light at angles. A 45° mirror will bounce light 90 degrees! Try different positions and rotations.
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
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Mirrors: {mirrors.length}/{maxMirrors}
              {hitsTarget && <span className="ml-2 text-green-600 font-semibold">✓ Target Hit!</span>}
            </div>
            <button
              onClick={handleCheck}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              <Check size={20} />
              Check Solution
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
