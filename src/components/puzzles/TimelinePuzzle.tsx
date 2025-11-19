import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { PuzzleConfig, TimelinePuzzleData } from '../../types';
import { casePuzzles } from '../../data/puzzles';
import seedrandom from 'seedrandom';
import { Clock, ArrowUp, ArrowDown, Shuffle } from 'lucide-react';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

export function TimelinePuzzle({ config, onComplete }: Props) {
  const rng = seedrandom(config.seed);
  const { currentZone, updateCompanionState, settings } = useGameStore();

  const caseId = currentZone?.id || 1;
  const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'timeline');
  const timelineData = useMemo(() => {
    const baseData = (casePuzzleData?.data as TimelinePuzzleData | undefined) || {
      events: [
        { id: 'a', description: 'Victim discovered', clue: 'Start here' },
        { id: 'b', description: 'Alibi claimed', clue: 'Before midnight' },
        { id: 'c', description: 'Secret message found', clue: 'Morning after' }
      ],
      correctOrder: ['a', 'b', 'c']
    };

    if (settings.hardMode && casePuzzleData?.hardVariant?.data) {
      return casePuzzleData.hardVariant.data as TimelinePuzzleData;
    }

    return baseData;
  }, [casePuzzleData, settings.hardMode]);

  const targetOrder = useMemo(() => {
    const extendedOrder = [...timelineData.correctOrder];
    if (settings.hardMode && timelineData.decoys) {
      extendedOrder.push(...timelineData.decoys.map(event => event.id));
    }
    return extendedOrder;
  }, [timelineData, settings.hardMode]);

  const shuffledEvents = useMemo(() => {
    const combinedEvents = [...timelineData.events, ...(settings.hardMode && timelineData.decoys ? timelineData.decoys : [])];
    return combinedEvents
      .map(event => ({ event, sort: rng() }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.event);
  }, [timelineData, settings.hardMode, rng]);

  const [orderedEvents, setOrderedEvents] = useState(shuffledEvents);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showResult, setShowResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    updateCompanionState('thinking');
  }, [updateCompanionState]);

  const moveEvent = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= orderedEvents.length) return;

    const newOrder = [...orderedEvents];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(newIndex, 0, moved);
    setOrderedEvents(newOrder);
    setMoves(prev => prev + 1);
  };

  const handleShuffle = () => {
    setOrderedEvents(shuffledEvents);
    setMoves(prev => prev + 1);
  };

  const handleSubmit = () => {
    const orderIds = orderedEvents.map(event => event.id);
    const isCorrect = targetOrder.length === orderIds.length && targetOrder.every((id, idx) => id === orderIds[idx]);

    setAttempts(prev => prev + 1);
    setShowResult({
      success: isCorrect,
      message: isCorrect ? 'Timeline reconstructed!' : 'That order leaves gaps in the alibi.'
    });

    if (isCorrect) {
      updateCompanionState('cheering');
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => {
        onComplete({
          solved: true,
          timeTaken,
          attemptsUsed: attempts + 1,
          hintsUsed: hints,
          actualMoves: moves || targetOrder.length
        });
      }, 1200);
    }
  };

  const activeStory = settings.hardMode && casePuzzleData?.hardVariant?.storyContext
    ? casePuzzleData.hardVariant.storyContext
    : casePuzzleData?.storyContext;

  const activeExplanation = settings.hardMode && casePuzzleData?.hardVariant?.explanation
    ? casePuzzleData.hardVariant.explanation
    : casePuzzleData?.explanation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-amber-200 text-sm font-semibold mb-2 flex items-center gap-2">
              <Clock size={16} /> Reconstruct the sequence of events
            </p>
            <h2 className="text-3xl font-bold mb-2">Timeline Reconstruction</h2>
            <p className="text-slate-200 max-w-3xl leading-relaxed">
              {activeStory || 'Place the events in the correct chronological order to verify the suspect timeline.'}
            </p>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 text-center border border-slate-700 shadow-lg">
            <div className="text-sm text-slate-400">Difficulty</div>
            <div className="text-xl font-bold text-amber-300 capitalize">{config.difficulty}</div>
            <div className="text-xs text-slate-500 mt-1">{settings.hardMode ? 'Hard mode: decoy steps included' : 'Standard clues enabled'}</div>
          </div>
        </div>

        <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Arrange the events</h3>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg text-sm border border-slate-600 hover:border-amber-400 transition"
            >
              <Shuffle size={16} /> Reset Order
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {orderedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 bg-slate-900/60 border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveEvent(index, -1)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
                      aria-label="Move up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveEvent(index, 1)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
                      aria-label="Move down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div>
                    <div className="text-amber-200 text-sm mb-1">Event {index + 1}</div>
                    <div className="font-semibold text-lg">{event.description}</div>
                    {(!settings.hardMode || event.clue) && (
                      <p className="text-sm text-slate-300 mt-1">{event.clue || 'No extra clues provided.'}</p>
                    )}
                    {event.timeHint && (
                      <p className="text-xs text-amber-300 mt-1">{event.timeHint}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-900 font-semibold shadow-lg hover:shadow-emerald-900/40 transition"
            >
              Validate Order
            </button>
            <button
              onClick={() => {
                setShowHint(true);
                setHints(prev => prev + 1);
                updateCompanionState('stuck');
              }}
              className="px-4 py-2 rounded-lg border border-amber-400/50 text-amber-200 hover:bg-amber-500/10 transition"
            >
              Need a clue?
            </button>
            {showHint && (
              <span className="text-sm text-amber-200">{timelineData.events[0]?.clue || 'Look for the earliest action.'}</span>
            )}
          </div>

          {showResult && (
            <div
              className={`mt-3 p-4 rounded-xl border ${
                showResult.success ? 'bg-emerald-500/10 border-emerald-400/40' : 'bg-rose-500/10 border-rose-400/40'
              }`}
            >
              <p className="font-semibold">{showResult.message}</p>
              {!showResult.success && activeExplanation && (
                <p className="text-sm text-slate-200 mt-1">{activeExplanation}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
