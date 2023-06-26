import {
  MetadataArgs,
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
} from "@solana/web3.js";
import wallet from "../utils/wallet";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const mintNFT = async (
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
    creators : metadata.creators,
    editionNonce: 0,
    uses: null,
    collection: null,
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

  const compressedMintIx = createMintToCollectionV1Instruction(
    {
      payer: wallet.publicKey,
      merkleTree: treeAddress,
      treeAuthority,
      treeDelegate: wallet.publicKey,

      leafOwner: wallet.publicKey,
      leafDelegate: wallet.publicKey,

      collectionAuthority: wallet.publicKey,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collectionMint,
      collectionMetadata: collectionMetadata,
      editionAccount: editionAccount,

      bubblegumSigner: bubblegumSigner,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
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

export default mintNFT;
