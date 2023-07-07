#!/usr/bin/env node

const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const args = require("args-parser");
const shell = require("shelljs");
let res = args(process.argv);

const {
  askCreate,
  getFileContent,
  getAssetStats,
  createConfig,
} = require("./lib/create");

const { askUpload, uploadDataToBundlr } = require("./lib/upload");

const { createCollection, getMerkleTree, batchNFT } = require("./lib/deploy");

const { batchNFTMint }  = require("./lib/batch");

const { transferNFT } = require("./lib/deploy");

// if there are no arguments passed, show the welcome screen
if (Object.keys(res).length === 0) {
  clear();

  console.log(
    chalk.whiteBright(figlet.textSync("Bubble", { horizontalLayout: "full" }))
  );

  console.log(
    chalk.whiteBright(
      ` A CLI tool to mint compressed NFT collections on Solana. \n
 Usage: bubble [command] [options] \n
 Commands:\n
    create         Create a new config file
    upload         Upload a metadata from asset folder to Arweave
    deploy         Deploy a new collection on Solana
        `
    )
  );
} else {
  // if there are arguments passed, check the command and execute the corresponding function
  // create
  // upload
  // deploy
  // mint

  let keys = Object.keys(res);
  let command = keys[0];

  if (command === "create") {
    /**
     * The create command does the following:
     * 1. get the stats of the asset folder
     * 2. confirm the stats with the user and ask for other details
     * 3. create the config file
     */

    // get the stats of the asset folder
    let stats = getAssetStats();
    console.log();

    // confirm the stats with the user and ask for other details
    askCreate(stats).then((answers) => {
      // create the config file
      let isConfigCreated = createConfig(answers, stats);
      console.log();

      if (isConfigCreated) {
        console.log(
          "Config file created successfully ✔️ \nPlease proceed to upload your assets "
        );
      } else {
        console.log("Config file creation failed");
        shell.exit(1);
      }
    });
  } else if (command === "upload") {
    let stats = getAssetStats();
    console.log(stats);
    // return
    let answers = askUpload(stats).then((answers) => {
      let imageResponse = uploadDataToBundlr(stats, answers);
      console.log("Uploading assets to Arweave...");
    });
  } else if (command === "deploy") {
    let collection = createCollection().then((collection) => {
      console.log("Collection created successfully ✔️");
      let merkleTree = getMerkleTree().then((merkleTree) => {
        console.log("Merkle tree created successfully ✔️");
        let batch = batchNFT(collection, merkleTree).then((batch) => {
          console.log("Batch created successfully ✔️");
        });
      });
    });
  } else if (command.startsWith("mint")) {
    let address = keys[1];
    let transfer = transferNFT(address);
  } else if (command == "batch-mint") {
    let collection = createCollection().then((collection) => {
      console.log("Collection created successfully ✔️");
      let merkleTree = getMerkleTree().then((merkleTree) => {
        console.log("Merkle tree created successfully ✔️");
        let batch = batchNFTMint(collection, merkleTree).then((batch) => {
          console.log("Batch created successfully ✔️");
        });
      });
    });
  } else {
    console.log("Invalid command");
  }
}
