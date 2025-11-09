import { useState, useEffect, lazy, Suspense } from 'react';
import { Onboarding } from './components/Onboarding';
import { MainMenu } from './components/MainMenu';
import { useGameStore } from './store/gameStore';

// Lazy load heavy components
const GameSession = lazy(() => import('./components/GameSession').then(m => ({ default: m.GameSession })));
const ProfileDashboard = lazy(() => import('./components/ProfileDashboard').then(m => ({ default: m.ProfileDashboard })));
const AchievementsPage = lazy(() => import('./components/AchievementsPage').then(m => ({ default: m.AchievementsPage })));

type Screen = 'onboarding' | 'menu' | 'game' | 'profiles' | 'achievements';

// Loading component for Suspense fallback
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-500 mx-auto mb-4" />
        <p className="text-white text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const { user, companion, isLoading } = useGameStore();

  useEffect(() => {
    const existingUserId = localStorage.getItem('companion_user_id');
    if (existingUserId) {
      useGameStore.getState().loadUserData(existingUserId).then(() => {
        setCurrentScreen('menu');
      });
    }
  }, []);

  const handleOnboardingComplete = () => {
    const userId = useGameStore.getState().user?.id;
    if (userId) {
      localStorage.setItem('companion_user_id', userId);
      setCurrentScreen('menu');
    }
  };

  const handleStartGame = (zoneId: number) => {
    useGameStore.getState().startSession(zoneId);
    setCurrentScreen('game');
  };

  const handleGameComplete = () => {
    setCurrentScreen('menu');
  };

  const handleShowProfiles = () => {
    setCurrentScreen('profiles');
  };

  const handleShowAchievements = () => {
    setCurrentScreen('achievements');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'onboarding' || !user || !companion) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (currentScreen === 'profiles') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ProfileDashboard onBack={handleBackToMenu} />
      </Suspense>
    );
  }

  if (currentScreen === 'achievements') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AchievementsPage onBack={handleBackToMenu} />
      </Suspense>
    );
  }

  if (currentScreen === 'game') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <GameSession onComplete={handleGameComplete} />
      </Suspense>
    );
  }

  return (
    <MainMenu onStartGame={handleStartGame} onShowProfiles={handleShowProfiles} onShowAchievements={handleShowAchievements} />
  );
}

export default App;
