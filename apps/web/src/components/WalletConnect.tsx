// apps/web/src/components/WalletConnect.tsx
'use client';

import { useWallet } from '@/contexts/WalletContext';

export default function WalletConnect() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  if (account) {
    return (
      <div className="text-center">
        <button 
          onClick={disconnectWallet}
          className="cyber-button-pink text-sm py-2 px-4"
        >
          🔓 Disconnect {account.slice(0, 6)}...{account.slice(-4)}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button 
        onClick={connectWallet}
        disabled={isConnecting}
        className="cyber-button-teal w-full py-3 disabled:opacity-50"
      >
        {isConnecting ? '🔗 Connecting...' : '🔗 Connect MetaMask to Play'}
      </button>
      <p className="text-slate-400 text-xs mt-2">
        You'll need STT for gas fees on Somnia Dream network
      </p>
    </div>
  );
}