
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserProfile, Language, ProficiencyLevel } from './types';
import Landing from './components/Landing';
import LanguageSelector from './components/LanguageSelector';
import Onboarding from './components/Onboarding';
import ChatDashboard from './components/ChatDashboard';
import PaymentSetup from './components/PaymentSetup';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('talkme_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = () => {
    // Mock login logic
    const mockUser: UserProfile = {
      id: 'usr_123',
      name: 'Tester',
      language: Language.ENGLISH,
      level: ProficiencyLevel.A1,
      goals: '',
      isStudent: false,
      useCount: 0
    };
    setUser(mockUser);
    localStorage.setItem('talkme_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('talkme_user');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('talkme_user', JSON.stringify(updated));
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Routes>
          <Route path="/" element={<Landing onLogin={handleLogin} user={user} />} />
          
          <Route 
            path="/idiomas" 
            element={user ? <LanguageSelector user={user} onUpdate={updateUser} /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/onboarding" 
            element={user ? <Onboarding user={user} onUpdate={updateUser} /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/dashboard" 
            element={user ? <ChatDashboard user={user} onUpdate={updateUser} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />

          <Route 
            path="/payment" 
            element={user ? <PaymentSetup user={user} onUpdate={updateUser} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
