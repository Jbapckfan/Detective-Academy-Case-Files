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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Detective Academy: Case Files
              </h1>
              <p className="text-gray-600">
                Master the art of investigation with your AI detective assistant
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-2 block">
                  What's your detective name?
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                  maxLength={20}
                />
              </label>

              <button
                onClick={() => username.trim() && setStep(2)}
                disabled={!username.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Select Your Rank
              </h2>
              <p className="text-gray-600">Choose your detective experience level</p>
            </div>

            <div className="space-y-3">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full p-4 rounded-xl border-4 transition-all text-left ${
                    selectedTier === tier.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-lg text-gray-800">{tier.name}</div>
                  <div className="text-sm text-indigo-600 font-medium">{tier.age}</div>
                  <div className="text-sm text-gray-600 mt-1">{tier.description}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Choose Your Assistant
              </h2>
              <p className="text-gray-600">Select your AI detective partner</p>
            </div>

            <div className="space-y-3">
              {PERSONALITIES.map((personality) => {
                const Icon = personality.icon;
                return (
                  <button
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality.id)}
                    className={`w-full p-4 rounded-xl border-4 transition-all text-left flex items-center gap-4 ${
                      selectedPersonality === personality.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${personality.color} flex items-center justify-center`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-800">{personality.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{personality.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
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
