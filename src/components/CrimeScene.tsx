import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, X } from 'lucide-react';

interface Clue {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position
  y: number; // percentage position
  size: number; // size of clickable area
  foundMessage: string;
}

interface CrimeSceneProps {
  caseId: number;
  sceneDescription: string;
  clues: Clue[];
  onComplete: (foundClues: string[]) => void;
  requiredClues?: number; // minimum clues to find before continuing
}

export function CrimeScene({ caseId, sceneDescription, clues, onComplete, requiredClues }: CrimeSceneProps) {
  const [foundClues, setFoundClues] = useState<Set<string>>(new Set());
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const minRequired = requiredClues || Math.ceil(clues.length * 0.6);
  const canContinue = foundClues.size >= minRequired;

  const handleClueClick = (clue: Clue) => {
    if (!foundClues.has(clue.id)) {
      setFoundClues(new Set([...foundClues, clue.id]));
      setSelectedClue(clue);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const getSceneBackground = (caseId: number): string => {
    // Different noir scenes for each case
    const scenes: Record<number, { bg: string; overlay: string }> = {
      1: { // The Midnight Caller - Library
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        overlay: '🏛️'
      },
      2: { // Blood on the Tracks - Train
        bg: 'linear-gradient(135deg, #2d0a0a 0%, #1a0505 50%, #0d0202 100%)',
        overlay: '🚂'
      },
      3: { // The Poisoned Pen - Writers Retreat
        bg: 'linear-gradient(135deg, #301934 0%, #1f0f28 50%, #150a1a 100%)',
        overlay: '📚'
      },
      4: { // Ashes to Ashes - Office Building
        bg: 'linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 50%, #000000 100%)',
        overlay: '🏢'
      },
      5: { // The Double Cross - Safe House
        bg: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
        overlay: '🕵️'
      }
    };

    return scenes[caseId]?.bg || scenes[1].bg;
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 opacity-80"
        style={{ background: getSceneBackground(caseId) }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
            <span className="text-amber-400 font-semibold tracking-wider text-sm uppercase">
              Crime Scene Investigation
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Search for Evidence
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {sceneDescription}
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-white font-semibold">
                {foundClues.size} / {clues.length} clues found
              </span>
            </div>
            {canContinue && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full"
              >
                <span className="text-green-400 text-sm font-semibold">
                  Ready to proceed
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Crime Scene Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-800/40 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl"
          style={{ height: '500px' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
        >
          {/* Scene Description Overlay */}
          <div className="absolute top-4 left-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-300 text-sm">
              💡 <strong className="text-amber-400">Tip:</strong> Click on suspicious objects and areas to investigate
            </p>
          </div>

          {/* Clickable Clues */}
          {clues.map((clue) => {
            const isFound = foundClues.has(clue.id);
            return (
              <motion.button
                key={clue.id}
                className={`absolute rounded-full transition-all ${
                  isFound
                    ? 'bg-green-500/30 border-2 border-green-400 cursor-default'
                    : 'bg-amber-500/20 border-2 border-amber-400/50 hover:bg-amber-500/40 hover:scale-110 cursor-pointer'
                }`}
                style={{
                  left: `${clue.x}%`,
                  top: `${clue.y}%`,
                  width: `${clue.size}px`,
                  height: `${clue.size}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleClueClick(clue)}
                whileHover={!isFound ? { scale: 1.2 } : {}}
                whileTap={!isFound ? { scale: 0.95 } : {}}
              >
                {isFound && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center h-full"
                  >
                    <CheckCircle className="text-green-400" size={clue.size * 0.6} />
                  </motion.div>
                )}
                {!isFound && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center justify-center h-full"
                  >
                    <Search className="text-amber-400" size={clue.size * 0.5} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Magnifier cursor effect */}
          {showMagnifier && !selectedClue && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: cursorPosition.x,
                top: cursorPosition.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-12 h-12 rounded-full border-3 border-amber-400/50 bg-amber-500/10 backdrop-blur-sm" />
            </div>
          )}
        </motion.div>

        {/* Clue Detail Modal */}
        <AnimatePresence>
          {selectedClue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedClue(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 border-2 border-amber-500/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Search className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedClue.name}</h3>
                      <p className="text-amber-400 text-sm">Evidence Found!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClue(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-slate-300 leading-relaxed">
                      {selectedClue.description}
                    </p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-400 text-sm">
                      ✓ {selectedClue.foundMessage}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClue(null)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all"
                >
                  Continue Investigating
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => onComplete(Array.from(foundClues))}
            disabled={!canContinue}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold text-lg hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
          >
            {canContinue
              ? '🔍 Analyze Evidence & Continue'
              : `Find ${minRequired - foundClues.size} more clue${minRequired - foundClues.size > 1 ? 's' : ''}`
            }
          </button>
        </div>

        {/* Found Clues List */}
        {foundClues.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-400" size={20} />
              Evidence Collected
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {Array.from(foundClues).map((clueId) => {
                const clue = clues.find(c => c.id === clueId);
                if (!clue) return null;
                return (
                  <div
                    key={clue.id}
                    className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                      <span className="text-slate-300 text-sm">{clue.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
