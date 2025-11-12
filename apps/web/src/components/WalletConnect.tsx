// apps/web/src/components/WalletConnect.tsx - IMPROVED
'use client';

import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';

export default function WalletConnect() {
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    isConnecting, 
    isCorrectNetwork,
    connectionError,
    switchToSomniaNetwork 
  } = useWallet();
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleSwitchNetwork = async () => {
    setIsSwitchingNetwork(true);
    try {
      await switchToSomniaNetwork();
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  if (account) {
    return (
      <div className="space-y-3">
        {/* Connection Status */}
        <div className={`p-3 rounded-lg border ${
          isCorrectNetwork 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-yellow-500/20 border-yellow-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm font-mono ${
              isCorrectNetwork ? 'text-green-300' : 'text-yellow-300'
            }`}>
              {isCorrectNetwork ? '✅ Ready to Play' : '🌐 Wrong Network'}
            </div>
            {!isCorrectNetwork && (
              <button 
                onClick={handleSwitchNetwork}
                disabled={isSwitchingNetwork}
                className="cyber-button-teal text-xs py-1 px-2 disabled:opacity-50"
              >
                {isSwitchingNetwork ? 'Switching...' : 'Switch'}
              </button>
            )}
          </div>
          <div className="text-xs text-slate-300 mt-1 font-mono">
            {account.slice(0, 8)}...{account.slice(-6)}
          </div>
        </div>

        {/* Disconnect Button */}
        <button 
          onClick={disconnectWallet}
          className="cyber-button-pink w-full py-2 text-sm"
        >
          🔓 Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Connection Button */}
      <button 
        onClick={handleConnect}
        disabled={isConnecting}
        className="cyber-button-teal w-full py-3 disabled:opacity-50 relative"
      >
        {isConnecting ? (
          <>
            <span className="animate-pulse">🔗</span> Connecting...
          </>
        ) : (
          <>
            <span>🔗</span> Connect MetaMask to Play
          </>
        )}
      </button>

      {/* Error Display */}
      {connectionError && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="text-red-300 text-sm font-mono text-center">
            ⚠️ {connectionError}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center">
        <p className="text-slate-400 text-xs">
          You'll need STT for gas fees on Somnia Dream network
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Make sure you're on <strong>Somnia Testnet</strong>
        </p>
      </div>

      {/* Manual Network Switch Option */}
      {!isConnecting && (
        <button 
          onClick={handleSwitchNetwork}
          disabled={isSwitchingNetwork}
          className="cyber-button-purple w-full py-2 text-sm disabled:opacity-50"
        >
          {isSwitchingNetwork ? '🔄 Adding Network...' : '🌐 Add Somnia Network'}
        </button>
      )}
    </div>
  );
}