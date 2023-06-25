import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import fs from "fs";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const metaplex = Metaplex.make(connection);

const createCollection = async () => {
  let collectionConfig = JSON.parse(
    fs.readFileSync("./assets/collection.json", "utf8")
  );

  console.log(collectionConfig);

  const collection = await metaplex.nfts().create({
    name: "My NFT",
    uri: "https://updg8.com/jsondata/4WF3QWnk4JkaTiKbtRxQYTboAoCaskTxRzMHWQgQ2gc9",
    sellerFeeBasisPoints: 0,
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
