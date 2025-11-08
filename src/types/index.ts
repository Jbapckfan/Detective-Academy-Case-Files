export type Tier = 'jr-detective' | 'detective' | 'master-detective';
export type SubscriptionTier = 'free' | 'paid';
export type Personality = 'owl' | 'fox' | 'robot';
export type PuzzleType = 'sequence' | 'mirror' | 'gear' | 'logic' | 'spatial';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CompanionState = 'wondering' | 'curious' | 'cheering' | 'thinking' | 'stuck' | 'celebrating' | 'bonding' | 'playful';

export interface Cosmetics {
  hat: string;
  aura: string;
  color: string;
  idleAnimation: string;
}

export interface CognitiveProfiles {
  patterns: number;
  spatial: number;
  logic: number;
  lateral: number;
  sequencing: number;
}

export interface Companion {
  id: string;
  name: string;
  personality: Personality;
  level: number;
  xp: number;
  cosmetics: Cosmetics;
  state: CompanionState;
}

export interface User {
  id: string;
  username: string;
  tier: Tier;
  subscriptionTier: SubscriptionTier;
  sessionsThisMonth: number;
  createdAt: string;
  lastPlayed: string;
}

export interface PuzzleAttempt {
  id: string;
  puzzleType: PuzzleType;
  difficulty: Difficulty;
  difficultyRating: number;
  solved: boolean;
  score: number;
  timeTaken: number;
  attemptsUsed: number;
  hintsUsed: number;
  optimalMoves: number;
  actualMoves: number;
}

export interface Session {
  id: string;
  zoneId: number;
  startedAt: string;
  completedAt?: string;
  puzzlesCompleted: number;
  totalScore: number;
  attempts: PuzzleAttempt[];
}

export interface Zone {
  id: number;
  name: string;
  description: string;
  setting: string;
  story: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  unlocked: boolean;
}

export interface PuzzleConfig {
  type: PuzzleType;
  difficulty: Difficulty;
  difficultyRating: number;
  seed: string;
  timeLimit?: number;
  optimalMoves: number;
}

export interface AdaptiveState {
  profiles: CognitiveProfiles;
  nextPuzzles: PuzzleConfig[];
  weakestSkill: keyof CognitiveProfiles;
  strongestSkill: keyof CognitiveProfiles;
  sessionProgression: number;
}

export interface Settings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
  colorblindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  textToSpeech: boolean;
  reducedMotion: boolean;
}

export interface SequencePuzzleData {
  sequence: (string | number)[];
  choices: (string | number)[];
  correctAnswer: string | number;
  patternType: 'simple' | 'counting' | 'mathematical' | 'compound';
}

export interface MirrorPuzzleData {
  mirrors: Mirror[];
  lightSource: Position;
  targets: Position[];
  obstacles: Obstacle[];
  allowedMirrors: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Mirror {
  position: Position;
  angle: number;
  type: 'normal' | 'prism' | 'lens';
  color?: 'red' | 'blue' | 'green';
}

export interface Obstacle {
  position: Position;
  width: number;
  height: number;
  moveable?: boolean;
}

export interface GearPuzzleData {
  gears: Gear[];
  target: GearTarget;
  constraints: GearConstraint[];
}

export interface Gear {
  id: string;
  position: Position;
  size: number;
  teeth: number;
  locked: boolean;
  rotations: number;
}

export interface GearTarget {
  gearId: string;
  targetRotations: number;
}

export interface GearConstraint {
  gearId: string;
  mustNotRotate?: boolean;
  maxRotations?: number;
}

export interface LogicPuzzleData {
  story: string;
  question: string;
  options: LogicOption[];
  correctLogic: string[];
  requiresMultiStep: boolean;
  allowCustomAnswer: boolean;
}

export interface LogicOption {
  id: string;
  text: string;
  icon?: string;
}

export interface SpatialPuzzleData {
  object: SpatialObject;
  targetOrientation: Orientation;
  allowedAxes: ('x' | 'y' | 'z')[];
}

export interface SpatialObject {
  type: '3d-shape';
  shape: 'cube' | 'pyramid' | 'irregular' | 'l-shape';
  faces: Face[];
  symmetry: boolean;
}

export interface Face {
  color: string;
  pattern?: string;
}

export interface Orientation {
  rotX: number;
  rotY: number;
  rotZ: number;
}

export interface CompanionReaction {
  text: string;
  emotion: CompanionState;
  duration: number;
}
