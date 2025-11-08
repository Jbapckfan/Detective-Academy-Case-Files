import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Brain, Clock, Target } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';
import { casePuzzles } from '../../data/puzzles';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

const CASE_SCENARIOS: Record<number, Record<string, Array<{story: string, question: string, options: string[], correct: number}>>> = {
  1: {
    easy: [
      {
        story: "Lady Ashworth's butler says he was polishing silver when the diamond disappeared. The silver room is next to her bedroom.",
        question: "What's suspicious about his alibi?",
        options: ["He would have heard the safe", "Silver doesn't need polishing", "He should have seen something", "The timing doesn't match"],
        correct: 0
      }
    ],
    medium: [
      {
        story: "The safe opened at 3:15 PM. Butler served tea until 3:30 PM. Daughter left at 2:00 PM. Business partner arrived at 3:45 PM.",
        question: "Who had opportunity?",
        options: [
          "Only the butler",
          "Daughter could have returned",
          "Business partner with help",
          "Someone without a key"
        ],
        correct: 1
      }
    ],
    hard: [
      {
        story: "Three suspects claim they were alone. Phone records show two calls between them during the theft. One is lying.",
        question: "What's the logical deduction?",
        options: [
          "Two people worked together",
          "All three are lying",
          "Someone made calls remotely",
          "Records are wrong"
        ],
        correct: 0
      }
    ]
  },
  2: {
    easy: [
      {
        story: "The painting was behind laser grid C-4. Three guards had codes. One guard was on vacation.",
        question: "How many suspects?",
        options: ["One guard", "Two guards", "Three guards", "Unknown"],
        correct: 1
      }
    ],
    medium: [
      {
        story: "Alarm disarmed at 2:45 PM, re-armed at 3:15 PM. Theft at 3:00 PM.",
        question: "What does this tell us?",
        options: [
          "Thief had alarm code",
          "Inside job",
          "Logs tampered",
          "Multiple people involved"
        ],
        correct: 1
      }
    ],
    hard: [
      {
        story: "Two curators claim they were together. Security badges show them in different wings.",
        question: "How do we find who's lying?",
        options: [
          "Check camera footage",
          "Compare phone locations",
          "Interview witnesses",
          "All of the above"
        ],
        correct: 3
      }
    ]
  },
  3: {
    easy: [
      {
        story: "Marcus Chen's office was locked from inside. Only he and his assistant had keys. Window is 40 floors up.",
        question: "Who could have been in the office?",
        options: ["Only Marcus", "Marcus or assistant", "Anyone with key", "Someone through window"],
        correct: 1
      }
    ],
    medium: [
      {
        story: "Three large transfers to offshore accounts. Each executive had password access. Logs show one account accessed twice.",
        question: "Minimum people involved?",
        options: ["At least one", "At least two", "Exactly three", "Cannot determine"],
        correct: 1
      }
    ],
    hard: [
      {
        story: "Three executives' phones in building. Emails sent from Marcus's computer. Biometric lock shows no entry after 5 PM.",
        question: "Most logical explanation?",
        options: [
          "Credentials stolen",
          "Biometric failed",
          "Someone bypassed lock",
          "Assistant used computer"
        ],
        correct: 0
      }
    ]
  }
};

export function LogicPuzzle({ config, onComplete }: Props) {
  const rng = seedrandom(config.seed);
  const currentZone = useGameStore(state => state.currentZone);

  const defaultScenarios = [
    {
      story: "A suspect claims innocence but evidence contradicts their statement.",
      question: "What should you do?",
      options: ["Investigate further", "Arrest them", "Believe them", "Ignore evidence"],
      correct: 0
    }
  ];

  const scenarios = currentZone?.id && CASE_SCENARIOS[currentZone.id]
    ? CASE_SCENARIOS[currentZone.id][config.difficulty]
    : defaultScenarios;

  const puzzle = scenarios[Math.floor(rng() * scenarios.length)];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  // Get story context from puzzle data
  const caseId = currentZone?.id || 1;
  const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'logic');
  const storyContext = casePuzzleData?.storyContext || puzzle.story;
  const explanation = casePuzzleData?.explanation || 'Correct deduction!';

  useEffect(() => {
    updateCompanionState('curious');
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setAttempts(prev => prev + 1);

    const correct = index === puzzle.correct;
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
        className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full border border-amber-900/30 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 border-b border-amber-900/30 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-600/20 rounded-lg border border-amber-600/30">
              <Brain className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-wide">DEDUCTION BOARD</h2>
              <p className="text-slate-400 text-sm">Logical Reasoning Required</p>
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
              <span>Attempts: {attempts}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Hints Used: {hints}</span>
            </div>
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
            <div className="text-2xl">📋</div>
            <div>
              <h3 className="text-amber-400 font-semibold mb-1 text-sm uppercase tracking-wide">Case Brief</h3>
              <p className="text-slate-200 leading-relaxed italic">{storyContext}</p>
            </div>
          </div>
        </motion.div>

        {/* Case Evidence */}
        <motion.div
          className="mb-6 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <h3 className="text-amber-400 text-sm font-semibold mb-3 uppercase tracking-wide">Case Evidence</h3>
          <p className="text-lg text-slate-200 mb-4 leading-relaxed font-serif italic">{puzzle.story}</p>
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xl font-semibold text-amber-300">{puzzle.question}</p>
          </div>
        </motion.div>

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
                  <p className="text-amber-100 text-sm">Think about each option carefully. What makes the most logical sense given the evidence? Consider timing, opportunity, and contradictions in statements.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Options */}
        <div className="mb-6">
          <h3 className="text-amber-400 text-sm font-semibold mb-3 uppercase tracking-wider">Your Deduction</h3>
          <div className="space-y-3">
            {puzzle.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showFeedback && handleAnswer(index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all backdrop-blur-sm ${
                  selectedAnswer === index && showFeedback
                    ? isCorrect
                      ? 'border-green-500 bg-green-900/30 shadow-lg shadow-green-500/20'
                      : 'border-red-500 bg-red-900/30 shadow-lg shadow-red-500/20'
                    : 'border-slate-700 hover:border-amber-600 hover:bg-amber-900/10 bg-slate-800/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: showFeedback ? 1 : 1.02, x: showFeedback ? 0 : 4 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border ${
                    selectedAnswer === index && showFeedback
                      ? isCorrect
                        ? 'bg-green-500 text-white border-green-400'
                        : 'bg-red-500 text-white border-red-400'
                      : 'bg-amber-900/30 text-amber-400 border-amber-700/30'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="text-slate-200 flex-1">{option}</div>
                  {selectedAnswer === index && showFeedback && (
                    <div className={`text-2xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Explanation after solving */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-700/40 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-green-400 font-semibold mb-2">Case Solved!</p>
                  <p className="text-green-100 text-sm leading-relaxed">{explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 rounded-lg transition-all border border-amber-700/30 hover:border-amber-600/50"
          >
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Request Hint</span>
          </button>

          <div className="text-xs text-slate-500 italic">
            Apply deductive reasoning...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
