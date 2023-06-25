import NodeBundlr from "@bundlr-network/client/node";
import fs from "fs";

if (!fs.existsSync("PRIVATE_KEY.txt")) {
  console.log("Please set your private key in a PRIVATE_KEY.txt file");
  process.exit(1);
}

const SOLANA_PRIVATE_KEY = fs.readFileSync("PRIVATE_KEY.txt", "utf-8");

const bundlrClient = new NodeBundlr(
  "https://devnet.bundlr.network",
  "solana",
  SOLANA_PRIVATE_KEY,
  {
    providerUrl: "https://api.devnet.solana.com",
  }
);

export default bundlrClient;
