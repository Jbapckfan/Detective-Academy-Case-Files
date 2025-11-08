import { create } from 'zustand';
import type {
  User,
  Companion,
  CognitiveProfiles,
  Session,
  Zone,
  PuzzleConfig,
  Settings,
  AdaptiveState,
  PuzzleAttempt,
  CompanionState
} from '../types';
import { adaptiveAlgorithm } from '../lib/adaptive-algorithm';
import { storage } from '../lib/supabase';

interface GameState {
  user: User | null;
  companion: Companion | null;
  profiles: CognitiveProfiles;
  currentSession: Session | null;
  currentZone: Zone | null;
  currentPuzzle: PuzzleConfig | null;
  adaptiveState: AdaptiveState | null;
  settings: Settings;
  zones: Zone[];
  isLoading: boolean;
  devMode: boolean;

  setUser: (user: User) => void;
  setCompanion: (companion: Companion) => void;
  updateProfiles: (profiles: Partial<CognitiveProfiles>) => void;
  updateCompanionState: (state: CompanionState) => void;
  startSession: (zoneId: number) => Promise<void>;
  completeSession: () => Promise<void>;
  startPuzzle: (config: PuzzleConfig) => void;
  completePuzzle: (attempt: Omit<PuzzleAttempt, 'id'>) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => void;
  loadUserData: (userId: string) => Promise<void>;
  saveUserData: () => Promise<void>;
  addCompanionXP: (amount: number) => void;
  toggleDevMode: () => void;
  initializeNewUser: (username: string, tier: string, personality: string) => Promise<void>;
}

const ZONES: Zone[] = [
  {
    id: 1,
    name: "The Missing Heirloom",
    description: "A priceless family diamond has vanished from a locked mansion",
    setting: "Victorian manor with secret passages and hidden clues",
    story: "Lady Ashworth's diamond necklace has disappeared from her bedroom safe. The room was locked from the inside, and only three people had keys. Your detective companion needs your analytical skills to crack this case by examining the evidence, analyzing timelines, and uncovering the truth.",
    theme: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    unlocked: true
  },
  {
    id: 2,
    name: "The Museum Heist",
    description: "A famous painting stolen in broad daylight using laser security",
    setting: "Modern art museum with complex security systems",
    story: "The 'Starry Night' was stolen from the Metropolitan Museum at 3 PM yesterday. Security footage shows nothing unusual, but the laser grid was somehow bypassed. Analyze the security logs, reconstruct the thief's path through the laser maze, and figure out how they disabled the vault's mechanical locks.",
    theme: {
      primary: '#ef4444',
      secondary: '#f87171',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    unlocked: true
  },
  {
    id: 3,
    name: "The Corporate Conspiracy",
    description: "A CEO's mysterious death hides corporate fraud and betrayal",
    setting: "Glass-tower corporate office with digital evidence trails",
    story: "Tech CEO Marcus Chen was found dead in his locked penthouse office. Initial ruling: suicide. But his assistant claims he was about to expose massive fraud. Analyze financial records, decode encrypted messages, examine witness alibis, and reconstruct the crime scene to uncover a conspiracy that reaches the highest levels.",
    theme: {
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    unlocked: true
  }
];

const DEFAULT_PROFILES: CognitiveProfiles = {
  patterns: 50,
  spatial: 50,
  logic: 50,
  lateral: 50,
  sequencing: 50
};

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  hapticsEnabled: true,
  textSize: 'normal',
  colorblindMode: 'none',
  textToSpeech: false,
  reducedMotion: false
};

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  companion: null,
  profiles: DEFAULT_PROFILES,
  currentSession: null,
  currentZone: null,
  currentPuzzle: null,
  adaptiveState: null,
  settings: DEFAULT_SETTINGS,
  zones: ZONES,
  isLoading: false,
  devMode: false,

  setUser: (user) => set({ user }),

  setCompanion: (companion) => set({ companion }),

  updateProfiles: (newProfiles) =>
    set((state) => ({
      profiles: { ...state.profiles, ...newProfiles }
    })),

  updateCompanionState: (companionState) =>
    set((state) => ({
      companion: state.companion
        ? { ...state.companion, state: companionState }
        : null
    })),

  startSession: async (zoneId) => {
    const { user, profiles } = get();
    if (!user) return;

    set({ isLoading: true });

    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    const session: Session = {
      id: storage.generateId(),
      zoneId: zoneId,
      startedAt: new Date().toISOString(),
      puzzlesCompleted: 0,
      totalScore: 0,
      attempts: []
    };

    // Save session to localStorage
    const data = storage.getData();
    data.sessions.push(session);
    storage.saveData(data);

    const tier = user.tier;
    const adaptiveState = adaptiveAlgorithm.generateAdaptiveState(profiles, tier, 0);

    set({
      currentSession: session,
      currentZone: zone,
      adaptiveState,
      currentPuzzle: adaptiveState.nextPuzzles[0] || null,
      isLoading: false
    });
  },

  completeSession: async () => {
    const { currentSession, user } = get();
    if (!currentSession || !user) return;

    // Update session in localStorage
    const data = storage.getData();
    const sessionIndex = data.sessions.findIndex(s => s.id === currentSession.id);
    if (sessionIndex !== -1) {
      data.sessions[sessionIndex] = {
        ...currentSession,
        completedAt: new Date().toISOString()
      };
    }

    // Update user data
    if (data.user) {
      data.user.last_played = new Date().toISOString();
      data.user.sessions_this_month = (data.user.sessions_this_month || 0) + 1;
    }

    storage.saveData(data);

    set({
      currentSession: null,
      currentZone: null,
      currentPuzzle: null,
      adaptiveState: null
    });
  },

  startPuzzle: (config) => {
    set({ currentPuzzle: config });
    get().updateCompanionState('curious');
  },

  completePuzzle: async (attemptData) => {
    const { currentSession, currentPuzzle, profiles, user, companion } = get();
    if (!currentSession || !currentPuzzle || !user) return;

    const score = adaptiveAlgorithm.calculatePuzzleScore({
      correct: attemptData.solved,
      timeTaken: attemptData.timeTaken,
      maxTime: 60,
      optimalMoves: attemptData.optimalMoves,
      actualMoves: attemptData.actualMoves,
      attemptsUsed: attemptData.attemptsUsed,
      hintsUsed: attemptData.hintsUsed
    });

    const attempt = {
      id: storage.generateId(),
      session_id: currentSession.id,
      user_id: user.id,
      puzzle_type: attemptData.puzzleType,
      difficulty: attemptData.difficulty,
      difficulty_rating: attemptData.difficultyRating,
      solved: attemptData.solved,
      score,
      time_taken: attemptData.timeTaken,
      attempts_used: attemptData.attemptsUsed,
      hints_used: attemptData.hintsUsed,
      optimal_moves: attemptData.optimalMoves,
      actual_moves: attemptData.actualMoves,
      created_at: new Date().toISOString()
    };

    const newProfiles = adaptiveAlgorithm.updateProfiles(
      profiles,
      currentPuzzle.type,
      score
    );

    // Save to localStorage
    const data = storage.getData();
    data.puzzleAttempts.push(attempt);
    data.profiles = {
      patterns: Math.round(newProfiles.patterns),
      spatial: Math.round(newProfiles.spatial),
      logic: Math.round(newProfiles.logic),
      lateral: Math.round(newProfiles.lateral),
      sequencing: Math.round(newProfiles.sequencing)
    };
    storage.saveData(data);

    const updatedSession = {
      ...currentSession,
      puzzlesCompleted: currentSession.puzzlesCompleted + 1,
      totalScore: currentSession.totalScore + score,
      attempts: [...currentSession.attempts, { ...attemptData, id: attempt.id, score }]
    };

    const xpGained = Math.round(score / 2);
    get().addCompanionXP(xpGained);

    if (attemptData.solved && score > 80) {
      get().updateCompanionState('cheering');
    } else if (attemptData.solved) {
      get().updateCompanionState('celebrating');
    } else {
      get().updateCompanionState('thinking');
    }

    set({
      profiles: newProfiles,
      currentSession: updatedSession,
      currentPuzzle: null
    });
  },

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),

  loadUserData: async (userId) => {
    set({ isLoading: true });

    const data = storage.getData();

    if (data.user && data.user.id === userId) {
      set({
        user: {
          id: data.user.id,
          username: data.user.username,
          tier: data.user.tier,
          subscriptionTier: data.user.subscription_tier || 'free',
          sessionsThisMonth: data.user.sessions_this_month || 0,
          createdAt: data.user.created_at,
          lastPlayed: data.user.last_played
        }
      });
    }

    if (data.companion) {
      set({
        companion: {
          id: data.companion.id,
          name: data.companion.name,
          personality: data.companion.personality,
          level: data.companion.level,
          xp: data.companion.xp,
          cosmetics: data.companion.cosmetics,
          state: 'wondering'
        }
      });
    }

    if (data.profiles) {
      set({
        profiles: {
          patterns: data.profiles.patterns,
          spatial: data.profiles.spatial,
          logic: data.profiles.logic,
          lateral: data.profiles.lateral,
          sequencing: data.profiles.sequencing
        }
      });
    }

    set({ isLoading: false });
  },

  saveUserData: async () => {
    const { user, companion, profiles } = get();
    if (!user) return;

    const data = storage.getData();

    data.profiles = {
      patterns: Math.round(profiles.patterns),
      spatial: Math.round(profiles.spatial),
      logic: Math.round(profiles.logic),
      lateral: Math.round(profiles.lateral),
      sequencing: Math.round(profiles.sequencing)
    };

    if (companion) {
      data.companion = {
        ...data.companion,
        level: companion.level,
        xp: companion.xp,
        cosmetics: companion.cosmetics
      };
    }

    storage.saveData(data);
  },

  addCompanionXP: (amount) =>
    set((state) => {
      if (!state.companion) return state;

      const newXp = state.companion.xp + amount;
      const xpPerLevel = 100;
      const newLevel = Math.floor(newXp / xpPerLevel) + 1;
      const leveledUp = newLevel > state.companion.level;

      return {
        companion: {
          ...state.companion,
          xp: newXp,
          level: Math.min(50, newLevel)
        }
      };
    }),

  toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),

  initializeNewUser: async (username, tier, personality) => {
    set({ isLoading: true });

    const userId = storage.generateId();
    const companionId = storage.generateId();
    const companionName = `${username}'s Friend`;
    const now = new Date().toISOString();

    const userData = {
      id: userId,
      username,
      tier,
      subscription_tier: 'free',
      sessions_this_month: 0,
      created_at: now,
      last_played: now
    };

    const companionData = {
      id: companionId,
      user_id: userId,
      name: companionName,
      personality,
      level: 1,
      xp: 0,
      cosmetics: {
        hat: 'none',
        aura: 'none',
        color: 'default',
        idleAnimation: 'none'
      },
      created_at: now
    };

    const profileData = {
      patterns: 50,
      spatial: 50,
      logic: 50,
      lateral: 50,
      sequencing: 50
    };

    // Save to localStorage
    storage.saveData({
      user: userData,
      companion: companionData,
      profiles: profileData,
      sessions: [],
      puzzleAttempts: []
    });

    set({
      user: {
        id: userData.id,
        username: userData.username,
        tier: userData.tier as any,
        subscriptionTier: 'free',
        sessionsThisMonth: 0,
        createdAt: userData.created_at,
        lastPlayed: userData.last_played
      },
      companion: {
        id: companionData.id,
        name: companionData.name,
        personality: companionData.personality as any,
        level: 1,
        xp: 0,
        cosmetics: companionData.cosmetics,
        state: 'wondering'
      },
      profiles: DEFAULT_PROFILES,
      isLoading: false
    });
  }
}));
