// apps/web/src/components/WarHUD.tsx
'use client';

import { useState, useEffect } from 'react';

interface WarStats {
  tpm: number;
  leadingRealm: number;
  totalPlayers: number;
  activeBattles: number;
}

export default function WarHUD({ tpm, items }: { tpm: number; items: any[] }) {
  const [stats, setStats] = useState<WarStats>({
    tpm,
    leadingRealm: 1,
    totalPlayers: 0,
    activeBattles: 0
  });

  useEffect(() => {
    const uniqueUsers = new Set(items.map(item => item.user)).size;
    const realmPower = Object.entries(
      items.reduce((acc: any, item) => {
        const realm = Number(item.realm);
        acc[realm] = (acc[realm] || 0) + 1;
        return acc;
      }, {})
    );
    
    const leadingRealm = realmPower.length > 0 
      ? realmPower.reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 1;

    setStats(prev => ({
      ...prev,
      tpm,
      totalPlayers: uniqueUsers,
      leadingRealm: Number(leadingRealm),
      activeBattles: Math.floor(Math.random() * 5) + 1
    }));
  }, [tpm, items]);

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-pink-500/30 bg-black/40 backdrop-blur-sm p-6">
      <h3 className="text-xl font-bold glitch-text mb-4">📡 LIVE WAR INTEL</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 font-mono text-sm">⚡ TPM</span>
            <span className="text-pink-400 font-mono text-xl font-bold">{stats.tpm}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 font-mono text-sm">🔥 LEADING REALM</span>
            <span className="text-cyan-400 font-mono text-xl font-bold">R{stats.leadingRealm}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 font-mono text-sm">👥 PLAYERS</span>
            <span className="text-pink-400 font-mono text-xl font-bold">{stats.totalPlayers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 font-mono text-sm">⚔️ BATTLES</span>
            <span className="text-cyan-400 font-mono text-xl font-bold">{stats.activeBattles}</span>
          </div>
        </div>
      </div>

      {/* Realm Power Rankings */}
      <div className="mt-6">
        <h4 className="text-pink-400 font-bold font-mono mb-3">🏆 REALM POWER RANKINGS</h4>
        <div className="space-y-2">
          {[1,2,3,4,5,6,7,8].slice(0, 4).map((realmId, index) => (
            <div key={realmId} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-cyan-500/20">
              <span className="text-white font-mono">#{index + 1} R{realmId}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-cyan-400 h-2 rounded-full"
                    style={{ width: `${85 - index * 15}%` }}
                  ></div>
                </div>
                <span className="text-cyan-300 text-sm font-mono">
                  {Math.floor(85 - index * 15)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}