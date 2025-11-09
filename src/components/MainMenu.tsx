import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, User, Settings, BarChart3, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { SoundControls } from './SoundControls';
import { soundEngine } from '../lib/soundEngine';

interface Props {
  onStartGame: (zoneId: number) => void;
  onShowProfiles: () => void;
  onShowAchievements: () => void;
}

export function MainMenu({ onStartGame, onShowProfiles, onShowAchievements }: Props) {
  const { user, companion, zones } = useGameStore();

  // Start noir ambient music when menu loads
  useEffect(() => {
    soundEngine.startNoirAmbience();
    return () => {
      soundEngine.stopMusic();
    };
  }, []);

  if (!user || !companion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
      {/* Sound Controls */}
      <SoundControls />

      {/* Film grain effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm">
              <span className="text-amber-400 font-semibold tracking-wider text-sm uppercase">
                Detective Academy
              </span>
            </div>
          </motion.div>

          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-50 to-amber-200">
              {user.username}'s Case Files
            </span>
          </h1>
          <p className="text-xl text-slate-300 font-light">
            {companion.name} is ready to assist with your investigations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {zones.map((zone, index) => {
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              >
                {/* Glowing border effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-300/20 to-amber-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                <div className="relative">
                  <div
                    className="h-56 flex items-center justify-center text-white p-6 relative overflow-hidden"
                    style={{ background: zone.theme.background }}
                  >
                    {/* Subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="text-center relative z-10">
                      <motion.h3
                        className="text-2xl font-bold mb-3 drop-shadow-lg"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.08 + 0.2 }}
                      >
                        {zone.name}
                      </motion.h3>
                      <motion.p
                        className="text-sm opacity-90 leading-relaxed"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.08 + 0.3 }}
                      >
                        {zone.description}
                      </motion.p>
                    </div>
                  </div>

                  <div className="bg-slate-800/90 backdrop-blur-sm p-6 border-t border-slate-700/50">
                    <p className="text-sm text-slate-300 mb-5 line-clamp-3 leading-relaxed">
                      {zone.story}
                    </p>

                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setTimeout(() => soundEngine.playPageTransition(), 100);
                        onStartGame(zone.id);
                      }}
                      onMouseEnter={() => soundEngine.playHover()}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50"
                    >
                      <Play size={20} />
                      <span>Investigate Case</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            onClick={() => {
              soundEngine.playClick();
              onShowProfiles();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all flex items-center gap-4 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:shadow-blue-900/50 transition-shadow">
              <BarChart3 size={26} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-lg">Your Progress</div>
              <div className="text-sm text-slate-400">View cognitive profiles</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => {
              soundEngine.playClick();
              onShowAchievements();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all flex items-center gap-4 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-shadow">
              <Trophy size={26} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-lg">Achievements</div>
              <div className="text-sm text-slate-400">Track your progress</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => soundEngine.playClick()}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all flex items-center gap-4 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:shadow-emerald-900/50 transition-shadow">
              <User size={26} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-lg">Customize</div>
              <div className="text-sm text-slate-400">Change companion look</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => soundEngine.playClick()}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all flex items-center gap-4 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:shadow-purple-900/50 transition-shadow">
              <Settings size={26} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-lg">Settings</div>
              <div className="text-sm text-slate-400">Sound, accessibility</div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
