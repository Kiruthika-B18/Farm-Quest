import React, { useEffect, useState } from 'react';
import { Lock, ShoppingBag, Leaf } from 'lucide-react';

export default function Marketplace() {
  const [progresses, setProgresses] = useState([]);
  const [unlockedFarms, setUnlockedFarms] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('farmProgresses') || '[]');
    setProgresses(saved);
    const now = new Date();
    const unlocked = saved.filter(p => p.harvestDate && new Date(p.harvestDate) <= now);
    setUnlockedFarms(unlocked);
  }, []);

  return (
    <div className="min-h-screen p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-800">Marketplace</h1>
        {unlockedFarms.length > 0 && (
          <span className="text-xs font-bold bg-[#2d9e5f] text-white px-3 py-1 rounded-full">
            {unlockedFarms.length} Verified ✓
          </span>
        )}
      </div>

      {unlockedFarms.length === 0 ? (
        <div className="space-y-5">
          {/* Locked hero */}
          <div className="card bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 border-none shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 text-[180px]">🛒</div>
            <div className="flex flex-col items-center text-center relative z-10 py-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 border-2 border-white/20">
                <Lock size={36} className="text-white/80" />
              </div>
              <h2 className="text-xl font-black mb-2">Marketplace Locked</h2>
              <p className="text-sm text-white/60 font-medium leading-relaxed max-w-xs">
                Your Organic Marketplace unlocks when your crop reaches harvest time. Keep completing daily challenges to earn your Verified Organic badge!
              </p>
            </div>
          </div>

          {/* Show locked progress cards with countdown */}
          {progresses.length > 0 && (
            <div>
              <h3 className="font-extrabold text-gray-700 mb-3 text-sm uppercase tracking-widest">Your Crops</h3>
              <div className="space-y-3">
                {progresses.map(p => {
                  const harvestDate = p.harvestDate ? new Date(p.harvestDate) : null;
                  const now = new Date();
                  const daysLeft = harvestDate ? Math.max(0, Math.ceil((harvestDate - now) / (1000 * 60 * 60 * 24))) : '?';
                  const progress = harvestDate
                    ? Math.min(100, Math.round(((now - new Date(p.plantingDate)) / (harvestDate - new Date(p.plantingDate))) * 100))
                    : 0;

                  return (
                    <div key={p.id} className="card p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">🌾 {p.cropType}</h4>
                          <p className="text-xs text-gray-500">{p.village ? p.village + ', ' : ''}{p.district}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-lg">
                          <Lock size={11} />
                          <span className="text-xs font-bold">{daysLeft} days</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                          <span>Growth Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#4eca84] to-[#2d9e5f] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                          <span>🌱 {p.plantingDate ? new Date(p.plantingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Started'}</span>
                          <span>🌾 {harvestDate ? harvestDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Harvest'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card bg-gradient-to-br from-[#1a6b3f] to-[#0d3f24] text-white p-5 border-none shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">🎉</div>
              <div>
                <h2 className="font-black text-lg">Marketplace Unlocked!</h2>
                <p className="text-xs text-white/70">Your crops are ready for premium buyers.</p>
              </div>
            </div>
          </div>
          {unlockedFarms.map(p => (
            <div key={p.id} className="card p-4 border-[#c8e6c9]">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-800">🌾 {p.cropType}</h4>
                <span className="bg-[#2d9e5f] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Verified Organic</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-400 block">Location</span><span className="font-bold">{p.village || p.district}</span></div>
                <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-400 block">Area</span><span className="font-bold">{p.landArea} acres</span></div>
              </div>
              <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> List on Marketplace
              </button>
            </div>
          ))}
        </div>
      )}

      {progresses.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🌱</div>
          <p className="font-bold">Add a farm progress first!</p>
          <p className="text-sm">Go to Home → Create Progress</p>
        </div>
      )}
    </div>
  );
}
