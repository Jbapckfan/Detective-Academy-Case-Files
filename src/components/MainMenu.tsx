import { motion } from 'framer-motion';
import { Play, User, Settings, BarChart3, Crown } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface Props {
  onStartGame: (zoneId: number) => void;
  onShowProfiles: () => void;
}

export function MainMenu({ onStartGame, onShowProfiles }: Props) {
  const { user, companion, zones } = useGameStore();

  if (!user || !companion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Detective {user.username}'s Case Files
          </h1>
          <p className="text-xl text-gray-600">
            {companion.name} is ready to assist with your investigations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {zones.map((zone, index) => {
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-xl"
              >
                <div
                  className="h-48 flex items-center justify-center text-white p-6"
                  style={{ background: zone.theme.background }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{zone.name}</h3>
                    <p className="text-sm opacity-90">{zone.description}</p>
                  </div>
                </div>

                <div className="bg-white p-6">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{zone.story}</p>

                  <button
                    onClick={() => onStartGame(zone.id)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Investigate Case
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <motion.button
            onClick={onShowProfiles}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Your Progress</div>
              <div className="text-sm text-gray-600">View cognitive profiles</div>
            </div>
          </motion.button>

          <motion.button
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Customize</div>
              <div className="text-sm text-gray-600">Change companion look</div>
            </div>
          </motion.button>

          <motion.button
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Settings size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Settings</div>
              <div className="text-sm text-gray-600">Sound, accessibility</div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
