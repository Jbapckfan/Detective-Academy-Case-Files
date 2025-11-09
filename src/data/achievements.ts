import type { PuzzleType, Tier } from '../types';

export type AchievementCategory =
  | 'puzzle_mastery'   // Puzzle-specific achievements
  | 'speed'            // Speed-based achievements
  | 'perfection'       // No hints/errors achievements
  | 'progression'      // Case completion achievements
  | 'dedication'       // Play time & consistency
  | 'skill_mastery'    // Cognitive skill achievements
  | 'exploration'      // Try different puzzle types
  | 'companion';       // Companion level achievements

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string; // Emoji icon
  requirement: AchievementRequirement;
  reward?: {
    xp?: number;
    companionXP?: number;
    cosmetic?: string;
  };
}

export interface AchievementRequirement {
  type: 'puzzle_count' | 'perfect_solves' | 'speed_solves' | 'case_complete' | 'skill_level' |
        'sessions_played' | 'companion_level' | 'streak' | 'no_hints' | 'puzzle_type_variety';
  value: number;
  puzzleType?: PuzzleType;
  tier?: Tier;
  timeLimit?: number; // seconds
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  progress: number; // For incremental achievements
}

// Achievement definitions
export const achievements: Achievement[] = [
  // === PUZZLE MASTERY ===
  {
    id: 'sequence_novice',
    name: 'Pattern Detective',
    description: 'Solve 10 sequence puzzles',
    category: 'puzzle_mastery',
    rarity: 'common',
    icon: '🔢',
    requirement: { type: 'puzzle_count', value: 10, puzzleType: 'sequence' },
    reward: { xp: 50, companionXP: 25 }
  },
  {
    id: 'sequence_master',
    name: 'Sequence Savant',
    description: 'Solve 50 sequence puzzles',
    category: 'puzzle_mastery',
    rarity: 'epic',
    icon: '🎯',
    requirement: { type: 'puzzle_count', value: 50, puzzleType: 'sequence' },
    reward: { xp: 250, companionXP: 100 }
  },
  {
    id: 'logic_novice',
    name: 'Logical Thinker',
    description: 'Solve 10 logic puzzles',
    category: 'puzzle_mastery',
    rarity: 'common',
    icon: '🧠',
    requirement: { type: 'puzzle_count', value: 10, puzzleType: 'logic' },
    reward: { xp: 50, companionXP: 25 }
  },
  {
    id: 'logic_master',
    name: 'Master Deductionist',
    description: 'Solve 50 logic puzzles',
    category: 'puzzle_mastery',
    rarity: 'epic',
    icon: '🎓',
    requirement: { type: 'puzzle_count', value: 50, puzzleType: 'logic' },
    reward: { xp: 250, companionXP: 100 }
  },
  {
    id: 'spatial_novice',
    name: 'Spatial Awareness',
    description: 'Solve 10 spatial puzzles',
    category: 'puzzle_mastery',
    rarity: 'common',
    icon: '🔄',
    requirement: { type: 'puzzle_count', value: 10, puzzleType: 'spatial' },
    reward: { xp: 50, companionXP: 25 }
  },
  {
    id: 'spatial_master',
    name: '3D Vision Master',
    description: 'Solve 50 spatial puzzles',
    category: 'puzzle_mastery',
    rarity: 'epic',
    icon: '🎲',
    requirement: { type: 'puzzle_count', value: 50, puzzleType: 'spatial' },
    reward: { xp: 250, companionXP: 100 }
  },
  {
    id: 'mirror_novice',
    name: 'Light Bender',
    description: 'Solve 10 mirror puzzles',
    category: 'puzzle_mastery',
    rarity: 'common',
    icon: '💡',
    requirement: { type: 'puzzle_count', value: 10, puzzleType: 'mirror' },
    reward: { xp: 50, companionXP: 25 }
  },
  {
    id: 'mirror_master',
    name: 'Reflection Virtuoso',
    description: 'Solve 50 mirror puzzles',
    category: 'puzzle_mastery',
    rarity: 'epic',
    icon: '✨',
    requirement: { type: 'puzzle_count', value: 50, puzzleType: 'mirror' },
    reward: { xp: 250, companionXP: 100 }
  },
  {
    id: 'gear_novice',
    name: 'Mechanic Apprentice',
    description: 'Solve 10 gear puzzles',
    category: 'puzzle_mastery',
    rarity: 'common',
    icon: '⚙️',
    requirement: { type: 'puzzle_count', value: 10, puzzleType: 'gear' },
    reward: { xp: 50, companionXP: 25 }
  },
  {
    id: 'gear_master',
    name: 'Clockwork Genius',
    description: 'Solve 50 gear puzzles',
    category: 'puzzle_mastery',
    rarity: 'epic',
    icon: '🔧',
    requirement: { type: 'puzzle_count', value: 50, puzzleType: 'gear' },
    reward: { xp: 250, companionXP: 100 }
  },

  // === SPEED ===
  {
    id: 'speed_demon_1',
    name: 'Quick Thinker',
    description: 'Solve 5 puzzles in under 10 seconds each',
    category: 'speed',
    rarity: 'rare',
    icon: '⚡',
    requirement: { type: 'speed_solves', value: 5, timeLimit: 10 },
    reward: { xp: 100, companionXP: 50 }
  },
  {
    id: 'speed_demon_2',
    name: 'Lightning Detective',
    description: 'Solve 20 puzzles in under 10 seconds each',
    category: 'speed',
    rarity: 'epic',
    icon: '⚡⚡',
    requirement: { type: 'speed_solves', value: 20, timeLimit: 10 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'speed_demon_3',
    name: 'Speed of Light',
    description: 'Solve 50 puzzles in under 10 seconds each',
    category: 'speed',
    rarity: 'legendary',
    icon: '⚡⚡⚡',
    requirement: { type: 'speed_solves', value: 50, timeLimit: 10 },
    reward: { xp: 500, companionXP: 250 }
  },

  // === PERFECTION ===
  {
    id: 'perfectionist_1',
    name: 'No Mistakes',
    description: 'Solve 10 puzzles perfectly (no hints, no wrong attempts)',
    category: 'perfection',
    rarity: 'rare',
    icon: '💎',
    requirement: { type: 'perfect_solves', value: 10 },
    reward: { xp: 150, companionXP: 75 }
  },
  {
    id: 'perfectionist_2',
    name: 'Flawless Detective',
    description: 'Solve 50 puzzles perfectly',
    category: 'perfection',
    rarity: 'epic',
    icon: '💎💎',
    requirement: { type: 'perfect_solves', value: 50 },
    reward: { xp: 400, companionXP: 200 }
  },
  {
    id: 'perfectionist_3',
    name: 'Perfection Incarnate',
    description: 'Solve 100 puzzles perfectly',
    category: 'perfection',
    rarity: 'legendary',
    icon: '👑',
    requirement: { type: 'perfect_solves', value: 100 },
    reward: { xp: 1000, companionXP: 500 }
  },
  {
    id: 'no_hints_hero',
    name: 'Self-Reliant',
    description: 'Solve 25 puzzles without using hints',
    category: 'perfection',
    rarity: 'rare',
    icon: '🎖️',
    requirement: { type: 'no_hints', value: 25 },
    reward: { xp: 200, companionXP: 100 }
  },

  // === CASE COMPLETION ===
  {
    id: 'first_case',
    name: 'Junior Detective',
    description: 'Complete your first case',
    category: 'progression',
    rarity: 'common',
    icon: '🔍',
    requirement: { type: 'case_complete', value: 1 },
    reward: { xp: 100, companionXP: 50 }
  },
  {
    id: 'case_veteran',
    name: 'Case Veteran',
    description: 'Complete 5 cases',
    category: 'progression',
    rarity: 'rare',
    icon: '📚',
    requirement: { type: 'case_complete', value: 5 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'master_detective_title',
    name: 'Master Detective',
    description: 'Complete all available cases',
    category: 'progression',
    rarity: 'legendary',
    icon: '🏆',
    requirement: { type: 'case_complete', value: 8 },
    reward: { xp: 1000, companionXP: 500 }
  },
  {
    id: 'jr_detective_cases',
    name: 'Kid Detective',
    description: 'Complete all Jr. Detective tier cases',
    category: 'progression',
    rarity: 'rare',
    icon: '👶',
    requirement: { type: 'case_complete', value: 2, tier: 'jr-detective' },
    reward: { xp: 200, companionXP: 100 }
  },
  {
    id: 'detective_cases',
    name: 'True Detective',
    description: 'Complete all Detective tier cases',
    category: 'progression',
    rarity: 'epic',
    icon: '🕵️',
    requirement: { type: 'case_complete', value: 3, tier: 'detective' },
    reward: { xp: 400, companionXP: 200 }
  },
  {
    id: 'master_detective_cases',
    name: 'Elite Investigator',
    description: 'Complete all Master Detective tier cases',
    category: 'progression',
    rarity: 'legendary',
    icon: '🎩',
    requirement: { type: 'case_complete', value: 3, tier: 'master-detective' },
    reward: { xp: 600, companionXP: 300 }
  },

  // === DEDICATION ===
  {
    id: 'dedication_1',
    name: 'Regular Visitor',
    description: 'Play 10 sessions',
    category: 'dedication',
    rarity: 'common',
    icon: '📅',
    requirement: { type: 'sessions_played', value: 10 },
    reward: { xp: 50, companionXP: 25 }
  },
  {
    id: 'dedication_2',
    name: 'Dedicated Detective',
    description: 'Play 50 sessions',
    category: 'dedication',
    rarity: 'rare',
    icon: '📆',
    requirement: { type: 'sessions_played', value: 50 },
    reward: { xp: 250, companionXP: 125 }
  },
  {
    id: 'dedication_3',
    name: 'Relentless Investigator',
    description: 'Play 100 sessions',
    category: 'dedication',
    rarity: 'epic',
    icon: '📖',
    requirement: { type: 'sessions_played', value: 100 },
    reward: { xp: 500, companionXP: 250 }
  },
  {
    id: 'streak_3',
    name: 'Three Days Running',
    description: 'Play for 3 days in a row',
    category: 'dedication',
    rarity: 'common',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 },
    reward: { xp: 75, companionXP: 40 }
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Play for 7 days in a row',
    category: 'dedication',
    rarity: 'rare',
    icon: '🔥🔥',
    requirement: { type: 'streak', value: 7 },
    reward: { xp: 200, companionXP: 100 }
  },
  {
    id: 'streak_30',
    name: 'Month Master',
    description: 'Play for 30 days in a row',
    category: 'dedication',
    rarity: 'legendary',
    icon: '🔥🔥🔥',
    requirement: { type: 'streak', value: 30 },
    reward: { xp: 1000, companionXP: 500 }
  },

  // === SKILL MASTERY ===
  {
    id: 'pattern_master',
    name: 'Pattern Recognition Expert',
    description: 'Reach level 80 in Pattern Recognition',
    category: 'skill_mastery',
    rarity: 'epic',
    icon: '🎨',
    requirement: { type: 'skill_level', value: 80 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'spatial_master',
    name: 'Spatial Reasoning Expert',
    description: 'Reach level 80 in Spatial Reasoning',
    category: 'skill_mastery',
    rarity: 'epic',
    icon: '🌐',
    requirement: { type: 'skill_level', value: 80 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'logic_master',
    name: 'Logic & Deduction Expert',
    description: 'Reach level 80 in Logic & Deduction',
    category: 'skill_mastery',
    rarity: 'epic',
    icon: '🧩',
    requirement: { type: 'skill_level', value: 80 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'lateral_master',
    name: 'Lateral Thinking Expert',
    description: 'Reach level 80 in Lateral Thinking',
    category: 'skill_mastery',
    rarity: 'epic',
    icon: '💭',
    requirement: { type: 'skill_level', value: 80 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'sequencing_master',
    name: 'Sequential Planning Expert',
    description: 'Reach level 80 in Sequential Planning',
    category: 'skill_mastery',
    rarity: 'epic',
    icon: '🔗',
    requirement: { type: 'skill_level', value: 80 },
    reward: { xp: 300, companionXP: 150 }
  },
  {
    id: 'all_skills_balanced',
    name: 'Renaissance Detective',
    description: 'Reach level 70 in all cognitive skills',
    category: 'skill_mastery',
    rarity: 'legendary',
    icon: '🌟',
    requirement: { type: 'skill_level', value: 70 },
    reward: { xp: 1000, companionXP: 500 }
  },

  // === EXPLORATION ===
  {
    id: 'puzzle_variety',
    name: 'Jack of All Puzzles',
    description: 'Solve at least 5 of each puzzle type',
    category: 'exploration',
    rarity: 'rare',
    icon: '🎭',
    requirement: { type: 'puzzle_type_variety', value: 5 },
    reward: { xp: 200, companionXP: 100 }
  },
  {
    id: 'puzzle_explorer',
    name: 'Puzzle Explorer',
    description: 'Try all 5 types of puzzles',
    category: 'exploration',
    rarity: 'common',
    icon: '🗺️',
    requirement: { type: 'puzzle_type_variety', value: 1 },
    reward: { xp: 50, companionXP: 25 }
  },

  // === COMPANION ===
  {
    id: 'companion_level_5',
    name: 'Bonding Begins',
    description: 'Reach companion level 5',
    category: 'companion',
    rarity: 'common',
    icon: '❤️',
    requirement: { type: 'companion_level', value: 5 },
    reward: { xp: 100 }
  },
  {
    id: 'companion_level_10',
    name: 'Trusted Partner',
    description: 'Reach companion level 10',
    category: 'companion',
    rarity: 'rare',
    icon: '💕',
    requirement: { type: 'companion_level', value: 10 },
    reward: { xp: 250 }
  },
  {
    id: 'companion_level_25',
    name: 'Best Friends',
    description: 'Reach companion level 25',
    category: 'companion',
    rarity: 'epic',
    icon: '💖',
    requirement: { type: 'companion_level', value: 25 },
    reward: { xp: 500 }
  },
  {
    id: 'companion_level_50',
    name: 'Inseparable Partners',
    description: 'Reach companion level 50',
    category: 'companion',
    rarity: 'legendary',
    icon: '💝',
    requirement: { type: 'companion_level', value: 50 },
    reward: { xp: 1000 }
  }
];

// Helper functions
export function getAchievementProgress(achievement: Achievement, userStats: any): number {
  const req = achievement.requirement;

  switch (req.type) {
    case 'puzzle_count':
      const puzzleCount = req.puzzleType
        ? (userStats.puzzlesByType?.[req.puzzleType] || 0)
        : (userStats.totalPuzzles || 0);
      return Math.min(100, (puzzleCount / req.value) * 100);

    case 'perfect_solves':
      return Math.min(100, ((userStats.perfectSolves || 0) / req.value) * 100);

    case 'speed_solves':
      return Math.min(100, ((userStats.speedSolves || 0) / req.value) * 100);

    case 'case_complete':
      const cases = req.tier
        ? (userStats.casesByTier?.[req.tier] || 0)
        : (userStats.totalCases || 0);
      return Math.min(100, (cases / req.value) * 100);

    case 'skill_level':
      const allSkillsAbove = Object.values(userStats.profiles || {}).every(
        (level: any) => level >= req.value
      );
      return allSkillsAbove ? 100 : 0;

    case 'sessions_played':
      return Math.min(100, ((userStats.totalSessions || 0) / req.value) * 100);

    case 'companion_level':
      return Math.min(100, ((userStats.companionLevel || 1) / req.value) * 100);

    case 'streak':
      return Math.min(100, ((userStats.currentStreak || 0) / req.value) * 100);

    case 'no_hints':
      return Math.min(100, ((userStats.noHintSolves || 0) / req.value) * 100);

    case 'puzzle_type_variety':
      const typesWithEnough = Object.values(userStats.puzzlesByType || {}).filter(
        (count: any) => count >= req.value
      ).length;
      return Math.min(100, (typesWithEnough / 5) * 100);

    default:
      return 0;
  }
}

export function isAchievementUnlocked(achievement: Achievement, progress: number): boolean {
  return progress >= 100;
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return achievements.filter(a => a.category === category);
}

export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return achievements.filter(a => a.rarity === rarity);
}

export const RARITY_COLORS: Record<AchievementRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: 'from-gray-100 to-gray-200',
    border: 'border-gray-300',
    text: 'text-gray-800',
    glow: 'shadow-gray-300/50'
  },
  rare: {
    bg: 'from-blue-100 to-blue-200',
    border: 'border-blue-400',
    text: 'text-blue-900',
    glow: 'shadow-blue-400/50'
  },
  epic: {
    bg: 'from-purple-100 to-purple-200',
    border: 'border-purple-400',
    text: 'text-purple-900',
    glow: 'shadow-purple-400/50'
  },
  legendary: {
    bg: 'from-amber-100 to-amber-200',
    border: 'border-amber-400',
    text: 'text-amber-900',
    glow: 'shadow-amber-400/50'
  }
};
