import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, RotateCcw, Play, Check } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';

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
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [turns, setTurns] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  const numGears = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 5 : 7;
  const targetTurns = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 5 : 8;

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
      color: i === 0 ? '#f59e0b' : i === numGears - 1 ? '#10b981' : '#6366f1'
    };
  });

  useEffect(() => {
    updateCompanionState('curious');
  }, []);

  const renderGear = (gear: Gear, rotation: number) => {
    const toothAngle = 360 / gear.teeth;
    const innerRadius = gear.size * 0.6;
    const outerRadius = gear.size;

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
        <circle cx="0" cy="0" r={gear.size} fill={gear.color} opacity="0.3" />
        <polygon points={points.join(' ')} fill={gear.color} stroke="#fff" strokeWidth="2" />
        <circle cx="0" cy="0" r={gear.size * 0.3} fill="#fff" />
        <circle cx="0" cy="0" r={gear.size * 0.15} fill={gear.color} />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="16"
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-amber-50 to-orange-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Gear Puzzle</h2>
          <p className="text-gray-600">Connect the gears from start (orange) to finish (green)</p>
        </div>

        <div className="mb-6 flex justify-center">
          <svg width="500" height="400" className="bg-gray-50 rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
            {Array.from(connections).map(key => {
              const [from, to] = key.split('-').map(Number);
              const gear1 = gears[from];
              const gear2 = gears[to];

              return (
                <line
                  key={key}
                  x1={gear1.x}
                  y1={gear1.y}
                  x2={gear2.x}
                  y2={gear2.y}
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeDasharray="5,5"
                />
              );
            })}

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

        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Click gears to connect them • Orange gear (start) → Green gear (finish)
          </p>
        </div>

        {hints > 0 && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> Connect gears in a chain from the orange start gear to the green finish gear. Then turn the crank enough times!
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
            <button
              onClick={handleTurn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors font-semibold"
            >
              <Play size={20} />
              Turn Crank
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Turns: {turns}/{targetTurns}
              {isChainComplete() && <span className="ml-2 text-green-600 font-semibold">✓ Connected!</span>}
            </div>
            <button
              onClick={handleSolve}
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
