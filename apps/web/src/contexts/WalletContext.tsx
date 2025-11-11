// apps/web/src/contexts/WalletContext.tsx - UPDATED FOR TESTNET
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { dream } from '@/lib/somniaClient';

interface WalletContextType {
  account: string;
  walletClient: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  switchToSomniaNetwork: () => Promise<boolean>;
  isCorrectNetwork: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// CORRECT Somnia Testnet (Shannon) Configuration
const SOMNIA_NETWORK = {
  chainId: '0xc488', // 50312 in hex - CORRECT
  chainName: 'Somnia Testnet', // ✅ Updated name
  rpcUrls: ['https://dream-rpc.somnia.network'], // ✅ This is correct
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  blockExplorerUrls: ['https://shannon-explorer.somnia.network'], // ✅ Updated explorer
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string>('');
  const [walletClient, setWalletClient] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const switchToSomniaNetwork = async (): Promise<boolean> => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask not detected. Please install MetaMask first.');
      return false;
    }

    try {
      // First try to switch to existing network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SOMNIA_NETWORK.chainId }],
      });
      setIsCorrectNetwork(true);
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SOMNIA_NETWORK],
          });
          
          // After adding, try switching again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SOMNIA_NETWORK.chainId }],
          });
          
          setIsCorrectNetwork(true);
          return true;
        } catch (addError) {
          console.error('Failed to add Somnia network:', addError);
          alert('Failed to add Somnia Testnet to MetaMask. Please try manually.');
          return false;
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        console.log('User rejected network switch');
        return false;
      } else {
        console.error('Failed to switch to Somnia network:', switchError);
        alert('Failed to switch network. Please try again.');
        return false;
      }
    }
  };

const checkNetwork = async (): Promise<boolean> => {
  if (typeof window.ethereum === 'undefined') return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current chainId:', chainId, 'Expected: 0xc488');
    
    // CORRECT: 50312 = 0xc488 (not 0xc498)
    const isCorrect = chainId === '0xc488';
    setIsCorrectNetwork(isCorrect);
    
    if (!isCorrect) {
      console.log('Wrong network. Current:', chainId, 'Expected: 0xc488');
    }
    
    return isCorrect;
  } catch (error) {
    console.error('Failed to check network:', error);
    return false;
  }
};
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to play!');
      return;
    }

    setIsConnecting(true);
    try {
      const [address] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const client = createWalletClient({
        account: address,
        chain: dream,
        transport: custom(window.ethereum)
      });
      
      setAccount(address);
      setWalletClient(client);
      
      // Check network after connection
      await checkNetwork();
      
      console.log('🎮 Wallet connected:', address);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        alert('Please connect your wallet to continue.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setWalletClient(null);
    setIsCorrectNetwork(false);
  };

  // Listen for network changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed to:', chainId);
      const isCorrect = chainId === SOMNIA_NETWORK.chainId;
      setIsCorrectNetwork(isCorrect);
      
      if (account && !isCorrect) {
        console.log('User switched to wrong network');
      }
    };

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // User switched accounts
        setAccount(accounts[0]);
        const client = createWalletClient({
          account: accounts[0],
          chain: dream,
          transport: custom(window.ethereum!)
        });
        setWalletClient(client);
        checkNetwork();
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    // Initial network check
    checkNetwork();

    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [account]);

  return (
    <WalletContext.Provider value={{
      account,
      walletClient,
      connectWallet,
      disconnectWallet,
      isConnecting,
      switchToSomniaNetwork,
      isCorrectNetwork
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}