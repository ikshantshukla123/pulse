"use client";

import { Activity } from "@/hooks/useLiveActivity";

interface WarHUDProps {
  tpm: number;
  items: Activity[];
}

export default function WarHUD({ tpm, items }: WarHUDProps) {
  // Calculate live stats from items
  const totalActivities = items.length;
  const uniqueUsers = new Set(items.map(item => item.user)).size;
  
  // Calculate realm dominance (which realm has most activity)
  const realmActivity = items.reduce((acc, item) => {
    acc[item.realm] = (acc[item.realm] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const dominantRealm = Object.entries(realmActivity).sort((a, b) => b[1] - a[1])[0];
  const dominantRealmNumber = dominantRealm ? parseInt(dominantRealm[0]) : 1;
  const dominantRealmActivity = dominantRealm ? dominantRealm[1] : 0;

  // Calculate recent activity (last 5 minutes)
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  const recentActivities = items.filter(item => item.timestamp >= fiveMinutesAgo).length;

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-cyan-500/30 bg-black/40 backdrop-blur-sm p-6">
      <h3 className="text-xl font-bold glitch-text mb-4">📡 LIVE WAR INTEL</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center cyber-tokyo-panel rounded-xl p-4 border border-cyan-500/30">
          <div className="text-2xl font-bold text-cyan-400 font-mono">{tpm}</div>
          <div className="text-cyan-300 text-xs font-mono mt-1">ACTIONS/MIN</div>
        </div>
        
        <div className="text-center cyber-tokyo-panel rounded-xl p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-green-400 font-mono">{totalActivities}</div>
          <div className="text-green-300 text-xs font-mono mt-1">TOTAL ACTIONS</div>
        </div>
        
        <div className="text-center cyber-tokyo-panel rounded-xl p-4 border border-pink-500/30">
          <div className="text-2xl font-bold text-pink-400 font-mono">{uniqueUsers}</div>
          <div className="text-pink-300 text-xs font-mono mt-1">UNIQUE USERS</div>
        </div>
        
        <div className="text-center cyber-tokyo-panel rounded-xl p-4 border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400 font-mono">{recentActivities}</div>
          <div className="text-purple-300 text-xs font-mono mt-1">LAST 5 MIN</div>
        </div>
      </div>

      {/* Realm Dominance */}
      <div className="cyber-tokyo-panel rounded-xl p-4 border border-yellow-500/30 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-yellow-300 text-sm font-mono">🏆 DOMINANT REALM</div>
          <div className="text-white font-bold text-lg">REALM {dominantRealmNumber}</div>
        </div>
        <div className="mt-2 w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(100, (dominantRealmActivity / Math.max(1, totalActivities)) * 100)}%` 
            }}
          ></div>
        </div>
        <div className="text-slate-400 text-xs mt-1 text-right">
          {dominantRealmActivity} actions ({Math.round((dominantRealmActivity / Math.max(1, totalActivities)) * 100)}%)
        </div>
      </div>

      {/* Recent Activity Types */}
      <div className="cyber-tokyo-panel rounded-xl p-4 border border-blue-500/30">
        <div className="text-blue-300 text-sm font-mono mb-3">🎯 RECENT ACTIVITY TYPES</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {Object.entries(
            items.slice(0, 20).reduce((acc, item) => {
              acc[item.activityType] = (acc[item.activityType] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center p-2 bg-slate-800/30 rounded">
              <span className="text-slate-300 capitalize">{type.toLowerCase()}</span>
              <span className="text-cyan-400 font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}