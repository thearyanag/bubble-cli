const fs = require("fs");
let constants;
try {
  constants = JSON.parse(fs.readFileSync("./constants.json", "utf8"));
} catch (err) {
  fs.writeFileSync(
    "./constants.json",
    JSON.stringify({ cluster: "devnet", rpc: "https://api.devnet.solana.com" })
  );
  constants = JSON.parse(fs.readFileSync("./constants.json", "utf8"));
}

const setCluster = (c) => {
  c = c.toLowerCase();
  if (c === "devnet" || c === "testnet" || c === "mainnet-beta") {
    constants.cluster = c;
    fs.writeFileSync("./constants.json", JSON.stringify(constants));
    console.log(`Cluster set to ${c}`);
  } else {
    console.log("Invalid cluster");
  }
};

const setRpc = (r) => {
  constants.rpc = r;
  fs.writeFileSync("./constants.json", JSON.stringify(constants));
  console.log(`RPC set to ${r}`);
};

/**
 * Get the current cluster
 * @returns {string} cluster
 */
const getCluster = () => {
  return constants.cluster;
};

const getRpc = () => {
  return constants.rpc;
};

module.exports = {
  setCluster,
  setRpc,
  getCluster,
  getRpc,
};
