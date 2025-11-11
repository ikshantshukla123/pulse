// apps/web/src/lib/somniaClient.ts - UPDATED
"use client";

import { SDK } from "@somnia-chain/streams";
import { createPublicClient, http, defineChain } from "viem";

// CORRECT Somnia Testnet Chain Definition
export const dream = defineChain({
  id: 50312, // ✅ CORRECT - Somnia Testnet
  name: "Somnia Testnet", // ✅ Updated name
  network: "somnia-testnet", // ✅ Updated network
  nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  rpcUrls: { 
    default: { 
      http: [process.env.NEXT_PUBLIC_SOMNIA_RPC || "https://dream-rpc.somnia.network"] 
    } 
  },
  blockExplorers: {
    default: {
      name: 'Shannon Explorer',
      url: 'https://shannon-explorer.somnia.network'
    }
  }
});

export function getSdk() {
  const publicClient = createPublicClient({
    chain: dream,
    transport: http(),
  });

  return new SDK({ public: publicClient });
}