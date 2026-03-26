import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Edit3 } from 'lucide-react';

export default function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: 'Farmer' });
  const [progresses, setProgresses] = useState([]);

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) setUserInfo(JSON.parse(info));
    const p = JSON.parse(localStorage.getItem('farmProgresses') || '[]');
    setProgresses(p);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    onLogout && onLogout();
  };

  return (
    <div className="min-h-screen p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-extrabold text-gray-800">Profile</h1>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Settings size={22} /></button>
      </div>

      {/* Profile card */}
      <div className="card bg-gradient-to-br from-[#1a6b3f] to-[#0d3f24] text-white p-6 border-none shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-8xl opacity-10">🌱</div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl border-2 border-white/30">👨🏽‍🌾</div>
          <div>
            <h2 className="text-2xl font-black mb-1">{userInfo.name}</h2>
            <p className="text-sm text-white/70 font-medium">{userInfo.contact}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-black/20 rounded-xl p-3">
          <div className="text-center"><div className="text-lg font-black text-[#f5c842]">{progresses.length}</div><div className="text-[9px] font-bold text-white/60 uppercase mt-1">Progresses</div></div>
          <div className="text-center border-x border-white/10"><div className="text-lg font-black text-green-400">12</div><div className="text-[9px] font-bold text-white/60 uppercase mt-1">Tasks Done</div></div>
          <div className="text-center"><div className="text-lg font-black text-[#f5c842]">🔥5</div><div className="text-[9px] font-bold text-white/60 uppercase mt-1">Streak</div></div>
        </div>
      </div>

      {/* Farm Progresses */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-extrabold text-gray-800">My Farms</h3>
          <button onClick={() => navigate('/onboarding')} className="text-[#2d9e5f] text-xs font-bold flex items-center gap-1"><Edit3 size={14}/> Add</button>
        </div>
        {progresses.length === 0 ? (
          <div className="card p-5 text-center text-gray-400">
            <p className="text-3xl mb-2">🌱</p>
            <p className="text-sm font-bold">No farms added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progresses.map((p, i) => (
              <div key={p.id} className="card p-4 border-[#c8e6c9]">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-800">🌾 {p.cropType}</h4>
                  <span className="text-xs font-bold bg-[#f0f7f2] text-[#2d9e5f] px-2 py-0.5 rounded border border-[#c8e6c9]">Farm {i + 1}</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div><span className="text-gray-400">Soil</span><span className="font-bold text-gray-700 ml-2">{p.soilType}</span></div>
                  <div><span className="text-gray-400">Irrigation</span><span className="font-bold text-gray-700 ml-2">{p.irrigationType}</span></div>
                  <div><span className="text-gray-400">Area</span><span className="font-bold text-gray-700 ml-2">{p.landArea} acres</span></div>
                  <div><span className="text-gray-400">Location</span><span className="font-bold text-gray-700 ml-2">{p.village ? p.village + ', ' : ''}{p.district}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => navigate('/onboarding')} className="w-full btn-primary bg-[#f5c842] text-[#1a6b3f] flex justify-center items-center gap-2">
        <Edit3 size={18} /> Create New Progress
      </button>

      <button onClick={handleLogout} className="w-full card border-red-200 bg-red-50 text-red-600 font-extrabold flex justify-center items-center gap-2 p-4">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
