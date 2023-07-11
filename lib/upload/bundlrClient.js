const NodeBundlr = require("@bundlr-network/client");
const fs = require("fs");
const path = require("path");
const constants = require("../constants");


if (!fs.existsSync("PRIVATE_KEY.txt")) {
  let msg = "Please set your private key in a PRIVATE_KEY.txt file";
  let color = "red";
  console.log("%c" + msg, "color:" + color)
  process.exit(1);
}

const SOLANA_PRIVATE_KEY = fs.readFileSync("PRIVATE_KEY.txt", "utf-8");

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
