import type { PuzzleType, Personality, CompanionState } from '../types';

export interface DialogueTrigger {
  event: 'puzzle_start' | 'struggling' | 'hint_request' | 'success' | 'failure' | 'quick_solve' | 'perfect_solve';
  personality: Personality;
  puzzleType?: PuzzleType;
  messages: string[];
  hints?: string[];
  state: CompanionState;
}

// Personality-specific responses for different events
export const companionDialogue: DialogueTrigger[] = [
  // PUZZLE START - Owl (Logical, Analytical)
  {
    event: 'puzzle_start',
    personality: 'owl',
    puzzleType: 'sequence',
    messages: [
      "Fascinating... I detect a pattern here. Let's analyze this methodically.",
      "Observe the sequence carefully. Logic will reveal the answer.",
      "Pattern recognition time! Take a moment to study the progression."
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'owl',
    puzzleType: 'logic',
    messages: [
      "An excellent logic puzzle. Let's deduce the answer systematically.",
      "Apply deductive reasoning here. Each clue narrows our options.",
      "This requires careful analysis. Consider all the evidence."
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'owl',
    puzzleType: 'spatial',
    messages: [
      "Spatial reasoning activated. Visualize the transformations.",
      "Study the orientation carefully. Every angle matters.",
      "Let's apply geometric logic to solve this."
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'owl',
    puzzleType: 'mirror',
    messages: [
      "The physics of light reflection apply here. Calculate the angles.",
      "Each mirror changes the light path predictably. Map it out.",
      "Trace the light path logically from source to target."
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'owl',
    puzzleType: 'gear',
    messages: [
      "Mechanical systems follow precise rules. Let's work through this.",
      "Each gear's rotation affects the others. Think systematically.",
      "The gear ratios determine the solution. Calculate carefully."
    ],
    state: 'thinking'
  },

  // PUZZLE START - Fox (Creative, Clever)
  {
    event: 'puzzle_start',
    personality: 'fox',
    puzzleType: 'sequence',
    messages: [
      "Ooh, I love pattern puzzles! Let's see what trick this one has...",
      "Time to outsmart this sequence! I bet there's a clever twist.",
      "Ready to crack this pattern? Let your intuition guide you!"
    ],
    state: 'curious'
  },
  {
    event: 'puzzle_start',
    personality: 'fox',
    puzzleType: 'logic',
    messages: [
      "A mystery to solve! Let's think outside the box on this one.",
      "This looks tricky... but I know you can figure out the clever solution!",
      "Time to use that brilliant detective mind of yours!"
    ],
    state: 'curious'
  },
  {
    event: 'puzzle_start',
    personality: 'fox',
    puzzleType: 'spatial',
    messages: [
      "Spatial puzzles are so fun! Let's spin this around in our minds.",
      "I'm getting dizzy just looking at it! But you've got this.",
      "Imagine rotating it... can you see the solution?"
    ],
    state: 'playful'
  },
  {
    event: 'puzzle_start',
    personality: 'fox',
    puzzleType: 'mirror',
    messages: [
      "Mirrors and lights! It's like a magic trick we need to solve.",
      "Bounce that light around like you're playing pool!",
      "Let's illuminate this mystery together!"
    ],
    state: 'curious'
  },
  {
    event: 'puzzle_start',
    personality: 'fox',
    puzzleType: 'gear',
    messages: [
      "Gears within gears... reminds me of a Swiss watch!",
      "Let's see how these pieces all connect. It's like a puzzle within a puzzle!",
      "Time to get these gears turning! Think creatively."
    ],
    state: 'curious'
  },

  // PUZZLE START - Robot (Precise, Encouraging)
  {
    event: 'puzzle_start',
    personality: 'robot',
    puzzleType: 'sequence',
    messages: [
      "PATTERN DETECTED. ANALYZING... You can solve this, detective!",
      "SEQUENCE LOADED. Processing parameters. You've got the skills!",
      "PATTERN RECOGNITION MODE: ON. Let's compute this together!"
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'robot',
    puzzleType: 'logic',
    messages: [
      "LOGIC CIRCUITS ENGAGED. Ready to deduce the answer?",
      "DEDUCTION PROTOCOLS ACTIVE. All clues loaded and ready!",
      "ANALYZING EVIDENCE... You're great at logical thinking!"
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'robot',
    puzzleType: 'spatial',
    messages: [
      "SPATIAL PROCESSING ONLINE. Calculating rotations...",
      "3D VISUALIZATION MODE: ACTIVE. You're good at this!",
      "ORIENTATION ANALYSIS READY. Let's rotate to victory!"
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'robot',
    puzzleType: 'mirror',
    messages: [
      "LIGHT TRAJECTORY SIMULATION LOADED. Computing angles...",
      "REFLECTION CALCULATION MODE: ON. Bounce it to success!",
      "OPTICAL PATH ANALYZER READY. You've mastered these before!"
    ],
    state: 'thinking'
  },
  {
    event: 'puzzle_start',
    personality: 'robot',
    puzzleType: 'gear',
    messages: [
      "MECHANICAL SYSTEMS ANALYSIS ACTIVE. Calculating gear ratios...",
      "ROTATION PROTOCOLS ENGAGED. You understand the mechanics!",
      "GEAR SOLVER MODE: ON. Let's turn this around!"
    ],
    state: 'thinking'
  },

  // STRUGGLING - All personalities with progressive hints
  {
    event: 'struggling',
    personality: 'owl',
    messages: [
      "Take a moment to reconsider your approach. Sometimes stepping back helps.",
      "I notice you're working hard on this. Let me offer some guidance.",
      "Don't worry - difficult puzzles require patience. Shall I provide a hint?"
    ],
    hints: [
      "Look for the underlying pattern or rule governing the puzzle.",
      "Try breaking the problem into smaller, manageable steps.",
      "Consider what you know for certain, then build from there.",
      "The solution often becomes clear when you eliminate impossibilities."
    ],
    state: 'stuck'
  },
  {
    event: 'struggling',
    personality: 'fox',
    messages: [
      "Hey, no worries! Even the best detectives get stuck sometimes.",
      "This one's being sneaky, huh? Want a little nudge in the right direction?",
      "Don't let this puzzle fox you! Let me help you out."
    ],
    hints: [
      "Sometimes the answer is simpler than you think! Look again.",
      "Try approaching this from a completely different angle.",
      "What if you focused on one piece at a time instead of the whole?",
      "Trust your instincts - your first guess might have been right!"
    ],
    state: 'stuck'
  },
  {
    event: 'struggling',
    personality: 'robot',
    messages: [
      "STUCK DETECTED. Don't worry! Even my circuits get tangled sometimes.",
      "PROCESSING DELAY NORMAL. Would you like assistance, detective?",
      "HINT SYSTEM STANDING BY. Ready to help when you are!"
    ],
    hints: [
      "TIP: Try isolating one element and solving for that first.",
      "SUGGESTION: Work backwards from the goal to find the path.",
      "RECOMMENDATION: Eliminate options that clearly don't fit.",
      "COMPUTE: Focus on the relationships between elements."
    ],
    state: 'stuck'
  },

  // HINT REQUEST - Providing progressive hints
  {
    event: 'hint_request',
    personality: 'owl',
    messages: [
      "Certainly. Here's what I observe about this puzzle...",
      "Let me shed some light on this for you...",
      "An astute detective knows when to seek guidance. Here's my analysis..."
    ],
    state: 'thinking'
  },
  {
    event: 'hint_request',
    personality: 'fox',
    messages: [
      "Psst! Here's a clever trick I noticed...",
      "Okay, okay, I'll give you a little insider information...",
      "Let me point you toward something interesting I spotted..."
    ],
    state: 'curious'
  },
  {
    event: 'hint_request',
    personality: 'robot',
    messages: [
      "HINT PROTOCOL ACTIVATED. Loading assistance data...",
      "HELP MODE: ON. Transmitting helpful information...",
      "GUIDANCE SYSTEM ENGAGED. Here's what my sensors detect..."
    ],
    state: 'thinking'
  },

  // SUCCESS - Regular solve
  {
    event: 'success',
    personality: 'owl',
    messages: [
      "Excellent work! Your logical thinking was sound.",
      "Well reasoned! You applied the correct methodology.",
      "Precisely solved! Your analytical skills are impressive.",
      "A textbook solution! You understood the pattern perfectly."
    ],
    state: 'celebrating'
  },
  {
    event: 'success',
    personality: 'fox',
    messages: [
      "YES! You cracked it! That was so clever!",
      "Woo! Look at you go! That was amazing!",
      "Nice work, detective! You totally outsmarted that puzzle!",
      "BAM! Solved! You're getting really good at this!"
    ],
    state: 'cheering'
  },
  {
    event: 'success',
    personality: 'robot',
    messages: [
      "SOLUTION VERIFIED ✓ Excellent work, detective!",
      "SUCCESS CONFIRMED! You're really leveling up!",
      "PUZZLE SOLVED! My circuits are buzzing with pride!",
      "CORRECT! Your problem-solving skills are upgrading!"
    ],
    state: 'celebrating'
  },

  // QUICK SOLVE - Under 15 seconds
  {
    event: 'quick_solve',
    personality: 'owl',
    messages: [
      "Remarkable speed! Your pattern recognition is exceptional.",
      "That was extraordinarily fast! You saw the solution immediately.",
      "Incredible! You solved that with impressive efficiency."
    ],
    state: 'cheering'
  },
  {
    event: 'quick_solve',
    personality: 'fox',
    messages: [
      "WHOA! That was LIGHTNING FAST! You're on fire!",
      "Did you just... WOW! That was incredible!",
      "Are you a mind reader?! That was SO quick!",
      "SPEED DEMON! You absolutely crushed that puzzle!"
    ],
    state: 'cheering'
  },
  {
    event: 'quick_solve',
    personality: 'robot',
    messages: [
      "⚡ SPEED RECORD! That was faster than my processors!",
      "INCREDIBLE VELOCITY! My sensors can barely keep up!",
      "QUICK-SOLVE ACHIEVEMENT! You're operating at maximum efficiency!"
    ],
    state: 'cheering'
  },

  // PERFECT SOLVE - No hints, no wrong attempts
  {
    event: 'perfect_solve',
    personality: 'owl',
    messages: [
      "Flawless! A perfect solution with no errors. Masterful!",
      "Impeccable work! You executed that with precision and confidence.",
      "Perfection! Not a single misstep. Truly impressive."
    ],
    state: 'celebrating'
  },
  {
    event: 'perfect_solve',
    personality: 'fox',
    messages: [
      "PERFECT! Not a single mistake! You're a natural!",
      "FLAWLESS VICTORY! That was absolutely perfect!",
      "100% PERFECT! You nailed every single move!",
      "MASTERPIECE! That was perfection from start to finish!"
    ],
    state: 'celebrating'
  },
  {
    event: 'perfect_solve',
    personality: 'robot',
    messages: [
      "★ PERFECT EXECUTION ★ Zero errors! Optimal performance!",
      "FLAWLESS ALGORITHM! You achieved 100% accuracy!",
      "PERFECT SCORE DETECTED! That was textbook execution!"
    ],
    state: 'celebrating'
  },

  // FAILURE - Puzzle not solved
  {
    event: 'failure',
    personality: 'owl',
    messages: [
      "Don't be discouraged. Every attempt is a learning opportunity.",
      "These puzzles are challenging by design. You'll get it next time.",
      "Remember, failure is simply feedback. You're still improving."
    ],
    state: 'bonding'
  },
  {
    event: 'failure',
    personality: 'fox',
    messages: [
      "Hey, that's okay! Even the best detectives don't solve every case!",
      "Don't worry about it! You'll nail it next time!",
      "That was a tough one! You're still learning and that's awesome!"
    ],
    state: 'bonding'
  },
  {
    event: 'failure',
    personality: 'robot',
    messages: [
      "ERROR IS PART OF LEARNING PROCESS. You're still upgrading!",
      "FAILURE DATA LOGGED FOR IMPROVEMENT. Next time will be better!",
      "SETBACK DETECTED BUT PROGRESS CONTINUES. Keep going, detective!"
    ],
    state: 'bonding'
  }
];

// Helper to get dialogue based on context
export function getCompanionDialogue(
  event: DialogueTrigger['event'],
  personality: Personality,
  puzzleType?: PuzzleType
): DialogueTrigger | undefined {
  // Try to find exact match with puzzle type
  if (puzzleType) {
    const exactMatch = companionDialogue.find(
      d => d.event === event && d.personality === personality && d.puzzleType === puzzleType
    );
    if (exactMatch) return exactMatch;
  }

  // Fall back to event + personality match (without specific puzzle type)
  return companionDialogue.find(
    d => d.event === event && d.personality === personality && !d.puzzleType
  );
}

// Get a random message from a dialogue trigger
export function getRandomMessage(dialogue: DialogueTrigger): string {
  return dialogue.messages[Math.floor(Math.random() * dialogue.messages.length)];
}

// Get progressive hint (cycles through hints based on hint count)
export function getProgressiveHint(dialogue: DialogueTrigger, hintIndex: number): string | undefined {
  if (!dialogue.hints || dialogue.hints.length === 0) return undefined;
  // Loop back to start if we've exhausted hints
  return dialogue.hints[hintIndex % dialogue.hints.length];
}
