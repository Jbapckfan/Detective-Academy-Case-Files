import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RotateCcw, Check, Zap, Clock, Target } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';
import { casePuzzles } from '../../data/puzzles';

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
  const currentZone = useGameStore(state => state.currentZone);
  const gridSize = 8;
  const cellSize = 60;

  const startPos = { x: 0, y: Math.floor(gridSize / 2) };
  const targetPos = { x: gridSize - 1, y: Math.floor(gridSize / 2) };

  const [mirrors, setMirrors] = useState<Mirror[]>([]);
  const [selectedMirror, setSelectedMirror] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  const maxMirrors = config.difficulty === 'easy' ? 2 : config.difficulty === 'medium' ? 4 : 6;

  // Get story context
  const caseId = currentZone?.id || 1;
  const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'mirror');
  const storyContext = casePuzzleData?.storyContext || 'Place mirrors to guide the light beam to the target.';
  const explanation = casePuzzleData?.explanation || 'Light path successfully traced!';

  useEffect(() => {
    updateCompanionState('curious');
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-slate-900 relative overflow-hidden">
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      <motion.div
        className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-6xl w-full border border-amber-900/30 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 border-b border-amber-900/30 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-600/20 rounded-lg border border-amber-600/30">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-wide">LIGHT PATH ANALYSIS</h2>
              <p className="text-slate-400 text-sm">Trace the Reflection Path</p>
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
              <span>Mirrors: {mirrors.length}/{maxMirrors}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Hints Used: {hints}</span>
            </div>
            {hitsTarget && (
              <motion.div
                className="flex items-center gap-2 text-green-400 font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-4 h-4" />
                <span>TARGET LOCKED</span>
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
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-amber-400 font-semibold mb-1 text-sm uppercase tracking-wide">Investigation Brief</h3>
              <p className="text-slate-200 leading-relaxed italic">{storyContext}</p>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 flex justify-center">
          <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-700/50" style={{ width: gridSize * cellSize + 32, height: gridSize * cellSize + 32 }}>
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
                  strokeWidth="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 4px rgba(251, 191, 36, 1))',
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
                    className={`border border-slate-700/30 flex items-center justify-center cursor-pointer transition-all ${
                      !mirror && !isStart && !isTarget ? 'hover:bg-amber-900/10 hover:border-amber-700/30' : ''
                    }`}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {isStart && (
                      <motion.div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg border-2 border-amber-300"
                        animate={{
                          scale: [1, 1.15, 1],
                          boxShadow: [
                            '0 0 20px rgba(251, 191, 36, 0.6)',
                            '0 0 30px rgba(251, 191, 36, 0.9)',
                            '0 0 20px rgba(251, 191, 36, 0.6)'
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        💡
                      </motion.div>
                    )}
                    {isTarget && (
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 ${
                          hitsTarget ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300' : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
                        }`}
                        animate={hitsTarget ? {
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            '0 0 20px rgba(74, 222, 128, 0.6)',
                            '0 0 40px rgba(74, 222, 128, 1)',
                            '0 0 20px rgba(74, 222, 128, 0.6)'
                          ]
                        } : {}}
                        transition={hitsTarget ? { repeat: Infinity, duration: 1 } : {}}
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
                          className="w-12 h-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 rounded-full shadow-lg cursor-pointer border border-cyan-200"
                          style={{
                            transform: `rotate(${mirror.angle}deg)`,
                            boxShadow: '0 0 8px rgba(103, 232, 249, 0.6), 0 0 12px rgba(103, 232, 249, 0.4)'
                          }}
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
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10 border border-red-400 shadow-lg"
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

        <div className="mb-4 text-center p-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
          <p className="text-sm text-slate-300">
            <span className="text-amber-400">Click</span> empty cells to place mirrors • <span className="text-cyan-400">Click mirrors</span> to rotate • <span className="text-red-400">Click ✕</span> to remove
          </p>
        </div>

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
                  <p className="text-amber-100 text-sm">Mirrors reflect light at angles. A 45° mirror bounces light 90 degrees! Position mirrors strategically to guide the beam from source to target. Click a mirror repeatedly to rotate it through different angles.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-slate-700/50">
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 rounded-lg transition-all border border-amber-700/30 hover:border-amber-600/50"
            >
              <HelpCircle size={18} />
              <span className="text-sm font-medium">Request Hint</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all border border-slate-600/30 hover:border-slate-500/50"
            >
              <RotateCcw size={18} />
              <span className="text-sm font-medium">Reset</span>
            </button>
          </div>

          <button
            onClick={handleCheck}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg border border-amber-500/30"
            disabled={mirrors.length === 0}
          >
            <Check size={20} />
            <span>Verify Solution</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
