import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MainMenu } from './components/MainMenu';
import { GameSession } from './components/GameSession';
import { ProfileDashboard } from './components/ProfileDashboard';
import { useGameStore } from './store/gameStore';

type Screen = 'onboarding' | 'menu' | 'game' | 'profiles';

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
    return <ProfileDashboard onBack={handleBackToMenu} />;
  }

  if (currentScreen === 'game') {
    return <GameSession onComplete={handleGameComplete} />;
  }

  return (
    <MainMenu onStartGame={handleStartGame} onShowProfiles={handleShowProfiles} />
  );
}

export default App;
