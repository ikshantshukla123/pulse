"use client";

import type { Activity } from "@/hooks/useLiveActivity";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

export default function Leaderboard({ items }: { items: Activity[] }) {
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'DAY' | 'HOUR'>('ALL');
  
  const { totals, rankedPlayers, stats } = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const filteredItems = items.filter(item => {
      if (timeFilter === 'DAY') return now - item.timestamp < 86400;
      if (timeFilter === 'HOUR') return now - item.timestamp < 3600;
      return true;
    });

    const totals = new Map<string, bigint>();
    const activityCounts = new Map<string, number>();

    for (const it of filteredItems) {
      totals.set(it.user, (totals.get(it.user) ?? 0n) + it.activityValue);
      activityCounts.set(it.user, (activityCounts.get(it.user) ?? 0) + 1);
    }

    const top = [...totals.entries()]
      .sort((a, b) => (b[1] > a[1] ? 1 : -1))
      .slice(0, 10);

    return {
      totals,
      rankedPlayers: top.map(([addr, total], index) => ({
        address: addr,
        total,
        rank: index + 1,
        activities: activityCounts.get(addr) || 0,
        avgScore: Number(total) / (activityCounts.get(addr) || 1)
      })),
      stats: {
        totalPlayers: new Set(filteredItems.map(item => item.user)).size,
        totalPoints: Array.from(totals.values()).reduce((a, b) => a + b, 0n),
        totalActivities: filteredItems.length
      }
    };
  }, [items, timeFilter]);

  const getRankConfig = (index: number) => {
    const configs = {
      0: { 
        color: "from-yellow-400 to-amber-500 shadow-yellow-500/40",
        glow: "shadow-yellow-500/30",
        title: "CHAMPION",
        badge: "👑"
      },
      1: { 
        color: "from-slate-300 to-slate-400 shadow-slate-500/30", 
        glow: "shadow-slate-400/20",
        title: "ELITE",
        badge: "🥈"
      },
      2: { 
        color: "from-amber-600 to-orange-500 shadow-amber-500/30", 
        glow: "shadow-amber-500/20",
        title: "VETERAN",
        badge: "🥉"
      }
    };
    
    return configs[index as keyof typeof configs] || { 
      color: "from-blue-500 to-indigo-600 shadow-blue-500/20",
      glow: "shadow-blue-500/10",
      title: index < 5 ? "PRO" : "BUILDER",
      badge: `#${index + 1}`
    };
  };

  const formatAddress = (address: string) => {
    if (!address || address === '0x') return '0x0000...0000';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: bigint) => {
    const value = Number(num);
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  };

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-amber-500/30 bg-black/40 backdrop-blur-sm p-6 shadow-2xl shadow-amber-500/20">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-xl">🏆</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold glitch-text">
              POWER LEADERBOARD
            </h2>
            <p className="text-amber-300 text-sm font-mono">Real-time Rankings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 cyber-tokyo-panel rounded-full px-4 py-2 border border-amber-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-amber-300 text-sm font-mono">LIVE</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="cyber-tokyo-panel rounded-xl p-3 text-center border border-amber-500/20">
          <div className="text-xl font-bold text-amber-400 font-mono">{stats.totalPlayers}</div>
          <div className="text-amber-300 text-xs font-mono mt-1">PLAYERS</div>
        </div>
        <div className="cyber-tokyo-panel rounded-xl p-3 text-center border border-green-500/20">
          <div className="text-xl font-bold text-green-400 font-mono">{formatNumber(stats.totalPoints)}</div>
          <div className="text-green-300 text-xs font-mono mt-1">POINTS</div>
        </div>
        <div className="cyber-tokyo-panel rounded-xl p-3 text-center border border-cyan-500/20">
          <div className="text-xl font-bold text-cyan-400 font-mono">{stats.totalActivities}</div>
          <div className="text-cyan-300 text-xs font-mono mt-1">ACTIONS</div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex space-x-2 mb-4">
        {['ALL', 'DAY', 'HOUR'].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter as 'ALL' | 'DAY' | 'HOUR')}
            className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex-1 ${
              timeFilter === filter
                ? 'bg-amber-500/30 border border-amber-500/50 text-amber-300'
                : 'bg-slate-800/30 border border-slate-700/50 text-slate-400 hover:border-amber-500/30'
            }`}
          >
            {filter === 'ALL' ? '🌐 ALL TIME' : filter === 'DAY' ? '📅 24H' : '⏰ 1H'}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      {rankedPlayers.length === 0 ? (
        <div className="text-center py-12 cyber-tokyo-panel rounded-2xl border border-amber-500/20">
          <div className="text-4xl mb-4 opacity-50">🌌</div>
          <p className="text-amber-300 font-mono">No Builders Yet</p>
          <p className="text-slate-400 text-sm mt-2 font-mono">Complete actions to appear on leaderboard</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {rankedPlayers.map((player, index) => {
              const config = getRankConfig(index);
              return (
                <motion.div
                  key={player.address}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    layout: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className={`flex items-center space-x-4 p-4 cyber-tokyo-panel rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm ${config.glow}`}>
                    
                    {/* Rank Badge */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {config.badge}
                    </div>
                    
                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-mono font-bold shadow-lg">
                            {player.address.slice(2, 4).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm font-mono truncate">
                              {formatAddress(player.address)}
                            </p>
                            <p className="text-amber-300 text-xs font-mono uppercase tracking-wide">
                              {config.title} • {player.activities} ACTS
                            </p>
                          </div>
                        </div>
                        
                        {/* Points Display */}
                        <div className="text-right pl-4">
                          <div className="text-xl font-bold text-emerald-400 font-mono">
                            {formatNumber(player.total)}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-1">
                            ⚡ {Math.round(player.avgScore)} AVG
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {index === 0 && rankedPlayers.length > 1 && (
                        <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${(Number(player.total) / Math.max(1, Number(rankedPlayers[1]?.total || 1))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Enhanced Footer */}
      {rankedPlayers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-amber-500/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-amber-300 font-mono">
              Top {rankedPlayers.length} of {stats.totalPlayers} players
            </span>
            <div className="text-slate-400 font-mono text-xs">
              Updated {new Date().toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}