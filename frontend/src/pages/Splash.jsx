import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Wheat } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#2d9e5f] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center bg-white p-4 rounded-[2rem] shadow-lg mb-8">
        <Leaf className="w-12 h-12 text-[#2d9e5f]" />
        <Wheat className="w-12 h-12 text-[#f5c842]" />
      </div>
      <h1 className="text-4xl font-extrabold mb-3">FarmQuest</h1>
      <p className="text-xl mb-12 opacity-90 font-medium">Farm Organic. Earn Rewards. Grow Better.</p>
      
      <button onClick={() => navigate('/auth')} className="bg-white text-[#2d9e5f] font-bold py-4 w-full rounded-2xl mb-4 transition-transform active:scale-95 text-lg shadow-md">
        Get Started
      </button>
      <button onClick={() => navigate('/auth')} className="text-white/80 font-semibold p-2 active:opacity-50 transition-opacity">
        Already have an account? Login
      </button>
    </div>
  );
}
