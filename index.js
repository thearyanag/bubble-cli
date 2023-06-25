#!/usr/bin/env node

import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";
import args from "args-parser";
import shell from "shelljs";
let res = args(process.argv);

// commands related to create module
import { askCreate } from "./lib/create/inquirer.js";
import { getFileContent } from "./lib/create/files.js";
import { getAssetStats } from "./lib/create/stats.js";
import { createConfig } from "./lib/create/createConfig.js";

// commands related to upload module
import { askUpload } from "./lib/upload/inquirer.js";
import { uploadImageToBundlr } from "./lib/upload/uploadImageToBundlr.js";

// commands related to deploy module
import { createCollection } from "./lib/deploy/createCollection.js";

if (Object.keys(res).length === 0) {
    clear();

    console.log(
        chalk.whiteBright(
            figlet.textSync("Bubble", { horizontalLayout: "full" })
        )
    )

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
    )
} else {
    let keys = Object.keys(res)
    let command = keys[0];
    if (command === "create") {

        let stats = getAssetStats();
        console.log()
        let answers = await askCreate(stats);
        let isConfigCreated = createConfig(answers, stats);
        console.log()

        if (isConfigCreated) {
            console.log("Config file created successfully ✔️ \nPlease proceed to upload your assets ");
        } else {
            console.log("Config file creation failed");
            shell.exit(1);
        }

    } else if (command === "upload") {

        let stats = getAssetStats();
        console.log(stats)
        let answers = await askUpload(stats);
        let imageResponse = await uploadImageToBundlr(stats.no,answers);
        console.log(answers)
        console.log("Uploading assets to Arweave...");
        console.log("upload");
    } else if (command === "deploy") {
        createCollection();
        console.log("deploy");
    } else {
        console.log("Invalid command");
    }

}
