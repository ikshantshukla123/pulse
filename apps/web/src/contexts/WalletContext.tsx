// apps/web/src/contexts/WalletContext.tsx - IMPROVED ERROR HANDLING
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
  connectionError: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Somnia Testnet Configuration
const SOMNIA_NETWORK = {
  chainId: '0xc488',
  chainName: 'Somnia Testnet',
  rpcUrls: ['https://dream-rpc.somnia.network'],
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  blockExplorerUrls: ['https://shannon-explorer.somnia.network'],
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string>('');
  const [walletClient, setWalletClient] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const switchToSomniaNetwork = async (): Promise<boolean> => {
    if (typeof window.ethereum === 'undefined') {
      setConnectionError('MetaMask not detected. Please install MetaMask first.');
      return false;
    }

    try {
      setConnectionError(null);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SOMNIA_NETWORK.chainId }],
      });
      setIsCorrectNetwork(true);
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SOMNIA_NETWORK],
          });
          
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SOMNIA_NETWORK.chainId }],
          });
          
          setIsCorrectNetwork(true);
          return true;
        } catch (addError) {
          console.error('Failed to add Somnia network:', addError);
          setConnectionError('Failed to add Somnia Testnet to MetaMask. Please try manually.');
          return false;
        }
      } else if (switchError.code === 4001) {
        // User rejected the request - don't show error, just return false
        console.log('User rejected network switch');
        return false;
      } else {
        console.error('Failed to switch to Somnia network:', switchError);
        setConnectionError('Failed to switch network. Please try again.');
        return false;
      }
    }
  };

  const checkNetwork = async (): Promise<boolean> => {
    if (typeof window.ethereum === 'undefined') return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isCorrect = chainId === '0xc488';
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Failed to check network:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setConnectionError('Please install MetaMask to play!');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      const address = accounts[0];
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
      
      // Handle different error types
      if (error.code === 4001) {
        setConnectionError('Connection rejected. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        setConnectionError('Connection request already pending. Please check MetaMask.');
      } else {
        setConnectionError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setWalletClient(null);
    setIsCorrectNetwork(false);
    setConnectionError(null);
  };

  // Listen for network changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed to:', chainId);
      const isCorrect = chainId === SOMNIA_NETWORK.chainId;
      setIsCorrectNetwork(isCorrect);
      setConnectionError(null);
    };

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        const client = createWalletClient({
          account: accounts[0],
          chain: dream,
          transport: custom(window.ethereum!)
        });
        setWalletClient(client);
        checkNetwork();
        setConnectionError(null);
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
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
      isCorrectNetwork,
      connectionError
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