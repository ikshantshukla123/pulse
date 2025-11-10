// check-data-format.js
require("dotenv").config();
const { SDK } = require("@somnia-chain/streams");
const { createPublicClient, http, defineChain } = require("viem");

const dreamChain = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: { decimals: 18, name: "STT", symbol: "STT" },
  rpcUrls: { default: { http: ["https://dream-rpc.somnia.network"] } },
});

async function checkDataFormat() {
  const publicClient = createPublicClient({ chain: dreamChain, transport: http() });
  const sdk = new SDK({ public: publicClient });

  const SCHEMA_ID = process.env.SCHEMA_ID;
  const PUBLISHER = process.env.PUBLISHER;

  console.log("=== CHECKING DATA FORMAT ===");
  
  try {
    const allData = await sdk.streams.getAllPublisherDataForSchema(SCHEMA_ID, PUBLISHER);
    
    console.log("Data type:", typeof allData);
    console.log("Is array:", Array.isArray(allData));
    console.log("Length:", allData?.length);
    
    if (allData && Array.isArray(allData) && allData.length > 0) {
      console.log("First item type:", typeof allData[0]);
      console.log("First item:", allData[0]);
      
      if (typeof allData[0] === 'string') {
        console.log("✅ Data is hex strings - needs decoding");
      } else {
        console.log("✅ Data is already decoded objects");
        console.log("First item structure:", JSON.stringify(allData[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkDataFormat().catch(console.error);