import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import type { PuzzleType } from '../types';

interface Props {
  zoneId: number;
  puzzleType: PuzzleType;
  onContinue: () => void;
}

const CASE_BRIEFINGS: Record<number, Record<PuzzleType, {
  title: string;
  description: string;
  objective: string;
}>> = {
  1: {
    sequence: {
      title: "Security Footage Analysis",
      description: "We've recovered footage from the mansion's security cameras. The timestamps are corrupted, but the sequence of events is crucial. Three suspects entered the corridor at different times.",
      objective: "Analyze the pattern of movements to determine the sequence of events and identify when the thief had access to the safe."
    },
    mirror: {
      title: "Laser Security Reconstruction",
      description: "Lady Ashworth had a laser security system installed last month. The thief somehow knew the exact angles to bypass it. We need to reconstruct how they moved through the grid.",
      objective: "Place mirrors to show the thief's path through the laser security system."
    },
    gear: {
      title: "Safe Mechanism Analysis",
      description: "The bedroom safe has a complex mechanical lock with multiple gears. Only someone who understands the mechanism could have opened it without the combination.",
      objective: "Connect the gears to unlock the safe and reveal how the thief cracked it."
    },
    logic: {
      title: "Witness Interrogation",
      description: "Three people had keys to Lady Ashworth's room: her butler, her daughter, and her business partner. Their alibis don't quite add up.",
      objective: "Analyze their statements to find contradictions and determine who's lying."
    },
    spatial: {
      title: "Crime Scene Reconstruction",
      description: "The room was locked from the inside, but furniture was moved. We need to understand the spatial arrangement to see how the thief could have escaped.",
      objective: "Reconstruct the room layout by rotating and positioning evidence markers."
    }
  },
  2: {
    sequence: {
      title: "Security Log Pattern",
      description: "The museum's digital logs show a repeating pattern in the access codes used. The thief exploited this to predict the next sequence.",
      objective: "Identify the pattern in the security codes to understand how the thief gained access."
    },
    mirror: {
      title: "Laser Grid Bypass",
      description: "The painting was protected by a complex laser grid. Footage shows the thief using mirrors to redirect beams and create a safe path.",
      objective: "Recreate the thief's mirror setup to show how they reached the painting."
    },
    gear: {
      title: "Vault Lock Mechanism",
      description: "The vault's mechanical lock is a masterpiece of engineering. The thief must have studied it extensively to time the gear rotations perfectly.",
      objective: "Understand the gear system to see how the vault was opened."
    },
    logic: {
      title: "Curator's Statement",
      description: "The museum curator claims to have been in a meeting during the theft. But security badge data shows unusual patterns in his movements.",
      objective: "Cross-reference statements with evidence to expose the truth."
    },
    spatial: {
      title: "Evidence Positioning",
      description: "Items were found in strange positions around the gallery. Understanding their spatial relationship might reveal the thief's escape route.",
      objective: "Arrange the evidence markers to match the crime scene photos."
    }
  },
  3: {
    sequence: {
      title: "Financial Transaction Pattern",
      description: "Marcus Chen's company had suspicious financial transactions. The pattern of transfers suggests systematic fraud, but we need to prove it.",
      objective: "Identify the pattern in the transactions to trace the money flow."
    },
    mirror: {
      title: "Office Laser Security",
      description: "The penthouse office had military-grade laser security. Someone with inside knowledge disabled specific beams to stage the scene.",
      objective: "Reconstruct the security beam configuration to find the weak point."
    },
    gear: {
      title: "Server Room Access",
      description: "The company's encrypted servers were protected by a mechanical fail-safe. Only someone with engineering expertise could have accessed them.",
      objective: "Crack the mechanical security to access the hidden evidence."
    },
    logic: {
      title: "Executive Alibis",
      description: "Three executives were in the building when Chen died. Each claims they were in meetings, but phone records tell a different story.",
      objective: "Analyze their alibis against digital evidence to find the killer."
    },
    spatial: {
      title: "Penthouse Scene Analysis",
      description: "Chen's body position and the placement of objects suggest the scene was staged. We need to understand the true spatial configuration.",
      objective: "Reconstruct the crime scene to reveal what really happened."
    }
  }
};

export function CaseBriefing({ zoneId, puzzleType, onContinue }: Props) {
  const briefing = CASE_BRIEFINGS[zoneId]?.[puzzleType] || {
    title: "Evidence Analysis",
    description: "Examine the evidence to uncover the truth.",
    objective: "Solve the puzzle to proceed with the investigation."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <motion.div
        className="bg-slate-800 border-2 border-amber-500 rounded-2xl shadow-2xl p-8 max-w-3xl w-full"
        initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
            <FileText size={24} className="text-slate-900" />
          </div>
          <div>
            <div className="text-amber-500 text-sm font-semibold uppercase tracking-wider">Case File</div>
            <h2 className="text-2xl font-bold text-white">{briefing.title}</h2>
          </div>
        </motion.div>

        <motion.div
          className="mb-6 p-6 bg-slate-700 rounded-xl border border-slate-600"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-amber-400 font-semibold mb-3 text-sm uppercase tracking-wider">Situation</h3>
          <p className="text-slate-200 leading-relaxed">{briefing.description}</p>
        </motion.div>

        <motion.div
          className="mb-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl border border-purple-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-purple-300 font-semibold mb-3 text-sm uppercase tracking-wider">Your Objective</h3>
          <p className="text-white leading-relaxed font-medium">{briefing.objective}</p>
        </motion.div>

        <motion.button
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-3 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Analysis
          <ArrowRight size={24} />
        </motion.button>

        <motion.div
          className="mt-4 text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Use your detective skills to crack the case
        </motion.div>
      </motion.div>
    </div>
  );
}
