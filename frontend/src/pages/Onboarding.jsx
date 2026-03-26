import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ChevronRight, ArrowLeft, Calendar } from 'lucide-react';

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri',
  'Dindigul','Erode','Kallakurichi','Kancheepuram','Kanyakumari','Karur',
  'Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal',
  'Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet',
  'Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi',
  'Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur',
  'Tiruvannamalai','Tiruvarur','Vellore','Villupuram','Virudhunagar'
];

const SOIL_TYPES = ['Alluvial','Black (Regur)','Clay','Laterite','Loamy','Red','Sandy','Saline'];
const IRRIGATION_TYPES = ['Drip Irrigation','Flood Irrigation','Furrow Irrigation','Rainfed','Sprinkler Irrigation','Sub-surface Drip'];

// Approx harvest duration in days for common crops
const HARVEST_DAYS = {
  'rice': 120, 'paddy': 120, 'wheat': 150, 'sugarcane': 365,
  'tomato': 75, 'brinjal': 80, 'carrot': 90, 'onion': 120,
  'potato': 90, 'maize': 100, 'corn': 100, 'cotton': 180,
  'soybean': 120, 'groundnut': 130, 'sunflower': 90, 'turmeric': 270,
  'ginger': 240, 'banana': 300, 'default': 120
};

function getHarvestDays(cropType) {
  const key = cropType.trim().toLowerCase();
  return HARVEST_DAYS[key] || HARVEST_DAYS['default'];
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: '' });

  const [profile, setProfile] = useState({
    cropType: '',
    soilType: 'Loamy',
    irrigationType: 'Drip Irrigation',
    landArea: '',
    plantingDate: '',
    village: '',
    district: 'Coimbatore',
  });

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) setUserInfo(JSON.parse(info));
  }, []);

  const handleChange = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem('farmProgresses') || '[]');
    const harvestDays = getHarvestDays(profile.cropType);
    const plantDate = profile.plantingDate ? new Date(profile.plantingDate) : new Date();
    const harvestDate = new Date(plantDate);
    harvestDate.setDate(harvestDate.getDate() + harvestDays);

    const newProgress = {
      ...profile,
      id: Date.now().toString(),
      name: userInfo.name || 'Progress ' + (existing.length + 1),
      label: profile.cropType || 'Farm ' + (existing.length + 1),
      harvestDays,
      harvestDate: harvestDate.toISOString(),
      createdAt: new Date().toISOString(),
      challenges: []
    };
    const updated = [...existing, newProgress];
    localStorage.setItem('farmProgresses', JSON.stringify(updated));
    localStorage.setItem('farmProfile', JSON.stringify({ ...profile, name: userInfo.name }));
    navigate('/');
  };

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="flex items-center gap-3 mb-8 pt-4">
        <button
          onClick={() => step === 1 ? navigate(-1) : setStep(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-[#2d9e5f]">Your Farm Details</h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {userInfo.name ? `Hello, ${userInfo.name}! ` : ''}Tell us about your farm.
          </p>
        </div>
        <div className="bg-[#f0f7f2] text-[#2d9e5f] font-bold px-3 py-1.5 rounded-full text-sm border border-[#c8e6c9] shrink-0">
          {step} / 2
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Crop Type</label>
            <input
              type="text"
              value={profile.cropType}
              onChange={(e) => handleChange('cropType', e.target.value)}
              placeholder="e.g. Rice, Sugarcane, Tomato..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] focus:ring-1 focus:ring-[#2d9e5f] font-semibold text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Soil Type</label>
            <select
              value={profile.soilType}
              onChange={(e) => handleChange('soilType', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] font-semibold text-sm outline-none"
            >
              {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Irrigation Type</label>
            <select
              value={profile.irrigationType}
              onChange={(e) => handleChange('irrigationType', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] font-semibold text-sm outline-none"
            >
              {IRRIGATION_TYPES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Land Area (Acres)</label>
            <input
              type="number"
              value={profile.landArea}
              onChange={(e) => handleChange('landArea', e.target.value)}
              placeholder="e.g. 2.5"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] font-semibold text-sm outline-none"
            />
          </div>
          {/* Planting Date */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} /> Planting Date
            </label>
            <input
              type="date"
              value={profile.plantingDate}
              min={today}
              onChange={(e) => handleChange('plantingDate', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] font-semibold text-sm outline-none"
            />
            {profile.cropType && profile.plantingDate && (
              <div className="mt-2 bg-[#f0f7f2] border border-[#c8e6c9] rounded-xl p-3 flex justify-between text-xs">
                <div className="text-center">
                  <p className="text-gray-500 font-medium">Planting</p>
                  <p className="font-bold text-[#1a6b3f]">{new Date(profile.plantingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-center text-xl">🌱→🌾</div>
                <div className="text-center">
                  <p className="text-gray-500 font-medium">Expected Harvest</p>
                  <p className="font-bold text-[#f5c842]">
                    {(() => {
                      const d = new Date(profile.plantingDate);
                      d.setDate(d.getDate() + getHarvestDays(profile.cropType));
                      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    })()}
                  </p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!profile.cropType.trim() || !profile.plantingDate}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Village Name</label>
            <input
              type="text"
              value={profile.village}
              onChange={(e) => handleChange('village', e.target.value)}
              placeholder="Your Village"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] font-semibold text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">District (Tamil Nadu)</label>
            <select
              value={profile.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d9e5f] font-semibold text-sm outline-none"
            >
              {TAMIL_NADU_DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Summary */}
          <div className="bg-[#f0f7f2] border border-[#c8e6c9] rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-black text-[#1a6b3f] uppercase tracking-widest mb-3">Summary</h4>
            {[
              ['Crop', profile.cropType],
              ['Soil', profile.soilType],
              ['Irrigation', profile.irrigationType],
              ['Area', profile.landArea + ' Acres'],
              ['Planting Date', profile.plantingDate ? new Date(profile.plantingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
              ['Est. Harvest', (() => {
                if (!profile.plantingDate) return '—';
                const d = new Date(profile.plantingDate);
                d.setDate(d.getDate() + getHarvestDays(profile.cropType));
                return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
              })()],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="font-bold text-gray-800">{val}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="px-5 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl active:scale-95 transition-transform">Back</button>
            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5" /> Save Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
