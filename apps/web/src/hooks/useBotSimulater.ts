// apps/web/src/hooks/useBotSimulator.ts - FIXED VERSION
'use client';
import { useEffect, useRef } from 'react';
import { useWallet } from '@/contexts/WalletContext';

const REALMS = [1, 2, 3, 4, 5, 6, 7, 8];

export const useBotSimulator = (isActive = true, onPowerUpdate?: (realm: number, change: number) => void) => {
  const { account } = useWallet();
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any existing intervals first
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    if (!isActive || account) {
      console.log('🤖 Bot simulator: Stopped - User connected or not active');
      return;
    }

    console.log('🤖 Bot simulator: Started - No user connected');

    const simulateBotAction = (type: string, realm: number, targetRealm?: number) => {
      console.log(`🤖 Bot ${type}: Realm ${realm}${targetRealm ? ` → ${targetRealm}` : ''}`);
      
      // Trigger animations
      if (type === 'ATTACK_REALM' && targetRealm) {
        window.dispatchEvent(new CustomEvent('realmAttack', {
          detail: { from: realm, to: targetRealm, isBot: true }
        }));
        
        // Update power through callback
        if (onPowerUpdate) {
          onPowerUpdate(realm, 75);
          onPowerUpdate(targetRealm, -50);
        }
      } else {
        window.dispatchEvent(new CustomEvent('realmPulse', {
          detail: { realm: realm, isBot: true }
        }));
        
        const powerChange = type === 'QUEST_COMPLETE' ? 50 : 25;
        if (onPowerUpdate) {
          onPowerUpdate(realm, powerChange);
        }
      }
    };

    // Create new intervals
    const intervals = [
      setInterval(() => simulateBotAction('ENTER_REALM', REALMS[Math.floor(Math.random() * REALMS.length)]), 4000),
      setInterval(() => {
        const fromRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        let toRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        while (toRealm === fromRealm) toRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        simulateBotAction('ATTACK_REALM', fromRealm, toRealm);
      }, 6000),
      setInterval(() => simulateBotAction('QUEST_COMPLETE', REALMS[Math.floor(Math.random() * REALMS.length)]), 5000)
    ];

    intervalsRef.current = intervals;

     return () => {
      console.log('🤖 Bot simulator: Cleaning up');
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [isActive, account, onPowerUpdate]);
};
