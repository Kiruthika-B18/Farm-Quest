import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, User, ShoppingBag, Lock } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [marketplaceLocked, setMarketplaceLocked] = useState(true);

  useEffect(() => {
    const progresses = JSON.parse(localStorage.getItem('farmProgresses') || '[]');
    const now = new Date();
    const hasHarvested = progresses.some(p => p.harvestDate && new Date(p.harvestDate) <= now);
    setMarketplaceLocked(!hasHarvested);
  }, [location.pathname]);

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag, locked: marketplaceLocked },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#c8e6c9] flex justify-around p-2 pb-safe shadow-[0_-10px_15px_-3px_rgba(45,158,95,0.05)] z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        const isLocked = tab.locked;
        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center p-2 rounded-xl min-w-[60px] transition-all relative ${isActive ? 'text-[#2d9e5f]' : isLocked ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className={`absolute inset-0 bg-[#f0f7f2] rounded-xl transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="relative z-10">
              <Icon className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              {isLocked && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gray-300 rounded-full flex items-center justify-center">
                  <Lock size={8} className="text-white" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold relative z-10">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
