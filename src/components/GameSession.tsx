import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Companion } from './Companion';
import { CaseBriefing } from './CaseBriefing';
import { CrimeScene } from './CrimeScene';
import { SequencePuzzle } from './puzzles/SequencePuzzle';
import { MirrorPuzzle } from './puzzles/MirrorPuzzle';
import { GearPuzzle } from './puzzles/GearPuzzle';
import { LogicPuzzle } from './puzzles/LogicPuzzle';
import { SpatialPuzzle } from './puzzles/SpatialPuzzle';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import type { PuzzleConfig } from '../types';
import { crimeScenes } from '../data/crimeScenes';

interface Props {
  onComplete: () => void;
}

export function GameSession({ onComplete }: Props) {
  const {
    currentSession,
    currentZone,
    adaptiveState,
    currentPuzzle,
    completePuzzle,
    companion,
    profiles,
    addCompanionXP
  } = useGameStore();

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const [showCrimeScene, setShowCrimeScene] = useState(true);
  const [collectedEvidence, setCollectedEvidence] = useState<string[]>([]);
  const [sessionScore, setSessionScore] = useState(0);

  const totalPuzzles = adaptiveState?.nextPuzzles.length || 5;
  const isLastPuzzle = puzzleIndex >= totalPuzzles - 1;

  useEffect(() => {
    if (adaptiveState && adaptiveState.nextPuzzles[puzzleIndex]) {
      const nextPuzzle = adaptiveState.nextPuzzles[puzzleIndex];
      useGameStore.getState().startPuzzle(nextPuzzle);
      setShowBriefing(true);
    }
  }, [puzzleIndex, adaptiveState]);

  const handlePuzzleComplete = async (data: {
    solved: boolean;
    timeTaken: number;
    attemptsUsed: number;
    hintsUsed: number;
    actualMoves: number;
  }) => {
    if (!currentPuzzle || !currentSession) return;

    await completePuzzle({
      puzzleType: currentPuzzle.type,
      difficulty: currentPuzzle.difficulty,
      difficultyRating: currentPuzzle.difficultyRating,
      solved: data.solved,
      timeTaken: data.timeTaken,
      attemptsUsed: data.attemptsUsed,
      hintsUsed: data.hintsUsed,
      optimalMoves: currentPuzzle.optimalMoves,
      actualMoves: data.actualMoves
    });

    const score = data.solved ? Math.max(0, 100 - data.hintsUsed * 10 - data.attemptsUsed * 5) : 0;
    setSessionScore(prev => prev + score);

    if (isLastPuzzle) {
      setShowCelebration(true);
    } else {
      setTimeout(() => {
        setPuzzleIndex(prev => prev + 1);
      }, 1000);
    }
  };

  const handleBriefingComplete = () => {
    setShowBriefing(false);
  };

  const handleCrimeSceneComplete = (foundClues: string[]) => {
    setCollectedEvidence(foundClues);
    setShowCrimeScene(false);
    setShowBriefing(false);
  };

  const handleSessionComplete = () => {
    useGameStore.getState().completeSession();
    onComplete();
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-8">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy size={80} className="mx-auto text-yellow-500 mb-6" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Zone Complete!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            You and {companion?.name} solved all the puzzles in {currentZone?.name}!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-indigo-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600">
                {currentSession?.puzzlesCompleted || 0}
              </div>
              <div className="text-sm text-indigo-800">Puzzles Solved</div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(sessionScore / (currentSession?.puzzlesCompleted || 1))}
              </div>
              <div className="text-sm text-green-800">Avg Score</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">
                +{Math.round(sessionScore / 2)}
              </div>
              <div className="text-sm text-purple-800">XP Earned</div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
            <h3 className="font-semibold text-blue-900 mb-4">Your Skills Improved!</h3>
            <div className="space-y-2">
              {Object.entries(profiles).map(([skill, value]) => (
                <div key={skill} className="flex justify-between items-center">
                  <span className="text-sm text-blue-800 capitalize">{skill}</span>
                  <span className="text-sm font-bold text-blue-900">{Math.round(value)}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSessionComplete}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={24} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentPuzzle || !currentZone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  // Show crime scene at the start (only for cases 1-5 which have crime scenes)
  if (showCrimeScene && puzzleIndex === 0 && crimeScenes[currentZone.id]) {
    const sceneData = crimeScenes[currentZone.id];
    return (
      <CrimeScene
        caseId={sceneData.caseId}
        sceneDescription={sceneData.description}
        clues={sceneData.clues}
        onComplete={handleCrimeSceneComplete}
        requiredClues={sceneData.requiredClues}
      />
    );
  }

  if (showBriefing) {
    return (
      <CaseBriefing
        zoneId={currentZone.id}
        puzzleType={currentPuzzle.type}
        onContinue={handleBriefingComplete}
      />
    );
  }

  return (
    <>
      <Companion />

      <div className="fixed top-6 right-6 z-50 bg-white rounded-2xl shadow-lg p-4 min-w-[200px]">
        <div className="text-sm text-gray-600 mb-2">{currentZone.name}</div>
        <div className="flex items-center gap-2 mb-3">
          {Array.from({ length: totalPuzzles }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i < puzzleIndex
                  ? 'bg-green-500'
                  : i === puzzleIndex
                  ? 'bg-indigo-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500">
          Puzzle {puzzleIndex + 1} of {totalPuzzles}
        </div>
      </div>

      {currentPuzzle.type === 'sequence' && (
        <SequencePuzzle config={currentPuzzle} onComplete={handlePuzzleComplete} />
      )}
      {currentPuzzle.type === 'mirror' && (
        <MirrorPuzzle config={currentPuzzle} onComplete={handlePuzzleComplete} />
      )}
      {currentPuzzle.type === 'gear' && (
        <GearPuzzle config={currentPuzzle} onComplete={handlePuzzleComplete} />
      )}
      {currentPuzzle.type === 'logic' && (
        <LogicPuzzle config={currentPuzzle} onComplete={handlePuzzleComplete} />
      )}
      {currentPuzzle.type === 'spatial' && (
        <SpatialPuzzle config={currentPuzzle} onComplete={handlePuzzleComplete} />
      )}
    </>
  );
}
