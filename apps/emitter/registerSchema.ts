require("dotenv").config();
const { SDK, SchemaEncoder } = require("@somnia-chain/streams");
const { createPublicClient, createWalletClient, http, defineChain } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

const dreamChain = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: {
    decimals: 18,
    name: "STT",
    symbol: "STT",
  },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
    public: { http: ["https://dream-rpc.somnia.network"] },
  },
});

// ✅ FIXED: Single-line schema without extra whitespace
const activitySchema = "address user,string activityType,string activityContext,uint256 activityValue,uint256 realm,uint256 timestamp,bytes32 sourceId";

async function main() {
  const publicClient = createPublicClient({
    chain: dreamChain,
    transport: http(),
  });

  const wallet = privateKeyToAccount(process.env.PRIVATE_KEY);
  const walletClient = createWalletClient({
    account: wallet,
    chain: dreamChain,
    transport: http(),
  });

  const sdk = new SDK({ public: publicClient, wallet: walletClient });

  console.log("🔍 Computing schema ID...");
  const schemaId = await sdk.streams.computeSchemaId(activitySchema);
  console.log("➡️ Schema ID:", schemaId);

  const isRegistered = await sdk.streams.isDataSchemaRegistered(schemaId);
  if (isRegistered) {
    console.log("✅ Schema already registered!");
    console.log("📋 Schema ID for your .env:", schemaId);
    return;
  }

  console.log("📡 Registering schema...");
  const tx = await sdk.streams.registerDataSchemas([
    { id: "somnia-pulse-activity", schema: activitySchema }
  ]);

  console.log("⏳ Waiting for confirmation... TX:", tx);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
  
  if (receipt.status === "success") {
    console.log(`🎉 Schema Registered Successfully!`);
    console.log(`👉 Use this SCHEMA_ID in your .env: ${schemaId}`);
  } else {
    console.log("❌ Transaction failed");
  }
}

main().catch(console.error);