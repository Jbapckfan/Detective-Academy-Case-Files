import seedrandom from 'seedrandom';
import type { SequencePuzzleData, Difficulty } from '../../types';

export function generateSequencePuzzle(seed: string, difficulty: Difficulty, zoneId?: number): SequencePuzzleData {
  const rng = seedrandom(seed);

  const caseSymbols: Record<number, { symbols: string[], colors: string[] }> = {
    1: {
      symbols: ['💎', '🔑', '🔒', '⌚', '👤', '🚪'],
      colors: ['gold', 'silver', 'ruby', 'sapphire', 'emerald', 'bronze']
    },
    2: {
      symbols: ['🖼️', '🔦', '📷', '🎨', '🔍', '⚡'],
      colors: ['crimson', 'azure', 'violet', 'amber', 'teal', 'scarlet']
    },
    3: {
      symbols: ['💼', '📊', '💰', '🔐', '📱', '💻'],
      colors: ['navy', 'charcoal', 'platinum', 'steel', 'carbon', 'graphite']
    }
  };

  const theme = zoneId && caseSymbols[zoneId] ? caseSymbols[zoneId] : {
    symbols: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'],
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
  };

  const colors = theme.colors;
  const shapes = theme.symbols;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (difficulty === 'easy') {
    const type = Math.floor(rng() * 3);

    if (type === 0) {
      const elements = [colors, shapes][Math.floor(rng() * 2)];
      const a = elements[Math.floor(rng() * elements.length)];
      const b = elements.filter(e => e !== a)[Math.floor(rng() * (elements.length - 1))];
      const sequence = [a, b, a, b, a];
      const correctAnswer = b;
      const choices = [b, elements[2], elements[3], elements[4]].filter(e => e);

      return {
        sequence,
        choices: choices.slice(0, 4),
        correctAnswer,
        patternType: 'simple'
      };
    } else if (type === 1) {
      const num1 = Math.floor(rng() * 3) + 1;
      const num2 = num1 + 1;
      const sequence = [num1, num2, num1, num2, num1];
      const correctAnswer = num2;
      const choices = [num2, num1 + 2, num1 - 1, num2 + 1].filter(n => n > 0);

      return {
        sequence,
        choices: choices.slice(0, 4),
        correctAnswer,
        patternType: 'simple'
      };
    } else {
      const start = Math.floor(rng() * 5) + 1;
      const sequence = [start, start + 1, start + 2, start + 3];
      const correctAnswer = start + 4;
      const choices = [correctAnswer, start + 5, start + 3, start + 2];

      return {
        sequence,
        choices,
        correctAnswer,
        patternType: 'simple'
      };
    }
  }

  if (difficulty === 'medium') {
    const type = Math.floor(rng() * 4);

    if (type === 0) {
      const a = colors[Math.floor(rng() * colors.length)];
      const b = colors.filter(c => c !== a)[Math.floor(rng() * (colors.length - 1))];
      const sequence = [a, a, b, b, a, b];
      const correctAnswer = b;
      const choices = [b, a, colors[2], colors[3]];

      return {
        sequence,
        choices,
        correctAnswer,
        patternType: 'counting'
      };
    } else if (type === 1) {
      const start = Math.floor(rng() * 5) + 1;
      const step = Math.floor(rng() * 2) + 2;
      const sequence = [start, start + step, start + step * 2, start + step * 3];
      const correctAnswer = start + step * 4;
      const choices = [correctAnswer, start + step * 5, start + step * 3, start + 1];

      return {
        sequence,
        choices,
        correctAnswer,
        patternType: 'mathematical'
      };
    } else if (type === 2) {
      const pattern = [1, 2, 3];
      const sequence = [...pattern, ...pattern];
      const correctAnswer = 1;
      const choices = [1, 2, 3, 4];

      return {
        sequence,
        choices,
        correctAnswer,
        patternType: 'counting'
      };
    } else {
      const a = shapes[0];
      const b = shapes[1];
      const c = shapes[2];
      const sequence = [a, b, a, b, b, a, b, b, b];
      const correctAnswer = a;
      const choices = [a, b, c, shapes[3]];

      return {
        sequence,
        choices,
        correctAnswer,
        patternType: 'compound'
      };
    }
  }

  const type = Math.floor(rng() * 3);

  if (type === 0) {
    const sequence = [1, 1, 2, 3, 5, 8];
    const correctAnswer = 13;
    const choices = [13, 11, 12, 16];

    return {
      sequence,
      choices,
      correctAnswer,
      patternType: 'mathematical'
    };
  } else if (type === 1) {
    const sequence = [2, 4, 8, 16, 32];
    const correctAnswer = 64;
    const choices = [64, 48, 62, 128];

    return {
      sequence,
      choices,
      correctAnswer,
      patternType: 'mathematical'
    };
  } else {
    const a = colors[0];
    const b = colors[1];
    const c = colors[2];
    const sequence = [[a], [a, b], [a, b, b], [a, b, b, b]];
    const correctAnswer = JSON.stringify([a, b, b, b, b]);
    const choices = [
      JSON.stringify([a, b, b, b, b]),
      JSON.stringify([a, b, b]),
      JSON.stringify([a, b, b, b, b, b]),
      JSON.stringify([b, b, b, b])
    ];

    return {
      sequence: sequence.map(s => JSON.stringify(s)),
      choices,
      correctAnswer,
      patternType: 'compound'
    };
  }
}
