// apps/web/src/lib/gameActions.ts - UPDATED WITH BETTER ERROR HANDLING
'use client';

import { SDK, SchemaEncoder } from "@somnia-chain/streams";
import { createPublicClient, http, stringToHex } from "viem";
import { dream } from './somniaClient';

export type GameAction = {
  type: 'ENTER_REALM' | 'QUEST_COMPLETE' | 'ATTACK_REALM' | 'CLAIM_BONUS';
  realm: number;
  targetRealm?: number;
  activityValue?: number;
  timestamp: number;
  playerId: string;
};

const ACTIVITY_SCHEMA = "address user,string activityType,string activityContext,uint256 activityValue,uint256 realm,uint256 targetRealm,uint256 timestamp,bytes32 sourceId";

export const publishGameAction = async (action: GameAction, walletClient: any) => {
  if (!walletClient) {
    throw new Error('Please connect your wallet first!');
  }

  try {
    const publicClient = createPublicClient({
      chain: dream,
      transport: http(process.env.NEXT_PUBLIC_SOMNIA_RPC || "https://dream-rpc.somnia.network"),
    });

    const sdk = new SDK({ 
      public: publicClient, 
      wallet: walletClient 
    });

    const encoder = new SchemaEncoder(ACTIVITY_SCHEMA);

    const activityData = {
      user: action.playerId,
      activityType: action.type,
      activityContext: `realm_war_${action.type.toLowerCase()}`,
      activityValue: BigInt(action.activityValue || 100),
      realm: BigInt(action.realm),
      targetRealm: action.targetRealm ? BigInt(action.targetRealm) : BigInt(0),
      timestamp: BigInt(Math.floor(Date.now() / 1000)),
      sourceId: `realm_wars_${Date.now()}`
    };

    const encodedData = encoder.encodeData([
      { name: "user", value: activityData.user, type: "address" },
      { name: "activityType", value: activityData.activityType, type: "string" },
      { name: "activityContext", value: activityData.activityContext, type: "string" },
      { name: "activityValue", value: activityData.activityValue.toString(), type: "uint256" },
      { name: "realm", value: activityData.realm.toString(), type: "uint256" },
      { name: "targetRealm", value: activityData.targetRealm.toString(), type: "uint256" },
      { name: "timestamp", value: activityData.timestamp.toString(), type: "uint256" },
      { name: "sourceId", value: stringToHex(activityData.sourceId, { size: 32 }), type: "bytes32" },
    ]);

    const tx = await sdk.streams.set([{
      id: stringToHex(activityData.sourceId, { size: 32 }),
      schemaId: process.env.NEXT_PUBLIC_SCHEMA_ID!,
      data: encodedData
    }]);

    console.log('🎮 Game Action Published! TX:', tx);
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    
    if (receipt.status === 'success') {
      return { success: true, txHash: tx };
    } else {
      throw new Error('Transaction failed on-chain');
    }
 } catch (error: any) {
  // Check for user rejection specifically
  if (error?.name === 'ContractFunctionExecutionError' || 
      error?.message?.includes('User rejected') ||
      error?.message?.includes('denied transaction') ||
      error?.code === 4001) {
    // Don't log user rejection errors to console to reduce noise
    throw new Error('USER_REJECTED');
  } else {
    // Only log actual errors
    console.error('Failed to publish game action:', error);
    throw new Error(`Transaction failed: ${error.message || 'Unknown error'}`);
  }     
 }}