const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");
const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");
const fs = require("fs");
const bs58 = require("bs58");

const constants = require("../constants");
let cluster = constants.getCluster();
let rpc = constants.getRpc();

const connection = new Connection(rpc, "confirmed");
const metaplex = Metaplex.make(connection);

const createCollection = async () => {
  let collectionConfig = {};
  let collectionCache = {};
  let config = {};

  let wallet = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(fs.readFileSync("PRIVATE_KEY.txt", "utf8")))
  );

  metaplex.use(keypairIdentity(wallet));

  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  } catch (err) {
    console.log("Make sure you have a config.json file in the root folder");
  }

  try {
    collectionConfig = JSON.parse(
      fs.readFileSync("./assets/collection.json", "utf8")
    );
  } catch (err) {
    console.log(
      "Make sure you have a collection.json file in the assets folder"
    );
  }

  try {
    collectionCache = JSON.parse(fs.readFileSync("./cache.json", "utf8"));
    collectionCache = collectionCache.collection;
  } catch (err) {
    console.log(
      "Make sure you have a use upload command to upload your assets first"
    );
  }

  const collection = await metaplex.nfts().create({
    name: collectionConfig.name,
    uri: collectionCache.metadata,
    sellerFeeBasisPoints: config.sellerFeeBasisPoints,
    isCollection: true,
    updateAuthority: wallet,
  });

  let cache = fs.readFileSync("./cache.json", "utf8");
  cache = JSON.parse(cache);
  cache.address = {
    collection: collection.mintAddress.toString(),
  };
  fs.writeFileSync("./cache.json", JSON.stringify(cache));

  console.log(`Collection created at ${collection.mintAddress.toString()}`);

  return {
    collectionAuthority: collection.nft.updateAuthorityAddress,
    collectionMint: collection.mintAddress,
    collectionMetadata: collection.metadataAddress,
    editionAccount: collection.masterEditionAddress,
  };
};

module.exports = {
  createCollection,
};
