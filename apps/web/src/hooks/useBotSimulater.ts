// apps/web/src/hooks/useBotSimulator.ts - FIXED
'use client';
import { useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';

const REALMS = [1, 2, 3, 4, 5, 6, 7, 8];
const PLAYERS = ['0x891f...9ab', '0x3c2a...7de', '0x9f12...4bc', '0x6e45...1fa'];

export const useBotSimulator = (isActive = true) => {
  const { account } = useWallet();

  useEffect(() => {
    if (!isActive || account) return; // Don't run bots if user is connected

    // Simulate game actions in UI only (no real publishing)
    const simulateBotAction = (type: string, realm: number, targetRealm?: number) => {
      console.log(`🤖 Bot ${type}: Realm ${realm}${targetRealm ? ` → ${targetRealm}` : ''}`);
      
      // You could add visual effects here without real publishing
      // For example: trigger attack animations, update fake scores, etc.
    };

    const intervals = [
      setInterval(() => {
        simulateBotAction('ENTER_REALM', REALMS[Math.floor(Math.random() * REALMS.length)]);
      }, 3000),

      setInterval(() => {
        const fromRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        let toRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        while (toRealm === fromRealm) toRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        
        simulateBotAction('ATTACK_REALM', fromRealm, toRealm);
      }, 5000),

      setInterval(() => {
        simulateBotAction('QUEST_COMPLETE', REALMS[Math.floor(Math.random() * REALMS.length)]);
      }, 4000)
    ];

    return () => intervals.forEach(clearInterval);
  }, [isActive, account]); // Re-run when account changes
};