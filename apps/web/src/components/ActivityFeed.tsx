"use client";

import { Activity } from "@/hooks/useLiveActivity";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

interface ActivityFeedProps {
  items: Activity[];
}

type ActivityType = 'ENTER_REALM' | 'ATTACK_REALM' | 'QUEST_COMPLETE' | 'CLAIM_BONUS' | string;

export default function ActivityFeed({ items }: ActivityFeedProps) {
  const [filter, setFilter] = useState<ActivityType | 'ALL'>('ALL');
  
  const filteredItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.timestamp - a.timestamp);
    return filter === 'ALL' ? sorted.slice(0, 12) : sorted.filter(item => item.activityType === filter).slice(0, 12);
  }, [items, filter]);

  const activityStats = useMemo(() => {
    const stats = {
      total: items.length,
      byType: {} as Record<string, number>,
      recent: items.filter(item => {
        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
        return item.timestamp >= fiveMinutesAgo;
      }).length
    };
    
    items.forEach(item => {
      stats.byType[item.activityType] = (stats.byType[item.activityType] || 0) + 1;
    });
    
    return stats;
  }, [items]);

  const getActivityConfig = (type: string) => {
    const configs = {
      'ENTER_REALM': { icon: '🏴', color: 'from-blue-500 to-cyan-500', label: 'Enter Realm', description: 'Joined the battle' },
      'ATTACK_REALM': { icon: '⚡', color: 'from-red-500 to-pink-600', label: 'Attack', description: 'Launched an assault' },
      'QUEST_COMPLETE': { icon: '🎯', color: 'from-green-500 to-emerald-600', label: 'Quest Complete', description: 'Completed mission' },
      'CLAIM_BONUS': { icon: '💰', color: 'from-yellow-500 to-amber-600', label: 'Bonus Claimed', description: 'Collected rewards' }
    };
    
    return configs[type as keyof typeof configs] || { 
      icon: '⚡', 
      color: 'from-purple-500 to-indigo-600', 
      label: type.toLowerCase().replace('_', ' '),
      description: 'Performed action'
    };
  };

  const formatTime = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const formatAddress = (address: string) => {
    if (!address || address === '0x') return '0x0000...0000';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getValueColor = (value: bigint) => {
    const num = Number(value);
    if (num > 200) return 'text-yellow-400';
    if (num > 100) return 'text-emerald-400';
    if (num > 50) return 'text-cyan-400';
    return 'text-slate-400';
  };

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-cyan-500/30 bg-black/40 backdrop-blur-sm p-6 shadow-2xl shadow-cyan-500/20">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-xl">📡</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold glitch-text">
              NETWORK PULSES
            </h2>
            <p className="text-cyan-300 text-sm font-mono">Live Activity Stream</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 cyber-tokyo-panel rounded-full px-4 py-2 border border-cyan-500/30">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-300 text-sm font-mono">LIVE</span>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="cyber-tokyo-panel rounded-xl p-3 text-center border border-cyan-500/20">
          <div className="text-2xl font-bold text-cyan-400 font-mono">{activityStats.total}</div>
          <div className="text-cyan-300 text-xs font-mono mt-1">TOTAL</div>
        </div>
        <div className="cyber-tokyo-panel rounded-xl p-3 text-center border border-green-500/20">
          <div className="text-2xl font-bold text-green-400 font-mono">{activityStats.recent}</div>
          <div className="text-green-300 text-xs font-mono mt-1">5MIN</div>
        </div>
        <div className="cyber-tokyo-panel rounded-xl p-3 text-center border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-400 font-mono">
            {Object.keys(activityStats.byType).length}
          </div>
          <div className="text-purple-300 text-xs font-mono mt-1">TYPES</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {['ALL', 'ENTER_REALM', 'ATTACK_REALM', 'QUEST_COMPLETE'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as ActivityType | 'ALL')}
            className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              filter === type
                ? 'bg-cyan-500/30 border border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800/30 border border-slate-700/50 text-slate-400 hover:border-cyan-500/30'
            }`}
          >
            {type === 'ALL' ? '🌐 ALL' : getActivityConfig(type).icon + ' ' + type.split('_').join(' ')}
          </button>
        ))}
      </div>

      {/* Scrollable Activity Feed */}
      <div className="max-h-96 overflow-y-auto cyber-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 cyber-tokyo-panel rounded-2xl border border-cyan-500/20">
            <div className="text-4xl mb-4 opacity-50">🌠</div>
            <p className="text-cyan-300 font-mono">Network Quiet</p>
            <p className="text-slate-400 text-sm mt-2 font-mono">Awaiting blockchain pulses...</p>
          </div>
        ) : (
          <div className="space-y-3 pr-2">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const config = getActivityConfig(item.activityType);
                return (
                  <motion.div
                    key={`${item.sourceId}-${item.timestamp}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      layout: { duration: 0.2 }
                    }}
                    className="group"
                  >
                    <div className="flex items-center space-x-4 p-4 cyber-tokyo-panel rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
                      
                      {/* Activity Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-14 h-14 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                          {config.icon}
                        </div>
                      </div>
                      
                      {/* Activity Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="font-bold text-white font-mono text-sm uppercase tracking-wide">
                                {config.label}
                              </span>
                              <span className="text-xs px-2 py-1 cyber-tokyo-panel rounded-full text-cyan-300 border border-cyan-500/30 font-mono">
                                R{item.realm}
                                {item.targetRealm && item.targetRealm > 0 && ` → R${item.targetRealm}`}
                              </span>
                            </div>
                            
                            <p className="text-slate-300 text-sm font-mono">
                              {formatAddress(item.user)} {config.description}
                            </p>
                            
                            <div className="flex items-center space-x-3 text-xs">
                              <span className={`px-2 py-1 rounded font-mono ${getValueColor(item.activityValue)} bg-black/30 border border-slate-700/50`}>
                                ⚡ {item.activityValue.toString()} POWER
                              </span>
                              <span className="text-slate-500 font-mono">
                                TX: {item.sourceId?.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                          
                          {/* Timestamp */}
                          <div className="text-right flex-shrink-0 pl-4">
                            <div className="text-sm text-cyan-300 font-mono font-medium">
                              {formatTime(item.timestamp)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 font-mono">
                              {new Date(item.timestamp * 1000).toLocaleTimeString('en-US', { 
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      {filteredItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-cyan-500/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-cyan-300 font-mono">
              Showing {filteredItems.length} of {items.length}
            </span>
            <div className="flex space-x-4 text-slate-400 font-mono">
              <span>📊 {activityStats.total} total</span>
              <span>⚡ {activityStats.recent} recent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}