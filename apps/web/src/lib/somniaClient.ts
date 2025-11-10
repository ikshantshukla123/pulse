"use client";

import { SDK } from "@somnia-chain/streams";
import { createPublicClient, http, defineChain } from "viem";

const dream = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_SOMNIA_RPC!] } },
});

export function getSdk() {
  const publicClient = createPublicClient({
    chain: dream,
    transport: http(),
  });
  // read-only usage (wallet not needed)

  return new SDK({ public: publicClient });
}
