import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([
    {
      id: "demo1",
      name: "Lakshmi M.",
      location: "Erode",
      timeAgo: "2 hours ago",
      tag: "🌿 Soil",
      text: "Just tried using vermicompost on my 2-acre plot instead of urea. The soil texture feels much looser already!",
      likes: 24,
      comments: 5,
      insight: "Excellent choice! Vermicompost improves soil aeration and water retention significantly over synthetic urea."
    }
  ]);
  const [newPostText, setNewPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);
    try {
      const newPost = {
        id: Date.now().toString(),
        name: "You",
        location: "Coimbatore",
        timeAgo: "Just now",
        tag: "💡 Tip",
        text: newPostText,
        likes: 0,
        comments: 0,
        insight: null
      };

      setPosts(prev => [newPost, ...prev]);
      setNewPostText("");

      const res = await fetch('http://localhost:5000/api/generate-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postBody: newPost.text })
      });
      const data = await res.json();
      
      if (data && data.insight) {
        setPosts(prev => prev.map(p => 
          p.id === newPost.id ? { ...p, insight: data.insight } : p
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800">Community</h1>
      </div>

      <div className="card shadow-sm border-[#c8e6c9]">
        <div className="flex gap-3 items-center mb-2">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">👨🏽‍🌾</div>
          <input 
            type="text" 
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            placeholder="Share your farming experience... 🌾" 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus:border-[#2d9e5f] focus:ring-1 focus:ring-[#2d9e5f]" 
          />
          <button onClick={handlePost} disabled={isPosting || !newPostText.trim()} className="bg-[#2d9e5f] text-white p-2 rounded-full disabled:opacity-50 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', '💧 Water', '🌿 Soil', '🐛 Pest', '🌾 Harvest', '💡 Tips'].map(tag => (
          <button key={tag} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-transform active:scale-95 ${tag === 'All' ? 'bg-[#2d9e5f] text-white border-transparent' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="card p-0 shadow-sm border-gray-200">
            <div className="p-4">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">👩🏽‍🌾</div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-none">{post.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wide mt-1">{post.location} • {post.timeAgo}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100 uppercase tracking-wider">{post.tag}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4 font-medium">{post.text}</p>
              
              {post.insight ? (
                <div className="bg-[#f0f7f2] border border-[#c8e6c9] rounded-xl p-3 mb-4 flex gap-3 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2d9e5f]"></div>
                  <div className="text-2xl drop-shadow-sm">🤖</div>
                  <div>
                    <h5 className="text-[10px] font-black text-[#1a6b3f] uppercase tracking-widest mb-0.5">Agri Insight</h5>
                    <p className="text-xs text-[#1a6b3f] font-bold leading-tight align-middle opacity-90">{post.insight}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 items-center text-xs text-gray-400 mb-4 animate-pulse">
                  <span className="text-lg animate-spin">⏳</span> Analyzing post for insights...
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-gray-500">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <Heart size={18} /> <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                  <MessageCircle size={18} /> <span className="text-xs font-bold">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
