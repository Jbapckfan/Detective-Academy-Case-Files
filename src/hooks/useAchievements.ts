import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { achievements, getAchievementProgress, isAchievementUnlocked, type Achievement, type UserAchievement } from '../data/achievements';
import { storage } from '../lib/supabase';

export interface AchievementUnlock {
  achievement: Achievement;
  timestamp: number;
}

export function useAchievements() {
  const { user, profiles, companion } = useGameStore();
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([]);
  const [recentUnlocks, setRecentUnlocks] = useState<AchievementUnlock[]>([]);
  const [userStats, setUserStats] = useState<any>({});

  // Load unlocked achievements from storage
  useEffect(() => {
    if (!user) return;

    const data = storage.getData();
    const achievements = data.user?.achievements || [];
    setUnlockedAchievements(achievements);

    // Calculate user stats
    const stats = calculateUserStats(data);
    setUserStats(stats);
  }, [user]);

  // Calculate user statistics from data
  const calculateUserStats = useCallback((data: any) => {
    const attempts = data.puzzleAttempts || [];
    const sessions = data.sessions || [];

    // Count puzzles by type
    const puzzlesByType: Record<string, number> = {};
    attempts.forEach((attempt: any) => {
      if (attempt.solved) {
        puzzlesByType[attempt.puzzle_type] = (puzzlesByType[attempt.puzzle_type] || 0) + 1;
      }
    });

    // Count perfect solves (no hints, no wrong attempts)
    const perfectSolves = attempts.filter(
      (a: any) => a.solved && a.hints_used === 0 && a.attempts_used === 0
    ).length;

    // Count speed solves (under 10 seconds)
    const speedSolves = attempts.filter(
      (a: any) => a.solved && a.time_taken < 10
    ).length;

    // Count no-hint solves
    const noHintSolves = attempts.filter(
      (a: any) => a.solved && a.hints_used === 0
    ).length;

    // Count completed cases (sessions with completedAt)
    const completedCases = sessions.filter((s: any) => s.completedAt).length;

    // Count cases by tier (based on zone ID mapping)
    const casesByTier: Record<string, number> = {
      'jr-detective': 0,
      'detective': 0,
      'master-detective': 0
    };
    sessions.filter((s: any) => s.completedAt).forEach((s: any) => {
      if (s.zoneId === 1) casesByTier['jr-detective']++;
      else if ([2, 3].includes(s.zoneId)) casesByTier['detective']++;
      else if ([4, 5].includes(s.zoneId)) casesByTier['master-detective']++;
    });

    // Calculate streak (simplified - would need date tracking for accurate implementation)
    const currentStreak = calculateStreak(sessions);

    return {
      totalPuzzles: attempts.filter((a: any) => a.solved).length,
      puzzlesByType,
      perfectSolves,
      speedSolves,
      noHintSolves,
      totalCases: completedCases,
      casesByTier,
      totalSessions: sessions.length,
      companionLevel: data.companion?.level || 1,
      profiles: data.profiles || {},
      currentStreak
    };
  }, []);

  // Simple streak calculation
  const calculateStreak = (sessions: any[]) => {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions
      .map(s => new Date(s.startedAt).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const uniqueDays = [...new Set(sortedSessions)];
    const today = new Date().toDateString();

    let streak = 0;
    for (let i = 0; i < uniqueDays.length; i++) {
      const dayDate = new Date(uniqueDays[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (dayDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Check all achievements and unlock new ones
  const checkAchievements = useCallback(() => {
    if (!user) return;

    const data = storage.getData();
    const currentlyUnlocked = data.user?.achievements || [];
    const currentlyUnlockedIds = new Set(currentlyUnlocked.map((a: UserAchievement) => a.achievementId));
    const newUnlocks: AchievementUnlock[] = [];

    achievements.forEach(achievement => {
      if (currentlyUnlockedIds.has(achievement.id)) return;

      const progress = getAchievementProgress(achievement, userStats);

      if (isAchievementUnlocked(achievement, progress)) {
        const newAchievement: UserAchievement = {
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString(),
          progress: 100
        };

        currentlyUnlocked.push(newAchievement);
        newUnlocks.push({
          achievement,
          timestamp: Date.now()
        });

        // Apply rewards
        if (achievement.reward) {
          if (achievement.reward.xp) {
            // Add XP to user (could add to store if implemented)
          }
          if (achievement.reward.companionXP) {
            useGameStore.getState().addCompanionXP(achievement.reward.companionXP);
          }
        }
      }
    });

    if (newUnlocks.length > 0) {
      // Save to storage
      data.user.achievements = currentlyUnlocked;
      storage.saveData(data);

      setUnlockedAchievements(currentlyUnlocked);
      setRecentUnlocks(prev => [...newUnlocks, ...prev].slice(0, 5)); // Keep last 5
    }
  }, [user, userStats]);

  // Auto-check achievements when stats change
  useEffect(() => {
    if (Object.keys(userStats).length > 0) {
      checkAchievements();
    }
  }, [userStats, checkAchievements]);

  // Get achievement with progress
  const getAchievementWithProgress = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return null;

    const unlocked = unlockedAchievements.find(u => u.achievementId === achievementId);
    const progress = unlocked ? 100 : getAchievementProgress(achievement, userStats);

    return {
      ...achievement,
      progress,
      unlocked: !!unlocked,
      unlockedAt: unlocked?.unlockedAt
    };
  }, [unlockedAchievements, userStats]);

  // Get all achievements with progress (memoized to prevent recalculation)
  const getAllAchievementsWithProgress = useMemo(() => {
    return achievements.map(achievement => {
      const unlocked = unlockedAchievements.find(u => u.achievementId === achievement.id);
      const progress = unlocked ? 100 : getAchievementProgress(achievement, userStats);

      return {
        ...achievement,
        progress,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt
      };
    });
  }, [unlockedAchievements, userStats]);

  // Clear recent unlocks
  const clearRecentUnlocks = useCallback(() => {
    setRecentUnlocks([]);
  }, []);

  // Dismiss a specific recent unlock
  const dismissUnlock = useCallback((achievementId: string) => {
    setRecentUnlocks(prev => prev.filter(u => u.achievement.id !== achievementId));
  }, []);

  // Memoize computed values
  const unlockedCount = useMemo(() => unlockedAchievements.length, [unlockedAchievements]);
  const totalCount = useMemo(() => achievements.length, []);
  const completionPercentage = useMemo(
    () => (unlockedAchievements.length / achievements.length) * 100,
    [unlockedAchievements.length]
  );

  return {
    unlockedAchievements,
    recentUnlocks,
    userStats,
    getAchievementWithProgress,
    getAllAchievementsWithProgress,
    checkAchievements,
    clearRecentUnlocks,
    dismissUnlock,
    unlockedCount,
    totalCount,
    completionPercentage
  };
}
