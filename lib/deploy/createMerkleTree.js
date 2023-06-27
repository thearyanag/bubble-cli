import {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createCreateTreeInstruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  createAllocTreeIx,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import fs from "fs";
import bs58 from "bs58";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const getMerkleTree = async () => {
  let wallet = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(fs.readFileSync("PRIVATE_KEY.txt", "utf8")))
  );

  let maxDepthSizePair = {
    maxDepth: 14,
    maxBufferSize: 64,
  };

  let canopyDepth = 10;

  let treeKeypair = Keypair.generate();

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const allocTreeTx = await createAllocTreeIx(
    connection,
    treeKeypair.publicKey,
    wallet.publicKey,
    maxDepthSizePair,
    canopyDepth
  );

  const createTreeTx = createCreateTreeInstruction(
    {
      payer: wallet.publicKey,
      treeCreator: wallet.publicKey,
      treeAuthority: treeAuthority,
      merkleTree: treeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxDepth: maxDepthSizePair.maxDepth,
      maxBufferSize: maxDepthSizePair.maxBufferSize,
      public: true,
    },
    BUBBLEGUM_PROGRAM_ID
  );

  const tx = new Transaction().add(allocTreeTx).add(createTreeTx);
  tx.feePayer = wallet.publicKey;

  const txSig = await sendAndConfirmTransaction(
    connection,
    tx,
    [treeKeypair, wallet],
    {
      commitment: "confirmed",
      skipPreflight: false,
    }
  );

  console.log("Tree created with signature : ", txSig);

  let cache = fs.readFileSync("./cache.json", "utf8");
  cache = JSON.parse(cache);
  cache.address = {
    ...cache.address,
    tree: treeKeypair.publicKey.toBase58(),
    treeAuthority: treeAuthority.toBase58(),
  };
  fs.writeFileSync("./cache.json", JSON.stringify(cache));

  return {
    treeKeypair,
    treeAuthority,
  };
};

export { getMerkleTree };
