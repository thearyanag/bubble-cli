// import fs from "fs";
// import { createNFT } from "./createNFT.js";
// import { PublicKey, Keypair } from "@solana/web3.js";
// import bs58 from "bs58";

const fs = require("fs");
const { createNFT } = require("./createNFT");
const { PublicKey, Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");

const batchNFTMint = async (collection, merkleTree) => {
  const collectionMint = collection.collectionMint;
  const collectionMetadata = collection.collectionMetadata;
  const editionAccount = collection.editionAccount;
  const treeAddress = merkleTree.treeKeypair.publicKey.toBase58();

  let cacheMetadata = JSON.parse(fs.readFileSync("./cache.json", "utf8"));

  const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

  let wallets;
  try {
    wallets = fs.readFileSync("./wallets.txt", "utf8");
    wallets = wallets.split("\n");
  } catch (err) {
    console.log();
    console.log("Please create wallets.txt");
    console.log()
    return false;
  }

  let wallet = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(fs.readFileSync("PRIVATE_KEY.txt", "utf8")))
  );

  let creators = config.creators;
  creators = creators.split(",");

  let creatorsArray = [];
  for (let i = 0; i < creators.length; i++) {
    let creator = creators[i].split(":");
    let address = creator[0];
    let share = creator[1];
    creatorsArray.push({
      address: new PublicKey(address),
      share: parseInt(share),
    });
  }

  let length = Object.keys(cacheMetadata).length;
  for (let i = 0; i < length - 2; i++) {
    let metadata = JSON.parse(fs.readFileSync(`./assets/${i}.json`, "utf8"));
    let nftCacheMetadata = cacheMetadata[i];
    let temp = {
      name: metadata.name,
      symbol: metadata.symbol,
      uri: nftCacheMetadata.image,
      creators: creatorsArray,
      leafOwner: new PublicKey(wallets[i]),
    };

    let nft = await createNFT(
      collectionMint,
      collectionMetadata,
      editionAccount,
      treeAddress,
      temp
    );
    console.log(`Minting ${i + 1} of ${length - 2} NFTs`);
  }
  return true;
};

module.exports = {
  batchNFTMint,
};
