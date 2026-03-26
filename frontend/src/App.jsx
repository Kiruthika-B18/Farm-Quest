import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Splash from './pages/Splash';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Community from './pages/Community';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

function AppInner() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const checkAuth = () => {
    const userInfo = localStorage.getItem('userInfo');
    setUser(userInfo ? JSON.parse(userInfo) : null);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('farmquest-auth-change', checkAuth);
    return () => window.removeEventListener('farmquest-auth-change', checkAuth);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f7f2]">
        <div className="flex flex-col items-center">
          <div className="text-5xl mb-4">🌾</div>
          <div className="w-10 h-10 border-4 border-[#2d9e5f] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#2d9e5f] font-bold">Loading FarmQuest...</p>
        </div>
      </div>
    );
  }

  const hideNav = ['/onboarding', '/splash', '/auth'].includes(location.pathname);

  return (
    <>
      <div className={hideNav ? '' : 'pb-[70px]'}>
        <Routes>
          {!user ? (
            <>
              <Route path="/splash" element={<Splash />} />
              <Route path="/auth" element={<Auth onAuth={checkAuth} />} />
              <Route path="*" element={<Navigate to="/splash" replace />} />
            </>
          ) : (
            <>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/" element={<Home onLogout={() => { localStorage.removeItem('userInfo'); checkAuth(); }} />} />
              <Route path="/community" element={<Community />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile" element={<Profile onLogout={() => { localStorage.removeItem('userInfo'); checkAuth(); }} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
      {user && !hideNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
