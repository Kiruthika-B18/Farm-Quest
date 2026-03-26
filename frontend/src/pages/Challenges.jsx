import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Check } from 'lucide-react';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [totalPoints, setTotalPoints] = useState(1240);
  const [profile, setProfile] = useState(null);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('farmProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setNoProfile(true);
    }
  }, []);

  const fetchChallenges = async (farmProfile) => {
    const p = farmProfile || profile;
    if (!p) { setNoProfile(true); return; }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name || 'Farmer',
          cropType: p.cropType || 'Rice',
          stage: 'Vegetative',
          farmSize: p.farmSize || 2,
          district: p.district || 'Coimbatore',
          state: p.state || 'Tamil Nadu',
          soilType: p.soilType || 'Loamy',
          irrigationType: p.irrigationType || 'Drip',
        })
      });
      const data = await response.json();
      if (data && data.challenges) {
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('farmProfile');
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
      fetchChallenges(p);
    }
  }, []);

  const handleComplete = async (challenge) => {
    try {
      const response = await fetch('http://localhost:5000/api/complete-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'mock_user',
          challengeId: challenge.id
        })
      });
      const result = await response.json();
      
      if (result.success) {
        setTotalPoints(prev => prev + result.newPoints);
        setChallenges(prev => prev.filter(c => c.id !== challenge.id));
        setCompleted(prev => [challenge, ...prev]);
        
        alert(`🎉 Challenge Complete! earned +${result.newPoints} pts`);
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert('Error marking challenge complete.');
    }
  };

  const categoryColors = {
    'Water': { border: 'bg-blue-500', iconBg: 'bg-blue-50', text: 'text-blue-600' },
    'Soil': { border: 'bg-orange-500', iconBg: 'bg-orange-50', text: 'text-orange-600' },
    'Pest': { border: 'bg-pink-500', iconBg: 'bg-pink-50', text: 'text-pink-600' },
    'Biodiversity': { border: 'bg-green-500', iconBg: 'bg-green-50', text: 'text-green-600' },
    'Energy': { border: 'bg-purple-500', iconBg: 'bg-purple-50', text: 'text-purple-600' },
  };

  return (
    <div className="min-h-screen p-4 pb-20 space-y-6">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800">Challenges</h1>
        <div className="text-sm font-bold text-[#2d9e5f] bg-[#f0f7f2] px-3 py-1 rounded-full border border-[#c8e6c9]">{totalPoints} pts</div>
      </div>

      {noProfile && (
        <div className="card border-[#f5c842] bg-yellow-50 p-4 text-center">
          <p className="text-sm font-bold text-yellow-800 mb-2">⚠️ No farm profile found!</p>
          <p className="text-xs text-yellow-700 mb-3">Go to Profile → Create Progress to set up your farm details first.</p>
        </div>
      )}

      <div className="card bg-[#1a6b3f] text-white p-4 border-none shadow-[0_4px_12px_rgba(26,107,63,0.3)]">
        <div className="flex gap-3 mb-3 relative">
          <div className="text-3xl animate-pulse">🤖</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight mb-1 flex items-center gap-1">AI Gen-Challenges <Sparkles size={16} className="text-[#f5c842]" /></h3>
            {profile ? (
              <p className="text-xs text-white/80">Personalized for your <strong>{profile.cropType}</strong> farm in <strong>{profile.district}</strong> ({profile.soilType} soil, {profile.irrigationType} irrigation).</p>
            ) : (
              <p className="text-xs text-white/80">Set up your farm profile to get personalized tasks.</p>
            )}
          </div>
        </div>
        <button 
          onClick={() => fetchChallenges()}
          disabled={loading || !profile}
          className="w-full py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl text-sm font-bold transition-colors border border-white/20 backdrop-blur-sm disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Regenerate Suggestions 🔄'}
        </button>
      </div>

      <div>
        <h3 className="font-extrabold text-gray-800 mb-3 mt-6">Active Challenges</h3>
        {loading && <p className="text-sm text-gray-500 text-center py-4">Asking API for organic farming tasks... 🧠</p>}
        {!loading && challenges.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No challenges left!</p>}
        
        <div className="space-y-3">
          {challenges.map(challenge => {
            const colors = categoryColors[challenge.category] || categoryColors['Soil'];
            return (
              <div key={challenge.id} className="card p-0 overflow-hidden relative group">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colors.border}`}></div>
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className={`text-4xl ${colors.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner pt-1`}>{challenge.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800 text-base leading-tight">{challenge.title}</h4>
                        <span className="font-black text-[#2d9e5f] bg-[#f0f7f2] px-2 py-0.5 rounded-lg text-xs border border-[#c8e6c9]">+{challenge.points}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">{challenge.description}</p>
                      
                      {challenge.tip && <p className="text-[10px] text-gray-400 font-bold mb-3 italic">💡 Pro Tip: {challenge.tip}</p>}

                      <button 
                        onClick={() => handleComplete(challenge)}
                        className={`w-full ${colors.iconBg} ${colors.text} font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform`}
                      >
                        <Camera size={16} /> Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {completed.length > 0 && (
        <div>
          <h3 className="font-extrabold text-gray-800 mb-3 mt-6">Completed Today</h3>
          <div className="space-y-2">
            {completed.map((comp, i) => (
              <div key={i} className="card p-3 flex gap-3 items-center opacity-70 bg-gray-50 border-dashed">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-green-600">
                  <Check size={20} strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-600 line-through">{comp.title}</h4>
                </div>
                <span className="font-bold text-gray-400 text-sm border px-2 rounded-lg">+{comp.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
