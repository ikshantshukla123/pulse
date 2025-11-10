// apps/web/app/page.tsx
"use client";

import CyberWarMap from "@/components/CyberWarMap";
import ActivityFeed from "@/components/ActivityFeed";
import Leaderboard from "@/components/LeaderBoard";
import WarControls from "@/components/WarControls";
import WarHUD from "@/components/WarHud";
import { useLiveActivity } from "@/hooks/useLiveActivity";
import { useBotSimulator } from "@/hooks/useBotSimulater";
import { useEffect, useState } from "react";

export default function Page() {
  const { items, byRealm, tpm } = useLiveActivity();
  const [isClient, setIsClient] = useState(false);

  // Activate bot simulator for demo
  useBotSimulator(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalActivities = items.length;
  const uniqueUsers = new Set(items.map(item => item.user)).size;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-purple-900/20 to-[#1a1a2e] text-white overflow-hidden">
      {/* Cyber Tokyo Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0a0a14] to-[#1a1a2e]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,0,255,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(0,255,255,0.08)_0%,_transparent_50%)]"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[linear-gradient(90deg,_transparent_99%,_#00ffff_100%)] bg-[length:20px_20px]"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8 z-10">

        {/* CYBER TOKYO HEADER */}
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/30 animate-pulse">
                <span className="text-3xl">⚔️</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-5 h-5 bg-green-400 rounded-full border-2 border-[#0a0a14] shadow-lg animate-ping"></div>
                <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full border-2 border-[#0a0a14]"></div>
              </div>
            </div>
            <div>
              <h1 className="text-6xl font-bold glitch-text">
                SOMNIA REALM WARS
              </h1>
              <p className="text-cyan-300 text-lg mt-2 flex items-center font-mono">
                <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                REAL-TIME ON-CHAIN TERRITORY CONTROL
              </p>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center cyber-tokyo-panel rounded-2xl px-6 py-4 group">
              <div className="text-cyan-300 text-sm font-mono mb-1">POWER/MIN</div>
              <div className="text-3xl font-bold text-pink-400 font-mono group-hover:scale-110 transition-transform duration-300">
                {tpm}
              </div>
            </div>
            
            <div className="text-center cyber-tokyo-panel rounded-2xl px-6 py-4 group">
              <div className="text-cyan-300 text-sm font-mono mb-1">ACTIVITIES</div>
              <div className="text-3xl font-bold text-white font-mono group-hover:scale-110 transition-transform duration-300">
                {totalActivities}
              </div>
            </div>
          </div>
        </header>

        {/* WAR DASHBOARD GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* War Map - Left */}
          <div className="xl:col-span-7">
            <CyberWarMap byRealm={byRealm} />
          </div>
          
          {/* Controls & HUD - Right */}
          <div className="xl:col-span-5 space-y-6">
            <WarHUD tpm={tpm} items={items} />
            <WarControls />
          </div>
        </div>

        {/* Activity & Leaderboard Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="xl:col-span-1">
            <Leaderboard items={items} />
          </div>
          <div className="xl:col-span-1">
            <ActivityFeed items={items} />
          </div>
        </div>

        {/* Cyber Footer */}
        <footer className="text-center pt-8 border-t border-cyan-500/30">
          <div className="flex items-center justify-center space-x-6 text-sm text-cyan-300 font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>LIVE NETWORK</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>{Object.keys(byRealm).length} REALMS ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>POWERED BY SOMNIA SDS</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}