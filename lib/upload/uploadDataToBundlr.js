const { bundlrClient } = require("./bundlrClient");
const fs = require("fs");
const { createCache } = require("./createCache");

// the folder where the file is located
const uploadDataToBundlr = async (stats, answers) => {
  if (!answers["price-confirm"]) process.exit(1);
  console.log(
    `Uploading ${
      stats.imagesize + stats.filesize
    } bytes to the Solana blockchain...`
  );

  let bundlrPrice =
    (await bundlrClient.getPrice(stats.imagesize + stats.filesize)) * stats.no;
  let currentBalance = await bundlrClient.getLoadedBalance();

  let toFund = bundlrPrice - currentBalance;
  toFund += (10 * toFund) / 100; // add 10% to the price to make sure we have enough to cover the tx fees
  toFund = Math.ceil(toFund);

  console.log("Funding account with: ", toFund);

  if (toFund > 0) await bundlrClient.fund(toFund);

  console.log();
  console.log("📤 Uploading image files");
  console.log("(Ctrl+C to abort)");
  console.log();

  let image = [];
  let metadata = [];
  let name = [];

  for (let i = 0; i < stats.no; i++) {
    try {
      let imageToUpload = `./assets/${i}.png`;
      let tags = [{ name: "Content-Type", value: "image/png" }];
      let imgResponse = await bundlrClient.uploadFile(imageToUpload, tags);
      image.push(`https://arweave.net/${imgResponse.id}`);
    } catch (e) {
      console.log(e);
      console.log(
        "Error uploading files , please make sure you have a PRIVATE_KEY.txt file with your private key in the root folder"
      );
    }
  }

  console.log();
  console.log("📤 Uploading metadata files");
  console.log("(Ctrl+C to abort)");
  console.log();

  for (let i = 0; i < stats.no; i++) {
    try {
      let metadataToUpload = `./assets/${i}.json`;

      let metadataContent = fs.readFileSync(metadataToUpload);
      let metadataJSON = JSON.parse(metadataContent);
      metadataJSON.image = image[i];
      fs.writeFileSync("./temp.json", JSON.stringify(metadataJSON));
      name.push(metadataJSON.name);

      let tags = [{ name: "Content-Type", value: "application/json" }];
      let metadataResponse = await bundlrClient.uploadFile("./temp.json", tags);
      metadata.push(`https://arweave.net/${metadataResponse.id}`);
    } catch (e) {
      console.log(e);
      console.log(
        "Error uploading files , please make sure you have a PRIVATE_KEY.txt file with your private key in the root folder"
      );
    }
  }

  let collectionImage = `./assets/collection.png`;
  let tags = [{ name: "Content-Type", value: "image/png" }];
  let collectionImageResponse = await bundlrClient.uploadFile(
    collectionImage,
    tags
  );
  let collectionImageURL = `https://arweave.net/${collectionImageResponse.id}`;

  let collectionMetadata = `./assets/collection.json`;
  let metadataContent = fs.readFileSync(collectionMetadata);
  let metadataJSON = JSON.parse(metadataContent);
  metadataJSON.image = collectionImageURL;
  fs.writeFileSync("./temp.json", JSON.stringify(metadataJSON));
  let metadataTags = [{ name: "Content-Type", value: "application/json" }];
  let collectionMetadataResponse = await bundlrClient.uploadFile(
    "./temp.json",
    metadataTags
  );
  let collectionMetadataURL = `https://arweave.net/${collectionMetadataResponse.id}`;

  let collectionName = metadataJSON.name;

  let collection = {
    image: collectionImageURL,
    metadata: collectionMetadataURL,
    name: collectionName,
  };

  console.log();
  let config = createCache(image, metadata, name, collection, stats.no);
  console.log("Cache file created !");
};

module.exports = {
  uploadDataToBundlr,
};
