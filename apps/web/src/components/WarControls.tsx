// apps/web/src/components/WarControls.tsx - UPDATED WITH NETWORK CHECK
'use client';

import { useState } from 'react';
import { publishGameAction } from '@/lib/gameActions';
import { useWallet } from '@/contexts/WalletContext';
import WalletConnect from './WalletConnect';


interface WarControlsProps {
  onAttackAnimation?: (fromRealm: number, toRealm: number) => void;
  onPowerUpdate?: (realm: number, powerChange: number) => void; // ADD THIS
}


  export default function WarControls({ onAttackAnimation, onPowerUpdate }: WarControlsProps) {
  const [selectedRealm, setSelectedRealm] = useState(1);
  const [targetRealm, setTargetRealm] = useState(2);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<{type: string, txHash?: string} | null>(null);
  
  const { account, walletClient, connectWallet, switchToSomniaNetwork, isCorrectNetwork } = useWallet();

  const handleGameAction = async (type: 'ENTER_REALM' | 'QUEST_COMPLETE' | 'ATTACK_REALM', customTargetRealm?: number) => {
    if (!account || !walletClient) {
      alert('Please connect your wallet first!');
      return;
    }

    // Check if we're on the correct network
    if (!isCorrectNetwork) {
      const switched = await switchToSomniaNetwork();
      if (!switched) {
        alert('Please switch to Somnia Dream network to play!');
        return;
      }
    }
  if (type === 'ATTACK_REALM' && onAttackAnimation && onPowerUpdate) {
      const actualTargetRealm = customTargetRealm || targetRealm;
      onAttackAnimation(selectedRealm, actualTargetRealm);
      onPowerUpdate(selectedRealm, 75);  // Attacker gains
      onPowerUpdate(actualTargetRealm, -50); // Defender loses
    } 
    else if (type === 'ENTER_REALM' && onPowerUpdate) {
      onPowerUpdate(selectedRealm, 25); // Entering realm gives power
    }
    else if (type === 'QUEST_COMPLETE' && onPowerUpdate) {
      onPowerUpdate(selectedRealm, 50); // Quest gives power
    }

    setIsLoading(type);
    try {
      const result = await publishGameAction({
        type,
        realm: selectedRealm,
        targetRealm: customTargetRealm || (type === 'ATTACK_REALM' ? targetRealm : undefined),
        activityValue: type === 'QUEST_COMPLETE' ? Math.floor(Math.random() * 100) + 50 : 100,
        timestamp: Date.now(),
        playerId: account
      }, walletClient);

      setLastAction({ type, txHash: result.txHash });
      setTimeout(() => setLastAction(null), 5000);
    } catch (error: any) {
      alert(`❌ Failed to publish ${type.toLowerCase()} action: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };




  const getActionCost = (type: string) => {
    const costs = {
      'ENTER_REALM': '~0.001 STT',
      'ATTACK_REALM': '~0.002 STT', 
      'QUEST_COMPLETE': '~0.0015 STT'
    };
    return costs[type as keyof typeof costs] || '~0.001 STT';
  };

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-cyan-500/30 bg-black/40 backdrop-blur-sm p-6">
      <h3 className="text-xl font-bold glitch-text mb-4">⚔️ WAR ROOM CONTROLS</h3>
      
      {/* Wallet Connection */}
      {!account && (
        <div className="mb-6">
          <WalletConnect />
        </div>
      )}

      {/* Connected Wallet Info */}
      {account && (
        <div className={`mb-4 p-3 rounded-lg border ${
          isCorrectNetwork 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-yellow-500/20 border-yellow-500/30'
        }`}>
          <div className={`text-sm font-mono text-center ${
            isCorrectNetwork ? 'text-green-300' : 'text-yellow-300'
          }`}>
            👤 {account.slice(0, 6)}...{account.slice(-4)} • {
              isCorrectNetwork 
                ? 'Ready for Battle!' 
                : 'Wrong Network!'
            }
            {!isCorrectNetwork && (
              <button 
                onClick={switchToSomniaNetwork}
                className="ml-2 cyber-button-teal text-xs py-1 px-2"
              >
                Switch to Somnia
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {lastAction && (
        <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <div className="text-blue-300 text-sm font-mono text-center">
            ✅ {lastAction.type} Successful!
            {lastAction.txHash && (
              <div className="text-xs opacity-75 mt-1">
                TX: {lastAction.txHash.slice(0, 10)}...{lastAction.txHash.slice(-8)}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-cyan-300 text-sm font-mono block mb-2">YOUR REALM</label>
            <select 
              value={selectedRealm}
              onChange={(e) => setSelectedRealm(Number(e.target.value))}
              className="w-full bg-black border border-cyan-500 text-white p-3 rounded-lg font-mono"
              disabled={!!isLoading}
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
              disabled={!!isLoading}
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>REALM {num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Game Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => handleGameAction('ENTER_REALM')}
            disabled={!!isLoading || !account || !isCorrectNetwork}
            className="w-full cyber-button-teal py-3 px-4 rounded-lg font-bold font-mono text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading === 'ENTER_REALM' ? (
              <>⏳ Publishing...</>
            ) : (
              <>🏴 ENTER REALM • {getActionCost('ENTER_REALM')}</>
            )}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleGameAction('ATTACK_REALM')}
              disabled={!!isLoading || !account || !isCorrectNetwork}
              className="cyber-button-pink py-3 px-4 rounded-lg font-bold font-mono text-sm disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading === 'ATTACK_REALM' ? (
                <>⏳ Attacking...</>
              ) : (
                <>⚡ ATTACK • {getActionCost('ATTACK_REALM')}</>
              )}
            </button>
            
            <button 
              onClick={() => handleGameAction('QUEST_COMPLETE')}
              disabled={!!isLoading || !account || !isCorrectNetwork}
              className="cyber-button-purple py-3 px-4 rounded-lg font-bold font-mono text-sm disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading === 'QUEST_COMPLETE' ? (
                <>⏳ Questing...</>
              ) : (
                <>🎯 QUEST • {getActionCost('QUEST_COMPLETE')}</>
              )}
            </button>
          </div>
        </div>

        {/* Network Instructions */}
        {account && !isCorrectNetwork && (
          <div className="text-center p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <div className="text-yellow-300 text-sm font-mono">
              🔄 Please switch to Somnia Dream Network
            </div>
            <button 
              onClick={switchToSomniaNetwork}
              className="cyber-button-teal text-xs py-2 px-3 mt-2"
            >
              Switch Network Automatically
            </button>
          </div>
        )}

        {/* Game Instructions */}
        <div className="text-xs text-slate-400 space-y-1">
          <div>🎮 <strong>How to Play:</strong></div>
          <div>• Connect wallet & switch to <strong>Somnia Dream</strong> network</div>
          <div>• <strong>Enter Realm:</strong> Join a realm to start earning power</div>
          <div>• <strong>Attack:</strong> Steal power from other realms</div>
          <div>• <strong>Quest:</strong> Complete tasks to earn bonus power</div>
        </div>
      </div>
    </div>
  );

  }