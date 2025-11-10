require("dotenv").config();
const { SDK } = require("@somnia-chain/streams");
const { createPublicClient, createWalletClient, http, defineChain } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

const dreamChain = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: { decimals: 18, name: "STT", symbol: "STT" },
  rpcUrls: { default: { http: ["https://dream-rpc.somnia.network"] } },
});

// ✅ CORRECT: Single-line schema without extra whitespace
const activitySchema = "address user,string activityType,string activityContext,uint256 activityValue,uint256 realm,uint256 timestamp,bytes32 sourceId";

async function fixSchema() {
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

  console.log("🔍 Computing new schema ID...");
  const newSchemaId = await sdk.streams.computeSchemaId(activitySchema);
  console.log("➡️ New Schema ID:", newSchemaId);

  // Check if the correct schema is already registered
  const isRegistered = await sdk.streams.isDataSchemaRegistered(newSchemaId);
  
  if (isRegistered) {
    console.log("✅ Correct schema is already registered!");
    console.log("📋 Use this SCHEMA_ID in your .env:", newSchemaId);
    
    // Verify it works
    console.log("🧪 Testing schema decoding...");
    try {
      const testEncoder = new sdk.SchemaEncoder(activitySchema);
      console.log("✅ Schema format is valid!");
    } catch (e) {
      console.log("❌ Schema still invalid:", e.message);
    }
    return;
  }

  console.log("🔄 Re-registering schema with correct format...");
  
  try {
    const tx = await sdk.streams.registerDataSchemas([
      { 
        id: "somnia-pulse-activity-v2", 
        schema: activitySchema 
      }
    ]);

    console.log("⏳ Waiting for confirmation... TX:", tx);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    
    if (receipt.status === "success") {
      console.log(`🎉 Schema Re-registered Successfully!`);
      console.log(`👉 OLD SCHEMA_ID: ${process.env.SCHEMA_ID}`);
      console.log(`👉 NEW SCHEMA_ID: ${newSchemaId}`);
      console.log(`👉 Update your .env files with: NEXT_PUBLIC_SCHEMA_ID=${newSchemaId}`);
    } else {
      console.log("❌ Transaction failed");
    }
  } catch (error) {
    console.error("❌ Registration failed:", error);
  }
}

fixSchema().catch(console.error);