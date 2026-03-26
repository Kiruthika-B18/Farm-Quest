import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ onAuth }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '' });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.contact.trim()) { setError('Please enter your mobile number or email.'); return; }
    // Check for previously stored user
    const existing = localStorage.getItem('userInfo');
    let userInfo = existing ? JSON.parse(existing) : { name: 'Farmer', contact: form.contact };
    userInfo.contact = form.contact;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    onAuth && onAuth();
    // If they have farm progress, go to dashboard, else onboarding
    const progresses = JSON.parse(localStorage.getItem('farmProgresses') || '[]');
    navigate(progresses.length > 0 ? '/' : '/onboarding');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your full name.'); return; }
    if (!form.contact.trim()) { setError('Please enter your mobile number or email.'); return; }
    localStorage.setItem('userInfo', JSON.stringify({ name: form.name, contact: form.contact }));
    onAuth && onAuth();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#f0f7f2] to-white p-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-3 drop-shadow">🌾</div>
        <h1 className="text-3xl font-black text-[#1a6b3f]">FarmQuest</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Farm Organic. Earn Rewards. Grow Better.</p>
      </div>

      <div className="card p-6 shadow-xl border-[#c8e6c9]">
        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(false); setError(''); setForm({ name: '', contact: '' }); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-[#1a6b3f] shadow-sm' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setIsLogin(true); setError(''); setForm({ name: '', contact: '' }); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-[#1a6b3f] shadow-sm' : 'text-gray-500'}`}
          >
            Log In
          </button>
        </div>

        {!isLogin ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#2d9e5f] focus:ring-1 focus:ring-[#2d9e5f] font-semibold text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Mobile Number or Gmail</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="+91 98765 43210 or name@gmail.com"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#2d9e5f] focus:ring-1 focus:ring-[#2d9e5f] font-semibold text-sm outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full mt-2 py-4">
              Create Account & Continue →
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Mobile Number or Gmail</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="+91 98765 43210 or name@gmail.com"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-[#2d9e5f] focus:ring-1 focus:ring-[#2d9e5f] font-semibold text-sm outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full mt-2 py-4">
              Log In →
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 font-medium mt-6">
        By continuing, you agree to FarmQuest's Terms of Service.
      </p>
    </div>
  );
}
