import bundlrClient from './bundlrClient.js';
import inquirer from "inquirer";

const askUpload = async (stats) => {

    let bundlrPrice = await bundlrClient.getPrice(stats.imagesize + stats.filesize) * stats.no;
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
