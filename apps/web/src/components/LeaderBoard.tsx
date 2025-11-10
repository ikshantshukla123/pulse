"use client";

import type { Activity } from "@/hooks/useLiveActivity";
import { motion, AnimatePresence } from "framer-motion";

export default function Leaderboard({ items }: { items: Activity[] }) {
  const totals = new Map<string, bigint>();

  for (const it of items) {
    totals.set(it.user, (totals.get(it.user) ?? 0n) + it.activityValue);
  }

  const top = [...totals.entries()]
    .sort((a, b) => (b[1] > a[1] ? 1 : -1))
    .slice(0, 8);

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-400 to-amber-500 shadow-yellow-500/30";
      case 1: return "from-slate-300 to-slate-400 shadow-slate-500/20";
      case 2: return "from-amber-600 to-orange-500 shadow-amber-500/20";
      default: return "from-blue-400 to-indigo-500 shadow-blue-500/10";
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return "👑";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `#${index + 1}`;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg">🏆</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Top Builders
            </h2>
            <p className="text-slate-400 text-sm">By activity value</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-300">Live</span>
        </div>
      </div>

      {top.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-50">🌌</div>
          <p className="text-slate-400">No builders yet</p>
          <p className="text-slate-500 text-sm mt-2">Leaderboard will populate with activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {top.map(([addr, total], index) => (
              <motion.div
                key={addr}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02]">
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(index)} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {getRankIcon(index)}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-mono">
                          {formatAddress(addr).slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">
                            {formatAddress(addr)}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {index === 0 ? 'Champion' : index === 1 ? 'Elite' : index === 2 ? 'Veteran' : 'Builder'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Total Value */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-300">
                          {total.toString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between text-sm text-slate-400">
          <span>{top.length} builders ranked</span>
          <span>Total: {Array.from(totals.values()).reduce((a, b) => a + b, 0n).toString()} pts</span>
        </div>
      </div>
    </div>
  );
}