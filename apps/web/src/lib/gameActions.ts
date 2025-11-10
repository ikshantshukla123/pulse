// apps/web/src/lib/gameActions.ts
'use client';

export type GameAction = {
  type: 'ENTER_REALM' | 'QUEST_COMPLETE' | 'ATTACK_REALM' | 'CLAIM_BONUS';
  realm: number;
  targetRealm?: number;
  activityValue?: number;
  timestamp: number;
  playerId: string;
};

export const publishGameAction = async (action: GameAction) => {
  // For demo: Log the action but don't actually publish
  // In production, this would call your emitter backend API
  console.log('🎮 Game Action (Frontend Simulation):', action);
  
  // Simulate successful publish for UI feedback
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return true;
};

// This function simulates what your emitter would publish
export const simulateGameActionForUI = (action: GameAction) => {
  return {
    user: action.playerId,
    activityType: action.type,
    activityContext: `realm_war_${action.type.toLowerCase()}`,
    activityValue: BigInt(action.activityValue || 100),
    realm: BigInt(action.realm),
    targetRealm: action.targetRealm ? BigInt(action.targetRealm) : BigInt(0),
    timestamp: BigInt(action.timestamp),
    sourceId: '0x' + 'realm_wars'.padEnd(64, '0')
  };
};