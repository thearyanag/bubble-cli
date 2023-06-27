import {
  TokenProgramVersion,
  TokenStandard,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_NOOP_PROGRAM_ID,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const createNFT = async (
  collectionMint,
  collectionMetadata,
  editionAccount,
  treeAddress,
  metadata
) => {
  const compressedNFTMetadata = {
    name: metadata.name,
    symbol: metadata.symbol,
    // specific json metadata for each NFT
    uri: metadata.uri,
    creators: metadata.creators,
    editionNonce: 0,
    uses: null,
    collection: {
      key: collectionMint,
      verified: false,
    },
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    isMutable: false,
    // these values are taken from the Bubblegum package
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible,
  };

  treeAddress = new PublicKey(treeAddress);

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const [bubblegumSigner, __] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );

  let wallet = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(fs.readFileSync("PRIVATE_KEY.txt", "utf8")))
  );

  console.log("wallet", wallet.publicKey);
  console.log("treeAddress", treeAddress);
  console.log("treeAuthority", treeAuthority);
  console.log("collectionMint", collectionMint);
  console.log("collectionMetadata", collectionMetadata);
  console.log("editionAccount", editionAccount);

  console.log("bubblegumSigner", bubblegumSigner);
  console.log(compressedNFTMetadata);

  const compressedMintIx = createMintToCollectionV1Instruction(
    {
      payer: wallet.publicKey,
      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
      treeDelegate: wallet.publicKey,

      leafOwner: wallet.publicKey,
      leafDelegate: wallet.publicKey,

      collectionAuthority: wallet.publicKey,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collectionMint,
      collectionMetadata: collectionMetadata,
      editionAccount: editionAccount,

      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      bubblegumSigner: bubblegumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(compressedNFTMetadata, {
        collection: {
          key: collectionMint,
          verified: false,
        },
      }),
    }
  );

  const tx = new Transaction().add(compressedMintIx);
  tx.feePayer = wallet.publicKey;

  const txSignature = await sendAndConfirmTransaction(
    connection,
    tx,
    [wallet],
    {
      commitment: "confirmed",
      skipPreflight: true,
    }
  );

  console.log("txSignature", txSignature);
};

export { createNFT };
