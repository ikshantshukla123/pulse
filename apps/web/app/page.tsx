"use client";

import RealmHeatmap from "@/components/RealmHeatmap";
import ActivityFeed from "@/components/ActivityFeed";
import Leaderboard from "@/components/LeaderBoard";
import { useLiveActivity } from "@/hooks/useLiveActivity";
import { useEffect, useState } from "react"; // Add these imports

export default function Page() {
  const { items, byRealm, tpm } = useLiveActivity();
  const [isClient, setIsClient] = useState(false); // Add this state

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts on client
  }, []);


  const totalActivities = items.length;
  const uniqueUsers = new Set(items.map(item => item.user)).size;
  const totalValue = items.reduce((sum, item) => sum + item.activityValue, 0n);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
      <div className="absolute inset-0">
  {isClient && [...Array(20)].map((_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }}
    />
  ))}
</div>
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8 z-10">

        {/* ENHANCED HEADER */}
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-float-slow">
                <span className="text-2xl">🌙</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg animate-ping"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
                Somnia Pulse
              </h1>
              <p className="text-slate-400 text-sm mt-2 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                Real-time cosmic activity dashboard
              </p>
            </div>
          </div>
          
          {/* Enhanced Stats Cards */}
          <div className="flex items-center space-x-4">
            <div className="text-center bg-slate-800/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-slate-700/50 shadow-2xl hover:border-slate-600/60 transition-all duration-300 group">
              <div className="text-slate-400 text-sm font-medium mb-1">Pulses/Min</div>
              <div className="text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                {tpm}
              </div>
              <div className="text-xs text-slate-500 mt-1">live rhythm</div>
            </div>
            
            <div className="text-center bg-slate-800/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-slate-700/50 shadow-2xl hover:border-slate-600/60 transition-all duration-300 group">
              <div className="text-slate-400 text-sm font-medium mb-1">Activities</div>
              <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                {totalActivities}
              </div>
              <div className="text-xs text-slate-500 mt-1">total tracked</div>
            </div>

            <div className="text-center bg-slate-800/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-slate-700/50 shadow-2xl hover:border-slate-600/60 transition-all duration-300 group">
              <div className="text-slate-400 text-sm font-medium mb-1">Explorers</div>
              <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                {uniqueUsers}
              </div>
              <div className="text-xs text-slate-500 mt-1">unique users</div>
            </div>
          </div>
        </header>

        {/* ENHANCED GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Heatmap - Left */}
          <div className="xl:col-span-1">
            <RealmHeatmap byRealm={byRealm} />
          </div>
          
          {/* Leaderboard - Middle */}
          <div className="xl:col-span-1">
            <Leaderboard items={items} />
          </div>
          
          {/* Activity Feed - Right */}
          <div className="xl:col-span-1">
            <ActivityFeed items={items} />
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center pt-8 border-t border-slate-800/50">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{Object.keys(byRealm).length} Realms Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Total Value: {totalValue.toString()} pts</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </main>
  );
}