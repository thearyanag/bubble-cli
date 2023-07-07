const inquirer = require("inquirer");
const { PublicKey } = require("@solana/web3.js");

/**
 * A function to ask the user to create a new config file
 * @param {*} stats  The stats of the assets in { no:0 , imagesize: 0, filesize: 0, symbol: ' ' } format
 * @returns  The answers from the user
 */
const askCreate = async (stats) => {
    const questions = [
        {
            type: "confirm",
            name: "stat-confirm",
            message: `Found ${stats.no} assets with total size of ${stats.filesize + stats.imagesize} bytes. Is this correct?`,
            validate: async function (value) {
                var valid = value;
                if (valid) {
                    return true;
                } else {
                    return "Please make sure you have the correct stats";
                }
            }
        },
        {
            type: "confirm",
            name: "symbol",
            message: `Found symbol "${stats.symbol}". Is this correct?`,
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of your NFT? ( in SOL )",
            validate: async function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number";
            }
        },
        {
            type: "input",
            name: "sellerfee",
            message: "What is the seller fee basis points?",
            validate: async function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number";
            }
        },
        {
            type: "input",
            name: "creators",
            message: "Enter creators in the format address1:percentage1,address2:percentage2 (max 4 creators)",
            validate: async function (value) {
                var valid = value.split(",").length <= 4;
                var address = value.split(",").map((x) => x.split(":")[0]);
                let percentage = value.split(",").map((x) => x.split(":")[1]);
                var validAddress = address.every((x) => PublicKey.isOnCurve(x));
                var validPercentage = percentage.every((x) => !isNaN(parseFloat(x)));
                var totalPercentage = percentage.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                validPercentage = validPercentage && totalPercentage === 100;
                if (valid && validAddress) {
                    if (validPercentage) {
                        return true;
                    } else {
                        return "Please make sure the percentages add up to 100";
                    }
                }
            }
        },
        {
            type: "confirm",
            name: "is_nft_mutable",
            message: "Do you want your NFTs to remain mutable?",
        }
    ];

    const answers = await inquirer.prompt(questions);
    return answers;
}

module.exports = { askCreate };