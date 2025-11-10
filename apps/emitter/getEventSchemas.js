require("dotenv").config();
const { SDK } = require("@somnia-chain/streams");
const { createPublicClient, http, defineChain } = require("viem");

const dream = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  rpcUrls: { default: { http: [process.env.SOMNIA_RPC] } }, // ✅ FIXED
});

async function main() {
  const publicClient = createPublicClient({
    chain: dream,
    transport: http(),
  });

  const sdk = new SDK({ public: publicClient });

  console.log("\n🔍 Fetching Registered Event Schemas...\n");

  const schemaIds = await sdk.streams.getAllSchemas();
  if (!schemaIds || schemaIds.length === 0) {
    console.log("❌ No schemas found");
    return;
  }

  const events = await sdk.streams.getEventSchemasById(schemaIds);

  console.log("\n📜 Registered Event Schemas:\n");
  console.log(JSON.stringify(events, null, 2));
}

main().catch(console.error);
