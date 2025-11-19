import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import seedrandom from 'seedrandom';
import { ShieldCheck, KeyRound, Wand2 } from 'lucide-react';
import { casePuzzles } from '../../data/puzzles';
import { useGameStore } from '../../store/gameStore';
import type { CipherPuzzleData, PuzzleConfig } from '../../types';

interface Props {
  config: PuzzleConfig;
  onComplete: (data: { solved: boolean; timeTaken: number; attemptsUsed: number; hintsUsed: number; actualMoves: number }) => void;
}

export function CipherPuzzle({ config, onComplete }: Props) {
  const rng = seedrandom(config.seed);
  const { currentZone, updateCompanionState, settings } = useGameStore();

  const caseId = currentZone?.id || 1;
  const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'cipher');

  const cipherData = useMemo(() => {
    const baseData = (casePuzzleData?.data as CipherPuzzleData | undefined) || {
      cipherText: 'XLMW MW E QA XLMRO XLMRO',
      alphabetKey: { W: 'T', X: 'H', M: 'I', E: 'S' },
      clue: 'Each letter is shifted by four.',
      options: ['THIS IS A THING THING', 'THIS IS THE HINT HINT', 'THIS IS A THING', 'THIS IS THE THINK THING'],
      correctAnswer: 'THIS IS THE HINT HINT'
    };

    if (settings.hardMode && casePuzzleData?.hardVariant?.data) {
      return casePuzzleData.hardVariant.data as CipherPuzzleData;
    }

    return baseData;
  }, [casePuzzleData, settings.hardMode]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    updateCompanionState('curious');
  }, [updateCompanionState]);

  const options = useMemo(() => {
    const baseOptions = [...cipherData.options];
    if (settings.hardMode && casePuzzleData?.hardVariant?.data) {
      const extra = cipherData.decoySymbols?.map(symbol => `${symbol} ${cipherData.correctAnswer}`) || [];
      baseOptions.push(...extra);
    }
    return baseOptions
      .map(option => ({ option, sort: rng() }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.option);
  }, [cipherData, rng, settings.hardMode, casePuzzleData?.hardVariant?.data]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === cipherData.correctAnswer;
    setFeedback(isCorrect ? 'Cipher cracked!' : 'That translation doesn\'t match the clues.');
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      updateCompanionState('celebrating');
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => {
        onComplete({
          solved: true,
          timeTaken,
          attemptsUsed: attempts + 1,
          hintsUsed: hints,
          actualMoves: attempts + 1
        });
      }, 900);
    } else {
      updateCompanionState('thinking');
    }
  };

  const showHint = () => {
    setHints(prev => prev + 1);
    setFeedback(`Key hint: ${cipherData.clue}`);
    updateCompanionState('stuck');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-amber-200 text-sm font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck size={16} /> Decode the case cipher
            </p>
            <h2 className="text-3xl font-bold mb-2">Cipher Analysis</h2>
            <p className="text-slate-200 leading-relaxed">
              {(settings.hardMode && casePuzzleData?.hardVariant?.storyContext) ||
                casePuzzleData?.storyContext ||
                'Use the case alphabet to decode the hidden message left at the scene.'}
            </p>
          </div>
          <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700 text-center shadow-lg">
            <div className="text-sm text-slate-400">Alphabet Key</div>
            <div className="flex flex-wrap gap-2 justify-center text-amber-200 mt-2">
              {Object.entries(cipherData.alphabetKey).map(([cipher, plain]) => (
                <span key={cipher} className="px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-700 text-sm">
                  {cipher} → {plain}
                </span>
              ))}
            </div>
            {settings.hardMode && cipherData.decoySymbols && (
              <p className="text-xs text-amber-300 mt-3">Decoys: {cipherData.decoySymbols.join(', ')}</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-lg font-semibold text-amber-200 flex items-center gap-2">
            <KeyRound size={18} /> Cipher Text
          </div>
          <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700 text-xl tracking-wide font-mono text-center">
            {cipherData.cipherText}
          </div>

          <div className="space-y-3">
            {options.map(option => (
              <motion.button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition shadow-sm ${
                  selectedOption === option
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/60 hover:border-amber-400'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 font-semibold shadow-lg hover:shadow-amber-900/30 transition"
            >
              Confirm Translation
            </button>
            <button
              onClick={showHint}
              className="px-4 py-2 rounded-lg border border-amber-400/50 text-amber-200 hover:bg-amber-500/10 transition flex items-center gap-2"
            >
              <Wand2 size={16} />
              Reveal Hint
            </button>
          </div>

          {feedback && (
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-sm text-amber-100">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
