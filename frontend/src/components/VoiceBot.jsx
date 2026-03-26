import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceBot() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        handleCommand(text);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setTranscript('Error: ' + event.error);
        setIsListening(false);
        setTimeout(() => setTranscript(''), 2000);
      };

      rec.onend = () => {
        setIsListening(false);
        setTimeout(() => setTranscript(''), 2000);
      };

      setRecognition(rec);
    }
  }, [navigate]);

  const handleCommand = (text) => {
    if (text.includes('home') || text.includes('dashboard')) {
      navigate('/');
    } else if (text.includes('community') || text.includes('feed') || text.includes('post')) {
      navigate('/community');
    } else if (text.includes('market') || text.includes('store')) {
      navigate('/marketplace');
    } else if (text.includes('profile') || text.includes('account')) {
      navigate('/profile');
    } else if (text.includes('add form') || text.includes('add farm') || text.includes('progress') || text.includes('onboard')) {
      navigate('/onboarding');
    } else if (text.includes('logout') || text.includes('sign out')) {
      localStorage.removeItem('userInfo');
      navigate('/auth');
    } else {
      setTranscript(`Unknown: "${text}"`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  // Don't show on splash/auth
  if (['/splash', '/auth'].includes(location.pathname)) return null;

  if (!recognition) {
    return null; // Not supported
  }

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end">
      {transcript && (
        <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-xl font-bold mb-2 shadow-lg backdrop-blur-sm max-w-[200px] text-right animate-pulse">
          {transcript}
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 ${
          isListening 
            ? 'bg-red-500 text-white border-red-300 animate-bounce' 
            : 'bg-[#1a6b3f] text-white border-[#4eca84] hover:bg-[#0d3f24]'
        }`}
      >
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
    </div>
  );
}
