import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';

export default function SearchBar() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('Listening for commands...');
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        handleCommand(text);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setTranscript('');
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
        setTimeout(() => setTranscript(''), 2000);
      };

      setRecognition(rec);
    }
  }, [navigate]);

  const handleCommand = (text) => {
    const q = text.toLowerCase();
    if (q.includes('home') || q.includes('dashboard')) {
      navigate('/');
    } else if (q.includes('community') || q.includes('feed') || q.includes('post')) {
      navigate('/community');
    } else if (q.includes('market') || q.includes('store')) {
      navigate('/marketplace');
    } else if (q.includes('profile') || q.includes('account')) {
      navigate('/profile');
    } else if (q.includes('add') || q.includes('progress') || q.includes('onboard')) {
      navigate('/onboarding');
    } else if (q.includes('logout') || q.includes('sign out')) {
      localStorage.removeItem('userInfo');
      navigate('/auth');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  if (!recognition) return null;

  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-center gap-3">
        {transcript && (
          <span className="text-xs font-bold text-[#1a6b3f] bg-[#f0f7f2] px-3 py-1.5 rounded-full border border-[#c8e6c9] animate-pulse">
            {transcript} 🎙️
          </span>
        )}
        <button
          onClick={toggleListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 border-2 ${
            isListening 
              ? 'bg-red-500 text-white border-red-300 animate-bounce' 
              : 'bg-white text-[#2d9e5f] border-[#c8e6c9] hover:bg-[#f0f7f2]'
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
}
