const NodeBundlr = require("@bundlr-network/client");
const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../../PRIVATE_KEY.txt");

if (!fs.existsSync(directoryPath)) {
  console.log("Please set your private key in a PRIVATE_KEY.txt file");
  process.exit(1);
}

const SOLANA_PRIVATE_KEY = fs.readFileSync(directoryPath, "utf-8");

const bundlrClient = new NodeBundlr(
  "https://devnet.bundlr.network",
  "solana",
  SOLANA_PRIVATE_KEY,
  {
    providerUrl: "https://api.devnet.solana.com",
  }
);

module.exports = {
  bundlrClient,
};
