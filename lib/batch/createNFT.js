const {
  TokenProgramVersion,
  TokenStandard,
  PROGRAM_ID: BUBBLEGUM_PROGRAM_ID,
  createMintToCollectionV1Instruction,
} = require("@metaplex-foundation/mpl-bubblegum");
const {
  SPL_NOOP_PROGRAM_ID,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
} = require("@solana/spl-account-compression");
const { PROGRAM_ID : TOKEN_METADATA_PROGRAM_ID } = require("@metaplex-foundation/mpl-token-metadata");
const {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,

  Keypair,
} = require("@solana/web3.js");
const bs58 = require("bs58");
const fs = require("fs");

const constants = require("../constants");
let rpc = constants.getRpc();

const connection = new Connection(rpc, "confirmed");

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

  const compressedMintIx = createMintToCollectionV1Instruction(
    {
      payer: wallet.publicKey,
      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
      treeDelegate: wallet.publicKey,

      leafOwner: metadata.leafOwner,
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

module.exports = {
  createNFT,
};