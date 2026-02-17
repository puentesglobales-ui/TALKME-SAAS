import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import api from './services/api';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/home/LandingPage';

import LanguageSelector from './components/LanguageSelector';
import StudyPlan from './components/StudyPlan';
import AdminDashboard from './components/AdminDashboard';
import OnboardingWizard from './components/Onboarding/OnboardingWizard';
import PaymentSetup from './components/PaymentSetup';


function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId) => {
    try {
      // We use our new server endpoint to check connection
      // But for speed, we might want to check supabase directly if policy allows
      // or just use the local api service we built.
      // Let's use the API service.
      // Use the configured API client which handles the base URL correctly for Prod/Dev
      const response = await api.get(`/profile/${userId}`);
      if (response.data) {
        // Axios returns data in response.data
        const profile = response.data;
        setOnboardingComplete(!!profile.onboarding_completed);
      } else {
        setOnboardingComplete(false);
      }
    } catch (e) {
      console.error("Profile check failed", e);
      setOnboardingComplete(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
  }

  const getRedirectPath = () => {
    if (!session) return "/login";

    const { is_student, payment_completed } = session.user.user_metadata || {};
    // If Freemium (is_student === false) and NO payment, go to payment setup
    // Explicitly check false because undefined might be old users or admin
    if (is_student === false && !payment_completed) {
      return "/payment-setup";
    }

    return onboardingComplete ? "/dashboard" : "/languages";
  };

  // Helper for protected routes that should also respect payment gate
  const ProtectedRoute = ({ children }) => {
    if (!session) return <Navigate to="/login" />;

    const { is_student, payment_completed } = session.user.user_metadata || {};
    if (is_student === false && !payment_completed) {
      return <Navigate to="/payment-setup" />;
    }

    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to={getRedirectPath()} />} />

          <Route path="/languages" element={
            <ProtectedRoute>
              {onboardingComplete ? <LanguageSelector /> : <LanguageSelector />}
            </ProtectedRoute>
          } />

          <Route path="/onboarding" element={
            <ProtectedRoute>
              {onboardingComplete ? <Navigate to="/dashboard" /> : <OnboardingWizard session={session} onComplete={() => { setOnboardingComplete(true); }} />}
            </ProtectedRoute>
          } />

          <Route path="/study" element={
            <ProtectedRoute>
              {onboardingComplete ? <StudyPlan /> : <Navigate to="/languages" />}
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              {onboardingComplete ? <ChatInterface session={session} /> : <Navigate to="/onboarding" />}
            </ProtectedRoute>
          } />

          <Route path="/payment-setup" element={
            session ? <PaymentSetup session={session} /> : <Navigate to="/login" />
          } />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
