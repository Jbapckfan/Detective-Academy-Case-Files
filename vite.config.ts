import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-zustand': ['zustand'],
          'vendor-icons': ['lucide-react'],

          // Game logic chunks
          'game-data': [
            './src/data/cases.ts',
            './src/data/puzzles.ts',
            './src/data/crimeScenes.ts'
          ],
          'achievements': [
            './src/data/achievements.ts',
            './src/hooks/useAchievements.ts',
            './src/components/AchievementNotification.tsx',
            './src/components/AchievementsPage.tsx'
          ],
          'companion': [
            './src/data/companionDialogue.ts',
            './src/hooks/useCompanionDialogue.ts'
          ],
          'sound': [
            './src/lib/soundEngine.ts',
            './src/components/SoundControls.tsx'
          ],

          // Puzzle components (lazily loaded)
          'puzzles': [
            './src/components/puzzles/SequencePuzzle.tsx',
            './src/components/puzzles/MirrorPuzzle.tsx',
            './src/components/puzzles/GearPuzzle.tsx',
            './src/components/puzzles/LogicPuzzle.tsx',
            './src/components/puzzles/SpatialPuzzle.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
