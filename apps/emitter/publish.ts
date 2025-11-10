// apps/emitter/publish.ts
require("dotenv").config();
const { SDK, SchemaEncoder } = require("@somnia-chain/streams");
const { createPublicClient, createWalletClient, http, defineChain } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { stringToHex } = require("viem");

const dreamChain = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: { decimals: 18, name: "STT", symbol: "STT" },
  rpcUrls: { default: { http: ["https://dream-rpc.somnia.network"] } },
});

// ✅ MUST MATCH THE REGISTERED SCHEMA - ADD targetRealm
const SCHEMA = "address user,string activityType,string activityContext,uint256 activityValue,uint256 realm,uint256 targetRealm,uint256 timestamp,bytes32 sourceId";

async function publishActivity() {
  const publicClient = createPublicClient({ chain: dreamChain, transport: http() });
  const wallet = privateKeyToAccount(process.env.PRIVATE_KEY);
  const walletClient = createWalletClient({ account: wallet, chain: dreamChain, transport: http() });
  const sdk = new SDK({ public: publicClient, wallet: walletClient });

  const encoder = new SchemaEncoder(SCHEMA);

  const activity = {
    user: process.env.PUBLISHER,
    activityType: "login",
    activityContext: "dashboard",
    activityValue: "1",
    realm: "1",
    targetRealm: "0", // ← ADD THIS FIELD (0 = no target)
    timestamp: Math.floor(Date.now() / 1000).toString(),
    sourceId: "pulse-ui-" + Date.now()
  };

  const encoded = encoder.encodeData([
    { name: "user", value: activity.user, type: "address" },
    { name: "activityType", value: activity.activityType, type: "string" },
    { name: "activityContext", value: activity.activityContext, type: "string" },
    { name: "activityValue", value: activity.activityValue, type: "uint256" },
    { name: "realm", value: activity.realm, type: "uint256" },
    { name: "targetRealm", value: activity.targetRealm, type: "uint256" }, // ← ADD THIS FIELD
    { name: "timestamp", value: activity.timestamp, type: "uint256" },
    { name: "sourceId", value: stringToHex(activity.sourceId, { size: 32 }), type: "bytes32" },
  ]);

  const tx = await sdk.streams.set([
    {
      id: stringToHex(activity.sourceId, { size: 32 }),
      schemaId: process.env.SCHEMA_ID, // Make sure this is the NEW schema ID
      data: encoded
    }
  ]);

  console.log("🔗 Activity Published! TX:", tx);
}

publishActivity().catch(console.error);