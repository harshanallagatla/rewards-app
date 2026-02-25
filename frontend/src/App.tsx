import { useState, useEffect } from 'react';
import type { User } from './types';
import { api } from './api/client';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import RewardsApp from './components/RewardsApp';

type Screen = 'login' | 'signup' | 'app';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rw_token');
    if (!token) {
      setBootstrapping(false);
      return;
    }
    api.getMe()
      .then(u => {
        setUser(u);
        setScreen('app');
      })
      .catch(() => {
        localStorage.removeItem('rw_token');
      })
      .finally(() => setBootstrapping(false));
  }, []);

  function handleLogin(token: string) {
    localStorage.setItem('rw_token', token);
    api.getMe().then(u => {
      setUser(u);
      setScreen('app');
    });
  }

  function handleSignOut() {
    localStorage.removeItem('rw_token');
    setUser(null);
    setScreen('login');
  }

  function handlePointsUpdate(pts: number) {
    setUser(u => u ? { ...u, points: pts } : u);
  }

  if (bootstrapping) return null;

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} onSwitchToSignup={() => setScreen('signup')} />;
  }

  if (screen === 'signup') {
    return <SignupScreen onLogin={handleLogin} onSwitchToLogin={() => setScreen('login')} />;
  }

  if (!user) return null;
  return <RewardsApp user={user} onPointsUpdate={handlePointsUpdate} onSignOut={handleSignOut} />;
}
