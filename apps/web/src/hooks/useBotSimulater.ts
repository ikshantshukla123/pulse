// apps/web/src/hooks/useBotSimulator.ts
'use client';
import { useEffect } from 'react';
import { publishGameAction } from '@/lib/gameActions';

const REALMS = [1, 2, 3, 4, 5, 6, 7, 8];
const PLAYERS = ['0x891f...9ab', '0x3c2a...7de', '0x9f12...4bc', '0x6e45...1fa'];

export const useBotSimulator = (isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const intervals = [
      setInterval(() => {
        publishGameAction({
          type: 'ENTER_REALM',
          realm: REALMS[Math.floor(Math.random() * REALMS.length)],
          timestamp: Date.now(),
          playerId: PLAYERS[Math.floor(Math.random() * PLAYERS.length)]
        });
      }, 3000),

      setInterval(() => {
        const fromRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        let toRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        while (toRealm === fromRealm) toRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
        
        publishGameAction({
          type: 'ATTACK_REALM',
          realm: fromRealm,
          targetRealm: toRealm,
          timestamp: Date.now(),
          playerId: PLAYERS[Math.floor(Math.random() * PLAYERS.length)]
        });
      }, 5000),

      setInterval(() => {
        publishGameAction({
          type: 'QUEST_COMPLETE',
          realm: REALMS[Math.floor(Math.random() * REALMS.length)],
          activityValue: Math.floor(Math.random() * 100) + 50,
          timestamp: Date.now(),
          playerId: PLAYERS[Math.floor(Math.random() * PLAYERS.length)]
        });
      }, 4000)
    ];

    return () => intervals.forEach(clearInterval);
  }, [isActive]);
};