import React, { useState, useEffect } from 'react';
import { CloudRain } from 'lucide-react';

export default function WeatherWidget({ district = 'Coimbatore' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/weather/${district}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [district]);

  if (loading) return <div className="card p-4 animate-pulse bg-blue-50/50"><div className="h-16"></div></div>;
  if (!weather) return null;

  return (
    <div className="card p-0 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl drop-shadow-sm">⛅</span>
            <div>
              <p className="text-2xl font-black text-gray-800">{weather.temp}°C</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{district}, IN</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-sm font-bold text-blue-600 mb-0.5">
              <CloudRain size={16} /> {weather.rainChance}%
            </div>
            <div className="text-xs font-bold text-gray-500 tracking-wide">H: {weather.humidity}% | W: {weather.wind}km/h</div>
          </div>
        </div>
      </div>
      <div className="bg-white/60 p-3 border-t border-blue-100 text-sm font-bold flex gap-2 items-center text-gray-700 backdrop-blur-sm">
        <span className="text-lg">💡</span>
        <span>{weather.tip}</span>
      </div>
    </div>
  );
}
