import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RotateCcw, Play, Check, Settings, Clock, Target } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';
import { casePuzzles } from '../../data/puzzles';
import { caseThemes } from '../../data/cases';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

interface Gear {
  id: number;
  x: number;
  y: number;
  size: number;
  teeth: number;
  color: string;
}

export function GearPuzzle({ config, onComplete }: Props) {
  const rng = seedrandom(config.seed);
  const currentZone = useGameStore(state => state.currentZone);
  const theme = currentZone?.theme || caseThemes[1];
  const glowStyle = { ['--glow-color' as any]: theme.glow };
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [turns, setTurns] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  const numGears = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 5 : 7;
  const targetTurns = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 5 : 8;

  // Get story context
  const caseId = currentZone?.id || 1;
  const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'gear');
  const storyContext = casePuzzleData?.storyContext || 'Connect the gears to unlock the mechanism.';
  const explanation = casePuzzleData?.explanation || 'Mechanism successfully unlocked!';

  const gearPalette = [theme.palette.accent, theme.palette.highlight, theme.palette.secondary];

  const gears: Gear[] = Array.from({ length: numGears }).map((_, i) => {
    const angle = (360 / numGears) * i - 90;
    const radius = 150;
    const x = Math.cos((angle * Math.PI) / 180) * radius + 250;
    const y = Math.sin((angle * Math.PI) / 180) * radius + 200;

    return {
      id: i,
      x,
      y,
      size: 50 + (i === 0 ? 20 : 0),
      teeth: 12 + (i === 0 ? 4 : 0),
      color: gearPalette[i % gearPalette.length]
    };
  });

  useEffect(() => {
    updateCompanionState('curious');
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const renderGear = (gear: Gear, rotation: number) => {
    const toothAngle = 360 / gear.teeth;
    const innerRadius = gear.size * 0.6;
    const outerRadius = gear.size;
    const patternId = `gear-texture-${gear.id}`;

    const points = [];
    for (let i = 0; i < gear.teeth; i++) {
      const angle1 = (i * toothAngle - toothAngle * 0.25) * (Math.PI / 180);
      const angle2 = (i * toothAngle + toothAngle * 0.25) * (Math.PI / 180);

      points.push(`${innerRadius * Math.cos(angle1)},${innerRadius * Math.sin(angle1)}`);
      points.push(`${outerRadius * Math.cos(angle1)},${outerRadius * Math.sin(angle1)}`);
      points.push(`${outerRadius * Math.cos(angle2)},${outerRadius * Math.sin(angle2)}`);
      points.push(`${innerRadius * Math.cos(angle2)},${innerRadius * Math.sin(angle2)}`);
    }

    return (
      <g transform={`translate(${gear.x}, ${gear.y}) rotate(${rotation})`}>
        <defs>
          <pattern id={patternId} patternUnits="objectBoundingBox" width="1" height="1">
            <image href={theme.assets.gear} width={gear.size * 2} height={gear.size * 2} x="-50%" y="-50%" opacity="0.9" />
          </pattern>
        </defs>
        <circle cx="0" cy="0" r={gear.size} fill={`url(#${patternId})`} opacity="0.35" />
        <polygon
          points={points.join(' ')}
          className="piece-shine piece-snap"
          fill={gear.color}
          stroke={theme.palette.primary}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 8px ${theme.palette.accent}55)` }}
        />
        <circle cx="0" cy="0" r={gear.size * 0.3} fill="#1e293b" />
        <circle cx="0" cy="0" r={gear.size * 0.15} fill={gear.color} />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="14"
          fontWeight="bold"
        >
          {gear.id + 1}
        </text>
      </g>
    );
  };

  const toggleConnection = (gearId: number) => {
    if (gearId === numGears - 1) return;

    const key = `${gearId}-${gearId + 1}`;
    const newConnections = new Set(connections);

    if (newConnections.has(key)) {
      newConnections.delete(key);
    } else {
      newConnections.add(key);
    }

    setConnections(newConnections);
    setAttempts(prev => prev + 1);
  };

  const handleTurn = () => {
    setTurns(prev => prev + 1);
  };

  const isChainComplete = () => {
    if (connections.size === 0) return false;

    const visited = new Set<number>();
    const queue = [0];
    visited.add(0);

    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const conn of connections) {
        const [a, b] = conn.split('-').map(Number);
        if (a === current && !visited.has(b)) {
          visited.add(b);
          queue.push(b);
        } else if (b === current && !visited.has(a)) {
          visited.add(a);
          queue.push(a);
        }
      }
    }

    return visited.has(numGears - 1);
  };

  const handleSolve = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const chainComplete = isChainComplete();
    const solved = turns >= targetTurns && chainComplete;

    updateCompanionState(solved ? 'cheering' : 'thinking');

    setTimeout(() => {
      onComplete({
        solved,
        timeTaken,
        attemptsUsed: attempts,
        hintsUsed: hints,
        actualMoves: turns
      });
    }, solved ? 1500 : 500);
  };

  const handleReset = () => {
    setConnections(new Set());
    setTurns(0);
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

  const chainConnected = isChainComplete();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 relative overflow-hidden"
      style={{ backgroundImage: `${theme.background}, url(${theme.textures.background})` }}
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      <motion.div
        className="backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full relative"
        style={{
          backgroundImage: `linear-gradient(145deg, ${theme.palette.primary}, ${theme.palette.secondary})`,
          border: `1px solid ${theme.palette.accent}55`,
          boxShadow: `0 20px 40px ${theme.palette.primary}55`
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 border-b pb-4" style={{ borderColor: `${theme.palette.accent}55` }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2 rounded-lg border"
              style={{ background: `${theme.palette.accent}22`, borderColor: `${theme.palette.accent}55` }}
            >
              <Settings className="w-6 h-6" style={{ color: theme.palette.highlight }} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: theme.palette.highlight }}>MECHANISM ANALYSIS</h2>
              <p className="text-slate-100/80 text-sm">Gear System Decryption</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-100/80">
              <Clock className="w-4 h-4" style={{ color: theme.palette.accent }} />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-100/80">
              <Target className="w-4 h-4" style={{ color: theme.palette.accent }} />
              <span>Turns: {turns}/{targetTurns}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-100/80">
              <HelpCircle className="w-4 h-4" style={{ color: theme.palette.accent }} />
              <span>Hints Used: {hints}</span>
            </div>
            {chainConnected && (
              <motion.div
                className="flex items-center gap-2 font-semibold success-glow"
                style={glowStyle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-4 h-4" />
                <span>CHAIN CONNECTED</span>
              </motion.div>
            )}
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
            <div className="text-2xl">⚙️</div>
            <div>
              <h3 className="font-semibold mb-1 text-sm uppercase tracking-wide" style={{ color: theme.palette.highlight }}>Case Evidence</h3>
              <p className="text-slate-100 leading-relaxed italic">{storyContext}</p>
            </div>
          </div>
        </motion.div>

        {/* Gear mechanism */}
        <div className="mb-6 flex justify-center">
          <svg
            width="500"
            height="400"
            className="rounded-xl border"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary}66, ${theme.palette.secondary}55), url(${theme.textures.surface})`,
              borderColor: `${theme.palette.accent}55`
            }}
          >
            {/* Connection lines */}
            {Array.from(connections).map(key => {
              const [from, to] = key.split('-').map(Number);
              const gear1 = gears[from];
              const gear2 = gears[to];

              return (
                <motion.line
                  key={key}
                  x1={gear1.x}
                  y1={gear1.y}
                  x2={gear2.x}
                  y2={gear2.y}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' }}
                />
              );
            })}

            {/* Gears */}
            {gears.map((gear, i) => {
              let rotation = 0;
              if (connections.size > 0 && isChainComplete()) {
                const visited = new Set<number>();
                const queue = [{ id: 0, dir: 1 }];
                visited.add(0);
                const directions: Record<number, number> = { 0: 1 };

                while (queue.length > 0) {
                  const { id: current, dir } = queue.shift()!;

                  for (const conn of connections) {
                    const [a, b] = conn.split('-').map(Number);
                    if (a === current && !visited.has(b)) {
                      visited.add(b);
                      directions[b] = -dir;
                      queue.push({ id: b, dir: -dir });
                    } else if (b === current && !visited.has(a)) {
                      visited.add(a);
                      directions[a] = -dir;
                      queue.push({ id: a, dir: -dir });
                    }
                  }
                }

                if (visited.has(i)) {
                  rotation = turns * 45 * (directions[i] || 0);
                }
              }

              return (
                <g key={i}>
                  {renderGear(gear, rotation)}
                  <circle
                    cx={gear.x}
                    cy={gear.y}
                    r={gear.size + 10}
                    fill="transparent"
                    stroke="transparent"
                    strokeWidth="20"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleConnection(gear.id)}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div
          className="mb-4 text-center p-3 rounded-lg border"
          style={{
            background: `${theme.palette.primary}44`,
            borderColor: `${theme.palette.accent}55`
          }}
        >
          <p className="text-sm text-slate-300">
            <span className="text-amber-400">Click gears</span> to connect them • <span className="text-green-400">Orange gear (start)</span> → <span className="text-emerald-400">Green gear (finish)</span>
          </p>
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
                  <p className="text-slate-100 text-sm">Connect gears in a chain from the start gear to the finish gear. Once connected, turn the crank enough times to unlock the mechanism. When gears mesh, they rotate in opposite directions!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-slate-700/50">
          <div className="flex gap-2">
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
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                background: `${theme.palette.secondary}22`,
                border: `1px solid ${theme.palette.secondary}66`,
                color: '#e2e8f0'
              }}
            >
              <RotateCcw size={18} />
              <span className="text-sm font-medium">Reset</span>
            </button>
            <button
              onClick={handleTurn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold"
              style={{
                background: `${theme.palette.accent}33`,
                border: `1px solid ${theme.palette.accent}77`,
                color: theme.palette.highlight,
                opacity: chainConnected ? 1 : 0.6
              }}
              disabled={!chainConnected}
            >
              <Play size={18} />
              <span className="text-sm font-medium">Turn Crank</span>
            </button>
          </div>

          <button
            onClick={handleSolve}
            className="px-6 py-2 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg border success-glow"
            style={{
              backgroundImage: `linear-gradient(145deg, ${theme.palette.accent}, ${theme.palette.highlight})`,
              borderColor: `${theme.palette.accent}88`,
              ...glowStyle
            }}
          >
            <Check size={20} />
            <span>Verify Solution</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
