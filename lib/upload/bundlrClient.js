const NodeBundlr = require("@bundlr-network/client");
const fs = require("fs");
const path = require("path");
const constants = require("../constants");

const directoryPath = path.join(__dirname, "../../PRIVATE_KEY.txt");

if (!fs.existsSync(directoryPath)) {
  console.log("Please set your private key in a PRIVATE_KEY.txt file");
  process.exit(1);
}

const SOLANA_PRIVATE_KEY = fs.readFileSync(directoryPath, "utf-8");

let cluster = constants.getCluster();
let rpc = constants.getRpc();

let bundlrUrl =
  cluster === "devnet"
    ? "https://devnet.bundlr.network"
    : "https://node1.bundlr.network";

const bundlrClient = new NodeBundlr(bundlrUrl, "solana", SOLANA_PRIVATE_KEY, {
  providerUrl: rpc,
});

module.exports = {
  bundlrClient,
};
