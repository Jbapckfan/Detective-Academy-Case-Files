import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Personality, Tier } from '../types';

const PERSONALITIES: { id: Personality; name: string; icon: typeof Brain; description: string; color: string }[] = [
  {
    id: 'owl',
    name: 'The Analyst',
    icon: Brain,
    description: 'Methodical and thorough - perfect for complex investigations',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'fox',
    name: 'The Sleuth',
    icon: Zap,
    description: 'Quick-thinking and intuitive - finds clues others miss',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'robot',
    name: 'The Forensic Expert',
    icon: Sparkles,
    description: 'Precise and logical - excels at pattern analysis',
    color: 'from-cyan-500 to-cyan-600'
  }
];

const TIERS: { id: Tier; name: string; age: string; description: string }[] = [
  {
    id: 'jr-detective',
    name: 'Junior Detective',
    age: 'Ages 5-7',
    description: 'Simple cases with clear clues and guided investigation'
  },
  {
    id: 'detective',
    name: 'Detective',
    age: 'Ages 8-12',
    description: 'Balanced complexity with hidden evidence to discover'
  },
  {
    id: 'master-detective',
    name: 'Master Detective',
    age: 'Ages 13+',
    description: 'Complex conspiracies requiring advanced deduction'
  }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier>('detective');
  const [selectedPersonality, setSelectedPersonality] = useState<Personality>('fox');
  const initializeNewUser = useGameStore(state => state.initializeNewUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!username.trim()) return;

    setIsLoading(true);
    await initializeNewUser(username, selectedTier, selectedPersonality);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Film grain effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      <motion.div
        className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-slate-700/50 relative z-10"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                <span className="text-amber-400 font-semibold tracking-wider text-sm uppercase">
                  Welcome Detective
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-50 to-amber-200">
                  Detective Academy
                </span>
              </h1>
              <h2 className="text-2xl font-light text-slate-300 mb-4">
                Case Files
              </h2>
              <p className="text-slate-400 text-lg">
                Master the art of investigation with your AI detective assistant
              </p>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300 mb-3 block uppercase tracking-wide">
                  What's your detective name?
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-amber-500 focus:outline-none text-lg text-white placeholder-slate-500 transition-colors"
                  maxLength={20}
                />
              </label>

              <button
                onClick={() => username.trim() && setStep(2)}
                disabled={!username.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold text-lg hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                <span className="text-amber-400 font-semibold tracking-wider text-sm uppercase">
                  Step 2 of 3
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Select Your Rank
              </h2>
              <p className="text-slate-400">Choose your detective experience level</p>
            </div>

            <div className="space-y-3">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left group ${
                    selectedTier === tier.id
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-900/20'
                      : 'border-slate-600/50 bg-slate-900/50 hover:border-amber-500/50 hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`font-semibold text-lg mb-1 ${
                    selectedTier === tier.id ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {tier.name}
                  </div>
                  <div className={`text-sm font-medium mb-2 ${
                    selectedTier === tier.id ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                  }`}>
                    {tier.age}
                  </div>
                  <div className={`text-sm ${
                    selectedTier === tier.id ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {tier.description}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-slate-600/50 text-slate-300 rounded-xl font-semibold hover:bg-slate-800/50 hover:border-slate-500 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                <span className="text-amber-400 font-semibold tracking-wider text-sm uppercase">
                  Step 3 of 3
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Choose Your Assistant
              </h2>
              <p className="text-slate-400">Select your AI detective partner</p>
            </div>

            <div className="space-y-3">
              {PERSONALITIES.map((personality) => {
                const Icon = personality.icon;
                return (
                  <button
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality.id)}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 group ${
                      selectedPersonality === personality.id
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-900/20'
                        : 'border-slate-600/50 bg-slate-900/50 hover:border-amber-500/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${personality.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                        selectedPersonality === personality.id ? 'ring-2 ring-amber-500/50 ring-offset-2 ring-offset-slate-800' : ''
                      }`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-lg mb-1 ${
                        selectedPersonality === personality.id ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {personality.name}
                      </div>
                      <div className={`text-sm ${
                        selectedPersonality === personality.id ? 'text-slate-300' : 'text-slate-400'
                      }`}>
                        {personality.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-slate-600/50 text-slate-300 rounded-xl font-semibold hover:bg-slate-800/50 hover:border-slate-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : "Let's Go!"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
