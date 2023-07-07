// import {
//   createTransferInstruction,
//   PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
// } from "@metaplex-foundation/mpl-bubblegum";
// import { Connection, PublicKey } from "@solana/web3.js";
// import {
//   Keypair,
//   TransactionMessage,
//   VersionedTransaction,
// } from "@solana/web3.js";
// import {
//   SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
//   SPL_NOOP_PROGRAM_ID,
// } from "@solana/spl-account-compression";
// import { getAsset, getAssetProof, getAssetsByOwner } from "./helper/readAPI.js";
// import bs58 from "bs58";
// import fs from "fs";

const { Keypair, PublicKey, Connection } = require("@solana/web3.js");
const { createTransferInstruction, PROGRAM_ID : BUBBLEGUM_PROGRAM_ID } = require("@metaplex-foundation/mpl-bubblegum");
const { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, SPL_NOOP_PROGRAM_ID } = require("@solana/spl-account-compression");
const { getAsset, getAssetProof, getAssetsByOwner } = require("./helper/readAPI");
const bs58 = require("bs58");
const fs = require("fs");


const connection = new Connection("https://api.devnet.solana.com");

async function sendVersionedTx(connection, instructions, payer, signers) {
  let latestBlockhash = await connection.getLatestBlockhash();
  const messageLegacy = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage();
  const transation = new VersionedTransaction(messageLegacy);
  transation.sign(signers);
  const signature = await connection.sendTransaction(transation);
  return signature;
}

async function transferNFT(newOwner) {

  try {
    let newOwnerPublicKey = new PublicKey(newOwner);
  } catch (e) {
    console.log("Invalid address");
    process.exit(1);
  }

  let wallet = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(fs.readFileSync("PRIVATE_KEY.txt", "utf8")))
  );

  let cache = fs.readFileSync("./cache.json", "utf8");
  cache = JSON.parse(cache);

  let address = cache.address;

  const merkleTree = new PublicKey(address.tree);
  const currentOwner = new PublicKey(address.leafOwner);
  
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  let assets = await getAssetsByOwner(currentOwner);
  let assetId = assets[0].id;
  const res = await getAsset(assetId);
  const proof = await getAssetProof(assetId);
  const proofPathAsAccounts = mapProof(proof);

  const ix = await createTransferInstruction(
    {
      treeAuthority: treeAuthority,
      leafOwner: new PublicKey(currentOwner),
      leafDelegate: wallet.publicKey,
      newLeafOwner: new PublicKey(newOwner),
      merkleTree: merkleTree,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      anchorRemainingAccounts: proofPathAsAccounts,
    },
    {
      creatorHash: decode(res.compression.creator_hash),
      dataHash: decode(res.compression.data_hash),
      index: res.compression.leaf_id,
      nonce: res.compression.leaf_id,
      root: decode(proof.root),
    }
  );

  const sx = await sendVersionedTx(connection, [ix], wallet.publicKey, [
    wallet,
  ]);
  console.log(`See the transaction here: https://solscan.io/tx/${sx}?cluster=devnet`);
}

function decode(stuff) {
  return bufferToArray(bs58.decode(stuff));
}
function bufferToArray(buffer) {
  const nums = [];
  for (let i = 0; i < buffer.length; i++) {
    nums.push(buffer[i]);
  }
  return nums;
}
const mapProof = (assetProof) => {
  if (!assetProof.proof || assetProof.proof.length === 0) {
    throw new Error("Proof is empty");
  }
  return assetProof.proof.map((node) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false,
  }));
};

module.exports = {
  transferNFT,
};