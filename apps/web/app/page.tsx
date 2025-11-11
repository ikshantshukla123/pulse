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
  const [realmPower, setRealmPower] = useState<Record<number, number>>({
    1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100, 8: 100
  });

  // Activate bot simulator for demo
  useBotSimulator(true);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const totalActivities = items.length;
  const uniqueUsers = new Set(items.map(item => item.user)).size;

  const handleAttackAnimation = (fromRealm: number, toRealm: number) => {
    setRealmPower(prev => ({
      ...prev,
      [fromRealm]: prev[fromRealm] + 75,
      [toRealm]: Math.max(10, prev[toRealm] - 50)
    }));
  };

  const updateRealmPower = (realm: number, powerChange: number) => {
    setRealmPower(prev => ({
      ...prev,
      [realm]: Math.max(10, prev[realm] + powerChange)
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-purple-900/20 to-[#1a1a2e] text-white overflow-y-auto">
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
      
      {/* Vertical Stack Layout */}
      <div className="relative w-full px-6 py-4 space-y-6 z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/30 animate-pulse">
                <span className="text-xl">⚔️</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a14] shadow-lg animate-ping"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a14]"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold glitch-text">
                SOMNIA REALM WARS
              </h1>
              <p className="text-cyan-300 text-sm mt-1 flex items-center font-mono">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                REAL-TIME ON-CHAIN TERRITORY CONTROL
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3">
            <div className="text-center cyber-tokyo-panel rounded-lg px-4 py-2 min-w-[100px]">
              <div className="text-cyan-300 text-xs font-mono mb-1">POWER/MIN</div>
              <div className="text-xl font-bold text-pink-400 font-mono">{tpm}</div>
            </div>
            
            <div className="text-center cyber-tokyo-panel rounded-lg px-4 py-2 min-w-[100px]">
              <div className="text-cyan-300 text-xs font-mono mb-1">ACTIVITIES</div>
              <div className="text-xl font-bold text-white font-mono">{totalActivities}</div>
            </div>
            
            <div className="text-center cyber-tokyo-panel rounded-lg px-4 py-2 min-w-[100px]">
              <div className="text-cyan-300 text-xs font-mono mb-1">USERS</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">{uniqueUsers}</div>
            </div>
          </div>
        </header>

        {/* War Map - Full Width */}
        <div className="w-full">
          <CyberWarMap byRealm={byRealm} realmPower={realmPower} />
        </div>

        {/* War HUD & Controls - Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <WarHUD tpm={tpm} items={items} />
          </div>
          <div>
            <WarControls 
              onAttackAnimation={handleAttackAnimation}
              onPowerUpdate={updateRealmPower}
            />
          </div>
        </div>

        {/* Leaderboard & Activity Feed - Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Leaderboard items={items} />
          </div>
          <div>
            <ActivityFeed items={items} />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-cyan-500/30">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>LIVE NETWORK</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>{Object.keys(byRealm).length} REALMS ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>POWERED BY SOMNIA SDS</span>
              </div>
              <div className="text-slate-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}