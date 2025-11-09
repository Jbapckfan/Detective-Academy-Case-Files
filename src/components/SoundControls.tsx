import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export function SoundControls() {
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(60);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('sound_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setMusicVolume(settings.music || 30);
      setSfxVolume(settings.sfx || 60);
      soundEngine.setMusicVolume((settings.music || 30) / 100);
      soundEngine.setSFXVolume((settings.sfx || 60) / 100);
    }
  }, []);

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
    soundEngine.setMusicVolume(value / 100);
    saveSettings(value, sfxVolume);
  };

  const handleSFXVolumeChange = (value: number) => {
    setSfxVolume(value);
    soundEngine.setSFXVolume(value / 100);
    saveSettings(musicVolume, value);
    soundEngine.playClick(); // Test sound
  };

  const handleToggleMute = () => {
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
  };

  const saveSettings = (music: number, sfx: number) => {
    localStorage.setItem('sound_settings', JSON.stringify({ music, sfx }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expandable Panel */}
      {isExpanded && (
        <motion.div
          className="absolute bottom-full right-0 mb-3 bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-2xl min-w-[300px]"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Volume2 size={20} />
            Sound Settings
          </h3>

          {/* Music Volume */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Music size={16} />
                <span>Music</span>
              </div>
              <span className="text-amber-400 text-sm font-bold">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => handleMusicVolumeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Zap size={16} />
                <span>Sound Effects</span>
              </div>
              <span className="text-amber-400 text-sm font-bold">{sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => handleSFXVolumeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      <motion.button
        onClick={() => {
          if (!isExpanded) {
            soundEngine.playClick();
          }
          setIsExpanded(!isExpanded);
        }}
        onMouseEnter={() => soundEngine.playHover()}
        className={`w-14 h-14 rounded-full ${
          isMuted
            ? 'bg-gradient-to-br from-red-500 to-red-600'
            : 'bg-gradient-to-br from-amber-500 to-amber-600'
        } flex items-center justify-center shadow-lg hover:shadow-xl transition-all`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div onClick={(e) => {
          e.stopPropagation();
          handleToggleMute();
        }}>
          {isMuted ? (
            <VolumeX size={24} className="text-white" />
          ) : (
            <Volume2 size={24} className="text-white" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
