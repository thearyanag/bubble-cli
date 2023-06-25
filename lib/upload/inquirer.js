import bundlrClient from './bundlrClient.js';
import inquirer from "inquirer";

const askUpload = async (stats) => {

    console.log(`Uploading ${stats.size} bytes to the Solana blockchain...`);

    stats.size = stats.size * 1000;

    let bundlrPrice = await bundlrClient.getPrice(stats.size);
    bundlrPrice = bundlrClient.utils.fromAtomic(bundlrPrice);
    const questions = [
        {
            type: "confirm",
            name: "price-confirm",
            message: `The price for this upload is ${bundlrPrice} SOL. Do you want to continue?`,
        }            
    ];

    return inquirer.prompt(questions);
}

export { askUpload };
