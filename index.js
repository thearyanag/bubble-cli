#!/usr/bin/env node

import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";
import args from "args-parser";
let res = args(process.argv);

import askCreate from "./lib/inquirer.js";

import { getFileContent , getAssetStats } from "./lib/files.js";

clear();

if (Object.keys(res).length === 0) {
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
        getAssetStats();
        console.log("create");
    } else if (command === "upload") {
        console.log("upload");
    } else if (command === "deploy") {
        console.log("deploy");
    } else {
        console.log("Invalid command");
    }

}
