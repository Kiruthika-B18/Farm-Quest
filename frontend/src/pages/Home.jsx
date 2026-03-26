import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Droplets, Wind, Leaf, Sparkles, Camera, Check, TestTube, MapPin } from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import SearchBar from '../components/SearchBar';

const categoryColors = {
  'Water': { border: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  'Soil': { border: 'bg-orange-400', bg: 'bg-orange-50', text: 'text-orange-700' },
  'Pest': { border: 'bg-pink-500', bg: 'bg-pink-50', text: 'text-pink-700' },
  'Biodiversity': { border: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  'Energy': { border: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
};

function ChallengePanel({ progress }) {
  const [challenges, setChallenges] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFert, setLoadingFert] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [points, setPoints] = useState(0);
  
  const fileInputRef = useRef(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const today = new Date();
  const plantDate = progress.plantingDate ? new Date(progress.plantingDate) : null;
  const isPlanted = !plantDate || today >= plantDate;
  const daysUntilPlanting = plantDate ? Math.ceil((plantDate - today) / (1000 * 60 * 60 * 24)) : 0;

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: progress.name || 'Farmer',
          cropType: progress.cropType,
          stage: 'Vegetative',
          farmSize: progress.landArea || 2,
          district: progress.district,
          state: 'Tamil Nadu',
          soilType: progress.soilType,
          irrigationType: progress.irrigationType,
        })
      });
      const data = await res.json();
      if (data?.challenges) setChallenges(data.challenges);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFertilizers = async () => {
    setLoadingFert(true);
    try {
      const res = await fetch('http://localhost:5000/api/fertilizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: progress.cropType,
          soilType: progress.soilType,
          district: progress.district,
          state: 'Tamil Nadu',
        })
      });
      const data = await res.json();
      if (data?.fertilizers) setFertilizers(data.fertilizers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFert(false);
    }
  };

  // Triggered when user clicks "Mark Complete"
  const startCapture = (challenge) => {
    setActiveChallenge(challenge);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Triggered when photo is selected/captured
  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChallenge) return;

    setIsVerifying(true);
    
    // Reset file input
    e.target.value = '';

    // Get Geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          finishChallengeCompletion(activeChallenge, { lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Couldn't get your location. Marking complete without geo-tag.");
          finishChallengeCompletion(activeChallenge, null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      finishChallengeCompletion(activeChallenge, null);
    }
  };

  const finishChallengeCompletion = (challenge, geoData) => {
    setChallenges(prev => prev.filter(c => c.id !== challenge.id));
    setCompleted(prev => [{ ...challenge, geo: geoData }, ...prev]);
    setPoints(prev => prev + (challenge.points || 100));
    setIsVerifying(false);
    setActiveChallenge(null);
    alert(`🎉 +${challenge.points || 100} pts earned!${geoData ? ' (Geo-tagged ✓)' : ''}`);
  };

  return (
    <div className="space-y-4">
      {/* Farm info chips */}
      <div className="flex gap-2 flex-wrap pt-2">
        <span className="bg-white border border-[#c8e6c9] text-[#1a6b3f] px-3 py-1 rounded-full text-xs font-bold shadow-sm">🌾 {progress.cropType}</span>
        <span className="bg-white border border-[#c8e6c9] text-[#1a6b3f] px-3 py-1 rounded-full text-xs font-bold shadow-sm">📍 {progress.village ? progress.village + ', ' : ''}{progress.district}</span>
        <span className="bg-white border border-[#c8e6c9] text-[#1a6b3f] px-3 py-1 rounded-full text-xs font-bold shadow-sm">📏 {progress.landArea} Acres</span>
        <span className="bg-white border border-[#c8e6c9] text-[#1a6b3f] px-3 py-1 rounded-full text-xs font-bold shadow-sm">🪨 {progress.soilType}</span>
        <span className="bg-white border border-[#c8e6c9] text-[#1a6b3f] px-3 py-1 rounded-full text-xs font-bold shadow-sm">💧 {progress.irrigationType}</span>
      </div>

      {/* AI Challenges banner */}
      {!isPlanted ? (
        <div className="card bg-gray-800 text-white p-5 border-none shadow-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 text-[100px] flex items-center justify-center">🔒</div>
          <div className="flex gap-3 mb-2 relative z-10">
            <div className="text-2xl">📅</div>
            <div>
              <h3 className="font-bold leading-tight">Challenges Locked</h3>
              <p className="text-xs text-white/60 mt-0.5">Starts on your planting date</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 relative z-10 text-center">
            <div className="text-2xl font-black text-[#f5c842]">{daysUntilPlanting} days</div>
            <div className="text-xs text-white/60 font-medium">until planting on {plantDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</div>
          </div>
        </div>
      ) : (
        <div className="card bg-[#1a6b3f] text-white p-4 border-none shadow-md">
          <div className="flex gap-3 mb-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1">
              <h3 className="font-bold leading-tight flex items-center gap-1">Daily Challenges <Sparkles size={14} className="text-[#f5c842]" /></h3>
              <p className="text-xs text-white/70 mt-0.5">AI picks for your {progress.cropType} farm in {progress.district}.</p>
            </div>
            {points > 0 && <span className="text-[#f5c842] font-black text-lg">+{points}</span>}
          </div>
          <button
            onClick={fetchChallenges}
            disabled={loading}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold border border-white/20 disabled:opacity-50 transition-all"
          >
            {loading ? '⏳ Generating...' : challenges.length > 0 ? '🔄 Regenerate' : '✨ Get Challenges'}
          </button>
        </div>
      )}

      {loading && <p className="text-center text-sm text-gray-400 font-medium py-4">Asking AI for personalized tasks... 🧠</p>}
      {isVerifying && (
        <div className="card bg-gray-800 text-white p-4 text-center border-none shadow-lg animate-pulse mb-3">
          <p className="font-bold flex items-center justify-center gap-2">
            <Camera className="animate-bounce" size={18} /> Verifying & Geo-tagging...
          </p>
        </div>
      )}

      {/* Hidden file input for camera */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef}
        onChange={handlePhotoCapture}
        className="hidden" 
      />

      {/* Active Challenges */}
      {challenges.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-700 text-sm uppercase tracking-widest">Active ({challenges.length})</h4>
          {challenges.map(c => {
            const col = categoryColors[c.category] || categoryColors['Soil'];
            return (
              <div key={c.id} className="card p-0 overflow-hidden">
                <div className={`h-1 ${col.border} w-full`}></div>
                <div className="p-4 flex gap-3">
                  <div className={`text-3xl ${col.bg} w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0`}>{c.emoji}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h5 className="font-bold text-gray-800 text-sm leading-tight">{c.title}</h5>
                      <span className="text-xs font-black text-[#2d9e5f] bg-[#f0f7f2] px-2 py-0.5 rounded-lg border border-[#c8e6c9]">+{c.points}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{c.description}</p>
                    {c.tip && <p className="text-[10px] text-gray-400 italic mb-3">💡 {c.tip}</p>}
                    <button
                      onClick={() => startCapture(c)}
                      disabled={isVerifying}
                      className={`w-full ${col.bg} ${col.text} font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50`}
                    >
                      <Camera size={14} /> Mark Complete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-extrabold text-gray-400 text-sm uppercase tracking-widest">Completed ✓</h4>
          {completed.map((c, i) => (
            <div key={i} className="card p-3 flex flex-col bg-gray-50 border-dashed opacity-80">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Check size={16} className="text-green-600" strokeWidth={3} />
                </div>
                <span className="font-bold text-gray-500 line-through text-sm flex-1">{c.title}</span>
                <span className="text-xs text-gray-400 font-bold">+{c.points}</span>
              </div>
              {c.geo && (
                <div className="mt-2 text-[9px] font-bold text-gray-400 flex items-center gap-1 ml-11">
                  <MapPin size={10} /> {c.geo.lat.toFixed(4)}, {c.geo.lng.toFixed(4)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fertilizers Section */}
      <div className="pt-4">
        <h4 className="font-extrabold text-[#1a6b3f] text-sm uppercase tracking-widest mb-3 flex items-center gap-1.5 border-t border-[#c8e6c9] pt-6">
          <TestTube size={16} /> Organic Fertilizers
        </h4>
        
        {fertilizers.length === 0 ? (
          <button
            onClick={fetchFertilizers}
            disabled={loadingFert}
            className="w-full card border-dashed border-[#2d9e5f] bg-[#f0f7f2] text-[#2d9e5f] font-bold py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#e8f3ea] transition-colors"
          >
            {loadingFert ? (
              <span className="flex items-center gap-2">⏳ Analyzing crop needs...</span>
            ) : (
              <>
                <div className="text-3xl mb-1">🌱</div>
                <span>Get Crop-Specific Organic Suggestions</span>
                <span className="text-xs font-medium text-[#2d9e5f]/70">Best suited for {progress.soilType} soil</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            {fertilizers.map((f, i) => (
              <div key={f.id || i} className="card p-4 border-[#c8e6c9] bg-[#fdfdfd]">
                <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                  <div className="text-2xl">{f.emoji}</div>
                  <h5 className="font-bold text-[#1a6b3f] text-base">{f.name}</h5>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3"><strong>Why it's good:</strong> {f.benefits}</p>
                <div className="bg-[#f0f7f2] border border-[#c8e6c9] rounded-lg px-3 py-2 text-xs text-gray-700 leading-relaxed">
                  <span className="font-bold text-[#2d9e5f] block mb-1">How to use:</span> 
                  {f.usage}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && challenges.length === 0 && completed.length === 0 && (!fertilizers || fertilizers.length === 0) && (
        <div className="text-center py-10 text-gray-400">
          <div className="text-4xl mb-3">🤖</div>
          <p className="font-bold text-sm">Click "Get Challenges" to start!</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [progresses, setProgresses] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: 'Farmer' });
  const [impact, setImpact] = useState({ totalWaterSaved: 0, totalChemicalFreeDays: 0, totalCO2Reduced: 0 });

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) setUserInfo(JSON.parse(info));

    const saved = JSON.parse(localStorage.getItem('farmProgresses') || '[]');
    setProgresses(saved);

    // Fetch impact
    fetch('http://localhost:5000/api/impact').then(r => r.ok ? r.json() : null).then(d => { if (d) setImpact(d); }).catch(() => {});
  }, []);

  const activeProgress = progresses[activeTab];

  return (
    <div className="min-h-screen p-4 pb-24 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center pt-1 mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a6b3f]">FarmQuest</h1>
          <p className="text-xs text-gray-500 font-medium">Hello, {userInfo.name}! 🌅</p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-1.5 bg-[#f5c842] text-[#1a6b3f] font-bold px-3 py-2 rounded-xl text-sm shadow-sm active:scale-95 transition-transform"
        >
          <Plus size={16} /> Create Progress
        </button>
      </div>

      <SearchBar />

      {/* Progress Tabs */}
      {progresses.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {progresses.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shrink-0 border ${activeTab === i ? 'bg-[#2d9e5f] text-white border-transparent shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              🌱 {p.cropType || p.label}
            </button>
          ))}
        </div>
      )}

      {/* Weather Widget */}
      {activeProgress && <WeatherWidget district={activeProgress.district || 'Coimbatore'} />}

      {/* Challenge Panel for active tab */}
      {activeProgress ? (
        <ChallengePanel key={activeProgress.id} progress={activeProgress} />
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl">🌾</div>
          <h2 className="text-xl font-extrabold text-gray-700">Welcome to FarmQuest!</h2>
          <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Tap "Create Progress" to add your farm details and get started with AI-powered challenges.</p>
        </div>
      )}

      {/* Impact Stats */}
      <div className="pt-2">
        <h3 className="font-extrabold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
          Community Impact <Leaf className="text-[#2d9e5f] w-4 h-4" />
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3 text-center"><Droplets className="text-blue-500 w-5 h-5 mx-auto mb-1" /><span className="text-base font-black block">{impact.totalWaterSaved > 1000 ? (impact.totalWaterSaved / 1000).toFixed(1) + 'k' : impact.totalWaterSaved}</span><span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Liters</span></div>
          <div className="card p-3 text-center"><span className="text-xl block mb-1">🌿</span><span className="text-base font-black block">{impact.totalChemicalFreeDays}</span><span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Chem-Free</span></div>
          <div className="card p-3 text-center"><Wind className="text-teal-500 w-5 h-5 mx-auto mb-1" /><span className="text-base font-black block">{impact.totalCO2Reduced}</span><span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">kg CO2</span></div>
        </div>
      </div>
    </div>
  );
}
