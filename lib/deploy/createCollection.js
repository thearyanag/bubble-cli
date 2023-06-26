import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import fs from "fs";
import bs58 from "bs58";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
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

  console.log(collectionConfig);
  console.log(collectionCache);
  console.log(config);

  const collection = await metaplex.nfts().create({
    name: collectionConfig.name,
    uri: collectionCache.metadata,
    sellerFeeBasisPoints: config.sellerFeeBasisPoints,
    isCollection: true,
    updateAuthority: wallet,
  });

  return {
    collectionAuthority: collection.nft.updateAuthorityAddress.toString(),
    collectionMint: collection.mintAddress.toString(),
    collectionMetadata: collection.metadataAddress.toString(),
    editionAccount: collection.masterEditionAddress.toString(),
  };
};

export { createCollection };
