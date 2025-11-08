import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { PuzzleConfig } from '../../types';
import { useGameStore } from '../../store/gameStore';
import seedrandom from 'seedrandom';

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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const updateCompanionState = useGameStore(state => state.updateCompanionState);

  useEffect(() => {
    updateCompanionState('curious');
  }, []);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setAttempts(prev => prev + 1);

    const correct = index === puzzle.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      updateCompanionState('cheering');
      setTimeout(() => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        onComplete({
          solved: true,
          timeTaken,
          attemptsUsed: attempts + 1,
          hintsUsed: hints,
          actualMoves: 1
        });
      }, 1500);
    } else {
      updateCompanionState('thinking');
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const handleHint = () => {
    setHints(prev => prev + 1);
    updateCompanionState('stuck');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-green-50 to-emerald-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Logic Puzzle</h2>
          <p className="text-gray-600">Think carefully and solve the challenge</p>
        </div>

        <motion.div
          className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">{puzzle.story}</p>
          <p className="text-xl font-semibold text-indigo-900">{puzzle.question}</p>
        </motion.div>

        {hints > 0 && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> Think about each option carefully. What makes the most logical sense?
            </p>
          </motion.div>
        )}

        <div className="space-y-3 mb-6">
          {puzzle.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !showFeedback && handleAnswer(index)}
              className={`w-full p-4 rounded-xl border-4 text-left transition-all ${
                selectedAnswer === index && showFeedback
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: showFeedback ? 1 : 1.02 }}
              whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              disabled={showFeedback}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="text-gray-800">{option}</div>
              </div>
            </motion.button>
          ))}
        </div>

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

          <div className="text-sm text-gray-500">
            Attempts: {attempts}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
