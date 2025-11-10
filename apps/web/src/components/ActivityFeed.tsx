"use client";

import { Activity } from "@/hooks/useLiveActivity";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityFeedProps {
  items: Activity[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  const recentItems = items.slice(0, 8);

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'login': return '🔐';
      case 'purchase': return '🛒';
      case 'achievement': return '🏆';
      case 'social': return '💬';
      case 'trade': return '🔄';
      default: return '⚡';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'login': return 'from-blue-500 to-cyan-500';
      case 'purchase': return 'from-green-500 to-emerald-500';
      case 'achievement': return 'from-yellow-500 to-amber-500';
      case 'social': return 'from-purple-500 to-pink-500';
      case 'trade': return 'from-orange-500 to-red-500';
      default: return 'from-indigo-500 to-blue-500';
    }
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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg">📡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Live Activity
            </h2>
            <p className="text-slate-400 text-sm">Real-time network pulses</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-300">Live</span>
        </div>
      </div>

      {recentItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-50">🌠</div>
          <p className="text-slate-400">Network is quiet</p>
          <p className="text-slate-500 text-sm mt-2">Activities will appear here in real-time</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {recentItems.map((item, index) => (
              <motion.div
                key={`${item.sourceId}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02]">
                  
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getActivityColor(item.activityType)} rounded-2xl flex items-center justify-center text-white text-lg shadow-lg`}>
                      {getActivityIcon(item.activityType)}
                    </div>
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-white capitalize">
                            {item.activityType}
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-700/50 rounded-full text-slate-300 border border-slate-600/50">
                            Realm {item.realm}
                          </span>
                        </div>
                        
                        <p className="text-slate-300 text-sm">
                          {item.activityContext}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-slate-400 font-mono bg-slate-800/50 px-2 py-1 rounded">
                            {formatAddress(item.user)}
                          </span>
                          <span className="text-slate-500">
                            Value: <span className="text-emerald-300 font-mono">{item.activityValue.toString()}</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Timestamp */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm text-slate-300 font-medium">
                          {formatTime(item.timestamp)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(item.timestamp * 1000).toLocaleTimeString()}
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

      {/* Footer */}
      {recentItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Showing {recentItems.length} recent</span>
            <span>Total: {items.length} activities</span>
          </div>
        </div>
      )}
    </div>
  );
}