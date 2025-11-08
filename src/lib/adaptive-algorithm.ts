import seedrandom from 'seedrandom';
import type {
  CognitiveProfiles,
  PuzzleConfig,
  PuzzleType,
  Tier,
  AdaptiveState,
  PuzzleAttempt
} from '../types';

const SKILL_DECAY_RATE = 0.98;
const PRIMARY_SKILL_LEARNING_RATE = 0.1;
const SECONDARY_SKILL_LEARNING_RATE = 0.05;
const BASE_SKILL_MOMENTUM = 0.9;

const TIER_BASE_DIFFICULTY: Record<Tier, number> = {
  'jr-detective': 25,
  'detective': 50,
  'master-detective': 75,
};

const PUZZLE_SKILL_MAPPING: Record<PuzzleType, { primary: keyof CognitiveProfiles; secondary: Partial<Record<keyof CognitiveProfiles, number>> }> = {
  sequence: {
    primary: 'patterns',
    secondary: { sequencing: 0.3 }
  },
  mirror: {
    primary: 'spatial',
    secondary: { logic: 0.3, lateral: 0.2 }
  },
  gear: {
    primary: 'sequencing',
    secondary: { logic: 0.4, spatial: 0.2 }
  },
  logic: {
    primary: 'logic',
    secondary: { lateral: 0.4, sequencing: 0.2 }
  },
  spatial: {
    primary: 'spatial',
    secondary: { patterns: 0.2 }
  }
};

export class AdaptiveAlgorithm {
  private rng: () => number;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || Date.now().toString());
  }

  calculatePuzzleScore(attempt: {
    correct: boolean;
    timeTaken: number;
    maxTime: number;
    optimalMoves: number;
    actualMoves: number;
    attemptsUsed: number;
    hintsUsed: number;
  }): number {
    if (!attempt.correct) return 0;

    const baseScore = 100;
    const speedBonus = Math.max(0, 100 - (attempt.timeTaken / attempt.maxTime) * 100);
    const efficiencyBonus = (attempt.optimalMoves / Math.max(attempt.actualMoves, 1)) * 50;
    const attemptsPenalty = Math.max(0, 20 - attempt.attemptsUsed * 5);
    const hintPenalty = attempt.hintsUsed * -10;

    const totalScore = baseScore + speedBonus + efficiencyBonus + attemptsPenalty + hintPenalty;
    return Math.max(0, Math.min(100, totalScore));
  }

  updateProfiles(
    currentProfiles: CognitiveProfiles,
    puzzleType: PuzzleType,
    score: number
  ): CognitiveProfiles {
    const mapping = PUZZLE_SKILL_MAPPING[puzzleType];
    const newProfiles = { ...currentProfiles };

    newProfiles[mapping.primary] =
      BASE_SKILL_MOMENTUM * newProfiles[mapping.primary] +
      PRIMARY_SKILL_LEARNING_RATE * score;

    Object.entries(mapping.secondary).forEach(([skill, weight]) => {
      const skillKey = skill as keyof CognitiveProfiles;
      newProfiles[skillKey] =
        (BASE_SKILL_MOMENTUM + 0.05) * newProfiles[skillKey] +
        SECONDARY_SKILL_LEARNING_RATE * (score * (weight as number));
    });

    const allSkills: (keyof CognitiveProfiles)[] = ['patterns', 'spatial', 'logic', 'lateral', 'sequencing'];
    const trainedSkills = new Set([mapping.primary, ...Object.keys(mapping.secondary)]);

    allSkills.forEach(skill => {
      if (!trainedSkills.has(skill)) {
        newProfiles[skill] = SKILL_DECAY_RATE * newProfiles[skill];
      }
    });

    Object.keys(newProfiles).forEach(key => {
      const skillKey = key as keyof CognitiveProfiles;
      newProfiles[skillKey] = Math.max(0, Math.min(100, newProfiles[skillKey]));
    });

    return newProfiles;
  }

  selectNextPuzzles(
    profiles: CognitiveProfiles,
    tier: Tier,
    sessionProgression: number,
    count: number = 5
  ): PuzzleConfig[] {
    const skills: (keyof CognitiveProfiles)[] = ['patterns', 'spatial', 'logic', 'lateral', 'sequencing'];
    const sortedByStrength = skills
      .map(skill => ({ skill, value: profiles[skill] }))
      .sort((a, b) => a.value - b.value);

    const weakestSkill = sortedByStrength[0].skill;
    const balancedSkills = sortedByStrength
      .filter(s => s.value > 30 && s.value < 70)
      .map(s => s.skill);
    const strongestSkill = sortedByStrength[sortedByStrength.length - 1].skill;

    const puzzleTypes: PuzzleType[] = ['sequence', 'mirror', 'gear', 'logic', 'spatial'];

    const getTypeForSkill = (skill: keyof CognitiveProfiles): PuzzleType | null => {
      for (const [type, mapping] of Object.entries(PUZZLE_SKILL_MAPPING)) {
        if (mapping.primary === skill) return type as PuzzleType;
      }
      return null;
    };

    const puzzles: PuzzleConfig[] = [];
    const weights = [
      { skill: weakestSkill, weight: 0.60 },
      { skill: weakestSkill, weight: 0.20 },
      { skill: balancedSkills[0] || weakestSkill, weight: 0.15 },
      { skill: strongestSkill, weight: 0.03 },
      { skill: null, weight: 0.02 }
    ];

    for (let i = 0; i < count; i++) {
      const weightConfig = weights[i] || { skill: null, weight: 1.0 };
      let selectedType: PuzzleType;

      if (weightConfig.skill === null || this.rng() < 0.1) {
        selectedType = puzzleTypes[Math.floor(this.rng() * puzzleTypes.length)];
      } else {
        selectedType = getTypeForSkill(weightConfig.skill) || puzzleTypes[0];
      }

      const baseDifficulty = TIER_BASE_DIFFICULTY[tier];
      const profileAverage = Object.values(profiles).reduce((a, b) => a + b, 0) / skills.length;
      const progressionBonus = Math.floor(sessionProgression / 3) * 5;

      const difficultyRating = Math.min(100, Math.max(0,
        (profileAverage + baseDifficulty) / 2 + progressionBonus + (this.rng() * 10 - 5)
      ));

      let difficulty: 'easy' | 'medium' | 'hard';
      if (difficultyRating < 40) difficulty = 'easy';
      else if (difficultyRating < 70) difficulty = 'medium';
      else difficulty = 'hard';

      puzzles.push({
        type: selectedType,
        difficulty,
        difficultyRating: Math.round(difficultyRating),
        seed: `${selectedType}-${i}-${Date.now()}-${this.rng()}`,
        optimalMoves: this.calculateOptimalMoves(selectedType, difficulty)
      });
    }

    return puzzles;
  }

  private calculateOptimalMoves(type: PuzzleType, difficulty: 'easy' | 'medium' | 'hard'): number {
    const baseMoves: Record<PuzzleType, Record<'easy' | 'medium' | 'hard', number>> = {
      sequence: { easy: 1, medium: 1, hard: 1 },
      mirror: { easy: 2, medium: 4, hard: 7 },
      gear: { easy: 3, medium: 5, hard: 8 },
      logic: { easy: 1, medium: 3, hard: 5 },
      spatial: { easy: 2, medium: 4, hard: 6 }
    };
    return baseMoves[type][difficulty];
  }

  generateAdaptiveState(
    profiles: CognitiveProfiles,
    tier: Tier,
    sessionProgression: number
  ): AdaptiveState {
    const skills: (keyof CognitiveProfiles)[] = ['patterns', 'spatial', 'logic', 'lateral', 'sequencing'];
    const sortedByStrength = skills
      .map(skill => ({ skill, value: profiles[skill] }))
      .sort((a, b) => a.value - b.value);

    return {
      profiles,
      nextPuzzles: this.selectNextPuzzles(profiles, tier, sessionProgression),
      weakestSkill: sortedByStrength[0].skill,
      strongestSkill: sortedByStrength[sortedByStrength.length - 1].skill,
      sessionProgression
    };
  }

  shouldIncreaseDifficulty(lastAttempt: PuzzleAttempt): boolean {
    return lastAttempt.solved && lastAttempt.timeTaken < 10 && lastAttempt.hintsUsed === 0;
  }

  shouldDecreaseDifficulty(lastAttempt: PuzzleAttempt): boolean {
    return !lastAttempt.solved || (lastAttempt.timeTaken > 30 && lastAttempt.hintsUsed >= 2);
  }
}

export const adaptiveAlgorithm = new AdaptiveAlgorithm();
