// apps/web/src/components/WarControls.tsx
'use client';

import { useState } from 'react';
import { publishGameAction } from '@/lib/gameActions';

export default function WarControls() {
  const [selectedRealm, setSelectedRealm] = useState(1);
  const [targetRealm, setTargetRealm] = useState(2);

  const handleEnterRealm = () => {
    publishGameAction({
      type: 'ENTER_REALM',
      realm: selectedRealm,
      timestamp: Date.now(),
      playerId: '0xPlayer1'
    });
  };

  const handleAttack = () => {
    publishGameAction({
      type: 'ATTACK_REALM',
      realm: selectedRealm,
      targetRealm: targetRealm,
      timestamp: Date.now(),
      playerId: '0xPlayer1'
    });
  };

  const handleQuestComplete = () => {
    publishGameAction({
      type: 'QUEST_COMPLETE',
      realm: selectedRealm,
      activityValue: Math.floor(Math.random() * 100) + 50,
      timestamp: Date.now(),
      playerId: '0xPlayer1'
    });
  };

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-cyan-500/30 bg-black/40 backdrop-blur-sm p-6">
      <h3 className="text-xl font-bold glitch-text mb-4">⚔️ WAR ROOM CONTROLS</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-cyan-300 text-sm font-mono block mb-2">YOUR REALM</label>
            <select 
              value={selectedRealm}
              onChange={(e) => setSelectedRealm(Number(e.target.value))}
              className="w-full bg-black border border-cyan-500 text-white p-3 rounded-lg font-mono"
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>REALM {num}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-pink-400 text-sm font-mono block mb-2">TARGET REALM</label>
            <select 
              value={targetRealm}
              onChange={(e) => setTargetRealm(Number(e.target.value))}
              className="w-full bg-black border border-pink-500 text-white p-3 rounded-lg font-mono"
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>REALM {num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleEnterRealm}
            className="cyber-button-teal py-3 px-4 rounded-lg font-bold font-mono text-sm"
          >
            🏴 ENTER REALM
          </button>
          
          <button 
            onClick={handleAttack}
            className="cyber-button-pink py-3 px-4 rounded-lg font-bold font-mono text-sm"
          >
            ⚡ ATTACK REALM
          </button>
          
          <button 
            onClick={handleQuestComplete}
            className="cyber-button-purple py-3 px-4 rounded-lg font-bold font-mono text-sm col-span-2"
          >
            🎯 COMPLETE QUEST
          </button>
        </div>
      </div>
    </div>
  );
}